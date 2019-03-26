export function selectorToElement( selectorOrHTMLElement: HTMLElement | string ): HTMLElement {

	if ( selectorOrHTMLElement instanceof HTMLElement ) {

		return selectorOrHTMLElement;

	}

	const element = document.querySelector( selectorOrHTMLElement );

	if ( element instanceof HTMLElement ) {

		return element;

	}

	return document.createElement( 'div' );

}
