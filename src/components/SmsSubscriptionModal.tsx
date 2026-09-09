import React, { useState } from 'react';
import { X, Bell, Check, MessageSquare, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { subscriptions } from '../lib/api';

interface SmsSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export const SmsSubscriptionModal: React.FC<SmsSubscriptionModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
}) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (initialCategory && ['vehicles', 'machinery', 'properties'].includes(initialCategory)) {
      return [initialCategory];
    }
    return ['all'];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleCategory = (cat: string) => {
    if (cat === 'all') {
      setSelectedCategories(['all']);
      return;
    }

    let updated = selectedCategories.filter((c) => c !== 'all');
    if (updated.includes(cat)) {
      updated = updated.filter((c) => c !== cat);
    } else {
      updated.push(cat);
    }

    if (updated.length === 0) {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(updated);
    }
  };

  const handleClose = () => {
    localStorage.setItem('akwasi_sms_dismissed', 'true');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('Please enter a valid mobile number (e.g., 0241234567).');
      return;
    }

    try {
      setIsSubmitting(true);
      await subscriptions.subscribe({
        phone: cleanPhone,
        name: name.trim() || undefined,
        categories: selectedCategories,
      });

      localStorage.setItem('akwasi_sms_subscribed', 'true');
      setIsSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Subscription failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Instant SMS Alerts</span>
          </div>

          <h3 className="text-xl font-black tracking-tight font-sans text-white">
            Never Miss a Deal on AkwasiJob
          </h3>
          <p className="text-xs text-orange-100 mt-1 font-medium leading-relaxed">
            Get instant SMS notifications when rare vehicles, heavy machinery, or prime properties are posted.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                You're Subscribed!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                Thank you! We've saved your phone number ({phone}). You'll receive instant SMS updates on top deals.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 text-slate-500 font-semibold text-xs border-r border-slate-200 dark:border-slate-700 pr-2">
                    <span className="text-base">🇬🇭</span>
                    <span>+233</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="024 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-24 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enter your mobile number to receive free SMS deal alerts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kwame Mensah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  What updates do you want to receive?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: '⭐ All Deals', desc: 'Everything' },
                    { id: 'vehicles', label: '🚗 Vehicles', desc: 'Cars & Trucks' },
                    { id: 'machinery', label: '🚜 Machinery', desc: 'Equipment' },
                    { id: 'properties', label: '🏡 Properties', desc: 'Homes & Land' },
                  ].map((cat) => {
                    const active = selectedCategories.includes(cat.id);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleToggleCategory(cat.id)}
                        className={`p-2.5 text-left rounded-xl border transition-all text-xs font-medium ${
                          active
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-200 font-bold ring-1 ring-orange-500'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div>{cat.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{cat.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Subscribe to SMS Updates</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>No spam. Unsubscribe anytime. Free service.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
