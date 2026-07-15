# Software Showcase Features Documentation

## Overview

This package provides comprehensive CSS styling and JavaScript functionality for showcasing software features on the Sentinel Peak Solutions website. All components are mobile-first, accessible, and performance-optimized.

## Files Created

- `/css/showcase.css` - Complete styling for all showcase components
- `/js/showcase.js` - JavaScript functionality for interactive features
- `/showcase-example.html` - Implementation examples and usage guide

## Features

### 1. Educational Spots
Highlight key features with "Why it matters" and "How it works" explanations.

**Features:**
- Glassmorphism design with subtle animations
- Hover effects with glow
- Fully responsive
- Easy to customize

**Usage:**
```html
<div class="educational-spot">
    <h4>Feature Title</h4>
    <p class="why"><strong>Why it matters:</strong> Your explanation...</p>
    <p class="how"><strong>How it works:</strong> Your explanation...</p>
</div>
```

### 2. Image Carousel
3-image carousel with full touch support and keyboard navigation.

**Features:**
- Touch/swipe gestures on mobile
- Mouse drag on desktop
- Keyboard navigation (arrow keys)
- Auto-play with pause on hover
- Accessible with ARIA labels
- Navigation dots and buttons

**Usage:**
```html
<div class="showcase-carousel">
    <div class="carousel-track">
        <div class="carousel-slide">
            <img src="image1.jpg" alt="Description">
        </div>
        <div class="carousel-slide">
            <img src="image2.jpg" alt="Description">
        </div>
        <div class="carousel-slide">
            <img src="image3.jpg" alt="Description">
        </div>
    </div>
</div>
```

### 3. Video Player
Auto-play muted videos with click-to-unmute functionality.

**Features:**
- Auto-play muted on scroll into view
- Click anywhere on video to unmute
- Accessible mute/unmute button
- Pauses when out of viewport
- Mobile-friendly controls

**Usage:**
```html
<div class="showcase-video-container">
    <video class="showcase-video" loop playsinline>
        <source src="video.mp4" type="video/mp4">
    </video>
    <div class="video-overlay">
        <p>▶ Video Demo</p>
    </div>
</div>
```

### 4. Lightbox Gallery
Full-screen image viewing with navigation.

**Features:**
- Full-screen viewing experience
- Navigate between multiple images
- Keyboard support (ESC, arrows)
- Click outside to close
- Smooth zoom animation
- Mobile-optimized

**Usage:**
```html
<img src="thumbnail.jpg"
     alt="Description"
     class="showcase-image"
     data-lightbox="full-size.jpg"
     tabindex="0">
```

### 5. Lazy Loading
Defer image loading until they're needed.

**Features:**
- IntersectionObserver API for efficiency
- Shimmer placeholder animation
- Smooth fade-in transition
- Automatic cleanup
- Supports srcset for responsive images

**Usage:**
```html
<img class="showcase-image lazy-load lazy-load-placeholder"
     data-src="image.jpg"
     data-srcset="image-small.jpg 480w, image-large.jpg 1200w"
     alt="Description">
```

### 6. Feature Blocks
Responsive grid layout for content and visuals.

**Features:**
- Responsive grid (mobile: 1 column, desktop: 2 columns)
- Reverse layout option
- Fade-in animations
- Content visibility optimization

**Usage:**
```html
<div class="feature-block">
    <div class="feature-content">
        <h2>Feature Title</h2>
        <p>Description...</p>
    </div>
    <div class="feature-visual">
        <img src="image.jpg" alt="Visual">
    </div>
</div>

<!-- Reverse layout -->
<div class="feature-block reverse">
    <!-- Content appears on right -->
</div>
```

## Installation

### Step 1: Include CSS
Add to your `<head>` section:
```html
<link rel="stylesheet" href="/css/showcase.css">
```

### Step 2: Include JavaScript
Add before closing `</body>` tag:
```html
<script src="/js/showcase.js" defer></script>
```

### Step 3: Use Components
Copy any component markup from the examples above.

## Performance Optimizations

### Content Visibility
Add to large sections for better rendering performance:
```html
<section class="content-visibility-auto">
    <!-- Your content -->
</section>
```

### Defer JavaScript
Always use the `defer` attribute:
```html
<script src="/js/showcase.js" defer></script>
```

### Image Optimization
- Use WebP format when possible
- Compress images before uploading
- Use appropriate image sizes (don't serve 4K images for thumbnails)
- Always use lazy loading for below-fold images

### Video Optimization
- Keep videos under 10MB for mobile performance
- Use MP4 format for best compatibility
- Consider using poster images for initial display
- Set appropriate video dimensions

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- Opera: Full support

**Note:** Uses modern JavaScript (ES6+). For older browser support, transpile with Babel.

## Accessibility Features

All components are built with accessibility in mind:

- **Keyboard Navigation**: Tab, Enter, Space, Arrow keys, Escape
- **ARIA Labels**: Automatically added for screen readers
- **Focus Management**: Clear focus indicators for keyboard users
- **Reduced Motion**: Respects `prefers-reduced-motion` preference
- **Alt Text**: Required for all images
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: Minimum 44x44px for mobile

## Mobile Optimization

### Touch Support
- Swipe gestures for carousel
- Touch-friendly button sizes (minimum 44px)
- Optimized animations for mobile devices

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 900px
- Flexible grid layouts
- Scaled typography

### Performance
- Lazy loading reduces initial load time
- Content visibility improves rendering
- Optimized animations with transform/opacity
- Passive event listeners where possible

## Customization

### Colors
Edit these variables in your CSS:
```css
/* Primary accent color */
--showcase-accent: #00ffc8;

/* Secondary accent color */
--showcase-secondary: #00d4ff;

/* Background colors */
--showcase-bg: rgba(0, 0, 0, 0.4);
--showcase-border: rgba(0, 255, 200, 0.25);
```

### Animation Speed
Adjust timing in CSS:
```css
/* Default: 0.3s */
transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
```

### Carousel Autoplay
Modify in JavaScript:
```javascript
// Default: 5000ms (5 seconds)
this.autoplayDelay = 5000;
```

## Troubleshooting

### Images Not Loading
- Check file paths are correct
- Ensure images exist on server
- Check browser console for 404 errors
- Verify lazy-load data-src attributes

### Carousel Not Working
- Ensure JavaScript is loaded
- Check browser console for errors
- Verify HTML structure matches examples
- Confirm images have loaded

### Video Not Autoplaying
- Autoplay requires muted attribute
- Some browsers block autoplay
- Check video file format (MP4 recommended)
- Ensure video element has correct attributes

### Lightbox Not Opening
- Verify data-lightbox attribute is set
- Check JavaScript console for errors
- Ensure lightbox element is created
- Confirm click handlers are attached

## Advanced Usage

### Manual Initialization
```javascript
// Initialize showcase manually
const showcase = new SoftwareShowcase();

// Access carousel instance
const carousel = showcase.carousels[0];

// Control carousel programmatically
carousel.next();
carousel.prev();
carousel.goToSlide(2);
```

### Custom Events
```javascript
// Listen for carousel changes
document.addEventListener('carouselChange', (e) => {
    console.log('Carousel changed to slide:', e.detail.index);
});
```

### Destroy Instances
```javascript
// Cleanup when needed
window.softwareShowcase.destroy();
```

## Best Practices

1. **Always use alt text** on images for accessibility
2. **Optimize images** before uploading (compress, resize)
3. **Use lazy loading** for images below the fold
4. **Test on mobile** devices for touch interactions
5. **Keep videos short** (under 30 seconds when possible)
6. **Provide fallbacks** for video content
7. **Test keyboard navigation** for all interactive elements
8. **Use semantic HTML** for better SEO and accessibility

## Performance Metrics

Expected performance improvements:
- **Lazy Loading**: 30-50% faster initial page load
- **Content Visibility**: 20-30% faster rendering
- **Optimized Images**: 40-60% smaller page size
- **Deferred JS**: 10-20% faster time to interactive

## Support

For issues or questions:
1. Check this documentation
2. Review example implementations
3. Check browser console for errors
4. Verify all files are properly linked

## License

Proprietary - Sentinel Peak Solutions
© 2025 All rights reserved

## Changelog

### Version 1.0.0 (2025-01-24)
- Initial release
- Educational spots component
- Image carousel with touch support
- Video player with autoplay
- Lightbox gallery
- Lazy loading system
- Performance optimizations
- Full accessibility support
