const UI = {
  _btns: [],

  roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  },

  button(ctx, x, y, w, h, text, options) {
    const o = options || {};
    const id = o.id || '';
    const r = o.r || 10;
    const fg = o.fg || '#fff';
    const fs = o.fs || 15;
    const shadow = o.shadow || '';
    if (shadow) { ctx.shadowColor = shadow; ctx.shadowBlur = 14; }
    if (o.linearColors) {
      const g = ctx.createLinearGradient(x, y, x, y + h);
      g.addColorStop(0, o.linearColors[0]);
      g.addColorStop(1, o.linearColors[1]);
      this.roundRect(ctx, x, y, w, h, r, g);
    } else {
      this.roundRect(ctx, x, y, w, h, r, o.bg || 'rgba(255,255,255,0.06)', o.border || '');
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = fg;
    ctx.font = `bold ${fs}px Arial,sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2 + 1);
    if (id) this._btns.push({ id, x, y, w, h });
    return { x, y, w, h };
  },

  popupBg(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, W, H);
  },

  timer(ctx, timeLeft) {
    const intP = Math.max(0, Math.floor(timeLeft));
    const fracP = String(Math.floor((Date.now() / 10) % 100)).padStart(2, '0');
    const txt = `${intP}.${fracP}`;
    ctx.save();
    ctx.shadowColor = 'rgba(255,0,0,0.8)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#ff2222';
    ctx.font = 'bold 56px DS-Digital,Courier New,monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, W / 2, 96);
    ctx.restore();
  },

  hud(ctx, cutCount, totalCount, mlv, totalLv, stg, totalSt) {
    const txt = `第 ${mlv+1}/${totalLv} 大关 — 第 ${stg+1}/${totalSt} 小关 ✂ ${cutCount}/${totalCount} 条双红线`;
    const pad = 10, r2 = 10;
    ctx.save();
    ctx.font = 'bold 14px Arial,sans-serif';
    const m = ctx.measureText(txt);
    const bw = m.width + pad * 2, bh = 22;
    const bx = W / 2 - bw / 2, by = 50;
    this.roundRect(ctx, bx, by, bw, bh, r2, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = '#ffcc44';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 4;
    ctx.fillText(txt, W / 2, by + bh / 2);
    ctx.restore();
  },

  tutorial(ctx, show) {
    if (!show) return;
    this.popupBg(ctx);
    const cw = 280, ch = 320;
    const bx = W / 2 - cw / 2, by = H / 2 - ch / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(20,18,26,0.95)';
    this.roundRect(ctx, bx, by, cw, ch, 18, 'rgba(20,18,26,0.95)', 'rgba(255,255,255,0.1)');
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Arial,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔍 拆弹规则', W / 2, by + 30);
    const lines = [
      '每条电线连接左右两个指示灯', '',
      '⚫⚫ 两端都是红灯（双红线）', '→ 必须剪断', '',
      '⚫○ 有一边是绿灯', '→ 不要剪，剪错会爆炸', '',
      '在时间内剪完所有双红线 → 过关',
    ];
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '14px Arial,sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let ly = by + 58;
    for (const l of lines) {
      if (l.startsWith('→')) { ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.6)'; }
      else if (l.includes('⚫⚫')) { ctx.fillStyle = '#ff5555'; }
      else if (l.includes('⚫○')) { ctx.fillStyle = '#55dd77'; }
      else { ctx.fillStyle = 'rgba(255,255,255,0.78)'; }
      ctx.fillText(l, bx + 28, ly);
      ly += (l === '' ? 10 : 22);
    }
    ctx.restore();
    const btnY = by + ch - 56;
    this.button(ctx, bx + 20, btnY, cw - 40, 40, '开始拆弹！', { id: 'tutorial_start', r: 12, fs: 16, linearColors: ['#ee4455','#bb2233'], shadow: 'rgba(255,50,50,0.35)' });
  },

  victory(ctx, starsCount) {
    this.popupBg(ctx);
    const cw = 280, ch = 240;
    const bx = W / 2 - cw / 2, by = H / 2 - ch / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(20,18,26,0.95)';
    this.roundRect(ctx, bx, by, cw, ch, 20, 'rgba(20,18,26,0.95)', 'rgba(255,255,255,0.1)');
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 22px Arial,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏆 恭喜通关！', W / 2, by + 36);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '13px Arial,sans-serif';
    ctx.fillText(`已完成全部 ${TOTAL_LV} 大关`, W / 2, by + 64);
    ctx.fillStyle = '#ffdd44';
    ctx.font = '15px Arial,sans-serif';
    ctx.fillText(`⭐ 总星数: ${starsCount} / ${TOTAL_LV * TOTAL_ST * 3}`, W / 2, by + 96);
    ctx.restore();
    this.button(ctx, bx + 15, by + 122, cw / 2 - 20, 40, '🔄 再来一次', { id: 'victory_retry', r: 12, fs: 14, linearColors: ['#ee4455','#bb2233'], shadow: 'rgba(255,50,50,0.3)' });
    this.button(ctx, bx + cw / 2 + 5, by + 122, cw / 2 - 20, 40, '🏠 返回菜单', { id: 'victory_menu', r: 12, fs: 14, bg: 'rgba(255,255,255,0.08)', fg: 'rgba(255,255,255,0.7)', border: 'rgba(255,255,255,0.1)' });
  },

  settings(ctx, show, sOn, vOn, cb, vol) {
    if (!show) return;
    this.popupBg(ctx);
    const cw = 260, ch = 270;
    const bx = W / 2 - cw / 2, by = H / 2 - ch / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(20,18,26,0.92)';
    this.roundRect(ctx, bx, by, cw, ch, 18, 'rgba(20,18,26,0.92)', 'rgba(255,255,255,0.08)');
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 17px Arial,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('设 置', W / 2, by + 24);
    ctx.restore();
    const rows = [
      { label: '静音', id: 'mute_btn', val: sOn ? '🔊' : '🔇' },
      { label: '震动', id: 'vibrate_btn', val: vOn ? '📳' : '📴' },
      { label: '色盲模式', id: 'cb_btn', val: cb ? '♿' : '🎨' },
    ];
    const rY = by + 52;
    rows.forEach((r, i) => {
      const ry = rY + i * 44;
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(bx + 20, ry + 42, cw - 40, 1);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '14px Arial,sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(r.label, bx + 28, ry + 20);
      this.button(ctx, bx + cw - 68, ry + 4, 40, 32, r.val, { id: r.id, r: 8, bg: 'rgba(255,255,255,0.06)', fg: '#fff', fs: 16, border: 'rgba(255,255,255,0.08)' });
      ctx.restore();
    });
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(bx + 20, rY + 134, cw - 40, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '14px Arial,sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('音量', bx + 28, rY + 156);
    const slX = bx + cw - 120, slY = rY + 144, slW = 92, slH = 4;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    this.roundRect(ctx, slX, slY, slW, slH, 2, 'rgba(255,255,255,0.15)');
    const thumbX = slX + slW * vol;
    ctx.fillStyle = '#ff4444';
    ctx.beginPath(); ctx.arc(thumbX, slY + slH / 2, 7, 0, 6.28); ctx.fill();
    ctx.restore();
    this.button(ctx, bx + 20, by + ch - 52, cw - 40, 36, '退 出 游 戏', { id: 'quit_btn', r: 10, fs: 14, bg: 'rgba(200,30,30,0.2)', fg: 'rgba(255,80,80,0.8)', border: 'rgba(200,30,30,0.3)' });
  },

  settingsBtn(ctx) {
    const bx = 14, by = 14, bw = 38, bh = 38, r = 10;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.roundRect(ctx, bx, by, bw, bh, r, 'rgba(0,0,0,0.5)', 'rgba(255,255,255,0.12)');
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '19px Arial,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔧', bx + bw / 2, by + bh / 2 + 1);
    this._btns.push({ id: 'settings', x: bx, y: by, w: bw, h: bh });
    ctx.restore();
  },

  hitTest(x, y) {
    for (let i = this._btns.length - 1; i >= 0; i--) {
      const b = this._btns[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.id;
    }
    return null;
  },
};
