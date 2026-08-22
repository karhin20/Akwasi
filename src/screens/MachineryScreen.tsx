import React, { useState } from 'react';
import { ListingItem } from '../types';
import { Calendar, Clock, ShieldCheck, Search } from 'lucide-react';

interface MachineryScreenProps {
  listings: ListingItem[];
  onSelectListing: (listing: ListingItem) => void;
}

export const MachineryScreen: React.FC<MachineryScreenProps> = ({
  listings,
  onSelectListing
}) => {
  const [equipmentType, setEquipmentType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const machineryListings = listings.filter((item) => {
    if (item.category !== 'heavy_machinery' && item.bodyType !== 'Commercial Truck') {
      return false;
    }
    if (equipmentType === 'excavators' && !item.title.toLowerCase().includes('excavator')) {
      return false;
    }
    if (equipmentType === 'bulldozers' && !item.title.toLowerCase().includes('d61') && !item.title.toLowerCase().includes('d65') && !item.title.toLowerCase().includes('bulldozer')) {
      return false;
    }
    if (equipmentType === 'trucks' && !item.title.toLowerCase().includes('truck') && !item.title.toLowerCase().includes('actros') && !item.title.toLowerCase().includes('a30g')) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 flex-grow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Heavy Machinery & Industrial Equipment
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-500 mt-1">
            Excavators, bulldozers, wheel loaders, and articulated dumpers ready for immediate deployment in Ghana.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search equipment or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-900 focus:border-[#f97316] outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* Equipment Category Pills */}
      <div className="flex flex-wrap gap-2 my-6">
        {[
          { id: 'all', label: 'All Equipment' },
          { id: 'excavators', label: 'Hydraulic Excavators' },
          { id: 'bulldozers', label: 'Crawler Bulldozers' },
          { id: 'trucks', label: 'Articulated & Tipper Trucks' }
        ].map((pill) => (
          <button
            key={pill.id}
            onClick={() => setEquipmentType(pill.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              equipmentType === pill.id
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Machinery Grid */}
      <div className="bento-grid">
        {machineryListings.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col group"
            >
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.featured && (
                  <span className="absolute top-3 left-3 bg-[#f97316] text-white font-sans text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    Featured
                  </span>
                )}
                {item.recentlyReduced && (
                  <span className="absolute top-3 left-3 bg-amber-600 text-white font-sans text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    Price Reduced
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="font-heading text-2xl font-bold text-slate-900 mb-2">
                    {item.priceFormatted}
                  </p>
                  <p className="font-sans text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {item.hours && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.hours.toLocaleString()} hrs</span>
                      </div>
                    )}
                    {item.year && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.year} Model</span>
                      </div>
                    )}
                    {item.tonnage && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.tonnage}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-emerald-700 font-sans text-xs font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                      <span>✓ Ready at Site</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectListing(item)}
                  className="w-full bg-transparent hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-900 font-sans text-sm font-semibold py-2.5 rounded-full transition-all cursor-pointer text-center"
                >
                  View Details &amp; Specs
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
