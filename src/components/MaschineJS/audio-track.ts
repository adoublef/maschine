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

async function fetchCache(input: string, init?: RequestInit) {
    // NOTE -- open cache
    const cache = await caches.open(cacheName);

    // NOTE -- if in cache return response
    let response = await cache.match(input);
    if (response) return response.clone();


    response = await fetch(input, init);
    await cache.put(input, response.clone());

    return response;
}

const createBufferSource = async (src: string, audioContext: AudioContext): Promise<AudioBufferSourceNode> => {
    try {
        const response = await fetchCache(src);
        const buffer = await response.arrayBuffer();

        const audioBuffer = await audioContext.decodeAudioData(buffer);

        return new AudioBufferSourceNode(audioContext, { buffer: audioBuffer });

    } catch (error) {
        // TODO -- custom error handling
        throw error;
    }
};