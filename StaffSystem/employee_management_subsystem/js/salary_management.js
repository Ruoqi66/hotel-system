window.onload = function() {
            loadEmployees();
            loadSalaryRecords();

            const now = new Date();
            const month = now.toISOString().slice(0, 7);
            document.getElementById('salaryMonth').value = month;
        };

        function loadEmployees() {
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');
            const select = document.getElementById('salaryEmployee');

            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = emp.name + ' - ' + emp.department;
                select.appendChild(option);
            });
        }

        function calculateSalary() {
            const employeeName = document.getElementById('salaryEmployee').value;

            if (!employeeName) {
                alert('Please select an employee!');
                return;
            }

            const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
            const bonus = parseFloat(document.getElementById('bonus').value) || 0;
            const allowance = parseFloat(document.getElementById('allowance').value) || 0;

            const overtimePay = calculateOvertimePay(employeeName);
            const deduction = calculateDeduction(employeeName);

            document.getElementById('overtimePay').value = overtimePay.toFixed(2);
            document.getElementById('deduction').value = deduction.toFixed(2);

            const grossSalary = baseSalary + bonus + allowance + overtimePay;
            const tax = calculateTax(grossSalary);
            document.getElementById('tax').value = tax.toFixed(2);

            const netSalary = grossSalary - deduction - tax;

            document.getElementById('summaryBase').textContent = baseSalary.toFixed(2);
            document.getElementById('summaryBonus').textContent = bonus.toFixed(2);
            document.getElementById('summaryAllowance').textContent = allowance.toFixed(2);
            document.getElementById('summaryOvertime').textContent = overtimePay.toFixed(2);
            document.getElementById('summaryDeduction').textContent = '-' + deduction.toFixed(2);
            document.getElementById('summaryTax').textContent = '-' + tax.toFixed(2);
            document.getElementById('summaryNet').textContent = netSalary.toFixed(2);

            document.getElementById('salarySummary').style.display = 'block';
        }

        function calculateOvertimePay(employeeName) {
            const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
            const month = document.getElementById('salaryMonth').value;

            if (!month) return 0;

            let overtimeHours = 0;

            attendance.forEach(record => {
                if (record.employeeName === employeeName &&
                    record.date.startsWith(month) &&
                    record.status === 'Overtime') {

                    const notes = record.notes || '';
                    const hoursMatch = notes.match(/(\d+(\.\d+)?)\s*hours/);
                    if (hoursMatch) {
                        overtimeHours += parseFloat(hoursMatch[1]);
                    } else {
                        overtimeHours += 8;
                    }
                }
            });

            const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
            const hourlyRate = baseSalary / 160;

            return overtimeHours * hourlyRate * 1.5;
        }

        function calculateDeduction(employeeName) {
            const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
            const month = document.getElementById('salaryMonth').value;

            if (!month) return 0;

            let lateCount = 0;
            let earlyCount = 0;
            let absentCount = 0;

            attendance.forEach(record => {
                if (record.employeeName === employeeName && record.date.startsWith(month)) {
                    if (record.status.includes('Late')) lateCount++;
                    if (record.status.includes('Early')) earlyCount++;
                    if (record.status === 'Absent') absentCount++;
                }
            });

            const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
            const dailyRate = baseSalary / 22;

            const lateDeduction = lateCount * 50;
            const earlyDeduction = earlyCount * 50;
            const absentDeduction = absentCount * dailyRate;

            return lateDeduction + earlyDeduction + absentDeduction;
        }

        function calculateTax(grossSalary) {
            if (grossSalary <= 5000) return 0;
            if (grossSalary <= 8000) return (grossSalary - 5000) * 0.03;
            if (grossSalary <= 17000) return (grossSalary - 8000) * 0.1 + 90;
            if (grossSalary <= 30000) return (grossSalary - 17000) * 0.2 + 990;
            return (grossSalary - 30000) * 0.25 + 3590;
        }

        function saveSalary() {
            const employeeName = document.getElementById('salaryEmployee').value;
            const month = document.getElementById('salaryMonth').value;

            if (!employeeName || !month) {
                alert('Please select employee and month!');
                return;
            }

            const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
            const bonus = parseFloat(document.getElementById('bonus').value) || 0;
            const allowance = parseFloat(document.getElementById('allowance').value) || 0;
            const overtimePay = parseFloat(document.getElementById('overtimePay').value) || 0;
            const deduction = parseFloat(document.getElementById('deduction').value) || 0;
            const tax = parseFloat(document.getElementById('tax').value) || 0;

            if (baseSalary === 0) {
                alert('Please calculate salary first!');
                return;
            }

            const grossSalary = baseSalary + bonus + allowance + overtimePay;
            const netSalary = grossSalary - deduction - tax;

            let salaries = JSON.parse(localStorage.getItem('salaries') || '[]');

            const existingIndex = salaries.findIndex(s =>
                s.employeeName === employeeName && s.month === month
            );

             const salaryRecord = {
                employeeName: employeeName,
                month: month,
                baseSalary: baseSalary,
                bonus: bonus,
                allowance: allowance,
                overtimePay: overtimePay,
                deduction: deduction,
                tax: tax,
                grossSalary: grossSalary,
                netSalary: netSalary,
                status: 'Pending'
            };


            if (existingIndex !== -1) {
                salaries[existingIndex] = salaryRecord;
            } else {
                salaries.push(salaryRecord);
            }

            localStorage.setItem('salaries', JSON.stringify(salaries));
            alert('Salary record saved successfully!');
            loadSalaryRecords();
        }

        function loadSalaryRecords() {
            const container = document.getElementById('salaryRecordsContainer');
            container.innerHTML = '';

            const salaries = JSON.parse(localStorage.getItem('salaries') || '[]');

            salaries.sort((a, b) => b.month.localeCompare(a.month));

            if (salaries.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 30px; color: #666; font-size: 16px;">No salary records found</div>';
                return;
            }

             salaries.forEach(record => {
                const card = document.createElement('div');
                card.style.cssText = `                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                `;

                card.innerHTML = `                    <div><strong style="color: #3e6e9e;">Employee:</strong><br>${record.employeeName}</div>
                    <div><strong style="color: #3e6e9e;">Month:</strong><br>${record.month}</div>
                    <div><strong style="color: #3e6e9e;">Base Salary:</strong><br>${record.baseSalary.toFixed(2)}</div>
                    <div><strong style="color: #3e6e9e;">Bonus:</strong><br>${record.bonus.toFixed(2)}</div>
                    <div><strong style="color: #3e6e9e;">Allowance:</strong><br>${record.allowance.toFixed(2)}</div>
                    <div><strong style="color: #3e6e9e;">Overtime:</strong><br>${record.overtimePay.toFixed(2)}</div>
                    <div><strong style="color: #3e6e9e;">Deduction:</strong><br>${record.deduction.toFixed(2)}</div>
                    <div><strong style="color: #3e6e9e;">Tax:</strong><br>${record.tax.toFixed(2)}</div>
                    <div><strong style="color: #3e6e9e;">Net Salary:</strong><br><span style="font-weight: bold; color: #4CAF50; font-size: 18px;">${record.netSalary.toFixed(2)}</span></div>
                `;

                container.appendChild(card);
            });
        }