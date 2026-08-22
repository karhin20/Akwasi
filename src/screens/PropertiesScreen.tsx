import React, { useState } from 'react';
import { ListingItem } from '../types';
import { Building, MapPin, Bed, Bath, SquareCheck, Search } from 'lucide-react';

interface PropertiesScreenProps {
  listings: ListingItem[];
  onSelectListing: (listing: ListingItem) => void;
}

export const PropertiesScreen: React.FC<PropertiesScreenProps> = ({
  listings,
  onSelectListing
}) => {
  const [propertyType, setPropertyType] = useState<string>('all');
  const [transactionType, setTransactionType] = useState<string>('all');

  const propertyListings = listings.filter((item) => {
    if (item.category !== 'properties') return false;
    if (propertyType === 'apartment' && item.propertyType !== 'Apartment') return false;
    if (propertyType === 'commercial' && item.propertyType !== 'Commercial') return false;
    if (propertyType === 'villa' && item.propertyType !== 'House / Villa') return false;
    if (transactionType === 'sale' && item.transactionType !== 'For Sale') return false;
    if (transactionType === 'rent' && item.transactionType !== 'For Rent') return false;
    return true;
  });

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 flex-grow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Commercial & Prime Real Estate
          </h1>
          <p className="font-sans text-xs sm:text-sm text-slate-500 mt-1">
            Luxury apartments, commercial office blocks, and executive villas in Cantonments, East Legon, and Airport Residential.
          </p>
        </div>

        {/* Transaction Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setTransactionType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              transactionType === 'all'
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTransactionType('sale')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              transactionType === 'sale'
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => setTransactionType('rent')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              transactionType === 'rent'
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            For Rent
          </button>
        </div>
      </div>

      {/* Property Pills */}
      <div className="flex flex-wrap gap-2 my-6">
        {[
          { id: 'all', label: 'All Properties' },
          { id: 'apartment', label: 'Luxury Apartments' },
          { id: 'commercial', label: 'Commercial Offices & Retail' },
          { id: 'villa', label: 'Executive Houses & Villas' }
        ].map((pill) => (
          <button
            key={pill.id}
            onClick={() => setPropertyType(pill.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              propertyType === pill.id
                ? 'bg-[#f97316] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Properties Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyListings.map((item) => {
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
                <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white font-sans text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {item.transactionType || 'Commercial'}
                </span>

                <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-400" />
                  <span>{item.location}</span>
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="font-heading text-2xl font-bold text-slate-900 mb-2">
                    {item.priceFormatted}
                    {item.pricePeriod && (
                      <span className="text-xs font-normal text-slate-500">
                        {' '}
                        {item.pricePeriod}
                      </span>
                    )}
                  </p>
                  <p className="font-sans text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {item.beds !== undefined && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.beds} Bedrooms</span>
                      </div>
                    )}
                    {(item.showers !== undefined || item.baths !== undefined) && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>{Math.round(item.showers ?? item.baths ?? 0)} Showers</span>
                      </div>
                    )}
                    {item.sqm && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.sqm} sqm Area</span>
                      </div>
                    )}
                    {item.floors && (
                      <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <SquareCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.floors} Floors</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onSelectListing(item)}
                  className="w-full bg-slate-900 hover:bg-[#f97316] text-white font-sans text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  View Property Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
