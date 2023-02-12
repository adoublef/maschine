export * from "./audio";

export const fetchBuffer = async (url: string = "") => {
    try {
        const data = await fetch(url);
        const buffer = await data.arrayBuffer();
        return buffer;
    } catch (err) {
        console.error(err);
        return new ArrayBuffer(0);
    }
}; 