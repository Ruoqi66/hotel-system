
window.addEventListener('load', function () {
    setTimeout(initBookingPage, 200);
});

function initBookingPage() {
    loadRoomTypeOptions();
    setupBookingForm();
    loadBookingTable();
}

function loadRoomTypeOptions() {
    const select = document.getElementById('roomType');
    if (!select) return;
    select.innerHTML = '';
    for (const key in ROOM_TYPES) {
        const room = ROOM_TYPES[key];
        const option = document.createElement('option');
        option.value = room.name;
        option.textContent = room.name + ' (¥' + room.price.toLocaleString() + '/night)';
        option.dataset.price = room.price;
        option.dataset.typeId = room.id;
        select.appendChild(option);
    }
}

function setupBookingForm() {
    const submitBtn = document.querySelector('#booking .btn-primary');
    if (!submitBtn) return;

    submitBtn.removeAttribute('onclick');
    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        staffBookRoom();
    });
}

function staffBookRoom() {
    const guestName = document.getElementById('guestName');
    const guestPhone = document.getElementById('guestPhone');
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    const roomTypeSelect = document.getElementById('roomType');
    const guestCount = document.getElementById('guestCount');
    const breakfastSelect = document.querySelector('#booking select:last-of-type');

    const name = guestName ? guestName.value.trim() : '';
    const phone = guestPhone ? guestPhone.value.trim() : '';
    const checkIn = checkInDate ? checkInDate.value : '';
    const checkOut = checkOutDate ? checkOutDate.value : '';

    if (!name || !phone || !checkIn || !checkOut) {
        alert('Please fill in all required fields!');
        return;
    }

    if (!/^[\d\s\-+]{7,15}$/.test(phone)) {
        alert('Please enter a valid phone number!');
        return;
    }

    const checkInObj = new Date(checkIn);
    const checkOutObj = new Date(checkOut);
    const nights = Math.ceil((checkOutObj - checkInObj) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
        alert('Check-out date must be after check-in date!');
        return;
    }

    const roomTypeName = roomTypeSelect ? roomTypeSelect.value : '';
    const roomTypeId = ROOM_TYPE_NAME_TO_ID[roomTypeName] || 1;
    const roomPrice = ROOM_TYPES[roomTypeId] ? ROOM_TYPES[roomTypeId].price : 0;
    const breakfastIncluded = breakfastSelect ? breakfastSelect.value === '1' : false;
    const breakfastPrice = breakfastIncluded ? 50 : 0;
    const totalPrice = (roomPrice + breakfastPrice) * nights;

    const availableRooms = ROOM_ASSIGNMENTS[roomTypeId] || [];
    const bookings = getBookings();
    let assignedRoomNo = null;

    for (const roomNo of availableRooms) {
        const hasConflict = bookings.some(b =>
            b.status !== 'cancelled' &&
            b.roomNo === roomNo &&
            b.checkInDate < checkOut &&
            b.checkOutDate > checkIn
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

    const booking = {
        id: Date.now(),
        name: name,
        phone: phone,
        roomNo: assignedRoomNo,
        roomTypeId: roomTypeId,
        roomTypeName: roomTypeName,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights: nights,
        breakfastIncluded: breakfastIncluded,
        roomPrice: roomPrice,
        breakfastPrice: breakfastPrice,
        totalPrice: totalPrice,
        guestCount: guestCount ? parseInt(guestCount.value) || 1 : 1,
        status: 'confirmed',
        bookingTime: new Date().toISOString(),
        paymentStatus: 'unpaid',
        source: 'staff'
    };

    bookings.push(booking);
    saveBookings(bookings);

    updateCustomerInfo(booking);

    alert('Booking successful!\nBooking No: ' + generateBookingNo(booking.id) +
          '\nRoom No: ' + assignedRoomNo +
          '\nGuest: ' + name +
          '\nTotal: ¥' + totalPrice.toLocaleString());

    if (guestName) guestName.value = '';
    if (guestPhone) guestPhone.value = '';
    if (checkInDate) checkInDate.value = '';
    if (checkOutDate) checkOutDate.value = '';

    loadBookingTable();
    
    localStorage.setItem('bookingUpdated', Date.now().toString());
}

function loadBookingTable() {
    const tbody = document.getElementById('bookingTable');
    if (!tbody) return;

    const bookings = getBookings();
    bookings.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));

    tbody.innerHTML = '';

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999;padding:20px;">No booking records</td></tr>';
        return;
    }

    bookings.forEach(b => {
        const tr = document.createElement('tr');
        const bookingNo = generateBookingNo(b.id);
        const statusText = getStatusText(b.status);
        const breakfastText = b.breakfastIncluded ? 'incl. breakfast' : 'no breakfast';

        tr.innerHTML = `
            <td>${bookingNo}</td>
            <td>${b.name}</td>
            <td>${b.roomTypeName}</td>
            <td>${b.checkInDate}</td>
            <td>${b.checkOutDate}</td>
            <td>${breakfastText}</td>
            <td>${statusText}</td>
            <td class="action-btns">
                ${b.status === 'pending' ? '<button class="btn btn-success btn-sm" onclick="confirmBooking(' + b.id + ')">Confirm</button>' : ''}
                ${b.status === 'confirmed' ? '<button class="btn btn-primary btn-sm" onclick="checkInBooking(' + b.id + ')">Check In</button>' : ''}
                ${b.status === 'pending' || b.status === 'confirmed' ? '<button class="btn btn-danger btn-sm" onclick="cancelStaffBooking(' + b.id + ')">Cancel</button>' : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function confirmBooking(bookingId) {
    if (!confirm('Confirm this booking?')) return;
    const bookings = getBookings();
    const b = bookings.find(x => x.id === bookingId);
    if (b) { b.status = 'confirmed'; saveBookings(bookings); loadBookingTable(); }
}

function checkInBooking(bookingId) {
    if (!confirm('Confirm check-in?')) return;
    const bookings = getBookings();
    const b = bookings.find(x => x.id === bookingId);
    if (b) {
        b.status = 'checked-in';
        b.checkInTime = new Date().toISOString();
        saveBookings(bookings);
        updateCustomerInfo(b);
        loadBookingTable();
        alert('Check-in successful! Room: ' + b.roomNo);
        location.reload();
    }
}

function cancelStaffBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    const bookings = getBookings();
    const b = bookings.find(x => x.id === bookingId);
    if (b) { b.status = 'cancelled'; saveBookings(bookings); loadBookingTable(); }
}
