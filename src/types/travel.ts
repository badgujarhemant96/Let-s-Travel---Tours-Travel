export type DestinationCategory =
  | 'Beach & Coastal'
  | 'Mountain & Trekking'
  | 'Cultural & Heritage'
  | 'Adventure & Wildlife'
  | 'Urban & City Break'
  | 'Island Paradise';

export type TravelMode = 'all' | 'flight' | 'train' | 'bus' | 'private_cab';

export interface TransportDetails {
  mode: TravelMode;
  carrierName: string;
  departureHub: string;
  arrivalHub: string;
  scheduleTime: string;
  baggageOrSeats: string;
  includedFeatures: string[];
}

export interface HotelOption {
  id: string;
  name: string;
  category: string;
  rating: number;
  imageUrl?: string;
  pricePerNight?: number;
  location?: string;
  destinationId?: string;
  destinationTitle?: string;
  roomType: string;
  foodPlan: string;
  foodOptions?: string[];
  amenities: string[];
  facilities?: string[];
  bookingDetails?: string;
}

export interface FoodFacility {
  mealType: string;
  description: string;
  included: boolean;
}

export interface Destination {
  id: string;
  title: string;
  subtitle: string;
  stateRegion: string;
  category: DestinationCategory;
  travelMode?: TravelMode;
  transportDetails?: TransportDetails;
  country: string;
  city: string;
  description: string;
  pricePerPerson: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  curatedToursCount: number;
  badge?: string;
  durationDays: number;
  durationNights: number;
  imageUrl: string;
  gallery: string[];
  mapUrl: string;
  coordinates?: string;
  inclusions: string[];
  exclusions?: string[];
  highlights: string[];
  hotels?: HotelOption[];
  foodFacilities?: FoodFacility[];
  nearbyAttractions?: string[];
  taxesAndGstPercent?: number;
  featured: boolean;
  availableSlots: number;
  bestTimeToVisit: string;
  operationalCost?: number;
  transportConfig?: PackageTransportFacilitiesConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddOnOption {
  id: string;
  title: string;
  description: string;
  price: number;
  perPerson: boolean;
  iconName: string;
}

export type PaymentMethod =
  | 'UPI / Instant Pay'
  | 'Credit/Debit Card'
  | 'Net Banking'
  | 'Google Pay / PhonePe';

export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export type BookingStatus =
  | 'confirmed'
  | 'pending_confirmation'
  | 'rescheduled'
  | 'cancelled'
  | 'completed';

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  destinationId: string;
  destinationTitle: string;
  destinationCity: string;
  destinationCountry: string;
  destinationImage: string;
  destinationMapUrl: string;
  travelDate: string;
  timeSlot: string;
  adults: number;
  children: number;
  totalTravelers: number;
  selectedAddOns: string[];
  basePrice: number;
  addOnsTotal: number;
  taxAndFees: number;
  discount: number;
  promoCode?: string;
  totalAmount: number;
  amountPaid?: number;
  paidAt?: string;
  finalAmount?: number;
  operationalCost?: number;
  // Transport & Extra Facilities selections
  transportMode?: string;
  transportClass?: string;
  tripType?: 'Round trip' | 'One way';
  departureCity?: string;
  facilities?: string[];
  transportAmount?: number;
  facilitiesAmount?: number;
  discountAmount?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  paymentTransactionId: string;
  cancellationReason?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransportClassOption {
  className: string;
  extraPrice: number;
}

export interface TransportOptionItem {
  id: string; // 'flight' | 'train' | 'bus' | 'cab' | 'self_drive'
  name: string;
  iconName: string;
  shortNote: string;
  basePrice: number;
  classes: TransportClassOption[];
  enabled: boolean;
  requiresFlight?: boolean;
  disallowTrainAndBus?: boolean;
}

export interface FacilityOptionItem {
  id: string;
  category: 'hotel' | 'meal' | 'transfer' | 'guide' | 'insurance' | 'sightseeing' | 'upgrade';
  name: string;
  price: number;
  priceNote: string;
  perPerson: boolean;
  enabled: boolean;
  description?: string;
}

export interface PackageTransportFacilitiesConfig {
  destinationId: string;
  transportOptions?: TransportOptionItem[];
  facilityOptions?: FacilityOptionItem[];
  updatedAt?: string;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  bookingId: string;
  bookingReference: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  gateway: string;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  cardLast4?: string;
  upiId?: string;
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'staff_admin' | 'operations' | 'finance';
  roleTitle: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  phone?: string;
  totalTripsBooked: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface TourGuide {
  id: string;
  name: string;
  photoUrl: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  specialization: string;
  dailyRate: number;
  location: string;
  isAvailable: boolean;
  bio: string;
  badges: string[];
}

export interface EmergencyService {
  id: string;
  serviceType: 'medical' | 'roadside' | 'police' | 'consular' | 'general_sos';
  title: string;
  costModel: 'Free Coordination' | 'Chargeable at Actuals' | 'Partially Covered';
  costDescription: string;
  emergencyPhone: string;
  description: string;
  coverage: string;
}

export interface EmergencyRequest {
  id: string;
  travelerName: string;
  phone: string;
  location: string;
  serviceType: string;
  notes: string;
  status: 'open' | 'dispatched' | 'resolved';
  createdAt: string;
}
