import React, { useState } from 'react';
import {
  Compass,
  Star,
  Languages,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  User,
  X,
  IndianRupee,
  MapPin,
  Send
} from 'lucide-react';
import { TourGuide } from '../types/travel';
import { TOUR_GUIDES } from '../data/seedDestinations';

interface TourGuidesSectionProps {
  onHireGuideSuccess?: (guideName: string) => void;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TG';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarGradient = (id: string): string => {
  const gradients = [
    'from-[#00529b] via-indigo-800 to-slate-900',
    'from-emerald-700 via-teal-800 to-slate-900',
    'from-amber-600 via-orange-800 to-slate-900',
    'from-purple-700 via-indigo-900 to-slate-900',
    'from-rose-700 via-pink-800 to-slate-900',
    'from-cyan-700 via-blue-900 to-slate-900'
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export const TourGuidesSection: React.FC<TourGuidesSectionProps> = ({ onHireGuideSuccess }) => {
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [hireDays, setHireDays] = useState<number>(2);
  const [hireStartDate, setHireStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [travelerName, setTravelerName] = useState<string>('');
  const [travelerPhone, setTravelerPhone] = useState<string>('+91 98201 44892');
  const [specialInterests, setSpecialInterests] = useState<string>('Historical heritage, photography, local food recommendations');
  const [hireSubmitted, setHireSubmitted] = useState<boolean>(false);

  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const filteredGuides = TOUR_GUIDES.filter((g) => {
    if (selectedRegion === 'All') return true;
    if (selectedRegion === 'Agra & Taj Mahal') return g.location.includes('Agra') || g.location.includes('Fatehpur');
    if (selectedRegion === 'Varanasi') return g.location.includes('Varanasi');
    if (selectedRegion === 'Kashmir & Himachal') return g.location.includes('Srinagar') || g.location.includes('Manali');
    if (selectedRegion === 'Rishikesh & Uttarakhand') return g.location.includes('Rishikesh') || g.location.includes('Mussoorie');
    if (selectedRegion === 'Rajasthan') return g.location.includes('Jaipur') || g.location.includes('Udaipur');
    if (selectedRegion === 'Kerala & Goa') return g.location.includes('Munnar') || g.location.includes('Goa');
    if (selectedRegion === 'Port Blair & Andaman') return g.location.includes('Port Blair') || g.location.includes('Havelock');
    if (selectedRegion === 'Ladakh') return g.location.includes('Leh');
    if (selectedRegion === 'International') return g.location.includes('Bali') || g.location.includes('Dubai');
    return true;
  });

  const handleOpenHire = (guide: TourGuide) => {
    setSelectedGuide(guide);
    setHireSubmitted(false);
  };

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHireSubmitted(true);
    if (onHireGuideSuccess && selectedGuide) {
      onHireGuideSuccess(selectedGuide.name);
    }
  };

  return (
    <section id="tour-guides-section" className="py-16 bg-slate-50 border-t border-slate-200/90 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#00529b] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <Compass className="w-3.5 h-3.5 text-[#00529b]" />
              <span>Certified Regional Guides</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-900 mt-2">
              Hire a Licensed Local Tour Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Elevate your journey with culturally authentic local guides certified by regional tourism departments. Check transparent daily charges in Indian Rupees (₹) and hire instantly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600 font-semibold bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="font-bold text-slate-900 font-mono text-sm">{TOUR_GUIDES.length}</span> Verified Guides
            </div>
          </div>
        </div>
            {/* Region Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8">
              {[
                'All',
                'Agra & Taj Mahal',
                'Varanasi',
                'Kashmir & Himachal',
                'Rishikesh & Uttarakhand',
                'Rajasthan',
                'Kerala & Goa',
                'Port Blair & Andaman',
                'Ladakh',
                'International'
              ].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedRegion === reg
                      ? 'bg-[#00529b] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {reg === 'All' ? 'All Guides' : reg}
                </button>
              ))}
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Guide Photo & Badges */}
                <div className="h-56 relative bg-slate-900 overflow-hidden">
                  {!imgErrors[guide.id] && guide.photoUrl ? (
                    <img
                      src={guide.photoUrl}
                      alt={guide.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImgErrors((prev) => ({ ...prev, [guide.id]: true }))}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getAvatarGradient(guide.id)} flex flex-col items-center justify-center p-4 relative`}>
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                      <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-lg relative z-10">
                        <span className="text-2xl font-black text-white tracking-widest font-mono">
                          {getInitials(guide.name)}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/80 mt-2.5 relative z-10 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        <span>Certified Guide</span>
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10 z-10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{guide.rating.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400">({guide.reviewCount})</span>
                  </div>

                  {/* Location Tag */}
                  <div className="absolute bottom-3 left-3 text-white z-10">
                    <strong className="text-lg font-bold font-serif block">{guide.name}</strong>
                    <span className="text-[11px] text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ea580c]" />
                      <span>{guide.location}</span>
                    </span>
                  </div>
                </div>

                {/* Guide Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#ea580c] block">
                      Specialization
                    </span>
                    <strong className="text-xs text-slate-800 block mt-0.5">{guide.specialization}</strong>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {guide.bio}
                  </p>

                  {/* Languages */}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Spoken Languages
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {guide.languages.map((l, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {guide.badges.map((b, i) => (
                      <span key={i} className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Hire Button */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Daily Charge</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-slate-900 font-mono">
                      ₹{guide.dailyRate.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500">/ day</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenHire(guide)}
                  className="px-4 py-2 rounded-xl bg-[#00529b] hover:bg-[#003d73] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Hire Guide
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* HIRE GUIDE MODAL */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {hireSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Guide Booking Confirmed!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  You have booked <strong>{selectedGuide.name}</strong> for <strong>{hireDays} days</strong> starting from <strong>{hireStartDate}</strong>.
                  A booking voucher with guide phone credentials has been dispatched to <strong>{travelerPhone}</strong>.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono font-bold text-slate-800">
                  Total Guide Charge: ₹{(selectedGuide.dailyRate * hireDays).toLocaleString('en-IN')} (Pay on arrival or add to package)
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  {!imgErrors[selectedGuide.id] && selectedGuide.photoUrl ? (
                    <img
                      src={selectedGuide.photoUrl}
                      alt={selectedGuide.name}
                      onError={() => setImgErrors((prev) => ({ ...prev, [selectedGuide.id]: true }))}
                      className="w-14 h-14 rounded-2xl object-cover object-top border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(selectedGuide.id)} border border-slate-200 flex items-center justify-center text-white font-bold font-mono text-base shadow-xs shrink-0`}>
                      {getInitials(selectedGuide.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold font-serif text-slate-900">{selectedGuide.name}</h3>
                    <p className="text-xs text-[#ea580c] font-semibold">{selectedGuide.specialization}</p>
                    <p className="text-[11px] text-slate-400">{selectedGuide.location} · {selectedGuide.experienceYears} Years Experience</p>
                  </div>
                </div>

                <form onSubmit={handleHireSubmit} className="mt-5 space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 block mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={hireStartDate}
                        onChange={(e) => setHireStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 block mb-1">Number of Days</label>
                      <select
                        value={hireDays}
                        onChange={(e) => setHireDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white cursor-pointer"
                      >
                        <option value={1}>1 Day (Half/Full Day)</option>
                        <option value={2}>2 Days</option>
                        <option value={3}>3 Days</option>
                        <option value={5}>5 Days (Complete Circuit)</option>
                        <option value={7}>7 Days (Extended Tour)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      placeholder="e.g. Hemant Badgujar"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Contact Phone (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      value={travelerPhone}
                      onChange={(e) => setTravelerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Sightseeing Focus & Special Requests</label>
                    <textarea
                      rows={2}
                      value={specialInterests}
                      onChange={(e) => setSpecialInterests(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Calculated Total</span>
                      <strong className="text-sm font-mono font-bold text-slate-900">
                        ₹{(selectedGuide.dailyRate * hireDays).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold">Zero Advance Required</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#00529b] hover:bg-[#003d73] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm Tour Guide Hire</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
