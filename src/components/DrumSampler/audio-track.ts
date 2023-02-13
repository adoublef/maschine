import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { connect, createBufferSource, customEvent, fetchBuffer } from "../../lib";

@customElement("audio-track")
export class AudioTrackElement extends LitElement {

    @property()
    readonly name = "track";

    @property()
    src?: string;

    #data?: AudioBufferSourceNode;

    // effectInserts = new Map<Effect, number>();

    play(...fxs: AudioNode[]) {
        if (!this.#data) return;

        connect(this.#data, ...fxs);
        this.#data.start();
    }

    async #play() {
        const arrBuf = await fetchBuffer(this.src);
        if (!arrBuf.byteLength) return; // TODO handle error 

        this.#data = await createBufferSource(arrBuf);
        // TODO handle error

        switch (this.parentElement?.nodeName) {
            case "DRUM-SAMPLER":
                customEvent(this, "sendtrack", { track: this });
                break;
            default:
                this.play();
                break;
        }
    }

    render() {
        return html`
        <audio preload="auto">
            <source src=${this.src} type="audio/wav">
        </audio>
        <button @pointerdown=${this.#play}>
            <slot>Audio</slot>
        </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "audio-track": AudioTrackElement;
    }
}