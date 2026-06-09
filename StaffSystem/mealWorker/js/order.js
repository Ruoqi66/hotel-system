const mealPrice = {
    // Main Courses
    "Braised Pork": 56,
    "Roast Duck": 128,
    "Spring Bamboo Shoots with White Shrimp": 68,
    "Black Truffle Steak": 168,
    "Pan-Seared Scallops": 76,
    "Caviar Wagyu Toast": 93,
    "Pan-Seared Cod": 68,
    "Boeuf bourguignon":98,

    // Starters
    "Salad": 34,
    "Crab Avocado Roll": 22,
    "Burrata Cheese Salad": 36,
    "Basil Foie Gras": 52,
    // Soups
    "French Cream of Mushroom Soup": 36,
    "Cantonese Slow-Cooked Soup": 66,
    "Peach Iced Soup": 42,
    // Desserts
    "Salmon Avocado Tart": 68,
    "Fig Goat Cheese": 56,
    // Combos
    "Single Set Meal": 268,
    "Double Set Meal": 362
};
function getOrder() {
    let orderList = JSON.parse(localStorage.getItem("orderList")) || [];
    let table = document.getElementById("orderTable");
    if (!table) return;

    table.innerHTML = "";

    if (orderList.length === 0) {
        table.innerHTML = `<tr><td colspan="4" style="color: #999;">No pending orders in the kitchen</td></tr>`;
        return;
    }

    orderList.forEach(order => {
        table.innerHTML += `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.dinerType}</td>
                <td>${order.dishes}</td>
                <td>
                    <button class="btn-primary" onclick="editOrder('${order.orderId}')">Edit</button>
                    <button class="btn-danger" onclick="cancelOrder('${order.orderId}')">Cancel</button>
                </td>               
            </tr>
        `;
    });
}

function cancelOrder(orderId) {
    if (confirm(`Are you sure you want to cancel order [${orderId}]? This action cannot be undone.`)) {
        let orderList = JSON.parse(localStorage.getItem("orderList")) || [];

        orderList = orderList.filter(order => order.orderId !== orderId);

        localStorage.setItem("orderList", JSON.stringify(orderList));
        getOrder();
    }
}

function editOrder(orderId) {
    let orderList = JSON.parse(localStorage.getItem("orderList")) || [];
    let currentOrder = orderList.find(order => order.orderId === orderId);

    if (!currentOrder) return;

    const newDishes = prompt(`Modifying order [${orderId}] details, please separate with "、":`, currentOrder.dishes);

    if (newDishes !== null && newDishes.trim() !== "") {
        currentOrder.dishes = newDishes.trim();

        localStorage.setItem("orderList", JSON.stringify(orderList));
        getOrder();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    getOrder();
    setInterval(getOrder, 1000);
});

window.addEventListener('DOMContentLoaded', () => {
    getOrder();
    setInterval(getOrder, 1000);
});