import React, { useState, useEffect, useCallback } from 'react';
import { ListingItem, ScreenType, EnquiryItem } from '../types';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Package,
  DollarSign,
  Clock,
  Eye,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  Sliders,
  DollarSign as CurrencyIcon,
  Check,
  Building,
  Truck,
  Car,
  Bot,
  MessageSquare,
  Mail,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lock,
  LogOut,
  Loader2,
  User,
} from 'lucide-react';
import { auth, authStorage, enquiries as enquiriesApi, listings as listingsApi } from '../lib/api';

interface AdminScreenProps {
  listings: ListingItem[];
  onUpdateListings: (updatedListings: ListingItem[]) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenListingDetail: (listing: ListingItem) => void;
  onOpenCreateListing: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  listings,
  onUpdateListings,
  onNavigate,
  onOpenListingDetail,
  onOpenCreateListing,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<string | null>(null);

  // Portal State
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'enquiries' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Modal State
  const [editingListing, setEditingListing] = useState<ListingItem | null>(null);

  // Enquiries State
  const [enquiriesList, setEnquiriesList] = useState<EnquiryItem[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiryChannelFilter, setEnquiryChannelFilter] = useState<'all' | 'ai_assistant' | 'whatsapp' | 'form'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // System settings state
  const [exchangeRate, setExchangeRate] = useState<number>(11.06);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check auth token on mount
  const checkAuth = useCallback(async () => {
    const token = authStorage.get();
    if (!token) {
      setIsAuthenticated(false);
      setAuthChecking(false);
      return;
    }

    try {
      const res = await auth.verify();
      if (res.valid) {
        setIsAuthenticated(true);
        setCurrentAdminUser(res.username ?? 'Admin');
      } else {
        authStorage.clear();
        setIsAuthenticated(false);
      }
    } catch {
      authStorage.clear();
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Load enquiries when authenticated
  const fetchEnquiries = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setEnquiriesLoading(true);
      const data = await enquiriesApi.getAll();
      setEnquiriesList(data as EnquiryItem[]);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setEnquiriesLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnquiries();
    }
  }, [isAuthenticated, fetchEnquiries]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await auth.login(username, password);
      authStorage.set(res.token);
      setIsAuthenticated(true);
      setCurrentAdminUser(res.username);
      showToast(`Welcome back, ${res.username}!`);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    authStorage.clear();
    setIsAuthenticated(false);
    setCurrentAdminUser(null);
    showToast('Logged out successfully.');
  };

  // KPI Calculations
  const totalListingsCount = listings.length;
  const publishedCount = listings.filter((l) => l.status !== 'rejected').length;
  const featuredCount = listings.filter((l) => l.featured).length;
  const totalValue = listings.reduce((sum, l) => sum + (l.price || 0), 0);

  const machineryCount = listings.filter((l) => l.category === 'heavy_machinery').length;
  const vehiclesCount = listings.filter((l) => l.category === 'cars_vehicles').length;
  const propertiesCount = listings.filter((l) => l.category === 'properties').length;

  // Filtered listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.seller?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.status !== 'rejected') ||
      (statusFilter === 'featured' && item.featured);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredEnquiries = enquiriesList.filter((e) => {
    if (enquiryChannelFilter === 'all') return true;
    return e.source === enquiryChannelFilter;
  });

  // Handlers for Listing updates (communicates with backend)
  const handleToggleFeatured = async (id: string) => {
    const item = listings.find((l) => l.id === id);
    if (!item) return;
    const nextFeatured = !item.featured;

    // Optimistic UI update
    const updated = listings.map((l) => (l.id === id ? { ...l, featured: nextFeatured } : l));
    onUpdateListings(updated);
    showToast(nextFeatured ? `"${item.title.slice(0, 20)}..." marked as Featured` : `Removed from Featured`);

    try {
      await listingsApi.update(id, { featured: nextFeatured });
    } catch {
      showToast('Failed to persist changes to backend');
      onUpdateListings(listings); // revert
    }
  };

  const handleDeleteListing = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const updated = listings.filter((item) => item.id !== id);
      onUpdateListings(updated);
      showToast(`Listing deleted from inventory.`);

      try {
        await listingsApi.delete(id);
      } catch {
        showToast('Failed to delete on server');
      }
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    const updated = listings.map((item) => (item.id === editingListing.id ? editingListing : item));
    onUpdateListings(updated);
    const targetId = editingListing.id;
    const targetData = editingListing;
    setEditingListing(null);
    showToast(`Listing details updated.`);

    try {
      await listingsApi.update(targetId, targetData as unknown as Record<string, unknown>);
    } catch {
      showToast('Failed to save edits to server');
    }
  };

  // Loading state during auth check
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-3" />
        <p className="text-xs text-slate-400 font-medium">Verifying Admin Session...</p>
      </div>
    );
  }

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-orange-500 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Portal Access</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-[11px] font-semibold text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Admin Portal</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800/80">
            <button
              onClick={() => onNavigate('home')}
              className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Marketplace</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED PORTAL ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Admin Top Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Main Marketplace"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-slate-300" />
                <h1 className="text-xl font-black tracking-tight text-white">Admin Management Portal</h1>
                <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                  {currentAdminUser || 'Super Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage equipment listings, approvals, seller verifications, and marketplace metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateListing}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Plus className="w-4 h-4 text-slate-300" />
              <span>Add New Listing</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-900/60 hover:bg-red-800 border border-red-700 text-red-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4 text-slate-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>Inventory ({totalListingsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Customer Enquiries ({enquiriesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-slate-500" />
            <span>System Config</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="relative bg-white rounded-2xl p-5 pt-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="absolute -top-4 left-4 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listings</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{totalListingsCount}</div>
                </div>
                <div className="text-[11px] text-slate-600 font-semibold mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
                  <span className="text-slate-800 font-bold">↑</span>
                  <span>{publishedCount} Active Live</span>
                </div>
              </div>

              <div className="relative bg-white rounded-2xl p-5 pt-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="absolute -top-4 left-4 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Value</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">GH₵ {(totalValue / 1000000).toFixed(1)}M</div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100 text-right">
                  Combined catalogue valuation
                </div>
              </div>

              <div className="relative bg-white rounded-2xl p-5 pt-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div className="absolute -top-4 left-4 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Items</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{featuredCount}</div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100 text-right">
                  Homepage promoted slots
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="relative bg-white rounded-2xl p-5 pt-6 border border-slate-200 shadow-xs">
                <div className="absolute -top-4 left-4 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase">Heavy Machinery</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{machineryCount} Units</div>
                  <div className="text-xs text-slate-400 mt-1">Excavators, Dozers, Loaders</div>
                </div>
              </div>

              <div className="relative bg-white rounded-2xl p-5 pt-6 border border-slate-200 shadow-xs">
                <div className="absolute -top-4 left-4 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase">Vehicles &amp; Trucks</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{vehiclesCount} Vehicles</div>
                  <div className="text-xs text-slate-400 mt-1">SUVs, Pickups, Tipper Trucks</div>
                </div>
              </div>

              <div className="relative bg-white rounded-2xl p-5 pt-6 border border-slate-200 shadow-xs">
                <div className="absolute -top-4 left-4 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase">Properties &amp; Real Estate</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{propertiesCount} Listings</div>
                  <div className="text-xs text-slate-400 mt-1">Townhouses, Apartments, Land</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search listings by name, seller, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="heavy_machinery">Heavy Machinery</option>
                  <option value="cars_vehicles">Cars &amp; Vehicles</option>
                  <option value="properties">Properties</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="featured">Featured Only</option>
                </select>

                <button
                  onClick={onOpenCreateListing}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-300" />
                  <span>New Listing</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-500 font-bold">
                      <th className="py-3.5 px-4">Listing Title &amp; Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Featured</th>
                      <th className="py-3.5 px-4 text-right">Management Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredListings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">No listings match your filter criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredListings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                              <div>
                                <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                                <div className="text-slate-500 text-[11px] mt-0.5">
                                  {item.seller?.name ? `Seller: ${item.seller.name}` : item.location}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-700 capitalize">
                            <span className="inline-block bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                              {item.category.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-extrabold text-slate-900">{item.priceFormatted}</td>

                          <td className="py-3.5 px-4">
                            {item.status === 'rejected' ? (
                              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md inline-flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-slate-600" />
                                Rejected
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md inline-flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-slate-600" />
                                Live
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleFeatured(item.id)}
                              className={`p-1.5 transition-all cursor-pointer ${
                                item.featured ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
                              }`}
                              title={item.featured ? 'Featured' : 'Promote to Featured'}
                            >
                              <Star className={`w-4 h-4 ${item.featured ? 'fill-slate-800 text-slate-800' : ''}`} />
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onOpenListingDetail(item)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setEditingListing(item)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                title="Edit Listing"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteListing(item.id, item.title)}
                                className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Customer Enquiries &amp; Inspection Leads</h3>
              </div>
              <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 shrink-0 self-start sm:self-auto">
                {filteredEnquiries.length} Enquiries Listed
              </span>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setEnquiryChannelFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  enquiryChannelFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Channels ({enquiriesList.length})
              </button>
              <button
                onClick={() => setEnquiryChannelFilter('ai_assistant')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  enquiryChannelFilter === 'ai_assistant' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-orange-500" />
                <span>Digital Assistant Chat ({enquiriesList.filter((e) => e.source === 'ai_assistant').length})</span>
              </button>
              <button
                onClick={() => setEnquiryChannelFilter('whatsapp')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  enquiryChannelFilter === 'whatsapp' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Leads ({enquiriesList.filter((e) => e.source === 'whatsapp').length})</span>
              </button>
            </div>

            {/* Enquiries List */}
            {enquiriesLoading ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                Fetching enquiries from backend...
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No customer enquiries found in database.
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {filteredEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 transition-all hover:border-slate-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{enquiry.customerName}</span>

                        {enquiry.source === 'ai_assistant' ? (
                          <span className="bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Bot className="w-3 h-3 text-orange-600" />
                            Digital Assistant Query
                          </span>
                        ) : enquiry.source === 'whatsapp' ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            WhatsApp Direct Lead
                          </span>
                        ) : (
                          <span className="bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-600" />
                            Web Form Submission
                          </span>
                        )}

                        <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">{enquiry.category}</span>
                      </div>

                      <span className="text-[11px] text-slate-400 font-medium shrink-0">{enquiry.timestamp}</span>
                    </div>

                    {enquiry.itemTitle && (
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          Listing: <strong className="text-slate-900">{enquiry.itemTitle}</strong>
                        </span>
                      </div>
                    )}

                    <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                      <span className="font-semibold text-slate-900">Enquiry Summary: </span>"{enquiry.message}"
                    </div>

                    {enquiry.aiConversationSnippet && (
                      <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/70 text-xs space-y-2">
                        <button
                          onClick={() => setExpandedLogId(expandedLogId === enquiry.id ? null : enquiry.id)}
                          className="flex items-center justify-between w-full text-left font-bold text-amber-900 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Digital Assistant Conversation Log</span>
                          </span>
                          {expandedLogId === enquiry.id ? (
                            <ChevronUp className="w-4 h-4 text-amber-700" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-amber-700" />
                          )}
                        </button>

                        {expandedLogId === enquiry.id && (
                          <div className="pt-2 border-t border-amber-200/60 space-y-2 animate-in fade-in duration-150">
                            <div className="bg-white p-2.5 rounded-lg border border-amber-100 text-[11px]">
                              <span className="font-bold text-slate-800">User Prompt to AI: </span>
                              <span className="text-slate-700">{enquiry.aiConversationSnippet.userPrompt}</span>
                            </div>
                            <div className="bg-slate-900 text-white p-2.5 rounded-lg text-[11px]">
                              <span className="font-bold text-orange-400">Digital Assistant Response: </span>
                              <span className="text-slate-200">{enquiry.aiConversationSnippet.botAnswer}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-slate-200/80">
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                        <span>
                          Phone: <strong className="text-slate-800">{enquiry.phone}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${enquiry.customerName}, this is AkwasiJob Admin following up on your enquiry regarding "${enquiry.itemTitle || 'our equipment/property'}". How can we assist you?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Reply on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SYSTEM CONFIG */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Marketplace System Configuration</h3>
              <p className="text-xs text-slate-500">Global currency exchange rate configuration</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('System settings saved successfully.');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">USD to GH₵ Exchange Rate</label>
                <div className="relative">
                  <CurrencyIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* EDIT LISTING MODAL */}
      {editingListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Edit Listing: {editingListing.title}</h3>
              <button onClick={() => setEditingListing(null)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <XCircle className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingListing.title}
                  onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (GH₵)</label>
                  <input
                    type="number"
                    value={editingListing.price}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setEditingListing({
                        ...editingListing,
                        price: val,
                        priceFormatted: `GH₵ ${val.toLocaleString()}`,
                      });
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingListing.location}
                    onChange={(e) => setEditingListing({ ...editingListing, location: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingListing.description}
                  onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
