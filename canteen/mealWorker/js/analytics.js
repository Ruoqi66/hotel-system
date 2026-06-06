function loadAnalytics() {
    const feedbackList = JSON.parse(localStorage.getItem("customerFeedbacks")) || [];

    const feedbackListContainer = document.getElementById("feedbackList");
    if (feedbackListContainer) {
        feedbackListContainer.innerHTML = "";

        if (feedbackList.length === 0) {
            feedbackListContainer.innerHTML = `<p style="color: #999;">No customer review data available</p>`;
        } else {
            feedbackList.forEach(item => {
                const foodStarsStr = "⭐".repeat(item.foodStars);
                const tagsStr = item.tags.length > 0 ? ` [${item.tags.join(' | ')}]` : '';

                feedbackListContainer.innerHTML += `
                    <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #eee;">
                        <p><strong>${foodStarsStr}</strong> <span style="color: #7f8c8d; font-size: 13px;">(${item.name} - Room: ${item.room})</span></p>
                        <p style="margin-top: 5px; color: #34495e;">"${item.text}" <span style="color: #3498db; font-size: 13px;">${tagsStr}</span></p>
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
        preferenceEl.innerText = `Most customer impression: "${topTag}"`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
});