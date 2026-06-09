
window.addEventListener('load', function () {
    setTimeout(initServicePage, 200);
});

function initServicePage() {
    setupServiceForm();
    loadServiceTable();
}

function setupServiceForm() {
    const submitBtn = document.querySelector('#room-service .btn-primary');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        submitService();
    });
}

function submitService() {
    const roomInput = document.querySelector('#room-service input[placeholder="e.g. 102"]');
    const typeSelect = document.querySelector('#room-service select');
    const notesInput = document.querySelector('#room-service input[placeholder="Fill in detailed requirements"]');

    const roomNo = roomInput ? roomInput.value.trim() : '';
    const serviceType = typeSelect ? typeSelect.value : '';
    const notes = notesInput ? notesInput.value.trim() : '';

    if (!roomNo) {
        alert('Please enter a room number!');
        return;
    }

    const service = {
        id: Date.now(),
        roomNo: roomNo,
        serviceType: serviceType,
        notes: notes,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    const services = getServices();
    services.push(service);
    saveServices(services);

    alert('Service request submitted! Room: ' + roomNo);
    if (roomInput) roomInput.value = '';
    if (notesInput) notesInput.value = '';

    loadServiceTable();
}

function loadServiceTable() {
    const tbody = document.getElementById('serviceTable');
    if (!tbody) return;

    const services = getServices();
    services.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = '';

    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;padding:20px;">No service records</td></tr>';
        return;
    }

    const statusMap = { 'pending': 'Pending', 'processing': 'Processing', 'completed': 'Completed' };

    services.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.roomNo}</td>
            <td>${s.serviceType}</td>
            <td>${new Date(s.createdAt).toLocaleString('zh-CN')}</td>
            <td>
                <select onchange="updateServiceStatus(${s.id}, this.value)" style="width:auto;">
                    <option value="pending" ${s.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${s.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="completed" ${s.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateServiceStatus(serviceId, newStatus) {
    const services = getServices();
    const s = services.find(x => x.id === serviceId);
    if (s) {
        s.status = newStatus;
        if (newStatus === 'completed') s.completedAt = new Date().toISOString();
        saveServices(services);
    }
}
