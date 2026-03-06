// TECH KOMBAT - 32bit MK Style Fighting Game
const C = document.getElementById('gc');
const X = C.getContext('2d');
const W = 960;
const H = 540;
const GROUND_Y = H - 180;
const ARENA_MARGIN = 20;
const FRAME_MS = 1000 / 60;
const mobileControls = document.getElementById('mobile-controls');

C.width = W;
C.height = H;
if ('ontouchstart' in window && mobileControls) mobileControls.style.display = 'flex';

const CONTROL_KEYS = new Set([
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Enter', ' ', 'Escape',
    'z', 'Z', 'x', 'X', 'c', 'C',
    'p', 'P', 'f', 'F'
]);

// Audio
const AC = new (window.AudioContext || window.webkitAudioContext)();
function snd(t) {
    if (AC.state === 'suspended') AC.resume();
    const o = AC.createOscillator();
    const g = AC.createGain();
    o.connect(g);
    g.connect(AC.destination);
    const n = AC.currentTime;

    if (t === 'hit') {
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(200, n);
        o.frequency.exponentialRampToValueAtTime(80, n + 0.08);
        g.gain.setValueAtTime(0.4, n);
        g.gain.exponentialRampToValueAtTime(0.01, n + 0.08);
        o.start(n);
        o.stop(n + 0.08);
    } else if (t === 'block') {
        o.type = 'triangle';
        o.frequency.setValueAtTime(800, n);
        g.gain.setValueAtTime(0.15, n);
        g.gain.exponentialRampToValueAtTime(0.01, n + 0.05);
        o.start(n);
        o.stop(n + 0.05);
    } else if (t === 'special') {
        o.type = 'square';
        o.frequency.setValueAtTime(300, n);
        o.frequency.linearRampToValueAtTime(600, n + 0.15);
        g.gain.setValueAtTime(0.3, n);
        g.gain.linearRampToValueAtTime(0.01, n + 0.2);
        o.start(n);
        o.stop(n + 0.2);
    } else if (t === 'ko') {
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(300, n);
        o.frequency.exponentialRampToValueAtTime(20, n + 0.6);
        g.gain.setValueAtTime(0.5, n);
        g.gain.linearRampToValueAtTime(0.01, n + 0.6);
        o.start(n);
        o.stop(n + 0.6);
    } else if (t === 'fight') {
        o.type = 'square';
        o.frequency.setValueAtTime(400, n);
        o.frequency.setValueAtTime(500, n + 0.1);
        o.frequency.setValueAtTime(600, n + 0.2);
        g.gain.setValueAtTime(0.3, n);
        g.gain.linearRampToValueAtTime(0.01, n + 0.3);
        o.start(n);
        o.stop(n + 0.3);
    } else if (t === 'select') {
        o.type = 'sine';
        o.frequency.setValueAtTime(440, n);
        o.frequency.setValueAtTime(660, n + 0.05);
        g.gain.setValueAtTime(0.15, n);
        g.gain.exponentialRampToValueAtTime(0.01, n + 0.1);
        o.start(n);
        o.stop(n + 0.1);
    } else if (t === 'win') {
        o.type = 'square';
        [400, 500, 600, 800].forEach((f, i) => o.frequency.setValueAtTime(f, n + i * 0.15));
        g.gain.setValueAtTime(0.25, n);
        g.gain.linearRampToValueAtTime(0.01, n + 0.7);
        o.start(n);
        o.stop(n + 0.7);
    }
}

// Input
const keys = {};
const keyEdges = {};

function normalizeKey(input) {
    if (typeof input === 'string') return input === 'Space' ? ' ' : input;
    return input.code === 'Space' ? ' ' : input.key;
}

function setKeyState(rawKey, down) {
    const key = normalizeKey(rawKey);
    keys[key] = down;
    if (key === ' ') keys.Space = down;
}

function clearKeyState(key) {
    const normalized = normalizeKey(key);
    keys[normalized] = false;
    keyEdges[normalized] = false;
    if (normalized === ' ') {
        keys.Space = false;
        keyEdges.Space = false;
    }
}

function pressedOnce(key) {
    const normalized = normalizeKey(key);
    const down = !!keys[normalized];
    const wasDown = !!keyEdges[normalized];
    keyEdges[normalized] = down;
    return down && !wasDown;
}

function confirmPressed() {
    return pressedOnce('Enter') || pressedOnce(' ');
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

async function toggleFullscreen() {
    try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
    } catch (_) {
        // Ignore fullscreen errors from browsers that reject the request.
    }
}

window.addEventListener('keydown', (e) => {
    const key = normalizeKey(e);
    if (CONTROL_KEYS.has(key)) e.preventDefault();
    setKeyState(key, true);
    if ((key === 'f' || key === 'F') && !e.repeat) toggleFullscreen();
});

window.addEventListener('keyup', (e) => {
    setKeyState(e, false);
});

window.addEventListener('blur', () => {
    Object.keys(keys).forEach((key) => {
        keys[key] = false;
    });
    Object.keys(keyEdges).forEach((key) => {
        keyEdges[key] = false;
    });
});

if (mobileControls) {
    document.querySelectorAll('[data-key]').forEach((btn) => {
        const press = (e) => {
            e.preventDefault();
            setKeyState(btn.dataset.key, true);
        };
        const release = (e) => {
            e.preventDefault();
            setKeyState(btn.dataset.key, false);
        };
        btn.addEventListener('touchstart', press, { passive: false });
        btn.addEventListener('touchend', release, { passive: false });
        btn.addEventListener('touchcancel', release, { passive: false });
    });
}

// Roster
const ROSTER = [
    {
        id: 'elon', name: 'ELON',
        colors: { skin: '#ffdbac', hair: '#3e2723', shirt: '#fff', suit: '#111', cape: '#1a1a2e', tie: '#c0392b', eyes: '#2c3e50' },
        specName: 'X-BEAM', weight: 1.1, speed: 4.5, power: 1.1, defense: 0.9
    },
    {
        id: 'zuck', name: 'ZUCK',
        colors: { skin: '#f5deb3', hair: '#8b4513', shirt: '#95a5a6', suit: '#546e7a', tie: '#2c3e50', eyes: '#3498db' },
        specName: 'META BLAST', weight: 0.9, speed: 5.5, power: 0.9, defense: 0.85
    },
    {
        id: 'gates', name: 'GATES',
        colors: { skin: '#ffdbac', hair: '#95a5a6', shirt: '#8e44ad', suit: '#6c3483', tie: '#f1c40f', eyes: '#2c3e50', glasses: true },
        specName: 'BLUE SCREEN', weight: 1.0, speed: 4, power: 1.0, defense: 1.1
    },
    {
        id: 'bezos', name: 'BEZOS',
        colors: { skin: '#ffdbac', hair: '#ffdbac', shirt: '#212121', suit: '#1a1a1a', tie: '#f39c12', eyes: '#2c3e50', bald: true },
        specName: 'PRIME STRIKE', weight: 1.05, speed: 4.2, power: 1.15, defense: 1.0
    },
    {
        id: 'doge', name: 'DOGE',
        colors: { skin: '#f1c40f', hair: '#fff', shirt: '#e67e22', suit: '#d35400', eyes: '#000' },
        specName: 'MOON HOWL', weight: 0.75, speed: 6, power: 0.8, defense: 0.7
    },
    {
        id: 'altman', name: 'ALTMAN',
        colors: { skin: '#ffdbac', hair: '#4a3728', shirt: '#ecf0f1', suit: '#34495e', tie: '#27ae60', eyes: '#2c3e50' },
        specName: 'GPT SURGE', weight: 1.0, speed: 4.8, power: 1.05, defense: 0.95
    }
];

const STAGES = [
    { id: 'gigafactory', name: 'GIGAFACTORY ARENA', sky: ['#0b1e3b', '#1c4e80'], floor: '#2c3e50', accent: '#f1c40f' },
    { id: 'mars', name: 'MARS COLONY', sky: ['#1a0505', '#5e2015'], floor: '#8b4513', accent: '#e74c3c' },
    { id: 'metaverse', name: 'METAVERSE', sky: ['#0a001a', '#1a0b2e'], floor: '#2d1b69', accent: '#00ffff' },
    { id: 'boardroom', name: 'SILICON BOARDROOM', sky: ['#1a1a2e', '#16213e'], floor: '#0f3460', accent: '#e94560' }
];

const MARS_STARS = Array.from({ length: 60 }, (_, i) => ({
    x: (i * 137) % W,
    y: (i * 67) % 300,
    phase: i * 0.91
}));

const META_GLYPHS = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 40) % W,
    offset: i * 80,
    code: 0x30A0 + (i * 17) % 96
}));

// Game state
let state = 'title';
let selP1 = 0;
let selP2 = 1;
let selStage = 0;
let p1Wins = 0;
let p2Wins = 0;
let round = 1;
let roundTimer = 99;
let announceText = '';
let announceTimer = 0;
let shakeAmt = 0;
let particles = [];
let projectiles = [];
let titleFlash = 0;
let paused = false;
let matchWinner = '';
let p1 = null;
let p2 = null;
let gameTime = 0;
let freezeTimer = 0;
let rafId = 0;
let manualMode = false;

// Fighter class
function makeFighter(data, x, faceR) {
    return {
        data, x, y: GROUND_Y, w: 60, h: 100, vx: 0, vy: 0, hp: 100, faceR,
        state: 'idle', timer: 0, atkCooldown: 0, hitStun: 0, blockStun: 0,
        specialCharge: 0, canAct: true, onGround: true, jumps: 0,
        crouching: false, blocking: false, animFrame: 0
    };
}

function drawChar(f, ghost) {
    if (!f || !f.data) return;
    const c = f.data.colors;
    const sx = Math.floor(f.x);
    const sy = Math.floor(f.y);

    X.save();
    X.translate(sx + f.w / 2, sy);
    if (!f.faceR) X.scale(-1, 1);
    X.translate(-f.w / 2, 0);
    if (ghost) X.globalAlpha = 0.3;
    if (f.hitStun > 0 && Math.floor(gameTime / 3) % 2) X.globalAlpha = 0.5;

    const bob = f.state === 'idle' ? Math.sin(gameTime * 0.08) * 2 : 0;
    const isDoge = f.data.id === 'doge';

    if (isDoge) {
        X.fillStyle = '#e67e22';
        X.fillRect(5, 50 + bob, 50, 30);
        X.fillStyle = '#f1c40f';
        X.fillRect(35, 30 + bob, 28, 28);
        X.fillStyle = '#d35400';
        X.beginPath();
        X.moveTo(38, 30 + bob);
        X.lineTo(34, 15 + bob);
        X.lineTo(44, 30 + bob);
        X.fill();
        X.beginPath();
        X.moveTo(52, 30 + bob);
        X.lineTo(56, 15 + bob);
        X.lineTo(60, 30 + bob);
        X.fill();
        X.fillStyle = '#000';
        X.fillRect(42, 40 + bob, 4, 4);
        X.fillRect(54, 40 + bob, 4, 4);
        X.fillRect(48, 48 + bob, 5, 3);
        X.fillStyle = '#f1c40f';
        X.beginPath();
        X.moveTo(5, 55 + bob);
        X.lineTo(-8, 45 + bob);
        X.lineTo(0, 60 + bob);
        X.fill();
        const legAnim = f.state === 'walk' ? Math.sin(gameTime * 0.3) * 6 : 0;
        X.fillStyle = '#d35400';
        X.fillRect(12, 78 + bob, 10, 22 + legAnim);
        X.fillRect(38, 78 + bob, 10, 22 - legAnim);
        if (f.state === 'attack' || f.state === 'special') {
            X.fillStyle = f.state === 'special' ? '#00ffff' : '#d35400';
            X.fillRect(55, 45 + bob, 30, 8);
        }
    } else {
        const legR = f.state === 'walk' ? Math.sin(gameTime * 0.3) * 8 : 0;
        X.fillStyle = c.suit;
        X.fillRect(15, 75 + bob, 12, 25 + legR);
        X.fillRect(33, 75 + bob, 12, 25 - legR);
        X.fillStyle = '#111';
        X.fillRect(13, 98 + bob + Math.max(0, legR), 16, 5);
        X.fillRect(31, 98 + bob + Math.max(0, -legR), 16, 5);
        X.fillStyle = c.suit;
        X.fillRect(10, 35 + bob, 40, 42);
        X.fillStyle = c.shirt;
        X.fillRect(14, 38 + bob, 32, 35);
        if (c.tie) {
            X.fillStyle = c.tie;
            X.fillRect(28, 38 + bob, 4, 30);
        }
        if (f.data.id === 'elon') {
            X.fillStyle = '#1a1a2e';
            X.globalAlpha = 0.7;
            X.beginPath();
            X.moveTo(10, 40 + bob);
            X.lineTo(-5, 95 + bob);
            X.lineTo(15, 90 + bob);
            X.fill();
            X.globalAlpha = ghost ? 0.3 : 1;
            X.fillStyle = '#fff';
            X.font = 'bold 16px sans-serif';
            X.fillText('X', 22, 58 + bob);
        }
        X.fillStyle = c.skin;
        X.fillRect(16, 8 + bob, 28, 28);
        if (!c.bald) {
            X.fillStyle = c.hair;
            X.fillRect(14, 5 + bob, 32, 10);
            X.fillRect(14, 5 + bob, 5, 20);
        }
        X.fillStyle = c.eyes || '#000';
        X.fillRect(22, 18 + bob, 4, 4);
        X.fillRect(34, 18 + bob, 4, 4);
        if (c.glasses) {
            X.strokeStyle = '#333';
            X.lineWidth = 2;
            X.strokeRect(19, 16 + bob, 12, 8);
            X.strokeRect(33, 16 + bob, 12, 8);
            X.beginPath();
            X.moveTo(31, 20 + bob);
            X.lineTo(33, 20 + bob);
            X.stroke();
        }
        if (f.data.id === 'zuck') {
            X.fillStyle = '#3498db';
            X.fillRect(22, 18 + bob, 4, 4);
            X.fillRect(34, 18 + bob, 4, 4);
        }
        X.fillStyle = '#b5651d';
        X.fillRect(26, 30 + bob, 8, 3);

        if (f.state === 'attack') {
            X.fillStyle = c.skin;
            X.fillRect(48, 40 + bob, 25, 8);
            X.fillStyle = '#e74c3c';
            X.fillRect(70, 37 + bob, 12, 14);
        } else if (f.state === 'special') {
            X.fillStyle = c.skin;
            X.fillRect(48, 42 + bob, 15, 8);
            const sc =
                f.data.id === 'elon' ? '#3498db' :
                f.data.id === 'zuck' ? '#1877f2' :
                f.data.id === 'gates' ? '#00a4ef' :
                f.data.id === 'bezos' ? '#ff9900' :
                f.data.id === 'altman' ? '#10a37f' : '#f1c40f';
            X.fillStyle = sc;
            X.globalAlpha = 0.5 + Math.sin(gameTime * 0.5) * 0.3;
            X.beginPath();
            X.arc(68, 48 + bob, 10 + Math.sin(gameTime * 0.3) * 3, 0, Math.PI * 2);
            X.fill();
            X.globalAlpha = ghost ? 0.3 : 1;
        } else if (f.blocking) {
            X.fillStyle = c.skin;
            X.fillRect(5, 38 + bob, 12, 8);
            X.fillRect(48, 38 + bob, 12, 8);
            X.fillStyle = 'rgba(52,152,219,0.4)';
            X.beginPath();
            X.arc(30, 55 + bob, 35, 0, Math.PI * 2);
            X.fill();
        } else if (f.crouching) {
            X.fillStyle = c.skin;
            X.fillRect(5, 55 + bob, 10, 8);
            X.fillRect(45, 55 + bob, 10, 8);
        } else {
            X.fillStyle = c.skin;
            X.fillRect(2, 42 + bob, 10, 25);
            X.fillRect(48, 42 + bob, 10, 25);
            X.fillStyle = c.suit;
            X.fillRect(2, 64 + bob, 10, 8);
            X.fillRect(48, 64 + bob, 10, 8);
        }
    }

    if (f.crouching && !isDoge) {
        X.restore();
        return;
    }
    X.restore();
}

function projectileColorFor(f) {
    return (
        f.data.id === 'elon' ? '#3498db' :
        f.data.id === 'zuck' ? '#1877f2' :
        f.data.id === 'gates' ? '#00a4ef' :
        f.data.id === 'bezos' ? '#ff9900' :
        f.data.id === 'altman' ? '#10a37f' : '#f1c40f'
    );
}

function fireProjectile(f) {
    projectiles.push({
        x: f.x + (f.faceR ? f.w + 10 : -10),
        y: f.y + 40,
        vx: f.faceR ? 8 : -8,
        w: 20,
        h: 12,
        color: projectileColorFor(f),
        owner: f,
        life: 60,
        dmg: 12
    });
    snd('special');
}

function addParticles(x, y, col, n = 8) {
    for (let i = 0; i < n; i++) {
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 20 + Math.random() * 10,
            color: col,
            size: Math.random() * 5 + 2
        });
    }
}

function inHitRange(attacker, defender, reach) {
    const hitX = attacker.faceR ? attacker.x + attacker.w : attacker.x - reach;
    return (
        hitX < defender.x + defender.w &&
        hitX + reach > defender.x &&
        attacker.y < defender.y + defender.h &&
        attacker.y + attacker.h > defender.y
    );
}

function separateFighters() {
    if (!p1 || !p2) return;
    const left = p1.x <= p2.x ? p1 : p2;
    const right = left === p1 ? p2 : p1;
    const overlap = left.x + left.w - right.x;
    if (overlap <= 0) return;

    const push = overlap / 2 + 0.1;
    left.x = clamp(left.x - push, ARENA_MARGIN, W - left.w - ARENA_MARGIN);
    right.x = clamp(right.x + push, ARENA_MARGIN, W - right.w - ARENA_MARGIN);
}

function resetFighterForRound(f, x, faceR) {
    f.x = x;
    f.y = GROUND_Y;
    f.vx = 0;
    f.vy = 0;
    f.faceR = faceR;
    f.hp = 100;
    f.state = 'idle';
    f.timer = 0;
    f.atkCooldown = 0;
    f.hitStun = 0;
    f.blockStun = 0;
    f.specialCharge = 0;
    f.canAct = true;
    f.onGround = true;
    f.jumps = 0;
    f.crouching = false;
    f.blocking = false;
}

function returnToTitle() {
    state = 'title';
    round = 1;
    roundTimer = 99;
    announceText = '';
    announceTimer = 0;
    freezeTimer = 0;
    p1Wins = 0;
    p2Wins = 0;
    paused = false;
    matchWinner = '';
    projectiles = [];
    particles = [];
    p1 = null;
    p2 = null;
    clearKeyState('Enter');
    clearKeyState(' ');
}

function drawStage(st) {
    const grd = X.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, st.sky[0]);
    grd.addColorStop(1, st.sky[1]);
    X.fillStyle = grd;
    X.fillRect(0, 0, W, H);

    const floorY = H - 80;
    if (st.id === 'gigafactory') {
        for (let i = 0; i < W; i += 160) {
            X.fillStyle = '#1a1a2e';
            X.fillRect(i, 60, 30, floorY - 60);
            X.fillStyle = 'rgba(241,196,15,0.6)';
            X.fillRect(i + 8, 100, 14, 8);
            X.fillRect(i + 8, 140, 14, 8);
        }
        for (let i = 0; i < 3; i++) {
            const ax = 120 + i * 300;
            const swing = Math.sin(gameTime * 0.02 + i) * 15;
            X.strokeStyle = '#555';
            X.lineWidth = 8;
            X.beginPath();
            X.moveTo(ax, 0);
            X.lineTo(ax + swing, 180);
            X.stroke();
            X.fillStyle = '#e74c3c';
            X.fillRect(ax + swing - 10, 175, 20, 15);
        }
        X.strokeStyle = st.accent;
        X.lineWidth = 1;
        X.globalAlpha = 0.3;
        for (let i = 0; i < 10; i++) {
            X.beginPath();
            X.moveTo(i * 100, floorY);
            X.lineTo(i * 100 + 50, floorY + 40);
            X.stroke();
        }
        X.globalAlpha = 1;
    } else if (st.id === 'mars') {
        X.fillStyle = '#fff';
        MARS_STARS.forEach((star) => {
            X.globalAlpha = 0.25 + (Math.sin(gameTime * 0.05 + star.phase) + 1) * 0.35;
            X.fillRect(star.x, star.y, 2, 2);
        });
        X.globalAlpha = 1;
        X.fillStyle = '#3498db';
        X.beginPath();
        X.arc(W - 80, 80, 25, 0, Math.PI * 2);
        X.fill();
        X.fillStyle = '#2ecc71';
        X.beginPath();
        X.arc(W - 88, 72, 8, 0, Math.PI * 2);
        X.fill();
        X.fillStyle = '#4e342e';
        X.beginPath();
        X.moveTo(0, floorY);
        for (let i = 0; i <= W; i += 40) X.lineTo(i, floorY - 60 - Math.sin(i * 0.015) * 40);
        X.lineTo(W, floorY);
        X.fill();
        X.fillStyle = 'rgba(180,100,50,0.15)';
        X.fillRect(0, floorY - 30, W, 30);
    } else if (st.id === 'metaverse') {
        X.strokeStyle = 'rgba(0,255,255,0.3)';
        X.lineWidth = 1;
        for (let i = 0; i < W; i += 80) {
            X.beginPath();
            X.moveTo(i, 0);
            X.lineTo(i, H);
            X.stroke();
        }
        for (let i = 0; i < H; i += 80) {
            X.beginPath();
            X.moveTo(0, i);
            X.lineTo(W, i);
            X.stroke();
        }
        X.font = '12px monospace';
        X.fillStyle = 'rgba(0,255,0,0.25)';
        META_GLYPHS.forEach((glyph) => {
            X.fillText(String.fromCharCode(glyph.code), glyph.x, (gameTime * 2 + glyph.offset) % H);
        });
        X.strokeStyle = '#ff00ff';
        X.lineWidth = 2;
        X.strokeRect(W * 0.2 + Math.sin(gameTime * 0.02) * 20, H * 0.3, 50, 50);
        X.beginPath();
        X.arc(W * 0.75, H * 0.35 + Math.cos(gameTime * 0.015) * 30, 30, 0, Math.PI * 2);
        X.stroke();
    } else {
        for (let i = 80; i < W; i += 120) {
            X.fillStyle = '#1a1a2e';
            X.fillRect(i, 100, 60, floorY - 100);
            X.fillStyle = 'rgba(233,69,96,0.3)';
            X.fillRect(i + 10, 120, 40, 30);
        }
        X.fillStyle = 'rgba(15,52,96,0.5)';
        X.fillRect(200, 150, W - 400, 200);
        X.strokeStyle = '#e94560';
        X.lineWidth = 2;
        X.strokeRect(200, 150, W - 400, 200);
    }

    X.fillStyle = st.floor;
    X.fillRect(0, floorY, W, H - floorY);
    X.fillStyle = st.accent;
    X.fillRect(0, floorY, W, 4);
    X.globalAlpha = 0.1;
    X.fillStyle = '#fff';
    X.font = 'bold 60px "Press Start 2P"';
    X.textAlign = 'center';
    X.fillText('TECH KOMBAT', W / 2, floorY + 50);
    X.textAlign = 'left';
    X.globalAlpha = 1;
}

function drawHUD() {
    const bw = 300;
    const bh = 20;
    const margin = 40;
    const by = 30;

    X.fillStyle = '#333';
    X.fillRect(margin, by, bw, bh);
    X.fillRect(W - margin - bw, by, bw, bh);

    const p1Pct = Math.max(0, p1.hp) / 100;
    const p2Pct = Math.max(0, p2.hp) / 100;
    const hpCol1 = p1.hp > 50 ? '#f1c40f' : p1.hp > 25 ? '#e67e22' : '#e74c3c';
    const hpCol2 = p2.hp > 50 ? '#f1c40f' : p2.hp > 25 ? '#e67e22' : '#e74c3c';

    X.fillStyle = hpCol1;
    X.fillRect(margin, by, bw * p1Pct, bh);
    X.fillStyle = hpCol2;
    X.fillRect(W - margin - bw * p2Pct, by, bw * p2Pct, bh);

    X.strokeStyle = '#fff';
    X.lineWidth = 2;
    X.strokeRect(margin, by, bw, bh);
    X.strokeRect(W - margin - bw, by, bw, bh);

    X.font = '12px "Press Start 2P"';
    X.fillStyle = '#fff';
    X.textAlign = 'left';
    X.fillText(p1.data.name, margin, by - 8);
    X.textAlign = 'right';
    X.fillText(p2.data.name, W - margin, by - 8);

    X.textAlign = 'center';
    for (let i = 0; i < 2; i++) {
        X.fillStyle = i < p1Wins ? '#f1c40f' : '#333';
        X.beginPath();
        X.arc(margin + bw + 20 + i * 20, by + 10, 6, 0, Math.PI * 2);
        X.fill();
    }
    for (let i = 0; i < 2; i++) {
        X.fillStyle = i < p2Wins ? '#f1c40f' : '#333';
        X.beginPath();
        X.arc(W - margin - bw - 20 - i * 20, by + 10, 6, 0, Math.PI * 2);
        X.fill();
    }

    X.font = '24px "Press Start 2P"';
    X.fillStyle = '#fff';
    X.fillText(Math.max(0, Math.ceil(roundTimer)).toString(), W / 2, by + 18);

    const smW = 100;
    X.fillStyle = '#222';
    X.fillRect(margin, by + bh + 6, smW, 8);
    X.fillRect(W - margin - smW, by + bh + 6, smW, 8);
    X.fillStyle = '#3498db';
    X.fillRect(margin, by + bh + 6, smW * (p1.specialCharge / 100), 8);
    X.fillStyle = '#e74c3c';
    X.fillRect(W - margin - smW * (p2.specialCharge / 100), by + bh + 6, smW * (p2.specialCharge / 100), 8);
    X.font = '6px "Press Start 2P"';
    X.textAlign = 'left';
    X.fillStyle = '#aaa';
    X.fillText('SPECIAL', margin, by + bh + 20);
    X.textAlign = 'right';
    X.fillText('SPECIAL', W - margin, by + bh + 20);

    X.textAlign = 'center';
    X.font = '7px "Press Start 2P"';
    X.fillStyle = '#7f8c8d';
    X.fillText('P PAUSE  F FULLSCREEN  ESC TITLE', W / 2, H - 16);
    X.textAlign = 'left';
}

function updateProjectiles() {
    projectiles.forEach((proj) => {
        proj.x += proj.vx;
        proj.life--;
        const target = proj.owner === p1 ? p2 : p1;
        if (proj.x > target.x && proj.x < target.x + target.w && proj.y > target.y && proj.y < target.y + target.h) {
            if (target.blocking) {
                snd('block');
                target.blockStun = 15;
                target.vx = proj.vx > 0 ? 5 : -5;
                addParticles(target.x, target.y + 40, '#3498db', 5);
            } else {
                target.hp -= proj.dmg;
                target.hitStun = 20;
                target.vx = proj.vx > 0 ? 8 : -8;
                target.vy = -4;
                target.onGround = false;
                target.state = 'stun';
                target.specialCharge = Math.min(100, target.specialCharge + 10);
                shakeAmt = 12;
                addParticles(target.x + target.w / 2, target.y + 40, proj.color, 12);
                snd('hit');
            }
            proj.life = 0;
        }
    });

    projectiles = projectiles.filter((proj) => proj.life > 0 && proj.x > -50 && proj.x < W + 50);
}

function drawProjectiles() {
    projectiles.forEach((proj) => {
        X.fillStyle = proj.color;
        X.globalAlpha = 0.8;
        X.beginPath();
        X.arc(proj.x, proj.y, 8 + Math.sin(gameTime * 0.3) * 3, 0, Math.PI * 2);
        X.fill();
        X.globalAlpha = 0.4;
        X.beginPath();
        X.arc(proj.x, proj.y, 14, 0, Math.PI * 2);
        X.fill();
        X.globalAlpha = 1;
    });
}

function updateParticles() {
    particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3;
        particle.life--;
        particle.size *= 0.95;
    });
    particles = particles.filter((particle) => particle.life > 0);
}

function drawParticles() {
    particles.forEach((particle) => {
        X.fillStyle = particle.color;
        X.globalAlpha = particle.life / 30;
        X.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
    X.globalAlpha = 1;
}

function updateFighter(f, enemy, isAI) {
    if (freezeTimer > 0) return;
    f.animFrame++;

    if (!f.onGround) {
        f.vy += 0.6;
        f.y += f.vy;
        if (f.y >= GROUND_Y) {
            f.y = GROUND_Y;
            f.vy = 0;
            f.onGround = true;
            f.jumps = 0;
        }
    }

    if (f.hitStun > 0) {
        f.hitStun--;
        f.x += f.vx;
        f.vx *= 0.9;
        if (f.hitStun <= 0) {
            f.state = 'idle';
            f.canAct = true;
        }
        return;
    }

    if (f.blockStun > 0) {
        f.blockStun--;
        return;
    }

    if (f.atkCooldown > 0) f.atkCooldown--;

    let moveL = false;
    let moveR = false;
    let jump = false;
    let crouch = false;
    let atk = false;
    let kick = false;
    let spec = false;
    let block = false;

    if (isAI) {
        const dx = enemy.x - f.x;
        const dy = enemy.y - f.y;
        const dist = Math.abs(dx);
        const wantsSpecialSpace = f.specialCharge >= 100 && dist < 170;
        const idealRange = wantsSpecialSpace ? 170 : 54;

        if (dist > idealRange + 12) {
            if (dx > 0) moveR = true;
            else moveL = true;
        } else if (dist < idealRange - 18) {
            if (dx > 0) moveL = true;
            else moveR = true;
        }

        if (dist < 95 && Math.random() < 0.08) atk = true;
        if (dist < 125 && Math.random() < 0.05) kick = true;
        if (dist > 145 && f.specialCharge >= 100 && Math.random() < 0.04) spec = true;
        if ((enemy.state === 'attack' || enemy.state === 'special') && dist < 120 && Math.random() < 0.2) block = true;
        if (dy < -40 && Math.random() < 0.02) jump = true;
        if (enemy.hitStun > 0 && dist > 90 && Math.random() < 0.04) jump = true;
    } else {
        moveL = !!keys.ArrowLeft;
        moveR = !!keys.ArrowRight;
        jump = !!keys.ArrowUp;
        crouch = !!keys.ArrowDown;
        atk = !!(keys.z || keys.Z);
        kick = !!(keys.x || keys.X);
        spec = !!(keys.c || keys.C);
        block = crouch && !moveL && !moveR;
    }

    f.faceR = f.x < enemy.x;
    f.crouching = crouch && f.onGround && !atk && !kick;
    f.blocking = block && f.onGround;

    if (f.blocking) {
        f.state = 'block';
        f.vx = 0;
        return;
    }

    if (f.state === 'attack' || f.state === 'special') {
        f.timer--;
        if (f.timer <= 0) {
            f.state = 'idle';
            f.canAct = true;
        }
        return;
    }

    const spd = f.data.speed * (f.crouching ? 0 : 1);
    if (moveL && f.canAct) {
        f.vx = -spd;
        f.state = 'walk';
    } else if (moveR && f.canAct) {
        f.vx = spd;
        f.state = 'walk';
    } else {
        f.vx *= 0.7;
        if (f.onGround && f.canAct) f.state = 'idle';
    }

    f.x += f.vx;
    f.x = clamp(f.x, ARENA_MARGIN, W - f.w - ARENA_MARGIN);

    if (jump && f.jumps < 2 && f.canAct && !f.crouching) {
        f.vy = -11;
        f.onGround = false;
        f.jumps++;
        f.state = 'jump';
        snd('select');
    }

    if (atk && f.atkCooldown <= 0 && f.canAct) {
        f.state = 'attack';
        f.timer = 12;
        f.atkCooldown = 18;
        f.canAct = false;
        if (inHitRange(f, enemy, 65)) {
            if (enemy.blocking) {
                snd('block');
                enemy.blockStun = 10;
                enemy.vx = f.faceR ? 3 : -3;
                addParticles(enemy.x + enemy.w / 2, enemy.y + 40, '#3498db', 4);
            } else {
                const dmg = 8 * f.data.power;
                enemy.hp -= dmg;
                enemy.hitStun = 12;
                enemy.vx = f.faceR ? 6 : -6;
                enemy.state = 'stun';
                enemy.specialCharge = Math.min(100, enemy.specialCharge + 6);
                f.specialCharge = Math.min(100, f.specialCharge + 15);
                shakeAmt = 6;
                addParticles(enemy.x + enemy.w / 2, enemy.y + 40, '#fff');
                snd('hit');
            }
        }
    }

    if (kick && f.atkCooldown <= 0 && f.canAct) {
        f.state = 'attack';
        f.timer = 15;
        f.atkCooldown = 22;
        f.canAct = false;
        if (inHitRange(f, enemy, 75)) {
            if (enemy.blocking) {
                snd('block');
                enemy.blockStun = 12;
                enemy.vx = f.faceR ? 4 : -4;
                addParticles(enemy.x + enemy.w / 2, enemy.y + 60, '#3498db', 4);
            } else {
                const dmg = 12 * f.data.power;
                enemy.hp -= dmg;
                enemy.hitStun = 18;
                enemy.vy = -5;
                enemy.vx = f.faceR ? 8 : -8;
                enemy.onGround = false;
                enemy.state = 'stun';
                enemy.specialCharge = Math.min(100, enemy.specialCharge + 8);
                f.specialCharge = Math.min(100, f.specialCharge + 20);
                shakeAmt = 10;
                addParticles(enemy.x + enemy.w / 2, enemy.y + 60, '#f1c40f', 10);
                snd('hit');
            }
        }
    }

    if (spec && f.specialCharge >= 100 && f.canAct) {
        f.state = 'special';
        f.timer = 20;
        f.canAct = false;
        f.specialCharge = 0;
        fireProjectile(f);
    }
}

function drawCenterOverlay(lines, accent, footer) {
    X.save();
    X.fillStyle = 'rgba(0, 0, 0, 0.72)';
    X.fillRect(170, 120, W - 340, H - 240);
    X.strokeStyle = accent;
    X.lineWidth = 3;
    X.strokeRect(170, 120, W - 340, H - 240);
    X.textAlign = 'center';
    X.fillStyle = accent;
    X.font = '18px "Press Start 2P"';
    X.fillText(lines[0], W / 2, 190);
    X.font = '10px "Press Start 2P"';
    X.fillStyle = '#f5f6fa';
    lines.slice(1).forEach((line, i) => {
        X.fillText(line, W / 2, 250 + i * 34);
    });
    if (footer) {
        X.fillStyle = '#95a5a6';
        X.font = '8px "Press Start 2P"';
        X.fillText(footer, W / 2, H - 165);
    }
    X.restore();
}

function drawAnnouncement() {
    if (announceTimer <= 0) return;
    const maxTimer = announceText.includes('WINS!') ? 180 : 120;
    const scale = Math.min(1, announceTimer > maxTimer - 20 ? (maxTimer - announceTimer) / 20 : 1);
    X.save();
    X.textAlign = 'center';
    X.font = `${Math.floor(50 * scale)}px "Press Start 2P"`;
    X.fillStyle = '#f1c40f';
    X.globalAlpha = Math.min(1, announceTimer / 20);
    X.shadowColor = '#000';
    X.shadowBlur = 10;
    X.fillText(announceText, W / 2, H / 2 - 20);
    X.restore();
}

function drawPauseOverlay() {
    drawCenterOverlay(
        ['PAUSED', 'ENTER THE LAB WHEN READY', 'P TO RESUME', 'ESC TO TITLE'],
        '#3498db',
        'F STILL TOGGLES FULLSCREEN'
    );
}

function drawMatchOverOverlay() {
    drawCenterOverlay(
        [matchWinner + ' TAKES THE BOARD', 'ENTER OR SPACE FOR REMATCH', 'ESC TO TITLE'],
        '#f1c40f',
        'F TOGGLES FULLSCREEN'
    );
}

function describeFighter(f) {
    if (!f || !f.data) return null;
    return {
        name: f.data.name,
        x: Number(f.x.toFixed(1)),
        y: Number(f.y.toFixed(1)),
        vx: Number(f.vx.toFixed(2)),
        vy: Number(f.vy.toFixed(2)),
        hp: Number(f.hp.toFixed(1)),
        state: f.state,
        blocking: !!f.blocking,
        crouching: !!f.crouching,
        specialCharge: Number(f.specialCharge.toFixed(1)),
        face: f.faceR ? 'right' : 'left'
    };
}

function renderGameToText() {
    const payload = {
        coordinateSystem: 'origin top-left, +x right, +y down',
        mode: state,
        paused,
        stage: STAGES[selStage] ? STAGES[selStage].id : null,
        round,
        roundTimer: Number(Math.max(0, roundTimer).toFixed(2)),
        wins: { p1: p1Wins, p2: p2Wins },
        announceText: announceTimer > 0 ? announceText : null,
        player: describeFighter(p1),
        enemy: describeFighter(p2),
        projectiles: projectiles.map((proj) => ({
            x: Number(proj.x.toFixed(1)),
            y: Number(proj.y.toFixed(1)),
            vx: Number(proj.vx.toFixed(1)),
            life: proj.life,
            owner: proj.owner === p1 ? 'player' : 'enemy'
        }))
    };
    return JSON.stringify(payload);
}

window.render_game_to_text = renderGameToText;

function drawTitle() {
    X.fillStyle = '#000';
    X.fillRect(0, 0, W, H);

    X.strokeStyle = 'rgba(231,76,60,0.1)';
    X.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
        X.beginPath();
        X.arc(W / 2, H / 2, (i * 40 + gameTime) % 800, 0, Math.PI * 2);
        X.stroke();
    }

    const pulse = Math.sin(gameTime * 0.05) * 0.3 + 0.7;
    X.strokeStyle = `rgba(231,76,60,${pulse})`;
    X.lineWidth = 4;
    X.strokeRect(40, 30, W - 80, H - 60);
    X.strokeStyle = `rgba(241,196,15,${pulse * 0.5})`;
    X.lineWidth = 2;
    X.strokeRect(50, 40, W - 100, H - 80);

    X.textAlign = 'center';
    X.font = '48px "Press Start 2P"';
    X.fillStyle = '#e74c3c';
    X.fillText('TECH', W / 2, 150);
    X.fillStyle = '#f1c40f';
    X.font = '56px "Press Start 2P"';
    X.fillText('KOMBAT', W / 2, 215);
    X.font = '16px "Press Start 2P"';
    X.fillStyle = '#3498db';
    X.fillText('SILICON CLASH', W / 2, 260);

    titleFlash += 0.05;
    if (Math.sin(titleFlash) > 0) {
        X.font = '14px "Press Start 2P"';
        X.fillStyle = '#fff';
        X.fillText('PRESS ENTER TO START', W / 2, 368);
    }

    X.font = '10px "Press Start 2P"';
    X.fillStyle = '#888';
    X.fillText('Z=PUNCH  X=KICK  C=SPECIAL  DOWN=BLOCK', W / 2, 424);
    X.fillText('ARROWS=MOVE  UP=JUMP  P=PAUSE  F=FULLSCREEN', W / 2, 452);
    X.fillStyle = '#e74c3c';
    X.globalAlpha = 0.15;
    X.font = '200px serif';
    X.fillText('⚔', W / 2, 380);
    X.globalAlpha = 1;
    X.textAlign = 'left';

    if (confirmPressed()) {
        state = 'charselect';
        selP1 = 0;
        snd('fight');
    }
}

function drawCharSelect() {
    X.fillStyle = '#0a0a1a';
    X.fillRect(0, 0, W, H);
    X.textAlign = 'center';
    X.font = '20px "Press Start 2P"';
    X.fillStyle = '#f1c40f';
    X.fillText('SELECT YOUR FIGHTER', W / 2, 50);

    const cols = 3;
    const cw = 120;
    const ch = 140;
    const gap = 20;
    const ox = (W - (cols * (cw + gap) - gap)) / 2;
    const oy = 80;

    ROSTER.forEach((fighter, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = ox + col * (cw + gap);
        const cy = oy + row * (ch + gap);
        const selected = i === selP1;

        X.fillStyle = selected ? '#222' : '#111';
        X.fillRect(cx, cy, cw, ch);
        X.strokeStyle = selected ? '#f1c40f' : '#444';
        X.lineWidth = selected ? 3 : 1;
        X.strokeRect(cx, cy, cw, ch);

        if (selected) {
            X.shadowColor = '#f1c40f';
            X.shadowBlur = 15;
            X.strokeRect(cx, cy, cw, ch);
            X.shadowBlur = 0;
        }

        const preview = makeFighter(fighter, cx + 30, true);
        preview.y = cy + 10;
        X.save();
        X.beginPath();
        X.rect(cx, cy, cw, ch - 25);
        X.clip();
        drawChar(preview);
        X.restore();

        X.font = '8px "Press Start 2P"';
        X.fillStyle = selected ? '#f1c40f' : '#888';
        X.fillText(fighter.name, cx + cw / 2, cy + ch - 8);
    });

    const selected = ROSTER[selP1];
    X.font = '10px "Press Start 2P"';
    X.fillStyle = '#fff';
    X.textAlign = 'left';
    X.fillText('SPECIAL: ' + selected.specName, 50, H - 60);
    X.fillText(
        `SPD:${selected.speed.toFixed(1)} PWR:${selected.power.toFixed(1)} DEF:${selected.defense.toFixed(1)}`,
        50,
        H - 40
    );
    X.textAlign = 'center';
    X.fillStyle = '#aaa';
    X.fillText('ARROWS SELECT   ENTER TO CONTINUE   ESC TO TITLE', W / 2, H - 15);
    X.textAlign = 'left';

    if (pressedOnce('ArrowRight')) {
        selP1 = (selP1 + 1) % ROSTER.length;
        snd('select');
    }
    if (pressedOnce('ArrowLeft')) {
        selP1 = (selP1 - 1 + ROSTER.length) % ROSTER.length;
        snd('select');
    }
    if (pressedOnce('ArrowDown')) {
        selP1 = (selP1 + 3) % ROSTER.length;
        snd('select');
    }
    if (pressedOnce('ArrowUp')) {
        selP1 = (selP1 - 3 + ROSTER.length) % ROSTER.length;
        snd('select');
    }
    if (confirmPressed()) {
        state = 'stageselect';
        selStage = 0;
        snd('fight');
    }
}

function drawStageSelect() {
    X.fillStyle = '#0a0a1a';
    X.fillRect(0, 0, W, H);
    X.textAlign = 'center';
    X.font = '20px "Press Start 2P"';
    X.fillStyle = '#3498db';
    X.fillText('SELECT ARENA', W / 2, 50);

    STAGES.forEach((stageOption, i) => {
        const y = 90 + i * 90;
        const selected = i === selStage;
        X.fillStyle = selected ? '#1a1a3e' : '#111';
        X.fillRect(200, y, W - 400, 70);
        X.strokeStyle = selected ? stageOption.accent : '#333';
        X.lineWidth = selected ? 3 : 1;
        X.strokeRect(200, y, W - 400, 70);

        const g = X.createLinearGradient(210, y + 5, 210, y + 55);
        g.addColorStop(0, stageOption.sky[0]);
        g.addColorStop(1, stageOption.sky[1]);
        X.fillStyle = g;
        X.fillRect(210, y + 5, 100, 55);
        X.fillStyle = stageOption.floor;
        X.fillRect(210, y + 45, 100, 15);
        X.fillStyle = stageOption.accent;
        X.fillRect(210, y + 45, 100, 3);
        X.font = '12px "Press Start 2P"';
        X.fillStyle = selected ? '#fff' : '#666';
        X.fillText(stageOption.name, W / 2 + 30, y + 42);
    });

    X.font = '10px "Press Start 2P"';
    X.fillStyle = '#aaa';
    X.fillText('UP DOWN SELECT   ENTER TO FIGHT   ESC TO TITLE', W / 2, H - 20);

    if (pressedOnce('ArrowDown')) {
        selStage = (selStage + 1) % STAGES.length;
        snd('select');
    }
    if (pressedOnce('ArrowUp')) {
        selStage = (selStage - 1 + STAGES.length) % STAGES.length;
        snd('select');
    }
    if (confirmPressed()) startMatch();
}

function startMatch() {
    selP2 = Math.floor(Math.random() * ROSTER.length);
    while (selP2 === selP1) selP2 = Math.floor(Math.random() * ROSTER.length);
    p1 = makeFighter(ROSTER[selP1], 150, true);
    p2 = makeFighter(ROSTER[selP2], W - 210, false);
    p1Wins = 0;
    p2Wins = 0;
    round = 1;
    paused = false;
    matchWinner = '';
    projectiles = [];
    particles = [];
    startRound();
    state = 'roundstart';
    announceText = 'ROUND 1';
    announceTimer = 120;
    freezeTimer = 120;
    snd('fight');
}

function startRound() {
    resetFighterForRound(p1, 150, true);
    resetFighterForRound(p2, W - 210, false);
    projectiles = [];
    particles = [];
    roundTimer = 99;
    paused = false;
}

function handleMatchFlow() {
    if (state === 'fight' && !paused) {
        if (freezeTimer <= 0) {
            updateProjectiles();
            updateFighter(p1, p2, false);
            updateFighter(p2, p1, true);
            separateFighters();
            roundTimer -= 1 / 60;
        }

        if (p1.hp <= 0 || p2.hp <= 0 || roundTimer <= 0) {
            if (p1.hp <= 0) {
                p2Wins++;
                announceText = 'K.O.!';
            } else if (p2.hp <= 0) {
                p1Wins++;
                announceText = 'K.O.!';
            } else {
                if (p1.hp > p2.hp) p1Wins++;
                else if (p2.hp > p1.hp) p2Wins++;
                else {
                    p1Wins++;
                    p2Wins++;
                }
                announceText = 'TIME!';
            }
            state = 'ko';
            announceTimer = 120;
            freezeTimer = 120;
            paused = false;
            snd('ko');
        }
    }

    if (!paused && particles.length) updateParticles();
    if (announceTimer > 0 && !paused) {
        announceTimer--;
        if (freezeTimer > 0) freezeTimer--;
        if (announceTimer <= 0) {
            if (state === 'roundstart') {
                state = 'fight';
                freezeTimer = 0;
            } else if (state === 'ko') {
                if (p1Wins >= 2 || p2Wins >= 2) {
                    state = 'matchover';
                    matchWinner = p1Wins >= 2 ? p1.data.name : p2.data.name;
                    announceText = matchWinner + ' WINS!';
                    announceTimer = 180;
                    freezeTimer = 180;
                    snd('win');
                } else {
                    round++;
                    startRound();
                    state = 'roundstart';
                    announceText = 'ROUND ' + round;
                    announceTimer = 120;
                    freezeTimer = 120;
                    snd('fight');
                }
            } else if (state === 'matchover') {
                freezeTimer = 0;
            }
        }
    }

    if (state === 'matchover' && announceTimer <= 0 && !paused) {
        if (confirmPressed()) startMatch();
    }
}

function handleGlobalHotkeys() {
    if ((state === 'fight' || state === 'matchover') && pressedOnce('p')) {
        paused = !paused;
        snd('select');
    }
    if (state !== 'title' && !document.fullscreenElement && pressedOnce('Escape')) {
        returnToTitle();
        snd('select');
    }
}

function drawArena() {
    X.save();
    if (shakeAmt > 0) {
        X.translate((Math.random() - 0.5) * shakeAmt, (Math.random() - 0.5) * shakeAmt);
        shakeAmt *= 0.9;
        if (shakeAmt < 0.5) shakeAmt = 0;
    }
    drawStage(STAGES[selStage]);
    drawProjectiles();
    drawChar(p1);
    drawChar(p2);
    drawParticles();
    X.restore();
    drawHUD();
    drawAnnouncement();

    if (paused && state === 'fight') drawPauseOverlay();
    if (state === 'matchover' && announceTimer <= 0 && !paused) drawMatchOverOverlay();
}

function stepFrame() {
    handleGlobalHotkeys();
    gameTime++;
    X.clearRect(0, 0, W, H);

    if (state === 'title') drawTitle();
    else if (state === 'charselect') drawCharSelect();
    else if (state === 'stageselect') drawStageSelect();
    else if (state === 'roundstart' || state === 'fight' || state === 'ko' || state === 'matchover') {
        handleMatchFlow();
        drawArena();
    }
}

function scheduleNextFrame() {
    if (manualMode) return;
    rafId = requestAnimationFrame(() => {
        rafId = 0;
        stepFrame();
        scheduleNextFrame();
    });
}

window.advanceTime = (ms) => {
    manualMode = true;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    const steps = Math.max(1, Math.round(ms / FRAME_MS));
    for (let i = 0; i < steps; i++) stepFrame();
};

scheduleNextFrame();
