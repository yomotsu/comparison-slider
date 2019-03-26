export function clamp( value: number, min: number = 0, max: number = 1 ): number {

	return Math.max( min, Math.min( max, value ) );

}
