import { Mail, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <>
    <SEO title="Contact Us | DailyAxom Tools" description="Get in touch with the DailyAxom Tools team for support or inquiries." url="/contact" />
    <div className="max-w-7xl mx-auto bg-white p-8 md:p-12 shadow-sm border border-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-lg text-gray-600 mb-8">
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
        
        <div className="bg-gray-50 p-6 border border-gray-100">
          <h3 className="font-bold text-xl mb-6">Send us a message</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black transition-colors" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black transition-colors" placeholder="Your email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black transition-colors" placeholder="Your message..."></textarea>
            </div>
            <button type="submit" className="w-full bg-black text-white font-semibold py-3 hover:bg-gray-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
