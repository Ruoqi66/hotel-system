const mealPrice = {
    "红烧肉": 56,
    "烤鸭": 128,
    "沙拉": 34,
    "番茄鸡蛋汤": 36,
    "双人套餐A": 198

}

function orderMeal() {
    let checkbox = document.querySelectorAll("input[name=dish]:checked");
    let sum = 0;
    let select = [];
    checkbox.forEach((box) => {
        let name = box.value;
        select.push(name);
        sum += mealPrice[name];
    })
    document.getElementById("selectedItems").innerText = select.join("、") || "无";
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

    if (sum == 0) {
        alert("请先选择菜品！");
        return false;
    }
    let orderId = setId();
    let dinerType = document.querySelector("input[name=dining-type]:checked").value;
    let tableNumber
    if (dinerType === "dine-in") {
        tableNumber = document.getElementById("table").value + "号桌";
    } else {
        tableNumber = "外卖配送";
    }
    let order = {
        orderId: orderId,
        dinerType: tableNumber,
        dishes: selectDishes,
    }
    let orderList = JSON.parse(localStorage.getItem("orderList")) || [];
    orderList.push(order);
    localStorage.setItem("orderList", JSON.stringify(orderList));

    if (!confirm("确认要下单吗？总价：" + sum + "元")) {
        return false;
    } else {
        return true;
    }

}

function switchSection(targetId) {
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active');
    });

    const target = document.getElementById(targetId);
    if (target){
        target.classList.add('active');
    }
}

document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', function (e) {
        const id = this.getAttribute('href').substring(1);
        switchSection(id);
    });
});
switchSection('booking');
