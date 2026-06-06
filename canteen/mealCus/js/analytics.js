let selectedTags = [];

function toggleTag(element) {
    element.classList.toggle('active');
    const tagText = element.innerText;

    if (element.classList.contains('active')) {
        selectedTags.push(tagText);
    } else {
        selectedTags = selectedTags.filter(tag => tag !== tagText);
    }
}

function submitFeedback(event) {
    event.preventDefault();

    const ratingFood = document.getElementById('rating-food').value;
    const ratingService = document.getElementById('rating-service').value;
    const roomNumber = document.getElementById('room-number').value.trim();
    const guestName = document.getElementById('guest-name').value.trim();
    const suggestions = document.getElementById('suggestions').value.trim();

    const feedbackItem = {
        id: "FB" + Date.now(),
        foodStars: parseInt(ratingFood),
        serviceStars: parseInt(ratingService),
        tags: [...selectedTags],
        room: roomNumber || "Not provided",
        name: guestName || "Anonymous Guest",
        text: suggestions,
        date: new Date().toLocaleDateString()
    };

    let feedbackList = JSON.parse(localStorage.getItem("customerFeedbacks")) || [];
    feedbackList.unshift(feedbackItem); // New feedback appears first
    localStorage.setItem("customerFeedbacks", JSON.stringify(feedbackList));

    alert("Thank you for your valuable feedback! Your review has been submitted successfully.");

    event.target.reset();
    document.querySelectorAll('.feedback-tag').forEach(tag => tag.classList.remove('active'));
    selectedTags = [];

    return false;
}