  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-tabs button').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const navButtonMap = {
        'createEvaluation': 'navCreateEvaluation',
        'viewEvaluations': 'navViewEvaluations',
        'analytics': 'navAnalytics'
    };
    
    const activeTab = document.getElementById(navButtonMap[sectionId]);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    if (sectionId === 'viewEvaluations') {
        loadEvaluations();
    } else if (sectionId === 'analytics') {
        loadAnalytics();
    }
}

function initEventListeners() {
    document.getElementById('navCreateEvaluation').addEventListener('click', function() {
        showSection('createEvaluation');
    });
    
    document.getElementById('navViewEvaluations').addEventListener('click', function() {
        showSection('viewEvaluations');
    });
    
    document.getElementById('navAnalytics').addEventListener('click', function() {
        showSection('analytics');
    });
    
    document.getElementById('evalTraining').addEventListener('change', loadEnrolledEmployees);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.rating-stars').forEach(container => {
        const fieldName = container.dataset.rating;
        const stars = container.querySelectorAll('.star');
        const hiddenInput = document.getElementById(fieldName);

        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = this.dataset.value;
                hiddenInput.value = value;

                stars.forEach(s => {
                    s.classList.remove('active');
                    if (s.dataset.value <= value) {
                        s.classList.add('active');
                    }
                });
            });

            star.addEventListener('mouseenter', function() {
                const value = this.dataset.value;
                stars.forEach(s => {
                    s.style.color = s.dataset.value <= value ? '#ffc107' : '#ddd';
                });
            });
        });

        container.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                const currentValue = hiddenInput.value || 0;
                s.style.color = s.dataset.value <= currentValue ? '#ffc107' : '#ddd';
            });
        });
    });
});

        function loadTrainingPrograms() {
         const trainings = JSON.parse(localStorage.getItem('trainingPlans') || '[]');
        const select = document.getElementById('evalTraining');

        trainings.forEach(training => {
            const option = document.createElement('option');
            option.value = training.planName;
            option.textContent = `${training.planName} (${training.trainingType})`;
            select.appendChild(option);
        });
    }

    function loadEnrolledEmployees() {
        const trainingName = document.getElementById('evalTraining').value;
        const employeeSelect = document.getElementById('evalEmployee');

        employeeSelect.innerHTML = '<option value="">Select Employee</option>';

        if (!trainingName) return;

        const trainingRecords = JSON.parse(localStorage.getItem('trainingRecords') || '[]');
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');

        const attendedEmployees = trainingRecords
            .filter(record => record.trainingName === trainingName && record.attendance === 'Present')
            .map(record => record.employeeName);

        const uniqueEmployees = [...new Set(attendedEmployees)];

        uniqueEmployees.forEach(empName => {
            const emp = employees.find(e => e.name === empName);
            const option = document.createElement('option');
            option.value = empName;
            option.textContent = emp ? `${empName} - ${emp.department || 'N/A'} (${emp.position || 'N/A'})` : empName;
            employeeSelect.appendChild(option);
        });
    }


        document.getElementById('evaluationForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const contentRelevance = parseInt(document.getElementById('contentRelevance').value) || 0;
        const contentClarity = parseInt(document.getElementById('contentClarity').value) || 0;
        const contentDepth = parseInt(document.getElementById('contentDepth').value) || 0;
        const learningOutcome = parseInt(document.getElementById('learningOutcome').value) || 0;
        const applicability = parseInt(document.getElementById('applicability').value) || 0;
        const overallSatisfaction = parseInt(document.getElementById('overallSatisfaction').value) || 0;
        const recommendation = parseInt(document.getElementById('recommendation').value) || 0;

        if (contentRelevance === 0 || contentClarity === 0 || contentDepth === 0 ||
            learningOutcome === 0 || applicability === 0 || overallSatisfaction === 0 || recommendation === 0) {
            alert('Please rate all categories before submitting!');
            return;
        }

        const formData = {
            id: Date.now(),
            trainingName: document.getElementById('evalTraining').value,
            employeeName: document.getElementById('evalEmployee').value,
            evaluatorName: document.getElementById('evaluatorName').value,
            evaluatorRole: document.getElementById('evaluatorRole').value,
            contentRelevance: contentRelevance,
            contentClarity: contentClarity,
            contentDepth: contentDepth,
            learningOutcome: learningOutcome,
            applicability: applicability,
            overallSatisfaction: overallSatisfaction,
            recommendation: recommendation,
            strengths: document.getElementById('strengths').value,
            weaknesses: document.getElementById('weaknesses').value,
            suggestions: document.getElementById('suggestions').value,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        let evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
        evaluations.push(formData);
        localStorage.setItem('evaluations', JSON.stringify(evaluations));

        alert('Evaluation submitted successfully!');
        this.reset();
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
            star.style.color = '#ddd';
        });
    });



    function loadEvaluations() {
    const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
    const tbody = document.getElementById('evaluationsList');
    tbody.innerHTML = '';

    evaluations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    evaluations.forEach(eval => {
        const avgRating = calculateAverageRating(eval);
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${eval.trainingName}</td>
                <td>${eval.employeeName || 'N/A'}</td>
                <td>${eval.evaluatorName}</td>
                <td>${eval.evaluatorRole}</td>
                <td><span class="badge ${getRatingBadgeClass(avgRating)}">${avgRating.toFixed(1)} ★</span></td>
                <td>${eval.date}</td>
                <td>
                    <button class="nav-btn view-eval-btn" data-eval-id="${eval.id}">View Details</button>
                </td>
            `;

        tbody.appendChild(row);
    });

    document.querySelectorAll('.view-eval-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            viewEvaluationDetail(parseInt(this.dataset.evalId));
        });
    });
}

    function calculateAverageRating(eval) {
        const ratings = [
            eval.contentRelevance, eval.contentClarity, eval.contentDepth,
            eval.learningOutcome, eval.applicability, eval.overallSatisfaction,
            eval.recommendation
        ];
        return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    }

    function getRatingBadgeClass(rating) {
        if (rating >= 4.5) return 'badge-excellent';
        if (rating >= 3.5) return 'badge-good';
        if (rating >= 2.5) return 'badge-average';
        return 'badge-poor';
    }

    function viewEvaluationDetail(id) {
        const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
        const eval = evaluations.find(e => e.id === id);

        if (!eval) return;

    const detail = `Training Program: ${eval.trainingName}Employee: ${eval.employeeName || 'N/A'}
    Evaluator: ${eval.evaluatorName} (${eval.evaluatorRole})
    Date: ${eval.date}

    === Content Quality ===
    Relevance: ${eval.contentRelevance}/5 ★
    Clarity: ${eval.contentClarity}/5 ★
    Depth: ${eval.contentDepth}/5 ★

    === Learning Outcomes ===
    Skills Gained: ${eval.learningOutcome}/5 ★
    Applicability: ${eval.applicability}/5 ★

    === Overall ===
    Satisfaction: ${eval.overallSatisfaction}/5 ★
    Recommendation: ${eval.recommendation}/5 ★

    Average Rating: ${calculateAverageRating(eval).toFixed(1)}/5 ★

    Strengths:${eval.strengths || 'N/A'}
    Areas for Improvement:${eval.weaknesses || 'N/A'}
    Suggestions:${eval.suggestions || 'N/A'}        `;
        alert(detail);
    }

        function loadAnalytics() {
        const evaluations = JSON.parse(localStorage.getItem('evaluations') || '[]');
        const trainings = JSON.parse(localStorage.getItem('trainingPlans') || '[]');
            document.getElementById('totalEvaluations').textContent = evaluations.length;

        if (evaluations.length === 0) {
            document.getElementById('avgRating').textContent = '0.0';
            document.getElementById('excellentRate').textContent = '0%';
            document.getElementById('completionRate').textContent = '0%';
            return;
        }

        const allRatings = evaluations.map(e => calculateAverageRating(e));
        const avgRating = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
        document.getElementById('avgRating').textContent = avgRating.toFixed(1);

        const excellentCount = allRatings.filter(r => r >= 4).length;
        const excellentRate = (excellentCount / allRatings.length * 100).toFixed(0);
        document.getElementById('excellentRate').textContent = excellentRate + '%';

        const completedTrainings = new Set(evaluations.map(e => e.trainingName)).size;
        const totalTrainings = trainings.length || 1;
        const completionRate = (completedTrainings / totalTrainings * 100).toFixed(0);
        document.getElementById('completionRate').textContent = completionRate + '%';

        loadCategoryRatings(evaluations);
        loadProgramsRanking(evaluations);
        loadPerformanceMetrics(evaluations);
    }

    function loadCategoryRatings(evaluations) {
        const categories = [
            { key: 'contentRelevance', label: 'Content Relevance' },
            { key: 'contentClarity', label: 'Content Clarity' },
            { key: 'contentDepth', label: 'Content Depth' },
            { key: 'learningOutcome', label: 'Learning Outcome' },
            { key: 'applicability', label: 'Work Applicability' },
            { key: 'overallSatisfaction', label: 'Overall Satisfaction' },
            { key: 'recommendation', label: 'Recommendation Rate' }
        ];

        const container = document.getElementById('categoryRatings');
        container.innerHTML = '';

        categories.forEach(cat => {
            const values = evaluations.map(e => e[cat.key]);
            const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
            const percentage = (avg / 5 * 100).toFixed(0);

            const div = document.createElement('div');
            div.style.marginBottom = '15px';
            div.innerHTML = `                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${cat.label}</span>
                    <span><strong>${avg.toFixed(1)}</strong>/5.0</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function loadProgramsRanking(evaluations) {
        const programStats = {};

        evaluations.forEach(eval => {
            if (!programStats[eval.trainingName]) {
                programStats[eval.trainingName] = {
                    name: eval.trainingName,
                    totalRating: 0,
                    count: 0
                };
            }
            programStats[eval.trainingName].totalRating += calculateAverageRating(eval);
            programStats[eval.trainingName].count++;
        });

        const programs = Object.values(programStats).map(p => ({
            ...p,
            average: p.totalRating / p.count
        })).sort((a, b) => b.average - a.average);

        const tbody = document.getElementById('rankingList');
        tbody.innerHTML = '';

        programs.forEach((program, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `                <td>${index + 1}</td>
                <td>${program.name}</td>
                <td><strong>${program.average.toFixed(1)}</strong>/5.0</td>
                <td>${program.count}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(program.average / 5 * 100).toFixed(0)}%"></div>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function loadPerformanceMetrics(evaluations) {
        const metrics = {
            'Content Quality': ['contentRelevance', 'contentClarity', 'contentDepth'],
            'Learning Impact': ['learningOutcome', 'applicability'],
            'Overall Experience': ['overallSatisfaction', 'recommendation']
        };

        const container = document.getElementById('performanceMetrics');
        container.innerHTML = '';

        Object.entries(metrics).forEach(([category, keys]) => {
            const values = [];
            keys.forEach(key => {
                values.push(...evaluations.map(e => e[key]));
            });
            const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

            const div = document.createElement('div');
            div.style.marginBottom = '20px';
            div.innerHTML = `                <h4 style="margin-bottom: 10px; color: #333;">${category}</h4>
                <div style="font-size: 24px; font-weight: bold; color: #667eea; margin-bottom: 10px;">
                    ${avg.toFixed(1)}/5.0
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(avg / 5 * 100).toFixed(0)}%"></div>
                </div>
            `;
            container.appendChild(div);
        });
    }

       window.addEventListener('load', function() {
    initEventListeners();
    loadTrainingPrograms();
    showSection('createEvaluation');
});