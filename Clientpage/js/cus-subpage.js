let currentFeatured = 0;
let isAnimating = false;

document.addEventListener('DOMContentLoaded', function() {
    const featuredTrack = document.getElementById('featuredTrack');
    const featuredItems = document.querySelectorAll('.featured-item');
    const featuredProgressFill = document.getElementById('featuredProgressFill');
    const featuredProgressText = document.getElementById('featuredProgressText');
    const header = document.querySelector('header');

    function updateFeatured() {
        if (!featuredTrack || featuredItems.length === 0) return;
        
        const itemWidth = featuredItems[0].offsetWidth;
        const gap = 180;
        const containerPadding = 100;
        const centerOffset = (window.innerWidth - itemWidth) / 2 - containerPadding;
        const maxOffset = -(featuredItems.length - 1) * (itemWidth + gap) + centerOffset;
        const offset = Math.max(maxOffset, centerOffset - (currentFeatured * (itemWidth + gap)));
        
        featuredTrack.classList.add('animating');
        featuredTrack.style.transform = `translateX(${offset}px)`;

        featuredItems.forEach((item, index) => {
            item.classList.remove('active', 'adjacent');
            if (index === currentFeatured) {
                item.classList.add('active');
            } else if (Math.abs(index - currentFeatured) === 1) {
                item.classList.add('adjacent');
            }
        });

        featuredProgressFill.style.width = `${((currentFeatured + 1) / featuredItems.length) * 100}%`;
        featuredProgressText.textContent = `${currentFeatured + 1}/${featuredItems.length}`;
        
        setTimeout(() => {
            featuredTrack.classList.remove('animating');
            isAnimating = false;
        }, 2500);
    }

    window.nextFeatured = function() {
        if (isAnimating) return;
        isAnimating = true;
        currentFeatured++;
        if (currentFeatured >= featuredItems.length) currentFeatured = 0;
        updateFeatured();
    };

    window.prevFeatured = function() {
        if (isAnimating) return;
        isAnimating = true;
        currentFeatured--;
        if (currentFeatured < 0) currentFeatured = featuredItems.length - 1;
        updateFeatured();
    };

    window.addEventListener('resize', updateFeatured);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    updateFeatured();
});
