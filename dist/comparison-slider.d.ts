import './style';
interface Options {
    $before?: HTMLElement | string;
    $after?: HTMLElement | string;
    $handle?: HTMLElement | string;
}
export default class ComparisonSlider {
    $el: HTMLElement;
    $before: HTMLElement;
    $after: HTMLElement;
    $handle: HTMLElement;
    destory: () => void;
    private _left;
    private _width;
    private _height;
    private _offset;
    constructor($el?: HTMLElement | string, options?: Options);
    offset: number;
    update(): void;
    draw(): void;
    private _toggleClassNames;
    private _toggleTransitionMode;
}
export {};
