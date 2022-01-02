(function ($) {

    /*-------------------------------------
    On Scroll 
    -------------------------------------*/
    $(window).on('scroll', function () {

        // Back Top Button
        if ($(window).scrollTop() > 700) {
            $('.scrollup').addClass('back-top');
        } else {
            $('.scrollup').removeClass('back-top');
        }
    });

    /*-------------------------------------
    Close Modal
    -------------------------------------*/
    $(".custom-close").on('click', function() {
        $('#add').modal('hide');
    });
    
    /*-------------------------------------
    Filter Search
    -------------------------------------*/
    $('#filter').on("change", function(e,v){
        var href=document.URL.split("&")[0].split("#")[0];
        window.location=href+"&filter="+$(".select2 option:selected").val();
    });

    /*-------------------------------------
    Rating selection
    -------------------------------------*/
    $('.rate-wrapper').on('click', '.rate .rate-item', function () {
        var self = $(this),
            target = self.parent('.rate');
        target.addClass('selected');
        target.find('.rate-item').removeClass('active');
        self.addClass('active');
    });

    /*-------------------------------------
    Countdown activation code
    -------------------------------------*/
    var eventCounter = $('#countdown');
    if (eventCounter.length) {
        eventCounter.countdown('2019/03/03', function (e) {
            $(this).html(e.strftime("<div class='countdown-section'><h2>%D</h2> <h3>day%!D</h3> </div><div class='countdown-section'><h2>%H</h2> <h3>Hour%!H</h3> </div><div class='countdown-section'><h2>%M</h2> <h3>Minutes</h3> </div><div class='countdown-section'><h2>%S</h2> <h3>Second</h3> </div>"))

        });
    }

    /*-------------------------------------
    Counter
    -------------------------------------*/
    var counterContainer = $('.counter');
    if (counterContainer.length) {
        counterContainer.counterUp({
            delay: 50,
            time: 900
        });
    }

    /*-------------------------------------
    Price range filter
    -------------------------------------*/
    var priceSlider = document.getElementById('price-range-filter');
    if (priceSlider) {
        noUiSlider.create(priceSlider, {
            start: [2000, 7000],
            connect: true,
            range: {
                'min': 0,
                'max': 9000
            },
            format: wNumb({
                decimals: 0
            }),
        });
        var marginMin = document.getElementById('price-range-min'),
            marginMax = document.getElementById('price-range-max');
        priceSlider.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                marginMax.innerHTML = "$" + values[handle];
            } else {
                marginMin.innerHTML = "$" + values[handle];
            }
        });
    }

    /*-------------------------------------
     Select2 activation code
     -------------------------------------*/
    if ($('select.select2').length) {
        $('select.select2').select2({
            theme: 'classic',
            dropdownAutoWidth: true,
            width: '100%' 
        });
        $('.opening-hours-wrap select.select2').select2({
            theme: 'classic',
            width: '100%' 
        });
    }

    /*-------------------------------------
     Google Map
    -------------------------------------*/
    if ($('#googleMap').length) {
        var initialize = function () {
            var mapOptions = {
                zoom: 15,
                scrollwheel: false,
                center: new google.maps.LatLng(-37.81618, 144.95692),
                styles: [{
                    stylers: [{
                        saturation: -100
                    }]
                }]
            };
            var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
            var marker = new google.maps.Marker({
                position: map.getCenter(),
                animation: google.maps.Animation.BOUNCE,
                icon: 'static/dio/img/map-marker.png',
                map: map
            });
        }
        // Add the map initialize function to the window load function
        google.maps.event.addDomListener(window, "load", initialize);
    }

    /*-------------------------------------
    Product View
    -------------------------------------*/
    $('.product-view-trigger').on('click', function (e) {
        var self = $(this),
            data = self.attr("data-type"),
            target = $("#listing-view");
        self.parents('.layout-switcher').find('li.active').removeClass('active');
        self.parent('li').addClass('active');
        target.children('.row').find('>div').animate({
            opacity: 0,
        }, 200, function () {
            if (data === "listing-box-grid") {
                target.removeClass('listing-box-list');
                target.addClass('listing-box-grid');
            } else if (data === "listing-box-list") {
                target.removeClass('listing-box-grid');
                target.addClass('listing-box-list');
            }
            target.children('.row').find('>div').animate({
                opacity: 1,
            }, 100);
        });
        e.preventDefault();
        return false;
    });

    /*-------------------------------------
    On click loadmore functionality 
    -------------------------------------*/
    $('.loadmore').on('click', 'a', function (e) {
        e.preventDefault();
        var _this = $(this),
            _parent = _this.parents('.menu-list-wrapper'),
            button_wrapper= _parent.find('.loadmore'),
            sm = button_wrapper.data('sm') || null,
            md = button_wrapper.data('md') || null,
            lg = button_wrapper.data('lg') || null,
            _target = _parent.find('.menu-list'),
            _set = _target.find('.menu-item.hidden').slice(0, 2);

            if(sm || md || lg){
                var wWidth = $(window).width();
                if(lg && wWidth > 991){
                    _set = _target.find('.menu-item.hidden').slice(0, lg);
                }else if(md && wWidth <= 991 && wWidth >= 768){
                    _set = _target.find('.menu-item.hidden').slice(0, md);
                }else if(sm && wWidth < 768){
                    _set = _target.find('.menu-item.hidden').slice(0, sm);
                } 
            }
            
        if (_set.length) {
            _set.animate({
                opacity: 0
            });
            _set.promise().done(function () {
                _set.removeClass('hidden');
                _set.show().animate({
                    opacity: 1
                }, 1000);
            });
        } else {
            _this.text('No more item to display');
        }
        return false;
    });

    /*-------------------------------------
    Tooltips 
    -------------------------------------*/
    $(document).on('mouseover', '.tooltip-item', function () {
            var self = $(this),
                tips = self.attr('data-tips');
            $tooltip = '<div class="dio-tooltip">' +
                '<div class="dio-tooltip-content">' + tips + '</div>' +
                '<div class="dio-tooltip-bottom"></div>' +
                '</div>';
            $('body').append($tooltip);
            var $tooltip = $('body > .dio-tooltip');
            var tHeight = $tooltip.outerHeight();
            var tBottomHeight = $tooltip.find('.dio-tooltip-bottom').outerHeight();
            var tWidth = $tooltip.outerWidth();
            var tHolderWidth = self.outerWidth();
            var top = self.offset().top - (tHeight + tBottomHeight);
            var left = self.offset().left;
            $tooltip.css({
                'top': top + 'px',
                'left': left + 'px',
                'opacity': 1
            }).show();
            if (tWidth <= tHolderWidth) {
                var itemLeft = (tHolderWidth - tWidth) / 2;
                left = left + itemLeft;
                $tooltip.css('left', left + 'px');
            } else {
                var itemLeft = (tWidth - tHolderWidth) / 2;
                left = left - itemLeft;
                if (left < 0) {
                    left = 0;
                }
                $tooltip.css('left', left + 'px');
            }
        })
        .on('mouseout', '.tooltip-item', function () {
            $('body > .dio-tooltip').remove();
        });

    /*-------------------------------------
    Active Menu
    -------------------------------------*/
    $('.site-menu li a').on('click', function () {
        $('.site-menu').find('.current').removeClass('current');
        $(this).parent().addClass('current');
    });


    $('.toggle-menu').on('click', function () {
        $('.site-menu').slideToggle(500);
        $(this).toggleClass('active');
    })

    /*-------------------------------------
    Menu fixded
    -------------------------------------*/
    if ($('header .header-main').length && $('header .header-main').hasClass('header-sticky')) {
        var header_position = $('header .header-main').offset(),
            lastScroll = 100;
        $(window).on('scroll load', function (event) {
            var st = $(this).scrollTop();
            if (st > header_position.top) {
                ($(".header-table").length) ? $('header .header-table').addClass("header-fixed"): $('header .header-main').addClass("header-fixed");
            } else {
                ($(".header-table").length) ? $('header .header-table').removeClass("header-fixed"): $('header .header-main').removeClass("header-fixed");
            }

            if (st > lastScroll && st > header_position.top) {
                ($(".header-table").length) ? $('header .header-table').addClass("hidden-menu"): $('header .header-main').addClass("hidden-menu");
            } else if (st <= lastScroll) {
                ($(".header-table").length) ? $('header .header-table').removeClass("hidden-menu"): $('header .header-main').removeClass("hidden-menu");
            }

            lastScroll = st;

            if (st === 0) {
                ($(".header-table").length) ? $('header .header-table').removeClass("header-fixed"): $('header .header-main').removeClass("header-fixed");
            }
        });
    }

    /*---------------------------------------
    On Click Section Switch
    --------------------------------------- */
    $('[data-type="section-switch"]').on('click', function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            if (target.length > 0) {

                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    /*-------------------------------------
    Carousel slider initiation
    -------------------------------------*/
    if ($.fn.owlCarousel) {
        $('.rc-carousel').each(function () {
            var carousel = $(this),
                loop = carousel.data('loop'),
                items = carousel.data('items'),
                margin = carousel.data('margin'),
                stagePadding = carousel.data('stage-padding'),
                autoplay = carousel.data('autoplay'),
                autoplayTimeout = carousel.data('autoplay-timeout'),
                smartSpeed = carousel.data('smart-speed'),
                dots = carousel.data('dots'),
                nav = carousel.data('nav'),
                navSpeed = carousel.data('nav-speed'),
                rXsmall = carousel.data('r-x-small'),
                rXsmallNav = carousel.data('r-x-small-nav'),
                rXsmallDots = carousel.data('r-x-small-dots'),
                rXmedium = carousel.data('r-x-medium'),
                rXmediumNav = carousel.data('r-x-medium-nav'),
                rXmediumDots = carousel.data('r-x-medium-dots'),
                rSmall = carousel.data('r-small'),
                rSmallNav = carousel.data('r-small-nav'),
                rSmallDots = carousel.data('r-small-dots'),
                rMedium = carousel.data('r-medium'),
                rMediumNav = carousel.data('r-medium-nav'),
                rMediumDots = carousel.data('r-medium-dots'),
                rLarge = carousel.data('r-large'),
                rLargeNav = carousel.data('r-large-nav'),
                rLargeDots = carousel.data('r-large-dots'),
                rExtraLarge = carousel.data('r-extra-large'),
                rExtraLargeNav = carousel.data('r-extra-large-nav'),
                rExtraLargeDots = carousel.data('r-extra-large-dots'),
                center = carousel.data('center'),
                custom_nav = carousel.data('custom-nav') || '';
            carousel.addClass('owl-carousel');
            var owl = carousel.owlCarousel({
                loop: (loop ? true : false),
                items: (items ? items : 4),
                lazyLoad: true,
                margin: (margin ? margin : 0),
                autoplay: (autoplay ? true : false),
                autoplayTimeout: (autoplayTimeout ? autoplayTimeout : 1000),
                smartSpeed: (smartSpeed ? smartSpeed : 250),
                dots: (dots ? true : false),
                nav: (nav ? true : false),
                navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
                navSpeed: (navSpeed ? true : false),
                center: (center ? true : false),
                responsiveClass: true,
                responsive: {
                    0: {
                        items: (rXsmall ? rXsmall : 1),
                        nav: (rXsmallNav ? true : false),
                        dots: (rXsmallDots ? true : false)
                    },
                    576: {
                        items: (rXmedium ? rXmedium : 2),
                        nav: (rXmediumNav ? true : false),
                        dots: (rXmediumDots ? true : false)
                    },
                    768: {
                        items: (rSmall ? rSmall : 3),
                        nav: (rSmallNav ? true : false),
                        dots: (rSmallDots ? true : false)
                    },
                    992: {
                        items: (rMedium ? rMedium : 4),
                        nav: (rMediumNav ? true : false),
                        dots: (rMediumDots ? true : false)
                    },
                    1200: {
                        items: (rLarge ? rLarge : 5),
                        nav: (rLargeNav ? true : false),
                        dots: (rLargeDots ? true : false)
                    },
                    1400: {
                        items: (rExtraLarge ? rExtraLarge : 6),
                        nav: (rExtraLargeNav ? true : false),
                        dots: (rExtraLargeDots ? true : false)
                    }
                }
            });
            if (custom_nav) {
                var nav = $(custom_nav),
                    nav_next = $('.rt-next', nav),
                    nav_prev = $('.rt-prev', nav);

                nav_next.on('click', function (e) {
                    e.preventDefault();
                    owl.trigger('next.owl.carousel', [350]);
                    owl.trigger('next.owl.carousel', [350]);
                    return false;
                });

                nav_prev.on('click', function (e) {
                    e.preventDefault();
                    owl.trigger('prev.owl.carousel', [350]);
                    owl.trigger('prev.owl.carousel', [350]);
                    return false;
                });
            }
        });
    }

    /*-------------------------------------
    Window On Load Function
    -------------------------------------*/
    $(window).on('load', function () {

        //Masonry
        var galleryIsoContainer = $('#no-equal-gallery');
        if (galleryIsoContainer.length) {
            var blogGallerIso = galleryIsoContainer.imagesLoaded(function () {
                blogGallerIso.isotope({
                    itemSelector: '.no-equal-item',
                    masonry: {
                        columnWidth: '.no-equal-item'
                    }
                });
            });
        }
 
        // Page Preloader
        setTimeout(function(){  
        $('#preloader').fadeOut(40, function () {
            $(this).remove();
        })}, 10);

        // Video Popup
        var yPopup = $(".popup-youtube");
        if (yPopup.length) {
            yPopup.magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
        }

        // Gallery Popup
        if ($('.zoom-gallery').length) {
            $('.zoom-gallery').each(function () {
                $(this).magnificPopup({
                    delegate: 'a.popup-zoom',
                    type: 'image',
                    gallery: {
                        enabled: true
                    }
                });
            });
        }

        //Slick Carousel 
        if ($.fn.slick) {

            $('.slick-carousel').each(function () {
                let $carousel = $(this);
                $carousel.imagesLoaded(function () {
                    var data = $carousel.data('slick'),
                        slidesToShowTab = data.slidesToShowTab,
                        slidesToShowMobileL = data.slidesToShowMobileL;
                    slidesToShowMobileS = data.slidesToShowMobileS;
                    $carousel.slick({
                        centerPadding: '0px',
                        responsive: [{
                                breakpoint: 991,
                                settings: {
                                    slidesToShow: slidesToShowTab,
                                    slidesToScroll: slidesToShowTab
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: slidesToShowMobileL,
                                    slidesToScroll: slidesToShowMobileL
                                }
                            },
                            {
                                breakpoint: 479,
                                settings: {
                                    slidesToShow: slidesToShowMobileS,
                                    slidesToScroll: slidesToShowMobileS
                                }
                            }
                        ]
                    });
                });
            });
        }
    });

    /*-------------------------------------
    Section background image 
    -------------------------------------*/
    imageFunction();

    function imageFunction() {

        $('[data-bg-image]').each(function () {
            var img = $(this).data('bg-image');
            $(this).css({
                backgroundImage: 'url(' + img + ')',
            });
        });
    }

    /*---------------------------------------
    Background Parallax
    --------------------------------------- */
    if ($('.parallaxie').length) {
        $(".parallaxie").parallaxie({
            speed: 0.5,
            offset: 0,
        });
    }

    /*-------------------------------------
    Contact Form initiating
    -------------------------------------*/
    var contactForm = $('#contact-form');
    if (contactForm.length) {
        contactForm.validator().on('submit', function (e) {
            var $this = $(this),
                $target = contactForm.find('.form-response');
            if (e.isDefaultPrevented()) {
                $target.html("<div class='alert alert-success'><p>Please select all required field.</p></div>");
            } else {
                $.ajax({
                    url: "static/dio/vendor/php/contact-form-process.php",
                    type: "POST",
                    data: contactForm.serialize(),
                    beforeSend: function () {
                        $target.html("<div class='alert alert-info'><p>Loading ...</p></div>");
                    },
                    success: function (text) {
                        if (text === "success") {
                            $this[0].reset();
                            $target.html("<div class='alert alert-success'><p>Message has been sent successfully.</p></div>");
                        } else {
                            $target.html("<div class='alert alert-success'><p>" + text + "</p></div>");
                        }
                    }
                });
                return false;
            }
        });
    }

})(jQuery);

function readURL(input) {
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('.image-upload-wrap').hide();
  
        $('.file-upload-image').attr('src', e.target.result);
        $('.file-upload-content').show();
  
        $('.image-title').html(input.files[0].name);
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } else {
      removeUpload();
    }
  }
  
  function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
  }
  $('.image-upload-wrap').bind('dragover', function () {
          $('.image-upload-wrap').addClass('image-dropping');
      });
      $('.image-upload-wrap').bind('dragleave', function () {
          $('.image-upload-wrap').removeClass('image-dropping');
  });

  /*--Start of Tawk.to Script--> */

      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
      var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://embed.tawk.to/5f526673f0e7167d000d817b/default';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
      })();