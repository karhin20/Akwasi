import React, { useState } from 'react';
import { ScreenType } from '../types';
import { subscriptions } from '../lib/api';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenService: (serviceName: string) => void;
  onOpenSmsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenService, onOpenSmsModal }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = phone.trim().replace(/\s+/g, '');
    if (!clean || clean.length < 9) {
      setErrorMsg('Enter valid number');
      return;
    }

    try {
      setLoading(true);
      await subscriptions.subscribe({ phone: clean, categories: ['all'] });
      localStorage.setItem('akwasi_sms_subscribed', 'true');
      setSuccess(true);
      setPhone('');
    } catch {
      setErrorMsg('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#111827] text-slate-400 mt-auto border-t border-slate-800/80">
      {/* Footer top SMS Alert Banner */}
      <div className="border-b border-slate-800/60 bg-slate-900/60 py-8 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-base font-bold text-white tracking-tight">
              Get Instant SMS Deal Alerts
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Be the first to know when new cars, heavy machinery, or properties are listed in Ghana.
            </p>
          </div>

          {success ? (
            <div className="flex items-center text-emerald-400 text-sm font-semibold bg-emerald-950/40 border border-emerald-800/50 px-4 py-2.5 rounded-xl">
              <span>Subscribed for SMS alerts!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="tel"
                  placeholder="Enter phone (e.g. 0594594245)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                {errorMsg && (
                  <span className="absolute -bottom-5 left-1 text-[10px] text-red-400 font-medium">
                    {errorMsg}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loading ? <span>Subscribing...</span> : <span>Subscribe SMS</span>}
              </button>
              {onOpenSmsModal && (
                <button
                  type="button"
                  onClick={onOpenSmsModal}
                  className="text-xs text-slate-400 hover:text-orange-400 underline font-medium px-2 py-1 cursor-pointer"
                >
                  More Options
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      <div className="w-full py-12 px-4 sm:px-8 lg:px-12 max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="mb-4">
            <span className="bg-[#f97316] text-white px-2.5 py-1 rounded-md text-lg font-black tracking-tight inline-block shadow-xs">
              AkwasiJob
            </span>
          </div>
          <p className="font-sans text-sm font-medium text-slate-300 mb-6 leading-relaxed">
            Ghana's Premier Industrial Marketplace.
          </p>
          <p className="font-sans text-xs text-slate-500 leading-relaxed">
            © {new Date().getFullYear()} AkwasiJob Properties and Vehicles. All rights reserved.
          </p>
        </div>

        {/* Marketplaces */}
        <div>
          <h5 className="font-sans text-sm font-bold mb-4 text-white">
            Marketplaces
          </h5>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={() => onNavigate('vehicles')}
                className="font-sans text-sm text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Cars & Vehicles
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('machinery')}
                className="font-sans text-sm text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Heavy Machinery
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('properties')}
                className="font-sans text-sm text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Properties
              </button>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h5 className="font-sans text-sm font-bold mb-4 text-white">
            Services
          </h5>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={() => onOpenService('Fumigation Services')}
                className="font-sans text-sm text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Fumigation Services
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenService('Property Management')}
                className="font-sans text-sm text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Property Management
              </button>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h5 className="font-sans text-sm font-bold mb-4 text-white">
            Legal
          </h5>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={() => onOpenService('Terms of Sale')}
                className="font-sans text-sm text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Terms of Sale
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenService('Privacy Policy')}
                className="font-sans text-sm text-slate-400 hover:text-white transition-colors text-left cursor-pointer"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 className="font-sans text-sm font-bold mb-4 text-white">
            Support
          </h5>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <button
                onClick={() => onOpenService('Support')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Contact Support
              </button>
            </li>
            <li>
              <a
                href="tel:0247111605"
                className="hover:text-white transition-colors text-left flex items-center gap-1.5"
              >
                <span>Call: 0247111605</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/233594594245"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 text-emerald-500 font-medium transition-colors text-left flex items-center gap-1.5"
              >
                <span>WhatsApp: +233594594245</span>
              </a>
            </li>
            {onOpenSmsModal && (
              <li>
                <button
                  onClick={onOpenSmsModal}
                  className="hover:text-orange-400 transition-colors text-left cursor-pointer text-orange-500 font-semibold"
                >
                  <span>SMS Alerts</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
};
