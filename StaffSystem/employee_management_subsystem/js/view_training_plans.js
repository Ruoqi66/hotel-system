let trainingPlans = JSON.parse(localStorage.getItem("trainingPlans") || "[]");
let currentFilter = 'all';

function getStatusBasedOnDate(plan) {
    const now = new Date();
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    
    if (now < startDate) {
        return 'Planned';
    } else if (now >= startDate && now <= endDate) {
        return 'Ongoing';
    } else {
        return 'Completed';
    }
}

function displayPlans(plansToShow = null) {
    const container = document.getElementById("plansListContainer");
    container.innerHTML = "";

    let plans = plansToShow || trainingPlans;

    if (currentFilter !== 'all') {
        plans = plans.filter(plan => getStatusBasedOnDate(plan) === currentFilter);
    }

    if (plans.length === 0) {
        container.innerHTML = '<tr><td colspan="9" class="empty-message">No training plans found</td></tr>';
        return;
    }

    plans.forEach(plan => {
        const row = document.createElement("tr");
        const status = getStatusBasedOnDate(plan);
        const statusClass = `status-badge status-${status.toLowerCase()}`;

        row.innerHTML = `            <td>${plan.planName}</td>
            <td>${plan.trainingType}</td>
            <td>${plan.trainer}</td>
            <td>${plan.location}</td>
            <td>${formatDate(plan.startDate)}</td>
            <td>${formatDate(plan.endDate)}</td>
            <td>${plan.trainingTime}</td>
            <td>${plan.enrolledCount}/${plan.maxParticipants}</td>
            <td><span class="${statusClass}">${status}</span></td>
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