import { useState, useMemo, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Compass, Filter, X } from 'lucide-react';
import { formatPrice } from '@/lib/constants';
import type { Plot } from '@/lib/types';

interface PlotLayoutViewerProps {
  plots: Plot[];
  projectName: string;
}

const STATUS_COLORS: Record<string, { fill: string; stroke: string; label: string; dot: string }> = {
  available: { fill: '#34d399', stroke: '#059669', label: 'Available', dot: 'bg-emerald-500' },
  sold: { fill: '#fca5a5', stroke: '#dc2626', label: 'Sold', dot: 'bg-red-500' },
  hold: { fill: '#fcd34d', stroke: '#d97706', label: 'Hold', dot: 'bg-amber-500' },
};

const FACING_DIRECTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

export default function PlotLayoutViewer({ plots, projectName }: PlotLayoutViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterSize, setFilterSize] = useState<string>('all');
  const [filterFacing, setFilterFacing] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute SVG viewBox bounds
  const bounds = useMemo(() => {
    if (plots.length === 0) return { minX: 0, minY: 0, width: 800, height: 600 };
    let maxX = 0, maxY = 0;
    for (const p of plots) {
      const right = p.x + p.width;
      const bottom = p.y + p.height;
      if (right > maxX) maxX = right;
      if (bottom > maxY) maxY = bottom;
    }
    return { minX: 0, minY: 0, width: maxX + 20, height: maxY + 20 };
  }, [plots]);

  // Size buckets
  const sizeBuckets = useMemo(() => {
    const sizes = [...new Set(plots.map(p => p.size_sqft))].sort((a, b) => a - b);
    return sizes;
  }, [plots]);

  const filteredPlots = useMemo(() => {
    return plots.filter((p) => {
      if (filterSize !== 'all' && p.size_sqft !== parseInt(filterSize)) return false;
      if (filterFacing !== 'all' && p.facing_direction !== filterFacing) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      return true;
    });
  }, [plots, filterSize, filterFacing, filterStatus]);

  const stats = useMemo(() => {
    const available = plots.filter(p => p.status === 'available').length;
    const sold = plots.filter(p => p.status === 'sold').length;
    const hold = plots.filter(p => p.status === 'hold').length;
    return { available, sold, hold, total: plots.length };
  }, [plots]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.3, 5));
  const handleZoomOut = () => {
    setZoom(z => Math.max(z / 1.3, 0.5));
    if (zoom <= 0.6) setPan({ x: 0, y: 0 });
  };
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const clearFilters = () => {
    setFilterSize('all');
    setFilterFacing('all');
    setFilterStatus('all');
  };

  const activeFilterCount = (filterSize !== 'all' ? 1 : 0) + (filterFacing !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-stone-800">Master Plan Layout</h3>
          <div className="hidden sm:flex items-center gap-2 text-xs">
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${val.dot}`} />
                <span className="text-stone-600">{val.label}</span>
                <span className="text-stone-400">({key === 'available' ? stats.available : key === 'sold' ? stats.sold : stats.hold})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-400'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">{activeFilterCount}</span>
            )}
          </button>
          <div className="flex items-center gap-1">
            <button onClick={handleZoomOut} className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-lg transition-colors" aria-label="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleZoomIn} className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-lg transition-colors" aria-label="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleReset} className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-lg transition-colors" aria-label="Reset">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="px-4 py-3 border-b border-stone-100 bg-stone-50 space-y-3">
          <div className="flex flex-wrap gap-3">
            {/* Size filter */}
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">Plot Size</label>
              <select
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Sizes</option>
                {sizeBuckets.map(s => <option key={s} value={s}>{s} SqFT</option>)}
              </select>
            </div>
            {/* Facing filter */}
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">Facing Direction</label>
              <select
                value={filterFacing}
                onChange={(e) => setFilterFacing(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Directions</option>
                {FACING_DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Status filter */}
            <div>
              <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">Availability</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="hold">Hold</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="self-end text-xs text-red-600 hover:text-red-700 font-medium">
                Clear all
              </button>
            )}
          </div>
          <p className="text-xs text-stone-500">
            Showing {filteredPlots.length} of {plots.length} plots
          </p>
        </div>
      )}

      {/* SVG viewer */}
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-stone-100 select-none"
        style={{ height: '500px', cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <svg
            width={bounds.width}
            height={bounds.height}
            viewBox={`0 0 ${bounds.width} ${bounds.height}`}
            className="block"
          >
            {/* Background */}
            <rect width={bounds.width} height={bounds.height} fill="#f5f5f4" />

            {/* Road labels (horizontal roads at gaps) */}
            {(() => {
              const roadRows = new Set<number>();
              plots.forEach(p => roadRows.add(p.row));
              const sortedRows = [...roadRows].sort((a, b) => a - b);
              const gaps: number[] = [];
              for (let i = 1; i < sortedRows.length; i++) {
                if (sortedRows[i] - sortedRows[i - 1] > 1) {
                  gaps.push(sortedRows[i - 1]);
                }
              }
              return gaps.map((row, idx) => {
                const y = (row + 1) * (plots[0]?.height + 4 || 42);
                return (
                  <g key={`road-${idx}`}>
                    <rect
                      x={0} y={y - 2}
                      width={bounds.width}
                      height={6}
                      fill="#d6d3d1"
                    />
                    <text
                      x={bounds.width / 2}
                      y={y + 2}
                      textAnchor="middle"
                      fontSize={7}
                      fill="#a8a29e"
                      fontWeight="600"
                    >
                      INTERNAL ROAD
                    </text>
                  </g>
                );
              });
            })()}

            {/* Park/amenity area */}
            <g>
              <rect
                x={bounds.width - 120}
                y={bounds.height - 80}
                width={100}
                height={60}
                fill="#bbf7d0"
                stroke="#86efac"
                strokeWidth={1}
                rx={4}
              />
              <text
                x={bounds.width - 70}
                y={bounds.height - 45}
                textAnchor="middle"
                fontSize={8}
                fill="#15803d"
                fontWeight="700"
              >
                PARK
              </text>
            </g>

            {/* Entry gate */}
            <g>
              <rect
                x={0}
                y={0}
                width={30}
                height={50}
                fill="#fde68a"
                stroke="#f59e0b"
                strokeWidth={1.5}
                rx={3}
              />
              <text
                x={15}
                y={30}
                textAnchor="middle"
                fontSize={7}
                fill="#92400e"
                fontWeight="700"
              >
                ENTRY
              </text>
            </g>

            {/* Plots */}
            {plots.map((plot) => {
              const isFiltered = !filteredPlots.includes(plot);
              const colors = STATUS_COLORS[plot.status];
              return (
                <g
                  key={plot.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isFiltered) setSelectedPlot(plot);
                  }}
                  style={{ cursor: isFiltered ? 'not-allowed' : 'pointer' }}
                >
                  <rect
                    x={plot.x}
                    y={plot.y}
                    width={plot.width}
                    height={plot.height}
                    fill={isFiltered ? '#e7e5e4' : colors.fill}
                    stroke={isFiltered ? '#d6d3d1' : colors.stroke}
                    strokeWidth={selectedPlot?.id === plot.id ? 2.5 : 0.8}
                    rx={2}
                    opacity={isFiltered ? 0.35 : 1}
                    className="transition-all"
                  />
                  {zoom > 1.5 && !isFiltered && (
                    <text
                      x={plot.x + plot.width / 2}
                      y={plot.y + plot.height / 2 + 3}
                      textAnchor="middle"
                      fontSize={7}
                      fill="#1c1917"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {plot.plot_number}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Compass (top-right) */}
            <g transform={`translate(${bounds.width - 50}, 30)`}>
              <circle cx={0} cy={0} r={22} fill="white" stroke="#78716c" strokeWidth={1.5} opacity={0.95} />
              <polygon points="0,-16 5,2 0,-2 -5,2" fill="#dc2626" />
              <polygon points="0,16 5,-2 0,2 -5,-2" fill="#1c1917" />
              <text x={0} y={-24} textAnchor="middle" fontSize={9} fill="#1c1917" fontWeight="700">N</text>
              <text x={0} y={32} textAnchor="middle" fontSize={7} fill="#78716c" fontWeight="600">S</text>
              <text x={-26} y={3} textAnchor="middle" fontSize={7} fill="#78716c" fontWeight="600">W</text>
              <text x={26} y={3} textAnchor="middle" fontSize={7} fill="#78716c" fontWeight="600">E</text>
            </g>
          </svg>
        </div>

        {/* Mobile legend */}
        <div className="sm:hidden absolute bottom-2 left-2 flex items-center gap-2 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-lg shadow text-[10px]">
          {Object.entries(STATUS_COLORS).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${val.dot}`} />
              <span className="text-stone-600">{val.label}</span>
            </div>
          ))}
        </div>

        {/* Zoom indicator */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg shadow text-[10px] text-stone-600 font-medium">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Plot detail popup */}
      {selectedPlot && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedPlot(null)}>
          <div className="absolute inset-0 bg-stone-900/40" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPlot(null)}
              className="absolute top-3 right-3 p-1.5 text-stone-400 hover:bg-stone-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-stone-500">Plot No.</span>
              <span className="text-lg font-bold text-stone-800">{selectedPlot.plot_number}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                selectedPlot.status === 'available'
                  ? 'bg-emerald-100 text-emerald-700'
                  : selectedPlot.status === 'sold'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
              }`}>
                {STATUS_COLORS[selectedPlot.status].label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="text-[10px] text-stone-500 uppercase">Size</div>
                <div className="font-bold text-stone-800">{selectedPlot.size_sqft} SqFT</div>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="text-[10px] text-stone-500 uppercase">Facing</div>
                <div className="font-bold text-stone-800">{selectedPlot.facing_direction}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 col-span-2">
                <div className="text-[10px] text-stone-500 uppercase">Price</div>
                <div className="font-bold text-emerald-700 text-lg">{formatPrice(selectedPlot.price)}</div>
              </div>
            </div>
            {selectedPlot.status === 'available' && (
              <a
                href={`https://wa.me/919363528609?text=${encodeURIComponent(`Hi, I'm interested in Plot No. ${selectedPlot.plot_number} (${selectedPlot.size_sqft} SqFT, ${selectedPlot.facing_direction} facing) at ${projectName}. Price: ${formatPrice(selectedPlot.price)}. Is it available for site visit?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full px-4 py-3 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Enquire about this plot
              </a>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 text-xs text-stone-500 flex items-center gap-1.5">
        <Compass className="w-3.5 h-3.5" />
        Click any plot to see details. Drag to pan, use zoom controls to explore.
      </div>
    </div>
  );
}
