        let trainingPlans = JSON.parse(localStorage.getItem("trainingPlans") || "[]");
        let currentFilter = 'all';

        document.getElementById("trainingPlanForm").addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = {
                id: Date.now(),
                planName: document.getElementById("planName").value,
                trainingType: document.getElementById("trainingType").value,
                trainingContent: document.getElementById("trainingContent").value,
                startDate: document.getElementById("startDate").value,
                endDate: document.getElementById("endDate").value,
                trainingTime: document.getElementById("trainingTime").value,
                duration: document.getElementById("duration").value,
                location: document.getElementById("location").value,
                trainer: document.getElementById("trainer").value,
                maxParticipants: document.getElementById("maxParticipants").value,
                targetDepartment: document.getElementById("targetDepartment").value,
                prerequisites: document.getElementById("prerequisites").value,
                budget: document.getElementById("budget").value,
                description: document.getElementById("description").value,
                status: "Planned",
                enrolledCount: 0,
                createdAt: new Date().toISOString()
            };

            if (new Date(formData.endDate) < new Date(formData.startDate)) {
                alert("End date cannot be earlier than start date!");
                return;
            }

            trainingPlans.push(formData);
            localStorage.setItem("trainingPlans", JSON.stringify(trainingPlans));

            alert("Training plan created successfully!");
            this.reset();
            displayPlans();
        });

               function displayPlans(plansToShow = null) {
            const container = document.getElementById("plansListContainer");
            container.innerHTML = "";

            let plans = plansToShow || trainingPlans;

            if (currentFilter !== 'all') {
                plans = plans.filter(plan => plan.status === currentFilter);
            }

            if (plans.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 30px; color: #666; font-size: 16px;">No training plans found</div>';
                return;
            }

            plans.forEach(plan => {
                const card = document.createElement("div");
                card.style.cssText = `                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    align-items: start;
                `;

                 card.innerHTML = `                    <div><strong style="color: #3e6e9e;">Plan Name:</strong><br>${plan.planName}</div>
                    <div><strong style="color: #3e6e9e;">Type:</strong><br>${plan.trainingType}</div>
                    <div><strong style="color: #3e6e9e;">Trainer:</strong><br>${plan.trainer}</div>
                    <div><strong style="color: #3e6e9e;">Location:</strong><br>${plan.location}</div>
                    <div><strong style="color: #3e6e9e;">Period:</strong><br>${formatDate(plan.startDate)} to ${formatDate(plan.endDate)}</div>
                    <div><strong style="color: #3e6e9e;">Participants:</strong><br>${plan.enrolledCount}/${plan.maxParticipants}</div>
                    <div><strong style="color: #3e6e9e;">Status:</strong><br><span>${plan.status}</span></div>
                `;

                container.appendChild(card);
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