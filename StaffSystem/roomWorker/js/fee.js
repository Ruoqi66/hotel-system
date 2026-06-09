
window.addEventListener('load', function () {
    setTimeout(initFeePage, 200);
});

function initFeePage() {
    setupFeeForm();
    loadFeeTable();
}

function setupFeeForm() {
    const card = document.querySelector('#fee-settle .card');
    if (!card) {
        console.log('Error: Card element not found');
        return;
    }
    
    const buttons = card.querySelectorAll('.btn-primary');
    if (buttons.length === 0) {
        console.log('Error: No Settle Bill button found');
        return;
    }
    
    const submitBtn = buttons[0];
    console.log('Found Settle Bill button, adding click listener');
    
    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Settle Bill button clicked');
        settleFee();
    });
}

function settleFee() {
    const formGroups = document.querySelectorAll('#fee-settle .card .form-group');
    
    if (formGroups.length < 3) {
        alert('Error: Form elements not found!');
        return;
    }

    const roomInput = formGroups[0].querySelector('input');
    const extraInput = formGroups[1].querySelector('input');
    const paymentSelect = formGroups[2].querySelector('select');

    if (!roomInput || !extraInput || !paymentSelect) {
        alert('Error: Cannot find form elements!');
        return;
    }

    const roomNo = roomInput.value.trim();
    const extraCharge = parseFloat(extraInput.value) || 0;
    const paymentMethod = paymentSelect.value;

    if (!roomNo) {
        alert('Please enter a room number!');
        return;
    }

    const fees = getFees();
    const existingFee = fees.find(f => f.roomNo === roomNo && f.status === 'unpaid');

    let roomCharge = 0;
    let deposit = 0;
    let totalAmount = 0;

    if (existingFee) {
        roomCharge = existingFee.roomCharge || 0;
        deposit = existingFee.deposit || 0;
        totalAmount = roomCharge + extraCharge - deposit;
    } else {
        totalAmount = extraCharge;
    }

    if (totalAmount < 0) {
        totalAmount = 0;
    }

    const confirmMessage = `Please confirm settlement details:

Room Number: ${roomNo}
Room Charge: ¥${roomCharge.toLocaleString()}
Additional Expenses: ¥${extraCharge.toLocaleString()}
Deposit: -¥${deposit.toLocaleString()}
━━━━━━━━━━━━━━━━━
Total Amount: ¥${totalAmount.toLocaleString()}

Payment Method: ${paymentMethod}

Do you confirm this settlement?`;

    if (!confirm(confirmMessage)) {
        return;
    }

    if (existingFee) {
        existingFee.additionalCharge = extraCharge;
        existingFee.totalAmount = totalAmount;
        existingFee.paymentMethod = paymentMethod;
        existingFee.status = 'paid';
        existingFee.paidAt = new Date().toISOString();
        saveFees(fees);
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
    }

    alert(`Payment Successful!

Room Number: ${roomNo}
Total Paid: ¥${totalAmount.toLocaleString()}
Payment Method: ${paymentMethod}

Thank you for your payment!`);

    roomInput.value = '';
    extraInput.value = '0';
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
