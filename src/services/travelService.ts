import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  Destination,
  Booking,
  PaymentRecord,
  UserProfile,
  AdminUser,
  BookingStatus,
  PaymentStatus
} from '../types/travel';
import { SEED_DESTINATIONS, PRESET_ADMINS } from '../data/seedDestinations';

const DESTINATIONS_COLLECTION = 'destinations';
const BOOKINGS_COLLECTION = 'bookings';
const PAYMENTS_COLLECTION = 'payments';
const USERS_COLLECTION = 'users';
const ADMINS_COLLECTION = 'admins';

// Seed Initial Database if empty or if containing legacy destinations
export async function seedInitialDatabaseIfEmpty(): Promise<void> {
  try {
    const destSnap = await getDocs(collection(db, DESTINATIONS_COLLECTION));
    const needsReseed = destSnap.empty || destSnap.docs.some(d => d.id === 'dest-santorini-greece');
    if (needsReseed) {
      console.log('Seeding updated Indian destinations into Firestore...');
      for (const dest of SEED_DESTINATIONS) {
        await setDoc(doc(db, DESTINATIONS_COLLECTION, dest.id), {
          ...dest,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    // Seed preset admins
    for (const admin of PRESET_ADMINS) {
      const adminRef = doc(db, ADMINS_COLLECTION, admin.uid);
      const existing = await getDoc(adminRef);
      if (!existing.exists()) {
        await setDoc(adminRef, {
          ...admin,
          lastLogin: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.warn('Initial seeding note (safe fallback used):', error);
  }
}

// Destination Services
export async function getDestinations(): Promise<Destination[]> {
  try {
    const querySnapshot = await getDocs(collection(db, DESTINATIONS_COLLECTION));
    if (querySnapshot.empty) {
      // If collection is still empty or loading, return fallback seed
      return SEED_DESTINATIONS;
    }
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Destination));
  } catch (error) {
    console.error('Failed to get destinations from Firestore, falling back to seed:', error);
    return SEED_DESTINATIONS;
  }
}

export function subscribeToDestinations(callback: (destinations: Destination[]) => void): () => void {
  const colRef = collection(db, DESTINATIONS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback(SEED_DESTINATIONS);
      } else {
        const dests = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Destination));
        callback(dests);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, DESTINATIONS_COLLECTION);
    }
  );
}

export async function saveDestination(destination: Destination): Promise<void> {
  const path = `${DESTINATIONS_COLLECTION}/${destination.id}`;
  try {
    await setDoc(doc(db, DESTINATIONS_COLLECTION, destination.id), {
      ...destination,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeDestination(destinationId: string): Promise<void> {
  const path = `${DESTINATIONS_COLLECTION}/${destinationId}`;
  try {
    await deleteDoc(doc(db, DESTINATIONS_COLLECTION, destinationId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updatePackageTransportFacilitiesConfig(
  destinationId: string,
  config: import('../types/travel').PackageTransportFacilitiesConfig
): Promise<void> {
  const destDocRef = doc(db, DESTINATIONS_COLLECTION, destinationId);
  const now = new Date().toISOString();
  try {
    await updateDoc(destDocRef, {
      transportConfig: {
        ...config,
        updatedAt: now
      },
      updatedAt: now
    });
    // Also save in a dedicated collection for resilience
    await setDoc(doc(db, 'package_configs', destinationId), {
      ...config,
      updatedAt: now
    });
  } catch (error) {
    // If updateDoc fails because doc might not exist yet, fallback to setDoc with merge
    try {
      await setDoc(destDocRef, {
        transportConfig: {
          ...config,
          updatedAt: now
        },
        updatedAt: now
      }, { merge: true });
    } catch (setErr) {
      handleFirestoreError(setErr, OperationType.WRITE, `${DESTINATIONS_COLLECTION}/${destinationId}`);
    }
  }
}

// Booking Services
export async function createBooking(
  bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
  paymentData: Omit<PaymentRecord, 'id' | 'bookingId' | 'createdAt'>
): Promise<{ bookingId: string; paymentId: string }> {
  const bookingId = `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const paidAmount = Number(paymentData.amount) || Number(bookingData.totalAmount) || 0;

  const booking: Booking = {
    ...bookingData,
    id: bookingId,
    paymentTransactionId: paymentData.transactionId,
    paymentStatus: 'paid',
    amountPaid: paidAmount,
    paidAt: now,
    finalAmount: paidAmount,
    totalAmount: paidAmount,
    createdAt: now,
    updatedAt: now
  };

  const payment: PaymentRecord = {
    ...paymentData,
    amount: paidAmount,
    id: paymentId,
    bookingId,
    bookingReference: bookingData.bookingReference,
    createdAt: now
  };

  try {
    await setDoc(doc(db, BOOKINGS_COLLECTION, bookingId), booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${BOOKINGS_COLLECTION}/${bookingId}`);
  }

  try {
    await setDoc(doc(db, PAYMENTS_COLLECTION, paymentId), payment);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PAYMENTS_COLLECTION}/${paymentId}`);
  }

  // Update user profile statistics
  try {
    const userRef = doc(db, USERS_COLLECTION, bookingData.userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const data = userDoc.data() as UserProfile;
      const newTotal = (data.totalSpent || 0) + booking.totalAmount;
      const newTrips = (data.totalTripsBooked || 0) + 1;

      await updateDoc(userRef, {
        totalSpent: newTotal,
        totalTripsBooked: newTrips,
        updatedAt: now
      });
    }
  } catch (err) {
    console.warn('Note: user profile stats update deferred:', err);
  }

  return { bookingId, paymentId };
}

export function subscribeToUserBookings(
  userId: string,
  callback: (bookings: Booking[]) => void
): () => void {
  const colRef = collection(db, BOOKINGS_COLLECTION);
  const q = query(colRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const bookings = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
      // Sort newest first
      bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(bookings);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, BOOKINGS_COLLECTION);
    }
  );
}

export function normalizeBooking(data: any, id: string): Booking {
  let rawAmount = data.amountPaid ?? data.totalAmount ?? data.finalAmount ?? data.price;
  let parsedAmount = 0;
  if (typeof rawAmount === 'number') {
    parsedAmount = isNaN(rawAmount) ? 0 : rawAmount;
  } else if (rawAmount) {
    const cleaned = String(rawAmount).replace(/[^0-9.-]/g, '');
    parsedAmount = parseFloat(cleaned) || 0;
  }

  if (parsedAmount === 0 && (data.basePrice || data.pricePerPerson)) {
    const unitPrice =
      typeof data.pricePerPerson === 'number'
        ? data.pricePerPerson
        : parseFloat(String(data.pricePerPerson || 0).replace(/[^0-9.-]/g, '')) || (Number(data.basePrice) || 0);
    const travelers = Number(data.totalTravelers) || (Number(data.adults) || 1) + (Number(data.children) || 0);
    const discount = Number(data.discount) || 0;
    parsedAmount = Math.max(0, unitPrice * travelers - discount);
  }

  const pStatus = String(data.paymentStatus || '').toLowerCase().trim();
  const bStatus = String(data.bookingStatus || '').toLowerCase().trim();

  let resolvedPaymentStatus: PaymentStatus = 'paid';
  if (pStatus === 'refunded' || bStatus === 'cancelled') {
    resolvedPaymentStatus = pStatus === 'refunded' ? 'refunded' : 'failed';
  } else if (pStatus === 'paid' || pStatus === 'success' || pStatus === 'completed' || bStatus === 'confirmed') {
    resolvedPaymentStatus = 'paid';
  }

  let resolvedBookingStatus: BookingStatus = 'confirmed';
  if (bStatus === 'cancelled') resolvedBookingStatus = 'cancelled';
  else if (bStatus === 'rescheduled') resolvedBookingStatus = 'rescheduled';
  else if (bStatus === 'completed') resolvedBookingStatus = 'completed';
  else if (bStatus === 'pending_confirmation') resolvedBookingStatus = 'pending_confirmation';

  return {
    ...data,
    id,
    bookingReference: data.bookingReference || `LT-${id.substring(0, 6).toUpperCase()}`,
    totalAmount: parsedAmount,
    amountPaid: parsedAmount,
    finalAmount: parsedAmount,
    paymentStatus: resolvedPaymentStatus,
    bookingStatus: resolvedBookingStatus,
    totalTravelers: Number(data.totalTravelers) || (Number(data.adults) || 1) + (Number(data.children) || 0),
    adults: Number(data.adults) || 1,
    children: Number(data.children) || 0,
    discount: Number(data.discount) || 0,
    transportAmount: Number(data.transportAmount) || 0,
    facilitiesAmount: Number(data.facilitiesAmount) || 0,
    discountAmount: Number(data.discountAmount ?? data.discount) || 0,
    facilities: Array.isArray(data.facilities) ? data.facilities : [],
    transportMode: data.transportMode || undefined,
    transportClass: data.transportClass || undefined,
    tripType: data.tripType || undefined,
    departureCity: data.departureCity || undefined,
    paidAt: data.paidAt || data.createdAt || new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
}

export function subscribeToAllBookings(callback: (bookings: Booking[]) => void): () => void {
  const colRef = collection(db, BOOKINGS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const bookings = snapshot.docs.map(d => normalizeBooking(d.data(), d.id));
      bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(bookings);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, BOOKINGS_COLLECTION);
    }
  );
}

export async function updateBookingStatus(
  bookingId: string,
  updates: {
    bookingStatus?: BookingStatus;
    paymentStatus?: PaymentStatus;
    travelDate?: string;
    timeSlot?: string;
    cancellationReason?: string;
    refundAmount?: number;
    specialRequests?: string;
  }
): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${bookingId}`;
  try {
    await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToAllPayments(callback: (payments: PaymentRecord[]) => void): () => void {
  const colRef = collection(db, PAYMENTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const payments = snapshot.docs.map(d => {
        const data = d.data();
        let rawAmount = data.amount;
        let parsedAmount = 0;
        if (typeof rawAmount === 'number') {
          parsedAmount = isNaN(rawAmount) ? 0 : rawAmount;
        } else if (rawAmount) {
          parsedAmount = parseFloat(String(rawAmount).replace(/[^0-9.-]/g, '')) || 0;
        }
        return {
          ...data,
          id: d.id,
          amount: parsedAmount,
          status: data.status || 'success'
        } as PaymentRecord;
      });
      payments.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(payments);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, PAYMENTS_COLLECTION);
    }
  );
}

export async function issueRefund(paymentId: string, bookingId: string, refundAmount: number): Promise<void> {
  try {
    await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentId), {
      status: 'refunded'
    });
    await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
      paymentStatus: 'refunded',
      refundAmount,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PAYMENTS_COLLECTION}/${paymentId}`);
  }
}

// Users and Profile Services
export async function syncUserProfile(user: { uid: string; email: string | null; displayName: string | null; photoURL?: string | null }): Promise<UserProfile> {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const now = new Date().toISOString();
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || 'traveler@letstravel.com',
        displayName: user.displayName || 'Traveler',
        photoURL: user.photoURL || undefined,
        totalTripsBooked: 0,
        totalSpent: 0,
        createdAt: now,
        updatedAt: now
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
    return snap.data() as UserProfile;
  } catch (error) {
    console.warn('Sync profile fallback:', error);
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Traveler',
      totalTripsBooked: 0,
      totalSpent: 0,
      createdAt: now,
      updatedAt: now
    };
  }
}

export function subscribeToAllUsers(callback: (users: UserProfile[]) => void): () => void {
  const colRef = collection(db, USERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const users = snapshot.docs.map(d => ({ ...d.data() } as UserProfile));
      callback(users);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, USERS_COLLECTION);
    }
  );
}

// Admin Users Services
export function subscribeToAdmins(callback: (admins: AdminUser[]) => void): () => void {
  const colRef = collection(db, ADMINS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback(PRESET_ADMINS);
      } else {
        const admins = snapshot.docs.map(d => ({ ...d.data() } as AdminUser));
        callback(admins);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, ADMINS_COLLECTION);
    }
  );
}

// Emergency Services & SOS Logs
const EMERGENCY_COLLECTION = 'emergency_requests';

export async function submitEmergencyRequest(data: {
  travelerName: string;
  phone: string;
  location: string;
  serviceType: string;
  notes: string;
}): Promise<string> {
  const ref = doc(collection(db, EMERGENCY_COLLECTION));
  try {
    await setDoc(ref, {
      id: ref.id,
      ...data,
      status: 'open',
      createdAt: new Date().toISOString()
    });
    return ref.id;
  } catch (err) {
    console.warn('Emergency logged locally:', err);
    return ref.id;
  }
}

export function subscribeToEmergencyRequests(callback: (requests: any[]) => void): () => void {
  const colRef = collection(db, EMERGENCY_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const requests = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(requests);
    },
    (error) => {
      console.warn('Emergency subscribe note:', error);
      callback([]);
    }
  );
}

export async function updateEmergencyStatus(id: string, status: 'open' | 'dispatched' | 'resolved'): Promise<void> {
  try {
    await updateDoc(doc(db, EMERGENCY_COLLECTION, id), { status });
  } catch (err) {
    console.warn('Update emergency error:', err);
  }
}

