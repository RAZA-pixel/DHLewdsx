// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Initialize dashboard
function initDashboard() {
    // Set user name
    const userName = localStorage.getItem('userName') || 'User';
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = userName.split(' ')[0];
    });

    // Initialize stats counter animation
    animateStats();

    // Initialize shipments table
    loadShipments();
}

// Animate statistics
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        animateValue(stat, 0, target, 2000);
    });
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Mock shipments data
const shipments = [
    {
        trackingNumber: "DHL123456789",
        from: "New York, USA",
        to: "London, UK",
        status: "in-transit",
        date: "Dec 27, 2024"
    },
    {
        trackingNumber: "DHL987654321",
        from: "Paris, France",
        to: "Berlin, Germany",
        status: "delivered",
        date: "Dec 26, 2024"
    }
];

// Load shipments table
function loadShipments() {
    const tbody = document.querySelector('.shipments-table tbody');
    tbody.innerHTML = '';

    shipments.forEach(shipment => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${shipment.trackingNumber}</td>
            <td>${shipment.from}</td>
            <td>${shipment.to}</td>
            <td><span class="status-badge ${shipment.status}">${shipment.status.replace('-', ' ')}</span></td>
            <td>${shipment.date}</td>
            <td>
                <button class="action-btn" title="View Details" onclick="viewShipment('${shipment.trackingNumber}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" title="Download Label" onclick="downloadLabel('${shipment.trackingNumber}')">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Shipment actions
function viewShipment(trackingNumber) {
    window.location.href = `tracking.html?tracking=${trackingNumber}`;
}

function downloadLabel(trackingNumber) {
    // Simulate label download
    const btn = event.target.closest('.action-btn');
    const icon = btn.querySelector('i');
    
    btn.disabled = true;
    icon.className = 'fas fa-spinner fa-spin';
    
    setTimeout(() => {
        btn.disabled = false;
        icon.className = 'fas fa-download';
        alert(`Label for shipment ${trackingNumber} downloaded successfully!`);
    }, 2000);
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.shipments-table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// Quick action buttons
const actionButtons = document.querySelectorAll('.action-card');
actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.querySelector('span').textContent.toLowerCase();
        
        switch (action) {
            case 'new shipment':
                window.location.href = 'create-shipment.html';
                break;
            case 'track package':
                window.location.href = 'tracking.html';
                break;
            case 'view invoices':
                window.location.href = 'invoices.html';
                break;
            case 'address book':
                window.location.href = 'address-book.html';
                break;
        }
    });
});

// User menu
const userBtn = document.querySelector('.user-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (userBtn && dropdownMenu) {
    userBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
}

// Logout functionality
const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
    });
}

// Notifications
const notificationBtn = document.querySelector('.icon-btn[title="Notifications"]');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        alert('Notifications feature coming soon!');
    });
}

// Messages
const messageBtn = document.querySelector('.icon-btn[title="Messages"]');
if (messageBtn) {
    messageBtn.addEventListener('click', () => {
        alert('Messages feature coming soon!');
    });
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initDashboard();
}); 