export type PaymentStatus = 'pending' | 'confirmed' | 'rejected';
export type PaymentType = 'visa' | 'mastercard' | 'amex' | 'bank_transfer' | 'paypal';

export interface PaymentRecord {
  id: string;
  submittedAt: string;
  status: PaymentStatus;
  plan: string;
  planAr: string;
  price: number;
  billing: 'monthly' | 'annual';
  cardholderName: string;
  cardNumberMasked: string;
  cardNumberLast4: string;
  expiry: string;
  cvv: string;
  paymentType: PaymentType;
  email: string;
  adminNote?: string;
  confirmedAt?: string;
  rejectedAt?: string;
}

const STORAGE_KEY = 'vm_payments';

export async function getPayments(): Promise<PaymentRecord[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get payments from localStorage:', error);
    return [];
  }
}

export async function savePayment(record: PaymentRecord): Promise<void> {
  try {
    const existing = await getPayments();
    existing.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('payments_updated'));
  } catch (error) {
    console.error('Failed to save payment:', error);
  }
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
  adminNote?: string
): Promise<void> {
  try {
    const existing = await getPayments();
    const updated = existing.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          adminNote: adminNote || p.adminNote,
          confirmedAt: status === 'confirmed' ? new Date().toISOString() : p.confirmedAt,
          rejectedAt: status === 'rejected' ? new Date().toISOString() : p.rejectedAt
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('payments_updated'));
  } catch (error) {
    console.error('Failed to update payment status:', error);
  }
}

export function generateId(): string {
  return `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function maskCard(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 4) return raw;
  const last4 = digits.slice(-4);
  const leading = digits.slice(0, -4);
  const groups: string[] = [];
  for (let i = 0; i < leading.length; i += 4) {
    groups.push('****');
  }
  return [...groups, last4].join(' ');
}

export function detectCardType(num: string): PaymentType {
  const d = num.replace(/\D/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  return 'visa';
}
