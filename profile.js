// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Initialize profile
function initProfile() {
    loadUserData();
    loadPreferences();
    setupEventListeners();
}

// Load user data from local storage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Set form values
    document.getElementById('firstName').value = userData.firstName || '';
    document.getElementById('lastName').value = userData.lastName || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('address').value = userData.address || '';
    
    // Set user name in navigation
    document.querySelector('.user-name').textContent = 
        userData.firstName ? `${userData.firstName} ${userData.lastName}` : 'User';
    
    // Set avatar if exists
    const avatarPreview = document.getElementById('avatar-preview');
    const profileAvatar = document.getElementById('profile-avatar');
    const savedAvatar = localStorage.getItem('userAvatar');
    
    if (savedAvatar) {
        avatarPreview.src = savedAvatar;
        profileAvatar.src = savedAvatar;
    }
}

// Load user preferences from local storage
function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    
    document.getElementById('emailNotifications').checked = preferences.emailNotifications || false;
    document.getElementById('smsNotifications').checked = preferences.smsNotifications || false;
    document.getElementById('marketingEmails').checked = preferences.marketingEmails || false;
    document.getElementById('twoFactorAuth').checked = preferences.twoFactorAuth || false;
}

// Setup event listeners
function setupEventListeners() {
    // Profile form submission
    document.getElementById('profile-form').addEventListener('submit', handleProfileSubmit);
    
    // Avatar upload
    document.getElementById('avatar-upload').addEventListener('change', handleAvatarUpload);
    
    // Password form submission
    document.getElementById('password-form').addEventListener('submit', handlePasswordChange);
    
    // Delete account form submission
    document.getElementById('delete-form').addEventListener('submit', handleAccountDelete);
}

// Handle profile form submission
function handleProfileSubmit(e) {
    e.preventDefault();
    
    const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };
    
    const preferences = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        marketingEmails: document.getElementById('marketingEmails').checked,
        twoFactorAuth: document.getElementById('twoFactorAuth').checked
    };
    
    // Save to local storage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Update user name in navigation
    document.querySelector('.user-name').textContent = `${userData.firstName} ${userData.lastName}`;
    
    // Show success message
    showMessage('Profile updated successfully!', 'success');
}

// Handle avatar upload
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const avatarPreview = document.getElementById('avatar-preview');
            const profileAvatar = document.getElementById('profile-avatar');
            const avatarUrl = e.target.result;
            
            avatarPreview.src = avatarUrl;
            profileAvatar.src = avatarUrl;
            
            // Save to local storage
            localStorage.setItem('userAvatar', avatarUrl);
            
            // Show success message
            showMessage('Profile picture updated successfully!', 'success');
        };
        
        reader.readAsDataURL(file);
    }
}

// Handle password change
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // Validate passwords
    if (newPassword !== confirmNewPassword) {
        showMessage('New passwords do not match!', 'error');
        return;
    }
    
    // Validate current password (mock validation)
    const savedPassword = localStorage.getItem('userPassword');
    if (savedPassword && currentPassword !== savedPassword) {
        showMessage('Current password is incorrect!', 'error');
        return;
    }
    
    // Save new password
    localStorage.setItem('userPassword', newPassword);
    
    // Close modal and show success message
    closeModal('password-modal');
    showMessage('Password changed successfully!', 'success');
    
    // Reset form
    e.target.reset();
}

// Handle account deletion
function handleAccountDelete(e) {
    e.preventDefault();
    
    const confirmText = document.getElementById('deleteConfirm').value;
    
    if (confirmText !== 'DELETE') {
        showMessage('Please type "DELETE" to confirm account deletion', 'error');
        return;
    }
    
    // Clear all user data from local storage
    localStorage.clear();
    
    // Show success message and redirect
    showMessage('Account deleted successfully. Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Show modal
function showChangePasswordModal() {
    document.getElementById('password-modal').classList.add('show');
}

function showDeleteAccountModal() {
    document.getElementById('delete-modal').classList.add('show');
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Show message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} animate__animated animate__fadeInDown`;
    messageDiv.textContent = message;
    
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add new message
    document.querySelector('.profile-container').insertBefore(
        messageDiv,
        document.querySelector('.profile-header')
    );
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.remove('animate__fadeInDown');
        messageDiv.classList.add('animate__fadeOutUp');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initProfile();
}); 