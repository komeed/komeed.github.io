/**
 * Omeed Kasnavi (@komeed) - Portfolio & Repositories Interactive Script
 */

const GITHUB_USERNAME = 'komeed';

// Static seed data matching the user's repositories as a resilient offline/immediate fallback
const INITIAL_REPOSITORIES = [
  {
    name: 'pcb_sim_cpp',
    html_url: 'https://github.com/komeed/pcb_sim_cpp',
    description: 'An attempt at simulating microcontrollers in pcbs to test firmware (nrf52840 test subject)',
    language: 'C',
    stargazers_count: 0,
    fork: false,
    featured: true,
    highlight: 'Hardware Emulation'
  },
  {
    name: 'SilksongPVP',
    html_url: 'https://github.com/komeed/SilksongPVP',
    description: 'Hollow Knight Silksong PVP Mod! Over 1.2k+ downloads across the community.',
    language: 'C#',
    stargazers_count: 0,
    fork: false,
    featured: true,
    highlight: 'Game Mod (1.2k+ DLs)'
  },
  {
    name: 'Chess',
    html_url: 'https://github.com/komeed/Chess',
    description: '1400-1600 elo chess-bot entirely in C where you play against a computer.',
    language: 'C',
    stargazers_count: 0,
    fork: false,
    featured: true,
    highlight: 'AI & Game Engine'
  },
  {
    name: 'mouse',
    html_url: 'https://github.com/komeed/mouse',
    description: 'Used the PAW3212 Sensor to build a custom mouse pcb and firmware to have a fully operational mouse.',
    language: 'C++',
    stargazers_count: 0,
    fork: false,
    featured: true,
    highlight: 'Embedded / Custom PCB'
  },
  {
    name: 'ScreenTranslator',
    html_url: 'https://github.com/komeed/ScreenTranslator',
    description: "Used Apple's Vision Framework, translation framework, and MySQL to create an app that easily and quickly translates text on the computer screen.",
    language: 'Swift',
    stargazers_count: 2,
    fork: false,
    featured: true,
    highlight: 'macOS & Vision Framework'
  },
  {
    name: 'Simulator',
    html_url: 'https://github.com/komeed/Simulator',
    description: 'Simple Ball Collision Simulator in C++',
    language: 'C++',
    stargazers_count: 0,
    fork: false,
    featured: true,
    highlight: 'Physics Simulation'
  },
  {
    name: 'ChessEngine',
    html_url: 'https://github.com/komeed/ChessEngine',
    description: 'Graphics-less chess engine designed to evaluate positions and generate moves.',
    language: 'C',
    stargazers_count: 0,
    fork: false,
    featured: false
  },
  {
    name: 'rc_circuit_simulator',
    html_url: 'https://github.com/komeed/rc_circuit_simulator',
    description: 'RC circuit time response and transient analysis simulator.',
    language: 'C++',
    stargazers_count: 0,
    fork: false,
    featured: true,
    highlight: 'Circuit Simulation'
  },
  {
    name: 'IOSTranslator',
    html_url: 'https://github.com/komeed/IOSTranslator',
    description: 'Simple OCR Translator iOS application leveraging computer vision.',
    language: 'Swift',
    stargazers_count: 0,
    fork: false,
    featured: false
  },
  {
    name: 'Projects-With-Java',
    html_url: 'https://github.com/komeed/Projects-With-Java',
    description: 'Java software projects exploring data structures and algorithms.',
    language: 'Java',
    stargazers_count: 0,
    fork: false,
    featured: false
  },
  {
    name: 'unicorn',
    html_url: 'https://github.com/komeed/unicorn',
    description: 'Unicorn CPU emulator framework (ARM, AArch64, M68K, Mips, Sparc, PowerPC, RiscV, X86).',
    language: 'C',
    stargazers_count: 0,
    fork: true,
    featured: false
  },
  {
    name: 'Omeed-BSE-Portfolio',
    html_url: 'https://github.com/komeed/Omeed-BSE-Portfolio',
    description: 'BlueStamp Engineering engineering portfolio and documentation.',
    language: 'HTML',
    stargazers_count: 1,
    fork: true,
    featured: false
  }
];

// GitHub Language Color Map
const LANGUAGE_COLORS = {
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Swift: '#F05138',
  Java: '#b07219',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  Rust: '#dea584',
  Default: '#8b949e'
};

let repositories = [...INITIAL_REPOSITORIES];
let selectedLanguage = 'all';
let searchQuery = '';

// DOM Elements
const repoGrid = document.getElementById('repoGrid');
const featuredGrid = document.getElementById('featuredGrid');
const quickRepoList = document.getElementById('quickRepoList');
const repoSearch = document.getElementById('repoSearch');
const clearSearch = document.getElementById('clearSearch');
const emptyState = document.getElementById('emptyState');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const navRepoCount = document.getElementById('navRepoCount');
const quickTabCount = document.getElementById('quickTabCount');
const heroRepoCountLabel = document.getElementById('heroRepoCountLabel');
const ctaRepoCount = document.getElementById('ctaRepoCount');
const currentYear = document.getElementById('currentYear');
const quickTabTrigger = document.getElementById('quickTabTrigger');
const quickTabDrawer = document.getElementById('quickTabDrawer');
const drawerClose = document.getElementById('drawerClose');

// Set current copyright year
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

/**
 * Switch active view / tab
 */
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    const isTarget = tab.dataset.tab === tabName;
    tab.classList.toggle('active', isTarget);
    tab.setAttribute('aria-selected', String(isTarget));
  });

  panels.forEach(panel => {
    const isTarget = panel.id === `panel-${tabName}`;
    panel.classList.toggle('active', isTarget);
  });

  // Scroll gently toward top if navigating away
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Render repository cards
 */
function renderRepositories() {
  const filtered = repositories.filter((repo) => {
    const matchesLang =
      selectedLanguage === 'all' ||
      (repo.language && repo.language.toLowerCase() === selectedLanguage.toLowerCase());

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      repo.name.toLowerCase().includes(query) ||
      (repo.description && repo.description.toLowerCase().includes(query)) ||
      (repo.language && repo.language.toLowerCase().includes(query));

    return matchesLang && matchesSearch;
  });

  if (filtered.length === 0) {
    repoGrid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  repoGrid.innerHTML = filtered.map(repo => createRepoCardHTML(repo)).join('');
}

/**
 * Generate HTML string for single repo card
 */
function createRepoCardHTML(repo) {
  const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;
  const langDisplay = repo.language || 'Plain Text';
  const description = repo.description || 'No description provided.';
  const forkTag = repo.fork ? '<span class="visibility-badge">Fork</span>' : '';

  return `
    <article class="repo-card" data-name="${escapeHtml(repo.name)}">
      <div>
        <div class="card-top">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-title-link">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5z"></path>
            </svg>
            ${escapeHtml(repo.name)}
          </a>
          <div style="display: flex; gap: 6px;">
            ${forkTag}
            <span class="visibility-badge">Public</span>
          </div>
        </div>
        <p class="repo-desc">${escapeHtml(description)}</p>
      </div>

      <div class="card-bottom">
        <div class="repo-stats">
          <div class="lang-indicator">
            <span class="lang-dot" style="background-color: ${langColor};"></span>
            <span>${escapeHtml(langDisplay)}</span>
          </div>
          ${repo.stargazers_count > 0 ? `
            <div class="stat-item" title="${repo.stargazers_count} stars">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="#fbbf24">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
              </svg>
              <span>${repo.stargazers_count}</span>
            </div>
          ` : ''}
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="card-external-link" title="Open ${escapeHtml(repo.name)} on GitHub">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M3.75 2h3.5a.75.75 0 010 1.5h-3.5a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25v-3.5a.75.75 0 011.5 0v3.5A1.75 1.75 0 0112.25 14h-8.5A1.75 1.75 0 012 12.25v-8.5C2 2.784 2.784 2 3.75 2z"></path>
            <path d="M7 2.75A.75.75 0 017.75 2h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.56l-5.47 5.47a.75.75 0 11-1.06-1.06l5.47-5.47H7.75A.75.75 0 017 2.75z"></path>
          </svg>
        </a>
      </div>
    </article>
  `;
}

/**
 * Render featured items in the Featured Projects tab
 */
function renderFeatured() {
  const featured = repositories.filter(r => r.featured || r.name === 'SilksongPVP' || r.name === 'pcb_sim_cpp' || r.name === 'mouse');
  featuredGrid.innerHTML = featured.map(repo => {
    const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;
    const highlight = repo.highlight || 'Featured Project';

    return `
      <div class="featured-card">
        <div>
          <span class="featured-badge">${escapeHtml(highlight)}</span>
          <h3>${escapeHtml(repo.name)}</h3>
          <p>${escapeHtml(repo.description || 'High-performance engineering project by Omeed Kasnavi.')}</p>
        </div>
        <div class="card-bottom">
          <div class="lang-indicator">
            <span class="lang-dot" style="background-color: ${langColor};"></span>
            <span>${escapeHtml(repo.language || 'C/C++')}</span>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            View on GitHub &rarr;
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render quick drawer repository links
 */
function renderQuickTab() {
  quickRepoList.innerHTML = repositories.map(repo => {
    const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;
    return `
      <li>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="quick-repo-item">
          <span class="quick-repo-name">
            <span class="lang-dot" style="background-color: ${langColor};"></span>
            ${escapeHtml(repo.name)}
          </span>
          <span class="quick-repo-lang">${escapeHtml(repo.language || '')}</span>
        </a>
      </li>
    `;
  }).join('');
}

/**
 * Update repo counts on badges
 */
function updateCounts() {
  const count = repositories.length;
  if (navRepoCount) navRepoCount.textContent = count;
  if (quickTabCount) quickTabCount.textContent = count;
  if (ctaRepoCount) ctaRepoCount.textContent = count;
  if (heroRepoCountLabel) heroRepoCountLabel.textContent = `${count} Public Repositories`;
}

/**
 * Escape HTML to prevent injection
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Fetch live repos from GitHub API
 */
async function fetchLiveRepositories() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
    if (!res.ok) return;

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const highlightMap = {
        SilksongPVP: 'Game Mod (1.2k+ DLs)',
        pcb_sim_cpp: 'Hardware Emulation',
        mouse: 'Embedded / Custom PCB',
        Chess: 'AI & Game Engine',
        ScreenTranslator: 'macOS & Vision Framework',
        Simulator: 'Physics Simulation',
        rc_circuit_simulator: 'Circuit Simulation'
      };

      repositories = data.map(repo => ({
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        fork: repo.fork,
        featured: Boolean(highlightMap[repo.name]),
        highlight: highlightMap[repo.name] || (repo.stargazers_count > 0 ? `${repo.stargazers_count} Stars` : '')
      }));

      updateCounts();
      renderRepositories();
      renderFeatured();
      renderQuickTab();
    }
  } catch (err) {
    console.warn('GitHub API live sync fallback:', err);
  }
}

/**
 * Set up dynamic tab event listeners
 */
function setupTabs() {
  // Navigation tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  // Action buttons configured with data-action="switch-tab"
  document.querySelectorAll('[data-action="switch-tab"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target;
      if (target) {
        switchTab(target);
      }
    });
  });
}

/**
 * Filter & Search Handlers
 */
function setupFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedLanguage = pill.dataset.lang;
      renderRepositories();
    });
  });

  if (repoSearch) {
    repoSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearSearch) {
        clearSearch.style.display = searchQuery ? 'block' : 'none';
      }
      renderRepositories();
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      repoSearch.value = '';
      searchQuery = '';
      clearSearch.style.display = 'none';
      renderRepositories();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      repoSearch.value = '';
      searchQuery = '';
      selectedLanguage = 'all';
      if (clearSearch) clearSearch.style.display = 'none';

      document.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.lang === 'all');
      });

      renderRepositories();
    });
  }
}

/**
 * Quick Repositories Floating Tab Drawer Toggle
 */
function setupQuickTab() {
  if (!quickTabTrigger || !quickTabDrawer) return;

  quickTabTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = quickTabDrawer.classList.toggle('open');
    quickTabTrigger.setAttribute('aria-expanded', String(isOpen));
  });

  if (drawerClose) {
    drawerClose.addEventListener('click', (e) => {
      e.stopPropagation();
      quickTabDrawer.classList.remove('open');
      quickTabTrigger.setAttribute('aria-expanded', 'false');
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!quickTabDrawer.contains(e.target) && !quickTabTrigger.contains(e.target)) {
      quickTabDrawer.classList.remove('open');
      quickTabTrigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateCounts();
  renderRepositories();
  renderFeatured();
  renderQuickTab();
  setupTabs();
  setupFilters();
  setupQuickTab();
  fetchLiveRepositories();
});
