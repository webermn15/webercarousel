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

	        console.log('___________');
	        console.log(element, options);
	        console.log(_);
	        console.log('___________');
	    }

	    return WeberCarousel;
    })

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
    		// else??
    	}

    }
})(jQuery);










