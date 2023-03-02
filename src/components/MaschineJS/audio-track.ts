import { consume } from "@lit-labs/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioContext } from "./audioContext";

@customElement("audio-track")
export class AudioTrack extends LitElement {
    @consume({ context: audioContext })
    @property({ attribute: false })
    public audioContext?: AudioContext;

    protected render(): unknown {
        if (!this.audioContext)
            throw new Error("no context");

        return html`
            <div>My Audio Track</div>
        `;
    }
}