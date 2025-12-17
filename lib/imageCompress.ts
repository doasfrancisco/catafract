type Output = "image/png" | "image/jpeg" | "image/jpg";

export async function compressWithJsquash(input: File, opts?: {
    output?: Output;
    maxBytes?: number;
    quality?: number;
    maxDimension?: number;
}) {
    const output = opts?.output ?? input.type;
    const maxBytes = opts?.maxBytes ?? 3_500_000;
    const maxDimension = opts?.maxDimension ?? 2048;
    const startQuality = opts?.quality ?? 82;

    if (input.size <= maxBytes) {
        return input;
    }

    const imgData = await fileToImageData(input, maxDimension);
    if (output === "image/png") {
        const { encode } = await import("@jsquash/png");
        const buf = await encode(imgData);
        const blob = new Blob([buf], { type: "image/png" });

        if (blob.size > maxBytes) {
            console.log("Too big must retry with 75%")
            // Retry with 75% dimensions
            const smaller = await fileToImageData(input, Math.floor(maxDimension * 0.75));
            const buf2 = await encode(smaller);
            return new File([buf2], replaceExt(input.name, "png"), { type: "image/png" });
        }

        return new File([blob], replaceExt(input.name, "png"), { type: "image/png" });
    }

    const { encode } = await import("@jsquash/jpeg");
    let q = startQuality;
    while (true) {
        const buf = await encode(imgData, { quality: q });
        const blob = new Blob([buf], { type: "image/jpeg" });

        // If under limit or quality is already very low, return it
        if (blob.size <= maxBytes || q <= 55) {
            return new File([blob], replaceExt(input.name, "jpg"), { type: "image/jpeg" });
        }
        q -= 7; // Step down quality
    }
}

function replaceExt(name: string, ext: string) {
    return name.replace(/\.\w+$/, "") + "." + ext;
}

async function fileToImageData(file: Blob, maxDimension: number): Promise<ImageData> {
    const bmp = await createImageBitmap(file);
    const { width, height } = fitWithin(bmp.width, bmp.height, maxDimension);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bmp, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
}

function fitWithin(w: number, h: number, maxDim: number) {
    if (Math.max(w, h) <= maxDim) return { width: w, height: h };
    const s = maxDim / Math.max(w, h);
    return { width: Math.round(w * s), height: Math.round(h * s) };
}