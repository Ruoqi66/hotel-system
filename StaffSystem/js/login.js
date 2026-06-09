function handleLogin(){
    // 拿到值
    let username = document.getElementById("username").value.trim();
    if (!checkJ() || !checkP()) {
        return;
    }
    localStorage.setItem("username", username);
    window.location.href = "../html/afterLogin.html";
}
function update() {
    let dep_type = document.getElementById("dep_type");
    let specific_dep = document.getElementById("specific_dep");
    specific_dep.innerHTML = "";
    if(dep_type.value === "Guest"){
        specific_dep.innerHTML = " <option value=\"front office\" selected>Front office Department</option>\n" +
            "            <option value=\"housekeeping\">Housekeeping Department</option>\n" +
            "            <option value=\"restaurant and bar\">Restaurant and Bar Department</option>\n" +
            "            <option value=\"entertainment\">Entertainment Department</option>\n" +
            "            <option value=\"sales\">Sales Department</option>\n" +
            "            <option value=\"marketing\">Marketing Department</option>"
    }else if(dep_type.value === "Back"){
        specific_dep.innerHTML=" <option value=\"rugfinance\" selected>Finance Department</option>\n" +
            "            <option value=\"human resource\">Human resource Department</option>\n" +
            "            <option value=\"engineering\">Engineering Department</option>\n" +
            "            <option value=\"security\">Security Department</option>\n" +
            "            <option value=\"purchasing\">Purchasing Department</option>\n" +
            "            <option value=\"executive office\">Executive Office</option>"
    }
}
function checkJ(){
    let jobNumber=document.getElementById("job_number").value;
    const reg=/^202[2-7](01|02)(0[1-6])\d{3}$/;
    if(reg.test(jobNumber)===false){
        alert("The job number is wrong");
        return false; // 验证失败，返回 false
    }
    return true; // 验证成功，返回 true
    }
function checkP(){
    let password=document.getElementById("password").value;
    const reg = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(reg.test(password)===false){
        alert("The password is wrong");
        return false; // 验证失败，返回 false
    }
    return true; // 验证成功，返回 true
}
document.getElementById("login").addEventListener("submit",function (e) {
    e.preventDefault();
})