
function getBookings() {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
}

function saveBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function getFees() {
    return JSON.parse(localStorage.getItem('fees') || '[]');
}

function saveFees(fees) {
    localStorage.setItem('fees', JSON.stringify(fees));
}

function generateBookingNo(id) {
    return 'BK' + String(id).slice(-6);
}

function updateCustomerInfo(booking) {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const existing = customers.find(c => c.phone === booking.phone);
    if (existing) {
        existing.checkInTimes = (existing.checkInTimes || 0) + 1;
        existing.lastVisit = booking.checkInDate;
        if (!existing.roomTypes.includes(booking.roomTypeName)) {
            existing.roomTypes.push(booking.roomTypeName);
        }
    } else {
        customers.push({
            id: Date.now(),
            name: booking.name,
            phone: booking.phone,
            membership: 'Regular Member',
            checkInTimes: 1,
            lastVisit: booking.checkInDate,
            roomTypes: [booking.roomTypeName],
            preferences: ''
        });
    }
    localStorage.setItem('customers', JSON.stringify(customers));
}

window.addEventListener('load', function () {
    console.log('Check-in-out page loaded');
    console.log('getBookings function exists:', typeof getBookings === 'function');
    console.log('localStorage bookings:', localStorage.getItem('bookings'));
    setTimeout(initCheckInOutPage, 200);
});

let previousBookingsHash = '';

function initCheckInOutPage() {
    loadPendingCheckIns();
    loadCurrentGuests();
    setupCheckInOutEvents();
    startBookingMonitor();
}

function startBookingMonitor() {
    console.log('Booking monitor started');
    setInterval(function() {
        try {
            const currentBookings = localStorage.getItem('bookings');
            if (!currentBookings) {
                console.log('No bookings in localStorage');
                return;
            }
            
            const currentHash = currentBookings.length + '-' + currentBookings.substring(0, 100);
            if (currentHash !== previousBookingsHash) {
                console.log('Bookings data changed!');
                previousBookingsHash = currentHash;
                
                const bookings = JSON.parse(currentBookings);
                console.log('Total bookings:', bookings.length);
                console.log('Statuses:', bookings.map(b => b.status));
                
                loadPendingCheckIns();
                loadCurrentGuests();
            }
        } catch(e) {
            console.error('Error monitoring bookings:', e);
        }
    }, 2000);
}

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log('Page visible, reloading data...');
        loadPendingCheckIns();
        loadCurrentGuests();
    }
});

window.addEventListener('focus', function() {
    console.log('Page focused, reloading data...');
    loadPendingCheckIns();
    loadCurrentGuests();
});

function loadPendingCheckIns() {
    const select = document.querySelector('#check-in-out select');
    console.log('Select element found:', !!select);
    console.log('All select elements:', document.querySelectorAll('select'));
    
    if (!select) {
        console.log('Select element not found');
        return;
    }

    const bookings = getBookings();
    console.log('Total bookings in localStorage:', bookings.length);
    
    if (bookings.length === 0) {
        console.log('No bookings found - checking localStorage directly:', localStorage.getItem('bookings'));
    } else {
        console.log('Booking statuses found:', bookings.map(b => b.status));
    }
    
    const pending = bookings.filter(b => b.status && b.status.toLowerCase() === 'confirmed');
    console.log('Pending (confirmed) bookings:', pending.length);
    console.log('Pending bookings data:', pending);

    select.innerHTML = '<option value="">--Select pending check-in order--</option>';
    pending.forEach(b => {
        const option = document.createElement('option');
        option.value = b.id;
        option.textContent = generateBookingNo(b.id) + ' | ' + b.name + ' | ' + b.roomTypeName + ' | Check-in: ' + b.checkInDate;
        select.appendChild(option);
        console.log('Added option:', option.textContent);
    });
}

function setupCheckInOutEvents() {
    const checkinBtn = document.querySelector('#check-in-out .btn-success');
    if (checkinBtn) {
        checkinBtn.addEventListener('click', function (e) {
            e.preventDefault();
            processCheckIn();
        });
    }
}

function processCheckIn() {
    const select = document.querySelector('#check-in-out select');
    const idInput = document.querySelector('#check-in-out input[placeholder="Identity Verification"]');
    const depositInput = document.querySelector('#check-in-out input[type="number"]');

    if (!select || !select.value) {
        alert('Please select a pending check-in order first!');
        return;
    }

    const bookingId = parseInt(select.value);
    const bookings = getBookings();
    const b = bookings.find(x => x.id === bookingId);

    if (!b) {
        alert('Booking not found!');
        return;
    }

    b.status = 'checked-in';
    b.checkInTime = new Date().toISOString();
    b.idNumber = idInput ? idInput.value.trim() : '';
    b.deposit = depositInput ? parseFloat(depositInput.value) || 300 : 300;
    saveBookings(bookings);
    updateCustomerInfo(b);

    alert('Check-in successful! Room: ' + b.roomNo +
          '\nDeposit: ¥' + b.deposit);

    loadPendingCheckIns();
    loadCurrentGuests();
}

function loadCurrentGuests() {
    const tbody = document.getElementById('currentGuestsTable');
    if (!tbody) return;

    const bookings = getBookings();
    const currentGuests = bookings.filter(b => b.status && b.status.toLowerCase() === 'checked-in');

    tbody.innerHTML = '';

    if (currentGuests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px;">No current guests</td></tr>';
        return;
    }

    currentGuests.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${b.roomNo}</td>
            <td>${b.name}</td>
            <td>${b.checkInDate}</td>
            <td>${b.checkOutDate}</td>
            <td>¥${(b.deposit || 300).toLocaleString()}</td>
            <td>
                <button class="btn-danger btn-sm" onclick="processCheckOut(${b.id})">Check Out</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function processCheckOut(bookingId) {
    if (!confirm('Confirm check-out? A fee record will be generated.')) return;

    const bookings = getBookings();
    const b = bookings.find(x => x.id === bookingId);

    if (!b) {
        alert('Booking not found!');
        return;
    }

    b.status = 'checked-out';
    b.checkOutTime = new Date().toISOString();
    saveBookings(bookings);

    const fees = getFees();
    const feeRecord = {
        id: Date.now(),
        billNo: 'FD' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Math.floor(Math.random() * 100)).padStart(2, '0'),
        bookingId: b.id,
        roomNo: b.roomNo,
        guestName: b.name,
        roomCharge: b.totalPrice || 0,
        additionalCharge: 0,
        deposit: b.deposit || 300,
        totalAmount: (b.totalPrice || 0) - (b.deposit || 300),
        paymentMethod: 'Unpaid',
        status: 'unpaid',
        createdAt: new Date().toISOString()
    };
    fees.push(feeRecord);
    saveFees(fees);

    alert('Check-out successful!\nRoom: ' + b.roomNo +
          '\nRoom Charge: ¥' + (b.totalPrice || 0).toLocaleString() +
          '\nDeposit: ¥' + (b.deposit || 300).toLocaleString() +
          '\nBalance Due: ¥' + feeRecord.totalAmount.toLocaleString());

    loadCurrentGuests();
}
