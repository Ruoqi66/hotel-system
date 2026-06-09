function loadEmployees() {
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');
            const select = document.getElementById('statEmployee');

            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = emp.name + ' - ' + emp.department;
                select.appendChild(option);
            });
        }

        function generateStatistics() {
            const employeeName = document.getElementById('statEmployee').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            if (!startDate || !endDate) {
                alert('Please select date range!');
                return;
            }

            const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

            let filteredRecords = attendance.filter(r => {
                return r.date >= startDate && r.date <= endDate;
            });

            if (employeeName !== 'all') {
                filteredRecords = filteredRecords.filter(r => r.employeeName === employeeName);
            }

            const stats = {
                total: filteredRecords.length,
                normal: 0,
                late: 0,
                early: 0,
                absent: 0,
                leave: 0,
                overtime: 0
            };

            filteredRecords.forEach(record => {
                if (record.status === 'Normal') {
                    stats.normal++;
                } else if (record.status.includes('Late')) {
                    stats.late++;
                } else if (record.status.includes('Early')) {
                    stats.early++;
                } else if (record.status === 'Absent') {
                    stats.absent++;
                } else if (record.status === 'Leave') {
                    stats.leave++;
                } else if (record.status === 'Overtime') {
                    stats.overtime++;
                }
            });

            document.getElementById('totalDays').textContent = stats.total;
            document.getElementById('normalCount').textContent = stats.normal;
            document.getElementById('lateCount').textContent = stats.late;
            document.getElementById('earlyCount').textContent = stats.early;
            document.getElementById('absentCount').textContent = stats.absent;

            renderBarChart(stats);
            renderDetailedTable(filteredRecords);
        }

        function renderBarChart(stats) {
            const chartContainer = document.getElementById('barChart');
            chartContainer.innerHTML = '';

            const data = [
                { label: 'Normal', value: stats.normal, color: '#4CAF50' },
                { label: 'Late', value: stats.late, color: '#ff9800' },
                { label: 'Early Leave', value: stats.early, color: '#f44336' },
                { label: 'Absent', value: stats.absent, color: '#9c27b0' },
                { label: 'Leave', value: stats.leave, color: '#2196F3' },
                { label: 'Overtime', value: stats.overtime, color: '#00bcd4' }
            ];

            const maxValue = Math.max(...data.map(d => d.value), 1);

            data.forEach(item => {
                const barItem = document.createElement('div');
                barItem.className = 'bar-item';

                const barValue = document.createElement('div');
                barValue.className = 'bar-value';
                barValue.textContent = item.value;

                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = (item.value / maxValue * 250) + 'px';
                bar.style.background = `linear-gradient(to top, ${item.color}, ${item.color}dd)`;

                const barLabel = document.createElement('div');
                barLabel.className = 'bar-label';
                barLabel.textContent = item.label;

                barItem.appendChild(barValue);
                barItem.appendChild(bar);
                barItem.appendChild(barLabel);
                chartContainer.appendChild(barItem);
            });
        }

        function renderDetailedTable(records) {
            const tbody = document.querySelector('#detailedRecords tbody');
            tbody.innerHTML = '';

            if (records.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No records found</td></tr>';
                return;
            }

            records.sort((a, b) => new Date(b.date) - new Date(a.date));

            records.forEach(record => {
                const row = document.createElement('tr');
                let statusClass = '';
                if (record.status.includes('Late')) statusClass = 'style="color: #ff9800; font-weight: bold;"';
                if (record.status.includes('Early')) statusClass = 'style="color: #f44336; font-weight: bold;"';
                if (record.status === 'Absent') statusClass = 'style="color: #9c27b0; font-weight: bold;"';

                row.innerHTML = `                    <td>${record.employeeName}</td>
                    <td>${record.date}</td>
                    <td>${record.clockIn}</td>
                    <td>${record.clockOut}</td>
                    <td ${statusClass}>${record.status}</td>
                    <td>${record.notes || '-'}</td>
                `;
                tbody.appendChild(row);
            });
        }

        function exportReport() {
            const employeeName = document.getElementById('statEmployee').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
            let filteredRecords = attendance.filter(r => {
                return r.date >= startDate && r.date <= endDate;
            });

            if (employeeName !== 'all') {
                filteredRecords = filteredRecords.filter(r => r.employeeName === employeeName);
            }

            let csvContent = 'Employee,Date,Clock In,Clock Out,Status,Notes\n';

            filteredRecords.forEach(record => {
                csvContent += `"${record.employeeName}","${record.date}","${record.clockIn}","${record.clockOut}","${record.status}","${record.notes || ''}"\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `attendance_report_${startDate}_to_${endDate}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert('Report exported successfully!');
        }

        window.onload = function() {
            loadEmployees();
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            document.getElementById('startDate').valueAsDate = lastMonth;
            document.getElementById('endDate').valueAsDate = today;
        };