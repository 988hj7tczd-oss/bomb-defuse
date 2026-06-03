
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hudTm = document.getElementById('timerDisplay');
const hudPg = document.getElementById('hudProgress');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const setMuteBtn = document.getElementById('setMuteBtn');
const setVolume = document.getElementById('setVolume');
const setVibrateBtn = document.getElementById('setVibrateBtn');
const setColorblindBtn = document.getElementById('setColorblindBtn');
const setQuitBtn = document.getElementById('setQuitBtn');
const tutorialOverlay = document.getElementById('tutorialOverlay');
const tutorialBtn = document.getElementById('tutorialBtn');
const victoryOverlay = document.getElementById('victoryOverlay');
const vicStars = document.getElementById('vicStars');
const vicRetryBtn = document.getElementById('vicRetryBtn');
const vicMenuBtn = document.getElementById('vicMenuBtn');
const container = document.getElementById('gameContainer');

const W = 520, H = 720;
canvas.width = W; canvas.height = H;

const RED = 0, GREEN = 1;

const LV_CFG = [
  [{w:5,r:1,t:55},{w:6,r:2,t:50},{w:7,r:2,t:40},{w:8,r:2,t:30},{w:8,r:3,t:20}],
  [{w:6,r:2,t:50},{w:7,r:2,t:42},{w:8,r:3,t:35},{w:9,r:3,t:25},{w:9,r:4,t:18}],
  [{w:7,r:2,t:45},{w:8,r:3,t:35},{w:9,r:4,t:28},{w:10,r:4,t:20},{w:10,r:5,t:14}],
  [{w:8,r:3,t:40},{w:9,r:3,t:30},{w:10,r:4,t:22},{w:11,r:5,t:16},{w:11,r:6,t:12}],
  [{w:8,r:3,t:38},{w:9,r:4,t:28},{w:10,r:4,t:20},{w:11,r:5,t:15},{w:12,r:6,t:12}],
  [{w:9,r:3,t:35},{w:10,r:4,t:26},{w:11,r:5,t:18},{w:12,r:6,t:14},{w:12,r:6,t:11}],
  [{w:9,r:4,t:33},{w:10,r:4,t:24},{w:11,r:5,t:17},{w:12,r:6,t:13},{w:13,r:7,t:11}],
  [{w:10,r:4,t:30},{w:11,r:5,t:22},{w:12,r:6,t:16},{w:13,r:6,t:12},{w:13,r:7,t:10}],
  [{w:10,r:4,t:28},{w:11,r:5,t:20},{w:12,r:6,t:15},{w:13,r:7,t:12},{w:14,r:8,t:10}],
  [{w:11,r:5,t:26},{w:12,r:6,t:18},{w:13,r:7,t:14},{w:14,r:7,t:11},{w:14,r:8,t:9}],
  [{w:11,r:5,t:24},{w:12,r:6,t:17},{w:13,r:7,t:13},{w:14,r:8,t:11},{w:15,r:9,t:9}],
  [{w:12,r:5,t:22},{w:13,r:6,t:16},{w:14,r:7,t:12},{w:15,r:8,t:10},{w:15,r:9,t:9}],
  [{w:12,r:6,t:20},{w:13,r:7,t:15},{w:14,r:8,t:12},{w:15,r:9,t:10},{w:16,r:10,t:8}],
  [{w:13,r:6,t:18},{w:14,r:7,t:14},{w:15,r:8,t:11},{w:16,r:9,t:9},{w:16,r:10,t:8}],
  [{w:13,r:6,t:17},{w:14,r:7,t:13},{w:15,r:8,t:10},{w:16,r:9,t:9},{w:17,r:10,t:8}],
  [{w:14,r:7,t:16},{w:15,r:8,t:12},{w:16,r:9,t:10},{w:17,r:10,t:8},{w:17,r:11,t:8}],
  [{w:14,r:7,t:15},{w:15,r:8,t:12},{w:16,r:9,t:9},{w:17,r:10,t:8},{w:18,r:11,t:8}],
  [{w:15,r:7,t:14},{w:16,r:8,t:11},{w:17,r:9,t:9},{w:18,r:10,t:8},{w:18,r:11,t:7}],
  [{w:15,r:8,t:13},{w:16,r:9,t:10},{w:17,r:10,t:8},{w:18,r:11,t:7},{w:19,r:12,t:7}],
];

const TOTAL_LV = LV_CFG.length;
const TOTAL_ST = 5;
const LX = 62, RX = W - 62;
const LTOP = 128, LBOT = 616;

let mlv = 0, stg = 0, mode = 'menu';
let tLeft = 60, tTotal = 60;
let wires = [], cutSet = new Set(), rrIdx = [];
let shkX = 0, shkY = 0, pts = [];
let tmr = null, trTmr = null;
let bgImg = null, bgOk = false;
let loading = true;
let stars = 0, btnHov = false, lvBtnHov = false, showLvSelect = false, lvHov = -1, vicTmr = null;
let rageMode = false, rageScore = 0;
let menuWires = [], menuPCB = null;
let stagePCB = null;
let expData = null;
let soundOn = true, vibrateOn = true, colorblind = false, sfxVol = 1, audioCtx = null, bgmTmr = null, bgmTick = 0;
let showSettings = false, showTutorial = false, showVictory = false;





function ac() { if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if (audioCtx.state==='suspended') audioCtx.resume(); return audioCtx; }
function sfx(fn) { if (!soundOn) return; try { const c=ac(); fn(c); } catch(e){} }
function sfxGain(c,t,v) { const g=c.createGain(); g.gain.setValueAtTime(v*sfxVol,t); return g; }
function sfxNoise(c,len) { const sr=c.sampleRate,bf=sr*len,b=c.createBuffer(1,bf,sr),d=b.getChannelData(0); for(let i=0;i<bf;i++) d[i]=Math.random()*2-1; return b; }

function sfxClick() { sfx(c => { const o=c.createOscillator(),g=sfxGain(c,c.currentTime,.1); o.connect(g); g.connect(c.destination); o.frequency.value=1200; o.type='sine'; g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.05); o.start(); o.stop(c.currentTime+.05); const n=c.createBufferSource(),b=sfxNoise(c,.03); n.buffer=b; const ng=sfxGain(c,c.currentTime,.06); n.connect(ng); ng.connect(c.destination); ng.gain.exponentialRampToValueAtTime(.001,c.currentTime+.03); n.start(); }); }
function sfxCut() { sfx(c => { [800,1600,2400].forEach((f,i)=>{ const o=c.createOscillator(),g=sfxGain(c,c.currentTime+i*.015,.07); o.connect(g); g.connect(c.destination); o.frequency.value=f; o.type='sine'; g.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.015+.06); o.start(c.currentTime+i*.015); o.stop(c.currentTime+i*.015+.06); }); const n=c.createBufferSource(),b=sfxNoise(c,.08); n.buffer=b; const ng=sfxGain(c,c.currentTime,.12); const f=c.createBiquadFilter(); f.type='highpass'; f.frequency.value=3000; n.connect(f); f.connect(ng); ng.connect(c.destination); ng.gain.exponentialRampToValueAtTime(.001,c.currentTime+.08); n.start(); }); }
function sfxExplode() { sfx(c => { const n=c.createBufferSource(),b=sfxNoise(c,.8); n.buffer=b; const g=sfxGain(c,c.currentTime,.35); const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.setValueAtTime(4000,c.currentTime); f.frequency.exponentialRampToValueAtTime(100,c.currentTime+.6); n.connect(f); f.connect(g); g.connect(c.destination); g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.7); n.start(); const o=c.createOscillator(),g2=sfxGain(c,c.currentTime,.25); o.connect(g2); g2.connect(c.destination); o.frequency.setValueAtTime(120,c.currentTime); o.frequency.exponentialRampToValueAtTime(25,c.currentTime+.5); o.type='sawtooth'; g2.gain.exponentialRampToValueAtTime(.001,c.currentTime+.5); o.start(); o.stop(c.currentTime+.5); const sub=c.createOscillator(),g3=sfxGain(c,c.currentTime,.2); sub.connect(g3); g3.connect(c.destination); sub.frequency.setValueAtTime(60,c.currentTime); sub.frequency.exponentialRampToValueAtTime(15,c.currentTime+.4); sub.type='sine'; g3.gain.exponentialRampToValueAtTime(.001,c.currentTime+.4); sub.start(); sub.stop(c.currentTime+.4); const cr=c.createBufferSource(),crb=sfxNoise(c,.15); cr.buffer=crb; const cg=sfxGain(c,c.currentTime,.15); const cf=c.createBiquadFilter(); cf.type='bandpass'; cf.frequency.value=2000; cf.Q.value=5; cr.connect(cf); cf.connect(cg); cg.connect(c.destination); cg.gain.exponentialRampToValueAtTime(.001,c.currentTime+.15); cr.start(); if(navigator.vibrate&&vibrateOn) navigator.vibrate([80,40,80,40,150]); }); }
function sfxStage() { sfx(c => { [523,659,784,1047].forEach((f,i)=>{ const o=c.createOscillator(),g=sfxGain(c,c.currentTime+i*.13,.08); o.connect(g); g.connect(c.destination); o.frequency.value=f; o.type='sine'; g.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.13+.25); o.start(c.currentTime+i*.13); o.stop(c.currentTime+i*.13+.25); const o2=c.createOscillator(),g2=sfxGain(c,c.currentTime+i*.13,.04); o2.connect(g2); g2.connect(c.destination); o2.frequency.value=f*1.5; o2.type='sine'; g2.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.13+.2); o2.start(c.currentTime+i*.13); o2.stop(c.currentTime+i*.13+.2); }); }); }
function sfxLevel() { sfx(c => { [523,587,659,784,880,1047].forEach((f,i)=>{ const o=c.createOscillator(),g=sfxGain(c,c.currentTime+i*.12,.1); o.connect(g); g.connect(c.destination); o.frequency.value=f; o.type='triangle'; g.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.12+.3); o.start(c.currentTime+i*.12); o.stop(c.currentTime+i*.12+.3); }); }); }
function sfxVic() { sfx(c => { [523,659,784,1047,784,1047,1319].forEach((f,i)=>{ const o=c.createOscillator(),g=sfxGain(c,c.currentTime+i*.15,.1); o.connect(g); g.connect(c.destination); o.frequency.value=f; o.type='triangle'; g.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.15+.35); o.start(c.currentTime+i*.15); o.stop(c.currentTime+i*.15+.35); const o2=c.createOscillator(),g2=sfxGain(c,c.currentTime+i*.15,.05); o2.connect(g2); g2.connect(c.destination); o2.frequency.value=f*2; o2.type='sine'; g2.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.15+.25); o2.start(c.currentTime+i*.15); o2.stop(c.currentTime+i*.15+.25); }); }); }
function sfxGo() { sfx(c => { [440,554,659].forEach((f,i)=>{ const o=c.createOscillator(),g=sfxGain(c,c.currentTime+i*.1,.15); o.connect(g); g.connect(c.destination); o.frequency.value=f; o.type='triangle'; g.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.1+.25); o.start(c.currentTime+i*.1); o.stop(c.currentTime+i*.1+.25); }); }); }

function startBGM() { stopBGM(); if (!soundOn) return; bgmTick=0; bgmTmr=setInterval(()=>{ bgmTick++; const spd=tLeft<15?.6:.8; if (bgmTick%Math.round(1/spd)<1) sfx(c=>{ const o=c.createOscillator(),g=sfxGain(c,c.currentTime,.06); o.connect(g); g.connect(c.destination); o.frequency.value=55; o.type='sine'; g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.25); o.start(); o.stop(c.currentTime+.25); }); if (tLeft<10&&bgmTick%2===0) sfx(c=>{ const o=c.createOscillator(),g=sfxGain(c,c.currentTime,.03); o.connect(g); g.connect(c.destination); o.frequency.value=880; o.type='sine'; g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.04); o.start(); o.stop(c.currentTime+.04); }); },500); }
function stopBGM() { if (bgmTmr) { clearInterval(bgmTmr); bgmTmr=null; } }

const BG_IMAGES = [
  'bomb_single_00001_.png','bomb_single_00002_.png','bomb_single_00005_.png',
  'bomb_single_00007_.png','bomb_single_00009_.png','bomb_single_00010_.png',
  'bomb_single_00011_.png','bomb_single_00012_.png','bomb_single_00013_.png',
  'bomb_single_00014_.png','bomb_single_00015_.png','bomb_single_00016_.png',
  'bomb_single_00017_.png','bomb_single_00018_.png','bomb_single_00019_.png',
  'bomb_single_00020_.png','bomb_single_00021_.png','bomb_single_00022_.png',
  'bomb_single_00023_.png',
];

// Stage intro
let introData = null, introTmr = null;
function showStageIntro(cb) {
  mode = 'stageIntro';
  introData = { t0: Date.now(), dur: 1800, cb };
  sfxGo();
  if (introTmr) clearTimeout(introTmr);
  introTmr = setTimeout(() => {
    introData = null; mode = 'playing';
    if (introTmr) { clearTimeout(introTmr); introTmr = null; }
    cb();
  }, 1800);
}

function shf(a){for(let i=a.length-1;i>0;i--){let j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
const rd=(a,b)=>Math.random()*(b-a)+a, pk=a=>a[Math.random()*a.length|0];
const cl=(v,mn,mx)=>Math.max(mn,Math.min(mx,v));
function ir(x,y,r){return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h}
const MB={x:W/2-90,y:H/2+60,w:180,h:54};
const LB={x:W/2-70,y:MB.y+MB.h+14,w:140,h:42};

// ====== STAGE ======

function genStg() {
  const c = LV_CFG[mlv][stg], N = c.w;
  tLeft = rageMode ? 10 : c.t; tTotal = rageMode ? 10 : c.t;
  const leftCol = []; const rightCol = [];
  for (let i = 0; i < c.r; i++) { leftCol.push(RED); rightCol.push(RED); }
  const combos = [[RED, GREEN], [GREEN, RED], [GREEN, GREEN]];
  for (let i = c.r; i < N; i++) { const p = pk(combos); leftCol.push(p[0]); rightCol.push(p[1]); }
  const pairs = []; for (let i = 0; i < N; i++) pairs.push({ l: leftCol[i], r: rightCol[i] });
  shf(pairs);

  const ly = []; { const range = LBOT - LTOP - 80; for (let i = 0; i < N; i++) ly.push(LTOP + 50 + range * (N - i) / (N + 1)); }
  const rp = [...Array(N).keys()]; shf(rp);

  wires = []; cutSet.clear(); rrIdx = [];
  for (let i = 0; i < N; i++) {
    const isRR = pairs[i].l === RED && pairs[i].r === RED;
    if (isRR) rrIdx.push(i);
    wires.push({
      id: i, sx: LX, sy: ly[i], ex: RX, ey: ly[rp[i]],
      leftColor: pairs[i].l, rightColor: pairs[i].r, isRR,
      cut: false, pts: [],
    });
  }
  const chaos = [0.3, 0.6, 0.85, 1.0][mlv] || 0.5;
  for (const w of wires) w.pts = genWireRoute(w, chaos, w.id, wires.length);
  initStagePCB(); upHUD();
}

const PCB_STYLES = [
  { bg:'#0d1a10', trace:'#1a4a2a', trace2:'#2a6a3a', pad:'#8a7a30', pad2:'#c8a840', via:'#3a5a3a', via2:'#1a2a1a' },
  { bg:'#0d1520', trace:'#1a3a5a', trace2:'#2a5a7a', pad:'#3a7a8a', pad2:'#5a9aaa', via:'#2a4a5a', via2:'#1a2a3a' },
  { bg:'#1a150d', trace:'#4a3a1a', trace2:'#6a5a2a', pad:'#8a7a30', pad2:'#b89a40', via:'#4a3a2a', via2:'#2a1a0a' },
  { bg:'#150d1a', trace:'#3a1a4a', trace2:'#5a2a6a', pad:'#6a3a7a', pad2:'#8a5a9a', via:'#3a2a4a', via2:'#1a0a2a' },
];

function initStagePCB() {
  const style = PCB_STYLES[mlv % PCB_STYLES.length];
  const traces = [];
  const n = 14 + mlv * 3 + Math.random() * 8 | 0;
  for (let i = 0; i < n; i++) {
    const x = rd(5, W - 5), y = rd(5, H - 5);
    const pts = [{ x, y }];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let dir = dirs[Math.random() * 4 | 0];
    const steps = 2 + (Math.random() * 3 | 0);
    let cx = x, cy = y;
    for (let s = 0; s < steps; s++) {
      const dist = rd(15, 55);
      cx = cl(cx + dir[0] * dist, 10, W - 10);
      cy = cl(cy + dir[1] * dist, 10, H - 10);
      pts.push({ x: cx, y: cy });
      dir = Math.random() > 0.5 ? [dir[1], -dir[0]] : [-dir[1], dir[0]];
    }
    traces.push(pts);
  }
  const pads = [];
  for (const t of traces) {
    const ep = t[t.length - 1];
    pads.push({ x: ep.x, y: ep.y, r: rd(2.5, 4.5) });
  }
  const vias = [];
  for (let i = 0; i < 20 + mlv * 5; i++) vias.push({ x: rd(15, W - 15), y: rd(15, H - 15) });
  const yellows = [];
  for (let i = 0; i < 10 + mlv * 2; i++) {
    yellows.push({ x: rd(20, W - 20), y: rd(20, H - 20), r: rd(1.5, 3), ph: rd(0, 6.28), freq: rd(400, 1200) });
  }
  stagePCB = { style, traces, pads, vias, yellows };
}

function drawStagePCB() {
  if (!stagePCB) return;
  const { style, traces, pads, vias, yellows } = stagePCB;
  const t = Date.now();

  ctx.save();
  ctx.globalAlpha = 0.7;

  ctx.strokeStyle = style.trace;
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const pts of traces) {
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  ctx.strokeStyle = style.trace2;
  ctx.lineWidth = 0.7;
  for (const pts of traces) {
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  for (const p of pads) {
    ctx.fillStyle = style.pad;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
    ctx.fillStyle = style.pad2;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.7, 0, 6.28); ctx.fill();
  }

  for (const v of vias) {
    ctx.fillStyle = style.via;
    ctx.beginPath(); ctx.arc(v.x, v.y, 2, 0, 6.28); ctx.fill();
    ctx.fillStyle = style.via2;
    ctx.beginPath(); ctx.arc(v.x, v.y, 1, 0, 6.28); ctx.fill();
  }

  ctx.globalAlpha = 1;

  for (const yl of yellows) {
    const b = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t / yl.freq + yl.ph));
    ctx.save();
    ctx.shadowColor = '#ffdd44';
    ctx.shadowBlur = 10 * b;
    ctx.fillStyle = `rgba(255,220,60,${b})`;
    ctx.beginPath(); ctx.arc(yl.x, yl.y, yl.r * b, 0, 6.28); ctx.fill();
    ctx.restore();
  }

  for (let i = 0; i < 3; i++) {
    const idx = (Math.floor(t / 3000) + i) % traces.length;
    const pts = traces[idx];
    const sigT = ((t % 5000) / 5000);
    const sigPos = sigT * (pts.length - 1);
    const sigI = Math.floor(sigPos), sigF = sigPos - sigI;
    const p1 = pts[sigI], p2 = pts[Math.min(sigI + 1, pts.length - 1)];
    const sx = p1.x + (p2.x - p1.x) * sigF, sy = p1.y + (p2.y - p1.y) * sigF;
    ctx.save();
    ctx.shadowColor = '#33ff88';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#33ff88';
    ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, 6.28); ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function genWireRoute(w, chaos, wireIdx, nWires) {
  const x1 = w.sx, y1 = w.sy, x2 = w.ex, y2 = w.ey;
  const innerL = x1 + 30, innerR = x2 - 80;
  const bandW = (innerR - innerL) / nWires;
  const bandL = innerL + bandW * wireIdx;
  const seed = ((wireIdx * 17 + 31) % 71) / 71;

  const d1 = Math.max((bandL - x1) + bandW * (0.1 + seed * 0.4), 25);
  const d2 = Math.max((x2 - bandL - bandW) + bandW * (0.1 + (1 - seed) * 0.4), 25);

  const steps = 60;
  const pts = [];
  const chaosWave = chaos * (8 + wireIdx * 2);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    const x = u * u * u * x1 + 3 * u * u * t * (x1 + d1) + 3 * u * t * t * (x2 - d2) + t * t * t * x2;
    let y = u * u * u * y1 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y2;
    if (i > 0 && i < steps) y += Math.sin(t * chaosWave + seed * 6.28) * chaos * (12 + wireIdx * 3);
    pts.push({ x, y });
  }
  return pts;
}

// ====== TIMER ======

function startTimer() {
  if (tmr) clearInterval(tmr);
  tmr = setInterval(() => {
    if (mode === 'playing') { tLeft = Math.max(0, tLeft - 0.1); if (Math.ceil(tLeft) <= 0) explode(); }
  }, 100);
}

function upHUD() {
  if (rageMode) {
    hudPg.innerHTML = `⚡ 无限模式 &nbsp;|&nbsp; 得分: <b>${rageScore}</b>`;
  } else if (colorblind) {
    hudPg.innerHTML = `第 ${mlv+1}/${TOTAL_LV} 大关 — 第 ${stg+1}/${TOTAL_ST} 小关 &nbsp;✂ ${cutSet.size}/${rrIdx.length} 条 (●⚪)`;
  } else {
    hudPg.innerHTML = `第 ${mlv+1}/${TOTAL_LV} 大关 — 第 ${stg+1}/${TOTAL_ST} 小关 &nbsp;✂ ${cutSet.size}/${rrIdx.length} 条双红线`;
  }
}

function loadBg(lv) {
  const img = new Image();
  img.onload = () => { bgImg = img; bgOk = true; };
  img.onerror = () => { bgOk = false; };
  img.src = `assets/${BG_IMAGES[lv % BG_IMAGES.length]}`;
}

// ====== GAME FLOW ======

function startGame(rage) {
  rageMode = !!rage; rageScore = 0;
  if (!localStorage.getItem('bombTutorialShown')) { showTutorial = true; return; }
  beginPlay();
}
function beginPlay() {
  const pick = parseInt(localStorage.getItem('bombPickLv'));
  const saved = parseInt(localStorage.getItem('bombProgress'));
  mlv = !isNaN(pick) ? Math.min(pick, TOTAL_LV - 1) : !isNaN(saved) ? Math.min(saved, TOTAL_LV - 1) : 0;
  localStorage.removeItem('bombPickLv');
  stg = 0; stars = 0;
  pts = []; shkX = 0; shkY = 0; expData = null;
  loadBg(mlv); genStg(); showStageIntro(() => { mode = 'playing'; startTimer(); startBGM(); });
}
function startStg() {
  pts = []; shkX = 0; shkY = 0; expData = null;
  loadBg(mlv); genStg(); showStageIntro(() => { mode = 'playing'; startTimer(); startBGM(); });
}

function quitGame() {
  mode = 'menu';
  if (tmr) { clearInterval(tmr); tmr = null; }
  if (trTmr) { clearTimeout(trTmr); trTmr = null; }
  if (vicTmr) { clearInterval(vicTmr); vicTmr = null; }
  if (introTmr) { clearTimeout(introTmr); introTmr = null; }
  introData = null; expData = null;
  stopBGM();
  showSettings = false;
  canvas.style.cursor = 'default';
  stars = 0; pts = []; shkX = 0; shkY = 0;
  rageMode = false; rageScore = 0;
}

function explode() {
  if (mode === 'exploded') return;
  mode = 'exploded';
  if (tmr) { clearInterval(tmr); tmr = null; }
  stopBGM();
  sfxExplode();
  const cx = W / 2, cy = H / 2;
  expData = { cx, cy, t0: Date.now(), dur: 1200, ring: 0, ringA: 1 };
  for (let i = 0; i < 200; i++) {
    const a = rd(0, 6.28), spd = rd(2, 14), dist = rd(0, 60);
    pts.push({
      x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - rd(0, 3),
      sz: rd(2, 7), cl: pk(['#ff4400','#ff6600','#ffcc00','#ff2200','#fff']),
      lf: 1, dc: rd(.008, .025), tp: 'x',
    });
  }
  for (let i = 0; i < 80; i++) {
    const a = rd(0, 6.28), spd = rd(1, 5);
    pts.push({
      x: cx + rd(-30, 30), y: cy + rd(-30, 30),
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - rd(0.5, 2),
      sz: rd(6, 14), cl: pk(['#222','#333','#444','#555']),
      lf: 1, dc: rd(.003, .008), tp: 's',
    });
  }
  shkX = 22; shkY = 22;
  hudPg.style.display = 'none';
  setTimeout(() => { if (mode === 'exploded') { mode = 'exploded_show'; canvas.style.cursor = 'pointer'; } }, expData.dur);
}

function cStars(r, t) { if (t <= 0) return 0; const v = r / t; if (v > 0.7) return 3; if (v > 0.4) return 2; if (v > 0) return 1; return 0; }

function stgDone() {
  if (mode === 'stageSuccess') return;
  stars += cStars(tLeft, tTotal);
  mode = 'stageSuccess';
  if (tmr) { clearInterval(tmr); tmr = null; }
  stopBGM(); sfxStage();
  for (let i = 0; i < 50; i++) {
    const a = rd(0, 6.28), s = rd(1, 6);
    pts.push({ x: W / 2 + rd(-25, 25), y: H / 2 + rd(-25, 25),
      vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, sz: rd(2, 5),
      cl: pk(['#44ff66','#88ff44','#aaff44','#66ff88']), lf: 1, dc: rd(.008,.02), tp: 's' });
  }
  hudPg.style.display = 'none'; canvas.style.cursor = 'default';
  if (trTmr) clearTimeout(trTmr);
  trTmr = setTimeout(() => {
    if (rageMode) {
      rageScore++;
      if (stg < TOTAL_ST - 1) { stg++; startStg(); }
      else { mlv = mlv >= TOTAL_LV - 1 ? 0 : mlv + 1; stg = 0; startStg(); }
    } else {
      if (stg < TOTAL_ST - 1) { stg++; startStg(); } else { lvDone(); }
    }
  }, 2200);
}

function lvDone() {
  localStorage.setItem('bombProgress', mlv);
  if (mlv >= TOTAL_LV - 1) { vic(); return; }
  mode = 'levelTransition';
  sfxLevel();
  loadBg(mlv + 1);
  if (trTmr) clearTimeout(trTmr);
  trTmr = setTimeout(() => { mlv++; stg = 0; startStg(); }, 2200);
}

function vic() {
  localStorage.setItem('bombProgress', TOTAL_LV - 1);
  mode = 'victory';
  stopBGM(); sfxVic();
  if (trTmr) clearTimeout(trTmr);
  showVictory = true;
  pts = [];
  if (vicTmr) clearInterval(vicTmr);
  vicTmr = setInterval(() => {
    for (let i = 0; i < 5; i++) pts.push({
      x: rd(50, W - 50), y: H + 10, vx: rd(-.5, .5), vy: rd(-4, -2.5), sz: rd(3, 7),
      cl: pk(['#ff4455','#44dd66','#44aaff','#ffdd44','#ff66aa']), lf: 1, dc: rd(.005,.015), tp: 'c',
    });
  }, 100);
}

function cutWire(idx, cx, cy) {
  if (mode !== 'playing') return;
  const w = wires[idx];
  if (w.cut) return;
  const r = d2p(cx, cy, w.pts);
  w.cutPos = { x: r.x, y: r.y };
  let ci = 0, bd = Infinity;
  for (let i = 0; i < w.pts.length; i++) {
    const d = Math.hypot(w.pts[i].x - r.x, w.pts[i].y - r.y);
    if (d < bd) { bd = d; ci = i; }
  }
  w.cutIdx = ci;
  const cp = w.cutPos;

  if (w.isRR) {
    w.cut = true;
    cutSet.add(idx);
    sfxCut();
    for (let i = 0; i < 35; i++) pts.push({
      x: cp.x + rd(-10, 10), y: cp.y + rd(-10, 10),
      vx: Math.cos(rd(0, 6.28)) * rd(1, 5),
      vy: Math.sin(rd(0, 6.28)) * rd(1, 5),
      sz: rd(2, 5), cl: pk(['#ffdd44','#ffaa00','#ff8800','#fff660']),
      lf: 1, dc: rd(.012,.03), tp: 'k',
    });
    upHUD();
    if (cutSet.size >= rrIdx.length) stgDone();
  } else {
    for (let i = 0; i < 40; i++) pts.push({
      x: cp.x + rd(-12, 12), y: cp.y + rd(-12, 12),
      vx: Math.cos(rd(0, 6.28)) * rd(2, 7),
      vy: Math.sin(rd(0, 6.28)) * rd(2, 7) - 1,
      sz: rd(3, 6), cl: pk(['#ff2222','#ff6600','#ffcc00']),
      lf: 1, dc: rd(.008,.022), tp: 'k',
    });
    explode();
  }
}

// ====== DRAW – WIRES ======

function drawPolylineRange(pts, from, to) {
  if (from >= to || from < 0 || to > pts.length) return;
  ctx.beginPath();
  ctx.moveTo(pts[from].x, pts[from].y);
  for (let i = from + 1; i < to; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
}

function drawWire(pts, cut, cutIdx) {
  if (pts.length < 2) return;

  const gap = 3;
  const ranges = (cut && cutIdx != null)
    ? [{ s: 0, e: Math.max(0, cutIdx - gap) }, { s: Math.min(pts.length, cutIdx + gap), e: pts.length }]
    : [{ s: 0, e: pts.length }];

  const drawLayers = (fn) => {
    for (const r of ranges) {
      if (r.s < r.e) fn(r.s, r.e);
    }
  };

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#4a4d52';
  drawLayers((s, e) => drawPolylineRange(pts, s, e));

  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.lineWidth = 12;
  ctx.strokeStyle = '#5a5e64';
  drawLayers((s, e) => drawPolylineRange(pts, s, e));

  ctx.lineWidth = 9;
  ctx.strokeStyle = '#7b8086';
  drawLayers((s, e) => drawPolylineRange(pts, s, e));

  ctx.lineWidth = 5;
  ctx.strokeStyle = '#a8adb2';
  drawLayers((s, e) => drawPolylineRange(pts, s, e));

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  drawLayers((s, e) => drawPolylineRange(pts, s, e));

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  drawLayers((s, e) => drawPolylineRange(pts, s, e));

  ctx.restore();
}

// ====== DRAW – CUT MARK ======

function drawCut(w) {
  if (!w.cutPos) return;
  const cp = w.cutPos;
  const pts = w.pts;
  let ang = 0;
  if (pts.length >= 2) {
    const idx = Math.min(w.cutIdx || 0, pts.length - 1);
    const pv = pts[Math.max(0, idx - 3)] || pts[0];
    const nx = pts[Math.min(pts.length - 1, idx + 3)] || pts[pts.length - 1];
    ang = Math.atan2(nx.y - pv.y, nx.x - pv.x);
  }
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const colors = ['#b87333','#d4a054','#c48a3a','#e8b868','#a06520'];
  ctx.save();
  ctx.shadowBlur = 4;
  ctx.shadowColor = 'rgba(200,150,50,0.3)';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * 6.28, r = 3 + Math.sin(i * 2.37) * 2.5;
    const dx = ca * Math.cos(a) * r - sa * Math.sin(a) * r;
    const dy = sa * Math.cos(a) * r + ca * Math.sin(a) * r;
    ctx.fillStyle = colors[i % 5];
    ctx.beginPath(); ctx.arc(cp.x + dx, cp.y + dy, 1.2 + (i % 3) * 0.4, 0, 6.28); ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(cp.x, cp.y, 3, 0, 6.28); ctx.fill();
  ctx.restore();
}

function drawLamp(x, y, isRed, cut) {
  ctx.save();
  ctx.fillStyle = '#8a7a30';
  ctx.beginPath(); ctx.arc(x, y, 13, 0, 6.28); ctx.fill();
  ctx.fillStyle = '#c8a840';
  ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.28); ctx.fill();
  if (!cut) {
    const b = isRed ? (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(Date.now() / 180 + x))) : 0.85;
    ctx.shadowColor = isRed ? '#ff2222' : '#44dd66';
    ctx.shadowBlur = 28 * b;
    ctx.fillStyle = isRed ? `rgba(255,60,60,${b})` : `rgba(60,220,70,${b})`;
    ctx.beginPath(); ctx.arc(x, y, 6.5, 0, 6.28); ctx.fill();
  }
  if (colorblind) {
    const sx = x, sy = y + 16;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    if (cut) {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, 6.28); ctx.fill();
    } else if (isRed) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, 6.28); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, 6.28); ctx.stroke();
    }
  }
  ctx.restore();
}



// ====== DRAW – SCENE ======

function drawBG() {
  if (bgOk && bgImg) { ctx.drawImage(bgImg, 0, 0, W, H); }
  else {
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    g.addColorStop(0, '#2a1f2f'); g.addColorStop(0.5, '#14101e'); g.addColorStop(1, '#08060e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  if (mode !== 'exploded' && mode !== 'exploded_show' && mode !== 'menu') {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, W, H);
  }
}

function drawWires() {
  const N = wires.length;
  if (!N) return;

  for (const w of wires) drawWire(w.pts, w.cut, w.cutIdx);
  for (const w of wires) if (w.cut) drawCut(w);
  for (const w of wires) drawLamp(w.sx, w.sy, w.leftColor === RED, w.cut);
  for (const w of wires) drawLamp(w.ex, w.ey, w.rightColor === RED, w.cut);
}

function drawPts() {
  for (const p of pts) {
    if (p.tp === 'c') {
      ctx.save(); ctx.globalAlpha = p.lf; ctx.fillStyle = p.cl;
      ctx.fillRect(p.x - 3, p.y - 3, 6, 6); ctx.restore();
    } else {
      ctx.save(); ctx.globalAlpha = p.lf; ctx.fillStyle = p.cl;
      ctx.shadowColor = p.cl; ctx.shadowBlur = 10;
      const sz = p.sz * p.lf;
      if (sz > 0.5) { ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, 6.28); ctx.fill(); }
      ctx.restore();
    }
  }
}

// ====== MENU & OVERLAYS ======

function initMenuWires() {
  for (let i = 0; i < 4; i++) {
    const pts = [];
    const y0 = 60 + i * 160;
    for (let j = 0; j <= 40; j++) {
      const t = j / 40;
      pts.push({
        x: 15 + (W - 30) * t,
        y: y0 + Math.sin(t * 4 * Math.PI) * 35 + Math.sin(t * 7 * Math.PI + i * 1.2) * 15,
      });
    }
    menuWires.push({ pts, phase: i * 1.7 });
  }
}

function dMenuBand(y, isTop) {
  ctx.save();
  const g = ctx.createLinearGradient(0, y, 0, y + 34);
  g.addColorStop(0, 'rgba(35,10,16,0.75)');
  g.addColorStop(0.5, 'rgba(55,14,20,0.55)');
  g.addColorStop(1, 'rgba(35,10,16,0.75)');
  ctx.fillStyle = g;
  ctx.fillRect(0, y, W, 34);
  ctx.fillStyle = 'rgba(180,130,130,0.2)';
  for (let x = 12; x < W - 5; x += 38) {
    ctx.beginPath();
    ctx.arc(x, y + (isTop ? 17 : 0), 2.5, 0, 6.28);
    ctx.fill();
  }
  ctx.restore();
}

function dMenuWires(t) {
  for (const w of menuWires) {
    const a = 0.04 + 0.03 * Math.sin(t / 2200 + w.phase);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#b0b0c8';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = 'rgba(180,180,200,0.06)';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(w.pts[0].x, w.pts[0].y);
    for (let i = 1; i < w.pts.length; i++) ctx.lineTo(w.pts[i].x, w.pts[i].y);
    ctx.stroke();
    ctx.restore();
  }
}

function dMenuLamps(t) {
  for (const [x, y, isR] of [[28, 44, 1], [W - 28, 44, 0], [28, H - 44, 0], [W - 28, H - 44, 1]]) {
    const b = isR ? (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 360 + x))) : 0.7;
    ctx.save();
    ctx.fillStyle = '#252530';
    ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.28); ctx.fill();
    ctx.shadowColor = isR ? '#ff2222' : '#44dd66';
    ctx.shadowBlur = 16 * b;
    ctx.fillStyle = isR ? `rgba(255,50,50,${b})` : `rgba(50,200,60,${b})`;
    ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.28); ctx.fill();
    ctx.restore();
  }
}

function drawWireChar(ch, x, y, size) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${size}px Arial,sans-serif`;
  const lw = Math.max(1, size * 0.12);

  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#3a3a48';
  ctx.strokeText(ch, x, y);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#555568';
  ctx.strokeText(ch, x, y);

  ctx.strokeStyle = '#8e8fa0';
  ctx.lineWidth = lw * 0.35;
  ctx.strokeText(ch, x, y);

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = lw * 0.12;
  ctx.strokeText(ch, x, y);
  ctx.restore();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${size}px Arial,sans-serif`;
  ctx.lineWidth = lw;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 10; i++) {
    ctx.globalAlpha = rd(0.08, 0.15);
    ctx.beginPath();
    ctx.arc(x + rd(-size * 0.3, size * 0.3), y + rd(-size * 0.35, size * 0.35), rd(0.4, 0.8), 0, 6.28);
    ctx.fill();
  }
  ctx.restore();
}

function drawWireArcO(x, y, size, sa, ea, cxOff, cyOff) {
  const r = size * 0.34;
  const th = size * 0.17;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.strokeStyle = '#3a3a48';
  ctx.lineWidth = th;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x + cxOff, y + cyOff, r, sa, ea); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#555568';
  ctx.beginPath(); ctx.arc(x + cxOff, y + cyOff, r, sa, ea); ctx.stroke();
  ctx.strokeStyle = '#8e8fa0';
  ctx.lineWidth = th * 0.32;
  ctx.beginPath(); ctx.arc(x + cxOff, y + cyOff, r, sa, ea); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = th * 0.1;
  ctx.beginPath(); ctx.arc(x + cxOff, y + cyOff, r, sa, ea); ctx.stroke();
  for (let i = 0; i < 14; i++) {
    const a = sa + Math.random() * (ea - sa);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc((x + cxOff) + Math.cos(a) * (r + rd(-th * 0.25, th * 0.25)), (y + cyOff) + Math.sin(a) * (r + rd(-th * 0.25, th * 0.25)), rd(0.3, 0.7), 0, 6.28);
    ctx.fill();
  }
  ctx.restore();
}

function drawAnimatedO(x, y, size) {
  const cycle = 5000;
  const ph = (Date.now() % cycle) / cycle;
  const r = size * 0.34;
  const ba = -Math.PI / 2;

  if (ph < 0.3) { drawWireArcO(x, y, size, 0, Math.PI * 2, 0, 0); return; }

  if (ph < 0.5) {
    const p = (ph - 0.3) / 0.2;
    drawWireArcO(x, y, size, 0, Math.PI * 2, 0, 0);
    ctx.save();
    ctx.shadowColor = '#ff4400';
    ctx.shadowBlur = 25 * p;
    ctx.strokeStyle = `rgba(255,120,20,${0.5 * p})`;
    ctx.lineWidth = size * 0.17 * (1 + 0.3 * p);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y, r, ba - 0.45, ba + 0.45);
    ctx.stroke();
    ctx.restore();
    if (p > 0.2) {
      const cp = { x: x + Math.cos(ba) * r, y: y + Math.sin(ba) * r };
      ctx.save();
      for (let i = 0; i < 4 + p * 4; i++) {
        ctx.beginPath(); ctx.arc(cp.x + rd(-4, 4), cp.y + rd(-3, 3), rd(1, 2.5), 0, 6.28);
        ctx.fillStyle = pk(['#ddaa33','#eebb44','#ffcc55']);
        ctx.shadowColor = '#ddaa33'; ctx.shadowBlur = 6; ctx.fill();
  }
    }
    return;
  }

  if (ph < 0.7) {
    const p = (ph - 0.5) / 0.2;
    const gap = 0.2 + p * 0.5;
    drawWireArcO(x, y, size, ba + gap, ba + Math.PI * 2 - gap, 0, 0);
    ctx.save();
    ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 18;
    ctx.strokeStyle = 'rgba(255,180,50,0.7)';
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x, y, r, ba + gap - 0.08, ba + gap + 0.08); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r, ba + Math.PI * 2 - gap - 0.08, ba + Math.PI * 2 - gap + 0.08); ctx.stroke();
    ctx.restore();
    const cp = { x: x + Math.cos(ba) * r, y: y + Math.sin(ba) * r };
    ctx.save();
    ctx.shadowColor = '#ddaa33';
    for (let i = 0; i < 5 + p * 12; i++) {
      const a = rd(0, 6.28), d = rd(2, 12 + p * 15);
      ctx.fillStyle = `rgba(255,220,80,${rd(0.3,0.9)})`;
      ctx.shadowBlur = 7;
      ctx.beginPath(); ctx.arc(cp.x + Math.cos(a) * d, cp.y + Math.sin(a) * d, rd(1, 3), 0, 6.28); ctx.fill();
    }
    ctx.restore();
    return;
  }

  if (ph < 0.85) {
    const p = (ph - 0.7) / 0.15;
    ctx.save();
    ctx.shadowColor = '#ff8800';
    for (let i = 0; i < p * 50; i++) {
      const a = rd(0, 6.28), d = rd(0, 30 + p * 45);
      ctx.fillStyle = pk(['rgba(255,200,50,0.8)','rgba(255,255,255,0.5)','#ff6600','#ffaa00']);
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, rd(1.5, 5), 0, 6.28); ctx.fill();
    }
    ctx.restore();
    return;
  }

  drawWireArcO(x, y, size, 0, Math.PI * 2, 0, 0);
}

function dMenuSep(y, t) {
  ctx.save();
  ctx.strokeStyle = 'rgba(200,80,80,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const hw = 130;
  ctx.moveTo(W / 2 - hw, y); ctx.lineTo(W / 2 + hw, y);
  ctx.stroke();
  ctx.fillStyle = '#ff4455';
  const d = 4 + 2 * Math.sin(t / 300);
  ctx.beginPath();
  ctx.moveTo(W / 2, y - d); ctx.lineTo(W / 2 + d, y);
  ctx.lineTo(W / 2, y + d); ctx.lineTo(W / 2 - d, y);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}


function dMenuBtn(t) {
  const bx = MB.x, by = MB.y, bw = MB.w, bh = MB.h;
  const p = 0.85 + 0.15 * Math.sin(t / 500);
  ctx.save();
  ctx.shadowColor = btnHov ? '#ff3344' : 'rgba(255,50,50,0.4)';
  ctx.shadowBlur = btnHov ? 40 * p : 15;
  const bg = ctx.createLinearGradient(bx, by, bx, by + bh);
  if (btnHov) { bg.addColorStop(0, '#ff5566'); bg.addColorStop(1, '#cc2233'); }
  else { bg.addColorStop(0, '#ee4455'); bg.addColorStop(1, '#bb2233'); }
  ctx.fillStyle = bg;
  const r = 12;
  ctx.beginPath();
  ctx.moveTo(bx + r, by); ctx.lineTo(bx + bw - r, by);
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
  ctx.lineTo(bx + bw, by + bh - r);
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
  ctx.lineTo(bx + r, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
  ctx.lineTo(bx, by + r);
  ctx.quadraticCurveTo(bx, by, bx + r, by);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = `rgba(255,200,200,${0.12 * p})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('开 始 游 戏', W / 2, by + bh / 2 + 1);
  const prog = parseInt(localStorage.getItem('bombProgress'));
  if (!isNaN(prog) && prog >= 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '12px Arial,sans-serif';
    ctx.fillText(`第 ${prog + 1} 大关`, W / 2, by + bh + 18);
  }
}

function dMenuLvBtn(t) {
  const bx = LB.x, by = LB.y, bw = LB.w, bh = LB.h;
  const p = 0.85 + 0.15 * Math.sin(t / 500);
  ctx.save();
  ctx.shadowColor = lvBtnHov ? '#5588ff' : 'rgba(80,130,255,0.3)';
  ctx.shadowBlur = lvBtnHov ? 30 * p : 10;
  const bg = ctx.createLinearGradient(bx, by, bx, by + bh);
  if (lvBtnHov) { bg.addColorStop(0, '#5588ff'); bg.addColorStop(1, '#3366cc'); }
  else { bg.addColorStop(0, '#4477dd'); bg.addColorStop(1, '#2255aa'); }
  ctx.fillStyle = bg;
  const r = 10;
  ctx.beginPath();
  ctx.moveTo(bx + r, by); ctx.lineTo(bx + bw - r, by);
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
  ctx.lineTo(bx + bw, by + bh - r);
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
  ctx.lineTo(bx + r, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
  ctx.lineTo(bx, by + r);
  ctx.quadraticCurveTo(bx, by, bx + r, by);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = `rgba(200,220,255,${0.12 * p})`;
  ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('关 卡', W / 2, by + bh / 2 + 1);
}

function dMenuLvPanel(t, hov) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);

  const cols = 3, gap = 8, cw = 108, ch = 56;
  const rows = Math.ceil(TOTAL_LV / cols);
  const totalW = cols * cw + (cols - 1) * gap;
  const ox = Math.max(10, (W - totalW) / 2);
  const headerH = 52;
  const gridH = rows * ch + (rows - 1) * gap;
  const infH = 34;
  const pad = 12;
  const panelH = headerH + 4 + gridH + 8 + infH + pad;

  const oy = Math.max(16, (H - panelH) / 2);

  ctx.fillStyle = 'rgba(10,10,20,0.92)';
  const pr = 12;
  const px = ox - pad, py = oy, pw = totalW + pad * 2;
  ctx.beginPath();
  ctx.moveTo(px + pr, py); ctx.lineTo(px + pw - pr, py);
  ctx.quadraticCurveTo(px + pw, py, px + pw, py + pr);
  ctx.lineTo(px + pw, py + panelH - pr);
  ctx.quadraticCurveTo(px + pw, py + panelH, px + pw - pr, py + panelH);
  ctx.lineTo(px + pr, py + panelH);
  ctx.quadraticCurveTo(px, py + panelH, px, py + panelH - pr);
  ctx.lineTo(px, py + pr);
  ctx.quadraticCurveTo(px, py, px + pr, py);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1; ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = 'bold 15px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('大 关 选 择', W / 2, oy + 18);

  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.font = '17px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('✕', px + pw - 18, oy + 16);

  const prog = parseInt(localStorage.getItem('bombProgress'));
  const maxLv = isNaN(prog) ? 0 : prog + 1;

  for (let i = 0; i < TOTAL_LV; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const bx = ox + col * (cw + gap), by = oy + headerH + row * (ch + gap);
    const locked = i > maxLv;
    const isHov = hov === i;

    ctx.save();
    const bg = ctx.createLinearGradient(bx, by, bx, by + ch);
    if (locked) { bg.addColorStop(0, '#14141e'); bg.addColorStop(1, '#0a0a12'); }
    else if (isHov) { bg.addColorStop(0, '#ff5566'); bg.addColorStop(1, '#cc2233'); }
    else { bg.addColorStop(0, '#d43a4a'); bg.addColorStop(1, '#a01a2a'); }
    ctx.fillStyle = bg;
    const r2 = 7;
    ctx.beginPath();
    ctx.moveTo(bx + r2, by); ctx.lineTo(bx + cw - r2, by);
    ctx.quadraticCurveTo(bx + cw, by, bx + cw, by + r2);
    ctx.lineTo(bx + cw, by + ch - r2);
    ctx.quadraticCurveTo(bx + cw, by + ch, bx + cw - r2, by + ch);
    ctx.lineTo(bx + r2, by + ch);
    ctx.quadraticCurveTo(bx, by + ch, bx, by + ch - r2);
    ctx.lineTo(bx, by + r2);
    ctx.quadraticCurveTo(bx, by, bx + r2, by);
    ctx.closePath(); ctx.fill();
    if (!locked) {
      ctx.strokeStyle = `rgba(255,200,200,${isHov ? 0.3 : 0.08})`;
      ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.restore();

    ctx.textAlign = 'center';
    if (locked) {
      ctx.fillStyle = 'rgba(200,200,200,0.2)';
      ctx.font = '20px Arial,sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔒', bx + cw / 2, by + ch / 2);
    } else {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial,sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(`第${i + 1}大关`, bx + cw / 2, by + 19);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '10px Arial,sans-serif';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${TOTAL_ST}小关`, bx + cw / 2, by + ch - 5);
      if (i < maxLv) {
        ctx.fillStyle = 'rgba(255,220,80,0.45)';
        ctx.font = '10px Arial,sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.fillText('✓', bx + cw - 12, by + 12);
      }
    }
  }

  ctx.save();
  const isHov = hov === -2;
  const infBx = ox, infBy = oy + headerH + gridH + 8, infBw = totalW, infBh = infH;
  const bg = ctx.createLinearGradient(infBx, infBy, infBx, infBy + infBh);
  if (isHov) { bg.addColorStop(0, '#ff7733'); bg.addColorStop(1, '#cc4400'); }
  else { bg.addColorStop(0, '#ee6622'); bg.addColorStop(1, '#bb3300'); }
  ctx.fillStyle = bg;
  const r2 = 6;
  ctx.beginPath();
  ctx.moveTo(infBx + r2, infBy); ctx.lineTo(infBx + infBw - r2, infBy);
  ctx.quadraticCurveTo(infBx + infBw, infBy, infBx + infBw, infBy + r2);
  ctx.lineTo(infBx + infBw, infBy + infBh - r2);
  ctx.quadraticCurveTo(infBx + infBw, infBy + infBh, infBx + infBw - r2, infBy + infBh);
  ctx.lineTo(infBx + r2, infBy + infBh);
  ctx.quadraticCurveTo(infBx, infBy + infBh, infBx, infBy + infBh - r2);
  ctx.lineTo(infBx, infBy + r2);
  ctx.quadraticCurveTo(infBx, infBy, infBx + r2, infBy);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = `rgba(255,200,150,${isHov ? 0.3 : 0.08})`;
  ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('⚡ 无 限 模 式', infBx + infBw / 2, infBy + infBh / 2);
  ctx.restore();
  ctx.restore();
}

function initMenuPCB() {
  const traces = [];
  for (let i = 0; i < 28; i++) {
    const x = rd(5, W - 5), y = rd(5, H - 5);
    const pts = [{ x, y }];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let dir = dirs[Math.random() * 4 | 0];
    const steps = 3 + (Math.random() * 4 | 0);
    let cx = x, cy = y;
    for (let s = 0; s < steps; s++) {
      const dist = rd(20, 70);
      cx = cl(cx + dir[0] * dist, 5, W - 5);
      cy = cl(cy + dir[1] * dist, 5, H - 5);
      pts.push({ x: cx, y: cy });
      dir = Math.random() > 0.5 ? [dir[1], -dir[0]] : [-dir[1], dir[0]];
    }
    traces.push(pts);
  }
  const pads = [];
  for (const t of traces) {
    const ep = t[t.length - 1];
    pads.push({ x: ep.x, y: ep.y, r: rd(3, 5.5) });
  }
  const vias = [];
  for (let i = 0; i < 35; i++) vias.push({ x: rd(10, W - 10), y: rd(10, H - 10) });
  const yellows = [];
  for (let i = 0; i < 14; i++) {
    yellows.push({ x: rd(15, W - 15), y: rd(15, H - 15), r: rd(2, 3.5), ph: rd(0, 6.28), freq: rd(300, 900) });
  }
  menuPCB = { traces, pads, vias, yellows };
}

function drawSignalDot(traceIdx, timeOffset, speed, t) {
  const pts = menuPCB.traces[traceIdx % menuPCB.traces.length];
  const sigT = (((t + timeOffset) % speed) / speed);
  const sigPos = sigT * (pts.length - 1);
  const sigI = Math.floor(sigPos), sigF = sigPos - sigI;
  const p1 = pts[sigI], p2 = pts[Math.min(sigI + 1, pts.length - 1)];
  const sx = p1.x + (p2.x - p1.x) * sigF, sy = p1.y + (p2.y - p1.y) * sigF;

  ctx.save();
  ctx.shadowColor = '#33ff77';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#33ff77';
  ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, 6.28); ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = 'rgba(51,255,119,0.1)';
  ctx.lineWidth = 2.5;
  for (let i = 1; i < pts.length; i++) {
    const tEnd = i / (pts.length - 1);
    if (tEnd >= sigT - 0.12 && i - 1 <= sigPos) {
      ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
      ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawMenuBG() {
  if (!menuPCB) initMenuPCB();
  const t = Date.now();
  const { traces, pads, vias, yellows } = menuPCB;

  ctx.fillStyle = '#0d1a10';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(30,70,40,0.1)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  ctx.strokeStyle = '#1a4a2a';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const pts of traces) {
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#2a6a3a';
  ctx.lineWidth = 0.8;
  for (const pts of traces) {
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  for (const p of pads) {
    ctx.fillStyle = '#8a7a30';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#c8a840';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.7, 0, 6.28); ctx.fill();
  }

  for (const v of vias) {
    ctx.fillStyle = '#3a5a3a';
    ctx.beginPath(); ctx.arc(v.x, v.y, 2.5, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#1a2a1a';
    ctx.beginPath(); ctx.arc(v.x, v.y, 1.2, 0, 6.28); ctx.fill();
  }

  drawSignalDot(0, 0, 4000, t);
  drawSignalDot(7, 1200, 5000, t);
  drawSignalDot(14, 800, 3500, t);
  drawSignalDot(21, 2000, 6000, t);

  for (const yl of yellows) {
    const b = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t / yl.freq + yl.ph));
    ctx.save();
    ctx.shadowColor = '#ffdd44';
    ctx.shadowBlur = 10 * b;
    ctx.fillStyle = `rgba(255,220,60,${b})`;
    ctx.beginPath(); ctx.arc(yl.x, yl.y, yl.r * b, 0, 6.28); ctx.fill();
    ctx.restore();
  }

  const vg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
  vg.addColorStop(0, 'rgba(13,26,16,0)');
  vg.addColorStop(0.6, 'rgba(13,26,16,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}

function drawMenu() {
  if (!menuWires.length) initMenuWires();
  const t = Date.now();

  drawMenuBG();
  const ovg = ctx.createLinearGradient(0, 0, 0, H);
  ovg.addColorStop(0, 'rgba(0,0,0,0.7)');
  ovg.addColorStop(0.25, 'rgba(0,0,0,0.35)');
  ovg.addColorStop(0.75, 'rgba(0,0,0,0.35)');
  ovg.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = ovg;
  ctx.fillRect(0, 0, W, H);

  dMenuBand(0, true);
  dMenuBand(H - 34, false);
  dMenuWires(t);
  dMenuLamps(t);

  ctx.save();
  ctx.font = 'bold 64px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const bW = ctx.measureText('B').width, oW = ctx.measureText('O').width, mW = ctx.measureText('M').width, b2W = ctx.measureText('B').width;
  const titleL = ['B', 'O', 'M', 'B'];
  const titleW = [bW, oW, mW, b2W];
  const totalW = bW + oW + mW + b2W + 12;
  let tx = W / 2 - totalW / 2;
  for (let i = 0; i < 4; i++) {
    const lx = tx + titleW[i] / 2;
    if (titleL[i] === 'O') drawAnimatedO(lx, 125, 64);
    else drawWireChar(titleL[i], lx, 125, 64);
    tx += titleW[i] + 4;
  }
  ctx.restore();

  ctx.save();
  ctx.font = 'bold 48px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const defL = ['D','E','F','U','S','E'];
  const defW = defL.map(l => ctx.measureText(l).width);
  const defTotal = defW.reduce((a,b)=>a+b,0) + 15;
  let dx = W / 2 - defTotal / 2;
  for (let i = 0; i < 6; i++) {
    const lx = dx + defW[i] / 2;
    drawWireChar(defL[i], lx, 195, 48);
    dx += defW[i] + 3;
  }
  ctx.restore();

  dMenuSep(248, t);
  dMenuBtn(t);
  dMenuLvBtn(t);
  if (showLvSelect) dMenuLvPanel(t, lvHov);
}

function drawSS() {
  if (mode !== 'stageSuccess') return;
  ctx.fillStyle = 'rgba(0,180,50,0.06)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = '#44ff66'; ctx.shadowBlur = 50;
  ctx.fillStyle = '#44ff66';
  ctx.font = 'bold 52px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('✅', W / 2, H / 2 - 65);
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#44dd66';
  ctx.font = 'bold 26px Arial,sans-serif';
  ctx.fillText('拆弹成功！', W / 2, H / 2 - 5);
  ctx.restore();
  const e = cStars(tLeft, tTotal);
  ctx.fillStyle = '#ffdd44';
  ctx.font = 'bold 32px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('⭐'.repeat(e) + '☆'.repeat(3 - e), W / 2, H / 2 + 55);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '15px Arial,sans-serif';
  ctx.fillText(`总星数: ${stars} ⭐`, W / 2, H / 2 + 100);
}

function drawExpl() {
  if (mode !== 'exploded' && mode !== 'exploded_show') return;
  const el = expData ? Math.min(1, (Date.now() - expData.t0) / expData.dur) : 1;
  const cx = expData ? expData.cx : W / 2, cy = expData ? expData.cy : H / 2;

  if (mode === 'exploded') {
    const flash = Math.max(0, 1 - el * 8);
    if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash * 0.6})`; ctx.fillRect(0, 0, W, H); }

    const ringR = el * 200;
    const ringA = Math.max(0, 1 - el * 2);
    if (ringA > 0) {
      ctx.save();
      ctx.strokeStyle = `rgba(255,120,40,${ringA * 0.5})`;
      ctx.lineWidth = 6 * ringA + 2;
      ctx.shadowColor = '#ff4400';
      ctx.shadowBlur = 30 * ringA;
      ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, 6.28); ctx.stroke();
      ctx.restore();
    }

    const vg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
    vg.addColorStop(0, `rgba(255,200,50,${el < 0.3 ? (1 - el / 0.3) * 0.6 : 0})`);
    vg.addColorStop(0.4, `rgba(255,80,20,${el < 0.5 ? (1 - el / 0.5) * 0.4 : 0})`);
    vg.addColorStop(1, 'rgba(255,0,0,0)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    const vig = Math.min(1, el * 3);
    if (vig > 0) {
      const vg2 = ctx.createRadialGradient(cx, cy, 80, cx, cy, 400);
      vg2.addColorStop(0, 'rgba(0,0,0,0)');
      vg2.addColorStop(1, `rgba(60,0,0,${vig * 0.5})`);
      ctx.fillStyle = vg2;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.fillStyle = `rgba(255,0,0,${Math.sin(el * 30) * 0.06 + 0.06})`;
    ctx.fillRect(0, 0, W, H);
  }

  if (mode === 'exploded_show') {
    ctx.fillStyle = 'rgba(80,0,0,0.2)';
    ctx.fillRect(0, 0, W, H);

    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200);

    ctx.save();
    ctx.shadowColor = '#ff2200';
    ctx.shadowBlur = 40 + 20 * pulse;
    ctx.fillStyle = '#ff2222';
    ctx.font = 'bold 64px Arial,sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (rageMode) {
      ctx.fillText('游戏结束', W / 2, H / 2 - 60);
    } else {
      ctx.fillText('任务失败', W / 2, H / 2 - 30);
    }
    ctx.restore();

    if (rageMode) {
      ctx.save();
      ctx.shadowColor = '#ff8800';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffaa44';
      ctx.font = 'bold 28px Arial,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`无限得分: ${rageScore}`, W / 2, H / 2 + 10);
      ctx.restore();
      if ((Date.now() / 500 | 0) % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = 'bold 18px Arial,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🔄 点击再来一局', W / 2, H / 2 + 70);
      }
    } else {
      ctx.save();
      ctx.shadowColor = '#ff4400';
      ctx.shadowBlur = 15;
      ctx.fillStyle = `rgba(255,200,100,${0.4 + 0.3 * pulse})`;
      ctx.font = 'bold 20px Arial,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('剪断了非双红链接！', W / 2, H / 2 + 45);
      ctx.restore();

      if ((Date.now() / 500 | 0) % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = 'bold 18px Arial,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🔄 点击重新挑战', W / 2, H / 2 + 105);
      }
    }
  }
}

function drawLT() {
  if (mode !== 'levelTransition') return;
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = '#ffdd44'; ctx.shadowBlur = 50;
  ctx.fillStyle = '#ffdd44';
  ctx.font = 'bold 48px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🎉', W / 2, H / 2 - 55);
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#ffcc44';
  ctx.font = 'bold 24px Arial,sans-serif';
  const endSub = stg >= TOTAL_ST - 1;
  ctx.fillText(`第 ${mlv+1} 大关 — 第 ${stg+1} 小关通关！`, W / 2, H / 2 + 15);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '17px Arial,sans-serif';
  ctx.fillText(`当前总星数: ${stars} ⭐`, W / 2, H / 2 + 65);
  ctx.fillText(endSub ? `准备第 ${mlv+2} 大关 — 第 1 小关...` : `准备第 ${mlv+1} 大关 — 第 ${stg+2} 小关...`, W / 2, H / 2 + 100);
  ctx.restore();
}

function drawVic() {
  if (mode !== 'victory') return;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = '#ffdd44'; ctx.shadowBlur = 80;
  ctx.fillStyle = '#ffdd44';
  ctx.font = 'bold 72px Arial,sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🏆', W / 2, H / 2 - 80);
  ctx.shadowBlur = 35;
  ctx.fillStyle = '#ffcc44';
  ctx.font = 'bold 32px Arial,sans-serif';
  ctx.fillText('全部通关！', W / 2, H / 2 + 10);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '20px Arial,sans-serif';
  ctx.fillText(`获得总星数: ${stars} ⭐`, W / 2, H / 2 + 70);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '15px Arial,sans-serif';
  ctx.fillText('点击重新开始', W / 2, H / 2 + 115);
  ctx.restore();
}

// ====== MAIN ======

function draw() {
  ctx.save();
  if (shkX > 0.5 || shkY > 0.5) ctx.translate((Math.random() - 0.5) * shkX * 2, (Math.random() - 0.5) * shkY * 2);
  ctx.clearRect(-10, -10, W + 20, H + 20);
  UI._btns = [];
  if (mode === 'menu') { drawMenu(); }
  else {
    drawBG();
    drawStagePCB();
    const sh = mode === 'playing' || mode === 'stageSuccess' || mode === 'levelTransition' || mode === 'victory';
    if (sh) drawWires();
    drawPts();
    if (mode === 'exploded' || mode === 'exploded_show') drawExpl();
    if (mode === 'stageSuccess') drawSS();
    if (mode === 'levelTransition') drawLT();
    if (mode === 'playing') {
      UI.timer(ctx, tLeft);
      if (!rageMode) {
        UI.hud(ctx, cutSet.size, rrIdx.length, mlv, TOTAL_LV, stg, TOTAL_ST);
      } else {
        UI.hud(ctx, cutSet.size, rrIdx.length, mlv, TOTAL_LV, stg, TOTAL_ST);
      }
    }
  }
  if (mode !== 'menu') {
    UI.settingsBtn(ctx);
  }
  if (showTutorial) UI.tutorial(ctx, true);
  if (showSettings) UI.settings(ctx, true, soundOn, vibrateOn, colorblind, sfxVol);
  if (showVictory) UI.victory(ctx, stars);
  if (introData) {
    const el = Math.min(1, (Date.now() - introData.t0) / introData.dur);
    ctx.fillStyle = `rgba(0,0,0,${el < .1 ? el/.1*.45 : el > .9 ? (1-el)/.1*.45 : .45})`;
    ctx.fillRect(0,0,W,H);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    let txt = '', sz = 36;
    if (el < .33) { txt = `第 ${mlv+1}/${TOTAL_LV} 大关 — 第 ${stg+1}/${TOTAL_ST} 小关`; sz = 32; }
    else if (el < .55) { txt = '预  备'; sz = 42; }
    else if (el < .85) { txt = 'GO!'; sz = 64; }
    if (txt) {
      ctx.shadowColor = txt === 'GO!' ? '#44ff66' : '#ff4444';
      ctx.shadowBlur = 60;
      ctx.fillStyle = txt === 'GO!' ? '#44ff66' : '#ff4444';
      ctx.font = `bold ${sz}px Arial,sans-serif`;
      ctx.fillText(txt, W/2, H/2);
    }
  }
  if (loading) { ctx.fillStyle = '#0a0a12'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#888'; ctx.font = '18px Arial,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('加载中...', W / 2, H / 2); }
  ctx.restore();
}

function updPts() {
  for (const p of pts) {
    p.x += p.vx; p.y += p.vy;
    if (p.tp === 'x' || p.tp === 'k') p.vy += 0.05;
    if (p.tp === 'c') p.vy += 0.02;
    p.vx *= 0.97; p.lf -= p.dc;
  }
  pts = pts.filter(p => p.lf > 0);
}

function updShk() {
  if (mode === 'exploded') { shkX *= 0.9; shkY *= 0.9; if (Math.abs(shkX) < 0.3) shkX = 0; if (Math.abs(shkY) < 0.3) shkY = 0; }
  else { shkX = 0; shkY = 0; }
}

function loop() {
  updPts(); updShk();
  draw();
  requestAnimationFrame(loop);
}

// ====== INPUT ======

function d2p(cx, cy, p) {
  let b = Infinity, bx = 0, by = 0;
  for (let i = 0; i < p.length - 1; i++) {
    const p1 = p[i], p2 = p[i + 1];
    const dx = p2.x - p1.x, dy = p2.y - p1.y, l2 = dx * dx + dy * dy;
    if (l2 === 0) continue;
    let t = ((cx - p1.x) * dx + (cy - p1.y) * dy) / l2;
    t = cl(t, 0, 1);
    const ix = p1.x + t * dx, iy = p1.y + t * dy;
    const d = Math.hypot(cx - ix, cy - iy);
    if (d < b) { b = d; bx = ix; by = iy; }
  }
  return { dist: b, x: bx, y: by };
}

function findW(cx, cy) {
  let b = -1, bd = 24, bx = 0, by = 0, bi = 0;
  for (const w of wires) {
    if (w.cut) continue;
    const r = d2p(cx, cy, w.pts);
    if (r.dist < bd) { bd = r.dist; b = w.id; bx = r.x; by = r.y; }
  }
  return b >= 0 ? { idx: b, x: bx, y: by } : null;
}

function xy(cx, cy) {
  const r = canvas.getBoundingClientRect();
  return { x: (cx - r.left) * (W / r.width), y: (cy - r.top) * (H / r.height) };
}

function hClick(x, y) {
  const hit = UI.hitTest(x, y);
  if (hit === 'tutorial_start') { showTutorial = false; localStorage.setItem('bombTutorialShown', '1'); beginPlay(); return; }
  if (hit === 'victory_retry') { showVictory = false; if (vicTmr) { clearInterval(vicTmr); vicTmr = null; } mode = 'menu'; stars = 0; startGame(); return; }
  if (hit === 'victory_menu') { showVictory = false; if (vicTmr) { clearInterval(vicTmr); vicTmr = null; } mode = 'menu'; stars = 0; return; }
  if (hit === 'settings') { showSettings = !showSettings; sfxClick(); return; }
  if (hit === 'mute_btn') { toggleMute(); return; }
  if (hit === 'vibrate_btn') { toggleVibrate(); return; }
  if (hit === 'cb_btn') { toggleColorblind(); return; }
  if (hit === 'quit_btn') { showSettings = false; quitGame(); return; }
  if (showSettings && !hit) { showSettings = false; return; }

  if (mode === 'menu') {
    if (showLvSelect) {
      const cols = 3, gap = 8, cw = 108, ch = 56;
      const rows = Math.ceil(TOTAL_LV / cols);
      const totalW = cols * cw + (cols - 1) * gap;
      const ox = Math.max(10, (W - totalW) / 2);
      const headerH = 52;
      const gridH = rows * ch + (rows - 1) * gap;
      const infH = 34;
      const pad = 12;
      const panelH = headerH + 4 + gridH + 8 + infH + pad;
      const oy = Math.max(16, (H - panelH) / 2);
      const px = ox - pad, py = oy, pw = totalW + pad * 2;
      const inPanel = x >= px && x <= px + pw && y >= py && y <= py + panelH;
      if (!inPanel) { showLvSelect = false; sfxClick(); return; }
      if (x >= px + pw - 24 && x <= px + pw && y >= py + 4 && y <= py + 28) { showLvSelect = false; sfxClick(); return; }
      const prog = parseInt(localStorage.getItem('bombProgress'));
      const maxLv = isNaN(prog) ? 0 : prog + 1;
      for (let i = 0; i < TOTAL_LV; i++) {
        const col = i % cols, row = Math.floor(i / cols);
        const bx = ox + col * (cw + gap), by = oy + headerH + row * (ch + gap);
        if (x >= bx && x <= bx + cw && y >= by && y <= by + ch && i <= maxLv) {
          sfxClick(); showLvSelect = false; localStorage.setItem('bombPickLv', i); startGame(); return;
        }
      }
      const infBx = ox, infBy = oy + headerH + gridH + 8, infBw = totalW;
      if (x >= infBx && x <= infBx + infBw && y >= infBy && y <= infBy + infH) {
        sfxClick(); showLvSelect = false; startGame(true); return;
      }
      return;
    }
    if (ir(x, y, MB)) { sfxClick(); startGame(); return; }
    if (ir(x, y, LB)) { sfxClick(); showLvSelect = true; return; }
    return;
  }
  if (mode === 'exploded_show') {
    if (rageMode) { startGame(true); } else { startStg(); }
    return;
  }
  if (mode !== 'playing') return;
  const wHit = findW(x, y);
  if (wHit) cutWire(wHit.idx, wHit.x, wHit.y);
}

function hMove(x, y) {
  if (mode === 'menu') {
    btnHov = ir(x, y, MB);
    lvBtnHov = ir(x, y, LB);
    lvHov = -1;
    if (showLvSelect) {
      const cols = 3, gap = 8, cw = 108, ch = 56;
      const rows = Math.ceil(TOTAL_LV / cols);
      const totalW = cols * cw + (cols - 1) * gap;
      const ox = Math.max(10, (W - totalW) / 2);
      const headerH = 52;
      const gridH = rows * ch + (rows - 1) * gap;
      const oy = Math.max(16, (H - (headerH + 4 + gridH + 8 + 34 + 12)) / 2);
      for (let i = 0; i < TOTAL_LV; i++) {
        const col = i % cols, row = Math.floor(i / cols);
        const bx = ox + col * (cw + gap), by = oy + headerH + row * (ch + gap);
        if (x >= bx && x <= bx + cw && y >= by && y <= by + ch) { lvHov = i; break; }
      }
      const infBx = ox, infBy = oy + headerH + gridH + 8, infBw = totalW, infBh = 34;
      if (x >= infBx && x <= infBx + infBw && y >= infBy && y <= infBy + infBh) lvHov = -2;
    }
    canvas.style.cursor = (btnHov || lvBtnHov || lvHov >= 0) ? 'pointer' : 'default';
  }
  else if (mode === 'exploded_show') canvas.style.cursor = 'pointer';
  else canvas.style.cursor = 'default';
}

canvas.addEventListener('mousemove', e => { const p = xy(e.clientX, e.clientY); hMove(p.x, p.y); });
canvas.addEventListener('mouseleave', () => { btnHov = false; lvBtnHov = false; lvHov = -1; canvas.style.cursor = 'default'; });
canvas.addEventListener('click', e => { const p = xy(e.clientX, e.clientY); hClick(p.x, p.y); });
canvas.addEventListener('touchstart', e => { e.preventDefault(); const t = e.touches[0]; const p = xy(t.clientX, t.clientY); hClick(p.x, p.y); }, { passive: false });
canvas.addEventListener('touchmove', e => { e.preventDefault(); const t = e.touches[0]; const p = xy(t.clientX, t.clientY); hMove(p.x, p.y); }, { passive: false });

function toggleMute() {
  soundOn = !soundOn;
  if (soundOn) { if (mode === 'playing') startBGM(); }
  else { stopBGM(); }
  localStorage.setItem('bombSound', soundOn ? '1' : '0');
}
function toggleVibrate() {
  vibrateOn = !vibrateOn;
  localStorage.setItem('bombVibrate', vibrateOn ? '1' : '0');
}
function toggleColorblind() {
  colorblind = !colorblind;
  localStorage.setItem('bombColorblind', colorblind ? '1' : '0');
}

if (localStorage.getItem('bombSound') === '0') { soundOn = false; }
if (localStorage.getItem('bombVibrate') === '0') { vibrateOn = false; }
if (localStorage.getItem('bombColorblind') === '1') { colorblind = true; }
const savedVol = parseFloat(localStorage.getItem('bombVol'));
if (savedVol >= 0) { sfxVol = savedVol; }

window.addEventListener('resize', () => {
  const s = Math.min(window.innerWidth / W, window.innerHeight / H);
  const x = (window.innerWidth - W * s) / 2;
  const y = (window.innerHeight - H * s) / 2;
  container.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
});
window.dispatchEvent(new Event('resize'));

loadBg(0);
setTimeout(() => {
  loading = false; mode = 'menu';
  loop();
}, 300);
