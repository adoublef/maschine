import { consume } from "@lit-labs/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioContext } from "./audioContext";

@customElement("audio-track")
export class AudioTrack extends LitElement {
    @consume({ context: audioContext })
    @property({ attribute: false })
    public audioContext?: AudioContext;

    @property()
    public src?: string;

    protected render(): unknown {
        if (!this.audioContext)
            throw new Error("no context");

        return html`
            <audio>
                <source src=${this.src}>
            </audio>
            <button @click=${this.play}>My Audio Track</button>
        `;
    }

    public async play() {
        if (!this.audioContext)
            throw new Error("no context");

        if (!this.src)
            throw new Error("no src path");

        try {
            const response = await fetch(this.src);
            const buffer = await response.arrayBuffer();

            const audioBuffer = await this.audioContext.decodeAudioData(buffer);

            const source = new AudioBufferSourceNode(this.audioContext, {
                buffer: audioBuffer
            });

            source.connect(this.audioContext.destination);
            source.start();
        } catch (error) {
            console.error((error as Error).message);
        }
    }
}