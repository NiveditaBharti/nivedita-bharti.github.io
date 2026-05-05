// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            e.preventDefault();
            return;
        }
        const target = document.querySelector(href);
        if (!target) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Add active class to navigation links on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll(
    '.project-card, .skill-card, details.project-category-accordion, .contact-link, #journey-panel-quests .timeline-item, .story-block, .stat-card, .boss-card, .why-list'
);

function setupScrollAnimations() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const recruiter = document.body.classList.contains('mode-recruiter');

    animatedElements.forEach((el) => {
        el.style.transition = '';
        el.style.opacity = '';
        el.style.transform = '';
        observer.unobserve(el);
    });

    if (reduceMotion || recruiter) {
        animatedElements.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = el.classList.contains('timeline-item')
            ? 'translateX(-24px)'
            : 'translateY(28px)';
        observer.observe(el);
    });
}

setupScrollAnimations();

// Achievement counters — run once when Arcade Stats tab opens
let statsCountersDone = false;
function runAchievementCounters() {
    if (statsCountersDone) return;
    const grid = document.querySelector('#journey-panel-stats .achievements-grid');
    if (!grid) return;
    statsCountersDone = true;
    grid.querySelectorAll('.achievement-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 1600;
        const start = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

// PLAYER STATS section — animated counters
let playerStatsAnimated = false;
function runPlayerStatCounters() {
    if (playerStatsAnimated) return;
    const root = document.getElementById('player-stats');
    if (!root) return;
    playerStatsAnimated = true;
    root.querySelectorAll('.stat-counter').forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(eased * target);
            if (progress < 1) {
                el.textContent = String(val);
                requestAnimationFrame(tick);
            } else {
                el.textContent = String(Math.round(target)) + suffix;
            }
        }
        requestAnimationFrame(tick);
    });
}

const playerStatsSection = document.getElementById('player-stats');
if (playerStatsSection) {
    const statObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) runPlayerStatCounters();
            });
        },
        { threshold: 0.25 }
    );
    statObs.observe(playerStatsSection);
}

// Modal — open from project title, preview, or Architecture button
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.modal-close');
const projectsRoot = document.getElementById('projects');

function openProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.body.classList.add('game-paused');
    }
}

if (projectsRoot) {
    projectsRoot.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal]');
        if (!trigger) return;
        e.preventDefault();
        openProjectModal(trigger.getAttribute('data-modal'));
    });
    projectsRoot.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const trigger = e.target.closest('[data-modal]');
        if (!trigger) return;
        e.preventDefault();
        openProjectModal(trigger.getAttribute('data-modal'));
    });
}

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('game-paused');
        }
    });
});

window.addEventListener('click', (event) => {
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('game-paused');
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        document.body.classList.remove('game-paused');
    }
});


// Loadout Terminal tabs (Quests / Training / Stats)
(function journeyTabs() {
    const buttons = document.querySelectorAll('.journey-tab[data-journey-tab]');
    const panels = {
        quests: document.getElementById('journey-panel-quests'),
        training: document.getElementById('journey-panel-training'),
        stats: document.getElementById('journey-panel-stats')
    };
    if (!buttons.length || !panels.quests) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-journey-tab');
            buttons.forEach((b) => {
                const on = b === btn;
                b.classList.toggle('active', on);
                b.setAttribute('aria-selected', on);
            });
            Object.entries(panels).forEach(([key, panel]) => {
                if (!panel) return;
                const on = key === id;
                panel.hidden = !on;
                panel.classList.toggle('is-active', on);
            });
            if (id === 'stats') runAchievementCounters();
        });
    });
})();

// Skill HP bars — fill when branch opens or when Skill Tree scrolls into view
function fillSkillBars(root) {
    root.querySelectorAll('.skill-bar[data-level]').forEach((bar) => {
        const lv = bar.getAttribute('data-level');
        bar.style.setProperty('--bar-width', lv + '%');
        bar.classList.add('filled');
    });
}

const skillsSectionEl = document.getElementById('skills');
if (skillsSectionEl) {
    fillSkillBars(skillsSectionEl);
    let skillsBarsTriggered = false;
    const skillsObs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || skillsBarsTriggered) return;
                skillsBarsTriggered = true;
                fillSkillBars(skillsSectionEl);
            });
        },
        { threshold: 0.2 }
    );
    skillsObs.observe(skillsSectionEl);
}

// —— Start Game: terminal boot then scroll to Bio ——
(function startGameSequence() {
    const btn = document.getElementById('start-game-btn');
    const overlay = document.getElementById('terminal-boot');
    const linesEl = document.getElementById('terminal-boot-lines');
    if (!btn || !overlay || !linesEl) return;

    const lines = [
        '> Initializing Portfolio...',
        '> Loading Skills...',
        '> Loading Projects...',
        '> Ready.'
    ];

    btn.addEventListener('click', () => {
        if (document.body.classList.contains('mode-recruiter')) {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        overlay.hidden = false;
        overlay.classList.remove('is-hiding');
        overlay.setAttribute('aria-hidden', 'false');
        linesEl.textContent = '';
        let i = 0;

        function typeLine() {
            if (i >= lines.length) {
                setTimeout(() => {
                    overlay.classList.add('is-hiding');
                    setTimeout(() => {
                        overlay.hidden = true;
                        overlay.setAttribute('aria-hidden', 'true');
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 480);
                }, 320);
                return;
            }
            linesEl.textContent += (i > 0 ? '\n' : '') + lines[i];
            i++;
            setTimeout(typeLine, 520);
        }
        typeLine();
    });
})();

// —— Game / Recruiter mode ——
(function displayModeToggle() {
    const MODE_KEY = 'portfolio-display-mode';
    const toggle = document.getElementById('mode-toggle');
    const label = document.querySelector('.mode-toggle-label');
    if (!toggle) {
        document.body.classList.add('mode-recruiter');
        document.body.classList.remove('mode-game');
        setupScrollAnimations();
        return;
    }

    function applyMode(mode) {
        const recruiter = mode === 'recruiter';
        document.body.classList.toggle('mode-recruiter', recruiter);
        document.body.classList.toggle('mode-game', !recruiter);
        toggle.setAttribute('aria-pressed', recruiter ? 'true' : 'false');
        if (label) label.textContent = recruiter ? 'Recruiter Mode' : 'Game Mode';
        setupScrollAnimations();
        try {
            localStorage.setItem(MODE_KEY, mode);
        } catch (_) { /* ignore */ }
    }

    let initial = 'recruiter';
    try {
        const saved = localStorage.getItem(MODE_KEY);
        if (saved === 'recruiter' || saved === 'game') initial = saved;
    } catch (_) { /* ignore */ }
    applyMode(initial);

    toggle.addEventListener('click', () => {
        const next = document.body.classList.contains('mode-recruiter') ? 'game' : 'recruiter';
        applyMode(next);
    });
})();

// —— Subtle cursor glow (Game mode) ——
(function cursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || !window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    window.addEventListener(
        'mousemove',
        (e) => {
            if (!document.body.classList.contains('mode-game')) return;
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
                document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
            });
        },
        { passive: true }
    );
})();
