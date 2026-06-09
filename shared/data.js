const ROOM_TYPES = {
    1: { id: 1, name: 'Deluxe Twin Room', price: 1300, img: 'seaRoomDouble.jpg', desc: 'Spacious, bright and cozy standard double room with full amenities and soft bedding.' },
    2: { id: 2, name: 'Deluxe King Room', price: 1200, img: 'seaRoomJunior.jpg', desc: 'Ideal for long trips, this spacious suite is bright and airy.' },
    3: { id: 3, name: 'Ocean‑view Room', price: 2200, img: 'seaRoomRound.png', desc: 'Boast 270° sea-view floor-to-ceiling windows and a cozy sunken lounge.' },
    4: { id: 4, name: 'Pool Suite', price: 3700, img: 'seaRoomPool.png', desc: 'Experience supreme luxury with private terrace and heated pool.' },
    5: { id: 5, name: 'Presidential Suite', price: 18888, img: 'seaRoomPresident.png', desc: 'Luxurious presidential suite with superb views and premium facilities.' }
};

const ROOM_TYPE_NAME_TO_ID = {};
for (const key in ROOM_TYPES) {
    ROOM_TYPE_NAME_TO_ID[ROOM_TYPES[key].name] = parseInt(key);
}

const ROOM_ASSIGNMENTS = {
    1: ['101', '104'],
    2: ['102', '105'],
    3: ['103', '106'],
    4: ['201', '202'],
    5: ['301', '203']
};

const ALL_ROOMS = [];
for (const typeId in ROOM_ASSIGNMENTS) {
    ROOM_ASSIGNMENTS[typeId].forEach(roomNo => {
        ALL_ROOMS.push({
            roomNo: roomNo,
            roomTypeId: parseInt(typeId),
            roomTypeName: ROOM_TYPES[typeId].name,
            price: ROOM_TYPES[typeId].price
        });
    });
}

const ROOM_IMAGES_CUS = {
    1: '../picture/seaRoomDouble.jpg',
    2: '../picture/seaRoomJunior.jpg',
    3: '../picture/seaRoomRound.png',
    4: '../picture/seaRoomPool.png',
    5: '../picture/seaRoomPresident.png'
};

function getBookings() {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
}

function saveBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function getFeedbacks() {
    return JSON.parse(localStorage.getItem('feedbacks') || '[]');
}

function saveFeedbacks(feedbacks) {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

function getServices() {
    return JSON.parse(localStorage.getItem('services') || '[]');
}

function saveServices(services) {
    localStorage.setItem('services', JSON.stringify(services));
}

function getFees() {
    return JSON.parse(localStorage.getItem('fees') || '[]');
}

function saveFees(fees) {
    localStorage.setItem('fees', JSON.stringify(fees));
}

function getCustomers() {
    return JSON.parse(localStorage.getItem('customers') || '[]');
}

function saveCustomers(customers) {
    localStorage.setItem('customers', JSON.stringify(customers));
}

function generateBookingNo(id) {
    return 'BK' + String(id).slice(-6);
}

function getStatusText(status) {
    const map = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'checked-in': 'Checked In',
        'checked-out': 'Completed',
        'cancelled': 'Cancelled'
    };
    return map[status] || status;
}

function getStatusClass(status) {
    const map = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'checked-in': 'status-confirmed',
        'checked-out': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return map[status] || 'status-pending';
}

function getRoomStatus(roomNo) {
    const bookings = getBookings();
    const today = new Date().toISOString().split('T')[0];

    const activeBooking = bookings.find(b =>
        b.status !== 'cancelled' &&
        b.roomNo === roomNo &&
        b.checkInDate <= today &&
        b.checkOutDate >= today
    );

    if (activeBooking) {
        if (activeBooking.status === 'checked-in') return 'occupied';
        if (activeBooking.status === 'confirmed') return 'booked';
        return 'booked';
    }

    return 'vacant';
}

function updateCustomerInfo(booking) {
    const customers = getCustomers();
    const existing = customers.find(c => c.phone === booking.phone);
    if (existing) {
        existing.checkInTimes = (existing.checkInTimes || 0) + 1;
        existing.lastVisit = booking.checkInDate;
        if (!existing.roomTypes.includes(booking.roomTypeName)) {
            existing.roomTypes.push(booking.roomTypeName);
        }
    } else {
        customers.push({
            id: Date.now(),
            name: booking.name,
            phone: booking.phone,
            membership: 'Regular Member',
            checkInTimes: 1,
            lastVisit: booking.checkInDate,
            roomTypes: [booking.roomTypeName],
            preferences: ''
        });
    }
    saveCustomers(customers);
}
