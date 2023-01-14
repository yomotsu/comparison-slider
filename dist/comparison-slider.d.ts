import './style';
interface Options {
    $before?: HTMLElement | string;
    $after?: HTMLElement | string;
    $handle?: HTMLElement | string;
    auto?: boolean;
    autoArea?: HTMLElement;
    handleOnlyControl?: boolean;
}
export default class ComparisonSlider {
    $el: HTMLElement;
    $before: HTMLElement;
    $after: HTMLElement;
    $handle: HTMLElement;
    handleOnlyControl: boolean;
    destroy: () => void;
    private _left;
    private _width;
    private _offset;
    private _auto;
    constructor($el?: HTMLElement | string, options?: Options);
    set offset(offset: number);
    get offset(): number;
    update(): void;
    draw(): void;
    private _toggleClassNames;
    private _toggleTransitionMode;
}
export {};
