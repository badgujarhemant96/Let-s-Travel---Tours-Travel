import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { AdminUser, UserProfile } from '../types/travel';
import { AUTHORIZED_ADMIN_ACCOUNTS, PRESET_ADMINS, AuthorizedAdminAccount } from '../data/seedDestinations';
import { syncUserProfile } from '../services/travelService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (identifier: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginAsStaffAdmin: (accountIndex?: number) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Match any of the 4 authorized administrators by email or username
  const matchAdmin = (emailOrUsername?: string | null): AdminUser | null => {
    if (!emailOrUsername) return null;
    const lower = emailOrUsername.toLowerCase().trim();

    const matchedAccount = AUTHORIZED_ADMIN_ACCOUNTS.find(
      (a) =>
        a.email.toLowerCase() === lower ||
        a.username.toLowerCase() === lower ||
        a.displayName.toLowerCase() === lower ||
        (a.aliases && a.aliases.some((al) => al.toLowerCase() === lower))
    );

    if (matchedAccount) {
      return {
        uid: `admin-${matchedAccount.username.toLowerCase().replace(/\s+/g, '-')}`,
        username: matchedAccount.username,
        email: matchedAccount.email,
        displayName: matchedAccount.displayName,
        role: matchedAccount.role,
        roleTitle: matchedAccount.roleTitle,
        permissions: ['manage_destinations', 'manage_bookings', 'manage_payments', 'manage_users', 'manage_content'],
        isActive: true
      };
    }

    return null;
  };

  // Restore session from localStorage if saved
  useEffect(() => {
    const savedUserSession = localStorage.getItem('lets_travel_active_user');
    if (savedUserSession) {
      try {
        const parsed = JSON.parse(savedUserSession);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
          setUserProfile({
            uid: parsed.uid,
            email: parsed.email,
            displayName: parsed.displayName,
            totalTripsBooked: parsed.totalTripsBooked || 1,
            totalSpent: parsed.totalSpent || 24999,
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          const admin = matchAdmin(parsed.email);
          setAdminProfile(admin);
        }
      } catch (err) {
        console.warn('Session parse note:', err);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await syncUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
          setUserProfile(profile);
        } catch (err) {
          console.error('Failed to sync profile', err);
        }

        const adminMatch = matchAdmin(user.email);
        setAdminProfile(adminMatch);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      const adminMatch = matchAdmin(result.user.email);
      setAdminProfile(adminMatch);
    }
  };

  // Support login via Username OR Email for all authorized personnel + regular Firebase accounts
  const signInWithEmail = async (identifier: string, pass: string) => {
    const normalizedId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check if the identifier matches one of the 4 configured accounts:
    // 1. Badgujar hemant (256128307001)
    // 2. Mukesh Sharma (246120307068)
    // 3. Riken Raval (246120307066)
    // 4. Chandan Yadav (246120307077)
    const matchedAccount = AUTHORIZED_ADMIN_ACCOUNTS.find((acc) => {
      const matchName =
        acc.username.toLowerCase() === normalizedId ||
        acc.displayName.toLowerCase() === normalizedId ||
        acc.email.toLowerCase() === normalizedId ||
        (acc.aliases && acc.aliases.some((al) => al.toLowerCase() === normalizedId));
      return matchName;
    });

    if (matchedAccount) {
      if (matchedAccount.passwordHash !== cleanPass) {
        throw new Error('Incorrect password. Please verify your password and try again.');
      }

      // Successful login for authorized personnel!
      const userObj = {
        uid: `user-${matchedAccount.username.toLowerCase().replace(/\s+/g, '-')}`,
        email: matchedAccount.email,
        displayName: matchedAccount.displayName,
        emailVerified: true
      } as unknown as User;

      setCurrentUser(userObj);

      const profileObj: UserProfile = {
        uid: userObj.uid,
        email: matchedAccount.email,
        displayName: matchedAccount.displayName,
        phone: '+91 98201 44892',
        totalTripsBooked: 2,
        totalSpent: 48500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setUserProfile(profileObj);

      const adminObj: AdminUser = {
        uid: userObj.uid,
        username: matchedAccount.username,
        email: matchedAccount.email,
        displayName: matchedAccount.displayName,
        role: matchedAccount.role,
        roleTitle: matchedAccount.roleTitle,
        permissions: ['manage_destinations', 'manage_bookings', 'manage_payments', 'manage_users', 'manage_content'],
        isActive: true
      };

      setAdminProfile(adminObj);

      // Save session
      localStorage.setItem('lets_travel_active_user', JSON.stringify({
        uid: userObj.uid,
        email: matchedAccount.email,
        displayName: matchedAccount.displayName
      }));
      sessionStorage.setItem('lets_travel_admin_user', JSON.stringify(matchedAccount));
      return;
    }

    // Otherwise, authenticate via Firebase email/password
    try {
      const result = await signInWithEmailAndPassword(auth, identifier.trim(), cleanPass);
      if (result.user) {
        const adminMatch = matchAdmin(result.user.email);
        setAdminProfile(adminMatch);
      }
    } catch (err: any) {
      // If user is not found in Firebase, provide clear friendly message
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        throw new Error('Account not found. Please check your username/email or create a new account.');
      } else if (err?.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      }
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), pass.trim());
    if (result.user) {
      await updateProfile(result.user, { displayName: name.trim() });
      const profile = await syncUserProfile({
        uid: result.user.uid,
        email: result.user.email,
        displayName: name.trim()
      });
      setUserProfile(profile);
      const adminMatch = matchAdmin(result.user.email);
      setAdminProfile(adminMatch);
    }
  };

  const loginAsStaffAdmin = (accountIndex = 0) => {
    const account = AUTHORIZED_ADMIN_ACCOUNTS[accountIndex] || AUTHORIZED_ADMIN_ACCOUNTS[0];
    const admin: AdminUser = {
      uid: `admin-${account.username.toLowerCase().replace(/\s+/g, '-')}`,
      username: account.username,
      email: account.email,
      displayName: account.displayName,
      role: account.role,
      roleTitle: account.roleTitle,
      permissions: ['manage_destinations', 'manage_bookings', 'manage_payments', 'manage_users', 'manage_content'],
      isActive: true
    };

    setAdminProfile(admin);
    const mockUser = {
      uid: admin.uid,
      email: admin.email,
      displayName: admin.displayName,
      emailVerified: true
    } as unknown as User;

    setCurrentUser(mockUser);
    setUserProfile({
      uid: admin.uid,
      email: admin.email,
      displayName: admin.displayName,
      phone: '+91 98201 44892',
      totalTripsBooked: 2,
      totalSpent: 48500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    localStorage.setItem('lets_travel_active_user', JSON.stringify({
      uid: mockUser.uid,
      email: admin.email,
      displayName: admin.displayName
    }));
    sessionStorage.setItem('lets_travel_admin_user', JSON.stringify(account));
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Signout note:', err);
    }
    localStorage.removeItem('lets_travel_active_user');
    sessionStorage.removeItem('lets_travel_admin_user');
    setCurrentUser(null);
    setUserProfile(null);
    setAdminProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        adminProfile,
        isAdmin: !!adminProfile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        loginAsStaffAdmin,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
