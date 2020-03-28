/*!
 * comparison-slider
 * https://github.com/yomotsu/comparison-slider
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
var $style = document.createElement('style');
$style.innerHTML = "\n.ComparisonSlider {\n\tposition: relative;\n\toverflow: hidden;\n}\n.ComparisonSlider.-auto,\n.ComparisonSlider.-dragging {\n\tcursor: col-resize;\n}\n.ComparisonSlider__Before,\n.ComparisonSlider__After {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tdisplay: block;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-position: 50% 50%;\n\tbackground-size: cover;\n}\n.ComparisonSlider__Handle {\n\tcursor: col-resize;\n\tposition: absolute;\n\tbox-sizing: border-box;\n\ttop: 50%;\n\twidth: 44px;\n\theight: 44px;\n\tborder: 3px solid #fff;\n\tborder-radius: 100px;\n\tbox-shadow: 0px 0px 12px rgba( 51, 51, 51, 0.5 );\n\tbackground: url(\"data:image/svg+xml,%3Csvg%20fill=%22%23fff%22%20preserveAspectRatio=%22none%22%20viewBox=%220%200%2046%2046%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22m39.808%2023-10%208v-16z%22/%3E%3Cpath%20d=%22m6.192%2023%2010-8v16z%22/%3E%3C/svg%3E\" ) 50% 50% / 100% 100%;\n}\n@supports (filter: drop-shadow( 0 0 0 #000 )) {\n\t.ComparisonSlider__Handle {\n\t\tbox-shadow: none;\n\t\tfilter: drop-shadow( 0 0 12px rgba( 51, 51, 51, 0.5 ) );\n\t}\n}\n.ComparisonSlider__Handle::before,\n.ComparisonSlider__Handle::after {\n\tcontent: \"\";\n\tposition: absolute;\n\tleft: 50%;\n\tdisplay: block;\n\twidth: 3px;\n\theight: 1024px;\n\tmargin-left: -1.5px;\n\tbackground-color: #fff;\n}\n.ComparisonSlider__Handle::before {\n\tbottom: 50%;\n\tmargin-bottom: 22px;\n\tbox-shadow: 0 3px 0 #fff, 0px 0px 12px rgba( 51, 51, 51, 0.5 );\n}\n.ComparisonSlider__Handle::after {\n\ttop: 50%;\n\tmargin-top: 22px;\n\tbox-shadow: 0 -3px 0 #fff, 0px 0px 12px rgba( 51, 51, 51, 0.5 );\n}\n@supports (filter: drop-shadow( 0 0 0 #000 )) {\n\t.ComparisonSlider__Handle::before,\n\t.ComparisonSlider__Handle::after {\n\t\tbox-shadow: none;\n\t}\n}\n";
document.head.insertBefore($style, document.head.firstChild);

function clamp(value, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return Math.max(min, Math.min(max, value));
}

function selectorToElement(selectorOrHTMLElement, $parent) {
    if (selectorOrHTMLElement instanceof HTMLElement) {
        return selectorOrHTMLElement;
    }
    var element = ($parent || document).querySelector(selectorOrHTMLElement);
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

function debounce(func, wait) {
    if (wait === void 0) { wait = 200; }
    var timeoutID;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeoutID);
        var context = this;
        timeoutID = window.setTimeout(function () { return func.apply(context, args); }, wait);
    };
}

var ComparisonSlider = (function () {
    function ComparisonSlider($el, options) {
        if ($el === void 0) { $el = '.ComparisonSlider'; }
        if (options === void 0) { options = {}; }
        var _this = this;
        this._left = 0;
        this._width = 0;
        this._height = 0;
        this._offset = 0.5;
        this._auto = false;
        var scope = this;
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
        var dragStartX = 0;
        if (this._auto) {
            var $autoArea = options.autoArea || this.$el;
            this.$el.classList.add('-auto');
            $autoArea.addEventListener('mousemove', dragging);
            $autoArea.addEventListener('touchmove', dragging);
        }
        else {
            this.$el.addEventListener('mousedown', onMouseDown);
            this.$el.addEventListener('touchstart', onTouchStart);
        }
        this.$el.addEventListener('contextmenu', onContextMenu);
        var onWindowResize = debounce(function () {
            _this.update();
            _this.draw();
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
            var _event = normalizePointerEvent(event);
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
            var _event = normalizePointerEvent(event);
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
        this.destory = function () {
            _this.$el.removeEventListener('mousedown', onMouseDown);
            _this.$el.removeEventListener('touchstart', onTouchStart);
            _this.$el.removeEventListener('contextmenu', onContextMenu);
            _this.$el.addEventListener('mousemove', dragging);
            _this.$el.addEventListener('touchmove', dragging);
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
    Object.defineProperty(ComparisonSlider.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        set: function (offset) {
            var _offset = clamp(offset, 0, 1);
            if (_offset === this._offset)
                return;
            this._offset = _offset;
            this.draw();
        },
        enumerable: true,
        configurable: true
    });
    ComparisonSlider.prototype.update = function () {
        var rect = this.$el.getBoundingClientRect();
        this._left = rect.left;
        this._width = rect.width;
        this._height = rect.height;
    };
    ComparisonSlider.prototype.draw = function () {
        var left = clamp(this._width * this.offset, 0, this._width);
        this.$handle.style.transform = "translateX( " + left + "px ) translateX( -50% ) translateY( -50% )";
        this.$after.style.clip = "rect(0px, " + this._width + "px, " + this._height + "px, " + left + "px)";
    };
    ComparisonSlider.prototype._toggleClassNames = function (enabled) {
        if (enabled) {
            this.$el.classList.add('-dragging');
        }
        else {
            this.$el.classList.remove('-dragging');
        }
    };
    ComparisonSlider.prototype._toggleTransitionMode = function (enabled) {
        if (enabled) {
            this.$after.style.transition = 'clip .2s';
            this.$handle.style.transition = 'transform .2s';
        }
        else {
            this.$after.style.transition = 'none';
            this.$handle.style.transition = 'none';
        }
    };
    return ComparisonSlider;
}());
function normalizePointerEvent(event) {
    return 'ontouchstart' in window && event instanceof TouchEvent ? event.touches[0] : event;
}
document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-comparison-slider-auto]'), function ($el) { return new ComparisonSlider($el); });
});

export default ComparisonSlider;
