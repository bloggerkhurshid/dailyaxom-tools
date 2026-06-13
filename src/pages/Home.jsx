import { 
  ArrowRight, 
  FileText, 
  Crop, 
  FileArchive, 
  FilePlus, 
  RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Home() {
  const tools = [
    { 
      id: 'resume-maker', 
      name: 'Online Resume Maker', 
      description: 'Easily create a professional resume for any job application. Perfect for government jobs, freshers, and bank exams.', 
      path: '/resume-maker',
      icon: <FileText className="w-8 h-8 text-black mb-6 group-hover:scale-110 transition-transform duration-300" />
    },
    { 
      id: 'image-resizer', 
      name: 'Free Image Resizer', 
      description: 'Resize images to passport size, ADRE photo & custom dimensions online with a white background.', 
      path: '/image-resizer',
      icon: <Crop className="w-8 h-8 text-black mb-6 group-hover:scale-110 transition-transform duration-300" />
    },
    { 
      id: 'image-compressor', 
      name: 'Image Compressor', 
      description: 'Compress images without losing quality online. Reduce file size for faster uploads & meet portal size requirements.', 
      path: '/image-compressor',
      icon: <FileArchive className="w-8 h-8 text-black mb-6 group-hover:scale-110 transition-transform duration-300" />
    },
    { 
      id: 'images-to-pdf', 
      name: 'Images to PDF Converter', 
      description: 'Convert multiple images to PDF online with quality control. Create document portfolios & application submissions.', 
      path: '/images-to-pdf',
      icon: <FilePlus className="w-8 h-8 text-black mb-6 group-hover:scale-110 transition-transform duration-300" />
    },
    { 
      id: 'pdf-compressor', 
      name: 'PDF Compressor', 
      description: 'Compress PDF files online to specific target sizes. Perfect for meeting strict job portal upload limits.', 
      path: '/pdf-compressor',
      icon: <FileArchive className="w-8 h-8 text-black mb-6 group-hover:scale-110 transition-transform duration-300" />
    },
    { 
      id: 'image-converter', 
      name: 'Image Format Converter', 
      description: 'Convert images instantly between JPG, PNG, and WEBP formats online. Fast, secure, and preserves quality.', 
      path: '/image-converter',
      icon: <RefreshCw className="w-8 h-8 text-black mb-6 group-hover:scale-110 transition-transform duration-300" />
    }
  ];

  return (
    <>
    <SEO title="DailyAxom Tools | Premium Online Utilities" description="A premium collection of essential online tools designed for speed, simplicity, and efficiency." url="/" />
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="text-center py-24 bg-black text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <a 
            href="https://dailyaxom.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 mb-8 text-sm font-bold bg-white text-black uppercase tracking-widest hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 animate-bounce shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            🌟 Visit DailyAxom.in For Job Updates
          </a>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 uppercase">
            Powerful Online Tools
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Everything you need to resize photos, compress PDFs, and create resumes—lightning fast and 100% free.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Available Tools</h2>
        </div>
        
        {tools.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">No tools available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link 
                key={tool.id} 
                to={tool.path}
                className="group bg-white p-8 border border-gray-200 hover:border-black transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                {tool.icon}
                <h3 className="text-xl font-bold mb-3 text-black">{tool.name}</h3>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed flex-grow">{tool.description}</p>
                <div className="flex items-center text-sm font-bold text-black uppercase tracking-wider group-hover:gap-3 transition-all mt-auto pt-4 border-t border-gray-100">
                  Open Tool <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  );
}
