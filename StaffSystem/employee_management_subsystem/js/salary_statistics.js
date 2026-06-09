window.onload = function() {
            loadMonths();
            loadDepartments();
        };

        function loadMonths() {
            const salaries = JSON.parse(localStorage.getItem('salaries') || '[]');
            const months = [...new Set(salaries.map(s => s.month))];
            const select = document.getElementById('statMonth');

            months.sort().reverse().forEach(month => {
                const option = document.createElement('option');
                option.value = month;
                option.textContent = month;
                select.appendChild(option);
            });
        }

        function loadDepartments() {
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');
            const departments = [...new Set(employees.map(e => e.department))];
            const select = document.getElementById('statDepartment');

            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                select.appendChild(option);
            });
        }

        function generateSalaryStats() {
            const month = document.getElementById('statMonth').value;
            const department = document.getElementById('statDepartment').value;

            if (!month) {
                alert('Please select a month!');
                return;
            }

            const salaries = JSON.parse(localStorage.getItem('salaries') || '[]');
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');

            let filtered = salaries.filter(s => s.month === month);

            const deptEmployeeMap = {};
            employees.forEach(emp => {
                deptEmployeeMap[emp.name] = emp.department;
            });

            if (department !== 'all') {
                filtered = filtered.filter(s => deptEmployeeMap[s.employeeName] === department);
            }

            if (filtered.length === 0) {
                alert('No salary records found!');
                return;
            }

            const totalSalary = filtered.reduce((sum, s) => sum + s.netSalary, 0);
            const avgSalary = totalSalary / filtered.length;
            const maxSalary = Math.max(...filtered.map(s => s.netSalary));
            const minSalary = Math.min(...filtered.map(s => s.netSalary));

            document.getElementById('totalEmployees').textContent = filtered.length;
            document.getElementById('totalSalary').textContent = totalSalary.toFixed(2);
            document.getElementById('avgSalary').textContent = avgSalary.toFixed(2);
            document.getElementById('maxSalary').textContent = maxSalary.toFixed(2);
            document.getElementById('minSalary').textContent = minSalary.toFixed(2);

            renderSalaryStructure(filtered);
            renderDepartmentSummary(filtered, deptEmployeeMap);
            renderDetailedSalary(filtered, deptEmployeeMap);
        }

        function renderSalaryStructure(salaries) {
            const tbody = document.querySelector('#salaryStructure tbody');
            tbody.innerHTML = '';

            const totalBase = salaries.reduce((sum, s) => sum + s.baseSalary, 0);
            const totalBonus = salaries.reduce((sum, s) => sum + s.bonus, 0);
            const totalAllowance = salaries.reduce((sum, s) => sum + s.allowance, 0);
            const totalOvertime = salaries.reduce((sum, s) => sum + s.overtimePay, 0);
            const grossTotal = totalBase + totalBonus + totalAllowance + totalOvertime;

            const components = [
                { name: 'Base Salary', amount: totalBase },
                { name: 'Bonus', amount: totalBonus },
                { name: 'Allowance', amount: totalAllowance },
                { name: 'Overtime Pay', amount: totalOvertime }
            ];

             components.forEach(comp => {
                const percentage = grossTotal > 0 ? (comp.amount / grossTotal * 100).toFixed(2) : 0;
                const row = document.createElement('tr');
                row.innerHTML = `                    <td>${comp.name}</td>
                    <td>${comp.amount.toFixed(2)}</td>
                    <td>${percentage}%</td>
                `;
                tbody.appendChild(row);
            });
        }

        function renderDepartmentSummary(salaries, deptMap) {
            const tbody = document.querySelector('#departmentSummary tbody');
            tbody.innerHTML = '';

            const deptData = {};

            salaries.forEach(s => {
                const dept = deptMap[s.employeeName] || 'Unknown';
                if (!deptData[dept]) {
                    deptData[dept] = { count: 0, total: 0 };
                }
                deptData[dept].count++;
                deptData[dept].total += s.netSalary;
            });

            Object.keys(deptData).forEach(dept => {
                const avg = deptData[dept].total / deptData[dept].count;
                const row = document.createElement('tr');
                row.innerHTML = `                    <td>${dept}</td>
                    <td>${deptData[dept].count}</td>
                    <td>${deptData[dept].total.toFixed(2)}</td>
                    <td>${avg.toFixed(2)}</td>
                `;
                tbody.appendChild(row);
            });
        }

        function renderDetailedSalary(salaries, deptMap) {
            const tbody = document.querySelector('#detailedSalary tbody');
            tbody.innerHTML = '';

            salaries.sort((a, b) => b.netSalary - a.netSalary);

            salaries.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `                    <td>${record.employeeName}</td>
                    <td>${deptMap[record.employeeName] || '-'}</td>
                    <td>${record.baseSalary.toFixed(2)}</td>
                    <td>${record.bonus.toFixed(2)}</td>
                    <td>${record.allowance.toFixed(2)}</td>
                    <td>${record.overtimePay.toFixed(2)}</td>
                    <td>${record.deduction.toFixed(2)}</td>
                    <td>${record.tax.toFixed(2)}</td>
                    <td style="font-weight:bold; color:#4CAF50;">${record.netSalary.toFixed(2)}</td>
                `;
                tbody.appendChild(row);
            });
        }

        function exportSalaryReport() {
            const month = document.getElementById('statMonth').value;

            if (!month) {
                alert('Please select a month!');
                return;
            }

            const salaries = JSON.parse(localStorage.getItem('salaries') || '[]');
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');

            const filtered = salaries.filter(s => s.month === month);

            const deptEmployeeMap = {};
            employees.forEach(emp => {
                deptEmployeeMap[emp.name] = emp.department;
            });

            let csvContent = 'Employee,Department,Base Salary,Bonus,Allowance,Overtime,Deduction,Tax,Net Salary\n';

            filtered.forEach(record => {
                const dept = deptEmployeeMap[record.employeeName] || 'Unknown';
                csvContent += `"${record.employeeName}","${dept}",${record.baseSalary.toFixed(2)},${record.bonus.toFixed(2)},${record.allowance.toFixed(2)},${record.overtimePay.toFixed(2)},${record.deduction.toFixed(2)},${record.tax.toFixed(2)},${record.netSalary.toFixed(2)}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `salary_report_${month}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert('Report exported successfully!');
        }
