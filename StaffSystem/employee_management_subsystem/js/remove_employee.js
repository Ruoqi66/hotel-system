let employeeToDelete = null;
    window.onload = function (){
     const urlParams = new URLSearchParams(window.location.search);
      const employeeName = decodeURIComponent(urlParams.get('name'));

        if (!employeeName) {
            document.getElementById('employeeInfo').innerHTML =
                '<p style="color: red;">Error: No employee name specified.</p>';
            return;
        }

        const employees = JSON.parse(localStorage.getItem("employees") || "[]");
        employeeToDelete = employees.find(emp => emp.name === employeeName);

        if (!employeeToDelete) {
            document.getElementById('employeeInfo').innerHTML =
                '<p style="color: red;">Employee not found: ' + employeeName + '</p>';
            return;
        }

        const infoDiv = document.getElementById('employeeInfo');
        infoDiv.innerHTML =
            '<p><strong>Name:</strong> ' + employeeToDelete.name + '</p>' +
            '<p><strong>Gender:</strong> ' + employeeToDelete.gender + '</p>' +
            '<p><strong>Age:</strong> ' + employeeToDelete.age + '</p>' +
            '<p><strong>Contact:</strong> ' + employeeToDelete.contact + '</p>' +
            '<p><strong>Hire Date:</strong> ' + employeeToDelete.date + '</p>' +
            '<p><strong>Department:</strong> ' + employeeToDelete.department + '</p>' +
            '<p><strong>Position:</strong> ' + employeeToDelete.position + '</p>';
    }

    function confirmDelete() {
        if (!employeeToDelete) {
            alert('No employee selected for deletion.');
            return;
        }
        if (!confirm('Warning: Deleted employee information cannot be restored. Are you sure you want to delete?')) {
            return;
        }
        const employees = JSON.parse(localStorage.getItem("employees") || "[]");
        const updatedEmployees = employees.filter(emp => emp.name !== employeeToDelete.name);
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
        alert('Employee "' + employeeToDelete.name + '" has been deleted successfully.');
        window.location.href = "employee_list.html";
    }

    function cancelDelete() {
        window.location.href = "employee_list.html";
    }