import React, { useState } from 'react';
import { ScreenType, ListingItem } from './types';
import { INITIAL_LISTINGS } from './data/mockData';
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

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('home');
  const [listings, setListings] = useState<ListingItem[]>(INITIAL_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);

  // Search & Filter bridge from Home or Header to Screens
  const [searchQuery, setSearchQuery] = useState('');
  const [initialCategory, setInitialCategory] = useState<string>('all');
  const [userListings, setUserListings] = useState<ListingItem[]>([]);

  const handleAddListing = (newListing: ListingItem) => {
    setListings((prev) => [newListing, ...prev]);
    setUserListings((prev) => [newListing, ...prev]);
  };

  const handleOpenListingDetail = (listing: ListingItem) => {
    setSelectedListing(listing);
    setPreviousScreen(currentScreen !== 'listing_detail' ? currentScreen : 'home');
    setCurrentScreen('listing_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    if (selectedListing) {
      if (selectedListing.category === 'properties') {
        setCurrentScreen('properties');
      } else if (selectedListing.category === 'heavy_machinery') {
        setCurrentScreen('machinery');
      } else if (selectedListing.category === 'cars_vehicles') {
        setCurrentScreen('vehicles');
      } else {
        setCurrentScreen(previousScreen || 'home');
      }
    } else {
      setCurrentScreen(previousScreen || 'home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        onNavigate={(screen) => {
          setPreviousScreen(currentScreen);
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          if (currentScreen !== 'vehicles' && currentScreen !== 'machinery' && currentScreen !== 'properties') {
            setCurrentScreen('vehicles');
          }
        }}
        onOpenPostListing={() => setIsPostModalOpen(true)}
        onOpenAccount={() => {
          setCurrentScreen('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Screen Render */}
      <div className="flex-grow flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={(screen) => {
              setPreviousScreen('home');
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            onNavigate={(screen) => {
              setPreviousScreen('services');
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentScreen === 'listing_detail' && selectedListing && (
          <ListingDetailScreen
            listing={selectedListing}
            onBack={handleBackFromDetail}
            onNavigate={(screen) => {
              setPreviousScreen('listing_detail');
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectListing={handleOpenListingDetail}
            allListings={listings}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminScreen
            listings={listings}
            onUpdateListings={setListings}
            onNavigate={(screen) => {
              setPreviousScreen('admin');
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenListingDetail={handleOpenListingDetail}
            onOpenCreateListing={() => setIsPostModalOpen(true)}
          />
        )}
      </div>

      {/* Industrial Footer */}
      <Footer
        onNavigate={(screen) => {
          setPreviousScreen(currentScreen);
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenService={(serviceName) => {
          if (serviceName === 'Fumigation Services' || serviceName === 'Property Management') {
            setCurrentScreen('services');
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

