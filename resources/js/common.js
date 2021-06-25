jQuery(function($) {
	
	$('.mobile-btn').on('click', function() {
		$(this).toggleClass('active');
		$('.header__menu').toggleClass('open');
	});

	function toggleSubmenu(){
		$('.toggle-link').click(function(){
			if($(window).width() < 992){
				$(this).toggleClass('active').find('.sub-menu').slideToggle(50);
			}
		})
	}

	toggleSubmenu();

	// $(window).resize(function(){toggleSubmenu()});
	

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

	// Tabs

	$('.info-item[data-id="0"]').show();

	$('.tab-link').click( function (e) {
		const id = $(this).data('id');

		e.preventDefault();
		if($(this).hasClass('active')) return;
		$('.tab-link').removeClass('active');
		$(this).addClass('active');

		$('.info-item').hide();
		$('.info-item[data-id="'+id+'"]').show();

	})

});
