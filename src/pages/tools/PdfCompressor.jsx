import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, Download, FileText, FileArchive } from 'lucide-react';
import SEO from '../../components/SEO';

// Use CDN for the worker to avoid Vite build/MIME type issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfCompressor() {
  const [qualityOption, setQualityOption] = useState('');
  const [customSizeKB, setCustomSizeKB] = useState('');
  
  const [originalFile, setOriginalFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [originalPdfDoc, setOriginalPdfDoc] = useState(null);
  const [originalPdfUrl, setOriginalPdfUrl] = useState(null);
  
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [compressedSrc, setCompressedSrc] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  
  const [isCompressing, setIsCompressing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalFile(file);
      setOriginalSize(file.size);
      
      const fileUrl = URL.createObjectURL(file);
      setOriginalPdfUrl(fileUrl);
      
      setCompressedBlob(null);
      setCompressedSrc(null);
      setCompressedSize(0);
      setErrorMsg('');
      setProgressMsg('Loading PDF...');

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        setOriginalPdfDoc(pdfDoc);
        setProgressMsg('');
      } catch (err) {
        console.error("PDF Load Error: ", err);
        setErrorMsg('Failed to load PDF. Please try another file.');
        setProgressMsg('');
      }
    }
  };

  const generatePdfBlob = async (pdfDoc, quality, renderScale) => {
    const numPages = pdfDoc.numPages;
    const newPdf = new jsPDF('p', 'pt', 'a4');
    const a4Width = newPdf.internal.pageSize.getWidth();
    const a4Height = newPdf.internal.pageSize.getHeight();
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (pageNum > 1) newPdf.addPage();
      
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: renderScale });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: ctx, viewport }).promise;
      const imgData = canvas.toDataURL('image/jpeg', quality);
      
      const imgRatio = viewport.width / viewport.height;
      const pageRatio = a4Width / a4Height;
      
      let renderWidth, renderHeight;
      if (imgRatio > pageRatio) {
        renderWidth = a4Width;
        renderHeight = a4Width / imgRatio;
      } else {
        renderHeight = a4Height;
        renderWidth = a4Height * imgRatio;
      }
      
      const x = (a4Width - renderWidth) / 2;
      const y = (a4Height - renderHeight) / 2;

      newPdf.addImage(imgData, 'JPEG', x, y, renderWidth, renderHeight);
    }
    
    return newPdf.output('blob');
  };

  const handleCompress = async () => {
    if (!originalPdfDoc || !qualityOption) return;
    if (qualityOption === 'custom' && !customSizeKB) return;

    setIsCompressing(true);
    setErrorMsg('');

    try {
      let finalBlob = null;

      if (qualityOption !== 'custom') {
        setProgressMsg('Compressing PDF...');
        const qMap = { low: 0.4, medium: 0.6, high: 0.8 };
        finalBlob = await generatePdfBlob(originalPdfDoc, qMap[qualityOption], 1.5);
      } else {
        const targetBytes = parseFloat(customSizeKB) * 1024;
        let scale = 1.5;
        let minQ = 0.05;
        let maxQ = 0.95;
        
        setProgressMsg('Finding optimal resolution...');
        let bestBlob = await generatePdfBlob(originalPdfDoc, minQ, scale);
        
        while (bestBlob.size > targetBytes && scale > 0.4) {
          scale -= 0.3;
          setProgressMsg(`Scaling down resolution (Scale: ${scale.toFixed(1)})...`);
          bestBlob = await generatePdfBlob(originalPdfDoc, minQ, scale);
        }

        setProgressMsg('Fine-tuning compression quality...');
        for (let i = 0; i < 5; i++) {
          let midQ = (minQ + maxQ) / 2;
          let tempBlob = await generatePdfBlob(originalPdfDoc, midQ, scale);
          
          if (tempBlob.size <= targetBytes) {
            bestBlob = tempBlob;
            minQ = midQ; 
          } else {
            maxQ = midQ;
          }
        }
        finalBlob = bestBlob;
      }

      setCompressedBlob(finalBlob);
      setCompressedSrc(URL.createObjectURL(finalBlob));
      setCompressedSize(finalBlob.size);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error compressing PDF. Please try a different file.');
    } finally {
      setIsCompressing(false);
      setProgressMsg('');
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const a = document.createElement('a');
    a.href = compressedSrc;
    a.download = `compressed_${originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
    <SEO title="PDF Compressor | Reduce PDF File Size Online" description="Compress PDF files online to specific target sizes entirely in your browser." url="/pdf-compressor" />
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Actions / Inputs */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-100 pb-4 flex items-center gap-2">
            <FileArchive className="w-6 h-6" /> PDF Settings
          </h2>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 border border-red-200 rounded text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compression Level *</label>
            <select value={qualityOption} onChange={e => setQualityOption(e.target.value)} className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black bg-white">
              <option value="" disabled>-- Select PDF Quality --</option>
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
                placeholder="e.g. 200" 
                className="w-full px-4 py-3 border border-gray-200 focus:ring-black focus:border-black" 
              />
              <p className="text-xs text-gray-500 mt-1">We will try our best to compress the PDF just below this size.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF *</label>
            <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer relative group bg-gray-50/50">
              <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-black transition-colors" />
              <span className="text-sm text-gray-500 group-hover:text-black font-medium transition-colors">Click to upload or drag and drop</span>
              <span className="text-xs text-gray-400 mt-1">PDF documents only</span>
              <input 
                type="file" 
                accept="application/pdf" 
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
            onClick={handleCompress} 
            disabled={!originalPdfDoc || !qualityOption || (qualityOption === 'custom' && !customSizeKB) || isCompressing}
            className="w-full flex flex-col items-center justify-center bg-black text-white px-8 py-4 font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20"
          >
            {isCompressing ? (
              <div className="flex flex-col items-center gap-1">
                <span>Compressing...</span>
                <span className="text-xs font-normal text-gray-300">{progressMsg}</span>
              </div>
            ) : (
              'Compress PDF'
            )}
          </button>
        </div>

        {/* Result & Preview */}
        <div className="bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          {compressedBlob ? (
            <div className="w-full space-y-6 flex flex-col items-center">
              <div className="w-full bg-green-50 text-green-800 p-4 border border-green-200 text-center text-sm font-medium">
                Success! PDF reduced by {((1 - compressedSize / originalSize) * 100).toFixed(1)}%
              </div>
              
              <div className="flex gap-12 text-center w-full justify-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Original Size</p>
                  <p className="font-bold text-lg">{formatSize(originalSize)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Compressed Size</p>
                  <p className="font-bold text-green-600 text-lg">{formatSize(compressedSize)}</p>
                </div>
              </div>

              <div className="w-full h-[300px] border border-gray-200 relative bg-gray-50">
                <iframe src={compressedSrc} title="Compressed PDF Preview" className="w-full h-full"></iframe>
              </div>

              <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-10 py-4 font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                <Download className="w-6 h-6" /> Download PDF
              </button>
            </div>
          ) : originalPdfUrl && !isCompressing ? (
            <div className="w-full h-[400px] border border-gray-200 relative bg-gray-50">
                <iframe src={originalPdfUrl} title="Original PDF Preview" className="w-full h-full"></iframe>
            </div>
          ) : originalFile && isCompressing ? (
            <div className="text-center space-y-4">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
               <p className="text-gray-600 font-medium">Processing document...</p>
               <p className="text-sm text-gray-400">This might take a few moments for large PDFs.</p>
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-4 text-center">
              <FileText className="w-16 h-16 opacity-20" />
              <p>Upload a PDF to see preview</p>
              <p className="text-xs text-gray-500 max-w-xs">Note: Documents will be rasterized to reduce file size. Text will no longer be selectable.</p>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <section className="bg-white p-8 border-t border-gray-100 mt-16 text-center">
        <h2 className="text-xl font-bold text-black mb-2">About PDF Compressor Tool</h2>
        <p className="text-gray-600 text-sm max-w-3xl mx-auto">
          Reduce PDF file sizes instantly. Perfect for meeting strict size limits on job portals and admission forms. 
          Your documents are compressed entirely in your browser without ever being uploaded to a server, guaranteeing 100% privacy.
        </p>
      </section>
    </div>
    </>
  );
}
