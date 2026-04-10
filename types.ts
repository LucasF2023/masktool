
export interface WatermarkSettings {
  type: 'text' | 'image'; // 水印类型
  text: string;
  fontSize: number; // Percentage of image width (1-10) - 用于文字
  imageScale: number; // Percentage of image width (5-50) - 用于图片
  opacity: number; // 0-1
  rotation: number; // -90 to 90
  gap: number; // Spacing factor (for tiled mode)
  color: string;
  isTiled: boolean;
  positionX: number; // 0-100 percentage (for single mode)
  positionY: number; // 0-100 percentage (for single mode)
}

export const DEFAULT_SETTINGS: WatermarkSettings = {
  type: 'text',
  text: '仅供参考',
  fontSize: 5,
  imageScale: 15,
  opacity: 0.3,
  rotation: -30,
  gap: 200,
  color: '#ffffff',
  isTiled: true,
  positionX: 50,
  positionY: 50,
};
