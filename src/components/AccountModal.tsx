import React from 'react';
import { X, User, Package, ShieldCheck, Mail, Phone } from 'lucide-react';
import { ListingItem } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userListings: ListingItem[];
  onSelectListing: (listing: ListingItem) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  userListings,
  onSelectListing
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                User Account & Inquiries
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                AkwasiJob Verified Buyer Hub • Ghana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Support Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-[#f97316]" />
              <span>support@akwasijob.com.gh</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-[#f97316]" />
              <span>+233 30 221 4500 (Accra & Tema)</span>
            </div>
          </div>

          {/* User's Posted Listings */}
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-3">
              <Package className="w-4 h-4 text-slate-500" />
              Your Active Market Listings ({userListings.length})
            </h4>

            {userListings.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                You haven't posted any machinery or vehicles yet.
              </div>
            ) : (
              <div className="space-y-2">
                {userListings.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => {
                        onClose();
                        onSelectListing(item);
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-heading font-bold text-xs text-slate-900">
                          {item.title}
                        </div>
                        <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <span>Active • {item.priceFormatted}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                      Live
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
