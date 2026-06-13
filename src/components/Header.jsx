import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <img 
              src="/dailyaxom_logo.png" 
              alt="DailyAxom Logo" 
              className="h-10 w-auto rounded-xl"
            />
            <span className="text-xl tracking-tight text-black">
              <span className="font-light text-gray-500">Daily</span><span className="font-extrabold">Axom</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
