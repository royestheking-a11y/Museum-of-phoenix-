import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

// ── Sign in with email + password ──────────────────────────────────────────
export async function signIn(email: string, password: string): Promise<User> {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

// ── Ensure Firebase Auth session for Firestore Cloud Sync ─────────────
export async function ensureFirebaseAuth(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    await setPersistence(auth, browserLocalPersistence);
    return new Promise<User | null>((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user);
      });
    });
  } catch (err: any) {
    console.warn('ensureFirebaseAuth info:', err?.message || err);
    return null;
  }
}

// ── Sign out the current user ───────────────────────────────────────────────
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// ── Send password reset email ───────────────────────────────────────────────
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

// ── Watch auth state changes (login / logout) ──────────────────────────────
export function watchAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// ── Phone OTP: invisible reCAPTCHA verifier ─────────────────────────────────
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function setupRecaptcha(containerId: string): void {
  if (recaptchaVerifier) {
    try { recaptchaVerifier.clear(); } catch {}
    recaptchaVerifier = null;
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
}

export function clearRecaptcha(): void {
  if (recaptchaVerifier) {
    try { recaptchaVerifier.clear(); } catch {}
    recaptchaVerifier = null;
  }
}

// ── Phone OTP: Send SMS code ────────────────────────────────────────────────
export async function sendOTP(phoneNumber: string): Promise<ConfirmationResult> {
  await setPersistence(auth, browserLocalPersistence);
  if (!recaptchaVerifier) throw new Error('reCAPTCHA not initialized.');
  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

// ── Phone OTP: Verify the SMS code and sign in ─────────────────────────────
export async function verifyOTP(confirmationResult: ConfirmationResult, code: string): Promise<User> {
  const credential = await confirmationResult.confirm(code.trim());
  return credential.user;
}

// ── User-friendly error messages ────────────────────────────────────────────
export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':      return 'No account found with this email address.';
    case 'auth/wrong-password':      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':       return 'Please enter a valid email address.';
    case 'auth/user-disabled':       return 'This account has been disabled. Contact the administrator.';
    case 'auth/too-many-requests':   return 'Too many failed attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed': return 'Network error. Please check your internet connection.';
    case 'auth/invalid-credential':  return 'Incorrect email or password. Please check and try again.';
    case 'auth/invalid-phone-number': return 'Invalid phone number. Use format: +880XXXXXXXXXX';
    case 'auth/invalid-verification-code': return 'Incorrect OTP code. Please check and try again.';
    case 'auth/code-expired':        return 'OTP has expired. Please request a new one.';
    case 'auth/missing-phone-number': return 'Please enter a phone number.';
    case 'auth/quota-exceeded':      return 'SMS quota exceeded. Please try again later.';
    default: return 'Sign-in failed. Please check your credentials and try again.';
  }
}
