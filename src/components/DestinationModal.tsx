import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building2,
  Utensils,
  Plane,
  Train,
  Bus,
  Car,
  Receipt,
  Navigation
} from 'lucide-react';
import { Destination } from '../types/travel';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  onBookNow: (dest: Destination) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onBookNow
}) => {
  if (!destination) return null;

  const [activePhoto, setActivePhoto] = useState<string>(destination.imageUrl);

  // Fallback exclusions if not provided
  const exclusions = destination.exclusions || [
    'Optional adventure sport passes & personal equipment rental',
    'Personal telephone calls, laundry, and mini-bar expenses',
    'Monument camera fees and personal shopping'
  ];

  const gstAmount = Math.round(destination.pricePerPerson * 0.05);
  const totalPriceWithGst = destination.pricePerPerson;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer backdrop-blur-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto flex-1">
          
          {/* Main Gallery Banner */}
          <div className="relative h-72 sm:h-96 bg-slate-900">
            <img
              src={activePhoto}
              alt={destination.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Bottom Floating Title */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ea580c] text-white shadow-xs">
                  {destination.category}
                </span>

                {/* Travel Mode Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00529b] text-white flex items-center gap-1.5 shadow-xs">
                  {destination.travelMode === 'flight' && <Plane className="w-3.5 h-3.5" />}
                  {destination.travelMode === 'train' && <Train className="w-3.5 h-3.5" />}
                  {destination.travelMode === 'bus' && <Bus className="w-3.5 h-3.5" />}
                  {destination.travelMode === 'private_cab' && <Car className="w-3.5 h-3.5" />}
                  <span className="capitalize">{destination.travelMode || 'All-Inclusive'} Package</span>
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {destination.durationDays} Days / {destination.durationNights} Nights
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {destination.rating.toFixed(2)} ({destination.reviewCount} reviews)
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight drop-shadow-md">
                {destination.title}
              </h2>
              <p className="text-sm text-slate-200 mt-1 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{destination.city}, {destination.country}</span>
                {destination.coordinates && (
                  <span className="text-slate-300 text-xs font-mono ml-2">({destination.coordinates})</span>
                )}
              </p>
            </div>
          </div>

          {/* Gallery Thumbnails if multiple */}
          {destination.gallery && destination.gallery.length > 1 && (
            <div className="px-6 py-3 bg-slate-100 flex items-center gap-3 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Photos:</span>
              {destination.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(img)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activePhoto === img ? 'border-[#ea580c] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Content Layout */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Overview & Quick Info */}
            <div>
              <h3 className="text-xs font-extrabold text-[#ea580c] uppercase tracking-widest mb-2">Package Overview</h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {destination.description}
              </p>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-400 block font-medium">Best Season</span>
                  <span className="text-sm font-bold text-slate-800">{destination.bestTimeToVisit}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-400 block font-medium">Available Slots</span>
                  <span className="text-sm font-bold text-emerald-700">{destination.availableSlots} Slots Left</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-400 block font-medium">Party Size</span>
                  <span className="text-sm font-bold text-slate-800">1 to 12 Travelers</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-400 block font-medium">GST & Taxes</span>
                  <span className="text-sm font-bold text-slate-800">5% GST Included</span>
                </div>
              </div>
            </div>

            {/* Separate Travel Mode & Transportation Details */}
            {destination.transportDetails && (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                  <Navigation className="w-4 h-4 text-[#ea580c]" />
                  <span>Dedicated Transportation Package & Schedule</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Carrier & Vehicle</span>
                    <strong className="text-slate-900 block text-xs mt-0.5">{destination.transportDetails.carrierName}</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">{destination.transportDetails.baggageOrSeats}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Route & Hubs</span>
                    <strong className="text-slate-900 block text-xs mt-0.5">{destination.transportDetails.departureHub}</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">⇄ {destination.transportDetails.arrivalHub}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Departure Schedule</span>
                    <strong className="text-slate-900 block text-xs mt-0.5">{destination.transportDetails.scheduleTime}</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {destination.transportDetails.includedFeatures.map((f, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nearby Hotels & Accommodations */}
            {destination.hotels && destination.hotels.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#00529b]" />
                  <span>Handpicked Accommodations & Resorts</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.hotels.map((hotel) => (
                    <div key={hotel.id} className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
                      {hotel.imageUrl && (
                        <div className="h-36 relative overflow-hidden bg-slate-900">
                          <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold">
                            ★ {hotel.rating}
                          </span>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium truncate max-w-[220px]">
                            📍 {hotel.location || destination.city}
                          </span>
                        </div>
                      )}
                      <div className="p-4 space-y-2 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <strong className="text-slate-900 text-xs block font-serif">{hotel.name}</strong>
                            <span className="text-[11px] text-[#ea580c] font-semibold">{hotel.category}</span>
                          </div>
                          {hotel.pricePerNight && (
                            <span className="text-xs font-mono font-bold text-slate-900 shrink-0">
                              ₹{hotel.pricePerNight.toLocaleString('en-IN')}<span className="text-[9px] font-normal text-slate-500">/nt</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          <strong>Room:</strong> {hotel.roomType} · <strong>Meal Plan:</strong> {hotel.foodPlan}
                        </p>
                        {hotel.foodOptions && hotel.foodOptions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {hotel.foodOptions.map((opt, i) => (
                              <span key={i} className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                                🍽️ {opt}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {hotel.amenities.map((a, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Food Facilities */}
            {destination.foodFacilities && destination.foodFacilities.length > 0 && (
              <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-200/60">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Dining & Food Facilities</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {destination.foodFacilities.map((food, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{food.mealType}</strong>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            food.included ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {food.included ? 'Included' : 'A-la-carte'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{food.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Maps & Location Card */}
            <div className="p-5 rounded-3xl bg-sky-50/70 border border-sky-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-base">
                    <MapPin className="w-5 h-5 text-sky-600" />
                    <span>Exact Map Location & Nearby Attractions</span>
                  </div>
                  <p className="text-xs text-sky-700/80 mt-1">
                    Explore terrain, verified landmarks, airport proximity, and neighborhood coordinates on Google Maps.
                  </p>
                  {destination.nearbyAttractions && destination.nearbyAttractions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {destination.nearbyAttractions.map((a, i) => (
                        <span key={i} className="text-[11px] bg-white text-sky-800 px-2.5 py-0.5 rounded-md border border-sky-200 font-medium">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  href={destination.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-2xl bg-[#00529b] hover:bg-[#003d73] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Inclusions & Exclusions Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-100">
                <h4 className="font-bold text-emerald-950 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  What Is Included
                </h4>
                <ul className="space-y-2.5">
                  {destination.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="p-5 rounded-3xl bg-rose-50/50 border border-rose-100">
                <h4 className="font-bold text-rose-950 text-sm mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  What Is Excluded
                </h4>
                <ul className="space-y-2.5">
                  {exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-rose-900">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price & Taxes Clarity */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Receipt className="w-4 h-4 text-[#ea580c]" />
                <span>
                  <strong>Transparent Price Policy:</strong> Stated price includes base tour, transportation, daily breakfast & dinner, and <strong>5% GST (₹{gstAmount.toLocaleString('en-IN')})</strong>.
                </span>
              </div>
              <span className="text-emerald-700 font-bold font-mono">Zero Hidden Taxes</span>
            </div>

          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="border-t border-slate-200 bg-white p-4 sm:p-6 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">All-Inclusive Starting Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                ₹{destination.pricePerPerson.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">per person (Incl. 5% GST)</span>
              {destination.originalPrice && (
                <span className="text-xs sm:text-sm text-slate-400 line-through">
                  ₹{destination.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(destination);
              }}
              className="px-6 sm:px-8 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Book This Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
