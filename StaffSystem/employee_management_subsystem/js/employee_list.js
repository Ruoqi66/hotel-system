function loadEmployeeList(){
        const newEmployee = localStorage.getItem("employees");
        if (!newEmployee){
            document.getElementById("employeeTableBody").innerHTML =
                '<tr><td colspan="10" style="text-align:center;">No employees found. Please create a new employee record.</td></tr>';
            return;
        }
        const employee = JSON.parse(newEmployee);
        const tbody = document.getElementById("employeeTableBody");
         if (employee.length === 0) {
            tbody.innerHTML =
                '<tr><td colspan="10" style="text-align:center; color:#999;">No employee records found</td></tr>';
            return;
        }
 employee.forEach(emp =>{
        const row = document.createElement("tr");
        row.innerHTML =
            '<td>' + emp.name + '</td>' +
            '<td>' + emp.gender + '</td>' +
            '<td>' + emp.age + '</td>' +
            '<td>' + emp.contact + '</td>' +
            '<td>' + emp.date + '</td>' +
            '<td>' + emp.department + '</td>' +
            '<td>' + emp.position + '</td>' +
            '<td><a href="#">Personal Information Document</a></td>' +
            '<td><img src="#" alt="Employee photo"></td>' +
            '<td><a href="remove_employee.html?name=' + encodeURIComponent(emp.name) + '" target="_top">Delete</a> | <a href="update_employee.html?name=' + encodeURIComponent(emp.name) + '" target="_top">Update</a></td>';
        tbody.appendChild(row);
    })    }

    function searchEmployee() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('searchResult');
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");

    if (!searchTerm) {
        resultDiv.innerHTML = '';
        document.getElementById('backToListBtn').style.display = 'none';
         loadEmployeeList();
        return;
    }

    const matched = employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));
    document.getElementById('backToListBtn').style.display = 'inline-block';


    if (matched.length === 0) {
        resultDiv.innerHTML = '<p style="color: #999; margin: 10px 0;">No employees found.</p>';
        document.getElementById("employeeTableBody").innerHTML = '';
        return;
    }

    resultDiv.innerHTML = '<p style="color: #409eff; margin: 10px 0;">Found ' + matched.length + ' employee(s):</p>';
    const tbody = document.getElementById("employeeTableBody");
    tbody.innerHTML = '';
    matched.forEach(emp => {
        const row = document.createElement("tr");
        row.innerHTML = '<td>' + emp.name + '</td><td>' + emp.gender + '</td><td>' + emp.age + '</td><td>' + emp.contact + '</td><td>' + emp.date + '</td><td>' + emp.department + '</td><td>' + emp.position + '</td><td><a href="remove_employee.html?name=' + encodeURIComponent(emp.name) + '" target="_top">Delete</a> | <a href="update_employee.html?name=' + encodeURIComponent(emp.name) + '" target="_top">Update</a></td>';
        tbody.appendChild(row);
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') searchEmployee();
}

function showAllEmployees() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResult').innerHTML = '';
    document.getElementById('backToListBtn').style.display = 'none';
    loadEmployeeList();
}

window.onload = loadEmployeeList;