/**
 * Universal Animation System for Sentinel Peak Solutions
 * Handles scroll-triggered animations, glassmorphism effects, and interactive elements
 */

class SentinelAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.observers = new Map();
        
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) {
            this.disableAnimations();
            return;
        }
        
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupStaggeredAnimations();
        this.setupGlassmorphismEffects();
        this.setupNavbarEffects();
    }
    
    /**
     * Disable all animations for users who prefer reduced motion
     */
    disableAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale');
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
    }
    
    /**
     * Setup basic scroll-triggered animations
     */
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale');
        animatedElements.forEach(el => observer.observe(el));
        
        this.observers.set('scroll', observer);
    }
    
    /**
     * Setup number counter animations
     */
    setupCounterAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        const counterElements = document.querySelectorAll('.stat-number, [data-counter]');
        counterElements.forEach(el => observer.observe(el));
        
        this.observers.set('counter', observer);
    }
    
    /**
     * Animate number counters with bounce effect
     */
    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const suffix = element.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        
        element.classList.add('counting');
        
        const timer = setInterval(() => {
            step++;
            current = Math.min(target, Math.floor(increment * step));
            
            // Easing function for bounce effect
            const progress = step / steps;
            const eased = this.easeOutBounce(progress);
            const value = Math.floor(target * eased);
            
            element.textContent = value + suffix;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = target + suffix;
            }
        }, duration / steps);
    }
    
    /**
     * Easing function for bounce effect
     */
    easeOutBounce(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
    
    /**
     * Setup staggered animations for groups of elements
     */
    setupStaggeredAnimations() {
        const staggerContainers = document.querySelectorAll('.stagger-container');
        
        staggerContainers.forEach(container => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const children = entry.target.querySelectorAll('.animate-on-scroll');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);
            
            observer.observe(container);
        });
    }
    
    /**
     * Setup glassmorphism hover effects
     */
    setupGlassmorphismEffects() {
        const glassElements = document.querySelectorAll('.glass-card, .value-card, .team-member, .package-card');
        
        glassElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.addGlowEffect(e.target);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.removeGlowEffect(e.target);
            });
        });
    }
    
    /**
     * Add subtle glow effect on hover
     */
    addGlowEffect(element) {
        element.style.boxShadow = '0 15px 40px rgba(44, 139, 139, 0.2), 0 0 20px rgba(44, 139, 139, 0.1)';
    }
    
    /**
     * Remove glow effect
     */
    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }
    
    /**
     * Setup navbar scroll effects
     */
    setupNavbarEffects() {
        const navbar = document.getElementById('navbar') || document.querySelector('.nav-wrapper');
        if (!navbar) return;
        
        let lastScrollTop = 0;
        let ticking = false;
        
        const updateNavbar = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }
    
    /**
     * Cleanup observers on page unload
     */
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sentinelAnimations = new SentinelAnimations();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.sentinelAnimations) {
        window.sentinelAnimations.cleanup();
    }
});

// Bulletproof Mobile Menu Functionality (universal across all pages)
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;
    
    // Enhanced error checking and accessibility setup
    if (!hamburgerMenu || !mobileMenu) {
        console.warn('Mobile menu elements not found - navigation may not work properly');
        return;
    }
    
    // Initialize ARIA attributes
    hamburgerMenu.setAttribute('aria-expanded', 'false');
    hamburgerMenu.setAttribute('aria-controls', 'mobile-menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.setAttribute('role', 'dialog');
    mobileMenu.setAttribute('aria-modal', 'true');
    
    // Add aria-label if not present
    if (!hamburgerMenu.getAttribute('aria-label')) {
        hamburgerMenu.setAttribute('aria-label', 'Toggle mobile navigation menu');
    }
    
    // Store original body overflow and scroll position
    let originalBodyStyle = '';
    let scrollPosition = 0;
    
    function openMobileMenu() {
        // Store current scroll position
        scrollPosition = window.pageYOffset;
        originalBodyStyle = body.style.overflow;
        
        // Prevent body scroll and fix position
        body.classList.add('mobile-menu-open');
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.width = '100%';
        
        // Show menu
        hamburgerMenu.classList.add('active');
        mobileMenu.classList.add('active');
        
        // Set focus to first menu item for accessibility
        const firstLink = mobileMenu.querySelector('.mobile-nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }
    
    function closeMobileMenu() {
        // Hide menu
        hamburgerMenu.classList.remove('active');
        mobileMenu.classList.remove('active');
        
        // Restore body scroll
        body.classList.remove('mobile-menu-open');
        body.style.overflow = originalBodyStyle;
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
        
        // Return focus to hamburger menu
        hamburgerMenu.focus();
    }
    
    // Enhanced hamburger menu click handler with accessibility
    function toggleMobileMenu() {
        const isActive = hamburgerMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
        
        // Update ARIA attributes
        hamburgerMenu.setAttribute('aria-expanded', !isActive);
        mobileMenu.setAttribute('aria-hidden', isActive);
    }
    
    // Toggle mobile menu with improved state management
    hamburgerMenu.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Enhanced keyboard support for hamburger menu
    hamburgerMenu.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside (with improved detection)
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu || e.target.classList.contains('mobile-navigation')) {
            closeMobileMenu();
        }
    });
    
    // Enhanced keyboard navigation with focus trapping
    function handleKeydown(e) {
        if (!mobileMenu.classList.contains('active')) {
            // Handle hamburger menu keyboard activation when closed
            if (document.activeElement === hamburgerMenu && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                toggleMobileMenu();
            }
            return;
        }
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                closeMobileMenu();
                break;
                
            case 'Tab':
                // Enhanced focus trapping within mobile menu
                const focusableElements = mobileMenu.querySelectorAll(
                    'a:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (focusableElements.length === 0) return;
                
                if (e.shiftKey) {
                    // Shift + Tab (backward)
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab (forward)
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                navigateMenu('next');
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                navigateMenu('previous');
                break;
        }
    }
    
    // Enhanced menu navigation with arrow keys
    function navigateMenu(direction) {
        const menuLinks = Array.from(mobileMenu.querySelectorAll('.mobile-nav-link'));
        const currentIndex = menuLinks.indexOf(document.activeElement);
        
        if (currentIndex === -1) {
            // If no menu item is focused, focus the first one
            if (menuLinks.length > 0) {
                menuLinks[0].focus();
            }
            return;
        }
        
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % menuLinks.length;
        } else {
            nextIndex = (currentIndex - 1 + menuLinks.length) % menuLinks.length;
        }
        
        menuLinks[nextIndex].focus();
    }
    
    document.addEventListener('keydown', handleKeydown);
    
    // Handle orientation change and window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 250);
    });
    
    // Handle visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});