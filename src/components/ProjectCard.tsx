import { Link } from 'react-router-dom';
import { MapPin, Maximize, Layers, MessageCircle, ArrowRight } from 'lucide-react';
import { formatPrice, whatsappLink } from '@/lib/constants';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  onEnquire: (project: Project) => void;
}

export default function ProjectCard({ project, onEnquire }: ProjectCardProps) {
  const waMessage = `Hi, I'm interested in ${project.name} at ${project.location}. Please share plot availability and pricing details.`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.hero_image || ''}
          alt={project.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 text-white text-xs mb-1">
            <MapPin className="w-3.5 h-3.5" />
            {project.location}
          </div>
          <h3 className="text-white font-bold text-lg leading-tight">{project.name}</h3>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
            project.possession_status === 'Ready to Register'
              ? 'bg-emerald-500 text-white'
              : 'bg-amber-500 text-white'
          }`}>
            {project.possession_status}
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-px bg-stone-100">
        <div className="bg-white px-3 py-2.5 text-center">
          <div className="text-[10px] text-stone-500 uppercase tracking-wide">Acres</div>
          <div className="text-sm font-bold text-stone-800">{project.phase_acres}</div>
        </div>
        <div className="bg-white px-3 py-2.5 text-center">
          <div className="text-[10px] text-stone-500 uppercase tracking-wide">Plots</div>
          <div className="text-sm font-bold text-stone-800">{project.plot_count}</div>
        </div>
        <div className="bg-white px-3 py-2.5 text-center">
          <div className="text-[10px] text-stone-500 uppercase tracking-wide">SqFT</div>
          <div className="text-sm font-bold text-stone-800">{project.plot_size_min}–{project.plot_size_max}</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-stone-500 uppercase tracking-wide">Starting Price</div>
            <div className="text-lg font-bold text-emerald-700">{formatPrice(project.starting_price)}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <Layers className="w-3.5 h-3.5" />
            {project.city}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/project/${project.slug}`}
            className="flex-1 px-3 py-2.5 bg-stone-800 text-white text-xs font-semibold rounded-lg hover:bg-stone-900 transition-colors flex items-center justify-center gap-1.5"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={() => onEnquire(project)}
            className="px-3 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
}
