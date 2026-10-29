import React from 'react';
import {
  Compass,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  BookOpen,
  Shield
} from 'lucide-react';
import { DestinationCategory } from '../types/travel';

interface FooterProps {
  onSelectCategory: (category: DestinationCategory | 'All') => void;
  onSelectDestination: (title: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectDestination,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#071a23] text-slate-300 border-t border-slate-800/80 mt-20">
      
      {/* Main Footer Grid - Exactly as in Screenshot 3 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00529b] flex items-center justify-center text-white shadow-sm">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-tight">
                  LET'S TRAVEL
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ea580c] block leading-none">
                  CUSTOM TOURS & HOLIDAYS
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Curating flexible, comfortable journeys across the majestic landscapes and cultural circuits of India and beyond.
            </p>

            {/* Inclusions Badges - As in Screenshot 3 */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Transparent Inclusions</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Custom Planning Support</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 580, behavior: 'smooth' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Destinations
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 580, behavior: 'smooth' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Holiday Packages
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Curated Hotels</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Special Offers</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Trip Planner</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-default">Contact Desk</span>
              </li>
            </ul>
          </div>

          {/* Popular Circuits Column */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Popular Circuits</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {['Shimla & Manali', 'Srinagar & Gulmarg', 'Goa Beach Escapes', 'Munnar & Alleppey', 'Jaipur & Udaipur', 'Havelock & Andaman'].map((circuit) => (
                <li key={circuit}>
                  <button
                    onClick={() => onSelectDestination(circuit)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {circuit}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel Styles & Contact Column */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Travel Styles</h4>
            <ul className="space-y-2 text-xs text-slate-400 mb-6">
              {[
                'Mountain Trails',
                'Beach & Coastal',
                'Honeymoon Specials',
                'Family Vacations',
                'Weekend Getaways',
                'Heritage & Spiritual'
              ].map((style) => (
                <li key={style}>
                  <button
                    onClick={() => onSelectCategory('All')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {style}
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-bold text-white mb-3">Contact Details</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>CP, New Delhi & Nariman Point, Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>+91 1800-209-7711 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>support@letstravel.co.in</span>
              </div>
            </div>

            {/* Social Icons Circles */}
            <div className="flex items-center gap-2 mt-4">
              {['IG', 'FB', 'X', 'YT'].map((network) => (
                <div
                  key={network}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:bg-[#ea580c] hover:text-white text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer"
                >
                  {network}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Sub-Strip - Exactly as in Screenshot 3 */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col lg:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 LET'S TRAVEL. All rights reserved. Prices indicative in Indian Rupees (₹).</p>

          <div className="flex flex-wrap items-center gap-5">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Enquiry Support</span>

            {/* Staff Admin Portal - Bottom of Website - Requested by User! */}
            <button
              onClick={onOpenAdmin}
              className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-900/60 px-3 py-1 rounded-lg border border-sky-500/20"
            >
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Staff Admin Portal 🛡️</span>
            </button>

            <span className="text-slate-500">IN Currency: Indian Rupee (₹)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
