import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Ticket,
  ArrowRight,
  Star,
  Users,
  Search,
  Building2,
  Tag,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  X,
  IndianRupee,
  Luggage,
  Heart,
  Send,
  Plane,
  Train,
  Bus,
  AlertTriangle,
  Utensils
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationCard } from './components/DestinationCard';
import { DestinationModal } from './components/DestinationModal';
import { BookingModal } from './components/BookingModal';
import { TicketVoucherModal } from './components/TicketVoucherModal';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { TourGuidesSection } from './components/TourGuidesSection';
import { EmergencyServicesSection } from './components/EmergencyServicesSection';
import { Footer } from './components/Footer';
import {
  Destination,
  Booking,
  PaymentRecord,
  UserProfile,
  DestinationCategory,
  TravelMode
} from './types/travel';
import {
  seedInitialDatabaseIfEmpty,
  subscribeToDestinations,
  subscribeToUserBookings,
  subscribeToAllBookings,
  subscribeToAllPayments,
  subscribeToAllUsers
} from './services/travelService';
import { SEED_DESTINATIONS, VALID_PROMO_CODES } from './data/seedDestinations';

type NavTab =
  | 'home'
  | 'destinations'
  | 'packages'
  | 'hotels'
  | 'guides'
  | 'emergency'
  | 'offers'
  | 'planner'
  | 'about'
  | 'contact'
  | 'bookings'
  | 'admin';

function MainApp() {
  const { currentUser } = useAuth();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | 'All'>('All');
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [travelerConfig, setTravelerConfig] = useState('2 Adults (Couple)');

  // Custom Trip Planner Modal
  const [isCustomPlanOpen, setIsCustomPlanOpen] = useState(false);
  const [customPlanSubmitted, setCustomPlanSubmitted] = useState(false);
  const [customPlanData, setCustomPlanData] = useState({
    destName: 'Kashmir & Ladakh',
    days: '6 Days',
    budget: '₹35,000 - ₹50,000 per person',
    phone: '+91 98201 44892',
    notes: 'Looking for romantic houseboat stay and private vehicle'
  });

  // Firestore Data State
  const [destinations, setDestinations] = useState<Destination[]>(SEED_DESTINATIONS);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allPayments, setAllPayments] = useState<PaymentRecord[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  // Modals
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [bookingDestination, setBookingDestination] = useState<Destination | null>(null);
  const [ticketBooking, setTicketBooking] = useState<Booking | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Hotels View Filters & Calculations
  const [hotelDestFilter, setHotelDestFilter] = useState<string>('all');
  const [hotelCategoryFilter, setHotelCategoryFilter] = useState<string>('all');

  const allConnectedHotels = useMemo(() => {
    return destinations.flatMap((dest) =>
      (dest.hotels || []).map((h) => ({
        ...h,
        destinationObj: dest
      }))
    );
  }, [destinations]);

  const filteredHotels = useMemo(() => {
    return allConnectedHotels.filter((hotel) => {
      if (hotelDestFilter !== 'all' && hotel.destinationObj.id !== hotelDestFilter) {
        return false;
      }
      if (hotelCategoryFilter !== 'all') {
        const catLower = (hotel.category || '').toLowerCase();
        if (hotelCategoryFilter === '5-star' && !catLower.includes('5-star') && !catLower.includes('ultra-luxury')) return false;
        if (hotelCategoryFilter === 'heritage' && !catLower.includes('heritage') && !catLower.includes('palace') && !catLower.includes('haveli')) return false;
        if (hotelCategoryFilter === 'resort' && !catLower.includes('resort') && !catLower.includes('estate') && !catLower.includes('villas')) return false;
        if (hotelCategoryFilter === 'comfort' && !catLower.includes('comfort') && !catLower.includes('3-star') && !catLower.includes('inn') && !catLower.includes('chalet') && !catLower.includes('camp')) return false;
      }
      return true;
    });
  }, [allConnectedHotels, hotelDestFilter, hotelCategoryFilter]);

  // Seed database once and subscribe to Firestore collections
  useEffect(() => {
    seedInitialDatabaseIfEmpty();

    const unsubDest = subscribeToDestinations((dests) => {
      if (dests && dests.length > 0) {
        setDestinations(dests);
      }
    });

    const unsubAllBookings = subscribeToAllBookings((b) => {
      setAllBookings(b);
    });

    const unsubPayments = subscribeToAllPayments((p) => {
      setAllPayments(p);
    });

    const unsubUsers = subscribeToAllUsers((u) => {
      setAllUsers(u);
    });

    return () => {
      unsubDest();
      unsubAllBookings();
      unsubPayments();
      unsubUsers();
    };
  }, []);

  // Subscribe to logged-in user's personal bookings
  useEffect(() => {
    if (currentUser?.uid) {
      const unsubUserBookings = subscribeToUserBookings(currentUser.uid, (b) => {
        setUserBookings(b);
      });
      return () => unsubUserBookings();
    } else {
      setUserBookings([]);
    }
  }, [currentUser?.uid]);

  // Filtered Destinations for the catalog
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // Category filter
      const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;

      // Travel mode filter (Flights, Trains, Buses, SUV)
      const matchesTravelMode = selectedTravelMode === 'all' || dest.travelMode === selectedTravelMode;

      // Duration filter
      let matchesDuration = true;
      if (selectedDuration === 'weekend') {
        matchesDuration = dest.durationDays <= 4;
      } else if (selectedDuration === 'extended') {
        matchesDuration = dest.durationDays >= 7;
      } else if (selectedDuration === 'honeymoon') {
        matchesDuration =
          dest.badge?.toLowerCase().includes('honeymoon') ||
          dest.title.toLowerCase().includes('kashmir') ||
          dest.title.toLowerCase().includes('bali') ||
          dest.title.toLowerCase().includes('goa');
      }

      // Search query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        dest.title.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.city.toLowerCase().includes(query) ||
        dest.category.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query) ||
        (dest.stateRegion && dest.stateRegion.toLowerCase().includes(query));

      return matchesCategory && matchesTravelMode && matchesDuration && matchesSearch;
    });
  }, [destinations, selectedCategory, selectedTravelMode, selectedDuration, searchQuery]);

  // Handle Book Now Click
  const handleOpenBooking = (dest: Destination) => {
    setBookingDestination(dest);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('destinations-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGuides = () => {
    const el = document.getElementById('tour-guides-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToEmergency = () => {
    const el = document.getElementById('emergency-services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#ea580c] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab: NavTab) => {
          setActiveTab(tab);
          if (tab === 'destinations' || tab === 'packages') {
            setTimeout(scrollToCatalog, 50);
          } else if (tab === 'guides') {
            setTimeout(scrollToGuides, 50);
          } else if (tab === 'emergency') {
            setTimeout(scrollToEmergency, 50);
          } else if (tab === 'planner') {
            setIsCustomPlanOpen(true);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onPlanCustomTrip={() => setIsCustomPlanOpen(true)}
        bookingCount={userBookings.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HOME, DESTINATIONS, PACKAGES TABS */}
        {(activeTab === 'home' || activeTab === 'destinations' || activeTab === 'packages' || activeTab === 'guides' || activeTab === 'emergency') && (
          <div>
            {/* Cinematic Hero Banner with Live Search & Date Selectors */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              travelerConfig={travelerConfig}
              setTravelerConfig={setTravelerConfig}
              onSearchClick={scrollToCatalog}
            />

            {/* Popular Circuits Quick Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 relative z-10">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 p-4 flex items-center justify-between gap-4 overflow-x-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-[#ea580c]" />
                  <span>Trending Circuits:</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {[
                    { label: 'Himachal Snow Trails', query: 'Manali' },
                    { label: 'Kashmir Paradise', query: 'Gulmarg' },
                    { label: 'Goa Golden Coast', query: 'Goa' },
                    { label: 'Kerala Backwaters', query: 'Munnar' },
                    { label: 'Royal Rajasthan', query: 'Jaipur' },
                    { label: 'Andaman Lagoons', query: 'Havelock' },
                    { label: 'Rishikesh Adventure', query: 'Rishikesh' }
                  ].map((circuit) => (
                    <button
                      key={circuit.label}
                      onClick={() => {
                        setSearchQuery(circuit.query);
                        scrollToCatalog();
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-orange-50 hover:text-[#ea580c] text-slate-700 transition-all shrink-0 cursor-pointer"
                    >
                      {circuit.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Destinations & Multimodal Travel Packages Catalog */}
            <section id="destinations-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#ea580c] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curated Indian & Global Holidays</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 mt-2">
                    {selectedTravelMode !== 'all'
                      ? `${selectedTravelMode.toUpperCase()} Travel Packages`
                      : selectedCategory === 'All'
                      ? 'Handcrafted Tour Packages & Itineraries'
                      : `${selectedCategory} Tours`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    Every package features verified stays, food facilities, local transportation, Google Maps links, and 5% GST itemized in Indian Rupees (₹).
                  </p>
                </div>

                {/* Multimodal Transport Filter Tabs - Fulfilling Requirement 5 */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'All Packages' },
                    { id: 'flight', label: 'Flights ✈️' },
                    { id: 'train', label: 'Scenic Trains 🚆' },
                    { id: 'bus', label: 'Volvo Buses 🚌' },
                    { id: 'private_cab', label: 'Private SUV 🚙' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedTravelMode(mode.id as TravelMode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedTravelMode === mode.id
                          ? 'bg-[#00529b] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredDestinations.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-slate-900">No Tours Match Your Search</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try clearing search keywords or selecting 'All Packages' to view all available tour packages.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedTravelMode('all');
                      setSelectedDuration('all');
                    }}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredDestinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      onSelect={(d) => setSelectedDestination(d)}
                      onBookNow={handleOpenBooking}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Dedicated Tour Guide Services Section - Requirement 6 */}
            <TourGuidesSection onHireGuideSuccess={(name) => alert(`Tour Guide ${name} booked! Check your SMS/WhatsApp for verification details.`)} />

            {/* Noticeable Compact Emergency Services Section - Requirement 7 */}
            <EmergencyServicesSection />

            {/* Travel Experience & Concierge Features */}
            <section className="bg-white py-16 border-y border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
                    Why Travellers Choose LET'S TRAVEL
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    Transparent Indian Rupee pricing, verified resort partnerships, and 24/7 dedicated travel support.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-sky-100 text-[#00529b] flex items-center justify-center mx-auto shadow-xs">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Direct Google Maps Navigation</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every destination and hotel is linked directly with Google Maps so you can inspect resort locations, topography, and distances in browser before departure.
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#ea580c] flex items-center justify-center mx-auto shadow-xs">
                      <IndianRupee className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Clear Rupee Pricing & Inclusions</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Zero hidden surcharges. Enjoy complete clarity with breakfast, private sanitized vehicles, sightseeing passes, and 5% GST included in Indian Rupees (₹).
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Instant Self-Service Rescheduling</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Change in schedule? Modify your trip dates, retrieve printable boarding passes, and manage bookings anytime from your traveler dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Traveler Reviews & Testimonials Carousel */}
            <TestimonialsSection />
          </div>
        )}

        {/* HOTELS & STAYS VIEW - Connected to Every Destination Across All Budgets */}
        {activeTab === 'hotels' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
                Verified Stays & Resort Accommodations
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-slate-900 mt-3">
                Hotels & Stays for Every Destination
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Every tour package includes verified accommodation options across multiple budgets—from 5-star royal palaces and high-altitude luxury chalets to beachfront private villas and serene houseboats.
              </p>
            </div>

            {/* Filter Bar: Destination Selector & Budget Filters */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 mb-10 shadow-2xs space-y-4">
              
              {/* Destination Filter */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Filter By Travel Destination:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                  <button
                    onClick={() => setHotelDestFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      hotelDestFilter === 'all'
                        ? 'bg-[#00529b] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Destinations ({allConnectedHotels.length} Hotels)
                  </button>
                  {destinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => setHotelDestFilter(dest.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        hotelDestFilter === dest.id
                          ? 'bg-[#00529b] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {dest.city} ({(dest.hotels || []).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget / Category Filter */}
              <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Accommodation Style:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'All Budgets' },
                      { id: '5-star', label: '5-Star Luxury' },
                      { id: 'heritage', label: 'Heritage & Palaces' },
                      { id: 'resort', label: 'Scenic Resorts & Villas' },
                      { id: 'comfort', label: 'Comfort & Nature Lodges' }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setHotelCategoryFilter(btn.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          hotelCategoryFilter === btn.id
                            ? 'bg-[#ea580c] text-white shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  Showing <strong className="text-slate-900 font-mono">{filteredHotels.length}</strong> verified accommodations
                </span>
              </div>

            </div>

            {/* Hotels Grid */}
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 font-serif">No Hotels In This Category</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try switching back to 'All Budgets' or selecting a different destination circuit.
                </p>
                <button
                  onClick={() => {
                    setHotelDestFilter('all');
                    setHotelCategoryFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#ea580c] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Reset Hotel Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Hotel Photo & Rating Badge */}
                      <div className="h-56 relative bg-slate-900 overflow-hidden">
                        <img
                          src={hotel.imageUrl || hotel.destinationObj.imageUrl}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        {/* Rating Tag */}
                        <span className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 shadow-xs">
                          ★ {hotel.rating}
                        </span>

                        {/* Connected Destination Link Badge */}
                        <button
                          type="button"
                          onClick={() => setSelectedDestination(hotel.destinationObj)}
                          className="absolute top-3 left-3 bg-[#00529b]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1 hover:bg-[#003d73] transition-colors cursor-pointer"
                          title="View Full Tour Package"
                        >
                          <Compass className="w-3 h-3 text-orange-400" />
                          <span className="truncate max-w-[180px]">{hotel.destinationObj.city} Circuit</span>
                        </button>

                        {/* Location Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="text-base font-bold font-serif leading-snug drop-shadow-sm line-clamp-1">
                            {hotel.name}
                          </h3>
                          <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-[#ea580c] shrink-0" />
                            <span>{hotel.location || hotel.destinationObj.city}</span>
                          </p>
                        </div>
                      </div>

                      {/* Hotel Information */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#ea580c] text-[11px]">{hotel.category}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{hotel.roomType}</span>
                        </div>

                        {/* Food Plan & Dining Facilities */}
                        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                            <Utensils className="w-3.5 h-3.5 text-amber-700" />
                            <span>Meal Plan: {hotel.foodPlan}</span>
                          </div>
                          {hotel.foodOptions && hotel.foodOptions.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {hotel.foodOptions.map((opt, i) => (
                                <span key={i} className="text-[10px] bg-white border border-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-medium">
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Facilities & Amenities */}
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                            Available Facilities:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {hotel.amenities.map((a, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Booking Details Note */}
                        {hotel.bookingDetails && (
                          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                            💡 {hotel.bookingDetails}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Tariff Starting From
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-slate-900 font-mono">
                            ₹{(hotel.pricePerNight || Math.round(hotel.destinationObj.pricePerPerson * 0.4)).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-500">/ night</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedDestination(hotel.destinationObj)}
                          className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-center"
                        >
                          View Tour
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenBooking(hotel.destinationObj)}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                        >
                          <span>Book Stay</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* OFFERS & DEALS VIEW */}
        {activeTab === 'offers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Special Seasonal Discounts
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 mt-2">
                Exclusive Tour Savings & Coupon Codes
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Apply these verified codes during booking checkout for instant flat and percentage price deductions!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(VALID_PROMO_CODES).map(([code, details]) => (
                <div key={code} className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#ea580c]/40 shadow-sm relative overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ea580c] flex items-center justify-center mb-4">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-xl bg-orange-100 text-[#ea580c] font-mono font-black text-sm tracking-widest">
                      {code}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-2">
                    {details.discountPercent ? `${details.discountPercent}% Off Total Tour Bill` : `Flat ₹${details.discountFixed} Instant Discount`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {details.description}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(code);
                      alert(`Code ${code} copied to clipboard! Paste it during booking checkout.`);
                    }}
                    className="mt-5 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    Copy Promo Code
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT & CONTACT VIEW */}
        {(activeTab === 'about' || activeTab === 'contact') && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg space-y-10">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  LET'S TRAVEL • CUSTOM TOURS & HOLIDAYS
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 mt-2">
                  Crafting Memorable Journeys Across India & Beyond
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Founded with the conviction that travel should be flexible, personal, and devoid of hidden surcharges.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <h3 className="font-bold font-serif text-xl text-slate-900">Our Operational Standards</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We maintain our own dedicated network of vetted commercial chauffeurs and licensed regional guides across Himachal Pradesh, Jammu & Kashmir, Kerala, Goa, and Rajasthan.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>100% verified 4-star and luxury boutique accommodations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Transparent all-inclusive pricing formatted in Indian Rupees (₹)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Instant self-service date rescheduling without paperwork</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-bold font-serif text-lg text-slate-900">24/7 Travel Desk & Registered Offices</h3>
                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                      <div>
                        <strong>New Delhi Headquarters:</strong>
                        <p className="text-slate-500">Suite 402, Barakhamba Road, Connaught Place, New Delhi - 110001</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                      <div>
                        <strong>Mumbai Regional Office:</strong>
                        <p className="text-slate-500">7th Floor, Express Towers, Nariman Point, Mumbai - 400021</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Toll-Free Helpline:</strong> +91 1800-209-7711</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#00529b] shrink-0" />
                      <span><strong>Support Email:</strong> support@letstravel.co.in</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMER MY BOOKINGS VIEW */}
        {activeTab === 'bookings' && (
          <MyBookingsView
            bookings={userBookings}
            onOpenTicket={(b) => setTicketBooking(b)}
            onExploreClick={() => setActiveTab('home')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {/* SECURE ADMIN CONSOLE - 4 AUTHORIZED ADMINS */}
        {activeTab === 'admin' && (
          <AdminPanel
            destinations={destinations}
            bookings={allBookings}
            payments={allPayments}
            users={allUsers}
            onOpenTicket={(b) => setTicketBooking(b)}
            onCloseAdmin={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Footer with Staff Admin Link at the Bottom */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('home');
          setTimeout(scrollToCatalog, 50);
        }}
        onSelectDestination={(title) => {
          setSearchQuery(title);
          setActiveTab('home');
          setTimeout(scrollToCatalog, 50);
        }}
        onOpenAdmin={() => {
          setActiveTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Destination Details Modal */}
      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onBookNow={(dest) => {
          setSelectedDestination(null);
          setBookingDestination(dest);
        }}
      />

      {/* Trip Booking Wizard Modal with INR calculation */}
      <BookingModal
        destination={bookingDestination}
        onClose={() => setBookingDestination(null)}
        onBookingSuccess={(booking) => {
          setTicketBooking(booking);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Digital E-Ticket & Boarding Pass Voucher Modal */}
      <TicketVoucherModal
        booking={ticketBooking}
        onClose={() => setTicketBooking(null)}
      />

      {/* Authentication Modal with Alphanumeric Validation & Friendly Errors */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Custom Trip Planner Modal */}
      {isCustomPlanOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => {
                setIsCustomPlanOpen(false);
                setCustomPlanSubmitted(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {customPlanSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Custom Trip Inquiry Received!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Our destination concierge will call your registered contact at <strong>{customPlanData.phone}</strong> within 30 minutes with a bespoke itinerary and itemized Rupee quote.
                </p>
                <button
                  onClick={() => {
                    setIsCustomPlanOpen(false);
                    setCustomPlanSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
                >
                  Back to Escapes
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                    Bespoke Itineraries
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                  Plan Your Custom Vacation
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tell us where you wish to go, your preferred pace, and we'll craft an exclusive package tailored to you.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCustomPlanSubmitted(true);
                  }}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Circuit / Region</label>
                    <input
                      type="text"
                      required
                      value={customPlanData.destName}
                      onChange={(e) => setCustomPlanData({ ...customPlanData, destName: e.target.value })}
                      placeholder="e.g. Kashmir, Ladakh, Spiti Valley, or Bali"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#ea580c] outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
                      <select
                        value={customPlanData.days}
                        onChange={(e) => setCustomPlanData({ ...customPlanData, days: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white outline-hidden cursor-pointer"
                      >
                        <option value="4 Days">4 Days (Quick Break)</option>
                        <option value="6 Days">6 Days (Recommended)</option>
                        <option value="8 Days">8 Days (Leisure)</option>
                        <option value="12+ Days">12+ Days (Grand Tour)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Target Budget (Per Person)</label>
                      <select
                        value={customPlanData.budget}
                        onChange={(e) => setCustomPlanData({ ...customPlanData, budget: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white outline-hidden cursor-pointer"
                      >
                        <option value="₹15,000 - ₹25,000">₹15,000 - ₹25,000</option>
                        <option value="₹25,000 - ₹40,000">₹25,000 - ₹40,000</option>
                        <option value="₹40,000 - ₹65,000">₹40,000 - ₹65,000</option>
                        <option value="₹65,000+ Luxury">₹65,000+ Luxury</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number for WhatsApp Concierge</label>
                    <input
                      type="tel"
                      required
                      value={customPlanData.phone}
                      onChange={(e) => setCustomPlanData({ ...customPlanData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#ea580c] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Special Preferences / Notes</label>
                    <textarea
                      rows={3}
                      value={customPlanData.notes}
                      onChange={(e) => setCustomPlanData({ ...customPlanData, notes: e.target.value })}
                      placeholder="e.g. Vegetarian food only, river rafting preference, anniversary honeymoon decor..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#ea580c] outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Custom Itinerary & Rupee Quote</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
