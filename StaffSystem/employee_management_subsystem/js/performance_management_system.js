document.addEventListener('DOMContentLoaded', function() {
    loadEmployees();
    loadReviews();
    
    document.querySelectorAll('.rating-stars .star').forEach(star => {
        star.addEventListener('click', function() {
            const ratingGroup = this.parentElement;
            const ratingInputId = ratingGroup.dataset.rating;
            const value = this.dataset.value;
            
            ratingGroup.querySelectorAll('.star').forEach(s => {
                s.classList.remove('active');
                if (s.dataset.value <= value) {
                    s.classList.add('active');
                }
            });
            
            document.getElementById(ratingInputId).value = value;
        });
    });
    
    // 从URL参数获取要显示的section
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section && document.getElementById(section)) {
        showSectionFromUrl(section);
    }
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.nav-tabs button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showSectionFromUrl(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.nav-tabs button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 根据sectionId找到对应的按钮并激活
    const buttonMap = {
        'kpiSetup': 'KPI Setup',
        'performanceReview': 'Performance Review',
        'viewReviews': 'Review Records'
    };
    
    document.querySelectorAll('.nav-tabs button').forEach(btn => {
        if (btn.textContent.trim() === buttonMap[sectionId]) {
            btn.classList.add('active');
        }
    });
}

function loadEmployees() {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const selects = ['employeeSelect', 'reviewEmployee', 'filterEmployee'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            employees.forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = emp.name + ' - ' + emp.department;
                select.appendChild(option);
            });
        }
    });
}

document.getElementById('kpiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        id: Date.now(),
        employeeName: document.getElementById('employeeSelect').value,
        reviewPeriod: document.getElementById('reviewPeriod').value,
        kpis: {
            customerSatisfaction: { weight: parseInt(document.getElementById('kpi1_weight').value) },
            revenueGeneration: { weight: parseInt(document.getElementById('kpi2_weight').value) },
            serviceQuality: { weight: parseInt(document.getElementById('kpi3_weight').value) },
            teamCollaboration: { weight: parseInt(document.getElementById('kpi4_weight').value) },
            professionalDevelopment: { weight: parseInt(document.getElementById('kpi5_weight').value) }
        },
        okrs: {
            objective1: document.getElementById('objective1').value,
            kr1_1: document.getElementById('kr1_1').value,
            kr1_2: document.getElementById('kr1_2').value,
            objective2: document.getElementById('objective2').value,
            kr2_1: document.getElementById('kr2_1').value,
            kr2_2: document.getElementById('kr2_2').value
        },
        date: new Date().toISOString().split('T')[0]
    };
    
    let kpis = JSON.parse(localStorage.getItem('performanceKPIs') || '[]');
    kpis.push(formData);
    localStorage.setItem('performanceKPIs', JSON.stringify(kpis));
    alert('KPI settings saved!');
    this.reset();
});

document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        id: Date.now(),
        employeeName: document.getElementById('reviewEmployee').value,
        reviewPeriod: document.getElementById('reviewPeriodSelect').value,
        evaluationType: document.getElementById('evaluationType').value,
        reviewerName: document.getElementById('reviewerName').value,
        reviewerRole: document.getElementById('reviewerRole').value,
        kpiRatings: {
            customerSatisfaction: parseInt(document.getElementById('kpi1_rating').value) || 0,
            revenueGeneration: parseInt(document.getElementById('kpi2_rating').value) || 0,
            serviceQuality: parseInt(document.getElementById('kpi3_rating').value) || 0,
            teamCollaboration: parseInt(document.getElementById('kpi4_rating').value) || 0,
            professionalDevelopment: parseInt(document.getElementById('kpi5_rating').value) || 0
        },
        okrAchievement: {
            objective1: parseInt(document.getElementById('obj1_achievement').value) || 0,
            objective2: parseInt(document.getElementById('obj2_achievement').value) || 0
        },
        strengths: document.getElementById('strengths').value,
        areasForImprovement: document.getElementById('areasForImprovement').value,
        developmentPlan: document.getElementById('developmentPlan').value,
        overallComments: document.getElementById('overallComments').value,
        date: new Date().toISOString().split('T')[0]
    };
    
    let reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
    reviews.push(formData);
    localStorage.setItem('performanceReviews', JSON.stringify(reviews));
    alert('Review submitted!');
    this.reset();
    loadReviews();
});

function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
    const tbody = document.getElementById('reviewsList');
    tbody.innerHTML = '';
    
    if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No performance reviews found.</td></tr>';
        return;
    }
    
    reviews.forEach(review => {
        const avgScore = Math.round((
            review.kpiRatings.customerSatisfaction +
            review.kpiRatings.revenueGeneration +
            review.kpiRatings.serviceQuality +
            review.kpiRatings.teamCollaboration +
            review.kpiRatings.professionalDevelopment
        ) / 5);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${review.employeeName}</td>
            <td>${review.reviewPeriod}</td>
            <td>${review.evaluationType}</td>
            <td>${review.reviewerName}</td>
            <td>${avgScore}/5</td>
            <td>${review.date}</td>
            <td><button class="btn-secondary" onclick="viewReview(${review.id})">View</button></td>
        `;
        tbody.appendChild(row);
    });
}

function viewReview(id) {
    const reviews = JSON.parse(localStorage.getItem('performanceReviews') || '[]');
    const review = reviews.find(r => r.id === id);
    if (review) {
        alert(JSON.stringify(review, null, 2));
    }
}