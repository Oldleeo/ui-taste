/*!
 * GlassFolders — frosted-glass folders that hold cards.
 * Part of ui-taste (https://github.com/Oldleeo/ui-taste) · MIT
 * Interaction idea by VG Studio (Xiaohongshu, 「当卡片可以收纳」). Implementation by Oldlee.
 *
 *   new GlassFolders(el, {
 *     folders: [{
 *       title: 'Selected work', meta: null,        // meta defaults to "N items"
 *       theme: 'frost' | 'light' | 'dark',
 *       cover: 'css background for the back panel',
 *       action: 'add' | 'menu' | null,
 *       align: 'left' | 'right',
 *       cards: [{ title:'AURORA', sub:'极光冥想', bg:'css background' }, { title:'Price list.pdf', sub:'PDF · 480 KB', doc:true }]
 *     }],
 *     onChange: (event, folderIndex, folder) => {}
 *   });
 */
(function (root) {
  'use strict';

  const BACK = 'M0,54 Q0,34 20,34 L136,34 C156,34 160,0 184,0 L320,0 Q340,0 340,20 L340,252 Q340,272 320,272 L20,272 Q0,272 0,252 Z';
  const FRONT = 'M0,18 Q0,0 18,0 L114,0 C136,0 140,32 164,32 L322,32 Q340,32 340,50 L340,178 Q340,196 322,196 L18,196 Q0,196 0,178 Z';
  const ICON_ADD = '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const ICON_MORE = '<svg width="32" height="14" viewBox="0 0 32 14"><g fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="7" r="4.2"/><circle cx="16" cy="7" r="4.2"/><circle cx="26" cy="7" r="4.2"/></g></svg>';
  const NEW_PAPER = 'linear-gradient(180deg,#fff,#f1f1f1)';

  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  class GlassFolders {
    constructor(host, opts = {}) {
      this.host = host;
      this.opts = opts;
      this.onChange = opts.onChange || (() => {});
      this.folders = (opts.folders || []).map(f => ({ ...f, cards: (f.cards || []).slice() }));
      this.views = [];
      this.untitled = 0;
      host.classList.add('gf');
      this.folders.forEach((f, i) => this._mount(f, i));
      this._onDoc = e => { if (!this.host.contains(e.target)) this.closeAll(); };
      document.addEventListener('pointerdown', this._onDoc);
      this._onKey = e => { if (e.key === 'Escape') this.closeAll(); };
      document.addEventListener('keydown', this._onKey);
    }

    _mount(f, i) {
      const theme = f.theme || 'frost';
      const node = el('div', 'gf-folder');
      node.dataset.theme = theme;
      node.dataset.align = f.align || 'left';
      node.tabIndex = 0;
      node.setAttribute('role', 'button');
      node.setAttribute('aria-expanded', 'false');

      const strokeBack = theme === 'dark' ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.55)';
      const strokeFront = theme === 'dark' ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.9)';

      node.innerHTML = `
        <div class="gf-shadow"></div>
        <div class="gf-back"></div>
        <svg class="gf-back-line" viewBox="0 0 340 272" width="340" height="272"><path d="${BACK}" fill="none" stroke="${strokeBack}" stroke-width="1"/></svg>
        <div class="gf-cards"></div>
        <div class="gf-front">
          <div class="gf-glass"></div>
          <svg class="gf-front-line" viewBox="0 0 340 196" width="340" height="196">
            <defs><linearGradient id="gfl${i}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="${strokeFront}"/><stop offset=".6" stop-color="${strokeFront}" stop-opacity=".25"/><stop offset="1" stop-color="${strokeFront}" stop-opacity=".6"/>
            </linearGradient></defs>
            <path d="${FRONT}" fill="none" stroke="url(#gfl${i})" stroke-width="1.2"/>
          </svg>
          <div class="gf-label"><div class="gf-title">${esc(f.title || 'Untitled')}</div><div class="gf-meta"></div></div>
        </div>`;

      node.querySelector('.gf-back').style.background = f.cover || '#ddd';
      const front = node.querySelector('.gf-front');
      const v = { node, front, cardsEl: node.querySelector('.gf-cards'), meta: node.querySelector('.gf-meta'),
        title: node.querySelector('.gf-title'), cards: [], open: false, menu: null };

      if (f.action) {
        const btn = el('button', 'gf-btn ' + (f.action === 'add' ? 'is-dark' : 'is-light'), f.action === 'add' ? ICON_ADD : ICON_MORE);
        btn.type = 'button';
        btn.setAttribute('aria-label', f.action === 'add' ? 'Add a card' : 'More');
        btn.addEventListener('click', e => { e.stopPropagation(); f.action === 'add' ? this.add(i) : this.toggleMenu(i); });
        btn.addEventListener('pointerdown', e => e.stopPropagation());
        front.appendChild(btn);
        if (f.action === 'menu') {
          const menu = el('div', 'gf-menu');
          menu.setAttribute('role', 'menu');
          [['close', 'Close folder'], ['rename', 'Rename'], ['share', 'Share…'], ['trash', 'Move to Trash']].forEach(([k, label]) => {
            const b = el('button', k === 'trash' ? 'is-danger' : '', label);
            b.type = 'button'; b.setAttribute('role', 'menuitem');
            b.addEventListener('click', e => { e.stopPropagation(); this._menuAction(i, k); });
            menu.appendChild(b);
          });
          menu.addEventListener('pointerdown', e => e.stopPropagation());
          node.appendChild(menu);
          v.menu = menu;
        }
      }

      f.cards.forEach(c => v.cards.push(this._card(c, v.cardsEl)));

      node.addEventListener('pointerenter', () => { node.classList.add('is-hover'); this._layout(i); });
      node.addEventListener('pointerleave', () => { node.classList.remove('is-hover'); front.style.setProperty('--ry', '0deg'); this._layout(i); });
      node.addEventListener('pointermove', e => {
        const r = node.getBoundingClientRect();
        front.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 6).toFixed(2) + 'deg');
      });
      node.addEventListener('click', () => { if (v.title.isContentEditable) return; this.toggle(i); });
      node.addEventListener('keydown', e => {
        if (e.target !== node) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(i); }
      });

      this.host.appendChild(node);
      this.views[i] = v;
      this._meta(i);
      this._layout(i, true);
    }

    _card(c, parent) {
      const n = el('div', 'gf-card' + (c.doc ? ' is-doc' : ''));
      n.innerHTML = `<span class="gf-card-t">${esc(c.title || '')}</span><span class="gf-card-s">${esc(c.sub || '')}</span>` +
        (c.doc ? '<div class="gf-doc-lines"><i></i><i></i><i></i><i></i></div>' : '');
      if (!c.doc) n.style.background = c.bg || '#222';
      else if (c.bg) n.style.background = c.bg;
      parent.appendChild(n);
      return n;
    }

    _meta(i) {
      const f = this.folders[i], v = this.views[i];
      v.meta.textContent = f.meta || `${f.cards.length} item${f.cards.length === 1 ? '' : 's'}`;
    }

    _layout(i, instant) {
      const v = this.views[i], n = v.cards.length;
      const hover = v.node.classList.contains('is-hover');
      v.cards.forEach((c, k) => {
        let x, y, r;
        if (v.open) {
          const t = n > 1 ? k / (n - 1) : 1;
          x = -34 + 30 * t; y = -150 + 78 * t; r = -9 + 9 * t;
        } else {
          const d = n - 1 - k;                // 0 = front-most
          x = (k % 2 ? 1 : -1) * 2; y = hover ? 8 - d * 7 : 48 - d * 2; r = hover ? (k % 2 ? .8 : -.8) : 0;
        }
        if (instant) c.style.transition = 'none';
        c.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`;
        c.style.transitionDelay = v.open ? `${(n - 1 - k) * 35}ms` : `${k * 18}ms`;
        if (instant) { c.offsetWidth; c.style.transition = ''; }
      });
    }

    toggle(i) { this.views[i].open ? this.close(i) : this.open(i); }

    open(i) {
      this.views.forEach((_, k) => { if (k !== i) this.close(k); });
      const v = this.views[i];
      if (v.open) return;
      v.open = true; v.node.classList.add('is-open'); v.node.setAttribute('aria-expanded', 'true');
      this._layout(i); this.onChange('open', i, this.folders[i]);
    }

    close(i) {
      const v = this.views[i];
      if (!v) return;
      this._hideMenu(i);
      if (v.title.isContentEditable) this._endRename(i);
      if (!v.open) return;
      v.open = false; v.node.classList.remove('is-open'); v.node.setAttribute('aria-expanded', 'false');
      this._layout(i); this.onChange('close', i, this.folders[i]);
    }

    closeAll() { this.views.forEach((_, i) => this.close(i)); }

    add(i, card) {
      const f = this.folders[i], v = this.views[i];
      const c = card || { title: `Untitled ${f.cards.length + 1}`, sub: 'Just now', doc: true, bg: NEW_PAPER };
      f.cards.push(c);
      const n = this._card(c, v.cardsEl);
      v.cards.push(n);
      n.style.transition = 'none';
      n.style.transform = 'translate(0,-260px) rotate(-5deg)';
      n.style.opacity = '0';
      n.offsetWidth;
      n.style.transition = 'transform .5s cubic-bezier(.55,0,.75,.2), opacity .2s';
      n.style.opacity = '1';
      this._layout(i);
      n.style.transitionDelay = '0ms';
      clearTimeout(v._sink);
      v._sink = setTimeout(() => {
        n.style.transition = '';
        v.node.classList.remove('is-sink'); v.node.offsetWidth; v.node.classList.add('is-sink');
        this._meta(i);
      }, 430);
      this.onChange('add', i, f);
    }

    toggleMenu(i) {
      const v = this.views[i];
      if (!v.menu) return;
      if (v.menu.classList.contains('is-on')) return this._hideMenu(i);
      this.views.forEach((_, k) => k !== i && this.close(k));
      if (!v.open) this.open(i);
      v.menu.classList.add('is-on');
      v.menu.querySelector('button').focus({ preventScroll: true });
    }

    _hideMenu(i) { const m = this.views[i] && this.views[i].menu; if (m) m.classList.remove('is-on'); }

    _menuAction(i, k) {
      const v = this.views[i];
      this._hideMenu(i);
      if (k === 'close') this.close(i);
      else if (k === 'rename') this._startRename(i);
      else if (k === 'share') {
        const url = location.href.split('#')[0];
        if (navigator.share) navigator.share({ title: this.folders[i].title, url }).catch(() => {});
        else if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
        this.onChange('share', i, this.folders[i]);
      } else if (k === 'trash') {
        this.close(i);
        v.node.classList.add('is-trashed');
        this.onChange('trash', i, this.folders[i]);
      }
    }

    restore(i) { this.views[i].node.classList.remove('is-trashed'); this.onChange('restore', i, this.folders[i]); }

    _startRename(i) {
      const v = this.views[i];
      v.title.contentEditable = 'true';
      v.title.focus();
      const r = document.createRange(); r.selectNodeContents(v.title);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      v._rk = e => { e.stopPropagation(); if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); if (e.key === 'Escape') v.title.textContent = this.folders[i].title; this._endRename(i); } };
      v.title.addEventListener('keydown', v._rk);
      v.title.addEventListener('blur', v._rb = () => this._endRename(i));
      v.title.addEventListener('click', v._rc = e => e.stopPropagation());
    }

    _endRename(i) {
      const v = this.views[i];
      if (!v.title.isContentEditable) return;
      v.title.contentEditable = 'false';
      v.title.removeEventListener('keydown', v._rk);
      v.title.removeEventListener('blur', v._rb);
      v.title.removeEventListener('click', v._rc);
      const t = v.title.textContent.trim() || this.folders[i].title;
      v.title.textContent = t; this.folders[i].title = t;
      this.onChange('rename', i, this.folders[i]);
    }

    destroy() {
      document.removeEventListener('pointerdown', this._onDoc);
      document.removeEventListener('keydown', this._onKey);
      this.host.innerHTML = ''; this.host.classList.remove('gf');
    }
  }

  root.GlassFolders = GlassFolders;
})(typeof window !== 'undefined' ? window : this);
