/* ============================================================
   Free Homepage funnel page interactivity (vanilla JS)
   - Scroll reveal for sections
   - FAQ accordion (accessible)
   - Sticky mobile CTA show/hide
   - Smooth scroll for in-page anchors
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
