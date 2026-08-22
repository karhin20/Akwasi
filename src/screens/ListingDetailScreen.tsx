import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Building,
  Bed,
  Bath,
  Car,
  Wind,
  Phone,
  MessageSquare,
  ExternalLink,
  Camera,
  Video,
  Flag,
  Clock,
  Check,
  Compass,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  Fuel,
  Gauge,
  Weight,
  Wrench
} from 'lucide-react';
import { ListingItem, ScreenType } from '../types';
import { ImageGalleryModal } from '../components/ImageGalleryModal';

interface ListingDetailScreenProps {
  listing: ListingItem;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectListing: (listing: ListingItem) => void;
  allListings: ListingItem[];
}

export const ListingDetailScreen: React.FC<ListingDetailScreenProps> = ({
  listing,
  onBack,
  onNavigate,
  onSelectListing,
  allListings
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mapViewType, setMapViewType] = useState<'map' | 'satellite'>('map');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Build images array
  const images = listing.gallery && listing.gallery.length > 0 
    ? listing.gallery 
    : [listing.image];

  const openGalleryAt = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: listing.currency === 'USD' ? 'USD' : 'GHS',
      maximumFractionDigits: 0
    }).format(val).replace('GHS', 'GH₵');
  };

  // Category specific back label
  const getBackLabel = () => {
    if (listing.category === 'properties') {
      return `See all properties for ${listing.transactionType === 'For Rent' ? 'rent' : 'sale'} in ${listing.city || 'Accra'}`;
    }
    if (listing.category === 'heavy_machinery') {
      return `See all heavy machinery & equipment in ${listing.city || 'Ghana'}`;
    }
    return `See all cars & vehicles in ${listing.city || 'Ghana'}`;
  };

  // Similar listings
  const similarItems = allListings
    .filter((item) => item.category === listing.category && item.id !== listing.id)
    .slice(0, 3);

  return (
    <div id="listing-detail-page" className="min-h-screen bg-[#f8f9fb] pb-24 text-slate-800 antialiased">
      {/* Top Breadcrumbs & Utility Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            type="button"
            id="back-to-listings-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#f97316] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
            <span>{getBackLabel()}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="share-listing-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Photo Mosaic Gallery */}
        <section aria-label="Photo Gallery" className="relative rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200">
          {/* Desktop Mosaic (1 Large + 4 Small) */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[440px] p-2 bg-slate-100">
            {/* Main Featured Photo (Col 1-2, Row 1-2) */}
            <div
              onClick={() => openGalleryAt(0)}
              className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group bg-slate-200"
            >
              <img
                src={images[0]}
                alt={`${listing.title} - Main photo`}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-medium bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  Click to view full screen
                </span>
              </div>
            </div>

            {/* Thumbnail 1 */}
            <div
              onClick={() => openGalleryAt(1 % images.length)}
              className="relative rounded-xl overflow-hidden cursor-pointer group bg-slate-200"
            >
              <img
                src={images[1 % images.length]}
                alt={`${listing.title} - photo 2`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail 2 */}
            <div
              onClick={() => openGalleryAt(2 % images.length)}
              className="relative rounded-xl overflow-hidden cursor-pointer group bg-slate-200"
            >
              <img
                src={images[2 % images.length]}
                alt={`${listing.title} - photo 3`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail 3 */}
            <div
              onClick={() => openGalleryAt(3 % images.length)}
              className="relative rounded-xl overflow-hidden cursor-pointer group bg-slate-200"
            >
              <img
                src={images[3 % images.length]}
                alt={`${listing.title} - photo 4`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail 4 */}
            <div
              onClick={() => openGalleryAt(4 % images.length)}
              className="relative rounded-xl overflow-hidden cursor-pointer group bg-slate-200"
            >
              <img
                src={images[4 % images.length]}
                alt={`${listing.title} - photo 5`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              {images.length > 5 && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center text-white font-semibold text-sm group-hover:bg-slate-950/70 transition-colors">
                  +{images.length - 5} More Photos
                </div>
              )}
            </div>
          </div>

          {/* Mobile Single Photo Stage */}
          <div className="md:hidden relative h-72 w-full bg-slate-200 cursor-pointer" onClick={() => openGalleryAt(0)}>
            <img
              src={images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Gallery Controls Badge */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-slate-950/85 hover:bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-slate-700/80 transition-all cursor-pointer">
            <button
              type="button"
              id="open-all-photos-badge"
              onClick={() => openGalleryAt(0)}
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors pr-2 border-r border-slate-700"
            >
              <Camera className="w-3.5 h-3.5 text-orange-400" />
              <span>{images.length} Photos</span>
            </button>

            <button
              type="button"
              id="open-video-badge"
              onClick={() => openGalleryAt(0)}
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors pl-1 text-slate-400"
            >
              <Video className="w-3.5 h-3.5 text-slate-400" />
              <span>{listing.videoCount || 0} Video</span>
            </button>
          </div>
        </section>

        {/* Title, Location & Primary Header */}
        <div className="mt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {listing.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                  Featured
                </span>
              )}
              {listing.transactionType && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  {listing.transactionType}
                </span>
              )}
              {listing.condition && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {listing.condition}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {listing.title}
            </h1>

            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-[#f97316] shrink-0" />
              <span>{listing.location || `${listing.city}, Ghana`}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-left md:text-right min-w-[220px]">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Asking Price
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {listing.priceFormatted || formatCurrency(listing.price)}
              {listing.pricePeriod && (
                <span className="text-sm font-normal text-slate-500">{listing.pricePeriod}</span>
              )}
            </div>
            {listing.priceUsd && (
              <div className="text-xs font-semibold text-slate-500 mt-1">
                {listing.priceUsd}
              </div>
            )}
          </div>
        </div>

        {/* Listing Meta Info Bar */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Type:</div>
              <div className="text-sm font-bold text-slate-900">
                {listing.propertyType || listing.subCategory || 'Asset'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Updated:</div>
              <div className="text-sm font-bold text-slate-900">
                {listing.updatedTime || '1 day ago'}
              </div>
            </div>
          </div>
        </div>

        {/* Key Quick Specifications Row (Beds, Baths, Parking, AC) */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {listing.beds !== undefined && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                <Bed className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Beds</div>
                <div className="text-base font-bold text-slate-900">{listing.beds}</div>
              </div>
            </div>
          )}

          {listing.baths !== undefined && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                <Bath className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Baths</div>
                <div className="text-base font-bold text-slate-900">{listing.baths}</div>
              </div>
            </div>
          )}

          {listing.parking !== undefined && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                <Car className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Parking</div>
                <div className="text-base font-bold text-slate-900">{listing.parking}</div>
              </div>
            </div>
          )}

          {listing.conditioning && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                <Wind className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Conditioning</div>
                <div className="text-base font-bold text-slate-900">{listing.conditioning}</div>
              </div>
            </div>
          )}

          {/* Fallbacks for Vehicles & Heavy Machinery */}
          {listing.year && listing.beds === undefined && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                <Calendar className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Year</div>
                <div className="text-base font-bold text-slate-900">{listing.year}</div>
              </div>
            </div>
          )}

          {listing.mileage && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                <Gauge className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Mileage</div>
                <div className="text-base font-bold text-slate-900">{listing.mileage}</div>
              </div>
            </div>
          )}

          {listing.hours && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                <Clock className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Operating Hours</div>
                <div className="text-base font-bold text-slate-900">{listing.hours.toLocaleString()} hrs</div>
              </div>
            </div>
          )}

          {listing.tonnage && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                <Weight className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Operating Weight</div>
                <div className="text-base font-bold text-slate-900">{listing.tonnage}</div>
              </div>
            </div>
          )}
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (2 Cols) - Detailed Overview, Highlights, Layout */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>Description</span>
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </div>
            </div>

            {/* Property Features / Key Highlights */}
            {listing.features && listing.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  {listing.category === 'properties' ? 'Property Features' : 'Key Highlights & Equipment'}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-orange-100 text-[#f97316] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apartment / Asset Layout Details (Matches Screenshot 2) */}
            {listing.layoutDetails && listing.layoutDetails.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  {listing.category === 'properties' ? 'Apartment Layout' : 'Technical Specifications'}
                </h2>
                <div className="space-y-4">
                  {listing.layoutDetails.map((layout, idx) => (
                    <div key={idx} className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#f97316]" />
                        <span>{layout.title}</span>
                      </h3>
                      <ul className="space-y-1.5 pl-6 list-disc text-xs sm:text-sm text-slate-600">
                        {layout.items.map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specification Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Detailed Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {listing.sqm && (
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-500">Floor Area</span>
                    <span className="font-semibold text-slate-900">{listing.sqm} sqm</span>
                  </div>
                )}
                {listing.make && (
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-500">Manufacturer</span>
                    <span className="font-semibold text-slate-900">{listing.make}</span>
                  </div>
                )}
                {listing.model && (
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-500">Model</span>
                    <span className="font-semibold text-slate-900">{listing.model}</span>
                  </div>
                )}
                {listing.fuelType && (
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-500">Fuel Type</span>
                    <span className="font-semibold text-slate-900">{listing.fuelType}</span>
                  </div>
                )}
                {listing.transmission && (
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-500">Transmission</span>
                    <span className="font-semibold text-slate-900">{listing.transmission}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                  <span className="text-slate-500">Listing ID</span>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {listing.id.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                  <span className="text-slate-500">Inspection Status</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Verified & Cleared
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="space-y-6 lg:sticky lg:top-28">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Contact
              </div>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[#f97316] text-lg shrink-0">
                  A
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base flex items-center gap-1">
                    AkwasiJob
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  </div>
                  <div className="text-xs text-slate-500">
                    {listing.seller?.location || 'Accra, Ghana'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-3">
                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${(listing.seller?.whatsapp || '233244123456').replace(/\D/g, '')}?text=Hello,%20I%20am%20interested%20in%20"${encodeURIComponent(listing.title)}"%20listed%20on%20AkwasiJob%20(ID:%20${listing.id}).%20Is%20it%20still%20available?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="whatsapp-seller-btn"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5 text-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Enquire via WhatsApp</span>
                </a>

                {/* Call Button */}
                <a
                  href={`tel:${listing.seller?.phone || '+233302214500'}`}
                  id="call-seller-btn"
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all cursor-pointer text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {listing.seller?.phone || '+233 30 221 4500'}</span>
                </a>
              </div>
            </div>

            {/* Interactive Location Map Card (Matches Screenshot 2) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#f97316]" />
                  <span>Location & Vicinity</span>
                </h3>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMapViewType('map')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      mapViewType === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapViewType('satellite')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      mapViewType === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* Map Canvas Graphic */}
              <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                {mapViewType === 'map' ? (
                  <div className="w-full h-full bg-[#e5e3df] relative flex items-center justify-center">
                    {/* Simulated Map Roads Grid */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-amber-200/80 -translate-y-1/2" />
                    <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-amber-100" />
                    <div className="absolute top-0 bottom-0 right-1/4 w-2 bg-white" />
                    
                    {/* Map Marker */}
                    <div className="relative z-10 flex flex-col items-center animate-bounce">
                      <div className="bg-[#f97316] text-white p-2 rounded-full shadow-lg ring-4 ring-orange-400/30">
                        <MapPin className="w-5 h-5 fill-white" />
                      </div>
                      <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                        {listing.city || 'Ridge, Accra'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-800 relative flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                      alt="Satellite View"
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="bg-[#f97316] text-white p-2 rounded-full shadow-lg ring-4 ring-orange-400/40">
                        <MapPin className="w-5 h-5 fill-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-600 flex items-start gap-1.5">
                <Compass className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{listing.location || 'Prestigious Ridge Residential Enclave, Greater Accra'}</span>
              </div>

              {/* Report Property Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="text-xs text-slate-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report this listing</span>
                </button>
                <span className="text-[10px] text-slate-400">ID: {listing.id.substring(0, 10)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings Carousel / Row */}
        {similarItems.length > 0 && (
          <section className="mt-16 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Similar {listing.category === 'properties' ? 'Properties' : 'Equipment'} You May Like
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hand-picked alternatives with verified inspection history
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectListing(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.subCategory || item.category}
                      </span>
                    </div>
                    {item.gallery && item.gallery.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>{item.gallery.length}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#f97316] transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location || item.city}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-extrabold text-slate-900">
                        {item.priceFormatted || formatCurrency(item.price)}
                      </span>
                      <span className="text-xs font-semibold text-[#f97316] flex items-center gap-0.5">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating Bottom Bar on Mobile for Instant Contact */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-40 flex items-center gap-2 shadow-xl">
        <a
          href={`https://wa.me/${(listing.seller?.whatsapp || '233244123456').replace(/\D/g, '')}?text=Hello,%20I%20am%20interested%20in%20"${encodeURIComponent(listing.title)}"%20listed%20on%20AkwasiJob.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>WhatsApp</span>
        </a>
        <a
          href={`tel:${listing.seller?.phone || '+233302214500'}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Call AkwasiJob</span>
        </a>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Report Listing</h3>
            <p className="text-xs text-slate-600 mb-4">
              Help us maintain marketplace integrity. What is the issue with "{listing.title}"?
            </p>
            {reportSubmitted ? (
              <div className="py-6 text-center text-emerald-600">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2" />
                <div className="font-bold text-sm">Report Submitted</div>
                <div className="text-xs text-slate-500 mt-1">
                  Our verification team has flagged this listing for review.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsReportOpen(false);
                    setReportSubmitted(false);
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {['Item already sold', 'Incorrect price or details', 'Suspicious seller activity', 'Other policy violation'].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setReportSubmitted(true)}
                    className="w-full text-left px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 mt-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multi-Image Fullscreen Lightbox Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={images}
        initialIndex={galleryStartIndex}
        title={listing.title}
      />
    </div>
  );
};
