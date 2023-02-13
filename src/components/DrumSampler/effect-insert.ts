import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import { createEffectNode, customEvent, Effect } from "../../lib";

@customElement("effect-insert")
export class EffectInsertElement extends LitElement {

    @property()
    type: Effect = "gain";

    // TODO: ask if there is a more idiomatic way of dealing with this
    // maybe make private and use a getter?
    @property({ type: Number, reflect: true, attribute: true })
    value: number = 0;

    // NOTE may not allow this to be set by user
    @property({ type: Number, reflect: true, attribute: true })
    min = 0;

    // NOTE may not allow this to be set by user
    @property({ type: Number, reflect: true, attribute: true })
    max = 100;

    // NOTE may not allow this to be set by user
    @property({ type: Number, reflect: true, attribute: true })
    step = 1;

    #input: Ref<HTMLInputElement> = createRef();

    effect() {
        return createEffectNode({ type: this.type, value: this.value });
    }

    #updateValue(_e: InputEvent) {
        this.value = this.#input.value?.valueAsNumber ?? 0;
    }

    #effect() {
        switch (this.parentElement?.nodeName) {
            case "DRUM-SAMPLER":
                customEvent(this, "sendinsert", { insert: this });
                break;
            default: // Find audio-track element with `id` that matches this `for` attribute
                console.log("no parent");
                break;
        }
    }

    render() {
        return html`
        <label>
            <slot>Effect</slot>
        </label>
        <input ${ref(this.#input)} @change=${this.#effect} @input=${this.#updateValue} type="range" .max=${this.max}
            .min=${this.min} .value=${this.value} .step=${this.step}>
        <output>${this.value}</output>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "effect-insert": EffectInsertElement;
    }
}