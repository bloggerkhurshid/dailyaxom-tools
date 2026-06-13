import React, { useState } from 'react';
import { Upload, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import SEO from '../../components/SEO';

export default function ImageConverter() {
  const [targetFormat, setTargetFormat] = useState('');
  
  const [originalFile, setOriginalFile] = useState(null);
  const [originalSrc, setOriginalSrc] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [convertedSrc, setConvertedSrc] = useState(null);
  const [convertedSize, setConvertedSize] = useState(0);
  
  const [isConverting, setIsConverting] = useState(false);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalFile(file);
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => setOriginalSrc(event.target.result);
      reader.readAsDataURL(file);
      
      // Reset conversion
      setConvertedBlob(null);
      setConvertedSrc(null);
      setConvertedSize(0);
    }
  };

  const handleConvert = async () => {
    if (!originalSrc || !targetFormat) return;

    setIsConverting(true);

    try {
      const img = new Image();
      img.src = originalSrc;
      await new Promise(resolve => img.onload = resolve);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // If target is JPEG, fill background with white to prevent black transparent areas
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise(resolve => canvas.toBlob(resolve, targetFormat, 0.92));
      
      setConvertedBlob(blob);
      setConvertedSrc(URL.createObjectURL(blob));
      setConvertedSize(blob.size);
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("An error occurred during conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob) return;
    
    // Determine extension
    let ext = 'jpg';
    if (targetFormat === 'image/png') ext = 'png';
    else if (targetFormat === 'image/webp') ext = 'webp';

    const a = document.createElement('a');
    a.href = convertedSrc;
    a.download = `converted_${originalFile.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
    <SEO title="Image Format Converter - JPG, PNG, WEBP" description="Convert images instantly between JPG, PNG, and WEBP formats online." url="/image-converter" />
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Actions / Inputs */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-100 pb-4 flex items-center gap-2">
            <RefreshCw className="w-6 h-6" /> Conversion Settings
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Convert To *</label>
            <select value={targetFormat} onChange={e => setTargetFormat(e.target.value)} className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black bg-white">
              <option value="" disabled>-- Select Target Format --</option>
              <option value="image/jpeg">JPG / JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
            <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer relative group bg-gray-50/50">
              <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-black transition-colors" />
              <span className="text-sm text-gray-500 group-hover:text-black font-medium transition-colors">Click to upload or drag and drop</span>
              <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP, GIF</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>
          </div>

          {originalFile && (
            <div className="bg-gray-50 p-4 border border-gray-200 flex justify-between text-sm">
              <span className="font-semibold text-gray-700 truncate mr-2">{originalFile.name}</span>
              <span className="text-black font-bold whitespace-nowrap">{formatSize(originalSize)}</span>
            </div>
          )}

          <button 
            onClick={handleConvert} 
            disabled={!originalSrc || !targetFormat || isConverting}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
          >
            {isConverting ? 'Converting...' : 'Convert Image'}
          </button>
        </div>

        {/* Preview / Result */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          {convertedSrc ? (
            <div className="w-full space-y-6 flex flex-col items-center">
              <div className="w-full bg-green-50 text-green-800 p-4 border border-green-200 text-center text-sm font-medium">
                Success! Image converted successfully.
              </div>
              
              <div className="flex gap-12 text-center w-full justify-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Original Size</p>
                  <p className="font-bold">{formatSize(originalSize)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">New Size</p>
                  <p className="font-bold">{formatSize(convertedSize)}</p>
                </div>
              </div>

              <div className="relative max-w-full max-h-[300px] overflow-hidden border border-gray-200 p-2 shadow-sm flex items-center justify-center bg-gray-50">
                <img src={convertedSrc} alt="Converted Preview" className="max-w-full max-h-[280px] object-contain" />
              </div>
              
              <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                <Download className="w-5 h-5" /> Download Image
              </button>
            </div>
          ) : originalSrc ? (
            <div className="relative max-w-full max-h-[400px] overflow-hidden border border-gray-200 p-2 shadow-sm flex items-center justify-center bg-gray-50">
              <img src={originalSrc} alt="Original Preview" className="max-w-full max-h-[380px] object-contain" />
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-4">
              <ImageIcon className="w-16 h-16 opacity-20" />
              <p>Upload an image to see preview</p>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <section className="bg-white p-8 border-t border-gray-100 mt-16 text-center">
        <h2 className="text-xl font-bold text-black mb-2">About Image Format Converter</h2>
        <p className="text-gray-600 text-sm max-w-3xl mx-auto">
          Instantly convert your photos between JPG, PNG, and WEBP formats. 
          The conversion happens securely and entirely within your browser, ensuring your images remain 100% private.
        </p>
      </section>
    </div>
    </>
  );
}
