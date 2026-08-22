import React, { useState } from 'react';
import {
  X,
  Share2,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Gauge,
  MapPin,
  FileText,
  Building,
  Check
} from 'lucide-react';
import { ListingItem } from '../types';

interface ListingDetailModalProps {
  listing: ListingItem | null;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose
}) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!listing) return null;

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 4000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-slate-200 relative max-h-[92vh] flex flex-col">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            {listing.featured && (
              <span className="bg-[#f97316] text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Featured
              </span>
            )}
            {listing.recentlyReduced && (
              <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Recently Reduced
              </span>
            )}
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              ID: {listing.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors relative"
              title="Share listing"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Top Banner: Image + Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image Showcase */}
            <div className="md:col-span-7 relative h-72 sm:h-84 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.category !== 'cars_vehicles' && listing.category !== 'heavy_machinery' && (
                <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white px-3 py-1 rounded-md text-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>{listing.location}, Ghana</span>
                </div>
              )}
            </div>

            {/* Title, Price, and Quick Action Summary */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 leading-tight mb-2">
                  {listing.title}
                </h2>
                <p className="font-sans text-sm text-slate-500 mb-4">
                  {listing.condition || 'Verified Asset'} • {listing.make || 'Commercial'}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                  <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">
                    Asking Price (Ghana Cedis)
                  </div>
                  <div className="font-heading text-3xl font-bold text-slate-900">
                    {listing.priceFormatted}
                    {listing.pricePeriod && (
                      <span className="text-sm font-normal text-slate-500">
                        {' '}
                        {listing.pricePeriod}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Eligible for AkwasiJob Inspection & Escrow</span>
                  </div>
                </div>
              </div>

              {/* Direct Seller Contact Buttons */}
              <div className="space-y-2">
                <a
                  href={`tel:${listing.seller?.phone || '+233302214500'}`}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-lg font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Seller: {listing.seller?.phone || '+233 30 221 4500'}</span>
                </a>
                <a
                  href={`https://wa.me/${(listing.seller?.whatsapp || '233244123456').replace(/[^0-9]/g, '')}?text=Hello,%20I%20am%20interested%20in%20the%20${encodeURIComponent(listing.title)}%20listed%20on%20AkwasiJob`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Inquiries</span>
                </a>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">
              Technical Specifications & Details
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {listing.year && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Model Year</span>
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {listing.year}
                  </div>
                </div>
              )}

              {listing.hours && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Operating Hours</span>
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {listing.hours.toLocaleString()} hrs
                  </div>
                </div>
              )}

              {listing.mileage && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                    <Gauge className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mileage</span>
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {listing.mileage}
                  </div>
                </div>
              )}

              {listing.tonnage && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Weight / Tonnage</span>
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {listing.tonnage}
                  </div>
                </div>
              )}

              {listing.fuelType && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                    <span>Fuel Type</span>
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {listing.fuelType}
                  </div>
                </div>
              )}

              {listing.transmission && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1 mb-1">
                    <span>Transmission</span>
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {listing.transmission}
                  </div>
                </div>
              )}

              {listing.beds !== undefined && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    Bedrooms
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {listing.beds} Beds
                  </div>
                </div>
              )}

              {(listing.showers !== undefined || listing.baths !== undefined) && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    Showers
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {Math.round(listing.showers ?? listing.baths ?? 0)} Showers
                  </div>
                </div>
              )}

              {listing.sqm && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    Floor Space
                  </div>
                  <div className="font-sans font-bold text-slate-900 text-base">
                    {listing.sqm} sqm
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
              Overview & Condition Report
            </h3>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Quick Inquiry Form */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-3">
              Request Official Quotation or Schedule Site Visit
            </h3>

            {inquirySent ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-sm">Inquiry Transmitted Successfully!</div>
                  <div className="text-xs text-emerald-700">The verified asset manager will contact you within 30 minutes.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:border-[#f97316] outline-none"
                />
                <input
                  type="tel"
                  placeholder="Your Phone / WhatsApp"
                  required
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:border-[#f97316] outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Send Inquiry Now
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Verified by AkwasiJob Technical Inspection Team
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
