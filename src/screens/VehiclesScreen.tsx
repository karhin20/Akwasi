import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Gauge,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { ListingItem, FilterState } from '../types';
import { MAKES } from '../data/mockData';

interface VehiclesScreenProps {
  listings: ListingItem[];
  onSelectListing: (listing: ListingItem) => void;
  initialCategory?: string;
  initialSearchQuery?: string;
}

export const VehiclesScreen: React.FC<VehiclesScreenProps> = ({
  listings,
  onSelectListing,
  initialCategory,
  initialSearchQuery
}) => {
  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || 'all');
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>('all');
  const [makeFilter, setMakeFilter] = useState<string>('Any Make');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [yearFrom, setYearFrom] = useState<string>('Any');
  const [yearTo, setYearTo] = useState<string>('Any');
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmissionFilter, setTransmissionFilter] = useState<string>('Any');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery || '');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [desktopFiltersVisible, setDesktopFiltersVisible] = useState<boolean>(false);

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== 'all') count++;
    if (bodyTypeFilter !== 'all') count++;
    if (makeFilter !== 'Any Make') count++;
    if (minPrice || maxPrice) count++;
    if (yearFrom !== 'Any' || yearTo !== 'Any') count++;
    if (fuelTypes.length > 0) count++;
    if (transmissionFilter !== 'Any') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    categoryFilter,
    bodyTypeFilter,
    makeFilter,
    minPrice,
    maxPrice,
    yearFrom,
    yearTo,
    fuelTypes,
    transmissionFilter,
    searchQuery
  ]);

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setBodyTypeFilter('all');
    setMakeFilter('Any Make');
    setMinPrice('');
    setMaxPrice('');
    setYearFrom('Any');
    setYearTo('Any');
    setFuelTypes([]);
    setTransmissionFilter('Any');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const toggleFuelType = (fuel: string) => {
    if (fuelTypes.includes(fuel)) {
      setFuelTypes(fuelTypes.filter((f) => f !== fuel));
    } else {
      setFuelTypes([...fuelTypes, fuel]);
    }
  };

  // Filter and Sort Logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Always exclude real estate properties from the Vehicles screen
      if (item.category === 'properties') {
        return false;
      }

      // Category filter
      if (categoryFilter === 'all' || categoryFilter === 'cars_vehicles') {
        if (item.category !== 'cars_vehicles') {
          return false;
        }
      } else if (categoryFilter === 'heavy_machinery') {
        if (item.category !== 'heavy_machinery') {
          return false;
        }
      } else if (categoryFilter === 'commercial_trucks') {
        if (item.bodyType !== 'Commercial Truck') {
          return false;
        }
      }

      // Body Type filter
      if (bodyTypeFilter !== 'all') {
        if (bodyTypeFilter.toLowerCase() === 'suv' && item.bodyType !== 'SUV') return false;
        if (bodyTypeFilter.toLowerCase() === 'sedan' && item.bodyType !== 'Sedan') return false;
        if (bodyTypeFilter.toLowerCase() === 'pickup' && item.bodyType !== 'Pickup') return false;
      }

      // Make filter
      if (makeFilter !== 'Any Make' && item.make && !item.make.toLowerCase().includes(makeFilter.toLowerCase())) {
        return false;
      }

      // Price filter
      const minP = parseFloat(minPrice);
      const maxP = parseFloat(maxPrice);
      if (!isNaN(minP) && item.price < minP) return false;
      if (!isNaN(maxP) && item.price > maxP) return false;

      // Year filter
      if (yearFrom !== 'Any' && item.year && item.year < parseInt(yearFrom)) return false;
      if (yearTo !== 'Any' && item.year && item.year > parseInt(yearTo)) return false;

      // Fuel filter
      if (fuelTypes.length > 0 && item.fuelType) {
        if (!fuelTypes.includes(item.fuelType)) return false;
      }

      // Transmission filter
      if (transmissionFilter !== 'Any' && item.transmission && item.transmission !== transmissionFilter) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchMake = item.make?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchMake) return false;
      }

      return true;
    });
  }, [
    listings,
    categoryFilter,
    bodyTypeFilter,
    makeFilter,
    minPrice,
    maxPrice,
    yearFrom,
    yearTo,
    fuelTypes,
    transmissionFilter,
    searchQuery
  ]);

  // Sort logic
  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
    if (sortBy === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year_desc') {
      sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortBy === 'hours_asc') {
      sorted.sort((a, b) => (a.hours || 99999) - (b.hours || 99999));
    }
    return sorted;
  }, [filteredListings, sortBy]);

  // Pagination (6 items per page)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedListings.length / itemsPerPage) || 1;
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedListings.slice(start, start + itemsPerPage);
  }, [sortedListings, currentPage]);

  const featuredTopItem = sortedListings.find((i) => i.featured) || sortedListings[0];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 flex-grow">
      {/* Mobile Filter Toggle & Summary */}
      <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase">Results</span>
          <div className="font-heading font-bold text-base text-slate-900">
            {sortedListings.length} Assets Available
          </div>
        </div>

        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 bg-[#f97316] text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className={`grid grid-cols-1 ${desktopFiltersVisible ? 'md:grid-cols-12' : 'md:grid-cols-1'} gap-8 items-start`}>
        {/* Sidebar Filters - Desktop & Slide-out for Mobile */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 shadow-2xl overflow-y-auto transform transition-all duration-300 ease-in-out
            ${mobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
            ${
              desktopFiltersVisible
                ? 'md:relative md:inset-auto md:w-auto md:p-0 md:shadow-none md:translate-x-0 md:col-span-4 lg:col-span-3 md:block'
                : 'md:hidden'
            }
          `}
        >
          {/* Mobile close button */}
          <div className="flex md:hidden justify-between items-center pb-4 border-b border-slate-200 mb-4">
            <h3 className="font-heading font-bold text-lg text-slate-900">Filters</h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="p-1 rounded-lg border border-slate-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="bg-white md:border md:border-slate-200 md:rounded-xl p-5 space-y-6 md:shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-700">
                  FILTERS
                </span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  id="clear-all-filters-btn"
                  onClick={handleResetFilters}
                  className="font-sans text-xs text-[#f97316] hover:text-[#ea580c] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear all</span>
                </button>
                {/* Desktop Collapse Button */}
                <button
                  type="button"
                  id="collapse-sidebar-filters-btn"
                  onClick={() => setDesktopFiltersVisible(false)}
                  title="Hide Filters Sidebar"
                  className="hidden md:flex items-center justify-center text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block font-sans text-xs font-semibold uppercase text-slate-600 mb-3">
                Category
              </label>
              <div className="space-y-2.5">
                {[
                  { id: 'all', label: 'All Vehicles' },
                  { id: 'heavy_machinery', label: 'Heavy Machinery' },
                  { id: 'commercial_trucks', label: 'Commercial Trucks' }
                ].map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2.5 font-sans text-sm text-slate-700 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="categoryRadio"
                      checked={categoryFilter === cat.id}
                      onChange={() => {
                        setCategoryFilter(cat.id);
                        setCurrentPage(1);
                      }}
                      className="accent-[#f97316] w-4 h-4 cursor-pointer"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Body Type Filter */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block font-sans text-xs font-semibold uppercase text-slate-600 mb-3">
                Body Type
              </label>
              <div className="space-y-2.5">
                {[
                  { id: 'all', label: 'All Types' },
                  { id: 'suv', label: 'SUV' },
                  { id: 'sedan', label: 'Sedan' },
                  { id: 'pickup', label: 'Pickup' }
                ].map((bt) => (
                  <label
                    key={bt.id}
                    className="flex items-center gap-2.5 font-sans text-sm text-slate-700 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="bodyTypeRadio"
                      checked={bodyTypeFilter === bt.id}
                      onChange={() => {
                        setBodyTypeFilter(bt.id);
                        setCurrentPage(1);
                      }}
                      className="accent-[#f97316] w-4 h-4 cursor-pointer"
                    />
                    <span>{bt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block font-sans text-xs font-semibold uppercase text-slate-600 mb-2">
                Price Range (GHS)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="filter-min-price-input"
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs font-sans text-slate-900 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none bg-slate-50"
                  placeholder="Min"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-slate-400 text-xs font-bold">-</span>
                <input
                  id="filter-max-price-input"
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs font-sans text-slate-900 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none bg-slate-50"
                  placeholder="Max"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Make Selector */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block font-sans text-xs font-semibold uppercase text-slate-600 mb-2">
                Make
              </label>
              <select
                id="filter-make-select"
                value={makeFilter}
                onChange={(e) => {
                  setMakeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs font-sans text-slate-900 bg-slate-50 focus:border-[#f97316] outline-none cursor-pointer"
              >
                {MAKES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Range */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block font-sans text-xs font-semibold uppercase text-slate-600 mb-2">
                Year
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2 text-xs font-sans text-slate-900 bg-slate-50 outline-none"
                >
                  <option value="Any">From: Any</option>
                  <option value="2015">2015</option>
                  <option value="2018">2018</option>
                  <option value="2020">2020</option>
                  <option value="2022">2022</option>
                </select>
                <select
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2 text-xs font-sans text-slate-900 bg-slate-50 outline-none"
                >
                  <option value="Any">To: Any</option>
                  <option value="2024">2024</option>
                  <option value="2022">2022</option>
                  <option value="2020">2020</option>
                </select>
              </div>
            </div>

            {/* Fuel Type */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block font-sans text-xs font-semibold uppercase text-slate-600 mb-3">
                Fuel Type
              </label>
              <div className="space-y-2">
                {['Petrol', 'Diesel', 'Electric/Hybrid'].map((fuel) => (
                  <label
                    key={fuel}
                    className="flex items-center gap-2.5 font-sans text-sm text-slate-700 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={fuelTypes.includes(fuel)}
                      onChange={() => toggleFuelType(fuel)}
                      className="accent-[#f97316] rounded w-4 h-4 cursor-pointer"
                    />
                    <span>{fuel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block font-sans text-xs font-semibold uppercase text-slate-600 mb-3">
                Transmission
              </label>
              <div className="space-y-2">
                {['Any', 'Automatic', 'Manual'].map((trans) => (
                  <label
                    key={trans}
                    className="flex items-center gap-2.5 font-sans text-sm text-slate-700 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="transRadio"
                      checked={transmissionFilter === trans}
                      onChange={() => setTransmissionFilter(trans)}
                      className="accent-[#f97316] w-4 h-4 cursor-pointer"
                    />
                    <span>{trans}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <button
                id="apply-filters-btn"
                onClick={() => {
                  setMobileFilterOpen(false);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-sans text-sm font-semibold py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileFilterOpen && (
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40"
          />
        )}

        {/* Right Main Inventory Results */}
        <main className={`${desktopFiltersVisible ? 'md:col-span-8 lg:col-span-9' : 'w-full'} space-y-6`}>
          {/* Header & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-slate-900">
                Inventory & Commercial Fleet
              </h1>
              <p className="font-sans text-xs text-slate-500 mt-0.5">
                Showing {sortedListings.length} verified listings across Ghana
              </p>
            </div>

            {/* Action controls (Toggle Filters + Sort) */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              {/* Desktop Filter Toggle Button */}
              <button
                type="button"
                id="desktop-toggle-filters-btn"
                onClick={() => setDesktopFiltersVisible(!desktopFiltersVisible)}
                className={`hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                  desktopFiltersVisible
                    ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                    : 'bg-[#f97316] border-[#ea580c] text-white hover:bg-[#ea580c]'
                }`}
              >
                {desktopFiltersVisible ? (
                  <>
                    <PanelLeftClose className="w-4 h-4 text-slate-500" />
                    <span>Hide Filters</span>
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                    <span>Filters</span>
                  </>
                )}
                {activeFilterCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      desktopFiltersVisible
                        ? 'bg-[#f97316] text-white'
                        : 'bg-white text-[#ea580c]'
                    }`}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-slate-500 font-semibold">Sort by:</span>
                <select
                  id="sort-by-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-slate-200 rounded-lg p-2 text-xs font-sans text-slate-900 bg-white outline-none focus:border-[#f97316] cursor-pointer shadow-2xs"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_desc">Year: Newest</option>
                  <option value="hours_asc">Hours: Lowest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Bar when desktop filters are hidden */}
          {!desktopFiltersVisible && activeFilterCount > 0 && (
            <div className="hidden md:flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-semibold text-slate-500 mr-1">Active Filters:</span>
              {categoryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 border border-slate-200 shadow-2xs">
                  Category: {categoryFilter === 'heavy_machinery' ? 'Heavy Machinery' : categoryFilter === 'commercial_trucks' ? 'Commercial Trucks' : categoryFilter}
                  <button onClick={() => setCategoryFilter('all')} className="text-slate-400 hover:text-slate-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {makeFilter !== 'Any Make' && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 border border-slate-200 shadow-2xs">
                  Make: {makeFilter}
                  <button onClick={() => setMakeFilter('Any Make')} className="text-slate-400 hover:text-slate-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {bodyTypeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 border border-slate-200 shadow-2xs">
                  Body: {bodyTypeFilter}
                  <button onClick={() => setBodyTypeFilter('all')} className="text-slate-400 hover:text-slate-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 border border-slate-200 shadow-2xs">
                  Price: GHS {minPrice || '0'} - {maxPrice || '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="text-slate-400 hover:text-slate-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {fuelTypes.map((ft) => (
                <span key={ft} className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 border border-slate-200 shadow-2xs">
                  Fuel: {ft}
                  <button onClick={() => setFuelTypes(fuelTypes.filter(f => f !== ft))} className="text-slate-400 hover:text-slate-700 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#f97316] hover:underline font-semibold ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* If No Results */}
          {sortedListings.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-sm">
              <Filter className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
              <h3 className="font-heading text-lg font-bold text-slate-900">
                No equipment matching your filter criteria
              </h3>
              <p className="font-sans text-sm text-slate-500 max-w-md mx-auto">
                Try widening your price range or clearing make and category filters to explore more available assets.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#f97316] text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-[#ea580c] transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Bento Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${desktopFiltersVisible ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
            {paginatedListings.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col group"
                >
                  {/* Card Image */}
                  <div className="bg-slate-100 relative overflow-hidden h-52">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Featured / Reduced Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {item.featured && (
                        <span className="bg-[#f97316] text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                          FEATURED
                        </span>
                      )}
                      {item.recentlyReduced && (
                        <span className="bg-amber-600 text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                          RECENTLY REDUCED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-heading text-lg font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </h3>
                      </div>

                      <p className="font-heading text-xl font-bold text-slate-900 mb-2">
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

                      {/* Specs Tags / List */}
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {item.hours && (
                          <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.hours.toLocaleString()} hrs</span>
                          </div>
                        )}
                        {item.mileage && (
                          <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <Gauge className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.mileage}</span>
                          </div>
                        )}
                        {item.tonnage && (
                          <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.tonnage}</span>
                          </div>
                        )}
                        {item.fuelType && (
                          <div className="flex items-center gap-1.5 text-slate-600 font-sans text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span>{item.fuelType}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card CTA */}
                    <button
                      onClick={() => onSelectListing(item)}
                      className="w-full bg-transparent hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-900 font-sans text-sm font-semibold py-2.5 rounded-full transition-all cursor-pointer text-center"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 pb-4 flex justify-center items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-9 h-9 rounded-lg font-sans text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === pg
                      ? 'bg-[#f97316] text-white shadow-sm'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
