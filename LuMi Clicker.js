// ==========================================
// 1. ENGINE INITIALIZATION & JUICE MECHANICS
// ==========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    }, 5000);
    document.body.classList.add('theme-default');
});

let cookies = 0;
let cps = 0;
let clickPower = 1; 

// Rebirth Engine
let rebirths = 0;
let rebirthMultiplier = 1;
let rebirthCost = 1000000000000; // 1 Trillion

// Dopamine / Combo Systeem
let clickCombo = 0;
let lastClickTime = Date.now();
const comboDecayTime = 1500; // Combo vermindert na 1.5 seconde inactiviteit

let baseClickOverride = 0; 
let eventMultiplier = 1;
let circleMultiplier = 1; 
let eventsActive = false;
let starShowerInterval = null;
let minigameActive = false;

// Cooldown Cadeau
let giftCooldown = 150; 
let giftTimerInterval = null;
let giftReady = true;

// Event Log Index
const eventLog = {
    "Aura Lukas": 0, "MichaRizz": 0, "Michael Jackson": 0, "Galaxy Run": 0, "Sterrenregen": 0,
    "Cyber Matrix": 0, "Neon Rave": 0, "Lava Eruptie": 0, "Ijs Tijdperk": 0, "Retro Disco": 0
};

// ==========================================
// 2. EXCLUSIEVE VERLENGDE WINKEL DATA
// ==========================================
const buildings = [
    { id: 'cursor', name: '✨ Magische Cursor', baseCost: 15, cost: 15, count: 0, production: 1, type: 'click' }, 
    { id: 'star', name: '⭐ Sterrenstof Fabriek', baseCost: 100, cost: 100, count: 0, production: 1, type: 'cps' }, 
    { id: 'moon', name: '🌙 Super Klik-Maan', baseCost: 500, cost: 500, count: 0, production: 5, type: 'click' }, 
    { id: 'comet', name: '☄️ Komeet Smelter', baseCost: 3000, cost: 3000, count: 0, production: 45, type: 'cps' }, 
    { id: 'galaxy', name: '🌌 Goddelijke Duim', baseCost: 15000, cost: 15000, count: 0, production: 200, type: 'click' },
    { id: 'nebula', name: '💨 Nevel Generator', baseCost: 85000, cost: 85000, count: 0, production: 750, type: 'cps' },
    { id: 'blackhole', name: '🕳️ Zwart Gat Boor', baseCost: 400000, cost: 400000, count: 0, production: 3500, type: 'cps' },
    { id: 'pulsar', name: '⚡ Pulsar Klikker', baseCost: 2000000, cost: 2000000, count: 0, production: 12000, type: 'click' },
    { id: 'wormhole', name: '🌀 Wormgat Transport', baseCost: 15000000, cost: 15000000, count: 0, production: 85000, type: 'cps' },
    { id: 'matrix', name: '🖥️ LuMi Simulators', baseCost: 99000000, cost: 99000000, count: 0, production: 500000, type: 'cps' },
    { id: 'multiverse', name: '🌍 Multiverse Connector', baseCost: 750000000, cost: 750000000, count: 0, production: 2200000, type: 'cps' },
    { id: 'timewarp', name: '⏳ Tijdreizigers Pendel', baseCost: 4500000000, cost: 4500000000, count: 0, production: 15000000, type: 'click' },
    { id: 'darkmatter', name: '⚛️ Donkere Materie Tank', baseCost: 25000000000, cost: 25000000000, count: 0, production: 90000000, type: 'cps' },
    { id: 'singularity', name: '🧿 Singulariteit Generator', baseCost: 180000000000, cost: 180000000000, count: 0, production: 480000000, type: 'cps' },
    { id: 'antimatter', name: '💥 Anti-Materie Kanon', baseCost: 999000000000, cost: 999000000000, count: 0, production: 2500000000, type: 'click' },
    { id: 'godcore', name: '🔮 Goddelijke Kern Refractor', baseCost: 8880000000000, cost: 8880000000000, count: 0, production: 14000000000, type: 'cps' },
    { id: 'chronos', name: '👑 Chronos Handlanger', baseCost: 65000000000000, cost: 65000000000000, count: 0, production: 85000000000, type: 'cps' },
    { id: 'dimension', name: '🚪 Dimensie Splijter', baseCost: 500000000000000, cost: 500000000000000, count: 0, production: 520000000000, type: 'click' },
    { id: 'infinity', name: '♾️ Oneindigheids Reactor', baseCost: 4500000000000000, cost: 4500000000000000, count: 0, production: 3100000000000, type: 'cps' },
    { id: 'lumigod', name: '🛐 LuMi Heiligdom der Goden', baseCost: 9999999999999999, cost: 9999999999999999, count: 0, production: 25000000000000, type: 'cps' }
];

const upgrades = [
    { id: 'cursor1', name: '⚡ Hyper Cursors', cost: 150, multiplier: 2, bought: false, target: 'cursor' },
    { id: 'cursor2', name: '🖱️ Quantum Klik-Pad', cost: 1200, multiplier: 2, bought: false, target: 'cursor' },
    { id: 'star1', name: '⭐ Supernova Poeder', cost: 750, multiplier: 2, bought: false, target: 'star' },
    { id: 'star2', name: '🌠 Kosmische Magneet', cost: 4000, multiplier: 2, bought: false, target: 'star' },
    { id: 'moon1', name: '🌙 Eclipse Energie', cost: 5000, multiplier: 2.5, bought: false, target: 'moon' },
    { id: 'comet1', name: '☄️ Plasma Kernen', cost: 30000, multiplier: 2, bought: false, target: 'comet' },
    { id: 'galaxy1', name: '🌌 Orion Constellatie', cost: 120000, multiplier: 2, bought: false, target: 'galaxy' },
    { id: 'nebula1', name: '💨 Gaswolk Ontsteking', cost: 600000, multiplier: 2, bought: false, target: 'nebula' },
    { id: 'bh1', name: '🕳️ Event Horizon Tanden', cost: 2500000, multiplier: 2.5, bought: false, target: 'blackhole' },
    { id: 'pulsar1', name: '🚀 Gamma-Straal Kliks', cost: 10000000, multiplier: 3, bought: false, target: 'pulsar' },
    { id: 'multi1', name: '🌍 Parallelle Realiteiten', cost: 5000000000, multiplier: 2, bought: false, target: 'multiverse' },
    { id: 'time1', name: '⏳ Oneindige Wijzers', cost: 25000000000, multiplier: 2, bought: false, target: 'timewarp' },
    { id: 'dark1', name: '⚛️ Ruimte-Tijd Corruptie', cost: 150000000000, multiplier: 3, bought: false, target: 'darkmatter' },
    { id: 'sing1', name: '🧿 Wit Gat Absorptie', cost: 950000000000, multiplier: 2.5, bought: false, target: 'singularity' },
    { id: 'double', name: '🎁 Dubbel LuMi Plezier!', cost: 20000, multiplier: 2, bought: false, global: true },
    { id: 'triple', name: '🔥 Mega Triple LuMi!', cost: 450000, multiplier: 3, bought: false, global: true },
    { id: 'godmode', name: '👑 LuMi Omnipotentia', cost: 75000000, multiplier: 5, bought: false, global: true }
];

function formatNumber(num) { return Math.floor(num).toLocaleString('nl-NL'); }
function getCurrentClickPower() { return baseClickOverride > 0 ? baseClickOverride : clickPower; }

// ==========================================
// 3. UI RENDERING & LOGICA
// ==========================================
function updateDisplay() {
    const comboMultiplier = 1 + (Math.min(clickCombo, 50) / 50);
    const totalMultiplier = eventMultiplier * circleMultiplier * rebirthMultiplier * comboMultiplier;
    
    const counterElement = document.getElementById('cookies');
    
    // Verandert de klasse voor schaling, maar behoudt het herstelde lettertype!
    if (cookies >= 1000000000000) {
        counterElement.className = "trillion-size";
    } else {
        counterElement.className = "normal-size";
    }

    counterElement.textContent = `${formatNumber(Math.floor(cookies))} LuMi's`;
    document.getElementById('cps').textContent = `${formatNumber(Math.floor(cps * totalMultiplier))} LuMi/s | +${formatNumber(getCurrentClickPower() * totalMultiplier)} per klik`;
    document.getElementById('rebirth-display').textContent = `Rebirths: ${rebirths} (Inkomsten Multiplier: ${rebirthMultiplier}x)`;
    document.getElementById('rebirth-cost').textContent = `Kost: ${formatNumber(rebirthCost)} LuMi`;

    const comboEl = document.getElementById('combo-meter');
    if (clickCombo > 0) {
        comboEl.style.opacity = '1';
        comboEl.textContent = `Combo: ${clickCombo} (${((comboMultiplier - 1) * 100).toFixed(0)}% Bonus!) 🔥`;
    } else {
        comboEl.style.opacity = '0';
    }

    const multBadge = document.getElementById('multiplier-display');
    if (totalMultiplier > rebirthMultiplier) { 
        multBadge.textContent = `⚡ Actieve Multiplier: ${(totalMultiplier / rebirthMultiplier).toFixed(1)}x!`; 
        multBadge.style.display = 'block'; 
    } else { 
        multBadge.style.display = 'none'; 
    }

    // Winkel & Upgrades renderen
    const shopContainer = document.getElementById('shop-items'); 
    shopContainer.innerHTML = '';
    buildings.forEach(building => {
        const div = document.createElement('div'); 
        div.className = `shop-item ${cookies < building.cost ? 'locked' : 'available'}`;
        const typeText = building.type === 'click' ? '/klik' : '/s';
        div.innerHTML = `<div><div class="item-name">${building.name}</div><div class="item-count">${building.count} gekocht</div></div><div><div class="item-cost">${formatNumber(Math.ceil(building.cost))} LuMi</div><div style="font-size:0.75rem;color:#aaa;text-align:right;">+${building.production}${typeText}</div></div>`;
        div.addEventListener('click', (e) => { e.stopPropagation(); buyBuilding(building.id); }); 
        shopContainer.appendChild(div);
    });

    const upgradeContainer = document.getElementById('upgrade-items'); 
    upgradeContainer.innerHTML = '';
    upgrades.forEach(upgrade => {
        if (upgrade.bought) return; 
        const affordable = cookies >= upgrade.cost;
        const div = document.createElement('div'); 
        div.className = `upgrade-item ${affordable ? 'available' : 'locked'}`;
        div.innerHTML = `<div class="item-name">${upgrade.name}</div><div class="item-cost">${formatNumber(upgrade.cost)} LuMi</div>`;
        div.addEventListener('click', (e) => { e.stopPropagation(); buyUpgrade(upgrade.id); }); 
        upgradeContainer.appendChild(div);
    });

    const listEl = document.getElementById('event-counters-list'); 
    if (listEl) {
        listEl.innerHTML = '';
        for (const [evt, count] of Object.entries(eventLog)) { 
            listEl.innerHTML += `<div><strong>${evt}:</strong> ${count}x</div>`; 
        }
    }
}

function buyBuilding(id) {
    const building = buildings.find(b => b.id === id); if (!building || cookies < building.cost) return;
    cookies -= building.cost; building.count++; building.cost = Math.ceil(building.baseCost * Math.pow(1.15, building.count));
    calculateStats(); updateDisplay();
}

function buyUpgrade(id) {
    const upgrade = upgrades.find(u => u.id === id); if (!upgrade || upgrade.bought || cookies < upgrade.cost) return;
    cookies -= upgrade.cost; upgrade.bought = true;
    if (upgrade.global) { buildings.forEach(b => b.production *= upgrade.multiplier); } 
    else { const target = buildings.find(b => b.id === upgrade.target); if (target) target.production *= upgrade.multiplier; }
    calculateStats(); updateDisplay();
}

function calculateStats() {
    cps = 0; clickPower = 1; 
    buildings.forEach(building => {
        if (building.type === 'cps') cps += building.count * building.production;
        else if (building.type === 'click') clickPower += building.count * building.production;
    });
}

// Settings & Rebirth Systeem
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const closeSettings = document.getElementById('close-settings');

settingsBtn.addEventListener('click', () => { settingsPanel.classList.remove('hidden'); });
closeSettings.addEventListener('click', () => { settingsPanel.classList.add('hidden'); });

document.querySelectorAll('.theme-choice').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.body.className = ''; 
        document.body.classList.add(`theme-${e.target.getAttribute('data-theme')}`);
    });
});

document.getElementById('rebirth-btn').addEventListener('click', () => {
    if (cookies >= rebirthCost) {
        cookies = 0; rebirths++; rebirthMultiplier *= 2; rebirthCost *= 10;
        buildings.forEach(b => { b.count = 0; b.cost = b.baseCost; });
        upgrades.forEach(u => u.bought = false);
        alert(`🔄 REBIRTH VOLTOOID! Je multiplier is permanent verdubbeld!`);
        calculateStats(); updateDisplay();
    } else {
        alert(`❌ Niet genoeg LuMi's! Je hebt er ${formatNumber(rebirthCost)} nodig.`);
    }
});

// Cadeau-afhandeling
const giftBtn = document.getElementById('gift-btn'); const giftText = document.getElementById('gift-text');
if (giftBtn) {
    giftBtn.addEventListener('click', () => {
        if (!giftReady) return;
        const reward = Math.max(10, Math.floor(cookies * 0.05)); cookies += reward;
        alert(`🎁 Cadeau geopend! Je ontvangt ${formatNumber(reward)} LuMi's!`);
        updateDisplay(); giftReady = false; giftBtn.disabled = true; let timeRemaining = giftCooldown;
        giftTimerInterval = setInterval(() => {
            timeRemaining--; let mins = Math.floor(timeRemaining / 60); let secs = timeRemaining % 60;
            giftText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timeRemaining <= 0) { clearInterval(giftTimerInterval); giftReady = true; giftBtn.disabled = false; giftText.textContent = "Claim Cadeau!"; }
        }, 1000);
    });
}

// ==========================================
// 4. RANDOM SFEER EVENTS (STERRENREGEN)
// ==========================================
function createEventNotification(text, gradient, shadowColor) {
    const notif = document.createElement('div'); notif.className = 'galaxy-notif';
    notif.style.background = gradient; notif.style.boxShadow = `0 0 40px ${shadowColor}`;
    document.body.appendChild(notif); notif.innerHTML = text; return notif;
}
function stopEvent(bgClass, notif) {
    eventsActive = false; eventMultiplier = 1; baseClickOverride = 0;
    if(notif) notif.remove(); clearInterval(starShowerInterval); updateDisplay();
}

function triggerSterrenregen() { 
    eventLog["Sterrenregen"]++; eventsActive = true; eventMultiplier = 4; document.body.className = "star-bg"; 
    const n = createEventNotification('🌠 STERRENREGEN ACTIEF!', 'linear-gradient(#4b6cb7, #182848)', '#4b6cb7'); 
    starShowerInterval = setInterval(() => { 
        const s = document.createElement('div'); s.className = 'falling-star'; 
        s.textContent = Math.random() > 0.5 ? '⭐' : '🌠'; s.style.left = `${Math.random() * 100}vw`; 
        s.style.animationDuration = `${Math.random() * 2 + 1.5}s`; document.body.appendChild(s); 
        setTimeout(() => s.remove(), 3500); 
    }, 100); 
    setTimeout(() => stopEvent('star-bg', n), 20000); 
}

function triggerAuraLukas() { eventLog["Aura Lukas"]++; eventsActive = true; eventMultiplier = 1000; baseClickOverride = 1000000; document.body.className = "aura-bg"; const n = createEventNotification('👑 AURA LUKAS EVENT!', 'linear-gradient(45deg, #002233, #00ffff)', '#00ffff'); setTimeout(() => stopEvent('aura-bg', n), 12000); }
function triggerMichaRizz() { eventLog["MichaRizz"]++; eventsActive = true; eventMultiplier = 500; document.body.className = "gigachad-bg"; const n = createEventNotification('😎 MICHARIZZ EVENT!', 'linear-gradient(45deg, #2c3e50, #000)', '#fff'); setTimeout(() => stopEvent('gigachad-bg', n), 15000); }
function triggerMJ() { eventLog["Michael Jackson"]++; eventsActive = true; eventMultiplier = 30; document.body.className = "mj-bg"; const m = document.getElementById('bj-music'); if(m){m.currentTime=0; m.play().catch(()=>{});} const n = createEventNotification('🕺 MICHAEL JACKSON EVENT!', 'linear-gradient(#111, #434343)', '#fff'); setTimeout(() => { if(m)m.pause(); stopEvent('mj-bg', n); }, 20000); }
function triggerGalaxy() { eventLog["Galaxy Run"]++; eventsActive = true; eventMultiplier = 5; document.body.className = "galaxy-bg"; const n = createEventNotification('🌌 GALAXY EVENT!', 'linear-gradient(#000046, #1cb5e0)', '#1cb5e0'); setTimeout(() => stopEvent('galaxy-bg', n), 25000); }
function triggerMatrix() { eventLog["Cyber Matrix"]++; eventsActive = true; eventMultiplier = 50; document.body.className = "matrix-bg"; const n = createEventNotification('🖥️ CYBER MATRIX GLITCH!', 'linear-gradient(#001100, #004400)', '#00ff00'); setTimeout(() => stopEvent('matrix-bg', n), 15000); }
function triggerNeonRave() { eventLog["Neon Rave"]++; eventsActive = true; eventMultiplier = 100; document.body.className = "neon-bg"; const n = createEventNotification('👾 NEON RAVE PARTY!', 'linear-gradient(45deg, #f107a3, #7b2ff7)', '#ff00ff'); setTimeout(() => stopEvent('neon-bg', n), 12000); }
function triggerLava() { eventLog["Lava Eruptie"]++; eventsActive = true; eventMultiplier = 250; document.body.className = "lava-bg"; const n = createEventNotification('🌋 LAVA ERUPTIE!', 'linear-gradient(#ff416c, #ff4b2b)', '#ff4b2b'); setTimeout(() => stopEvent('lava-bg', n), 10000); }
function triggerIceAge() { eventLog["Ijs Tijdperk"]++; eventsActive = true; eventMultiplier = 0.5; document.body.className = "ice-bg"; const n = createEventNotification('❄️ IJS TIJDPERK!', 'linear-gradient(#00c6ff, #0072ff)', '#00c6ff'); setTimeout(() => stopEvent('ice-bg', n), 15000); }
function triggerDisco() { eventLog["Retro Disco"]++; eventsActive = true; eventMultiplier = 75; document.body.className = "disco-bg"; const n = createEventNotification('🪩 RETRO DISCO FEEST!', 'linear-gradient(135deg, #ea00d9, #711c91)', '#ea00d9'); setTimeout(() => stopEvent('disco-bg', n), 18000); }

setInterval(() => {
    if (minigameActive) return;
    const allEvents = [triggerAuraLukas, triggerMichaRizz, triggerMJ, triggerGalaxy, triggerSterrenregen, triggerMatrix, triggerNeonRave, triggerLava, triggerIceAge, triggerDisco];
    allEvents[Math.floor(Math.random() * allEvents.length)](); updateDisplay();
}, 60000);

// ==========================================
// 5. MINIGAMES ENGINE
// ==========================================
const minigameInvite = document.getElementById('minigame-invite'); 
const minigameArea = document.getElementById('minigame-area'); 
const minigameContent = document.getElementById('minigame-content');

setInterval(() => {
    if (!eventsActive && !minigameActive) { minigameActive = true; minigameInvite.classList.remove('hidden'); }
}, 30000);

document.getElementById('btn-no').addEventListener('click', () => { minigameInvite.classList.add('hidden'); minigameActive = false; });
document.getElementById('btn-yes').addEventListener('click', () => { minigameInvite.classList.add('hidden'); minigameArea.classList.remove('hidden'); startRandomMinigame(); });

function rewardMinigame(bonus) {
    circleMultiplier += bonus; alert(`🎉 +${bonus} Multiplier verdiend voor de komende 20 seconden!`); updateDisplay();
    setTimeout(() => { circleMultiplier = Math.max(1, circleMultiplier - bonus); updateDisplay(); }, 20000); closeMinigame();
}
function loseMinigame() { alert("😢 Helaas, gecrasht!"); closeMinigame(); }
function closeMinigame() { minigameArea.classList.add('hidden'); minigameContent.innerHTML = ''; minigameActive = false; updateDisplay(); }

function startRandomMinigame() {
    const r = Math.random();
    const gameType = r < 0.33 ? 'flappy' : (r < 0.66 ? 'gd' : 'mj');

    if (gameType === 'flappy') {
        minigameContent.innerHTML = `<h3>🦅 Flappy LuMi</h3><canvas id="flappy-bird" width="440" height="300"></canvas>`;
        const canvas = document.getElementById('flappy-bird'); const ctx = canvas.getContext('2d');
        let birdY = 120, velocity = 0, gravity = 0.22, jump = -4.8; let pipes = [], frame = 0, score = 0, gameStarted = false, gameRunning = true;
        pipes.push({ x: 440, top: 70, bottom: 165 });

        function draw() {
            if (!gameRunning) return; ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (gameStarted) { velocity += gravity; birdY += velocity; }
            ctx.font = "26px Arial"; ctx.fillText("🌟", 50, birdY);
            if (birdY > canvas.height || birdY < 0) { gameRunning = false; rewardMinigame(score + 2); return; }
            if (gameStarted) {
                if (frame % 95 === 0) { let t = Math.random() * 120 + 30; pipes.push({ x: 440, top: t, bottom: t + 95 }); }
                for (let i = pipes.length - 1; i >= 0; i--) {
                    pipes[i].x -= 2;
                    ctx.fillStyle = "#ff00ff"; ctx.fillRect(pipes[i].x, 0, 32, pipes[i].top);
                    ctx.fillStyle = "#00ffff"; ctx.fillRect(pipes[i].x, pipes[i].bottom, 32, canvas.height - pipes[i].bottom);
                    if (pipes[i].x === 50) score++;
                    if (pipes[i].x < 72 && pipes[i].x > 18 && (birdY - 15 < pipes[i].top || birdY + 5 > pipes[i].bottom)) { gameRunning = false; rewardMinigame(score + 2); return; }
                    if (pipes[i].x < -35) pipes.splice(i, 1);
                }
                frame++;
            } else { ctx.fillStyle = "#aaa"; ctx.font = "14px Arial"; ctx.fillText("KLIK OM TE VLIEGEN", 150, 150); }
            ctx.fillStyle = "#fff"; ctx.fillText("Bonus: +" + (score + 2), 10, 25);
            requestAnimationFrame(draw);
        }
        canvas.addEventListener('click', () => { gameStarted = true; velocity = jump; }); draw();

    } else if (gameType === 'gd') {
        minigameContent.innerHTML = `<h3>🔺 Geometry LuMi</h3><canvas id="gd-canvas" width="400" height="230"></canvas>`;
        const canvas = document.getElementById('gd-canvas'); const ctx = canvas.getContext('2d');
        let playerY = 180, velocity = 0, gravity = 0.4, jump = -6.8, isJumping = false;
        let obstacles = [], frame = 0, score = 0, gameStarted = false, gameRunning = true;
        obstacles.push({ x: 400 });

        function drawGD() {
            if (!gameRunning) return; ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#555"; ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(400, 200); ctx.stroke();
            if (gameStarted) {
                velocity += gravity; playerY += velocity;
                if (playerY >= 180) { playerY = 180; velocity = 0; isJumping = false; }
                if (frame % 100 === 0) { obstacles.push({ x: 400 }); }
                for (let i = obstacles.length - 1; i >= 0; i--) {
                    obstacles[i].x -= 3.2;
                    ctx.fillStyle = "#ff3300"; ctx.beginPath(); ctx.moveTo(obstacles[i].x, 200); ctx.lineTo(obstacles[i].x + 12, 178); ctx.lineTo(obstacles[i].x + 24, 200); ctx.fill();
                    if (obstacles[i].x === 32) score++;
                    let pX = 35; if (obstacles[i].x < (pX + 10) && (obstacles[i].x + 18) > pX && playerY >= 172) { gameRunning = false; rewardMinigame(score + 3); return; }
                    if (obstacles[i].x < -30) obstacles.splice(i, 1);
                }
                frame++;
            } else { ctx.fillStyle = "#aaa"; ctx.font = "14px Arial"; ctx.fillText("KLIK OM TE STARTEN", 130, 110); }
            ctx.font = "20px Arial"; ctx.fillText("🌟", 30, playerY + 15);
            ctx.fillStyle = "#fff"; ctx.fillText("Bonus: +" + (score + 3), 10, 20);
            requestAnimationFrame(drawGD);
        }
        canvas.addEventListener('click', () => { gameStarted = true; if (!isJumping) { velocity = jump; isJumping = true; } }); drawGD();

    } else {
        minigameContent.innerHTML = `<h3>🕺 MJ Moonwalk Blitz</h3><canvas id="mj-canvas" width="400" height="230"></canvas>`;
        const canvas = document.getElementById('mj-canvas'); const ctx = canvas.getContext('2d');
        let mjX = 380, speed = 2.5, gameStarted = false, gameRunning = true; const targetX = 80; 

        function drawMJGame() {
            if (!gameRunning) return; ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "#ff00ff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(400, 150); ctx.stroke();
            ctx.font = "30px Arial"; ctx.fillText("⭐", targetX, 145);
            if (gameStarted) { mjX -= speed; if (mjX < -30) { mjX = 380; } } 
            else { ctx.fillStyle = "#aaa"; ctx.font = "14px Arial"; ctx.fillText("KLIK ALS MJ OP DE STER STAAT", 90, 80); }
            ctx.font = "32px Arial"; ctx.fillText("🕴️", mjX, 142);
            requestAnimationFrame(drawMJGame);
        }
        canvas.addEventListener('click', () => {
            if (!gameStarted) { gameStarted = true; return; }
            gameRunning = false;
            if (Math.abs(mjX - targetX) <= 22) { rewardMinigame(10); } else { loseMinigame(); }
        });
        drawMJGame();
    }
}

// ==========================================
// 6. LOOP & DOPAMINE KLIK AFHANDELING
// ==========================================
function gameLoop() { 
    if (Date.now() - lastClickTime > comboDecayTime && clickCombo > 0) {
        clickCombo = Math.floor(clickCombo * 0.7) - 1;
        if (clickCombo < 0) clickCombo = 0;
    }
    
    const comboMultiplier = 1 + (Math.min(clickCombo, 50) / 50);
    cookies += (cps * (eventMultiplier * circleMultiplier * rebirthMultiplier * comboMultiplier)) / 60; 
}

document.getElementById('lumi').addEventListener('click', (e) => {
    clickCombo++;
    lastClickTime = Date.now();

    const comboMultiplier = 1 + (Math.min(clickCombo, 50) / 50);
    let baseGained = getCurrentClickPower() * (eventMultiplier * circleMultiplier * rebirthMultiplier * comboMultiplier); 
    
    // 10% Kans op een Crit Klik
    const isCrit = Math.random() < 0.10;
    if (isCrit) baseGained *= 5;

    cookies += baseGained; 

    const effect = document.createElement('div'); 
    effect.className = `click-effect ${isCrit ? 'crit' : ''}`; 
    effect.textContent = isCrit ? `🔥 CRIT! +${formatNumber(baseGained)}` : `+${formatNumber(baseGained)}`; 
    effect.style.left = `${e.clientX - 20}px`; 
    effect.style.top = `${e.clientY - 50}px`;
    
    document.body.appendChild(effect); 
    setTimeout(() => effect.remove(), 900); 
    updateDisplay();
});

// Save, Load, Reset
document.getElementById('save-btn').addEventListener('click', () => { 
    localStorage.setItem('lumiClickerSaveApex', JSON.stringify({ cookies: Math.floor(cookies), buildings, eventLog, rebirths, rebirthMultiplier, rebirthCost })); 
    alert('✅ Voortgang Opgeslagen!'); 
});
document.getElementById('load-btn').addEventListener('click', () => {
    const saved = localStorage.getItem('lumiClickerSaveApex'); if (!saved) return alert('Geen save gevonden.');
    const data = JSON.parse(saved); cookies = data.cookies || 0; rebirths = data.rebirths || 0; rebirthMultiplier = data.rebirthMultiplier || 1; rebirthCost = data.rebirthCost || 1000000000000;
    if(data.buildings) buildings.forEach((b, i) => { if(data.buildings[i]) Object.assign(b, data.buildings[i]); });
    if(data.eventLog) Object.assign(eventLog, data.eventLog);
    calculateStats(); updateDisplay(); alert('✅ Voortgang Geladen!');
});
document.getElementById('reset-btn').addEventListener('click', () => { if (confirm('Helemaal resetten?')) { localStorage.removeItem('lumiClickerSaveApex'); location.reload(); } });

calculateStats(); updateDisplay();
setInterval(gameLoop, 1000 / 60); setInterval(updateDisplay, 250);