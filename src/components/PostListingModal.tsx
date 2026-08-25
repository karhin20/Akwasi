import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, Tag, ImageIcon, Loader2 } from 'lucide-react';
import { ListingItem } from '../types';
import { listings as listingsApi, media as mediaApi } from '../lib/api';

interface PostListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: ListingItem) => void;
}

const inputClass = 'w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 shadow-2xs';
const labelClass = 'block text-xs font-bold uppercase text-slate-500 mb-1';

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
}) => {
  const [category, setCategory] = useState<'cars_vehicles' | 'heavy_machinery' | 'properties'>('cars_vehicles');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Accra');
  const [condition, setCondition] = useState('Excellent Condition');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Shared vehicle / machinery fields
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // Cars & Vehicles specific
  const [mileage, setMileage] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');
  const [transmission, setTransmission] = useState('Automatic');

  // Heavy Machinery specific
  const [hours, setHours] = useState('');
  const [tonnage, setTonnage] = useState('');
  const [weight, setWeight] = useState('');

  // Properties specific
  const [propertyType, setPropertyType] = useState('Apartment');
  const [transactionType, setTransactionType] = useState('For Sale');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [sqm, setSqm] = useState('');
  const [floors, setFloors] = useState('');
  const [parking, setParking] = useState('');
  const [pricePeriod, setPricePeriod] = useState('');

  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCategoryChange = (cat: typeof category) => {
    setCategory(cat);
    // Reset category-specific fields
    setMake(''); setModel(''); setYear(''); setSubCategory('');
    setMileage(''); setBodyType(''); setFuelType('Diesel'); setTransmission('Automatic');
    setHours(''); setTonnage(''); setWeight('');
    setPropertyType('Apartment'); setTransactionType('For Sale');
    setBeds(''); setBaths(''); setSqm(''); setFloors(''); setParking(''); setPricePeriod('');
    setCondition('Excellent Condition');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSelectedFile = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering input click
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      let uploadedUrls: string[] = [];

      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          const uploadPromises = selectedFiles.map((file) => mediaApi.upload(file, 'akwasi/listings'));
          const results = await Promise.all(uploadPromises);
          uploadedUrls = results.map((res) => res.url).filter(Boolean);
        } finally {
          setIsUploading(false);
        }
      }

      let mainImage = uploadedUrls[0] || '';
      let gallery = uploadedUrls;

      if (!mainImage) {
        mainImage =
          category === 'heavy_machinery'
            ? 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80'
            : category === 'properties'
            ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
            : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';
        gallery = [mainImage];
      }

      const numPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 500000;

      // Build base payload
      const payload: Record<string, unknown> = {
        title,
        category,
        subCategory,
        price: numPrice,
        currency: 'GHS',
        priceFormatted: `GHS ${numPrice.toLocaleString()}`,
        image: mainImage,
        gallery,
        description: description || 'Verified high-quality asset in pristine condition ready for commercial use.',
        location: `${location}, Ghana`,
        city: location,
        condition,
        status: 'published',
        featured: false,
        seller: {
          name: 'AkwasiJob Marketplace',
          phone: '+233 24 123 4567',
          whatsapp: '+233 24 123 4567',
          verified: true,
          location: `${location}, Ghana`,
        },
      };

      // Add category-specific fields
      if (category === 'cars_vehicles') {
        Object.assign(payload, {
          make,
          model,
          year: parseInt(year) || undefined,
          mileage,
          bodyType,
          fuelType,
          transmission,
          specs: [
            { label: 'Year', value: year || 'N/A', icon: 'calendar_month' },
            { label: 'Mileage', value: mileage || 'N/A', icon: 'speed' },
            { label: 'Fuel', value: fuelType, icon: 'local_gas_station' },
            { label: 'Transmission', value: transmission, icon: 'settings' },
          ],
        });
      } else if (category === 'heavy_machinery') {
        Object.assign(payload, {
          make,
          model,
          year: parseInt(year) || undefined,
          hours: parseInt(hours) || undefined,
          tonnage,
          weight,
          fuelType,
          specs: [
            { label: 'Year', value: year || 'N/A', icon: 'calendar_month' },
            { label: 'Hours', value: hours ? `${hours} hrs` : 'N/A', icon: 'schedule' },
            { label: 'Tonnage', value: tonnage || 'N/A', icon: 'fitness_center' },
            { label: 'Fuel', value: fuelType, icon: 'local_gas_station' },
          ],
        });
      } else if (category === 'properties') {
        Object.assign(payload, {
          propertyType,
          transactionType,
          beds: parseInt(beds) || undefined,
          baths: parseInt(baths) || undefined,
          sqm: parseInt(sqm) || undefined,
          floors: parseInt(floors) || undefined,
          parking: parking || undefined,
          pricePeriod: transactionType === 'For Rent' ? (pricePeriod || '/ month') : undefined,
          specs: [
            { label: 'Type', value: propertyType, icon: 'home' },
            { label: 'Beds', value: beds || 'N/A', icon: 'bed' },
            { label: 'Baths', value: baths || 'N/A', icon: 'bathtub' },
            { label: 'Size', value: sqm ? `${sqm} sqm` : 'N/A', icon: 'square_foot' },
          ],
        });
      }

      const created = await listingsApi.create(payload);
      onAddListing(created as ListingItem);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setTitle(''); setPrice(''); setDescription('');
        setSelectedFiles([]); setImagePreviews([]);
        handleCategoryChange('cars_vehicles');
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to publish listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Category-specific field renderers ───────────────────────────────────────

  const renderVehicleFields = () => (
    <div className="space-y-4 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
      <h4 className="text-xs font-bold uppercase text-blue-700 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Vehicle Specifications
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Make / Manufacturer</label>
          <input type="text" placeholder="e.g. Toyota, Ford" value={make} onChange={(e) => setMake(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Model</label>
          <input type="text" placeholder="e.g. Hilux, Land Cruiser" value={model} onChange={(e) => setModel(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input type="number" placeholder="2023" value={year} onChange={(e) => setYear(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Mileage</label>
          <input type="text" placeholder="e.g. 45,000 km" value={mileage} onChange={(e) => setMileage(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Body Type</label>
          <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className={inputClass}>
            <option value="">Select body type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Pickup">Pickup</option>
            <option value="Commercial Truck">Commercial Truck</option>
            <option value="Heavy Equipment">Heavy Equipment</option>
            <option value="Tractor Head">Tractor Head</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Fuel Type</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className={inputClass}>
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>
            <option value="Electric/Hybrid">Electric / Hybrid</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Transmission</label>
          <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className={inputClass}>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className={inputClass}>
            <option value="Brand New">Brand New</option>
            <option value="Excellent Condition">Excellent Condition</option>
            <option value="Dealer Certified">Dealer Certified</option>
            <option value="Used">Used</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderMachineryFields = () => (
    <div className="space-y-4 bg-amber-50/50 border border-amber-100 rounded-xl p-4">
      <h4 className="text-xs font-bold uppercase text-amber-700 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Machinery Specifications
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Make / Manufacturer</label>
          <input type="text" placeholder="e.g. Caterpillar, Komatsu" value={make} onChange={(e) => setMake(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Model</label>
          <input type="text" placeholder="e.g. 320 GC, PC200" value={model} onChange={(e) => setModel(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input type="number" placeholder="2021" value={year} onChange={(e) => setYear(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Operating Hours</label>
          <input type="number" placeholder="e.g. 3500" value={hours} onChange={(e) => setHours(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tonnage</label>
          <input type="text" placeholder="e.g. 20 Ton" value={tonnage} onChange={(e) => setTonnage(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Weight</label>
          <input type="text" placeholder="e.g. 22,000 kg" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Fuel Type</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className={inputClass}>
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>
            <option value="Electric/Hybrid">Electric / Hybrid</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className={inputClass}>
            <option value="Brand New">Brand New</option>
            <option value="Excellent Condition">Excellent Condition</option>
            <option value="Dealer Certified">Dealer Certified</option>
            <option value="Used">Used</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPropertyFields = () => (
    <div className="space-y-4 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
      <h4 className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Property Details
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Property Type</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={inputClass}>
            <option value="Apartment">Apartment</option>
            <option value="House / Villa">House / Villa</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
            <option value="Townhouse">Townhouse</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Transaction Type</label>
          <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className={inputClass}>
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
          </select>
        </div>
      </div>
      {transactionType === 'For Rent' && (
        <div>
          <label className={labelClass}>Price Period</label>
          <select value={pricePeriod} onChange={(e) => setPricePeriod(e.target.value)} className={inputClass}>
            <option value="/ month">Per Month</option>
            <option value="/ year">Per Year</option>
            <option value="/ week">Per Week</option>
          </select>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Bedrooms</label>
          <input type="number" placeholder="3" value={beds} onChange={(e) => setBeds(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bathrooms</label>
          <input type="number" placeholder="2" value={baths} onChange={(e) => setBaths(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Size (sqm)</label>
          <input type="number" placeholder="150" value={sqm} onChange={(e) => setSqm(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Floors</label>
          <input type="number" placeholder="2" value={floors} onChange={(e) => setFloors(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Parking</label>
          <input type="text" placeholder="e.g. 2 covered spaces" value={parking} onChange={(e) => setParking(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className={inputClass}>
            <option value="Brand New">Brand New</option>
            <option value="Excellent Condition">Excellent Condition</option>
            <option value="Used">Used</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Post Commercial Listing on AkwasiJob
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
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
                    onClick={() => handleCategoryChange(cat)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      category === cat
                        ? cat === 'cars_vehicles' ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : cat === 'heavy_machinery' ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
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
              <label className={labelClass}>
                {category === 'properties' ? 'Property Title' : 'Asset Title / Model'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  category === 'cars_vehicles' ? 'e.g., 2023 Toyota Hilux GR Sport 4x4'
                    : category === 'heavy_machinery' ? 'e.g., Cat 320 GC Hydraulic Excavator'
                    : 'e.g., 3-Bedroom Apartment in East Legon'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Sub-Category */}
            <div>
              <label className={labelClass}>Sub-Category</label>
              <input
                type="text"
                placeholder={
                  category === 'cars_vehicles' ? 'e.g. SUV, Sedan, Pickup, Truck'
                    : category === 'heavy_machinery' ? 'e.g. Excavator, Dozer, Loader, Crane'
                    : 'e.g. Apartment, House, Office, Land'
                }
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Price & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  {category === 'properties' && transactionType === 'For Rent' ? 'Rent Price (GHS)' : 'Asking Price (GHS)'}
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 650000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>City / Location (Ghana)</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass}>
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

            {/* ─── Category-Specific Fields ─────────────────────────────── */}
            {category === 'cars_vehicles' && renderVehicleFields()}
            {category === 'heavy_machinery' && renderMachineryFields()}
            {category === 'properties' && renderPropertyFields()}

            {/* Image Upload — Cloudinary */}
            <div>
              <label className={labelClass}>
                Listing Images <span className="text-slate-400 normal-case font-normal">(select one or more, uploaded to Cloudinary)</span>
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-slate-50 rounded-lg p-5 cursor-pointer transition-colors text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-600">
                    Drop images here or <span className="text-blue-600">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400">PNG, JPG, WEBP (Multiple allowed)</p>
                </div>
              </div>

              {/* Selected Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white aspect-square shadow-2xs">
                      <img src={preview} alt={`Upload preview ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          COVER
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleRemoveSelectedFile(idx, e)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-colors cursor-pointer"
                        title="Remove from upload queue"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                Detailed Specifications &amp; Notes
              </label>
              <textarea
                rows={3}
                placeholder={
                  category === 'cars_vehicles' ? 'Include service history, mileage details, any modifications...'
                    : category === 'heavy_machinery' ? 'Include maintenance records, operating hours, attachments...'
                    : 'Include amenities, nearby landmarks, lease terms...'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
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
