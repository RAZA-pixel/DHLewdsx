// DOM Elements
const contactForm = document.getElementById('contactForm');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Form submission handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate form (basic validation)
    if (!name || !email || !subject || !message) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <span class="btn-animation"></span>';
        
        // Show success message
        showMessage('Message sent successfully!', 'success');
        
        // Reset labels
        const labels = contactForm.querySelectorAll('label');
        labels.forEach(label => {
            label.style.top = '1rem';
            label.style.left = '1rem';
            label.style.fontSize = '1rem';
            label.style.color = 'var(--text-light)';
        });
    }, 2000);
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} animate__animated animate__fadeIn`;
    messageDiv.textContent = message;
    
    // Add message to DOM
    contactForm.insertAdjacentElement('afterend', messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.remove('animate__fadeIn');
        messageDiv.classList.add('animate__fadeOut');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Input animation handlers
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    // Handle focus
    input.addEventListener('focus', () => {
        const label = input.nextElementSibling;
        label.style.top = '-0.5rem';
        label.style.left = '0';
        label.style.fontSize = '0.875rem';
        label.style.color = 'var(--dhl-red)';
    });
    
    // Handle blur
    input.addEventListener('blur', () => {
        const label = input.nextElementSibling;
        if (!input.value) {
            label.style.top = '1rem';
            label.style.left = '1rem';
            label.style.fontSize = '1rem';
            label.style.color = 'var(--text-light)';
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