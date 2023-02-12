import { html, LitElement } from "lit";
import { customElement, queryAssignedElements } from "lit/decorators.js";
import { AudioTrackElement } from "./audio-track";
import { EffectInsertElement } from "./effect-insert";

@customElement("drum-sampler")
export class DrumSamplerElement extends LitElement {

    @queryAssignedElements({ slot: "insert" })
    inserts?: EffectInsertElement[];

    @queryAssignedElements({ slot: "track" })
    tracks?: AudioTrackElement[];

    #onSendTrack(e: CustomEvent<{ track: AudioTrackElement; }>) {
        const { track } = e.detail;
        // NOTE may not need to be checked but will do so anyway
        if (!track.src) return;

        const fxs = this.inserts?.map((insert) => {
            return insert.effect();
        }) ?? [];

        track.play(...fxs);
    }

    #onSendInsert(e: CustomEvent<{ insert: EffectInsertElement; }>) {
        const { insert } = e.detail;

        console.log({ insert, inserts: this.inserts, tracks: this.tracks });
    }

    render() {
        return html`
        <slot name="insert" @sendinsert=${this.#onSendInsert}></slot>
        <slot name="track" @sendtrack=${this.#onSendTrack}></slot>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "drum-sampler": DrumSamplerElement;
    }
}