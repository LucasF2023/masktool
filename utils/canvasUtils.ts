
import { WatermarkSettings } from '../types';

export const drawWatermark = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  watermarkImage: HTMLImageElement | null,
  settings: WatermarkSettings
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas dimensions to match image
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw original image
  ctx.drawImage(image, 0, 0);

  if (settings.type === 'text' && !settings.text.trim()) return;
  if (settings.type === 'image' && !watermarkImage) return;

  ctx.save();

  // Common styles
  ctx.globalAlpha = settings.opacity;

  // Variables to hold dimensions of the "stamp" (text or image)
  let itemWidth = 0;
  let itemHeight = 0;

  // Prepare specific styles/metrics
  if (settings.type === 'text') {
    const calculatedFontSize = (image.width * settings.fontSize) / 100;
    ctx.font = `bold ${calculatedFontSize}px Inter, sans-serif`;
    ctx.fillStyle = settings.color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    const textMetrics = ctx.measureText(settings.text);
    itemWidth = textMetrics.width;
    itemHeight = calculatedFontSize;
  } else if (settings.type === 'image' && watermarkImage) {
    // Calculate image size based on percentage of main image width
    itemWidth = (image.width * settings.imageScale) / 100;
    // Maintain aspect ratio
    const aspectRatio = watermarkImage.width / watermarkImage.height;
    itemHeight = itemWidth / aspectRatio;
  }

  // Draw Logic
  if (settings.isTiled) {
    // Tiled Logic
    const angleInRadians = (settings.rotation * Math.PI) / 180;
    
    // Calculate gap based on image size for responsiveness
    // Base gap on a standard 2000px width reference
    const scaleFactor = image.width / 2000;
    const xGap = itemWidth + (settings.gap * scaleFactor);
    const yGap = itemHeight + (settings.gap * scaleFactor);

    const diag = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.translate(cx, cy);
    ctx.rotate(angleInRadians);
    ctx.translate(-cx, -cy);

    const countX = Math.ceil(diag / xGap) + 1;
    const countY = Math.ceil(diag / yGap) + 1;

    for (let i = -countX; i < countX; i++) {
      for (let j = -countY; j < countY; j++) {
        const xOffset = (j % 2 === 0) ? 0 : xGap / 2;
        const x = cx + (i * xGap) + xOffset;
        const y = cy + (j * yGap);

        if (settings.type === 'text') {
          ctx.fillText(settings.text, x, y);
        } else if (settings.type === 'image' && watermarkImage) {
          // Draw image centered at x, y
          ctx.drawImage(watermarkImage, x - itemWidth / 2, y - itemHeight / 2, itemWidth, itemHeight);
        }
      }
    }
  } else {
    // Single Position Logic
    // Use positionX and positionY percentages to calculate coordinates
    const posX = (canvas.width * settings.positionX) / 100;
    const posY = (canvas.height * settings.positionY) / 100;

    ctx.translate(posX, posY);
    ctx.rotate((settings.rotation * Math.PI) / 180);

    if (settings.type === 'text') {
      ctx.fillText(settings.text, 0, 0);
    } else if (settings.type === 'image' && watermarkImage) {
      ctx.drawImage(watermarkImage, -itemWidth / 2, -itemHeight / 2, itemWidth, itemHeight);
    }
  }

  ctx.restore();
};

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string = 'watermarked-image.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 0.9);
  link.click();
};
