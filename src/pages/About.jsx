import { Info, Shield, Zap } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO title="About Us | DailyAxom Tools" description="Learn more about DailyAxom Tools and our mission to simplify online utilities." url="/about" />
      <div className="max-w-7xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight">About Us</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-6 text-xl">
            Welcome to DailyAxom Tools, your premium destination for online utilities.
          </p>
          
          <p className="mb-4">
            Our mission is to provide a comprehensive suite of tools that simplify your daily digital tasks. 
            Whether you need a quick calculation, a format conversion, or text manipulation, we aim to provide 
            fast, reliable, and beautifully designed tools right in your browser.
          </p>

          <p className="mb-4">
            We believe that software should be fast, private by design, and easy to use. That's why our tools 
            are designed with a premium, distraction-free interface focusing on what matters most: getting the job done.
          </p>
        </div>
      </div>
    </>
  );
}
