// Dish price configuration table
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

function orderMeal() {
    let checkbox = document.querySelectorAll("input[name=dish]:checked");
    let sum = 0;
    let select = [];

    checkbox.forEach((box) => {
        let name = box.value;
        select.push(name);
        if (mealPrice[name]) {
            sum += mealPrice[name];
        }
    });

    document.getElementById("selectedItems").innerText = select.join("、") || "None";
    document.getElementById("totalPrice").innerText = sum;
}

function setId() {
    let localId = localStorage.getItem("id");
    if (!localId) {
        localId = 0;
    }
    let newId = parseInt(localId) + 1;
    localStorage.setItem("id", newId);
    return "NO." + newId.toString().padStart(3, "0");
}

function submitMeal() {
    let sum = document.getElementById("totalPrice").innerText;
    let selectDishes = document.getElementById("selectedItems").innerText;

    if (!sum || sum === 0) {
        alert("Please select dishes first!");
        return false;
    }

    if (!confirm("Confirm to place order? Total: " + sum + " Yuan")) {
        return false;
    }

    let orderId = setId();
    let dinerType = document.querySelector("input[name=dining-type]:checked").value;
    let tableNumber;

    if (dinerType === "dine-in") {
        tableNumber = "Table " + document.getElementById("table").value;
    } else {
        tableNumber = "Takeaway Delivery";
    }

    let order = {
        orderId: orderId,
        dinerType: tableNumber,
        dishes: selectDishes,
        price: sum
    };

    let orderList = JSON.parse(localStorage.getItem("orderList")) || [];
    orderList.push(order);
    localStorage.setItem("orderList", JSON.stringify(orderList));

    alert("Order placed successfully! Order No.: " + orderId);
    return true;
}