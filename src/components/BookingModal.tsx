import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  Users,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Ticket,
  AlertCircle,
  Check,
  Printer,
  Download,
  Share2,
  FileText,
  Compass,
  Plane,
  Train,
  Bus,
  Car,
  Utensils,
  MapPin,
  Star,
  BedDouble,
  ShieldAlert,
  Info,
  Phone
} from 'lucide-react';
import { Destination, PaymentMethod, Booking, TransportOptionItem, FacilityOptionItem } from '../types/travel';
import { ADD_ON_OPTIONS, VALID_PROMO_CODES, DEFAULT_TRANSPORT_OPTIONS, DEFAULT_FACILITY_OPTIONS, TOUR_GUIDES } from '../data/seedDestinations';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/travelService';

interface BookingModalProps {
  destination: Destination | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  onOpenAuth: () => void;
}

const COMMON_DEPARTURE_CITIES = [
  'Delhi NCR',
  'Mumbai',
  'Bengaluru',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Kochi',
  'Guwahati',
  'Indore',
  'Bhopal',
  'Patna',
  'Surat',
  'Other (Custom Departure)'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  destination,
  onClose,
  onBookingSuccess,
  onOpenAuth
}) => {
  if (!destination) return null;

  const { currentUser } = useAuth();

  // Wizard Step:
  // 1 = Trip Dates & Passengers
  // 2 = Transport Mode & Extra Facilities (NEW Step)
  // 3 = Lead Traveler Contact
  // 4 = Price Breakdown & Payment
  // 5 = Booking Confirmed & Printable Voucher
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State: Dates & Passengers
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [travelDate, setTravelDate] = useState<string>(tomorrow);
  const [timeSlot, setTimeSlot] = useState<string>('08:30 AM Morning Departure');
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  // International / Island Check
  const isIslandOrInternational = useMemo(() => {
    const title = (destination.title || '').toLowerCase();
    const city = (destination.city || '').toLowerCase();
    const country = (destination.country || '').toLowerCase();
    return (
      title.includes('andaman') ||
      city.includes('port blair') ||
      city.includes('havelock') ||
      country.includes('indonesia') ||
      city.includes('bali') ||
      city.includes('dubai') ||
      country.includes('uae') ||
      country !== 'india'
    );
  }, [destination]);

  const isInternational = useMemo(() => {
    const country = (destination.country || '').toLowerCase();
    const city = (destination.city || '').toLowerCase();
    return (
      country.includes('indonesia') ||
      city.includes('bali') ||
      city.includes('dubai') ||
      country.includes('uae') ||
      country !== 'india'
    );
  }, [destination]);

  // Destination Tour Guide lookup
  const matchedGuide = useMemo(() => {
    const title = (destination.title || '').toLowerCase();
    const city = (destination.city || '').toLowerCase();
    const region = (destination.stateRegion || '').toLowerCase();

    const found = TOUR_GUIDES.find((g) => {
      const loc = g.location.toLowerCase();
      if (title.includes('agra') && loc.includes('agra')) return true;
      if ((title.includes('andaman') || city.includes('port blair')) && loc.includes('port blair')) return true;
      if (city.includes('bali') && loc.includes('bali')) return true;
      if (city.includes('dubai') && loc.includes('dubai')) return true;
      if (city.includes('goa') && loc.includes('goa')) return true;
      if ((title.includes('ladakh') || city.includes('leh')) && loc.includes('leh')) return true;
      if ((title.includes('munnar') || city.includes('kochi') || region.includes('kerala')) && loc.includes('munnar')) return true;
      if ((title.includes('jaipur') || region.includes('rajasthan')) && loc.includes('jaipur')) return true;
      if ((title.includes('rishikesh') || region.includes('uttarakhand')) && loc.includes('rishikesh')) return true;
      if ((title.includes('manali') || region.includes('himachal')) && loc.includes('manali')) return true;
      if ((title.includes('kashmir') || city.includes('srinagar')) && loc.includes('srinagar')) return true;
      if ((title.includes('varanasi') || city.includes('kashi')) && loc.includes('varanasi')) return true;
      return false;
    });

    return found || TOUR_GUIDES[0];
  }, [destination]);

  // Transport Configuration (supports custom packages from Firestore or seed defaults)
  const availableTransportOptions: TransportOptionItem[] = useMemo(() => {
    const base = destination.transportConfig?.transportOptions || DEFAULT_TRANSPORT_OPTIONS;
    return base.filter((opt) => opt.enabled !== false);
  }, [destination]);

  // Transport Selections
  const [departureCity, setDepartureCity] = useState<string>('Delhi NCR');
  const [customCity, setCustomCity] = useState<string>('');
  const [tripType, setTripType] = useState<'Round trip' | 'One way'>('Round trip');
  const [selectedTransportId, setSelectedTransportId] = useState<string>(() => {
    if (isIslandOrInternational) return 'flight';
    return 'flight';
  });
  const [selectedClass, setSelectedClass] = useState<string>('Economy Class');

  // Facilities Selections
  const [hotelCategory, setHotelCategory] = useState<'3 Star' | '4 Star' | '5 Star'>('3 Star');
  const [mealPlan, setMealPlan] = useState<'Breakfast only' | 'Breakfast + Dinner' | 'All meals'>('Breakfast only');
  const [hasAirportTransfer, setHasAirportTransfer] = useState<boolean>(false);
  const [hasTourGuide, setHasTourGuide] = useState<boolean>(false);
  const [hasInsurance, setHasInsurance] = useState<boolean>(true);
  const [hasSightseeingTickets, setHasSightseeingTickets] = useState<boolean>(false);
  const [hasRoomUpgrade, setHasRoomUpgrade] = useState<boolean>(false);

  // Traveler Details
  const [userName, setUserName] = useState<string>(currentUser?.displayName || '');
  const [userEmail, setUserEmail] = useState<string>(currentUser?.email || '');
  const [userPhone, setUserPhone] = useState<string>('+91 98201 44892');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent?: number; discountFixed?: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI / Instant Pay');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('742');
  const [selectedBank, setSelectedBank] = useState<string>('State Bank of India (SBI)');
  const [upiId, setUpiId] = useState<string>('traveler@okhdfcbank');

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [submissionError, setSubmissionError] = useState<string>('');

  // Automatically update class options if transport mode changes
  const activeTransport = useMemo(() => {
    return availableTransportOptions.find((t) => t.id === selectedTransportId) || availableTransportOptions[0];
  }, [availableTransportOptions, selectedTransportId]);

  // Sync class selection if current class is not valid for the new mode
  const handleSelectTransportMode = (modeId: string) => {
    // If island or international, disallow train or bus
    if (isIslandOrInternational && (modeId === 'train' || modeId === 'bus')) {
      return;
    }
    // If international, disallow self drive or cab
    if (isInternational && (modeId === 'cab' || modeId === 'self_drive')) {
      return;
    }

    setSelectedTransportId(modeId);
    const modeObj = availableTransportOptions.find((t) => t.id === modeId);
    if (modeObj && modeObj.classes && modeObj.classes.length > 0) {
      setSelectedClass(modeObj.classes[0].className);
    }
  };

  // Comprehensive LIVE Price Calculations in plain numbers
  const priceCalculations = useMemo(() => {
    const totalTravelers = Math.max(1, adults + childrenCount);

    // 1. Base Package Fare
    const adultFare = adults * destination.pricePerPerson;
    const childFare = childrenCount * Math.round(destination.pricePerPerson * 0.6);
    const basePackageTotal = adultFare + childFare;

    // 2. Transport Calculation
    let transportPerPerson = 0;
    if (selectedTransportId !== 'self_drive' && activeTransport) {
      const classObj = activeTransport.classes.find((c) => c.className === selectedClass);
      const classExtra = classObj ? classObj.extraPrice : 0;
      const oneWayPerPerson = activeTransport.basePrice + classExtra;
      transportPerPerson = tripType === 'Round trip' ? oneWayPerPerson * 2 : oneWayPerPerson;
    }
    const transportTotal = transportPerPerson * totalTravelers;

    // 3. Extra Facilities Calculation
    let facilitiesTotal = 0;

    // Hotel Category
    let hotelUpgradeCost = 0;
    if (hotelCategory === '4 Star') hotelUpgradeCost = 1800 * totalTravelers;
    if (hotelCategory === '5 Star') hotelUpgradeCost = 3500 * totalTravelers;
    facilitiesTotal += hotelUpgradeCost;

    // Meal Plan
    const days = Math.max(1, destination.durationDays || 4);
    let mealUpgradeCost = 0;
    if (mealPlan === 'Breakfast + Dinner') mealUpgradeCost = 650 * totalTravelers * days;
    if (mealPlan === 'All meals') mealUpgradeCost = 1200 * totalTravelers * days;
    facilitiesTotal += mealUpgradeCost;

    // Airport Pickup / Drop (Flat party rate)
    const airportTransferCost = hasAirportTransfer ? 1500 : 0;
    facilitiesTotal += airportTransferCost;

    // Tour Guide (Flat daily rate)
    const tourGuideCost = hasTourGuide ? (matchedGuide?.dailyRate || 2200) : 0;
    facilitiesTotal += tourGuideCost;

    // Domestic Travel Insurance (Per person)
    const insuranceCost = hasInsurance ? 450 * totalTravelers : 0;
    facilitiesTotal += insuranceCost;

    // Monument & Fast-Track Tickets (Per person)
    const ticketsCost = hasSightseeingTickets ? 1200 * totalTravelers : 0;
    facilitiesTotal += ticketsCost;

    // Room Upgrade (Flat per room/stay)
    const roomUpgradeCost = hasRoomUpgrade ? 2000 : 0;
    facilitiesTotal += roomUpgradeCost;

    // 4. Taxes & GST (5%)
    const subtotal = basePackageTotal + transportTotal + facilitiesTotal;
    const taxRate = 0.05;
    const taxesAndFees = Math.round(subtotal * taxRate);

    // 5. Promo Discount
    let discountAmount = 0;
    if (appliedPromo) {
      if (appliedPromo.discountPercent) {
        discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
      } else if (appliedPromo.discountFixed) {
        discountAmount = appliedPromo.discountFixed;
      }
    }

    // 6. Grand Total
    const grandTotal = Math.max(0, subtotal + taxesAndFees - discountAmount);
    const perPersonFinal = Math.round(grandTotal / totalTravelers);

    return {
      adultFare,
      childFare,
      basePackageTotal,
      transportPerPerson,
      transportTotal,
      facilitiesTotal,
      hotelUpgradeCost,
      mealUpgradeCost,
      airportTransferCost,
      tourGuideCost,
      insuranceCost,
      ticketsCost,
      roomUpgradeCost,
      subtotal,
      taxesAndFees,
      discountAmount,
      grandTotal,
      perPersonFinal,
      totalTravelers
    };
  }, [
    destination,
    adults,
    childrenCount,
    selectedTransportId,
    activeTransport,
    selectedClass,
    tripType,
    hotelCategory,
    mealPlan,
    hasAirportTransfer,
    hasTourGuide,
    hasInsurance,
    hasSightseeingTickets,
    hasRoomUpgrade,
    matchedGuide,
    appliedPromo
  ]);

  // Selected Facilities Array for Firestore
  const selectedFacilitiesList = useMemo(() => {
    const list: string[] = [
      `Hotel Category: ${hotelCategory}`,
      `Meal Plan: ${mealPlan}`
    ];
    if (hasAirportTransfer) list.push('Airport / Station Pickup & Drop (2-Way)');
    if (hasTourGuide) list.push(`Dedicated Tour Guide: ${matchedGuide.name} (${matchedGuide.location})`);
    if (hasInsurance) list.push('Comprehensive Domestic Travel Insurance');
    if (hasSightseeingTickets) list.push('Monument Fast-Track Passes & Entry Tickets');
    if (hasRoomUpgrade) list.push('Premium Valley / Ocean Suite Room Upgrade');
    return list;
  }, [
    hotelCategory,
    mealPlan,
    hasAirportTransfer,
    hasTourGuide,
    matchedGuide,
    hasInsurance,
    hasSightseeingTickets,
    hasRoomUpgrade
  ]);

  // Apply Promo
  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (VALID_PROMO_CODES[code]) {
      setAppliedPromo({
        code,
        ...VALID_PROMO_CODES[code]
      });
    } else {
      setPromoError('Invalid code. Try INDIA10, EXPLORE2000, or HOLIDAY15');
    }
  };

  const handleCompletePaymentAndBook = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!userEmail || !userName) {
      setSubmissionError('Please provide your full traveler name and email.');
      setStep(3);
      return;
    }

    setIsProcessing(true);
    setSubmissionError('');

    try {
      const bookingReference = `LT-${Math.floor(10000 + Math.random() * 90000)}`;
      const transactionId = `TXN-IN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const resolvedDepartureCity = departureCity === 'Other (Custom Departure)' ? (customCity.trim() || 'Custom City') : departureCity;

      const bookingPayload: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        bookingReference,
        userId: currentUser.uid,
        userEmail: userEmail.trim(),
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        destinationId: destination.id,
        destinationTitle: destination.title,
        destinationCity: destination.city,
        destinationCountry: destination.country,
        destinationImage: destination.imageUrl,
        destinationMapUrl: destination.mapUrl,
        travelDate,
        timeSlot,
        adults,
        children: childrenCount,
        totalTravelers: priceCalculations.totalTravelers,
        selectedAddOns: [],
        basePrice: priceCalculations.basePackageTotal,
        addOnsTotal: priceCalculations.facilitiesTotal,
        taxAndFees: priceCalculations.taxesAndFees,
        discount: priceCalculations.discountAmount,
        promoCode: appliedPromo?.code || '',
        totalAmount: priceCalculations.grandTotal,
        amountPaid: priceCalculations.grandTotal,
        paidAt: new Date().toISOString(),
        finalAmount: priceCalculations.grandTotal,
        operationalCost: destination.operationalCost || 0,
        // Transport & Extra Facilities selections
        transportMode: activeTransport?.name || selectedTransportId,
        transportClass: selectedTransportId === 'self_drive' ? 'Standard Self-Arranged' : selectedClass,
        tripType,
        departureCity: resolvedDepartureCity,
        facilities: selectedFacilitiesList,
        transportAmount: priceCalculations.transportTotal,
        facilitiesAmount: priceCalculations.facilitiesTotal,
        discountAmount: priceCalculations.discountAmount,
        paymentMethod,
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        specialRequests: specialRequests.trim(),
        paymentTransactionId: transactionId
      };

      const paymentPayload = {
        transactionId,
        bookingReference,
        userId: currentUser.uid,
        userEmail: userEmail.trim(),
        amount: priceCalculations.grandTotal,
        currency: 'INR',
        paymentMethod,
        gateway: paymentMethod === 'UPI / Instant Pay' ? 'BHIM UPI Gateway' : 'Razorpay Secure NetBanking',
        status: 'success' as const,
        cardLast4: paymentMethod === 'Credit/Debit Card' ? '8912' : undefined,
        upiId: paymentMethod === 'UPI / Instant Pay' ? upiId : undefined
      };

      const result = await createBooking(bookingPayload, paymentPayload);

      const confirmed: Booking = {
        ...bookingPayload,
        id: result.bookingId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setConfirmedBooking(confirmed);
      setStep(5);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti note:', err);
      }

      onBookingSuccess(confirmed);
    } catch (err) {
      console.error('Error recording booking:', err);
      setSubmissionError('There was an issue processing your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto border border-slate-100">
        
        {/* Header Bar */}
        <div className="bg-[#071a23] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#ea580c]">
                {step === 5 ? 'Booking Confirmed' : `Step ${step} of 5`}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium truncate max-w-[180px] sm:max-w-xs">{destination.title}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif">
              {step === 1 && 'Trip Dates & Passenger Count'}
              {step === 2 && 'Transport Mode & Extra Facilities'}
              {step === 3 && 'Lead Traveler Contact Details'}
              {step === 4 && 'Indian Rupee Breakdown & Payment'}
              {step === 5 && 'Trip Reservation Confirmed!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Visual Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 py-3 shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            
            {/* Step 1: Dates & Guests */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <button
                type="button"
                onClick={() => step > 1 && step < 5 && setStep(1)}
                disabled={step === 5}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > 1
                    ? 'bg-emerald-600 text-white shadow-xs cursor-pointer hover:bg-emerald-700'
                    : step === 1
                    ? 'bg-[#ea580c] text-white ring-4 ring-orange-100 shadow-md scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
                title="Step 1: Dates & Guests"
              >
                {step > 1 ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Calendar className="w-4 h-4" />}
              </button>
              <span className={`text-[10px] sm:text-[11px] font-bold mt-1 block leading-tight ${step === 1 ? 'text-[#ea580c]' : step > 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                Dates
              </span>
            </div>

            {/* Line 1-2 */}
            <div className="flex-1 h-0.5 relative mx-1 -mt-4">
              <div className="absolute inset-0 bg-slate-200" />
              <div
                className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-300"
                style={{ width: step >= 2 ? '100%' : '0%' }}
              />
            </div>

            {/* Step 2: Transport & Extras */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <button
                type="button"
                onClick={() => step > 2 && step < 5 && setStep(2)}
                disabled={step < 2 || step === 5}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > 2
                    ? 'bg-emerald-600 text-white shadow-xs cursor-pointer hover:bg-emerald-700'
                    : step === 2
                    ? 'bg-[#ea580c] text-white ring-4 ring-orange-100 shadow-md scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
                title="Step 2: Transport & Facilities"
              >
                {step > 2 ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plane className="w-4 h-4" />}
              </button>
              <span className={`text-[10px] sm:text-[11px] font-bold mt-1 block leading-tight ${step === 2 ? 'text-[#ea580c]' : step > 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                Transport & Extras
              </span>
            </div>

            {/* Line 2-3 */}
            <div className="flex-1 h-0.5 relative mx-1 -mt-4">
              <div className="absolute inset-0 bg-slate-200" />
              <div
                className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-300"
                style={{ width: step >= 3 ? '100%' : '0%' }}
              />
            </div>

            {/* Step 3: Traveler Contact */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <button
                type="button"
                onClick={() => step > 3 && step < 5 && setStep(3)}
                disabled={step < 3 || step === 5}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > 3
                    ? 'bg-emerald-600 text-white shadow-xs cursor-pointer hover:bg-emerald-700'
                    : step === 3
                    ? 'bg-[#ea580c] text-white ring-4 ring-orange-100 shadow-md scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
                title="Step 3: Traveler Details"
              >
                {step > 3 ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Users className="w-4 h-4" />}
              </button>
              <span className={`text-[10px] sm:text-[11px] font-bold mt-1 block leading-tight ${step === 3 ? 'text-[#ea580c]' : step > 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                Traveler Info
              </span>
            </div>

            {/* Line 3-4 */}
            <div className="flex-1 h-0.5 relative mx-1 -mt-4">
              <div className="absolute inset-0 bg-slate-200" />
              <div
                className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-300"
                style={{ width: step >= 4 ? '100%' : '0%' }}
              />
            </div>

            {/* Step 4: Payment */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <button
                type="button"
                disabled={step < 4 || step === 5}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > 4
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : step === 4
                    ? 'bg-[#ea580c] text-white ring-4 ring-orange-100 shadow-md scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
                title="Step 4: Payment"
              >
                {step > 4 ? <Check className="w-4 h-4 stroke-[2.5]" /> : <CreditCard className="w-4 h-4" />}
              </button>
              <span className={`text-[10px] sm:text-[11px] font-bold mt-1 block leading-tight ${step === 4 ? 'text-[#ea580c]' : step > 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
                Payment
              </span>
            </div>

            {/* Line 4-5 */}
            <div className="flex-1 h-0.5 relative mx-1 -mt-4">
              <div className="absolute inset-0 bg-slate-200" />
              <div
                className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-300"
                style={{ width: step === 5 ? '100%' : '0%' }}
              />
            </div>

            {/* Step 5: Confirmation */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 5
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-105'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
                title="Step 5: Voucher Ready"
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className={`text-[10px] sm:text-[11px] font-bold mt-1 block leading-tight ${step === 5 ? 'text-emerald-700' : 'text-slate-400'}`}>
                Voucher
              </span>
            </div>

          </div>

          {/* Micro Progress Track */}
          <div className="mt-2.5 w-full bg-slate-200/80 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ea580c] via-orange-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8">
          
          {submissionError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* STEP 1: Dates & Passengers */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Destination Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-4">
                <img
                  src={destination.imageUrl}
                  alt={destination.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#ea580c] block">
                    {destination.category} Tour Circuit
                  </span>
                  <h4 className="text-base font-bold text-slate-900 truncate">{destination.title}</h4>
                  <p className="text-xs text-slate-500">
                    {destination.city}, {destination.country} • {destination.durationDays} Days / {destination.durationNights} Nights
                  </p>
                  <p className="text-xs font-bold text-slate-900 font-mono mt-1">
                    Base fare: <span className="text-[#ea580c] font-black">₹{destination.pricePerPerson.toLocaleString('en-IN')}</span> / adult
                  </p>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#ea580c]" />
                  Select Departure Date
                </label>
                <input
                  type="date"
                  min={tomorrow}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#ea580c] outline-hidden transition-all"
                />
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#ea580c]" />
                  Preferred Departure Wave
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    '08:30 AM Morning Departure',
                    '11:45 AM Scenic Midday Wave',
                    '03:15 PM Afternoon Wave'
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all cursor-pointer ${
                        timeSlot === slot
                          ? 'border-[#ea580c] bg-orange-50/70 text-[#ea580c] shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Persons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Adults */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Adults</span>
                    <span className="text-xs text-slate-500 font-medium">Age 12+ (₹{destination.pricePerPerson.toLocaleString('en-IN')})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-full bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-base text-slate-900 w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Children</span>
                    <span className="text-xs text-slate-500 font-medium">Age 2-11 (40% OFF base fare)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={childrenCount <= 0}
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="w-8 h-8 rounded-full bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-base text-slate-900 w-4 text-center">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Transport Mode & Extra Facilities */}
          {step === 2 && (
            <div className="space-y-8">
              
              {/* SECTION 1: TRANSPORT MODE */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#ea580c]" />
                      <span>1. Choose Transport Mode</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select how you wish to travel to and from {destination.title}.
                    </p>
                  </div>

                  {/* Trip Type Toggle */}
                  <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setTripType('Round trip')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        tripType === 'Round trip'
                          ? 'bg-[#ea580c] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Round Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('One way')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        tripType === 'One way'
                          ? 'bg-[#ea580c] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      One Way
                    </button>
                  </div>
                </div>

                {/* Departure City Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Departure City / Hub
                    </label>
                    <select
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-hidden focus:border-[#ea580c] cursor-pointer"
                    >
                      {COMMON_DEPARTURE_CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {departureCity === 'Other (Custom Departure)' ? (
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Enter Custom Departure City
                      </label>
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="e.g. Nagpur, Varanasi, Dehradun..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Transit Travel Date
                      </label>
                      <input
                        type="date"
                        min={tomorrow}
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                  )}
                </div>

                {/* Notice for Island / International */}
                {isIslandOrInternational && (
                  <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-sky-600" />
                    <span>
                      Notice: For <strong>{destination.city}</strong>, railway train and bus coach transit options are unavailable. Flights are recommended and scheduled.
                    </span>
                  </div>
                )}

                {/* Clickable Transport Mode Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableTransportOptions.map((opt) => {
                    const isSelected = selectedTransportId === opt.id;
                    const isTrainOrBus = opt.id === 'train' || opt.id === 'bus';
                    const isCabOrSelf = opt.id === 'cab' || opt.id === 'self_drive';

                    const isDisabled =
                      (isIslandOrInternational && isTrainOrBus) ||
                      (isInternational && isCabOrSelf);

                    const IconComponent =
                      opt.id === 'flight'
                        ? Plane
                        : opt.id === 'train'
                        ? Train
                        : opt.id === 'bus'
                        ? Bus
                        : opt.id === 'cab'
                        ? Car
                        : Compass;

                    const effectiveRatePerPerson =
                      opt.id === 'self_drive'
                        ? 0
                        : (opt.basePrice + (opt.classes[0]?.extraPrice || 0)) * (tripType === 'Round trip' ? 2 : 1);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => !isDisabled && handleSelectTransportMode(opt.id)}
                        className={`p-4 rounded-2xl border transition-all text-left relative flex flex-col justify-between ${
                          isDisabled
                            ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#ea580c] bg-orange-50/70 shadow-sm cursor-pointer ring-2 ring-orange-200'
                            : 'border-slate-200 bg-white hover:bg-slate-50 cursor-pointer hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-[#ea580c] text-white' : 'bg-slate-100 text-slate-700'
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {opt.id === 'self_drive' ? 'Free (₹0)' : `₹${effectiveRatePerPerson.toLocaleString('en-IN')} / pp`}
                            </span>
                          </div>

                          <h5 className="text-xs sm:text-sm font-bold text-slate-900">{opt.name}</h5>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{opt.shortNote}</p>

                          {isDisabled && (
                            <span className="text-[10px] text-rose-600 font-semibold block mt-1.5">
                              Unavailable for this destination
                            </span>
                          )}
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="mt-3 pt-2 border-t border-orange-200/80 flex items-center justify-between text-[11px] font-bold text-[#ea580c]">
                            <span>Selected Option</span>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Class Options for Active Transport */}
                {activeTransport && activeTransport.classes.length > 0 && selectedTransportId !== 'self_drive' && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      Choose {activeTransport.name} Travel Class
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeTransport.classes.map((cls) => {
                        const isClassActive = selectedClass === cls.className;
                        const classTotal = (activeTransport.basePrice + cls.extraPrice) * (tripType === 'Round trip' ? 2 : 1);
                        return (
                          <button
                            key={cls.className}
                            type="button"
                            onClick={() => setSelectedClass(cls.className)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isClassActive
                                ? 'border-[#ea580c] bg-white text-[#ea580c] shadow-xs ring-1 ring-[#ea580c]'
                                : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="text-xs font-bold block">{cls.className}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              ₹{classTotal.toLocaleString('en-IN')} {tripType === 'Round trip' ? '(Round)' : '(1-Way)'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: EXTRA FACILITIES */}
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-emerald-600" />
                    <span>2. Select Extra Facilities & Stays</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize your lodging tier, meal plans, private guides, and fast-track access.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Hotel Category */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Hotel Category</span>
                      <span className="text-[11px] text-slate-400">Select accommodation standard</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { label: '3 Star', note: 'Standard AC Rooms (Included)', price: 0 },
                        { label: '4 Star', note: '+₹1,800 / person (Resort/Pool)', price: 1800 },
                        { label: '5 Star', note: '+₹3,500 / person (Luxury Heritage)', price: 3500 }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setHotelCategory(item.label as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            hotelCategory === item.label
                              ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-600'
                              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{item.label}</span>
                            {hotelCategory === item.label && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">{item.note}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meals Plan */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Meal Plan</span>
                      <span className="text-[11px] text-slate-400">Fresh buffet dining</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { label: 'Breakfast only', note: 'Daily buffet breakfast (Included)', price: 0 },
                        { label: 'Breakfast + Dinner', note: '+₹650 / person / day (MAP)', price: 650 },
                        { label: 'All meals', note: '+₹1,200 / person / day (Full Board)', price: 1200 }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setMealPlan(item.label as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            mealPlan === item.label
                              ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-600'
                              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{item.label}</span>
                            {mealPlan === item.label && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">{item.note}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Select Facility Checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Airport Pickup & Drop */}
                    <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      hasAirportTransfer ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={hasAirportTransfer}
                        onChange={(e) => setHasAirportTransfer(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Airport / Station Pickup & Drop</span>
                          <span className="text-xs font-mono font-bold text-emerald-700">+₹1,500</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">2-way private sanitized vehicle transfer to hotel.</p>
                      </div>
                    </label>

                    {/* Dedicated Tour Guide */}
                    <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      hasTourGuide ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={hasTourGuide}
                        onChange={(e) => setHasTourGuide(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            Dedicated Tour Guide ({matchedGuide.name})
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-700">
                            +₹{(matchedGuide.dailyRate || 2200).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Certified regional expert ({matchedGuide.location}) with storyteller badge.
                        </p>
                      </div>
                    </label>

                    {/* Domestic Travel Insurance */}
                    <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      hasInsurance ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={hasInsurance}
                        onChange={(e) => setHasInsurance(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Travel Insurance</span>
                          <span className="text-xs font-mono font-bold text-emerald-700">+₹450 / pp</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Medical emergency coverage, baggage loss & trip delay security.</p>
                      </div>
                    </label>

                    {/* Fast Track Sightseeing Tickets */}
                    <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      hasSightseeingTickets ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={hasSightseeingTickets}
                        onChange={(e) => setHasSightseeingTickets(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Sightseeing & Entry Tickets</span>
                          <span className="text-xs font-mono font-bold text-emerald-700">+₹1,200 / pp</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Skip-the-line fast track monument passes and museum access.</p>
                      </div>
                    </label>

                    {/* Premium Suite Upgrade */}
                    <label className={`sm:col-span-2 p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      hasRoomUpgrade ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}>
                      <input
                        type="checkbox"
                        checked={hasRoomUpgrade}
                        onChange={(e) => setHasRoomUpgrade(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Room Upgrade (Panoramic Valley / Ocean Suite)</span>
                          <span className="text-xs font-mono font-bold text-emerald-700">+₹2,000 flat</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Top-tier suite room with private balcony, panoramic view & luxury bath.</p>
                      </div>
                    </label>

                  </div>

                  {/* Special Requests Text Box */}
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Special Requests / Dietary Preferences
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Jain food only, ground floor room for seniors, anniversary floral welcome..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-hidden focus:bg-white focus:border-[#ea580c] resize-none"
                    />
                  </div>

                </div>
              </div>


            </div>
          )}

          {/* STEP 3: Lead Traveler Contact Details */}
          {step === 3 && (
            <div className="space-y-6">
              
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#ea580c]" />
                  Lead Traveler Contact
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Hemant Badgujar"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#ea580c] outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1">Email Address (for E-Tickets)</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="e.g. traveler@letstravel.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#ea580c] outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+91 98201 44892"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#ea580c] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1">Departure City Chosen</label>
                    <input
                      type="text"
                      disabled
                      value={departureCity === 'Other (Custom Departure)' ? customCity : departureCity}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-hidden cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Review Chosen Facilities */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Review Selections:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg font-medium">
                    Transit: {activeTransport?.name} ({selectedClass}) • {tripType}
                  </span>
                  {selectedFacilitiesList.map((f, i) => (
                    <span key={i} className="text-xs bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg font-medium">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: Indian Rupee Breakdown & UPI / Gateway Payment */}
          {step === 4 && (
            <div className="space-y-6">
              
              {/* Itemized Price Calculation Summary */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Indian Rupee Price Breakdown
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>
                      Base Package ({priceCalculations.totalTravelers} Travelers)
                    </span>
                    <span className="font-mono font-semibold">₹{priceCalculations.basePackageTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {priceCalculations.transportTotal > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>
                        Transport ({activeTransport?.name} - {selectedClass}, {tripType})
                      </span>
                      <span className="font-mono font-semibold">+₹{priceCalculations.transportTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {priceCalculations.facilitiesTotal > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>Selected Extra Facilities</span>
                      <span className="font-mono font-semibold">+₹{priceCalculations.facilitiesTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>Applicable GST & Tourism Taxes (5%)</span>
                    <span className="font-mono font-semibold">+₹{priceCalculations.taxesAndFees.toLocaleString('en-IN')}</span>
                  </div>

                  {priceCalculations.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount ({appliedPromo?.code})</span>
                      <span className="font-mono">-₹{priceCalculations.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Total Payable Amount</span>
                    <span className="text-2xl font-black text-[#ea580c] font-mono">
                      ₹{priceCalculations.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="mt-4 pt-3 border-t border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Enter promo code (e.g. INDIA10, EXPLORE2000)"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-800 placeholder:text-slate-400 outline-hidden focus:border-[#ea580c]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Coupon {appliedPromo.code} applied successfully!
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choose Payment Gateway
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'UPI / Instant Pay' as PaymentMethod, label: 'BHIM / UPI', icon: QrCode },
                    { id: 'Google Pay / PhonePe' as PaymentMethod, label: 'GPay / PhonePe', icon: Wallet },
                    { id: 'Net Banking' as PaymentMethod, label: 'Net Banking', icon: Building },
                    { id: 'Credit/Debit Card' as PaymentMethod, label: 'Cards', icon: CreditCard }
                  ].map((method) => {
                    const Icon = method.icon;
                    const isActive = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isActive
                            ? 'border-[#ea580c] bg-orange-50/70 text-[#ea580c] shadow-xs font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#ea580c]' : 'text-slate-400'}`} />
                        <span className="text-xs">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Details Form */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                {paymentMethod === 'UPI / Instant Pay' && (
                  <div className="text-center py-2 space-y-3">
                    <div className="inline-block p-4 rounded-3xl bg-white border-2 border-slate-900 shadow-md">
                      <div className="bg-slate-950 text-white px-3 py-1.5 rounded-xl mb-3 flex items-center justify-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase">LET'S TRAVEL • Official UPI QR</span>
                      </div>
                      
                      {/* High-Contrast Interactive QR Code */}
                      <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center relative">
                        <svg viewBox="0 0 120 120" className="w-full h-full text-slate-900 fill-current">
                          {/* Top-Left Finder */}
                          <rect x="10" y="10" width="30" height="30" rx="4" fill="none" stroke="#0f172a" strokeWidth="6" />
                          <rect x="20" y="20" width="10" height="10" rx="2" fill="#0f172a" />
                          
                          {/* Top-Right Finder */}
                          <rect x="80" y="10" width="30" height="30" rx="4" fill="none" stroke="#0f172a" strokeWidth="6" />
                          <rect x="90" y="20" width="10" height="10" rx="2" fill="#0f172a" />
                          
                          {/* Bottom-Left Finder */}
                          <rect x="10" y="80" width="30" height="30" rx="4" fill="none" stroke="#0f172a" strokeWidth="6" />
                          <rect x="20" y="90" width="10" height="10" rx="2" fill="#0f172a" />
                          
                          {/* Data Modules Grid Pattern */}
                          <rect x="50" y="15" width="6" height="6" />
                          <rect x="62" y="15" width="6" height="6" />
                          <rect x="56" y="25" width="6" height="6" />
                          <rect x="50" y="35" width="6" height="6" />
                          <rect x="64" y="35" width="6" height="6" />
                          <rect x="15" y="50" width="6" height="6" />
                          <rect x="25" y="56" width="6" height="6" />
                          <rect x="35" y="50" width="6" height="6" />
                          <rect x="80" y="50" width="6" height="6" />
                          <rect x="92" y="56" width="6" height="6" />
                          <rect x="104" y="50" width="6" height="6" />
                          <rect x="50" y="80" width="6" height="6" />
                          <rect x="64" y="86" width="6" height="6" />
                          <rect x="56" y="96" width="6" height="6" />
                          <rect x="80" y="80" width="6" height="6" />
                          <rect x="94" y="94" width="6" height="6" />
                          <rect x="104" y="84" width="6" height="6" />
                          
                          {/* Center Brand Badge */}
                          <circle cx="60" cy="60" r="16" fill="#ea580c" />
                          <text x="60" y="64" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif">LT</text>
                        </svg>
                      </div>

                      <div className="mt-2 text-center">
                        <span className="text-[11px] font-mono font-black text-slate-900 block">
                          ₹{priceCalculations.grandTotal.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium block">
                          UPI ID: letstravel@hdfcbank
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Scan with <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or <strong>BHIM</strong> to pay.
                    </p>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Or enter your UPI VPA ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="max-w-xs mx-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 text-center block"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'Google Pay / PhonePe' && (
                  <div className="text-center py-4 space-y-2">
                    <p className="text-xs text-slate-600">
                      Fast 1-click checkout via linked Google Pay or PhonePe account.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 font-bold text-xs text-[#ea580c] border border-orange-200">
                      <Wallet className="w-4 h-4" />
                      <span>Ready to authenticate via Indian UPI</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Net Banking' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      <option>State Bank of India (SBI)</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Punjab National Bank (PNB)</option>
                      <option>Bank of Baroda</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'Credit/Debit Card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Card Number (Visa / MasterCard / RuPay)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 0000 0000 8912"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Valid Thru</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Safe & Secure Indian Rupee Payment Gateway.</span>
              </div>

            </div>
          )}

          {/* STEP 5: Success & Confirmed Booking */}
          {step === 5 && confirmedBooking && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Successful • Booking Confirmed
                </span>
                <h3 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                  Your Journey to {destination.title} is Booked!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Official confirmation voucher has been dispatched to <strong>{confirmedBooking.userEmail}</strong>.
                </p>
              </div>

              {/* Actions Header for Receipt */}
              <div className="flex items-center justify-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt as PDF / Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `LET'S TRAVEL Booking Confirmation: ${confirmedBooking.bookingReference} | Txn: ${confirmedBooking.paymentTransactionId} | Total: ₹${confirmedBooking.totalAmount.toLocaleString('en-IN')}`
                    );
                    alert('Receipt reference copied to clipboard!');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Receipt</span>
                </button>
              </div>

              {/* Printable Official Payment Receipt */}
              <div id="printable-receipt" className="max-w-xl mx-auto p-6 rounded-3xl bg-white border-2 border-slate-900 text-left relative overflow-hidden shadow-xl print:border-none print:shadow-none print:p-0">
                <style>{`
                  @media print {
                    body * {
                      visibility: hidden;
                    }
                    #printable-receipt, #printable-receipt * {
                      visibility: visible;
                    }
                    #printable-receipt {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      margin: 0;
                      padding: 24px;
                      border: 2px solid #0f172a !important;
                    }
                  }
                `}</style>
                
                {/* Receipt Header Banner */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#ea580c]">
                      <Compass className="w-4 h-4 text-[#ea580c]" />
                      <span>LET'S TRAVEL</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Custom Tours & Holidays • Pan-India & Global</p>
                    <h4 className="text-base font-bold font-serif text-slate-900 mt-1">Official Payment Receipt</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">RECEIPT NO.</span>
                    <span className="text-sm font-mono font-black text-slate-900">RCPT-{confirmedBooking.bookingReference}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                      PAID • SUCCESS
                    </span>
                  </div>
                </div>

                {/* Key Transaction Metadata */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4 pb-4 border-b border-dashed border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Payment Date</span>
                    <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Transaction ID</span>
                    <span className="font-mono text-[11px] font-bold text-slate-800 truncate block">{confirmedBooking.paymentTransactionId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Payment Mode</span>
                    <span className="font-semibold text-slate-800">{confirmedBooking.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Lead Payer</span>
                    <span className="font-bold text-slate-900 block truncate">{confirmedBooking.userName}</span>
                    <span className="text-[10px] text-slate-500 truncate block">{confirmedBooking.userEmail}</span>
                  </div>
                </div>

                {/* Booked Itinerary Details & Transport */}
                <div className="bg-slate-50 p-3.5 rounded-2xl mb-4 border border-slate-200/80 text-xs">
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-slate-900 font-serif text-sm">{confirmedBooking.destinationTitle}</strong>
                    <span className="font-mono text-[11px] text-slate-600">{confirmedBooking.travelDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {confirmedBooking.totalTravelers} Traveler(s) · {confirmedBooking.adults} Adult(s) {confirmedBooking.children > 0 ? `· ${confirmedBooking.children} Child` : ''} · Time: {confirmedBooking.timeSlot}
                  </p>

                  {/* Transport & Departure Info */}
                  {confirmedBooking.transportMode && (
                    <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                      <span className="text-slate-700 font-semibold">
                        Transit: <strong>{confirmedBooking.transportMode}</strong> ({confirmedBooking.transportClass})
                      </span>
                      <span className="text-slate-500">
                        From: <strong>{confirmedBooking.departureCity}</strong> ({confirmedBooking.tripType})
                      </span>
                    </div>
                  )}

                  {/* Facilities list */}
                  {confirmedBooking.facilities && confirmedBooking.facilities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Included Facilities:</span>
                      <div className="flex flex-wrap gap-1">
                        {confirmedBooking.facilities.map((fac, idx) => (
                          <span key={idx} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                            ✓ {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Itemization */}
                <div className="space-y-1.5 text-xs mb-4 pb-4 border-b border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Package Fare</span>
                    <span className="font-mono font-semibold">₹{confirmedBooking.basePrice.toLocaleString('en-IN')}</span>
                  </div>

                  {(confirmedBooking.transportAmount || 0) > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Transport Fare ({confirmedBooking.transportMode})</span>
                      <span className="font-mono font-semibold">+₹{confirmedBooking.transportAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {(confirmedBooking.facilitiesAmount || 0) > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Selected Extra Facilities</span>
                      <span className="font-mono font-semibold">+₹{confirmedBooking.facilitiesAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500">
                    <span>Applicable GST & Tourism Taxes (5%)</span>
                    <span className="font-mono font-semibold">+₹{confirmedBooking.taxAndFees.toLocaleString('en-IN')}</span>
                  </div>

                  {(confirmedBooking.discount || 0) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({confirmedBooking.promoCode})</span>
                      <span className="font-mono">-₹{confirmedBooking.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-sm">Total Amount Paid</span>
                    <span className="text-xl font-black text-[#ea580c] font-mono">
                      ₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Verification QR Code Section */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 border border-slate-900 rounded-xl bg-white flex flex-col items-center shrink-0">
                      <QrCode className="w-12 h-12 text-slate-900" />
                      <span className="text-[7px] font-mono font-black text-slate-900 tracking-wider">LET'S TRAVEL</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-800 block">Verified Digital Receipt</span>
                      <p className="text-[10px] text-slate-500">Scan QR to authenticate booking #{confirmedBooking.bookingReference}.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 block">24/7 Support Hotline</span>
                    <span className="text-[10px] font-mono font-bold text-slate-700">+91 1800-209-7711</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="border-t border-slate-200 bg-slate-50/80 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          {step > 1 && step < 5 && (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {step === 1 && (
            <div className="text-xs text-slate-500 font-medium">
              Base Fare: <strong className="font-mono text-slate-900">₹{priceCalculations.basePackageTotal.toLocaleString('en-IN')}</strong> ({adults} Adults{childrenCount > 0 ? `, ${childrenCount} Kids` : ''})
            </div>
          )}

          {step === 2 && (
            <div className="text-xs text-slate-500 font-medium">
              Total with Extras: <strong className="font-mono text-slate-900">₹{priceCalculations.grandTotal.toLocaleString('en-IN')}</strong>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Transport & Extras</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Traveler Info</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompletePaymentAndBook}
                className="px-8 py-3 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing UPI Gateway...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{priceCalculations.grandTotal.toLocaleString('en-IN')} & Confirm</span>
                  </>
                )}
              </button>
            )}

            {step === 5 && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
