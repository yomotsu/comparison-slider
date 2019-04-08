export function selectorToElement(
	selectorOrHTMLElement: HTMLElement | string,
	$parent?: HTMLElement,
): HTMLElement {

	if ( selectorOrHTMLElement instanceof HTMLElement ) {

		return selectorOrHTMLElement;

	}

	const element = ( $parent || document ).querySelector( selectorOrHTMLElement );

	if ( element instanceof HTMLElement ) {

		return element;

	}

	return document.createElement( 'div' );

}
