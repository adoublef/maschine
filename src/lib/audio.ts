const FREQ_MAX = 24000;

const defaultContext = new AudioContext();

export const createBufferSource = async (arrayBuffer: ArrayBuffer, ctx = defaultContext) => {
    const audio = ctx.createBufferSource();
    try {
        audio.buffer = await ctx.decodeAudioData(arrayBuffer);
    } catch (err) {
        console.error(err);
    }
    return audio;
};

/**
 * `EffectInsertElement` has min=0 & max=100 there needs
 * to be a way to normalize to min=0 & max=1
 * TODO add checks to make sure value is between min & max
 */
export const createGainNode = ({ value }: { value: number; }, ctx = defaultContext): AudioNode => {
    return new GainNode(ctx, { gain: value / 100 });
};

export const createStereoPannerNode = ({ value }: { value: number; }, ctx = defaultContext) => {
    // return new StereoPannerNode(ctx, { pan: value / 100 });
    let fx = ctx.createStereoPanner();
    fx.pan.value = value / 100;
    return fx;
};

// // TODO: change signature -> ctx:AudioContext, {value:number, type:BiquadFilterType}
export const createEffectNode = ({ type, value }: { type: Effect, value: number; }, ctx = defaultContext) => {
    switch (type) {
        case "lowpass":
        case "highpass": return new BiquadFilterNode(ctx, { type, frequency: (value / 100) * FREQ_MAX });
        case "pan": return new StereoPannerNode(ctx, { pan: value / 100 });
        case "gain": return new GainNode(ctx, { gain: value / 100 });
        // NOTE if illegal type, create gain node with value 100
        // this avoids modifying the output which is what I want
        // this is a bit inconsistent, should normalize before sending
        default: return new GainNode(ctx, { gain: 1 });
    }

    // const createBiquadFilter: CreateEffectInner<BiquadFilterNode> = (ctx, { type, value }) => {
    //     let fx = ctx.createBiquadFilter();
    //     fx.type = type ?? "highpass"; // what shall be the default filter type
    //     fx.frequency.value = value;
    //     return fx;
    // };
};

// export const createBufferSource = async (arrayBuffer: ArrayBuffer, ctx = defaultContext) => {
//     const audio = ctx.createBufferSource();
//     audio.buffer = await ctx.decodeAudioData(arrayBuffer);
//     return audio;
// };

// const createBiquadFilter: CreateEffectInner<BiquadFilterNode> = (ctx, { type, value }) => {
//     let fx = ctx.createBiquadFilter();
//     fx.type = type ?? "highpass"; // what shall be the default filter type
//     fx.frequency.value = value;
//     return fx;
// };

// const createStereoPanner: CreateEffectInner<StereoPannerNode> = (ctx, { value }) => {
//     let fx = ctx.createStereoPanner();
//     fx.pan.value = value;
//     return fx;
// };

// const createGain: CreateEffectInner<GainNode> = (ctx, { value }) => {
//     let fx = ctx.createGain();
//     fx.gain.value = value;
//     return fx;
// };

// type CreateEffectInner<T extends AudioNode> = (ctx: AudioContext, params: {
//     type?: BiquadFilterType;
//     value: number;
// }) => T;

// export function start(src: AudioScheduledSourceNode, ...fxs: AudioNode[]): void {
//     [...fxs, src.context.destination].reduce((a, b) => a.connect(b), src);
//     src.start();
// };

// /**
//  * F@deprecated use `AudioScheduledSourceNode.stop()` instead
//  */
// export const stop = (src: AudioScheduledSourceNode) => {
//     src.stop();
// };

const effects = ["gain", "pan", "highpass", "lowpass"] as const;
export type Effect = typeof effects[number];