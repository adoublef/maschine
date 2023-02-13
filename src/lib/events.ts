export function customEvent<T = {}>(el: HTMLElement, type: string, detail?: T) {
    return el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true, }));
}