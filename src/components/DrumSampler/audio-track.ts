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
        if (!buffer.byteLength) return; // TODO handle error 

        const track = await createBufferSource(buffer);
        // TODO handle error

        switch (this.parentElement?.nodeName.toLowerCase()) {
            case "drum-sampler":
                let detail: CustomEventInit["detail"] = {
                    name: this.name,
                    src: this.src,
                    track: track,
                };

                this.dispatchEvent(new CustomEvent("play-audio", {
                    bubbles: true,
                    composed: true,
                    detail
                }));
                break;
            default:
                console.log("drum-sampler is not parent");
                // TODO send to the drum-machine is one is connected
                track.connect(track.context.destination);
                track.start();
                break;
        }
    }

    render() {
        return html`
        <audio preload="auto">
            <source src=${this.src} type="audio/wav">
        </audio>
        <button @pointerdown=${this.#playAudio}>${this.name}</button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "audio-track": AudioTrackElement;
    }
}