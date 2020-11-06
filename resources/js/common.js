jQuery(function($) {
	
	$('.mobile-btn').on('click', function() {
		$(this).toggleClass('active');
		$('.header__menu').toggleClass('open');
	});

	//Hide Menu on Scroll
	var hideHeaderPos = 82;

	/* опускающийся хедер при прокрутке вверх */
	var prevScrollpos = window.pageYOffset;
	$(window).scroll( function() {
		var currentScrollPos = window.pageYOffset;
		if (currentScrollPos > hideHeaderPos) {
			if (prevScrollpos > currentScrollPos) {
				document.getElementById("header").classList.remove("hide");
				document.getElementById("header").classList.add("show");
			} else {
				document.getElementById("header").classList.remove("show");
				document.getElementById("header").classList.add("hide");
			}
			prevScrollpos = currentScrollPos;
				// $('.header').attr('style')
			} else {
				document.getElementById("header").classList.remove('show', 'hide');
			}
	});

	$('.onescreen__slider').slick({
		autoplay: true,
		infinity: true,
		arrows: false,
		dots: true,
		adaptiveHeight: true,
		lazyLoad: false
	});

	$('select').select2({
		minimumResultsForSearch: Infinity,
		width: '100%',
		dropdownParent: $('.select-wrapper')
	});

});
