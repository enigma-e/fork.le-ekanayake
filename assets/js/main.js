
(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$nav = $('#nav');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Tweaks/fixes.

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Keep the current section highlighted while preserving native link navigation.
	var $sectionLinks = $nav.find('a[href^="#"]');

	function setCurrentSection($link) {
		$sectionLinks.removeClass('active').removeAttr('aria-current');
		$link.addClass('active').attr('aria-current', 'location');
	}

	$sectionLinks.filter('.active').attr('aria-current', 'location');
	$sectionLinks.each(function() {
		var $link = $(this);

		$link.on('click', function() {
			setCurrentSection($link);
		});
		$($link.attr('href')).scrollex({
			mode: 'middle',
			top: '5vh',
			bottom: '5vh',
			enter: function() {
				setCurrentSection($link);
			}
		});
	});

	var $titleBar = $(
		'<div id="titleBar">' +
			'<span class="title">' + $('#logo').html() + '</span>' +
			'<button type="button" class="toggle" aria-label="Navigation menu" ' +
				'aria-controls="header" aria-expanded="false"></button>' +
		'</div>'
	).insertBefore($header);
	var toggle = $titleBar.find('.toggle')[0],
		header = $header[0],
		mobile = window.matchMedia('(max-width: 1024px)');

	function closeMenu() {
		$body.removeClass('header-visible');
	}

	function syncMenu() {
		var expanded = mobile.matches && $body.hasClass('header-visible');

		if (mobile.matches && !expanded && header.contains(document.activeElement))
			toggle.focus({ preventScroll: true });
		else if (!mobile.matches && $titleBar[0].contains(document.activeElement))
			document.querySelector('#logo a').focus({ preventScroll: true });

		header.inert = mobile.matches && !expanded;
		toggle.setAttribute('aria-expanded', String(expanded));
	}

	$titleBar.on('click touchend', function(event) {
		event.stopPropagation();
	});
	$(toggle).on('click', function() {
		$body.toggleClass('header-visible');
		syncMenu();
	});

	$header.panel({
		delay: 500,
		hideOnEscape: true,
		hideOnSwipe: true,
		resetScroll: true,
		side: 'right',
		target: $body,
		visibleClass: 'header-visible'
	});
	$header.add($titleBar).on('click', 'a', closeMenu);
	$(document).on('focusin', function(event) {
		if (!header.contains(event.target) && !$titleBar[0].contains(event.target))
			closeMenu();
	});
	mobile.addEventListener('change', function() {
		if (!mobile.matches)
			closeMenu();
		syncMenu();
	});
	new MutationObserver(syncMenu).observe(document.body, {
		attributes: true,
		attributeFilter: ['class']
	});
	$body.addClass('has-mobile-menu');
	syncMenu();

})(jQuery);

/* Add move to top functionality */
(function(){

    var backToTopButton = document.getElementById("btnBackToTop");
    var header = document.getElementById("header");
    var body = document.body;

    if (!backToTopButton) return;

    function isDesktop() {
        return !window.matchMedia("(max-width: 1024px)").matches;
    }

    function isHeaderVisible() {
        // Desktop: header is always visible.
        // Mobile/tablet: visible only when panel is opened.
        return isDesktop() || body.classList.contains("header-visible");
    }

    function updateBackToTopPosition() {
        if (!header || !isHeaderVisible()) {
            backToTopButton.style.right = "30px";
            return;
        }

        var headerWidth = header.getBoundingClientRect().width || 0;
        var gap = isDesktop() ? 30 : 20; // a little tighter on mobile panel
        backToTopButton.style.right = (Math.round(headerWidth) + gap) + "px";
    }

    function updateBackToTopVisibility() {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    }

    window.addEventListener("scroll", updateBackToTopVisibility);
    window.addEventListener("resize", updateBackToTopPosition);
    window.addEventListener("orientationchange", updateBackToTopPosition);
    window.addEventListener("load", function () {
        updateBackToTopPosition();
        updateBackToTopVisibility();
    });

    // Watch body class changes (panel open/close toggles "header-visible")
    var observer = new MutationObserver(updateBackToTopPosition);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

	// Button action
    backToTopButton.onclick = function () {
        var topLink = document.querySelector(isDesktop() ? "#logo a" : "#titleBar .title a, #logo a");
        topLink.focus({ preventScroll: true });
        window.scrollTo(0, 0);
    };

})();
