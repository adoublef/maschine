export { };
// const FREQ_MAX = 24000;

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
    return new StereoPannerNode(ctx, { pan: value / 100 });
};

// // TODO: change signature -> ctx:AudioContext, {value:number, type:BiquadFilterType}
// export const createEffectNode: CreateEffect = ({ type, value }, ctx = defaultContext) => {
//     switch (type) {
//         case "lowpass":
//         case "highpass": return createBiquadFilter(ctx, { type, value: value * FREQ_MAX });
//         case "pan": return createStereoPanner(ctx, { value: (value * 2) - 1 });
//         default: return createGain(ctx, { value });
//     }
// };

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

// export const effectTyp = ["gain", "pan", "highpass", "lowpass"] as const;
// export type EffectTyp = typeof effectTyp[number];