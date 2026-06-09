function loadAnalytics() {
    const feedbackList = JSON.parse(localStorage.getItem("customerFeedbacks")) || [];

    const feedbackListContainer = document.getElementById("feedbackList");
    if (feedbackListContainer) {
        feedbackListContainer.innerHTML = "";

        if (feedbackList.length === 0) {
            feedbackListContainer.innerHTML = `<div class="empty-feedback">No customer review data available</div>`;
        } else {
            feedbackList.forEach(item => {
                const foodStarsStr = "⭐".repeat(item.foodStars);
                const tagsStr = item.tags.length > 0 ? item.tags.map(tag => `<span class="feedback-tag">${tag}</span>`).join('') : '';

                feedbackListContainer.innerHTML += `
                    <div class="feedback-item">
                        <div class="feedback-header">
                            <span class="feedback-stars">${foodStarsStr}</span>
                            <span class="feedback-info">${item.name} - Room: ${item.room}</span>
                        </div>
                        <p class="feedback-text">"${item.text}"</p>
                        <div class="feedback-tags">${tagsStr}</div>
                    </div>
                `;
            });
        }
    }

    const bestsellerEl = document.getElementById("bestseller");
    const preferenceEl = document.getElementById("preference");

    if (bestsellerEl) bestsellerEl.innerText = "Signature Roast Duck";
    if (preferenceEl && feedbackList.length > 0) {
        let tagCounts = {};
        feedbackList.forEach(fb => fb.tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
        let topTag = Object.keys(tagCounts).reduce((a, b) => tagCounts[a] > tagCounts[b] ? a : b, "Elegant Environment");
        preferenceEl.innerText = `"${topTag}"`;
    }
}

function createChart() {
    const ctx = document.getElementById('orderTrendChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Orders',
                    data: [45, 52, 38, 61, 78, 95, 82],
                    borderColor: 'rgba(79, 172, 254, 1)',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4facfe',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
    createChart();
});