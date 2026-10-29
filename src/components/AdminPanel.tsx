import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Download,
  IndianRupee,
  TrendingUp,
  X,
  Compass,
  Lock,
  UserCheck,
  AlertTriangle,
  Plane,
  Train,
  Bus,
  Car,
  PhoneCall,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Tag,
  LogOut,
  Loader2,
  BedDouble
} from 'lucide-react';
import {
  Destination,
  Booking,
  PaymentRecord,
  UserProfile,
  BookingStatus,
  DestinationCategory,
  TravelMode,
  EmergencyRequest,
  TransportOptionItem,
  FacilityOptionItem,
  PackageTransportFacilitiesConfig
} from '../types/travel';
import {
  saveDestination,
  removeDestination,
  updateBookingStatus,
  issueRefund,
  subscribeToEmergencyRequests,
  updateEmergencyStatus,
  updatePackageTransportFacilitiesConfig
} from '../services/travelService';
import { AUTHORIZED_ADMIN_ACCOUNTS, AuthorizedAdminAccount, VALID_PROMO_CODES, DEFAULT_TRANSPORT_OPTIONS, DEFAULT_FACILITY_OPTIONS } from '../data/seedDestinations';

interface AdminPanelProps {
  destinations: Destination[];
  bookings: Booking[];
  payments: PaymentRecord[];
  users: UserProfile[];
  onOpenTicket: (booking: Booking) => void;
  onCloseAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  destinations,
  bookings,
  payments,
  users,
  onOpenTicket,
  onCloseAdmin
}) => {
  // 4 Authorized Admin Credentials state
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState<AuthorizedAdminAccount | null>(() => {
    // Check if previously logged in this session
    const saved = sessionStorage.getItem('lets_travel_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'destinations' | 'bookings' | 'payments' | 'users' | 'emergency' | 'promos' | 'transport_facilities'
  >('overview');

  // Search states
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [travelModeFilter, setTravelModeFilter] = useState<string>('all');

  // Transport & Facilities Settings State
  const [selectedPkgId, setSelectedPkgId] = useState<string>(() => destinations[0]?.id || 'dest-agra-taj');
  const [pkgTransportList, setPkgTransportList] = useState<TransportOptionItem[]>(DEFAULT_TRANSPORT_OPTIONS);
  const [pkgFacilityList, setPkgFacilityList] = useState<FacilityOptionItem[]>(DEFAULT_FACILITY_OPTIONS);
  const [configSaveMsg, setConfigSaveMsg] = useState<string>('');
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);

  // When selected package changes, sync config from destination or default
  React.useEffect(() => {
    const dest = destinations.find((d) => d.id === selectedPkgId);
    if (dest?.transportConfig?.transportOptions && dest.transportConfig.transportOptions.length > 0) {
      setPkgTransportList(dest.transportConfig.transportOptions);
    } else {
      setPkgTransportList(DEFAULT_TRANSPORT_OPTIONS);
    }

    if (dest?.transportConfig?.facilityOptions && dest.transportConfig.facilityOptions.length > 0) {
      setPkgFacilityList(dest.transportConfig.facilityOptions);
    } else {
      setPkgFacilityList(DEFAULT_FACILITY_OPTIONS);
    }
  }, [selectedPkgId, destinations]);

  // Emergency Requests from Firestore
  const [emergencyList, setEmergencyList] = useState<EmergencyRequest[]>([]);

  React.useEffect(() => {
    const unsub = subscribeToEmergencyRequests((reqs) => {
      setEmergencyList(reqs);
    });
    return () => unsub();
  }, []);

  // Destination Edit/Create Modal State
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [destForm, setDestForm] = useState<Partial<Destination>>({
    category: 'Mountain & Trekking',
    travelMode: 'bus',
    durationDays: 6,
    durationNights: 5,
    rating: 4.8,
    reviewCount: 150,
    curatedToursCount: 10,
    availableSlots: 15,
    featured: true
  });

  // Local state for optimistic updates
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings);

  React.useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

function formatDateDDMMYYYY(dateInput: any): string {
  if (!dateInput) return '';
  let date: Date;
  if (typeof dateInput === 'object' && dateInput.seconds !== undefined) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput);
  }
  if (isNaN(date.getTime())) {
    const parts = String(dateInput).split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
    }
    return String(dateInput);
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
  }
  const str = String(val);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCSVBlob(csvString: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

  // Consolidated Payments Ledger: merges Firestore payments with bookings that have paid status
  const consolidatedPayments = useMemo<PaymentRecord[]>(() => {
    const map = new Map<string, PaymentRecord>();

    // 1. Add existing payments records from Firestore
    payments.forEach((p) => {
      const key = p.bookingId || p.bookingReference || p.transactionId || p.id;
      map.set(key, {
        ...p,
        amount: Number(p.amount) || 0
      });
    });

    // 2. Synthesize payments from bookings that are confirmed or paid if not already in payments
    localBookings.forEach((b) => {
      const key = b.id || b.bookingReference;
      if (!map.has(key) && !map.has(b.bookingReference) && !map.has(b.paymentTransactionId)) {
        if (b.paymentStatus === 'paid' || b.bookingStatus !== 'cancelled') {
          const amt = Number(b.amountPaid) || Number(b.totalAmount) || Number(b.finalAmount) || 0;
          map.set(key, {
            id: `pay-${b.id}`,
            transactionId: b.paymentTransactionId || `TXN-IN-${b.bookingReference}`,
            bookingId: b.id,
            bookingReference: b.bookingReference,
            userId: b.userId,
            userEmail: b.userEmail,
            amount: amt,
            currency: 'INR',
            paymentMethod: b.paymentMethod || 'UPI / Instant Pay',
            gateway: b.paymentMethod === 'UPI / Instant Pay' ? 'BHIM UPI Gateway' : 'Razorpay Secure NetBanking',
            status: b.paymentStatus === 'refunded' ? 'refunded' : 'success',
            createdAt: b.paidAt || b.createdAt || new Date().toISOString()
          });
        }
      }
    });

    const list = Array.from(map.values());
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  }, [payments, localBookings]);

  // Consolidated Travelers Directory: merges registered users with travelers from bookings
  const consolidatedUsers = useMemo<UserProfile[]>(() => {
    const userMap = new Map<string, UserProfile>();

    // 1. Add existing registered user profiles
    users.forEach((u) => {
      if (u.email) {
        userMap.set(u.email.toLowerCase().trim(), {
          ...u,
          totalTripsBooked: u.totalTripsBooked || 0,
          totalSpent: u.totalSpent || 0
        });
      }
    });

    // 2. Extract and aggregate travelers from bookings
    localBookings.forEach((b) => {
      if (!b.userEmail) return;
      const emailKey = b.userEmail.toLowerCase().trim();
      const existing = userMap.get(emailKey);
      if (existing) {
        if (!existing.totalTripsBooked || existing.totalTripsBooked === 0) {
          existing.totalTripsBooked = localBookings.filter((x) => x.userEmail.toLowerCase().trim() === emailKey).length;
          existing.totalSpent = localBookings
            .filter((x) => x.userEmail.toLowerCase().trim() === emailKey && x.paymentStatus === 'paid')
            .reduce((s, x) => s + (Number(x.totalAmount) || 0), 0);
        }
        if (!existing.phoneNumber && b.userPhone) {
          existing.phoneNumber = b.userPhone;
        }
        if (existing.displayName === 'Traveler' && b.userName) {
          existing.displayName = b.userName;
        }
      } else {
        const userBookings = localBookings.filter((x) => x.userEmail.toLowerCase().trim() === emailKey);
        const totalSpent = userBookings
          .filter((x) => x.paymentStatus === 'paid' || x.bookingStatus !== 'cancelled')
          .reduce((s, x) => s + (Number(x.totalAmount) || 0), 0);

        userMap.set(emailKey, {
          uid: b.userId || `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          email: b.userEmail,
          displayName: b.userName || 'Valued Traveler',
          phoneNumber: b.userPhone,
          totalTripsBooked: userBookings.length,
          totalSpent: totalSpent,
          createdAt: b.createdAt || new Date().toISOString(),
          updatedAt: b.updatedAt || new Date().toISOString()
        });
      }
    });

    return Array.from(userMap.values());
  }, [users, localBookings]);

  // KPIs in Indian Rupees (₹)
  const metrics = useMemo(() => {
    const confirmedAndPaidBookings = localBookings.filter(
      (b) =>
        b.paymentStatus === 'paid' ||
        b.bookingStatus === 'confirmed' ||
        b.bookingStatus === 'completed' ||
        b.bookingStatus === 'rescheduled' ||
        (b.bookingStatus !== 'cancelled' && (Number(b.amountPaid) > 0 || Number(b.totalAmount) > 0))
    );

    // 1. Gross Booking Value: sum of total amount of all confirmed and paid bookings
    const totalRevenue = confirmedAndPaidBookings.reduce((sum, b) => {
      const amt = Number(b.amountPaid) || Number(b.totalAmount) || Number(b.finalAmount) || 0;
      return sum + amt;
    }, 0);

    // 2. Net Revenue / Profit = Gross revenue minus costs (guide fee, operational cost and discounts)
    const destinationMap = new Map<string, Destination>();
    destinations.forEach((d) => destinationMap.set(d.id, d));

    let totalOperationalCosts = 0;
    let totalGuideFees = 0;

    confirmedAndPaidBookings.forEach((b) => {
      const dest = destinationMap.get(b.destinationId);
      const opCost = Number(dest?.operationalCost) || Number(b.operationalCost) || 0;
      totalOperationalCosts += opCost;
      if (b.selectedAddOns?.includes('addon-guide')) {
        totalGuideFees += 2200;
      }
    });

    const netProfit = Math.max(0, totalRevenue - totalOperationalCosts - totalGuideFees);

    const activeBookings = localBookings.filter(
      (b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'rescheduled'
    ).length;

    const totalTravelers = localBookings.reduce((sum, b) => {
      const travelers = Number(b.totalTravelers) || (Number(b.adults) || 1) + (Number(b.children) || 0);
      return sum + (travelers > 0 ? travelers : 1);
    }, 0);

    const openEmergencies = emergencyList.filter((e) => e.status === 'open').length;

    return {
      totalRevenue,
      netProfit,
      totalOperationalCosts,
      totalGuideFees,
      activeBookings,
      totalTravelers,
      destinationsCount: destinations.length,
      openEmergencies
    };
  }, [localBookings, destinations, emergencyList]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedInput = loginUsername.trim().toLowerCase();
    const matchedAccount = AUTHORIZED_ADMIN_ACCOUNTS.find(
      (a) =>
        a.username.trim().toLowerCase() === trimmedInput ||
        a.displayName.trim().toLowerCase() === trimmedInput ||
        (a.aliases && a.aliases.some((al) => al.trim().toLowerCase() === trimmedInput))
    );

    if (!matchedAccount) {
      setLoginError('Account not found. Access is strictly limited to the four authorized administrators: Badgujar hemant, Mukesh Sharma, Chandan Yadav, and Riken Ravel.');
      return;
    }

    if (matchedAccount.passwordHash !== loginPassword.trim()) {
      setLoginError('Incorrect password. Please verify your admin password and try again.');
      return;
    }

    setAuthenticatedAdmin(matchedAccount);
    sessionStorage.setItem('lets_travel_admin_user', JSON.stringify(matchedAccount));
    setLoginUsername('');
    setLoginPassword('');
  };

  // Quick fill credential helper
  const handleQuickFill = (acc: AuthorizedAdminAccount) => {
    setLoginUsername(acc.username);
    setLoginPassword(acc.passwordHash);
    setLoginError('');
  };

  // Admin Logout
  const handleAdminLogout = () => {
    setAuthenticatedAdmin(null);
    sessionStorage.removeItem('lets_travel_admin_user');
  };

  // Open Edit Destination
  const handleOpenEditDest = (dest: Destination) => {
    setEditingDest(dest);
    setDestForm({ ...dest });
    setIsDestModalOpen(true);
  };

  // Open Create Destination
  const handleOpenCreateDest = () => {
    setEditingDest(null);
    setDestForm({
      id: `dest-${Date.now()}`,
      title: '',
      subtitle: '',
      stateRegion: 'HIMACHAL PRADESH, INDIA',
      category: 'Mountain & Trekking',
      travelMode: 'bus',
      country: 'India',
      city: '',
      description: '',
      pricePerPerson: 18500,
      originalPrice: 22000,
      operationalCost: 0,
      durationDays: 6,
      durationNights: 5,
      rating: 4.8,
      reviewCount: 85,
      curatedToursCount: 10,
      badge: 'Popular Circuit',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'],
      mapUrl: 'https://www.google.com/maps',
      inclusions: ['4-Star Sanitised Hotel Stay', 'Daily Buffet Breakfast & Dinner', 'Private Transfers', 'All Taxes & GST'],
      exclusions: ['Personal Expenses', 'Adventure Activity Tokens'],
      highlights: ['Scenic sightseeing excursion', 'Sunset mountain viewpoint', 'Local market walk'],
      featured: true,
      availableSlots: 16,
      bestTimeToVisit: 'October to May',
      taxesAndGstPercent: 5
    });
    setIsDestModalOpen(true);
  };

  // Save Destination Form
  const handleSaveDestForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destForm.title || !destForm.city) return;

    const fullDest: Destination = {
      id: destForm.id || `dest-${Date.now()}`,
      title: destForm.title || '',
      subtitle: destForm.subtitle || '',
      stateRegion: destForm.stateRegion || 'INDIA',
      category: (destForm.category as DestinationCategory) || 'Mountain & Trekking',
      travelMode: (destForm.travelMode as TravelMode) || 'bus',
      country: destForm.country || 'India',
      city: destForm.city || '',
      description: destForm.description || '',
      pricePerPerson: Number(destForm.pricePerPerson) || 15000,
      originalPrice: Number(destForm.originalPrice) || 19000,
      operationalCost: Number(destForm.operationalCost) || 0,
      rating: Number(destForm.rating) || 4.8,
      reviewCount: Number(destForm.reviewCount) || 50,
      curatedToursCount: Number(destForm.curatedToursCount) || 10,
      badge: destForm.badge || undefined,
      durationDays: Number(destForm.durationDays) || 5,
      durationNights: Number(destForm.durationNights) || 4,
      imageUrl: destForm.imageUrl || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      gallery: destForm.gallery || [destForm.imageUrl || ''],
      mapUrl: destForm.mapUrl?.startsWith('http')
        ? destForm.mapUrl
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destForm.city} India`)}`,
      inclusions: destForm.inclusions || ['Hotel Stay', 'Transfers'],
      exclusions: destForm.exclusions || ['Personal Items'],
      highlights: destForm.highlights || ['Sightseeing', 'Mountain view'],
      featured: Boolean(destForm.featured),
      availableSlots: Number(destForm.availableSlots) || 12,
      bestTimeToVisit: destForm.bestTimeToVisit || 'Year-round',
      taxesAndGstPercent: 5
    };

    try {
      await saveDestination(fullDest);
      setIsDestModalOpen(false);
    } catch (err) {
      console.error('Failed to save destination:', err);
    }
  };

  // Delete Destination
  const handleDeleteDest = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove the destination package "${title}"?`)) {
      try {
        await removeDestination(id);
      } catch (err) {
        console.error('Failed to delete destination:', err);
      }
    }
  };

  // Export Bookings CSV (Meets exact Problem 2 specification)
  const handleExportBookingsCSV = () => {
    const headers = [
      'Booking ID',
      'Customer Name',
      'Phone',
      'Email',
      'Package',
      'Destination',
      'Guide',
      'Travel Date',
      'Adults',
      'Children',
      'Total Passengers',
      'Amount (INR)',
      'Discount',
      'Paid Amount',
      'Payment Status',
      'Payment Method',
      'Booking Date'
    ];

    const rows = localBookings.map((b) => [
      escapeCSV(b.bookingReference || b.id),
      escapeCSV(b.userName || 'Traveler'),
      escapeCSV(b.userPhone || ''),
      escapeCSV(b.userEmail || ''),
      escapeCSV(b.destinationTitle || ''),
      escapeCSV(`${b.destinationCity || ''}, ${b.destinationCountry || 'India'}`),
      escapeCSV(b.selectedAddOns?.includes('addon-guide') ? 'Assigned Local Guide' : 'Self-Guided'),
      escapeCSV(formatDateDDMMYYYY(b.travelDate)),
      Number(b.adults) || 1,
      Number(b.children) || 0,
      Number(b.totalTravelers) || (Number(b.adults) || 1) + (Number(b.children) || 0),
      Number(b.basePrice) || Number(b.totalAmount) || 0,
      Number(b.discount) || 0,
      Number(b.amountPaid) || Number(b.totalAmount) || 0,
      escapeCSV((b.paymentStatus || 'paid').toUpperCase()),
      escapeCSV(b.paymentMethod || 'UPI / Instant Pay'),
      escapeCSV(formatDateDDMMYYYY(b.createdAt))
    ]);

    const todayStr = new Date().toISOString().split('T')[0];
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadCSVBlob(csvContent, `lets-travel-bookings-${todayStr}.csv`);
  };

  // Export Payments CSV
  const handleExportPaymentsCSV = () => {
    const headers = [
      'Transaction ID',
      'Booking ID',
      'Customer Email',
      'Amount (INR)',
      'Currency',
      'Gateway',
      'Payment Method',
      'Status',
      'Payment Date'
    ];

    const rows = consolidatedPayments.map((p) => [
      escapeCSV(p.transactionId),
      escapeCSV(p.bookingReference || p.bookingId),
      escapeCSV(p.userEmail),
      Number(p.amount) || 0,
      escapeCSV(p.currency || 'INR'),
      escapeCSV(p.gateway || 'UPI'),
      escapeCSV(p.paymentMethod || 'UPI / Instant Pay'),
      escapeCSV((p.status || 'success').toUpperCase()),
      escapeCSV(formatDateDDMMYYYY(p.createdAt))
    ]);

    const todayStr = new Date().toISOString().split('T')[0];
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadCSVBlob(csvContent, `lets-travel-payments-${todayStr}.csv`);
  };

  // Export Travelers CSV
  const handleExportTravelersCSV = () => {
    const headers = [
      'Traveler ID',
      'Customer Name',
      'Email',
      'Contact Phone',
      'Trips Booked',
      'Lifetime Spend (INR)',
      'Account Registered'
    ];

    const rows = consolidatedUsers.map((u) => [
      escapeCSV(u.uid),
      escapeCSV(u.displayName || 'Traveler'),
      escapeCSV(u.email),
      escapeCSV(u.phoneNumber || '—'),
      Number(u.totalTripsBooked) || 0,
      Number(u.totalSpent) || 0,
      escapeCSV(formatDateDDMMYYYY(u.createdAt))
    ]);

    const todayStr = new Date().toISOString().split('T')[0];
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadCSVBlob(csvContent, `lets-travel-travelers-${todayStr}.csv`);
  };

  // Filtered Bookings for the table
  const filteredBookings = useMemo(() => {
    return localBookings.filter((b) => {
      const matchesStatus = bookingStatusFilter === 'all' || b.bookingStatus === bookingStatusFilter;
      const query = bookingSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        b.bookingReference.toLowerCase().includes(query) ||
        b.userName.toLowerCase().includes(query) ||
        b.userEmail.toLowerCase().includes(query) ||
        b.destinationTitle.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [localBookings, bookingStatusFilter, bookingSearch]);

  // Handle Booking Status Update with optimistic UI
  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: status } : b))
    );
    try {
      await updateBookingStatus(bookingId, { bookingStatus: status });
    } catch (err) {
      console.warn('Booking status updated in local state:', err);
    }
  };

  // Handle Refund Action with optimistic UI
  const handleIssueRefundAction = async (paymentId: string, bookingId: string, amount: number) => {
    if (window.confirm(`Issue 100% refund of ₹${amount.toLocaleString('en-IN')} for this reservation?`)) {
      setLocalBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId || b.paymentTransactionId === paymentId
            ? { ...b, paymentStatus: 'refunded', bookingStatus: 'cancelled' }
            : b
        )
      );
      try {
        await issueRefund(paymentId, bookingId, amount);
      } catch (err) {
        console.warn('Refund updated in local state:', err);
      }
    }
  };

  // Handle Emergency Status Update with optimistic UI
  const handleUpdateEmergencyStatus = async (id: string, status: 'open' | 'dispatched' | 'resolved') => {
    setEmergencyList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    try {
      await updateEmergencyStatus(id, status);
    } catch (err) {
      console.warn('Emergency status updated in local state:', err);
    }
  };

  // Handle Save Transport & Facilities Settings to Firestore
  const handleSaveTransportFacilitiesConfig = async () => {
    setIsSavingConfig(true);
    setConfigSaveMsg('');
    try {
      const config: PackageTransportFacilitiesConfig = {
        destinationId: selectedPkgId,
        transportOptions: pkgTransportList,
        facilityOptions: pkgFacilityList,
        updatedAt: new Date().toISOString()
      };
      await updatePackageTransportFacilitiesConfig(selectedPkgId, config);

      const targetDest = destinations.find((d) => d.id === selectedPkgId);
      const pkgTitle = targetDest?.title || selectedPkgId;
      setConfigSaveMsg(`✓ Transport & Facilities settings for "${pkgTitle}" successfully saved to Firestore!`);
      setTimeout(() => setConfigSaveMsg(''), 5000);
    } catch (err) {
      console.error('Error saving transport config:', err);
      setConfigSaveMsg('Failed to save to Firestore. Please check database permissions.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Filtered Destinations for the management tab
  const filteredDestList = useMemo(() => {
    if (travelModeFilter === 'all') return destinations;
    return destinations.filter((d) => d.travelMode === travelModeFilter);
  }, [destinations, travelModeFilter]);

  // IF NOT AUTHENTICATED AS ONE OF THE 4 ADMINS, SHOW SECURE LOGIN
  if (!authenticatedAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#00529b] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              Staff Administrator Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authorized access restricted to the 4 registered administrative staff members.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Admin Username</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="e.g. Badgujar hemant"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#ea580c] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#ea580c] outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#00529b] hover:bg-[#003d73] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In to Admin Panel</span>
            </button>
          </form>

          {/* Quick-Fill Authorized Admin Credentials for Easy Testing */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Authorized Personnel Credentials (4 Admins):
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                1-Click Preset Fill
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AUTHORIZED_ADMIN_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#ea580c] hover:bg-orange-50/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#ea580c]">{acc.displayName}</span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">{acc.username}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{acc.roleTitle}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onCloseAdmin}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ← Back to Main Website
            </button>
          </div>

        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN PANEL DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top Banner: Active Administrator Profile */}
      <div className="bg-[#071a23] rounded-3xl p-6 text-white shadow-xl mb-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00529b] flex items-center justify-center text-white shadow-md">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-bold font-serif">LET'S TRAVEL</span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#ea580c] bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                  Staff Admin Console
                </span>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  {authenticatedAdmin.roleTitle}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Signed in as <strong>{authenticatedAdmin.displayName}</strong> ({authenticatedAdmin.department}) • User: <em>{authenticatedAdmin.username}</em>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Admin Logout</span>
            </button>
            <button
              onClick={onCloseAdmin}
              className="px-3.5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'destinations', label: `Destinations & Packages (${destinations.length})`, icon: MapPin },
          { id: 'transport_facilities', label: 'Transport & Facilities Settings', icon: Plane },
          { id: 'bookings', label: `Bookings (${localBookings.length})`, icon: Calendar },
          { id: 'payments', label: `Payments & Revenue (${consolidatedPayments.length})`, icon: CreditCard },
          { id: 'users', label: `Travelers (${consolidatedUsers.length})`, icon: Users },
          { id: 'emergency', label: `SOS Emergencies (${emergencyList.length})`, icon: PhoneCall, badge: metrics.openEmergencies },
          { id: 'promos', label: 'Promo Discounts', icon: Tag }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Booking Value</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Synchronized live to Firestore
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Net Revenue / Profit</span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black font-mono text-purple-900">
                ₹{metrics.netProfit.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">
                Gross minus ₹{metrics.totalOperationalCosts.toLocaleString('en-IN')} op-costs & ₹{metrics.totalGuideFees.toLocaleString('en-IN')} guide fees
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
                <div className="p-2 rounded-xl bg-orange-50 text-[#ea580c]">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{metrics.activeBookings}</p>
              <p className="text-[11px] text-slate-500 mt-1">Confirmed customer itineraries</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Passengers</span>
                <div className="p-2 rounded-xl bg-sky-50 text-[#00529b]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{metrics.totalTravelers}</p>
              <p className="text-[11px] text-slate-500 mt-1">Adults & children traveling</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active SOS Dispatches</span>
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{metrics.openEmergencies}</p>
              <p className="text-[11px] text-rose-600 font-semibold mt-1">Pending emergency assistance calls</p>
            </div>
          </div>

          {/* Quick Shortcuts & 4 Authorized Admins Roster */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Recent Booking Reservations</h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-[#ea580c] hover:underline cursor-pointer"
                >
                  View All ({localBookings.length}) →
                </button>
              </div>

              {localBookings.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No bookings recorded yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {localBookings.slice(0, 4).map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{b.bookingReference}</span>
                          <span className="text-slate-500">· {b.userName}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{b.destinationTitle} on {b.travelDate}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 block">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase">{b.bookingStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Authorized Staff Council</h3>
              <div className="space-y-3">
                {AUTHORIZED_ADMIN_ACCOUNTS.map((acc) => (
                  <div key={acc.username} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{acc.displayName}</strong>
                      <span className="text-[10px] font-mono font-bold text-[#00529b]">{acc.username}</span>
                    </div>
                    <p className="text-[11px] text-[#ea580c] font-medium mt-0.5">{acc.roleTitle}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{acc.department}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESTINATIONS & PACKAGES */}
      {activeTab === 'destinations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900">Destination Packages Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add, modify or delete travel packages, update travel modes (Flights, Trains, Buses, SUV), Google Maps links, and pricing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreateDest}
                className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tour Package</span>
              </button>
            </div>
          </div>

          {/* Mode Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <span className="text-slate-400 uppercase text-[11px] mr-1">Filter Mode:</span>
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'flight', label: 'Flights Included ✈️' },
              { id: 'train', label: 'Scenic Trains 🚆' },
              { id: 'bus', label: 'Volvo Buses 🚌' },
              { id: 'private_cab', label: 'Private SUV 🚙' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setTravelModeFilter(m.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  travelModeFilter === m.id
                    ? 'bg-[#00529b] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Tour Package</th>
                    <th className="py-3.5 px-4">Travel Mode</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Price / Person</th>
                    <th className="py-3.5 px-4">Operational Cost (₹)</th>
                    <th className="py-3.5 px-4">Google Maps Link</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDestList.map((dest) => (
                    <tr key={dest.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dest.imageUrl}
                            alt={dest.title}
                            className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <strong className="text-slate-900 block">{dest.title}</strong>
                            <span className="text-[11px] text-slate-400">{dest.city}, {dest.country}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-sky-50 text-sky-800 border border-sky-200 inline-flex items-center gap-1">
                          {dest.travelMode === 'flight' && <Plane className="w-3 h-3" />}
                          {dest.travelMode === 'train' && <Train className="w-3 h-3" />}
                          {dest.travelMode === 'bus' && <Bus className="w-3 h-3" />}
                          {dest.travelMode === 'private_cab' && <Car className="w-3 h-3" />}
                          <span>{dest.travelMode || 'All-Inclusive'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {dest.durationDays}D / {dest.durationNights}N
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900">
                          ₹{dest.pricePerPerson.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          ₹{(dest.operationalCost || 0).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={dest.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00529b] hover:underline font-semibold flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                          <span>View Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditDest(dest)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                            title="Edit Tour Package"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDest(dest.id, dest.title)}
                            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                            title="Delete Tour Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900">Customer Bookings Hub</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time booking confirmations, date updates, cancellation status, and digital boarding passes.
              </p>
            </div>

            <button
              onClick={handleExportBookingsCSV}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Report</span>
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search by reference, traveler name, email, or destination..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#ea580c] outline-hidden shadow-2xs"
              />
            </div>

            <select
              value={bookingStatusFilter}
              onChange={(e) => setBookingStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-hidden cursor-pointer shadow-2xs"
            >
              <option value="all">All Statuses ({bookings.length})</option>
              <option value="confirmed">Confirmed</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Ref & Traveler</th>
                    <th className="py-3.5 px-4">Destination</th>
                    <th className="py-3.5 px-4">Travel Date</th>
                    <th className="py-3.5 px-4">Party</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Status & Action</th>
                    <th className="py-3.5 px-4 text-right">E-Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No bookings match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{b.bookingReference}</span>
                          <span className="text-slate-600 font-medium block">{b.userName}</span>
                          <span className="text-[11px] text-slate-400">{b.userEmail} · {b.userPhone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <div>{b.destinationTitle}</div>
                          {b.transportMode && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md font-semibold w-fit">
                              <Plane className="w-3 h-3 text-[#ea580c]" />
                              <span>{b.transportMode} ({b.transportClass || 'Standard'}) • {b.departureCity} ({b.tripType})</span>
                            </div>
                          )}
                          {b.facilities && b.facilities.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1 text-[9px]">
                              {b.facilities.map((fac, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200/70">
                                  ✓ {fac}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {b.travelDate}
                          <span className="block text-[10px] text-slate-400">{b.timeSlot}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {b.totalTravelers} Persons
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">
                            ₹{b.totalAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">{b.paymentStatus.toUpperCase()}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={b.bookingStatus}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="rescheduled">Rescheduled</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onOpenTicket(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Voucher
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS & AUDIT */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900">Payments & Revenue Ledger</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified UPI, Card, Net Banking transactions processed in Indian Rupees (₹) with 5% GST tax breakdowns and refund controls.
              </p>
            </div>

            <button
              onClick={handleExportPaymentsCSV}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Payments (CSV)</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Payer Details</th>
                    <th className="py-3.5 px-4">Method & Gateway</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Refund Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consolidatedPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    consolidatedPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {p.transactionId}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                          {p.bookingReference}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {p.userEmail}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {p.paymentMethod} ({p.gateway})
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              p.status === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'refunded'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {p.status === 'success' && (
                            <button
                              onClick={() => handleIssueRefundAction(p.id, p.bookingId, p.amount)}
                              className="px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Issue Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REGISTERED TRAVELERS */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900">Registered Travelers Directory</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Traveler accounts registered via bookings and customer profiles.
              </p>
            </div>

            <button
              onClick={handleExportTravelersCSV}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Travelers (CSV)</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Traveler Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Contact Phone</th>
                    <th className="py-3.5 px-4">Trips Booked</th>
                    <th className="py-3.5 px-4">Lifetime Spend (INR)</th>
                    <th className="py-3.5 px-4">Account Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consolidatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No registered travelers logged yet.
                      </td>
                    </tr>
                  ) : (
                    consolidatedUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {u.displayName || 'Traveler'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{u.email}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{u.phoneNumber || '—'}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{u.totalTripsBooked || 0}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          ₹{(u.totalSpent || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EMERGENCY & SOS INQUIRIES */}
      {activeTab === 'emergency' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">24/7 Traveler SOS & Emergency Requests</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live emergency assistance dispatches, medical aid requests, and roadside breakdown calls.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Traveler Contact</th>
                    <th className="py-3.5 px-4">Incident / Service</th>
                    <th className="py-3.5 px-4">Current Location</th>
                    <th className="py-3.5 px-4">Details / Notes</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {emergencyList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No active emergency requests reported. All travelers safe!
                      </td>
                    </tr>
                  ) : (
                    emergencyList.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block">{req.travelerName}</strong>
                          <a href={`tel:${req.phone}`} className="text-[#ea580c] font-mono font-bold flex items-center gap-1">
                            <PhoneCall className="w-3 h-3" />
                            <span>{req.phone}</span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {req.serviceType}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {req.location}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                          {req.notes || 'Immediate assistance requested'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              req.status === 'open'
                                ? 'bg-rose-100 text-rose-800 animate-pulse'
                                : req.status === 'dispatched'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateEmergencyStatus(req.id, e.target.value as any)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
                          >
                            <option value="open">Open (SOS)</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PROMOS */}
      {activeTab === 'promos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">Website Promo Codes & Seasonal Discounts</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active promotional discount codes available for travelers during checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(VALID_PROMO_CODES).map(([code, p]) => (
              <div key={code} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-sm bg-orange-100 text-[#ea580c] px-3 py-1 rounded-xl">
                    {code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mt-2">
                  {p.discountPercent ? `${p.discountPercent}% Instant Off` : `Flat ₹${p.discountFixed} Off`}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: TRANSPORT & EXTRA FACILITIES SETTINGS */}
      {activeTab === 'transport_facilities' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header & Package Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#ea580c] bg-orange-50 px-3 py-1 rounded-full border border-orange-200 mb-2">
                <Plane className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Custom Package Pricing & Availability</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Transport & Extra Facilities Settings</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Configure transport modes, transit class extra charges, hotel tier surcharges, and add-on facilities per package. All edits are stored persistently in Firestore.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Package Dropdown */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Select Destination Package
                </label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => setSelectedPkgId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-hidden focus:bg-white focus:border-[#ea580c] cursor-pointer"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.city}, {d.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Save Button */}
              <div className="sm:self-end">
                <button
                  type="button"
                  disabled={isSavingConfig}
                  onClick={handleSaveTransportFacilitiesConfig}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00529b] hover:bg-[#003d73] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingConfig ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Save Settings to Firestore</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Save Status Notification */}
          {configSaveMsg && (
            <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              configSaveMsg.startsWith('✓')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{configSaveMsg}</span>
            </div>
          )}

          {/* Section 1: Transport Modes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#ea580c]" />
                  <span>Transport Options & Class Surcharges</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enable or disable transit modes and adjust base prices and travel class differentials in Indian Rupees (₹).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {pkgTransportList.map((transport, idx) => (
                <div
                  key={transport.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    transport.enabled ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={transport.enabled}
                        onChange={(e) => {
                          const updated = [...pkgTransportList];
                          updated[idx] = { ...updated[idx], enabled: e.target.checked };
                          setPkgTransportList(updated);
                        }}
                        className="w-4 h-4 accent-[#ea580c] rounded cursor-pointer"
                      />
                      <div>
                        <strong className="text-xs sm:text-sm text-slate-900 font-bold block">{transport.name}</strong>
                        <span className="text-[11px] text-slate-400 font-mono">ID: {transport.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">Base Fare (₹/pp):</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={transport.basePrice}
                        onChange={(e) => {
                          const updated = [...pkgTransportList];
                          updated[idx] = { ...updated[idx], basePrice: Number(e.target.value) || 0 };
                          setPkgTransportList(updated);
                        }}
                        className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 text-right outline-hidden focus:bg-white focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  {/* Class options list */}
                  {transport.classes && transport.classes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Class Extra Fares (+₹ above base):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {transport.classes.map((cls, cIdx) => (
                          <div key={cls.className} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-700 truncate">{cls.className}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] text-slate-400">+₹</span>
                              <input
                                type="number"
                                min={0}
                                step={100}
                                value={cls.extraPrice}
                                onChange={(e) => {
                                  const updated = [...pkgTransportList];
                                  const updatedClasses = [...updated[idx].classes];
                                  updatedClasses[cIdx] = {
                                    ...updatedClasses[cIdx],
                                    extraPrice: Number(e.target.value) || 0
                                  };
                                  updated[idx] = { ...updated[idx], classes: updatedClasses };
                                  setPkgTransportList(updated);
                                }}
                                className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 text-right outline-hidden focus:border-[#ea580c]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Extra Facilities & Surcharges */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-emerald-600" />
                  <span>Extra Facilities & Upgrade Rates</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set prices for lodging tiers, dining plans, guide fees, transfers and insurance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkgFacilityList.map((fac, idx) => (
                <div
                  key={fac.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    fac.enabled ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={fac.enabled}
                          onChange={(e) => {
                            const updated = [...pkgFacilityList];
                            updated[idx] = { ...updated[idx], enabled: e.target.checked };
                            setPkgFacilityList(updated);
                          }}
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                        <div>
                          <strong className="text-xs font-bold text-slate-900 block">{fac.name}</strong>
                          <span className="text-[10px] text-slate-400 capitalize">{fac.category} · {fac.perPerson ? 'Per Person' : 'Flat Party Rate'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs font-bold text-slate-500">₹</span>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={fac.price}
                          onChange={(e) => {
                            const updated = [...pkgFacilityList];
                            updated[idx] = { ...updated[idx], price: Number(e.target.value) || 0 };
                            setPkgFacilityList(updated);
                          }}
                          className="w-24 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 text-right outline-hidden focus:bg-white focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">{fac.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Note: {fac.priceNote}</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fac.perPerson}
                        onChange={(e) => {
                          const updated = [...pkgFacilityList];
                          updated[idx] = { ...updated[idx], perPerson: e.target.checked };
                          setPkgFacilityList(updated);
                        }}
                        className="accent-slate-700"
                      />
                      <span>Per Person Rate</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="text-xs text-slate-300">
              Changes will take immediate effect for all new bookings of <strong className="text-white">{destinations.find(d => d.id === selectedPkgId)?.title}</strong>.
            </div>
            <button
              type="button"
              disabled={isSavingConfig}
              onClick={handleSaveTransportFacilitiesConfig}
              className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSavingConfig ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Transport & Facilities to Firestore</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}
      {isDestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                {editingDest ? 'Edit Tour Package' : 'Add New Tour Package'}
              </h3>
              <button
                onClick={() => setIsDestModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestForm} className="mt-6 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Package Title</label>
                  <input
                    type="text"
                    required
                    value={destForm.title || ''}
                    onChange={(e) => setDestForm({ ...destForm, title: e.target.value })}
                    placeholder="e.g. Kashmir Alpine Snow Paradise"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#ea580c] outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">State / Region</label>
                  <input
                    type="text"
                    required
                    value={destForm.stateRegion || ''}
                    onChange={(e) => setDestForm({ ...destForm, stateRegion: e.target.value })}
                    placeholder="e.g. JAMMU & KASHMIR, INDIA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#ea580c] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Category</label>
                  <select
                    value={destForm.category}
                    onChange={(e) => setDestForm({ ...destForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden cursor-pointer"
                  >
                    <option value="Mountain & Trekking">Mountain & Trekking</option>
                    <option value="Beach & Coastal">Beach & Coastal</option>
                    <option value="Cultural & Heritage">Cultural & Heritage</option>
                    <option value="Adventure & Wildlife">Adventure & Wildlife</option>
                    <option value="Island Paradise">Island Paradise</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Travel Mode</label>
                  <select
                    value={destForm.travelMode || 'bus'}
                    onChange={(e) => setDestForm({ ...destForm, travelMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden cursor-pointer"
                  >
                    <option value="flight">Flights Included ✈️</option>
                    <option value="train">Scenic Trains 🚆</option>
                    <option value="bus">Volvo Buses 🚌</option>
                    <option value="private_cab">Private SUV 🚙</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Price per Person (₹)</label>
                  <input
                    type="number"
                    required
                    value={destForm.pricePerPerson || ''}
                    onChange={(e) => setDestForm({ ...destForm, pricePerPerson: Number(e.target.value) })}
                    placeholder="19999"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#ea580c] outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Operational Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={destForm.operationalCost ?? 0}
                    onChange={(e) => setDestForm({ ...destForm, operationalCost: Number(e.target.value) })}
                    placeholder="e.g. 7500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#ea580c] outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Deducted for profit</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Duration Days</label>
                  <input
                    type="number"
                    value={destForm.durationDays || 6}
                    onChange={(e) => setDestForm({ ...destForm, durationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Duration Nights</label>
                  <input
                    type="number"
                    value={destForm.durationNights || 5}
                    onChange={(e) => setDestForm({ ...destForm, durationNights: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">City / Hub</label>
                  <input
                    type="text"
                    required
                    value={destForm.city || ''}
                    onChange={(e) => setDestForm({ ...destForm, city: e.target.value })}
                    placeholder="e.g. Manali"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Google Maps Location Link</label>
                <input
                  type="url"
                  value={destForm.mapUrl || ''}
                  onChange={(e) => setDestForm({ ...destForm, mapUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/search/?api=1&query=..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#ea580c] outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={destForm.imageUrl || ''}
                  onChange={(e) => setDestForm({ ...destForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#ea580c] outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Description & Highlights</label>
                <textarea
                  rows={3}
                  value={destForm.description || ''}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  placeholder="Describe the tour experience, stays, and scenic trails..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#ea580c] outline-hidden resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold shadow-md cursor-pointer"
                >
                  Save Package to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
