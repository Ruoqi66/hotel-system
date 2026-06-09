
window.addEventListener('load', function() {
    initRecordsPage();
});

function initRecordsPage() {
    const container = document.querySelector('.records-container');
    if (!container) return;

    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-bar';
    searchDiv.style.cssText = 'display:flex;gap:15px;margin-bottom:25px;flex-wrap:wrap;align-items:center;';
    searchDiv.innerHTML = `
        <input type="text" id="searchRecords" placeholder="Search by name or phone...">
        <button id="searchBtn" class="btn-primary">Search</button>
        <button id="showAllBtn" class="btn-outline">Show All</button>
    `;
    container.insertBefore(searchDiv, container.firstChild);

    const searchInput = searchDiv.querySelector('#searchRecords');
    if (searchInput) {
        searchInput.style.cssText = 'flex:1;min-width:200px;padding:10px 15px;border:1px solid #ddd;border-radius:4px;font-size:14px;';
    }
    const buttons = searchDiv.querySelectorAll('button');
    buttons.forEach(btn => { btn.style.cssText = 'padding:10px 20px;'; });

    document.getElementById('searchBtn').addEventListener('click', function() {
        const keyword = document.getElementById('searchRecords').value.trim();
        loadRecords(keyword);
    });
    document.getElementById('showAllBtn').addEventListener('click', function() {
        document.getElementById('searchRecords').value = '';
        loadRecords('');
    });
    document.getElementById('searchRecords').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('searchBtn').click();
        }
    });

    loadRecords('');
}

function loadRecords(keyword) {
    const container = document.querySelector('.records-container');
    if (!container) return;

    const oldResults = container.querySelector('.records-results');
    if (oldResults) oldResults.remove();

    const bookings = getBookings();
    
    let filtered = bookings;
    if (keyword) {
        const kw = keyword.toLowerCase();
        filtered = bookings.filter(b =>
            b.name.toLowerCase().includes(kw) ||
            b.phone.includes(kw) ||
            (b.roomNo && b.roomNo.includes(kw))
        );
    }

    filtered.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));

    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'records-results';

    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<p class="no-records">No booking records found.</p>';
        const noRecEl = resultsDiv.querySelector('.no-records');
        if (noRecEl) noRecEl.style.cssText = 'text-align:center;color:#999;padding:40px;';
    } else {
        filtered.forEach(booking => {
            const card = createBookingCard(booking);
            resultsDiv.appendChild(card);
        });
    }

    container.appendChild(resultsDiv);
}

function createBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'booking-card';

    const statusClass = getStatusClass(booking.status);
    const statusText = getStatusText(booking.status);

    const roomImg = ROOM_IMAGES_CUS[booking.roomTypeId] || '../picture/seaRoomDouble.jpg';
    const bookingNo = generateBookingNo(booking.id);

    card.innerHTML = `
        <img src="${roomImg}" class="booking-thumb" alt="room">
        <div class="booking-info">
            <div class="info-main">
                <span class="status-badge ${statusClass}">${statusText}</span>
                <h3>${booking.roomTypeName || 'N/A'}</h3>
                <p><strong>Check-in Date:</strong> ${booking.checkInDate} to ${booking.checkOutDate}</p>
                <p><strong>Guest:</strong> ${booking.name} | ${booking.phone}</p>
                <p><strong>Booking No:</strong> ${bookingNo}</p>
                <p><strong>Room No:</strong> ${booking.roomNo || 'Pending'}</p>
                <p><strong>Breakfast:</strong> ${booking.breakfastIncluded ? 'incl. breakfast' : 'no breakfast'} | ${booking.nights} nights</p>
            </div>
            <div class="booking-actions">
                <span class="price-total">¥${(booking.totalPrice || 0).toLocaleString()}</span>
                ${booking.status === 'pending' ? 
                    '<a href="#" class="btn-cancel-booking" onclick="cancelMyBooking(' + booking.id + ');return false;">Cancel Booking</a>' : 
                    (booking.status === 'checked-out' ? 
                        '<a href="feedback.html" class="btn-feedback-link">Leave Review</a>' : 
                        '')}
            </div>
        </div>
    `;

    return card;
}

function cancelMyBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    let bookings = getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
        alert('Booking not found!');
        return;
    }

    bookings[bookingIndex].status = 'cancelled';
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert('Booking cancelled successfully!');
    const keyword = document.getElementById('searchRecords') ? document.getElementById('searchRecords').value.trim() : '';
    loadRecords(keyword);
}
