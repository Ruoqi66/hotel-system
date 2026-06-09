 document.getElementById("addForm").addEventListener("submit",function (e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById("name").value,
            gender: document.querySelector('input[name="gender"]:checked')?.value || "",
            age: document.getElementById("age").value,
            contact: document.getElementById("contact").value,
            date: document.getElementById("date").value,
            department: document.getElementById("department").value,
            position: document.getElementById("position").value,
            personalInformationDocument: document.getElementById("personalInformationDocument").value,
            employeePhoto: document.getElementById('employeePhoto').value,
        }
        let employee = JSON.parse(localStorage.getItem("employees") || "[]");
        const existingEmployee = employee.find(emp => emp.name === formData.name);
        if (existingEmployee) {
            alert("An employee with the name '" + formData.name + "' already exists!");
            return;
        }
        employee.push(formData);
        localStorage.setItem("employees", JSON.stringify(employee))
        console.log(employee);
        console.log(localStorage);
        window.location.href = "employee_list.html";
 })