/**
 * Software Showcase Features JavaScript
 * Sentinel Peak Solutions
 *
 * Features:
 * - Image carousel with touch support
 * - Video player controls (autoplay muted, click to unmute)
 * - Lazy loading with IntersectionObserver
 * - Lightbox functionality for portfolio showcase
 * - Performance optimizations
 */

class SoftwareShowcase {
    constructor() {
        this.carousels = [];
        this.lightbox = null;
        this.lazyLoadObserver = null;
        this.contentVisibilityObserver = null;

        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupCarousels();
        this.setupVideoPlayers();
        this.setupLightbox();
        this.setupContentVisibility();
        this.setupAccessibility();
    }

    /**
     * Lazy Loading with IntersectionObserver
     */
    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all lazy-load images
        document.querySelectorAll('.lazy-load').forEach(img => {
            this.lazyLoadObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (!src) return;

        // Create temporary image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            img.src = src;
            if (srcset) {
                img.srcset = srcset;
            }
            img.classList.add('loaded');
            img.classList.remove('lazy-load-placeholder');
        };

        tempImg.onerror = () => {
            console.error('Failed to load image:', src);
            img.classList.add('loaded');
            img.classList.remove('lazy-load-placeholder');
        };

        tempImg.src = src;
        if (srcset) {
            tempImg.srcset = srcset;
        }
    }

    /**
     * Image Carousel with Touch Support
     */
    setupCarousels() {
        document.querySelectorAll('.showcase-carousel').forEach((carousel, index) => {
            const carouselInstance = new ImageCarousel(carousel, index);
            this.carousels.push(carouselInstance);
        });
    }

    /**
     * Video Player Controls
     */
    setupVideoPlayers() {
        document.querySelectorAll('.showcase-video').forEach(video => {
            new VideoPlayer(video);
        });
    }

    /**
     * Lightbox Functionality
     */
    setupLightbox() {
        // Create lightbox element
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-nav prev" aria-label="Previous image">&lsaquo;</button>
                <img class="lightbox-image" src="" alt="">
                <button class="lightbox-nav next" aria-label="Next image">&rsaquo;</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        this.lightbox = new Lightbox(lightbox);

        // Add click handlers to images with lightbox attribute
        document.querySelectorAll('[data-lightbox]').forEach(img => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.lightbox.open(img);
            });

            // Keyboard support
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.lightbox.open(img);
                }
            });

            // Make images focusable
            if (!img.hasAttribute('tabindex')) {
                img.setAttribute('tabindex', '0');
            }
        });
    }

    /**
     * Content Visibility for Performance
     */
    setupContentVisibility() {
        const options = {
            root: null,
            rootMargin: '200px',
            threshold: 0
        };

        this.contentVisibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.contentVisibility = 'visible';
                } else {
                    entry.target.style.contentVisibility = 'auto';
                }
            });
        }, options);

        // Observe content sections
        document.querySelectorAll('.content-visibility-auto').forEach(section => {
            this.contentVisibilityObserver.observe(section);
        });
    }

    /**
     * Accessibility Enhancements
     */
    setupAccessibility() {
        // Ensure all interactive elements have proper ARIA labels
        document.querySelectorAll('.showcase-image[data-lightbox]').forEach(img => {
            if (!img.getAttribute('aria-label')) {
                img.setAttribute('aria-label', 'Click to view full size image');
            }
        });
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.disconnect();
        }
        if (this.contentVisibilityObserver) {
            this.contentVisibilityObserver.disconnect();
        }
        this.carousels.forEach(carousel => carousel.destroy());
        if (this.lightbox) {
            this.lightbox.destroy();
        }
    }
}

/**
 * Image Carousel Class
 */
class ImageCarousel {
    constructor(element, id) {
        this.element = element;
        this.id = id;
        this.track = element.querySelector('.carousel-track');
        this.slides = element.querySelectorAll('.carousel-slide');
        this.currentIndex = 0;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;

        this.init();
    }

    init() {
        if (!this.track || this.slides.length === 0) {
            console.warn('Carousel initialization failed: missing required elements');
            return;
        }

        this.createControls();
        this.createDots();
        this.setupTouchHandlers();
        this.setupKeyboardNavigation();
        this.startAutoplay();

        // Pause autoplay on hover
        this.element.addEventListener('mouseenter', () => this.stopAutoplay());
        this.element.addEventListener('mouseleave', () => this.startAutoplay());
    }

    createControls() {
        // Only show controls if more than one slide
        if (this.slides.length <= 1) return;

        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        controls.innerHTML = `
            <button class="carousel-button prev" aria-label="Previous slide">&lsaquo;</button>
            <button class="carousel-button next" aria-label="Next slide">&rsaquo;</button>
        `;

        this.element.appendChild(controls);

        controls.querySelector('.prev').addEventListener('click', () => this.prev());
        controls.querySelector('.next').addEventListener('click', () => this.next());
    }

    createDots() {
        // Only show dots if more than one slide
        if (this.slides.length <= 1) return;

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';

        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');

            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        this.element.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.carousel-dot');
    }

    setupTouchHandlers() {
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', () => this.handleTouchEnd());

        // Mouse events for desktop
        this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.track.addEventListener('mouseup', () => this.handleMouseUp());
        this.track.addEventListener('mouseleave', () => this.handleMouseUp());

        // Prevent default drag behavior
        this.track.addEventListener('dragstart', (e) => e.preventDefault());
    }

    setupKeyboardNavigation() {
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.next();
            }
        });
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.stopAutoplay();
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        if (!this.isDragging) return;

        const diff = this.startX - this.currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }

        this.isDragging = false;
        this.startAutoplay();
    }

    handleMouseDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
        this.stopAutoplay();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX;
    }

    handleMouseUp() {
        if (!this.isDragging) return;

        const diff = this.startX - this.currentX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }

        this.isDragging = false;
        this.track.style.cursor = 'grab';
        this.startAutoplay();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.stopAutoplay();
        this.startAutoplay();
    }

    updateCarousel() {
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        // Update ARIA
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== this.currentIndex);
        });
    }

    startAutoplay() {
        if (this.slides.length <= 1) return;

        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    destroy() {
        this.stopAutoplay();
    }
}

/**
 * Video Player Class
 */
class VideoPlayer {
    constructor(video) {
        this.video = video;
        this.container = video.closest('.showcase-video-container');
        this.isMuted = true;

        this.init();
    }

    init() {
        if (!this.container) {
            console.warn('Video player initialization failed: missing container');
            return;
        }

        // Set initial video state
        this.video.muted = true;
        this.video.autoplay = true;
        this.video.loop = true;
        this.video.playsInline = true;

        this.createMuteButton();
        this.setupVideoHandlers();

        // Start playing
        this.playVideo();
    }

    createMuteButton() {
        const button = document.createElement('button');
        button.className = 'video-mute-button';
        button.innerHTML = '<span aria-hidden="true">🔇</span>';
        button.setAttribute('aria-label', 'Unmute video');

        button.addEventListener('click', () => this.toggleMute());

        this.container.appendChild(button);
        this.muteButton = button;
    }

    setupVideoHandlers() {
        // Click video to toggle mute
        this.video.addEventListener('click', () => this.toggleMute());

        // Handle autoplay failures
        this.video.addEventListener('play', () => {
            const overlay = this.container.querySelector('.video-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
            }
        });

        // Intersection Observer for autoplay on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.playVideo();
                } else {
                    this.pauseVideo();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.container);
    }

    playVideo() {
        const playPromise = this.video.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Autoplay failed:', error);
                // Show play overlay if autoplay fails
                const overlay = this.container.querySelector('.video-overlay');
                if (overlay) {
                    overlay.classList.remove('hidden');
                }
            });
        }
    }

    pauseVideo() {
        if (!this.video.paused) {
            this.video.pause();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.video.muted = this.isMuted;

        // Update button
        if (this.muteButton) {
            this.muteButton.innerHTML = this.isMuted ? '<span aria-hidden="true">🔇</span>' : '<span aria-hidden="true">🔊</span>';
            this.muteButton.setAttribute('aria-label', this.isMuted ? 'Unmute video' : 'Mute video');
        }
    }
}

/**
 * Lightbox Class
 */
class Lightbox {
    constructor(element) {
        this.element = element;
        this.image = element.querySelector('.lightbox-image');
        this.closeBtn = element.querySelector('.lightbox-close');
        this.prevBtn = element.querySelector('.lightbox-nav.prev');
        this.nextBtn = element.querySelector('.lightbox-nav.next');
        this.images = [];
        this.currentIndex = 0;

        this.init();
    }

    init() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.close());

        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Click outside to close
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.close();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.element.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });

        // Collect all lightbox images
        this.updateImagesList();
    }

    updateImagesList() {
        this.images = Array.from(document.querySelectorAll('[data-lightbox]'));
    }

    open(imgElement) {
        this.updateImagesList();
        this.currentIndex = this.images.indexOf(imgElement);

        const src = imgElement.dataset.lightbox || imgElement.src;
        const alt = imgElement.alt || 'Showcase image';

        this.image.src = src;
        this.image.alt = alt;

        this.element.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Show/hide navigation buttons
        if (this.images.length <= 1) {
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
        } else {
            this.prevBtn.style.display = 'flex';
            this.nextBtn.style.display = 'flex';
        }

        // Focus close button for accessibility
        setTimeout(() => this.closeBtn.focus(), 100);
    }

    close() {
        this.element.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to the original image
        if (this.images[this.currentIndex]) {
            this.images[this.currentIndex].focus();
        }
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    updateImage() {
        const imgElement = this.images[this.currentIndex];
        const src = imgElement.dataset.lightbox || imgElement.src;
        const alt = imgElement.alt || 'Showcase image';

        this.image.src = src;
        this.image.alt = alt;
    }

    destroy() {
        this.element.remove();
    }
}

// Initialize showcase when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.softwareShowcase = new SoftwareShowcase();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.softwareShowcase) {
        window.softwareShowcase.destroy();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SoftwareShowcase, ImageCarousel, VideoPlayer, Lightbox };
}
