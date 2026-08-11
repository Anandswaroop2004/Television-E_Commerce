// API Base URL Configuration
const API_BASE_URL = 'http://localhost:8080';

// App State
const state = {
    currentUser: null,
    token: null,
    rememberedEmail: null
};

// ==========================================
// 1. Router System (SPA Navigation)
// ==========================================
const router = {
    currentView: 'login',

    navigate(viewId, data = null) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });

        // Show target view
        const targetView = document.getElementById(`${viewId}-view`);
        if (targetView) {
            targetView.classList.remove('hidden');
            this.currentView = viewId;
        }

        // View-specific initialization
        if (viewId === 'verify' && data && data.email) {
            document.getElementById('verify-email').value = data.email;
        } else if (viewId === 'reset' && data && data.email) {
            document.getElementById('reset-email').value = data.email;
        } else if (viewId === 'dashboard') {
            initializeDashboard();
        } else if (viewId === 'login') {
            // Pre-fill email if remembered
            const remembered = localStorage.getItem('remember_email');
            if (remembered) {
                document.getElementById('login-email').value = remembered;
                document.getElementById('login-remember').checked = true;
            }
        }

        // Clear all form validation messages when navigating
        clearAllErrors();
    }
};

// ==========================================
// 2. Toast System
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>`;
    } else {
        iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        ${iconSvg}
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove toast after 4s
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// ==========================================
// 3. Theme Toggle Code
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function updateThemeIcons(theme) {
    if (theme === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
});

// ==========================================
// 4. Password Visibility Toggles
// ==========================================
document.querySelectorAll('.pwd-toggle').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const input = this.previousElementSibling;
        const iconShow = this.querySelector('.icon-show');
        const iconHide = this.querySelector('.icon-hide');

        if (input.type === 'password') {
            input.type = 'text';
            iconShow.classList.add('hidden');
            iconHide.classList.remove('hidden');
        } else {
            input.type = 'password';
            iconShow.classList.remove('hidden');
            iconHide.classList.add('hidden');
        }
    });
});

// ==========================================
// 5. Password Strength Meter Logic
// ==========================================
function getPasswordStrength(password) {
    if (!password) {
        return { percent: 0, label: 'Password Strength', color: 'var(--text-muted)' };
    }

    let score = 0;
    
    // Checks
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (hasMinLength) score += 1;
    if (hasUpperCase && hasLowerCase) score += 1;
    if (hasDigit) score += 1;
    if (hasSpecialChar) score += 1;

    // Output mapping
    if (password.length < 8) {
        return { percent: 25, label: 'Too Weak (Min. 8 chars)', color: 'var(--error)' };
    }

    switch(score) {
        case 1:
        case 2:
            return { percent: 50, label: 'Weak', color: 'var(--error)' };
        case 3:
            return { percent: 75, label: 'Medium', color: '#f59e0b' }; // Orange
        case 4:
            return { percent: 100, label: 'Strong', color: 'var(--success)' };
        default:
            return { percent: 0, label: 'Password Strength', color: 'var(--text-muted)' };
    }
}

function updateStrengthMeter(inputEl, fillEl, labelEl) {
    inputEl.addEventListener('input', () => {
        const result = getPasswordStrength(inputEl.value);
        fillEl.style.width = `${result.percent}%`;
        fillEl.style.backgroundColor = result.color;
        labelEl.innerText = result.label;
        labelEl.style.color = result.color;
    });
}

updateStrengthMeter(
    document.getElementById('register-password'),
    document.getElementById('strength-fill'),
    document.getElementById('strength-label')
);

updateStrengthMeter(
    document.getElementById('reset-new-password'),
    document.getElementById('reset-strength-fill'),
    document.getElementById('reset-strength-label')
);

// ==========================================
// 6. Form Validation Logic
// ==========================================
function setError(elementId, message) {
    const errSpan = document.getElementById(elementId);
    if (errSpan) {
        errSpan.innerText = message;
    }
}

function clearError(elementId) {
    const errSpan = document.getElementById(elementId);
    if (errSpan) {
        errSpan.innerText = '';
    }
}

function clearAllErrors() {
    document.querySelectorAll('.error-msg').forEach(span => {
        span.innerText = '';
    });
}

// Inline input listeners to clear errors on typing
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        clearError(`${this.id}-error`);
    });
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// ==========================================
// 7. API Handling & Form Submissions
// ==========================================

// Helper for spinner/button loading state
function setLoader(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    const textSpan = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner');
    
    if (isLoading) {
        button.disabled = true;
        if (textSpan) textSpan.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');
    } else {
        button.disabled = false;
        if (textSpan) textSpan.classList.remove('hidden');
        if (spinner) spinner.classList.add('hidden');
    }
}

// Handle Generic API Error Parsing
function parseApiError(errObject, fallbackMsg) {
    if (errObject && errObject.errors) {
        // Validation Errors (Field Specific)
        Object.keys(errObject.errors).forEach(field => {
            const errSpanId = `register-${field}-error` || `login-${field}-error` || `reset-${field}-error` || `forgot-${field}-error`;
            const matchedSpan = document.getElementById(errSpanId);
            if (matchedSpan) {
                matchedSpan.innerText = errObject.errors[field];
            }
        });
        return "Validation failed. Please correct fields.";
    }
    return (errObject && errObject.message) ? errObject.message : fallbackMsg;
}

// REGISTRATION SUBMIT
document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    clearAllErrors();

    const fullName = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const mobile = document.getElementById('register-mobile').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    let hasErrors = false;

    // Validate fields locally first
    if (!fullName) { setError('register-name-error', 'Full Name is required'); hasErrors = true; }
    if (!email) { setError('register-email-error', 'Email Address is required'); hasErrors = true; }
    else if (!validateEmail(email)) { setError('register-email-error', 'Please provide a valid email format'); hasErrors = true; }
    
    if (!mobile) { setError('register-mobile-error', 'Mobile number is required'); hasErrors = true; }
    else if (!/^[0-9]{10}$/.test(mobile)) { setError('register-mobile-error', 'Mobile number must contain exactly 10 digits'); hasErrors = true; }
    
    if (!password) { setError('register-password-error', 'Password is required'); hasErrors = true; }
    else if (password.length < 8) { setError('register-password-error', 'Password must be at least 8 characters long'); hasErrors = true; }
    
    if (!confirmPassword) { setError('register-confirm-error', 'Please confirm your password'); hasErrors = true; }
    else if (password !== confirmPassword) { setError('register-confirm-error', 'Passwords do not match'); hasErrors = true; }

    if (hasErrors) return;

    setLoader('register-submit', true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, mobile, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Registration successful!', 'success');
            // Navigate to OTP verification, passing registered email
            router.navigate('verify', { email });
        } else {
            const apiMsg = parseApiError(data, 'Registration failed');
            showToast(apiMsg, 'error');
        }
    } catch (error) {
        showToast('Network error connecting to backend server', 'error');
    } finally {
        setLoader('register-submit', false);
    }
});

// OTP VERIFICATION SUBMIT
document.getElementById('verify-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    clearAllErrors();

    const email = document.getElementById('verify-email').value.trim();
    const code = document.getElementById('verify-code').value.trim();

    if (!code || !/^[0-9]{6}$/.test(code)) {
        setError('verify-code-error', 'Please enter a valid 6-digit OTP code');
        return;
    }

    setLoader('verify-submit', true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: code })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Verification successful! Please log in.', 'success');
            router.navigate('login');
        } else {
            showToast(data.message || 'Verification failed', 'error');
        }
    } catch (error) {
        showToast('Network error connecting to backend server', 'error');
    } finally {
        setLoader('verify-submit', false);
    }
});

// RESEND OTP SUBMIT
document.getElementById('verify-resend-btn').addEventListener('click', async function(e) {
    e.preventDefault();
    const email = document.getElementById('verify-email').value.trim();

    if (!email) {
        showToast('Email address is missing', 'error');
        return;
    }

    const resendBtn = document.getElementById('verify-resend-btn');
    const timerEl = document.getElementById('verify-timer');
    const countdownEl = document.getElementById('verify-countdown');

    resendBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'A new verification OTP has been sent!', 'success');
            
            // Trigger 60-second cooldown timer
            let cooldown = 60;
            resendBtn.classList.add('hidden');
            timerEl.classList.remove('hidden');
            countdownEl.innerText = cooldown;

            const interval = setInterval(() => {
                cooldown--;
                countdownEl.innerText = cooldown;
                if (cooldown <= 0) {
                    clearInterval(interval);
                    timerEl.classList.add('hidden');
                    resendBtn.classList.remove('hidden');
                    resendBtn.disabled = false;
                }
            }, 1000);
        } else {
            showToast(data.message || 'Failed to resend OTP', 'error');
            resendBtn.disabled = false;
        }
    } catch (error) {
        showToast('Network error connecting to backend server', 'error');
        resendBtn.disabled = false;
    }
});

// LOGIN SUBMIT
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    clearAllErrors();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('login-remember').checked;

    let hasErrors = false;

    if (!email) { setError('login-email-error', 'Email is required'); hasErrors = true; }
    else if (!validateEmail(email)) { setError('login-email-error', 'Please enter a valid email format'); hasErrors = true; }
    
    if (!password) { setError('login-password-error', 'Password is required'); hasErrors = true; }

    if (hasErrors) return;

    setLoader('login-submit', true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rememberMe })
        });

        const data = await response.json();

        if (response.ok) {
            // Save authentication details
            state.token = data.token;
            state.currentUser = data;

            // Remember me email handling
            if (rememberMe) {
                localStorage.setItem('remember_email', email);
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_details', JSON.stringify(data));
            } else {
                localStorage.removeItem('remember_email');
                sessionStorage.setItem('auth_token', data.token);
                sessionStorage.setItem('user_details', JSON.stringify(data));
            }

            showToast(`Welcome back, ${data.fullName}!`, 'success');
            router.navigate('dashboard');
        } else {
            showToast(data.message || 'Invalid credentials', 'error');
            // If the account is not verified, allow them to navigate directly to Verification View
            if (response.status === 401 && data.message.includes('not verified')) {
                setTimeout(() => {
                    router.navigate('verify', { email });
                }, 1500);
            }
        }
    } catch (error) {
        showToast('Network error connecting to backend server', 'error');
    } finally {
        setLoader('login-submit', false);
    }
});

// FORGOT PASSWORD SUBMIT
document.getElementById('forgot-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    clearAllErrors();

    const email = document.getElementById('forgot-email').value.trim();

    if (!email) { setError('forgot-email-error', 'Email is required'); return; }
    else if (!validateEmail(email)) { setError('forgot-email-error', 'Please enter a valid email format'); return; }

    setLoader('forgot-submit', true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Reset OTP code has been sent!', 'success');
            router.navigate('reset', { email });
        } else {
            showToast(data.message || 'Failed to send OTP code', 'error');
        }
    } catch (error) {
        showToast('Network error connecting to backend server', 'error');
    } finally {
        setLoader('forgot-submit', false);
    }
});

// RESET PASSWORD SUBMIT
document.getElementById('reset-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    clearAllErrors();

    const email = document.getElementById('reset-email').value.trim();
    const otp = document.getElementById('reset-otp').value.trim();
    const newPassword = document.getElementById('reset-new-password').value;
    const confirmPassword = document.getElementById('reset-confirm').value;

    let hasErrors = false;

    if (!otp || !/^[0-9]{6}$/.test(otp)) {
        setError('reset-otp-error', 'Please enter the 6-digit OTP code');
        hasErrors = true;
    }
    if (!newPassword) {
        setError('reset-new-password-error', 'New password is required');
        hasErrors = true;
    } else if (newPassword.length < 8) {
        setError('reset-new-password-error', 'Password must be at least 8 characters long');
        hasErrors = true;
    }
    if (!confirmPassword) {
        setError('reset-confirm-error', 'Please confirm the password');
        hasErrors = true;
    } else if (newPassword !== confirmPassword) {
        setError('reset-confirm-error', 'Passwords do not match');
        hasErrors = true;
    }

    if (hasErrors) return;

    setLoader('reset-submit', true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Password reset successful! Please log in.', 'success');
            router.navigate('login');
        } else {
            showToast(data.message || 'Reset failed. Check OTP and verify passwords.', 'error');
        }
    } catch (error) {
        showToast('Network error connecting to backend server', 'error');
    } finally {
        setLoader('reset-submit', false);
    }
});

// ==========================================
// 8. Secure Dashboard Details & Logout
// ==========================================
async function initializeDashboard() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const userJson = localStorage.getItem('user_details') || sessionStorage.getItem('user_details');
    
    if (!token || !userJson) {
        showToast('Session expired. Please log in.', 'error');
        router.navigate('login');
        return;
    }

    const user = JSON.parse(userJson);
    document.getElementById('dashboard-user-name').innerText = user.fullName;
    document.getElementById('dashboard-user-email').innerText = user.email;
    
    const roleBadge = document.getElementById('dashboard-user-role');
    roleBadge.innerText = user.role;
    // Set admin specific class
    if (user.role === 'ADMIN') {
        roleBadge.style.backgroundColor = 'var(--error-bg)';
        roleBadge.style.color = 'var(--error)';
    } else {
        roleBadge.style.backgroundColor = 'var(--primary-glow)';
        roleBadge.style.color = 'var(--primary)';
    }

    const serverMsgEl = document.getElementById('dashboard-server-msg');
    serverMsgEl.innerText = "Querying secure API endpoint `/api/home`...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/home`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            serverMsgEl.innerText = JSON.stringify(data, null, 2);
        } else {
            serverMsgEl.innerText = `Access Denied: ${response.status} - ${data.message || 'Unauthorized'}`;
            showToast('Unable to authenticate with secure API', 'error');
        }
    } catch (error) {
        serverMsgEl.innerText = "Error: Could not connect to API server. Ensure backend is running.";
    }
}

// LOGOUT
document.getElementById('logout-btn').addEventListener('click', () => {
    // Clear tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_details');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_details');
    
    state.token = null;
    state.currentUser = null;

    showToast('Signed out successfully', 'info');
    router.navigate('login');
});

// ==========================================
// 9. App Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Check if token exists to auto-login
    const savedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (savedToken) {
        router.navigate('dashboard');
    } else {
        router.navigate('login');
    }
});
