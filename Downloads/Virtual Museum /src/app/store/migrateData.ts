const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';
import { PaymentRecord } from '../utils/paymentStore';
import { Message } from '../utils/messageStore';

export const migrateLocalDataToMongo = async () => {
  try {
    const hasMigrated = localStorage.getItem('phoenix_migrated');
    if (hasMigrated === 'true') return;

    console.log('Migrating local data to MongoDB...');

    // Migrate Payments
    const localPayments = localStorage.getItem('phoenix_payments');
    if (localPayments) {
      const payments: PaymentRecord[] = JSON.parse(localPayments);
      for (const p of payments) {
        await fetch(`${API_BASE_URL}/api/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p)
        });
      }
    }

    // Migrate Messages
    const localMessages = localStorage.getItem('phoenix_messages');
    if (localMessages) {
      const messages: Message[] = JSON.parse(localMessages);
      for (const m of messages) {
        await fetch(`${API_BASE_URL}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(m)
        });
      }
    }

    localStorage.setItem('phoenix_migrated', 'true');
    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
