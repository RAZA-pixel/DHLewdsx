// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Initialize create shipment page
function initCreateShipment() {
    loadUserData();
    setupEventListeners();
    prefillSenderInfo();
}

// Load user data
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    document.querySelector('.user-name').textContent = 
        userData.firstName ? `${userData.firstName} ${userData.lastName}` : 'User';
    
    const profileAvatar = document.getElementById('profile-avatar');
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        profileAvatar.src = savedAvatar;
    }
}

// Prefill sender information from user data
function prefillSenderInfo() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (userData) {
        document.getElementById('senderName').value = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        document.getElementById('senderEmail').value = userData.email || '';
        document.getElementById('senderPhone').value = userData.phone || '';
        document.getElementById('senderAddress').value = userData.address || '';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('shipment-form').addEventListener('submit', handleShipmentSubmit);
    
    // Package type change
    document.getElementById('packageType').addEventListener('change', handlePackageTypeChange);
    
    // Service type change
    document.getElementById('service').addEventListener('change', updateShippingCost);
    
    // Weight and dimensions change
    ['weight', 'length', 'width', 'height'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateShippingCost);
    });
}

// Handle package type change
function handlePackageTypeChange(e) {
    const packageType = e.target.value;
    const dimensionsGroup = document.querySelector('.dimensions-group');
    const weightInput = document.getElementById('weight');
    
    if (packageType === 'document') {
        dimensionsGroup.style.display = 'none';
        weightInput.max = '2';
        weightInput.value = Math.min(weightInput.value, 2);
    } else {
        dimensionsGroup.style.display = 'flex';
        weightInput.max = packageType === 'parcel' ? '70' : '1000';
    }
    
    updateShippingCost();
}

// Update shipping cost
function updateShippingCost() {
    const packageType = document.getElementById('packageType').value;
    const service = document.getElementById('service').value;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const length = parseFloat(document.getElementById('length').value) || 0;
    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    
    // Calculate volumetric weight
    const volumetricWeight = (length * width * height) / 5000;
    const chargeableWeight = Math.max(weight, volumetricWeight);
    
    // Base rates per kg
    const rates = {
        express: 25,
        standard: 15,
        economy: 10
    };
    
    let cost = 0;
    
    if (packageType && service) {
        // Calculate base cost
        cost = chargeableWeight * (rates[service] || 0);
        
        // Add package type surcharge
        if (packageType === 'freight') {
            cost *= 1.5;
        }
        
        // Add insurance cost
        const insurance = document.getElementById('insurance').value;
        const declaredValue = parseFloat(document.getElementById('value').value) || 0;
        
        const insuranceRates = {
            basic: 0.01,
            extended: 0.02,
            premium: 0.03
        };
        
        cost += declaredValue * (insuranceRates[insurance] || 0);
    }
    
    // Update cost display if it exists
    const costDisplay = document.querySelector('.shipping-cost');
    if (costDisplay) {
        costDisplay.textContent = cost > 0 ? `$${cost.toFixed(2)}` : 'Calculate';
    }
}

// Generate tracking number
function generateTrackingNumber() {
    const prefix = 'DHL';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Handle shipment form submission
function handleShipmentSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const shipmentData = {
        trackingNumber: generateTrackingNumber(),
        status: 'pending',
        date: new Date().toISOString(),
        sender: {
            name: document.getElementById('senderName').value,
            email: document.getElementById('senderEmail').value,
            phone: document.getElementById('senderPhone').value,
            company: document.getElementById('senderCompany').value,
            address: document.getElementById('senderAddress').value
        },
        recipient: {
            name: document.getElementById('recipientName').value,
            email: document.getElementById('recipientEmail').value,
            phone: document.getElementById('recipientPhone').value,
            company: document.getElementById('recipientCompany').value,
            address: document.getElementById('recipientAddress').value
        },
        package: {
            type: document.getElementById('packageType').value,
            weight: document.getElementById('weight').value,
            dimensions: {
                length: document.getElementById('length').value,
                width: document.getElementById('width').value,
                height: document.getElementById('height').value
            },
            declaredValue: document.getElementById('value').value
        },
        shipping: {
            service: document.getElementById('service').value,
            insurance: document.getElementById('insurance').value
        }
    };
    
    // Save shipment to localStorage
    const shipments = JSON.parse(localStorage.getItem('shipments')) || [];
    shipments.push(shipmentData);
    localStorage.setItem('shipments', JSON.stringify(shipments));
    
    // Show success message
    showMessage('Shipment created successfully! Redirecting to shipments page...', 'success');
    
    // Redirect to shipments page after 2 seconds
    setTimeout(() => {
        window.location.href = 'shipments.html';
    }, 2000);
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
    document.querySelector('.main-content').insertBefore(
        messageDiv,
        document.querySelector('.content-header')
    );
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.remove('animate__fadeInDown');
        messageDiv.classList.add('animate__fadeOutUp');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initCreateShipment();
}); 