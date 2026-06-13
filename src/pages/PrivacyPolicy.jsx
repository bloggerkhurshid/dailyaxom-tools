import { Shield } from 'lucide-react';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <>
    <SEO title="Privacy Policy | DailyAxom Tools" description="Read our privacy policy to understand how we protect your data." url="/privacy-policy" />
    <div className="max-w-7xl mx-auto bg-white p-8 md:p-12 border border-gray-100 shadow-sm">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none text-gray-600">
        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-black mt-8 mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to DailyAxom Tools. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you as to how we look after your personal data when you visit our website 
          and tell you about your privacy rights.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">2. Data We Collect</h2>
        <p className="mb-4">
          Our tools are designed to operate primarily in your browser. We do not collect or store the data you process 
          using our tools on our servers unless explicitly stated for a specific tool. We may collect basic usage 
          analytics to improve our services.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">3. Cookies</h2>
        <p className="mb-4">
          We may use essential cookies to ensure our website functions correctly. We may also use analytics cookies 
          to understand how visitors interact with our website.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">4. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this privacy policy or our privacy practices, please contact us.
        </p>
      </div>
    </div>
    </>
  );
}
