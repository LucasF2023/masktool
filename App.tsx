
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Type, Image as ImageIcon, RotateCcw, ShieldCheck, X, Settings2 } from 'lucide-react';
import { Button } from './components/Button';
import { SliderControl } from './components/SliderControl';
import { drawWatermark, downloadCanvas } from './utils/canvasUtils';
import { WatermarkSettings, DEFAULT_SETTINGS } from './types';

const App: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string>('image');
  
  // New state for watermark image
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
  const [watermarkFileName, setWatermarkFileName] = useState<string>('');

  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_SETTINGS);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  // Load source image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setImageName(file.name.replace(/\.[^/.]+$/, ""));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Load watermark image
  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setWatermarkImage(img);
          setWatermarkFileName(file.name);
          // Auto switch to image type if user uploads one
          updateSetting('type', 'image');
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Debounced draw effect
  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      let animationFrameId: number;
      
      const render = () => {
        // Pass watermarkImage to the draw function
        drawWatermark(canvas, image, watermarkImage, settings);
      };

      animationFrameId = requestAnimationFrame(render);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [image, watermarkImage, settings]);

  const updateSetting = <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvas(canvasRef.current, `${imageName}-已加水印.png`);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setWatermarkImage(null);
    setWatermarkFileName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col h-auto md:h-screen shadow-xl z-10">
        <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">InstaMark</h1>
          </div>
          <p className="text-xs text-slate-500">安全、快速的本地水印工具</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* File Upload Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> 源图片
            </h2>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full border-dashed border-2 py-8 hover:border-indigo-500 hover:text-indigo-600 group transition-all"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                <span>{image ? '更换源图片' : '上传源图片'}</span>
              </div>
            </Button>
          </div>

          <hr className="border-slate-100" />

          {/* Watermark Content Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> 水印内容
              </h2>
            </div>
            
            {/* Type Switcher */}
            <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
              <button
                onClick={() => updateSetting('type', 'text')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.type === 'text' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Type className="w-4 h-4" /> 文字
              </button>
              <button
                onClick={() => updateSetting('type', 'image')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  settings.type === 'image' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> 图片
              </button>
            </div>

            {/* Content Controls based on Type */}
            <div className="pt-2">
              {settings.type === 'text' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">水印文字</label>
                    <input
                      type="text"
                      value={settings.text}
                      onChange={(e) => updateSetting('text', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 transition-shadow"
                      placeholder="输入水印文字..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">文字颜色</label>
                    <div className="flex gap-2 flex-wrap">
                      {['#ffffff', '#000000', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateSetting('color', color)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${settings.color === color ? 'border-indigo-600 scale-110' : 'border-transparent hover:border-slate-300'}`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 hover:border-slate-300">
                        <input 
                          type="color" 
                          value={settings.color}
                          onChange={(e) => updateSetting('color', e.target.value)}
                          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">上传水印图片 (Logo)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={watermarkInputRef} 
                      onChange={handleWatermarkUpload} 
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => watermarkInputRef.current?.click()} 
                        className="w-full py-3 text-xs"
                      >
                         {watermarkImage ? '更换水印图' : '上传水印图'}
                      </Button>
                      {watermarkImage && (
                        <div className="w-12 h-10 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                           <img src={watermarkImage.src} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                    {watermarkFileName && <p className="text-xs text-slate-500 truncate">已选: {watermarkFileName}</p>}
                    {!watermarkImage && <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">请上传一张背景透明的 PNG 图片以获得最佳效果。</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Global Appearance Sliders */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">外观设置</h2>
              <button 
                onClick={() => updateSetting('isTiled', !settings.isTiled)}
                className={`text-xs px-2 py-1 rounded transition-colors ${settings.isTiled ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-slate-100 text-slate-500'}`}
              >
                {settings.isTiled ? '平铺模式' : '单个模式'}
              </button>
            </div>

            <SliderControl
              label="不透明度"
              value={settings.opacity}
              min={0.05}
              max={1}
              step={0.01}
              onChange={(val) => updateSetting('opacity', val)}
              formatValue={(val) => `${Math.round(val * 100)}%`}
            />

            {settings.type === 'text' ? (
              <SliderControl
                label="字号大小"
                value={settings.fontSize}
                min={1}
                max={20}
                step={0.5}
                onChange={(val) => updateSetting('fontSize', val)}
                formatValue={(val) => `${val}`}
              />
            ) : (
              <SliderControl
                label="图片缩放"
                value={settings.imageScale}
                min={5}
                max={100}
                step={1}
                onChange={(val) => updateSetting('imageScale', val)}
                formatValue={(val) => `${val}%`}
              />
            )}

            <SliderControl
              label="旋转角度"
              value={settings.rotation}
              min={-90}
              max={90}
              step={1}
              onChange={(val) => updateSetting('rotation', val)}
              formatValue={(val) => `${val}°`}
            />

            {settings.isTiled ? (
              <SliderControl
                label="密度 / 间距"
                value={settings.gap}
                min={50}
                max={500}
                step={10}
                onChange={(val) => updateSetting('gap', val)}
                formatValue={(val) => `${val}`}
              />
            ) : (
              <>
                <SliderControl
                  label="水平位置"
                  value={settings.positionX}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(val) => updateSetting('positionX', val)}
                  formatValue={(val) => `${val}%`}
                />
                <SliderControl
                  label="垂直位置"
                  value={settings.positionY}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(val) => updateSetting('positionY', val)}
                  formatValue={(val) => `${val}%`}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
          <Button 
            disabled={!image} 
            onClick={handleDownload} 
            className="w-full"
            icon={<Download className="w-4 h-4" />}
          >
            下载图片
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleReset} 
            className="w-full text-slate-400 hover:text-white"
            icon={<RotateCcw className="w-3 h-3" />}
          >
            重置所有设置
          </Button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 bg-slate-100/50 p-4 md:p-8 flex items-center justify-center overflow-hidden relative">
        {!image ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">未选择图片</h3>
            <p className="text-slate-500 mb-6">请从左侧栏上传需要加水印的源图片。</p>
            <Button onClick={() => fileInputRef.current?.click()}>选择图片</Button>
          </div>
        ) : (
          <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-200 max-w-full max-h-full flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white">
             {/* Canvas is the star here */}
             <canvas 
               ref={canvasRef} 
               className="max-w-full max-h-[85vh] object-contain"
               style={{ imageRendering: 'high-quality' }}
             />
             
             {/* Reset Image Button Overlay */}
             <button 
               onClick={() => { setImage(null); setImageName('image'); }}
               className="absolute top-4 right-4 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
               title="移除图片"
             >
               <X className="w-4 h-4" />
             </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
