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

function renderMenu() {
    const tableBody = document.getElementById("menuTable");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    for (const [dishName, price] of Object.entries(mealPrice)) {
        tableBody.innerHTML += `
            <tr>
                <td>${dishName}</td>
                <td>${price}</td>
                <td>
                    <button class="btn-primary" onclick="editDish('${dishName}', ${price})">Edit</button>
                    <button class="btn-danger" onclick="removeDish('${dishName}')">Remove</button>
                </td>
            </tr>
        `;
    }
}

function addDish() {
    const name = prompt("Enter new dish name:");
    const price = prompt("Enter price:");
    if (name && price) {
        mealPrice[name] = parseFloat(price);
        renderMenu();
    }
}

function editDish(name, oldPrice) {
    const newPrice = prompt(`Edit price for ${name}:`, oldPrice);
    if (newPrice) {
        mealPrice[name] = parseFloat(newPrice);
        renderMenu();
    }
}

function removeDish(name) {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
        delete mealPrice[name];
        renderMenu();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});
