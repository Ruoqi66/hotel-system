function toggleSubmenu(element) {
            const parentLi = element.parentElement;
            const submenu = parentLi.querySelector('.submenu');

            parentLi.classList.toggle('expanded');
            submenu.classList.toggle('active');
}

function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        const sidebarHTML = `
            <div class="sidebar">
                <div class="sidebar-title">Employee Management</div>
                <ul class="menu">
                    <li class="menu-item">
                        <a href="../html/employee_list.html">Employee List Display</a>
                    </li>
                    <li class="menu-item">
                        <a href="../html/add_employee.html">Add Employee</a>
                    </li>
                    <li class="menu-item has-children">
                        <a href="javascript:void(0)" onclick="toggleSubmenu(this)">Schedule & Attendance</a>
                        <ul class="submenu">
                            <li><a href="../html/employee_schedule_management.html">Schedule Management</a></li>
                            <li><a href="../html/attendance_check.html">Attendance Check</a></li>
                            <li><a href="../html/attendance_statistics.html">Attendance Statistics</a></li>
                        </ul>
                    </li>
                    <li class="menu-item has-children">
                        <a href="javascript:void(0)" onclick="toggleSubmenu(this)">Salary Management</a>
                        <ul class="submenu">
                            <li><a href="../html/salary_management.html">Salary Calculation</a></li>
                            <li><a href="../html/salary_payment.html">Salary Payment</a></li>
                            <li><a href="../html/salary_statistics.html">Salary Statistics</a></li>
                        </ul>
                    </li>
                    <li class="menu-item has-children">
                        <a href="javascript:void(0)" onclick="toggleSubmenu(this)">Training Management</a>
                        <ul class="submenu">
                            <li><a href="../html/training_plan_management.html">Create Training Plan</a></li>
                            <li><a href="../html/view_training_plans.html">View Training Plans</a></li>
                            <li><a href="../html/training_records.html">Training Records</a></li>
                            <li><a href="../html/training_effectiveness_evaluation.html">Effectiveness Evaluation</a></li>
                        </ul>
                    </li>
                    <li class="menu-item has-children">
                        <a href="javascript:void(0)" onclick="toggleSubmenu(this)">Performance Management</a>
                        <ul class="submenu">
                            <li><a href="../html/performance_management_system.html?section=kpiSetup">KPI Setup</a></li>
                             <li><a href="../html/performance_management_system.html?section=performanceReview">Performance Review</a></li>
                            <li><a href="../html/performance_management_system.html?section=viewReviews">Review Records</a></li>
                           
                 
                        </ul>
                    </li>
                </ul>
            </div>
        `;

        sidebarContainer.innerHTML = sidebarHTML;
    }
}

window.addEventListener('load', loadSidebar);