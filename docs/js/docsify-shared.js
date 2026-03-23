var HUB_ORIGIN = 'https://chris-peterson.github.io';

// --- Global toggle functions (referenced by onclick attributes) ---

function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
  document.getElementById('sidebarOverlay').classList.toggle('visible');
}

function closeSidebar() {
  document.body.classList.remove('sidebar-open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}

function toggleTheme() {
  var html = document.documentElement;
  var btn = document.getElementById('themeToggle');
  var icon = btn.querySelector('i');
  var currentScheme = html.style.colorScheme || 'dark';
  var newScheme = currentScheme === 'dark' ? 'light' : 'dark';
  html.style.colorScheme = newScheme;
  icon.className = newScheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', newScheme);
}

function toggleRepoSelector() {
  var selector = document.getElementById('repoSelector');
  if (selector) selector.classList.toggle('open');
}

// --- DOM builders ---

function buildTitlebarDOM(config) {
  var overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';
  overlay.setAttribute('onclick', 'closeSidebar()');

  var titlebar = document.createElement('div');
  titlebar.className = 'titlebar';
  titlebar.id = 'titlebar';

  var mobileToggle = document.createElement('button');
  mobileToggle.className = 'mobile-menu-toggle';
  mobileToggle.id = 'mobileMenuToggle';
  mobileToggle.setAttribute('onclick', 'toggleSidebar()');
  mobileToggle.title = 'Toggle menu';
  mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
  titlebar.appendChild(mobileToggle);

  var brand = document.createElement('a');
  brand.href = config.brand.url;
  brand.className = 'titlebar-brand';
  brand.innerHTML = '<span>' + config.brand.name + '</span>';
  titlebar.appendChild(brand);

  var spacer = document.createElement('div');
  spacer.className = 'titlebar-spacer';
  titlebar.appendChild(spacer);

  var actions = document.createElement('div');
  actions.className = 'titlebar-actions';

  var search = document.createElement('div');
  search.className = 'titlebar-search';
  search.id = 'titlebarSearch';
  search.innerHTML =
    '<div class="titlebar-search-icon" title="Search"><i class="fas fa-search"></i></div>' +
    '<input type="text" class="titlebar-search-input" placeholder="Search..." id="titlebarSearchInput">' +
    '<div class="titlebar-search-results" id="titlebarSearchResults"></div>';
  actions.appendChild(search);

  var themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle';
  themeBtn.id = 'themeToggle';
  themeBtn.setAttribute('onclick', 'toggleTheme()');
  themeBtn.title = 'Toggle theme';
  themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  actions.appendChild(themeBtn);

  if (config.github) {
    var gh = document.createElement('a');
    gh.href = config.github;
    gh.target = '_blank';
    gh.className = 'titlebar-github';
    gh.title = 'View on GitHub';
    gh.innerHTML = '<i class="fab fa-github"></i>';
    actions.appendChild(gh);
  }

  titlebar.appendChild(actions);

  var app = document.getElementById('app');
  app.parentNode.insertBefore(overlay, app);
  app.parentNode.insertBefore(titlebar, app);
}

// --- Feature initializers ---

function initTheme() {
  var saved = localStorage.getItem('theme');
  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = theme;
  var btn = document.getElementById('themeToggle');
  if (btn) {
    var icon = btn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
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

  var searchIcon = searchContainer.querySelector('.titlebar-search-icon');
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

  searchIcon.addEventListener('click', function(e) {
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
  });

  if (window.$docsify) {
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(function(hook) {
      hook.doneEach(function() {
        setTimeout(buildSearchIndex, 200);
      });
    });
  }
}

function initBreadcrumb() {
  function parseYaml(text) {
    var projects = [];
    var current = null;
    text.split('\n').forEach(function(line) {
      var nameMatch = line.match(/^- name:\s*(.+)/);
      var descMatch = line.match(/^\s+description:\s*(.+)/);
      var iconMatch = line.match(/^\s+icon:\s*(.+)/);
      var urlMatch = line.match(/^\s+url:\s*(.+)/);
      if (nameMatch) {
        current = { name: nameMatch[1].trim() };
        projects.push(current);
      } else if (current && descMatch) {
        current.description = descMatch[1].trim();
      } else if (current && iconMatch) {
        current.icon = iconMatch[1].trim();
      } else if (current && urlMatch) {
        current.url = urlMatch[1].trim();
      }
    });
    return projects;
  }

  function injectBreadcrumb(projects) {
    var spacer = document.querySelector('.titlebar-spacer');
    if (!spacer) return;

    var currentUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
    var currentProject = projects.find(function(p) {
      return p.url && currentUrl.startsWith(p.url.replace(/\/$/, ''));
    });

    var breadcrumb = document.createElement('div');
    breadcrumb.className = 'titlebar-breadcrumb';

    var separator = document.createElement('span');
    separator.className = 'breadcrumb-separator';
    separator.textContent = '/';
    breadcrumb.appendChild(separator);

    var selector = document.createElement('div');
    selector.className = 'breadcrumb-repo-selector';
    selector.id = 'repoSelector';

    var toggle = document.createElement('button');
    toggle.className = 'breadcrumb-repo-toggle';
    toggle.setAttribute('onclick', 'toggleRepoSelector()');
    var toggleLabel = currentProject ? currentProject.name : 'repos';
    toggle.innerHTML = toggleLabel + ' <i class="fas fa-chevron-down"></i>';
    selector.appendChild(toggle);

    var dropdown = document.createElement('div');
    dropdown.className = 'breadcrumb-repo-dropdown';

    projects.forEach(function(project) {
      var a = document.createElement('a');
      a.className = 'breadcrumb-repo-item';
      a.href = project.url || '#';
      var faviconUrl = project.icon || (project.url + '/favicon.ico');
      a.innerHTML = '<img class="repo-icon" src="' + faviconUrl + '" alt="" width="16" height="16"> ' +
        project.name +
        '<span class="repo-description">' + (project.description || '') + '</span>';
      if (project.description) {
        a.title = project.description;
      }
      dropdown.appendChild(a);
    });

    selector.appendChild(dropdown);
    breadcrumb.appendChild(selector);
    spacer.parentNode.insertBefore(breadcrumb, spacer);
  }

  fetch(HUB_ORIGIN + '/projects.yml')
    .then(function(r) {
      if (!r.ok) throw new Error('projects.yml responded with ' + r.status);
      return r.text();
    })
    .then(function(text) { injectBreadcrumb(parseYaml(text)); })
    .catch(function(err) { console.error('Failed to load projects.yml:', err); });
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
}

// --- Public init ---

function initTitlebar(config) {
  buildTitlebarDOM(config);
  initTheme();
  initCopyButtons();
  initSearch();
  initBreadcrumb();
  initEventListeners();
}
