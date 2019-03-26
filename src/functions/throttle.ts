export function throttle( callback: Function, limit: number ): () => void {

	let wait = false;

	return function () {

		if ( ! wait ) {

			callback.apply( null, arguments );
			wait = true;
			setTimeout( () => wait = false, limit );

		}
	};
}
