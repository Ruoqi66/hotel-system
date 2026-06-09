
window.addEventListener('load', function () {
    setTimeout(initRoomStatusPage, 200);
});

function initRoomStatusPage() {
    loadRoomStatusTable();
}

function loadRoomStatusTable() {
    const tbody = document.getElementById('roomStatusTable');
    if (!tbody) return;

    const bookings = getBookings();
    const today = new Date().toISOString().split('T')[0];

    tbody.innerHTML = '';

    ALL_ROOMS.forEach(room => {
        const relatedBookings = bookings.filter(b =>
            b.status !== 'cancelled' &&
            b.roomNo === room.roomNo
        );

        let status = 'vacant';
        let statusDisplay = 'Vacant';
        let statusClass = 'status-free';

        if (relatedBookings.length > 0) {
            const checkedIn = relatedBookings.find(b => b.status === 'checked-in');
            if (checkedIn) {
                status = 'occupied';
                statusDisplay = 'Occupied';
                statusClass = 'status-occupied';
            } else {
                const confirmed = relatedBookings.find(b =>
                    b.status === 'confirmed' || b.status === 'pending'
                );
                if (confirmed) {
                    status = 'booked';
                    statusDisplay = 'Booked';
                    statusClass = 'status-booked';
                } else {
                    status = 'cleaning';
                    statusDisplay = 'Completed';
                    statusClass = 'status-free';
                }
            }
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${room.roomNo}</td>
            <td>${room.roomTypeName}</td>
            <td>¥${room.price.toLocaleString()}</td>
            <td class="${statusClass}">${statusDisplay}</td>
            <td>
                <button class="btn-primary btn-sm" onclick="editRoomStatus('${room.roomNo}')">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editRoomStatus(roomNo) {
    const newStatus = prompt('Set room ' + roomNo + ' status:\n1-Vacant  2-Cleaning  3-Maintenance\n(Booking status is auto-managed by the system)');
    if (!newStatus) return;

    const statusMap = { '1': 'vacant', '2': 'cleaning', '3': 'maintenance' };
    const status = statusMap[newStatus] || 'vacant';

    const manualStatuses = JSON.parse(localStorage.getItem('roomManualStatus') || '{}');
    manualStatuses[roomNo] = status;
    localStorage.setItem('roomManualStatus', JSON.stringify(manualStatuses));

    loadRoomStatusTable();
}
