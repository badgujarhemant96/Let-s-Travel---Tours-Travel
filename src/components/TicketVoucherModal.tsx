import React from 'react';
import {
  X,
  Printer,
  Download,
  MapPin,
  Calendar,
  Users,
  QrCode,
  ShieldCheck,
  ExternalLink,
  Compass,
  Plane,
  Check
} from 'lucide-react';
import { Booking } from '../types/travel';

interface TicketVoucherModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const TicketVoucherModal: React.FC<TicketVoucherModalProps> = ({
  booking,
  onClose
}) => {
  if (!booking) return null;

  const handleDownloadPDF = () => {
    // Triggers browser print dialog specifically targeted at saving or printing the voucher
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 print:p-0 print:bg-white print:static print:inset-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-voucher, #printable-voucher * {
            visibility: visible;
          }
          #printable-voucher {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: 2px solid #0f172a !important;
          }
        }
      `}</style>
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200 print:border-none print:shadow-none print:max-w-none">
        
        {/* Top Header Actions */}
        <div className="bg-[#071a23] text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-400" />
            <span className="font-bold text-sm tracking-wide">LET'S TRAVEL — Official Tour Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              title="Download voucher as digital PDF or print"
              className="px-3.5 py-1.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-6 sm:p-8 bg-white print:p-0">
          
          {/* Main Boarding Pass Card */}
          <div id="printable-voucher" className="border-2 border-slate-900 rounded-3xl overflow-hidden bg-white">
            
            {/* Top Brand Banner */}
            <div className="bg-[#071a23] text-white p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 block">
                  LET'S TRAVEL • CUSTOM TOURS & HOLIDAYS
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif">{booking.destinationTitle}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{booking.destinationCity}, {booking.destinationCountry}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">BOOKING REFERENCE</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-wider">
                  {booking.bookingReference}
                </span>
              </div>
            </div>

            {/* Middle Section: Passenger & Itinerary Grid */}
            <div className="p-6 bg-slate-50 border-b-2 border-dashed border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lead Traveller</span>
                <span className="font-bold text-slate-900 text-sm block truncate">{booking.userName}</span>
                <span className="text-[11px] text-slate-500 block truncate">{booking.userEmail}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Travel Date</span>
                <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
                  <Calendar className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>{booking.travelDate}</span>
                </div>
                <span className="text-[11px] text-slate-500">{booking.timeSlot}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Party Size</span>
                <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
                  <Users className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>{booking.totalTravelers} Traveller(s)</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {booking.adults} Adult(s) {booking.children > 0 ? `• ${booking.children} Child` : ''}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {booking.bookingStatus.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Paid</span>
                <span className="font-bold text-slate-900 block font-mono text-sm">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-emerald-600 font-semibold">{booking.paymentStatus.toUpperCase()} via {booking.paymentMethod}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Transaction ID</span>
                <span className="font-mono text-[11px] text-slate-700 block truncate">{booking.paymentTransactionId}</span>
              </div>
            </div>

            {/* Transport & Included Facilities Info */}
            {(booking.transportMode || (booking.facilities && booking.facilities.length > 0)) && (
              <div className="p-5 bg-orange-50/40 border-b-2 border-dashed border-slate-300 text-xs">
                {booking.transportMode && (
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-orange-100/80">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Plane className="w-4 h-4 text-[#ea580c]" />
                      <span>Transit: {booking.transportMode} ({booking.transportClass || 'Standard'})</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Departure: <strong>{booking.departureCity || 'Default City'}</strong> ({booking.tripType || 'Round trip'})
                    </div>
                  </div>
                )}

                {booking.facilities && booking.facilities.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                      Included Tour Facilities & Upgrades:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.facilities.map((fac, idx) => (
                        <span key={idx} className="text-[11px] bg-white border border-slate-200 text-slate-800 px-2.5 py-0.5 rounded-lg font-medium flex items-center gap-1 shadow-2xs">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          <span>{fac}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Section: QR Code & Verification */}
            <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 border-2 border-slate-900 rounded-2xl bg-white shadow-xs shrink-0 flex flex-col items-center">
                  <QrCode className="w-16 h-16 text-slate-900" />
                  <span className="text-[9px] font-mono font-black text-slate-900 tracking-wider mt-1">LET'S TRAVEL</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Tour Voucher</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Show this voucher or quote Reference <strong>{booking.bookingReference}</strong> to your tour chauffeur.
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <a
                  href={booking.destinationMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-center text-slate-400 mt-4 print:mt-8">
            LET'S TRAVEL — Custom Tours & Holidays • 24/7 Helpline: +91 1800-209-7711
          </p>
        </div>

      </div>
    </div>
  );
};
