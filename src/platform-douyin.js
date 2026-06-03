const Platform = {
  name: 'douyin',

  _canvas: null,
  _ctx: null,

  createContext(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    return this._ctx;
  },

  getCanvasSize(canvas) { return { w: canvas.width, h: canvas.height }; },

  xy(canvas, clientX, clientY) {
    const sys = tt.getSystemInfoSync();
    return {
      x: (clientX / sys.windowWidth) * canvas.width,
      y: (clientY / sys.windowHeight) * canvas.height,
    };
  },

  onClick(canvas, cb) { tt.onTouchEnd(e => { if (e.touches.length) { const t = e.touches[0]; cb({ clientX: t.x, clientY: t.y }); } }); },
  onMove(canvas, cb) { tt.onTouchMove(e => { if (e.touches.length) { const t = e.touches[0]; cb({ clientX: t.x, clientY: t.y }); } }); },
  onLeave() {},
  onTouchStart(canvas, cb) { tt.onTouchStart(e => { if (e.touches.length) { const t = e.touches[0]; cb({ clientX: t.x, clientY: t.y }); } }); },
  onTouchMove(canvas, cb) { tt.onTouchMove(e => { if (e.touches.length) { const t = e.touches[0]; cb({ clientX: t.x, clientY: t.y }); } }); },

  getItem(key) { return tt.getStorageSync(key) ?? null; },
  setItem(key, val) { tt.setStorageSync(key, val); },

  createAudio() {
    try { return new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  },

  getAudioState(ctx) { return ctx ? ctx.state : 'closed'; },

  requestFrame(cb) { (this._canvas || {}).requestAnimationFrame ? this._canvas.requestAnimationFrame(cb) : setTimeout(cb, 16); },

  vibrate() { tt.vibrateShort({ type: 'medium' }).catch(() => {}); },

  handleResize() {},
};
