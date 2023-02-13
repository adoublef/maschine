import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref, createRef, Ref } from "lit/directives/ref.js";
import { createEffectNode, createGainNode, createStereoPannerNode, customEvent } from "../../lib";

@customElement("effect-insert")
export class EffectInsertElement extends LitElement {

    @property()
    type = "gain";

    // TODO: ask if there is a more idiomatic way of dealing with this
    // maybe make private and use a getter?
    @property({ type: Number, reflect: true, attribute: true })
    value: number = 0;

    @property({ type: Number, reflect: true, attribute: true })
    min = 0;

    @property({ type: Number, reflect: true, attribute: true })
    max = 100;

    @property({ type: Number, reflect: true, attribute: true })
    step = 1;

    #input: Ref<HTMLInputElement> = createRef();

    effect() {
        // TODO obfuscate logic by using a helper function
        switch (this.type) {
            case "gain":
                // NOTE for now only support gain node
                return createGainNode({ value: this.value });
            case "pan":
                console.log("pan");
                return createStereoPannerNode({ value: this.value });
            default:
                // NOTE if illegal type, create gain node with value 100
                // this avoids modifying the output which is what I want
                // this is a bit inconsistent, should normalize before sending
                return createEffectNode({ type: "gain", value: 100 });
        }
    }

    #updateValue(_e: InputEvent) {
        this.value = this.#input.value?.valueAsNumber ?? 0;
    }

    #sendInsert() {
        switch (this.parentElement?.nodeName) {
            case "DRUM-SAMPLER":
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
        <input ${ref(this.#input)} @change=${this.#sendInsert} @input=${this.#updateValue} type="range" .max=${this.max}
            .min=${this.min} .step=${this.step} .value=${this.value}>
        <output>${this.value}</output>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "effect-insert": EffectInsertElement;
    }
}