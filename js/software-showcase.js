// === SOFTWARE SHOWCASE JAVASCRIPT ===

// Carousel functionality for Viral Content Analyzer
class SimpleCarousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.slides = container.querySelectorAll('.carousel-slide');
    this.dots = container.querySelectorAll('.carousel-dot');
    this.prevBtn = container.querySelector('.carousel-prev');
    this.nextBtn = container.querySelector('.carousel-next');
    this.currentIndex = 0;
    this.autoplayInterval = null;

    this.init();
  }

  init() {
    // Add click handlers for dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Add click handlers for buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Start autoplay
    this.startAutoplay();

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());

    // Touch/swipe support
    this.addSwipeSupport();
  }

  goToSlide(index) {
    this.currentIndex = index;
    const offset = -100 * index;
    this.track.style.transform = `translateX(${offset}%)`;

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(this.currentIndex);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(this.currentIndex);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), 4000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  addSwipeSupport() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - currentX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });
  }
}

// Video player functionality
class VideoPlayer {
  constructor(container) {
    this.container = container;
    this.video = container.querySelector('video');
    this.overlay = container.querySelector('.video-overlay');
    this.isMuted = true;

    this.init();
  }

  init() {
    // Click to toggle mute
    this.container.addEventListener('click', () => {
      this.toggleMute();
    });

    // Ensure autoplay works
    this.video.muted = true;
    this.video.play().catch(err => {
      console.log('Autoplay prevented:', err);
    });

    // Loop the video
    this.video.addEventListener('ended', () => {
      this.video.currentTime = 0;
      this.video.play();
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.video.muted = this.isMuted;

    // Update overlay text
    if (this.overlay) {
      const text = this.overlay.querySelector('.video-overlay-text');
      if (text) {
        text.textContent = this.isMuted ? 'Click to unmute' : 'Click to mute';
      }
    }
  }
}

// Lightbox functionality
class Lightbox {
  constructor() {
    this.lightbox = null;
    this.init();
  }

  init() {
    // Create lightbox element
    this.createLightbox();

    // Add click handlers to showcase cards
    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const data = {
          image: trigger.dataset.lightboxImage,
          title: trigger.dataset.lightboxTitle,
          description: trigger.dataset.lightboxDescription,
          educational: trigger.dataset.lightboxEducational
        };
        this.open(data);
      });
    });
  }

  createLightbox() {
    const lightboxHTML = `
      <div class="lightbox" id="showcase-lightbox">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <div class="lightbox-content">
          <img class="lightbox-image" alt="" />
          <div class="lightbox-details">
            <h3 class="lightbox-title"></h3>
            <p class="lightbox-description"></p>
            <div class="lightbox-educational"></div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    this.lightbox = document.getElementById('showcase-lightbox');

    // Close button handler
    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      this.close();
    });

    // Close on background click
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(data) {
    const img = this.lightbox.querySelector('.lightbox-image');
    const title = this.lightbox.querySelector('.lightbox-title');
    const description = this.lightbox.querySelector('.lightbox-description');
    const educational = this.lightbox.querySelector('.lightbox-educational');

    img.src = data.image;
    img.alt = data.title;
    title.textContent = data.title;
    description.textContent = data.description;

    if (data.educational) {
      educational.innerHTML = data.educational;
    } else {
      educational.innerHTML = '';
    }

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Lazy loading for images
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-lazy]');
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      this.images.forEach(img => this.imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  loadImage(img) {
    const src = img.dataset.lazy;
    if (src) {
      img.src = src;
      img.removeAttribute('data-lazy');

      if (this.imageObserver) {
        this.imageObserver.unobserve(img);
      }
    }
  }

  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// Smooth scroll to sections
class SmoothScroller {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize carousels
  document.querySelectorAll('.carousel-container').forEach(carousel => {
    new SimpleCarousel(carousel);
  });

  // Initialize video players
  document.querySelectorAll('.video-container').forEach(container => {
    new VideoPlayer(container);
  });

  // Initialize lightbox
  new Lightbox();

  // Initialize lazy loading
  new LazyLoader();

  // Initialize smooth scrolling
  new SmoothScroller();

  // Add animation class to elements as they come into view
  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animateOnScroll.observe(el);
  });

  // Mobile menu enhancements for showcase
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isOpen);
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }
});

// Performance monitoring
if ('PerformanceObserver' in window) {
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
    }
  });

  perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}

// Export for use in other scripts if needed
window.ShowcaseUtils = {
  SimpleCarousel,
  VideoPlayer,
  Lightbox,
  LazyLoader
};