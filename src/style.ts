const $style = document.createElement( 'style' );
$style.innerHTML = `
.ComparisonSlider {
	position: relative;
	overflow: hidden;
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
.ComparisonSlider__Handle {
	cursor: col-resize;
	position: absolute;
	box-sizing: border-box;
	top: 50%;
	width: 44px;
	height: 44px;
	border: 3px solid #fff;
	border-radius: 100px;
	box-shadow: 0px 0px 12px rgba( 51, 51, 51, 0.5 );
	background: url("data:image/svg+xml,%3Csvg%20fill=%22%23fff%22%20preserveAspectRatio=%22none%22%20viewBox=%220%200%2046%2046%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22m39.808%2023-10%208v-16z%22/%3E%3Cpath%20d=%22m6.192%2023%2010-8v16z%22/%3E%3C/svg%3E" ) 50% 50% / 100% 100%;
}
@supports (filter: drop-shadow( 0 0 0 #000 )) {
	.ComparisonSlider__Handle {
		box-shadow: none;
		filter: drop-shadow( 0 0 12px rgba( 51, 51, 51, 0.5 ) );
	}
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
	box-shadow: 0 3px 0 #fff, 0px 0px 12px rgba( 51, 51, 51, 0.5 );
}

.ComparisonSlider__Handle::after {
	top: 50%;
	margin-top: 22px;
	box-shadow: 0 -3px 0 #fff, 0px 0px 12px rgba( 51, 51, 51, 0.5 );
}

@supports (filter: drop-shadow( 0 0 0 #000 )) {
	.ComparisonSlider__Handle::before,
	.ComparisonSlider__Handle::after {
		box-shadow: none;
	}
}
`;
document.head.insertBefore( $style, document.head.firstChild );
