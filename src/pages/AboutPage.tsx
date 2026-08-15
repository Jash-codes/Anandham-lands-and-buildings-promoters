import { Link } from 'react-router-dom';
import {
  ShieldCheck, Award, Users, Building2, TrendingUp, MapPin, Phone,
  MessageCircle, CheckCircle2, Target, Eye, Handshake,
} from 'lucide-react';
import { BUSINESS, whatsappLink, telLink } from '@/lib/constants';
import type { Project } from '@/lib/types';

interface AboutPageProps {
  onEnquire: (project?: Project | null) => void;
}

export default function AboutPage({ onEnquire }: AboutPageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[300px] lg:h-[400px]">
        <img
          src="https://images.pexels.com/photos/11597090/pexels-photo-11597090.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Anandham Lands"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 to-stone-900/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">About Anandham</h1>
            <p className="text-stone-200 text-sm lg:text-lg max-w-2xl">
              {BUSINESS.yearsExperience}+ years of building trust through transparent land development
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, value: `${BUSINESS.yearsExperience}+`, label: 'Years of Experience' },
              { icon: Building2, value: `${BUSINESS.completedProjects}+`, label: 'Completed Projects' },
              { icon: Users, value: `${BUSINESS.happyCustomers}+`, label: 'Happy Customers' },
              { icon: TrendingUp, value: '30%', label: 'Avg. Appreciation' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-stone-800">{s.value}</div>
                <div className="text-xs text-stone-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Our Story</div>
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800">Built on Trust and Transparency</h2>
          </div>
          <div className="prose prose-stone max-w-none text-sm lg:text-base text-stone-600 leading-relaxed space-y-4">
            <p>
              {BUSINESS.name} was founded by <strong className="text-stone-800">{BUSINESS.owner}</strong> with a
              simple mission: to make land ownership accessible, transparent, and stress-free for every family
              in Tamil Nadu. Over the past {BUSINESS.yearsExperience} years, we have delivered
              {BUSINESS.completedProjects}+ DTCP and RERA-approved plotted developments across Chennai,
              Kanchipuram, and Tiruvallur.
            </p>
            <p>
              What sets us apart is our unwavering commitment to clear titles, genuine approvals, and honest
              pricing. Every plot we sell comes with verified documentation, proper demarcation, and
              world-class amenities. We don't just sell plots — we build communities where families can
              build their dreams.
            </p>
            <p>
              Our customers have seen consistent appreciation in their investments, with an average 30%
              value increase within 2-3 years of purchase. This is because we carefully select locations
              near upcoming infrastructure — IT corridors, metro extensions, highways, and industrial hubs —
              ensuring long-term value for every investor.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To make genuine, approved land accessible to every family with complete transparency and zero hidden costs.' },
              { icon: Eye, title: 'Our Vision', desc: 'To be Tamil Nadu\'s most trusted plotted development company, known for quality, compliance, and customer-first approach.' },
              { icon: Handshake, title: 'Our Values', desc: 'Honesty, transparency, and long-term relationships. We treat every customer\'s investment as if it were our own.' },
            ].map((item, i) => (
              <div key={i} className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="font-bold text-stone-800 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-3">Why Families Trust Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'All projects are DTCP & RERA approved with clear titles',
              'No hidden charges — everything is transparent upfront',
              'Free site visit with pickup and drop facility',
              'Instant registration support and documentation help',
              'World-class amenities in every gated layout',
              'Strategic locations near IT corridors and highways',
              '850+ families have invested with us successfully',
              'Loan assistance available from leading banks',
              'Post-sale support for fencing and plot development',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-stone-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-stone-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-emerald-800 to-emerald-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to Start Your Land Ownership Journey?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            Talk to {BUSINESS.owner} directly. Get honest advice, clear answers, and the best plot for your budget.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onEnquire(null)}
              className="px-8 py-3.5 bg-white text-emerald-800 text-sm font-bold rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Book a Site Visit
            </button>
            <a
              href={whatsappLink('Hi, I would like to know more about Anandham plots.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <a
              href={telLink()}
              className="px-8 py-3.5 bg-emerald-700 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 border border-emerald-600"
            >
              <Phone className="w-5 h-5" /> Call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
