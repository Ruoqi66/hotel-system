const mealPrice = {
    "红烧肉": 56,
    "烤鸭": 128,
    "沙拉": 34,
    "番茄鸡蛋汤": 36,
    "双人套餐A": 198

}

function getOrder() {
    let orderList = JSON.parse(localStorage.getItem("orderList"));
    let table = document.getElementById("orderTable");

    table.innerHTML = ""
    orderList.forEach(order => {
        table.innerHTML += `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.dinerType}</td>
                <td>${order.dishes}</td>
                <td><button>Edit</button>
                    <button>Cancel</button>
                </td>               
            </tr>
        `;
    })
}

getOrder();
setInterval(getOrder, 1000);

function calculatePrice() {
    let orderList = JSON.parse(localStorage.getItem("orderList")) || [];
    let payNum = document.getElementById("payNumber").value + "号桌";
    let total = 0;
    let tableOrders = orderList.filter(order => {
        return order.dinerType === payNum;
    });
    tableOrders.forEach(order => {
        let dishArr = order.dishes.split("、");
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
    let cost = total - discount - coupon;
    document.getElementById("billPrice").innerText = total;
    document.getElementById("dis").innerText = discount;
    document.getElementById("cou").innerText = coupon;
    document.getElementById("finalCost").innerText = cost;

}

function switchSection(targetId) {
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active');
    });

    const target = document.getElementById(targetId);
    if (target) {
        target.classList.add('active');
    }
    if (targetId === "payment") {
        calculatePrice();
    }
}

document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', function (e) {
        const id = this.getAttribute('href').substring(1);
        switchSection(id);
    });
});
switchSection('order-management');