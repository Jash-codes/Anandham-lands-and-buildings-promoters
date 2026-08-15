import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Maximize, Wallet, ArrowRight, ShieldCheck, Award,
  Users, Building2, TrendingUp, Quote, Star, MessageCircle, Phone, CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BUSINESS, whatsappLink, telLink, formatPrice } from '@/lib/constants';
import ProjectCard from '@/components/ProjectCard';
import type { Project, Testimonial } from '@/lib/types';

interface HomePageProps {
  onEnquire: (project?: Project | null) => void;
}

export default function HomePage({ onEnquire }: HomePageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchSize, setSearchSize] = useState('');
  const [searchBudget, setSearchBudget] = useState('');

  useEffect(() => {
    (async () => {
      const [{ data: projData }, { data: testData }] = await Promise.all([
        supabase.from('projects').select('*').order('featured', { ascending: false }),
        supabase.from('testimonials').select('*').limit(6),
      ]);
      setProjects(projData || []);
      setTestimonials(testData || []);
      setLoading(false);
    })();
  }, []);

  const cities = [...new Set(projects.map(p => p.city))];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchSize) params.set('size', searchSize);
    if (searchBudget) params.set('budget', searchBudget);
    window.location.href = `/projects?${params.toString()}`;
  };

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/11201060/pexels-photo-11201060.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Aerial view of residential plot development"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900/80 via-stone-900/60 to-emerald-900/50" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-3xl">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur border border-emerald-400/30 rounded-full mb-5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-semibold text-emerald-100">DTCP & RERA Approved Layouts</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Your Dream Plot Awaits at{' '}
              <span className="text-emerald-400">Anandham</span>
            </h1>
            <p className="text-base lg:text-lg text-stone-200 mb-8 max-w-2xl leading-relaxed">
              Premium DTCP & RERA-approved residential plots in gated communities across Tamil Nadu.
              Transparent deals, clear titles, and instant registration.
            </p>

            {/* Search/Filter bar */}
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4 lg:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <select
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">All Cities</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Plot Size</label>
                  <div className="relative">
                    <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <select
                      value={searchSize}
                      onChange={(e) => setSearchSize(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">Any Size</option>
                      <option value="600">600+ SqFT</option>
                      <option value="900">900+ SqFT</option>
                      <option value="1200">1200+ SqFT</option>
                      <option value="1500">1500+ SqFT</option>
                      <option value="2400">2400+ SqFT</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Budget</label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <select
                      value={searchBudget}
                      onChange={(e) => setSearchBudget(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">Any Budget</option>
                      <option value="10">Under ₹10L</option>
                      <option value="15">Under ₹15L</option>
                      <option value="20">Under ₹20L</option>
                      <option value="50">₹20L+</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-2 text-white">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm"><strong>{BUSINESS.completedProjects}+</strong> Projects</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-emerald-400" />
                <span className="text-sm"><strong>{BUSINESS.happyCustomers}+</strong> Happy Customers</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-sm"><strong>{BUSINESS.yearsExperience}+</strong> Years of Trust</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Featured Layouts</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-stone-800">Our Premium Projects</h2>
            </div>
            <Link to="/projects" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-stone-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-4 bg-stone-200 rounded w-1/2" />
                    <div className="h-8 bg-stone-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map(project => (
                <ProjectCard key={project.id} project={project} onEnquire={onEnquire} />
              ))}
            </div>
          )}

          <div className="sm:hidden mt-6">
            <Link to="/projects" className="flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-700">
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Why Choose Us</div>
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-3">Trusted by {BUSINESS.happyCustomers}+ Families</h2>
            <p className="text-sm text-stone-500 max-w-2xl mx-auto">
              {BUSINESS.yearsExperience}+ years of delivering genuine, approved plots with transparent documentation
              and unmatched customer support.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { icon: ShieldCheck, title: 'RERA Compliant', desc: 'All projects are RERA registered with clear titles and legal verification.' },
              { icon: Award, title: 'Award Winning', desc: 'Recognized for excellence in plotted development across Tamil Nadu.' },
              { icon: Users, title: '850+ Families', desc: 'Over 850 happy families have invested with us and seen great appreciation.' },
              { icon: TrendingUp, title: 'High Returns', desc: 'Strategic locations near IT corridors and highways ensure strong appreciation.' },
            ].map((item, i) => (
              <div key={i} className="bg-stone-50 rounded-2xl p-5 lg:p-6 border border-stone-100 hover:border-emerald-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="font-bold text-stone-800 text-sm lg:text-base mb-2">{item.title}</h3>
                <p className="text-xs lg:text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE BY LOCATION */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Locations</div>
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800">Explore by Location</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cities.map(city => {
              const cityProjects = projects.filter(p => p.city === city);
              const totalPlots = cityProjects.reduce((sum, p) => sum + p.plot_count, 0);
              return (
                <Link
                  key={city}
                  to={`/projects?city=${encodeURIComponent(city)}`}
                  className="group relative h-40 rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all"
                >
                  <img
                    src={cityProjects[0]?.hero_image || ''}
                    alt={city}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-base lg:text-lg">{city}</h3>
                    <p className="text-stone-200 text-xs">{cityProjects.length} Projects · {totalPlots} Plots</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Testimonials</div>
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-3">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-sm font-semibold text-stone-700 ml-1">4.8/5 from 200+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <Quote className="w-8 h-8 text-emerald-200 mb-3" />
                <p className="text-sm text-stone-600 leading-relaxed mb-5 line-clamp-4">{t.text}</p>
                <div className="flex items-center gap-3">
                  {t.photo_url && (
                    <img
                      src={t.photo_url}
                      alt={t.name}
                      loading="lazy"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-bold text-stone-800 text-sm">{t.name}</div>
                    <div className="text-xs text-stone-500">{t.location}</div>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-emerald-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.pexels.com/photos/2516858/pexels-photo-2516858.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
            Ready to Visit Your Future Plot?
          </h2>
          <p className="text-emerald-100 mb-8 text-base lg:text-lg max-w-2xl mx-auto">
            Book a free site visit today. No obligation, no pressure — just honest guidance
            from our team to help you make the right investment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onEnquire(null)}
              className="px-8 py-3.5 bg-white text-emerald-800 text-sm font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Book a Free Site Visit
            </button>
            <a
              href={whatsappLink(`Hi, I would like to book a site visit. Please share available slots.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a
              href={telLink()}
              className="px-8 py-3.5 bg-emerald-700 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 border border-emerald-600"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-emerald-100 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> No login required
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Free site visit
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Instant confirmation
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
