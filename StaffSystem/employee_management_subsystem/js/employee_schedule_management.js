const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayPrefixes = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function initPage() {
    try {
        loadEmployees();
        const today = new Date();
        const weekStart = getWeekStart(today);
        const dateInput = document.getElementById('scheduleDate');
        if (dateInput) {
            dateInput.value = weekStart;
        }
        updatePreview();

        document.querySelectorAll('.day-schedule select').forEach(select => {
            select.addEventListener('change', function() {
                const prefix = this.id.replace('-type', '');
                const timeInputs = document.querySelectorAll(`[id^="${prefix}-"]`);
                timeInputs.forEach(input => {
                    if (input.id !== this.id) {
                        input.disabled = this.value === 'dayoff';
                        input.style.opacity = this.value === 'dayoff' ? 0.5 : 1;
                    }
                });
                updatePreview();
            });
        });
    } catch (e) {
        console.error('Error initializing page:', e);
    }
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
}

function toggleScheduleType() {
    try {
        const type = document.querySelector('input[name="scheduleType"]:checked').value;
        const dateInput = document.getElementById('scheduleDate');
        if (type === 'temporary') {
            dateInput.type = 'date';
        } else {
            dateInput.type = 'week';
            const today = new Date();
            const weekStart = getWeekStart(today);
            dateInput.value = weekStart;
        }
    } catch (e) {
        console.error('Error toggling schedule type:', e);
    }
}

function loadEmployees() {
    try {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const select = document.getElementById('employeeSelect');
        if (select) {
            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = emp.name + ' - ' + emp.department;
                select.appendChild(option);
            });
            
            select.addEventListener('change', function() {
                loadExistingSchedule();
            });
        }
    } catch (e) {
        console.error('Error loading employees:', e);
    }
}

function saveSchedule() {
    try {
        const employeeName = document.getElementById('employeeSelect').value;
        const scheduleDate = document.getElementById('scheduleDate').value;

        if (!employeeName) {
            alert('Please select an employee!');
            return;
        }
        if (!scheduleDate) {
            alert('Please select a schedule date!');
            return;
        }

        const scheduleData = {
            employeeName: employeeName,
            weekStart: scheduleDate,
            type: document.querySelector('input[name="scheduleType"]:checked').value,
            days: {}
        };

        dayPrefixes.forEach((prefix, index) => {
            const dayType = document.getElementById(prefix + '-type').value;
            scheduleData.days[dayNames[index]] = {
                start: dayType === 'work' ? document.getElementById(prefix + '-start').value : 'OFF',
                end: dayType === 'work' ? document.getElementById(prefix + '-end').value : 'OFF',
                type: dayType
            };
        });

        let schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
        const existingIndex = schedules.findIndex(s =>
            s.employeeName === employeeName && s.weekStart === scheduleDate
        );

        if (existingIndex !== -1) {
            schedules[existingIndex] = scheduleData;
        } else {
            schedules.push(scheduleData);
        }

        localStorage.setItem('schedules', JSON.stringify(schedules));
        alert('Schedule saved successfully!');
        updatePreview();
    } catch (e) {
        console.error('Error saving schedule:', e);
        alert('Error saving schedule. Please try again.');
    }
}

function loadExistingSchedule() {
    try {
        const employeeName = document.getElementById('employeeSelect').value;
        const scheduleDate = document.getElementById('scheduleDate').value;

        if (!employeeName || !scheduleDate) {
            alert('Please select an employee and date!');
            return;
        }

        const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
        const schedule = schedules.find(s =>
            s.employeeName === employeeName && s.weekStart === scheduleDate
        );

        if (schedule) {
            dayPrefixes.forEach((prefix, index) => {
                const dayData = schedule.days[dayNames[index]];
                if (dayData) {
                    document.getElementById(prefix + '-type').value = dayData.type;
                    const startInput = document.getElementById(prefix + '-start');
                    const endInput = document.getElementById(prefix + '-end');
                    if (dayData.type === 'work') {
                        startInput.value = dayData.start;
                        endInput.value = dayData.end;
                        startInput.disabled = false;
                        endInput.disabled = false;
                        startInput.style.opacity = 1;
                        endInput.style.opacity = 1;
                    } else {
                        startInput.disabled = true;
                        endInput.disabled = true;
                        startInput.style.opacity = 0.5;
                        endInput.style.opacity = 0.5;
                    }
                }
            });
            alert('Schedule loaded!');
            updatePreview();
        } else {
            alert('No existing schedule found for this employee and date.');
        }
    } catch (e) {
        console.error('Error loading schedule:', e);
        alert('Error loading schedule. Please try again.');
    }
}

function updatePreview() {
    try {
        const tbody = document.querySelector('#schedulePreview tbody');
        if (tbody) {
            tbody.innerHTML = '';

            dayPrefixes.forEach((prefix, index) => {
                const dayType = document.getElementById(prefix + '-type').value;
                const row = document.createElement('tr');

                row.innerHTML =
                    '<td>' + dayNames[index] + '</td>' +
                    '<td>' + (dayType === 'work' ? document.getElementById(prefix + '-start').value : 'OFF') + '</td>' +
                    '<td>' + (dayType === 'work' ? document.getElementById(prefix + '-end').value : 'OFF') + '</td>' +
                    '<td>' + (dayType === 'work' ? 'Work' : 'Day Off') + '</td>';

                tbody.appendChild(row);
            });
        }
    } catch (e) {
        console.error('Error updating preview:', e);
    }
}

document.addEventListener('DOMContentLoaded', initPage);