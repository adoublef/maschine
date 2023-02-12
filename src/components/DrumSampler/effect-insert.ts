import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("effect-insert")
export class EffectInsertElement extends LitElement {
    render() {
        return html`
        <label>effect</label>
        <input type="range">
        <output></output>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "effect-insert": EffectInsertElement;
    }
}