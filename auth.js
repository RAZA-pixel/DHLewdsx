// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Toggle password visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling.previousElementSibling;
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}

function validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

// Show message function
function showMessage(form, message, type) {
    // Remove existing messages
    const existingMessage = form.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} animate__animated animate__fadeIn`;
    messageDiv.textContent = message;
    
    // Add message before the form
    form.insertBefore(messageDiv, form.firstChild);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.remove('animate__fadeIn');
        messageDiv.classList.add('animate__fadeOut');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Login form handler
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validate form
        if (!email || !password) {
            showMessage(loginForm, 'Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showMessage(loginForm, 'Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate login
        const submitBtn = loginForm.querySelector('.auth-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        setTimeout(() => {
            // Simulate successful login
            localStorage.setItem('isLoggedIn', 'true');
            if (remember) {
                localStorage.setItem('userEmail', email);
            }
            
            showMessage(loginForm, 'Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 2000);
    });
}

// Signup form handler
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Validate form
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            showMessage(signupForm, 'Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showMessage(signupForm, 'Please enter a valid email address', 'error');
            return;
        }
        
        if (!validatePhone(phone)) {
            showMessage(signupForm, 'Please enter a valid phone number', 'error');
            return;
        }
        
        if (!validatePassword(password)) {
            showMessage(signupForm, 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage(signupForm, 'Passwords do not match', 'error');
            return;
        }
        
        if (!terms) {
            showMessage(signupForm, 'Please agree to the Terms & Conditions', 'error');
            return;
        }
        
        // Simulate signup
        const submitBtn = signupForm.querySelector('.auth-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        setTimeout(() => {
            // Simulate successful signup
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', `${firstName} ${lastName}`);
            
            showMessage(signupForm, 'Account created successfully! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 2000);
    });
}

// Social auth handlers
const socialBtns = document.querySelectorAll('.social-btn');

socialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.disabled = true;
        const provider = btn.classList.contains('google') ? 'Google' : 'Microsoft';
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting to ${provider}...`;
        
        // Simulate social auth
        setTimeout(() => {
            showMessage(
                btn.closest('.auth-box').querySelector('form'),
                `${provider} authentication successful! Redirecting...`,
                'success'
            );
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 2000);
    });
}); 