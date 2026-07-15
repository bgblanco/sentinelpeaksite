/**
 * Scroll Components JavaScript
 * 
 * Provides reusable scroll functionality for progress bar and back-to-top button.
 * Extracted from portfolio.html for modular use across all pages.
 * 
 * Features:
 * - Scroll progress bar calculation and display
 * - Back-to-top button visibility control (appears after 800px scroll)
 * - Smooth scroll-to-top functionality
 * - Optional navbar scroll effects
 * - Performance optimized scroll event handling
 * 
 * Dependencies: Requires corresponding HTML elements with IDs:
 * - #page-progress
 * - #scroll-to-top
 * - #navbar (optional)
 */

(function() {
    'use strict';
    
    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('page-progress');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    // Check if required elements exist
    if (!progressBar || !scrollToTopBtn) {
        console.warn('Scroll components: Required elements not found. Ensure #page-progress and #scroll-to-top exist in HTML.');
        return;
    }
    
    // Configuration
    const SCROLL_THRESHOLD = 800; // Pixels before showing back-to-top button
    const NAVBAR_THRESHOLD = 100; // Pixels before applying navbar scrolled class
    
    // Performance optimization variables
    let animationFrameId = null;
    let isScrolling = false;
    
    /**
     * Handle scroll events for all scroll-based functionality
     * Optimized with RequestAnimationFrame for 60fps performance
     */
    function handleScroll() {
        if (!isScrolling) {
            isScrolling = true;
            
            // Use RequestAnimationFrame for smooth 60fps updates
            animationFrameId = requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercentage = Math.min((scrollY / documentHeight) * 100, 100);
                
                // Batch DOM updates to minimize layout thrashing
                requestAnimationFrame(() => {
                    // Update progress bar width
                    progressBar.style.width = scrollPercentage + '%';
                    
                    // Control back-to-top button visibility
                    const shouldShowButton = scrollY > SCROLL_THRESHOLD;
                    if (shouldShowButton && !scrollToTopBtn.classList.contains('visible')) {
                        scrollToTopBtn.classList.add('visible');
                    } else if (!shouldShowButton && scrollToTopBtn.classList.contains('visible')) {
                        scrollToTopBtn.classList.remove('visible');
                    }
                    
                    // Optional navbar scroll effect (if navbar exists)
                    if (navbar) {
                        const shouldShowScrolled = scrollY > NAVBAR_THRESHOLD;
                        if (shouldShowScrolled && !navbar.classList.contains('scrolled')) {
                            navbar.classList.add('scrolled');
                        } else if (!shouldShowScrolled && navbar.classList.contains('scrolled')) {
                            navbar.classList.remove('scrolled');
                        }
                    }
                    
                    isScrolling = false;
                });
            });
        }
    }
    
    /**
     * Smooth scroll to top of page
     * Uses native browser smooth scrolling for best performance
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    /**
     * Throttle function to limit scroll event frequency
     * Improves performance on slower devices
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Cleanup function for better memory management
    function cleanup() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        isScrolling = false;
    }
    
    // Initialize scroll components
    function init() {
        try {
            // Use passive scroll listeners for better performance
            const supportsPassive = (() => {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, 'passive', {
                        get: () => supportsPassive = true
                    });
                    window.addEventListener('testPassive', null, opts);
                    window.removeEventListener('testPassive', null, opts);
                } catch (e) {}
                return supportsPassive;
            })();
            
            const scrollOptions = supportsPassive ? { passive: true } : false;
            
            // Add optimized scroll event listener with passive support
            window.addEventListener('scroll', handleScroll, scrollOptions);
            
            // Add click event listener for back-to-top button
            scrollToTopBtn.addEventListener('click', scrollToTop);
            
            // Add keyboard support for back-to-top button
            scrollToTopBtn.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    scrollToTop();
                }
            });
            
            // Add resize listener to recalculate on window resize
            window.addEventListener('resize', throttle(handleScroll, 250), scrollOptions);
            
            // Cleanup on page unload to prevent memory leaks
            window.addEventListener('beforeunload', cleanup);
            
            // Initial call to set correct states (delayed to avoid blocking initial render)
            requestAnimationFrame(() => {
                handleScroll();
            });
            
            console.log('Scroll components initialized successfully with performance optimizations');
        } catch (error) {
            console.error('Error initializing scroll components:', error);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose public API for manual control if needed
    window.ScrollComponents = {
        scrollToTop: scrollToTop,
        updateProgress: handleScroll,
        config: {
            scrollThreshold: SCROLL_THRESHOLD,
            navbarThreshold: NAVBAR_THRESHOLD
        }
    };
    
})();

/**
 * Usage Instructions:
 * 
 * 1. Include this JavaScript file in your HTML:
 *    <script src="js/scroll-components.js"></script>
 * 
 * 2. Ensure the following HTML elements exist:
 *    <div class="page-progress" id="page-progress"></div>
 *    <button class="scroll-to-top" id="scroll-to-top" aria-label="Scroll to top">
 *        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
 *            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
 *        </svg>
 *    </button>
 * 
 * 3. Include the corresponding CSS file:
 *    <link rel="stylesheet" href="css/scroll-components.css">
 * 
 * 4. Optional: Add navbar element with id="navbar" for scroll effects
 * 
 * The components will initialize automatically when the page loads.
 */