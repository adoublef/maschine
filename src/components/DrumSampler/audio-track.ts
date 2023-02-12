import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createBufferSource, customEvent, fetchBuffer } from "../../lib";

@customElement("audio-track")
export class AudioTrackElement extends LitElement {

    @property()
    readonly name = "track";

    @property()
    src?: string;

    #data?: AudioBufferSourceNode;

    // effectInserts = new Map<Effect, number>();
    play() {
        if (!this.#data) return;
        this.#data.connect(this.#data.context.destination);
        this.#data.start();
    }

    async #load() {
        const arrBuf = await fetchBuffer(this.src);
        if (!arrBuf.byteLength) return; // TODO handle error 

        this.#data = await createBufferSource(arrBuf);
        // TODO handle error

        switch (this.parentElement?.nodeName.toLowerCase()) {
            case "drum-sampler":
                this.#sendTrack();
                break;
            default:
                this.play();
                break;
        }
    }

    #sendTrack() {
        return customEvent(this, "sendtrack", { track: this });
    }

    render() {
        return html`
        <audio preload="auto">
            <source src=${this.src} type="audio/wav">
        </audio>
        <button @pointerdown=${this.#load}>${this.name}</button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "audio-track": AudioTrackElement;
    }
}