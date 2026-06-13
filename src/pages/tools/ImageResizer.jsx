import React, { useState, useRef } from 'react';
import { Upload, Download, Settings, RefreshCw, Image as ImageIcon } from 'lucide-react';
import SEO from '../../components/SEO';

export default function ImageResizer() {
  const [sizeOption, setSizeOption] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const canvasRef = useRef(null);

  const presets = [
    { label: 'Custom Size', value: 'custom' },
    { label: 'Passport Size (450x600)', value: '450x600' },
    { label: 'ADRE Photo (210x310)', value: '210x310' },
    { label: 'ADRE Sign (210x110)', value: '210x110' },
    { label: 'DHS Photo (210x310)', value: '210x310' },
    { label: 'DHS Sign (210x110)', value: '210x110' },
    { label: 'Facebook Post (1536x1920)', value: '1536x1920' },
    { label: 'SLPRB Photo (413x531)', value: '413x531' },
    { label: 'SLPRB Sign (472x236)', value: '472x236' },
  ];

  const handleSizeChange = (e) => {
    const val = e.target.value;
    setSizeOption(val);
    if (val && val !== 'custom') {
      const [w, h] = val.split('x');
      setWidth(w);
      setHeight(h);
    } else if (val === 'custom') {
      setWidth('');
      setHeight('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPreviewSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResize = () => {
    if (!previewSrc || !width || !height) return;
    setIsResizing(true);
    
    const targetWidth = parseInt(width);
    const targetHeight = parseInt(height);
    
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Fill white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      
      // Calculate drawing dimensions to maintain aspect ratio with padding
      const imgAspect = img.width / img.height;
      const targetAspect = targetWidth / targetHeight;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (imgAspect > targetAspect) {
        // Image is wider than target aspect
        drawWidth = targetWidth;
        drawHeight = targetWidth / imgAspect;
        offsetX = 0;
        offsetY = (targetHeight - drawHeight) / 2;
      } else {
        // Image is taller than target aspect
        drawHeight = targetHeight;
        drawWidth = targetHeight * imgAspect;
        offsetX = (targetWidth - drawWidth) / 2;
        offsetY = 0;
      }
      
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Download the image
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resized_${targetWidth}x${targetHeight}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsResizing(false);
      }, 'image/jpeg', 0.95);
    };
    img.src = previewSrc;
  };

  return (
    <>
    <SEO title="Free Image Resizer - DailyAxom Tools" description="Resize images to passport size, ADRE photo, and custom dimensions online." url="/image-resizer" />
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Actions / Inputs */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-100 pb-4">Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Image Size *</label>
            <select value={sizeOption} onChange={handleSizeChange} className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black bg-white">
              <option value="" disabled>-- Select Image Size --</option>
              {presets.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
              <input 
                type="number" 
                value={width} 
                onChange={e => setWidth(e.target.value)} 
                disabled={sizeOption !== 'custom'}
                placeholder="Width" 
                className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black disabled:bg-gray-50 disabled:text-gray-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
              <input 
                type="number" 
                value={height} 
                onChange={e => setHeight(e.target.value)} 
                disabled={sizeOption !== 'custom'}
                placeholder="Height" 
                className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black disabled:bg-gray-50 disabled:text-gray-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
            <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer relative group bg-gray-50/50">
              <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-black transition-colors" />
              <span className="text-sm text-gray-500 group-hover:text-black font-medium transition-colors">Click to upload or drag and drop</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP supported</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>
          </div>

          <button 
            onClick={handleResize} 
            disabled={!previewSrc || !width || !height || isResizing}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
          >
            {isResizing ? 'Processing...' : (
              <>
                <ImageIcon className="w-5 h-5" /> Resize Image
              </>
            )}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          {previewSrc ? (
            <div className="relative max-w-full max-h-[400px] overflow-hidden border border-gray-200 p-2 shadow-sm flex items-center justify-center">
              <img src={previewSrc} alt="Uploaded Image Preview" className="max-w-full max-h-[380px] object-contain" />
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-4">
              <ImageIcon className="w-16 h-16 opacity-20" />
              <p>Upload an image to see preview</p>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {/* About Section */}
      <section className="bg-white p-8 border-t border-gray-100 mt-16 text-center">
        <h2 className="text-xl font-bold text-black mb-2">About Free Image Resizer</h2>
        <p className="text-gray-600 text-sm max-w-3xl mx-auto">
          Resize your photos to meet exact application requirements instantly, with automatic white background padding. 
          All processing happens securely in your browser—no uploads required.
        </p>
      </section>
    </div>
    </>
  );
}
