/*!
 * WheelDropdown — a dropdown that opens in place as a wheel.
 * Part of ui-taste (https://github.com/Oldleeo/ui-taste) · MIT
 * Interaction idea by @omer_assa (ohwow.design). Implementation by Oldlee.
 *
 *   const dd = new WheelDropdown(el, {
 *     items: [{ value:'jp', label:'Japan', icon:'<svg…>' }, …],
 *     value: 'jp',
 *     sound: true,
 *     onChange: (item) => {}
 *   });
 */
(function (root) {
  'use strict';

  const ROW = 44;
  const GEO = { cw: [188, 252], ch: [44, 252], r: [12, 18], caret: [18, 16], icon: [40, 76], tickX: 44, R: 180 };
  const lerp = (a, b, t) => a + (b - a) * t;

  let audio = null;
  function click(strong, volume) {
    try {
      audio = audio || new (root.AudioContext || root.webkitAudioContext)();
      const t = audio.currentTime, len = Math.floor(audio.sampleRate * 0.012);
      const buf = audio.createBuffer(1, len, audio.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
      const src = audio.createBufferSource(); src.buffer = buf;
      const f = audio.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = strong ? 2200 : 3400; f.Q.value = 1.4;
      const g = audio.createGain(); g.gain.value = (strong ? 0.9 : 0.55) * volume;
      src.connect(f).connect(g).connect(audio.destination); src.start(t);
    } catch (e) { /* audio is optional */ }
  }

  class WheelDropdown {
    constructor(el, opts = {}) {
      this.el = el;
      this.items = opts.items || [];
      this.N = this.items.length;
      this.sound = opts.sound !== false;
      this.volume = opts.volume ?? 1;
      this.onChange = opts.onChange || (() => {});
      const startIdx = Math.max(0, this.items.findIndex(i => i.value === opts.value));
      this.pos = this.target = this.sel = startIdx;
      this.o = 0; this.oT = 0; this.open = false;
      this.lastIdx = startIdx;
      this.dpr = root.devicePixelRatio || 1;
      this._build();
      this._bind();
      this._frame = this._frame.bind(this);
      this._render();
      requestAnimationFrame(this._frame);
    }

    get value() { return this.items[this.sel]?.value; }
    set value(v) { const i = this.items.findIndex(x => x.value === v); if (i >= 0) { this.target = this.pos = this.sel = i; this.lastIdx = i; } }

    setSound(on) { this.sound = !!on; }

    _build() {
      this.el.classList.add('wdd');
      if (!this.el.dataset.theme) this.el.dataset.theme = 'light';
      this.el.innerHTML = '';
      const card = this.card = document.createElement('div');
      card.className = 'wdd-card'; card.tabIndex = 0;
      card.setAttribute('role', 'listbox');
      card.setAttribute('aria-label', this.el.getAttribute('aria-label') || 'Select');
      this.cv = document.createElement('canvas'); this.cv.className = 'wdd-ticks';
      this.ctx = this.cv.getContext('2d');
      this.hl = document.createElement('div'); this.hl.className = 'wdd-hl';
      this.caret = document.createElement('div'); this.caret.className = 'wdd-caret';
      this.wheel = document.createElement('div'); this.wheel.className = 'wdd-wheel';
      card.append(this.cv, this.hl, this.caret, this.wheel);
      this.els = this.items.map((it, i) => {
        const d = document.createElement('div');
        d.className = 'wdd-item'; d.setAttribute('role', 'option');
        d.innerHTML = (it.icon ? `<span class="wdd-icon">${it.icon}</span>` : '') + `<span class="wdd-label"></span>`;
        d.querySelector('.wdd-label').textContent = it.label;
        d.addEventListener('click', e => { if (!this.open) return; e.stopPropagation(); this._select(i); });
        this.wheel.appendChild(d); return d;
      });
      this.el.appendChild(card);
    }

    _wrap(v) { return ((v % this.N) + this.N) % this.N; }
    _delta(i, p) { let d = i - this._wrap(p); if (d > this.N / 2) d -= this.N; if (d < -this.N / 2) d += this.N; return d; }
    _arcX(y) { const c = Math.min(Math.abs(y), GEO.R - 1); return GEO.R - Math.sqrt(GEO.R * GEO.R - c * c); }

    _render() {
      const o = this.o, W = lerp(GEO.cw[0], GEO.cw[1], o), H = lerp(GEO.ch[0], GEO.ch[1], o), c = this.card;
      c.style.width = W + 'px'; c.style.height = H + 'px';
      c.style.marginLeft = (-W / 2) + 'px'; c.style.marginTop = (-H / 2) + 'px';
      c.style.borderRadius = lerp(GEO.r[0], GEO.r[1], o) + 'px';
      this.caret.style.left = lerp(GEO.caret[0], GEO.caret[1], o) + 'px';
      const fx = lerp(GEO.icon[0], GEO.icon[1], o);
      this.hl.style.left = (fx - 17) + 'px'; this.hl.style.opacity = o;
      this.hl.style.transform = `scaleY(${lerp(0.7, 1, o)})`;

      this.els.forEach((el, i) => {
        const d = this._delta(i, this.pos), ad = Math.abs(d), y = d * ROW * lerp(0.6, 1, o);
        const x = fx + this._arcX(d * ROW) * o;
        let op = ad < 0.5 ? 1 : Math.max(0, 1 - (ad - 0.5) * 0.33) * o * o;
        if (ad > 2.75) op = 0;
        const blur = Math.max(0, ad - 1.6) * 1.4 * o + (ad >= 0.5 ? (1 - o) * 3 : 0);
        el.style.transform = `translate(${x}px,${y}px)`;
        el.style.opacity = op;
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
        el.style.pointerEvents = (o < 0.9 || ad > 2.4) ? 'none' : '';
        el.classList.toggle('is-center', ad < 0.5);
        el.setAttribute('aria-selected', ad < 0.5);
      });

      const dpr = this.dpr, cv = this.cv, ctx = this.ctx;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      if (o > 0.01) {
        const ink = this._ink || (this._ink = getComputedStyle(this.el).getPropertyValue('--wdd-ink').trim() || '#111');
        const rgb = ink.startsWith('#') && ink.length === 7 ? [1, 3, 5].map(k => parseInt(ink.slice(k, k + 2), 16)).join(',') : '0,0,0';
        const mid = H / 2, per = 3, frac = this.pos * per;
        ctx.lineWidth = 1.2; ctx.lineCap = 'round';
        for (let k = Math.floor(frac) - 30; k <= Math.ceil(frac) + 30; k++) {
          const yy = (k - frac) / per * ROW; if (Math.abs(yy) > mid + 6) continue;
          const ang = Math.asin(Math.max(-1, Math.min(1, yy / GEO.R)));
          const x = GEO.tickX + GEO.R - GEO.R * Math.cos(ang), y = mid + yy;
          const fade = Math.max(0, 1 - Math.pow(Math.abs(yy) / (mid + 6), 2.2));
          ctx.strokeStyle = `rgba(${rgb},${(0.42 * fade + 0.05) * o})`;
          const L = 6, ux = Math.cos(ang), uy = Math.sin(ang);
          ctx.beginPath(); ctx.moveTo(x + ux * L / 2, y - uy * L / 2); ctx.lineTo(x - ux * L / 2, y + uy * L / 2); ctx.stroke();
        }
      }
      const ci = Math.round(this.pos);
      if (ci !== this.lastIdx) { if (this.open && this.sound) click(false, this.volume); this.lastIdx = ci; }
    }

    _frame() {
      const dp = this.target - this.pos; this.pos += dp * 0.2; if (Math.abs(dp) < 0.001) this.pos = this.target;
      const dOpen = this.oT - this.o; this.o += dOpen * 0.16; if (Math.abs(dOpen) < 0.002) this.o = this.oT;
      if (dp !== 0 || dOpen !== 0 || this._dirty) { this._render(); this._dirty = false; }
      requestAnimationFrame(this._frame);
    }

    _setOpen(v) {
      this.open = v; this.oT = v ? 1 : 0; this.card.classList.toggle('is-open', v);
      this.card.setAttribute('aria-expanded', v);
      if (v) { this._ink = null; if (this.sound) click(true, this.volume); this.card.focus({ preventScroll: true }); }
    }

    _select(i) {
      const d = this._delta(i, this.target); this.target = Math.round(this.target + d); this.sel = this._wrap(this.target);
      this.onChange(this.items[this.sel]);
      setTimeout(() => { this._setOpen(false); if (this.sound) click(true, this.volume); }, 200);
    }

    _bind() {
      const c = this.card;
      c.addEventListener('click', () => { if (!this.open) this._setOpen(true); });
      document.addEventListener('click', e => { if (this.open && !c.contains(e.target)) this._select(this._wrap(Math.round(this.target))); });
      let snap;
      c.addEventListener('wheel', e => {
        if (!this.open) return; e.preventDefault();
        if (Math.abs(e.deltaY) >= 50) this.target = Math.round(this.target) + Math.sign(e.deltaY);
        else { this.target += e.deltaY / ROW; clearTimeout(snap); snap = setTimeout(() => { this.target = Math.round(this.target); }, 100); }
      }, { passive: false });
      let dragY = null, start = 0, moved = false;
      c.addEventListener('pointerdown', e => { if (!this.open) return; dragY = e.clientY; start = this.target; moved = false; });
      root.addEventListener('pointermove', e => { if (dragY === null) return; const dy = e.clientY - dragY; if (Math.abs(dy) > 3) moved = true; this.target = start - dy / ROW; });
      root.addEventListener('pointerup', () => { if (dragY === null) return; dragY = null; this.target = Math.round(this.target); });
      c.addEventListener('click', e => { if (moved) { e.stopPropagation(); moved = false; } }, true);
      c.addEventListener('keydown', e => {
        if (!this.open) { if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); this._setOpen(true); } return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); this.target = Math.round(this.target) + 1; }
        else if (e.key === 'ArrowUp') { e.preventDefault(); this.target = Math.round(this.target) - 1; }
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._select(this._wrap(Math.round(this.target))); }
        else if (e.key === 'Escape') { this.target = this.sel; this._setOpen(false); }
      });
      if (root.matchMedia) root.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { this._ink = null; this._dirty = true; });
    }
  }

  root.WheelDropdown = WheelDropdown;
  if (typeof module !== 'undefined' && module.exports) module.exports = WheelDropdown;
})(typeof window !== 'undefined' ? window : globalThis);
