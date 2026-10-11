import React, { useState, useEffect } from 'react';
import {
  Shield, Key, UserCheck, Plus, X, Edit2, Lock, Eye, EyeOff,
  Mail, Phone, Clock, Check, AlertCircle, ShieldAlert, Sparkles,
  Users, Crown, Brush, Truck, Package, Factory
} from 'lucide-react';
import { db, StaffMember, formatDateTime } from '../lib/db';
import { useModal } from '../context/ModalContext';

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Admin: { bg: '#FFEAEA', text: '#720000', border: '#FECACA' },
  Manager: { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE' },
  Sales: { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },
  Production: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  Delivery: { bg: '#CFFAFE', text: '#0E7490', border: '#A5F3FC' }
};

const PERMISSIONS_LIST = [
  { module: 'Dashboard & Reports', admin: true, manager: true, sales: true, production: false, delivery: false },
  { module: 'Orders & Dispatch', admin: true, manager: true, sales: true, production: false, delivery: true },
  { module: 'Products & Stock Catalog', admin: true, manager: true, sales: true, production: true, delivery: false },
  { module: 'Production Calculator', admin: true, manager: true, sales: false, production: true, delivery: false },
  { module: 'Steadfast Courier Hub', admin: true, manager: true, sales: false, production: false, delivery: true },
  { module: 'Payments & COD Remittance', admin: true, manager: true, sales: true, production: false, delivery: false },
  { module: 'Employee & Salary Payroll', admin: true, manager: true, sales: false, production: false, delivery: false },
  { module: 'Staff Credentials & Access', admin: true, manager: false, sales: false, production: false, delivery: false }
];

export default function StaffAccess() {
  const { showAlert } = useModal();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [currentStaff, setCurrentStaff] = useState<StaffMember>(db.getCurrentStaff());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Sales' as 'Admin' | 'Manager' | 'Sales' | 'Production' | 'Delivery',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    refreshData();
    const unsub = db.subscribe(refreshData);
    return unsub;
  }, []);

  const refreshData = () => {
    setStaffList(db.getStaff());
    setCurrentStaff(db.getCurrentStaff());
  };

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setForm({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'Sales',
      phone: '',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setForm({
      name: s.name,
      username: s.username,
      email: s.email,
      password: s.password,
      role: s.role,
      phone: s.phone,
      status: s.status
    });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) {
      showAlert({ type: 'warning', title: 'Required Fields', message: 'Name, Username, and Password are required.' });
      return;
    }

    if (editingStaff) {
      db.updateStaff(editingStaff.id, form);
    } else {
      db.addStaff(form);
    }

    setShowAddModal(false);
    refreshData();
  };

  const handleSwitchStaff = (s: StaffMember) => {
    db.setCurrentStaff(s);
    refreshData();
  };

  const toggleShowPassword = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
              Staff Access & Credentials
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#720000]/10 text-[#720000]">
              Role-Based Access
            </span>
          </div>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Create and manage staff login credentials (username & password), assign operational roles, and set access permissions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] transition shadow-xs"
        >
          <Plus size={15} /> Create Staff Credential
        </button>
      </div>

      {/* Active Logged-in Staff Indicator */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-red-50 to-[#FAF8F3] border border-[#E8E0D4] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#720000] text-white flex items-center justify-center font-bold text-base">
            {currentStaff.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#24201D]">Active Staff Profile:</span>
              <span className="font-serif font-bold text-sm text-[#720000]">{currentStaff.name}</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border"
                style={{
                  background: ROLE_COLORS[currentStaff.role]?.bg || '#f3f4f6',
                  color: ROLE_COLORS[currentStaff.role]?.text || '#374151',
                  borderColor: ROLE_COLORS[currentStaff.role]?.border || '#e5e7eb'
                }}
              >
                {currentStaff.role}
              </span>
            </div>
            <p className="text-[11px] text-[#7A6B5D] mt-0.5">
              Logged in as username: <strong className="font-mono">{currentStaff.username}</strong> · Access is customized for this role.
            </p>
          </div>
        </div>
      </div>

      {/* Staff Accounts Grid */}
      <div className="space-y-4">
        <h2 className="font-bold text-sm text-[#24201D] flex items-center gap-2">
          <Key size={16} className="text-[#720000]" />
          Staff Credentials ({staffList.length} Accounts)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map(s => {
            const roleStyle = ROLE_COLORS[s.role] || ROLE_COLORS.Sales;
            const isCurrent = currentStaff.id === s.id;
            const isPasswordVisible = !!showPassword[s.id];

            return (
              <div
                key={s.id}
                className={`p-4 rounded-2xl bg-white border transition-all hover:shadow-md flex flex-col justify-between ${
                  isCurrent ? 'border-[#720000] ring-1 ring-[#720000]' : 'border-[#E8E0D4]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] border border-[#E8E0D4] flex items-center justify-center font-bold text-xs text-[#720000]">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#24201D] leading-tight">{s.name}</h3>
                        <p className="text-[10px] text-[#7A6B5D]">{s.phone}</p>
                      </div>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                      style={{
                        background: roleStyle.bg,
                        color: roleStyle.text,
                        borderColor: roleStyle.border
                      }}
                    >
                      {s.role}
                    </span>
                  </div>

                  {/* Credentials Box */}
                  <div className="mt-3 p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A6B5D] text-[11px]">Username / Login:</span>
                      <span className="font-mono font-bold text-[#24201D] bg-white px-2 py-0.5 rounded-md border border-[#E8E0D4]">
                        {s.username}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#7A6B5D] text-[11px]">Password:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs font-semibold text-[#720000] bg-white px-2 py-0.5 rounded-md border border-[#E8E0D4]">
                          {isPasswordVisible ? s.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPassword(s.id)}
                          className="p-1 rounded text-[#7A6B5D] hover:text-[#24201D]"
                        >
                          {isPasswordVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>

                    {s.email && (
                      <div className="flex items-center justify-between text-[10px] text-[#7A6B5D] pt-1 border-t border-[#E8E0D4]/60">
                        <span>Email:</span>
                        <span>{s.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-[#E8E0D4] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl text-[#720000] bg-red-50 hover:bg-red-100 transition flex items-center gap-1"
                  >
                    <Edit2 size={12} /> Edit
                  </button>

                  <button
                    onClick={() => handleSwitchStaff(s)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                      isCurrent
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isCurrent ? '✓ Active Session' : 'Switch to Staff'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix Overview */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E0D4] shadow-xs">
        <div className="p-4 bg-[#FAF8F3] border-b border-[#E8E0D4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#720000]" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#24201D]">
              Role Access & Permission Matrix
            </h3>
          </div>
          <span className="text-[11px] text-[#7A6B5D]">
            Permissions are automatically enforced based on role
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold border-b border-[#E8E0D4]">
              <tr>
                <th className="py-3 px-4">System Module</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Manager</th>
                <th className="py-3 px-4 text-center">Sales</th>
                <th className="py-3 px-4 text-center">Production</th>
                <th className="py-3 px-4 text-center">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D4]">
              {PERMISSIONS_LIST.map(p => (
                <tr key={p.module} className="hover:bg-[#FFFDF5]">
                  <td className="py-3 px-4 font-bold text-[#24201D]">{p.module}</td>
                  <td className="py-3 px-4 text-center">
                    {p.admin ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.manager ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.sales ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.production ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.delivery ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E8E0D4] overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#E8E0D4]">
              <h2 className="font-serif text-lg font-bold text-[#24201D]">
                {editingStaff ? 'Edit Staff Credentials' : 'Create Staff Credential'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#24201D] block mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sadia Islam"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Login Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. sadia_sales"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none font-mono"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. staff123"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none font-mono"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Assigned Role</label>
                  <select
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none font-semibold text-[#720000]"
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))}
                  >
                    <option value="Admin">Admin / Owner</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales Staff</option>
                    <option value="Production">Production Master</option>
                    <option value="Delivery">Delivery Agent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="01711-XXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#24201D] block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="staff@hennaroyalin.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#7A6B5D] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] rounded-xl shadow-xs"
                >
                  {editingStaff ? 'Save Changes' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
