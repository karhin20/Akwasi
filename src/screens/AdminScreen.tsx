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
import { auth, authStorage, enquiries as enquiriesApi, listings as listingsApi, media as mediaApi } from '../lib/api';
import { Upload, X, MapPin, Calendar, Gauge, Fuel, ShieldAlert } from 'lucide-react';

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
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Preview Modal State
  const [previewListing, setPreviewListing] = useState<ListingItem | null>(null);

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

  const handleToggleStatus = async (id: string) => {
    const item = listings.find((l) => l.id === id);
    if (!item) return;
    const nextStatus: 'published' | 'draft' = item.status === 'draft' || item.status === 'rejected' ? 'published' : 'draft';

    const updated = listings.map((l) => (l.id === id ? { ...l, status: nextStatus } : l));
    onUpdateListings(updated);
    showToast(nextStatus === 'published' ? `Listing published (Live)` : `Listing set to Draft (Hidden)`);

    try {
      await listingsApi.update(id, { status: nextStatus });
    } catch {
      showToast('Failed to change status on backend');
      onUpdateListings(listings); // revert
    }
  };

  const handleDeleteListing = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"? This will also remove associated Cloudinary images.`)) {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingListing) return;
    const file = e.target.files[0];
    setIsUploadingImage(true);

    try {
      const res = await mediaApi.upload(file, 'akwasi/listings');
      if (res.url) {
        setEditingListing((prev) => {
          if (!prev) return null;
          const currentGallery = prev.gallery || [];
          return {
            ...prev,
            gallery: [...currentGallery, res.url],
            image: prev.image ? prev.image : res.url, // set main image if empty
          };
        });
        showToast('Image uploaded successfully to Cloudinary');
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      showToast('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      e.target.value = ''; // reset file input
    }
  };

  const handleRemoveImage = (imgUrl: string) => {
    if (!editingListing) return;
    setRemovedImages((prev) => [...prev, imgUrl]);

    setEditingListing((prev) => {
      if (!prev) return null;
      const newGallery = (prev.gallery || []).filter((u) => u !== imgUrl);
      let newMainImage = prev.image;
      if (prev.image === imgUrl) {
        newMainImage = newGallery[0] || '';
      }
      return {
        ...prev,
        image: newMainImage,
        gallery: newGallery,
      };
    });
  };

  const handleSetCoverImage = (imgUrl: string) => {
    if (!editingListing) return;
    setEditingListing((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        image: imgUrl,
      };
    });
    showToast('Cover image updated');
  };

  const handleMoveImage = (idx: number, direction: 'left' | 'right') => {
    if (!editingListing || !editingListing.gallery) return;
    const gallery = [...editingListing.gallery];
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= gallery.length) return;

    // Swap
    const temp = gallery[idx];
    gallery[idx] = gallery[targetIdx];
    gallery[targetIdx] = temp;

    setEditingListing((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        gallery,
      };
    });
  };


  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    const updated = listings.map((item) => (item.id === editingListing.id ? editingListing : item));
    onUpdateListings(updated);
    const targetId = editingListing.id;
    const targetData = editingListing;
    const imagesToDelete = [...removedImages];

    setEditingListing(null);
    setRemovedImages([]);
    showToast(`Listing details updated.`);

    try {
      await listingsApi.update(targetId, {
        ...(targetData as unknown as Record<string, unknown>),
        removedImages: imagesToDelete,
      });
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
                            <button
                              onClick={() => handleToggleStatus(item.id)}
                              className="cursor-pointer"
                              title="Click to toggle Live / Draft status"
                            >
                              {item.status === 'draft' ? (
                                <span className="bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30 text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 hover:bg-[#f97316]/20 transition-colors">
                                  <XCircle className="w-3 h-3 text-[#f97316]" />
                                  Draft (Hidden)
                                </span>
                              ) : item.status === 'rejected' ? (
                                <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 hover:bg-slate-300 transition-colors">
                                  <XCircle className="w-3 h-3 text-slate-600" />
                                  Rejected
                                </span>
                              ) : (
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 hover:bg-emerald-200 transition-colors">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  Live
                                </span>
                              )}
                            </button>
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
                                onClick={() => setPreviewListing(item)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                title="Quick Preview"
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

      {/* INLINE QUICK PREVIEW MODAL */}
      {previewListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm">Listing Quick Preview: {previewListing.title}</h3>
              </div>
              <button onClick={() => setPreviewListing(null)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <XCircle className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Media gallery preview */}
              <div className="space-y-2">
                <div className="h-56 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  <img src={previewListing.image} alt={previewListing.title} className="w-full h-full object-cover" />
                </div>
                {previewListing.gallery && previewListing.gallery.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {previewListing.gallery.map((img, idx) => (
                      <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0" />
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{previewListing.title}</h2>
                  <div className="text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{previewListing.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-slate-900">{previewListing.priceFormatted}</div>
                  {previewListing.priceUsd && <div className="text-slate-400 font-medium">{previewListing.priceUsd}</div>}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Category</span>
                  <p className="font-bold text-slate-800 capitalize">{previewListing.category.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Status</span>
                  <p className="font-bold text-slate-800 capitalize">{previewListing.status || 'published'}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px]">Condition</span>
                  <p className="font-bold text-slate-800">{previewListing.condition || 'N/A'}</p>
                </div>
                {previewListing.make && (
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Make / Model</span>
                    <p className="font-bold text-slate-800">{previewListing.make} {previewListing.model}</p>
                  </div>
                )}
                {previewListing.year && (
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Year</span>
                    <p className="font-bold text-slate-800">{previewListing.year}</p>
                  </div>
                )}
                {previewListing.hours && (
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Hours</span>
                    <p className="font-bold text-slate-800">{previewListing.hours} hrs</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Description</h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{previewListing.description}</p>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setEditingListing(previewListing);
                    setPreviewListing(null);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Listing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE EDIT LISTING MODAL WITH CLOUDINARY IMAGE MANAGER */}
      {editingListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm">Edit Listing &amp; Images: {editingListing.title}</h3>
              </div>
              <button
                onClick={() => {
                  setEditingListing(null);
                  setRemovedImages([]);
                }}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <XCircle className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* IMAGE MANAGEMENT SECTION */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-orange-500" />
                    <span>Listing Images &amp; Cloudinary Uploads</span>
                  </h4>
                  <label className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1">
                    {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" /> : <Plus className="w-3.5 h-3.5 text-white" />}
                    <span>Upload New Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} className="hidden" />
                  </label>
                </div>

                <p className="text-[11px] text-slate-500">
                  Deleting a picture here marks it to be permanently removed from Cloudinary when you save changes.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                  {(editingListing.gallery && editingListing.gallery.length > 0
                    ? editingListing.gallery
                    : (editingListing.image ? [editingListing.image] : [])
                  ).map((url, idx, arr) => {
                    const isCover = url === editingListing.image;
                    return (
                      <div key={idx} className={`relative group rounded-xl overflow-hidden bg-white aspect-square shadow-xs flex flex-col border-2 ${isCover ? 'border-orange-500' : 'border-slate-200'}`}>
                        <img src={url} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Cover status / Make cover action */}
                        {isCover ? (
                          <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                            COVER
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(url)}
                            className="absolute top-1.5 left-1.5 bg-slate-900/85 hover:bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1 shadow-xs cursor-pointer"
                            title="Set as Cover Image"
                          >
                            <Star className="w-2.5 h-2.5 fill-white text-white" />
                            <span>Make Cover</span>
                          </button>
                        )}

                        {/* Delete Image Action */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(url)}
                          className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100 hover:scale-110"
                          title="Remove Image"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {/* Reordering Controls Overlay */}
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/75 p-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move Left"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] text-slate-400 font-bold">#{idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === arr.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move Right"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BASIC DETAILS */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1">Basic Information</h4>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={editingListing.title}
                    onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={editingListing.category}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          category: e.target.value as 'cars_vehicles' | 'heavy_machinery' | 'properties',
                        })
                      }
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                    >
                      <option value="heavy_machinery">Heavy Machinery</option>
                      <option value="cars_vehicles">Cars &amp; Vehicles</option>
                      <option value="properties">Properties</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sub-Category</label>
                    <input
                      type="text"
                      value={editingListing.subCategory || ''}
                      onChange={(e) => setEditingListing({ ...editingListing, subCategory: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="e.g. Excavator, SUV, Apartment"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
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
                    <label className="block font-bold text-slate-700 mb-1">Price USD (Display)</label>
                    <input
                      type="text"
                      value={editingListing.priceUsd || ''}
                      onChange={(e) => setEditingListing({ ...editingListing, priceUsd: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder="e.g. USD 120,000"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={editingListing.status || 'published'}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          status: e.target.value as 'published' | 'draft' | 'pending' | 'rejected',
                        })
                      }
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                    >
                      <option value="published">Live (Published)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CATEGORY-SPECIFIC SPECIFICATIONS */}
              {editingListing.category === 'cars_vehicles' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 border-b border-blue-100 pb-1 text-blue-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Vehicle Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Location</label>
                      <input type="text" value={editingListing.location} onChange={(e) => setEditingListing({ ...editingListing, location: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                      <input type="text" value={editingListing.city} onChange={(e) => setEditingListing({ ...editingListing, city: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Make / Brand</label>
                      <input type="text" value={editingListing.make || ''} onChange={(e) => setEditingListing({ ...editingListing, make: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Model</label>
                      <input type="text" value={editingListing.model || ''} onChange={(e) => setEditingListing({ ...editingListing, model: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Year</label>
                      <input type="number" value={editingListing.year || ''} onChange={(e) => setEditingListing({ ...editingListing, year: parseInt(e.target.value) || undefined })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mileage</label>
                      <input type="text" value={editingListing.mileage || ''} onChange={(e) => setEditingListing({ ...editingListing, mileage: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" placeholder="e.g. 45,000 km" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Body Type</label>
                      <select value={editingListing.bodyType || ''} onChange={(e) => setEditingListing({ ...editingListing, bodyType: e.target.value as ListingItem['bodyType'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="">Select body type</option>
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Pickup">Pickup</option>
                        <option value="Commercial Truck">Commercial Truck</option>
                        <option value="Heavy Equipment">Heavy Equipment</option>
                        <option value="Tractor Head">Tractor Head</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                      <select value={editingListing.fuelType || ''} onChange={(e) => setEditingListing({ ...editingListing, fuelType: e.target.value as ListingItem['fuelType'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="">Select</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric/Hybrid">Electric / Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Transmission</label>
                      <select value={editingListing.transmission || ''} onChange={(e) => setEditingListing({ ...editingListing, transmission: e.target.value as ListingItem['transmission'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="">Select</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Condition</label>
                      <select value={editingListing.condition || ''} onChange={(e) => setEditingListing({ ...editingListing, condition: e.target.value as ListingItem['condition'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="Brand New">Brand New</option>
                        <option value="Excellent Condition">Excellent Condition</option>
                        <option value="Dealer Certified">Dealer Certified</option>
                        <option value="Used">Used</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {editingListing.category === 'heavy_machinery' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 border-b border-amber-100 pb-1 text-amber-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Machinery Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Location</label>
                      <input type="text" value={editingListing.location} onChange={(e) => setEditingListing({ ...editingListing, location: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                      <input type="text" value={editingListing.city} onChange={(e) => setEditingListing({ ...editingListing, city: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Make / Brand</label>
                      <input type="text" value={editingListing.make || ''} onChange={(e) => setEditingListing({ ...editingListing, make: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Model</label>
                      <input type="text" value={editingListing.model || ''} onChange={(e) => setEditingListing({ ...editingListing, model: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Year</label>
                      <input type="number" value={editingListing.year || ''} onChange={(e) => setEditingListing({ ...editingListing, year: parseInt(e.target.value) || undefined })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Operating Hours</label>
                      <input type="number" value={editingListing.hours || ''} onChange={(e) => setEditingListing({ ...editingListing, hours: parseInt(e.target.value) || undefined })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" placeholder="e.g. 3500" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tonnage</label>
                      <input type="text" value={editingListing.tonnage || ''} onChange={(e) => setEditingListing({ ...editingListing, tonnage: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" placeholder="e.g. 20 Ton" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Weight</label>
                      <input type="text" value={editingListing.weight || ''} onChange={(e) => setEditingListing({ ...editingListing, weight: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" placeholder="e.g. 22,000 kg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                      <select value={editingListing.fuelType || ''} onChange={(e) => setEditingListing({ ...editingListing, fuelType: e.target.value as ListingItem['fuelType'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="">Select</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric/Hybrid">Electric / Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Condition</label>
                      <select value={editingListing.condition || ''} onChange={(e) => setEditingListing({ ...editingListing, condition: e.target.value as ListingItem['condition'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="Brand New">Brand New</option>
                        <option value="Excellent Condition">Excellent Condition</option>
                        <option value="Dealer Certified">Dealer Certified</option>
                        <option value="Used">Used</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {editingListing.category === 'properties' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 border-b border-emerald-100 pb-1 text-emerald-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Property Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Location</label>
                      <input type="text" value={editingListing.location} onChange={(e) => setEditingListing({ ...editingListing, location: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City / Region</label>
                      <input type="text" value={editingListing.city} onChange={(e) => setEditingListing({ ...editingListing, city: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Property Type</label>
                      <select value={editingListing.propertyType || ''} onChange={(e) => setEditingListing({ ...editingListing, propertyType: e.target.value as ListingItem['propertyType'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="">Select</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House / Villa">House / Villa</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Land">Land</option>
                        <option value="Townhouse">Townhouse</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Transaction Type</label>
                      <select value={editingListing.transactionType || ''} onChange={(e) => setEditingListing({ ...editingListing, transactionType: e.target.value as ListingItem['transactionType'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="">Select</option>
                        <option value="For Sale">For Sale</option>
                        <option value="For Rent">For Rent</option>
                      </select>
                    </div>
                  </div>
                  {editingListing.transactionType === 'For Rent' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price Period</label>
                      <select value={editingListing.pricePeriod || '/ month'} onChange={(e) => setEditingListing({ ...editingListing, pricePeriod: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="/ month">Per Month</option>
                        <option value="/ year">Per Year</option>
                        <option value="/ week">Per Week</option>
                      </select>
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Beds</label>
                      <input type="number" value={editingListing.beds || ''} onChange={(e) => setEditingListing({ ...editingListing, beds: parseInt(e.target.value) || undefined })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Baths</label>
                      <input type="number" value={editingListing.baths || ''} onChange={(e) => setEditingListing({ ...editingListing, baths: parseInt(e.target.value) || undefined })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Sqm</label>
                      <input type="number" value={editingListing.sqm || ''} onChange={(e) => setEditingListing({ ...editingListing, sqm: parseInt(e.target.value) || undefined })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Floors</label>
                      <input type="number" value={editingListing.floors || ''} onChange={(e) => setEditingListing({ ...editingListing, floors: parseInt(e.target.value) || undefined })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Parking</label>
                      <input type="text" value={editingListing.parking || ''} onChange={(e) => setEditingListing({ ...editingListing, parking: e.target.value })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400" placeholder="e.g. 2 covered spaces" />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Condition</label>
                      <select value={editingListing.condition || ''} onChange={(e) => setEditingListing({ ...editingListing, condition: e.target.value as ListingItem['condition'] })} className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white">
                        <option value="Brand New">Brand New</option>
                        <option value="Excellent Condition">Excellent Condition</option>
                        <option value="Used">Used</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* DESCRIPTION */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={editingListing.description}
                  onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                />
              </div>

              {/* SAVE / CANCEL */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingListing(null);
                    setRemovedImages([]);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 cursor-pointer">
                  Save Changes &amp; Sync Images
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
