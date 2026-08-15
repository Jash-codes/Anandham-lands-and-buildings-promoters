import { Phone, MessageCircle } from 'lucide-react';
import { telLink, whatsappLink, BUSINESS } from '@/lib/constants';

interface FloatingCTAProps {
  onEnquire: () => void;
}

export default function FloatingCTA({ onEnquire }: FloatingCTAProps) {
  return (
    <>
      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg">
        <div className="grid grid-cols-3 gap-px">
          <a
            href={telLink()}
            className="flex flex-col items-center justify-center py-3 text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <Phone className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-medium">Call</span>
          </a>
          <a
            href={whatsappLink(`Hi, I'm interested in ${BUSINESS.name} plots. Please share details.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-medium">WhatsApp</span>
          </a>
          <button
            onClick={onEnquire}
            className="flex flex-col items-center justify-center py-3 bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
          >
            <span className="text-sm font-semibold">Book Visit</span>
          </button>
        </div>
      </div>

      {/* Desktop floating WhatsApp */}
      <a
        href={whatsappLink(`Hi, I'm interested in ${BUSINESS.name} plots. Please share details.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full items-center justify-center shadow-xl transition-all hover:scale-110"
        aria-label="WhatsApp Chat"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      </a>
    </>
  );
}
