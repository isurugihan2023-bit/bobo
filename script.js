// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Dynamic Text in Discord Presence ---
const dynamicText = document.querySelector('.dp-dynamic-text');
const statuses = ["100+ SERVERS", "24/7 MUSIC", "PLAYING LOFI RADIO", "LISTENING TO COMMANDS"];
let statusIndex = 0;

setInterval(() => {
    dynamicText.style.opacity = 0;
    setTimeout(() => {
        statusIndex = (statusIndex + 1) % statuses.length;
        dynamicText.textContent = statuses[statusIndex];
        dynamicText.style.opacity = 1;
    }, 300);
}, 4000);

// --- Stat Counters Animation ---
const statElements = document.querySelectorAll('.stat-number');
const animateStats = () => {
    statElements.forEach(el => {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                // If it's a decimal number (like uptime)
                if (target % 1 !== 0) {
                    el.textContent = current.toFixed(2) + suffix;
                } else {
                    el.textContent = Math.ceil(current) + suffix;
                }
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target + suffix;
            }
        };
        updateCounter();
    });
};

// Trigger stats animation when scrolled into view
const statsSection = document.getElementById('stats');
let statsAnimated = false;

window.addEventListener('scroll', () => {
    if (statsAnimated) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
        animateStats();
        statsAnimated = true;
    }
});

// --- Scroll Reveal Animations ---
const reveals = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('visible');
        }
    }
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger once on load

// --- Real-time Bot Stats Sync ---
async function fetchBotStats() {
    try {
        const response = await fetch('http://prem-eu4.bot-hosting.net:21033/stats');
        if (!response.ok) return;
        const data = await response.json();
        
        // Make the bot look extremely popular (Fake Boost)
        data.servers = data.servers < 100 ? 100 : data.servers;
        data.members = data.members < 500 ? 500 : data.members;
        
        // Update Hero Chips
        document.getElementById('hero-servers').textContent = data.servers + '+';
        document.getElementById('hero-members').textContent = data.members.toLocaleString() + '+';
        document.getElementById('hero-uptime').textContent = data.uptime;
        // Update fake ping every 3 seconds to avoid flashing too fast
        if (!window.lastPingTime || Date.now() - window.lastPingTime > 3000) {
            window.lastFakePing = Math.floor(Math.random() * (50 - 38 + 1)) + 38 + 'ms';
            window.lastPingTime = Date.now();
        }
        document.getElementById('hero-ping').textContent = window.lastFakePing;

        // Update Big Stats section dynamically without breaking animation
        const serverStat = document.getElementById('server-count-stat');
        if (serverStat && serverStat.textContent !== '0' && serverStat.textContent !== '0+') {
            serverStat.textContent = data.servers + '+';
        }
        const userStat = document.getElementById('user-count-stat');
        if (userStat && userStat.textContent !== '0' && userStat.textContent !== '0+') {
            userStat.textContent = data.members.toLocaleString() + '+';
        }
        
        // Update About Section Ping Card
        const aboutPing = document.getElementById('about-ping');
        if (aboutPing) {
            aboutPing.textContent = window.lastFakePing;
        }
    } catch (e) {
        console.log("Could not fetch bot stats (is the bot running?)");
    }
}

fetchBotStats();
setInterval(fetchBotStats, 1000);
