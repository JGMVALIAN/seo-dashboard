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

    // Auth credentials
    AUTH: {
        username: 'admin',
        password: 'seodashboard2026'
    },

    // Auto refresh interval (ms)
    REFRESH_INTERVAL: 30000
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
    history: [],
    pendingSchedule: null
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
    togglePasswordBtn: document.getElementById('toggle-password'),
    rememberCheckbox: document.getElementById('remember'),
    loginError: document.getElementById('login-error'),

    // Dashboard
    userDisplay: document.getElementById('user-display'),
    logoutBtn: document.getElementById('logout-btn'),

    // Metrics
    metricArticles: document.getElementById('metric-articles'),
    metricKeywords: document.getElementById('metric-keywords'),
    metricQuality: document.getElementById('metric-quality'),
    qualityBar: document.getElementById('quality-bar'),
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

    // Schedule Modal
    scheduleModal: document.getElementById('schedule-modal'),
    modalKeyword: document.getElementById('modal-keyword'),
    modalScheduleDate: document.getElementById('modal-schedule-date'),

    // History
    historyList: document.getElementById('history-list'),

    // Notifications
    notificationsContainer: document.getElementById('notifications-container')
};

// ========================================
// Utility Functions
// ========================================

function formatDate(dateStr) {
    if (!dateStr) return 'n/a';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    if (isNaN(date.getTime())) return 'n/a';

    if (diff < 60000) return 'hace un momento';
    if (diff < 3600000) return `hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `hace ${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ========================================
// Notification System
// ========================================

function showNotification(message, type = 'success', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `glass-toast pointer-events-auto rounded-lg p-4 flex items-start gap-4 transform transition-all duration-500 ease-out hover:scale-[1.02] cursor-default relative overflow-hidden group animate-slide-in`;

    const colors = {
        success: 'bg-emerald-500',
        error: 'bg-rose-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: 'check',
        error: 'warning',
        warning: 'info',
        info: 'info'
    };

    notification.innerHTML = `
        <div class="absolute left-0 top-0 bottom-0 w-1 ${colors[type]} rounded-l-lg"></div>
        <div class="flex-shrink-0 mt-0.5">
            <div class="h-6 w-6 rounded-full bg-${type === 'success' ? 'emerald' : type === 'error' ? 'rose' : type === 'warning' ? 'amber' : 'blue'}-100 flex items-center justify-center text-${type === 'success' ? 'emerald' : type === 'error' ? 'rose' : type === 'warning' ? 'amber' : 'blue'}-600">
                <span class="material-symbols-outlined text-[16px] font-bold">${icons[type]}</span>
            </div>
        </div>
        <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-slate-800 leading-5 capitalize">${type}</h4>
            <p class="text-sm text-slate-600 mt-0.5 leading-5 font-medium">${message}</p>
        </div>
        <button class="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
    `;

    elements.notificationsContainer.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 500);
    }, duration);
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
    if (username === CONFIG.AUTH.username && password === CONFIG.AUTH.password) {
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
    showNotification('Sesión cerrada correctamente', 'info');
}

function togglePasswordVisibility() {
    const type = elements.passwordInput.type === 'password' ? 'text' : 'password';
    elements.passwordInput.type = type;
    elements.togglePasswordBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">${type === 'password' ? 'visibility' : 'visibility_off'}</span>`;
}

// ========================================
// Schedule Modal Functions
// ========================================

function openScheduleModal() {
    const keyword = elements.keywordInput.value.trim();
    if (!keyword) {
        showNotification('Por favor, ingresa una keyword primero', 'warning');
        elements.keywordInput.focus();
        return;
    }

    state.pendingSchedule = {
        keyword: keyword,
        language: elements.languageSelect.value,
        location: elements.locationSelect.value
    };

    elements.modalKeyword.textContent = keyword;
    elements.modalKeyword.title = keyword;

    // Set minimum date to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    elements.modalScheduleDate.min = now.toISOString().slice(0, 16);

    elements.scheduleModal.classList.remove('hidden');
}

function closeScheduleModal() {
    elements.scheduleModal.classList.add('hidden');
    state.pendingSchedule = null;
}

async function confirmSchedule() {
    const scheduledDate = elements.modalScheduleDate.value;

    if (!scheduledDate) {
        showNotification('Por favor, selecciona fecha y hora', 'warning');
        return;
    }

    if (!state.pendingSchedule) {
        showNotification('Error: No hay datos de programación', 'error');
        return;
    }

    closeScheduleModal();
    setFormLoading(true);

    const result = await scheduleGeneration(
        state.pendingSchedule.keyword,
        state.pendingSchedule.language,
        state.pendingSchedule.location,
        scheduledDate
    );

    if (result.success) {
        const date = new Date(scheduledDate);
        showNotification(
            `¡Programado para el ${date.toLocaleDateString('es-ES')} a las ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}!`,
            'success'
        );

        elements.keywordInput.value = '';
        elements.scheduleDateInput.value = '';
        setTimeout(initDashboard, 2000);
    } else {
        showNotification(result.error || 'Error al programar', 'error');
    }

    setFormLoading(false);
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

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

async function triggerSEOGenerator(keyword, language, location) {
    // Correct Endpoint for "SEO Content Generator - Simple complete"
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
                location: location, // Added location
                send_email: true
            })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

// ... (scheduleGeneration remains the same)

// ...

async function handleGenerate(e) {
    e.preventDefault();

    const keyword = elements.keywordInput.value.trim();
    const language = elements.languageSelect.value;
    const location = elements.locationSelect.value;
    const execution = document.querySelector('input[name="execution"]:checked').value;

    if (!keyword) {
        showNotification('Por favor, ingresa una keyword', 'warning');
        return;
    }

    setFormLoading(true);

    if (execution === 'now') {
        showNotification('Iniciando generación de contenido...', 'info', 3000);

        // FIX: Use triggerSEOGenerator instead of triggerKeywordResearch
        const result = await triggerSEOGenerator(keyword, language, location);

        if (result.success) {
            showNotification('¡Proceso iniciado! Recibirás un email pronto.', 'success');
            elements.keywordInput.value = '';
            setTimeout(initDashboard, 5000);
        } else {
            showNotification(`Error: ${result.error}`, 'error');
        }
    } else {
        // Open schedule modal instead
        openScheduleModal();
        setFormLoading(false);
        return;
    }

    setFormLoading(false);
}

// ========================================
// Initialization
// ========================================

async function initDashboard() {
    const metrics = await fetchMetrics();
    updateMetrics(metrics);

    const history = await fetchHistory();
    updateHistory(history);

    // Update DB status
    const dbStatus = document.getElementById('db-status');
    if (dbStatus) {
        dbStatus.textContent = 'Actualizado ahora';
        setTimeout(() => {
            dbStatus.textContent = 'Actualizado hace un momento';
        }, 60000);
    }
}

function init() {
    // Check auth
    if (checkAuth()) {
        elements.userDisplay.textContent = state.user;
        document.getElementById('user-avatar').style.backgroundImage = `url('https://ui-avatars.com/api/?name=${state.user}&background=2563eb&color=fff')`;
        showScreen('dashboard-screen');
        initDashboard();
    } else {
        showScreen('login-screen');
    }

    // Event listeners
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    elements.logoutBtn.addEventListener('click', logout);
    elements.generatorForm.addEventListener('submit', handleGenerate);

    elements.executionRadios.forEach(radio => {
        radio.addEventListener('change', handleExecutionChange);
    });

    elements.languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        const locationSelect = elements.locationSelect;
        locationSelect.querySelectorAll('optgroup').forEach(group => {
            const isRelevant = (lang === 'es' && group.label === 'Español') ||
                (lang === 'en' && group.label === 'English');
            group.style.display = isRelevant ? 'block' : 'none';
        });
        const firstOption = locationSelect.querySelector(`optgroup[label="${lang === 'es' ? 'Español' : 'English'}"] option`);
        if (firstOption) locationSelect.value = firstOption.value;
    });

    // Close modal on backdrop click
    elements.scheduleModal.addEventListener('click', (e) => {
        if (e.target === elements.scheduleModal) {
            closeScheduleModal();
        }
    });

    // Auto refresh every 30s
    setInterval(initDashboard, CONFIG.REFRESH_INTERVAL);
}

// Start app
document.addEventListener('DOMContentLoaded', init);
