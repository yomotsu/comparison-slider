export function debounce<F extends Function>( func: F, wait: number = 200 ):F {

	let timeoutID: number;

	return <F><any>function( this: any, ...args: any[] ) {

		clearTimeout(timeoutID);
		const context = this;
		timeoutID = window.setTimeout( () => func.apply( context, args ), wait );

	};
};
