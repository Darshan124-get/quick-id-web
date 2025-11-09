// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initFormHandling();
    initDemo();
    initCounters();
    initTheme();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .screenshot-item, .about-text, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const school = this.querySelector('input[placeholder="School/College Name"]').value;
            const message = this.querySelector('textarea').value;
            
            // Validate form
            if (!name || !email || !school || !message) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert message
    const contactForm = document.querySelector('.contact-form');
    contactForm.insertBefore(message, contactForm.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

// Demo functionality
function initDemo() {
    let stream = null;
    let capturedImage = null;
    
    // Open demo modal
    window.openDemo = function() {
        const modal = document.getElementById('demoModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Start camera
        startCamera();
    };
    
    // Close demo modal
    window.closeDemo = function() {
        const modal = document.getElementById('demoModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Stop camera
        stopCamera();
    };
    
    // Start camera
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            });
            
            const video = document.getElementById('cameraVideo');
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error('Error accessing camera:', err);
            showMessage('Camera access denied. Please allow camera access to use the demo.', 'error');
        }
    }
    
    // Stop camera
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }
    
    // Capture photo
    document.getElementById('captureBtn').addEventListener('click', function() {
        const video = document.getElementById('cameraVideo');
        const canvas = document.getElementById('cameraCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        capturedImage = canvas.toDataURL('image/png');
        
        // Show captured photo
        const photoPreview = document.getElementById('photoPreview');
        const capturedPhoto = document.getElementById('capturedPhoto');
        
        photoPreview.src = capturedImage;
        capturedPhoto.style.display = 'block';
        
        // Hide camera view
        document.querySelector('.camera-section').style.display = 'none';
        
        showMessage('Photo captured successfully!', 'success');
    });
    
    // Retake photo
    window.retakePhoto = function() {
        const capturedPhoto = document.getElementById('capturedPhoto');
        const cameraSection = document.querySelector('.camera-section');
        
        capturedPhoto.style.display = 'none';
        cameraSection.style.display = 'block';
        
        capturedImage = null;
    };
    
    // Save student
    window.saveStudent = function() {
        const name = document.getElementById('studentName').value;
        const id = document.getElementById('studentId').value;
        const classGrade = document.getElementById('studentClass').value;
        const dept = document.getElementById('studentDept').value;
        
        if (!name || !id || !classGrade) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!capturedImage) {
            showMessage('Please capture a photo first.', 'error');
            return;
        }
        
        // Simulate saving
        const saveBtn = document.querySelector('#capturedPhoto .btn-primary');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<span class="loading"></span> Saving...';
        saveBtn.disabled = true;
        
        setTimeout(() => {
            showMessage('Student saved successfully!', 'success');
            
            // Reset form
            document.getElementById('studentForm').reset();
            retakePhoto();
            
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 2000);
    };
    
    // Student form submission
    document.getElementById('studentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveStudent();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('demoModal');
        if (e.target === modal) {
            closeDemo();
        }
    });
}

// Counter animations
function initCounters() {
    const counters = document.querySelectorAll('.stat h3');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate counter
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const suffix = element.textContent.replace(/[\d]/g, '').replace(/[^\w]/g, '');
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Parallax effect for hero shapes
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add hover effects to feature cards
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add click effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Add typing effect to hero title
function initTypingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Initialize typing effect
initTypingEffect();

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-blue), var(--accent-blue));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
initScrollProgress();

// Add smooth reveal animations
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.feature-card, .screenshot-item, .about-text, .contact-item');
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        revealObserver.observe(el);
    });
    
    // Add CSS for revealed state
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(revealStyle);
}

// Initialize reveal animations
initRevealAnimations();

// Add particle effect to hero section
function initParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    hero.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-blue);
            border-radius: 50%;
            opacity: 0.6;
            animation: float-up 6s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 6000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 300);
    
    // Add CSS for particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float-up {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Initialize particle effect
initParticleEffect();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('demoModal');
        if (modal && modal.style.display === 'block') {
            closeDemo();
        }
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, { passive: true });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading animation for page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add CSS for loading animation
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadingStyle);
});

// Theme functionality
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme') || 'light';
    applyTheme(saved);
    
    if (toggle) {
        // Set initial icon
        toggle.innerHTML = saved === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'light' ? 'dark' : 'light';
            applyTheme(next);
            localStorage.setItem('theme', next);
            // Update icon
            toggle.innerHTML = next === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
}

function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
}

// Download function - Navigate to app stores
window.downloadApp = function() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check if mobile device - direct redirect
    if (/android/i.test(userAgent)) {
        // Android - Google Play Store
        window.open('https://play.google.com/store/apps/details?id=com.quickid.app', '_blank');
        showMessage('Redirecting to Google Play Store...', 'success');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // iOS - App Store
        window.open('https://apps.apple.com/app/quickid/id123456789', '_blank');
        showMessage('Redirecting to App Store...', 'success');
    } else {
        // Desktop - Show store selection modal
        openStoreModal();
    }
};

// Store modal functions
window.openStoreModal = function() {
    const modal = document.getElementById('storeModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

window.closeStoreModal = function() {
    const modal = document.getElementById('storeModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
};

// Console welcome message
console.log('%c🚀 QuickID Website Loaded Successfully!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with ❤️ for educational institutions', 'color: #6b7280; font-size: 12px;');
