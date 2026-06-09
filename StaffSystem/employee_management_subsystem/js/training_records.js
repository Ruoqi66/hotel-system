 let trainingRecords = JSON.parse(localStorage.getItem("trainingRecords") || "[]");
        let trainingPlans = JSON.parse(localStorage.getItem("trainingPlans") || "[]");
        let employees = JSON.parse(localStorage.getItem("employees") || "[]");

        function navigateTo(page) {
            window.location.href = page;
        }

        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(sectionId).style.display = 'block';

            trainingPlans = JSON.parse(localStorage.getItem("trainingPlans") || "[]");
            trainingRecords = JSON.parse(localStorage.getItem("trainingRecords") || "[]");
            employees = JSON.parse(localStorage.getItem("employees") || "[]");

            if (sectionId === 'recordAttendance' || sectionId === 'recordGrades') {
                loadTrainingPlans();
            } else if (sectionId === 'viewRecords') {
                loadTrainingPlansForFilter();
                displayRecords();
            }

            updateStatistics();
        }


        function loadTrainingPlans() {
            const select1 = document.getElementById("selectTraining");
            const select2 = document.getElementById("selectTrainingForGrades");

            select1.innerHTML = '<option value="">Select Training</option>';
            select2.innerHTML = '<option value="">Select Training</option>';

            trainingPlans.forEach(plan => {
                const option1 = document.createElement("option");
                option1.value = plan.id;
                option1.textContent = `${plan.planName} (${plan.trainingType})`;
                select1.appendChild(option1);

                const option2 = document.createElement("option");
                option2.value = plan.id;
                option2.textContent = `${plan.planName} (${plan.trainingType})`;
                select2.appendChild(option2);
            });
        }

        function loadTrainingPlansForFilter() {
            const select = document.getElementById("filterTraining");
            select.innerHTML = '<option value="">All Trainings</option>';

            trainingPlans.forEach(plan => {
                const option = document.createElement("option");
                option.value = plan.planName;
                option.textContent = plan.planName;
                select.appendChild(option);
            });
        }

        function loadEnrolledEmployees() {
            const trainingId = document.getElementById("selectTraining").value;
            const checklist = document.getElementById("employeeChecklist");

            if (!trainingId) {
                checklist.innerHTML = '<p style="color: #999; text-align: center;">Please select a training plan first</p>';
                return;
            }

            const training = trainingPlans.find(p => p.id == trainingId);
            if (!training) return;

             let html = '';
            employees.forEach(emp => {
                html += `                    <div style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" name="employeeAttendance" value="${emp.name}" data-employee='${JSON.stringify(emp)}' style="margin-right: 10px; width: 18px; height: 18px;">
                            <span><strong>${emp.name}</strong> - ${emp.department || 'N/A'} (${emp.position || 'N/A'})</span>
                        </label>
                    </div>
                `;
            });

            checklist.innerHTML = html;
        }

                function loadEmployeesForGrades() {
            const trainingId = document.getElementById("selectTrainingForGrades").value;
            const gradesDiv = document.getElementById("gradesEntry");

            if (!trainingId) {
                gradesDiv.innerHTML = '<p style="color: #999; text-align: center;">Please select a training plan first</p>';
                return;
            }

            let html = '';
            employees.forEach(emp => {
                const existingRecord = trainingRecords.find(r =>
                    r.employeeName === emp.name && r.trainingId == trainingId
                );
            const existingGrade = existingRecord ? existingRecord.grade : '';

                html += `
                    <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #667eea;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <strong>${emp.name}</strong>
                            <span style="color: #666; font-size: 12px;">${emp.department || 'N/A'} - ${emp.position || 'N/A'}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 10px; align-items: start;">
                            <div>
                                <label style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;">Grade (0-100):</label>
                                <input type="number" name="grade_${emp.name}" min="0" max="100" value="${existingGrade}"
                                       placeholder="Enter grade" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px;"
                                       oninput="updateGradeLevel(this, '${emp.name}')">
                                <div id="gradeLevel_${emp.name}" style="margin-top: 5px; font-size: 12px; font-weight: bold;"></div>
                            </div>
                            <div>
                                <label style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;">Grade Level:</label>
                                <select name="level_${emp.name}" id="levelSelect_${emp.name}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
                                    <option value="">Auto</option>
                                    <option value="Excellent">Excellent (90-100)</option>
                                    <option value="Good">Good (80-89)</option>
                                    <option value="Average">Average (70-79)</option>
                                    <option value="Poor">Poor (0-69)</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;">Individual Comments:</label>
                                <input type="text" name="comment_${emp.name}" placeholder="Optional comments" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
                            </div>
                        </div>
                    </div>
                `;
            });

            gradesDiv.innerHTML = html;

            employees.forEach(emp => {
                const gradeInput = document.querySelector(`input[name="grade_${emp.name}"]`);
                if (gradeInput && gradeInput.value) {
                    updateGradeLevel(gradeInput, emp.name);
                }
            });
        }

        function updateGradeLevel(input, empName) {
            const grade = parseFloat(input.value);
            const levelDiv = document.getElementById(`gradeLevel_${empName}`);
            const levelSelect = document.getElementById(`levelSelect_${empName}`);

            if (isNaN(grade)) {
                levelDiv.textContent = '';
                return;
            }

            let level, color;
            if (grade >= 90) {
                level = 'Excellent';
                color = '#28a745';
            } else if (grade >= 80) {
                level = 'Good';
                color = '#17a2b8';
            } else if (grade >= 70) {
                level = 'Average';
                color = '#ffc107';
            } else {
                level = 'Poor';
                color = '#dc3545';
            }

            levelDiv.textContent = level;
            levelDiv.style.color = color;

            if (levelSelect.value === '') {
                levelSelect.value = level;
            }
        }


        document.getElementById("attendanceForm").addEventListener("submit", function(e) {
            e.preventDefault();

            const trainingId = document.getElementById("selectTraining").value;
            const training = trainingPlans.find(p => p.id == trainingId);

            if (!training) {
                alert("Please select a training plan!");
                return;
            }

            const checkboxes = document.querySelectorAll('input[name="employeeAttendance"]:checked');
            if (checkboxes.length === 0) {
                alert("Please select at least one employee!");
                return;
            }

            checkboxes.forEach(checkbox => {
                const employee = checkbox.dataset.employee ? JSON.parse(checkbox.dataset.employee) : null;
                if (!employee) return;

                const record = {
                    id: Date.now() + Math.random(),
                    employeeName: employee.name,
                    employeeId: employee.id || '',
                    department: employee.department || '',
                    position: employee.position || '',
                    trainingId: trainingId,
                    trainingName: training.planName,
                    trainingType: training.trainingType,
                    attendanceDate: document.getElementById("attendanceDate").value,
                    attendance: "Present",
                    grade: null,
                    assessmentType: null,
                    comments: document.getElementById("attendanceNotes").value,
                    recordedAt: new Date().toISOString()
                };

                trainingRecords.push(record);
            });

            localStorage.setItem("trainingRecords", JSON.stringify(trainingRecords));

            alert(`Attendance recorded for ${checkboxes.length} employee(s)!`);
            this.reset();
            document.getElementById("employeeChecklist").innerHTML = '<p style="color: #999; text-align: center;">Please select a training plan first</p>';
            updateStatistics();
        });

                document.getElementById("gradesForm").addEventListener("submit", function(e) {
            e.preventDefault();

            const trainingId = document.getElementById("selectTrainingForGrades").value;
            const training = trainingPlans.find(p => p.id == trainingId);
            const assessmentType = document.getElementById("assessmentType").value;

            if (!training) {
                alert("Please select a training plan!");
                return;
            }

            let recordsSaved = 0;
            employees.forEach(emp => {
                const gradeInput = document.querySelector(`input[name="grade_${emp.name}"]`);
                const commentInput = document.querySelector(`input[name="comment_${emp.name}"]`);
                const levelSelect = document.getElementById(`levelSelect_${emp.name}`);

                if (gradeInput && gradeInput.value !== '') {
                    const existingRecord = trainingRecords.find(r =>
                        r.employeeName === emp.name &&
                        r.trainingId == trainingId
                    );

                    const grade = parseFloat(gradeInput.value);
                    let gradeLevel = levelSelect.value;
                    if (!gradeLevel) {
                        if (grade >= 90) gradeLevel = 'Excellent';
                        else if (grade >= 80) gradeLevel = 'Good';
                        else if (grade >= 70) gradeLevel = 'Average';
                        else gradeLevel = 'Poor';
                    }

                    if (existingRecord) {
                        existingRecord.grade = grade;
                        existingRecord.gradeLevel = gradeLevel;
                        existingRecord.assessmentType = assessmentType;
                        existingRecord.gradeComments = commentInput ? commentInput.value : '';
                        existingRecord.generalComments = document.getElementById("gradeComments").value;
                        existingRecord.updatedAt = new Date().toISOString();
                    } else {
                        const record = {
                            id: Date.now() + Math.random(),
                            employeeName: emp.name,
                            employeeId: emp.id || '',
                            department: emp.department || '',
                            position: emp.position || '',
                            trainingId: trainingId,
                            trainingName: training.planName,
                            trainingType: training.trainingType,
                            attendanceDate: new Date().toISOString().split('T')[0],
                            attendance: "Unknown",
                            grade: grade,
                            gradeLevel: gradeLevel,
                            assessmentType: assessmentType,
                            comments: commentInput ? commentInput.value : '',
                            generalComments: document.getElementById("gradeComments").value,
                            recordedAt: new Date().toISOString()
                        };
                        trainingRecords.push(record);
                    }

                    recordsSaved++;
                }
            });

            localStorage.setItem("trainingRecords", JSON.stringify(trainingRecords));

            alert(`Grades recorded for ${recordsSaved} employee(s)!`);
            this.reset();
            document.getElementById("gradesEntry").innerHTML = '<p style="color: #999; text-align: center;">Please select a training plan first</p>';
            updateStatistics();
        });


        function displayRecords(recordsToShow = null) {
            const tbody = document.getElementById("recordsTableBody");
            tbody.innerHTML = "";

            let records = recordsToShow || trainingRecords;

            if (records.length === 0) {
                tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 30px;">No training records found</td></tr>';
                return;
            }

                records.forEach(record => {
                const row = document.createElement("tr");
                const attendanceClass = record.attendance === "Present" ? "attendance-present" : "attendance-absent";
                const gradeBadge = getGradeBadge(record.grade);
                const levelBadge = getLevelBadge(record.gradeLevel);

                row.innerHTML = `
                    <td>${Math.floor(record.id)}</td>
                    <td>${record.employeeName}</td>
                    <td>${record.trainingName}</td>
                    <td>${record.trainingType}</td>
                    <td>${formatDate(record.attendanceDate)}</td>
                    <td><span class="${attendanceClass}">${record.attendance}</span></td>
                    <td>${gradeBadge}</td>
                    <td>${levelBadge}</td>
                    <td>${record.assessmentType || 'N/A'}</td>
                    <td>${record.comments || record.generalComments || ''}</td>
                    <td>
                        <button class="btn btn-primary" onclick="viewRecordDetail('${record.id}')" style="padding: 5px 10px; font-size: 12px;">View</button>
                        <button class="btn btn-danger" onclick="deleteRecord('${record.id}')" style="padding: 5px 10px; font-size: 12px;">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function getGradeBadge(grade) {
            if (grade === null || grade === undefined) return 'N/A';

            let className = '';
            if (grade >= 90) className = 'grade-excellent';
            else if (grade >= 80) className = 'grade-good';
            else if (grade >= 70) className = 'grade-average';
            else className = 'grade-poor';

            return `<span class="grade-badge ${className}">${grade}</span>`;
        }

        function getLevelBadge(level) {
            if (!level) return 'N/A';

            let className = '';
            switch(level) {
                case 'Excellent': className = 'level-excellent'; break;
                case 'Good': className = 'level-good'; break;
                case 'Average': className = 'level-average'; break;
                case 'Poor': className = 'level-poor'; break;
            }

            return `<span class="level-badge ${className}">${level}</span>`;
        }


        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US');
        }


        function filterRecords() {
            const searchTerm = document.getElementById("searchEmployee").value.toLowerCase();
            const trainingFilter = document.getElementById("filterTraining").value;
            const attendanceFilter = document.getElementById("filterAttendance").value;
            const gradeFilter = document.getElementById("filterGrade").value;

            let filtered = trainingRecords.filter(record => {
                let match = true;

                if (searchTerm && !record.employeeName.toLowerCase().includes(searchTerm)) {
                    match = false;
                }

                if (trainingFilter && record.trainingName !== trainingFilter) {
                    match = false;
                }

                if (attendanceFilter && record.attendance !== attendanceFilter) {
                    match = false;
                }

                if (gradeFilter && record.grade !== null) {
                    const [min, max] = gradeFilter.split('-').map(Number);
                    if (record.grade < min || record.grade > max) {
                        match = false;
                    }
                }

                return match;
            });

            displayRecords(filtered);
        }


         function viewRecordDetail(recordId) {
            const record = trainingRecords.find(r => r.id == recordId);
            if (!record) return;

            const details = `Record ID: ${Math.floor(record.id)}Employee: ${record.employeeName}Department: ${record.department || 'N/A'}Position: ${record.position || 'N/A'}Training: ${record.trainingName}Type: ${record.trainingType}Date: ${formatDate(record.attendanceDate)}Attendance: ${record.attendance}Grade: ${record.grade !== null ? record.grade : 'N/A'}Grade Level: ${record.gradeLevel || 'N/A'}Assessment: ${record.assessmentType || 'N/A'}Comments: ${record.comments || record.generalComments || 'None'}Recorded: ${new Date(record.recordedAt).toLocaleString()}            `;

            alert(details);
        }

        function deleteRecord(recordId) {
            if (!confirm("Are you sure you want to delete this record?")) {
                return;
            }

            trainingRecords = trainingRecords.filter(r => r.id != recordId);
            localStorage.setItem("trainingRecords", JSON.stringify(trainingRecords));
            displayRecords();
            updateStatistics();
            alert("Record deleted successfully!");
        }




        function updateStatistics() {
            const totalTrainings = new Set(trainingRecords.map(r => r.trainingId)).size;
            const totalParticipants = new Set(trainingRecords.map(r => r.employeeName)).size;

            const presentCount = trainingRecords.filter(r => r.attendance === "Present").length;
            const attendanceRate = trainingRecords.length > 0 ? Math.round((presentCount / trainingRecords.length) * 100) : 0;

            const gradedRecords = trainingRecords.filter(r => r.grade !== null);
            const avgGrade = gradedRecords.length > 0 ?
                Math.round(gradedRecords.reduce((sum, r) => sum + r.grade, 0) / gradedRecords.length) : 0;

            document.getElementById("totalTrainings").textContent = totalTrainings;
            document.getElementById("totalParticipants").textContent = totalParticipants;
            document.getElementById("avgAttendance").textContent = attendanceRate + '%';
            document.getElementById("avgGrade").textContent = avgGrade;
        }

          function exportRecords() {
            let csv = 'Record ID,Employee Name,Department,Position,Training Name,Training Type,Date,Attendance,Grade,Grade Level,Assessment Type,Comments\n';

            trainingRecords.forEach(record => {
                csv += `${Math.floor(record.id)},${record.employeeName},${record.department || ''},${record.position || ''},${record.trainingName},${record.trainingType},${record.attendanceDate},${record.attendance},${record.grade || ''},${record.gradeLevel || ''},${record.assessmentType || ''},"${record.comments || ''}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `training_records_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            alert("Records exported successfully!");
        }
        window.onload = function() {
            showSection('recordAttendance');
        };