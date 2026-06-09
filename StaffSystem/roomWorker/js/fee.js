
window.addEventListener('load', function () {
    setTimeout(initFeePage, 200);
});

function initFeePage() {
    setupFeeForm();
    loadFeeTable();
}

function setupFeeForm() {
    const submitBtn = document.querySelector('#fee-settle .btn-primary');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        settleFee();
    });
}

function settleFee() {
    const roomInput = document.querySelector('#fee-settle input[placeholder="Enter room number"]');
    const extraInput = document.querySelector('#fee-settle input[type="number"]');
    const paymentSelect = document.querySelector('#fee-settle select');

    const roomNo = roomInput ? roomInput.value.trim() : '';
    const extraCharge = extraInput ? parseFloat(extraInput.value) || 0 : 0;
    const paymentMethod = paymentSelect ? paymentSelect.value : 'Cash Payment';

    if (!roomNo) {
        alert('Please enter a room number!');
        return;
    }

    const fees = getFees();
    const existingFee = fees.find(f => f.roomNo === roomNo && f.status === 'unpaid');

    if (existingFee) {
        existingFee.additionalCharge = extraCharge;
        existingFee.totalAmount = (existingFee.roomCharge || 0) + extraCharge - (existingFee.deposit || 0);
        existingFee.paymentMethod = paymentMethod;
        existingFee.status = 'paid';
        existingFee.paidAt = new Date().toISOString();
        saveFees(fees);
        alert('Settlement successful!\nRoom: ' + roomNo +
              '\nRoom Charge: ¥' + (existingFee.roomCharge || 0).toLocaleString() +
              '\nAdditional: ¥' + extraCharge.toLocaleString() +
              '\nPaid: ¥' + existingFee.totalAmount.toLocaleString() +
              '\nMethod: ' + paymentMethod);
    } else {
        const feeRecord = {
            id: Date.now(),
            billNo: 'FD' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Math.floor(Math.random() * 100)).padStart(2, '0'),
            roomNo: roomNo,
            guestName: 'Manual Settlement',
            roomCharge: 0,
            additionalCharge: extraCharge,
            deposit: 0,
            totalAmount: extraCharge,
            paymentMethod: paymentMethod,
            status: 'paid',
            createdAt: new Date().toISOString(),
            paidAt: new Date().toISOString()
        };
        fees.push(feeRecord);
        saveFees(fees);
        alert('Manual settlement successful! Room: ' + roomNo +
              '\nAmount: ¥' + extraCharge.toLocaleString() +
              '\nMethod: ' + paymentMethod);
    }

    if (roomInput) roomInput.value = '';
    if (extraInput) extraInput.value = '0';
    loadFeeTable();
}

function loadFeeTable() {
    const tbody = document.getElementById('feeTable');
    if (!tbody) return;

    const fees = getFees();
    fees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = '';

    if (fees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px;">No settlement records</td></tr>';
        return;
    }

    fees.forEach(f => {
        const tr = document.createElement('tr');
        const statusText = f.status === 'paid' ? 'Paid' : 'Unpaid';
        tr.innerHTML = `
            <td>${f.billNo || 'N/A'}</td>
            <td>${f.roomNo}</td>
            <td>¥${((f.roomCharge || 0) + (f.additionalCharge || 0)).toLocaleString()}</td>
            <td>${f.paymentMethod || 'N/A'}</td>
            <td>${statusText}</td>
        `;
        tbody.appendChild(tr);
    });
}
