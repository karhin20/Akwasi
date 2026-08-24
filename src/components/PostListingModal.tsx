import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, Tag, ImageIcon, Loader2 } from 'lucide-react';
import { ListingItem } from '../types';
import { listings as listingsApi, media as mediaApi } from '../lib/api';

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: ListingItem) => void;
}

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
}) => {
  const [category, setCategory] = useState<'cars_vehicles' | 'heavy_machinery' | 'properties'>('cars_vehicles');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [make, setMake] = useState('Toyota');
  const [year, setYear] = useState('2022');
  const [location, setLocation] = useState('Accra');
  const [condition, setCondition] = useState('Excellent Condition');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      let imageUrl = '';

      // 1. Upload image to Cloudinary via backend if a file was selected
      if (selectedFile) {
        setIsUploading(true);
        try {
          const uploadResult = await mediaApi.upload(selectedFile, 'akwasi/listings');
          imageUrl = uploadResult.url;
        } finally {
          setIsUploading(false);
        }
      }

      // 2. Fallback image if none uploaded
      if (!imageUrl) {
        imageUrl =
          category === 'heavy_machinery'
            ? 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80'
            : category === 'properties'
            ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
            : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';
      }

      const numPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 500000;

      const payload: Record<string, unknown> = {
        title,
        category,
        price: numPrice,
        currency: 'GHS',
        priceFormatted: `GHS ${numPrice.toLocaleString()}`,
        image: imageUrl,
        gallery: [imageUrl],
        description: description || 'Verified high-quality asset in pristine condition ready for commercial use.',
        location: `${location}, Ghana`,
        city: location,
        year: parseInt(year) || 2022,
        make,
        condition,
        status: 'published',
        featured: false,
        specs: [
          { label: 'Year', value: year, icon: 'calendar_month' },
          { label: 'Location', value: location, icon: 'location_on' },
          { label: 'Make', value: make, icon: 'build' },
          { label: 'Verified', value: 'Instant Clear', icon: 'verified' },
        ],
        seller: {
          name: 'AkwasiJob Marketplace',
          phone: '+233 24 123 4567',
          whatsapp: '+233 24 123 4567',
          verified: true,
          location: `${location}, Ghana`,
        },
      };

      // 3. POST to backend → Supabase
      const created = await listingsApi.create(payload);
      onAddListing(created as ListingItem);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        // Reset form
        setTitle('');
        setPrice('');
        setDescription('');
        setSelectedFile(null);
        setImagePreview(null);
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to publish listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                {(['cars_vehicles', 'heavy_machinery', 'properties'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      category === cat
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'cars_vehicles' ? 'Cars & Vehicles' : cat === 'heavy_machinery' ? 'Heavy Machinery' : 'Properties'}
                  </button>
                ))}
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

            {/* Make & Year & Condition */}
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
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Year</label>
                <input
                  type="number"
                  placeholder="2022"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Condition</label>
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

            {/* Image Upload — Cloudinary */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Listing Image <span className="text-slate-400 normal-case font-normal">(uploaded to Cloudinary)</span>
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors text-center ${
                  imagePreview
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-700 line-clamp-1">{selectedFile?.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ''}
                      </p>
                      <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Click to change image</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">
                      Drop image here or <span className="text-blue-600">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 15MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Detailed Specifications &amp; Notes
              </label>
              <textarea
                rows={3}
                placeholder="Include maintenance records, hours/mileage, custom attachments or lease terms..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Error */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3">
                {submitError}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg hover:bg-slate-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isUploading ? 'Uploading Image...' : 'Publishing...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Publish Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
