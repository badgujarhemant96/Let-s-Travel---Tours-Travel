import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  Users,
  Luggage,
  Building2,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
  Headphones,
  History,
  RotateCcw
} from 'lucide-react';
import { DestinationCategory } from '../types/travel';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: DestinationCategory | 'All';
  setSelectedCategory: (category: DestinationCategory | 'All') => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  departureDate: string;
  setDepartureDate: (date: string) => void;
  travelerConfig: string;
  setTravelerConfig: (trav: string) => void;
  onSearchClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDuration,
  setSelectedDuration,
  departureDate,
  setDepartureDate,
  travelerConfig,
  setTravelerConfig,
  onSearchClick
}) => {
  const [activeSearchTab, setActiveSearchTab] = useState<'packages' | 'hotels'>('packages');

  const DEFAULT_RECENTS = [
    'Agra & Taj Mahal',
    'Manali & Solang Valley',
    'Goa Coastal Beaches',
    'Kashmir Paradise Circuit',
    'Varanasi Ganga Ghats',
    'Bali Island Special'
  ];

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lets_travel_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECENTS;
  });

  const handleSelectRecentSearch = (term: string) => {
    setSearchQuery(term);
    const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('lets_travel_recent_searches', JSON.stringify(updated));
    } catch {}
    onSearchClick();
  };

  const handleClearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('lets_travel_recent_searches');
    } catch {}
  };

  const handlePrimarySearch = () => {
    if (searchQuery.trim()) {
      const term = searchQuery.trim();
      const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      try {
        localStorage.setItem('lets_travel_recent_searches', JSON.stringify(updated));
      } catch {}
    }
    onSearchClick();
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white min-h-[580px] flex flex-col justify-between">
      {/* Background with misty lake and pine mountain forest matching Screenshot 1 */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          alt="Misty Mountain Forest"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
      </div>

      {/* Main Hero Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 text-center">
        
        {/* Top Tag Pill - Exactly as in Screenshot 1 */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6 shadow-sm">
          <span className="text-amber-400">★</span>
          <span>Custom Tours & Verified Stays Across India & Beyond</span>
        </div>

        {/* Headline - Exactly as in Screenshot 1 */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Plan Trips Across India and Beyond
        </h1>

        {/* Subtitle - Exactly as in Screenshot 1 */}
        <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
          Flexible, customizable itineraries with transparent Indian Rupee pricing, handpicked stays, and dedicated support from planning to return.
        </p>

        {/* Search Card Container - Exactly as in Screenshot 1 */}
        <div className="mt-10 max-w-5xl mx-auto bg-white rounded-3xl p-2 sm:p-4 text-slate-800 shadow-2xl">
          
          {/* Card Tabs: Holiday Packages & Hotels & Stays */}
          <div className="flex items-center gap-6 px-4 pt-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => setActiveSearchTab('packages')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                activeSearchTab === 'packages'
                  ? 'border-[#ea580c] text-[#ea580c]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Luggage className="w-4 h-4 text-blue-600" />
              <span>Holiday Packages</span>
            </button>

            <button
              onClick={() => setActiveSearchTab('hotels')}
              className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-2 border-b-2 transition-all cursor-pointer ${
                activeSearchTab === 'hotels'
                  ? 'border-[#ea580c] text-[#ea580c]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Hotels & Stays</span>
            </button>
          </div>

          {/* Form Fields Row */}
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* Destination */}
            <div className="lg:col-span-4 text-left p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-all">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                Destination
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Gorakhpur, Manali, Goa..."
                  className="w-full bg-transparent text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-hidden"
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="lg:col-span-2 text-left p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-all">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                Departure Date
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 outline-hidden mt-0.5"
              />
            </div>

            {/* Duration / Theme */}
            <div className="lg:col-span-3 text-left p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-all">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                Duration / Theme
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 outline-hidden mt-0.5 cursor-pointer"
              >
                <option value="all">5 – 6 Days (Most Popular)</option>
                <option value="weekend">3 – 4 Days (Weekend)</option>
                <option value="extended">7 – 10 Days (Extended)</option>
                <option value="honeymoon">Honeymoon Specials</option>
                <option value="family">Family Vacations</option>
                <option value="heritage">Heritage & Spiritual</option>
              </select>
            </div>

            {/* Travellers */}
            <div className="lg:col-span-2 text-left p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-all">
              <label className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
                Travellers
              </label>
              <select
                value={travelerConfig}
                onChange={(e) => setTravelerConfig(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 outline-hidden mt-0.5 cursor-pointer"
              >
                <option value="2 Adults (Couple)">2 Adults (Couple)</option>
                <option value="1 Adult (Solo)">1 Adult (Solo)</option>
                <option value="Family (2 Adults + 2 Kids)">Family (2+2)</option>
                <option value="Group (4+ Adults)">Group (4+ Adults)</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1">
              <button
                onClick={handlePrimarySearch}
                className="w-full h-11 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-orange-600/30 transition-all cursor-pointer active:scale-95"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Recent Searches Quick Pills Bar */}
        {recentSearches.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-orange-400" />
              <span>Recent Searches:</span>
            </span>
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectRecentSearch(term)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium text-[11px] transition-all cursor-pointer hover:border-orange-400 hover:text-orange-300 active:scale-95 shadow-2xs"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClearRecentSearches}
              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer ml-1"
              title="Clear recent searches"
            >
              Clear
            </button>
          </div>
        )}

      </div>

      {/* Feature Strip - Bottom of Screenshot 1 */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xs py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-around gap-4 text-xs font-medium text-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ea580c]" />
            <span className="font-bold text-white">Customizable Plans</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">— Tailor itinerary to your pace</span>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#ea580c]" />
            <span className="font-bold text-white">Transparent Pricing</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">— Clear inclusions in Indian Rupees</span>
          </div>

          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#ea580c]" />
            <span className="font-bold text-white">End-to-End Support</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">— Assistance from booking to return</span>
          </div>
        </div>
      </div>
    </div>
  );
};
