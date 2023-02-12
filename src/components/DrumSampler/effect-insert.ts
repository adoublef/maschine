import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import { createGainNode, customEvent } from "../../lib";

@customElement("effect-insert")
export class EffectInsertElement extends LitElement {

    @property()
    type = "gain";

    // TODO: ask if there is a more idiomatic way of dealing with this
    @property({ type: Number, reflect: true, attribute: true })
    value = 0;

    @property({ type: Number, reflect: true, attribute: true })
    min = 0;

    @property({ type: Number, reflect: true, attribute: true })
    max = 100;

    @property({ type: Number, reflect: true, attribute: true })
    step = 1;

    #input: Ref<HTMLInputElement> = createRef();

    effect() {
        switch (this.type) {
            case "gain":
                // NOTE for now only support gain node
                return createGainNode({ value: this.value });
            default:
                // NOTE if illegal type, create gain node with value 1
                return createGainNode({ value: 1 });
        }
    }

    #updateValue(_e: InputEvent) {
        this.value = this.#input.value?.valueAsNumber ?? 0;
    }

    #sendInsert() {
        switch (this.parentElement?.nodeName.toLowerCase()) {
            case "drum-sampler":
                customEvent(this, "sendinsert", { insert: this });
                break;
            default:
                console.log("no parent");
                break;
        }
    }

    render() {
        return html`
        <label>
            <slot>Effect</slot>
        </label>
        <input ${ref(this.#input)} @change=${this.#sendInsert} @input=${this.#updateValue} .value=${this.value} .max=${this.max}
            .min=${this.min} .step=${this.step} type="range">
        <output>${this.value}</output>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "effect-insert": EffectInsertElement;
    }
}