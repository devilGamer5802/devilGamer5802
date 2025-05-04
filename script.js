// --- Theme Toggler ---
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggleButton.querySelector('i');

function setTheme(theme) {
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(theme + '-theme');
    if (theme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeToggleButton.title = "Switch to Dark Mode";
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeToggleButton.title = "Switch to Light Mode";
    }
    localStorage.setItem('portfolioTheme', theme);
}

themeToggleButton.addEventListener('click', () => {
    const isLightTheme = body.classList.contains('light-theme');
    setTheme(isLightTheme ? 'dark' : 'light');
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('portfolioTheme') || 'dark'; // Default dark
    setTheme(savedTheme);
    // Initialize Scroll Zoom
    setupScrollZoom();
});


// --- Scroll-Based Zoom for Hero Section ---
function setupScrollZoom() {
    const heroSection = document.getElementById('hero');
    const imageTarget = document.getElementById('hero-profile-zoom-target'); // Target IMG
    const detailsTarget = document.getElementById('hero-details-zoom-target'); // Target details DIV

    if (!heroSection || !imageTarget || !detailsTarget) {
        console.warn("Hero elements for scroll zoom not found. IDs: #hero, #hero-profile-zoom-target, #hero-details-zoom-target");
        return;
    }

    const maxZoom = 1.15; // 115% zoom
    const startZoomOffset = 0.1; // Start zoom slightly after entering section
    const endZoomOffset = 0.9; // End zoom slightly before leaving section
    let ticking = false;

    function applyZoom() {
        const viewportHeight = window.innerHeight;
        const sectionRect = heroSection.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;

        // Calculate effective scroll range within the section (considering offsets)
        const zoomStartPoint = sectionTop + sectionHeight * startZoomOffset - viewportHeight;
        const zoomEndPoint = sectionTop + sectionHeight * endZoomOffset - viewportHeight * startZoomOffset; // Adjust end based on view entry
        const scrollRange = zoomEndPoint - zoomStartPoint;

        // Current scroll relative to the start of the zoom range
        const currentScrollRelative = window.scrollY - (window.scrollY + zoomStartPoint);

        let scrollProgress = 0;
        if (scrollRange > 0) {
            scrollProgress = Math.max(0, Math.min(1, currentScrollRelative / scrollRange));
        }

        // Image zooms IN (scale increases) when scrolling UP (progress decreases from 1 to 0)
        const imageScale = 1 + (maxZoom - 1) * (1 - scrollProgress);

        // Details zoom IN (scale increases) when scrolling DOWN (progress increases from 0 to 1)
        const detailsScale = 1 + (maxZoom - 1) * scrollProgress;

        // Apply transforms only if section is somewhat visible
        if (sectionRect.bottom > 0 && sectionTop < viewportHeight) {
             imageTarget.style.transform = `scale(${imageScale.toFixed(3)})`; // Limit decimal places
             detailsTarget.style.transform = `scale(${detailsScale.toFixed(3)})`;
        } else {
            // Optionally reset scale when out of view - can prevent edge cases
             imageTarget.style.transform = 'scale(1)';
             detailsTarget.style.transform = 'scale(1)';
        }


        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(applyZoom);
            ticking = true;
        }
    }, { passive: true });

    // Initial application in case page loads scrolled
    applyZoom();
}
