function updateCurrentTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    const timeStr = now.toLocaleString('zh-CN', options);
    const timeEl = document.getElementById('currentTime');
    if (timeEl) {
        timeEl.innerText = timeStr;
    }
}

function refreshCheckInOutPage() {
    let frm = document.getElementById("data");
    if (frm) {
        const currentSrc = frm.src;
        if (currentSrc.includes('check-in-out')) {
            console.log('Refreshing check-in-out page');
            frm.contentWindow.location.reload();
        }
    }
}

window.refreshCheckInOutPage = refreshCheckInOutPage;

window.addEventListener('storage', function(e) {
    if (e.key === 'bookingUpdated') {
        console.log('Booking updated detected in parent');
        refreshCheckInOutPage();
    }
});

window.onload = function () {
    // ===== 1. 更新当前时间 =====
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // ===== 2. 保留你原来的登录名显示 =====
    let name = localStorage.getItem("username");
    if (name && name.trim() !== "") {
        document.getElementById("showName").innerText = name;
    } else {
        document.getElementById("showName").innerText = "not log in";
    }

    // ===== 2. 菜单点击展开/收起（核心） =====
    // 全局函数，给 HTML 的 onclick="toggleSubmenu(this)" 调用
    window.toggleSubmenu = function (el) {
        let parentLi = el.parentElement;          // 当前 a 的父 li
        let submenu = parentLi.querySelector('ul'); // 找直接子 ul（二级/三级）

        if (submenu) {
            // 切换显示/隐藏
            let isHidden = (submenu.style.display === 'none' || submenu.style.display === '');
            submenu.style.display = isHidden ? 'block' : 'none';
        }

        // 获取链接地址并在iframe中打开
        let href = el.getAttribute('href');
        let frm = document.getElementById("data");
        
        if (frm && href && href !== 'javascript:void(0)' && href !== '#') {
            frm.src = href;
        }
    };

    // ===== 3. 页面加载：所有子菜单【默认全部隐藏】 =====
    document.querySelectorAll('.level2, .level3').forEach(ul => {
        ul.style.display = 'none';
    });

    // ===== 4. 普通菜单项（无子菜单）点击跳转 iframe =====
    let frm = document.getElementById("data");
    if (frm) {
        // 获取所有没有onclick属性的菜单链接
        document.querySelectorAll('.menu a:not([onclick])').forEach(a => {
            a.addEventListener('click', function (e) {
                let href = this.getAttribute('href');
                
                // 如果 href 是有效的链接（不是 javascript:void(0)）
                if (href && href !== 'javascript:void(0)' && href !== '#') {
                    e.preventDefault();
                    // 在 iframe 中打开页面
                    frm.src = href;
                }
            });
        });
    }
};