import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { BUSINESS, telLink } from '@/lib/constants';

interface HeaderProps {
  onEnquire: () => void;
}

export default function Header({ onEnquire }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-md">
              A
            </div>
            <div className="hidden sm:block">
              <div className="text-sm lg:text-base font-bold text-stone-800 leading-tight">
                Anandham
              </div>
              <div className="text-[10px] lg:text-xs text-stone-500 leading-tight">
                Lands & Building Promoters
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-stone-600 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={telLink()}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-emerald-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              {BUSINESS.phoneDisplay}
            </a>
            <button
              onClick={onEnquire}
              className="px-5 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Book a Site Visit
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={telLink()}
              className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              aria-label="Call"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-200 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onEnquire();
              }}
              className="block w-full text-left px-4 py-3 mt-2 bg-emerald-700 text-white text-sm font-semibold rounded-lg"
            >
              Book a Site Visit
            </button>
            <div className="flex items-center gap-2 px-4 pt-3 text-xs text-stone-500">
              <MapPin className="w-4 h-4" />
              {BUSINESS.address}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
