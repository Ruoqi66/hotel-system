
window.addEventListener('load', function () {
    setTimeout(initDataPage, 200);
});

function initDataPage() {
    updateStatsCards();
    loadReportTable();
}

function updateStatsCards() {
    const bookings = getBookings();
    const fees = getFees();
    const today = new Date();
    const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');

    const totalRooms = ALL_ROOMS.length;

    const occupiedRooms = bookings.filter(b => b.status === 'checked-in').length;

    const vacantRooms = totalRooms - occupiedRooms;

    const monthBookings = bookings.filter(b => {
        const checkInMonth = b.checkInDate ? b.checkInDate.substring(0, 7) : '';
        return checkInMonth === currentMonth && b.status !== 'cancelled';
    });
    const uniqueMonthDays = new Set(monthBookings.map(b => b.checkInDate));
    const monthOccupancyRate = totalRooms > 0 ? 
        Math.round((uniqueMonthDays.size / 30) * 100) : 0;

    const monthFees = fees.filter(f => {
        const feeMonth = f.createdAt ? f.createdAt.substring(0, 7) : '';
        return feeMonth === currentMonth && f.status === 'paid';
    });
    const monthRevenue = monthFees.reduce((sum, f) => sum + ((f.roomCharge || 0) + (f.additionalCharge || 0)), 0);

    const monthCheckedOut = bookings.filter(b => {
        const outMonth = b.checkOutDate ? b.checkOutDate.substring(0, 7) : '';
        return outMonth === currentMonth && b.status === 'checked-out';
    });
    const extraRevenue = monthCheckedOut.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const totalRevenue = monthRevenue + extraRevenue;

    const statCards = document.querySelectorAll('.stat-card p');
    if (statCards.length >= 4) {
        statCards[0].textContent = totalRooms;
        statCards[1].textContent = vacantRooms;
        statCards[2].textContent = monthOccupancyRate + '%';
        statCards[3].textContent = '¥' + totalRevenue.toLocaleString();
    }
}

function loadReportTable() {
    const tbody = document.getElementById('reportTable');
    if (!tbody) return;

    const bookings = getBookings();
    const fees = getFees();

    const monthlyData = {};

    bookings.forEach(b => {
        if (b.status === 'cancelled') return;
        const month = b.checkInDate ? b.checkInDate.substring(0, 7) : '';
        if (!month) return;
        if (!monthlyData[month]) {
            monthlyData[month] = { roomRevenue: 0, serviceRevenue: 0, totalDays: 0, bookingCount: 0 };
        }
        if (b.status === 'checked-out' || b.status === 'checked-in') {
            monthlyData[month].roomRevenue += (b.totalPrice || 0);
        }
        monthlyData[month].bookingCount++;
        monthlyData[month].totalDays += (b.nights || 1);
    });

    fees.forEach(f => {
        const month = f.createdAt ? f.createdAt.substring(0, 7) : '';
        if (!month || f.status !== 'paid') return;
        if (!monthlyData[month]) {
            monthlyData[month] = { roomRevenue: 0, serviceRevenue: 0, totalDays: 0, bookingCount: 0 };
        }
        monthlyData[month].serviceRevenue += (f.additionalCharge || 0);
    });

    const months = Object.keys(monthlyData).sort();

    tbody.innerHTML = '';

    if (months.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px;">No data available</td></tr>';
        return;
    }

    months.forEach(month => {
        const d = monthlyData[month];
        const totalRevenue = d.roomRevenue + d.serviceRevenue;
        const totalRooms = ALL_ROOMS.length;
        const occupancyRate = totalRooms > 0 ? 
            Math.round((d.totalDays / (30 * totalRooms)) * 100) : 0;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${month}</td>
            <td>¥${d.roomRevenue.toLocaleString()}</td>
            <td>¥${d.serviceRevenue.toLocaleString()}</td>
            <td>¥${totalRevenue.toLocaleString()}</td>
            <td>${occupancyRate}%</td>
        `;
        tbody.appendChild(tr);
    });
}
