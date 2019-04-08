import './style';
import { clamp } from './functions/math';
import { selectorToElement } from './functions/selectorToElement';
import { debounce } from './functions/debounce';

interface Options {
	$before?: HTMLElement | string;
	$after?: HTMLElement | string;
	$handle?: HTMLElement | string;
	auto?: boolean;
}

export default class ComparisonSlider {

	$el: HTMLElement;
	$before: HTMLElement;
	$after: HTMLElement;
	$handle: HTMLElement;
	destory: () => void;
	
	private _left: number = 0;
	private _width: number = 0;
	private _height: number = 0;
	private _offset: number = 0.5;
	private _auto: boolean = false;

	constructor( $el: HTMLElement | string = '.ComparisonSlider', options: Options = {} ) {

		const scope = this;

		this.$el = selectorToElement( $el );
		this.$before = selectorToElement( options.$before || '.ComparisonSlider__Before' );
		this.$after = selectorToElement( options.$after || '.ComparisonSlider__After' );
		this.$handle = selectorToElement( options.$handle || '.ComparisonSlider__Handle' );

		this.$before.classList.add( 'ComparisonSlider__Before' );
		this.$after.classList.add( 'ComparisonSlider__After' );
		this.$handle.classList.add( 'ComparisonSlider__Handle' );

		this.$el.appendChild( this.$before );
		this.$el.appendChild( this.$after );
		this.$el.appendChild( this.$handle );

		this._auto = options.auto || false;

		this.update();
		this.draw();


		// mouse events
		let dragStartX = 0;

		if ( this._auto ) {

			this.$el.addEventListener( 'mousemove', dragging, { passive: false } );
			this.$el.addEventListener( 'touchmove', dragging, { passive: false } );

		}

		this.$el.addEventListener( 'mousedown', onMouseDown );
		this.$el.addEventListener( 'touchstart', onTouchStart );
		this.$el.addEventListener( 'contextmenu', onContextMenu );

		const onWindowResize = debounce( () => {

			this.update();
			this.draw();

		}, 200 );
		window.addEventListener( 'resize', onWindowResize );

		function onMouseDown( event: MouseEvent ) {

			event.preventDefault();
			startDragging( event );

		}

		function onTouchStart( event: TouchEvent ) {

			event.preventDefault();
			startDragging( event );

		}

		function onContextMenu( event: MouseEvent | TouchEvent ) {

			event.preventDefault();

		}

		function startDragging( event: MouseEvent | TouchEvent ) {

			scope.update();
			const _event = normalizePointerEvent( event );
			dragStartX = _event.pageX;
			scope.offset = ( _event.pageX - scope._left ) / scope._width;
			scope._toggleClassNames( true );
			scope._toggleTransitionMode( true );

			document.addEventListener( 'mousemove', dragging, { passive: false } );
			document.addEventListener( 'touchmove', dragging, { passive: false } );
			document.addEventListener( 'mouseup', endDragging );
			document.addEventListener( 'touchend', endDragging );

		}

		function dragging( event: MouseEvent | TouchEvent ) {

			const _event = normalizePointerEvent( event );
			scope.offset = ( _event.pageX - scope._left ) / scope._width;

			if ( Math.abs( dragStartX - _event.pageX ) > 5 ) {

				scope._toggleTransitionMode( false );

			}

		}

		function endDragging() {

			scope._toggleClassNames( false );

			document.removeEventListener( 'mousemove', dragging );
			document.removeEventListener( 'touchmove', dragging );
			document.removeEventListener( 'mouseup',  endDragging );
			document.removeEventListener( 'touchend', endDragging );

		}

		//
		this.destory = () => {

			this.$el.removeEventListener( 'mousedown', onMouseDown );
			this.$el.removeEventListener( 'touchstart', onTouchStart );
			this.$el.removeEventListener( 'contextmenu', onContextMenu );
			this.$el.addEventListener( 'mousemove', dragging );
			this.$el.addEventListener( 'touchmove', dragging );

			document.removeEventListener( 'mousemove', dragging );
			document.removeEventListener( 'touchmove', dragging );
			document.removeEventListener( 'mouseup',  endDragging );
			document.removeEventListener( 'touchend', endDragging );

			window.removeEventListener( 'resize', onWindowResize );

		};

	}

	set offset( offset: number ) {

		const _offset = clamp( offset, 0, 1 );

		if ( _offset === this._offset ) return;

		this._offset = _offset;
		this.draw();

	}

	get offset(): number {

		return this._offset;

	}

	update() {

		const rect = this.$el.getBoundingClientRect();
		this._left = rect.left;
		this._width = rect.width;
		this._height = rect.height;

	}

	draw() {

		const left = clamp( this._width * this.offset, 0, this._width );
		this.$handle.style.transform = `translateX( ${ left }px ) translate( -50%, -50% )`;
		this.$after.style.clip = `rect(0px, ${ this._width }px, ${ this._height }px, ${ left }px)`;

	}

	private _toggleClassNames( enabled: boolean ) {

		if ( enabled ) {

			this.$el.classList.add( '-dragging' );

		} else {

			this.$el.classList.remove( '-dragging' );

		}

	}

	private _toggleTransitionMode( enabled: boolean ) {

		if ( enabled ) {

			this.$after.style.transition = 'clip .2s';
			this.$handle.style.transition = 'transform .2s';

		} else {

			this.$after.style.transition = 'none';
			this.$handle.style.transition = 'none';

		}

	}

}

function normalizePointerEvent( event: MouseEvent | TouchEvent | WheelEvent ): any {

	return 'ontouchstart' in window && event instanceof TouchEvent ? event.touches[ 0 ] : event;

}

document.addEventListener( 'DOMContentLoaded', () => {

	Array.prototype.forEach.call(
		document.querySelectorAll( '[data-comparison-slider-auto]' ),
		( $el: HTMLElement ) => new ComparisonSlider( $el ),
	);

} )
