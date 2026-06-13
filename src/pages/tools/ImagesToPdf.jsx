import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Upload, Download, FilePlus, Image as ImageIcon, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import SEO from '../../components/SEO';

export default function ImagesToPdf() {
  const [qualityOption, setQualityOption] = useState('');
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      src: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
    e.target.value = null; // reset input
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setImages(newImages);
  };

  const moveDown = (index) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setImages(newImages);
  };

  const generatePdf = async () => {
    if (images.length === 0 || !qualityOption) return;
    setIsGenerating(true);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const qMap = { low: 0.4, medium: 0.6, high: 0.8 };
    const quality = qMap[qualityOption] || 0.8;

    for (let i = 0; i < images.length; i++) {
      if (i > 0) pdf.addPage();
      
      const img = new Image();
      img.src = images[i].src;
      await new Promise(resolve => img.onload = resolve);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      const imgRatio = img.width / img.height;
      const pageRatio = pageWidth / pageHeight;
      
      let renderWidth, renderHeight;
      if (imgRatio > pageRatio) {
        // Fits width perfectly
        renderWidth = pageWidth;
        renderHeight = pageWidth / imgRatio;
      } else {
        // Fits height perfectly
        renderHeight = pageHeight;
        renderWidth = pageHeight * imgRatio;
      }
      
      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(compressedDataUrl, 'JPEG', x, y, renderWidth, renderHeight);
    }

    pdf.save('Converted_Document.pdf');
    setIsGenerating(false);
  };

  return (
    <>
    <SEO title="Images to PDF Converter - DailyAxom Tools" description="Convert multiple images to PDF online with quality control." url="/images-to-pdf" />
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Settings & Upload */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-100 pb-4 flex items-center gap-2">
            <FilePlus className="w-6 h-6" /> Convert to PDF
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PDF Quality *</label>
            <select value={qualityOption} onChange={e => setQualityOption(e.target.value)} className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black bg-white">
              <option value="" disabled>-- Select PDF Quality --</option>
              <option value="low">Low (Smaller File Size)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Better Image Quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Images *</label>
            <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer relative group bg-gray-50/50">
              <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-black transition-colors" />
              <span className="text-sm text-gray-500 group-hover:text-black font-medium transition-colors">Click to upload multiple images</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFiles} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>
          </div>

          <button 
            onClick={generatePdf} 
            disabled={images.length === 0 || !qualityOption || isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
          >
            {isGenerating ? 'Generating PDF...' : (
              <>
                <Download className="w-5 h-5" /> Download in PDF
              </>
            )}
          </button>
        </div>

        {/* Preview List */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
          <h2 className="text-2xl font-bold border-b border-gray-100 pb-4 mb-4">
            Pages Preview ({images.length})
          </h2>
          
          {images.length > 0 ? (
            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
              {images.map((img, index) => (
                <div key={img.id} className="flex items-center gap-4 p-3 border border-gray-200 bg-gray-50">
                  <div className="w-16 h-16 flex-shrink-0 border border-gray-300 bg-white flex items-center justify-center overflow-hidden">
                    <img src={img.src} alt={`Page ${index + 1}`} className="max-w-full max-h-full object-contain" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{img.name}</p>
                    <p className="text-xs text-gray-500">Page {index + 1}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-black disabled:opacity-30 transition-colors">
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <button onClick={() => moveDown(index)} disabled={index === images.length - 1} className="p-1 text-gray-400 hover:text-black disabled:opacity-30 transition-colors">
                      <ArrowDown className="w-5 h-5" />
                    </button>
                    <button onClick={() => removeImage(img.id)} className="p-1 text-red-400 hover:text-red-600 ml-2 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400 gap-4">
              <ImageIcon className="w-16 h-16 opacity-20" />
              <p>Upload images to see them here.</p>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <section className="bg-white p-8 border-t border-gray-100 mt-16 text-center">
        <h2 className="text-xl font-bold text-black mb-2">About Images to PDF Converter</h2>
        <p className="text-gray-600 text-sm max-w-3xl mx-auto">
          Transform multiple photos into a single, professional PDF document directly in your browser. Perfect for compiling certificates and documents securely without uploading any files to a server.
        </p>
      </section>
    </div>
    </>
  );
}
