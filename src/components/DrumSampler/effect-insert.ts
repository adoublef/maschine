import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("effect-insert")
export class EffectInsert extends LitElement {
    render() {
        return html`
        <label>effect</label>
        <input type="range">
        <output></output>
        `;
    }
}