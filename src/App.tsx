import React, { useState, useEffect, useCallback } from 'react';
import { ScreenType, ListingItem } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { VehiclesScreen } from './screens/VehiclesScreen';
import { MachineryScreen } from './screens/MachineryScreen';
import { PropertiesScreen } from './screens/PropertiesScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { AdminScreen } from './screens/AdminScreen';
import { PostListingModal } from './components/PostListingModal';
import { AccountModal } from './components/AccountModal';
import { ServicesModal } from './components/ServicesModal';
import { EnquiryChatWidget } from './components/EnquiryChatWidget';
import { listings as listingsApi } from './lib/api';

function screenToPath(screen: ScreenType, listingId?: string): string {
  switch (screen) {
    case 'home': return '/';
    case 'vehicles': return '/vehicles';
    case 'machinery': return '/machinery';
    case 'properties': return '/properties';
    case 'services': return '/services';
    case 'admin': return '/admin';
    case 'listing_detail': return listingId ? `/listing/${listingId}` : '/';
    default: return '/';
  }
}

function pathToScreen(path: string): { screen: ScreenType; listingId?: string } {
  if (path === '/' || path === '/home') return { screen: 'home' };
  if (path === '/vehicles') return { screen: 'vehicles' };
  if (path === '/machinery') return { screen: 'machinery' };
  if (path === '/properties') return { screen: 'properties' };
  if (path === '/services') return { screen: 'services' };
  if (path === '/admin') return { screen: 'admin' };
  if (path.startsWith('/listing/')) {
    const parts = path.split('/');
    const listingId = parts[2];
    return { screen: 'listing_detail', listingId };
  }
  return { screen: 'home' };
}

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    return pathToScreen(window.location.pathname).screen;
  });
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('home');
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);

  // Search & Filter bridge from Home or Header to Screens
  const [searchQuery, setSearchQuery] = useState('');
  const [initialCategory, setInitialCategory] = useState<string>('all');
  const [userListings, setUserListings] = useState<ListingItem[]>([]);

  // Fetch all listings from backend on mount
  const fetchListings = useCallback(async () => {
    try {
      setListingsLoading(true);
      const data = await listingsApi.getAll();
      setListings(data as ListingItem[]);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setListingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Sync state with URL path updates (like PopState back/forward actions)
  useEffect(() => {
    const handleLocationChange = () => {
      const { screen, listingId } = pathToScreen(window.location.pathname);
      if (screen === 'listing_detail' && listingId) {
        if (listings.length > 0) {
          const match = listings.find((l) => l.id === listingId);
          if (match) {
            setSelectedListing(match);
            setCurrentScreen('listing_detail');
          } else {
            window.history.replaceState({ screen: 'home' }, '', '/');
            setCurrentScreen('home');
          }
        }
      } else {
        setCurrentScreen(screen);
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [listings]);

  const navigate = useCallback((screen: ScreenType, listingId?: string) => {
    setPreviousScreen(currentScreen);
    const path = screenToPath(screen, listingId);
    if (window.location.pathname !== path) {
      window.history.pushState({ screen, listingId }, '', path);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const handleAddListing = (newListing: ListingItem) => {
    setListings((prev) => [newListing, ...prev]);
    setUserListings((prev) => [newListing, ...prev]);
  };

  const handleOpenListingDetail = (listing: ListingItem) => {
    setSelectedListing(listing);
    setPreviousScreen(currentScreen !== 'listing_detail' ? currentScreen : 'home');
    navigate('listing_detail', listing.id);
  };

  const handleBackFromDetail = () => {
    if (selectedListing) {
      if (selectedListing.category === 'properties') {
        navigate('properties');
      } else if (selectedListing.category === 'heavy_machinery') {
        navigate('machinery');
      } else if (selectedListing.category === 'cars_vehicles') {
        navigate('vehicles');
      } else {
        navigate(previousScreen || 'home');
      }
    } else {
      navigate(previousScreen || 'home');
    }
  };

  const handleSearchWithParams = (keyword: string, location: string, category: string) => {
    setSearchQuery(keyword);
    if (category === 'heavy_machinery') {
      setInitialCategory('heavy_machinery');
    } else if (category === 'cars_vehicles') {
      setInitialCategory('all');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb] text-[#191c1e] font-sans antialiased">
      {/* Sticky Header Nav */}
      <Header
        currentScreen={currentScreen}
        onNavigate={navigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          if (currentScreen !== 'vehicles' && currentScreen !== 'machinery' && currentScreen !== 'properties') {
            navigate('vehicles');
          }
        }}
        onOpenPostListing={() => setIsPostModalOpen(true)}
        onOpenAccount={() => navigate('admin')}
      />

      {/* Screen Render */}
      <div className="flex-grow flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={navigate}
            onSelectListing={handleOpenListingDetail}
            listings={listings}
            onSearchWithParams={handleSearchWithParams}
          />
        )}

        {currentScreen === 'vehicles' && (
          <VehiclesScreen
            listings={listings}
            onSelectListing={handleOpenListingDetail}
            initialCategory={initialCategory}
            initialSearchQuery={searchQuery}
          />
        )}

        {currentScreen === 'machinery' && (
          <MachineryScreen
            listings={listings}
            onSelectListing={handleOpenListingDetail}
          />
        )}

        {currentScreen === 'properties' && (
          <PropertiesScreen
            listings={listings}
            onSelectListing={handleOpenListingDetail}
          />
        )}

        {currentScreen === 'services' && (
          <ServicesScreen
            onNavigate={navigate}
          />
        )}

        {currentScreen === 'listing_detail' && selectedListing && (
          <ListingDetailScreen
            listing={selectedListing}
            onBack={handleBackFromDetail}
            onNavigate={navigate}
            onSelectListing={handleOpenListingDetail}
            allListings={listings}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminScreen
            listings={listings}
            onUpdateListings={setListings}
            onNavigate={navigate}
            onOpenListingDetail={handleOpenListingDetail}
            onOpenCreateListing={() => setIsPostModalOpen(true)}
          />
        )}
      </div>

      {/* Industrial Footer */}
      <Footer
        onNavigate={navigate}
        onOpenService={(serviceName) => {
          if (serviceName === 'Fumigation Services' || serviceName === 'Property Management') {
            navigate('services');
          } else {
            setActiveServiceModal(serviceName);
          }
        }}
      />

      {isPostModalOpen && (
        <PostListingModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onAddListing={handleAddListing}
        />
      )}

      {isAccountModalOpen && (
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          userListings={userListings}
          onSelectListing={(listing) => {
            setIsAccountModalOpen(false);
            handleOpenListingDetail(listing);
          }}
        />
      )}

      {activeServiceModal && (
        <ServicesModal
          serviceName={activeServiceModal}
          onClose={() => setActiveServiceModal(null)}
        />
      )}

      {/* Floating Enquiries & Chatbot Widget */}
      <EnquiryChatWidget />
    </div>
  );
}

export default App;

