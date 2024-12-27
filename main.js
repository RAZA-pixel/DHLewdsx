// Mock shipment data
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
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const trackingInput = document.getElementById('tracking-input');
const trackBtn = document.getElementById('track-btn');
const errorMessage = document.getElementById('error-message');
const guestView = document.querySelector('.guest-view');
const userMenu = document.querySelector('.user-menu');

// Check authentication state
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    if (isLoggedIn) {
        // Show user menu
        guestView.style.display = 'none';
        userMenu.style.display = 'block';
        
        // Update user name and avatar
        document.querySelector('.user-name').textContent = 
            userData.firstName ? `${userData.firstName} ${userData.lastName}` : 'User';
        
        const profileAvatar = document.getElementById('profile-avatar');
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            profileAvatar.src = savedAvatar;
        }
    } else {
        // Show guest view
        guestView.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Toggle mobile menu
function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Handle tracking form submission
function handleTracking(e) {
    e.preventDefault();
    const trackingNumber = trackingInput.value.trim();
    
    if (!trackingNumber) {
        showError('Please enter a tracking number');
        return;
    }
    
    // Redirect to tracking page with tracking number
    window.location.href = `tracking.html?tracking=${trackingNumber}`;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Hide error after 3 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    window.location.reload();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
    
    // Tracking form submission
    if (trackBtn) {
        trackBtn.addEventListener('click', handleTracking);
    }
    
    // Track on Enter key
    if (trackingInput) {
        trackingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleTracking(e);
            }
        });
    }
    
    // User menu dropdown
    const userBtn = document.querySelector('.user-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

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

// Feature cards animation on scroll
const featureCards = document.querySelectorAll('.feature-card');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

featureCards.forEach(card => {
    observer.observe(card);
}); 