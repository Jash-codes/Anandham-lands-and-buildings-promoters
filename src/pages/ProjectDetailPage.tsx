import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Maximize, Layers, Building2, ShieldCheck, Award, Phone, MessageCircle,
  CheckCircle2, Clock, Navigation, ExternalLink, ArrowLeft, Camera, ChevronRight,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BUSINESS, whatsappLink, telLink, formatPrice } from '@/lib/constants';
import PlotLayoutViewer from '@/components/PlotLayoutViewer';
import type { Project, Plot, Amenity, Landmark, GalleryImage } from '@/lib/types';

interface ProjectDetailPageProps {
  onEnquire: (project?: Project | null) => void;
}

export default function ProjectDetailPage({ onEnquire }: ProjectDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data: proj } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!proj) {
        setLoading(false);
        return;
      }

      setProject(proj);

      const [plotsRes, amenitiesRes, landmarksRes, galleryRes] = await Promise.all([
        supabase.from('plots').select('*').eq('project_id', proj.id).order('plot_number'),
        supabase.from('amenities').select('*').eq('project_id', proj.id),
        supabase.from('landmarks').select('*').eq('project_id', proj.id).order('drive_time_mins'),
        supabase.from('gallery_images').select('*').eq('project_id', proj.id),
      ]);

      setPlots(plotsRes.data || []);
      setAmenities(amenitiesRes.data || []);
      setLandmarks(landmarksRes.data || []);
      setGallery(galleryRes.data || []);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-stone-600">Project not found.</p>
        <Link to="/projects" className="text-emerald-700 font-semibold">View All Projects</Link>
      </div>
    );
  }

  const waMessage = `Hi, I'm interested in ${project.name} at ${project.location}. Please share plot availability and pricing details.`;
  const mapUrl = project.latitude && project.longitude
    ? `https://www.google.com/maps?q=${project.latitude},${project.longitude}&z=14&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(project.location)}&z=14&output=embed`;
  const directionsUrl = project.latitude && project.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${project.latitude},${project.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(project.location)}`;

  const stats = {
    available: plots.filter(p => p.status === 'available').length,
    sold: plots.filter(p => p.status === 'sold').length,
    hold: plots.filter(p => p.status === 'hold').length,
  };

  return (
    <div>
      {/* HERO BANNER */}
      <section className="relative h-[400px] lg:h-[500px]">
        <img
          src={project.hero_image || ''}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/80" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12 w-full">
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-stone-200 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                project.possession_status === 'Ready to Register'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                {project.possession_status}
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-white/20 backdrop-blur text-white border border-white/30">
                DTCP Approved
              </span>
              {project.rera_number && (
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-white/20 backdrop-blur text-white border border-white/30">
                  RERA: {project.rera_number}
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">{project.name}</h1>
            <div className="flex items-center gap-1.5 text-stone-200 text-sm">
              <MapPin className="w-4 h-4" />
              {project.location}, {project.city}
            </div>
          </div>
        </div>
      </section>

      {/* KEY STATS BAR */}
      <section className="bg-white border-b border-stone-200 sticky top-16 lg:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-px">
            <div className="py-4 text-center">
              <div className="text-[10px] text-stone-500 uppercase tracking-wide mb-1">Total Acres</div>
              <div className="text-lg font-bold text-stone-800">{project.total_acres} Acres</div>
            </div>
            <div className="py-4 text-center lg:border-l border-stone-100">
              <div className="text-[10px] text-stone-500 uppercase tracking-wide mb-1">Phase Acres</div>
              <div className="text-lg font-bold text-stone-800">{project.phase_acres} Acres</div>
            </div>
            <div className="py-4 text-center lg:border-l border-stone-100">
              <div className="text-[10px] text-stone-500 uppercase tracking-wide mb-1">Total Plots</div>
              <div className="text-lg font-bold text-stone-800">{project.plot_count}</div>
            </div>
            <div className="py-4 text-center lg:border-l border-stone-100">
              <div className="text-[10px] text-stone-500 uppercase tracking-wide mb-1">Plot Size</div>
              <div className="text-lg font-bold text-stone-800">{project.plot_size_min}–{project.plot_size_max} SqFT</div>
            </div>
            <div className="py-4 text-center lg:border-l border-stone-100">
              <div className="text-[10px] text-stone-500 uppercase tracking-wide mb-1">Starting Price</div>
              <div className="text-lg font-bold text-emerald-700">{formatPrice(project.starting_price)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12 lg:space-y-16">

        {/* DESCRIPTION + CTA */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl lg:text-2xl font-bold text-stone-800 mb-4">About {project.name}</h2>
            <p className="text-sm lg:text-base text-stone-600 leading-relaxed">{project.description}</p>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-emerald-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-700">{stats.available}</div>
                <div className="text-xs text-stone-500">Available</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.sold}</div>
                <div className="text-xs text-stone-500">Sold</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-600">{stats.hold}</div>
                <div className="text-xs text-stone-500">Hold</div>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className="bg-stone-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Interested in this project?</h3>
              <p className="text-stone-300 text-sm mb-4">Book a free site visit or chat with us on WhatsApp for instant details.</p>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => onEnquire(project)}
                className="w-full px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-500 transition-colors"
              >
                Book a Site Visit
              </button>
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Enquiry
              </a>
              <a
                href={telLink()}
                className="w-full px-4 py-3 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* MASTER PLAN / PLOT LAYOUT */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl lg:text-2xl font-bold text-stone-800">2D Master Plan & Plot Layout</h2>
          </div>
          <p className="text-sm text-stone-500 mb-4">
            Interactive top-view layout showing individual plots, roads, park, and entry gate.
            Click on any plot to see its details, size, facing, and availability.
          </p>
          <PlotLayoutViewer plots={plots} projectName={project.name} />
        </section>

        {/* AMENITIES */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl lg:text-2xl font-bold text-stone-800">Amenities & Features</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities.map((a) => {
              const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[a.icon_name] || LucideIcons.CheckCircle2;
              return (
                <div key={a.id} className="bg-white rounded-xl p-4 border border-stone-100 hover:border-emerald-200 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-semibold text-stone-800 text-sm mb-1">{a.title}</h3>
                  {a.description && <p className="text-xs text-stone-500 leading-relaxed">{a.description}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* PROXIMITY CHART */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Navigation className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl lg:text-2xl font-bold text-stone-800">Proximity to Key Landmarks</h2>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="divide-y divide-stone-100">
              {landmarks.map((l) => (
                <div key={l.id} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-stone-600 uppercase">{l.category.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">{l.name}</div>
                      <div className="text-xs text-stone-500">{l.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-sm font-bold text-stone-800">{l.distance_km} km</div>
                      <div className="text-[10px] text-stone-500">distance</div>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-stone-200" />
                    <div className="hidden sm:block">
                      <div className="text-sm font-bold text-emerald-700">{l.drive_time_mins} min</div>
                      <div className="text-[10px] text-stone-500">drive time</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        {gallery.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Camera className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl lg:text-2xl font-bold text-stone-800">Photo Gallery</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setLightboxImage(img.image_url)}
                  className={`group relative overflow-hidden rounded-xl border border-stone-200 hover:shadow-lg transition-all ${
                    idx === 0 ? 'col-span-2 lg:col-span-2 row-span-2 h-48 lg:h-80' : 'h-32 lg:h-40'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || ''}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-xs font-medium">{img.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* LOCATION MAP */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl lg:text-2xl font-bold text-stone-800">Location Map</h2>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="aspect-[16/9] w-full">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${project.name} location map`}
              />
            </div>
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50">
              <div className="text-sm text-stone-600">
                <strong className="text-stone-800">{project.name}</strong> — {project.location}, {project.city}
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
              >
                <Navigation className="w-4 h-4" /> Get Directions
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* APPROVALS */}
        <section className="bg-gradient-to-br from-emerald-50 to-stone-50 rounded-2xl p-6 lg:p-8 border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-stone-800">Approvals & Compliance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-stone-800 text-sm">DTCP Approval</div>
                <div className="text-xs text-stone-500">{project.dtcp_number || 'Approved'}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-stone-800 text-sm">RERA Registration</div>
                <div className="text-xs text-stone-500">{project.rera_number || 'Registered'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-stone-800 rounded-2xl p-6 lg:p-8 text-center">
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
            Book Your Site Visit for {project.name}
          </h3>
          <p className="text-stone-300 text-sm mb-6 max-w-xl mx-auto">
            See the layout, walk the plots, and experience the location firsthand.
            Our team will guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onEnquire(project)}
              className="px-6 py-3 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-500 transition-colors"
            >
              Book a Free Site Visit
            </button>
            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-stone-900/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button className="absolute top-4 right-4 p-2 text-white/80 hover:text-white" onClick={() => setLightboxImage(null)}>
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <img src={lightboxImage} alt="" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
