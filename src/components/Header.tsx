import React, { useState } from 'react';
import { Search, Menu, X, User, ShieldCheck } from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  onOpenPostListing: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenPostListing,
  onOpenAccount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(headerSearch);
    if (currentScreen !== 'vehicles' && currentScreen !== 'machinery' && currentScreen !== 'properties') {
      onNavigate('vehicles');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 sm:px-8 lg:px-12 max-w-[1280px] mx-auto h-16">
        {/* Brand and Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="text-left cursor-pointer transition-opacity hover:opacity-90 flex items-center"
          >
            <span className="bg-[#f97316] text-white px-3 py-1 rounded-md text-xl sm:text-2xl font-black tracking-tight shadow-xs inline-block">
              AkwasiJob
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            <button
              id="nav-cars-vehicles-btn"
              onClick={() => onNavigate('vehicles')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentScreen === 'vehicles'
                  ? 'text-orange-500 font-semibold'
                  : 'text-slate-700 hover:text-orange-500'
              }`}
            >
              Cars & Vehicles
            </button>

            <button
              id="nav-heavy-machinery-btn"
              onClick={() => onNavigate('machinery')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentScreen === 'machinery'
                  ? 'text-orange-500 font-semibold'
                  : 'text-slate-700 hover:text-orange-500'
              }`}
            >
              Heavy Machinery
            </button>

            <button
              id="nav-properties-btn"
              onClick={() => onNavigate('properties')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentScreen === 'properties'
                  ? 'text-orange-500 font-semibold'
                  : 'text-slate-700 hover:text-orange-500'
              }`}
            >
              Properties
            </button>

            <button
              id="nav-services-btn"
              onClick={() => onNavigate('services')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentScreen === 'services'
                  ? 'text-orange-500 font-semibold'
                  : 'text-slate-700 hover:text-orange-500'
              }`}
            >
              Services
            </button>

          </nav>
        </div>

        {/* Search, Account & Post Listing */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="header-search-input"
              value={headerSearch}
              onChange={(e) => {
                setHeaderSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="pl-9 pr-4 py-2 bg-slate-100/90 rounded-md text-sm text-slate-900 w-52 xl:w-64 outline-none transition-all placeholder:text-slate-500 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 border border-transparent"
              placeholder="Search..."
              type="text"
            />
          </form>

          {/* User / Human Avatar Button -> Admin Page */}
          <button
            id="user-avatar-btn"
            onClick={() => onNavigate('admin')}
            className={`w-10 h-10 rounded-full border text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs group ${
              currentScreen === 'admin'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-slate-300'
            }`}
            title="Admin Management Portal"
            aria-label="Admin Portal"
          >
            <User className={`w-5 h-5 transition-transform group-hover:scale-105 ${currentScreen === 'admin' ? 'text-white' : 'text-slate-700'}`} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="mobile-header-search-input"
              value={headerSearch}
              onChange={(e) => {
                setHeaderSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-md text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-orange-500"
              placeholder="Search..."
              type="text"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigate('vehicles');
                setMobileMenuOpen(false);
              }}
              className={`text-left p-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentScreen === 'vehicles' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              Cars & Vehicles
            </button>
            <button
              onClick={() => {
                onNavigate('machinery');
                setMobileMenuOpen(false);
              }}
              className={`text-left p-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentScreen === 'machinery' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              Heavy Machinery
            </button>
            <button
              onClick={() => {
                onNavigate('properties');
                setMobileMenuOpen(false);
              }}
              className={`text-left p-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentScreen === 'properties' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => {
                onNavigate('services');
                setMobileMenuOpen(false);
              }}
              className={`text-left p-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentScreen === 'services' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              Services
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-900 flex items-center justify-center text-white">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">Admin Account Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
