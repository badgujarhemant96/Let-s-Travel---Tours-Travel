import React from 'react';
import {
  MapPin,
  Star,
  ExternalLink,
  ArrowRight,
  Compass
} from 'lucide-react';
import { Destination } from '../types/travel';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (dest: Destination) => void;
  onBookNow: (dest: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  onBookNow
}) => {
  return (
    <div
      onClick={() => onSelect(destination)}
      className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-[360px] sm:h-[380px] bg-slate-900 cursor-pointer border border-slate-800"
    >
      {/* Background Photography with moody scenic aesthetic as in Screenshot 2 */}
      <img
        src={destination.imageUrl}
        alt={destination.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
      />

      {/* Atmospheric dark gradient overlays matching Screenshot 2 */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />

      {/* Top Bar: Optional Category Badge and Star Rating */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        {destination.badge ? (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-xs">
            {destination.badge}
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900/60 backdrop-blur-md text-slate-200 border border-white/10">
            {destination.category}
          </span>
        )}

        <div className="flex items-center gap-2">
          {/* Map Link Icon */}
          <a
            href={destination.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${destination.title} on Google Maps`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full bg-slate-900/80 hover:bg-[#ea580c] text-white backdrop-blur-md transition-colors flex items-center gap-1 text-[11px] font-semibold"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline pr-1">Map</span>
            <ExternalLink className="w-3 h-3 text-slate-300" />
          </a>

          {/* Star Rating Badge - As in Screenshot 2 */}
          <div className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 flex items-center gap-1 text-xs font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{destination.rating ? destination.rating.toFixed(1) : '4.8'}</span>
          </div>
        </div>
      </div>

      {/* Middle/Bottom Information: State, Title, Description, and Price - Exactly as in Screenshot 2 */}
      <div className="relative z-10 p-6 flex flex-col justify-end">
        {/* State/Region in uppercase */}
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300 drop-shadow-sm">
          {destination.stateRegion || `${destination.city}, ${destination.country}`.toUpperCase()}
        </p>

        {destination.hotels && destination.hotels.length > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-amber-300 font-semibold truncate">
            <span>🏨 {destination.hotels.length} Hotels Included</span>
            <span>•</span>
            <span className="truncate">{destination.hotels[0].foodPlan}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight mt-1 group-hover:text-amber-300 transition-colors">
          {destination.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed font-light">
          {destination.subtitle || destination.description}
        </p>

        {/* Bottom Bar: Curated tours count & Rupee Price - Exactly as in Screenshot 2 */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-baseline justify-between">
          <div className="text-left">
            <span className="text-xs font-bold text-white block">
              {destination.curatedToursCount || 10} Curated
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Tours
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                ₹{destination.pricePerPerson.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-300">per person</span>
            </div>
          </div>
        </div>

        {/* Hover Action Bar */}
        <div className="mt-3 flex items-center gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(destination);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold transition-all text-center"
          >
            View Package
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(destination);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
