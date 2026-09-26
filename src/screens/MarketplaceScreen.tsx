import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingBag,
  Car,
  Cpu,
  Package,
  Layers,
  Star,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { ListingItem } from '../types';
import { listings as listingsApi } from '../lib/api';

// ─── Sub-category config ─────────────────────────────────────────────────────
const SUB_CATEGORIES = [
  { id: 'all',         label: 'All Items',   icon: Layers,      color: 'bg-slate-900 text-white' },
  { id: 'Car Parts',   label: 'Car Parts',   icon: Car,         color: 'bg-blue-600 text-white' },
  { id: 'Car Rentals', label: 'Car Rentals', icon: ShoppingBag, color: 'bg-amber-500 text-white' },
  { id: 'Electronics', label: 'Electronics', icon: Cpu,         color: 'bg-violet-600 text-white' },
  { id: 'Other',       label: 'Other',       icon: Package,     color: 'bg-teal-600 text-white' },
];

const BADGE_STYLES: Record<string, string> = {
  'Car Parts':   'bg-blue-100 text-blue-700 border-blue-200',
  'Car Rentals': 'bg-amber-100 text-amber-700 border-amber-200',
  'Electronics': 'bg-violet-100 text-violet-700 border-violet-200',
  'Other':       'bg-teal-100 text-teal-700 border-teal-200',
};

const LISTING_TYPE_BADGE: Record<string, string> = {
  'For Sale':  'bg-emerald-100 text-emerald-700',
  'For Rent':  'bg-sky-100 text-sky-700',
  'Service':   'bg-orange-100 text-orange-700',
};

// ─── Gallery Modal ────────────────────────────────────────────────────────────
interface GalleryProps {
  images: string[];
  startIndex?: number;
  onClose: () => void;
}
const GalleryModal: React.FC<GalleryProps> = ({ images, startIndex = 0, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 rounded-full cursor-pointer"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      <div
        className="relative max-w-4xl w-full px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[idx]}
          alt={`Image ${idx + 1}`}
          className="w-full max-h-[75vh] object-contain rounded-xl"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIdx((p) => Math.max(0, p - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIdx((p) => Math.min(images.length - 1, p + 1))}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        <p className="text-white/50 text-xs text-center mt-3">
          {idx + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};

// ─── Marketplace Detail View ──────────────────────────────────────────────────
interface DetailProps {
  item: ListingItem;
  onBack: () => void;
}
const MarketplaceDetail: React.FC<DetailProps> = ({ item, onBack }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const allImages = useMemo(() => {
    const imgs = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
    return imgs.filter(Boolean);
  }, [item]);

  const subCat = item.subCategory || 'Other';
  const badgeCls = BADGE_STYLES[subCat] || BADGE_STYLES['Other'];
  const listingType = (item as ListingItem & { listingType?: string }).listingType;
  const ltBadge = listingType ? LISTING_TYPE_BADGE[listingType] || 'bg-slate-100 text-slate-600' : null;

  const phone = item.seller?.phone || '';
  const whatsapp = item.seller?.whatsapp || phone;
  const wa = whatsapp.replace(/\D/g, '');
  const encodedTitle = encodeURIComponent(`Hi, I'm interested in "${item.title}" on AkwasiJob Marketplace.`);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {galleryOpen && (
        <GalleryModal images={allImages} startIndex={activeImg} onClose={() => setGalleryOpen(false)} />
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center gap-3 shadow-xs">
        <button
          id="marketplace-detail-back-btn"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Marketplace</span>
        </button>
        <span className="text-slate-300">›</span>
        <span className="text-sm text-slate-500 truncate max-w-[200px]">{item.title}</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Images */}
        <div className="lg:col-span-3 space-y-3">
          {/* Main Image */}
          <div
            className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] cursor-zoom-in group"
            onClick={() => setGalleryOpen(true)}
          >
            <img
              src={allImages[activeImg] || allImages[0]}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {allImages.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {activeImg + 1} / {allImages.length}
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImg === i ? 'border-orange-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" />
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{item.description}</p>
            </div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeCls}`}>
              <Tag className="w-3 h-3" />
              {subCat}
            </span>
            {ltBadge && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${ltBadge}`}>
                {listingType}
              </span>
            )}
            {item.condition && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                <BadgeCheck className="w-3 h-3" />
                {item.condition}
              </span>
            )}
            {item.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
                <Star className="w-3 h-3 fill-orange-500" />
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-slate-900 leading-snug">{item.title}</h1>

          {/* Price */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
            <div className="text-xs font-bold uppercase text-slate-400 mb-1">Price</div>
            <div className="text-3xl font-black tracking-tight">
              {item.priceFormatted || `GH₵ ${item.price?.toLocaleString()}`}
            </div>
            {item.pricePeriod && (
              <div className="text-sm text-slate-400 mt-0.5">{item.pricePeriod}</div>
            )}
          </div>

          {/* Location */}
          {item.location && (
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-white rounded-xl px-4 py-3 border border-slate-200">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span>{item.location}{item.city && item.city !== item.location ? `, ${item.city}` : ''}</span>
            </div>
          )}

          {/* Seller */}
          {item.seller && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Seller / Contact</h3>
                {item.seller.verified && (
                  <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <BadgeCheck className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-slate-800">{item.seller.name}</div>
              {item.seller.location && (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.seller.location}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-2 pt-1">
                {whatsapp && (
                  <a
                    id="marketplace-detail-whatsapp-btn"
                    href={`https://wa.me/${wa}?text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                )}
                {phone && (
                  <a
                    id="marketplace-detail-phone-btn"
                    href={`tel:${phone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Call Seller
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Date */}
          {item.updatedTime && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium px-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Listed: {item.updatedTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Listing Card ─────────────────────────────────────────────────────────────
interface CardProps {
  item: ListingItem;
  onClick: () => void;
}
const MarketplaceCard: React.FC<CardProps> = ({ item, onClick }) => {
  const subCat = item.subCategory || 'Other';
  const badgeCls = BADGE_STYLES[subCat] || BADGE_STYLES['Other'];
  const listingType = (item as ListingItem & { listingType?: string }).listingType;
  const ltBadge = listingType ? LISTING_TYPE_BADGE[listingType] : null;
  const phone = item.seller?.phone || item.seller?.whatsapp || '';
  const wa = phone.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(`Hi, I'm interested in "${item.title}" on AkwasiJob Marketplace.`);

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/80 flex flex-col"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100 aspect-[4/3]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Package className="w-12 h-12" />
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeCls}`}>
            {subCat}
          </span>
          {ltBadge && listingType && (
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${ltBadge}`}>
              {listingType}
            </span>
          )}
        </div>
        {item.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <Star className="w-2.5 h-2.5 fill-white" /> Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {item.title}
        </h3>

        {item.condition && (
          <span className="mt-1.5 text-[11px] font-semibold text-slate-500">{item.condition}</span>
        )}

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              {item.priceFormatted || `GH₵ ${item.price?.toLocaleString()}`}
            </div>
            {item.pricePeriod && (
              <div className="text-xs text-slate-400">{item.pricePeriod}</div>
            )}
          </div>
        </div>

        {item.location && (
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400 font-medium">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}

        {/* Footer: WhatsApp */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          {wa ? (
            <a
              href={`https://wa.me/${wa}?text=${encodedMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-50 hover:bg-emerald-500 border border-emerald-200 hover:border-emerald-500 text-emerald-700 hover:text-white text-xs font-bold rounded-xl transition-all duration-200"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          ) : (
            <div className="text-center text-xs text-slate-400">Click to view details</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const MarketplaceScreen: React.FC = () => {
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await listingsApi.getAll({ category: 'general_goods' });
        setItems(data.filter((d) => (d as ListingItem).status !== 'rejected') as ListingItem[]);
      } catch (err) {
        console.error('Failed to load marketplace listings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat =
        activeCategory === 'all' || item.subCategory === activeCategory;
      const matchQ =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q) ||
        (item.subCategory || '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [items, activeCategory, searchQuery]);

  // ── Detail view ──────────────────────────────────────────────────────────
  if (selectedItem) {
    return (
      <MarketplaceDetail
        item={selectedItem}
        onBack={() => {
          setSelectedItem(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // ── Browse view ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <ShoppingBag className="w-3.5 h-3.5" />
              AkwasiJob Marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              General Goods &<br />
              <span className="text-orange-500">Services</span>
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Curated marketplace listings — car parts, rentals, electronics and more. All items verified and posted by AkwasiJob.
            </p>

            {/* Search */}
            <div className="mt-8 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="marketplace-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, categories, locations..."
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder-slate-400 text-sm outline-none focus:border-orange-500 focus:bg-white/15 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {SUB_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`marketplace-cat-${cat.id.toLowerCase().replace(/\s/g, '-')}-btn`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? cat.color
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  {cat.id !== 'all' && (
                    <span
                      className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {items.filter((i) => i.subCategory === cat.id).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
        {/* Results bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-500 font-medium">
            {loading ? (
              <span>Loading marketplace…</span>
            ) : (
              <span>
                <span className="font-black text-slate-900">{filtered.length}</span>{' '}
                {filtered.length === 1 ? 'item' : 'items'} found
                {searchQuery && (
                  <span>
                    {' '}for &ldquo;<span className="text-orange-500 font-semibold">{searchQuery}</span>&rdquo;
                  </span>
                )}
              </span>
            )}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="bg-slate-200 aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-5 bg-slate-200 rounded w-2/5 mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">No items found</h3>
            <p className="text-slate-500 max-w-sm text-sm">
              {searchQuery
                ? `No marketplace listings match "${searchQuery}". Try different keywords or clear your search.`
                : 'No marketplace items in this category yet. Check back soon!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View All Items
              </button>
            )}
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <MarketplaceCard
                key={item.id}
                item={item}
                onClick={() => {
                  setSelectedItem(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
