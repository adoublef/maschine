import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("drum-sampler")
export class DrumSampler extends LitElement {
    audioCtx = new AudioContext();

    private _playAudio() {
        const osc = this.audioCtx.createOscillator();
        osc.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.5);
    }

    render() {
        return html`<button @click=${this._playAudio}>Click Me!</button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'drum-sampler': DrumSampler;
    }
}
