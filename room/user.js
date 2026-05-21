const roomPrice = {
    "标准间": 200,
    "豪华间": 350,
    "商务套房": 600
};

function createBookId(){
    let num = localStorage.getItem("bookId") || 0;
    num++;
    localStorage.setItem("bookId", num);
    return "BD" + String(num).padStart(3, "0");
}

function calcPrice(){
    let type = document.getElementById("userRoom").value;
    let inD = new Date(document.getElementById("inDate").value);
    let outD = new Date(document.getElementById("outDate").value);

    let day = Math.ceil((outD - inD) / (1000 * 60 * 60 * 24));
    if(day <= 0){
        alert("日期选择错误，请重新选择！");
        return;
    }
    let total = roomPrice[type] * day;
    document.getElementById("totalPrice").innerText = total;
}

function submitBook(){
    let name = document.getElementById("userName").value.trim();
    let phone = document.getElementById("userPhone").value.trim();
    let type = document.getElementById("userRoom").value;
    let inDate = document.getElementById("inDate").value;
    let outDate = document.getElementById("outDate").value;
    let price = document.getElementById("totalPrice").innerText;

    if(!name || !phone || !inDate || !outDate){
        alert("请填写完整预约信息！");
        return;
    }
    if(price === "0"){
        alert("请先点击「预估费用」");
        return;
    }

    let bookObj = {
        bookId: createBookId(),
        userName: name,
        userPhone: phone,
        roomType: type,
        inDate: inDate,
        outDate: outDate,
        total: price,
        status: "待酒店确认"
    };

    let bookArr = JSON.parse(localStorage.getItem("bookArr")) || [];
    bookArr.push(bookObj);
    localStorage.setItem("bookArr", JSON.stringify(bookArr));

    alert("预约成功！预约单号：" + bookObj.bookId);
    renderBook();
}

function renderBook(){
    let arr = JSON.parse(localStorage.getItem("bookArr")) || [];
    let wrap = document.getElementById("bookList");
    wrap.innerHTML = "";

    arr.forEach(item=>{
        wrap.innerHTML += `
        <table>
            <tr>
                <td width="120">预约单号</td>
                <td>${item.bookId}</td>
            </tr>
            <tr>
                <td>预约人</td>
                <td>${item.userName}</td>
            </tr>
            <tr>
                <td>房型</td>
                <td>${item.roomType}</td>
            </tr>
            <tr>
                <td>入住/退房</td>
                <td>${item.inDate} ～ ${item.outDate}</td>
            </tr>
            <tr>
                <td>应付金额</td>
                <td style="color:red;font-weight:bold;">¥${item.total}</td>
            </tr>
            <tr>
                <td>当前状态</td>
                <td>${item.status}</td>
            </tr>
        </table>
        <hr>
        `;
    })
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
switchSection('room-type');

renderBook();