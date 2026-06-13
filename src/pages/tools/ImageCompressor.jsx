import React, { useState } from 'react';
import { Upload, Download, FileArchive, Image as ImageIcon } from 'lucide-react';
import SEO from '../../components/SEO';

export default function ImageCompressor() {
  const [qualityOption, setQualityOption] = useState('');
  const [customSizeKB, setCustomSizeKB] = useState('');
  
  const [originalFile, setOriginalFile] = useState(null);
  const [originalSrc, setOriginalSrc] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [compressedSrc, setCompressedSrc] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  
  const [isCompressing, setIsCompressing] = useState(false);

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
      
      // Reset compression
      setCompressedBlob(null);
      setCompressedSrc(null);
      setCompressedSize(0);
    }
  };

  const handleCompress = async () => {
    if (!originalSrc || !qualityOption) return;
    if (qualityOption === 'custom' && !customSizeKB) return;

    setIsCompressing(true);

    const img = new Image();
    img.src = originalSrc;
    await new Promise(resolve => img.onload = resolve);

    const getBlob = (quality, scale) => {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      });
    };

    let finalBlob = null;

    if (qualityOption !== 'custom') {
      const qMap = { low: 0.4, medium: 0.6, high: 0.8 };
      finalBlob = await getBlob(qMap[qualityOption], 1.0);
    } else {
      const targetBytes = parseFloat(customSizeKB) * 1024;
      let scale = 1.0;
      let minQ = 0.01;
      let maxQ = 1.0;
      
      // First, find a scale where the lowest quality (0.01) is smaller than the target
      let bestBlob = await getBlob(minQ, scale);
      
      while (bestBlob.size > targetBytes && scale > 0.1) {
        scale -= 0.15; // Reduce resolution if image is too large even at worst quality
        bestBlob = await getBlob(minQ, scale);
      }

      // Now binary search for the best quality at this scale
      for (let i = 0; i < 8; i++) {
        let midQ = (minQ + maxQ) / 2;
        let tempBlob = await getBlob(midQ, scale);
        
        if (tempBlob.size <= targetBytes) {
          bestBlob = tempBlob;
          minQ = midQ; // we can try higher quality
        } else {
          maxQ = midQ; // quality too high, lower max
        }
      }
      finalBlob = bestBlob;
    }

    setCompressedBlob(finalBlob);
    setCompressedSrc(URL.createObjectURL(finalBlob));
    setCompressedSize(finalBlob.size);
    setIsCompressing(false);
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const a = document.createElement('a');
    a.href = compressedSrc;
    a.download = `compressed_${originalFile.name.replace(/\.[^/.]+$/, "")}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
    <SEO title="Image Compressor - Reduce Photo Size Online" description="Compress images without losing quality online. Reduce file size for faster uploads." url="/image-compressor" />
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Actions / Inputs */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-100 pb-4 flex items-center gap-2">
            <FileArchive className="w-6 h-6" /> Settings
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compression Level *</label>
            <select value={qualityOption} onChange={e => setQualityOption(e.target.value)} className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black bg-white">
              <option value="" disabled>-- Select Image Quality --</option>
              <option value="low">Low (Smaller File Size)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Better Quality)</option>
              <option value="custom">Custom Size (KB)</option>
            </select>
          </div>

          {qualityOption === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Size (in KB) *</label>
              <input 
                type="number" 
                value={customSizeKB} 
                onChange={e => setCustomSizeKB(e.target.value)} 
                placeholder="e.g. 50" 
                className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black" 
              />
              <p className="text-xs text-gray-500 mt-1">We will try our best to compress the image just below this size.</p>
            </div>
          )}

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

          {originalFile && (
            <div className="bg-gray-50 p-4 border border-gray-200 flex justify-between text-sm">
              <span className="font-semibold text-gray-700">Original Size:</span>
              <span className="text-black font-bold">{formatSize(originalSize)}</span>
            </div>
          )}

          <button 
            onClick={handleCompress} 
            disabled={!originalSrc || !qualityOption || (qualityOption === 'custom' && !customSizeKB) || isCompressing}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
          >
            {isCompressing ? 'Compressing...' : 'Compress Image'}
          </button>
        </div>

        {/* Preview / Result */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          {compressedSrc ? (
            <div className="w-full space-y-6 flex flex-col items-center">
              <div className="w-full bg-green-50 text-green-800 p-4 border border-green-200 text-center text-sm font-medium">
                Success! Image reduced by {((1 - compressedSize / originalSize) * 100).toFixed(1)}%
              </div>
              
              <div className="flex gap-8 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Original</p>
                  <p className="font-bold">{formatSize(originalSize)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Compressed</p>
                  <p className="font-bold text-green-600">{formatSize(compressedSize)}</p>
                </div>
              </div>

              <div className="relative max-w-full max-h-[300px] overflow-hidden border border-gray-200 p-2 shadow-sm flex items-center justify-center">
                <img src={compressedSrc} alt="Compressed Preview" className="max-w-full max-h-[280px] object-contain" />
              </div>
              
              <button onClick={handleDownload} className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 font-bold hover:bg-green-700 transition-colors">
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
          ) : originalSrc ? (
            <div className="relative max-w-full max-h-[400px] overflow-hidden border border-gray-200 p-2 shadow-sm flex items-center justify-center">
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
        <h2 className="text-xl font-bold text-black mb-2">About Image Compressor Tool</h2>
        <p className="text-gray-600 text-sm max-w-3xl mx-auto">
          Reduce photo file sizes significantly without compromising on visual quality. Set custom size targets (like 50KB or 100KB) and our tool will intelligently compress your image directly in your browser, keeping your data 100% private.
        </p>
      </section>
    </div>
    </>
  );
}
