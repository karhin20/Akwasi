import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Calendar,
  Clock,
  Gauge,
  ChevronRight,
  HardHat,
  MapPin,
  Bed,
  Bath,
  Building
} from 'lucide-react';
import { ListingItem, ScreenType } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectListing: (listing: ListingItem) => void;
  listings: ListingItem[];
  onSearchWithParams: (keyword: string, location: string, category: string) => void;
}

type CategoryType = 'heavy_machinery' | 'cars_vehicles' | 'properties' | 'services';

const HERO_SLIDES = [
  '/excavator 1.jfif',
  '/car 2.jpg',
  '/house 2.webp',
  '/excavator 2.jfif',
  '/fumigation.jpg',
  '/excavator 3.jfif',
];

const CATEGORY_SLIDE_MAP: Record<CategoryType, number> = {
  heavy_machinery: 0,
  cars_vehicles: 1,
  properties: 2,
  services: 4,
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectListing,
  listings,
  onSearchWithParams
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('heavy_machinery');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Automatic slideshow transition every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleCategorySelect = (cat: CategoryType) => {
    setActiveCategory(cat);
    if (CATEGORY_SLIDE_MAP[cat] !== undefined) {
      setCurrentSlideIndex(CATEGORY_SLIDE_MAP[cat]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchWithParams(searchKeyword, searchLocation, activeCategory);
    if (activeCategory === 'cars_vehicles') {
      onNavigate('vehicles');
    } else if (activeCategory === 'heavy_machinery') {
      onNavigate('machinery');
    } else if (activeCategory === 'properties') {
      onNavigate('properties');
    } else {
      onNavigate('services');
    }
  };

  // Determine section display ordering based on selected activeCategory
  const getOrderedCategories = (selected: CategoryType): CategoryType[] => {
    switch (selected) {
      case 'heavy_machinery':
        return ['heavy_machinery', 'properties', 'services', 'cars_vehicles'];
      case 'cars_vehicles':
        return ['cars_vehicles', 'heavy_machinery', 'properties', 'services'];
      case 'properties':
        return ['properties', 'heavy_machinery', 'services', 'cars_vehicles'];
      case 'services':
        return ['services', 'heavy_machinery', 'properties', 'cars_vehicles'];
      default:
        return ['heavy_machinery', 'properties', 'services', 'cars_vehicles'];
    }
  };

  const orderedCategories = getOrderedCategories(activeCategory);

  // Filter curated listings for each category on the homepage
  const machineryListings = listings
    .filter(item => item.category === 'heavy_machinery' || item.bodyType === 'Heavy Equipment')
    .slice(0, 3);

  const vehicleListings = listings
    .filter(item => item.category === 'cars_vehicles' && item.bodyType !== 'Heavy Equipment')
    .slice(0, 3);

  const propertyListings = listings
    .filter(item => item.category === 'properties')
    .slice(0, 3);

  // Services data for homepage showcase
  const servicesList = [
    {
      id: 'fumigation-svc',
      title: 'Industrial Fumigation',
      description: 'Pre-construction soil treatment, warehouse pest eradication, and commercial grain silos management with compliance certification.',
      highlights: ['Pre-construction soil treatment', 'Warehouse pest management', 'EPA Ghana certified'],
      cta: 'Book Fumigation'
    },
    {
      id: 'prop-management-svc',
      title: 'Property Management',
      description: 'Comprehensive oversight for commercial plazas, industrial parks, and executive residential estates across Greater Accra and Ashanti regions.',
      highlights: ['Facility maintenance scheduling', 'Tenant vetting & lease management', '24/7 Security coordination'],
      cta: 'Request Management'
    }
  ];

  return (
    <div className="w-full flex flex-col flex-grow bg-white">
      {/* Hero Section with animated cross-fade background slideshow */}
      <section className="text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-12 relative overflow-hidden bg-slate-950">
        {/* Background Image Slides (Layered cross-fade) */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url('${slide}')`,
              transitionProperty: 'opacity, transform',
              transitionDuration: '1000ms',
            }}
          />
        ))}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-slate-950/90 z-0" />

        <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center relative z-10">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 max-w-4xl">
            Industrial Power. Prime<br />Real Estate. Unmatched<br />Deals.
          </h1>

          <p className="font-sans text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Ghana's premier marketplace for heavy machinery, commercial properties, commercial vehicles, and certified industrial services.
          </p>

          {/* Multi-category Search Card */}
          <div className="bg-white text-slate-900 rounded-xl p-4 sm:p-5 max-w-3xl w-full shadow-2xl border border-slate-200/50">
            {/* Category Tabs */}
            <div className="grid grid-cols-2 sm:flex sm:border-b border-slate-200 mb-4 gap-1.5 sm:gap-6 px-0.5 sm:px-1">
              <button
                type="button"
                id="hero-tab-machinery"
                onClick={() => handleCategorySelect('heavy_machinery')}
                className={`py-2 sm:py-0 sm:pb-2.5 font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center sm:text-left rounded-lg sm:rounded-none ${
                  activeCategory === 'heavy_machinery'
                    ? 'bg-orange-50 text-[#ea580c] sm:bg-transparent sm:text-slate-900 sm:border-b-2 sm:border-[#f97316]'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 sm:bg-transparent sm:text-slate-500 sm:hover:text-slate-900 sm:border-b-2 sm:border-transparent'
                }`}
              >
                Heavy Machinery
              </button>

              <button
                type="button"
                id="hero-tab-property"
                onClick={() => handleCategorySelect('properties')}
                className={`py-2 sm:py-0 sm:pb-2.5 font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center sm:text-left rounded-lg sm:rounded-none ${
                  activeCategory === 'properties'
                    ? 'bg-orange-50 text-[#ea580c] sm:bg-transparent sm:text-slate-900 sm:border-b-2 sm:border-[#f97316]'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 sm:bg-transparent sm:text-slate-500 sm:hover:text-slate-900 sm:border-b-2 sm:border-transparent'
                }`}
              >
                Properties
              </button>

              <button
                type="button"
                id="hero-tab-services"
                onClick={() => handleCategorySelect('services')}
                className={`py-2 sm:py-0 sm:pb-2.5 font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center sm:text-left rounded-lg sm:rounded-none ${
                  activeCategory === 'services'
                    ? 'bg-orange-50 text-[#ea580c] sm:bg-transparent sm:text-slate-900 sm:border-b-2 sm:border-[#f97316]'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 sm:bg-transparent sm:text-slate-500 sm:hover:text-slate-900 sm:border-b-2 sm:border-transparent'
                }`}
              >
                Services
              </button>

              <button
                type="button"
                id="hero-tab-vehicles"
                onClick={() => handleCategorySelect('cars_vehicles')}
                className={`py-2 sm:py-0 sm:pb-2.5 font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center sm:text-left rounded-lg sm:rounded-none ${
                  activeCategory === 'cars_vehicles'
                    ? 'bg-orange-50 text-[#ea580c] sm:bg-transparent sm:text-slate-900 sm:border-b-2 sm:border-[#f97316]'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 sm:bg-transparent sm:text-slate-500 sm:hover:text-slate-900 sm:border-b-2 sm:border-transparent'
                }`}
              >
                Cars &amp; Vehicles
              </button>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
              <div className="relative">
                <input
                  id="hero-search-keyword-input"
                  className="w-full border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 font-sans focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white placeholder:text-slate-400"
                  placeholder={
                    activeCategory === 'heavy_machinery'
                      ? 'Excavators, Bulldozers, Cranes, Cat, Komatsu...'
                      : activeCategory === 'properties'
                      ? 'Office, Warehouse, Apartment, Cantonments, East Legon...'
                      : activeCategory === 'services'
                      ? 'Fumigation, Facility Management, Logistics...'
                      : 'Hilux, Actros, Tipper, Dump Truck...'
                  }
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="relative">
                <input
                  id="hero-search-location-input"
                  className="w-full border border-slate-300 rounded-md px-3.5 py-2.5 text-sm text-slate-900 font-sans focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white placeholder:text-slate-400"
                  placeholder="Location (e.g. Tema, Accra, Takoradi, Kumasi)"
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              <button
                id="hero-search-btn"
                type="submit"
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-sans text-sm font-semibold px-6 py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* DYNAMICALLY ORDERED HOMEPAGE GROUPS */}
      <div className="flex flex-col">
        {orderedCategories.map((category) => {
          // 1. HEAVY MACHINERY SECTION
          if (category === 'heavy_machinery') {
            return (
              <section key="heavy_machinery" className="py-14 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[1280px] mx-auto w-full border-b border-slate-200/80">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Heavy Machinery &amp; Earthmoving
                    </h2>
                    <p className="font-sans text-sm text-slate-600 mt-1">
                      Industrial-grade hydraulic excavators, crawler bulldozers, wheel loaders &amp; articulated haulers.
                    </p>
                  </div>

                  <button
                    id="view-all-machinery-btn"
                    onClick={() => onNavigate('machinery')}
                    className="font-sans text-sm font-semibold text-[#f97316] hover:text-[#ea580c] flex items-center gap-1.5 cursor-pointer transition-colors group"
                  >
                    <span>View All Machinery</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 3 Heavy Machinery Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {machineryListings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="h-56 bg-slate-100 relative overflow-hidden">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={item.image}
                          alt={item.title}
                        />
                        {item.featured && (
                          <span className="absolute top-3 left-3 bg-[#f97316] text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-xs">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="font-heading text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                            {item.priceFormatted}
                          </p>

                          <div className="flex items-center gap-5 text-slate-600 font-sans text-xs mb-6">
                            {item.year && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>{item.year}</span>
                              </div>
                            )}
                            {item.hours ? (
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span>{item.hours.toLocaleString()} hrs</span>
                              </div>
                            ) : item.weight ? (
                              <div className="flex items-center gap-1.5">
                                <HardHat className="w-3.5 h-3.5 text-slate-500" />
                                <span>{item.weight}</span>
                              </div>
                            ) : null}
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
                  ))}
                </div>
              </section>
            );
          }

          // 2. PROPERTIES SECTION
          if (category === 'properties') {
            return (
              <section key="properties" className="py-14 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[1280px] mx-auto w-full border-b border-slate-200/80 bg-[#f8f9fb]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Commercial &amp; Luxury Properties
                    </h2>
                    <p className="font-sans text-sm text-slate-600 mt-1">
                      Prime office towers, modern residential villas, luxury suites &amp; industrial warehouses in Ghana.
                    </p>
                  </div>

                  <button
                    id="view-all-properties-btn"
                    onClick={() => onNavigate('properties')}
                    className="font-sans text-sm font-semibold text-[#f97316] hover:text-[#ea580c] flex items-center gap-1.5 cursor-pointer transition-colors group"
                  >
                    <span>View All Properties</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 3 Property Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {propertyListings.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="h-56 bg-slate-100 relative overflow-hidden">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={prop.image}
                          alt={prop.title}
                        />
                        <span className="absolute top-3 left-3 bg-[#f97316] text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-xs">
                          {prop.transactionType || 'For Sale'}
                        </span>
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-400" />
                          <span>{prop.location}</span>
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
                            {prop.title}
                          </h3>
                          <p className="font-heading text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                            {prop.priceFormatted}
                            {prop.pricePeriod && (
                              <span className="text-xs font-normal text-slate-500"> {prop.pricePeriod}</span>
                            )}
                          </p>

                          <div className="flex items-center gap-4 text-slate-600 font-sans text-xs mb-3">
                            {prop.beds !== undefined && (
                              <div className="flex items-center gap-1">
                                <Bed className="w-3.5 h-3.5 text-slate-400" />
                                <span>{prop.beds} Beds</span>
                              </div>
                            )}
                            {(prop.showers !== undefined || prop.baths !== undefined) && (
                              <div className="flex items-center gap-1">
                                <Bath className="w-3.5 h-3.5 text-slate-400" />
                                <span>{Math.round(prop.showers ?? prop.baths ?? 0)} Showers</span>
                              </div>
                            )}
                            {prop.sqm && (
                              <div className="flex items-center gap-1">
                                <Building className="w-3.5 h-3.5 text-slate-400" />
                                <span>{prop.sqm} sqm</span>
                              </div>
                            )}
                          </div>

                          <p className="font-sans text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                            {prop.description}
                          </p>
                        </div>

                        <button
                          onClick={() => onSelectListing(prop)}
                          className="w-full bg-transparent hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-900 font-sans text-sm font-semibold py-2.5 rounded-full transition-all cursor-pointer text-center"
                        >
                          View Property Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // 3. SERVICES SECTION
          if (category === 'services') {
            return (
              <section key="services" className="py-14 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[1280px] mx-auto w-full border-b border-slate-200/80 bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Industrial Fumigation &amp; Facility Management
                    </h2>
                    <p className="font-sans text-sm text-slate-600 mt-1">
                      Dependable maintenance, pest eradication, and logistics solutions for high-value assets in Ghana.
                    </p>
                  </div>

                  <button
                    id="view-all-services-btn"
                    onClick={() => onNavigate('services')}
                    className="font-sans text-sm font-semibold text-[#f97316] hover:text-[#ea580c] flex items-center gap-1.5 cursor-pointer transition-colors group"
                  >
                    <span>Request Full Services Quote</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 2 Service Bento Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {servicesList.map((svc) => (
                    <div
                      key={svc.id}
                      className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                          {svc.title}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                          {svc.description}
                        </p>

                        <div className="space-y-2 mb-6 border-t border-slate-100 pt-3">
                          {svc.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                              <ChevronRight className="w-3.5 h-3.5 text-[#f97316] shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('services')}
                        className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-sans text-sm font-semibold py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{svc.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // 4. CARS & VEHICLES SECTION
          if (category === 'cars_vehicles') {
            return (
              <section key="cars_vehicles" className="py-14 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[1280px] mx-auto w-full border-b border-slate-200/80 bg-slate-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Commercial Fleet &amp; 4x4 Pickups
                    </h2>
                    <p className="font-sans text-sm text-slate-600 mt-1">
                      Work-ready double cabin pickups, heavy tractor heads, tippers and logistics haulers across Ghana.
                    </p>
                  </div>

                  <button
                    id="view-all-vehicles-btn"
                    onClick={() => onNavigate('vehicles')}
                    className="font-sans text-sm font-semibold text-[#f97316] hover:text-[#ea580c] flex items-center gap-1.5 cursor-pointer transition-colors group"
                  >
                    <span>Explore All Vehicles</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* 3 Vehicle Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {vehicleListings.map((veh) => (
                    <div
                      key={veh.id}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="h-56 bg-slate-100 relative overflow-hidden">
                        <img
                          src={veh.image}
                          alt={veh.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {veh.featured && (
                          <span className="absolute top-3 left-3 bg-[#f97316] text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-xs">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
                            {veh.title}
                          </h3>
                          <p className="font-heading text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                            {veh.priceFormatted}
                          </p>

                          <div className="flex items-center gap-5 text-slate-600 font-sans text-xs mb-6">
                            {veh.year && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>{veh.year}</span>
                              </div>
                            )}
                            {veh.mileage && (
                              <div className="flex items-center gap-1.5">
                                <Gauge className="w-3.5 h-3.5 text-slate-500" />
                                <span>{veh.mileage}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectListing(veh)}
                          className="w-full bg-transparent hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-900 font-sans text-sm font-semibold py-2.5 rounded-full transition-all cursor-pointer text-center"
                        >
                          View Vehicle Specs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <section className="py-14 bg-white px-4 sm:px-8 lg:px-12 border-t border-slate-100">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-heading font-bold text-base text-slate-900 mb-1">
              Verified Technical Inspection
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              All listed heavy equipment, properties, and vehicles are vetted by certified engineers and legal officers prior to listing.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-base text-slate-900 mb-1">
              Verified Physical Inspection
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Physical site inspection scheduling and thorough document verification prior to handover.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-base text-slate-900 mb-1">
              Nationwide Logistics &amp; Lowbeds
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct lowbed transportation from Tema and Takoradi ports to mining zones in Tarkwa, Obuasi, and Ahafo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
