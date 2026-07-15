# Quick Start Guide - Software Showcase Features

## 🚀 30-Second Setup

### 1. Add to Your HTML `<head>`
```html
<link rel="stylesheet" href="/css/showcase.css">
```

### 2. Add Before Closing `</body>`
```html
<script src="/js/showcase.js" defer></script>
```

### 3. Start Using Components!

---

## 📦 Component Cheat Sheet

### Educational Spot
```html
<div class="educational-spot">
    <h4>Feature Name</h4>
    <p class="why"><strong>Why it matters:</strong> Explain the value...</p>
    <p class="how"><strong>How it works:</strong> Explain the mechanism...</p>
</div>
```

### Image Carousel
```html
<div class="showcase-carousel">
    <div class="carousel-track">
        <div class="carousel-slide"><img src="1.jpg" alt="Slide 1"></div>
        <div class="carousel-slide"><img src="2.jpg" alt="Slide 2"></div>
        <div class="carousel-slide"><img src="3.jpg" alt="Slide 3"></div>
    </div>
</div>
```

### Lightbox Image
```html
<img src="thumb.jpg" alt="Description"
     class="showcase-image"
     data-lightbox="full.jpg"
     tabindex="0">
```

### Auto-Play Video
```html
<div class="showcase-video-container">
    <video class="showcase-video" loop playsinline>
        <source src="video.mp4" type="video/mp4">
    </video>
    <div class="video-overlay"><p>▶ Video</p></div>
</div>
```

### Lazy Load Image
```html
<img class="showcase-image lazy-load lazy-load-placeholder"
     data-src="image.jpg"
     alt="Description">
```

### Feature Block
```html
<div class="feature-block">
    <div class="feature-content">
        <h2>Title</h2>
        <p>Content...</p>
    </div>
    <div class="feature-visual">
        <img src="visual.jpg" alt="Visual">
    </div>
</div>
```

---

## 🎯 Common Patterns

### Feature + Educational Spot + Lightbox Image
```html
<div class="feature-block">
    <div class="feature-content">
        <h2>Viral Content Analyzer</h2>
        <div class="educational-spot">
            <h4>Smart Content Insights</h4>
            <p class="why"><strong>Why it matters:</strong>
               70% of businesses struggle to create engaging content.</p>
            <p class="how"><strong>How it works:</strong>
               AI analyzes millions of data points to predict viral potential.</p>
        </div>
    </div>
    <div class="feature-visual">
        <img src="analyzer.jpg" alt="Content Analyzer Dashboard"
             class="showcase-image lazy-load"
             data-src="analyzer.jpg"
             data-lightbox="analyzer-full.jpg"
             tabindex="0">
    </div>
</div>
```

### Carousel + Performance Optimization
```html
<section class="content-visibility-auto">
    <div class="feature-block reverse">
        <div class="feature-content">
            <h2>Client Success Stories</h2>
            <p>See how we've helped businesses grow...</p>
        </div>
        <div class="feature-visual">
            <div class="showcase-carousel">
                <div class="carousel-track">
                    <div class="carousel-slide">
                        <img class="lazy-load" data-src="story1.jpg" alt="Story 1">
                    </div>
                    <div class="carousel-slide">
                        <img class="lazy-load" data-src="story2.jpg" alt="Story 2">
                    </div>
                    <div class="carousel-slide">
                        <img class="lazy-load" data-src="story3.jpg" alt="Story 3">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

---

## 💡 Pro Tips

### Performance
- ✅ Use `lazy-load` on all images below the fold
- ✅ Wrap sections with `content-visibility-auto`
- ✅ Always include `defer` on script tag
- ✅ Optimize images to WebP format
- ✅ Keep videos under 10MB

### Accessibility
- ✅ Always include `alt` text on images
- ✅ Add `tabindex="0"` to lightbox images
- ✅ Use semantic HTML (`<section>`, `<article>`)
- ✅ Test keyboard navigation (Tab, Enter, Arrows, ESC)

### Mobile
- ✅ Test touch gestures on carousel
- ✅ Ensure buttons are 44px minimum
- ✅ Use responsive images with `srcset`
- ✅ Test video autoplay on iOS/Android

---

## 🎨 Customization

### Change Accent Color
In your custom CSS file:
```css
.educational-spot {
    border-color: rgba(YOUR_COLOR, 0.25);
    box-shadow: 0 0 24px rgba(YOUR_COLOR, 0.08);
}

.educational-spot h4 {
    color: YOUR_COLOR;
}
```

### Adjust Carousel Speed
In browser console or custom JS:
```javascript
// After page loads
window.softwareShowcase.carousels[0].autoplayDelay = 8000; // 8 seconds
```

### Disable Autoplay
```html
<div class="showcase-carousel" data-autoplay="false">
    <!-- carousel content -->
</div>
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Images not showing | Check file paths, verify images exist |
| Carousel not sliding | Check browser console for JS errors |
| Video not autoplaying | Ensure `muted` attribute is present |
| Lightbox not opening | Verify `data-lightbox` attribute is set |
| Mobile swipe not working | Ensure touch events aren't blocked by other scripts |

---

## 📱 Breakpoints

- **Mobile**: < 768px (1 column layout)
- **Tablet**: 769px - 1024px (flexible layout)
- **Desktop**: > 900px (2 column layout)

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Navigate between elements |
| Enter/Space | Activate buttons, open lightbox |
| Arrow Left/Right | Navigate carousel/lightbox |
| ESC | Close lightbox |
| Arrow Up/Down | Navigate carousel (when focused) |

---

## 📊 File Sizes

- `showcase.css`: 11KB
- `showcase.js`: 18KB
- Total: 29KB (minify for production)

---

## ✅ Pre-Launch Checklist

- [ ] All images have `alt` text
- [ ] Lazy loading on below-fold images
- [ ] Videos under 10MB
- [ ] Tested on mobile device
- [ ] Keyboard navigation works
- [ ] Lightbox images link to high-res versions
- [ ] Carousel has 2+ images
- [ ] Console has no errors
- [ ] Page loads in < 3 seconds
- [ ] Images are optimized/compressed

---

## 🔗 Full Documentation

See `/SHOWCASE-README.md` for complete documentation.

See `/showcase-example.html` for live examples.

---

## 📞 Need Help?

1. Check `/SHOWCASE-README.md` for detailed docs
2. View `/showcase-example.html` for working examples
3. Check browser console for error messages
4. Verify all file paths are correct
