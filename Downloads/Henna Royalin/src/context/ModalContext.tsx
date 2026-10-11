import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PremiumAlertModal, { OrderSuccessData } from '../components/ui/PremiumAlertModal';

export interface AlertOptions {
  title?: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'order_success';
  primaryButtonText?: string;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'info' | 'error';
}

export interface PromptOptions {
  title?: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  quickOptions?: string[];
}

export interface ModalContextValue {
  showAlert: (options: AlertOptions | string) => Promise<void>;
  showOrderSuccess: (orderData: OrderSuccessData, title?: string) => Promise<void>;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  showPrompt: (options: PromptOptions) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'warning' | 'error' | 'info' | 'order_success';
    title: string;
    message?: string;
    orderData?: OrderSuccessData | null;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    isConfirm?: boolean;
    isPrompt?: boolean;
    promptValue?: string;
    promptPlaceholder?: string;
    quickOptions?: string[];
    resolvePromise?: (val: any) => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
  });

  const closeModal = useCallback((result?: any) => {
    setModalState(prev => {
      if (prev.resolvePromise) {
        prev.resolvePromise(result);
      }
      return { ...prev, isOpen: false, resolvePromise: undefined };
    });
  }, []);

  const showAlert = useCallback((options: AlertOptions | string): Promise<void> => {
    return new Promise(resolve => {
      if (typeof options === 'string') {
        // Auto parse if message matches Order format
        if (options.includes('Order ') && (options.includes('Tracking Code:') || options.includes('Customer:'))) {
          // Extract order fields from text
          const orderIdMatch = options.match(/Order\s+([A-Z0-9-]+)/i);
          const trackingMatch = options.match(/Tracking\s*(?:Code)?:?\s*([A-Z0-9]+)/i);
          const customerMatch = options.match(/Customer:?\s*([^\n\r]+)/i);
          const phoneMatch = options.match(/Phone:?\s*([^\n\r]+)/i);
          const totalMatch = options.match(/Total\s*(?:Payable)?:?\s*৳?([0-9,]+)/i);

          const parsedOrder: OrderSuccessData = {
            orderId: orderIdMatch ? orderIdMatch[1] : 'HR-ORDER',
            trackingCode: trackingMatch ? trackingMatch[1] : undefined,
            customerName: customerMatch ? customerMatch[1].trim() : 'Valued Client',
            customerPhone: phoneMatch ? phoneMatch[1].trim() : '01700000000',
            total: totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : 0,
          };

          setModalState({
            isOpen: true,
            type: 'order_success',
            title: 'Order Successfully Created & Dispatched!',
            message: options.split('\n\n')[0] || 'Order has been recorded in inventory and Steadfast Courier.',
            orderData: parsedOrder,
            primaryButtonText: 'Done / Continue',
            resolvePromise: resolve,
          });
          return;
        }

        setModalState({
          isOpen: true,
          type: 'info',
          title: 'Henna Royalin Notification',
          message: options,
          primaryButtonText: 'OK / Continue',
          resolvePromise: resolve,
        });
      } else {
        setModalState({
          isOpen: true,
          type: options.type || 'info',
          title: options.title || (options.type === 'error' ? 'Attention Needed' : options.type === 'warning' ? 'Notice' : 'Henna Royalin Notification'),
          message: options.message,
          primaryButtonText: options.primaryButtonText || 'OK / Continue',
          resolvePromise: resolve,
        });
      }
    });
  }, []);

  const showOrderSuccess = useCallback((orderData: OrderSuccessData, title?: string): Promise<void> => {
    return new Promise(resolve => {
      setModalState({
        isOpen: true,
        type: 'order_success',
        title: title || 'Order Successfully Created & Dispatched!',
        message: 'The order has been registered in the system, stock deducted from inventory, and booked with Steadfast Courier.',
        orderData,
        primaryButtonText: 'Done / Continue',
        resolvePromise: resolve,
      });
    });
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setModalState({
        isOpen: true,
        type: options.type || 'warning',
        title: options.title || 'Please Confirm',
        message: options.message,
        isConfirm: true,
        primaryButtonText: options.confirmText || 'Confirm & Proceed',
        secondaryButtonText: options.cancelText || 'Cancel',
        resolvePromise: resolve,
      });
    });
  }, []);

  const showPrompt = useCallback((options: PromptOptions): Promise<string | null> => {
    return new Promise(resolve => {
      setModalState({
        isOpen: true,
        type: 'info',
        title: options.title || 'Information Required',
        message: options.message,
        isPrompt: true,
        promptValue: options.defaultValue || '',
        promptPlaceholder: options.placeholder || 'Type here...',
        quickOptions: options.quickOptions,
        primaryButtonText: options.confirmText || 'Submit',
        secondaryButtonText: options.cancelText || 'Cancel',
        resolvePromise: resolve,
      });
    });
  }, []);

  // Global override for native browser alert, confirm, prompt
  useEffect(() => {
    const originalAlert = window.alert;

    window.alert = (msg?: any) => {
      showAlert(String(msg ?? ''));
    };

    return () => {
      window.alert = originalAlert;
    };
  }, [showAlert]);

  return (
    <ModalContext.Provider value={{ showAlert, showOrderSuccess, showConfirm, showPrompt }}>
      {children}

      <PremiumAlertModal
        isOpen={modalState.isOpen}
        onClose={() => closeModal(modalState.isConfirm ? false : modalState.isPrompt ? null : undefined)}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        orderData={modalState.orderData}
        primaryButtonText={modalState.primaryButtonText}
        secondaryButtonText={modalState.secondaryButtonText}
        isConfirm={modalState.isConfirm}
        isPrompt={modalState.isPrompt}
        promptPlaceholder={modalState.promptPlaceholder}
        defaultValue={modalState.promptValue}
        quickOptions={modalState.quickOptions}
        onConfirmPrompt={(value) => closeModal(value)}
        onConfirm={() => closeModal(true)}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
