
window.addEventListener('load', function() {
    initFeedbackPage();
});

function initFeedbackPage() {
    const form = document.querySelector('.feedback-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitFeedback();
    });

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            submitFeedback();
        });
    }
}

function submitFeedback() {
    const form = document.querySelector('.feedback-form');
    if (!form) return;

    const nameInput = form.querySelector('input[placeholder="Please enter your name"]');
    const emailInput = form.querySelector('input[placeholder="example@mail.com"]');
    const typeSelect = form.querySelector('select');
    const orderInput = form.querySelector('input[placeholder="TH2024XXXX"]');
    const detailsTextarea = form.querySelector('textarea');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const type = typeSelect ? typeSelect.value : '';
    const orderNo = orderInput ? orderInput.value.trim() : '';
    const details = detailsTextarea ? detailsTextarea.value.trim() : '';

    if (!name) {
        alert('Please enter your name!');
        nameInput.focus();
        return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address!');
        if (emailInput) emailInput.focus();
        return;
    }
    if (!details) {
        alert('Please describe your feedback!');
        if (detailsTextarea) detailsTextarea.focus();
        return;
    }

    const feedback = {
        id: Date.now(),
        name: name,
        email: email,
        type: type,
        orderNo: orderNo,
        details: details,
        createdAt: new Date().toISOString(),
        status: 'unread'
    };

    const feedbacks = getFeedbacks();
    feedbacks.push(feedback);
    saveFeedbacks(feedbacks);

    alert('Thank you for your feedback! We will respond soon.');

    form.reset();
}
