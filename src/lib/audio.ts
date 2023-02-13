const FREQ_MAX = 24000;

const defaultContext = new AudioContext();

export function connect(src: AudioBufferSourceNode, ...fxs: AudioNode[]) {
    return [...fxs, src.context.destination].reduce((a, b) => a.connect(b), src);
};

export async function createBufferSource(arrayBuffer: ArrayBuffer, ctx = defaultContext) {
    const audio = ctx.createBufferSource();
    try {
        audio.buffer = await ctx.decodeAudioData(arrayBuffer);
    } catch (err) {
        console.error(err);
    }
    return audio;
};

// TODO: change signature -> ctx:AudioContext, {value:number, type:BiquadFilterType}
export function createEffectNode({ type, value }: { type: Effect, value: number; }, ctx = defaultContext) {
    switch (type) {
        case "lowpass":
        case "highpass": // frequency >= 0 && frequency <= 24000
            const frequency = (value / 100) * FREQ_MAX;
            return new BiquadFilterNode(ctx, { type, frequency });
        case "pan": // pan >= -1 && pan <= 1
            const pan = value / 100;
            return new StereoPannerNode(ctx, { pan });
        case "gain": // gain >= 0 && gain <= 1
            const gain = value / 100;
            return new GainNode(ctx, { gain });
        // NOTE if illegal type, create gain node with value 100
        // this avoids modifying the output which is what I want
        // this is a bit inconsistent, should normalize before sending
        default: return new GainNode(ctx, { gain: 1 });
    }
};

const effects = ["gain", "pan", "highpass", "lowpass"] as const;

export function isEffect(arg: unknown): arg is Effect {
    return typeof arg === "string" && effects.includes(arg as Effect);
}

export type Effect = typeof effects[number];