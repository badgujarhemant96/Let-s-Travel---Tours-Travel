import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Star,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Ticket,
  ChevronDown,
  PhoneCall,
  MapPin,
  Calendar,
  Sparkles,
  ShieldAlert,
  Building2,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'home' | 'destinations' | 'packages' | 'hotels' | 'guides' | 'emergency' | 'offers' | 'planner' | 'about' | 'contact' | 'bookings' | 'admin';
  setActiveTab: (tab: any) => void;
  onOpenAuth: () => void;
  onPlanCustomTrip: () => void;
  bookingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onPlanCustomTrip,
  bookingCount
}) => {
  const { currentUser, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation items directly displayed in navbar
  const primaryNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'packages', label: 'Packages' },
    { id: 'hotels', label: 'Hotels & Stays' },
    { id: 'guides', label: 'Tour Guides' },
    { id: 'emergency', label: 'Emergency SOS' }
  ];

  // Secondary items in the "More" dropdown for clean non-overflowing desktop navigation
  const secondaryNavItems = [
    { id: 'planner', label: 'Custom Trip Planner', icon: Sparkles },
    { id: 'offers', label: 'Special Offers & Deals', icon: Star },
    { id: 'about', label: 'About LET\'S TRAVEL', icon: Compass },
    { id: 'contact', label: '24/7 Helpline & Offices', icon: PhoneCall }
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-hidden shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#00529b] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
                LET'S TRAVEL
              </div>
              <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#ea580c] leading-none">
                CUSTOM TOURS & HOLIDAYS
              </p>
            </div>
          </button>

          {/* Desktop Nav Items - Clean, fitted, zero horizontal scroll */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink min-w-0">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-50 text-[#ea580c]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  isSecondaryActive
                    ? 'bg-orange-50 text-[#ea580c]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#ea580c]' : 'text-slate-400'}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                  {secondaryNavItems.map((sec) => {
                    const IconComp = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          setActiveTab(sec.id);
                          setMoreDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                          activeTab === sec.id
                            ? 'bg-orange-50 text-[#ea580c]'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <IconComp className="w-4 h-4 text-[#ea580c] shrink-0" />
                        <span>{sec.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Bookings Nav Button */}
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-orange-50 text-[#ea580c]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>My Bookings</span>
              {bookingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#ea580c] text-white text-[10px] font-bold flex items-center justify-center">
                  {bookingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Quick My Bookings Ticket on Tablet/Mobile */}
            <button
              onClick={() => setActiveTab('bookings')}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 relative cursor-pointer"
              title="My Bookings"
            >
              <Ticket className="w-5 h-5 text-[#ea580c]" />
              {bookingCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ea580c] text-white text-[10px] font-bold flex items-center justify-center">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Plan Custom Trip Button - Desktop */}
            <button
              onClick={onPlanCustomTrip}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Star className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Plan Trip</span>
            </button>

            {/* User Account / Sign In */}
            {currentUser ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[80px] sm:max-w-[110px] truncate hidden sm:inline">
                    {currentUser.displayName || 'Traveler'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('bookings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4 text-[#ea580c]" />
                      <span>My Bookings</span>
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu - Clean layout with zero horizontal overflow */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
            Menu Navigation
          </div>

          {[...primaryNavItems, ...secondaryNavItems].map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors ${
                activeTab === link.id
                  ? 'bg-orange-50 text-[#ea580c]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{link.label}</span>
              {activeTab === link.id && <span className="w-2 h-2 rounded-full bg-[#ea580c]" />}
            </button>
          ))}

          <button
            onClick={() => {
              setActiveTab('bookings');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors ${
              activeTab === 'bookings'
                ? 'bg-orange-50 text-[#ea580c]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#ea580c]" />
              <span>My Bookings</span>
            </span>
            {bookingCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-[#ea580c] rounded-full">
                {bookingCount}
              </span>
            )}
          </button>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onPlanCustomTrip();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-800 text-center flex items-center justify-center gap-2 bg-slate-50"
            >
              <Star className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Plan Custom Trip</span>
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 text-center flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({currentUser.displayName || 'Traveler'})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#ea580c] text-white text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In to Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
