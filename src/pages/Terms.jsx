import { FileText } from 'lucide-react';
import SEO from '../components/SEO';

export default function Terms() {
  return (
    <>
    <SEO title="Terms & Conditions | DailyAxom Tools" description="Read the terms and conditions for using DailyAxom Tools." url="/terms" />
    <div className="max-w-7xl mx-auto bg-white p-8 md:p-12 border border-gray-100 shadow-sm">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none text-gray-600">
        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-black mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using DailyAxom Tools, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">2. Use of Tools</h2>
        <p className="mb-4">
          The tools provided on this website are for general utility purposes. We strive to provide accurate results, but we do not guarantee the absolute correctness of any calculation, conversion, or manipulation performed by our tools.
        </p>

        <h2 className="text-2xl font-bold text-black mt-8 mb-4">3. Disclaimer of Warranties</h2>
        <p className="mb-4">
          Your use of the website and its tools is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis.
        </p>
      </div>
    </div>
    </>
  );
}
