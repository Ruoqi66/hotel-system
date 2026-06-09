
window.addEventListener('load', function() {
    initBookingPage();
});

function initBookingPage() {
    loadRoomTypes();
    setupEventListeners();
    calculatePrice();
}

function loadRoomTypes() {
    const roomTypeSelect = document.querySelector('.booking-form select');
    if (!roomTypeSelect) return;

    roomTypeSelect.innerHTML = '';
    for (const key in ROOM_TYPES) {
        const room = ROOM_TYPES[key];
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name + ' - ¥' + room.price.toLocaleString() + '/night';
        option.dataset.price = room.price;
        roomTypeSelect.appendChild(option);
    }
}

function setupEventListeners() {
    const form = document.querySelector('.booking-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
        input.addEventListener('input', calculatePrice);
    });

    const submitBtn = form.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            submitBooking();
        });
    }

    const roomTypeSelect = form.querySelector('select');
    if (roomTypeSelect) {
        roomTypeSelect.addEventListener('change', calculatePrice);
    }
}

function calculatePrice() {
    const form = document.querySelector('.booking-form');
    if (!form) return;

    const dateInputs = form.querySelectorAll('input[type="date"]');
    const checkInDate = dateInputs[0] ? dateInputs[0].value : '';
    const checkOutDate = dateInputs[1] ? dateInputs[1].value : '';
    const roomTypeSelect = form.querySelector('select');
    const breakfastSelect = form.querySelectorAll('select')[1];

    if (!checkInDate || !checkOutDate || !roomTypeSelect) {
        updatePriceDisplay(0);
        return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
        updatePriceDisplay(0);
        return;
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
    const roomPrice = parseFloat(selectedOption.dataset.price || 0);
    const breakfastPrice = (breakfastSelect && breakfastSelect.value === '1') ? 50 : 0;

    const totalPrice = (roomPrice + breakfastPrice) * nights;
    updatePriceDisplay(totalPrice);
}

function updatePriceDisplay(price) {
    const priceDisplay = document.querySelector('.price-display span');
    if (priceDisplay) {
        priceDisplay.textContent = '¥ ' + price.toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
}

function submitBooking() {
    const form = document.querySelector('.booking-form');
    if (!form) return;

    const nameInput = form.querySelector('input[placeholder="Your Name"]');
    const phoneInput = form.querySelector('input[placeholder="Phone Number"]');
    const roomTypeSelect = form.querySelector('select');
    const dateInputs = form.querySelectorAll('input[type="date"]');
    const breakfastSelect = form.querySelectorAll('select')[1];

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const checkInDate = dateInputs[0] ? dateInputs[0].value : '';
    const checkOutDate = dateInputs[1] ? dateInputs[1].value : '';

    if (!name || !phone || !checkInDate || !checkOutDate) {
        alert('Please fill in all required fields!');
        return;
    }

    if (!/^[\d\s\-+]{7,15}$/.test(phone)) {
        alert('Please enter a valid phone number!');
        return;
    }

    const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
    const roomTypeId = parseInt(selectedOption.value);
    const roomTypeName = ROOM_TYPES[roomTypeId] ? ROOM_TYPES[roomTypeId].name : selectedOption.textContent.split(' - ')[0];

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
        alert('Check-out date must be after check-in date!');
        return;
    }

    const availableRooms = ROOM_ASSIGNMENTS[roomTypeId] || [];
    const bookings = getBookings();
    let assignedRoomNo = null;

    for (const roomNo of availableRooms) {
        const hasConflict = bookings.some(b =>
            b.status !== 'cancelled' &&
            b.roomNo === roomNo &&
            b.checkInDate < checkOutDate &&
            b.checkOutDate > checkInDate
        );
        if (!hasConflict) {
            assignedRoomNo = roomNo;
            break;
        }
    }

    if (!assignedRoomNo) {
        alert('Sorry, no available rooms for the selected dates!');
        return;
    }

    const roomPrice = ROOM_TYPES[roomTypeId].price;
    const breakfastIncluded = breakfastSelect ? breakfastSelect.value === '1' : false;
    const breakfastPrice = breakfastIncluded ? 50 : 0;
    const totalPrice = (roomPrice + breakfastPrice) * nights;

    const booking = {
        id: Date.now(),
        name: name,
        phone: phone,
        roomNo: assignedRoomNo,
        roomTypeId: roomTypeId,
        roomTypeName: roomTypeName,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        nights: nights,
        breakfastIncluded: breakfastIncluded,
        roomPrice: roomPrice,
        breakfastPrice: breakfastPrice,
        totalPrice: totalPrice,
        status: 'pending',
        bookingTime: new Date().toISOString(),
        paymentStatus: 'unpaid',
        source: 'customer'
    };

    bookings.push(booking);
    saveBookings(bookings);

    alert('Booking successful!\n\n' +
          'Booking No: ' + generateBookingNo(booking.id) + '\n' +
          'Room No: ' + assignedRoomNo + '\n' +
          'Room Type: ' + roomTypeName + '\n' +
          'Check-in: ' + checkInDate + '\n' +
          'Check-out: ' + checkOutDate + '\n' +
          'Total: ¥' + totalPrice.toLocaleString());

    form.reset();
    calculatePrice();
}
