
window.addEventListener('load', function () {
    setTimeout(initInforManagePage, 200);
});

function initInforManagePage() {
    loadCustomerTable();
    loadFeedbackTable();
}

function loadCustomerTable() {
    const tbody = document.getElementById('customerTable');
    if (!tbody) return;

    const bookings = getBookings();
    const customerMap = {};

    bookings.forEach(b => {
        if (!customerMap[b.phone]) {
            customerMap[b.phone] = {
                name: b.name,
                phone: b.phone,
                checkInTimes: 0,
                lastVisit: '',
                roomTypes: [],
                totalSpent: 0
            };
        }
        customerMap[b.phone].checkInTimes++;
        if (b.checkInDate > customerMap[b.phone].lastVisit) {
            customerMap[b.phone].lastVisit = b.checkInDate;
        }
        if (b.roomTypeName && !customerMap[b.phone].roomTypes.includes(b.roomTypeName)) {
            customerMap[b.phone].roomTypes.push(b.roomTypeName);
        }
        if (b.status === 'checked-out') {
            customerMap[b.phone].totalSpent += (b.totalPrice || 0);
        }
    });

    const customers = Object.values(customerMap);
    customers.sort((a, b) => b.checkInTimes - a.checkInTimes);

    tbody.innerHTML = '';

    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px;">No customer records</td></tr>';
        return;
    }

    customers.forEach(c => {
        let membership = 'Regular';
        if (c.checkInTimes >= 10) membership = 'Diamond';
        else if (c.checkInTimes >= 5) membership = 'Gold';
        else if (c.checkInTimes >= 3) membership = 'Silver';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.phone}</td>
            <td>${membership}</td>
            <td>${c.checkInTimes}</td>
            <td>${c.roomTypes.slice(0, 3).join(', ') || 'No records'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function loadFeedbackTable() {
    const tbody = document.getElementById('feedbackTable');
    if (!tbody) return;

    const feedbacks = getFeedbacks();
    feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = '';

    if (feedbacks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#999;padding:20px;">No feedback records</td></tr>';
        return;
    }

    feedbacks.forEach(f => {
        const tr = document.createElement('tr');
        const statusBadge = f.status === 'unread' ? 
            '<span style="color:#e74c3c;">● Unread</span>' : 
            '<span style="color:#2ecc71;">● Read</span>';

        tr.innerHTML = `
            <td>${f.name}</td>
            <td>
                <strong>${f.type}</strong><br>
                <small>${f.details}</small><br>
                ${statusBadge}
                ${f.status === 'unread' ? '<button class="btn-primary btn-sm" onclick="markFeedbackRead(' + f.id + ')" style="margin-top:5px;">Mark Read</button>' : ''}
            </td>
            <td>
                <select onchange="updateFeedbackSatisfaction(${f.id}, this.value)" style="width:auto;">
                    <option value="">--Rate--</option>
                    <option value="Very Satisfied" ${f.satisfaction === 'Very Satisfied' ? 'selected' : ''}>Very Satisfied</option>
                    <option value="Satisfied" ${f.satisfaction === 'Satisfied' ? 'selected' : ''}>Satisfied</option>
                    <option value="Neutral" ${f.satisfaction === 'Neutral' ? 'selected' : ''}>Neutral</option>
                    <option value="Dissatisfied" ${f.satisfaction === 'Dissatisfied' ? 'selected' : ''}>Dissatisfied</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function markFeedbackRead(feedbackId) {
    const feedbacks = getFeedbacks();
    const f = feedbacks.find(x => x.id === feedbackId);
    if (f) {
        f.status = 'read';
        saveFeedbacks(feedbacks);
        loadFeedbackTable();
    }
}

function updateFeedbackSatisfaction(feedbackId, satisfaction) {
    if (!satisfaction) return;
    const feedbacks = getFeedbacks();
    const f = feedbacks.find(x => x.id === feedbackId);
    if (f) {
        f.satisfaction = satisfaction;
        saveFeedbacks(feedbacks);
    }
}
