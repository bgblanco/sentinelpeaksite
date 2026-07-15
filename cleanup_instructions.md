# V2 Website Migration Guide

## Overview
This guide provides step-by-step instructions for safely migrating from the current website to the new v2 versions. The v2 pages are completely separate files, allowing for safe testing before deployment.

## ✅ Pre-Migration Checklist

- [ ] Backup current website files
- [ ] Test all v2 pages locally
- [ ] Verify all images load correctly
- [ ] Check mobile responsiveness
- [ ] Test all forms and interactive elements
- [ ] Review content for accuracy

## 📁 New Files Created

### HTML Pages (5 files)
- `index_v2.html` - New homepage with platform focus
- `services_v2.html` - Pain-point organized solutions
- `portfolio_v2.html` - Software showcase with lightbox
- `about_v2.html` - Mission and technology focus
- `contact_v2.html` - Problem-focused contact form

### Documentation (2 files)
- `manifest_v2.json` - Build documentation and metrics
- `cleanup_instructions.md` - This migration guide

## 🔄 Migration Steps

### Step 1: Test V2 Pages
```bash
# Open each v2 page in browser to verify
open index_v2.html
open services_v2.html
open portfolio_v2.html
open about_v2.html
open contact_v2.html
```

### Step 2: Backup Original Files
```bash
# Create backup directory
mkdir backup_original_site

# Copy original files to backup
cp index.html backup_original_site/
cp services.html backup_original_site/
cp portfolio.html backup_original_site/
cp about.html backup_original_site/
cp contact.html backup_original_site/
```

### Step 3: Replace Files
```bash
# Remove old files
rm index.html
rm services.html
rm portfolio.html
rm about.html
rm contact.html

# Rename v2 files to production names
mv index_v2.html index.html
mv services_v2.html services.html
mv portfolio_v2.html portfolio.html
mv about_v2.html about.html
mv contact_v2.html contact.html
```

### Step 4: Update Internal Links
All v2 pages currently link to each other using "_v2.html" suffixes. After renaming, these will automatically work correctly since they'll match the new filenames.

### Step 5: Clean Up Unused Files

#### Files to DELETE (no longer needed):
```bash
# Remove empty/unused CSS
rm css/style.css              # Empty file
rm css/tailwind-base.css      # Unused
rm css/about.css              # Styles moved inline

# Remove old service pages (if they exist)
rm -rf services/social-media/
rm -rf services/web-design/

# Remove legacy components
rm components/navigation-template.html
rm components/universal-header.html
```

#### Files to KEEP (still in use):
```bash
# Essential CSS
css/base.css                  # Core styles
css/components.css            # Component styles
css/software-showcase.css     # Showcase components
css/scroll-components.css     # Scroll animations

# JavaScript
js/animations.js              # Global animations
js/software-showcase.js       # Showcase functionality
js/scroll-components.js       # Scroll effects

# All images in images/ directory
```

## 🔍 Post-Migration Testing

### Functional Tests
- [ ] Navigation menu works on all pages
- [ ] All internal links connect properly
- [ ] Images load without 404 errors
- [ ] Forms submit correctly
- [ ] Lightbox in portfolio works
- [ ] FAQ accordion in contact works
- [ ] Mobile menu functions

### Visual Tests
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Animations trigger on scroll
- [ ] Hover effects work properly
- [ ] Colors and fonts display correctly

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Images lazy load properly
- [ ] No console errors
- [ ] Google Lighthouse score > 90

## 🚨 Rollback Plan

If issues arise, restore original files:
```bash
# Restore from backup
cp backup_original_site/*.html ./

# Revert git changes (if using git)
git checkout -- *.html
```

## 📊 Key Improvements in V2

### Content Changes
- **Removed**: Marketing agency positioning, service tiers, pricing tables
- **Added**: Software platform focus, problem-solution format, educational content
- **Tone**: Professional, problem-focused, no marketing hype

### Technical Improvements
- Clean HTML structure with clear section markers
- Reused existing CSS (no new dependencies)
- Proper semantic HTML and ARIA labels
- Lazy loading for performance
- Mobile-first responsive design

### Navigation Structure
```
Home (index.html)
├── Services (services.html) - Solutions by problem
├── Platform (portfolio.html) - Feature showcase
├── About (about.html) - Mission & technology
└── Contact (contact.html) - Problem-focused form
```

## 🎯 Success Metrics

After migration, monitor:
- Bounce rate (should decrease)
- Time on site (should increase)
- Contact form submissions
- Demo requests
- Page load performance

## 📝 Notes

- All v2 pages use existing CSS files - no new stylesheets needed
- Images reference existing files in `images/` directory
- JavaScript functionality preserved from original site
- Forms may need backend integration for production
- Consider adding Google Analytics tracking if not present

## 🤝 Support

If you encounter issues during migration:
1. Check browser console for errors
2. Verify all file paths are correct
3. Ensure CSS/JS files are in place
4. Test in different browsers

## ✅ Final Checklist

Before going live:
- [ ] All pages tested thoroughly
- [ ] Backup created and stored safely
- [ ] Team notified of changes
- [ ] Analytics tracking verified
- [ ] Forms connected to backend
- [ ] SEO meta tags updated
- [ ] Sitemap updated
- [ ] 404 page configured
- [ ] SSL certificate valid
- [ ] DNS records unchanged

---

**Migration completed by:** _________________
**Date:** _________________
**Version:** 2.0.0