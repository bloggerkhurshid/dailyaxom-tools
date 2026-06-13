import { Mail, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <>
    <SEO title="Contact Us | DailyAxom Tools" description="Get in touch with the DailyAxom Tools team for support or inquiries." url="/contact" />
    <div className="max-w-7xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Contact Us</h1>
      
      <div className="max-w-3xl">
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Feel free to contact us with any suggestions, criticism, job openings, and information about various competitive examinations or any institutional promotions. We will reply back to you within 48 working hours. If anyone notices any errors, kindly inform us immediately. You can contact us with any DMCA notice, file removal, advertising, or other queries.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-black mt-1" />
            <div>
              <h3 className="font-bold text-lg">Official Email Support</h3>
              <p className="text-gray-600">contact@projuktisoft.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-black mt-1" />
            <div>
              <h3 className="font-bold text-lg">Location</h3>
              <p className="text-gray-600">Assam, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
