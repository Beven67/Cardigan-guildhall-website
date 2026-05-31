/* ============================================
   CARDIGAN GUILDHALL MARKET - MAIN JAVASCRIPT
   ============================================
   
   TABLE OF CONTENTS:
   1. DOM Elements
   2. Navigation Functions
   3. Scroll Effects
   4. FAQ Accordion
   5. Form Handling
   6. Utility Functions
   7. Initialize
   
   ============================================ */

// ============================================
// 1. DOM ELEMENTS
// ============================================

// Navigation Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// FAQ Elements
const faqItems = document.querySelectorAll('.faq-item');

// Form Elements
const contactForm = document.getElementById('contact-form');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// ============================================
// 2. NAVIGATION FUNCTIONS
// ============================================

/**
 * Toggle mobile navigation menu
 * Opens/closes the hamburger menu on mobile devices
 */
function toggleMobileNav() {
    if (navToggle && navMenu) {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
}

/**
 * Close mobile navigation menu
 * Called when clicking on a nav link or outside the menu
 */
function closeMobileNav() {
    if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Set active navigation link based on current page
 * Highlights the current page in the navigation
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.startsWith('vendor-detail') && linkHref === 'vendors.html')) {
            link.classList.add('active');
        }
    });
}

// ============================================
// 3. SCROLL EFFECTS
// ============================================

/**
 * Handle navbar appearance on scroll
 * Adds shadow and background change when scrolling down
 */
function handleNavbarScroll() {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

/**
 * Smooth scroll to anchor links
 * Enables smooth scrolling for internal page links
 */
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                
                if (target) {
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Animate elements on scroll
 * Adds fade-in animation when elements come into view
 */
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.vendor-card, .event-card, .value-card, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ============================================
// 4. FAQ ACCORDION
// ============================================

/**
 * Initialize FAQ accordion functionality
 * Enables expand/collapse behavior for FAQ items
 */

function initFaqAccordion() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Check if this item is already active
                const isActive = item.classList.contains('active');
                
                // Close all other items (optional - remove if you want multiple open)
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// 5. FORM HANDLING
// ============================================

/**
 * Handle contact form submission
 * Validates and processes the contact form
 */
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        showFormMessage(e.target, 'Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showFormMessage(e.target, 'Please enter a valid email address.', 'error');
        return;
    }
    

    console.log('Contact form submitted:', data);
    
    // Show success message
    showFormMessage(e.target, 'Thank you for your message! We will get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
}

/**
 * Handle login form submission
 * Validates and processes login credentials
 */
function handleLoginForm(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const storedUser = JSON.parse(localStorage.getItem(email));

    if (storedUser && storedUser.password === password) {

        localStorage.setItem("loggedInUser", email);

        window.location.href = "index.html";

    } else {
        showFormMessage(e.target, "Invalid email or password", "error");
    }
}

/**
 * Handle signup form submission
 * Validates and processes new user registration
*/

if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // store user as object
        const user = {
            name: name,
            password: password
        };

        localStorage.setItem(email, JSON.stringify({
    name: name,
    password: password
}));

        window.location.href = "login.html";
    });
}


/**
 * Show form message (success or error)
 * Displays feedback to the user after form submission
 */
function showFormMessage(form, message, type) {
    // Remove any existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type === 'error' ? 'form-error' : 'form-success'}`;
    messageEl.textContent = message;
    messageEl.style.padding = 'var(--space-md)';
    messageEl.style.marginBottom = 'var(--space-md)';
    messageEl.style.borderRadius = 'var(--border-radius-md)';
    messageEl.style.backgroundColor = type === 'error' ? 'rgba(124, 62, 74, 0.1)' : 'rgba(45, 138, 95, 0.1)';
    
    // Insert at top of form
    form.insertBefore(messageEl, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validate email address format
 * Returns true if email format is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Update copyright year
 * Automatically sets the current year in the footer
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Debounce function
 * Limits the rate at which a function can fire
 */
function debounce(func, wait = 100) {
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

// ============================================
// INITIALIZE
// ============================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    // Set active navigation link
    setActiveNavLink();
    
    // Update copyright year
    updateCopyrightYear();
    
    // Enable smooth scroll
    enableSmoothScroll();
    
    // Initialize FAQ accordion (if on FAQ page)
    initFaqAccordion();
    
    // Initialize scroll animations
    animateOnScroll();
    
    // Event Listeners
    
    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Close mobile nav when clicking on a link
    if (navMenu) {
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));
    
    // Form submissions
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
}

if (loginForm) {
    loginForm.addEventListener('submit', handleLoginForm);
}
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        }
    });
    
    // Handle escape key to close mobile nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

//Saved user l
const authArea = document.getElementById("auth-area");
const loggedInUser = localStorage.getItem("loggedInUser");

if (authArea && loggedInUser) {

    const userData = JSON.parse(localStorage.getItem(loggedInUser));

    const firstLetter = userData.name.charAt(0).toUpperCase();

    authArea.innerHTML = `
        <div id="user-circle" style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #333;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            cursor: pointer;
        ">
            ${firstLetter}
        </div>
    `;

    // logout on click
    document.getElementById("user-circle").addEventListener("click", function() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    });
}