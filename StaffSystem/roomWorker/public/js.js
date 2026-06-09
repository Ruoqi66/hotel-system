fetch('../public/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
        })
        .catch(error => console.error('加载Header失败:', error));