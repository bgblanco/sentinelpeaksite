/* ============================================================
   Free Homepage funnel page interactivity (vanilla JS)
   - Scroll reveal for sections
   - Animated stat counters
   - FAQ accordion (accessible)
   - Sticky mobile CTA show/hide
   - Smooth scroll for in-page anchors
   - Lead form: honeypot + validation + Web3Forms submit
   ============================================================ */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Smooth scroll for [data-scroll] anchors ---------- */
    document.querySelectorAll('[data-scroll]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = link.getAttribute('href');
            if (!targetId || targetId.charAt(0) !== '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });

    /* ---------- Scroll reveal ---------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---------- Animated stat counters ---------- */
    var counters = Array.prototype.slice.call(document.querySelectorAll('.stat-num'));

    function renderCounter(el, value) {
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        el.textContent = prefix + value + suffix;
    }

    function runCounter(el) {
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        if (reduceMotion) { renderCounter(el, target); return; }
        var duration = 1200;
        var start = null;
        function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            renderCounter(el, Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if (counters.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            counters.forEach(function (el) {
                renderCounter(el, parseInt(el.getAttribute('data-target'), 10) || 0);
            });
        } else {
            var counterObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        runCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(function (el) { counterObserver.observe(el); });
        }
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-q').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var expanded = btn.getAttribute('aria-expanded') === 'true';
            var panel = btn.nextElementSibling;
            btn.setAttribute('aria-expanded', String(!expanded));
            if (expanded) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });

    /* ---------- Sticky mobile CTA ---------- */
    var stickyCta = document.getElementById('stickyCta');
    var hero = document.querySelector('.funnel-hero');
    var formSection = document.getElementById('get-started');

    if (stickyCta && hero && 'IntersectionObserver' in window) {
        var pastHero = false;
        var formVisible = false;

        function updateSticky() {
            if (pastHero && !formVisible) {
                stickyCta.classList.add('is-visible');
                stickyCta.setAttribute('aria-hidden', 'false');
            } else {
                stickyCta.classList.remove('is-visible');
                stickyCta.setAttribute('aria-hidden', 'true');
            }
        }

        new IntersectionObserver(function (entries) {
            pastHero = !entries[0].isIntersecting;
            updateSticky();
        }, { threshold: 0 }).observe(hero);

        if (formSection) {
            new IntersectionObserver(function (entries) {
                formVisible = entries[0].isIntersecting;
                updateSticky();
            }, { threshold: 0.1 }).observe(formSection);
        }
    }

    /* Note: the lead form is an embedded GoHighLevel iframe, which handles its
       own validation and submission. No custom form JS is needed here. */
})();
