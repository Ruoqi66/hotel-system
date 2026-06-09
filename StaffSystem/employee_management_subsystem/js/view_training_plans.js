let trainingPlans = JSON.parse(localStorage.getItem("trainingPlans") || "[]");
let currentFilter = 'all';

function displayPlans(plansToShow = null) {
    const container = document.getElementById("plansListContainer");
    container.innerHTML = "";

    let plans = plansToShow || trainingPlans;

    if (currentFilter !== 'all') {
        plans = plans.filter(plan => plan.status === currentFilter);
    }

    if (plans.length === 0) {
        container.innerHTML = '<tr><td colspan="9" class="empty-message">No training plans found</td></tr>';
        return;
    }

    plans.forEach(plan => {
        const row = document.createElement("tr");

        row.innerHTML = `            <td>${plan.planName}</td>
            <td>${plan.trainingType}</td>
            <td>${plan.trainer}</td>
            <td>${plan.location}</td>
            <td>${formatDate(plan.startDate)}</td>
            <td>${formatDate(plan.endDate)}</td>
            <td>${plan.trainingTime}</td>
            <td>${plan.enrolledCount}/${plan.maxParticipants}</td>
            <td>${plan.status}</td>
        `;

        container.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
}

function searchPlans() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filtered = trainingPlans.filter(plan =>
        plan.planName.toLowerCase().includes(searchTerm) ||
        plan.trainingType.toLowerCase().includes(searchTerm) ||
        plan.trainer.toLowerCase().includes(searchTerm) ||
        plan.location.toLowerCase().includes(searchTerm)
    );
    displayPlans(filtered);
}

function filterByStatus(status) {
    currentFilter = status;
    displayPlans();
}

displayPlans();