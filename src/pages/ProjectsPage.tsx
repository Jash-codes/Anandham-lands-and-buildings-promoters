import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Maximize, Wallet, Filter, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/lib/types';

interface ProjectsPageProps {
  onEnquire: (project?: Project | null) => void;
}

export default function ProjectsPage({ onEnquire }: ProjectsPageProps) {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState(searchParams.get('city') || '');
  const [filterSize, setFilterSize] = useState(searchParams.get('size') || '');
  const [filterBudget, setFilterBudget] = useState(searchParams.get('budget') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('projects').select('*').order('featured', { ascending: false });
      setProjects(data || []);
      setLoading(false);
    })();
  }, []);

  const cities = [...new Set(projects.map(p => p.city))];

  const filteredProjects = projects.filter((p) => {
    if (filterCity && p.city !== filterCity) return false;
    if (filterSize && p.plot_size_max < parseInt(filterSize)) return false;
    if (filterBudget) {
      const budgetVal = parseInt(filterBudget);
      if (budgetVal <= 20 && p.starting_price > budgetVal * 100000) return false;
      if (budgetVal > 20 && p.starting_price < 2000000) return false;
    }
    return true;
  });

  const activeFilterCount = (filterCity ? 1 : 0) + (filterSize ? 1 : 0) + (filterBudget ? 1 : 0);

  const clearFilters = () => {
    setFilterCity('');
    setFilterSize('');
    setFilterBudget('');
  };

  return (
    <div>
      {/* Page header */}
      <section className="bg-gradient-to-br from-stone-800 to-emerald-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-3">All Projects</h1>
          <p className="text-stone-300 text-sm lg:text-base max-w-2xl">
            Explore our DTCP & RERA-approved residential plot layouts across Tamil Nadu.
            Filter by location, plot size, or budget to find your perfect investment.
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-8 lg:py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-500" />
                <span className="text-sm font-semibold text-stone-700">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">All Cities</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Min Plot Size</label>
                <div className="relative">
                  <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <select
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
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
                    value={filterBudget}
                    onChange={(e) => setFilterBudget(e.target.value)}
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
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-stone-500 mb-4">
            Showing <strong className="text-stone-700">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-500 mb-4">No projects match your filters.</p>
              <button onClick={clearFilters} className="text-emerald-700 font-semibold text-sm">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} onEnquire={onEnquire} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
