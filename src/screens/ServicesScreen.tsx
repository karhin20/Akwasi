import React, { useState } from 'react';
import { 
  ClipboardList, 
  Bug, 
  Building2, 
  ChevronRight, 
  Shield, 
  HardHat, 
  BadgeCheck, 
  Clock, 
  Check, 
  Send, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { ScreenType } from '../types';

interface ServicesScreenProps {
  onNavigate?: (screen: ScreenType) => void;
  initialService?: 'fumigation' | 'management' | 'both';
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ 
  initialService = 'fumigation' 
}) => {
  const [selectedServiceType, setSelectedServiceType] = useState<'fumigation' | 'management' | 'both'>(initialService);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleScrollToQuote = (service?: 'fumigation' | 'management' | 'both') => {
    if (service) {
      setSelectedServiceType(service);
    }
    const quoteElement = document.getElementById('quote-form');
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col flex-grow bg-[#f8f9fb] text-[#191c1e]">
      <div className="max-w-[1280px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-14 space-y-16 sm:space-y-20">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              Professional Property Management &amp; Industrial Fumigation
            </h1>

            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              AkwasiJob Services provides robust, dependable solutions for maintaining and securing your high-value assets in Ghana. From large-scale industrial pest control to comprehensive commercial property oversight, we ensure operational continuity and asset preservation.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-request-quote-btn"
                onClick={() => handleScrollToQuote()}
                className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-sans font-semibold text-sm px-6 py-3.5 rounded-md shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Request Quote</span>
              </button>

              <a
                href="tel:+233302214500"
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-sans font-semibold text-sm px-6 py-3.5 rounded-md transition-colors inline-flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-slate-600" />
                <span>+233 30 221 4500</span>
              </a>
            </div>
          </div>

          <div className="h-80 sm:h-96 rounded-xl overflow-hidden shadow-md border border-slate-200 relative group bg-slate-900">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPtyT3wdemNuvcjwnL6Rq5nzI8VbuE_CdbbhcPPv_40RaNwfuvoqJ1Iow7y-YDx60iVq9Fn7fGKF4ts9z3PwAiNE5r7pgExsUdcYoXAQ42N2F1xjjK5WsUKPwXWwVXZqGekDaB4gbuOEfv7PCwpevplwiOjhjKzWkhGWmJiG2Z_Kk7jenc5HPUWOoW_PMU98U9e0kUdDmXawEAQZc7mK22JEdwFZOuBMtt_jYRJcE-KQKaTnZt4iALEQ"
              alt="Industrial warehouse inspection and property management in Ghana"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded">
                Verified Industrial Standard
              </span>
            </div>
          </div>
        </section>

        {/* Services Bento Grid */}
        <section className="space-y-8">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Our Core Services
              </h2>
              <p className="font-sans text-sm text-slate-600 mt-1">
                Engineered for Ghanaian industrial facilities, commercial plazas, and large residential estates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Fumigation Card */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col space-y-5 hover:border-[#4f6073] transition-all group">
              <div className="bg-[#cfe1f8]/60 w-16 h-16 rounded-full flex items-center justify-center text-[#4f6073] group-hover:bg-[#cfe1f8] transition-colors">
                <Bug className="w-8 h-8 text-[#37485b]" />
              </div>
              
              <h3 className="font-heading text-2xl font-bold text-slate-900">
                Industrial Fumigation
              </h3>
              
              <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed flex-grow">
                Rigorous pest eradication and prevention for warehouses, construction sites, and commercial properties. We use industry-standard, safe protocols to protect your inventory and infrastructure from structural damage and contamination.
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-2.5 font-sans text-sm font-medium text-slate-700">
                <div className="flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-[#f97316] shrink-0" />
                  <span>Pre-construction soil and foundation treatment</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-[#f97316] shrink-0" />
                  <span>Warehouse pest management &amp; grain silos</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-[#f97316] shrink-0" />
                  <span>EPA Ghana &amp; Health Ministry Compliance certification</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => handleScrollToQuote('fumigation')}
                  className="w-full py-2.5 border border-slate-300 hover:border-orange-500 hover:text-orange-600 font-sans text-sm font-semibold rounded-md text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book Fumigation Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Property Management Card */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col space-y-5 hover:border-[#4f6073] transition-all group">
              <div className="bg-[#cfe1f8]/60 w-16 h-16 rounded-full flex items-center justify-center text-[#4f6073] group-hover:bg-[#cfe1f8] transition-colors">
                <Building2 className="w-8 h-8 text-[#37485b]" />
              </div>
              
              <h3 className="font-heading text-2xl font-bold text-slate-900">
                Property Management
              </h3>
              
              <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed flex-grow">
                Comprehensive oversight of commercial and industrial real estate. We handle tenant relations, facility maintenance, security coordination, and financial reporting, ensuring your asset yields maximum return with minimum friction.
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-2.5 font-sans text-sm font-medium text-slate-700">
                <div className="flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-[#f97316] shrink-0" />
                  <span>Facility maintenance &amp; HVAC/power scheduling</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-[#f97316] shrink-0" />
                  <span>Tenant vetting &amp; commercial lease management</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-[#f97316] shrink-0" />
                  <span>24/7 Security coordination &amp; access control</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => handleScrollToQuote('management')}
                  className="w-full py-2.5 border border-slate-300 hover:border-orange-500 hover:text-orange-600 font-sans text-sm font-semibold rounded-md text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Request Management Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-[#edeef0]/70 rounded-xl p-6 sm:p-10 lg:p-12 border border-slate-200 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <div className="w-full lg:w-1/3 shrink-0">
            <div className="aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-sm border border-slate-300 relative group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoO92IKVDXCuHi5x_N8_VAEzF-ZpReOWtGMGHCEnt5dMNHou4mitgnSdV-hgjkWmDYUMeGyNMqy7iXl2nrWCtE3Fsga0rqrunRspcb41h3k8PXGMXOSbeT463RXOp_VWUzisNhkzduGNFU9ulN_hAx7iSmE9OZ-6yirtU6Ad6_R1tQKIuKVggDMgsjmuO_v7k5yxeoQmw35jREeyekiNUJMW-0abc-xLRrfJIY_IMf3NPAdtlX9zvijg"
                alt="Professional handshake representing trusted industrial partnership in Ghana"
              />
            </div>
          </div>

          <div className="w-full lg:w-2/3 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Enterprise Assurance</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Ghana's Premier Industrial Standard
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <Shield className="w-5 h-5 text-[#4f6073]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    Uncompromising Security
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We treat your assets with the utmost seriousness, implementing rigorous protocols for safety and preservation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <HardHat className="w-5 h-5 text-[#4f6073]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    Technical Expertise
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Our teams are specialized in high-value logistics, heavy machinery environments, and commercial real estate operations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <BadgeCheck className="w-5 h-5 text-[#4f6073]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    Verified Professionals
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Every technician and manager is fully vetted, licensed, and trained to meet strict industrial compliance standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5 text-[#4f6073]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                    Responsive Logistics
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Rapid deployment across key industrial zones in Accra, Tema, and Takoradi to minimize downtime swiftly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section 
          id="quote-form"
          className="max-w-3xl mx-auto bg-white rounded-xl p-6 sm:p-10 border border-slate-200 shadow-md scroll-mt-24"
        >
          <div className="text-center mb-8 space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Request a Service Quote
            </h2>
            <p className="font-sans text-sm text-slate-600 max-w-lg mx-auto">
              Provide details about your facility or asset management needs for a precise corporate consultation.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-green-950">
                Service Request Dispatched
              </h3>
              <p className="font-sans text-sm text-green-800 max-w-md mx-auto">
                Thank you, <strong>{contactName || 'Valued Client'}</strong>. Our specialized operations team has received your inquiry for <strong>{selectedServiceType === 'fumigation' ? 'Industrial Fumigation' : selectedServiceType === 'management' ? 'Property Management' : 'Comprehensive Package'}</strong> and will contact you within 2 business hours.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCompanyName('');
                    setContactName('');
                    setEmail('');
                    setPhone('');
                    setDetails('');
                  }}
                  className="px-5 py-2 rounded-md bg-green-800 text-white font-sans text-xs font-semibold hover:bg-green-900 transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} className="space-y-6">
              <div className="space-y-6">
                {/* Service Type Selection */}
                <div className="space-y-2.5">
                  <label className="font-sans text-sm font-semibold text-slate-900 block">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label 
                      className={`flex items-center gap-2.5 border px-4 py-3 rounded-md cursor-pointer transition-all ${
                        selectedServiceType === 'fumigation'
                          ? 'border-[#ea580c] bg-orange-50/60 ring-1 ring-[#ea580c] text-slate-900'
                          : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value="fumigation"
                        checked={selectedServiceType === 'fumigation'}
                        onChange={() => setSelectedServiceType('fumigation')}
                        className="accent-[#ea580c] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-sans text-xs sm:text-sm font-medium">
                        Industrial Fumigation
                      </span>
                    </label>

                    <label 
                      className={`flex items-center gap-2.5 border px-4 py-3 rounded-md cursor-pointer transition-all ${
                        selectedServiceType === 'management'
                          ? 'border-[#ea580c] bg-orange-50/60 ring-1 ring-[#ea580c] text-slate-900'
                          : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value="management"
                        checked={selectedServiceType === 'management'}
                        onChange={() => setSelectedServiceType('management')}
                        className="accent-[#ea580c] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-sans text-xs sm:text-sm font-medium">
                        Property Management
                      </span>
                    </label>

                    <label 
                      className={`flex items-center gap-2.5 border px-4 py-3 rounded-md cursor-pointer transition-all ${
                        selectedServiceType === 'both'
                          ? 'border-[#ea580c] bg-orange-50/60 ring-1 ring-[#ea580c] text-slate-900'
                          : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value="both"
                        checked={selectedServiceType === 'both'}
                        onChange={() => setSelectedServiceType('both')}
                        className="accent-[#ea580c] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-sans text-xs sm:text-sm font-medium">
                        Comprehensive Package
                      </span>
                    </label>
                  </div>
                </div>

                {/* Company & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5">
                    <label className="font-sans text-xs font-semibold text-slate-900 block" htmlFor="company">
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Atlas Logistics Ltd"
                      className="w-full h-11 px-3.5 border border-slate-300 rounded-md bg-white font-sans text-sm text-slate-900 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-xs font-semibold text-slate-900 block" htmlFor="contact_name">
                      Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact_name"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full h-11 px-3.5 border border-slate-300 rounded-md bg-white font-sans text-sm text-slate-900 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5">
                    <label className="font-sans text-xs font-semibold text-slate-900 block" htmlFor="email">
                      Corporate Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@company.com"
                      className="w-full h-11 px-3.5 border border-slate-300 rounded-md bg-white font-sans text-sm text-slate-900 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-xs font-semibold text-slate-900 block" htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 24 000 0000"
                      className="w-full h-11 px-3.5 border border-slate-300 rounded-md bg-white font-sans text-sm text-slate-900 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-semibold text-slate-900 block" htmlFor="details">
                    Property / Facility Details
                  </label>
                  <textarea
                    id="details"
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Please describe the size, location, and specific requirements of the facility..."
                    className="w-full p-3.5 border border-slate-300 rounded-md bg-white font-sans text-sm text-slate-900 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-sans text-sm font-semibold px-8 py-3 rounded-md transition-colors shadow-xs w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>

      </div>
    </div>
  );
};
