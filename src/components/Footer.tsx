import React from 'react';
import { ScreenType } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenService: (serviceName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenService }) => {
  return (
    <footer className="bg-[#111827] text-slate-400 mt-auto border-t border-slate-800/80">
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
          </ul>
        </div>
      </div>
    </footer>
  );
};
