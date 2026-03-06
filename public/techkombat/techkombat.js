// TECH KOMBAT - 32bit MK Style Fighting Game
const C = document.getElementById('gc'), X = C.getContext('2d');
const W = 960, H = 540; C.width = W; C.height = H;
if ('ontouchstart' in window) document.getElementById('mobile-controls').style.display = 'flex';

// Audio
const AC = new (window.AudioContext || window.webkitAudioContext)();
function snd(t) {
    if (AC.state === 'suspended') AC.resume(); const o = AC.createOscillator(), g = AC.createGain(); o.connect(g); g.connect(AC.destination); const n = AC.currentTime;
    if (t === 'hit') { o.type = 'sawtooth'; o.frequency.setValueAtTime(200, n); o.frequency.exponentialRampToValueAtTime(80, n + .08); g.gain.setValueAtTime(.4, n); g.gain.exponentialRampToValueAtTime(.01, n + .08); o.start(n); o.stop(n + .08) }
    else if (t === 'block') { o.type = 'triangle'; o.frequency.setValueAtTime(800, n); g.gain.setValueAtTime(.15, n); g.gain.exponentialRampToValueAtTime(.01, n + .05); o.start(n); o.stop(n + .05) }
    else if (t === 'special') { o.type = 'square'; o.frequency.setValueAtTime(300, n); o.frequency.linearRampToValueAtTime(600, n + .15); g.gain.setValueAtTime(.3, n); g.gain.linearRampToValueAtTime(.01, n + .2); o.start(n); o.stop(n + .2) }
    else if (t === 'ko') { o.type = 'sawtooth'; o.frequency.setValueAtTime(300, n); o.frequency.exponentialRampToValueAtTime(20, n + .6); g.gain.setValueAtTime(.5, n); g.gain.linearRampToValueAtTime(.01, n + .6); o.start(n); o.stop(n + .6) }
    else if (t === 'fight') { o.type = 'square'; o.frequency.setValueAtTime(400, n); o.frequency.setValueAtTime(500, n + .1); o.frequency.setValueAtTime(600, n + .2); g.gain.setValueAtTime(.3, n); g.gain.linearRampToValueAtTime(.01, n + .3); o.start(n); o.stop(n + .3) }
    else if (t === 'select') { o.type = 'sine'; o.frequency.setValueAtTime(440, n); o.frequency.setValueAtTime(660, n + .05); g.gain.setValueAtTime(.15, n); g.gain.exponentialRampToValueAtTime(.01, n + .1); o.start(n); o.stop(n + .1) }
    else if (t === 'win') { o.type = 'square';[400, 500, 600, 800].forEach((f, i) => { o.frequency.setValueAtTime(f, n + i * .15) }); g.gain.setValueAtTime(.25, n); g.gain.linearRampToValueAtTime(.01, n + .7); o.start(n); o.stop(n + .7) }
}

// Input
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; e.preventDefault() });
window.addEventListener('keyup', e => { keys[e.key] = false });
document.querySelectorAll('[data-key]').forEach(b => {
    b.addEventListener('touchstart', e => { e.preventDefault(); keys[b.dataset.key] = true });
    b.addEventListener('touchend', e => { e.preventDefault(); keys[b.dataset.key] = false })
});

// Roster
const ROSTER = [
    {
        id: 'elon', name: 'ELON', colors: { skin: '#ffdbac', hair: '#3e2723', shirt: '#fff', suit: '#111', cape: '#1a1a2e', tie: '#c0392b', eyes: '#2c3e50' },
        specName: 'X-BEAM', weight: 1.1, speed: 4.5, power: 1.1, defense: 0.9
    },
    {
        id: 'zuck', name: 'ZUCK', colors: { skin: '#f5deb3', hair: '#8b4513', shirt: '#95a5a6', suit: '#546e7a', tie: '#2c3e50', eyes: '#3498db' },
        specName: 'META BLAST', weight: 0.9, speed: 5.5, power: 0.9, defense: 0.85
    },
    {
        id: 'gates', name: 'GATES', colors: { skin: '#ffdbac', hair: '#95a5a6', shirt: '#8e44ad', suit: '#6c3483', tie: '#f1c40f', eyes: '#2c3e50', glasses: true },
        specName: 'BLUE SCREEN', weight: 1.0, speed: 4, power: 1.0, defense: 1.1
    },
    {
        id: 'bezos', name: 'BEZOS', colors: { skin: '#ffdbac', hair: '#ffdbac', shirt: '#212121', suit: '#1a1a1a', tie: '#f39c12', eyes: '#2c3e50', bald: true },
        specName: 'PRIME STRIKE', weight: 1.05, speed: 4.2, power: 1.15, defense: 1.0
    },
    {
        id: 'doge', name: 'DOGE', colors: { skin: '#f1c40f', hair: '#fff', shirt: '#e67e22', suit: '#d35400', eyes: '#000' },
        specName: 'MOON HOWL', weight: 0.75, speed: 6, power: 0.8, defense: 0.7
    },
    {
        id: 'altman', name: 'ALTMAN', colors: { skin: '#ffdbac', hair: '#4a3728', shirt: '#ecf0f1', suit: '#34495e', tie: '#27ae60', eyes: '#2c3e50' },
        specName: 'GPT SURGE', weight: 1.0, speed: 4.8, power: 1.05, defense: 0.95
    }
];

const STAGES = [
    { id: 'gigafactory', name: 'GIGAFACTORY ARENA', sky: ['#0b1e3b', '#1c4e80'], floor: '#2c3e50', accent: '#f1c40f' },
    { id: 'mars', name: 'MARS COLONY', sky: ['#1a0505', '#5e2015'], floor: '#8b4513', accent: '#e74c3c' },
    { id: 'metaverse', name: 'METAVERSE', sky: ['#0a001a', '#1a0b2e'], floor: '#2d1b69', accent: '#00ffff' },
    { id: 'boardroom', name: 'SILICON BOARDROOM', sky: ['#1a1a2e', '#16213e'], floor: '#0f3460', accent: '#e94560' }
];

// Game state
let state = 'title', selP1 = 0, selP2 = 1, selStage = 0, p1Wins = 0, p2Wins = 0, round = 1, roundTimer = 99;
let announceText = '', announceTimer = 0, shakeAmt = 0, hitStop = 0, particles = [];
let titleFlash = 0, selCursor = 0, stageSelecting = false;
let p1 = {}, p2 = {}, gameTime = 0, freezeTimer = 0;

// Fighter class
function makeFighter(data, x, faceR) {
    return {
        data, x, y: H - 180, w: 60, h: 100, vx: 0, vy: 0, hp: 100, faceR,
        state: 'idle', frame: 0, timer: 0, atkCooldown: 0, hitStun: 0, blockStun: 0,
        combo: 0, lastHitTime: 0, specialCharge: 0, canAct: true, onGround: true,
        jumps: 0, crouching: false, blocking: false, wasHit: false, animFrame: 0
    };
}

function drawChar(f, ghost) {
    const c = f.data.colors, sx = Math.floor(f.x), sy = Math.floor(f.y);
    X.save();
    X.translate(sx + f.w / 2, sy);
    if (!f.faceR) X.scale(-1, 1);
    X.translate(-f.w / 2, 0);
    if (ghost) { X.globalAlpha = 0.3; }
    if (f.hitStun > 0 && Math.floor(gameTime / 3) % 2) X.globalAlpha = 0.5;
    const bob = f.state === 'idle' ? Math.sin(gameTime * 0.08) * 2 : 0;
    const isDoge = f.data.id === 'doge';

    if (isDoge) {
        // Body
        X.fillStyle = '#e67e22'; X.fillRect(5, 50 + bob, 50, 30);
        // Head
        X.fillStyle = '#f1c40f'; X.fillRect(35, 30 + bob, 28, 28);
        // Ears
        X.fillStyle = '#d35400';
        X.beginPath(); X.moveTo(38, 30 + bob); X.lineTo(34, 15 + bob); X.lineTo(44, 30 + bob); X.fill();
        X.beginPath(); X.moveTo(52, 30 + bob); X.lineTo(56, 15 + bob); X.lineTo(60, 30 + bob); X.fill();
        // Eyes
        X.fillStyle = '#000'; X.fillRect(42, 40 + bob, 4, 4); X.fillRect(54, 40 + bob, 4, 4);
        // Nose
        X.fillStyle = '#000'; X.fillRect(48, 48 + bob, 5, 3);
        // Tail
        X.fillStyle = '#f1c40f';
        X.beginPath(); X.moveTo(5, 55 + bob); X.lineTo(-8, 45 + bob); X.lineTo(0, 60 + bob); X.fill();
        // Legs
        const legAnim = f.state === 'walk' ? Math.sin(gameTime * 0.3) * 6 : 0;
        X.fillStyle = '#d35400';
        X.fillRect(12, 78 + bob, 10, 22 + legAnim); X.fillRect(38, 78 + bob, 10, 22 - legAnim);
        // Attack arm
        if (f.state === 'attack' || f.state === 'special') {
            X.fillStyle = f.state === 'special' ? '#00ffff' : '#d35400';
            X.fillRect(55, 45 + bob, 30, 8);
        }
    } else {
        // HUMANOID
        // Legs
        const legR = f.state === 'walk' ? Math.sin(gameTime * 0.3) * 8 : 0;
        X.fillStyle = c.suit;
        X.fillRect(15, 75 + bob, 12, 25 + legR); X.fillRect(33, 75 + bob, 12, 25 - legR);
        // Shoes
        X.fillStyle = '#111'; X.fillRect(13, 98 + bob + Math.max(0, legR), 16, 5); X.fillRect(31, 98 + bob + Math.max(0, -legR), 16, 5);
        // Body/Torso
        X.fillStyle = c.suit; X.fillRect(10, 35 + bob, 40, 42);
        // Shirt
        X.fillStyle = c.shirt; X.fillRect(14, 38 + bob, 32, 35);
        // Tie
        if (c.tie) { X.fillStyle = c.tie; X.fillRect(28, 38 + bob, 4, 30); }
        // Cape for Elon
        if (f.data.id === 'elon') {
            X.fillStyle = '#1a1a2e'; X.globalAlpha = 0.7;
            X.beginPath(); X.moveTo(10, 40 + bob); X.lineTo(-5, 95 + bob); X.lineTo(15, 90 + bob); X.fill();
            X.globalAlpha = ghost ? 0.3 : 1;
            // X logo on chest
            X.fillStyle = '#fff'; X.font = 'bold 16px sans-serif'; X.fillText('X', 22, 58 + bob);
        }
        // Head
        X.fillStyle = c.skin; X.fillRect(16, 8 + bob, 28, 28);
        // Hair
        if (!c.bald) { X.fillStyle = c.hair; X.fillRect(14, 5 + bob, 32, 10); X.fillRect(14, 5 + bob, 5, 20); }
        // Eyes
        X.fillStyle = c.eyes || '#000'; X.fillRect(22, 18 + bob, 4, 4); X.fillRect(34, 18 + bob, 4, 4);
        // Glasses for Gates
        if (c.glasses) { X.strokeStyle = '#333'; X.lineWidth = 2; X.strokeRect(19, 16 + bob, 12, 8); X.strokeRect(33, 16 + bob, 12, 8); X.beginPath(); X.moveTo(31, 20 + bob); X.lineTo(33, 20 + bob); X.stroke(); }
        // Zuck robot eyes
        if (f.data.id === 'zuck') { X.fillStyle = '#3498db'; X.fillRect(22, 18 + bob, 4, 4); X.fillRect(34, 18 + bob, 4, 4); }
        // Mouth
        X.fillStyle = '#b5651d'; X.fillRect(26, 30 + bob, 8, 3);
        // Arms
        if (f.state === 'attack') {
            X.fillStyle = c.skin; X.fillRect(48, 40 + bob, 25, 8);
            X.fillStyle = '#e74c3c'; X.fillRect(70, 37 + bob, 12, 14);
        } else if (f.state === 'special') {
            X.fillStyle = c.skin; X.fillRect(48, 42 + bob, 15, 8);
            // Projectile charge
            const sc = f.data.id === 'elon' ? '#3498db' : f.data.id === 'zuck' ? '#1877f2' : f.data.id === 'gates' ? '#00a4ef' : f.data.id === 'bezos' ? '#ff9900' : f.data.id === 'altman' ? '#10a37f' : '#f1c40f';
            X.fillStyle = sc; X.globalAlpha = 0.5 + Math.sin(gameTime * 0.5) * 0.3;
            X.beginPath(); X.arc(68, 48 + bob, 10 + Math.sin(gameTime * 0.3) * 3, 0, Math.PI * 2); X.fill();
            X.globalAlpha = ghost ? 0.3 : 1;
        } else if (f.blocking) {
            X.fillStyle = c.skin; X.fillRect(5, 38 + bob, 12, 8); X.fillRect(48, 38 + bob, 12, 8);
            X.fillStyle = 'rgba(52,152,219,0.4)'; X.beginPath(); X.arc(30, 55 + bob, 35, 0, Math.PI * 2); X.fill();
        } else if (f.crouching) {
            // crouch pose - arms down
            X.fillStyle = c.skin; X.fillRect(5, 55 + bob, 10, 8); X.fillRect(45, 55 + bob, 10, 8);
        } else {
            // idle arms
            X.fillStyle = c.skin; X.fillRect(2, 42 + bob, 10, 25); X.fillRect(48, 42 + bob, 10, 25);
            // Fists
            X.fillStyle = c.suit; X.fillRect(2, 64 + bob, 10, 8); X.fillRect(48, 64 + bob, 10, 8);
        }
    }

    // Crouch squish
    if (f.crouching && !isDoge) { X.restore(); return; }
    X.restore();
}

// Projectile
let projectiles = [];
function fireProjectile(f) {
    const col = f.data.id === 'elon' ? '#3498db' : f.data.id === 'zuck' ? '#1877f2' : f.data.id === 'gates' ? '#00a4ef' : f.data.id === 'bezos' ? '#ff9900' : f.data.id === 'altman' ? '#10a37f' : '#f1c40f';
    projectiles.push({ x: f.x + (f.faceR ? f.w + 10 : -10), y: f.y + 40, vx: f.faceR ? 8 : -8, w: 20, h: 12, color: col, owner: f, life: 60, dmg: 12 });
    snd('special');
}

// Particles
function addParticles(x, y, col, n = 8) { for (let i = 0; i < n; i++)particles.push({ x, y, vx: (Math.random() - .5) * 10, vy: (Math.random() - .5) * 10, life: 20 + Math.random() * 10, color: col, size: Math.random() * 5 + 2 }); }

// Draw stage
function drawStage(st) {
    const grd = X.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, st.sky[0]); grd.addColorStop(1, st.sky[1]);
    X.fillStyle = grd; X.fillRect(0, 0, W, H);
    const floorY = H - 80;
    if (st.id === 'gigafactory') {
        // Pillars
        for (let i = 0; i < W; i += 160) {
            X.fillStyle = '#1a1a2e'; X.fillRect(i, 60, 30, floorY - 60);
            X.fillStyle = 'rgba(241,196,15,0.6)'; X.fillRect(i + 8, 100, 14, 8); X.fillRect(i + 8, 140, 14, 8);
        }
        // Robot arms bg
        for (let i = 0; i < 3; i++) {
            const ax = 120 + i * 300, sw = Math.sin(gameTime * 0.02 + i) * 15;
            X.strokeStyle = '#555'; X.lineWidth = 8; X.beginPath(); X.moveTo(ax, 0); X.lineTo(ax + sw, 180); X.stroke();
            X.fillStyle = '#e74c3c'; X.fillRect(ax + sw - 10, 175, 20, 15);
        }
        // Circuit lines on floor
        X.strokeStyle = st.accent; X.lineWidth = 1; X.globalAlpha = 0.3;
        for (let i = 0; i < 10; i++) { X.beginPath(); X.moveTo(i * 100, floorY); X.lineTo(i * 100 + 50, floorY + 40); X.stroke(); }
        X.globalAlpha = 1;
    } else if (st.id === 'mars') {
        // Stars
        X.fillStyle = '#fff'; for (let i = 0; i < 60; i++) { const a = Math.random() > .98 ? 0 : 1; X.globalAlpha = a; X.fillRect((i * 137) % W, (i * 67) % 300, 2, 2); } X.globalAlpha = 1;
        // Earth
        X.fillStyle = '#3498db'; X.beginPath(); X.arc(W - 80, 80, 25, 0, Math.PI * 2); X.fill();
        X.fillStyle = '#2ecc71'; X.beginPath(); X.arc(W - 88, 72, 8, 0, Math.PI * 2); X.fill();
        // Mountains
        X.fillStyle = '#4e342e'; X.beginPath(); X.moveTo(0, floorY);
        for (let i = 0; i <= W; i += 40)X.lineTo(i, floorY - 60 - Math.sin(i * .015) * 40);
        X.lineTo(W, floorY); X.fill();
        // Dust
        X.fillStyle = 'rgba(180,100,50,0.15)'; X.fillRect(0, floorY - 30, W, 30);
    } else if (st.id === 'metaverse') {
        // Grid
        X.strokeStyle = 'rgba(0,255,255,0.3)'; X.lineWidth = 1;
        for (let i = 0; i < W; i += 80) { X.beginPath(); X.moveTo(i, 0); X.lineTo(i, H); X.stroke(); }
        for (let i = 0; i < H; i += 80) { X.beginPath(); X.moveTo(0, i); X.lineTo(W, i); X.stroke(); }
        // Digital rain
        X.font = '12px monospace'; X.fillStyle = 'rgba(0,255,0,0.25)';
        for (let i = 0; i < 30; i++) { X.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), (i * 40) % W, (gameTime * 2 + i * 80) % H); }
        // Floating shapes
        X.strokeStyle = '#ff00ff'; X.lineWidth = 2;
        X.strokeRect(W * .2 + Math.sin(gameTime * .02) * 20, H * .3, 50, 50);
        X.beginPath(); X.arc(W * .75, H * .35 + Math.cos(gameTime * .015) * 30, 30, 0, Math.PI * 2); X.stroke();
    } else {
        // Boardroom
        for (let i = 80; i < W; i += 120) {
            X.fillStyle = '#1a1a2e'; X.fillRect(i, 100, 60, floorY - 100);
            X.fillStyle = 'rgba(233,69,96,0.3)'; X.fillRect(i + 10, 120, 40, 30);
        }
        X.fillStyle = 'rgba(15,52,96,0.5)'; X.fillRect(200, 150, W - 400, 200);
        X.strokeStyle = '#e94560'; X.lineWidth = 2; X.strokeRect(200, 150, W - 400, 200);
    }
    // Floor
    X.fillStyle = st.floor; X.fillRect(0, floorY, W, H - floorY);
    X.fillStyle = st.accent; X.fillRect(0, floorY, W, 4);
    // "TECH KOMBAT" on floor
    X.globalAlpha = 0.1; X.fillStyle = '#fff'; X.font = 'bold 60px "Press Start 2P"'; X.textAlign = 'center';
    X.fillText('TECH KOMBAT', W / 2, floorY + 50); X.textAlign = 'left'; X.globalAlpha = 1;
}

// HUD
function drawHUD() {
    const bw = 300, bh = 20, margin = 40, by = 30;
    // P1 health (left, drains right to left)
    X.fillStyle = '#333'; X.fillRect(margin, by, bw, bh);
    const p1Pct = Math.max(0, p1.hp) / 100;
    const hpCol1 = p1.hp > 50 ? '#f1c40f' : p1.hp > 25 ? '#e67e22' : '#e74c3c';
    X.fillStyle = hpCol1; X.fillRect(margin, by, bw * p1Pct, bh);
    X.strokeStyle = '#fff'; X.lineWidth = 2; X.strokeRect(margin, by, bw, bh);
    // P2 health (right, drains left to right)
    X.fillStyle = '#333'; X.fillRect(W - margin - bw, by, bw, bh);
    const p2Pct = Math.max(0, p2.hp) / 100;
    const hpCol2 = p2.hp > 50 ? '#f1c40f' : p2.hp > 25 ? '#e67e22' : '#e74c3c';
    X.fillStyle = hpCol2; X.fillRect(W - margin - bw * p2Pct, by, bw * p2Pct, bh);
    X.strokeStyle = '#fff'; X.lineWidth = 2; X.strokeRect(W - margin - bw, by, bw, bh);
    // Names
    X.font = '12px "Press Start 2P"'; X.fillStyle = '#fff'; X.textAlign = 'left';
    X.fillText(p1.data.name, margin, by - 8);
    X.textAlign = 'right'; X.fillText(p2.data.name, W - margin, by - 8);
    // Round indicators
    X.textAlign = 'center';
    for (let i = 0; i < 2; i++) { X.fillStyle = i < p1Wins ? '#f1c40f' : '#333'; X.beginPath(); X.arc(margin + bw + 20 + i * 20, by + 10, 6, 0, Math.PI * 2); X.fill(); }
    for (let i = 0; i < 2; i++) { X.fillStyle = i < p2Wins ? '#f1c40f' : '#333'; X.beginPath(); X.arc(W - margin - bw - 20 - i * 20, by + 10, 6, 0, Math.PI * 2); X.fill(); }
    // Timer
    X.font = '24px "Press Start 2P"'; X.fillStyle = '#fff'; X.textAlign = 'center';
    X.fillText(Math.max(0, Math.ceil(roundTimer)).toString(), W / 2, by + 18);
    // Special meters
    const smW = 100;
    X.fillStyle = '#222'; X.fillRect(margin, by + bh + 6, smW, 8); X.fillRect(W - margin - smW, by + bh + 6, smW, 8);
    X.fillStyle = '#3498db'; X.fillRect(margin, by + bh + 6, smW * (p1.specialCharge / 100), 8);
    X.fillStyle = '#e74c3c'; X.fillRect(W - margin - smW * (p2.specialCharge / 100), by + bh + 6, smW * (p2.specialCharge / 100), 8);
    X.font = '6px "Press Start 2P"'; X.textAlign = 'left'; X.fillStyle = '#aaa'; X.fillText('SPECIAL', margin, by + bh + 20);
    X.textAlign = 'right'; X.fillText('SPECIAL', W - margin, by + bh + 20);
    X.textAlign = 'left';
}

// Fighter update
function updateFighter(f, enemy, isAI) {
    if (freezeTimer > 0) return;
    f.animFrame++;
    // Gravity
    if (!f.onGround) { f.vy += 0.6; f.y += f.vy; if (f.y >= H - 180) { f.y = H - 180; f.vy = 0; f.onGround = true; f.jumps = 0; } }
    // Hitstun
    if (f.hitStun > 0) { f.hitStun--; f.x += f.vx; f.vx *= 0.9; if (f.hitStun <= 0) { f.state = 'idle'; f.canAct = true; } return; }
    if (f.blockStun > 0) { f.blockStun--; return; }
    if (f.atkCooldown > 0) f.atkCooldown--;

    let moveL = false, moveR = false, jump = false, crouch = false, atk = false, kick = false, spec = false, block = false;

    if (isAI) {
        // AI
        const dx = enemy.x - f.x, dy = enemy.y - f.y, dist = Math.abs(dx);
        if (dist > 120) { if (dx > 0) moveR = true; else moveL = true; }
        if (dist < 80 && Math.random() < 0.06) atk = true;
        if (dist < 100 && Math.random() < 0.04) kick = true;
        if (dist > 200 && f.specialCharge >= 100 && Math.random() < 0.03) spec = true;
        if (enemy.state === 'attack' && dist < 100 && Math.random() < 0.15) block = true;
        if (dy < -50 && Math.random() < 0.03) jump = true;
        if (f.y > enemy.y + 30 && Math.random() < 0.05) jump = true;
    } else {
        moveL = keys['ArrowLeft']; moveR = keys['ArrowRight'];
        jump = keys['ArrowUp']; crouch = keys['ArrowDown'];
        atk = keys['z'] || keys['Z']; kick = keys['x'] || keys['X'];
        spec = keys['c'] || keys['C']; block = crouch && !moveL && !moveR;
    }

    // Face enemy
    f.faceR = f.x < enemy.x;
    // Movement
    f.crouching = crouch && f.onGround && !atk && !kick;
    f.blocking = block && f.onGround;
    if (f.blocking) { f.state = 'block'; f.vx = 0; return; }
    if (f.state === 'attack' || f.state === 'special') { f.timer--; if (f.timer <= 0) { f.state = 'idle'; f.canAct = true; } return; }

    const spd = f.data.speed * (f.crouching ? 0 : 1);
    if (moveL && f.canAct) { f.vx = -spd; f.state = 'walk'; }
    else if (moveR && f.canAct) { f.vx = spd; f.state = 'walk'; }
    else { f.vx *= 0.7; if (f.onGround && f.canAct) f.state = 'idle'; }
    f.x += f.vx;

    // Boundaries
    if (f.x < 20) f.x = 20; if (f.x > W - f.w - 20) f.x = W - f.w - 20;

    // Jump
    if (jump && f.jumps < 2 && f.canAct && !f.crouching) { f.vy = -11; f.onGround = false; f.jumps++; f.state = 'jump'; snd('select'); }

    // Attack
    if (atk && f.atkCooldown <= 0 && f.canAct) {
        f.state = 'attack'; f.timer = 12; f.atkCooldown = 18; f.canAct = false; f.wasHit = false;
        const reach = 65, hx = f.faceR ? f.x + f.w : f.x - reach;
        if (hx < enemy.x + enemy.w && hx + reach > enemy.x && f.y < enemy.y + enemy.h && f.y + f.h > enemy.y) {
            if (enemy.blocking) { snd('block'); enemy.blockStun = 10; enemy.vx = f.faceR ? 3 : -3; addParticles(enemy.x + enemy.w / 2, enemy.y + 40, '#3498db', 4); }
            else {
                const dmg = 8 * f.data.power; enemy.hp -= dmg; enemy.hitStun = 12; enemy.vx = f.faceR ? 6 : -6; enemy.state = 'stun';
                f.specialCharge = Math.min(100, f.specialCharge + 15); shakeAmt = 6;
                addParticles(enemy.x + enemy.w / 2, enemy.y + 40, '#fff'); snd('hit');
            }
        }
    }

    // Kick
    if (kick && f.atkCooldown <= 0 && f.canAct) {
        f.state = 'attack'; f.timer = 15; f.atkCooldown = 22; f.canAct = false;
        const reach = 75, hx = f.faceR ? f.x + f.w : f.x - reach;
        if (hx < enemy.x + enemy.w && hx + reach > enemy.x && f.y < enemy.y + enemy.h && f.y + f.h > enemy.y) {
            if (enemy.blocking) { snd('block'); enemy.blockStun = 12; enemy.vx = f.faceR ? 4 : -4; addParticles(enemy.x + enemy.w / 2, enemy.y + 60, '#3498db', 4); }
            else {
                const dmg = 12 * f.data.power; enemy.hp -= dmg; enemy.hitStun = 18; enemy.vy = -5; enemy.vx = f.faceR ? 8 : -8; enemy.onGround = false; enemy.state = 'stun';
                f.specialCharge = Math.min(100, f.specialCharge + 20); shakeAmt = 10;
                addParticles(enemy.x + enemy.w / 2, enemy.y + 60, '#f1c40f', 10); snd('hit');
            }
        }
    }

    // Special
    if (spec && f.specialCharge >= 100 && f.canAct) {
        f.state = 'special'; f.timer = 20; f.canAct = false; f.specialCharge = 0;
        fireProjectile(f);
    }
}

// Title screen
function drawTitle() {
    X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
    // Animated bg
    X.strokeStyle = 'rgba(231,76,60,0.1)'; X.lineWidth = 2;
    for (let i = 0; i < 20; i++) { X.beginPath(); X.arc(W / 2, H / 2, (i * 40 + gameTime) % 800, 0, Math.PI * 2); X.stroke(); }
    // Dragon-style border
    const pulse = Math.sin(gameTime * 0.05) * 0.3 + 0.7;
    X.strokeStyle = `rgba(231,76,60,${pulse})`; X.lineWidth = 4; X.strokeRect(40, 30, W - 80, H - 60);
    X.strokeStyle = `rgba(241,196,15,${pulse * 0.5})`; X.lineWidth = 2; X.strokeRect(50, 40, W - 100, H - 80);
    // Title
    X.textAlign = 'center';
    X.font = '48px "Press Start 2P"';
    X.fillStyle = '#e74c3c'; X.fillText('TECH', W / 2, 150);
    X.fillStyle = '#f1c40f'; X.font = '56px "Press Start 2P"'; X.fillText('KOMBAT', W / 2, 215);
    // Subtitle
    X.font = '16px "Press Start 2P"'; X.fillStyle = '#3498db'; X.fillText('SILICON CLASH', W / 2, 260);
    // Flash prompt
    titleFlash += 0.05;
    if (Math.sin(titleFlash) > 0) { X.font = '14px "Press Start 2P"'; X.fillStyle = '#fff'; X.fillText('PRESS ENTER TO START', W / 2, 380); }
    X.font = '10px "Press Start 2P"'; X.fillStyle = '#888';
    X.fillText('Z=PUNCH  X=KICK  C=SPECIAL  ↓=BLOCK', W / 2, 430);
    X.fillText('ARROWS=MOVE  UP=JUMP', W / 2, 455);
    // Dragon emblem
    X.fillStyle = '#e74c3c'; X.globalAlpha = 0.15; X.font = '200px serif'; X.fillText('⚔', W / 2, 380); X.globalAlpha = 1;
    X.textAlign = 'left';
    if (keys['Enter'] || keys[' ']) { state = 'charselect'; selP1 = 0; selP2 = 1; keys['Enter'] = false; keys[' '] = false; snd('fight'); }
}

// Character select
function drawCharSelect() {
    X.fillStyle = '#0a0a1a'; X.fillRect(0, 0, W, H);
    X.textAlign = 'center'; X.font = '20px "Press Start 2P"'; X.fillStyle = '#f1c40f';
    X.fillText('SELECT YOUR FIGHTER', W / 2, 50);
    // Grid
    const cols = 3, rows = 2, cw = 120, ch = 140, gap = 20;
    const ox = (W - (cols * (cw + gap) - gap)) / 2, oy = 80;
    ROSTER.forEach((r, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const cx = ox + col * (cw + gap), cy = oy + row * (ch + gap);
        const sel = i === selP1;
        X.fillStyle = sel ? '#222' : '#111'; X.fillRect(cx, cy, cw, ch);
        X.strokeStyle = sel ? '#f1c40f' : '#444'; X.lineWidth = sel ? 3 : 1; X.strokeRect(cx, cy, cw, ch);
        if (sel) { X.shadowColor = '#f1c40f'; X.shadowBlur = 15; X.strokeRect(cx, cy, cw, ch); X.shadowBlur = 0; }
        // Mini portrait
        const f = makeFighter(r, cx + 30, true); f.y = cy + 10; f.state = 'idle';
        X.save(); X.beginPath(); X.rect(cx, cy, cw, ch - 25); X.clip();
        drawChar(f); X.restore();
        // Name
        X.font = '8px "Press Start 2P"'; X.fillStyle = sel ? '#f1c40f' : '#888'; X.textAlign = 'center';
        X.fillText(r.name, cx + cw / 2, cy + ch - 8);
    });
    // Fighter info
    const sel = ROSTER[selP1];
    X.font = '10px "Press Start 2P"'; X.fillStyle = '#fff'; X.textAlign = 'left';
    X.fillText('SPECIAL: ' + sel.specName, 50, H - 60);
    X.fillText('SPD:' + sel.speed.toFixed(1) + ' PWR:' + sel.power.toFixed(1) + ' DEF:' + sel.defense.toFixed(1), 50, H - 40);
    X.textAlign = 'center'; X.font = '10px "Press Start 2P"'; X.fillStyle = '#aaa';
    X.fillText('← → SELECT   ENTER TO FIGHT', W / 2, H - 15);
    X.textAlign = 'left';
    // Input
    if (keys['ArrowRight'] && !keys._rWas) { selP1 = (selP1 + 1) % ROSTER.length; snd('select'); }
    if (keys['ArrowLeft'] && !keys._lWas) { selP1 = (selP1 - 1 + ROSTER.length) % ROSTER.length; snd('select'); }
    if (keys['ArrowDown'] && !keys._dWas) { selP1 = (selP1 + 3) % ROSTER.length; snd('select'); }
    if (keys['ArrowUp'] && !keys._uWas) { selP1 = (selP1 - 3 + ROSTER.length) % ROSTER.length; snd('select'); }
    keys._rWas = keys['ArrowRight']; keys._lWas = keys['ArrowLeft']; keys._dWas = keys['ArrowDown']; keys._uWas = keys['ArrowUp'];
    if (keys['Enter'] || keys[' ']) {
        keys['Enter'] = false; keys[' '] = false;
        state = 'stageselect'; selStage = 0; snd('fight');
    }
}

// Stage select
function drawStageSelect() {
    X.fillStyle = '#0a0a1a'; X.fillRect(0, 0, W, H);
    X.textAlign = 'center'; X.font = '20px "Press Start 2P"'; X.fillStyle = '#3498db';
    X.fillText('SELECT ARENA', W / 2, 50);
    STAGES.forEach((s, i) => {
        const y = 90 + i * 90, sel = i === selStage;
        X.fillStyle = sel ? '#1a1a3e' : '#111'; X.fillRect(200, y, W - 400, 70);
        X.strokeStyle = sel ? s.accent : '#333'; X.lineWidth = sel ? 3 : 1; X.strokeRect(200, y, W - 400, 70);
        // Gradient preview
        const g = X.createLinearGradient(210, y + 5, 210, y + 55); g.addColorStop(0, s.sky[0]); g.addColorStop(1, s.sky[1]);
        X.fillStyle = g; X.fillRect(210, y + 5, 100, 55);
        X.fillStyle = s.floor; X.fillRect(210, y + 45, 100, 15);
        X.fillStyle = s.accent; X.fillRect(210, y + 45, 100, 3);
        X.font = '12px "Press Start 2P"'; X.fillStyle = sel ? '#fff' : '#666';
        X.fillText(s.name, W / 2 + 30, y + 42);
    });
    X.font = '10px "Press Start 2P"'; X.fillStyle = '#aaa';
    X.fillText('↑ ↓ SELECT   ENTER TO FIGHT', W / 2, H - 20);
    if (keys['ArrowDown'] && !keys._sdWas) { selStage = (selStage + 1) % STAGES.length; snd('select'); }
    if (keys['ArrowUp'] && !keys._suWas) { selStage = (selStage - 1 + STAGES.length) % STAGES.length; snd('select'); }
    keys._sdWas = keys['ArrowDown']; keys._suWas = keys['ArrowUp'];
    if (keys['Enter'] || keys[' ']) { keys['Enter'] = false; keys[' '] = false; startMatch(); }
}

function startMatch() {
    selP2 = Math.floor(Math.random() * ROSTER.length);
    while (selP2 === selP1) selP2 = Math.floor(Math.random() * ROSTER.length);
    p1 = makeFighter(ROSTER[selP1], 150, true);
    p2 = makeFighter(ROSTER[selP2], W - 210, false);
    p1Wins = 0; p2Wins = 0; round = 1; roundTimer = 99;
    projectiles = []; particles = [];
    state = 'roundstart'; announceText = 'ROUND 1'; announceTimer = 120; freezeTimer = 120; snd('fight');
}

function startRound() {
    p1.hp = 100; p2.hp = 100; p1.x = 150; p2.x = W - 210; p1.y = H - 180; p2.y = H - 180;
    p1.vx = 0; p2.vx = 0; p1.vy = 0; p2.vy = 0; p1.state = 'idle'; p2.state = 'idle';
    p1.hitStun = 0; p2.hitStun = 0; p1.specialCharge = 0; p2.specialCharge = 0;
    p1.onGround = true; p2.onGround = true; p1.canAct = true; p2.canAct = true;
    projectiles = []; particles = []; roundTimer = 99;
}

// Main loop
function loop() {
    gameTime++; X.clearRect(0, 0, W, H);
    if (state === 'title') { drawTitle(); }
    else if (state === 'charselect') { drawCharSelect(); }
    else if (state === 'stageselect') { drawStageSelect(); }
    else if (state === 'roundstart' || state === 'fight' || state === 'ko' || state === 'matchover') {
        // Draw stage
        X.save();
        if (shakeAmt > 0) { X.translate((Math.random() - .5) * shakeAmt, (Math.random() - .5) * shakeAmt); shakeAmt *= 0.9; if (shakeAmt < .5) shakeAmt = 0; }
        drawStage(STAGES[selStage]);
        // Projectiles
        projectiles.forEach(p => {
            p.x += p.vx; p.life--;
            X.fillStyle = p.color; X.globalAlpha = 0.8; X.beginPath(); X.arc(p.x, p.y, 8 + Math.sin(gameTime * .3) * 3, 0, Math.PI * 2); X.fill();
            X.globalAlpha = 0.4; X.beginPath(); X.arc(p.x, p.y, 14, 0, Math.PI * 2); X.fill(); X.globalAlpha = 1;
            // Hit check
            const t = p.owner === p1 ? p2 : p1;
            if (p.x > t.x && p.x < t.x + t.w && p.y > t.y && p.y < t.y + t.h) {
                if (t.blocking) { snd('block'); t.blockStun = 15; t.vx = p.vx > 0 ? 5 : -5; addParticles(t.x, t.y + 40, '#3498db', 5); }
                else {
                    t.hp -= p.dmg; t.hitStun = 20; t.vx = p.vx > 0 ? 8 : -8; t.vy = -4; t.onGround = false; t.state = 'stun';
                    shakeAmt = 12; addParticles(t.x + t.w / 2, t.y + 40, p.color, 12); snd('hit');
                }
                p.life = 0;
            }
        });
        projectiles = projectiles.filter(p => p.life > 0 && p.x > -50 && p.x < W + 50);
        // Fighters
        if (state === 'fight') {
            updateFighter(p1, p2, false); updateFighter(p2, p1, true);
            if (freezeTimer <= 0) roundTimer -= 1 / 60;
            // KO check
            if (p1.hp <= 0 || p2.hp <= 0 || roundTimer <= 0) {
                if (p1.hp <= 0) { p2Wins++; announceText = 'K.O.!'; }
                else if (p2.hp <= 0) { p1Wins++; announceText = 'K.O.!'; }
                else { if (p1.hp > p2.hp) p1Wins++; else if (p2.hp > p1.hp) p2Wins++; else { p1Wins++; p2Wins++; } announceText = 'TIME!'; }
                state = 'ko'; announceTimer = 120; freezeTimer = 120; snd('ko');
            }
        }
        drawChar(p1); drawChar(p2);
        // Particles
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life--; p.size *= 0.95;
            X.fillStyle = p.color; X.globalAlpha = p.life / 30; X.fillRect(p.x, p.y, p.size, p.size);
        });
        X.globalAlpha = 1; particles = particles.filter(p => p.life > 0);
        X.restore();
        drawHUD();
        // Announcements
        if (announceTimer > 0) {
            announceTimer--;
            if (freezeTimer > 0) freezeTimer--;
            const scale = Math.min(1, announceTimer > 100 ? ((120 - announceTimer) / 20) : 1);
            X.save(); X.textAlign = 'center'; X.font = `${Math.floor(50 * scale)}px "Press Start 2P"`;
            X.fillStyle = '#f1c40f'; X.globalAlpha = Math.min(1, announceTimer / 20);
            X.shadowColor = '#000'; X.shadowBlur = 10;
            X.fillText(announceText, W / 2, H / 2 - 20);
            X.shadowBlur = 0; X.globalAlpha = 1; X.restore();
            if (announceTimer <= 0) {
                if (state === 'roundstart') { state = 'fight'; freezeTimer = 0; }
                else if (state === 'ko') {
                    if (p1Wins >= 2 || p2Wins >= 2) {
                        state = 'matchover';
                        const winner = p1Wins >= 2 ? p1.data.name : p2.data.name;
                        announceText = winner + ' WINS!'; announceTimer = 180; freezeTimer = 180; snd('win');
                    } else { round++; startRound(); state = 'roundstart'; announceText = 'ROUND ' + round; announceTimer = 120; freezeTimer = 120; snd('fight'); }
                } else if (state === 'matchover' && announceTimer <= 0) { state = 'title'; }
            }
        }
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
