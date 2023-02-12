import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { AudioTrackElement } from "./audio-track";

@customElement("drum-sampler")
export class DrumSamplerElement extends LitElement {

    #recvTrack(e: CustomEvent<{ track: AudioTrackElement; }>) {
        const { track } = e.detail;
        if (!track.src) return;

        // TODO find corresponding effects and pass as params
        track.play();
    }

    #recvInsert() {
        console.log(`recv insert applied`);
    }

    render() {
        return html`
        <slot name="insert" @sendinsert=${this.#recvInsert}></slot>
        <slot name="track" @sendtrack=${this.#recvTrack}></slot>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "drum-sampler": DrumSamplerElement;
    }
}