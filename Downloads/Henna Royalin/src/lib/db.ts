// Local database using localStorage with reactive state and Cloud Firestore sync
import {
  syncDocToCloud,
  deleteDocFromCloud,
  syncAllLocalToCloud,
  clearAllCloudData,
  initFirestoreRealtimeSync,
  getCloudStatus,
  subscribeCloudStatus,
  type CloudStatus
} from './firestoreSync';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrder?: string;
  upcomingBooking?: string;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  size?: string;
  coneWeight?: number;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  lowStockLevel: number;
  supplier?: string;
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  addedAt?: string;
  addedTimeFormatted?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  duration: number;
  artist?: string;
  materialsRequired?: string[];
  status: 'active' | 'inactive';
  images?: string[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  category?: string;
  quantity: number;
  price: number;
  cost: number;
  total: number;
}

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  city?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';
  deliveryStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'failed';
  orderStatus: 'new' | 'confirmed' | 'processing' | 'ready' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  source: string;
  notes?: string;
  profit: number;
  // Steadfast Courier integration fields
  steadfastConsignmentId?: string;
  steadfastTrackingCode?: string;
  steadfastStatus?: 'pending' | 'in_review' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  steadfastFailedReason?: string;
  steadfastDispatchedAt?: string;
  // Restock tracking
  restocked?: boolean;
  restockedAt?: string;
  // Raw ingredients automatic deduction tracking
  rawIngredientsDeducted?: boolean;
  ingredientsUsed?: Array<{
    materialName: string;
    quantity: number;
    unit: string;
    cost: number;
  }>;
  materialCostTotal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  numberOfPeople: number;
  serviceId: string;
  serviceName: string;
  artistId?: string;
  artistName?: string;
  assistantRequired: boolean;
  transportRequired: boolean;
  packageTotal: number;
  advance: number;
  remaining: number;
  status: 'inquiry' | 'quote_sent' | 'tentative' | 'confirmed' | 'advance_paid' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled' | 'refunded';
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  bookingId?: string;
  amount: number;
  method: string;
  status: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';
  date: string;
  notes?: string;
}

export interface Expense {
  id: string;
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  attachment?: string;
  isRecurring?: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  skills: string[];
  availability: 'available' | 'booked' | 'on_leave' | 'unavailable';
  commission: number;
  salary: number;
  assignedBookings: string[];
  joinedAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type?: 'finished' | 'raw_material';
  category: string;
  unit: string;
  currentStock: number;
  lowStockLevel: number;
  minStockLevel?: number;
  costPerUnit: number;
  supplier?: string;
  createdAt: string;
  addedAt?: string;
  addedTimeFormatted?: string;
}

export interface ProductionBatch {
  id: string;
  batchId: string;
  date: string;
  addedAt?: string;
  addedTimeFormatted?: string;
  productId: string;
  productName: string;
  coneCategory?: string;
  coneType?: string;
  expectedOutput: number;
  actualOutput: number;
  ingredients: BatchIngredient[];
  packagingCosts: number;
  totalCost: number;
  costPerUnit: number;
  sellingPrice?: number;
  projectedProfit?: number;
  status: 'planned' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface BatchIngredient {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
}

export interface RawIngredientRate {
  id: string;
  name: string;
  unit: string;
  batchQuantity: number;
  unitRateDisplay: string;
  costPerBaseUnit: number;
  batchCost: number;
}

export interface PackagingRate {
  id: string;
  name: string;
  bulkQuantity: string;
  bulkPcs: number;
  purchasePrice: number;
  costPerCone: number;
}

export interface ConeRecipeIngredient {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
  cost: number;
}

export interface ConeRecipe {
  id: string;
  size: string;
  label: string;
  batchYieldPcs: number;
  ingredients: ConeRecipeIngredient[];
  rawMaterialSubtotal: number;
  packagingCost: number;
  wastageBuffer: number;
  totalBaseCost: number;
  recommendedPOSPreset: number;
  isDefault?: boolean;
  updatedAt?: string;
}

export interface RawMaterialStockLog {
  id: string;
  materialId: string;
  materialName: string;
  type: 'purchase_in' | 'order_deduction' | 'batch_deduction' | 'manual_adjust' | 'restock';
  quantityChange: number;
  unit: string;
  previousStock: number;
  remainingStock: number;
  unitCost?: number;
  totalCost?: number;
  referenceId?: string;
  notes?: string;
  timestamp: string;
  dateTimeFormatted: string;
}

export interface StaffMember {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Sales' | 'Production' | 'Delivery';
  phone: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  email?: string;
  designation: string;
  department: 'Production' | 'Sales & Store' | 'Packaging' | 'Logistics' | 'Management' | 'Artistry' | string;
  joiningDate: string;
  monthlySalary: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Bank Transfer' | 'Cash';
  accountNumber?: string;
  status: 'active' | 'on_leave' | 'resigned';
  createdAt: string;
}

export interface SalaryPayment {
  id: string;
  voucherNo: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  deductionReason?: string;
  netSalary: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Bank Transfer' | 'Cash';
  paymentDate: string;
  status: 'paid' | 'pending';
  notes?: string;
  createdAt: string;
}

export const DEFAULT_RAW_INGREDIENT_RATES: RawIngredientRate[] = [
  { id: 'raw_powder', name: 'Mehendi Powder', unit: 'gm', batchQuantity: 1000, unitRateDisplay: '1,200.00 / kg', costPerBaseUnit: 1.20, batchCost: 1200 },
  { id: 'raw_oil', name: 'Eucalyptus Oil', unit: 'ml', batchQuantity: 300, unitRateDisplay: '4,600.00 / L', costPerBaseUnit: 4.60, batchCost: 1380 },
  { id: 'raw_sugar', name: 'Sugar', unit: 'gm', batchQuantity: 400, unitRateDisplay: '120.00 / kg', costPerBaseUnit: 0.12, batchCost: 48 },
  { id: 'raw_lemon', name: 'Lemon Juice', unit: 'ml', batchQuantity: 300, unitRateDisplay: '250.00 / L', costPerBaseUnit: 0.25, batchCost: 75 },
  { id: 'raw_xg', name: 'Xanthan Gum (XG)', unit: 'gm', batchQuantity: 10, unitRateDisplay: '1,000.00 / kg', costPerBaseUnit: 1.00, batchCost: 10 },
];

export const DEFAULT_PACKAGING_RATES: PackagingRate[] = [
  { id: 'pkg_cello', name: 'Cello Paper', bulkQuantity: '1 Bundle (50 sheets = 600 pcs) @ 300 Tk', bulkPcs: 600, purchasePrice: 300, costPerCone: 0.50 },
  { id: 'pkg_pin', name: 'Pin', bulkQuantity: '1 Box (1,800 pcs) @ 300 Tk', bulkPcs: 1800, purchasePrice: 300, costPerCone: 0.17 },
  { id: 'pkg_sticker', name: 'Logo Sticker', bulkQuantity: '20,000 pcs @ 14,000 Tk', bulkPcs: 20000, purchasePrice: 14000, costPerCone: 0.70 },
];

export const DEFAULT_CONE_RECIPES: ConeRecipe[] = [
  {
    id: 'recipe_20g',
    size: '20gm',
    label: '20g Cone',
    batchYieldPcs: 185,
    ingredients: [
      { ingredientId: 'raw_powder', name: 'Mehendi Powder', amount: 5.41, unit: 'gm', cost: 6.49 },
      { ingredientId: 'raw_oil', name: 'Eucalyptus Oil', amount: 1.62, unit: 'ml', cost: 7.46 },
      { ingredientId: 'raw_sugar', name: 'Sugar', amount: 2.16, unit: 'gm', cost: 0.26 },
      { ingredientId: 'raw_lemon', name: 'Lemon Juice', amount: 1.62, unit: 'ml', cost: 0.41 },
      { ingredientId: 'raw_xg', name: 'Xanthan Gum (XG)', amount: 0.05, unit: 'gm', cost: 0.05 },
    ],
    rawMaterialSubtotal: 14.67,
    packagingCost: 1.37,
    wastageBuffer: 1.00,
    totalBaseCost: 17.04,
    recommendedPOSPreset: 17.10,
    isDefault: true,
  },
  {
    id: 'recipe_25g',
    size: '25gm',
    label: '25g Cone',
    batchYieldPcs: 148,
    ingredients: [
      { ingredientId: 'raw_powder', name: 'Mehendi Powder', amount: 6.76, unit: 'gm', cost: 8.11 },
      { ingredientId: 'raw_oil', name: 'Eucalyptus Oil', amount: 2.03, unit: 'ml', cost: 9.32 },
      { ingredientId: 'raw_sugar', name: 'Sugar', amount: 2.70, unit: 'gm', cost: 0.32 },
      { ingredientId: 'raw_lemon', name: 'Lemon Juice', amount: 2.03, unit: 'ml', cost: 0.51 },
      { ingredientId: 'raw_xg', name: 'Xanthan Gum (XG)', amount: 0.07, unit: 'gm', cost: 0.07 },
    ],
    rawMaterialSubtotal: 18.33,
    packagingCost: 1.37,
    wastageBuffer: 1.00,
    totalBaseCost: 20.70,
    recommendedPOSPreset: 20.70,
    isDefault: true,
  },
  {
    id: 'recipe_30g',
    size: '30gm',
    label: '30g Cone',
    batchYieldPcs: 122,
    ingredients: [
      { ingredientId: 'raw_powder', name: 'Mehendi Powder', amount: 8.20, unit: 'gm', cost: 9.84 },
      { ingredientId: 'raw_oil', name: 'Eucalyptus Oil', amount: 2.46, unit: 'ml', cost: 11.31 },
      { ingredientId: 'raw_sugar', name: 'Sugar', amount: 3.28, unit: 'gm', cost: 0.39 },
      { ingredientId: 'raw_lemon', name: 'Lemon Juice', amount: 2.46, unit: 'ml', cost: 0.61 },
      { ingredientId: 'raw_xg', name: 'Xanthan Gum (XG)', amount: 0.08, unit: 'gm', cost: 0.08 },
    ],
    rawMaterialSubtotal: 22.24,
    packagingCost: 1.37,
    wastageBuffer: 1.00,
    totalBaseCost: 24.61,
    recommendedPOSPreset: 24.70,
    isDefault: true,
  },
];

export const DEFAULT_RAW_MATERIALS: InventoryItem[] = [
  {
    id: 'rm_mehendi_powder',
    name: 'Mehendi Powder',
    category: 'Raw Ingredient',
    type: 'raw_material',
    unit: 'gm',
    currentStock: 5000,
    lowStockLevel: 1000,
    costPerUnit: 1.20,
    supplier: 'Sojat Henna Supplier (1,200 Tk/kg)',
    createdAt: '2026-01-01',
    addedAt: '2026-10-01T09:00:00.000Z',
    addedTimeFormatted: '01 Oct 2026, 09:00 AM'
  },
  {
    id: 'rm_eucalyptus_oil',
    name: 'Eucalyptus Oil',
    category: 'Raw Ingredient',
    type: 'raw_material',
    unit: 'ml',
    currentStock: 1500,
    lowStockLevel: 300,
    costPerUnit: 4.60,
    supplier: 'Essential Oils Direct (4,600 Tk/L)',
    createdAt: '2026-01-01',
    addedAt: '2026-10-01T09:00:00.000Z',
    addedTimeFormatted: '01 Oct 2026, 09:00 AM'
  },
  {
    id: 'rm_sugar',
    name: 'Sugar',
    category: 'Raw Ingredient',
    type: 'raw_material',
    unit: 'gm',
    currentStock: 2000,
    lowStockLevel: 400,
    costPerUnit: 0.12,
    supplier: 'Wholesale Grocery (120 Tk/kg)',
    createdAt: '2026-01-01',
    addedAt: '2026-10-01T09:00:00.000Z',
    addedTimeFormatted: '01 Oct 2026, 09:00 AM'
  },
  {
    id: 'rm_lemon_juice',
    name: 'Lemon Juice',
    category: 'Raw Ingredient',
    type: 'raw_material',
    unit: 'ml',
    currentStock: 1500,
    lowStockLevel: 300,
    costPerUnit: 0.25,
    supplier: 'Fresh Citrus Extract (250 Tk/L)',
    createdAt: '2026-01-01',
    addedAt: '2026-10-01T09:00:00.000Z',
    addedTimeFormatted: '01 Oct 2026, 09:00 AM'
  },
  {
    id: 'rm_xanthan_gum',
    name: 'Xanthan Gum (XG)',
    category: 'Raw Ingredient',
    type: 'raw_material',
    unit: 'gm',
    currentStock: 100,
    lowStockLevel: 20,
    costPerUnit: 1.00,
    supplier: 'Organic Stabilizers Ltd (1,000 Tk/kg)',
    createdAt: '2026-01-01',
    addedAt: '2026-10-01T09:00:00.000Z',
    addedTimeFormatted: '01 Oct 2026, 09:00 AM'
  },
  {
    id: 'rm_cello_paper',
    name: 'Cello Paper',
    category: 'Packaging Material',
    type: 'raw_material',
    unit: 'pcs',
    currentStock: 1200,
    lowStockLevel: 200,
    costPerUnit: 0.50,
    supplier: 'Packaging Mart (300 Tk / 600 pcs bundle)',
    createdAt: '2026-01-01',
    addedAt: '2026-10-01T09:00:00.000Z',
    addedTimeFormatted: '01 Oct 2026, 09:00 AM'
  },
  {
    id: 'rm_pin',
    name: 'Pin',
    category: 'Packaging Material',
    type: 'raw_material',
    unit: 'pcs',
    currentStock: 3600,
    lowStockLevel: 500,
    costPerUnit: 0.17,
    supplier: 'Stationery Wholesale (300 Tk / 1,800 pcs box)',
    createdAt: '2026-01-01',
    addedAt: '2026-10-01T09:00:00.000Z',
    addedTimeFormatted: '01 Oct 2026, 09:00 AM'
  },
  {
    id: 'rm_logo_sticker',
    name: 'Logo Sticker',
    category: 'Packaging Material',
    type: 'raw_material',
    unit: 'pcs',
    currentStock: 10000,
    lowStockLevel: 1000,
    costPerUnit: 0.70,
    supplier: 'Print Express (14,000 Tk / 20,000 pcs roll)',
    createdAt: '2026-01-01',
    addedAt: '2026-10-01T09:00:00.000Z',
    addedTimeFormatted: '01 Oct 2026, 09:00 AM'
  }
];

// Default initial data — clean slate (all demo records removed)
const INITIAL_DATA = {
  customers: [] as Customer[],
  products: [] as Product[],
  services: [] as Service[],
  orders: [] as Order[],
  bookings: [] as Booking[],
  payments: [] as Payment[],
  expenses: [] as Expense[],
  teamMembers: [] as TeamMember[],
  inventory: DEFAULT_RAW_MATERIALS,
  productionBatches: [] as ProductionBatch[],
  rawIngredientRates: DEFAULT_RAW_INGREDIENT_RATES,
  packagingRates: DEFAULT_PACKAGING_RATES,
  coneRecipes: DEFAULT_CONE_RECIPES,
  rawMaterialLogs: [] as RawMaterialStockLog[],
  staff: [
    {
      id: 'stf_001',
      name: 'Sumaiya Jabin',
      username: 'admin',
      email: 'sumaiya@hennaroyalin.com',
      password: 'admin',
      role: 'Admin' as const,
      phone: '01711-000001',
      status: 'active' as const,
      lastLogin: '',
      createdAt: '2026-01-01'
    }
  ] as StaffMember[],
  employees: [] as Employee[],
  salaryPayments: [] as SalaryPayment[],
  notifications: [] as any[]
};

// Auto-migration: Ensure all existing browser storage with demo data and stale notifications is completely cleared
const DEMO_CLEARED_VERSION = 'v6_purge_fake_notifications';
if (typeof localStorage !== 'undefined') {
  try {
    if (localStorage.getItem('hr_demo_cleared_version') !== DEMO_CLEARED_VERSION) {
      const keysToClear = [
        'customers', 'products', 'services', 'orders', 'bookings',
        'payments', 'expenses', 'teamMembers', 'inventory',
        'productionBatches', 'employees', 'salaryPayments', 'notifications'
      ];
      keysToClear.forEach(k => {
        localStorage.setItem(`hr_${k}`, JSON.stringify([]));
      });
      // Force clear any stale notification cache
      localStorage.removeItem('hr_notifications');
      localStorage.setItem('hr_notifications', JSON.stringify([]));
      // Preserve only the primary admin account
      const defaultStaff = [
        {
          id: 'stf_001',
          name: 'Sumaiya Jabin',
          username: 'admin',
          email: 'sumaiya@hennaroyalin.com',
          password: 'admin',
          role: 'Admin' as const,
          phone: '01711-000001',
          status: 'active' as const,
          lastLogin: '',
          createdAt: '2026-01-01'
        }
      ];
      localStorage.setItem('hr_staff', JSON.stringify(defaultStaff));
      localStorage.setItem('hr_current_staff', JSON.stringify(defaultStaff[0]));
      localStorage.setItem('hr_demo_cleared_version', DEMO_CLEARED_VERSION);
    }
  } catch (err) {
    console.warn('Storage clear error:', err);
  }
}

const listeners: Set<() => void> = new Set();

export function notifyListeners(): void {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Listener error in db:', e);
    }
  });
}

export function formatDateTime(dateInput?: string | Date): string {
  if (!dateInput) return '—';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getDB<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(`hr_${key}`);
    if (data) return JSON.parse(data);
    const initial = (INITIAL_DATA as any)[key];
    if (initial) {
      localStorage.setItem(`hr_${key}`, JSON.stringify(initial));
      return initial;
    }
    return [];
  } catch {
    return (INITIAL_DATA as any)[key] || [];
  }
}

function setDB<T>(key: string, data: T[]): void {
  localStorage.setItem(`hr_${key}`, JSON.stringify(data));
  notifyListeners();
}

function generateId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

// Initialize Real-time Cloud Sync with Google Cloud Firestore Native (asia-south2)
if (typeof window !== 'undefined') {
  initFirestoreRealtimeSync((action) => {
    try {
      if (action.colName === 'settings') {
        if (action.type === 'upsert') {
          localStorage.setItem('hr_settings', JSON.stringify(action.item));
        }
      } else {
        const list = getDB<any>(action.colName);
        if (action.type === 'upsert') {
          // Filter out any legacy fake/demo notification records from cloud sync
          if (action.colName === 'notifications') {
            const title = (action.item.title || '').toLowerCase();
            const desc = (action.item.description || '').toLowerCase();
            if (title.includes('demo') || desc.includes('demo') || title.includes('sample') || desc.includes('sample')) {
              return;
            }
          }
          const id = String(action.item.id || action.item.orderId || action.item.batchId || action.item.employeeId || action.item.voucherNo);
          const idx = list.findIndex(it => String(it.id || it.orderId || it.batchId || it.employeeId || it.voucherNo) === id);
          if (idx !== -1) {
            list[idx] = { ...list[idx], ...action.item };
          } else {
            list.unshift(action.item);
          }
          localStorage.setItem(`hr_${action.colName}`, JSON.stringify(list));
        } else if (action.type === 'delete') {
          const filtered = list.filter(it => String(it.id || it.orderId || it.batchId || it.employeeId || it.voucherNo) !== action.docId);
          localStorage.setItem(`hr_${action.colName}`, JSON.stringify(filtered));
        }
      }
      notifyListeners();
    } catch (e) {
      console.warn('Real-time cloud sync event error:', e);
    }
  });
}

export const db = {
  // Customers
  getCustomers: (): Customer[] => getDB<Customer>('customers'),
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const item = { ...c, id: generateId('c'), createdAt: new Date().toISOString().split('T')[0] };
    const list = getDB<Customer>('customers');
    list.push(item);
    setDB('customers', list);
    syncDocToCloud('customers', item.id, item);
    return item;
  },
  updateCustomer: (id: string, data: Partial<Customer>): void => {
    const list = getDB<Customer>('customers').map(c => c.id === id ? { ...c, ...data } : c);
    setDB('customers', list);
    const updated = list.find(c => c.id === id);
    if (updated) syncDocToCloud('customers', id, updated);
  },

  // Auto-upsert customer from order — creates new or updates existing by phone
  upsertCustomerFromOrder: (o: { customerId?: string; customerName: string; customerPhone: string; deliveryAddress?: string; city?: string; total: number; orderId: string; source?: string; createdAt: string }): void => {
    const list = getDB<Customer>('customers');
    const phone = o.customerPhone.trim();
    const idx = list.findIndex(c => c.phone === phone);
    const dateStr = o.createdAt.split('T')[0];
    if (idx !== -1) {
      // Update existing customer stats
      list[idx].totalOrders = (list[idx].totalOrders || 0) + 1;
      list[idx].totalSpent = (list[idx].totalSpent || 0) + o.total;
      list[idx].lastOrder = dateStr;
      if (o.deliveryAddress && !list[idx].address) list[idx].address = o.deliveryAddress;
      if (o.city && !list[idx].city) list[idx].city = o.city;
      setDB('customers', list);
      syncDocToCloud('customers', list[idx].id, list[idx]);
    } else {
      // Create new customer from order data
      const newCustomer: Customer = {
        id: o.customerId || generateId('c'),
        name: o.customerName.trim(),
        phone,
        address: o.deliveryAddress || '',
        city: o.city || 'Dhaka',
        tags: ['New'],
        totalOrders: 1,
        totalSpent: o.total,
        lastOrder: dateStr,
        notes: `Auto-collected from order ${o.orderId}${o.source ? ` via ${o.source}` : ''}`,
        createdAt: dateStr,
      };
      list.push(newCustomer);
      setDB('customers', list);
      syncDocToCloud('customers', newCustomer.id, newCustomer);
    }
  },
  deleteCustomer: (id: string): void => {
    const list = getDB<Customer>('customers').filter(c => c.id !== id);
    setDB('customers', list);
    deleteDocFromCloud('customers', id);
  },

  // Products
  getProducts: (): Product[] => getDB<Product>('products'),
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>): Product => {
    const item = { ...p, id: generateId('p'), createdAt: new Date().toISOString().split('T')[0] };
    const list = getDB<Product>('products');
    list.push(item);
    setDB('products', list);
    syncDocToCloud('products', item.id, item);
    return item;
  },
  updateProduct: (id: string, data: Partial<Product>): void => {
    const list = getDB<Product>('products').map(p => p.id === id ? { ...p, ...data } : p);
    setDB('products', list);
    const updated = list.find(p => p.id === id);
    if (updated) syncDocToCloud('products', id, updated);
  },
  deleteProduct: (id: string): void => {
    const list = getDB<Product>('products').filter(p => p.id !== id);
    setDB('products', list);
    deleteDocFromCloud('products', id);
  },

  // Services
  getServices: (): Service[] => getDB<Service>('services'),
  addService: (s: Omit<Service, 'id'>): Service => {
    const item = { ...s, id: generateId('s') };
    const list = getDB<Service>('services');
    list.push(item);
    setDB('services', list);
    syncDocToCloud('services', item.id, item);
    return item;
  },
  updateService: (id: string, data: Partial<Service>): void => {
    const list = getDB<Service>('services').map(s => s.id === id ? { ...s, ...data } : s);
    setDB('services', list);
    const updated = list.find(s => s.id === id);
    if (updated) syncDocToCloud('services', id, updated);
  },
  deleteService: (id: string): void => {
    const list = getDB<Service>('services').filter(s => s.id !== id);
    setDB('services', list);
    deleteDocFromCloud('services', id);
  },

  // Orders
  getOrders: (): Order[] => getDB<Order>('orders'),
  addOrder: (o: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> | (Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderId'> & { orderId?: string })): Order => {
    const list = getDB<Order>('orders');
    const now = new Date().toISOString();
    const orderNum = 10001 + list.length;
    const item: Order = {
      ...o,
      orderId: (o as any).orderId || `HR-${orderNum}`,
      subtotal: Math.round(o.subtotal),
      total: Math.round(o.total),
      discount: Math.round(o.discount || 0),
      deliveryCharge: Math.round(o.deliveryCharge || 0),
      profit: Math.round(o.profit || 0),
      items: (o.items || []).map(it => ({
        ...it,
        price: Math.round(it.price),
        cost: Math.round(it.cost || 0),
        total: Math.round(it.total)
      })),
      id: generateId('o'),
      createdAt: now,
      updatedAt: now
    };
    // Auto-deduct raw materials & packaging according to cone recipes
    if (item.orderStatus !== 'cancelled' && !item.rawIngredientsDeducted) {
      const deduction = db.deductOrderIngredients(item);
      if (deduction.deducted) {
        item.rawIngredientsDeducted = true;
        item.ingredientsUsed = deduction.ingredientsUsed;
        item.materialCostTotal = deduction.materialCostTotal;
      }
    }

    list.unshift(item);
    setDB('orders', list);
    syncDocToCloud('orders', item.id, item);
    // Auto-collect customer as lead from every order
    db.upsertCustomerFromOrder({
      customerId: item.customerId,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      deliveryAddress: item.deliveryAddress,
      city: item.city,
      total: item.total,
      orderId: item.orderId,
      source: item.source,
      createdAt: now,
    });
    return item;
  },
  updateOrder: (id: string, data: Partial<Order>): void => {
    const cleanData = { ...data };
    if (cleanData.subtotal !== undefined) cleanData.subtotal = Math.round(cleanData.subtotal);
    if (cleanData.total !== undefined) cleanData.total = Math.round(cleanData.total);
    if (cleanData.discount !== undefined) cleanData.discount = Math.round(cleanData.discount);
    if (cleanData.deliveryCharge !== undefined) cleanData.deliveryCharge = Math.round(cleanData.deliveryCharge);
    if (cleanData.profit !== undefined) cleanData.profit = Math.round(cleanData.profit);
    if (cleanData.items) {
      cleanData.items = cleanData.items.map(it => ({
        ...it,
        price: Math.round(it.price),
        cost: Math.round(it.cost || 0),
        total: Math.round(it.total)
      }));
    }
    const list = getDB<Order>('orders').map(o => o.id === id ? { ...o, ...cleanData, updatedAt: new Date().toISOString() } : o);
    setDB('orders', list);
    const updated = list.find(o => o.id === id);
    if (updated) syncDocToCloud('orders', id, updated);
  },
  deleteOrder: (id: string): void => {
    const list = getDB<Order>('orders').filter(o => o.id !== id);
    setDB('orders', list);
    deleteDocFromCloud('orders', id);
  },

  // Bookings
  getBookings: (): Booking[] => getDB<Booking>('bookings'),
  addBooking: (b: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const item = { ...b, id: generateId('b'), createdAt: new Date().toISOString().split('T')[0] };
    const list = getDB<Booking>('bookings');
    list.unshift(item);
    setDB('bookings', list);
    syncDocToCloud('bookings', item.id, item);
    return item;
  },
  updateBooking: (id: string, data: Partial<Booking>): void => {
    const list = getDB<Booking>('bookings').map(b => b.id === id ? { ...b, ...data } : b);
    setDB('bookings', list);
    const updated = list.find(b => b.id === id);
    if (updated) syncDocToCloud('bookings', id, updated);
  },
  deleteBooking: (id: string): void => {
    const list = getDB<Booking>('bookings').filter(b => b.id !== id);
    setDB('bookings', list);
    deleteDocFromCloud('bookings', id);
  },

  // Payments
  getPayments: (): Payment[] => getDB<Payment>('payments'),
  addPayment: (p: Omit<Payment, 'id'>): Payment => {
    const item = { ...p, id: generateId('pay') };
    const list = getDB<Payment>('payments');
    list.unshift(item);
    setDB('payments', list);
    syncDocToCloud('payments', item.id, item);
    return item;
  },
  updatePayment: (id: string, data: Partial<Payment>): void => {
    const list = getDB<Payment>('payments').map(p => p.id === id ? { ...p, ...data } : p);
    setDB('payments', list);
    const updated = list.find(p => p.id === id);
    if (updated) syncDocToCloud('payments', id, updated);
  },
  deletePayment: (id: string): void => {
    const list = getDB<Payment>('payments').filter(p => p.id !== id);
    setDB('payments', list);
    deleteDocFromCloud('payments', id);
  },

  // Expenses
  getExpenses: (): Expense[] => getDB<Expense>('expenses'),
  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const item = { ...e, id: generateId('e'), createdAt: new Date().toISOString().split('T')[0] };
    const list = getDB<Expense>('expenses');
    list.unshift(item);
    setDB('expenses', list);
    syncDocToCloud('expenses', item.id, item);
    return item;
  },
  updateExpense: (id: string, data: Partial<Expense>): void => {
    const list = getDB<Expense>('expenses').map(e => e.id === id ? { ...e, ...data } : e);
    setDB('expenses', list);
    const updated = list.find(e => e.id === id);
    if (updated) syncDocToCloud('expenses', id, updated);
  },
  deleteExpense: (id: string): void => {
    const list = getDB<Expense>('expenses').filter(e => e.id !== id);
    setDB('expenses', list);
    deleteDocFromCloud('expenses', id);
  },

  // Team
  getTeamMembers: (): TeamMember[] => getDB<TeamMember>('teamMembers'),
  addTeamMember: (m: Omit<TeamMember, 'id'>): TeamMember => {
    const item = { ...m, id: generateId('tm') };
    const list = getDB<TeamMember>('teamMembers');
    list.push(item);
    setDB('teamMembers', list);
    syncDocToCloud('teamMembers', item.id, item);
    return item;
  },

  // Inventory (Finished Goods & Raw Materials)
  getInventory: (): InventoryItem[] => {
    let list = getDB<InventoryItem>('inventory');
    if (!list || list.length === 0) {
      list = [...DEFAULT_RAW_MATERIALS];
      setDB('inventory', list);
    } else {
      let changed = false;
      DEFAULT_RAW_MATERIALS.forEach(def => {
        const exists = list.some(item => item.name.toLowerCase() === def.name.toLowerCase() || item.id === def.id);
        if (!exists) {
          list.push(def);
          changed = true;
        }
      });
      if (changed) {
        setDB('inventory', list);
      }
    }
    return list;
  },

  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt'> | (Omit<InventoryItem, 'id' | 'createdAt' | 'lowStockLevel'> & { lowStockLevel?: number; minStockLevel?: number })): InventoryItem => {
    const newItem: InventoryItem = {
      ...item,
      lowStockLevel: item.lowStockLevel ?? item.minStockLevel ?? 10,
      id: generateId('inv'),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const list = getDB<InventoryItem>('inventory');
    list.push(newItem);
    setDB('inventory', list);
    syncDocToCloud('inventory', newItem.id, newItem);
    return newItem;
  },

  updateInventoryItem: (id: string, data: Partial<InventoryItem>): void => {
    const list = getDB<InventoryItem>('inventory').map(i => i.id === id ? { ...i, ...data } : i);
    setDB('inventory', list);
    const updated = list.find(i => i.id === id);
    if (updated) syncDocToCloud('inventory', id, updated);
  },

  deleteInventoryItem: (id: string): void => {
    const list = getDB<InventoryItem>('inventory').filter(i => i.id !== id);
    setDB('inventory', list);
    deleteDocFromCloud('inventory', id);
  },

  adjustInventoryStock: (idOrName: string, delta: number): void => {
    db.adjustRawMaterialStock(idOrName, delta);
  },

  // Raw Materials Transaction Logs
  getRawMaterialLogs: (): RawMaterialStockLog[] => getDB<RawMaterialStockLog>('rawMaterialLogs'),

  addRawMaterialLog: (log: Omit<RawMaterialStockLog, 'id' | 'timestamp' | 'dateTimeFormatted'>): RawMaterialStockLog => {
    const now = new Date();
    const item: RawMaterialStockLog = {
      ...log,
      id: generateId('rml'),
      timestamp: now.toISOString(),
      dateTimeFormatted: formatDateTime(now),
    };
    const list = getDB<RawMaterialStockLog>('rawMaterialLogs');
    list.unshift(item);
    setDB('rawMaterialLogs', list);
    syncDocToCloud('rawMaterialLogs', item.id, item);
    return item;
  },

  adjustRawMaterialStock: (
    idOrName: string,
    delta: number,
    meta?: {
      type?: 'purchase_in' | 'order_deduction' | 'batch_deduction' | 'manual_adjust' | 'restock';
      referenceId?: string;
      notes?: string;
      unitCost?: number;
    }
  ): InventoryItem | null => {
    const list = db.getInventory();
    const idx = list.findIndex(i =>
      i.id === idOrName ||
      i.name.toLowerCase() === idOrName.toLowerCase() ||
      i.name.toLowerCase().includes(idOrName.toLowerCase())
    );
    if (idx !== -1) {
      const item = list[idx];
      const prevStock = item.currentStock;
      const newStock = Math.max(0, Math.round((prevStock + delta) * 100) / 100);
      item.currentStock = newStock;
      const now = new Date();
      if (delta > 0) {
        item.addedAt = now.toISOString();
        item.addedTimeFormatted = formatDateTime(now);
      }
      if (meta?.unitCost !== undefined && meta.unitCost > 0) {
        item.costPerUnit = meta.unitCost;
      }
      list[idx] = item;
      setDB('inventory', list);
      syncDocToCloud('inventory', item.id, item);

      // Record transaction log with exact date and time
      db.addRawMaterialLog({
        materialId: item.id,
        materialName: item.name,
        type: meta?.type || (delta > 0 ? 'purchase_in' : 'order_deduction'),
        quantityChange: Math.round(delta * 100) / 100,
        unit: item.unit,
        previousStock: prevStock,
        remainingStock: newStock,
        unitCost: item.costPerUnit,
        totalCost: Math.round(Math.abs(delta) * item.costPerUnit * 100) / 100,
        referenceId: meta?.referenceId,
        notes: meta?.notes || (delta > 0 ? `Stock added: +${delta} ${item.unit}` : `Consumed: ${delta} ${item.unit}`)
      });

      return item;
    }
    return null;
  },

  restockRawMaterial: (params: {
    materialId: string;
    quantity: number;
    unit?: string;
    costPerUnit?: number;
    supplier?: string;
    notes?: string;
  }): void => {
    const list = db.getInventory();
    const item = list.find(i => i.id === params.materialId || i.name.toLowerCase() === params.materialId.toLowerCase());
    if (item) {
      if (params.supplier) item.supplier = params.supplier;
      if (params.costPerUnit && params.costPerUnit > 0) item.costPerUnit = params.costPerUnit;
      db.adjustRawMaterialStock(item.id, params.quantity, {
        type: 'purchase_in',
        unitCost: params.costPerUnit || item.costPerUnit,
        referenceId: `PO-${Date.now().toString().slice(-4)}`,
        notes: params.notes || `Restocked ${params.quantity} ${item.unit} ${params.supplier ? `(${params.supplier})` : ''}`
      });
    }
  },

  // Cone Recipes & Costing Formulas
  getConeRecipes: (): ConeRecipe[] => {
    let list = getDB<ConeRecipe>('coneRecipes');
    if (!list || list.length === 0) {
      list = [...DEFAULT_CONE_RECIPES];
      setDB('coneRecipes', list);
    }
    return list;
  },

  updateConeRecipe: (id: string, data: Partial<ConeRecipe>): void => {
    const list = db.getConeRecipes().map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r);
    setDB('coneRecipes', list);
    const updated = list.find(r => r.id === id);
    if (updated) syncDocToCloud('coneRecipes', id, updated);
  },

  addConeRecipe: (recipe: Omit<ConeRecipe, 'id'>): ConeRecipe => {
    const list = db.getConeRecipes();
    const newRecipe: ConeRecipe = {
      ...recipe,
      id: generateId('rcp'),
      updatedAt: new Date().toISOString()
    };
    list.push(newRecipe);
    setDB('coneRecipes', list);
    syncDocToCloud('coneRecipes', newRecipe.id, newRecipe);
    return newRecipe;
  },

  resetConeRecipesToDefault: (): void => {
    setDB('coneRecipes', DEFAULT_CONE_RECIPES);
    DEFAULT_CONE_RECIPES.forEach(r => syncDocToCloud('coneRecipes', r.id, r));
  },

  // Raw Ingredient & Packaging Rates (1kg powder batch rates)
  getRawIngredientRates: (): RawIngredientRate[] => {
    let list = getDB<RawIngredientRate>('rawIngredientRates');
    if (!list || list.length === 0) {
      list = [...DEFAULT_RAW_INGREDIENT_RATES];
      setDB('rawIngredientRates', list);
    }
    return list;
  },

  updateRawIngredientRate: (id: string, data: Partial<RawIngredientRate>): void => {
    const list = db.getRawIngredientRates().map(r => r.id === id ? { ...r, ...data } : r);
    setDB('rawIngredientRates', list);
    const updated = list.find(r => r.id === id);
    if (updated && data.costPerBaseUnit !== undefined) {
      const invList = db.getInventory();
      const invItem = invList.find(i => i.name.toLowerCase().includes(updated.name.toLowerCase()));
      if (invItem) {
        db.updateInventoryItem(invItem.id, { costPerUnit: data.costPerBaseUnit });
      }
    }
  },

  getPackagingRates: (): PackagingRate[] => {
    let list = getDB<PackagingRate>('packagingRates');
    if (!list || list.length === 0) {
      list = [...DEFAULT_PACKAGING_RATES];
      setDB('packagingRates', list);
    }
    return list;
  },

  updatePackagingRate: (id: string, data: Partial<PackagingRate>): void => {
    const list = db.getPackagingRates().map(p => p.id === id ? { ...p, ...data } : p);
    setDB('packagingRates', list);
    const updated = list.find(p => p.id === id);
    if (updated && data.costPerCone !== undefined) {
      const invList = db.getInventory();
      const invItem = invList.find(i => i.name.toLowerCase().includes(updated.name.toLowerCase()));
      if (invItem) {
        db.updateInventoryItem(invItem.id, { costPerUnit: data.costPerCone });
      }
    }
  },

  // Automatic Raw Material Deduction when an Order is Created
  deductOrderIngredients: (order: Order): {
    deducted: boolean;
    ingredientsUsed: Array<{ materialName: string; quantity: number; unit: string; cost: number }>;
    materialCostTotal: number;
  } => {
    if (!order.items || order.items.length === 0) {
      return { deducted: false, ingredientsUsed: [], materialCostTotal: 0 };
    }

    const recipes = db.getConeRecipes();
    const ingredientsUsedMap = new Map<string, { materialName: string; quantity: number; unit: string; cost: number }>();
    let totalMaterialCost = 0;

    order.items.forEach(item => {
      const itemQty = item.quantity || 1;
      const itemName = (item.productName || '').toLowerCase();
      const itemCat = (item.category || '').toLowerCase();

      const allProds = db.getProducts();
      const product = allProds.find(p => p.id === item.productId || p.name.toLowerCase() === itemName);
      const productSize = (product?.size || '').toLowerCase();

      // Match cone size variant: 20g, 25g, 30g
      let matchedRecipe: ConeRecipe | undefined;
      if (productSize.includes('30') || itemName.includes('30g') || itemName.includes('30 gm') || itemName.includes('30 gram')) {
        matchedRecipe = recipes.find(r => r.size.includes('30')) || recipes[2];
      } else if (productSize.includes('25') || itemName.includes('25g') || itemName.includes('25 gm') || itemName.includes('25 gram')) {
        matchedRecipe = recipes.find(r => r.size.includes('25')) || recipes[1];
      } else if (productSize.includes('20') || itemName.includes('20g') || itemName.includes('20 gm') || itemName.includes('20 gram')) {
        matchedRecipe = recipes.find(r => r.size.includes('20')) || recipes[0];
      } else {
        if (itemName.includes('cone') || itemCat.includes('cone') || itemName.includes('mehendi') || itemName.includes('henna')) {
          matchedRecipe = recipes[0];
        }
      }

      if (matchedRecipe) {
        // 1. Deduct raw ingredients
        matchedRecipe.ingredients.forEach(ing => {
          const totalQty = Math.round(ing.amount * itemQty * 100) / 100;
          const cost = Math.round(ing.cost * itemQty * 100) / 100;
          totalMaterialCost += cost;

          const existing = ingredientsUsedMap.get(ing.name) || { materialName: ing.name, quantity: 0, unit: ing.unit, cost: 0 };
          existing.quantity = Math.round((existing.quantity + totalQty) * 100) / 100;
          existing.cost = Math.round((existing.cost + cost) * 100) / 100;
          ingredientsUsedMap.set(ing.name, existing);

          db.adjustRawMaterialStock(ing.name, -totalQty, {
            type: 'order_deduction',
            referenceId: order.orderId,
            notes: `Consumed for ${itemQty}x ${item.productName} (${matchedRecipe?.label || 'Cone'}) in Order #${order.orderId}`
          });
        });

        // 2. Deduct packaging materials (Cello Paper, Pin, Logo Sticker)
        const packagingItems = [
          { name: 'Cello Paper', qty: itemQty, unit: 'pcs', unitCost: 0.50 },
          { name: 'Pin', qty: itemQty, unit: 'pcs', unitCost: 0.17 },
          { name: 'Logo Sticker', qty: itemQty, unit: 'pcs', unitCost: 0.70 }
        ];

        packagingItems.forEach(pkg => {
          const cost = Math.round(pkg.unitCost * pkg.qty * 100) / 100;
          totalMaterialCost += cost;

          const existing = ingredientsUsedMap.get(pkg.name) || { materialName: pkg.name, quantity: 0, unit: pkg.unit, cost: 0 };
          existing.quantity += pkg.qty;
          existing.cost = Math.round((existing.cost + cost) * 100) / 100;
          ingredientsUsedMap.set(pkg.name, existing);

          db.adjustRawMaterialStock(pkg.name, -pkg.qty, {
            type: 'order_deduction',
            referenceId: order.orderId,
            notes: `Packaging for ${itemQty}x ${item.productName} in Order #${order.orderId}`
          });
        });
      }
    });

    const ingredientsUsed = Array.from(ingredientsUsedMap.values());
    totalMaterialCost = Math.round(totalMaterialCost * 100) / 100;

    return {
      deducted: ingredientsUsed.length > 0,
      ingredientsUsed,
      materialCostTotal: totalMaterialCost
    };
  },

  // Daily & Monthly Stock Consumption and Profit Calculation
  getStockConsumptionAndProfit: (period: string = 'this_month') => {
    const orders = db.getOrders();
    const inventory = db.getInventory();
    const logs = db.getRawMaterialLogs();
    const recipes = db.getConeRecipes();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let filterFn: (dateStr?: string) => boolean = () => true;

    if (period === 'today') {
      filterFn = (d) => !!d && d.startsWith(todayStr);
    } else if (period === 'yesterday') {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      filterFn = (d) => !!d && d.startsWith(yesterday);
    } else if (period === 'this_month') {
      filterFn = (d) => !!d && d.startsWith(currentMonth);
    } else if (period === 'last_month') {
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
      filterFn = (d) => !!d && d.startsWith(lastMonthStr);
    } else if (/^\d{4}-\d{2}$/.test(period)) {
      filterFn = (d) => !!d && d.startsWith(period);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(period)) {
      filterFn = (d) => !!d && d.startsWith(period);
    }

    const periodOrders = orders.filter(o => filterFn(o.createdAt));
    const validOrders = periodOrders.filter(o => o.orderStatus !== 'cancelled');

    const totalOrderTotal = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const deliveryRevenue = validOrders.reduce((sum, o) => sum + (o.deliveryCharge || 0), 0);
    const totalProductSales = validOrders.reduce((sum, o) => sum + (o.subtotal || Math.max(0, o.total - (o.deliveryCharge || 0))), 0);

    let count20g = 0;
    let count25g = 0;
    let count30g = 0;
    let otherCount = 0;

    validOrders.forEach(o => {
      (o.items || []).forEach(it => {
        const name = (it.productName || '').toLowerCase();
        const qty = it.quantity || 1;
        if (name.includes('30g') || name.includes('30 gm')) count30g += qty;
        else if (name.includes('25g') || name.includes('25 gm')) count25g += qty;
        else if (name.includes('20g') || name.includes('20 gm')) count20g += qty;
        else otherCount += qty;
      });
    });

    const totalConesSold = count20g + count25g + count30g + otherCount;

    const periodLogs = logs.filter(l => filterFn(l.timestamp));
    const deductionLogs = periodLogs.filter(l => l.type === 'order_deduction' || l.type === 'batch_deduction');
    const purchaseLogs = periodLogs.filter(l => l.type === 'purchase_in' || l.type === 'restock');

    const usageMap = new Map<string, { materialName: string; consumedQty: number; unit: string; unitCost: number; totalCost: number }>();

    deductionLogs.forEach(l => {
      const existing = usageMap.get(l.materialName) || {
        materialName: l.materialName,
        consumedQty: 0,
        unit: l.unit,
        unitCost: l.unitCost || 0,
        totalCost: 0
      };
      existing.consumedQty = Math.round((existing.consumedQty + Math.abs(l.quantityChange)) * 100) / 100;
      existing.totalCost = Math.round((existing.totalCost + (l.totalCost || (Math.abs(l.quantityChange) * (l.unitCost || 0)))) * 100) / 100;
      usageMap.set(l.materialName, existing);
    });

    if (usageMap.size === 0 && totalConesSold > 0) {
      const r20 = recipes.find(r => r.size.includes('20')) || recipes[0];
      const r25 = recipes.find(r => r.size.includes('25')) || recipes[1];
      const r30 = recipes.find(r => r.size.includes('30')) || recipes[2];

      const addTheory = (name: string, qty: number, unit: string, unitRate: number) => {
        const cost = Math.round(qty * unitRate * 100) / 100;
        const cur = usageMap.get(name) || { materialName: name, consumedQty: 0, unit, unitCost: unitRate, totalCost: 0 };
        cur.consumedQty = Math.round((cur.consumedQty + qty) * 100) / 100;
        cur.totalCost = Math.round((cur.totalCost + cost) * 100) / 100;
        usageMap.set(name, cur);
      };

      addTheory('Mehendi Powder', (count20g * (r20.ingredients[0]?.amount || 5.41)) + (count25g * (r25.ingredients[0]?.amount || 6.76)) + (count30g * (r30.ingredients[0]?.amount || 8.20)), 'gm', 1.20);
      addTheory('Eucalyptus Oil', (count20g * (r20.ingredients[1]?.amount || 1.62)) + (count25g * (r25.ingredients[1]?.amount || 2.03)) + (count30g * (r30.ingredients[1]?.amount || 2.46)), 'ml', 4.60);
      addTheory('Sugar', (count20g * (r20.ingredients[2]?.amount || 2.16)) + (count25g * (r25.ingredients[2]?.amount || 2.70)) + (count30g * (r30.ingredients[2]?.amount || 3.28)), 'gm', 0.12);
      addTheory('Lemon Juice', (count20g * (r20.ingredients[3]?.amount || 1.62)) + (count25g * (r25.ingredients[3]?.amount || 2.03)) + (count30g * (r30.ingredients[3]?.amount || 2.46)), 'ml', 0.25);
      addTheory('Xanthan Gum (XG)', (count20g * (r20.ingredients[4]?.amount || 0.05)) + (count25g * (r25.ingredients[4]?.amount || 0.07)) + (count30g * (r30.ingredients[4]?.amount || 0.08)), 'gm', 1.00);

      addTheory('Cello Paper', totalConesSold, 'pcs', 0.50);
      addTheory('Pin', totalConesSold, 'pcs', 0.17);
      addTheory('Logo Sticker', totalConesSold, 'pcs', 0.70);
    }

    const materialUsageList = Array.from(usageMap.values());
    const totalIngredientsCostUsed = Math.round(materialUsageList.reduce((sum, m) => sum + m.totalCost, 0));
    const extraWastageBuffer = Math.round(totalConesSold * 1.00);
    const totalStockCostUsed = Math.round(totalIngredientsCostUsed + extraWastageBuffer);

    const grossProfit = Math.round(totalProductSales - totalStockCostUsed);
    const profitMargin = totalProductSales > 0 ? Math.round((grossProfit / totalProductSales) * 1000) / 10 : 0;

    const stockReconciliation = inventory.map(item => {
      const consumedItem = materialUsageList.find(m => m.materialName.toLowerCase() === item.name.toLowerCase());
      const consumedQty = consumedItem?.consumedQty || 0;

      const addedLogs = purchaseLogs.filter(l => l.materialName.toLowerCase() === item.name.toLowerCase());
      const addedQty = Math.round(addedLogs.reduce((sum, l) => sum + Math.max(0, l.quantityChange), 0) * 100) / 100;

      const currentLeftStock = item.currentStock;
      const leftStockValue = Math.round(currentLeftStock * item.costPerUnit);
      const estimatedOpeningStock = Math.max(0, Math.round((currentLeftStock + consumedQty - addedQty) * 100) / 100);

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        unitCost: item.costPerUnit,
        openingStock: estimatedOpeningStock,
        addedStock: addedQty,
        consumedStock: consumedQty,
        theoreticalLeftStock: Math.max(0, Math.round((estimatedOpeningStock + addedQty - consumedQty) * 100) / 100),
        actualLeftStock: currentLeftStock,
        leftStockValue,
        status: currentLeftStock <= item.lowStockLevel ? ('low' as const) : ('healthy' as const)
      };
    });

    const totalLeftStockValuation = stockReconciliation.reduce((sum, s) => sum + s.leftStockValue, 0);

    return {
      period,
      ordersCount: validOrders.length,
      totalProductSales,
      totalOrderTotal,
      deliveryRevenue,
      totalConesSold,
      coneBreakdown: { count20g, count25g, count30g, otherCount },
      materialUsageList,
      totalIngredientsCostUsed,
      extraWastageBuffer,
      totalStockCostUsed,
      grossProfit,
      profitMargin,
      stockReconciliation,
      totalLeftStockValuation
    };
  },

  adjustProductStock: (idOrSku: string, delta: number): Product | null => {
    const list = getDB<Product>('products');
    const idx = list.findIndex(p => p.id === idOrSku || p.sku === idOrSku || p.name.toLowerCase().includes(idOrSku.toLowerCase()));
    if (idx !== -1) {
      const prevStock = list[idx].stock;
      list[idx].stock = Math.max(0, Math.round(list[idx].stock + delta));
      if (delta > 0) {
        list[idx].addedAt = new Date().toISOString();
        list[idx].addedTimeFormatted = formatDateTime(new Date());
      }
      setDB('products', list);
      syncDocToCloud('products', list[idx].id, list[idx]);

      // Trigger low stock warning when stock is <= 20
      if (list[idx].stock <= (list[idx].lowStockLevel || 20) && prevStock > list[idx].stock) {
        db.addNotification({
          category: 'Inventory',
          title: `Low Stock Alert (<= 20 Cones): ${list[idx].name}`,
          description: `Stock has dropped to ${list[idx].stock} cones! Reorder or start a production batch.`
        });
      }
      return list[idx];
    }
    return null;
  },

  // Confirm Order: Deducts cone stock from Inventory
  confirmOrder: (orderId: string): Order | null => {
    const list = getDB<Order>('orders');
    const idx = list.findIndex(o => o.id === orderId || o.orderId === orderId);
    if (idx === -1) return null;

    const order = list[idx];
    if (order.orderStatus === 'confirmed' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return order;
    }

    // Deduct stock for each product in items
    order.items.forEach(item => {
      db.adjustProductStock(item.productId, -item.quantity);
    });

    // Deduct raw ingredients if not already deducted
    if (!order.rawIngredientsDeducted) {
      const deduction = db.deductOrderIngredients(order);
      if (deduction.deducted) {
        order.rawIngredientsDeducted = true;
        order.ingredientsUsed = deduction.ingredientsUsed;
        order.materialCostTotal = deduction.materialCostTotal;
      }
    }

    order.orderStatus = 'confirmed';
    if (order.deliveryStatus === 'pending') {
      order.deliveryStatus = 'processing';
    }
    order.updatedAt = new Date().toISOString();

    list[idx] = order;
    setDB('orders', list);
    syncDocToCloud('orders', order.id, order);

    db.addNotification({
      category: 'Order',
      title: `Order ${order.orderId} Confirmed`,
      description: `Stock deducted for ${order.items.reduce((sum, i) => sum + i.quantity, 0)} cones. Ready for packing/dispatch.`
    });

    return order;
  },

  // Dispatch Order to Steadfast Courier
  dispatchToSteadfast: (orderId: string, customTracking?: string): Order | null => {
    const list = getDB<Order>('orders');
    const idx = list.findIndex(o => o.id === orderId || o.orderId === orderId);
    if (idx === -1) return null;

    const order = list[idx];
    const rawId = order.orderId || order.id || '';
    const cleanNum = rawId.replace(/[^0-9]/g, '') || String(Date.now()).slice(-4);
    const consignmentId = order.steadfastConsignmentId || `SF-${cleanNum}`;
    const trackingCode = customTracking || order.steadfastTrackingCode || `TRK-${cleanNum}-${Math.floor(100 + Math.random() * 900)}`;

    order.steadfastConsignmentId = consignmentId;
    order.steadfastTrackingCode = trackingCode;
    order.steadfastStatus = 'in_transit';
    order.steadfastDispatchedAt = new Date().toISOString();
    order.deliveryStatus = 'shipped';
    order.orderStatus = 'shipped';
    order.updatedAt = new Date().toISOString();

    list[idx] = order;
    setDB('orders', list);
    syncDocToCloud('orders', order.id, order);

    db.addNotification({
      category: 'Delivery',
      title: `Dispatched to Steadfast Courier #${consignmentId}`,
      description: `Order ${order.orderId} assigned tracking ${trackingCode}. Recipient: ${order.customerName} (${order.deliveryAddress || order.city || 'Dhaka'}). COD: ৳${order.paymentMethod === 'COD' ? order.total : 0}`
    });

    return order;
  },

  // Update Steadfast Courier Status (e.g. Delivered, Failed, In Transit)
  updateSteadfastStatus: (orderId: string, status: Order['steadfastStatus'], failReason?: string): Order | null => {
    const list = getDB<Order>('orders');
    const idx = list.findIndex(o => o.id === orderId || o.orderId === orderId);
    if (idx === -1) return null;

    const order = list[idx];
    order.steadfastStatus = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'delivered') {
      order.deliveryStatus = 'delivered';
      order.orderStatus = 'delivered';
      if (order.paymentMethod === 'COD' || order.paymentMethod === 'Steadfast COD') {
        order.paymentStatus = 'paid';
        // Auto-record received payment
        db.addPayment({
          reference: `COD-${order.orderId}`,
          customerId: order.customerId,
          customerName: order.customerName,
          orderId: order.id,
          amount: order.total,
          method: 'Steadfast COD',
          status: 'paid',
          date: new Date().toISOString().split('T')[0],
          notes: `Steadfast COD remittance for order ${order.orderId}`
        });
      }
      db.addNotification({
        category: 'Delivery',
        title: `Steadfast Delivered: Order ${order.orderId}`,
        description: `Delivered to ${order.customerName}. COD collection complete.`
      });
    } else if (status === 'failed') {
      order.deliveryStatus = 'failed';
      order.steadfastFailedReason = failReason || 'Customer unreachable / delivery attempt failed';
      db.addNotification({
        category: 'Delivery',
        title: `Delivery FAILED: Order ${order.orderId}`,
        description: `Reason: ${order.steadfastFailedReason}. Review order or retry dispatch.`
      });
    } else if (status === 'cancelled') {
      return db.cancelOrder(orderId, 'Cancelled from Steadfast Courier');
    }

    list[idx] = order;
    setDB('orders', list);
    syncDocToCloud('orders', order.id, order);
    return order;
  },

  // Cancel Order: Cancels in Courier AND Auto-Restocks Items into Inventory
  cancelOrder: (orderId: string, reason?: string): Order | null => {
    const list = getDB<Order>('orders');
    const idx = list.findIndex(o => o.id === orderId || o.orderId === orderId);
    if (idx === -1) return null;

    const order = list[idx];
    if (order.orderStatus === 'cancelled') return order;

    // Automatic Restock if previously confirmed/shipped and not already restocked
    if (!order.restocked) {
      order.items.forEach(item => {
        db.adjustProductStock(item.productId, item.quantity);
      });
      // Restore raw ingredients if previously deducted
      if (order.rawIngredientsDeducted && order.ingredientsUsed && order.ingredientsUsed.length > 0) {
        order.ingredientsUsed.forEach(ing => {
          db.adjustRawMaterialStock(ing.materialName, ing.quantity, {
            type: 'manual_adjust',
            referenceId: order.orderId,
            notes: `Restored ${ing.quantity} ${ing.unit} due to cancellation of Order #${order.orderId}`
          });
        });
      }
      order.restocked = true;
      order.restockedAt = new Date().toISOString();
    }

    order.orderStatus = 'cancelled';
    order.deliveryStatus = 'cancelled';
    if (order.steadfastStatus) {
      order.steadfastStatus = 'cancelled';
    }
    if (order.paymentStatus === 'pending') {
      order.paymentStatus = 'failed';
    } else if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }
    if (reason) {
      order.notes = order.notes ? `${order.notes} | Cancel reason: ${reason}` : `Cancel reason: ${reason}`;
    }
    order.updatedAt = new Date().toISOString();

    list[idx] = order;
    setDB('orders', list);
    syncDocToCloud('orders', order.id, order);

    const totalRestockedCones = order.items.reduce((s, i) => s + i.quantity, 0);
    db.addNotification({
      category: 'Order',
      title: `Order ${order.orderId} Cancelled & Restocked`,
      description: `Order cancelled from Steadfast courier. ${totalRestockedCones} cones have been automatically RESTOCKED to inventory!`
    });

    return order;
  },

  // Save Production Batch & Add directly to finished goods stock
  saveProductionBatch: (b: {
    productId: string;
    productName: string;
    coneCategory?: string;
    coneType?: string;
    actualOutput: number;
    expectedOutput?: number;
    totalCost: number;
    costPerCone: number;
    sellingPrice?: number;
    projectedProfit?: number;
    ingredients?: BatchIngredient[];
    notes?: string;
    date?: string;
  }): ProductionBatch => {
    const now = new Date();
    const batchNo = `BATCH-${now.toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const batchRecord: ProductionBatch = {
      id: generateId('pb'),
      batchId: batchNo,
      date: b.date || now.toISOString().split('T')[0],
      addedAt: now.toISOString(),
      addedTimeFormatted: formatDateTime(now),
      productId: b.productId,
      productName: b.productName,
      coneCategory: b.coneCategory || 'Organic Henna Cone',
      coneType: b.coneType || '20gm',
      expectedOutput: b.expectedOutput || b.actualOutput,
      actualOutput: b.actualOutput,
      ingredients: b.ingredients || [],
      packagingCosts: 0,
      totalCost: b.totalCost,
      costPerUnit: b.costPerCone,
      sellingPrice: b.sellingPrice,
      projectedProfit: b.projectedProfit,
      status: 'completed',
      notes: b.notes,
      createdAt: now.toISOString()
    };

    const batches = getDB<ProductionBatch>('productionBatches');
    batches.unshift(batchRecord);
    setDB('productionBatches', batches);
    syncDocToCloud('productionBatches', batchRecord.id, batchRecord);

    // Add produced cones directly into product inventory stock with exact timestamp & cost
    db.addOrStockProduct({
      name: b.productName,
      size: b.coneType,
      category: b.coneCategory,
      conesToAdd: b.actualOutput,
      costPrice: b.costPerCone,
      sellingPrice: b.sellingPrice || 100
    });

    // Deduct raw materials if ingredients provided
    if (b.ingredients && b.ingredients.length > 0) {
      b.ingredients.forEach(ing => {
        db.adjustInventoryStock(ing.itemId || ing.itemName, -ing.quantity);
      });
    }

    db.addNotification({
      category: 'Inventory',
      title: `Batch Finished: ${b.actualOutput}x ${b.productName}`,
      description: `Stored into stock on ${batchRecord.addedTimeFormatted}. Unit cost: ৳${Math.round(b.costPerCone)}.`
    });

    return batchRecord;
  },

  getProductionBatches: (): ProductionBatch[] => getDB<ProductionBatch>('productionBatches'),

  addProductionBatch: (b: Omit<ProductionBatch, 'id' | 'createdAt'>): ProductionBatch => {
    return db.saveProductionBatch({
      productId: b.productId,
      productName: b.productName,
      coneCategory: b.coneCategory,
      coneType: b.coneType,
      actualOutput: b.actualOutput || b.expectedOutput,
      expectedOutput: b.expectedOutput,
      totalCost: b.totalCost,
      costPerCone: b.costPerUnit,
      ingredients: b.ingredients,
      notes: b.notes,
      date: b.date
    });
  },
  deleteProductionBatch: (id: string): void => {
    const list = getDB<ProductionBatch>('productionBatches').filter(b => b.id !== id && b.batchId !== id);
    setDB('productionBatches', list);
    deleteDocFromCloud('productionBatches', id);
  },

  checkBookingConflict: (artistId: string, date: string, startTime?: string, endTime?: string, excludeBookingId?: string): Booking | null => {
    if (!artistId || !date) return null;
    const bookings = getDB<Booking>('bookings');
    return bookings.find(b => {
      if (b.id === excludeBookingId) return false;
      if (b.artistId !== artistId) return false;
      if (b.date !== date) return false;
      if (b.status === 'cancelled' || b.status === 'refunded') return false;
      if (startTime && endTime && b.startTime && b.endTime) {
        return (startTime < b.endTime && endTime > b.startTime);
      }
      return true;
    }) || null;
  },

  // Subscribe to real-time state changes
  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Dynamic Analytics & P/L calculation across all time ranges
  getAnalytics: (period: string = 'this_month') => {
    const orders = getDB<Order>('orders');
    const batches = getDB<ProductionBatch>('productionBatches');
    const products = getDB<Product>('products');
    const payments = getDB<Payment>('payments');
    const salaries = getDB<SalaryPayment>('salaryPayments');

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentYear = now.getFullYear();
    const currentMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Calculate last month string
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    // 7 days ago timestamp
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Resolve active month filter
    let targetMonthStr = '';
    if (period === 'this_month') {
      targetMonthStr = currentMonth;
    } else if (period === 'last_month') {
      targetMonthStr = lastMonthStr;
    } else if (/^\d{4}-\d{2}$/.test(period)) {
      targetMonthStr = period;
    }

    const filterByDate = (dateStr?: string) => {
      if (!dateStr) return true;
      if (period === 'all') return true;
      if (period === 'today') return dateStr.startsWith(todayStr);
      if (period === 'this_week') return new Date(dateStr) >= sevenDaysAgo;
      if (targetMonthStr) return dateStr.startsWith(targetMonthStr);
      if (period === 'this_year') return dateStr.startsWith(String(currentYear));
      return true;
    };

    const filteredOrders = orders.filter(o => filterByDate(o.createdAt));
    const nonCancelledOrders = filteredOrders.filter(o => o.orderStatus !== 'cancelled');
    const filteredBatches = batches.filter(b => filterByDate(b.createdAt || b.date));
    const filteredPayments = payments.filter(p => filterByDate(p.date));

    // Filter salary payments by month/period
    const filteredSalaries = salaries.filter(s => {
      if (period === 'all') return true;
      if (targetMonthStr) {
        // e.g. s.month === 'September 2026' or '2026-09' or starts with targetMonthStr
        const [y, m] = targetMonthStr.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const mName = monthNames[parseInt(m, 10) - 1];
        return (s.month && (s.month.includes(targetMonthStr) || s.month.includes(mName))) || (s.paymentDate && s.paymentDate.startsWith(targetMonthStr));
      }
      return true;
    });

    const totalOrdersCount = filteredOrders.length;
    const completedOrdersCount = filteredOrders.filter(o => o.orderStatus === 'delivered').length;
    const inTransitOrdersCount = filteredOrders.filter(o => o.steadfastStatus === 'in_transit' || o.deliveryStatus === 'shipped').length;
    const failedOrdersCount = filteredOrders.filter(o => o.steadfastStatus === 'failed' || o.deliveryStatus === 'failed').length;
    const cancelledOrdersCount = filteredOrders.filter(o => o.orderStatus === 'cancelled').length;

    const deliverySuccessRate = totalOrdersCount > 0 
      ? Math.round((completedOrdersCount / (completedOrdersCount + failedOrdersCount || 1)) * 100)
      : 0;

    const totalConesProduced = filteredBatches.reduce((sum, b) => sum + (b.actualOutput || 0), 0);
    const totalProductionCost = filteredBatches.reduce((sum, b) => sum + (b.totalCost || 0), 0);

    const totalEarned = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
    const deliveryRevenue = nonCancelledOrders.reduce((sum, o) => sum + (o.deliveryCharge || 0), 0);
    const grossProductRevenue = totalEarned - deliveryRevenue;

    const orderCost = nonCancelledOrders.reduce((sum, o) => {
      return sum + o.items.reduce((s, i) => s + ((i.cost || 0) * i.quantity), 0);
    }, 0);

    const deliveryCost = nonCancelledOrders.length * 70; // Avg courier fee
    const totalSalariesPaid = filteredSalaries
      .filter(s => s.status === 'paid')
      .reduce((sum, s) => sum + (s.netSalary || 0), 0);

    const totalOperatingCosts = Math.round(orderCost + deliveryCost + totalSalariesPaid);
    const netProfit = Math.round(totalEarned - totalOperatingCosts);
    const profitMargin = totalEarned > 0 ? Math.round((netProfit / totalEarned) * 100) : 0;

    // Live low stock check (stock <= 20)
    const lowStockProducts = products.filter(p => p.stock <= (p.lowStockLevel || 20));
    const totalConesInStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    // Steadfast Courier Detailed Metrics
    const steadfastOrders = filteredOrders.filter(o => o.steadfastTrackingCode || (o as any).sendToSteadfast || o.deliveryStatus === 'shipped');
    const steadfastStats = {
      totalDispatched: Math.max(steadfastOrders.length, inTransitOrdersCount + completedOrdersCount),
      delivered: completedOrdersCount,
      inTransit: inTransitOrdersCount,
      failed: failedOrdersCount,
      successRate: deliverySuccessRate,
      codCollected: nonCancelledOrders.filter(o => o.orderStatus === 'delivered' && (o.paymentMethod === 'COD' || o.paymentMethod === 'Cash on Delivery')).reduce((sum, o) => sum + o.total, 0),
      codPending: nonCancelledOrders.filter(o => (o.orderStatus === 'shipped' || o.steadfastStatus === 'in_transit') && (o.paymentMethod === 'COD' || o.paymentMethod === 'Cash on Delivery')).reduce((sum, o) => sum + o.total, 0)
    };

    // Category breakdown from real orders
    const catMap = new Map<string, { sold: number; revenue: number }>();
    nonCancelledOrders.forEach(o => {
      o.items.forEach(it => {
        const prod = products.find(p => p.id === it.productId);
        const cat = prod?.category || it.category || 'Organic Cones';
        const existing = catMap.get(cat) || { sold: 0, revenue: 0 };
        catMap.set(cat, {
          sold: existing.sold + it.quantity,
          revenue: existing.revenue + (it.price * it.quantity)
        });
      });
    });

    const categoryBreakdown = Array.from(catMap.entries()).map(([category, data]) => ({
      category,
      sold: data.sold,
      revenue: data.revenue
    }));

    // Batches summary from real production records
    const recentBatches = filteredBatches.map(b => {
      const cones = b.actualOutput || 0;
      const costPerCone = Math.round(b.costPerUnit || 0);
      const sellingPrice = Math.round(b.sellingPrice || 120);
      const totalRev = Math.round(cones * sellingPrice);
      const totCost = Math.round(b.totalCost || (cones * costPerCone));
      const prof = Math.round(totalRev - totCost);
      const marg = totalRev > 0 ? Math.round((prof / totalRev) * 100) : 0;
      return {
        name: `${b.coneType || 'Batch'} (${b.batchId})`,
        cones,
        costPerCone,
        sellingPrice,
        totalRevenue: totalRev,
        totalCost: totCost,
        profit: prof,
        margin: marg
      };
    });

    // Monthly trends computed dynamically from real orders and staff salaries
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYr = new Date().getFullYear();
    const monthlyTrends = months.map((m, idx) => {
      const monthPrefix = `${currentYr}-${String(idx + 1).padStart(2, '0')}`;
      const monthOrders = orders.filter(o => o.orderStatus !== 'cancelled' && o.createdAt && o.createdAt.startsWith(monthPrefix));
      const monthSalaries = salaries.filter(s => s.paymentDate && s.paymentDate.startsWith(monthPrefix));
      const rev = monthOrders.reduce((sum, o) => sum + o.total, 0);
      const exp = monthOrders.reduce((sum, o) => sum + Math.max(0, o.subtotal - (o.profit || 0)), 0) +
                  monthSalaries.reduce((sum, s) => sum + s.netSalary, 0);
      return {
        month: m,
        revenue: Math.round(rev),
        expense: Math.round(exp),
        profit: Math.round(Math.max(0, rev - exp))
      };
    });

    // Generate Month Labels
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let periodLabel = period;
    let selectedMonthName = 'September 2026';
    if (period === 'all') {
      periodLabel = 'All Time Records (2026)';
      selectedMonthName = 'Full Year 2026';
    } else if (period === 'today') {
      periodLabel = "Today's Operations";
      selectedMonthName = `Today (${todayStr})`;
    } else if (period === 'this_week') {
      periodLabel = 'This Week (Last 7 Days)';
      selectedMonthName = 'Past 7 Days';
    } else if (period === 'this_month') {
      periodLabel = 'This Month (September 2026)';
      selectedMonthName = 'September 2026';
    } else if (period === 'last_month') {
      periodLabel = 'Last Month (August 2026)';
      selectedMonthName = 'August 2026';
    } else if (period === 'this_year') {
      periodLabel = 'This Year (2026)';
      selectedMonthName = 'Annual 2026';
    } else if (/^\d{4}-\d{2}$/.test(period)) {
      const [y, m] = period.split('-');
      const mIdx = parseInt(m, 10) - 1;
      selectedMonthName = `${monthNames[mIdx]} ${y}`;
      periodLabel = `${monthNames[mIdx]} ${y} Financial Statement`;
    }

    // List of months for the monthly selector
    const availableMonths = [
      { key: '2026-09', label: 'September 2026', current: true },
      { key: '2026-08', label: 'August 2026', current: false },
      { key: '2026-07', label: 'July 2026', current: false },
      { key: '2026-06', label: 'June 2026', current: false },
      { key: '2026-05', label: 'May 2026', current: false },
      { key: '2026-04', label: 'April 2026', current: false },
      { key: '2026-03', label: 'March 2026', current: false },
      { key: '2026-02', label: 'February 2026', current: false },
      { key: '2026-01', label: 'January 2026', current: false },
    ];

    // Cone Unit Economics Matrix from real products
    const unitEconomics = products.map(p => {
      const margin = p.sellingPrice > 0 ? Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100) : 0;
      return {
        name: p.name,
        cost: Math.round(p.costPrice || 0),
        price: Math.round(p.sellingPrice || 0),
        margin,
        stock: p.stock || 0
      };
    });

    return {
      period,
      periodLabel,
      selectedMonthName,
      availableMonths,
      totalOrdersCount,
      totalOrders: totalOrdersCount,
      completedOrdersCount,
      completedOrders: completedOrdersCount,
      inTransitOrdersCount,
      failedOrdersCount,
      cancelledOrdersCount,
      cancelledOrders: cancelledOrdersCount,
      deliverySuccessRate,
      totalConesProduced,
      totalProducedCones: totalConesProduced,
      totalProductionCost,
      productionCost: totalProductionCost,
      totalEarned,
      totalRevenue: totalEarned,
      grossProductRevenue,
      deliveryRevenue,
      deliveryCost,
      orderCost,
      totalSalariesPaid,
      totalOperatingCosts,
      netProfit,
      profitMargin,
      totalConesInStock,
      totalInStock: totalConesInStock,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      categoryBreakdown,
      recentBatches,
      monthlyTrends,
      steadfastStats,
      unitEconomics,
      filteredOrders,
      filteredBatches,
      filteredPayments,
      filteredSalaries
    };
  },

  // Notifications (Blueprint Sec 56)
  getNotifications: () => {
    const list = getDB<any>('notifications');
    // Ensure all returned notifications are genuine live events and not legacy demo data
    return list.filter((n: any) => {
      if (!n || !n.title) return false;
      const text = `${n.title} ${n.description || ''}`.toLowerCase();
      if (text.includes('demo') || text.includes('sample') || text.includes('test order')) {
        return false;
      }
      return true;
    });
  },
  addNotification: (n: { category: 'Booking' | 'Order' | 'Payment' | 'Inventory' | 'Delivery' | 'System'; title: string; description: string }) => {
    const list = getDB<any>('notifications');
    const item = {
      id: generateId('notif'),
      ...n,
      time: 'Just now',
      read: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(item);
    setDB('notifications', list);
    syncDocToCloud('notifications', item.id, item);
    return item;
  },
  markAllNotificationsRead: () => {
    const list = getDB<any>('notifications').map(n => ({ ...n, read: true }));
    setDB('notifications', list);
    notifyListeners();
  },
  deleteNotification: (id: string) => {
    const list = getDB<any>('notifications').filter(n => n.id !== id);
    setDB('notifications', list);
    deleteDocFromCloud('notifications', id);
    notifyListeners();
  },
  clearAllNotifications: () => {
    const list = getDB<any>('notifications');
    list.forEach(n => deleteDocFromCloud('notifications', n.id));
    setDB('notifications', []);
    localStorage.setItem('hr_notifications', JSON.stringify([]));
    notifyListeners();
  },

  // Global Dynamic Search (Blueprint Sec 62)
  searchGlobal: (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{ type: 'order' | 'booking' | 'customer' | 'product'; id: string; label: string; sub: string; page: string }> = [];

    // Orders
    getDB<Order>('orders').forEach(o => {
      if (o.orderId.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q)) {
        results.push({
          type: 'order',
          id: o.id,
          label: `Order ${o.orderId}`,
          sub: `${o.customerName} · ৳${o.total.toLocaleString()}`,
          page: 'orders'
        });
      }
    });

    // Bookings
    getDB<Booking>('bookings').forEach(b => {
      if (b.bookingId.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q) || b.eventType.toLowerCase().includes(q) || (b.artistName || '').toLowerCase().includes(q)) {
        results.push({
          type: 'booking',
          id: b.id,
          label: `Booking ${b.bookingId} (${b.eventType})`,
          sub: `${b.customerName} · ${b.date} · ৳${b.packageTotal.toLocaleString()}`,
          page: 'bookings'
        });
      }
    });

    // Customers
    getDB<Customer>('customers').forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email || '').toLowerCase().includes(q)) {
        results.push({
          type: 'customer',
          id: c.id,
          label: c.name,
          sub: `${c.phone} · ${c.city || 'Dhaka'} · ${c.tags.join(', ')}`,
          page: 'customers'
        });
      }
    });

    // Products
    getDB<Product>('products').forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
        results.push({
          type: 'product',
          id: p.id,
          label: p.name,
          sub: `SKU: ${p.sku} · Stock: ${p.stock} · ৳${p.sellingPrice}`,
          page: 'products'
        });
      }
    });

    return results.slice(0, 8);
  },

  // POS Checkout (Blueprint Sec 60)
  addPOSSale: (sale: {
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    city?: string;
    deliveryCharge?: number;
    sendToSteadfast?: boolean;
    items: Array<{ productId: string; name: string; qty: number; price: number; cost: number }>;
    serviceId?: string;
    serviceName?: string;
    servicePrice?: number;
    discount: number;
    paymentMethod: string;
    notes?: string;
  }) => {
    // 1. Ensure customer exists
    let customers = getDB<Customer>('customers');
    let customer = customers.find(c => c.phone === sale.customerPhone);
    if (!customer) {
      customer = db.addCustomer({
        name: sale.customerName || 'Walk-in Client',
        phone: sale.customerPhone || '01700-000000',
        address: sale.deliveryAddress || '',
        city: sale.city || 'Dhaka',
        tags: ['POS Order', 'Retail'],
        totalOrders: 1,
        totalSpent: 0
      });
    } else if (sale.deliveryAddress && !customer.address) {
      customer.address = sale.deliveryAddress;
      db.updateCustomer(customer.id, { address: sale.deliveryAddress });
    }

    const itemsTotal = Math.round(sale.items.reduce((s, i) => s + (i.price * i.qty), 0));
    const serviceTotal = Math.round(sale.servicePrice || 0);
    const deliveryCharge = Math.round(sale.deliveryCharge || 0);
    const subtotal = Math.round(itemsTotal + serviceTotal);
    const total = Math.round(Math.max(0, subtotal + deliveryCharge - (sale.discount || 0)));
    const cost = Math.round(sale.items.reduce((s, i) => s + (i.cost * i.qty), 0));
    const profit = Math.round(total - cost);

    // 2. Add Order
    const nextNum = 10001 + getDB<Order>('orders').length;
    const nextOrderId = `HR-${nextNum}`;
    const orderItems = sale.items.map(i => ({
      productId: i.productId || (i as any).product?.id || 'prod_pos',
      productName: i.name || (i as any).product?.name || (i as any).productName || 'Henna Cone',
      quantity: i.qty || (i as any).quantity || 1,
      price: Math.round(i.price ?? (i as any).product?.sellingPrice ?? 0),
      cost: Math.round(i.cost ?? (i as any).product?.costPrice ?? 0),
      total: Math.round((i.price ?? (i as any).product?.sellingPrice ?? 0) * (i.qty || (i as any).quantity || 1))
    }));

    if (sale.serviceName) {
      orderItems.push({
        productId: sale.serviceId || 'srv_walkin',
        productName: `Service: ${sale.serviceName}`,
        quantity: 1,
        price: serviceTotal,
        cost: 0,
        total: serviceTotal
      });
    }

    const isCod = (sale.paymentMethod || '').toLowerCase().includes('delivery') || (sale.paymentMethod || '').toLowerCase().includes('cod');
    const isSteadfast = !!sale.sendToSteadfast;
    const now = new Date();

    const cleanNum = String(nextNum).slice(-4);
    const consignmentId = isSteadfast ? `CID-${cleanNum}-${Math.floor(100 + Math.random() * 900)}` : undefined;
    const trackingCode = isSteadfast ? `SF2026${cleanNum}${Math.floor(100 + Math.random() * 900)}` : undefined;

    const order = db.addOrder({
      orderId: nextOrderId,
      customerId: customer.id,
      customerName: sale.customerName || customer.name,
      customerPhone: sale.customerPhone || customer.phone,
      deliveryAddress: sale.deliveryAddress || customer.address || 'Studio Store Pickup',
      city: sale.city || customer.city || 'Dhaka',
      items: orderItems,
      subtotal,
      discount: sale.discount,
      discountType: 'fixed',
      deliveryCharge,
      total,
      paymentMethod: sale.paymentMethod,
      paymentStatus: isCod ? 'pending' : 'paid',
      deliveryStatus: isSteadfast ? 'shipped' : 'delivered',
      orderStatus: isSteadfast ? 'shipped' : 'delivered',
      steadfastConsignmentId: consignmentId,
      steadfastTrackingCode: trackingCode,
      steadfastStatus: isSteadfast ? 'in_transit' : undefined,
      steadfastDispatchedAt: isSteadfast ? now.toISOString() : undefined,
      notes: sale.notes,
      source: 'POS',
      profit
    });

    // 3. Deduct product stocks
    sale.items.forEach(i => {
      db.adjustProductStock(i.productId, -i.qty);
    });

    // 4. Record Payment
    db.addPayment({
      reference: `POS-${Date.now().toString(36).toUpperCase()}`,
      customerId: customer.id,
      customerName: customer.name,
      orderId: order.id,
      amount: total,
      method: sale.paymentMethod,
      status: isCod ? 'pending' : 'paid',
      date: now.toISOString().split('T')[0],
      notes: isSteadfast ? `Steadfast Delivery Order (${trackingCode})` : 'POS Store Checkout'
    });

    // 5. Add notification
    db.addNotification({
      category: 'Order',
      title: `POS Order #${nextOrderId} Created`,
      description: isSteadfast
        ? `Order #${nextOrderId} dispatched to Steadfast Courier (${trackingCode}) for ৳${total.toLocaleString()}`
        : `Completed POS order of ৳${total.toLocaleString()} paid via ${sale.paymentMethod}`
    });

    return order;
  },

  // Add or Stock Product: Adds cones directly to stock under given name (e.g. 20gm or 25gm)
  addOrStockProduct: (data: {
    name: string;
    size?: string;
    category?: string;
    conesToAdd: number;
    costPrice: number;
    sellingPrice?: number;
  }): Product => {
    const list = getDB<Product>('products');
    const cleanName = data.name.trim().toLowerCase();
    const cleanSize = (data.size || '').trim().toLowerCase();

    // Check if matching product exists
    const idx = list.findIndex(p => {
      const pName = p.name.toLowerCase();
      const pSize = (p.size || '').toLowerCase();
      if (cleanSize && (pName.includes(cleanSize) || pSize.includes(cleanSize))) return true;
      return pName === cleanName || pName.includes(cleanName);
    });

    const now = new Date();
    const formattedDate = formatDateTime(now);

    if (idx !== -1) {
      list[idx].stock += data.conesToAdd;
      list[idx].costPrice = data.costPrice;
      if (data.sellingPrice && data.sellingPrice > 0) list[idx].sellingPrice = data.sellingPrice;
      list[idx].addedAt = now.toISOString();
      list[idx].addedTimeFormatted = formattedDate;
      setDB('products', list);
      syncDocToCloud('products', list[idx].id, list[idx]);
      return list[idx];
    } else {
      const newProd: Product = {
        id: generateId('p'),
        name: data.name,
        sku: `MC-${(data.size || 'STD').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`,
        category: data.category || 'Mehendi Cone',
        size: data.size || 'Standard',
        sellingPrice: data.sellingPrice || 100,
        costPrice: data.costPrice,
        stock: data.conesToAdd,
        lowStockLevel: 20,
        supplier: 'Henna Royalin In-house',
        status: 'active',
        createdAt: now.toISOString().split('T')[0],
        addedAt: now.toISOString(),
        addedTimeFormatted: formattedDate
      };
      list.unshift(newProd);
      setDB('products', list);
      syncDocToCloud('products', newProd.id, newProd);
      return newProd;
    }
  },

  // Staff Credentials & Access Control
  getStaff: (): StaffMember[] => getDB<StaffMember>('staff'),
  addStaff: (s: Omit<StaffMember, 'id' | 'createdAt'>): StaffMember => {
    const item: StaffMember = {
      ...s,
      id: generateId('stf'),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const list = getDB<StaffMember>('staff');
    list.push(item);
    setDB('staff', list);
    syncDocToCloud('staff', item.id, item);
    return item;
  },
  updateStaff: (id: string, data: Partial<StaffMember>): void => {
    const list = getDB<StaffMember>('staff').map(s => s.id === id ? { ...s, ...data } : s);
    setDB('staff', list);
    const updated = list.find(s => s.id === id);
    if (updated) syncDocToCloud('staff', id, updated);
  },
  deleteStaff: (id: string): void => {
    const list = getDB<StaffMember>('staff').filter(s => s.id !== id);
    setDB('staff', list);
    deleteDocFromCloud('staff', id);
  },
  getCurrentStaff: (): StaffMember => {
    try {
      const stored = localStorage.getItem('hr_current_staff');
      if (stored) return JSON.parse(stored);
    } catch {}
    const list = getDB<StaffMember>('staff');
    return list[0] || {
      id: 'stf_001',
      name: 'Sumaiya Jabin',
      username: 'admin',
      email: 'sumaiya@hennaroyalin.com',
      password: 'admin',
      role: 'Admin',
      phone: '01711-000001',
      status: 'active',
      createdAt: '2026-01-01'
    };
  },
  setCurrentStaff: (staff: StaffMember): void => {
    localStorage.setItem('hr_current_staff', JSON.stringify(staff));
    notifyListeners();
  },

  // Employees & Staff Details
  getEmployees: (): Employee[] => getDB<Employee>('employees'),
  addEmployee: (e: Omit<Employee, 'id' | 'createdAt'> | (Omit<Employee, 'id' | 'createdAt' | 'employeeId'> & { employeeId?: string })): Employee => {
    const list = getDB<Employee>('employees');
    const empCount = list.length + 1;
    const item: Employee = {
      ...e,
      id: generateId('emp'),
      employeeId: e.employeeId || `EMP-${String(empCount).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.push(item);
    setDB('employees', list);
    syncDocToCloud('employees', item.id, item);
    return item;
  },
  updateEmployee: (id: string, data: Partial<Employee>): void => {
    const list = getDB<Employee>('employees').map(e => e.id === id ? { ...e, ...data } : e);
    setDB('employees', list);
    const updated = list.find(e => e.id === id);
    if (updated) syncDocToCloud('employees', id, updated);
  },
  deleteEmployee: (id: string): void => {
    const list = getDB<Employee>('employees').filter(e => e.id !== id);
    setDB('employees', list);
    deleteDocFromCloud('employees', id);
  },

  // Employee Salary System & Payslip Invoices
  getSalaryPayments: (): SalaryPayment[] => getDB<SalaryPayment>('salaryPayments'),
  addSalaryPayment: (p: Omit<SalaryPayment, 'id' | 'createdAt' | 'voucherNo'>): SalaryPayment => {
    const now = new Date();
    const count = getDB<SalaryPayment>('salaryPayments').length + 1;
    const voucherNo = `PAY-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(count).padStart(3, '0')}`;
    const item: SalaryPayment = {
      ...p,
      id: generateId('sal'),
      voucherNo,
      createdAt: now.toISOString()
    };
    const list = getDB<SalaryPayment>('salaryPayments');
    list.unshift(item);
    setDB('salaryPayments', list);
    syncDocToCloud('salaryPayments', item.id, item);

    // Record in expenses
    db.addExpense({
      description: `Salary: ${p.employeeName} (${p.month})`,
      category: 'Payroll',
      amount: p.netSalary,
      paymentMethod: p.paymentMethod,
      date: p.paymentDate || now.toISOString().split('T')[0],
      isRecurring: true
    });

    return item;
  },
  updateSalaryPayment: (id: string, data: Partial<SalaryPayment>): void => {
    const list = getDB<SalaryPayment>('salaryPayments').map(s => s.id === id ? { ...s, ...data } : s);
    setDB('salaryPayments', list);
    const updated = list.find(s => s.id === id);
    if (updated) syncDocToCloud('salaryPayments', id, updated);
  },
  deleteSalaryPayment: (id: string): void => {
    const list = getDB<SalaryPayment>('salaryPayments').filter(s => s.id !== id);
    setDB('salaryPayments', list);
    deleteDocFromCloud('salaryPayments', id);
  },

  // Backup & Data Export/Import (Blueprint Sec 61)
  exportBackupJSON: () => {
    const data: Record<string, any> = {};
    const keys = ['customers', 'products', 'services', 'orders', 'bookings', 'payments', 'expenses', 'teamMembers', 'inventory', 'productionBatches', 'notifications'];
    keys.forEach(k => {
      data[k] = getDB(k);
    });
    data.exportDate = new Date().toISOString();
    data.brand = 'Henna Royalin Business Suite';
    return JSON.stringify(data, null, 2);
  },

  importBackupJSON: (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      const keys = ['customers', 'products', 'services', 'orders', 'bookings', 'payments', 'expenses', 'teamMembers', 'inventory', 'productionBatches'];
      keys.forEach(k => {
        if (Array.isArray(data[k])) {
          setDB(k, data[k]);
        }
      });
      db.syncAllToCloud().catch(err => console.warn('Cloud sync after backup import notice:', err));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  resetToDefaultData: () => {
    const keys = [
      'customers', 'products', 'services', 'orders', 'bookings',
      'payments', 'expenses', 'teamMembers', 'inventory',
      'productionBatches', 'employees', 'salaryPayments'
    ];
    keys.forEach(k => {
      localStorage.setItem(`hr_${k}`, JSON.stringify([]));
    });
    const defaultStaff = [
      {
        id: 'stf_001',
        name: 'Sumaiya Jabin',
        username: 'admin',
        email: 'sumaiya@hennaroyalin.com',
        password: 'admin',
        role: 'Admin' as const,
        phone: '01711-000001',
        status: 'active' as const,
        lastLogin: '',
        createdAt: '2026-01-01'
      }
    ];
    localStorage.setItem('hr_staff', JSON.stringify(defaultStaff));
    localStorage.setItem('hr_current_staff', JSON.stringify(defaultStaff[0]));
    notifyListeners();
    return true;
  },

  clearAllData: async () => {
    const keys = [
      'customers', 'products', 'services', 'orders', 'bookings',
      'payments', 'expenses', 'teamMembers', 'inventory',
      'productionBatches', 'employees', 'salaryPayments', 'notifications', 'staff'
    ];
    keys.forEach(k => {
      localStorage.setItem(`hr_${k}`, JSON.stringify([]));
    });
    notifyListeners();
    try {
      await clearAllCloudData();
    } catch (err) {
      console.warn('Notice: Error clearing Cloud Firestore data:', err);
    }
    return true;
  },

  // Stats
  getStats: () => {
    const orders = getDB<Order>('orders');
    const bookings = getDB<Booking>('bookings');
    const payments = getDB<Payment>('payments');
    const expenses = getDB<Expense>('expenses');
    const today = new Date().toISOString().split('T')[0];

    const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(today));
    const todayBookings = bookings.filter(b => b.date && b.date.startsWith(today));
    const currentMonthPrefix = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const monthOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(currentMonthPrefix));
    const monthExpenses = expenses.filter(e => e.date && e.date.startsWith(currentMonthPrefix));

    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
    const monthExpenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthProfit = monthOrders.reduce((sum, o) => sum + o.profit, 0);

    const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'partial');
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      todayOrders: todayOrders.length,
      todayBookings: todayBookings.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
      pendingPayments: pendingAmount,
      monthRevenue,
      monthExpense: monthExpenseTotal,
      monthProfit
    };
  },

  // Store Configuration & Settings
  getSettings: () => {
    try {
      const data = localStorage.getItem('hr_settings');
      if (data) {
        const parsed = JSON.parse(data);
        if (!parsed.sfApiKey || parsed.sfApiKey === 'sf_live_a89f92e8c92a') {
          parsed.sfApiKey = 'hbojkpmdxbxti3pmkgros8hou0huz5xc';
        }
        if (!parsed.sfSecretKey || parsed.sfSecretKey.includes('•') || parsed.sfSecretKey === '••••••••••••••••••••••••') {
          parsed.sfSecretKey = 'xv0nqm9s58rycuqsxrkkh4wu';
        }
        return parsed;
      }
    } catch {}
    return {
      businessName: 'Henna Royalin',
      ownerName: 'Sumaiya Jabin',
      phone: '+880 1711-000001',
      email: 'info@hennaroyalin.com',
      location: 'Dhaka & Narayanganj, Bangladesh',
      currency: 'BDT (৳)',
      bkashNumber: '01711-000001 (Merchant)',
      nagadNumber: '01812-000002 (Personal)',
      bankAccount: 'City Bank Ltd · A/C: 11029384910 · Gulshan Branch',
      sfApiKey: 'hbojkpmdxbxti3pmkgros8hou0huz5xc',
      sfSecretKey: 'xv0nqm9s58rycuqsxrkkh4wu',
      dhakaRate: 70,
      outsideDhakaRate: 120,
      invPrefix: 'HR-INV-',
      qtPrefix: 'QT-2026-',
      aftercareText: 'Leave mehendi paste for at least 4-6 hours. Scrape off gently without water. Apply coconut or mustard oil for rich dark stain.'
    };
  },
  saveSettings: (settings: any) => {
    const sanitized = { id: 'app_config', ...settings, updatedAt: new Date().toISOString() };
    localStorage.setItem('hr_settings', JSON.stringify(sanitized));
    syncDocToCloud('settings', 'app_config', sanitized);
    notifyListeners();
  },

  // Cloud Database (Google Cloud Firestore Native asia-south2)
  getCloudStatus: (): CloudStatus => getCloudStatus(),
  subscribeCloudStatus: (fn: (s: CloudStatus) => void) => subscribeCloudStatus(fn),
  syncAllToCloud: async () => syncAllLocalToCloud((key) => getDB(key)),
  notifyListeners: () => notifyListeners()
};
