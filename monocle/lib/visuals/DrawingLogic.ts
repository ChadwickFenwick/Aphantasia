export const calculateAccuracy = (
    userCanvas: HTMLCanvasElement,
    shapePath: string,
    rotation: number,
    scale: number,
    viewBox: string
): number => {
    const width = userCanvas.width;
    const height = userCanvas.height;

    // Create offscreen canvas for target
    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = width;
    targetCanvas.height = height;
    const ctx = targetCanvas.getContext('2d');

    if (!ctx) return 0;

    // Parse viewBox to determine scaling relative to canvas
    // viewBox is "0 0 100 100" usually
    const vb = viewBox.split(' ').map(Number);
    const vbW = vb[2];
    const vbH = vb[3];

    // Determine render size
    // The main canvas container is usually square-ish, but let's assume the SVG logic
    // The SVG scales to "contain" or "cover"? In DrawingCanvas it's w-full h-full.
    // We need to replicate the SVG transform logic.
    // SVG is centered.

    ctx.save();
    ctx.translate(width / 2, height / 2); // Center
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // The Path data is in 0-100 coordinates (based on SHAPES data)
    // We need to scale it up to the canvas size.
    // If canvas is 800x800, and viewBox is 100x100, we scale by 8.
    const renderScaleX = width / vbW;
    const renderScaleY = height / vbH;
    // Maintain aspect ratio, take smaller? Or strictly stretch?
    // SVG default is xMidYMid meet usually.
    const baseScale = Math.min(renderScaleX, renderScaleY);

    ctx.scale(baseScale, baseScale);
    ctx.translate(-vbW / 2, -vbH / 2); // Center the 100x100 box

    // Draw the path
    const p = new Path2D(shapePath);
    ctx.strokeStyle = '#FFFFFF'; // Color doesn't matter, just alpha
    ctx.lineWidth = 15; // Be generous. User draws with 3, but let's give a wider target area.
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(p);
    ctx.restore();

    // Get Data
    const userImg = userCanvas.getContext('2d')?.getImageData(0, 0, width, height);
    const targetImg = ctx.getImageData(0, 0, width, height);

    if (!userImg || !targetImg) return 0;

    const userData = userImg.data;
    const targetData = targetImg.data;
    let intersection = 0;
    let union = 0;
    let userPixels = 0;

    // Loop through pixels (stride 4)
    for (let i = 0; i < userData.length; i += 4) {
        const userAlpha = userData[i + 3];
        const targetAlpha = targetData[i + 3];

        const isUser = userAlpha > 20; // Threshold
        const isTarget = targetAlpha > 20;

        if (isUser) userPixels++;

        if (isUser || isTarget) {
            union++;
        }
        if (isUser && isTarget) {
            intersection++;
        }
    }

    if (union === 0) return 0;
    if (userPixels === 0) return 0; // User drew nothing

    // Calculation:
    // Pure IoU can be harsh for thin lines.
    // Let's optimize: intersection / userPixels? 
    // That measures "how much of what I drew is on the line".
    // But if I draw a single dot on the line, that's 100%.
    // So we need recall too: "how much of the line did I cover".

    // IoU is standard.
    const iou = intersection / union;

    // Scale it to be friendly. 0.3 IoU is actually quite good for thin lines drawn blindly.
    // Let's map 0.0 - 0.3 to 0 - 100?
    // Or let's calculate standard Recall/Precision.
    // Precision = Intersection / UserPixels
    // Recall = Intersection / TargetPixels (Need to count target pixels separately or derive from union/user)

    // Re-loop/count correctly?
    // Intersection = BOTH
    // Union = EITHER
    // TargetPixels = Union - UserPixels + Intersection ?? No.
    // TargetPixels = count(isTarget)

    let targetPixelCount = 0;
    for (let i = 0; i < targetData.length; i += 4) {
        if (targetData[i + 3] > 20) targetPixelCount++;
    }

    const precision = intersection / userPixels;
    const recall = intersection / targetPixelCount;

    // F1 Score
    const f1 = 2 * (precision * recall) / (precision + recall);

    // F1 is 0-1.
    // Blind drawing is HARD.
    // Let's boost the score.
    // If F1 is 0.5, that's amazing?

    let score = f1 * 100;

    // Curve it. sqrt(f1) * 100?
    // If f1 is 0.25 -> 0.5 -> 50%
    score = Math.sqrt(f1) * 100;

    return Math.min(100, Math.round(score));
};
