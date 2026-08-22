import React, { useState } from 'react';
import { X, ShieldCheck, Home, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicesModalProps {
  serviceName: string | null;
  onClose: () => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  serviceName,
  onClose
}) => {
  const [selectedService, setSelectedService] = useState<string>(
    serviceName && serviceName !== 'Heavy Machinery Logistics' ? serviceName : 'Fumigation Services'
  );
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!serviceName) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-heading text-lg font-bold text-slate-900">
            AkwasiJob Enterprise Services
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Service Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedService('Fumigation Services')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedService === 'Fumigation Services'
                  ? 'border-[#f97316] bg-orange-50/60 ring-1 ring-[#f97316] shadow-2xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-6 h-6 text-[#f97316] mb-2" />
              <div className="font-heading font-bold text-sm text-slate-900">
                Fumigation Services
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Commercial pest control, industrial warehouse disinfection & soil treatment.
              </div>
            </button>

            <button
              onClick={() => setSelectedService('Property Management')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedService === 'Property Management'
                  ? 'border-[#f97316] bg-orange-50/60 ring-1 ring-[#f97316] shadow-2xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Home className="w-6 h-6 text-[#f97316] mb-2" />
              <div className="font-heading font-bold text-sm text-slate-900">
                Property Management
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Tenant leasing, commercial facility upkeep & rent escrow oversight.
              </div>
            </button>
          </div>

          {/* Service Details Card */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="font-heading font-bold text-base text-slate-900 mb-2">
              {selectedService}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {selectedService === 'Fumigation Services' &&
                'EPA-approved commercial fumigation treatments for shipping containers, agro-storage facilities, commercial office buildings, and residential complexes with official compliance certification.'}
              {selectedService === 'Property Management' &&
                'End-to-end commercial asset custody: facility management, vetted tenant matching, commercial lease drafting under Ghana real estate regulations, and facility maintenance.'}
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-800">
              <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                Greater Accra &amp; Ashanti Coverage
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                EPA Certified Technicians
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                Guaranteed Compliance
              </span>
            </div>
          </div>

          {/* Booking / Contact Form */}
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-sm">Service Request Logged!</div>
                <div className="text-xs text-emerald-700">Our logistics coordinator will call you to confirm dispatch schedule.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-3">
              <h5 className="font-heading font-bold text-sm text-slate-900">
                Request Rapid Quote / Book Service
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name or Company"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-[#f97316] shadow-2xs"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone / WhatsApp Number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-[#f97316] shadow-2xs"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Dispatch Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
