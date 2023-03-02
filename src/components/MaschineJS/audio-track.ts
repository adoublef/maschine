import { consume } from "@lit-labs/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioContext } from "./audioContext";

const cacheName = "fetch-audio";

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
            <audio preload="auto">
                <source src=${this.src}>
            </audio>
            <button type="button" @click=${this.play}>
                <slot>Audio Track</slot>
            </button>
        `;
    }

    public async play() {
        const { src, audioContext } = this;

        if (!src)
            throw new Error("no src path");

        if (!audioContext)
            throw new Error("no context");

        try {
            const source = await createBufferSource(src, audioContext);

            source.connect(audioContext.destination);
            source.start();
        } catch (error) {
            console.error((error as Error).message);
        }
    }
}

/**
 * This function will lookup a matching request in the local cache.
 * If there is not a match, it will make the request and store that response.
 * 
 * This function throws an error if the fetch response is not in 200 status code range.
 */
async function cached(input: string, init?: RequestInit): Promise<Response> {
    const cache = await caches.open(cacheName);

    let response = await cache.match(input);
    if (response) return response.clone();

    response = await fetch(input, init);
    await cache.add(input);

    return response;
}

const createBufferSource = async (src: string, audioContext: AudioContext): Promise<AudioBufferSourceNode> => {
    const response = await cached(src);
    const buffer = await response.arrayBuffer();

    const audioBuffer = await audioContext.decodeAudioData(buffer);

    return new AudioBufferSourceNode(audioContext, { buffer: audioBuffer });
};