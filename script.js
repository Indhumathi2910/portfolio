document.addEventListener('DOMContentLoaded', () => {

    // --- Global Theme & Accent Color Management ---
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const colorBoxes = document.querySelectorAll('.color-box');
    const accentColorsLight = {
        orange: 'rgba(255, 140, 0, 1)', // Default light
        red: 'rgba(255, 69, 0, 1)',
        blue: '#094684ff',
        green: '#064e26ff',
        pink: '#4e0d2eff'
    };
    const accentColorsDark = {
        orange: '#ff69b4', // Default dark (can be different or same)
        red: '#ff6347',
        blue: '#87cefa',
        green: '#90ee90',
        pink: '#ffb6c1'
    };

    let currentAccent = localStorage.getItem('atlasAccentColor') || 'orange'; // Store chosen accent
    let currentTheme = localStorage.getItem('atlasTheme') || 'light-theme'; // Store chosen theme

    // Function to update CSS variables for theme
    function applyTheme() {
        body.className = ''; // Clear existing theme classes
        body.classList.add(currentTheme);

        // Update main accent color
        const accentColorMap = currentTheme === 'light-theme' ? accentColorsLight : accentColorsDark;
        const colorValue = accentColorMap[currentAccent] || accentColorMap.orange; // Fallback to orange
        body.style.setProperty('--accent-color', colorValue);

        // Calculate RGB components for transparent backgrounds (e.g., nav hover)
        // Convert hex to rgb
        let r = parseInt(colorValue.substring(1, 3), 16);
        let g = parseInt(colorValue.substring(3, 5), 16);
        let b = parseInt(colorValue.substring(5, 7), 16);
        body.style.setProperty('--accent-color-rgb', `${r}, ${g}, ${b}`);

        // Update active color box highlight
        colorBoxes.forEach(box => {
            box.classList.remove('active');
            if (box.dataset.color === colorValue || (currentAccent === box.classList[1])) {
                 // Check if the color value or the stored accent name matches
                box.classList.add('active');
            }
        });
    }

    // Function to change accent color
    function changeAccentColor(colorName, hexValue) {
        currentAccent = colorName;
        localStorage.setItem('atlasAccentColor', currentAccent);
        applyTheme(); // Reapply theme to update accent
    }

    // Initialize theme and accent on load
    applyTheme();

    // --- Dark/Light Mode Toggle ---
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                currentTheme = 'dark-theme';
            } else {
                currentTheme = 'light-theme';
            }
            localStorage.setItem('atlasTheme', currentTheme);
            applyTheme(); // Reapply theme
        });
    }

    // --- Theme Color Switcher ---
    colorBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const hex = box.dataset.color;
            const colorName = box.classList[1]; // e.g., 'orange', 'red'
            changeAccentColor(colorName, hex);
        });
    });


    // --- Settings Panel Toggle ---
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsContent = document.getElementById('settingsContent');
    if (settingsToggle && settingsContent) {
        settingsToggle.addEventListener('click', () => {
            settingsContent.classList.toggle('open');
            settingsToggle.querySelector('i').classList.toggle('fa-spin'); // Add spin effect
        });
        // Close if click outside
        document.addEventListener('click', (event) => {
            if (!settingsContent.contains(event.target) && !settingsToggle.contains(event.target) && settingsContent.classList.contains('open')) {
                settingsContent.classList.remove('open');
                settingsToggle.querySelector('i').classList.remove('fa-spin');
            }
        });
    }

    // --- Typed.js for Home Section Heading ---
    const typedTextElement = document.querySelector('.typed-text');
    if (typedTextElement) {
        new Typed(typedTextElement, {
            strings: ["Youtuber", "Web Designer", "Freelancer", "Photographer"], // From Image 5
            typeSpeed: 70,
            backSpeed: 30,
            loop: true,
            showCursor: true,
            cursorChar: '|',
        });
    }

    // --- Smooth Scroll for Navigation Links ---
    const navLinks = document.querySelectorAll('#navbar ul li a');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Scroll to the top of the section
                });

                // Update active class immediately for better UX
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // --- Highlight Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section');
    function highlightNavLinkOnScroll() {
        let currentActiveSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust offset as needed
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentActiveSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentActiveSection)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLinkOnScroll);
    highlightNavLinkOnScroll(); // Call on load to set initial active link

    // --- Animate Skill Bars on Scroll (Intersection Observer) ---
    const skillBars = document.querySelectorAll('.skill-item .progress-bar');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('aria-valuenow') + '%';
                progressBar.style.width = width;
                observer.unobserve(progressBar); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.7 // Trigger when 70% of the item is visible
    });

    skillBars.forEach(bar => {
        bar.style.width = '0%'; // Initialize width to 0
        observer.observe(bar);
    });

});
