import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { firestore, auth } from './firebase';
import { ensureFirebaseAuth } from './auth';

export interface CloudStatus {
  connected: boolean;
  status: 'connected' | 'syncing' | 'offline' | 'error';
  region: string;
  projectId: string;
  lastSyncedAt: string;
  error?: string;
}

const SYNCED_COLLECTIONS = [
  'orders',
  'products',
  'customers',
  'inventory',
  'productionBatches',
  'bookings',
  'services',
  'payments',
  'expenses',
  'employees',
  'salaryPayments',
  'staff',
  'notifications',
  'coneRecipes',
  'rawMaterialLogs',
  'settings'
] as const;

type SyncedCollection = typeof SYNCED_COLLECTIONS[number];

let cloudStatus: CloudStatus = {
  connected: true,
  status: 'connected',
  region: 'asia-south2',
  projectId: 'henna-royalin',
  lastSyncedAt: new Date().toISOString()
};

const statusListeners: Set<(s: CloudStatus) => void> = new Set();

function updateStatus(updates: Partial<CloudStatus>) {
  cloudStatus = { ...cloudStatus, ...updates, lastSyncedAt: new Date().toISOString() };
  statusListeners.forEach(fn => fn(cloudStatus));
}

export function subscribeCloudStatus(fn: (s: CloudStatus) => void): () => void {
  statusListeners.add(fn);
  fn(cloudStatus);
  return () => { statusListeners.delete(fn); };
}

export function getCloudStatus(): CloudStatus {
  return cloudStatus;
}

// Background sync for a single document
export async function syncDocToCloud(colName: string, docId: string, data: any): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    updateStatus({ status: 'syncing' });
    await ensureFirebaseAuth();
    const cleanId = String(docId || data.id || Date.now());
    const docRef = doc(firestore, colName, cleanId);
    // Sanitize data (remove undefined)
    const sanitized = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, sanitized, { merge: true });
    updateStatus({ connected: true, status: 'connected', error: undefined });
  } catch (err: any) {
    console.warn(`Firestore sync warning for ${colName}/${docId}:`, err?.message || err);
    updateStatus({ status: 'error', error: err?.message || 'Sync failed' });
  }
}

// Background deletion for a single document
export async function deleteDocFromCloud(colName: string, docId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    updateStatus({ status: 'syncing' });
    await ensureFirebaseAuth();
    const cleanId = String(docId);
    const docRef = doc(firestore, colName, cleanId);
    await deleteDoc(docRef);
    updateStatus({ connected: true, status: 'connected', error: undefined });
  } catch (err: any) {
    console.warn(`Firestore delete warning for ${colName}/${docId}:`, err?.message || err);
  }
}

// Full sync: Push all local storage collections to Cloud Firestore
export async function syncAllLocalToCloud(getLocalCollection: (key: string) => any[]): Promise<number> {
  if (typeof window === 'undefined') return 0;
  let totalSynced = 0;
  try {
    updateStatus({ status: 'syncing' });
    await ensureFirebaseAuth();
    for (const col of SYNCED_COLLECTIONS) {
      if (col === 'settings') {
        try {
          const raw = localStorage.getItem('hr_settings');
          if (raw) {
            const parsed = JSON.parse(raw);
            const docRef = doc(firestore, 'settings', 'app_config');
            await setDoc(docRef, { ...parsed, id: 'app_config' }, { merge: true });
            totalSynced++;
          }
        } catch {}
        continue;
      }
      const items = getLocalCollection(col) || [];
      for (const item of items) {
        const id = String(item.id || item.orderId || item.batchId || item.employeeId || item.voucherNo || Date.now());
        const docRef = doc(firestore, col, id);
        const sanitized = JSON.parse(JSON.stringify(item));
        await setDoc(docRef, sanitized, { merge: true });
        totalSynced++;
      }
    }
    updateStatus({ connected: true, status: 'connected', error: undefined });
    return totalSynced;
  } catch (err: any) {
    console.error('Error syncing all collections to Firestore:', err);
    updateStatus({ status: 'error', error: err?.message || 'Full sync failed' });
    throw err;
  }
}

// Clear all operational collections from Cloud Firestore
export async function clearAllCloudData(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  let totalDeleted = 0;
  try {
    updateStatus({ status: 'syncing' });
    await ensureFirebaseAuth();
    for (const col of SYNCED_COLLECTIONS) {
      if (col === 'settings') continue; // Preserve store configuration
      const colRef = collection(firestore, col);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) continue;
      const batch = writeBatch(firestore);
      snapshot.forEach(docSnap => {
        batch.delete(docSnap.ref);
        totalDeleted++;
      });
      await batch.commit();
    }
    updateStatus({ connected: true, status: 'connected', error: undefined });
    return totalDeleted;
  } catch (err: any) {
    console.error('Error clearing Cloud Firestore collections:', err);
    updateStatus({ status: 'error', error: err?.message || 'Clear cloud data failed' });
    throw err;
  }
}

export type RealtimeChangeEvent =
  | { type: 'upsert'; colName: string; item: any }
  | { type: 'delete'; colName: string; docId: string };

// Initialize real-time cloud listeners
let isInitialized = false;
let activeUnsubscribers: (() => void)[] = [];

export function initFirestoreRealtimeSync(onChange: (event: RealtimeChangeEvent) => void): void {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // Handle browser online / offline network state
  window.addEventListener('online', () => {
    updateStatus({ connected: true, status: 'connected', error: undefined });
  });
  window.addEventListener('offline', () => {
    updateStatus({ connected: false, status: 'offline', error: 'No internet connection' });
  });

  const setupListeners = (user: User) => {
    // Teardown previous listeners if any
    activeUnsubscribers.forEach(unsub => {
      try { unsub(); } catch {}
    });
    activeUnsubscribers = [];

    let hasReceivedInitialData = false;

    SYNCED_COLLECTIONS.forEach(colName => {
      try {
        const colRef = collection(firestore, colName);
        const unsub = onSnapshot(
          colRef,
          (snapshot) => {
            snapshot.docChanges().forEach(change => {
              if (change.type === 'removed') {
                onChange({ type: 'delete', colName, docId: change.doc.id });
              } else {
                onChange({
                  type: 'upsert',
                  colName,
                  item: { ...change.doc.data(), id: change.doc.id }
                });
              }
            });
            if (!hasReceivedInitialData) {
              hasReceivedInitialData = true;
              updateStatus({ connected: true, status: 'connected', error: undefined });
            }
          },
          (error) => {
            console.warn(`Firestore onSnapshot notice for ${colName}:`, error.message);
            // If network or permission error, handle gracefully
            if (error.code === 'permission-denied') {
              // Attempt to refresh auth session once
              ensureFirebaseAuth().catch(() => {});
            } else if (!navigator.onLine) {
              updateStatus({ connected: false, status: 'offline', error: 'Offline' });
            }
          }
        );
        activeUnsubscribers.push(unsub);
      } catch (e: any) {
        console.warn(`Could not attach listener for ${colName}:`, e?.message);
      }
    });

    updateStatus({ connected: true, status: 'connected', error: undefined });
  };

  // Watch Firebase Auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setupListeners(user);
    } else {
      // Clean up listeners on logout
      activeUnsubscribers.forEach(unsub => {
        try { unsub(); } catch {}
      });
      activeUnsubscribers = [];
      updateStatus({ connected: false, status: 'offline', error: 'Authentication required' });
    }
  });

  // Kickstart auth check on load
  ensureFirebaseAuth().then((u) => {
    if (u) setupListeners(u);
  }).catch(() => {});
}

