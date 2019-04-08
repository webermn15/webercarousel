/** Button/Anchor Keyboard User Fix **/
(function($, talonUtil, undefined){
    "use strict"; 

    talonUtil.a11yClick = function(event){
        if(event.type === 'click' || event.type === 'touchstart'){
            return true;
        }

        else if(event.type === 'keypress'){
            var code = event.charCode || event.keyCode;

            if(code === 32) {
                event.preventDefault();
            }

            if((code === 32)|| (code === 13)){
                return true;
            }

        } else {
            return false;
        }
    };

    talonUtil.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

})(jQuery, window.talonUtil = window.talonUtil || {});

$(document).ready(function() {

    /*
    * * * Lazy Loading * * * 
    */
   
    var lazyImages = $('.lazy').toArray();

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries, observers) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.src = entry.target.dataset.src;
                    entry.target.classList.remove('lazy');
                    observer.unobserve(entry.target);
                }
            })
        });
        lazyImages.forEach(function(image) {
            observer.observe(image);
        });
    }
    else {
        var backupLoader = function() {
            var activeLoad = false;

            if (activeLoad === false) {
                activeLoad = true;

                setTimeout(function() {
                    lazyImages.forEach(function(img) {
                        if ((img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) && getComputedStyle(img).display !== 'none') {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');

                            lazyImages.filter(function(node) {
                                return node !== img;
                            })

                            if (lazyImages.length === 0) {
                                document.removeEventListener('scroll', backupLoader);
                                window.removeEventListener('resize', backupLoader);
                                window.removeEventListener('orientationchange', backupLoader);
                            }
                        }
                    })

                    activeLoad = false;
                }, 200)
            }
        }
        
        document.addEventListener('scroll', backupLoader);
        window.addEventListener('resize', backupLoader);
        window.addEventListener('orientationchange', backupLoader);
    }
    

    /*
    * * * Custom carousel * * *
    */

    var alignScrollCenter = function(options, index, item, cScrollPos, closestDistance, cWidth, cCenter, distanceLeft, cButtonDirection) {
        /* convert items' measuring point to center isntead of left */
        var distanceCenter = distanceLeft + ($(item).width() / 2);
        var relDistanceCenter = cCenter - distanceCenter;
        var absDistanceCenter = Math.abs(relDistanceCenter);

        /* check if scroll was initiated by a web carousel button; snap normally if not */
        if (cButtonDirection === 'left') {
            if (Math.floor(relDistanceCenter) > 0 && (closestDistance === undefined || absDistanceCenter < closestDistance)) {
                return {
                    closestDistance: absDistanceCenter,
                    scrollAdjust: (cScrollPos - absDistanceCenter + options.snapOffset),
                    snapIndex: index
                }

            }
        }
        else if (cButtonDirection === 'right') {
            if (Math.ceil(relDistanceCenter) < 0 && (closestDistance === undefined || absDistanceCenter < closestDistance)) {
                return {
                    closestDistance: absDistanceCenter,
                    scrollAdjust: (cScrollPos + absDistanceCenter + options.snapOffset),
                    snapIndex: index
                }
            }
        }
        else {
            /* check if center of element is in view, get its absolute distance from the center if so */
            if (distanceCenter > 0 && distanceCenter <= cWidth) {
                /* set distance checking variable if not defined or check next iteration against previous items' abs distance from center */
                if (closestDistance === undefined || closestDistance >= absDistanceCenter) {
                    return {
                        closestDistance: absDistanceCenter,
                        scrollAdjust: (cScrollPos - relDistanceCenter + options.snapOffset),
                        snapIndex: index
                    }
                }
            }
        }
    }

    var alignScrollLeft = function(options, index, item, cScrollPos, closestDistance, cWidth, distanceLeft, cButtonDirection) {
        /* get the abs distance from the left side of the carousel */
        var absDistanceLeft = Math.abs(distanceLeft);

        /* check if scroll was initiated by a web carousel button; snap normally if not */
        if (cButtonDirection === 'left') {
            /* set distance variable if not defined or check next iteration against previous items' abs distance */
            if (Math.ceil(distanceLeft) < 0 && (closestDistance === undefined || absDistanceLeft < closestDistance)) {
                return {
                    closestDistance: absDistanceLeft,
                    scrollAdjust: (cScrollPos - absDistanceLeft + options.snapOffset),
                    snapIndex: index
                }
            }
        }
        else if (cButtonDirection === 'right') {
            if (Math.floor(distanceLeft) > 0 && closestDistance === undefined || absDistanceLeft < closestDistance) {
                return {
                    closestDistance: absDistanceLeft,
                    scrollAdjust: (cScrollPos + absDistanceLeft + options.snapOffset),
                    snapIndex: index
                }
            }
        }
        else {
            if (closestDistance === undefined || closestDistance >= absDistanceLeft) {
                return {
                    closestDistance: absDistanceLeft,
                    scrollAdjust: (cScrollPos + distanceLeft + options.snapOffset),
                    snapIndex: index
                }
            }
        }
    }

    var alignScrollRight = function(options, index, item, cScrollPos, closestDistance, cWidth, distanceRight, cButtonDirection) {
        /* get the right align distance from the right edge of carousel */
        var relDistanceRight = cWidth - distanceRight;
        var absDistanceRight = Math.abs(relDistanceRight);

        /* check if scroll was initiated by a web carousel button; snap normally if not */
        if (cButtonDirection === 'left') {
            if (Math.floor(relDistanceRight) > 0 && (closestDistance === undefined || absDistanceRight < closestDistance)) {
                return {
                    closestDistance: absDistanceRight,
                    scrollAdjust: (cScrollPos - absDistanceRight + options.snapOffset),
                    snapIndex: index
                }
            }
        }
        else if (cButtonDirection === 'right') {
            if (Math.ceil(relDistanceRight) < 0 && (closestDistance === undefined || absDistanceRight < closestDistance)) {
                return {
                    closestDistance: absDistanceRight,
                    scrollAdjust: (cScrollPos + absDistanceRight + options.snapOffset),
                    snapIndex: index
                }
            }
        }
        else {
            if (closestDistance === undefined || closestDistance >= absDistanceRight) {
                return {
                    closestDistance: absDistanceRight,
                    scrollAdjust: (cScrollPos - relDistanceRight + options.snapOffset),
                    snapIndex: index
                }
            }
        }
    }

    /* carousel scroll repositioner */
    var weberCarouselScroll = function(options, $cElement, cWidth, cCenter, cOffset, cScrollWidth, itemLeftBounds, cButtons, cButtonDirection) {
        /* get new scroll position */
        var cScrollPos = $cElement.scrollLeft();

        /* hold variables to compare elements and set scroll amount */
        var closestDistance;
        var scrollAdjust;
        var snapIndex;

        $cElement.children().each(function(_index, item) {
            /* get elements positions in carousel */
            var distanceLeft =  $(item).offset().left - cOffset;
            var distanceRight = distanceLeft + ($(item).width());

            /* fade obscured elements if enabled (disabled by default) */
            if (options.fadeObscured === true) {
                if (distanceLeft <= -1 || distanceRight >= (cWidth + 1) ) {
                    $(item).css('opacity', options.fadeOpacity);
                }
                else {
                    $(item).css('opacity', 1);
                }
            }

            /* check alignment & calculate reposition accordingly */
            if (options.snapAlignment === 'center') {
                var centerAlignment = alignScrollCenter(options, _index, item, cScrollPos, closestDistance, cWidth, cCenter, distanceLeft, cButtonDirection);
                if (!!centerAlignment) {
                    closestDistance = centerAlignment.closestDistance;
                    scrollAdjust = centerAlignment.scrollAdjust;
                    snapIndex = centerAlignment.snapIndex;
                }
            }
            else if (options.snapAlignment === 'left') {
                var leftAlignment = alignScrollLeft(options, _index, item, cScrollPos, closestDistance, cWidth, distanceLeft, cButtonDirection);
                if (!!leftAlignment) {
                    closestDistance = leftAlignment.closestDistance;
                    scrollAdjust = leftAlignment.scrollAdjust;
                    snapIndex = centerAlignment.snapIndex;
                }
            }
            else if (options.snapAlignment === 'right') {
                var rightAlignment = alignScrollRight(options, _index, item, cScrollPos, closestDistance, cWidth, distanceRight, cButtonDirection);
                if (!!rightAlignment) {
                    closestDistance = rightAlignment.closestDistance;
                    scrollAdjust = rightAlignment.scrollAdjust;
                    snapIndex = centerAlignment.snapIndex;
                }
            }
        });

        /* snap styling changes */
        if (Math.abs(scrollAdjust - itemLeftBounds[snapIndex]) <= options.snapMargin) {
            cButtons.removeClass('hero-indicator__button--selected');
            cButtons.eq(snapIndex).addClass('hero-indicator__button--selected');
            var bgImageUrl = $cElement.children().eq(snapIndex).data('bgimage');
            $('.hero__bg').css({background: 'url('+bgImageUrl+')', backgroundSize: 'cover'})
        }
        
        /* prevent snapping on full left or right scroll (enabled by default) */
        if (!cButtonDirection) {
            if (options.preventEdgeSnapping && cScrollPos <= 2 || options.preventEdgeSnapping && (cScrollPos + cWidth) >= (cScrollWidth - 2)) {
                return false;
            }
        }

        /* check declared margin for reposition, animate reposition if criteria not met */
        if (closestDistance >= options.snapMargin) {
            $cElement.animate({
                scrollLeft: scrollAdjust
            }, options.animationLength);
        }
    }


    /* carousel functionality for hero */
    $('.weber-carousel__hero').each(function(_index, _element){
        /* grab carousel elements */
        var $carousel = $(this);
        var $carouselSlideButtons = $('.weber-carousel__hero-buttons').children();
        var $carouselItems = $carousel.children();

        /* set up context, enums, import options */
        var carouselSettingsData = $carousel.data('webcarousel') || {};
        var alignEnums = {center: 0, left: 1, right: 2};
        var alEn = Object.freeze(alignEnums);
        var defaults = {
            snapOffset: 0,
            snapAlignment: 'center',
            snapMargin: 5,
            preventEdgeSnapping: true,
            animationLength: 250,
            fadeObscured: false,
            fadeOpacity: 0.5,
            debounce: 200
        }
        /* default to center if snapAlignment is not set properly */
        if (Object.keys(alEn).indexOf(carouselSettingsData.snapAlignment) < 0) {
            carouselSettingsData.snapAlignment = 'center';
        }
        var selectedOptions = $.extend({}, defaults, carouselSettingsData);

        /* get width and positioning values */
        var carouselWidth = $carousel.width(),
            carouselCenter = carouselWidth / 2,
            carouselOffset = $carousel.offset().left,
            carouselScrollWidth = $carousel[0].scrollWidth;
            // carouselItemWidth = $carouselItems.width();
        var childLeftBounds = $carouselItems.map(function(_index, domNode) {
            return $(domNode).offset().left + $carousel.scrollLeft();
        }).get();

        /* handle view changes for width & positioning */
        var handleWindowChanges = talonUtil.debounce(function() {
            carouselWidth = $carousel.width();
            carouselCenter = carouselWidth / 2;
            carouselOffset = $carousel.offset().left;
            carouselScrollWidth = $carousel[0].scrollWidth;
            // carouselItemWidth = $carouselItems.width();
            childLeftBounds = $carouselItems.map(function(_index, domNode) {
                return $(domNode).offset().left + $carousel.scrollLeft();
            });
            $carousel.children().css('opacity', 1);
            $carousel.animate({
                scrollLeft: 0
            }, selectedOptions.animationLength);
        }, 200);

        /* handle button interaction if exists */
        /* I KNOW THIS IS SLOPPY I HATE IT */
        if ($carouselSlideButtons.length > 0) {
            $carouselSlideButtons.each(function(_index, button) {
                $(button).on('click', function() {
                    var scrollAdjust = childLeftBounds[_index];
                    $carousel.animate({
                        scrollLeft: scrollAdjust
                    }, selectedOptions.animationLength);
                });
            });
        }

        /* bind event listeners */
        $(window).on('resize', handleWindowChanges);
        $(window).on('orientationchange', handleWindowChanges);
        $carousel.on('scroll', talonUtil.debounce(function() {
            weberCarouselScroll(selectedOptions, $carousel, carouselWidth, carouselCenter, carouselOffset, carouselScrollWidth, childLeftBounds, $carouselSlideButtons);
        }, selectedOptions.debounce));
    });


    /* build da plugin here */

    // var WeberCarousel = (function() {
        
    //     function WeberCarousel(element, options) {
    //         var _ = this;
    //     }

    // });





    /** Click Navigation **/
    // $(".main-nav").clickMenu();
    $(".nav-rail").clickMenu({menutype:"accordion", expanders:true});

    /** Stop referrer Phishing hack */
    $("a[target=_blank], a[target=new]").attr("rel", "noopener noreferrer");
    

    /** Click vs. Keyboard user **/
    $('body').on("click", function () {
        var $html = $("html");
        if (!$html.hasClass("click-user")) {
            $html.removeClass("keyboard-user").addClass("click-user");
        }   
    }); 

    $('body').on("keyup", function () {
        var $html = $("html");
        if (!$html.hasClass("keyboard-user")) {
            $html.removeClass("click-user").addClass("keyboard-user");
        }
    });
    

    /** Remove pointer events to assist with FPS **/
    var body = document.body,
        cover = document.createElement('div'),
        timer;

    cover.setAttribute('class', 'scroll-cover');

    window.addEventListener('scroll', function () {
        clearTimeout(timer);
        body.appendChild(cover);
 
        timer = setTimeout(function () {
            body.removeChild(cover);
        }, 300);
    }, false);


    /** iOS FIX to incorrect focus bug with keyboard not showing up and then the last touchup element gets clicked. **/
    if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
        (function ($) {
            return $.fn.focus = function () {
                return arguments[0];
            };
        })(jQuery);
    }
});  