
window.addEventListener('load', function () {
    setTimeout(initCheckInOutPage, 200);
});

function initCheckInOutPage() {
    loadPendingCheckIns();
    loadCurrentGuests();
    setupCheckInOutEvents();
}

function loadPendingCheckIns() {
    const select = document.querySelector('#check-in-out select');
    if (!select) return;

    const bookings = getBookings();
    const pending = bookings.filter(b => b.status === 'confirmed');

    select.innerHTML = '<option value="">--Select pending check-in order--</option>';
    pending.forEach(b => {
        const option = document.createElement('option');
        option.value = b.id;
        option.textContent = generateBookingNo(b.id) + ' | ' + b.name + ' | ' + b.roomTypeName + ' | Check-in: ' + b.checkInDate;
        select.appendChild(option);
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
    const currentGuests = bookings.filter(b => b.status === 'checked-in');

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
