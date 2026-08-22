import { ListingItem } from '../types';

export const INITIAL_LISTINGS: ListingItem[] = [
  // Townhouse featured in User Screenshots
  {
    id: 'prop-ridge-townhouse-3bed',
    title: '3 Bedroom Townhouse for Sale in Accra',
    category: 'properties',
    subCategory: 'Townhouse',
    propertyType: 'Townhouse',
    transactionType: 'For Sale',
    price: 3870669,
    currency: 'GH₵',
    priceFormatted: 'GH₵ 3,870,669',
    priceUsd: 'USD 350,000',
    featured: true,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Executive 3-Bedroom Apartment for Sale in Ridge, Accra.\n\nOwn a premium residence in the prestigious Ridge neighborhood of Accra. This executive 3-bedroom apartment combines spacious interiors, modern finishes, and a functional layout, offering an exceptional opportunity for homeowners and investors seeking a high-value property in one of Accra’s most desirable locations.',
    location: 'Ridge (North/West/East Ridge), Accra, Ghana',
    city: 'Accra',
    beds: 3,
    baths: 3,
    showers: 3,
    sqm: 285,
    parking: 1,
    conditioning: 'Air',
    updatedTime: '1 day ago',
    videoCount: 0,
    features: [
      '3 spacious bedrooms, all en-suite',
      'Additional study / home office or TV room',
      '3 storage rooms for added convenience',
      'Dedicated car parking area',
      'Secure and well-maintained development with 24/7 security',
      'Prime location in Ridge, Accra with easy access to embassies & business district'
    ],
    layoutDetails: [
      {
        title: 'Main Level',
        items: [
          'Expansive living area ideal for entertaining and family living',
          'Dedicated dining space with hardwood accents',
          'Fully fitted modern kitchen with refrigerator & laundry station',
          'Visitors’ washroom and under-stair storage room'
        ]
      },
      {
        title: 'Upper Level',
        items: [
          'Master suite with custom walk-in closet and deluxe bathroom',
          '2 additional well-proportioned en-suite bedrooms',
          'Family lounge / study nook opening to balcony'
        ]
      }
    ],
    specs: [
      { label: 'Beds', value: '3 Beds', icon: 'bed' },
      { label: 'Baths', value: '3 Baths', icon: 'shower' },
      { label: 'Parking', value: '1 Slot', icon: 'local_parking' },
      { label: 'Conditioning', value: 'Air Conditioned', icon: 'ac_unit' }
    ],
    seller: {
      name: 'E. Wells Realty',
      phone: '+233 30 278 0090',
      whatsapp: '+233 24 412 3456',
      verified: true,
      location: 'Ridge & Airport Residential, Accra'
    }
  },

  // Heavy Machinery & Featured Vehicles
  {
    id: 'mach-cat-320gc-2022',
    title: '2022 Caterpillar 320 GC',
    category: 'heavy_machinery',
    subCategory: 'Excavator',
    price: 1450000,
    currency: 'GHS',
    priceFormatted: 'GHS 1,450,000',
    priceUsd: 'USD ~115,000',
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDknMVfyClBf-vB-HWarpPpQLMLg5SPvNFl25AIrgnHmpjIvCX7IPiyLSS0CXMpgxGN360lJpWl73LpdepCDlPJsgmQ2NwnjTeZowPpYRDBo9xmM6zOV4P8hn9FY_qur27K3lTmkM20PfgPeUvTzss36RiXzLiRsb7Moezy1FU_xyIhxZqs1BnpRPOp8SViQYiGa21yX2ssCWzjdJZZiEEmJQWAP70cNkGjMlGoboWkwH7Nt8d2vZ2vhA',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDknMVfyClBf-vB-HWarpPpQLMLg5SPvNFl25AIrgnHmpjIvCX7IPiyLSS0CXMpgxGN360lJpWl73LpdepCDlPJsgmQ2NwnjTeZowPpYRDBo9xmM6zOV4P8hn9FY_qur27K3lTmkM20PfgPeUvTzss36RiXzLiRsb7Moezy1FU_xyIhxZqs1BnpRPOp8SViQYiGa21yX2ssCWzjdJZZiEEmJQWAP70cNkGjMlGoboWkwH7Nt8d2vZ2vhA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDx1pgbuMs4-2iVs79gKJ6qdw23ZiwjgLhpq_lNI-eN5dp76NZ2xUiLO3RUiGpRiuYeA1trObmwTfc7kG5ps1uJ8Bi91ghaJsAbfjxYdIgqVZZvS6I1YX_KWtaaXhZNzFv7RrSX0BNkYFAEz8SE5_iqKnBM1_v7A000CPTBPxrWGn5wvAnBEPKL4YXHWYeOBrwhGra8zNf68o-j67O5NsS-znoC1ZaYtLY0dFg2LEYoxJkpyfH41mebKA',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Hydraulic Excavator - Excellent Condition. Equipped with standard boom, 1.2m³ heavy-duty bucket, Cat C4.4 engine, and digital grade assist system. Ready for immediate deployment.',
    location: 'Tema Port, Greater Accra',
    city: 'Tema',
    year: 2022,
    hours: 1200,
    bodyType: 'Heavy Equipment',
    make: 'Caterpillar',
    model: '320 GC',
    tonnage: '20.5 Tons',
    weight: '20.5 Tons',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Excellent Condition',
    updatedTime: '2 days ago',
    features: [
      'Original Cat C4.4 ACERT turbocharged diesel engine',
      'Heavy-duty 1.2m³ rock digging bucket',
      'Operator ROPS/FOPS certified enclosed cabin with high-output AC',
      'Factory electronic grade assist & payload tracking',
      'Complete diagnostic log and Mantrac service history available'
    ],
    specs: [
      { label: 'Hours', value: '1,200 hrs', icon: 'schedule' },
      { label: 'Location', value: 'Tema Port', icon: 'location_on' },
      { label: 'Weight', value: '20.5 Tons', icon: 'weight' },
      { label: 'Status', value: 'Dealer Serviced', icon: 'build' }
    ],
    seller: {
      name: 'Mantrac Ghana Certified Pre-Owned',
      phone: '+233 30 221 4500',
      whatsapp: '+233 24 412 3456',
      verified: true,
      location: 'Tema Heavy Industrial Area, Ghana'
    }
  },
  {
    id: 'veh-toyota-hilux-2021',
    title: '2021 Toyota Hilux D/Cab',
    category: 'cars_vehicles',
    subCategory: 'Pickup',
    price: 520000,
    currency: 'GHS',
    priceFormatted: 'GHS 520,000',
    priceUsd: 'USD ~41,000',
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmXWWbFXcsf0jPWFCpq-y26DsKHue0b36HGXfKv1clsCLFGmZdkv3HgIXrzEBwqcvvT9h-D8NimdTMoq7tVA9OT7B-WAr71SVoIUmw0q4Aaxgx_8BmQo1IMYPchw8HZo4c836dMzfT9OsxS9By6MEUVGmz4mtZnuRYYObCX0XEuRK48QPdQc5625iSAcs_yqqGzeqHfL5_95Rdi1s_a3YB9jAG6-LRpwM5oW_f3QfazUlymZzElylM7g',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmXWWbFXcsf0jPWFCpq-y26DsKHue0b36HGXfKv1clsCLFGmZdkv3HgIXrzEBwqcvvT9h-D8NimdTMoq7tVA9OT7B-WAr71SVoIUmw0q4Aaxgx_8BmQo1IMYPchw8HZo4c836dMzfT9OsxS9By6MEUVGmz4mtZnuRYYObCX0XEuRK48QPdQc5625iSAcs_yqqGzeqHfL5_95Rdi1s_a3YB9jAG6-LRpwM5oW_f3QfazUlymZzElylM7g',
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    description: '4x4 Manual Diesel - Excellent Condition. Fully serviced, accident-free double cabin pickup with heavy duty bullbar, bed liner, reverse camera, and touch infotainment display.',
    location: 'Spintex Road, Accra',
    city: 'Accra',
    year: 2021,
    mileage: '45,000 km',
    bodyType: 'Pickup',
    make: 'Toyota',
    model: 'Hilux Revo 2.8L',
    fuelType: 'Diesel',
    transmission: 'Manual',
    condition: 'Excellent Condition',
    updatedTime: '3 days ago',
    features: [
      '2.8L D-4D Turbo Diesel engine delivering 201 HP',
      'Selectable 4WD with high and low range transfer box & rear diff lock',
      'Heavy-duty ARB-style steel front bullbar and side rock sliders',
      'Rhino bedliner with tie-down anchoring hooks',
      'Apple CarPlay & Android Auto 8-inch touch display'
    ],
    specs: [
      { label: 'Mileage', value: '45k km', icon: 'speed' },
      { label: 'Location', value: 'Accra Central', icon: 'location_on' },
      { label: 'Fuel', value: 'Diesel', icon: 'local_gas_station' },
      { label: 'Gearbox', value: '6-Speed Manual', icon: 'settings' }
    ],
    seller: {
      name: 'Akwasi Prime Motors Ltd',
      phone: '+233 24 555 8920',
      whatsapp: '+233 24 555 8920',
      verified: true,
      location: 'Spintex Road, Accra'
    }
  },
  {
    id: 'veh-lc300-2023',
    title: '2023 Toyota Land Cruiser 300 VXR',
    category: 'cars_vehicles',
    subCategory: 'SUV',
    price: 1850000,
    currency: 'GHS',
    priceFormatted: 'GHS 1,850,000',
    priceUsd: 'USD ~148,000',
    featured: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80'
    ],
    description: '3.5L V6 Twin-Turbo Petrol - Fullest Option VXR. Brand new zero mileage executive SUV with JBL 14-speaker audio, rear seat entertainment displays, 360 camera, adaptive variable suspension, and beige leather interior.',
    location: 'Airport Residential Area, Accra',
    city: 'Accra',
    year: 2023,
    mileage: '1,500 km',
    bodyType: 'SUV',
    make: 'Toyota',
    model: 'Land Cruiser 300 VXR',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Brand New',
    updatedTime: '1 day ago',
    features: [
      '3.5L V6 Twin-Turbo Petrol Engine generating 409 HP',
      '10-speed Direct Shift automatic transmission with paddle shifters',
      'JBL Premium 14-Speaker surround sound system',
      'Dual 11.6-inch rear seat entertainment touchscreens',
      'Multi-Terrain Select (MTS) & Crawl Control system'
    ],
    specs: [
      { label: 'Mileage', value: '1.5k km', icon: 'speed' },
      { label: 'Location', value: 'Airport Residential', icon: 'location_on' },
      { label: 'Engine', value: '3.5L V6 Twin Turbo', icon: 'local_gas_station' },
      { label: 'Transmission', value: '10-Speed Auto', icon: 'settings' }
    ],
    seller: {
      name: 'Accra Executive Auto Gallery',
      phone: '+233 24 333 4455',
      whatsapp: '+233 24 333 4455',
      verified: true,
      location: 'Airport Residential, Accra'
    }
  },
  {
    id: 'veh-mb-gle450-2022',
    title: '2022 Mercedes-Benz GLE 450 4MATIC',
    category: 'cars_vehicles',
    subCategory: 'SUV',
    price: 1350000,
    currency: 'GHS',
    priceFormatted: 'GHS 1,350,000',
    priceUsd: 'USD ~108,000',
    featured: false,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    description: '3.0L Turbo Inline-6 with EQ Boost. AMG Line styling package, panoramic sunroof, Burmester sound, ambient lighting, and panoramic dual 12.3-inch MBUX displays.',
    location: 'Cantonments, Accra',
    city: 'Accra',
    year: 2022,
    mileage: '22,000 km',
    bodyType: 'SUV',
    make: 'Mercedes-Benz',
    model: 'GLE 450 4MATIC AMG Line',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    condition: 'Excellent Condition',
    updatedTime: '2 days ago',
    features: [
      '3.0L Turbo Inline-6 engine with 48V Mild Hybrid EQ Boost',
      'AMG Line exterior styling & 21-inch AMG multi-spoke alloy wheels',
      'Burmester Surround Sound system',
      'Panoramic sliding glass sunroof'
    ],
    specs: [
      { label: 'Mileage', value: '22k km', icon: 'speed' },
      { label: 'Location', value: 'Cantonments', icon: 'location_on' },
      { label: 'Fuel', value: 'Petrol', icon: 'local_gas_station' },
      { label: 'Drivetrain', value: '4MATIC AWD', icon: 'settings' }
    ],
    seller: {
      name: 'Star Motors Ghana',
      phone: '+233 30 277 8899',
      whatsapp: '+233 24 111 2233',
      verified: true,
      location: 'Cantonments, Accra'
    }
  },
  {
    id: 'veh-mb-actros-2018',
    title: '2018 MB Actros 3344',
    category: 'cars_vehicles',
    subCategory: 'Commercial Truck',
    price: 850000,
    currency: 'GHS',
    priceFormatted: 'GHS 850,000',
    priceUsd: 'USD ~68,000',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM8hUM9LISwa4gDaRglisyBXrckRjJDsS-qB80xplYHXFm3mtL7g4MFtKTys63VxbRvToMdKln2DhfUbkYZAM1sGFhOZZ4WfL0EYsVm2LEeiRtMTuyI28vvDyxkZ2XEov_5jCNo5cO1beimegAuQ77P4Xx6LWkeRvakt0OuGO7qeOgnaa1XUQ_ASus3ZnKbp9ajnt4GxlWPgz56wMxOPipsBarzzguBgGcqeTTDe0QznbJtzaLT_70kQ',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAM8hUM9LISwa4gDaRglisyBXrckRjJDsS-qB80xplYHXFm3mtL7g4MFtKTys63VxbRvToMdKln2DhfUbkYZAM1sGFhOZZ4WfL0EYsVm2LEeiRtMTuyI28vvDyxkZ2XEov_5jCNo5cO1beimegAuQ77P4Xx6LWkeRvakt0OuGO7qeOgnaa1XUQ_ASus3ZnKbp9ajnt4GxlWPgz56wMxOPipsBarzzguBgGcqeTTDe0QznbJtzaLT_70kQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBS07SEydLtHwyyPQS7DOVxszdj8AKZZ0h2sNOjXcm96onsLhfyeoXAsfEq0SO-cgNEikML8iY6wUyEzPyIA2NCHCJNJQg9adC__zoXIan5_bKIkmOOIkh5vcxx24HPMOym1rM8sZwKBYLImuAw_S0Ca45_ep8WZhnj9U-3yKLsplVGFVEobf-awJgON3Ccv2b5X0gYj9q-vnM0zOA18u2tDiLLC5KfAEfZOC9X3N6DAxBV3hwZXVbJAg',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Tractor Head - 6x4 Prime Mover. Euro 5 V6 Turbo Diesel engine, EPS automatic transmission with clutch pedal, reinforced chassis, ideal for long-distance container haulage and mining transit.',
    location: 'Suame Magazine, Kumasi',
    city: 'Kumasi',
    year: 2018,
    mileage: '210k km',
    bodyType: 'Commercial Truck',
    make: 'Mercedes-Benz',
    model: 'Actros 3344 6x4',
    tonnage: '33 Tons',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Excellent Condition',
    updatedTime: '4 days ago',
    features: [
      'V6 Turbo Diesel OM 501 LA engine with 435 HP output',
      'Reinforced planetary hub reduction heavy axles',
      'High-roof sleeper cab with double bunk and air suspension seats',
      'Jost fifth wheel hitch coupling 2-inch and 3.5-inch pins'
    ],
    specs: [
      { label: 'Mileage', value: '210k km', icon: 'speed' },
      { label: 'Location', value: 'Kumasi Depot', icon: 'location_on' },
      { label: 'Configuration', value: '6x4 Tractor Head', icon: 'local_shipping' },
      { label: 'Engine', value: 'V6 Turbo 440HP', icon: 'engineering' }
    ],
    seller: {
      name: 'Ashanti Logistics & Haulage',
      phone: '+233 32 203 1180',
      whatsapp: '+233 50 123 7890',
      verified: true,
      location: 'Suame Magazine, Kumasi'
    }
  },
  {
    id: 'mach-bobcat-s570-2019',
    title: '2019 Bobcat S570',
    category: 'heavy_machinery',
    subCategory: 'Loaders',
    price: 280000,
    currency: 'GHS',
    priceFormatted: 'GHS 280,000',
    priceUsd: 'USD ~22,500',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3_bqV_OF9vDO5sCUufiGy4B6-yxILm_Y4iIIKZYyjFB2CK1f5ZTgWW7_vOtJLKG7f7vCkapkzXgkR3oqNzFfDQwBviqiyP_P1aGrWXyQ1ZELk6nf6jmInDo3AFuRL5l_42XnfZS6oFpCcg9vSM13T2fep3wNTSQjDptCxO_BCrZOBmDDeE7-eNCfsBpQS1CjMUyVUBD523lwwL9vhYU31uRuXbwpUKw6BomKSm8eQ0eVf72U67Op0xg',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3_bqV_OF9vDO5sCUufiGy4B6-yxILm_Y4iIIKZYyjFB2CK1f5ZTgWW7_vOtJLKG7f7vCkapkzXgkR3oqNzFfDQwBviqiyP_P1aGrWXyQ1ZELk6nf6jmInDo3AFuRL5l_42XnfZS6oFpCcg9vSM13T2fep3wNTSQjDptCxO_BCrZOBmDDeE7-eNCfsBpQS1CjMUyVUBD523lwwL9vhYU31uRuXbwpUKw6BomKSm8eQ0eVf72U67Op0xg',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Skid-Steer Loader with standard bucket attachment. Enclosed cab with AC, high-flow auxiliary hydraulics, pneumatic heavy-duty tires. Compact and agile for urban construction and warehousing.',
    location: 'Takoradi Harbour Zone',
    city: 'Takoradi',
    year: 2019,
    hours: 3400,
    bodyType: 'Heavy Equipment',
    make: 'Bobcat',
    model: 'S570',
    tonnage: '2.9 Tons',
    weight: '2.9 Tons',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Used',
    specs: [
      { label: 'Hours', value: '3,400 hrs', icon: 'schedule' },
      { label: 'Location', value: 'Takoradi Harbour Zone', icon: 'location_on' },
      { label: 'Payload', value: '950 kg', icon: 'fitness_center' },
      { label: 'Engine', value: 'Kubota 2.4L Diesel', icon: 'build' }
    ],
    seller: {
      name: 'Western Region Equipment Hire',
      phone: '+233 31 202 8810',
      whatsapp: '+233 24 999 1122',
      verified: true,
      location: 'Harbour Road, Takoradi'
    }
  },
  {
    id: 'mach-cat-320gc-2019',
    title: 'Cat 320 GC Excavator',
    category: 'heavy_machinery',
    subCategory: 'Excavator',
    price: 850000,
    currency: 'GH₵',
    priceFormatted: 'GH₵ 850,000',
    priceUsd: 'USD ~68,000',
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx1pgbuMs4-2iVs79gKJ6qdw23ZiwjgLhpq_lNI-eN5dp76NZ2xUiLO3RUiGpRiuYeA1trObmwTfc7kG5ps1uJ8Bi91ghaJsAbfjxYdIgqVZZvS6I1YX_KWtaaXhZNzFv7RrSX0BNkYFAEz8SE5_iqKnBM1_v7A000CPTBPxrWGn5wvAnBEPKL4YXHWYeOBrwhGra8zNf68o-j67O5NsS-znoC1ZaYtLY0dFg2LEYoxJkpyfH41mebKA',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDx1pgbuMs4-2iVs79gKJ6qdw23ZiwjgLhpq_lNI-eN5dp76NZ2xUiLO3RUiGpRiuYeA1trObmwTfc7kG5ps1uJ8Bi91ghaJsAbfjxYdIgqVZZvS6I1YX_KWtaaXhZNzFv7RrSX0BNkYFAEz8SE5_iqKnBM1_v7A000CPTBPxrWGn5wvAnBEPKL4YXHWYeOBrwhGra8zNf68o-j67O5NsS-znoC1ZaYtLY0dFg2LEYoxJkpyfH41mebKA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDknMVfyClBf-vB-HWarpPpQLMLg5SPvNFl25AIrgnHmpjIvCX7IPiyLSS0CXMpgxGN360lJpWl73LpdepCDlPJsgmQ2NwnjTeZowPpYRDBo9xmM6zOV4P8hn9FY_qur27K3lTmkM20PfgPeUvTzss36RiXzLiRsb7Moezy1FU_xyIhxZqs1BnpRPOp8SViQYiGa21yX2ssCWzjdJZZiEEmJQWAP70cNkGjMlGoboWkwH7Nt8d2vZ2vhA',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Industrial-grade hydraulic excavator for earthmoving, quarrying, and foundation trenching. Fully inspected with new hydraulic filters and pristine tracks.',
    location: 'Tema Community 1, Tema',
    city: 'Tema',
    year: 2019,
    hours: 4500,
    bodyType: 'Heavy Equipment',
    make: 'Caterpillar',
    model: '320 GC',
    tonnage: '20 Tons',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Excellent Condition',
    specs: [
      { label: 'Year', value: '2019', icon: 'calendar_month' },
      { label: 'Hours', value: '4,500 hrs', icon: 'schedule' },
      { label: 'Weight', value: '20 Tons', icon: 'weight' },
      { label: 'Location', value: 'Tema Port', icon: 'location_on' }
    ],
    seller: {
      name: 'Akwasi Heavy Logistics Ltd',
      phone: '+233 30 330 9080',
      whatsapp: '+233 24 888 7777',
      verified: true,
      location: 'Tema Community 1'
    }
  },
  {
    id: 'mach-komatsu-d61ex-2021',
    title: 'Komatsu D61EX-24',
    category: 'heavy_machinery',
    subCategory: 'Bulldozers',
    price: 1200000,
    currency: 'GH₵',
    priceFormatted: 'GH₵ 1,200,000',
    priceUsd: 'USD ~96,000',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGxOeIeU4sGs-qLOj_ZGX0Xp0FTer0NkHEpcVl6wd6ZHbaBK1Tt2Dporlz106o3O6UYdrMqS80VOPC0WywMyZi_D85fR3nhOX1BM1nao5QIl0PMXyKDHMQr_lPFImI4MTp7b8oaD5Ccxwk06jugKirE-uh4Wq9dRjsxc-WF3Iq1jlqOSq0w0kEWH6THZLjqfBySykUpJTY-BdUSqE8TT1okxGwldE3JT3jVGffY_XFRcJV8rTb1KJag',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGxOeIeU4sGs-qLOj_ZGX0Xp0FTer0NkHEpcVl6wd6ZHbaBK1Tt2Dporlz106o3O6UYdrMqS80VOPC0WywMyZi_D85fR3nhOX1BM1nao5QIl0PMXyKDHMQr_lPFImI4MTp7b8oaD5Ccxwk06jugKirE-uh4Wq9dRjsxc-WF3Iq1jlqOSq0w0kEWH6THZLjqfBySykUpJTY-BdUSqE8TT1okxGwldE3JT3jVGffY_XFRcJV8rTb1KJag',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCenrOZowr5lZ0lOZJNl8iA6V-fONBF5_qndcAmcvFrEojO-IIozkdN-Fm-wcE8lbCoKrseGtP1Pj972kAS4sISuhrt3WeOMzSZnClVHtKjO08pbAibNchATs0txrZZDJNq0uc-iveebUS24lvrNFEKdRY71qzsvxHKiRfkt-_fOJO813IsJku09QVvPvA7Gibt5xCq6B1Bl8CsAREoDl_FyYDPFQlwtg1sLeJ1l2Arxq5F3YqXFSMneg',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Heavy crawler bulldozer with power-angle-tilt (PAT) blade, slant nose design for exceptional blade visibility, and hydrostatic transmission.',
    location: 'Industrial Area, Accra',
    city: 'Accra',
    year: 2021,
    hours: 2100,
    bodyType: 'Heavy Equipment',
    make: 'Komatsu',
    model: 'D61EX-24',
    tonnage: '19.5 Tons',
    weight: '19.5 Tons',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Dealer Certified',
    specs: [
      { label: 'Year', value: '2021', icon: 'calendar_month' },
      { label: 'Hours', value: '2,100 hrs', icon: 'schedule' },
      { label: 'Blade', value: 'PAT 3.8m³', icon: 'build' },
      { label: 'Weight', value: '19.5 Tons', icon: 'weight' }
    ],
    seller: {
      name: 'Ghana Earthmovers Network',
      phone: '+233 20 444 3322',
      whatsapp: '+233 20 444 3322',
      verified: true,
      location: 'Industrial Area, Accra'
    }
  },
  {
    id: 'veh-volvo-fmx-460-2018',
    title: 'Volvo FMX 460 Dump Truck',
    category: 'cars_vehicles',
    subCategory: 'Commercial Truck',
    price: 650000,
    currency: 'GH₵',
    priceFormatted: 'GH₵ 650,000',
    priceUsd: 'USD ~52,000',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS07SEydLtHwyyPQS7DOVxszdj8AKZZ0h2sNOjXcm96onsLhfyeoXAsfEq0SO-cgNEikML8iY6wUyEzPyIA2NCHCJNJQg9adC__zoXIan5_bKIkmOOIkh5vcxx24HPMOym1rM8sZwKBYLImuAw_S0Ca45_ep8WZhnj9U-3yKLsplVGFVEobf-awJgON3Ccv2b5X0gYj9q-vnM0zOA18u2tDiLLC5KfAEfZOC9X3N6DAxBV3hwZXVbJAg',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBS07SEydLtHwyyPQS7DOVxszdj8AKZZ0h2sNOjXcm96onsLhfyeoXAsfEq0SO-cgNEikML8iY6wUyEzPyIA2NCHCJNJQg9adC__zoXIan5_bKIkmOOIkh5vcxx24HPMOym1rM8sZwKBYLImuAw_S0Ca45_ep8WZhnj9U-3yKLsplVGFVEobf-awJgON3Ccv2b5X0gYj9q-vnM0zOA18u2tDiLLC5KfAEfZOC9X3N6DAxBV3hwZXVbJAg',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Heavy duty 8x4 tipper truck with 20m³ Hardox steel tipper body. D13 460HP engine with Volvo I-Shift crawler gears, reinforced heavy duty tandem axles.',
    location: 'Tarkwa Mining Belt',
    city: 'Tarkwa',
    year: 2018,
    mileage: '120,000 km',
    bodyType: 'Commercial Truck',
    make: 'Volvo',
    model: 'FMX 460 8x4',
    tonnage: '32 Tons',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Excellent Condition',
    specs: [
      { label: 'Year', value: '2018', icon: 'calendar_month' },
      { label: 'Mileage', value: '120,000 km', icon: 'speed' },
      { label: 'Body', value: '20m³ Tipper', icon: 'local_shipping' },
      { label: 'Power', value: '460 HP', icon: 'bolt' }
    ],
    seller: {
      name: 'Mining & Haulage Fleet Services',
      phone: '+233 31 232 4455',
      whatsapp: '+233 24 111 9988',
      verified: true,
      location: 'Tarkwa Mining Belt'
    }
  },
  {
    id: 'mach-volvo-a30g-2019',
    title: '2019 Volvo A30G Dump Truck',
    category: 'heavy_machinery',
    subCategory: 'Dump Trucks',
    price: 980000,
    currency: 'GHS',
    priceFormatted: '₵ 980,000',
    priceUsd: 'USD ~78,000',
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfOH6ScR8cmiHMAlUoggLLHm_Nz-5LYgxwspncn9NCmlGm5QTlheYjRMdmp5qhWKXbq4hON0PNcUqofQmOKmbebldFJnZBYsmwkjy23ITV4LxOMsI-NJZEEG0kVwoVMlT_r8miV3LJmnXXn3reqaZ2ZcH_ACrOYYyuTcvfz6TvBSh4LBQimpkpyaJG6qwHWMoMYNM1o7x7GEmQoATTqPsTAgzrCsvMiDc87_hlLNufrtxHUYK1vbA5Ig',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfOH6ScR8cmiHMAlUoggLLHm_Nz-5LYgxwspncn9NCmlGm5QTlheYjRMdmp5qhWKXbq4hON0PNcUqofQmOKmbebldFJnZBYsmwkjy23ITV4LxOMsI-NJZEEG0kVwoVMlT_r8miV3LJmnXXn3reqaZ2ZcH_ACrOYYyuTcvfz6TvBSh4LBQimpkpyaJG6qwHWMoMYNM1o7x7GEmQoATTqPsTAgzrCsvMiDc87_hlLNufrtxHUYK1vbA5Ig',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Articulated hauler with 29 ton payload capacity. Equipped with Volvo dynamic drive, load & dump brake, and auto lubrication system. Serviced on schedule.',
    location: 'Tarkwa Mining Area',
    city: 'Tarkwa',
    year: 2019,
    hours: 5100,
    bodyType: 'Heavy Equipment',
    make: 'Volvo',
    model: 'A30G Articulated',
    tonnage: '29 Tons',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Excellent Condition',
    specs: [
      { label: 'Hours', value: '5,100 hrs', icon: 'schedule' },
      { label: 'Capacity', value: '29 Tons', icon: 'weight' },
      { label: 'Location', value: 'Tarkwa Mining Area', icon: 'location_on' },
      { label: 'Drivetrain', value: '6x6 All-Wheel Drive', icon: 'settings' }
    ],
    seller: {
      name: 'Anglo-Gold Contractors Asset Sales',
      phone: '+233 31 232 9010',
      whatsapp: '+233 24 333 4455',
      verified: true,
      location: 'Tarkwa, Western Region'
    }
  },
  {
    id: 'mach-komatsu-d65ex-2018',
    title: '2018 Komatsu D65EX-18',
    category: 'heavy_machinery',
    subCategory: 'Bulldozers',
    price: 850000,
    currency: 'GHS',
    priceFormatted: '₵ 850,000',
    priceUsd: 'USD ~68,000',
    recentlyReduced: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCenrOZowr5lZ0lOZJNl8iA6V-fONBF5_qndcAmcvFrEojO-IIozkdN-Fm-wcE8lbCoKrseGtP1Pj972kAS4sISuhrt3WeOMzSZnClVHtKjO08pbAibNchATs0txrZZDJNq0uc-iveebUS24lvrNFEKdRY71qzsvxHKiRfkt-_fOJO813IsJku09QVvPvA7Gibt5xCq6B1Bl8CsAREoDl_FyYDPFQlwtg1sLeJ1l2Arxq5F3YqXFSMneg',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCenrOZowr5lZ0lOZJNl8iA6V-fONBF5_qndcAmcvFrEojO-IIozkdN-Fm-wcE8lbCoKrseGtP1Pj972kAS4sISuhrt3WeOMzSZnClVHtKjO08pbAibNchATs0txrZZDJNq0uc-iveebUS24lvrNFEKdRY71qzsvxHKiRfkt-_fOJO813IsJku09QVvPvA7Gibt5xCq6B1Bl8CsAREoDl_FyYDPFQlwtg1sLeJ1l2Arxq5F3YqXFSMneg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGxOeIeU4sGs-qLOj_ZGX0Xp0FTer0NkHEpcVl6wd6ZHbaBK1Tt2Dporlz106o3O6UYdrMqS80VOPC0WywMyZi_D85fR3nhOX1BM1nao5QIl0PMXyKDHMQr_lPFImI4MTp7b8oaD5Ccxwk06jugKirE-uh4Wq9dRjsxc-WF3Iq1jlqOSq0w0kEWH6THZLjqfBySykUpJTY-BdUSqE8TT1okxGwldE3JT3jVGffY_XFRcJV8rTb1KJag'
    ],
    description: 'Semi-U blade crawler tractor with automatic transmission and torque converter lockup system. Superior fuel efficiency and powerful pushing force.',
    location: 'Ring Road Central, Accra',
    city: 'Accra',
    year: 2018,
    hours: 6200,
    bodyType: 'Heavy Equipment',
    make: 'Komatsu',
    model: 'D65EX-18',
    tonnage: '22.1 Tons',
    weight: '22.1 Tons',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    condition: 'Used',
    specs: [
      { label: 'Hours', value: '6,200 hrs', icon: 'schedule' },
      { label: 'Weight', value: '22.1 Tons', icon: 'weight' },
      { label: 'Location', value: 'Accra Central', icon: 'location_on' },
      { label: 'Blade Type', value: 'Semi-U Tilt', icon: 'build' }
    ],
    seller: {
      name: 'West Africa Heavy Fleet Ltd',
      phone: '+233 30 299 8877',
      whatsapp: '+233 55 444 6677',
      verified: true,
      location: 'Ring Road Central, Accra'
    }
  },

  // Additional Real Estate Listings
  {
    id: 'prop-cantonments-luxury-2024',
    title: 'The Cantonments Luxury Suites',
    category: 'properties',
    subCategory: 'Apartment',
    price: 4500000,
    currency: 'GHS',
    priceFormatted: 'GHS 4,500,000',
    priceUsd: 'USD ~360,000',
    featured: true,
    transactionType: 'For Sale',
    propertyType: 'Apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Striking modern luxury apartment building in Cantonments, Accra. Expansive floor-to-ceiling glass windows, private balcony garden, swimming pool, 24/7 security, and backup power generator.',
    location: 'Cantonments, Accra',
    city: 'Accra',
    beds: 3,
    baths: 3,
    showers: 3,
    sqm: 240,
    parking: 2,
    conditioning: 'Air',
    features: [
      'Floor-to-ceiling double glazed UV protected windows',
      'Fitted kitchen with integrated SMEG appliances',
      'Resort-style communal lap pool & fitness center',
      'Full automatic standby generator & water filtration system'
    ],
    specs: [
      { label: 'Beds', value: '3 Beds', icon: 'bed' },
      { label: 'Showers', value: '3 Showers', icon: 'shower' },
      { label: 'Area', value: '240 sqm', icon: 'square_foot' },
      { label: 'Parking', value: '2 Covered Slots', icon: 'local_parking' }
    ],
    seller: {
      name: 'Akwasi Luxury Properties',
      phone: '+233 30 277 8899',
      whatsapp: '+233 24 555 1212',
      verified: true,
      location: 'Cantonments, Accra'
    }
  },
  {
    id: 'prop-east-legon-office-2024',
    title: 'Prime East Legon Office Complex',
    category: 'properties',
    subCategory: 'Commercial',
    price: 25000,
    currency: 'GHS',
    priceFormatted: 'GHS 25,000',
    priceUsd: 'USD ~2,000',
    pricePeriod: '/ mo',
    featured: false,
    transactionType: 'For Rent',
    propertyType: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Expansive commercial office building in the heart of East Legon. High industrial ceiling finish, high speed fiber optic, dedicated transformer, passenger lifts, and 50+ vehicle parking lot.',
    location: 'East Legon, Accra',
    city: 'Accra',
    floors: 5,
    sqm: 1200,
    specs: [
      { label: 'Floors', value: '5 Floors', icon: 'domain' },
      { label: 'Total Area', value: '1,200 sqm', icon: 'square_foot' },
      { label: 'Elevator', value: '2 Otis Lifts', icon: 'elevator' },
      { label: 'Security', value: '24/7 CCTV & Guards', icon: 'security' }
    ],
    seller: {
      name: 'Accra Commercial Realty Partners',
      phone: '+233 20 888 1234',
      whatsapp: '+233 20 888 1234',
      verified: true,
      location: 'East Legon, Accra'
    }
  },
  {
    id: 'prop-labone-villa-2024',
    title: 'Labone Executive Villa',
    category: 'properties',
    subCategory: 'House / Villa',
    price: 8200000,
    currency: 'GHS',
    priceFormatted: 'GHS 8,200,000',
    priceUsd: 'USD ~650,000',
    featured: false,
    transactionType: 'For Sale',
    propertyType: 'House / Villa',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Ultra-modern 4-bedroom detached villa in prestigious Labone. Features an infinity swimming pool, fitted smart kitchen with German appliances, solar hybrid power, and staff quarters.',
    location: 'Labone, Accra',
    city: 'Accra',
    beds: 4,
    baths: 4,
    showers: 4,
    sqm: 450,
    parking: 3,
    conditioning: 'Air',
    specs: [
      { label: 'Beds', value: '4 Beds', icon: 'bed' },
      { label: 'Showers', value: '4 Showers', icon: 'shower' },
      { label: 'Plot Area', value: '450 sqm', icon: 'square_foot' },
      { label: 'Pool', value: 'Private Infinity Pool', icon: 'pool' }
    ],
    seller: {
      name: 'Prime Heritage Homes',
      phone: '+233 24 777 6655',
      whatsapp: '+233 24 777 6655',
      verified: true,
      location: 'Labone, Accra'
    }
  },
  {
    id: 'prop-osu-retail-2024',
    title: 'Oxford Street Retail Space',
    category: 'properties',
    subCategory: 'Commercial',
    price: 15000,
    currency: 'GHS',
    priceFormatted: 'GHS 15,000',
    priceUsd: 'USD ~1,200',
    pricePeriod: '/ mo',
    featured: false,
    transactionType: 'For Rent',
    propertyType: 'Commercial',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'High foot-traffic ground floor retail space directly facing Oxford Street, Osu. Large tempered glass storefront, air-conditioned, dedicated customer washrooms, and signage permissions.',
    location: 'Osu, Accra',
    city: 'Accra',
    sqm: 150,
    specs: [
      { label: 'Floor', value: 'Ground Floor', icon: 'storefront' },
      { label: 'Floor Area', value: '150 sqm', icon: 'square_foot' },
      { label: 'Location', value: 'Oxford Street Frontage', icon: 'location_on' },
      { label: 'Power', value: 'Dedicated 3-Phase Meter', icon: 'bolt' }
    ],
    seller: {
      name: 'Osu Commercial Assets Ltd',
      phone: '+233 20 123 9900',
      whatsapp: '+233 20 123 9900',
      verified: true,
      location: 'Osu, Accra'
    }
  }
];

export const MAKES = [
  'Any Make',
  'Toyota',
  'Mercedes-Benz',
  'Caterpillar',
  'Komatsu',
  'Volvo',
  'Bobcat',
  'Honda',
  'BMW',
  'Nissan',
  'JCB',
  'MAN',
  'Scania'
];

export const GHANA_CITIES = [
  'All Areas',
  'Accra',
  'Tema',
  'Kumasi',
  'Takoradi',
  'Tarkwa',
  'Tamale',
  'Sunyani',
  'Cape Coast',
  'East Legon',
  'Cantonments',
  'Labone',
  'Osu',
  'Airport Residential',
  'Ridge'
];
