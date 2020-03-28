declare global {
    interface Element {
        msMatchesSelector(selectors: string): boolean;
    }
}
export declare function matches(el: Element, selector: string): boolean;
