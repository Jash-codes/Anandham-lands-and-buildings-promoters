import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Mail, Facebook, Instagram, Youtube, ShieldCheck } from 'lucide-react';
import { BUSINESS, telLink, whatsappLink } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* RERA bar */}
      <div className="bg-emerald-900/50 border-b border-emerald-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-emerald-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">RERA Registered</span>
            </div>
            {BUSINESS.reraNumbers.map((num) => (
              <span key={num} className="text-emerald-200">{num}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div>
                <div className="text-sm font-bold text-white">Anandham</div>
                <div className="text-xs text-stone-400">Lands & Building Promoters</div>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {BUSINESS.yearsExperience}+ years of trust in delivering DTCP & RERA-approved
              residential plots across Tamil Nadu.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-emerald-700 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-emerald-700 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-emerald-700 flex items-center justify-center transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/projects" className="hover:text-emerald-400 transition-colors">All Projects</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Our Projects</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/project/anandham-greens-phase-1" className="hover:text-emerald-400 transition-colors">Anandham Greens Phase 1</Link></li>
              <li><Link to="/project/anandham-nagar-phase-2" className="hover:text-emerald-400 transition-colors">Anandham Nagar Phase 2</Link></li>
              <li><Link to="/project/anandham-orchards" className="hover:text-emerald-400 transition-colors">Anandham Orchards</Link></li>
              <li><Link to="/project/anandham-lakeside" className="hover:text-emerald-400 transition-colors">Anandham Lakeside</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                <span>{BUSINESS.address}</span>
              </li>
              <li>
                <a href={telLink()} className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors">
                  <Phone className="w-4 h-4 shrink-0 text-emerald-500" />
                  {BUSINESS.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink('Hi, I would like to know more about Anandham plots.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                  WhatsApp Chat
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-emerald-500" />
                {BUSINESS.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
          <p>Proprietor: {BUSINESS.owner}</p>
        </div>
      </div>
    </footer>
  );
}
