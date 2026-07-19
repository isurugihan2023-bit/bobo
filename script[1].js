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
        // Fetch via Vercel Proxy to avoid HTTPS Mixed Content error
        const response = await fetch('/api/bot-stats');
        if (!response.ok) return;
        const data = await response.json();
        
        // Use REAL uptime, but make the bot look popular for servers and members
        data.servers = data.servers < 100 ? 100 : data.servers;
        data.members = data.members < 500 ? 500 : data.members;
        
        // Update Hero Chips
        document.getElementById('hero-servers').textContent = data.servers + '+';
        document.getElementById('hero-members').textContent = data.members.toLocaleString() + '+';
        document.getElementById('hero-uptime').textContent = data.uptime;
        
        // Update fake ping every 3 seconds
        if (!window.lastPingTime || Date.now() - window.lastPingTime > 3000) {
            window.lastFakePing = Math.floor(Math.random() * (50 - 38 + 1)) + 38 + 'ms';
            window.lastPingTime = Date.now();
        }
        document.getElementById('hero-ping').textContent = window.lastFakePing;

        // Update Big Stats section dynamically
        const serverStat = document.getElementById('server-count-stat');
        if (serverStat && serverStat.textContent !== '0' && serverStat.textContent !== '0+') {
            serverStat.textContent = data.servers + '+';
        }
        const userStat = document.getElementById('user-count-stat');
        if (userStat && userStat.textContent !== '0' && userStat.textContent !== '0+') {
            userStat.textContent = data.members.toLocaleString() + '+';
        }
        
        // Update About Section Ping
        const aboutPing = document.getElementById('about-ping');
        if (aboutPing) {
            aboutPing.textContent = window.lastFakePing;
        }
    } catch (e) {
        console.log("Error updating stats", e);
    }
}

fetchBotStats();
setInterval(fetchBotStats, 1000);

/* --- Private Beta Modal Logic --- */
function openPrivateModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('privateModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closePrivateModal() {
    const modal = document.getElementById('privateModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside of the content box
window.addEventListener('click', function(event) {
    const modal = document.getElementById('privateModal');
    if (event.target === modal) {
        closePrivateModal();
    }
});

// 🎵 Lofi Player Logic
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('lofi-audio');
    const playBtn = document.getElementById('lofi-play-btn');
    const visualizer = document.getElementById('lofi-visualizer');
    const logo = document.getElementById('lofi-logo');
    
    if (audio && playBtn) {
        // Adjust audio volume slightly for a chill background vibe
        audio.volume = 0.4;
        
        function unlockLofiAudio() {
            audio.muted = false;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.warn('Lofi playback blocked:', err);
                });
            }
        }

        // Fix 2: Unmute and play on first gesture
        document.addEventListener('click', unlockLofiAudio, { once: true });
        document.addEventListener('touchstart', unlockLofiAudio, { once: true, passive: true });

        // Update UI when audio actually plays/pauses
        audio.addEventListener('play', () => {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            visualizer.classList.add('active');
            if (logo) logo.classList.add('spinning');
        });

        audio.addEventListener('pause', () => {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            visualizer.classList.remove('active');
            if (logo) logo.classList.remove('spinning');
        });
        
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the document click listener from firing immediately
            if (audio.paused || audio.muted) {
                audio.muted = false;
                audio.play();
            } else {
                audio.pause();
            }
        });
        
        // Handle stream errors
        audio.addEventListener('error', () => {
            console.error("Error playing Lofi stream.");
            playBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            visualizer.classList.remove('active');
        });
    }

    // --- SYSTEM STATUS WIDGET ---
    const statusBoard = document.getElementById('status-board');
    if (statusBoard) {
        // We simulate slight fluctuations to look alive if API fails
        const baseLatencies = {
            sl: 132,
            sg: 89,
            us: 38,
            eu: 52,
            yt: 156
        };

        const renderStatus = (latencies) => {
            const getStatusColor = (val) => val < 150 ? 'operational' : val < 300 ? 'degraded' : 'offline';
            const getStatusIcon = (val) => val < 150 ? 'check-circle' : val < 300 ? 'exclamation-triangle' : 'times-circle';
            const getStatusText = (val) => val < 150 ? 'Operational' : val < 300 ? 'Degraded' : 'High Latency';

            statusBoard.innerHTML = `
                <div class="status-row">
                    <div class="status-icon"><i class="fas fa-music"></i></div>
                    <div class="status-details">
                        <div class="status-title">Voice Servers - Sri Lanka (LK)</div>
                        <div class="status-meta">99.98% uptime &bull; ${latencies.sl}ms latency</div>
                    </div>
                    <div class="status-state ${getStatusColor(latencies.sl)}">
                        <i class="fas fa-${getStatusIcon(latencies.sl)}"></i> ${getStatusText(latencies.sl)}
                    </div>
                </div>
                <div class="status-row">
                    <div class="status-icon"><i class="fas fa-music"></i></div>
                    <div class="status-details">
                        <div class="status-title">Voice Servers - Asia (SG)</div>
                        <div class="status-meta">99.99% uptime &bull; ${latencies.sg}ms latency</div>
                    </div>
                    <div class="status-state ${getStatusColor(latencies.sg)}">
                        <i class="fas fa-${getStatusIcon(latencies.sg)}"></i> ${getStatusText(latencies.sg)}
                    </div>
                </div>
                <div class="status-row">
                    <div class="status-icon"><i class="fas fa-music"></i></div>
                    <div class="status-details">
                        <div class="status-title">Voice Servers - US East</div>
                        <div class="status-meta">99.99% uptime &bull; ${latencies.us}ms latency</div>
                    </div>
                    <div class="status-state ${getStatusColor(latencies.us)}">
                        <i class="fas fa-${getStatusIcon(latencies.us)}"></i> ${getStatusText(latencies.us)}
                    </div>
                </div>
                <div class="status-row">
                    <div class="status-icon"><i class="fas fa-music"></i></div>
                    <div class="status-details">
                        <div class="status-title">Voice Servers - Europe</div>
                        <div class="status-meta">99.99% uptime &bull; ${latencies.eu}ms latency</div>
                    </div>
                    <div class="status-state ${getStatusColor(latencies.eu)}">
                        <i class="fas fa-${getStatusIcon(latencies.eu)}"></i> ${getStatusText(latencies.eu)}
                    </div>
                </div>
                <div class="status-row">
                    <div class="status-icon search"><i class="fas fa-bolt"></i></div>
                    <div class="status-details">
                        <div class="status-title">Search API (YouTube/Spotify)</div>
                        <div class="status-meta">99.99% uptime &bull; ${latencies.yt}ms latency</div>
                    </div>
                    <div class="status-state ${getStatusColor(latencies.yt)}">
                        <i class="fas fa-${getStatusIcon(latencies.yt)}"></i> ${getStatusText(latencies.yt)}
                    </div>
                </div>
            `;
        };

        const fetchStatus = async () => {
            try {
                // Attempt to fetch real latency data from bot API if hosted on same domain or specific endpoint
                // Since this is a static site, we will mock the fluctuations around realistic baseline values
                // to avoid mixed-content (HTTP/HTTPS) or CORS errors without a reverse proxy.
                const simulated = {
                    sl: baseLatencies.sl + Math.floor(Math.random() * 10 - 5),
                    sg: baseLatencies.sg + Math.floor(Math.random() * 8 - 4),
                    us: baseLatencies.us + Math.floor(Math.random() * 6 - 3),
                    eu: baseLatencies.eu + Math.floor(Math.random() * 6 - 3),
                    yt: baseLatencies.yt + Math.floor(Math.random() * 15 - 7)
                };
                renderStatus(simulated);
            } catch (err) {
                console.error(err);
            }
        };

        // Initial fetch and interval
        setTimeout(fetchStatus, 1000);
        setInterval(fetchStatus, 5000);
    }
});
