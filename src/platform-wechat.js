const Platform = {
  name: 'wechat',

  _canvas: null,
  _ctx: null,

  createContext(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    return this._ctx;
  },

  getCanvasSize(canvas) { return { w: canvas.width, h: canvas.height }; },

  xy(canvas, clientX, clientY) {
    const sys = wx.getWindowInfo();
    return {
      x: (clientX / sys.windowWidth) * canvas.width,
      y: (clientY / sys.windowHeight) * canvas.height,
    };
  },

  onClick(canvas, cb) { wx.onTouchEnd(e => { if (e.touches.length) { const t = e.touches[0]; cb({ clientX: t.x, clientY: t.y }); } }); },
  onMove(canvas, cb) { wx.onTouchMove(e => { if (e.touches.length) { const t = e.touches[0]; cb({ clientX: t.x, clientY: t.y }); } }); },
  onLeave() {},
  onTouchStart(canvas, cb) { wx.onTouchStart(e => { if (e.touches.length) { const t = e.touches[0]; cb({ clientX: t.x, clientY: t.y }); } }); },
  onTouchMove(canvas, cb) { wx.onTouchMove(e => { if (e.touches.length) { const t = e.touches[0]; cb({ clientX: t.x, clientY: t.y }); } }); },

  getItem(key) { return wx.getStorageSync(key) ?? null; },
  setItem(key, val) { wx.setStorageSync(key, val); },

  createAudio() {
    try { return new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  },

  getAudioState(ctx) { return ctx ? ctx.state : 'closed'; },

  requestFrame(cb) { (this._canvas || {}).requestAnimationFrame ? this._canvas.requestAnimationFrame(cb) : setTimeout(cb, 16); },

  vibrate() { wx.vibrateShort({ type: 'medium' }).catch(() => {}); },

  handleResize() {},
};
