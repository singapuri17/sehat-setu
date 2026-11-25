// Firebase authentication service for doctor login
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

// ─── Authentication Functions ─────────────────────────────────────────────────

/**
 * Sign in doctor with email and password
 */
export async function signInDoctor(
  email: string,
  password: string
): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    
    // User-friendly error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later');
    }
    
    throw new Error('Failed to sign in. Please try again');
  }
}

/**
 * Sign out current doctor
 */
export async function signOutDoctor(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Create a new doctor account (for initial setup)
 */
export async function createDoctorAccount(
  email: string,
  password: string
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error('Error creating account:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    
    throw new Error('Failed to create account');
  }
}

/**
 * Listen to authentication state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

// ─── Demo Credentials (for development) ───────────────────────────────────────

export const DEMO_DOCTOR_CREDENTIALS = {
  email: 'doctor@mediease.demo',
  password: 'doctor123',
  name: 'Dr. Priya Sharma',
  department: 'General Medicine',
};

/**
 * Note: Create this demo account in Firebase Console:
 * 1. Go to Authentication → Users
 * 2. Click "Add User"
 * 3. Use the email and password from DEMO_DOCTOR_CREDENTIALS
 * 
 * Or run this function once to create the demo account programmatically
 */
export async function createDemoDoctor(): Promise<void> {
  try {
    await createDoctorAccount(
      DEMO_DOCTOR_CREDENTIALS.email,
      DEMO_DOCTOR_CREDENTIALS.password
    );
    console.log('✅ Demo doctor account created successfully');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Demo doctor account already exists');
    } else {
      console.error('❌ Failed to create demo doctor account:', error);
    }
  }
}
