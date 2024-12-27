// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');
const valueCards = document.querySelectorAll('.value-card');
const timelineItems = document.querySelectorAll('.timeline-item');
const statCards = document.querySelectorAll('.stat-card');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

// Observer for value cards
const valueObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${index * 0.2}s`;
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            valueObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

valueCards.forEach(card => {
    valueObserver.observe(card);
});

// Observer for timeline items
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const direction = entry.target.classList.contains('timeline-item:nth-child(odd)') 
                ? 'animate__fadeInLeft' 
                : 'animate__fadeInRight';
            entry.target.classList.add('animate__animated', direction);
            timelineObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Observer for stat cards with counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('h3');
            const targetNumber = parseInt(statValue.textContent);
            animateValue(statValue, 0, targetNumber, 2000);
            statObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statCards.forEach(card => {
    statObserver.observe(card);
});

// Number counter animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        // Add the '+' symbol if it exists in the original content
        element.textContent = element.textContent.includes('+') 
            ? value + '+' 
            : value;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Sticky header
let lastScroll = 0;

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

// Parallax effect for hero section
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
    heroContent.style.opacity = 1 - (scrolled * 0.003);
}); 