function getCode() {
    let chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let code = '';
    for(let i=0;i<4;i++){
        code += chars[Math.floor(Math.random()*chars.length)];
    }
    return code;
}
const codeBox = document.getElementById('codeBox');
const sendBtn = document.getElementById('sendBtn');
codeBox.textContent = getCode();
codeBox.onclick = ()=> codeBox.textContent = getCode();
sendBtn.onclick = ()=> codeBox.textContent = getCode();