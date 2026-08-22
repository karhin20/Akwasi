export type ScreenType = 'home' | 'vehicles' | 'machinery' | 'properties' | 'services' | 'listing_detail' | 'admin';

export type CategoryType = 'vehicles' | 'machinery' | 'properties';

export type VehicleBodyType = 'all' | 'suv' | 'sedan' | 'pickup' | 'truck' | 'heavy';

export interface ListingItem {
  id: string;
  title: string;
  category: 'cars_vehicles' | 'heavy_machinery' | 'properties';
  subCategory?: string;
  status?: 'published' | 'pending' | 'draft' | 'rejected';
  price: number;
  currency: string;
  priceFormatted: string;
  priceUsd?: string;
  pricePeriod?: string; // e.g. "/ mo"
  featured?: boolean;
  recentlyReduced?: boolean;
  image: string;
  gallery?: string[];
  description: string;
  location: string;
  city: string;
  year?: number;
  hours?: number;
  mileage?: string;
  bodyType?: 'SUV' | 'Sedan' | 'Pickup' | 'Commercial Truck' | 'Heavy Equipment' | 'Tractor Head';
  make?: string;
  model?: string;
  tonnage?: string;
  weight?: string;
  fuelType?: 'Diesel' | 'Petrol' | 'Electric/Hybrid';
  transmission?: 'Automatic' | 'Manual';
  condition?: 'Brand New' | 'Excellent Condition' | 'Dealer Certified' | 'Used';
  specs?: {
    label: string;
    value: string;
    icon?: string;
  }[];
  // Property specific
  beds?: number;
  baths?: number;
  showers?: number;
  sqm?: number;
  floors?: number;
  transactionType?: 'For Sale' | 'For Rent';
  propertyType?: 'Apartment' | 'House / Villa' | 'Commercial' | 'Land' | 'Townhouse';
  parking?: number | string;
  conditioning?: string;
  features?: string[];
  layoutDetails?: { title: string; items: string[] }[];
  updatedTime?: string;
  videoCount?: number;
  seller?: {
    name: string;
    phone: string;
    whatsapp: string;
    verified: boolean;
    location: string;
  };
}

export interface EnquiryItem {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  category: string;
  source: 'ai_assistant' | 'whatsapp' | 'form';
  message: string;
  aiConversationSnippet?: {
    userPrompt: string;
    botAnswer: string;
  };
  itemTitle?: string;
  timestamp: string;
}

export interface FilterState {
  searchQuery: string;
  category: string; // 'all_vehicles' | 'heavy_machinery' | 'commercial_trucks' or 'all'
  bodyType: string;
  make: string;
  minPrice: string;
  maxPrice: string;
  yearFrom: string;
  yearTo: string;
  fuelTypes: string[];
  transmission: string;
  equipmentType?: string[];
  tonnage?: string;
  location?: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'year_desc' | 'hours_asc';
}
