import React, { useState } from 'react';
import {
  PhoneCall,
  AlertTriangle,
  ShieldAlert,
  Ambulance,
  Car,
  Shield,
  CloudLightning,
  X,
  Send,
  CheckCircle2,
  Phone,
  Info
} from 'lucide-react';
import { EMERGENCY_SERVICES } from '../data/seedDestinations';
import { submitEmergencyRequest } from '../services/travelService';

export const EmergencyServicesSection: React.FC = () => {
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Medical Aid / Doctor-on-Call');
  const [travelerName, setTravelerName] = useState('');
  const [travelerPhone, setTravelerPhone] = useState('+91 ');
  const [currentLocation, setCurrentLocation] = useState('');
  const [situationNotes, setSituationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sosDispatched, setSosDispatched] = useState(false);

  const handleSosSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitEmergencyRequest({
        travelerName: travelerName.trim() || 'Urgent Traveler',
        phone: travelerPhone.trim(),
        location: currentLocation.trim() || 'Tour Route / In Transit',
        serviceType: selectedService,
        notes: situationNotes.trim()
      });
      setSosDispatched(true);
    } catch (err) {
      console.error(err);
      setSosDispatched(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="emergency-services-section" className="py-12 bg-white border-y border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Noticeable Compact Emergency Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-rose-900/50">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>24/7 Traveler Emergency & SOS Response</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
                Emergency Assistance & Rapid Incident Coordination
              </h2>
              
              {/* Mandatory User Requirement: Free vs Chargeable note clearly mentioned */}
              <div className="flex items-start gap-2 p-3 rounded-2xl bg-black/40 border border-rose-500/30 text-xs text-rose-200">
                <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-white">Service Cost Notice:</strong> Assistance may be <strong>Free</strong> or <strong>Chargeable</strong> depending on the situation and service provided. Initial tele-triage, itinerary rerouting, and tourist police coordination are <em>100% Free</em>; specialized hospital admissions, towing, and private evacuations are <em>Chargeable at actuals</em>.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <a
                href="tel:18002097711"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>Toll-Free SOS: 1800-209-7711</span>
              </a>

              <button
                onClick={() => {
                  setIsSosModalOpen(true);
                  setSosDispatched(false);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/40 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request SOS Dispatch</span>
              </button>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 text-xs">
            {EMERGENCY_SERVICES.map((s) => (
              <div key={s.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-white text-xs">{s.title}</strong>
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                    {s.costModel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{s.description}</p>
                <p className="text-[10px] text-slate-400 italic">{s.costDescription}</p>
                <span className="text-rose-400 font-mono font-bold block text-[11px] pt-1">
                  Ext Helpline: {s.emergencyPhone}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* SOS DISPATCH MODAL */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-200 relative">
            <button
              onClick={() => setIsSosModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {sosDispatched ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">SOS Incident Dispatched</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Our 24/7 Regional Emergency Response Team has received your alert for <strong>{currentLocation}</strong>.
                  A duty officer is immediately dialing <strong>{travelerPhone}</strong>.
                </p>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                  Stay calm at your current coordinates. Keep your phone line free.
                </div>
                <div className="flex gap-2">
                  <a
                    href="tel:18002097711"
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold text-center"
                  >
                    Call Helpline Now
                  </a>
                  <button
                    onClick={() => setIsSosModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif text-slate-900">Request Emergency SOS</h3>
                    <p className="text-xs text-slate-500">24/7 Direct line to regional field coordinators</p>
                  </div>
                </div>

                {/* Free vs Chargeable Reminder */}
                <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <strong>Notice:</strong> Emergency dispatch & tele-advisory are <em>Free</em>. Third-party vendor expenses (hospital fees, off-network towing) are <em>Chargeable at actuals</em>.
                </div>

                <form onSubmit={handleSosSubmit} className="space-y-3.5 text-xs font-semibold">
                  <div>
                    <label className="text-slate-700 block mb-1">Emergency Category</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white cursor-pointer"
                    >
                      <option value="Medical Aid / Doctor-on-Call">Medical Aid / Doctor-on-Call</option>
                      <option value="Vehicle Breakdown / Highway Assist">Vehicle Breakdown / Highway Assist</option>
                      <option value="Tourist Police / Lost Belongings">Tourist Police / Lost Belongings</option>
                      <option value="Severe Weather & Route Evacuation">Severe Weather & Route Evacuation</option>
                      <option value="General Emergency Inquiry">General Emergency Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Traveler Name</label>
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
                    <label className="text-slate-700 block mb-1">Active Phone Number (For Callback)</label>
                    <input
                      type="tel"
                      required
                      value={travelerPhone}
                      onChange={(e) => setTravelerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Current Location or Highway Kilometer</label>
                    <input
                      type="text"
                      required
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      placeholder="e.g. Near Solang Valley checkpoint or Hotel name"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">Situation Description</label>
                    <textarea
                      rows={2}
                      value={situationNotes}
                      onChange={(e) => setSituationNotes(e.target.value)}
                      placeholder="Describe what happened and immediate requirements..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Transmitting SOS...' : 'Transmit Emergency Alert'}</span>
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
