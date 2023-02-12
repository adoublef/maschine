import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("drum-sampler")
export class DrumSampler extends LitElement {
    #playAudio(e: CustomEvent<{
        name: string;
        src: string | undefined;
        track: AudioBufferSourceNode;
    }>) {
        const { track } = e.detail;
        console.log("drum-machine is the parent");
        track.connect(track.context.destination);
        track.start();
    }

    render() {
        return html`
        <slot name="insert"></slot>
        <slot name="track" @play-audio=${this.#playAudio}></slot>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "drum-sampler": DrumSampler;
    }
}