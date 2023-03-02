import { provide } from "@lit-labs/context";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { audioContext } from "./audioContext";

@customElement("drum-sampler")
export class DrumSampler extends LitElement {
    @provide({ context: audioContext })
    audioContext = new AudioContext();

    protected render(): unknown {
        return html`
            <div>Drum Sampler</div>
            <slot><slot/>
        `;
    }
}