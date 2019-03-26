import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const license = `/*!
 * comparison-slider
 * https://github.com/yomotsu/comparison-slider
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */`;

export default {
	input: 'src/comparison-slider.ts',
	output: [
		{
			format: 'umd',
			name: 'ComparisonSlider',
			file: pkg.main,
			banner: license,
			indent: '\t',
		},
		{
			format: 'es',
			file: pkg.module,
			banner: license,
			indent: '\t',
		}
	],
	plugins: [
		typescript( { typescript: require( 'typescript' ) } ),
	],
};
