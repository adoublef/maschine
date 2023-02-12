import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("audio-track")
export class AudioTrackElement extends LitElement {

    @property()
    name = "track";

    @property()
    src?: string;

    async #playAudio() {
        if (!this.src) return;
        try {
            const data = await fetch(this.src);
            const buffer = await data.arrayBuffer();
            const audioCtx = new AudioContext();
            const audioBuffer = await audioCtx.decodeAudioData(buffer);
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.start();
        } catch (err) {
            console.error(err);
        }

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