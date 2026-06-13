import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import About from './pages/About';
import Contact from './pages/Contact';
import ResumeMaker from './pages/tools/ResumeMaker';
import ImageResizer from './pages/tools/ImageResizer';
import ImageCompressor from './pages/tools/ImageCompressor';
import ImagesToPdf from './pages/tools/ImagesToPdf';
import PdfCompressor from './pages/tools/PdfCompressor';
import ImageConverter from './pages/tools/ImageConverter';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume-maker" element={<ResumeMaker />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/images-to-pdf" element={<ImagesToPdf />} />
          <Route path="/pdf-compressor" element={<PdfCompressor />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;
