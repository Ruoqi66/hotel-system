window.onload = function() {
            loadPendingPayments();
            loadPaymentHistory();
            loadPaymentMonths();
            document.getElementById('payDate').valueAsDate = new Date();
        };

        function loadPaymentMonths() {
            const salaries = JSON.parse(localStorage.getItem('salaries') || '[]');
            const months = [...new Set(salaries.map(s => s.month))];
            const select = document.getElementById('paymentMonth');

            months.sort().reverse().forEach(month => {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                select.appendChild(option);
            });
        }

        function loadPendingPayments() {
            const tbody = document.querySelector('#pendingPayments tbody');
            tbody.innerHTML = '';

            const salaries = JSON.parse(localStorage.getItem('salaries') || '[]');
            const pending = salaries.filter(s => s.status === 'Pending');

            pending.forEach((record) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.employeeName}</td>
                    <td>${record.month}</td>
                    <td style="font-weight:bold;">${record.netSalary.toFixed(2)}</td>
                    <td>-</td>
                    <td>-</td>
                    <td style="color:#ff9800;">Pending</td>
                    <td>
                        <button onclick="processSinglePayment('${record.employeeName}', '${record.month}')">Pay</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            if (pending.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No pending payments</td></tr>';
            }
        }

        function loadPaymentHistory() {
            const tbody = document.querySelector('#paymentHistory tbody');
            tbody.innerHTML = '';

            const salaries = JSON.parse(localStorage.getItem('salaries') || '[]');
            const paid = salaries.filter(s => s.status === 'Paid');

            paid.sort((a, b) => {
                const dateA = b.payDate || '';
                const dateB = a.payDate || '';
                return dateA.localeCompare(dateB);
            });

            paid.forEach(record => {
                const row = document.createElement('tr');
                const methodLabels = {
                    'bank_transfer': 'Bank Transfer',
                    'cash': 'Cash',
                    'check': 'Check'
                };

                 row.innerHTML = `                    <td>${record.employeeName}</td>
                    <td>${record.month}</td>
                    <td style="font-weight:bold;">${record.netSalary.toFixed(2)}</td>
                    <td>${methodLabels[record.payMethod] || '-'}</td>
                    <td>${record.payDate || '-'}</td>
                    <td style="color:#4CAF50;">Paid</td>
                `;
                tbody.appendChild(row);
            });
            if (paid.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No payment history</td></tr>';
            }
        }

        function processSinglePayment(employeeName, month) {
            const payDate = document.getElementById('payDate').value;
            const payMethod = document.getElementById('paymentMethod').value;

            if (!payDate) {
                alert('Please select payment date!');
                return;
            }

            let salaries = JSON.parse(localStorage.getItem('salaries') || '[]');
            const index = salaries.findIndex(s =>
                s.employeeName === employeeName && s.month === month
            );

            if (index !== -1) {
                salaries[index].status = 'Paid';
                salaries[index].payDate = payDate;
                salaries[index].payMethod = payMethod;

                localStorage.setItem('salaries', JSON.stringify(salaries));
                alert(`Salary paid to ${employeeName} successfully!`);

                loadPendingPayments();
                loadPaymentHistory();
            }
        }

        function processBatchPayment() {
            const month = document.getElementById('paymentMonth').value;
            const payDate = document.getElementById('payDate').value;
            const payMethod = document.getElementById('paymentMethod').value;

            if (!month || !payDate) {
                alert('Please select month and payment date!');
                return;
            }

            let salaries = JSON.parse(localStorage.getItem('salaries') || '[]');
            let count = 0;

            salaries.forEach(record => {
                if (record.month === month && record.status === 'Pending') {
                    record.status = 'Paid';
                    record.payDate = payDate;
                    record.payMethod = payMethod;
                    count++;
                }
            });

            localStorage.setItem('salaries', JSON.stringify(salaries));
            alert(`Successfully processed ${count} payments!`);

            loadPendingPayments();
            loadPaymentHistory();
        }