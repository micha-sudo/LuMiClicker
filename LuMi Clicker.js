// ==========================================
// LuMi Clicker - Ultimate Edition (Fixed)
// ==========================================

let cookies = 0;
let cps = 0;
let clickPower = 1;

let rebirths = 0;
let rebirthMultiplier = 1;
let rebirthCost = 100000000;

let clickCombo = 0;
let lastClickTime = Date.now();
const comboDecayTime = 1500;
const critChance = 0.12;
const critMultiplier = 5;

let eventMultiplier = 1;
let circleMultiplier = 1;
let eventsActive = false;
let minigameActive = false;
let activeEvent = null;
let activeEventTimer = null;
let minigameTimer = null;
let minigameCountdown = null;
let currentTheme = 'default';
let currentMinigameType = null;

let giftReady = true;
let giftCooldown = 150;

// Admin
let adminPanelOpen = false;
let adminCommandBuffer = '';
let selectedAdminPersona = null;
const adminCommand = 'admin cmds 14';
const globalMessageStorageKey = 'lumiGlobalMessage';
const globalEventStorageKey = 'lumiGlobalEvent';

const globalEvents = [
    { key: 'aura-lukas', name: 'Aura Lukas', duration: 15000, multiplier: 1.35, className: 'aura', message: 'Click power en CPS zijn tijdelijk verdubbeld!' },
    { key: 'micharizz', name: 'MichaRizz', duration: 18000, multiplier: 1.5, className: 'gigachad', message: 'Je krijgt een flinke boost in snelheid!' },
    { key: 'michael-jackson', name: 'Michael Jackson', duration: 14000, multiplier: 1.25, className: 'mj', message: 'De beat is extra sterk vandaag!' },
    { key: 'galaxy-run', name: 'Galaxy Run', duration: 17000, multiplier: 1.4, className: 'galaxy', message: 'Een ruimte-event geeft je een enorme bonus!' },
    { key: 'sterrenregen', name: 'Sterrenregen', duration: 16000, multiplier: 1.3, className: 'star', message: 'Sterren vallen over je klikgebied!' },
    { key: 'cyber-matrix', name: 'Cyber Matrix', duration: 15000, multiplier: 1.45, className: 'matrix', message: 'Digitale stroom geeft je extra power!' },
    { key: 'neon-rave', name: 'Neon Rave', duration: 15000, multiplier: 1.35, className: 'neon', message: 'Neon energie maakt alles sneller!' },
    { key: 'lava-eruptie', name: 'Lava Eruptie', duration: 16000, multiplier: 1.4, className: 'lava', message: 'Lava zorgt voor een explosieve boost!' },
    { key: 'ijs-tijdperk', name: 'Ijs Tijdperk', duration: 14000, multiplier: 1.3, className: 'ice', message: 'Ijzige kracht geeft je een koel voordeel!' },
    { key: 'retro-disco', name: 'Retro Disco', duration: 15000, multiplier: 1.3, className: 'disco', message: 'Disco energie laat alles glinsteren!' }
];

// Event Log
const eventLog = {
    "Aura Lukas": 0, "MichaRizz": 0, "Michael Jackson": 0, "Galaxy Run": 0,
    "Sterrenregen": 0, "Cyber Matrix": 0, "Neon Rave": 0,
    "Lava Eruptie": 0, "Ijs Tijdperk": 0, "Retro Disco": 0
};

// ==================== BUILDINGS & UPGRADES ====================
const buildings = [
    { id: 'cursor', name: '✨ Magische Cursor', baseCost: 15, cost: 15, count: 0, production: 1, type: 'click' },
    { id: 'star', name: '⭐ Sterrenstof Fabriek', baseCost: 100, cost: 100, count: 0, production: 1, type: 'cps' },
    { id: 'moon', name: '🌙 Super Klik-Maan', baseCost: 500, cost: 500, count: 0, production: 5, type: 'click' },
    { id: 'comet', name: '☄️ Komeet Smelter', baseCost: 3000, cost: 3000, count: 0, production: 45, type: 'cps' },
    { id: 'galaxy', name: '🌌 Goddelijke Duim', baseCost: 15000, cost: 15000, count: 0, production: 200, type: 'click' },
    { id: 'nebula', name: '💨 Nevel Generator', baseCost: 85000, cost: 85000, count: 0, production: 750, type: 'cps' },
    { id: 'blackhole', name: '🕳️ Zwart Gat Boor', baseCost: 400000, cost: 400000, count: 0, production: 3500, type: 'cps' },
    { id: 'nova', name: '☄️ Nova Reactor', baseCost: 2500000, cost: 2500000, count: 0, production: 12000, type: 'cps' },
    { id: 'aurora', name: '🌈 Aurora Spelmaker', baseCost: 12000000, cost: 12000000, count: 0, production: 40000, type: 'click' },
    { id: 'meteor', name: '💫 Meteor Werkplaats', baseCost: 65000000, cost: 65000000, count: 0, production: 180000, type: 'cps' }
];

const upgrades = [
    { id: 'cursor1', name: '⚡ Hyper Cursors', cost: 150, multiplier: 2, bought: false, target: 'cursor' },
    { id: 'star1', name: '⭐ Supernova Poeder', cost: 750, multiplier: 2, bought: false, target: 'star' },
    { id: 'moon1', name: '🌙 Lunar Klik-Boost', cost: 4000, multiplier: 2, bought: false, target: 'moon' },
    { id: 'comet1', name: '☄️ Comet Core', cost: 18000, multiplier: 2, bought: false, target: 'comet' },
    { id: 'galaxy1', name: '🌌 Galactic Grip', cost: 90000, multiplier: 2, bought: false, target: 'galaxy' },
    { id: 'double', name: '🎁 Dubbel LuMi Plezier!', cost: 20000, multiplier: 2, bought: false, global: true },
    { id: 'triple', name: '🔥 Mega Triple LuMi!', cost: 450000, multiplier: 3, bought: false, global: true },
    { id: 'nova1', name: '⚛️ Quantum Glow', cost: 3000000, multiplier: 3, bought: false, target: 'nova' },
    { id: 'cosmic', name: '🌠 Cosmic Overdrive', cost: 12000000, multiplier: 4, bought: false, global: true }
];

function formatNumber(num) {
    return Math.floor(num).toLocaleString('nl-NL');
}

function clearEventBackground() {
    document.body.classList.remove('aura-bg', 'gigachad-bg', 'mj-bg', 'galaxy-bg', 'star-bg', 'matrix-bg', 'neon-bg', 'lava-bg', 'ice-bg', 'disco-bg');
}

function setTheme(themeName) {
    currentTheme = themeName;
    document.body.classList.remove('theme-default', 'theme-dark', 'theme-cosmic', 'theme-emerald', 'theme-gold', 'theme-cyber');
    document.body.classList.add(`theme-${themeName}`);
}

function updateEventLog() {
    const list = document.getElementById('event-counters-list');
    if (!list) return;
    list.innerHTML = '';
    Object.entries(eventLog).forEach(([name, count]) => {
        const row = document.createElement('div');
        row.textContent = `${name}: ${count}`;
        list.appendChild(row);
    });
}

function showNotification(message, options = {}) {
    const notif = document.createElement('div');
    notif.className = 'galaxy-notif';

    if (options.signature) {
        const sig = document.createElement('span');
        sig.className = options.signature === 'Lukaaaas'
            ? 'notif-signature lukaaas-signature'
            : options.signature === 'Michaaaaa'
                ? 'notif-signature michaaaa-signature'
                : 'notif-signature';
        sig.textContent = options.signature;
        notif.appendChild(sig);
    }

    const text = document.createElement('div');
    text.className = 'notif-text';
    text.textContent = message;
    notif.appendChild(text);

    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2600);
}

function getPersonaSignature(persona) {
    if (persona === 'Micha') return 'Michaaaaa';
    if (persona === 'Lukas') return 'Lukaaaas';
    return '';
}

function displayGlobalMessage(payload) {
    if (!payload || !payload.text) return;
    const signature = getPersonaSignature(payload.sender);
    showNotification(payload.text, signature ? { signature } : {});
}

function sendGlobalMessage() {
    const input = document.getElementById('admin-message-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) {
        showNotification('❌ Vul een bericht in!');
        return;
    }

    const payload = {
        text,
        sender: selectedAdminPersona || 'Lukas',
        timestamp: Date.now()
    };
    localStorage.setItem(globalMessageStorageKey, JSON.stringify(payload));
    input.value = '';
    displayGlobalMessage(payload);
}

function clearActiveEvent() {
    if (!activeEvent) return;
    clearEventBackground();
    eventMultiplier = 1;
    activeEvent = null;
    if (activeEventTimer) {
        clearTimeout(activeEventTimer);
        activeEventTimer = null;
    }
}

function triggerRandomEvent() {
    if (activeEvent || minigameActive) return;
    const eventPool = globalEvents;
    const event = eventPool[Math.floor(Math.random() * eventPool.length)];
    eventLog[event.name] += 1;
    updateEventLog();

    clearEventBackground();
    document.body.classList.add(`${event.className}-bg`);
    activeEvent = event;
    eventMultiplier = event.multiplier;
    showNotification(`${event.name} actief! ${event.message}`);

    if (activeEventTimer) clearTimeout(activeEventTimer);
    activeEventTimer = setTimeout(clearActiveEvent, event.duration);

    setTimeout(() => {
        const invite = document.getElementById('minigame-invite');
        if (invite && !minigameActive) invite.classList.remove('hidden');
    }, 700);
}

function closeMinigame() {
    if (minigameCountdown) clearInterval(minigameCountdown);
    if (minigameTimer) clearTimeout(minigameTimer);
    if (window.geometryRAF) { try { cancelAnimationFrame(window.geometryRAF); } catch(e){}; delete window.geometryRAF; }
    if (window.geometryOnKey) { try { window.removeEventListener('keydown', window.geometryOnKey); } catch(e){}; delete window.geometryOnKey; }
    const area = document.getElementById('minigame-area');
    if (area) area.classList.add('hidden');
    const invite = document.getElementById('minigame-invite');
    if (invite) invite.classList.add('hidden');
    const content = document.getElementById('minigame-content');
    if (content) content.innerHTML = '';
    minigameCountdown = null;
    minigameTimer = null;
    minigameActive = false;
    currentMinigameType = null;
}
function startMinigame() {
    // Open the mini-game selection screen
    if (minigameActive) return;
    if (window.geometryOnKey) { try { window.removeEventListener('keydown', window.geometryOnKey); } catch(e){}; delete window.geometryOnKey; }
    if (window.geometryRAF) { try { cancelAnimationFrame(window.geometryRAF); } catch(e){}; delete window.geometryRAF; }
    const invite = document.getElementById('minigame-invite');
    if (invite) invite.classList.add('hidden');

    const area = document.getElementById('minigame-area');
    if (area) area.classList.remove('hidden');

    const content = document.getElementById('minigame-content');
    if (!content) return;
    content.innerHTML = '';

    // Randomly start one of the mini-games so user doesn't have to pick
    const games = [startGeometry, startClicker];
    const choice = games[Math.floor(Math.random() * games.length)];
    // small delay to allow area to show nicely
    setTimeout(() => { try { choice(); } catch (e) { console.error('Failed to start minigame', e); closeMinigame(); } }, 120);
}

// --- Geometry LuMi ---
function startGeometry() {
    // Geometry Dash–style runner (Geometry LuMi visuals)
    const content = document.getElementById('minigame-content');
    if (!content) return;
    content.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.width = Math.min(820, window.innerWidth - 160);
    canvas.height = 360;
    canvas.className = 'geometry-canvas';
    content.appendChild(canvas);

    const info = document.createElement('div');
    info.style.marginTop = '8px';
    info.style.textAlign = 'center';
    info.innerHTML = '<div id="geom-score">Distance: 0</div><div id="geom-msg"></div>';
    content.appendChild(info);

    const ctx = canvas.getContext('2d');
    const groundY = canvas.height - 40;
    let player = { x: 80, y: groundY - 16, vy: 0, w: 24, h: 24 };
    const gravity = 0.8; const jump = -14;
    let obstacles = [];
    let frame = 0; let distance = 0; let speed = 3.5; let gameOver = false;

    function spawnObstacle() {
        const h = 24 + Math.random() * 60;
        const gap = 0; // single spike blocks
        const y = groundY - h;
        obstacles.push({ x: canvas.width + 40, y, w: 32, h });
    }

    function reset() {
        player.y = groundY - player.h;
        player.vy = 0;
        obstacles = [];
        frame = 0; distance = 0; speed = 3.5; gameOver = false;
    }

    function jumpPlayer() {
        if (player.y + player.h >= groundY) {
            player.vy = jump;
        }
    }

    function loop() {
        frame++;
        // increase difficulty slowly
        speed = 3.5 + Math.min(rebirths * 0.2, 3);
        // physics
        player.vy += gravity; player.y += player.vy;
        if (player.y + player.h > groundY) { player.y = groundY - player.h; player.vy = 0; }

        // spawn obstacles
        if (frame % Math.max(60, 120 - Math.floor(distance/200)) === 0) spawnObstacle();
        obstacles.forEach(o => o.x -= speed + Math.min(distance/600, 3));
        obstacles = obstacles.filter(o => o.x + o.w > -50);

        // collision
        obstacles.forEach(o => {
            if (player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y) {
                gameOver = true;
            }
        });

        // draw
        ctx.fillStyle = '#00111a'; ctx.fillRect(0,0,canvas.width,canvas.height);
        // ground
        ctx.fillStyle = '#0b2430'; ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
        // player (Geometry LuMi visual)
        ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(player.x + player.w/2, player.y + player.h/2, player.w/2, 0, Math.PI*2); ctx.fill();
        // obstacles (spikes)
        ctx.fillStyle = '#ff3366';
        obstacles.forEach(o => {
            ctx.fillRect(o.x, o.y, o.w, o.h);
        });

        // distance
        distance += speed/2;
        document.getElementById('geom-score').textContent = `Distance: ${Math.floor(distance)}`;

        if (gameOver) {
            // cleanup
            if (window.geometryRAF) { cancelAnimationFrame(window.geometryRAF); delete window.geometryRAF; }
            if (window.geometryOnKey) { window.removeEventListener('keydown', window.geometryOnKey); delete window.geometryOnKey; }
            document.getElementById('geom-msg').textContent = 'Game Over';
            const reward = 1500 + Math.floor(distance) * 5;
            cookies += reward;
            showNotification(`Geometry LuMi over! +${formatNumber(reward)} LuMi's`);
            updateDisplay();
            minigameActive = false;
            closeMinigame();
            return;
        }

        window.geometryRAF = requestAnimationFrame(loop);
    }

    // controls
    window.geometryOnKey = function(e) { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jumpPlayer(); } };
    canvas.addEventListener('click', jumpPlayer);
    window.addEventListener('keydown', window.geometryOnKey);

    reset();
    loop();
}

// --- Clicker LuMi (10 clicks in 5s) ---
function startClicker() {
    const content = document.getElementById('minigame-content');
    if (!content) return;
    content.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'mini-game-card';
    card.innerHTML = `
        <h3 style="color:#ffd700;">Clicker LuMi</h3>
        <p>Klik 10 keer binnen 5 seconden!</p>
        <button id="clicker-btn" class="sata-btn success" style="font-size:1.6rem; padding:18px 24px;">⭐</button>
        <div id="clicker-status" style="margin-top:8px;color:#fff;">0/10</div>
        <div id="clicker-timer" style="margin-top:6px;color:#fff;">Tijd: 5s</div>
    `;
    content.appendChild(card);

    const btn = document.getElementById('clicker-btn');
    const status = document.getElementById('clicker-status');
    const timerEl = document.getElementById('clicker-timer');
    let hits = 0; let timeLeft = 5;

    btn.addEventListener('click', () => {
        hits++; status.textContent = `${hits}/10`;
        if (hits >= 10) {
            const reward = 3000;
            cookies += reward; showNotification(`Clicker gewonnen! +${formatNumber(reward)} LuMi's`); updateDisplay();
            closeMinigame();
        }
    });

    minigameCountdown = setInterval(() => {
        timeLeft--; timerEl.textContent = `Tijd: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(minigameCountdown); minigameCountdown = null;
            showNotification('Clicker verloren.'); closeMinigame();
        }
    }, 1000);
}

// ==================== CORE FUNCTIONS ====================
function calculateStats() {
    cps = 0;
    clickPower = 1;
    buildings.forEach(b => {
        if (b.type === 'click') clickPower += b.count * b.production;
        else cps += b.count * b.production;
    });
}

function updateDisplay() {
    const comboMult = 1 + (Math.min(clickCombo, 50) / 50);
    const totalMult = eventMultiplier * circleMultiplier * rebirthMultiplier * comboMult;

    document.getElementById('cookies').textContent = `${formatNumber(Math.floor(cookies))} LuMi's`;
    document.getElementById('cookies').className = cookies >= 1e12 ? "trillion-size" : "normal-size";

    document.getElementById('cps').textContent = 
        `${formatNumber(Math.floor(cps * totalMult))} LuMi/s | +${formatNumber(clickPower * totalMult)} per klik`;

    document.getElementById('rebirth-display').textContent = 
        `Rebirths: ${rebirths} (Multiplier: ${rebirthMultiplier}x)`;

    document.getElementById('rebirth-cost').textContent = 
        `Kost: ${formatNumber(rebirthCost)}`;

    // Shop
    const shop = document.getElementById('shop-items');
    shop.innerHTML = '';
    buildings.forEach(build => {
        const div = document.createElement('div');
        div.className = `shop-item ${cookies >= build.cost ? 'available' : 'locked'}`;
        div.innerHTML = `
            <div><div class="item-name">${build.name}</div><div class="item-count">${build.count} gekocht</div></div>
            <div><div class="item-cost">${formatNumber(build.cost)} LuMi</div></div>`;
        div.onclick = () => buyBuilding(build.id);
        shop.appendChild(div);
    });

    // Upgrades
    const upgContainer = document.getElementById('upgrade-items');
    upgContainer.innerHTML = '';
    upgrades.forEach(upg => {
        if (upg.bought) return;
        const div = document.createElement('div');
        div.className = `upgrade-item ${cookies >= upg.cost ? 'available' : 'locked'}`;
        div.innerHTML = `<div class="item-name">${upg.name}</div><div class="item-cost">${formatNumber(upg.cost)}</div>`;
        div.onclick = () => buyUpgrade(upg.id);
        upgContainer.appendChild(div);
    });
}

function buyBuilding(id) {
    const b = buildings.find(x => x.id === id);
    if (!b || cookies < b.cost) return;
    cookies -= b.cost;
    b.count++;
    b.cost = Math.ceil(b.baseCost * Math.pow(1.15, b.count));
    calculateStats();
    updateDisplay();
}

function buyUpgrade(id) {
    const u = upgrades.find(x => x.id === id);
    if (!u || u.bought || cookies < u.cost) return;
    cookies -= u.cost;
    u.bought = true;
    if (u.global) {
        buildings.forEach(b => b.production *= u.multiplier);
    } else {
        const target = buildings.find(b => b.id === u.target);
        if (target) target.production *= u.multiplier;
    }
    calculateStats();
    updateDisplay();
}

document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.remove('hidden');
});

document.getElementById('close-settings').addEventListener('click', () => {
    document.getElementById('settings-panel').classList.add('hidden');
});

document.getElementById('updates-btn').addEventListener('click', () => {
    document.getElementById('updates-panel').classList.remove('hidden');
});

document.getElementById('close-updates').addEventListener('click', () => {
    document.getElementById('updates-panel').classList.add('hidden');
});

document.querySelectorAll('.theme-choice').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

document.getElementById('btn-yes').addEventListener('click', startMinigame);
document.getElementById('btn-no').addEventListener('click', () => {
    document.getElementById('minigame-invite').classList.add('hidden');
});

// ==================== ADMIN COMMANDS ====================
function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    adminPanelOpen = !adminPanelOpen;
    if (adminPanelOpen) {
        panel.classList.remove('hidden');
        document.getElementById('admin-identity-screen').classList.remove('hidden');
        document.getElementById('admin-controls').classList.add('hidden');
        document.getElementById('admin-panel-title').textContent = '🔓 Admin Panel';
        showNotification('🔓 Admin Panel Opened!');
    } else {
        panel.classList.add('hidden');
    }
}

function setAdminPersona(persona) {
    selectedAdminPersona = persona;
    const identityScreen = document.getElementById('admin-identity-screen');
    const controls = document.getElementById('admin-controls');
    const title = document.getElementById('admin-panel-title');

    if (identityScreen) identityScreen.classList.add('hidden');
    if (controls) controls.classList.remove('hidden');
    if (title) title.textContent = `🔓 Admin Panel — ${persona}`;
} 

function applyGlobalEvent(eventKey) {
    const event = globalEvents.find(item => item.key === eventKey);
    if (!event) return;

    eventLog[event.name] += 1;
    updateEventLog();

    clearEventBackground();
    document.body.classList.add(`${event.className}-bg`);
    activeEvent = event;
    eventMultiplier = event.multiplier;
    showNotification(`${event.name} actief! ${event.message}`);

    if (activeEventTimer) clearTimeout(activeEventTimer);
    activeEventTimer = setTimeout(clearActiveEvent, event.duration);
    updateDisplay();
}

function activateGlobalEvent(eventKey) {
    applyGlobalEvent(eventKey);
    localStorage.setItem(globalEventStorageKey, JSON.stringify({ eventKey, timestamp: Date.now() }));
}

function adminAddLumi(amount) {
    const num = parseInt(amount);
    if (isNaN(num) || num <= 0) {
        showNotification('❌ Invalid amount!');
        return;
    }
    cookies += num;
    showNotification(`💰 Added ${formatNumber(num)} LuMi!`);
    updateDisplay();
    document.getElementById('admin-lumi-input').value = '';
}

function adminSetMultiplier(value) {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0.1) {
        showNotification('❌ Invalid multiplier!');
        return;
    }
    circleMultiplier = num;
    showNotification(`⚡ Multiplier set to: ${num}x`);
    updateDisplay();
    document.getElementById('admin-multiplier-input').value = '';
}

// Keyboard listener for "admin cmds"
document.addEventListener('keydown', (e) => {
    adminCommandBuffer += e.key.toLowerCase();
    
    // Keep buffer to a safe length for longer admin phrases
    if (adminCommandBuffer.length > 30) {
        adminCommandBuffer = adminCommandBuffer.slice(-30);
    }
    
    // Check if "admin cmds" is in buffer
    if (adminCommandBuffer.includes(adminCommand)) {
        toggleAdminPanel();
        adminCommandBuffer = '';
    }
});

// Admin panel event listeners
document.getElementById('close-admin').addEventListener('click', () => {
    toggleAdminPanel();
});

window.addEventListener('storage', (event) => {
    if (event.key === globalMessageStorageKey && event.newValue) {
        try {
            displayGlobalMessage(JSON.parse(event.newValue));
        } catch (e) {
            console.error('Failed to parse global message', e);
        }
    }

    if (event.key === globalEventStorageKey && event.newValue) {
        try {
            const payload = JSON.parse(event.newValue);
            applyGlobalEvent(payload.eventKey);
        } catch (e) {
            console.error('Failed to parse global event', e);
        }
    }
});

document.querySelectorAll('.admin-persona').forEach(btn => {
    btn.addEventListener('click', () => {
        setAdminPersona(btn.dataset.persona);
    });
});

document.querySelectorAll('.admin-event').forEach(btn => {
    btn.addEventListener('click', () => {
        activateGlobalEvent(btn.dataset.event);
    });
});

document.getElementById('admin-add-lumi').addEventListener('click', () => {
    const amount = document.getElementById('admin-lumi-input').value;
    adminAddLumi(amount);
});

document.getElementById('admin-message-send').addEventListener('click', () => {
    sendGlobalMessage();
});

document.getElementById('admin-message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendGlobalMessage();
    }
});

document.getElementById('admin-lumi-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const amount = document.getElementById('admin-lumi-input').value;
        adminAddLumi(amount);
    }
});

document.getElementById('admin-set-multiplier').addEventListener('click', () => {
    const value = document.getElementById('admin-multiplier-input').value;
    adminSetMultiplier(value);
});

document.getElementById('admin-multiplier-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const value = document.getElementById('admin-multiplier-input').value;
        adminSetMultiplier(value);
    }
});

// ==================== CLICK ====================
document.getElementById('lumi').addEventListener('click', (e) => {
    clickCombo++;
    lastClickTime = Date.now();

    const comboMult = 1 + (Math.min(clickCombo, 50) / 50);
    let gain = clickPower * eventMultiplier * circleMultiplier * rebirthMultiplier * comboMult;

    const isCrit = Math.random() < critChance;
    if (isCrit) gain *= critMultiplier;

    cookies += gain;

    const float = document.createElement('div');
    float.className = isCrit ? 'click-effect crit' : 'click-effect';
    float.textContent = isCrit ? `+${formatNumber(gain)} ✨` : `+${formatNumber(gain)}`;
    float.style.left = e.clientX + 'px';
    float.style.top = (e.clientY - 40) + 'px';
    document.body.appendChild(float);
    setTimeout(() => float.remove(), 800);

    updateDisplay();
});

// ==================== REBIRTH & GIFT ====================
document.getElementById('rebirth-btn').addEventListener('click', () => {
    if (cookies >= rebirthCost) {
        if (confirm("Rebirth? Je verliest alles maar krijgt x2 multiplier!")) {
            rebirths++;
            rebirthMultiplier *= 2;
            rebirthCost *= 10;
            cookies = 0;
            buildings.forEach(b => { b.count = 0; b.cost = b.baseCost; });
            upgrades.forEach(u => u.bought = false);
            calculateStats();
            updateDisplay();
        }
    }
});

document.getElementById('gift-btn').addEventListener('click', () => {
    if (!giftReady) return;
    const reward = Math.floor(cookies * 0.06) + 5000;
    cookies += reward;
    alert(`🎁 +${formatNumber(reward)} LuMi's!`);
    giftReady = false;
    const btn = document.getElementById('gift-btn');
    const txt = document.getElementById('gift-text');
    btn.disabled = true;
    let t = giftCooldown;
    const int = setInterval(() => {
        t--;
        txt.textContent = `${Math.floor(t/60)}:${(t%60).toString().padStart(2,'0')}`;
        if (t <= 0) {
            clearInterval(int);
            giftReady = true;
            btn.disabled = false;
            txt.textContent = "Claim Cadeau!";
        }
    }, 1000);
});

// ==================== GAME LOOP ====================
function gameTick() {
    if (Date.now() - lastClickTime > comboDecayTime) {
        clickCombo = Math.max(0, Math.floor(clickCombo * 0.6));
    }
    const comboMult = 1 + (Math.min(clickCombo, 50) / 50);
    cookies += (cps * eventMultiplier * circleMultiplier * rebirthMultiplier * comboMult) / 60;
}

setInterval(gameTick, 1000/60);
setInterval(updateDisplay, 250);
setInterval(() => {
    if (Math.random() < 0.015) triggerRandomEvent();
}, 1000);

// ==================== INIT ====================
window.onload = () => {
    // Laad save indien aanwezig
    const saved = localStorage.getItem('lumiSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            cookies = data.cookies || 0;
            rebirths = data.rebirths || 0;
            rebirthMultiplier = data.rebirthMultiplier || 1;
            rebirthCost = data.rebirthCost || 100000000;
            clickCombo = data.clickCombo || 0;
            eventMultiplier = data.eventMultiplier || 1;
            circleMultiplier = data.circleMultiplier || 1;
            currentTheme = data.currentTheme || 'default';
            
            // Restore buildings
            if (data.buildings && Array.isArray(data.buildings)) {
                buildings.forEach((building, idx) => {
                    if (data.buildings[idx]) {
                        building.count = data.buildings[idx].count || 0;
                        building.cost = data.buildings[idx].cost || building.baseCost;
                    }
                });
            }
            
            // Restore upgrades
            if (data.upgrades && Array.isArray(data.upgrades)) {
                upgrades.forEach((upgrade, idx) => {
                    if (data.upgrades[idx]) {
                        upgrade.bought = data.upgrades[idx].bought || false;
                    }
                });
            }
            
            // Restore event log
            if (data.eventLog && typeof data.eventLog === 'object') {
                Object.assign(eventLog, data.eventLog);
            }
        } catch (e) {
            console.error('Error loading save:', e);
        }
    }
    
    calculateStats();
    updateDisplay();
    updateEventLog();
    setTheme(currentTheme);
    setTimeout(() => triggerRandomEvent(), 1200);

    // Save knoppen
    document.getElementById('save-btn').onclick = () => {
        const saveData = {
            cookies,
            rebirths,
            rebirthMultiplier,
            rebirthCost,
            clickCombo,
            eventMultiplier,
            circleMultiplier,
            currentTheme,
            buildings: buildings.map(b => ({ count: b.count, cost: b.cost })),
            upgrades: upgrades.map(u => ({ bought: u.bought })),
            eventLog
        };
        localStorage.setItem('lumiSave', JSON.stringify(saveData));
        alert('✅ Opgeslagen!');
    };

    document.getElementById('load-btn').onclick = () => {
        const saved = localStorage.getItem('lumiSave');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                cookies = data.cookies || 0;
                rebirths = data.rebirths || 0;
                rebirthMultiplier = data.rebirthMultiplier || 1;
                rebirthCost = data.rebirthCost || 100000000;
                clickCombo = data.clickCombo || 0;
                eventMultiplier = data.eventMultiplier || 1;
                circleMultiplier = data.circleMultiplier || 1;
                currentTheme = data.currentTheme || 'default';
                
                // Restore buildings
                if (data.buildings && Array.isArray(data.buildings)) {
                    buildings.forEach((building, idx) => {
                        if (data.buildings[idx]) {
                            building.count = data.buildings[idx].count || 0;
                            building.cost = data.buildings[idx].cost || building.baseCost;
                        }
                    });
                }
                
                // Restore upgrades
                if (data.upgrades && Array.isArray(data.upgrades)) {
                    upgrades.forEach((upgrade, idx) => {
                        if (data.upgrades[idx]) {
                            upgrade.bought = data.upgrades[idx].bought || false;
                        }
                    });
                }
                
                // Restore event log
                if (data.eventLog && typeof data.eventLog === 'object') {
                    Object.assign(eventLog, data.eventLog);
                }
                
                calculateStats();
                updateDisplay();
                updateEventLog();
                setTheme(currentTheme);
                alert('✅ Geladen!');
            } catch (e) {
                console.error('Error loading save:', e);
                alert('❌ Fout bij laden!');
            }
        } else {
            alert('❌ Geen save gevonden!');
        }
    };

    document.getElementById('reset-btn').onclick = () => {
        if (confirm('Alles resetten?')) {
            localStorage.removeItem('lumiSave');
            location.reload();
        }
    };
};