import { MapPin, Phone, MessageCircle, Mail, Clock, ShieldCheck } from 'lucide-react';
import { BUSINESS, telLink, whatsappLink } from '@/lib/constants';
import type { Project } from '@/lib/types';

interface ContactPageProps {
  onEnquire: (project?: Project | null) => void;
}

export default function ContactPage({ onEnquire }: ContactPageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-800 to-emerald-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-stone-300 text-sm lg:text-base max-w-2xl">
            We're here to help you find the perfect plot. Reach out through any of these channels —
            we respond fast.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {/* Call */}
            <a
              href={telLink()}
              className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-300 hover:shadow-lg transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">Call Us</h3>
              <p className="text-sm text-stone-600">{BUSINESS.phoneDisplay}</p>
              <p className="text-xs text-stone-400 mt-1">Tap to call directly</p>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappLink('Hi, I would like to know more about Anandham plots.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-green-300 hover:shadow-lg transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">WhatsApp</h3>
              <p className="text-sm text-stone-600">{BUSINESS.phoneDisplay}</p>
              <p className="text-xs text-stone-400 mt-1">Chat instantly</p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${BUSINESS.email}`}
              className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-300 hover:shadow-lg transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-stone-700" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm mb-1">Email</h3>
              <p className="text-sm text-stone-600">{BUSINESS.email}</p>
              <p className="text-xs text-stone-400 mt-1">We reply within 24h</p>
            </a>
          </div>

          {/* Office info */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Info */}
              <div className="p-6 lg:p-8">
                <h2 className="text-lg font-bold text-stone-800 mb-4">Office Address</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">{BUSINESS.name}</div>
                      <div className="text-sm text-stone-500">{BUSINESS.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">Phone</div>
                      <a href={telLink()} className="text-sm text-stone-500 hover:text-emerald-700">{BUSINESS.phoneDisplay}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">Working Hours</div>
                      <div className="text-sm text-stone-500">Mon - Sat: 9:00 AM - 7:00 PM</div>
                      <div className="text-sm text-stone-500">Sunday: By appointment</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">RERA Registration</div>
                      {BUSINESS.reraNumbers.map(num => (
                        <div key={num} className="text-sm text-stone-500">{num}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onEnquire(null)}
                  className="mt-6 w-full px-5 py-3 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  Book a Site Visit
                </button>
              </div>

              {/* Map */}
              <div className="min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps?q=Chennai,Tamil+Nadu&z=10&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office location"
                />
              </div>
            </div>
          </div>

          {/* Proprietor */}
          <div className="mt-6 bg-stone-800 rounded-2xl p-6 text-center">
            <p className="text-stone-300 text-sm">
              <strong className="text-white">{BUSINESS.owner}</strong> — Proprietor, {BUSINESS.name}
            </p>
            <p className="text-stone-400 text-xs mt-1">
              "We don't just sell plots. We help families build their future."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
