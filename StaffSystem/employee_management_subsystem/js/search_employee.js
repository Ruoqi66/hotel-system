 function searchEmployee() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        const resultDiv = document.getElementById('searchResult');

        if (!searchTerm) {
            resultDiv.innerHTML = '<p class="no-result">Please enter a name to search.</p>';
            return;
        }

        const employees = JSON.parse(localStorage.getItem("employees") || "[]");

        if (employees.length === 0) {
            resultDiv.innerHTML = '<p class="no-result">No employee records found in the system.</p>';
            return;
        }

        const matchedEmployees = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchedEmployees.length === 0) {
            resultDiv.innerHTML = '<p class="no-result">No employees found matching "' + searchTerm + '".</p>';
            return;
        }

          if (matchedEmployees.length === 1) {
            const emp = matchedEmployees[0];
            resultDiv.innerHTML = `                <div class="result-box">
                    <p><strong>Name:</strong> ${emp.name}</p>
                    <p><strong>Gender:</strong> ${emp.gender}</p>
                    <p><strong>Age:</strong> ${emp.age}</p>
                    <p><strong>Contact:</strong> ${emp.contact}</p>
                    <p><strong>Hire Date:</strong> ${emp.date}</p>
                    <p><strong>Department:</strong> ${emp.department}</p>
                    <p><strong>Position:</strong> ${emp.position}</p>
                </div>
            `;
        } else {
            let html = `<div class="employee-list"><h3>Found ${matchedEmployees.length} employees:</h3>`;
            matchedEmployees.forEach(emp => {
                html += `                    <div class="employee-item" onclick="showEmployeeDetail('${emp.name.replace(/'/g, "\\'")}')">
                        <strong>${emp.name}</strong> - ${emp.department} | ${emp.position}                    </div>
                `;
            });
            html += '</div>';
            resultDiv.innerHTML = html;
        }
    }

    function showEmployeeDetail(name) {
        document.getElementById('searchInput').value = name;
        searchEmployee();
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            searchEmployee();
        }
    }