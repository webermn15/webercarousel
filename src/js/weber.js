(function($) {

	/* debounce */
	var debounce = function (func, wait, immediate) {
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

    var WeberCarousel = (function() {

    	function WeberCarousel(element, options) {
    		var _ = this;

    		_.defaultOptions = {
	            snapOffset: 0,
	            snapAlignment: 'center',
	            snapMargin: 5,
	            preventEdgeSnapping: true,
	            animationLength: 250,
	            fadeObscured: false,
	            fadeOpacity: 0.5,
	            debounce: 200
	        }

	        var dataObject = $(element).data() || {};

	        _.options = $.extend({}, _.defaultOptions, options);

	        _.carousel = element;
	        _.$carousel = $(element);
	        _.$carouselItems = _.$carousel.children();

	        _.viewportChangeHandler = $.proxy(_.viewportChangeHandler, _);
	        _.scrollHandler = $.proxy(_.scrollHandler, _);

	        _.init();
	    }

	    return WeberCarousel;
    })();

    WeberCarousel.prototype.init = function() {
    	var _ = this;

		_.viewportChangeHandler();

		/* bind window changes */
		var debouncedResizeHandler = debounce(_.viewportChangeHandler, _.options.debounce);
		var debouncedScrollHandler = debounce(_.scrollHandler, _.options.debounce);

        $(window).on('resize', debouncedResizeHandler);
        $(window).on('orientationchange', debouncedResizeHandler);
        _.$carousel.on('scroll', debouncedScrollHandler);
    };

    WeberCarousel.prototype.viewportChangeHandler = function() {
    	var _ = this;

    	/* get width & positioning properties */
        _.carouselWidth = _.$carousel.width();
        _.carouselCenter = (_.carouselWidth / 2);
        _.carouselOffset = _.$carousel.offset().left;
        _.carouselScrollWidth = _.carousel.scrollWidth;
        _.childLeftBounds = _.$carouselItems.map(function(_index, child) {
        	return $(child).offset().left + _.$carousel.scrollLeft();
        }).get();
    };

    WeberCarousel.prototype.scrollHandler = function() {
    	var _ = this,
    		scrollPosition = _.$carousel.scrollLeft(),
    		closestDistance,
    		scrollAdjust,
    		snapIndex;

    	_.$carouselItems.each(function(_index, item) {
    		var distanceLeft = $(item).offset().left = _.carouselOffset,
    			distanceRight = distanceLeft + ($(item).width());

    		
    	});
    };

    $.fn.weberCarousel = function() {
    	var _ = this,
    		opt = arguments[0],
    		args = Array.prototype.slice.call(arguments, 1),
    		l = _.length,
    		i = 0,
    		ret;

    	for (i; i < l; i++) {
    		if (typeof opt == 'object' || typeof opt == 'undefined') {
    			_[i].weberCarousel = new WeberCarousel(_[i], opt);
    		}
    		else {
    			throw new Error('Type of argument is not object');
    		}
    	}

    	return _;

    }
})(jQuery);










