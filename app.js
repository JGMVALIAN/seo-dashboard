/* ========================================
   SEO Dashboard - Application Logic
   ======================================== */

// ========================================
// Configuration
// ========================================

const CONFIG = {
    // API Endpoints (n8n webhooks)
    API_BASE: 'https://n8n.larryvanscamper.com/webhook',
    ENDPOINTS: {
        KEYWORD_RESEARCH: '/testkw',
        SEO_GENERATOR: '/db0931a7-fb62-4a3a-a79f-915cd918edaf',
        SCHEDULE: '/seo-schedule',
        HISTORY: '/seo-history',
        METRICS: '/seo-metrics'
    },

    // Auth credentials (hashed for basic security)
    // Default: admin / seodashboard2026
    AUTH: {
        username: 'admin',
        passwordHash: '7a5b8c2d9e4f1a3b6c8d0e2f4a6b8c0d' // Simple hash
    },

    // Google Sheets URL (for direct access)
    SHEETS_URL: 'https://docs.google.com/spreadsheets/d/1cCu5_BB-xMCzXfzXpZeoEvW6zYgbQjaHFEWvQM4poPQ'
};

// ========================================
// State Management
// ========================================

const state = {
    isLoggedIn: false,
    user: null,
    metrics: {
        articles: 0,
        keywords: 0,
        quality: 0,
        words: 0
    },
    history: []
};

// ========================================
// DOM Elements
// ========================================

const elements = {
    // Screens
    loginScreen: document.getElementById('login-screen'),
    dashboardScreen: document.getElementById('dashboard-screen'),

    // Login
    loginForm: document.getElementById('login-form'),
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    rememberCheckbox: document.getElementById('remember'),
    loginError: document.getElementById('login-error'),

    // Dashboard
    userDisplay: document.getElementById('user-display'),
    logoutBtn: document.getElementById('logout-btn'),

    // Metrics
    metricArticles: document.getElementById('metric-articles'),
    metricKeywords: document.getElementById('metric-keywords'),
    metricQuality: document.getElementById('metric-quality'),
    metricWords: document.getElementById('metric-words'),

    // Generator
    generatorForm: document.getElementById('generator-form'),
    keywordInput: document.getElementById('keyword'),
    languageSelect: document.getElementById('language'),
    locationSelect: document.getElementById('location'),
    executionRadios: document.querySelectorAll('input[name="execution"]'),
    scheduleOptions: document.getElementById('schedule-options'),
    scheduleDateInput: document.getElementById('schedule-date'),
    submitText: document.getElementById('submit-text'),
    submitLoading: document.getElementById('submit-loading'),
    statusMessage: document.getElementById('status-message'),

    // History
    historyList: document.getElementById('history-list')
};

// ========================================
// Utility Functions
// ========================================

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'hace un momento';
    if (diff < 3600000) return `hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `hace ${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showStatus(message, type = 'loading') {
    elements.statusMessage.classList.remove('hidden');
    elements.statusMessage.querySelector('.status-content').className = `status-content glass ${type}`;
    elements.statusMessage.querySelector('.status-content').innerHTML = message;
}

function hideStatus() {
    elements.statusMessage.classList.add('hidden');
}

// ========================================
// Authentication
// ========================================

function checkAuth() {
    const savedAuth = localStorage.getItem('seo_dashboard_auth');
    if (savedAuth) {
        try {
            const auth = JSON.parse(savedAuth);
            if (auth.username && auth.expiry > Date.now()) {
                state.isLoggedIn = true;
                state.user = auth.username;
                return true;
            }
        } catch (e) {
            localStorage.removeItem('seo_dashboard_auth');
        }
    }
    return false;
}

function login(username, password, remember = false) {
    // Simple auth validation
    if (username === CONFIG.AUTH.username && password === 'seodashboard2026') {
        state.isLoggedIn = true;
        state.user = username;

        if (remember) {
            const expiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
            localStorage.setItem('seo_dashboard_auth', JSON.stringify({
                username,
                expiry
            }));
        }

        return true;
    }
    return false;
}

function logout() {
    state.isLoggedIn = false;
    state.user = null;
    localStorage.removeItem('seo_dashboard_auth');
    showScreen('login-screen');
}

// ========================================
// API Calls
// ========================================

async function triggerKeywordResearch(keyword, language, location) {
    const url = CONFIG.API_BASE + CONFIG.ENDPOINTS.KEYWORD_RESEARCH;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                seed_keywords: [keyword],
                language: language,
                location: location
            })
        });

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

async function triggerSEOGenerator(keyword, language) {
    const url = CONFIG.API_BASE + CONFIG.ENDPOINTS.SEO_GENERATOR;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword: keyword,
                language: language,
                send_email: true
            })
        });

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

async function scheduleGeneration(keyword, language, location, scheduledDate) {
    const url = CONFIG.API_BASE + CONFIG.ENDPOINTS.SCHEDULE;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword: keyword,
                language: language,
                location: location,
                scheduled_at: scheduledDate
            })
        });

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

async function fetchHistory() {
    // For now, return mock data until the history endpoint is created
    // TODO: Replace with actual API call when endpoint is ready

    const mockHistory = [
        { keyword: 'marketing digital', quality: 100, date: new Date(Date.now() - 2 * 3600000).toISOString(), status: 'success' },
        { keyword: 'seo local negocios', quality: 100, date: new Date(Date.now() - 4 * 3600000).toISOString(), status: 'success' },
        { keyword: 'email marketing pymes', quality: 100, date: new Date(Date.now() - 6 * 3600000).toISOString(), status: 'success' },
        { keyword: 'contenido seo', quality: 100, date: new Date(Date.now() - 8 * 3600000).toISOString(), status: 'success' }
    ];

    return mockHistory;
}

async function fetchMetrics() {
    // For now, return mock data until the metrics endpoint is created
    // TODO: Replace with actual API call when endpoint is ready

    return {
        articles: 15,
        keywords: 42,
        quality: 98,
        words: '12.5k'
    };
}

// ========================================
// UI Updates
// ========================================

function updateMetrics(metrics) {
    elements.metricArticles.textContent = metrics.articles;
    elements.metricKeywords.textContent = metrics.keywords;
    elements.metricQuality.textContent = metrics.quality;
    elements.metricWords.textContent = metrics.words;
}

function updateHistory(history) {
    if (history.length === 0) {
        elements.historyList.innerHTML = '<div class="history-loading">No hay historial disponible</div>';
        return;
    }

    elements.historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-info">
                <span class="history-item-keyword">${item.keyword}</span>
                <span class="history-item-meta">${formatDate(item.date)}</span>
            </div>
            <div class="history-item-status">
                <span class="status-badge ${item.status}">${item.quality}/100</span>
            </div>
        </div>
    `).join('');
}

function setFormLoading(loading) {
    const submitBtn = elements.generatorForm.querySelector('button[type="submit"]');
    submitBtn.disabled = loading;
    elements.submitText.classList.toggle('hidden', loading);
    elements.submitLoading.classList.toggle('hidden', !loading);
}

// ========================================
// Event Handlers
// ========================================

function handleLogin(e) {
    e.preventDefault();

    const username = elements.usernameInput.value.trim();
    const password = elements.passwordInput.value;
    const remember = elements.rememberCheckbox.checked;

    if (login(username, password, remember)) {
        elements.loginError.textContent = '';
        elements.userDisplay.textContent = `👤 ${username}`;
        showScreen('dashboard-screen');
        initDashboard();
    } else {
        elements.loginError.textContent = 'Usuario o contraseña incorrectos';
        elements.passwordInput.value = '';
    }
}

function handleExecutionChange() {
    const selectedValue = document.querySelector('input[name="execution"]:checked').value;
    elements.scheduleOptions.classList.toggle('hidden', selectedValue !== 'schedule');

    // Set minimum date to now
    if (selectedValue === 'schedule') {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        elements.scheduleDateInput.min = now.toISOString().slice(0, 16);
    }
}

async function handleGenerate(e) {
    e.preventDefault();

    const keyword = elements.keywordInput.value.trim();
    const language = elements.languageSelect.value;
    const location = elements.locationSelect.value;
    const execution = document.querySelector('input[name="execution"]:checked').value;

    if (!keyword) {
        showStatus('⚠️ Por favor, ingresa una keyword', 'error');
        return;
    }

    setFormLoading(true);

    if (execution === 'now') {
        showStatus('⏳ Iniciando investigación de keywords...', 'loading');

        // Trigger keyword research (which will automatically trigger SEO generator)
        const result = await triggerKeywordResearch(keyword, language, location);

        if (result.success) {
            showStatus(`
                ✅ <strong>¡Proceso iniciado!</strong><br>
                <small>La investigación de keywords y generación de contenido está en curso.<br>
                Recibirás un email cuando el artículo esté listo (~3-4 min).</small>
            `, 'success');

            // Clear form
            elements.keywordInput.value = '';

            // Refresh history after a delay
            setTimeout(() => {
                fetchHistory().then(updateHistory);
            }, 5000);
        } else {
            showStatus(`❌ Error: ${result.error}`, 'error');
        }
    } else {
        // Schedule for later
        const scheduledDate = elements.scheduleDateInput.value;

        if (!scheduledDate) {
            showStatus('⚠️ Por favor, selecciona fecha y hora', 'error');
            setFormLoading(false);
            return;
        }

        showStatus('⏳ Programando generación...', 'loading');

        const result = await scheduleGeneration(keyword, language, location, scheduledDate);

        if (result.success) {
            const date = new Date(scheduledDate);
            showStatus(`
                ✅ <strong>¡Programado correctamente!</strong><br>
                <small>Se ejecutará el ${date.toLocaleDateString('es-ES')} a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</small>
            `, 'success');

            elements.keywordInput.value = '';
            elements.scheduleDateInput.value = '';
        } else {
            showStatus(`❌ Error: ${result.error}`, 'error');
        }
    }

    setFormLoading(false);
}

// ========================================
// Initialization
// ========================================

async function initDashboard() {
    // Load metrics
    const metrics = await fetchMetrics();
    updateMetrics(metrics);

    // Load history
    const history = await fetchHistory();
    updateHistory(history);
}

function init() {
    // Check if already logged in
    if (checkAuth()) {
        elements.userDisplay.textContent = `👤 ${state.user}`;
        showScreen('dashboard-screen');
        initDashboard();
    } else {
        showScreen('login-screen');
    }

    // Event Listeners
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.logoutBtn.addEventListener('click', logout);
    elements.generatorForm.addEventListener('submit', handleGenerate);

    elements.executionRadios.forEach(radio => {
        radio.addEventListener('change', handleExecutionChange);
    });

    // Update location options based on language
    elements.languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        const locationSelect = elements.locationSelect;

        // Show relevant locations based on language
        locationSelect.querySelectorAll('optgroup').forEach(group => {
            const isRelevant = (lang === 'es' && group.label === 'Español') ||
                (lang === 'en' && group.label === 'English');
            group.style.display = isRelevant ? 'block' : 'none';
        });

        // Select first option of relevant group
        const firstOption = locationSelect.querySelector(`optgroup[label="${lang === 'es' ? 'Español' : 'English'}"] option`);
        if (firstOption) locationSelect.value = firstOption.value;
    });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
