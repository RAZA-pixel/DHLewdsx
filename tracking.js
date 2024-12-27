// Mock shipment data (same as in main.js)
const shipments = [
    {
        trackingNumber: "DHL123456",
        status: "In Transit",
        estimatedDelivery: "2024-12-30",
        history: [
            { date: "2024-12-24", status: "Order Received", location: "New York, USA" },
            { date: "2024-12-25", status: "Shipped from Origin", location: "New York, USA" },
            { date: "2024-12-27", status: "Arrived at Destination Hub", location: "London, UK" }
        ]
    },
    {
        trackingNumber: "DHL789012",
        status: "Delivered",
        estimatedDelivery: "2024-12-26",
        history: [
            { date: "2024-12-23", status: "Order Received", location: "Paris, France" },
            { date: "2024-12-24", status: "Shipped from Origin", location: "Paris, France" },
            { date: "2024-12-26", status: "Delivered", location: "Berlin, Germany" }
        ]
    }
];

// DOM Elements
const displayTracking = document.getElementById('display-tracking');
const statusBadge = document.getElementById('status-badge');
const estimatedDelivery = document.getElementById('estimated-delivery');
const timeline = document.getElementById('timeline');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Get tracking number from URL
const urlParams = new URLSearchParams(window.location.search);
const trackingNumber = urlParams.get('tracking');

// Display shipment details
function displayShipmentDetails(shipment) {
    // Display tracking number
    displayTracking.textContent = shipment.trackingNumber;

    // Display status badge
    statusBadge.textContent = shipment.status;
    statusBadge.className = `status-badge ${shipment.status.toLowerCase().replace(' ', '-')}`;

    // Display estimated delivery
    estimatedDelivery.textContent = formatDate(shipment.estimatedDelivery);

    // Display timeline
    displayTimeline(shipment.history);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Display timeline
function displayTimeline(history) {
    timeline.innerHTML = '';
    
    history.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.style.animationDelay = `${index * 0.2}s`;
        
        timelineItem.innerHTML = `
            <div class="timeline-date">${formatDate(item.date)}</div>
            <div class="timeline-status">${item.status}</div>
            <div class="timeline-location">${item.location}</div>
        `;
        
        timeline.appendChild(timelineItem);
    });
}

// Initialize page
function initPage() {
    if (!trackingNumber) {
        window.location.href = 'index.html';
        return;
    }

    const shipment = shipments.find(s => s.trackingNumber === trackingNumber);
    
    if (!shipment) {
        window.location.href = 'index.html';
        return;
    }

    displayShipmentDetails(shipment);
}

// Sticky header
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage); 