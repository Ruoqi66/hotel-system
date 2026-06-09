function updateCurrentTime() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
            document.getElementById('currentTime').textContent = timeStr;
        }

        setInterval(updateCurrentTime, 1000);
        updateCurrentTime();

        window.onload = function() {
            loadEmployees();
            loadTodayRecords();
            document.getElementById('adjustDate').valueAsDate = new Date();
        };

        function loadEmployees() {
            const employees = JSON.parse(localStorage.getItem('employees') || '[]');
            const select1 = document.getElementById('employeeSelect');
            const select2 = document.getElementById('adjustEmployee');

            employees.forEach(emp => {
                const option1 = document.createElement('option');
                option1.value = emp.name;
                option1.textContent = emp.name + ' - ' + emp.department;
                select1.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = emp.name;
                option2.textContent = emp.name + ' - ' + emp.department;
                select2.appendChild(option2);
            });
        }

        function clockIn() {
            const employeeName = document.getElementById('employeeSelect').value;
            if (!employeeName) {
                alert('Please select an employee!');
                return;
            }

            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

            let attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

            const todayRecord = attendance.find(r =>
                r.employeeName === employeeName && r.date === dateStr
            );

            if (todayRecord && todayRecord.clockIn) {
                alert('Already clocked in today!');
                return;
            }

            const schedule = getTodaySchedule(employeeName);
            let status = 'Normal';

            if (schedule && schedule.start !== 'OFF') {
                const scheduledStart = schedule.start;
                const lateMinutes = calculateLateMinutes(timeStr, scheduledStart);
                if (lateMinutes > 0) {
                    status = `Late (${lateMinutes} min)`;
                }
            }

            if (todayRecord) {
                todayRecord.clockIn = timeStr;
                todayRecord.status = status;
            } else {
                attendance.push({
                    employeeName: employeeName,
                    date: dateStr,
                    clockIn: timeStr,
                    clockOut: '-',
                    status: status,
                    notes: ''
                });
            }

            localStorage.setItem('attendance', JSON.stringify(attendance));
            alert(`Clocked in successfully at ${timeStr}`);
            loadTodayRecords();
        }

        function clockOut() {
            const employeeName = document.getElementById('employeeSelect').value;
            if (!employeeName) {
                alert('Please select an employee!');
                return;
            }

            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

            let attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

            const todayRecord = attendance.find(r =>
                r.employeeName === employeeName && r.date === dateStr
            );

            if (!todayRecord || !todayRecord.clockIn) {
                alert('No clock-in record found! Please clock in first.');
                return;
            }

            if (todayRecord.clockOut !== '-') {
                alert('Already clocked out today!');
                return;
            }

            const schedule = getTodaySchedule(employeeName);

            if (schedule && schedule.end !== 'OFF') {
                const scheduledEnd = schedule.end;
                const earlyMinutes = calculateEarlyMinutes(timeStr, scheduledEnd);
                if (earlyMinutes > 0 && !todayRecord.status.includes('Late')) {
                    todayRecord.status = `Early Leave (${earlyMinutes} min)`;
                }
            }

            todayRecord.clockOut = timeStr;
            localStorage.setItem('attendance', JSON.stringify(attendance));
            alert(`Clocked out successfully at ${timeStr}`);
            loadTodayRecords();
        }

        function getTodaySchedule(employeeName) {
            const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
            const now = new Date();
            const weekStart = getWeekStart(now);

            const schedule = schedules.find(s =>
                s.employeeName === employeeName && s.weekStart === weekStart
            );

            if (!schedule) return null;

            const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const today = dayNames[now.getDay() === 0 ? 6 : now.getDay() - 1];

            return schedule.days[today];
        }

        function getWeekStart(date) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(d.setDate(diff));
            return monday.toISOString().split('T')[0];
        }

        function calculateLateMinutes(actualTime, scheduledTime) {
            const [actualH, actualM] = actualTime.split(':').map(Number);
            const [schedH, schedM] = scheduledTime.split(':').map(Number);

            const actualMinutes = actualH * 60 + actualM;
            const schedMinutes = schedH * 60 + schedM;

            return Math.max(0, actualMinutes - schedMinutes);
        }

        function calculateEarlyMinutes(actualTime, scheduledTime) {
            const [actualH, actualM] = actualTime.split(':').map(Number);
            const [schedH, schedM] = scheduledTime.split(':').map(Number);

            const actualMinutes = actualH * 60 + actualM;
            const schedMinutes = schedH * 60 + schedM;

            return Math.max(0, schedMinutes - actualMinutes);
        }

        function submitAdjustment() {
            const employeeName = document.getElementById('adjustEmployee').value;
            const date = document.getElementById('adjustDate').value;
            const type = document.getElementById('adjustType').value;
            const hours = document.getElementById('adjustHours').value;
            const reason = document.getElementById('adjustReason').value;

            if (!employeeName || !date) {
                alert('Please fill in all required fields!');
                return;
            }

            let attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

            let record = attendance.find(r =>
                r.employeeName === employeeName && r.date === date
            );

            const typeLabels = {
                'leave': 'Leave',
                'overtime': 'Overtime',
                'compensatory': 'Compensatory Leave',
                'absent': 'Absent'
            };

            const note = `${typeLabels[type]}: ${hours} hours - ${reason}`;

            if (record) {
                record.notes = record.notes ? record.notes + '; ' + note : note;
                if (type === 'absent') {
                    record.status = 'Absent';
                }
            } else {
                attendance.push({
                    employeeName: employeeName,
                    date: date,
                    clockIn: type === 'leave' || type === 'absent' ? '-' : 'Adjusted',
                    clockOut: type === 'leave' || type === 'absent' ? '-' : 'Adjusted',
                    status: typeLabels[type],
                    notes: note
                });
            }

            localStorage.setItem('attendance', JSON.stringify(attendance));
            alert('Adjustment submitted successfully!');
            loadTodayRecords();

            document.getElementById('adjustReason').value = '';
        }

        function loadTodayRecords() {
            const tbody = document.querySelector('#todayRecords tbody');
            tbody.innerHTML = '';

            const today = new Date().toISOString().split('T')[0];
            const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

            const todayRecords = attendance.filter(r => r.date === today);

            todayRecords.forEach(record => {
                const row = document.createElement('tr');
                let statusClass = 'status-normal';
                if (record.status.includes('Late')) statusClass = 'status-late';
                if (record.status.includes('Early') || record.status === 'Absent') statusClass = 'status-early';

                row.innerHTML = `                    <td>${record.employeeName}</td>
                    <td>${record.date}</td>
                    <td>${record.clockIn}</td>
                    <td>${record.clockOut}</td>
                    <td class="${statusClass}">${record.status}</td>
                    <td>${record.notes || '-'}</td>
                `;
                tbody.appendChild(row);
            });

            if (todayRecords.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No records for today</td></tr>';
            }
        }