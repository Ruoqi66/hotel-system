setTimeout(() => {
    function updateTime() {
        let now = new Date();
        let year = now.getFullYear();
        let month = (now.getMonth() + 1).toString().padStart(2, '0');
        let day = now.getDate().toString().padStart(2, '0');
        let h = now.getHours().toString().padStart(2, '0');
        let m = now.getMinutes().toString().padStart(2, '0');
        let s = now.getSeconds().toString().padStart(2, '0');

        document.getElementById("realTime").innerText =
            `📅 ${year}-${month}-${day} ${h}:${m}:${s}`;
    }
    updateTime();
    setInterval(updateTime, 1000);


    const ctx1 = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['06-01', '06-02', '06-03', '06-04', '06-05', '06-06', '06-07'],
            datasets: [{
                label: 'order quantity',
                data: [87, 95, 82, 88, 100, 79, 83],
                backgroundColor: '#409eff',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {legend: {display: false}},
            scales: {y: {beginAtZero: true}},
            animation: {
                duration: 3000,
                easing: 'easeOutBounce'
            }
        }
    });
    const ctx2 = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['reserved', 'Checked in', 'Checked out'],
            datasets: [{
                data: [80, 72, 6],
                backgroundColor: ['#e6a23c', '#67c23a', '#909399']
            }]
        },
        options: { responsive: true,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 3000,
                easing: 'easeOutCirc'
            }
        }
    });
    const ctx3 = document.getElementById('roomTypeChart').getContext('2d');
    new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: ['Deluxe King Room', 'Deluxe Twin Room', 'Ocean‑view Room', 'Pool Suite', 'Presidential Suite'],
            datasets: [{
                data: [30, 30, 20,15,5],
                backgroundColor: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#3056b3']
            }]
        },
        options: { responsive: true,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 3000,
                easing: 'easeOutBack'
            }
        }
    });
});
