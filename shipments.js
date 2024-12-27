// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// Initialize shipments page
function initShipments() {
    loadUserData();
    loadShipments();
    setupEventListeners();
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

// Mock shipments data (replace with actual data from localStorage)
const mockShipments = [
    {
        trackingNumber: "DHL123456789",
        from: "New York, USA",
        to: "London, UK",
        status: "in-transit",
        date: "2024-12-27"
    },
    {
        trackingNumber: "DHL987654321",
        from: "Paris, France",
        to: "Berlin, Germany",
        status: "delivered",
        date: "2024-12-26"
    },
    {
        trackingNumber: "DHL456789123",
        from: "Tokyo, Japan",
        to: "Seoul, South Korea",
        status: "pending",
        date: "2024-12-28"
    }
];

// Pagination variables
let currentPage = 1;
const itemsPerPage = 10;
let filteredShipments = [];

// Load shipments
function loadShipments(filter = 'all') {
    // Get shipments from localStorage or use mock data
    const shipments = JSON.parse(localStorage.getItem('shipments')) || mockShipments;
    
    // Filter shipments
    filteredShipments = filter === 'all' 
        ? shipments 
        : shipments.filter(shipment => shipment.status === filter);
    
    // Update pagination
    updatePagination();
    
    // Display current page
    displayShipments();
}

// Display shipments for current page
function displayShipments() {
    const tbody = document.getElementById('shipments-tbody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageShipments = filteredShipments.slice(start, end);
    
    tbody.innerHTML = '';
    
    pageShipments.forEach(shipment => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${shipment.trackingNumber}</td>
            <td>${shipment.from}</td>
            <td>${shipment.to}</td>
            <td><span class="status-badge ${shipment.status}">${shipment.status.replace('-', ' ')}</span></td>
            <td>${formatDate(shipment.date)}</td>
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

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
    document.querySelector('.current-page').textContent = currentPage;
    document.querySelector('.total-pages').textContent = totalPages;
    
    // Update button states
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentPage = 1;
            loadShipments(btn.dataset.filter);
        });
    });
    
    // Search input
    document.getElementById('shipment-search').addEventListener('input', handleSearch);
    
    // Pagination buttons
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayShipments();
            updatePagination();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayShipments();
            updatePagination();
        }
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const shipments = JSON.parse(localStorage.getItem('shipments')) || mockShipments;
    
    filteredShipments = shipments.filter(shipment => 
        shipment.trackingNumber.toLowerCase().includes(searchTerm) ||
        shipment.from.toLowerCase().includes(searchTerm) ||
        shipment.to.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    updatePagination();
    displayShipments();
}

// View shipment details
function viewShipment(trackingNumber) {
    window.location.href = `tracking.html?tracking=${trackingNumber}`;
}

// Download shipping label
function downloadLabel(trackingNumber) {
    const btn = event.target.closest('.action-btn');
    const icon = btn.querySelector('i');
    
    btn.disabled = true;
    icon.className = 'fas fa-spinner fa-spin';
    
    setTimeout(() => {
        btn.disabled = false;
        icon.className = 'fas fa-download';
        showMessage(`Label for shipment ${trackingNumber} downloaded successfully!`, 'success');
    }, 2000);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
    initShipments();
}); 