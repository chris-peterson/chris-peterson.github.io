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
  config.search = !isHub || sidebarMode;
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
  initWideFigures();
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

// The titlebar on a page that isn't a docsify site. bridge.ai is hand-built and
// stays that way; this gives it the family's bar — brand, breadcrumb, blog, and
// the theme toggle — off the same source as every other site, so the five of
// them can't drift.
//
// The page supplies `name` (its key in projects.yml, which is what the
// breadcrumb resolves its ancestry and label from), and loads tokens.css and
// titlebar.css itself.
function initTitlebar(config) {
  var org = HUB_ORIGIN.replace('https://', '').replace('.github.io', '');
  config.repo_source = config.repo_source ||
    'https://github.com/' + org + '/' + config.name;
  // docsify builds the search index; a page without it gets no search trigger.
  if (config.search === undefined) config.search = false;
  buildTitlebarDOM(config);
  initTheme();
  initBreadcrumb(config);
  initTitlebarEvents();
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
  // Anything that resolved a token to a literal when it drew — a canvas chart,
  // an SVG built in JS — can't follow the swap on its own. This is how it hears
  // about it.
  window.dispatchEvent(new CustomEvent('themechange', { detail: { scheme: newScheme } }));

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
        toggleIcon + '<span id="repoSelectorLabel">' + toggleLabel + '</span> ' + ICONS.chevronDown +
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
        (config.search === false ? '' :
        '<div class="titlebar-search" id="titlebarSearch">' +
          '<div class="titlebar-search-trigger" title="Search">' +
            ICONS.search +
            '<span class="search-hint">Search</span>' +
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

  // docsify pages mount at #app and want the bar above it; a page without one
  // (bridge.ai) takes it at the top of the body instead.
  var app = document.getElementById('app');
  var parent = app ? app.parentNode : document.body;
  var before = app || document.body.firstChild;
  while (wrapper.firstChild) {
    parent.insertBefore(wrapper.firstChild, before);
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
      } else if (stripped.indexOf('hidden:') === 0) {
        // Kept in the manifest so the breadcrumb and the sub-site still resolve
        // it, left out of the index. For a project that isn't meant to be found
        // from here yet.
        current.hidden = stripped.substring(7).trim() === 'true';
      } else if (stripped.indexOf('muted:') === 0) {
        // Still listed and still linked, drawn quieter than the rest: a
        // project kept for the people already using it rather than promoted to
        // new ones. Set on a group to quiet all of it, or on a single project
        // that stays in the group it belongs to.
        current.muted = stripped.substring(6).trim() === 'true';
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

// What a reader calls this project. `label` carries the name in use where it
// isn't the repo name — claude-marketplace is bridge.ai everywhere but the URL.
function displayName(item) {
  return item.label || item.name;
}

function withoutHidden(items) {
  return items.filter(function(item) { return !item.hidden; })
    .map(function(item) {
      if (!item.children) return item;
      var copy = {};
      Object.keys(item).forEach(function(k) { copy[k] = item[k]; });
      copy.children = withoutHidden(item.children);
      return copy;
    });
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
      .then(function(text) { return withoutHidden(parseProjectsYaml(text)); });
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

  // The bar is built before projects.yml lands, so the button goes up carrying
  // the repo name and is renamed here to whatever the manifest calls it.
  var label = document.getElementById('repoSelectorLabel');
  var self = flattenProjects(projects).filter(function(item) {
    return item.name === config.name;
  })[0];
  if (label && self) label.textContent = displayName(self);

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
      displayName(item) +
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
              displayName(item) + '</a>' + nested + '</li>';
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
            var html = '<div class="project-card' + (hasChildren ? ' has-children' : '') +
              (project.muted ? ' project-card-muted' : '') + '" data-href="' + (project.url || '#') + '" style="animation-delay:' + (cardIndex * 60) + 'ms">' +
              '<div class="project-card-content">' +
                '<img class="project-card-icon" src="' + faviconUrl + '" alt="">' +
                '<div class="project-card-info">' +
                  '<div class="project-card-name">' + displayName(project) + '</div>' +
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
                return '<section class="project-group' + (item.muted ? ' project-group-muted' : '') + '" style="animation-delay:' + (cardIndex * 60) + 'ms">' +
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
          renderHero(projects);

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

// The landing page's hero: every project's name, in its family's color, packed
// into a field that runs off the right edge. Read from projects.yml rather than
// authored, so it is the page's own contents and it grows when the manifest does.
//
// Names rather than shapes: bridge.ai's hero already sets faint panels behind
// its wordmark, and an index of things should say what the things are.
var HERO_FAMILY_COLORS = ['--color-cyan', '--color-purple', '--color-green', '--color-orange'];

function renderHero(projects) {
  var el = document.getElementById('hub-hero');
  if (!el) return;

  var names = [];
  projects.forEach(function(group, familyIndex) {
    var color = 'var(' + HERO_FAMILY_COLORS[familyIndex % HERO_FAMILY_COLORS.length] + ')';
    flattenProjects(group.children || [group]).forEach(function(project) {
      names.push({ color: color, name: displayName(project) });
    });
  });
  if (!names.length) return;

  el.innerHTML = names.map(function(item, i) {
    var opacity = Math.max(0.1, 0.44 - i * 0.013).toFixed(3);
    return '<span style="color:' + item.color + ';opacity:' + opacity + '">' + item.name + '</span>';
  }).join('');
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

      // The breadcrumb slot answers "where am I", so on a blog route it says
      // blog rather than naming the picker it happens to open. The dropdown
      // still lists the repos, which is how you leave.
      var label = isHub && document.getElementById('repoSelectorLabel');
      if (label) label.textContent = inBlog ? 'blog' : 'repos';

      // The hub's sidebar has the post list to show in the blog and the project
      // tree in ?mode=sidebar. Elsewhere it has nothing to say, so the page
      // takes the width back rather than running beside an empty rail.
      if (isHub) {
        document.body.classList.toggle('sidebar-hidden', !(inBlog || sidebarMode));
        // The landing page is the one route that gets the masthead treatment:
        // its own type scale, and the ambient wash behind it.
        document.body.classList.toggle('hub-home', route === '/');
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

// Two things are readable only by pointing at them: a narrow language segment,
// which has room for a bare percentage at best, and a heatmap cell, which since
// the charts dropped their legends is the only place a count appears. Both use
// one tooltip, on <body>, because .project-card clips its overflow.
var TIP_TARGETS = '.lang-bar-segment, .cpv [data-tip]';

function initLangTooltip() {
  var GAP = 8;
  var tip = document.createElement('div');
  tip.className = 'lang-tooltip';
  // The target carries the same string itself, so announcing the tooltip too
  // would just repeat it.
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);

  var active = null;

  function hide() {
    active = null;
    tip.classList.remove('visible');
  }

  function show(target) {
    active = target;
    tip.textContent = target.getAttribute('data-tip') || target.getAttribute('aria-label');
    tip.classList.add('visible');

    var box = target.getBoundingClientRect();
    var edge = tip.offsetWidth / 2 + GAP;
    var center = Math.min(Math.max(box.left + box.width / 2, edge), window.innerWidth - edge);
    // A heatmap cell is a fixed box, so it anchors to its own top. The language
    // stripe is still mid-expansion when the pointer first lands on it, so its
    // measured top sits too low — its bottom is pinned to the card, so derive the
    // settled top from that and the height CSS is animating towards.
    var anchorTop = target.hasAttribute('data-tip') ? box.top :
      box.bottom - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lang-bar-expanded'));
    var above = anchorTop - tip.offsetHeight - GAP;
    // The titlebar is fixed and sits above the tooltip, so anything tucked under it
    // is invisible — treat its lower edge as the ceiling, not the viewport's.
    var titlebar = document.getElementById('titlebar');
    var ceiling = (titlebar ? titlebar.getBoundingClientRect().bottom : 0) + GAP;
    var below = above < ceiling;
    tip.classList.toggle('below', below);
    tip.style.left = center + 'px';
    tip.style.top = (below ? box.bottom + GAP : above) + 'px';
  }

  // The frozen row-label strip passes the pointer through, so the figure still
  // swipes under it. What is under it, though, is whatever week has scrolled
  // behind the names - so pointing at a name must not answer for that cell.
  function behindFrozen(target, x) {
    var frozen = target.closest('.cpv-fig');
    frozen = frozen && frozen.querySelector('.cpv-frozen');
    return !!frozen && x < frozen.getBoundingClientRect().right;
  }

  document.addEventListener('mouseover', function(e) {
    var target = e.target.closest(TIP_TARGETS);
    if (target && !behindFrozen(target, e.clientX)) show(target);
    else if (active) hide();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && active) hide();
  });

  // Capture phase so a scroll inside any container repositions-by-hiding, not just
  // one on the window.
  window.addEventListener('scroll', function() { if (active) hide(); }, true);
}

// What a figure does when its column can no longer hold it. Both halves are
// declared in CSS, so they apply at the widths the figure itself decides, and
// both are measured in the drawing's own units rather than in pixels.
//
//   --fig-scroll-start  the drawing coordinate to open on, for a chart whose
//                       left edge is the least of what it has to say
//   --fig-freeze-rows   pin the row labels to the left edge, so a scrolled
//                       heatmap still says which row is which
function initWideFigures() {
  var NS = 'http://www.w3.org/2000/svg';

  // A pinned copy of some part of the drawing, sized from what it holds. The
  // backing rect is what makes it a strip rather than an overlay: whatever
  // scrolls behind it goes under an opaque ground, not through the letters.
  function buildStrip(nodes, cls, x0, y0, x1, y1) {
    var strip = document.createElementNS(NS, 'svg');
    strip.setAttribute('class', 'cpv ' + cls);
    strip.setAttribute('viewBox', x0 + ' ' + y0 + ' ' + (x1 - x0) + ' ' + (y1 - y0));
    // A second drawing of things that have not moved, and the figure's own
    // description already names them.
    strip.setAttribute('aria-hidden', 'true');

    var bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('class', 'cpv-frozen-bg');
    bg.setAttribute('x', x0);
    bg.setAttribute('y', y0);
    bg.setAttribute('width', x1 - x0);
    bg.setAttribute('height', y1 - y0);
    strip.appendChild(bg);

    nodes.forEach(function(node) { strip.appendChild(node.cloneNode(true)); });
    strip.figUnits = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
    return strip;
  }

  function union(nodes) {
    var b = null;
    nodes.forEach(function(node) {
      var box = node.getBBox();
      if (!b) b = { x0: box.x, y0: box.y, x1: box.x + box.width, y1: box.y + box.height };
      else {
        b.x0 = Math.min(b.x0, box.x);
        b.y0 = Math.min(b.y0, box.y);
        b.x1 = Math.max(b.x1, box.x + box.width);
        b.y1 = Math.max(b.y1, box.y + box.height);
      }
    });
    return b;
  }

  // Two strips, because a scrolled heatmap loses two different things off its
  // left edge. The labels' own boxes give the row strip its width, so it is as
  // wide as the longest name and no wider; it runs from under the key to the
  // bottom, since stopping any higher would leave a column heading stranded
  // over the cells the strip is covering, pointing at ones nobody can see. The
  // key is pinned in the band above it, which holds nothing else.
  function buildFrozen(svg) {
    var labels = [].slice.call(svg.querySelectorAll('.cpv-row'));
    if (!labels.length) return null;
    var rows = union(labels);
    if (!rows) return null;

    var strips = [];
    var top = 0;
    var legend = svg.querySelector('.cpv-legend');
    if (legend) {
      var key = legend.getBBox();
      top = key.y + key.height + 5;
      strips.push(buildStrip([legend], 'cpv-frozen-key', 0, 0, key.x + key.width + 8, top));
    }
    strips.push(buildStrip(labels, 'cpv-frozen', Math.max(0, rows.x0 - 4), top,
                           rows.x1 + 8, svg.viewBox.baseVal.height));
    return strips;
  }

  function apply() {
    document.querySelectorAll('.cpv-fig').forEach(function(fig) {
      var box = fig.querySelector('.cpv-scroll');
      var svg = box && box.querySelector('svg');
      if (!svg) return;

      var style = getComputedStyle(fig);
      var start = parseFloat(style.getPropertyValue('--fig-scroll-start')) || 0;
      var freeze = parseFloat(style.getPropertyValue('--fig-freeze-rows')) || 0;
      var room = box.scrollWidth - box.clientWidth;
      var units = svg.viewBox.baseVal.width;
      var drawn = svg.getBoundingClientRect().width;
      if (!units || !drawn) return;
      var scale = drawn / units;

      // Rebuilt rather than resized: a strip is as wide as its contents measure,
      // and they measure differently before the mono face they are set in has
      // loaded. Rebuilding is a few dozen clones of a text node, and it can
      // never be holding a width from a font that is no longer on screen.
      fig.querySelectorAll('.cpv-frozen, .cpv-frozen-key').forEach(function(old) { old.remove(); });
      var strips = (freeze && room > 0) ? buildFrozen(svg) : null;
      (strips || []).forEach(function(strip) {
        strip.style.width = (strip.figUnits.width * scale) + 'px';
        strip.style.height = (strip.figUnits.height * scale) + 'px';
        // Pinned flush to the box's edge. The strip's own x is where the crop
        // starts in the drawing - it trims the empty margin left of the longest
        // label - not where the strip sits on screen.
        strip.style.left = box.offsetLeft + 'px';
        strip.style.top = (box.offsetTop + strip.figUnits.y * scale) + 'px';
        fig.appendChild(strip);
      });
      fig.classList.toggle('cpv-fig--frozen', !!strips);

      // The row strip covers the left edge of the box, so the coordinate asked
      // for has to clear it to be the first thing actually on screen.
      var rowStrip = fig.querySelector('.cpv-frozen');
      var hidden = rowStrip ? rowStrip.figUnits.width : 0;
      var wanted = room > 0 ? start : 0;

      // Only on the way into a state that asks for it. A phone fires resize for
      // its own chrome, not just for a rotation, and re-running while the reader
      // has the figure part-scrolled would drag it back under them. A strip that
      // remeasures is a new state, so the offset it hides is applied once it is
      // the real one.
      var state = wanted + ':' + Math.round(hidden);
      if (state === fig.figScrollApplied) return;
      fig.figScrollApplied = state;
      if (!wanted) return;

      box.scrollLeft = Math.min(Math.max((wanted - hidden) * scale, 0), room);
    });
  }

  function markCut() {
    document.querySelectorAll('.cpv-fig--frozen').forEach(function(fig) {
      var box = fig.querySelector('.cpv-scroll');
      // The strip only needs an edge once there is something behind it.
      fig.classList.toggle('cpv-fig--cut', box.scrollLeft > 0);
    });
  }

  function refresh() { apply(); markCut(); }

  if (window.$docsify) {
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
      // A frame after the markup lands, so the figure is measured against the
      // column it ends up in; and again once the mono face the labels are set in
      // has loaded, since their measured width is what sizes the strip.
      hook.doneEach(function() {
        requestAnimationFrame(refresh);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
      });
    });
  }
  window.addEventListener('resize', refresh);
  document.addEventListener('scroll', markCut, true);
}

// --- Global event listeners ---

function initTitlebarEvents() {
  document.addEventListener('click', function(e) {
    var selector = document.getElementById('repoSelector');
    if (selector && !selector.contains(e.target)) {
      selector.classList.remove('open');
    }
  });
}

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

  initTitlebarEvents();
  initSidebarResize();
}

function initSidebarResize(tries) {
  var sidebar = document.querySelector('.sidebar');
  if (!sidebar) {
    // docsify renders the sidebar a tick or two after this runs, so waiting is
    // right; giving up is what keeps a page that has no sidebar from polling
    // for one forever.
    if ((tries || 0) < 50) setTimeout(function() { initSidebarResize((tries || 0) + 1); }, 100);
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

