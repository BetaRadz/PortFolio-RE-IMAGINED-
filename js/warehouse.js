(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice =
    window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;

  const TYPE_ICON = {
    pdf: 'fa-file-pdf',
    pptx: 'fa-file-powerpoint',
    audio: 'fa-file-audio',
    video: 'fa-file-video',
    image: 'fa-file-image',
    other: 'fa-file-zipper'
  };

  const TYPE_CLASS = {
    pdf: 'type-pdf',
    pptx: 'type-pptx',
    audio: 'type-audio',
    video: 'type-video',
    image: 'type-image',
    other: 'type-other'
  };

  const TYPE_LABEL = {
    pdf: 'PDF',
    pptx: 'PPTX',
    audio: 'Audio',
    video: 'Video',
    image: 'Image',
    other: 'File'
  };

  const CATEGORY_TITLE = {
    pdf: 'PDF Documents',
    pptx: 'Presentations',
    audio: 'Audio Files',
    video: 'Video Files',
    image: 'Images & Design',
    other: 'Archives & Other',

  };

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
      size: '4.8 MB',
      date: 'Jun 22, 2026',
      desc: 'A chemistry comic on atomic structure and classroom storytelling.',
      color: '#ef4444',
      url: 'assets/files/chemistry.html'
    },
    {
      id: 20,
      name: 'Units-Dimensions-Significant-Figures.pdf',
      type: 'pdf',
      size: '6.1 MB',
      date: 'Jun 22, 2026',
      desc: 'Physics presentation on units, dimensions, and significant figures by Adrit Singh.',
      color: '#ef4444',
      url: 'assets/files/physicsss.pdf'
    },
{
      id: 21,
      name: 'APE_Presentation.pdf',
      type: 'pdf',
      size: '6.1 MB',
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
  let viewMode = 'grid';
  let searchTerm = '';
  let uploadedFiles = [];
  let favorites = new Set(JSON.parse(localStorage.getItem('warehouseFavorites') || '[]'));

  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const grid = document.getElementById('filesGrid');
  const empty = document.getElementById('emptyState');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalDownload = document.getElementById('modalDownload');
  const modalView = document.getElementById('modalView');
  const modalCopyLink = document.getElementById('modalCopyLink');
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const preloader = document.getElementById('preloader');
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');

  function parseSize(size) {
    const m = String(size).trim().match(/^([\d.]+)\s*(KB|MB|GB)$/i);
    if (!m) return 0;
    const value = parseFloat(m[1]);
    const unit = m[2].toUpperCase();
    if (unit === 'KB') return value / 1024;
    if (unit === 'MB') return value;
    return value * 1024;
  }

  function parseDate(dateStr) {
    const m = String(dateStr).trim().match(/^([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})$/);
    if (!m) return new Date(0);
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const month = months[m[1]] ?? 0;
    return new Date(Number(m[3]), month, Number(m[2]));
  }

  function formatSize(mb) {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(1)} MB`;
  }

  function formatFileSize(bytes) {
    const mb = bytes / 1024 / 1024;
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(1)} MB`;
  }

  function allFiles() {
    return [...FILES, ...uploadedFiles].map(file => ({
      ...file,
      favorite: favorites.has(String(file.id || file.name))
    }));
  }

  function sortFiles(files) {
    const sorted = [...files];
    switch (sortMode) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'size':
        sorted.sort((a, b) => parseSize(b.size) - parseSize(a.size));
        break;
      default:
        sorted.sort((a, b) => parseDate(b.date) - parseDate(a.date));
        break;
    }
    return sorted;
  }

  function animateNumber(el, target) {
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }

    el.textContent = '0';
    const duration = 700;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const value = Math.round(target * p);
      el.textContent = String(value);
      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function renderStats() {
    const files = allFiles();
    const types = new Set(files.map(f => f.type));
    const totalSize = files.reduce((sum, f) => sum + parseSize(f.size), 0);

    animateNumber(document.getElementById('statFiles'), files.length);
    animateNumber(document.getElementById('statCategories'), types.size);

    const statSize = document.getElementById('statSize');
    if (statSize) statSize.textContent = formatSize(totalSize);
  }

  function findFile(id) {
    return allFiles().find(f => String(f.id || f.name) === String(id));
  }

  function getTypeFromName(name) {
    const ext = name.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return 'pdf';
    if (['ppt', 'pptx'].includes(ext)) return 'pptx';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'fig'].includes(ext)) return 'image';
    return 'other';
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function getFileUrl(file) {
    return file?.url || '';
  }

  function renderFiles() {
    if (!grid) return;

    grid.innerHTML = '';

    const files = sortFiles(allFiles()).filter(f => {
      const matchFilter = activeFilter === 'all' || f.type === activeFilter;
      const q = searchTerm.toLowerCase();
      const matchSearch =
        f.name.toLowerCase().includes(q) ||
        (f.desc || '').toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });

    if (!files.length) {
      empty && (empty.style.display = 'block');
      return;
    }

    if (empty) empty.style.display = 'none';

    if (activeFilter === 'all' && !searchTerm && sortMode === 'recent') {
      const groups = {};
      files.forEach(f => {
        (groups[f.type] = groups[f.type] || []).push(f);
      });

      Object.entries(groups).forEach(([type, group]) => {
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
          <i class="fa-solid ${TYPE_ICON[type]}"></i>
          ${CATEGORY_TITLE[type]}
          <span style="color:var(--accent2);font-size:0.75rem;margin-left:0.3rem">${group.length}</span>
        `;
        grid.appendChild(header);
        group.forEach((file, idx) => grid.appendChild(makeCard(file, idx)));
      });
    } else {
      files.forEach((file, idx) => grid.appendChild(makeCard(file, idx)));
    }

    applyCardTilt();
  }

  function makeCard(file, idx) {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.dataset.fileId = String(file.id || file.name);
    card.dataset.tilt = 'true';
    card.style.cssText = `--card-color:${file.color}; animation-delay:${idx * 0.04}s`;

    card.innerHTML = `
      <div class="file-icon ${TYPE_CLASS[file.type]}">
        <i class="fa-solid ${TYPE_ICON[file.type]}"></i>
      </div>
      <div class="file-name" title="${file.name}">${file.name}</div>
      <div class="file-meta">
        <span class="file-size">${file.size}</span>
        <span class="file-date">${file.date}</span>
      </div>
      <div class="file-card-footer">
        <span class="file-type-badge">${TYPE_LABEL[file.type]}</span>
        <div class="file-actions">
          <button class="file-action-btn" title="Preview" data-action="preview" aria-label="Preview ${file.name}" type="button">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="file-action-btn" title="Download" data-action="download" aria-label="Download ${file.name}" type="button">
            <i class="fa-solid fa-download"></i>
          </button>
          <button class="file-action-btn ${file.favorite ? 'fav-on' : ''}" title="Favorite" data-action="favorite" aria-label="Favorite ${file.name}" type="button">
            <i class="fa-solid fa-star"></i>
          </button>
          <button class="file-action-btn" title="Copy link" data-action="copy" aria-label="Copy link for ${file.name}" type="button">
            <i class="fa-solid fa-link"></i>
          </button>
        </div>
      </div>
    `;

    card.addEventListener('click', e => {
      if (e.target.closest('.file-action-btn')) return;
      openModal(file.id || file.name);
    });

    return card;
  }

  function openModal(id, e) {
    e?.stopPropagation();

    const file = findFile(id);
    if (!file) return;

    const icon = document.getElementById('modalIcon');
    const name = document.getElementById('modalName');
    const type = document.getElementById('modalType');
    const size = document.getElementById('modalSize');
    const date = document.getElementById('modalDate');
    const desc = document.getElementById('modalDesc');

    if (icon) {
      icon.className = `modal-icon ${TYPE_CLASS[file.type]}`;
      icon.innerHTML = `<i class="fa-solid ${TYPE_ICON[file.type]}"></i>`;
    }

    if (name) name.textContent = file.name;
    if (type) type.textContent = TYPE_LABEL[file.type];
    if (size) size.textContent = file.size;
    if (date) date.textContent = file.date;
    if (desc) desc.textContent = file.desc || 'No description available.';

    const url = getFileUrl(file);

    if (modalDownload) {
      if (url) {
        modalDownload.href = url;
        modalDownload.setAttribute('download', file.name);
      } else {
        modalDownload.href = '#';
        modalDownload.removeAttribute('download');
      }
    }

    if (modalView) {
      if (url) {
        modalView.href = url;
        modalView.target = '_blank';
        modalView.rel = 'noopener';
        modalView.style.display = 'inline-flex';
      } else {
        modalView.href = '#';
        modalView.removeAttribute('target');
        modalView.removeAttribute('rel');
        modalView.style.display = 'none';
      }
    }

    modalOverlay?.classList.add('open');
  }

  function closeModal() {
    modalOverlay?.classList.remove('open');
  }

  function copyLink(e, name) {
    e?.stopPropagation();

    const file = allFiles().find(f => f.name === name);
    const url = file?.url
      ? new URL(file.url, window.location.href).href
      : new URL(`warehouse.html?file=${encodeURIComponent(name)}`, window.location.href).href;

    navigator.clipboard.writeText(url).catch(() => {});
    showToast(`Link copied for "${name}"`);
  }

  function setFavorite(id, on) {
    const key = String(id);
    if (on) favorites.add(key);
    else favorites.delete(key);
    localStorage.setItem('warehouseFavorites', JSON.stringify([...favorites]));
    renderFiles();
    renderStats();
  }

  function applyCardTilt() {
    if (isTouchDevice) return;

    document.querySelectorAll('.file-card[data-tilt="true"]').forEach(card => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 10;
        const rotX = (0.5 - y) * 10;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    navbar?.classList.toggle('scrolled', scrollTop > 50);

    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
    }

    backToTop?.classList.toggle('show', scrollTop > window.innerHeight * 0.6);
  }

  function updateMobileNav() {
    if (window.innerWidth <= 900) {
      document.querySelector('.nav-links')?.classList.remove('open');
      document.getElementById('hamburger')?.classList.remove('open');
    }
  }

  document.getElementById('filterBtns')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderFiles();
  });

  document.getElementById('sortSelect')?.addEventListener('change', e => {
    sortMode = e.target.value;
    renderFiles();
  });

  searchInput?.addEventListener('input', () => {
    searchTerm = searchInput.value;
    searchClear?.classList.toggle('visible', !!searchTerm);
    renderFiles();
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchTerm = '';
    searchClear.classList.remove('visible');
    renderFiles();
  });

  document.getElementById('gridView')?.addEventListener('click', function () {
    viewMode = 'grid';
    this.classList.add('active');
    document.getElementById('listView')?.classList.remove('active');
    document.getElementById('filesGrid')?.classList.remove('list-view');
  });

  document.getElementById('listView')?.addEventListener('click', function () {
    viewMode = 'list';
    this.classList.add('active');
    document.getElementById('gridView')?.classList.remove('active');
    document.getElementById('filesGrid')?.classList.add('list-view');
  });

  uploadZone?.addEventListener('click', () => fileInput?.click());

  uploadZone?.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone?.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone?.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');

    const dropped = [...(e.dataTransfer?.files || [])];
    if (!dropped.length) return;

    dropped.forEach(file => {
      uploadedFiles.push({
        id: `u-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        type: getTypeFromName(file.name),
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }),
        desc: 'Uploaded from your device.',
        color: '#a855f7',
        url: ''
      });
    });

    renderFiles();
    renderStats();
    showToast(`${dropped.length} file(s) added to warehouse`);
  });

  fileInput?.addEventListener('change', () => {
    const chosen = [...(fileInput.files || [])];
    if (!chosen.length) return;

    chosen.forEach(file => {
      uploadedFiles.push({
        id: `u-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        type: getTypeFromName(file.name),
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }),
        desc: 'Uploaded from your device.',
        color: '#a855f7',
        url: ''
      });
    });

    renderFiles();
    renderStats();
    showToast(`${chosen.length} file(s) added to warehouse`);
    fileInput.value = '';
  });

  document.getElementById('filesGrid')?.addEventListener('click', e => {
    const btn = e.target.closest('.file-action-btn');
    if (!btn) return;

    const card = e.target.closest('.file-card');
    if (!card) return;

    const file = findFile(card.dataset.fileId);
    if (!file) return;

    e.stopPropagation();

    const action = btn.dataset.action;
    const url = getFileUrl(file);

    if (action === 'preview') {
      return openModal(file.id || file.name);
    }

    if (action === 'download') {
      if (!url) {
        showToast('This file is a demo item.');
        return;
      }
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    if (action === 'copy') {
      return copyLink(e, file.name);
    }

    if (action === 'favorite') {
      const wasFavorite = favorites.has(String(file.id || file.name));
      setFavorite(file.id || file.name, !wasFavorite);
      showToast(!wasFavorite ? 'Added to favorites' : 'Removed from favorites');
      return;
    }
  });

  modalClose?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', e => {
    if (e.target.id === 'modalOverlay') closeModal();
  });

  modalCopyLink?.addEventListener('click', () => {
    const name = document.getElementById('modalName')?.textContent || '';
    copyLink(null, name);
  });

  modalDownload?.addEventListener('click', e => {
    const name = document.getElementById('modalName')?.textContent || '';
    const file = allFiles().find(f => f.name === name);
    if (!file?.url) {
      e.preventDefault();
      showToast('This file is a demo item.');
    }
  });

  modalView?.addEventListener('click', e => {
    const name = document.getElementById('modalName')?.textContent || '';
    const file = allFiles().find(f => f.name === name);
    if (!file?.url) {
      e.preventDefault();
      showToast('No real file available.');
    }
  });

  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
    document.getElementById('hamburger')?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', updateMobileNav);
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', () => {
    updateScrollUI();
    if (window.innerWidth <= 900) updateMobileNav();
  });

  window.addEventListener('load', () => {
    if (preloader) {
      preloader.classList.add('hide');
      setTimeout(() => preloader.remove(), prefersReducedMotion ? 100 : 700);
    }
  });

  function init() {
    renderStats();
    renderFiles();
    updateScrollUI();
  }

  init();
})();