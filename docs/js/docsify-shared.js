var HUB_ORIGIN = 'https://chris-peterson.github.io';

var ICONS = {
  bars: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="18" height="18" style="fill:var(--theme-icon-color);stroke:var(--theme-icon-color)" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="18" height="18" style="fill:var(--theme-icon-color);stroke:var(--theme-icon-color)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  github: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  toggleSun: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  toggleMoon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
};

var PLUGIN_CATALOG = {
  mermaid: [
    { src: 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js' },
    { code: 'mermaid.initialize({ startOnLoad: false });' },
    { src: 'https://cdn.jsdelivr.net/npm/docsify-mermaid@2/dist/docsify-mermaid.js' }
  ],
  footnotes: [
    { src: 'https://cdn.jsdelivr.net/npm/@sy-records/docsify-footnotes@2/dist/index.min.js' }
  ]
};

// --- Public init ---

function initProject(config) {
  window.$docsify = window.$docsify || {};
  var org = HUB_ORIGIN.replace('https://', '').replace('.github.io', '');
  config.site_url = HUB_ORIGIN + '/' + config.name;
  var isHub = config.name === org;
  config.repo_source = isHub ? 'https://github.com/' + org : 'https://github.com/' + org + '/' + config.name;
  var defaults = {
    loadSidebar: true,
    subMaxLevel: 2,
    auto2top: true,
    coverpage: false,
    notFoundPage: true,
    relativePath: false,
    alias: { '/.*/_sidebar.md': '/_sidebar.md' },
    hideSidebar: isHub,
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

  var cssOrigin = window.location.origin === HUB_ORIGIN || window.location.hostname === 'localhost' ? '' : HUB_ORIGIN;
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
    { code: 'window.Docsify = { version: "4.0.0" };' },
    { src: 'https://cdn.jsdelivr.net/npm/docsify-plugin-flexible-alerts' }
  ];

  (config.plugins || []).forEach(function(name) {
    if (PLUGIN_CATALOG[name]) {
      steps = steps.concat(PLUGIN_CATALOG[name]);
    }
  });

  if ((config.plugins || []).indexOf('mermaid') !== -1) {
    window.$docsify.mermaidConfig = { querySelector: '.mermaid' };
  }

  steps = steps.concat([
    { src: 'https://cdn.jsdelivr.net/npm/docsify@4' },
    !isHub && { src: 'https://cdn.jsdelivr.net/npm/docsify@4/lib/plugins/search.min.js' },
    { src: 'https://cdn.jsdelivr.net/npm/docsify-copy-code@2' }
  ].filter(Boolean));

  (config.code_languages || []).forEach(function(lang) {
    steps.push({ src: 'https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-' + lang + '.min.js' });
  });

  buildTitlebarDOM(config);
  initTheme();
  if (!isHub) initSearch();
  initProjectCards();
  initEventListeners();

  function loadNext(i) {
    if (i >= steps.length) {
      initCopyButtons();
      initBreadcrumb();
      return;
    }
    var step = steps[i];
    if (step.src) {
      var el = document.createElement('script');
      el.src = step.src;
      el.onload = el.onerror = function() { loadNext(i + 1); };
      document.body.appendChild(el);
    } else if (step.code) {
      new Function(step.code)();
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
  function setupCopyButtons() {
    document.querySelectorAll('.docsify-copy-code-button').forEach(function(btn) {
      if (btn.dataset.customized) return;
      btn.dataset.customized = 'true';
      btn.addEventListener('click', function() {
        btn.classList.add('copied');
        setTimeout(function() {
          btn.classList.remove('copied');
        }, 1500);
      });
    });
  }

  if (window.$docsify) {
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
      hook.doneEach(function() {
        setTimeout(setupCopyButtons, 100);
      });
    });
  }
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

    // "children:"
    if (stripped === 'children:' && current && current.children) {
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
    }
  });
  return flat;
}

var _projectsPromise = null;

function loadProjects() {
  if (!_projectsPromise) {
    _projectsPromise = fetch(HUB_ORIGIN + '/projects.yml')
      .then(function(r) {
        if (!r.ok) throw new Error('projects.yml responded with ' + r.status);
        return r.text();
      })
      .then(function(text) { return parseProjectsYaml(text); });
  }
  return _projectsPromise;
}

function initBreadcrumb() {
  loadProjects()
    .then(function(projects) {
      var dropdown = document.getElementById('repoDropdownContainer');
      if (!dropdown) return;

      function renderDropdownItems(items, depth) {
        var html = '';
        items.forEach(function(item) {
          if (item.group && item.children) {
            html += '<div class="breadcrumb-repo-group-label' + (depth > 0 ? ' breadcrumb-repo-group-label--nested' : '') + '">' + item.group + '</div>';
            html += renderDropdownItems(item.children, depth + 1);
          } else {
            html += renderDropdownItem(item, depth > 0);
          }
        });
        return html;
      }
      dropdown.innerHTML = renderDropdownItems(projects, 0);
    })
    .catch(function(err) { console.error('Failed to load projects.yml:', err); });
}

function renderDropdownItem(project, indented) {
  var faviconUrl = project.icon || (project.url + '/favicon.ico');
  return '<a class="breadcrumb-repo-item' + (indented ? ' breadcrumb-repo-item--child' : '') + '" href="' + (project.url || '#') + '"' +
    (project.description ? ' title="' + project.description + '"' : '') + '>' +
    '<img class="repo-icon" src="' + faviconUrl + '" alt="" width="20" height="20"> ' +
    project.name +
    '<span class="repo-description">' + (project.description || '') + '</span>' +
  '</a>';
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
            var faviconUrl = project.icon || (project.url + '/favicon.ico');
            var sourceUrl = 'https://github.com/' + org + '/' + project.name;
            var langLegend = (project.languages && project.languages.length > 0) ?
              project.languages.map(function(lang) {
                return '<span class="lang-legend-item"><span class="lang-dot" data-lang="' + lang.name.toLowerCase() + '"></span>' + lang.name + '</span>';
              }).join('') : '';
            var langBar = (project.languages && project.languages.length > 0) ?
              '<div class="lang-bar">' +
                project.languages.map(function(lang) {
                  return '<div class="lang-bar-segment" data-lang="' + lang.name.toLowerCase() + '" style="flex:' + lang.pct + '"></div>';
                }).join('') +
              '</div>' : '<div class="project-card-accent"></div>';
            var html = '<div class="project-card" data-href="' + (project.url || '#') + '" style="animation-delay:' + (cardIndex * 80) + 'ms">' +
              '<div class="project-card-content">' +
                '<img class="project-card-icon" src="' + faviconUrl + '" alt="">' +
                '<div class="project-card-info">' +
                  '<div class="project-card-name">' + project.name + '</div>' +
                  '<div class="project-card-desc">' + (project.description || '') +
                    (langLegend ? '<span class="lang-legend">' + langLegend + '</span>' : '') +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="project-card-links">' +
                '<a class="project-card-source" href="' + sourceUrl + '" target="_blank" title="View source">' + ICONS.github + '</a>' +
                '<svg class="project-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>' +
              '</div>' +
              langBar +
            '</div>';
            cardIndex++;
            return html;
          }

          function renderItems(items) {
            return items.map(function(item) {
              if (item.group && item.children) {
                return '<div class="project-group" style="animation-delay:' + (cardIndex * 80) + 'ms">' +
                  '<div class="project-group-label">' + item.group +
                    (item.description ? '<span class="project-group-desc">' + item.description + '</span>' : '') +
                  '</div>' +
                  '<div class="project-group-children">' +
                    renderItems(item.children) +
                  '</div>' +
                '</div>';
              }
              return renderCard(item);
            }).join('');
          }

          container.innerHTML = renderItems(projects);

          container.querySelectorAll('.project-card').forEach(function(card) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
              if (e.target.closest('.project-card-source')) return;
              window.location.href = card.dataset.href;
            });
          });
        })
        .catch(function(err) { console.error('Failed to render project cards:', err); });
    });
  });
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
  sidebar.appendChild(handle);

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

