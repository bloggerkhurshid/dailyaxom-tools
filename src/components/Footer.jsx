import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 mt-auto">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm text-center md:text-left">
          © {new Date().getFullYear()} DailyAxom. All rights reserved.
        </p>
        
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
          <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</Link>
          <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
