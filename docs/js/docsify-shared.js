var HUB_ORIGIN = 'https://chris-peterson.github.io';

var GISCUS_ORIGIN = 'https://giscus.app';

// The widget renders inside an iframe served by giscus.app, so a theme it loads
// has to be fetchable from there — a dev server on loopback isn't. These stay on
// the hub's origin for that reason, unlike everything else that goes through
// localAssetOrigin(): a local edit to them shows up only once it's deployed.
var GISCUS_THEMES = {
  dark: HUB_ORIGIN + '/css/giscus-dracula.css',
  light: HUB_ORIGIN + '/css/giscus-alucard.css'
};

var ICONS = {
  bars: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="18" height="18" style="fill:var(--theme-icon-color);stroke:var(--theme-icon-color)" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="18" height="18" style="fill:var(--theme-icon-color);stroke:var(--theme-icon-color)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  github: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>',
  toggleSun: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  toggleMoon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  blog: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4a1 1 0 0 1 1-1h13v18H6a1 1 0 0 1-1-1z"/><path d="M9 7h6M9 11h6M9 15h3"/></svg>'
};

// The blog lives on the hub, under this route. The titlebar link, the sidebar
// nav, and each post's chrome key off it.
var BLOG_ROOT = '/blog/';

var POST_ROUTE = new RegExp('^' + BLOG_ROOT + '(\\d{4})-(\\d{2})-(\\d{2})-');

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

var PLUGIN_CATALOG = {
  mermaid: [
    { src: 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js' },
    { fn: function () {
        mermaid.initialize({ startOnLoad: false, theme: document.documentElement.style.colorScheme === 'light' ? 'default' : 'dark' });
      } },
    { src: 'https://cdn.jsdelivr.net/npm/docsify-mermaid@2/dist/docsify-mermaid.js' }
  ],
  footnotes: [
    { src: 'https://cdn.jsdelivr.net/npm/@sy-records/docsify-footnotes@2/dist/index.min.js' }
  ]
};

// --- Public init ---

// Where the shared assets (theme CSS, projects.yml) come from: relative on the
// hub itself and on a dev server, the hub's origin from a project sub-site.
//
// Loopback has three spellings and a dev server may be on any of them, so this
// tests all of them rather than `hostname === 'localhost'`: served from
// 127.0.0.1, a local edit to theme.css would silently load the deployed one
// instead, and the page looks untouched with nothing to say why.
function localAssetOrigin() {
  var loopback = ['localhost', '127.0.0.1', '[::1]', '::1'];
  return window.location.origin === HUB_ORIGIN ||
    loopback.indexOf(window.location.hostname) !== -1 ? '' : HUB_ORIGIN;
}

function initProject(config) {
  window.$docsify = window.$docsify || {};
  var org = HUB_ORIGIN.replace('https://', '').replace('.github.io', '');
  config.site_url = HUB_ORIGIN + '/' + config.name;
  var isHub = config.name === org;
  var sidebarMode = isHub && new URLSearchParams(window.location.search).get('mode') === 'sidebar';
  config.repo_source = isHub ? 'https://github.com/' + org : 'https://github.com/' + org + '/' + config.name;
  var defaults = {
    loadSidebar: true,
    subMaxLevel: 2,
    auto2top: true,
    topMargin: 64, // titlebar is position:fixed at 52px; keeps deep-linked anchors below it
    coverpage: false,
    notFoundPage: true,
    relativePath: false,
    // Nested pages share the root sidebar. The blog keeps its own generated
    // post list, which it opts out with by aliasing to itself: docsify takes the
    // first matching key and stops once a rewrite leaves the path alone.
    alias: {
      '/blog/_sidebar.md': '/blog/_sidebar.md',
      '/.*/_sidebar.md': '/_sidebar.md'
    },
    // The hub's sidebar earns its width on some routes and not others, so CSS
    // decides per route (initBlogChrome). docsify's own flag would rip the
    // sidebar out of the DOM on first render, with no way back for the next one.
    hideSidebar: false,
    search: {
      placeholder: 'Search...',
      noData: 'No results',
      paths: 'auto'
    },
    'flexible-alerts': {
      style: 'callout'
    }
  };
  Object.keys(defaults).forEach(function(key) {
    if (!(key in window.$docsify)) {
      window.$docsify[key] = defaults[key];
    }
  });

  var cssOrigin = localAssetOrigin();
  [
    'https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.min.css',
    'https://cdn.jsdelivr.net/npm/prism-themes@1/themes/prism-dracula.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    cssOrigin + '/css/theme.css',
    cssOrigin + '/css/titlebar.css'
  ].forEach(function(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });

  // Stub window.Docsify so flexible-alerts can read the version before core loads.
  // Docsify core overwrites this with the real object on load.
  // Plugin catalog items must load BEFORE docsify core so their hooks are
  // registered in time for the initial page render.
  var steps = [
    { fn: function () { window.Docsify = { version: '4.0.0' }; } },
    { src: 'https://cdn.jsdelivr.net/npm/docsify-plugin-flexible-alerts' },
    { src: 'https://cdn.jsdelivr.net/npm/docsify-copy-code@2' }
  ];

  (config.plugins || []).forEach(function(name) {
    if (PLUGIN_CATALOG[name]) {
      steps = steps.concat(PLUGIN_CATALOG[name]);
    }
  });

  if ((config.plugins || []).indexOf('mermaid') !== -1) {
    window.$docsify.mermaidConfig = { querySelector: '.mermaid' };
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
      hook.doneEach(function() {
        document.querySelectorAll('.mermaid').forEach(function(el) {
          if (!el.getAttribute('data-source') && el.textContent && !el.querySelector('svg')) {
            el.setAttribute('data-source', el.textContent.trim());
          }
        });
      });
      // Deep-link re-scroll: docsify snapshots the target's position before
      // mermaid renders, so a ?id= anchor below a diagram lands short (the
      // diagram expands above it after the snapshot; topMargin can't help
      // because the target moved). Once every .mermaid has produced an <svg>
      // (layout settled), scroll to the target once with the topMargin offset.
      // One-shot after async render -- not a per-reflow observer.
      hook.doneEach(function() {
        var m = (location.hash || '').match(/[?&]id=([^&]+)/);
        if (!m) return;
        var id = decodeURIComponent(m[1]);
        var tries = 0, lastY = -1, stableFor = 0;
        (function settle() {
          var pending = Array.prototype.slice
            .call(document.querySelectorAll('.mermaid'))
            .some(function(x) { return !x.querySelector('svg'); });
          var el = document.getElementById(id);
          var y = window.pageYOffset;
          // Correct only once mermaid has rendered (layout final) AND docsify's
          // own scroll tween has settled (scrollY unchanged a few frames) --
          // otherwise the tween finishes after us and overrides the correction.
          if (el && !pending) {
            stableFor = (y === lastY) ? stableFor + 1 : 0;
            if (stableFor >= 3) {
              window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - (window.$docsify.topMargin || 0));
              return;
            }
          }
          lastY = y;
          if (tries++ < 180) requestAnimationFrame(settle);
        })();
      });
    });
  }

  steps = steps.concat([
    { src: 'https://cdn.jsdelivr.net/npm/docsify@4' },
    !isHub && { src: 'https://cdn.jsdelivr.net/npm/docsify@4/lib/plugins/search.min.js' }
  ].filter(Boolean));

  (config.code_languages || []).forEach(function(lang) {
    steps.push({ src: 'https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-' + lang + '.min.js' });
  });

  buildTitlebarDOM(config);
  initTheme();
  if (!isHub || sidebarMode) initSearch();
  initProjectCards();
  initComments(config.comments);
  initBlogChrome(isHub, sidebarMode);
  initLangTooltip();
  if (sidebarMode) initSidebarProjects();
  initEventListeners();

  function loadNext(i) {
    if (i >= steps.length) {
      initCopyButtons();
      initBreadcrumb(config);
      // docsify doesn't re-scroll when only ?id= changes on the same page path,
      // so same-page anchor clicks (sidebar sub-headings, heading permalinks)
      // land nowhere. Handle hashchange ourselves: if the target is already in
      // the DOM, scroll to it with the titlebar offset. On cross-page nav the
      // target isn't rendered yet at hashchange time, so getElementById returns
      // null and docsify's own render + scroll (+ the mermaid re-scroll) wins.
      window.addEventListener('hashchange', function() {
        var mm = (location.hash || '').match(/[?&]id=([^&]+)/);
        if (!mm) return;
        var target = document.getElementById(decodeURIComponent(mm[1]));
        if (target) {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - (window.$docsify.topMargin || 0),
            behavior: 'smooth'
          });
        }
      });
      return;
    }
    var step = steps[i];
    if (step.src) {
      var el = document.createElement('script');
      el.src = step.src;
      el.onload = el.onerror = function() { loadNext(i + 1); };
      document.body.appendChild(el);
    } else if (step.fn) {
      step.fn();
      loadNext(i + 1);
    }
  }
  loadNext(0);
}

// --- Global toggle functions (referenced by onclick attributes) ---

function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
  var overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.classList.toggle('visible');
}

function closeSidebar() {
  document.body.classList.remove('sidebar-open');
  var overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.classList.remove('visible');
}

function toggleTheme() {
  var html = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var currentScheme = html.style.colorScheme || 'dark';
  var newScheme = currentScheme === 'dark' ? 'light' : 'dark';
  html.style.colorScheme = newScheme;
  toggle.setAttribute('data-scheme', newScheme);
  localStorage.setItem('theme', newScheme);
  syncCommentsTheme(newScheme);

  if (typeof mermaid !== 'undefined') {
    var mermaidTheme = newScheme === 'light' ? 'default' : 'dark';
    mermaid.initialize({ startOnLoad: false, theme: mermaidTheme });
    document.querySelectorAll('.mermaid[data-source]').forEach(function(el) {
      el.removeAttribute('data-processed');
      el.innerHTML = el.getAttribute('data-source');
    });
    mermaid.run({ querySelector: '.mermaid' });
  }
}

function toggleRepoSelector() {
  var selector = document.getElementById('repoSelector');
  if (selector) selector.classList.toggle('open');
}

// --- DOM builders ---

function buildTitlebarDOM(config) {
  var org = HUB_ORIGIN.replace('https://', '').replace('.github.io', '');
  var isHub = config.name === org;

  var toggleLabel = isHub ? 'repos' : config.name;
  var toggleIcon = isHub ? '' : '<img class="breadcrumb-repo-icon" src="favicon.svg" alt="" width="16" height="16"> ';
  var navSection =
    '<div class="breadcrumb-repo-selector" id="repoSelector">' +
      '<button class="breadcrumb-repo-toggle" onclick="toggleRepoSelector()">' +
        toggleIcon + toggleLabel + ' ' + ICONS.chevronDown +
      '</button>' +
      '<div class="breadcrumb-repo-dropdown" id="repoDropdownContainer"></div>' +
    '</div>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML =
    '<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>' +
    '<div class="titlebar" id="titlebar">' +
      '<button class="mobile-menu-toggle" id="mobileMenuToggle" onclick="toggleSidebar()" title="Toggle menu">' + ICONS.bars + '</button>' +
      '<a href="' + HUB_ORIGIN + '" class="titlebar-brand"><span>' + org + '</span></a>' +
      '<span class="breadcrumb-separator">/</span>' +
      navSection +
      '<div class="titlebar-spacer"></div>' +
      '<div class="titlebar-actions">' +
        '<a href="' + (isHub ? '#' + BLOG_ROOT : HUB_ORIGIN + '/#' + BLOG_ROOT) + '"' +
          ' class="titlebar-nav-link" id="titlebarBlog" title="Blog">' +
          ICONS.blog + '<span class="titlebar-nav-label">Blog</span>' +
        '</a>' +
        (isHub ? '' :
        '<div class="titlebar-search" id="titlebarSearch">' +
          '<div class="titlebar-search-trigger" title="Search">' +
            ICONS.search +
            '<span class="search-hint">Search</span>' +
            '<kbd class="search-kbd">/</kbd>' +
          '</div>' +
          '<input type="text" class="titlebar-search-input" placeholder="Search..." id="titlebarSearchInput">' +
          '<div class="titlebar-search-results" id="titlebarSearchResults"></div>' +
        '</div>') +
        '<div class="theme-toggle" id="themeToggle" onclick="toggleTheme()" title="Toggle theme">' +
          '<span class="theme-toggle-option theme-toggle-sun">' + ICONS.toggleSun + '</span>' +
          '<span class="theme-toggle-option theme-toggle-moon">' + ICONS.toggleMoon + '</span>' +
          '<span class="theme-toggle-indicator"></span>' +
        '</div>' +
        '<a href="' + config.repo_source + '" target="_blank" class="titlebar-github" title="View on GitHub">' + ICONS.github + '</a>' +
      '</div>' +
    '</div>';

  var app = document.getElementById('app');
  while (wrapper.firstChild) {
    app.parentNode.insertBefore(wrapper.firstChild, app);
  }
}

// --- Feature initializers ---

function initTheme() {
  var saved = localStorage.getItem('theme');
  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = theme;
  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.setAttribute('data-scheme', theme);
  }
}

function initCopyButtons() {
  // Delegated listener on document: catches clicks on any copy-code button,
  // current or future, without depending on docsify init/hook timing (a
  // doneEach hook registered here runs too late and never fires). Adds a
  // transient `copied` class that the theme renders as a green check.
  document.addEventListener('click', function(e) {
    var btn = e.target.closest ? e.target.closest('.docsify-copy-code-button') : null;
    if (!btn) return;
    btn.classList.add('copied');
    setTimeout(function() { btn.classList.remove('copied'); }, 1500);
  });
}

function initSearch() {
  var searchContainer = document.getElementById('titlebarSearch');
  if (!searchContainer) return;

  var searchTrigger = searchContainer.querySelector('.titlebar-search-trigger');
  var searchInput = document.getElementById('titlebarSearchInput');
  var searchResults = document.getElementById('titlebarSearchResults');
  var searchIndex = [];
  var selectedIndex = -1;

  function buildSearchIndex() {
    searchIndex = [];
    document.querySelectorAll('.sidebar-nav a').forEach(function(link) {
      var href = link.getAttribute('href');
      var title = link.textContent.trim();
      if (href && title && href.startsWith('#')) {
        searchIndex.push({
          title: title,
          url: href,
          searchText: title.toLowerCase()
        });
      }
    });
  }

  function expandSearch() {
    searchContainer.classList.add('expanded');
    setTimeout(function() { searchInput.focus(); }, 50);
    buildSearchIndex();
  }

  function collapseSearch() {
    searchContainer.classList.remove('expanded', 'has-results');
    searchInput.value = '';
    selectedIndex = -1;
  }

  function updateSelection() {
    var items = searchResults.querySelectorAll('.titlebar-search-result');
    items.forEach(function(item, i) {
      item.classList.toggle('selected', i === selectedIndex);
    });
    if (selectedIndex >= 0 && items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function navigateToResult(url) {
    window.location.hash = url.startsWith('#') ? url.substring(1) : url;
    collapseSearch();
    searchInput.blur();
  }

  function addResultHandlers() {
    searchResults.querySelectorAll('.titlebar-search-result').forEach(function(el) {
      el.addEventListener('click', function() {
        navigateToResult(el.dataset.url);
      });
      el.addEventListener('mouseenter', function() {
        selectedIndex = parseInt(el.dataset.index, 10);
        updateSelection();
      });
    });
  }

  function doFullTextSearch(query) {
    var fullTextResults = [];
    var searchData = null;

    try {
      var storedIndex = localStorage.getItem('docsify.search.index');
      if (storedIndex) searchData = JSON.parse(storedIndex);
    } catch (e) {}

    if (!searchData && window.SEARCH_INDEX && window.SEARCH_INDEX.INDEXS) {
      searchData = {};
      window.SEARCH_INDEX.INDEXS.forEach(function(item) {
        if (item.slug) searchData[item.slug] = { title: item.title, body: item.body };
      });
    }

    if (searchData) {
      Object.keys(searchData).forEach(function(path) {
        var item = searchData[path];
        var title = item.title || '';
        var body = item.body || '';
        var titleLower = title.toLowerCase();
        var bodyLower = body.toLowerCase();
        var titleMatch = titleLower.includes(query);
        var bodyMatch = bodyLower.includes(query);

        if (titleMatch || bodyMatch) {
          var snippet = '';
          if (bodyMatch) {
            var idx = bodyLower.indexOf(query);
            var start = Math.max(0, idx - 40);
            var end = Math.min(body.length, idx + query.length + 60);
            snippet = (start > 0 ? '...' : '') + body.substring(start, end).replace(/\n/g, ' ') + (end < body.length ? '...' : '');
          }
          if (path && path.length > 1 && !path.includes('#')) {
            fullTextResults.push({
              title: title || path.split('/').pop().replace('.md', ''),
              url: '#' + path,
              snippet: snippet,
              score: titleMatch ? 2 : 1
            });
          }
        }
      });

      fullTextResults.sort(function(a, b) { return b.score - a.score; });
      var seen = new Set();
      fullTextResults = fullTextResults.filter(function(r) {
        if (seen.has(r.url)) return false;
        seen.add(r.url);
        return true;
      }).slice(0, 15);
    }

    if (fullTextResults.length > 0) {
      searchResults.innerHTML = fullTextResults.map(function(r, i) {
        var snippetHtml = r.snippet ? '<div class="titlebar-search-result-content">' + r.snippet.replace(/</g, '&lt;') + '</div>' : '';
        return '<div class="titlebar-search-result" data-url="' + r.url + '" data-index="' + i + '">' +
          '<div class="titlebar-search-result-title">' + r.title + '</div>' +
          snippetHtml +
        '</div>';
      }).join('');
      searchContainer.classList.add('has-results');
      addResultHandlers();
    } else {
      searchResults.innerHTML = '<div class="titlebar-search-result"><div class="titlebar-search-result-title" style="opacity: 0.6">No results for "' + query + '"</div></div>';
      searchContainer.classList.add('has-results');
    }
  }

  function performSearch() {
    var query = searchInput.value.trim().toLowerCase();
    selectedIndex = -1;

    if (query.length < 1) {
      searchContainer.classList.remove('has-results');
      searchResults.innerHTML = '';
      return;
    }

    if (searchIndex.length === 0) buildSearchIndex();

    var results = searchIndex.filter(function(item) {
      return item.searchText.includes(query);
    });

    results.sort(function(a, b) {
      var aStarts = a.searchText.startsWith(query);
      var bStarts = b.searchText.startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.title.localeCompare(b.title);
    });

    var topResults = results.slice(0, 15);

    if (topResults.length > 0) {
      searchResults.innerHTML = topResults.map(function(r, i) {
        return '<div class="titlebar-search-result" data-url="' + r.url + '" data-index="' + i + '">' +
          '<div class="titlebar-search-result-title">' + r.title + '</div>' +
        '</div>';
      }).join('');
      searchContainer.classList.add('has-results');
      addResultHandlers();
    } else {
      doFullTextSearch(query);
    }
  }

  searchTrigger.addEventListener('click', function(e) {
    e.stopPropagation();
    expandSearch();
  });

  document.addEventListener('click', function(e) {
    if (!searchContainer.contains(e.target)) collapseSearch();
  });

  searchInput.addEventListener('input', performSearch);

  searchInput.addEventListener('keydown', function(e) {
    var items = searchResults.querySelectorAll('.titlebar-search-result');
    var maxIndex = items.length - 1;

    if (e.key === 'Escape') {
      collapseSearch();
      searchInput.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, maxIndex);
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        navigateToResult(items[selectedIndex].dataset.url);
      } else if (items.length > 0) {
        navigateToResult(items[0].dataset.url);
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault();
      expandSearch();
      searchInput.select();
    }
    if (e.key === '/' && !e.target.matches('input, textarea, [contenteditable]')) {
      e.preventDefault();
      expandSearch();
    }
  });

  if (window.$docsify) {
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
      hook.doneEach(function() {
        setTimeout(buildSearchIndex, 200);
      });
    });
  }
}

function parseProjectsYaml(text) {
  var projects = [];
  var groupStack = [{ children: projects, indent: -1 }];
  var current = null;
  var inLanguages = false;
  var langIndent = -1;
  var currentLang = null;

  function activeContainer() {
    return groupStack[groupStack.length - 1].children;
  }

  text.split('\n').forEach(function(line) {
    var indent = line.length - line.replace(/^ */, '').length;
    var stripped = line.trim();
    if (!stripped || stripped.charAt(0) === '#') return;

    // language entries — handle before anything else
    if (inLanguages && indent > langIndent) {
      if (stripped.indexOf('- name:') === 0) {
        currentLang = { name: stripped.substring(7).trim(), pct: 0 };
        current.languages.push(currentLang);
      } else if (currentLang && stripped.indexOf('pct:') === 0) {
        currentLang.pct = parseInt(stripped.substring(4).trim(), 10);
      }
      return;
    }

    // if we get here, we've left the languages block
    inLanguages = false;

    // pop group stack when indent decreases
    while (groupStack.length > 1 && indent <= groupStack[groupStack.length - 1].indent) {
      groupStack.pop();
    }

    // "- group:"
    if (stripped.indexOf('- group:') === 0) {
      var group = { group: stripped.substring(8).trim(), children: [] };
      activeContainer().push(group);
      current = group;
      return;
    }

    // "children:" — supported on groups and on regular project items
    if (stripped === 'children:' && current) {
      if (!current.children) current.children = [];
      groupStack.push({ children: current.children, indent: indent });
      current = null;
      return;
    }

    // "- name:"
    if (stripped.indexOf('- name:') === 0) {
      current = { name: stripped.substring(7).trim(), languages: [] };
      activeContainer().push(current);
      return;
    }

    // fields on current item/group
    if (current) {
      if (stripped.indexOf('description:') === 0) {
        current.description = stripped.substring(12).trim();
      } else if (stripped.indexOf('label:') === 0) {
        // What the breadcrumb calls this project, when the repo name isn't the
        // name people use for it (claude-marketplace is bridge.ai to a reader).
        current.label = stripped.substring(6).trim();
      } else if (stripped.indexOf('icon:') === 0) {
        current.icon = stripped.substring(5).trim();
      } else if (stripped.indexOf('url:') === 0) {
        current.url = stripped.substring(4).trim();
      } else if (stripped === 'languages:') {
        inLanguages = true;
        langIndent = indent;
        currentLang = null;
      }
    }
  });
  return projects;
}

function flattenProjects(projects) {
  var flat = [];
  projects.forEach(function(item) {
    if (item.group && item.children) {
      flattenProjects(item.children).forEach(function(child) { flat.push(child); });
    } else {
      flat.push(item);
      if (item.children && item.children.length) {
        flattenProjects(item.children).forEach(function(child) { flat.push(child); });
      }
    }
  });
  return flat;
}

var _projectsPromise = null;

// Hub-relative paths in projects.yml load locally during dev, from the hub on the hub site,
// and from the hub when consumed cross-origin from a sub-project site.
function resolveHubPath(path) {
  if (!path) return '';
  if (/^[a-z]+:\/\//i.test(path)) return path;
  if (path.charAt(0) !== '/') return path;
  var origin = localAssetOrigin();
  return origin + path;
}

function loadProjects() {
  if (!_projectsPromise) {
    _projectsPromise = fetch(resolveHubPath('/projects.yml'))
      .then(function(r) {
        if (!r.ok) throw new Error('projects.yml responded with ' + r.status);
        return r.text();
      })
      .then(function(text) { return parseProjectsYaml(text); });
  }
  return _projectsPromise;
}

function initBreadcrumb(config) {
  loadProjects()
    .then(function(projects) {
      var dropdown = document.getElementById('repoDropdownContainer');
      if (!dropdown) return;
      dropdown.innerHTML = renderDropdownTree(projects, 0);
      renderAncestry(projects, config);
    })
    .catch(function(err) { console.error('Failed to load projects.yml:', err); });
}

// projects.yml already nests a project under the thing it belongs to — a plugin
// under the marketplace, a module under its suite. Show that in the breadcrumb
// (chris-peterson / bridge.ai / anchor) so membership is stated once, where a
// reader looks for it, instead of as a badge on each page.
function ancestorsOf(items, name, trail) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var here = item.group ? trail : trail.concat([item]);
    if (!item.group && item.name === name) return trail;
    if (item.children) {
      var found = ancestorsOf(item.children, name, here);
      if (found) return found;
    }
  }
  return null;
}

function renderAncestry(projects, config) {
  var selector = document.getElementById('repoSelector');
  if (!selector || !config || !config.name) return;
  var ancestors = ancestorsOf(projects, config.name, []);
  if (!ancestors || !ancestors.length) return;
  ancestors.forEach(function(a) {
    var node = document.createElement('a');
    node.className = 'breadcrumb-ancestor';
    node.href = a.url || '#';
    var icon = resolveHubPath(a.icon || (a.url + '/favicon.svg'));
    node.innerHTML = '<img class="breadcrumb-repo-icon" src="' + icon + '" alt="" width="16" height="16"> ' +
      (a.label || a.name);
    var slash = document.createElement('span');
    slash.className = 'breadcrumb-separator';
    slash.textContent = '/';
    selector.parentNode.insertBefore(node, selector);
    selector.parentNode.insertBefore(slash, selector);
  });
}

function renderDropdownTree(items, depth) {
  return items.map(function(item) {
    if (item.group && item.children) {
      return '<div class="breadcrumb-repo-group">' +
        '<div class="breadcrumb-repo-group-label">' + item.group + '</div>' +
        renderDropdownTree(item.children, depth + 1) +
      '</div>';
    }
    var faviconUrl = resolveHubPath(item.icon || (item.url + '/favicon.ico'));
    var classes = 'breadcrumb-repo-item' + (depth > 1 ? ' breadcrumb-repo-item-nested' : '');
    var html = '<a class="' + classes + '" href="' + (item.url || '#') + '"' +
      (item.description ? ' title="' + item.description + '"' : '') + '>' +
      '<img class="repo-icon" src="' + faviconUrl + '" alt="" width="20" height="20"> ' +
      item.name +
    '</a>';
    if (item.children && item.children.length) {
      html += renderDropdownTree(item.children, depth + 1);
    }
    return html;
  }).join('');
}

function initSidebarProjects() {
  if (!window.$docsify) return;

  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
    hook.doneEach(function() {
      var nav = document.querySelector('.sidebar-nav');
      if (!nav || nav.dataset.projectsLoaded) return;
      nav.dataset.projectsLoaded = 'true';

      loadProjects().then(function(projects) {
        function renderNav(items) {
          return '<ul>' + items.map(function(item) {
            if (item.group && item.children) {
              return '<li><p>' + item.group + '</p>' + renderNav(item.children) + '</li>';
            }
            var faviconUrl = resolveHubPath(item.icon || (item.url + '/favicon.ico'));
            var nested = (item.children && item.children.length) ? renderNav(item.children) : '';
            return '<li><a href="' + (item.url || '#') + '">' +
              '<img src="' + faviconUrl + '" alt="" width="16" height="16" style="vertical-align:middle;margin-right:6px">' +
              item.name + '</a>' + nested + '</li>';
          }).join('') + '</ul>';
        }

        nav.innerHTML = renderNav(projects);
      });
    });
  });
}

function initProjectCards() {
  if (!window.$docsify) return;

  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
    hook.doneEach(function() {
      var container = document.getElementById('project-cards');
      if (!container) return;

      loadProjects()
        .then(function(projects) {
          var org = HUB_ORIGIN.replace('https://', '').replace('.github.io', '');
          var cardIndex = 0;

          function renderCard(project) {
            var faviconUrl = resolveHubPath(project.icon || (project.url + '/favicon.ico'));
            var langBar = (project.languages && project.languages.length > 0) ?
              '<div class="lang-bar">' +
                project.languages.map(function(lang) {
                  var fullLabel = lang.name + ' ' + lang.pct + '%';
                  // Tiered label: full name+% for wide segments, just % for narrow ones, nothing for slivers.
                  var inlineLabel = lang.pct >= 22 ? fullLabel
                                    : lang.pct >= 4 ? (lang.pct + '%')
                                    : '';
                  return '<div class="lang-bar-segment" data-lang="' + lang.name.toLowerCase() + '"' +
                    (inlineLabel ? ' data-label="' + inlineLabel + '"' : '') +
                    ' style="flex:' + lang.pct + '" role="img" aria-label="' + fullLabel + '"></div>';
                }).join('') +
              '</div>' : '';
            var hasChildren = !!(project.children && project.children.length);
            var html = '<div class="project-card' + (hasChildren ? ' has-children' : '') + '" data-href="' + (project.url || '#') + '" style="animation-delay:' + (cardIndex * 60) + 'ms">' +
              '<div class="project-card-content">' +
                '<img class="project-card-icon" src="' + faviconUrl + '" alt="">' +
                '<div class="project-card-info">' +
                  '<div class="project-card-name">' + project.name + '</div>' +
                  (project.description ? '<div class="project-card-desc">' + project.description + '</div>' : '') +
                '</div>' +
              '</div>' +
              langBar +
            '</div>';
            cardIndex++;
            return html;
          }

          function renderItems(items) {
            return items.map(function(item) {
              if (item.group && item.children) {
                return '<section class="project-group" style="animation-delay:' + (cardIndex * 60) + 'ms">' +
                  '<header class="project-group-label">' +
                    '<span class="project-group-name">' + item.group + '</span>' +
                    (item.description ? '<span class="project-group-desc">' + item.description + '</span>' : '') +
                  '</header>' +
                  '<div class="project-group-children">' +
                    renderItems(item.children) +
                  '</div>' +
                '</section>';
              }
              var card = renderCard(item);
              if (item.children && item.children.length) {
                card += '<div class="project-card-children">' + renderItems(item.children) + '</div>';
              }
              return card;
            }).join('');
          }

          container.innerHTML = renderItems(projects);

          container.querySelectorAll('.project-card').forEach(function(card) {
            card.addEventListener('click', function() {
              if (card.dataset.href) window.location.href = card.dataset.href;
            });
          });
        })
        .catch(function(err) { console.error('Failed to render project cards:', err); });
    });
  });
}

// '#/blog/a-post.md?id=a-heading' -> '/blog/a-post'. The route is what a
// discussion is keyed on, so it has to survive both spellings of a link (with
// and without the .md) and any heading anchor on the end.
function currentRoute() {
  var route = (window.location.hash || '#/').replace(/^#/, '').split('?')[0];
  return route.replace(/\.md$/, '') || '/';
}

function currentScheme() {
  return document.documentElement.style.colorScheme === 'light' ? 'light' : 'dark';
}

// Comments and reactions come from GitHub Discussions via giscus, on the pages
// named by `comments.paths`. Each route gets its own discussion, created on the
// first comment or reaction.
function initComments(comments) {
  if (!comments || !window.$docsify) return;

  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
    hook.doneEach(function() { mountComments(comments); });
  });
}

function mountComments(comments) {
  var content = document.querySelector('.markdown-section');
  if (!content) return;

  var route = currentRoute();
  // A section's own index (/blog/) lists what's in it; the discussion belongs on
  // the page being discussed, so a route has to be *under* one of the paths.
  var wanted = (comments.paths || ['/']).some(function(path) {
    return route.indexOf(path) === 0 && route !== path;
  });

  var existing = content.querySelector('.page-comments');
  if (existing && existing.dataset.route === route) return; // already mounted; leave the iframe alone
  if (existing) existing.remove();
  if (!wanted) return;

  var section = document.createElement('section');
  section.className = 'page-comments';
  section.dataset.route = route;
  section.innerHTML = '<h2 class="page-comments-heading">Comments</h2>';

  var container = document.createElement('div');
  container.className = 'giscus';
  // client.js hands giscus the page URL with the fragment stripped, then puts
  // this id back on the end as an anchor — and giscus keeps a `#/`-prefixed
  // anchor intact, reading it as an SPA route rather than an in-page target.
  // Naming the container after the route is what returns a reader to the post
  // they signed in from, and what a new discussion links back to.
  container.id = route;
  section.appendChild(container);
  content.appendChild(section);

  // The link a new discussion carries back to the page. client.js reads it from
  // this meta tag, and falls back to the page URL with the fragment stripped —
  // which on a hash-routed site is every post pointing at the site root.
  var backlink = document.querySelector('meta[name="giscus:backlink"]') ||
    document.head.appendChild(document.createElement('meta'));
  backlink.name = 'giscus:backlink';
  backlink.content = window.location.origin + window.location.pathname + '#' + route;

  var script = document.createElement('script');
  script.src = GISCUS_ORIGIN + '/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  var settings = {
    repo: comments.repo,
    repoId: comments.repoId,
    category: comments.category,
    categoryId: comments.categoryId,
    // Titles get reworded; a route doesn't, so the discussion stays attached to
    // the page across an edit. `strict` matches on a hash of the title rather
    // than GitHub's fuzzy search, which pairs dated post slugs by their prefix.
    mapping: 'specific',
    term: route.replace(/^\//, ''),
    strict: '1',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    theme: GISCUS_THEMES[currentScheme()],
    lang: 'en',
    loading: 'lazy'
  };
  Object.keys(settings).forEach(function(key) { script.dataset[key] = settings[key]; });
  section.appendChild(script);
}

// The widget is cross-origin, so the day/night toggle can't restyle it — it can
// only ask it to load the other theme.
function syncCommentsTheme(scheme) {
  var frame = document.querySelector('iframe.giscus-frame');
  if (!frame || !frame.contentWindow) return;
  frame.contentWindow.postMessage({ giscus: { setConfig: { theme: GISCUS_THEMES[scheme] } } }, GISCUS_ORIGIN);
}

// What surrounds the blog rather than sits inside it: the titlebar link's active
// state, whether the hub's sidebar is worth its width on this route, and the
// kicker over each post. All three follow the route, so a post file holds
// nothing but the post.
function initBlogChrome(isHub, sidebarMode) {
  if (!window.$docsify) return;

  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
    hook.doneEach(function() {
      var route = currentRoute();
      var inBlog = route.indexOf(BLOG_ROOT) === 0;

      var link = document.getElementById('titlebarBlog');
      if (link) link.classList.toggle('active', inBlog);

      // The hub's sidebar has the post list to show in the blog and the project
      // tree in ?mode=sidebar. Elsewhere it has nothing to say, so the page
      // takes the width back rather than running beside an empty rail.
      if (isHub) {
        document.body.classList.toggle('sidebar-hidden', !(inBlog || sidebarMode));
      }

      renderPostKicker(route);
    });
  });
}

// '/blog/2026-08-23-too-much' -> ['2026-08-23', 'August 23, 2026']. Assembled
// from the parts rather than through Date, which reads a date-only string as UTC
// midnight and so prints the day before anywhere west of it.
function postDate(route) {
  var parts = route.match(POST_ROUTE);
  if (!parts) return null;
  return [
    parts[1] + '-' + parts[2] + '-' + parts[3],
    MONTHS[+parts[2] - 1] + ' ' + +parts[3] + ', ' + parts[1]
  ];
}

function renderPostKicker(route) {
  var content = document.querySelector('.markdown-section');
  if (!content) return;

  var existing = content.querySelector('.post-kicker');
  if (existing) existing.remove();

  var date = postDate(route);
  var heading = content.querySelector('h1');
  if (!date || !heading) return;

  var kicker = document.createElement('p');
  kicker.className = 'post-kicker';
  kicker.innerHTML =
    '<a href="#' + BLOG_ROOT + '">← Blog</a>' +
    '<span class="post-kicker-sep">·</span>' +
    '<time datetime="' + date[0] + '">' + date[1] + '</time>';
  heading.parentNode.insertBefore(kicker, heading);
}

// A narrow language segment has room for a bare percentage at best, so the
// language itself is only reachable by pointing at it. The tooltip lives on
// <body> because .project-card clips its overflow.
function initLangTooltip() {
  var GAP = 8;
  var tip = document.createElement('div');
  tip.className = 'lang-tooltip';
  // The segment carries the same string as its own aria-label, so announcing the
  // tooltip too would just repeat it.
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  var active = null;

  function hide() {
    active = null;
    tip.classList.remove('visible');
  }

  function show(segment) {
    active = segment;
    tip.textContent = segment.getAttribute('aria-label');
    tip.classList.add('visible');

    var box = segment.getBoundingClientRect();
    var edge = tip.offsetWidth / 2 + GAP;
    var center = Math.min(Math.max(box.left + box.width / 2, edge), window.innerWidth - edge);
    // The stripe is still mid-expansion when the pointer first lands on it, so its
    // measured top sits too low. Its bottom is pinned to the card, so derive the
    // settled top from that and the height CSS is animating towards.
    var barTop = box.bottom - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lang-bar-expanded'));
    var above = barTop - tip.offsetHeight - GAP;
    // The titlebar is fixed and sits above the tooltip, so anything tucked under it
    // is invisible — treat its lower edge as the ceiling, not the viewport's.
    var titlebar = document.getElementById('titlebar');
    var ceiling = (titlebar ? titlebar.getBoundingClientRect().bottom : 0) + GAP;
    var below = above < ceiling;
    tip.classList.toggle('below', below);
    tip.style.left = center + 'px';
    tip.style.top = (below ? box.bottom + GAP : above) + 'px';
  }

  document.addEventListener('mouseover', function(e) {
    var segment = e.target.closest('.lang-bar-segment');
    if (segment) show(segment);
    else if (active) hide();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && active) hide();
  });

  // Capture phase so a scroll inside any container repositions-by-hiding, not just
  // one on the window.
  window.addEventListener('scroll', function() { if (active) hide(); }, true);
}

// --- Global event listeners ---

function initEventListeners() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.sidebar-nav a')) {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    }
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });

  document.addEventListener('click', function(e) {
    var selector = document.getElementById('repoSelector');
    if (selector && !selector.contains(e.target)) {
      selector.classList.remove('open');
    }
  });

  initSidebarResize();
}

function initSidebarResize() {
  var sidebar = document.querySelector('.sidebar');
  if (!sidebar) {
    setTimeout(initSidebarResize, 100);
    return;
  }

  var handle = document.createElement('div');
  handle.className = 'sidebar-resize-handle';
  // Append rather than insert after the sidebar: docsify-themeable offsets the
  // content with `.sidebar + .content`, so anything between the two drops the
  // offset and the fixed sidebar overlays the text. The handle is
  // position: fixed, so its place in the DOM costs it nothing.
  sidebar.parentNode.appendChild(handle);

  var dragging = false;

  handle.addEventListener('dblclick', function() {
    var nav = sidebar.querySelector('.sidebar-nav');
    if (!nav) return;
    sidebar.style.width = 'min-content';
    nav.style.whiteSpace = 'nowrap';
    var fitWidth = sidebar.offsetWidth + 20;
    sidebar.style.width = '';
    nav.style.whiteSpace = '';
    var width = Math.max(150, Math.min(fitWidth, window.innerWidth * 0.5));
    document.documentElement.style.setProperty('--sidebar-width', width + 'px');
    localStorage.setItem('sidebar-width', width + 'px');
  });

  handle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    dragging = true;
    handle.classList.add('dragging');
    sidebar.style.transition = 'none';
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    var width = Math.max(150, Math.min(e.clientX, window.innerWidth * 0.5));
    document.documentElement.style.setProperty('--sidebar-width', width + 'px');
  });

  document.addEventListener('mouseup', function() {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    sidebar.style.transition = '';
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    localStorage.setItem('sidebar-width', document.documentElement.style.getPropertyValue('--sidebar-width'));
  });

  var saved = localStorage.getItem('sidebar-width');
  if (saved) {
    document.documentElement.style.setProperty('--sidebar-width', saved);
  }
}

