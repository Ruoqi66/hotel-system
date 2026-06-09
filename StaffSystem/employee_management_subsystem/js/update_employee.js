 let currentIndex = -1;
    window.onload = function () {
     const employees = JSON.parse(localStorage.getItem('employees') || "[]");
        const urlParams = new URLSearchParams(window.location.search);
        const employeeName = decodeURIComponent(urlParams.get('name'));
        if (!employeeName) {
            alert("No employee specified!")
            return;
        }
        currentIndex = employees.findIndex(function(emp) {
            return emp.name === employeeName;
        });
        if (currentIndex === -1) {
            alert("Employee not found!");
            window.location.href = "employee_list.html";
            return;
        }
        const employee = employees[currentIndex];
        document.getElementById("name").value = employee.name;
        const genderRadio = document.querySelector(`input[name="gender"][value="${employee.gender}"]`);
        if (genderRadio) genderRadio.checked = true;
        document.getElementById("age").value = employee.age;
        document.getElementById("contact").value = employee.contact;
        document.getElementById("date").value = employee.date;
        document.getElementById("department").value = employee.department;
        document.getElementById("position").value = employee.position;
        document.getElementById("updateForm").addEventListener('submit', function (e) {
            e.preventDefault();
            const employees = JSON.parse(localStorage.getItem('employees') || "[]");
            if (currentIndex === -1 || !employees[currentIndex]) {
                alert("Invalid employee index!");
                return;
            }
            const employee = employees[currentIndex];
            employee.name = document.getElementById("name").value || " ";
            const selectedGender = document.querySelector(`input[name = "gender"]:checked`);
            employee.gender = selectedGender ? selectedGender.value : ""
            employee.age = document.getElementById("age").value;
            employee.contact = document.getElementById("contact").value;
            employee.date = document.getElementById("date").value;
            employee.department = document.getElementById("department").value;
            employee.position = document.getElementById("position").value;
            localStorage.setItem('employees', JSON.stringify(employees));
            alert("Employee information updated successfully!");
            window.location.href = 'employee_list.html';
        });
    }
