/*!
 * comparison-slider
 * https://github.com/yomotsu/comparison-slider
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.ComparisonSlider = factory());
}(this, (function () { 'use strict';

	const $style = document.createElement('style');
	$style.innerHTML = /* css */ `
.ComparisonSlider {
	position: relative;
	overflow: hidden;
}
.ComparisonSlider.-auto,
.ComparisonSlider.-dragging {
	cursor: col-resize;
}
.ComparisonSlider__Before,
.ComparisonSlider__After {
	position: absolute;
	top: 0;
	left: 0;
	display: block;
	width: 100%;
	height: 100%;
	background-position: 50% 50%;
	background-size: cover;
}
.ComparisonSlider__Before > img,
.ComparisonSlider__After > img {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.ComparisonSlider__Handle {
	cursor: col-resize;
	position: absolute;
	box-sizing: border-box;
	top: 50%;
	width: 44px;
	height: 44px;
	border: 3px solid #fff;
	border-radius: 100px;
	filter: drop-shadow( 0 0 12px rgba( 51, 51, 51, 0.5 ) );
	background: url("data:image/svg+xml,%3Csvg%20fill=%22%23fff%22%20preserveAspectRatio=%22none%22%20viewBox=%220%200%2046%2046%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22m39.808%2023-10%208v-16z%22/%3E%3Cpath%20d=%22m6.192%2023%2010-8v16z%22/%3E%3C/svg%3E" ) 50% 50% / 100% 100%;
}
.ComparisonSlider__Handle::before,
.ComparisonSlider__Handle::after {
	content: "";
	position: absolute;
	left: 50%;
	display: block;
	width: 3px;
	height: 1024px;
	margin-left: -1.5px;
	background-color: #fff;
}
.ComparisonSlider__Handle::before {
	bottom: 50%;
	margin-bottom: 22px;
}
.ComparisonSlider__Handle::after {
	top: 50%;
	margin-top: 22px;
}
`;
	document.head.insertBefore($style, document.head.firstChild);

	function clamp(value, min = 0, max = 1) {
	    return Math.max(min, Math.min(max, value));
	}

	function selectorToElement(selectorOrHTMLElement, $parent) {
	    if (selectorOrHTMLElement instanceof HTMLElement) {
	        return selectorOrHTMLElement;
	    }
	    const element = ($parent || document).querySelector(selectorOrHTMLElement);
	    if (element instanceof HTMLElement) {
	        return element;
	    }
	    return document.createElement('div');
	}

	function matches(el, selector) {
	    if (!!Element.prototype.matches) {
	        return el.matches(selector);
	    }
	    if (!!Element.prototype.msMatchesSelector) {
	        return el.msMatchesSelector(selector);
	    }
	    return false;
	}

	function debounce(func, wait = 200) {
	    let timeoutID;
	    return function (...args) {
	        clearTimeout(timeoutID);
	        const context = this;
	        timeoutID = window.setTimeout(() => func.apply(context, args), wait);
	    };
	}

	class ComparisonSlider {
	    constructor($el = '.ComparisonSlider', options = {}) {
	        this._left = 0;
	        this._width = 0;
	        this._offset = 0.5;
	        this._auto = false;
	        const scope = this;
	        this.$el = selectorToElement($el);
	        this.$before = selectorToElement(options.$before || '.ComparisonSlider__Before', this.$el);
	        this.$after = selectorToElement(options.$after || '.ComparisonSlider__After', this.$el);
	        this.$handle = selectorToElement(options.$handle || '.ComparisonSlider__Handle', this.$el);
	        this.$before.classList.add('ComparisonSlider__Before');
	        this.$after.classList.add('ComparisonSlider__After');
	        this.$handle.classList.add('ComparisonSlider__Handle');
	        this.$el.appendChild(this.$before);
	        this.$el.appendChild(this.$after);
	        this.$el.appendChild(this.$handle);
	        this.handleOnlyControl = options.handleOnlyControl || false;
	        this._auto = options.auto || false;
	        this.update();
	        this.draw();
	        // mouse events
	        let dragStartX = 0;
	        if (this._auto) {
	            const $autoArea = options.autoArea || this.$el;
	            this.$el.classList.add('-auto');
	            $autoArea.addEventListener('mousemove', dragging);
	            $autoArea.addEventListener('touchmove', dragging);
	        }
	        else {
	            this.$el.addEventListener('mousedown', onMouseDown);
	            this.$el.addEventListener('touchstart', onTouchStart);
	        }
	        this.$el.addEventListener('contextmenu', onContextMenu);
	        const onWindowResize = debounce(() => {
	            this.update();
	            this.draw();
	        }, 60);
	        window.addEventListener('resize', onWindowResize);
	        function onMouseDown(event) {
	            event.preventDefault();
	            if (scope.handleOnlyControl) {
	                if (!matches(event.target, '.ComparisonSlider__Handle'))
	                    return;
	                startDragging(event);
	            }
	            else {
	                startDragging(event);
	            }
	        }
	        function onTouchStart(event) {
	            event.preventDefault();
	            startDragging(event);
	        }
	        function onContextMenu(event) {
	            event.preventDefault();
	        }
	        function startDragging(event) {
	            scope.update();
	            const _event = normalizePointerEvent(event);
	            dragStartX = _event.pageX;
	            scope.offset = (_event.pageX - scope._left) / scope._width;
	            scope._toggleClassNames(true);
	            scope._toggleTransitionMode(true);
	            document.addEventListener('mousemove', dragging);
	            document.addEventListener('touchmove', dragging);
	            document.addEventListener('mouseup', endDragging);
	            document.addEventListener('touchend', endDragging);
	        }
	        function dragging(event) {
	            const _event = normalizePointerEvent(event);
	            scope.offset = (_event.pageX - scope._left) / scope._width;
	            if (Math.abs(dragStartX - _event.pageX) > 5) {
	                scope._toggleTransitionMode(false);
	            }
	        }
	        function endDragging() {
	            scope._toggleClassNames(false);
	            document.removeEventListener('mousemove', dragging);
	            document.removeEventListener('touchmove', dragging);
	            document.removeEventListener('mouseup', endDragging);
	            document.removeEventListener('touchend', endDragging);
	        }
	        //
	        this.destroy = () => {
	            this.$el.removeEventListener('mousedown', onMouseDown);
	            this.$el.removeEventListener('touchstart', onTouchStart);
	            this.$el.removeEventListener('contextmenu', onContextMenu);
	            this.$el.addEventListener('mousemove', dragging);
	            this.$el.addEventListener('touchmove', dragging);
	            if (!!options.autoArea) {
	                options.autoArea.addEventListener('mousemove', dragging);
	                options.autoArea.addEventListener('touchmove', dragging);
	            }
	            document.removeEventListener('mousemove', dragging);
	            document.removeEventListener('touchmove', dragging);
	            document.removeEventListener('mouseup', endDragging);
	            document.removeEventListener('touchend', endDragging);
	            window.removeEventListener('resize', onWindowResize);
	        };
	    }
	    set offset(offset) {
	        const _offset = clamp(offset, 0, 1);
	        if (_offset === this._offset)
	            return;
	        this._offset = _offset;
	        this.draw();
	    }
	    get offset() {
	        return this._offset;
	    }
	    update() {
	        const rect = this.$el.getBoundingClientRect();
	        this._left = rect.left;
	        this._width = rect.width;
	    }
	    draw() {
	        const left = clamp(this._width * this.offset, 0, this._width);
	        this.$handle.style.transform = `translateX( ${left}px ) translateX( -50% ) translateY( -50% )`;
	        this.$before.style.clipPath = `inset(0 ${(1 - this.offset) * 100}% 0 0)`;
	        this.$after.style.clipPath = `inset(0 0 0 ${this.offset * 100}%)`;
	    }
	    _toggleClassNames(enabled) {
	        if (enabled) {
	            this.$el.classList.add('-dragging');
	        }
	        else {
	            this.$el.classList.remove('-dragging');
	        }
	    }
	    _toggleTransitionMode(enabled) {
	        if (enabled) {
	            this.$after.style.transition = 'clip .2s';
	            this.$handle.style.transition = 'transform .2s';
	        }
	        else {
	            this.$after.style.transition = 'none';
	            this.$handle.style.transition = 'none';
	        }
	    }
	}
	function normalizePointerEvent(event) {
	    return 'ontouchstart' in window && event instanceof TouchEvent ? event.touches[0] : event;
	}
	document.addEventListener('DOMContentLoaded', () => {
	    Array.prototype.forEach.call(document.querySelectorAll('[data-comparison-slider-auto]'), ($el) => new ComparisonSlider($el));
	}, { once: true });

	return ComparisonSlider;

})));
