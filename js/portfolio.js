/* ============================================================
   Portfolio image handling.
   Progressive image slots: each <img class="slot-img"> tries its real
   src (the path where the owner will drop the final file). If that is
   missing, it falls back once to data-fallback (an existing interim
   asset) where provided. If nothing loads, the image hides and its
   framed container shows as an intentional neutral placeholder.
   No text, gradient, or stock is baked into the placeholder.
   ============================================================ */
(function () {
    'use strict';

    function hide(img) {
        img.style.display = 'none';
        var frame = img.closest('.slot');
        if (frame) frame.classList.add('slot--empty');
    }

    function handleError(img) {
        var fallback = img.getAttribute('data-fallback');
        if (fallback && img.getAttribute('data-fallback-used') !== 'true') {
            img.setAttribute('data-fallback-used', 'true');
            img.src = fallback;
        } else {
            hide(img);
        }
    }

    var imgs = Array.prototype.slice.call(document.querySelectorAll('.slot-img'));
    imgs.forEach(function (img) {
        img.addEventListener('error', function () { handleError(img); });
        // Catch images that already failed before this script ran.
        if (img.complete && img.naturalWidth === 0) { handleError(img); }
    });
})();
