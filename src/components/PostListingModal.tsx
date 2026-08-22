import React, { useState } from 'react';
import { X, Upload, CheckCircle, Tag, MapPin, DollarSign, Layers } from 'lucide-react';
import { ListingItem } from '../types';

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: ListingItem) => void;
}

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing
}) => {
  const [category, setCategory] = useState<'cars_vehicles' | 'heavy_machinery' | 'properties'>('cars_vehicles');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [make, setMake] = useState('Toyota');
  const [year, setYear] = useState('2022');
  const [location, setLocation] = useState('Accra');
  const [condition, setCondition] = useState('Excellent Condition');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const numPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 500000;
    const defaultImg =
      category === 'heavy_machinery'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDknMVfyClBf-vB-HWarpPpQLMLg5SPvNFl25AIrgnHmpjIvCX7IPiyLSS0CXMpgxGN360lJpWl73LpdepCDlPJsgmQ2NwnjTeZowPpYRDBo9xmM6zOV4P8hn9FY_qur27K3lTmkM20PfgPeUvTzss36RiXzLiRsb7Moezy1FU_xyIhxZqs1BnpRPOp8SViQYiGa21yX2ssCWzjdJZZiEEmJQWAP70cNkGjMlGoboWkwH7Nt8d2vZ2vhA'
        : category === 'properties'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRjNF4KCiTva_kuW6mL5F1fn7C7elx__FbX2mQkqEw3PWuv3s6lRZMRFa_Px51Clq09SSVMuiK9d5hU8FZ9_2bVgI4bOBaLTdX98yvkJdGi5-6j4ov02Wn7jdI98MqGSRLEYbCf3LONzmfo8xJnGnHtAOpOiRPaxqHPhDafbJNw4tqyYoJdxjpunf1I-KUCL3HOEEaXPBACs3CG2Rf_S7Xad6csldYb44ub-HH8TGNPbQtwH1Qj5Co9w'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmXWWbFXcsf0jPWFCpq-y26DsKHue0b36HGXfKv1clsCLFGmZdkv3HgIXrzEBwqcvvT9h-D8NimdTMoq7tVA9OT7B-WAr71SVoIUmw0q4Aaxgx_8BmQo1IMYPchw8HZo4c836dMzfT9OsxS9By6MEUVGmz4mtZnuRYYObCX0XEuRK48QPdQc5625iSAcs_yqqGzeqHfL5_95Rdi1s_a3YB9jAG6-LRpwM5oW_f3QfazUlymZzElylM7g';

    const newListing: ListingItem = {
      id: `user-list-${Date.now()}`,
      title,
      category,
      price: numPrice,
      currency: 'GHS',
      priceFormatted: `GHS ${numPrice.toLocaleString()}`,
      image: imageUrl || defaultImg,
      description: description || 'Verified high-quality asset in pristine condition ready for commercial use.',
      location: `${location}, Ghana`,
      city: location,
      year: parseInt(year) || 2022,
      make,
      condition: condition as any,
      featured: true,
      specs: [
        { label: 'Year', value: year, icon: 'calendar_month' },
        { label: 'Location', value: location, icon: 'location_on' },
        { label: 'Make', value: make, icon: 'build' },
        { label: 'Verified', value: 'Instant Clear', icon: 'verified' }
      ],
      seller: {
        name: 'Kelvin Arhin (You)',
        phone: '+233 24 000 1122',
        whatsapp: '+233 24 000 1122',
        verified: true,
        location: `${location}, Ghana`
      }
    };

    onAddListing(newListing);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      // Reset form
      setTitle('');
      setPrice('');
      setDescription('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Post Commercial Listing on AkwasiJob
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
            <h4 className="font-heading text-2xl font-bold text-slate-900">
              Listing Published Successfully!
            </h4>
            <p className="text-sm text-slate-500">
              Your commercial asset is now visible in the live AkwasiJob marketplace inventory.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Category Select Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                Listing Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('cars_vehicles')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    category === 'cars_vehicles'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Cars & Vehicles
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('heavy_machinery')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    category === 'heavy_machinery'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Heavy Machinery
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('properties')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    category === 'properties'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Properties
                </button>
              </div>
            </div>

            {/* Listing Title */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Asset Title / Model
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 2023 Toyota Hilux GR Sport 4x4 or Cat 320 GC"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Price & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Asking Price (GHS)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 650000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  City / Location (Ghana)
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
                >
                  <option value="Accra">Accra</option>
                  <option value="Tema Port">Tema Port</option>
                  <option value="Kumasi">Kumasi</option>
                  <option value="Takoradi">Takoradi</option>
                  <option value="Tarkwa">Tarkwa</option>
                  <option value="East Legon">East Legon</option>
                  <option value="Cantonments">Cantonments</option>
                </select>
              </div>
            </div>

            {/* Make & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Make / Manufacturer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toyota, Caterpillar, Volvo"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  placeholder="2022"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
                >
                  <option value="Excellent Condition">Excellent Condition</option>
                  <option value="Brand New">Brand New</option>
                  <option value="Dealer Certified">Dealer Certified</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>

            {/* Image URL (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Image Link (Optional or Auto-assigned)
              </label>
              <input
                type="url"
                placeholder="https://... (Leave blank for sample industrial photo)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Detailed Specifications & Notes
              </label>
              <textarea
                rows={3}
                placeholder="Include maintenance records, hours/mileage, custom attachments or lease terms..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Publish Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
