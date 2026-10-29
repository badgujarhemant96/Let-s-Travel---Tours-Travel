import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Ticket,
  Search,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Loader2,
  Compass,
  Plane,
  Check
} from 'lucide-react';
import { Booking, BookingStatus } from '../types/travel';
import { updateBookingStatus } from '../services/travelService';
import { useAuth } from '../context/AuthContext';

interface MyBookingsViewProps {
  bookings: Booking[];
  onOpenTicket: (booking: Booking) => void;
  onExploreClick: () => void;
  onOpenAuth: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onOpenTicket,
  onExploreClick,
  onOpenAuth
}) => {
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [newTravelDate, setNewTravelDate] = useState<string>('');
  const [newTimeSlot, setNewTimeSlot] = useState<string>('08:30 AM Morning Expedition');
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);

  // Cancel Modal State
  const [cancelBookingTarget, setCancelBookingTarget] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule conflict');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.bookingStatus === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.bookingReference.toLowerCase().includes(query) ||
      b.destinationTitle.toLowerCase().includes(query) ||
      b.destinationCity.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Action: Submit Reschedule
  const handleRescheduleSubmit = async () => {
    if (!rescheduleBooking || !newTravelDate) return;
    setIsRescheduling(true);
    try {
      await updateBookingStatus(rescheduleBooking.id, {
        travelDate: newTravelDate,
        timeSlot: newTimeSlot,
        bookingStatus: 'rescheduled'
      });
      setRescheduleBooking(null);
    } catch (err) {
      console.error('Error rescheduling booking:', err);
    } finally {
      setIsRescheduling(false);
    }
  };

  // Action: Submit Cancellation
  const handleCancelSubmit = async () => {
    if (!cancelBookingTarget) return;
    setIsCancelling(true);
    try {
      // 90% refund policy
      const refundAmount = Math.round(cancelBookingTarget.totalAmount * 0.9);
      await updateBookingStatus(cancelBookingTarget.id, {
        bookingStatus: 'cancelled',
        paymentStatus: 'refunded',
        cancellationReason: cancelReason,
        refundAmount
      });
      setCancelBookingTarget(null);
    } catch (err) {
      console.error('Error cancelling booking:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-slate-900">Manage Your Travel Bookings</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          Sign in to view your confirmed tour itineraries, download digital e-tickets, reschedule dates, or manage reservations.
        </p>
        <button
          onClick={onOpenAuth}
          className="mt-6 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Sign In to Access Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900">My Travel Reservations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status, digital e-tickets, and self-service rescheduling for your expeditions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference or destination..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-sky-500 outline-hidden"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-sky-500 outline-hidden"
          >
            <option value="all">All Bookings ({bookings.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-serif text-slate-900">No Bookings Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {bookings.length === 0
              ? "You haven't booked any tours yet. Explore our curated destinations and start your next journey!"
              : 'No reservations match your search or filter criteria.'}
          </p>
          <button
            onClick={onExploreClick}
            className="mt-6 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'cancelled';
            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Thumbnail & Main Destination Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={booking.destinationImage}
                    alt={booking.destinationTitle}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {booking.bookingReference}
                      </span>
                      <span
                        className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          booking.bookingStatus === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : booking.bookingStatus === 'rescheduled'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : booking.bookingStatus === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                      <span className="text-xs text-slate-400">
                        Paid via {booking.paymentMethod}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900">
                      {booking.destinationTitle}
                    </h3>

                    {/* Google Maps Link */}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {booking.destinationCity}, {booking.destinationCountry}
                      </span>
                      <a
                        href={booking.destinationMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Middle: Travel Dates, Party & Price */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs w-full lg:w-auto border-y lg:border-y-0 lg:border-x border-slate-100 py-3 lg:py-0 lg:px-6">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Departure Date</span>
                    <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span>{booking.travelDate}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{booking.timeSlot}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Travelers</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{booking.totalTravelers} Persons</span>
                    <span className="text-[11px] text-slate-500">
                      {booking.adults} Adults {booking.children > 0 ? `+ ${booking.children} Kids` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Amount</span>
                    <span className="font-bold text-slate-900 font-mono text-sm mt-0.5 block">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                    {booking.refundAmount ? (
                      <span className="text-[10px] text-rose-600 font-semibold">Refunded: ₹{booking.refundAmount.toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold">Status: Paid</span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap lg:flex-col items-center gap-2 w-full lg:w-44 shrink-0">
                  <button
                    onClick={() => onOpenTicket(booking)}
                    className="flex-1 lg:w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5 text-orange-400" />
                    <span>View E-Ticket</span>
                  </button>

                  {!isCancelled && (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => {
                          setRescheduleBooking(booking);
                          setNewTravelDate(booking.travelDate);
                          setNewTimeSlot(booking.timeSlot);
                        }}
                        className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 text-[#ea580c]" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => setCancelBookingTarget(booking)}
                        className="py-2 px-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Transport & Facilities Badge Row */}
                {(booking.transportMode || (booking.facilities && booking.facilities.length > 0)) && (
                  <div className="w-full pt-3 mt-1 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    {booking.transportMode && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 font-medium">
                        <Plane className="w-3.5 h-3.5 text-[#ea580c]" />
                        <span>{booking.transportMode} ({booking.transportClass || 'Standard'}) • {booking.departureCity} ({booking.tripType})</span>
                      </span>
                    )}
                    {booking.facilities?.map((f, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Date Modal */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold font-serif text-slate-900">Reschedule Departure Date</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select a new travel date for <strong>{rescheduleBooking.destinationTitle}</strong> ({rescheduleBooking.bookingReference}).
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Date</label>
                <input
                  type="date"
                  value={newTravelDate}
                  onChange={(e) => setNewTravelDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Time Slot</label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option>08:30 AM Morning Expedition</option>
                  <option>11:45 AM Scenic Midday Wave</option>
                  <option>03:15 PM Golden Sunset Wave</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 text-sky-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>No change fees will be charged for your first reschedule.</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setRescheduleBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={handleRescheduleSubmit}
                disabled={isRescheduling}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                {isRescheduling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Reschedule</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reservation Modal */}
      {cancelBookingTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-slate-900">Cancel Tour Reservation?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Booking Ref: <strong>{cancelBookingTarget.bookingReference}</strong> ({cancelBookingTarget.destinationTitle})
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Original Total Paid</span>
                <span className="font-mono font-bold">₹{cancelBookingTarget.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cancellation Processing Fee (10%)</span>
                <span className="font-mono font-bold">-₹{Math.round(cancelBookingTarget.totalAmount * 0.1).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-emerald-700 font-bold">
                <span>Calculated Refund to Original Method</span>
                <span className="font-mono text-sm">₹{Math.round(cancelBookingTarget.totalAmount * 0.9).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option>Schedule conflict</option>
                <option>Personal / Medical emergency</option>
                <option>Weather or travel advisory concerns</option>
                <option>Found an alternative itinerary</option>
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setCancelBookingTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={isCancelling}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                {isCancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
