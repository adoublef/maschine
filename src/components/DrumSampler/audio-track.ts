import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createBufferSource, fetchBuffer } from "../../lib";

@customElement("audio-track")
export class AudioTrackElement extends LitElement {

    @property()
    name = "track";

    @property()
    src?: string;

    async #playAudio() {
        // if (!this.src) return;
        const buffer = await fetchBuffer(this.src);
        if (!buffer.byteLength) return; //TODO handle error 

        const track = await createBufferSource(buffer);
        //TODO handle error
        track.connect(track.context.destination);
        track.start();
    }

    protected render(): unknown {
        return html`<button @pointerdown=${this.#playAudio}>${this.name}</button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "audio-track": AudioTrackElement;
    }
}