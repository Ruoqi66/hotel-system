document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.querySelector(".booking-form");

    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;
            const guests = document.getElementById("guests").value;

            const bookingData = {
                date,
                time,
                guests,
                createdAt: new Date().toLocaleString()
            };

            let bookingList = JSON.parse(localStorage.getItem("bookingList")) || [];
            bookingList.push(bookingData);
            localStorage.setItem("bookingList", JSON.stringify(bookingList));

            alert(`Booking confirmed!\nDate: ${date}\nTime: ${time}\nGuests: ${guests} people`);
            bookingForm.reset();
        });
    }
});