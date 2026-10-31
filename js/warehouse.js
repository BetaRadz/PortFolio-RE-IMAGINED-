(() => {
  "use strict";

  /* Shared behaviour (cursor, nav, scroll UI, preloader, tilt/spotlight, ripple) lives in main.js.
     This file only handles the Warehouse data, filtering, modal and uploads. */

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TYPE_ICON = { pdf: 'fa-file-pdf', pptx: 'fa-file-powerpoint', audio: 'fa-file-audio', video: 'fa-file-video', image: 'fa-file-image', other: 'fa-file-zipper' };
  const TYPE_CLASS = { pdf: 'type-pdf', pptx: 'type-pptx', audio: 'type-audio', video: 'type-video', image: 'type-image', other: 'type-other' };
  const TYPE_LABEL = { pdf: 'PDF', pptx: 'PPTX', audio: 'Audio', video: 'Video', image: 'Image', other: 'File' };
  const CATEGORY_TITLE = { pdf: 'PDF Documents', pptx: 'Presentations', audio: 'Audio Files', video: 'Video Files', image: 'Images & Design', other: 'Archives & Other' };

  const FILES = [
    {
      id: 1,
      name: 'Project Proposal.pdf',
      type: 'pdf',
      size: '2.4 MB',
      date: 'Jun 12, 2026',
      desc: 'Full project proposal with timeline, budget estimates, and deliverables.',
      color: '#ef4444'
    },
    {
      id: 2,
      name: 'Research Report Q2.pdf',
      type: 'pdf',
      size: '5.1 MB',
      date: 'Jun 01, 2026',
      desc: 'Quarterly research analysis covering market trends and competitor data.',
      color: '#ef4444'
    },
    {
      id: 3,
      name: 'Contract Draft v3.pdf',
      type: 'pdf',
      size: '0.9 MB',
      date: 'May 28, 2026',
      desc: 'Legal contract draft for client engagement, pending review.',
      color: '#ef4444'
    },
    {
      id: 19,
      name: 'Chemistry.web',
      type: 'other',
      size: '0.1 MB',
      date: 'Jun 22, 2026',
      desc: 'A chemistry comic on atomic structure and classroom storytelling.',
      color: '#ef4444',
      url: 'assets/files/chemistry.html'
    },
    {
      id: 20,
      name: 'Units-Dimensions-Significant-Figures.pdf',
      type: 'pdf',
      size: '0.8 MB',
      date: 'Jun 22, 2026',
      desc: 'Physics presentation on units, dimensions, and significant figures by Adrit Singh.',
      color: '#ef4444',
      url: 'assets/files/physicsss.pdf'
    },
{
      id: 21,
      name: 'APE_Presentation.pdf',
      type: 'pdf',
      size: '0.7 MB',
      date: 'Jun 22, 2026',
      desc: 'English PPT.',
      color: '#ef4444',
      url: 'assets/files/APE_Presentation.pdf'
    },

    {
      id: 4,
      name: 'Product Pitch Deck.pptx',
      type: 'pptx',
      size: '8.3 MB',
      date: 'Jun 15, 2026',
      desc: '60-slide product presentation for investor roadshow.',
      color: '#f59e0b'
    },
    {
      id: 5,
      name: 'Team Workshop Slides.pptx',
      type: 'pptx',
      size: '4.7 MB',
      date: 'Jun 08, 2026',
      desc: 'Interactive workshop materials for the Q2 team retreat.',
      color: '#f59e0b'
    },
    {
      id: 6,
      name: 'Podcast Episode 12.mp3',
      type: 'audio',
      size: '42 MB',
      date: 'Jun 18, 2026',
      desc: 'Full-length podcast episode on modern web development trends.',
      color: '#10b981'
    },
    {
      id: 7,
      name: 'Intro Jingle.mp3',
      type: 'audio',
      size: '3.2 MB',
      date: 'May 20, 2026',
      desc: 'Brand intro music for video projects and presentations.',
      color: '#10b981'
    },
    {
      id: 8,
      name: 'Interview Recording.wav',
      type: 'audio',
      size: '87 MB',
      date: 'Jun 02, 2026',
      desc: 'Raw interview audio from UX research session.',
      color: '#10b981'
    },
    {
      id: 9,
      name: ' Reel 2026.mp4',
      type: 'video',
      size: '215 MB',
      date: 'Jun 20, 2026',
      desc: 'Latest portfolio demo reel showcasing recent projects and skills.',
      color: '#3b82f6'
    },
    {
      id: 10,
      name: 'React Hooks.mp4',
      type: 'video',
      size: '180 MB',
      date: 'Jun 10, 2026',
      desc: 'Full walkthrough of React Hooks patterns for beginners.',
      color: '#3b82f6'
    },
    {
      id: 11,
      name: 'Client Edit.mov',
      type: 'video',
      size: '95 MB',
      date: 'Jun 05, 2026',
      desc: 'Client testimonial video for portfolio and social media use.',
      color: '#3b82f6'
    },
    {
      id: 12,
      name: 'Brand Identity Kit.png',
      type: 'image',
      size: '12 MB',
      date: 'Jun 14, 2026',
      desc: 'Full brand identity including logos, palettes, and typography guidelines.',
      color: '#ec4899'
    },
    {
      id: 13,
      name: 'UI Mockups v2.fig',
      type: 'image',
      size: '28 MB',
      date: 'Jun 09, 2026',
      desc: 'High-fidelity Figma mockups exported for stakeholder review.',
      color: '#ec4899'
    },
    {
      id: 14,
      name: 'Photography Pack.zip',
      type: 'image',
      size: '340 MB',
      date: 'May 30, 2026',
      desc: 'Curated photo pack for blog posts and marketing materials.',
      color: '#ec4899'
    },
    {
      id: 15,
      name: 'Source Code v2.1.zip',
      type: 'other',
      size: '24 MB',
      date: 'Jun 19, 2026',
      desc: 'Compressed source code archive for the e-commerce project release.',
      color: '#8b5cf6'
    },
    {
      id: 16,
      name: 'Assets Bundle.zip',
      type: 'other',
      size: '110 MB',
      date: 'Jun 16, 2026',
      desc: 'Design assets, icons, and illustration bundles.',
      color: '#8b5cf6'
    },
    {
      id: 17,
      name: 'Data Export.xlsx',
      type: 'other',
      size: '1.8 MB',
      date: 'Jun 11, 2026',
      desc: 'Analytics data export from dashboard for June reporting.',
      color: '#06b6d4'
    },
    {
      id: 18,
      name: 'Env Config.json',
      type: 'other',
      size: '0.1 MB',
      date: 'Jun 07, 2026',
      desc: 'Environment configuration file for staging deployment.',
      color: '#9ca3af'
    }
  ];

  let activeFilter = 'all';
  let sortMode = 'recent';
  let searchTerm = '';
  const uploadedFiles = [];
  let lastFocus = null;

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: favourites just won't persist */ } }
  };
  const favorites = new Set(store.get('warehouseFavorites', []));

  const $ = id => document.getElementById(id);
  const searchInput = $('searchInput'), searchClear = $('searchClear'), grid = $('filesGrid'), empty = $('emptyState');
  const modalOverlay = $('modalOverlay'), modalClose = $('modalClose'), modalDownload = $('modalDownload'), modalView = $('modalView'), modalCopyLink = $('modalCopyLink');
  const uploadZone = $('uploadZone'), fileInput = $('fileInput');

  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function parseSize(size) {
    const m = String(size).trim().match(/^([\d.]+)\s*(KB|MB|GB)$/i);
    if (!m) return 0;
    const v = parseFloat(m[1]), u = m[2].toUpperCase();
    return u === 'KB' ? v / 1024 : u === 'MB' ? v : v * 1024;
  }
  function parseDate(str) {
    const m = String(str).trim().match(/^([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})$/);
    if (!m) return new Date(0);
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    return new Date(Number(m[3]), months[m[1]] ?? 0, Number(m[2]));
  }
  const formatSize = mb => (mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`);
  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return formatSize(bytes / 1024 / 1024);
  }

  const keyOf = f => String(f.id || f.name);
  const allFiles = () => [...FILES, ...uploadedFiles].map(f => ({ ...f, favorite: favorites.has(keyOf(f)) }));
  const findFile = id => allFiles().find(f => keyOf(f) === String(id));

  function sortFiles(files) {
    const s = [...files];
    if (sortMode === 'name') s.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortMode === 'size') s.sort((a, b) => parseSize(b.size) - parseSize(a.size));
    else s.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    return s;
  }

  function animateNumber(el, target) {
    if (!el) return;
    if (prefersReducedMotion) { el.textContent = String(target); return; }
    const t0 = performance.now(), dur = 900;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  let statsPlayed = false;
  function renderStats() {
    const files = allFiles();
    const total = files.reduce((n, f) => n + parseSize(f.size), 0);
    const run = () => {
      animateNumber($('statFiles'), files.length);
      animateNumber($('statCategories'), new Set(files.map(f => f.type)).size);
      const sz = $('statSize'); if (sz) sz.textContent = formatSize(total);
    };
    if (!statsPlayed) { statsPlayed = true; setTimeout(run, document.documentElement.classList.contains('skip-preload') ? 200 : 1300); }
    else run();
  }

  function getTypeFromName(name) {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['ppt', 'pptx'].includes(ext)) return 'pptx';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'fig'].includes(ext)) return 'image';
    return 'other';
  }

  function showToast(msg) {
    const toast = $('toast'), m = $('toastMsg');
    if (!toast || !m) return;
    m.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function renderFiles({ animate = true } = {}) {
    if (!grid) return;
    grid.innerHTML = '';
    grid.classList.toggle('no-anim', !animate);

    const q = searchTerm.trim().toLowerCase();
    const files = sortFiles(allFiles()).filter(f =>
      (activeFilter === 'all' || f.type === activeFilter) &&
      (f.name.toLowerCase().includes(q) || (f.desc || '').toLowerCase().includes(q))
    );

    if (!files.length) { if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';

    if (activeFilter === 'all' && !q && sortMode === 'recent') {
      const groups = {};
      files.forEach(f => (groups[f.type] = groups[f.type] || []).push(f));
      let n = 0;
      Object.entries(groups).forEach(([type, group]) => {
        const h = document.createElement('div');
        h.className = 'category-header';
        h.innerHTML = `<i class="fa-solid ${TYPE_ICON[type]}" aria-hidden="true"></i>${CATEGORY_TITLE[type]}<span class="count">${group.length}</span>`;
        grid.appendChild(h);
        group.forEach(file => grid.appendChild(makeCard(file, n++)));
      });
    } else {
      files.forEach((file, i) => grid.appendChild(makeCard(file, i)));
    }
  }

  function makeCard(file, idx) {
    const name = escapeHtml(file.name);
    const card = document.createElement('div');
    card.className = 'file-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${file.name}, ${TYPE_LABEL[file.type]}, ${file.size}. Open details`);
    card.dataset.fileId = keyOf(file);
    card.dataset.tilt = '';
    card.dataset.spot = '';
    card.style.cssText = `--card-color:${/^#[0-9a-f]{3,8}$/i.test(file.color) ? file.color : '#8b5cf6'}; animation-delay:${Math.min(idx, 14) * 0.04}s`;

    card.innerHTML = `
      <div class="file-icon ${TYPE_CLASS[file.type]}"><i class="fa-solid ${TYPE_ICON[file.type]}" aria-hidden="true"></i></div>
      <div class="file-name" title="${name}">${name}</div>
      <div class="file-meta"><span class="file-size">${escapeHtml(file.size)}</span><span class="file-date">${escapeHtml(file.date)}</span></div>
      <div class="file-card-footer">
        <span class="file-type-badge">${TYPE_LABEL[file.type]}</span>
        <div class="file-actions">
          <button class="file-action-btn" title="Preview" data-action="preview" aria-label="Preview ${name}" type="button"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
          <button class="file-action-btn" title="Download" data-action="download" aria-label="Download ${name}" type="button"><i class="fa-solid fa-download" aria-hidden="true"></i></button>
          <button class="file-action-btn ${file.favorite ? 'fav-on' : ''}" title="Favorite" data-action="favorite" aria-label="Favorite ${name}" aria-pressed="${file.favorite}" type="button"><i class="fa-solid fa-star" aria-hidden="true"></i></button>
          <button class="file-action-btn" title="Copy link" data-action="copy" aria-label="Copy link for ${name}" type="button"><i class="fa-solid fa-link" aria-hidden="true"></i></button>
        </div>
      </div>`;

    card.addEventListener('click', e => { if (!e.target.closest('.file-action-btn')) openModal(keyOf(file)); });
    card.addEventListener('keydown', e => {
      if (e.target === card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openModal(keyOf(file)); }
    });
    return card;
  }

  /* ---------- modal ---------- */
  let modalFile = null;
  function openModal(id) {
    const file = findFile(id);
    if (!file) return;
    modalFile = file;
    lastFocus = document.activeElement;

    const icon = $('modalIcon');
    icon.className = `modal-icon ${TYPE_CLASS[file.type]}`;
    icon.innerHTML = `<i class="fa-solid ${TYPE_ICON[file.type]}" aria-hidden="true"></i>`;
    $('modalName').textContent = file.name;
    $('modalType').textContent = TYPE_LABEL[file.type];
    $('modalSize').textContent = file.size;
    $('modalDate').textContent = file.date;
    $('modalDesc').textContent = file.desc || 'No description available.';

    const url = file.url || '';
    if (url) { modalDownload.href = url; modalDownload.setAttribute('download', file.name); }
    else { modalDownload.href = '#'; modalDownload.removeAttribute('download'); }
    if (url) { modalView.href = url; modalView.style.display = 'inline-flex'; }
    else { modalView.href = '#'; modalView.style.display = 'none'; }

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalClose.focus(), 50);
  }
  function closeModal() {
    if (!modalOverlay.classList.contains('open')) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalFile = null;
    lastFocus?.focus?.();
  }
  /* keep keyboard focus inside the dialog while open */
  modalOverlay?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [...modalOverlay.querySelectorAll('a[href], button')].filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  async function copyLink(file) {
    const url = file?.url
      ? new URL(file.url, location.href).href
      : new URL(`warehouse.html?file=${encodeURIComponent(file?.name || '')}`, location.href).href;
    try { await navigator.clipboard.writeText(url); showToast(`Link copied for "${file.name}"`); }
    catch (e) { showToast('Could not copy automatically — copy it from the address bar.'); }
  }

  modalCopyLink?.addEventListener('click', () => modalFile && copyLink(modalFile));
  modalDownload?.addEventListener('click', e => { if (!modalFile?.url) { e.preventDefault(); showToast('This file is a demo item.'); } });
  modalView?.addEventListener('click', e => { if (!modalFile?.url) { e.preventDefault(); showToast('No real file available.'); } });

  /* ---------- toolbar ---------- */
  $('filterBtns')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    activeFilter = btn.dataset.filter;
    renderFiles();
  });
  $('sortSelect')?.addEventListener('change', e => { sortMode = e.target.value; renderFiles(); });
  searchInput?.addEventListener('input', () => {
    searchTerm = searchInput.value;
    searchClear?.classList.toggle('visible', !!searchTerm);
    renderFiles({ animate: false });
  });
  searchClear?.addEventListener('click', () => {
    searchInput.value = ''; searchTerm = '';
    searchClear.classList.remove('visible');
    renderFiles({ animate: false });
    searchInput.focus();
  });

  function setView(list) {
    grid.classList.toggle('list-view', list);
    $('gridView').classList.toggle('active', !list); $('gridView').setAttribute('aria-pressed', String(!list));
    $('listView').classList.toggle('active', list);  $('listView').setAttribute('aria-pressed', String(list));
  }
  $('gridView')?.addEventListener('click', () => setView(false));
  $('listView')?.addEventListener('click', () => setView(true));

  /* ---------- uploads (session-only: files are previewed locally, never sent anywhere) ---------- */
  function addFiles(list) {
    const chosen = [...list];
    if (!chosen.length) return;
    chosen.forEach(file => {
      uploadedFiles.push({
        id: `u-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        type: getTypeFromName(file.name),
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        desc: 'Added from your device for this visit only — it is not uploaded anywhere.',
        color: '#e879d9',
        url: URL.createObjectURL(file)
      });
    });
    renderFiles(); renderStats();
    showToast(`${chosen.length} file${chosen.length > 1 ? 's' : ''} added (this session only)`);
  }
  uploadZone?.addEventListener('click', () => fileInput?.click());
  uploadZone?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput?.click(); } });
  uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
  uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone?.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('drag-over'); addFiles(e.dataTransfer?.files || []); });
  fileInput?.addEventListener('change', () => { addFiles(fileInput.files || []); fileInput.value = ''; });

  /* ---------- card actions ---------- */
  grid?.addEventListener('click', e => {
    const btn = e.target.closest('.file-action-btn');
    if (!btn) return;
    const card = btn.closest('.file-card');
    const file = card && findFile(card.dataset.fileId);
    if (!file) return;
    e.stopPropagation();
    const action = btn.dataset.action;

    if (action === 'preview') return openModal(keyOf(file));
    if (action === 'copy') return copyLink(file);
    if (action === 'download') {
      if (!file.url) return showToast('This file is a demo item.');
      const a = document.createElement('a');
      a.href = file.url; a.download = file.name;
      document.body.appendChild(a); a.click(); a.remove();
      return;
    }
    if (action === 'favorite') {
      const key = keyOf(file), was = favorites.has(key);
      was ? favorites.delete(key) : favorites.add(key);
      store.set('warehouseFavorites', [...favorites]);
      btn.classList.toggle('fav-on', !was);
      btn.setAttribute('aria-pressed', String(!was));
      showToast(was ? 'Removed from favorites' : 'Added to favorites');
    }
  });

  renderStats();
  renderFiles();
})();
