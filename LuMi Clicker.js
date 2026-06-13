// ==========================================
// LuMi Clicker - Ultimate Edition (Fixed)
// ==========================================

let cookies = 0;
let cps = 0;
let clickPower = 1;

let rebirths = 0;
let rebirthMultiplier = 1;
let rebirthCost = 1000000000000;

let clickCombo = 0;
let lastClickTime = Date.now();
const comboDecayTime = 1500;

let eventMultiplier = 1;
let circleMultiplier = 1;
let eventsActive = false;
let minigameActive = false;
let activeEvent = null;
let activeEventTimer = null;
let minigameTimer = null;
let minigameCountdown = null;
let currentTheme = 'default';

let giftReady = true;
let giftCooldown = 150;

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
    { id: 'blackhole', name: '🕳️ Zwart Gat Boor', baseCost: 400000, cost: 400000, count: 0, production: 3500, type: 'cps' }
    // Voeg hier later meer toe als je wilt
];

const upgrades = [
    { id: 'cursor1', name: '⚡ Hyper Cursors', cost: 150, multiplier: 2, bought: false, target: 'cursor' },
    { id: 'star1', name: '⭐ Supernova Poeder', cost: 750, multiplier: 2, bought: false, target: 'star' },
    { id: 'double', name: '🎁 Dubbel LuMi Plezier!', cost: 20000, multiplier: 2, bought: false, global: true },
    { id: 'triple', name: '🔥 Mega Triple LuMi!', cost: 450000, multiplier: 3, bought: false, global: true }
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

function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'galaxy-notif';
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2200);
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
    const eventPool = [
        { name: 'Aura Lukas', duration: 15000, multiplier: 1.35, className: 'aura', message: 'Click power en CPS zijn tijdelijk verdubbeld!' },
        { name: 'MichaRizz', duration: 18000, multiplier: 1.5, className: 'gigachad', message: 'Je krijgt een flinke boost in snelheid!' },
        { name: 'Michael Jackson', duration: 14000, multiplier: 1.25, className: 'mj', message: 'De beat is extra sterk vandaag!' },
        { name: 'Galaxy Run', duration: 17000, multiplier: 1.4, className: 'galaxy', message: 'Een ruimte-event geeft je een enorme bonus!' },
        { name: 'Sterrenregen', duration: 16000, multiplier: 1.3, className: 'star', message: 'Sterren vallen over je klikgebied!' },
        { name: 'Cyber Matrix', duration: 15000, multiplier: 1.45, className: 'matrix', message: 'Digitale stroom geeft je extra power!' },
        { name: 'Neon Rave', duration: 15000, multiplier: 1.35, className: 'neon', message: 'Neon energie maakt alles sneller!' },
        { name: 'Lava Eruptie', duration: 16000, multiplier: 1.4, className: 'lava', message: 'Lava zorgt voor een explosieve boost!' },
        { name: 'Ijs Tijdperk', duration: 14000, multiplier: 1.3, className: 'ice', message: 'Ijzige kracht geeft je een koel voordeel!' },
        { name: 'Retro Disco', duration: 15000, multiplier: 1.3, className: 'disco', message: 'Disco energie laat alles glinsteren!' }
    ];

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
    const area = document.getElementById('minigame-area');
    if (area) area.classList.add('hidden');
    const invite = document.getElementById('minigame-invite');
    if (invite) invite.classList.add('hidden');
    const content = document.getElementById('minigame-content');
    if (content) content.innerHTML = '';
    minigameCountdown = null;
    minigameTimer = null;
    minigameActive = false;
}

function startMinigame() {
    if (minigameActive) return;
    minigameActive = true;

    const invite = document.getElementById('minigame-invite');
    if (invite) invite.classList.add('hidden');

    const area = document.getElementById('minigame-area');
    if (area) area.classList.remove('hidden');

    const content = document.getElementById('minigame-content');
    if (!content) return;
    content.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'mini-game-card';
    card.innerHTML = `
        <h3 style="color:#ffd700; margin-bottom:4px;">⚡ Mini Game</h3>
        <p style="margin:0 0 8px;">Klik 10 keer op de ster binnen 8 seconden!</p>
        <button id="mini-target" class="sata-btn success mini-target">⭐</button>
        <div id="mini-status">Hits: 0/10</div>
        <div id="mini-timer">Tijd: 8s</div>
    `;
    content.appendChild(card);

    const target = document.getElementById('mini-target');
    const status = document.getElementById('mini-status');
    const timer = document.getElementById('mini-timer');
    let hits = 0;
    let timeLeft = 8;

    const finish = (won) => {
        if (!minigameActive) return;
        clearInterval(minigameCountdown);
        clearTimeout(minigameTimer);
        minigameCountdown = null;
        minigameTimer = null;

        if (won) {
            const reward = Math.floor(cookies * 0.08) + 7500;
            cookies += reward;
            showNotification(`Mini game gewonnen! +${formatNumber(reward)} LuMi's`);
            updateDisplay();
        } else {
            showNotification('Mini game verloren. Probeer het opnieuw!');
        }
        closeMinigame();
    };

    target.addEventListener('click', () => {
        hits++;
        status.textContent = `Hits: ${hits}/10`;
        if (hits >= 10) finish(true);
    });

    minigameCountdown = setInterval(() => {
        timeLeft--;
        timer.textContent = `Tijd: ${timeLeft}s`;
        if (timeLeft <= 0) finish(false);
    }, 1000);

    minigameTimer = setTimeout(() => {
        if (hits < 10) finish(false);
    }, 8000);
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

document.querySelectorAll('.theme-choice').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

document.getElementById('btn-yes').addEventListener('click', startMinigame);
document.getElementById('btn-no').addEventListener('click', () => {
    document.getElementById('minigame-invite').classList.add('hidden');
});

// ==================== CLICK ====================
document.getElementById('lumi').addEventListener('click', (e) => {
    clickCombo++;
    lastClickTime = Date.now();

    const comboMult = 1 + (Math.min(clickCombo, 50) / 50);
    let gain = clickPower * eventMultiplier * circleMultiplier * rebirthMultiplier * comboMult;

    if (Math.random() < 0.1) gain *= 5;

    cookies += gain;

    const float = document.createElement('div');
    float.className = 'click-effect';
    float.textContent = `+${formatNumber(gain)}`;
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
    calculateStats();
    updateDisplay();
    updateEventLog();
    setTheme(currentTheme);
    setTimeout(() => triggerRandomEvent(), 1200);

    // Laad save indien aanwezig
    const saved = localStorage.getItem('lumiSave');
    if (saved) {
        Object.assign(window, JSON.parse(saved)); // simpele restore
        calculateStats();
        updateDisplay();
    }

    // Save knoppen
    document.getElementById('save-btn').onclick = () => {
        localStorage.setItem('lumiSave', JSON.stringify({cookies, rebirths, rebirthMultiplier, rebirthCost, buildings, upgrades}));
        alert('✅ Opgeslagen!');
    };

    document.getElementById('load-btn').onclick = () => {
        const data = localStorage.getItem('lumiSave');
        if (data) {
            Object.assign(window, JSON.parse(data));
            calculateStats();
            updateDisplay();
            alert('✅ Geladen!');
        }
    };

    document.getElementById('reset-btn').onclick = () => {
        if (confirm('Alles resetten?')) {
            localStorage.removeItem('lumiSave');
            location.reload();
        }
    };
};