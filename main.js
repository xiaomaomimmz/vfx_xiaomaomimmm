// Random Accent Colors
function setRandomAccentColor() {
  const accentColors = [
    { accent: '#4ade80', accent2: '#22c55e', accent3: '#16a34a', glow: 'rgba(74, 222, 128, 0.35)' }, // Green
    { accent: '#60a5fa', accent2: '#3b82f6', accent3: '#2563eb', glow: 'rgba(96, 165, 250, 0.35)' }, // Blue
    { accent: '#f472b6', accent2: '#ec4899', accent3: '#db2777', glow: 'rgba(244, 114, 182, 0.35)' }, // Pink
    { accent: '#fbbf24', accent2: '#f59e0b', accent3: '#d97706', glow: 'rgba(251, 191, 36, 0.35)' }, // Yellow
    { accent: '#a78bfa', accent2: '#8b5cf6', accent3: '#7c3aed', glow: 'rgba(167, 139, 250, 0.35)' }, // Purple
    { accent: '#f87171', accent2: '#ef4444', accent3: '#dc2626', glow: 'rgba(248, 113, 113, 0.35)' }, // Red
    { accent: '#34d399', accent2: '#10b981', accent3: '#059669', glow: 'rgba(52, 211, 153, 0.35)' }, // Teal
    { accent: '#fb923c', accent2: '#f97316', accent3: '#ea580c', glow: 'rgba(251, 146, 60, 0.35)' }  // Orange
  ];

  const randomColor = accentColors[Math.floor(Math.random() * accentColors.length)];
  const root = document.documentElement;

  root.style.setProperty('--accent', randomColor.accent);
  root.style.setProperty('--accent2', randomColor.accent2);
  root.style.setProperty('--accent3', randomColor.accent3);
  root.style.setProperty('--glow', randomColor.glow);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}

/* ==================== NAVBAR SCROLL ==================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Fix navigation links scroll behavior
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const navbarHeight = 68; // Navbar height
                const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetTop = elementTop - navbarHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileNavLinks = document.getElementById('navLinks');
                if (mobileNavLinks && mobileNavLinks.style.display === 'flex') {
                    mobileNavLinks.style.display = '';
                }
            }
        });
    });

    // Burger menu (mobile)
    const burger = document.getElementById('navBurger');
    const mobileNavLinks = document.getElementById('navLinks');
    if (burger && mobileNavLinks) {
        burger.addEventListener('click', () => {
            const open = mobileNavLinks.style.display === 'flex';
            mobileNavLinks.style.display = open ? '' : 'flex';
            mobileNavLinks.style.flexDirection = open ? '' : 'column';
            mobileNavLinks.style.position = open ? '' : 'fixed';
            mobileNavLinks.style.top = open ? '' : '68px';
            mobileNavLinks.style.left = open ? '' : '0';
            mobileNavLinks.style.right = open ? '' : '0';
            mobileNavLinks.style.background = open ? '' : 'rgba(11,12,16,0.97)';
            mobileNavLinks.style.padding = open ? '' : '12px 20px 20px';
            mobileNavLinks.style.backdropFilter = open ? '' : 'blur(20px)';
            mobileNavLinks.style.borderBottom = open ? '' : '1px solid rgba(255,255,255,0.07)';
            mobileNavLinks.style.zIndex = open ? '' : '899';
        });
    }
}

// ==================== 3D INTERACTIVE STARFIELD (WARP SPEED) ====================
function initStarfield() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    let stars = [];
    const count = 30;
    const initialDepth = 1000;

    let heroIsVisible = true;
    const observer = new IntersectionObserver((entries) => {
        heroIsVisible = entries[0].isIntersecting;
        canvas.style.display = heroIsVisible ? 'block' : 'none';
    }, { threshold: 0.01 });

    const heroSection = document.getElementById('hero');
    if (heroSection) observer.observe(heroSection);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let speedFactor = 1;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        targetX = w / 2;
        targetY = h / 2;
        mouseX = targetX;
        mouseY = targetY;
    }

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = (Math.random() - 0.5) * w * 2;
            this.y = (Math.random() - 0.5) * h * 2;
            this.z = Math.random() * initialDepth;
            this.pz = this.z;
        }

        update() {
            const dx = mouseX - w / 2;
            const dy = mouseY - h / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Ultra-warp speed basis (Faster than ever)
            const baseSpeed = 4.0 + (dist / (w / 2)) * 10;

            this.pz = this.z;
            this.z -= baseSpeed * speedFactor;

            if (this.z < 1) {
                this.reset();
                this.z = initialDepth;
                this.pz = this.z;
            }
            return baseSpeed;
        }

        draw(speed) {
            const driftX = (mouseX - w / 2) * 0.5;
            const driftY = (mouseY - h / 2) * 0.5;

            const x = ((this.x + driftX) / this.z) * 600 + w / 2;
            const y = ((this.y + driftY) / this.z) * 600 + h / 2;

            const px = ((this.x + driftX) / this.pz) * 600 + w / 2;
            const py = ((this.y + driftY) / this.pz) * 600 + h / 2;

            if (px > 0 && px < w && py > 0 && py < h) {
                const opacity = 1 - (this.z / initialDepth);
                const brightness = Math.min(1, speed / 5);
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
                const rgb = hexToRgb(accentColor);
                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * (0.6 + brightness * 0.4)})`;
                ctx.lineWidth = (1 + (1 - this.z / initialDepth) * 2) * (1 + brightness * 0.5);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    }

    function init() {
        resize();
        stars = Array.from({ length: count }, () => new Star());

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        window.addEventListener('resize', resize);
    }

    function animate() {
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;

        ctx.fillStyle = '#0b0c10';
        ctx.fillRect(0, 0, w, h);

        let currentSpeed = 0;
        stars.forEach(star => {
            currentSpeed = star.update();
            star.draw(currentSpeed);
        });

        if (!heroIsVisible) {
            requestAnimationFrame(animate);
            return;
        }

        // Extreme Lite dynamic star count: minimal baseline (30), suppressed max (400)
        const targetCount = Math.floor(30 + currentSpeed * 60);
        if (stars.length < targetCount && stars.length < 400) {
            for (let i = 0; i < 10; i++) stars.push(new Star());
        } else if (stars.length > targetCount && stars.length > 30) {
            stars.splice(0, 10);
        }

        requestAnimationFrame(animate);
    }

    init();
    animate();
}

// ==================== WORK PARALLAX (MID-LAYER) ====================
// ==================== WORKS SUBSET SLIDER ====================
// ==================== PREMIUM CARD PARALLAX ====================
function initPremiumParallax() {
    const cards = document.querySelectorAll('.work-card');

    const onScroll = () => {
        const viewportHeight = window.innerHeight;
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Check if card is visible
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Calculate position relative to center of screen (-1 to 1)
                const centerOffset = (rect.top + rect.height / 2) / viewportHeight - 0.5;

                const media = card.querySelector('video, img');
                if (media) {
                    // Apply subtle 3D-like offset (15% range)
                    const offset = centerOffset * 40; // Max 40px shift
                    media.style.transform = `scale(1.2) translateY(${offset}px)`;
                }
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial run
}

// ==================== LIGHTBOX ====================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const backdrop = document.getElementById('lightboxBackdrop');
    const closeBtn = document.getElementById('lightboxClose');
    const mediaContainer = document.getElementById('lightboxMedia');
    const metaContainer = document.getElementById('lightboxMeta');
    const cards = document.querySelectorAll('.work-card');

    let currentIdx = 0;
    const allVisibleCards = () => Array.from(document.querySelectorAll('.work-card'));

    const openIdx = (idx) => {
        const visible = allVisibleCards();
        if (idx < 0) idx = visible.length - 1;
        if (idx >= visible.length) idx = 0;
        currentIdx = idx;

        const card = visible[idx];
        const title = card.querySelector('h3').innerText;
        const videoSrc = card.querySelector('source') ? card.querySelector('source').src : null;
        const imgSrc = card.querySelector('img') ? card.querySelector('img').src : null;

        mediaContainer.innerHTML = '';
        if (videoSrc) {
            mediaContainer.innerHTML = `<video src="${videoSrc}" controls autoplay loop></video>`;
        } else if (imgSrc) {
            mediaContainer.innerHTML = `<img src="${imgSrc}" alt="${title}">`;
        }

        metaContainer.innerHTML = `<h3>${title}</h3>`;

        lightbox.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    cards.forEach((card) => {
        const btn = card.querySelector('.card-view-btn');
        btn.addEventListener('click', (e) => {
            const visible = allVisibleCards();
            openIdx(visible.indexOf(card));
        });
    });

    const close = () => {
        lightbox.classList.remove('open');
        backdrop.classList.remove('open');
        mediaContainer.innerHTML = '';
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    document.getElementById('lightboxPrev').addEventListener('click', () => openIdx(currentIdx - 1));
    document.getElementById('lightboxNext').addEventListener('click', () => openIdx(currentIdx + 1));
}

// ==================== SCROLL SPY (NAVBAR HIGHLIGHT) ====================
function initScrollSpy() {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        // Find all intersecting sections
        const visibleSections = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => entry.target);

        if (visibleSections.length > 0) {
            // Pick the section that has the highest scroll top relative to body
            // or effectively the "latest" in the stack
            const activeSection = visibleSections.reduce((prev, curr) => {
                return (curr.offsetTop > prev.offsetTop) ? curr : prev;
            });

            const id = activeSection.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    }, {
        threshold: 0.1,
        rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// ==================== SKILL BAR ANIMATION ====================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    setRandomAccentColor();
    initNavbar();
    initStarfield();
    initPremiumParallax();
    initLightbox();
    initScrollSpy();
    initWorksSlider();
    initSkillBars();
});

// ==================== WORKS SLIDER ARROWS ====================
function initWorksSlider() {
    const worksGrid = document.getElementById('worksGrid');
    const arrowLeft = document.getElementById('worksArrowLeft');
    const arrowRight = document.getElementById('worksArrowRight');
    
    if (!worksGrid || !arrowLeft || !arrowRight) return;
    
    const scrollAmount = 332;
    
    arrowLeft.addEventListener('click', () => {
        worksGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    arrowRight.addEventListener('click', () => {
        worksGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    initWorksParallax(worksGrid);
}

function initWorksParallax(worksGrid) {
    const cards = worksGrid.querySelectorAll('.work-card');
    
    const onScroll = () => {
        const gridRect = worksGrid.getBoundingClientRect();
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const media = card.querySelector('video, img');
            
            if (media) {
                const cardCenter = cardRect.left + cardRect.width / 2;
                const gridCenter = gridRect.left + gridRect.width / 2;
                const offset = (cardCenter - gridCenter) / gridRect.width * 30;
                
                media.style.transform = `scale(1.15) translateY(${offset}px)`;
            }
        });
    };
    
    worksGrid.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}
