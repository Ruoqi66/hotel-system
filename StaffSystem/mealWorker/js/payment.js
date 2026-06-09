const mealPrice = {
    // Main Courses
    "Braised Pork": 56,
    "Roast Duck": 128,
    "Spring Bamboo Shoots with White Shrimp": 68,
    "Black Truffle Steak": 168,
    "Pan-Seared Scallops": 76,
    "Caviar Wagyu Toast": 93,
    "Pan-Seared Cod": 68,
    "Boeuf bourguignon": 98,

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

function calculatePrice() {
    const payNumberEl = document.getElementById("payNumber");
    if (!payNumberEl) return;

    const orderList = JSON.parse(localStorage.getItem("orderList")) || [];
    // ✅ 修复：和存储里的格式完全一致
    const payNum = payNumberEl.value + " Table Number";
    let total = 0;

    const tableOrders = orderList.filter(order => order.dinerType === payNum);
    tableOrders.forEach(order => {
        const dishArr = order.dishes.split("、");
        dishArr.forEach(dish => {
            total += mealPrice[dish] || 0;
        });
    });

    let discount = 0;
    if (total > 80) {
        discount = 20;
    } else if (total > 50) {
        discount = 10;
    }

    let coupon = 0;
    if (total > 90) {
        coupon = 5;
    }

    const cost = total - discount - coupon;

    document.getElementById("billPrice").innerText = total;
    document.getElementById("dis").innerText = discount;
    document.getElementById("cou").innerText = coupon;
    document.getElementById("finalCost").innerText = cost;
}

// Process Payment Confirmation
function confirmPayment(event) {
    event.preventDefault();

    const payNumberEl = document.getElementById("payNumber");
    const finalCostEl = document.getElementById("finalCost");
    if (!payNumberEl || !finalCostEl) return;

    const tableNum = payNumberEl.value;
    // ✅ 修复：支付清台也要用正确的桌号文字
    const payNum = tableNum + " Table Number";
    const finalCost = finalCostEl.innerText;

    if (parseFloat(finalCost) <= 0) {
        alert(`There are no outstanding orders for 【Table ${tableNum}】, no payment required.`);
        return;
    }

    const paymentMethodSelect = document.querySelector('select[name="payment-method"]');
    const paymentMethodText = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;

    const isConfirmed = confirm(`Are you sure you want to checkout 【Table ${tableNum}】?\nPayment Method: ${paymentMethodText}\nAmount Paid: ¥${finalCost}`);

    if (isConfirmed) {
        let orderList = JSON.parse(localStorage.getItem("orderList")) || [];
        orderList = orderList.filter(order => order.dinerType !== payNum);
        localStorage.setItem("orderList", JSON.stringify(orderList));

        alert(`【Table ${tableNum}】Payment Successful! Invoice has been sent to print.`);
        calculatePrice();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    calculatePrice();
    const paymentForm = document.querySelector('#payment form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', confirmPayment);
    }
});