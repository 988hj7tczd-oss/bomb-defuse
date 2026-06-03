const Platform = {
  name: 'browser',

  createContext(canvas) { return canvas.getContext('2d'); },

  getCanvasSize(canvas) { return { w: canvas.width, h: canvas.height }; },

  xy(canvas, clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left) * (canvas.width / r.width),
      y: (clientY - r.top) * (canvas.height / r.height),
    };
  },

  onClick(canvas, cb) { canvas.addEventListener('click', cb); },
  onMove(canvas, cb) { canvas.addEventListener('mousemove', cb); },
  onLeave(canvas, cb) { canvas.addEventListener('mouseleave', cb); },
  onTouchStart(canvas, cb) { canvas.addEventListener('touchstart', cb, { passive: false }); },
  onTouchMove(canvas, cb) { canvas.addEventListener('touchmove', cb, { passive: false }); },

  getItem(key) { return localStorage.getItem(key); },
  setItem(key, val) { localStorage.setItem(key, val); },

  createAudio() {
    try { return new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  },

  getAudioState(ctx) { return ctx ? ctx.state : 'closed'; },

  requestFrame(cb) { requestAnimationFrame(cb); },

  vibrate(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); },

  handleResize(container, w, h) {
    const s = Math.min(window.innerWidth / w, window.innerHeight / h);
    const x = (window.innerWidth - w * s) / 2;
    const y = (window.innerHeight - h * s) / 2;
    container.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  },
};
