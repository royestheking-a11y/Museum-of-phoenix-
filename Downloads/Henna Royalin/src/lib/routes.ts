export type Page =
  | 'dashboard'
  | 'pos'
  | 'order'
  | 'orders'
  | 'customers'
  | 'product'
  | 'products'
  | 'stock'
  | 'production'
  | 'production-capacity'
  | 'inventory'
  | 'payment'
  | 'payments'
  | 'employees'
  | 'payroll'
  | 'staff'
  | 'roles'
  | 'users-roles'
  | 'report'
  | 'reports'
  | 'analytics'
  | 'steadfast'
  | 'settings';

export const ROUTE_MAP: Record<string, Page> = {
  '': 'dashboard',
  'dashboard': 'dashboard',
  'pos': 'pos',
  'order': 'orders',
  'orders': 'orders',
  'customer': 'customers',
  'customers': 'customers',
  'product': 'products',
  'products': 'products',
  'stock': 'stock',
  'production': 'production',
  'production-capacity': 'production',
  'inventory': 'inventory',
  'payment': 'payments',
  'payments': 'payments',
  'employee': 'employees',
  'employees': 'employees',
  'payroll': 'employees',
  'staff': 'staff',
  'role': 'staff',
  'roles': 'staff',
  'users-roles': 'staff',
  'report': 'reports',
  'reports': 'reports',
  'analytic': 'analytics',
  'analytics': 'analytics',
  'steadfast': 'steadfast',
  'setting': 'settings',
  'settings': 'settings',
};

export const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard | Henna Royalin',
  pos: 'POS Terminal | Henna Royalin',
  orders: 'Orders & Invoices | Henna Royalin',
  order: 'Orders & Invoices | Henna Royalin',
  customers: 'Customer Directory | Henna Royalin',
  products: 'Products & Catalog | Henna Royalin',
  product: 'Products & Catalog | Henna Royalin',
  stock: 'Stock & Inventory | Henna Royalin',
  production: 'Production Capacity | Henna Royalin',
  'production-capacity': 'Production Capacity | Henna Royalin',
  inventory: 'Raw Materials Inventory | Henna Royalin',
  payments: 'Payments & COD Ledger | Henna Royalin',
  payment: 'Payments & COD Ledger | Henna Royalin',
  employees: 'Employee & Salary Management | Henna Royalin',
  payroll: 'Employee & Salary Management | Henna Royalin',
  staff: 'Staff & Role Permissions | Henna Royalin',
  roles: 'Staff & Role Permissions | Henna Royalin',
  'users-roles': 'Staff & Role Permissions | Henna Royalin',
  reports: 'Batch Reports & Analytics | Henna Royalin',
  report: 'Batch Reports & Analytics | Henna Royalin',
  analytics: 'Profit & Loss Analytics | Henna Royalin',
  steadfast: 'Steadfast Courier Delivery | Henna Royalin',
  settings: 'Store & API Settings | Henna Royalin',
};

/**
 * Returns the canonical clean URL path for a page (e.g. '/orders', '/stock', '/')
 */
export function getCanonicalPath(page: string): string {
  const p = (page || '').toLowerCase().trim();
  if (p === 'dashboard' || p === '') return '/';
  if (p === 'order') return '/orders';
  if (p === 'product') return '/products';
  if (p === 'customer') return '/customers';
  if (p === 'payment') return '/payments';
  if (p === 'payroll') return '/employees';
  if (p === 'roles' || p === 'users-roles') return '/staff';
  if (p === 'production-capacity') return '/production';
  if (p === 'report') return '/reports';
  return `/${p}`;
}

/**
 * Resolves current Page from window.location (supporting both path and hash)
 */
export function getPageFromLocation(): Page {
  if (typeof window === 'undefined') return 'dashboard';

  // 1. Check hash route (e.g. #/orders or #stock)
  const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].split('/')[0].toLowerCase().trim();
  if (rawHash && ROUTE_MAP[rawHash]) {
    return ROUTE_MAP[rawHash];
  }

  // 2. Check pathname route (e.g. /orders or /stock)
  const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
  // If deployed in a subdirectory or direct path
  const lastPart = (pathParts[pathParts.length - 1] || '').toLowerCase().trim();
  if (lastPart && ROUTE_MAP[lastPart]) {
    return ROUTE_MAP[lastPart];
  }

  const firstPart = (pathParts[0] || '').toLowerCase().trim();
  if (firstPart && ROUTE_MAP[firstPart]) {
    return ROUTE_MAP[firstPart];
  }

  return 'dashboard';
}

/**
 * Push or replace browser history and update document title
 */
export function syncLocation(page: string, replace = false): void {
  if (typeof window === 'undefined') return;

  const targetPath = getCanonicalPath(page);
  const title = PAGE_TITLES[page] || 'Henna Royalin - Enterprise Management Suite';

  document.title = title;

  const currentPath = window.location.pathname;
  if (currentPath !== targetPath) {
    if (replace) {
      window.history.replaceState({ page }, '', targetPath);
    } else {
      window.history.pushState({ page }, '', targetPath);
    }
  }
}
