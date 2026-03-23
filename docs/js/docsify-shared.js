var HUB_ORIGIN = 'https://chris-peterson.github.io';

// Mobile sidebar toggle functions
function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
  document.getElementById('sidebarOverlay').classList.toggle('visible');
}

function closeSidebar() {
  document.body.classList.remove('sidebar-open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}

// Close sidebar when a link is clicked (on mobile)
document.addEventListener('click', function(e) {
  if (e.target.closest('.sidebar-nav a')) {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }
});

// Close sidebar on window resize if going to desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
});

// Theme toggle
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

// Load saved theme preference
(function() {
  var saved = localStorage.getItem('theme');
  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = theme;
  var btn = document.getElementById('themeToggle');
  if (btn) {
    var icon = btn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
})();

// Custom copy button behavior with checkmark feedback
(function() {
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
})();

// Repo selector dropdown
function toggleRepoSelector() {
  var selector = document.getElementById('repoSelector');
  if (selector) selector.classList.toggle('open');
}

// Close repo selector when clicking outside
document.addEventListener('click', function(e) {
  var selector = document.getElementById('repoSelector');
  if (selector && !selector.contains(e.target)) {
    selector.classList.remove('open');
  }
});

// Inject breadcrumb nav and populate from projects.yml
(function() {
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
    toggle.innerHTML = 'repos <i class="fas fa-chevron-down"></i>';
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
    .then(function(r) { return r.text(); })
    .then(function(text) { injectBreadcrumb(parseYaml(text)); });
})();
