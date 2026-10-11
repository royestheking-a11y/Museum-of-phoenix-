import React, { useState, useEffect } from 'react';
import {
  Users, DollarSign, Plus, Search, FileText, Printer, CheckCircle2,
  Clock, AlertCircle, X, Download, Eye, Building2, Phone, Calendar,
  CreditCard, Shield, UserCheck, ArrowRight
} from 'lucide-react';
import { db, Employee, SalaryPayment, formatDateTime } from '../lib/db';
import hennaLogo from '../imports/Henna_Royalin.png';
import { useModal } from '../context/ModalContext';

export default function EmployeeSalary() {
  const { showAlert } = useModal();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
  const [activeTab, setActiveTab] = useState<'payroll' | 'employees'>('payroll');

  // Filters
  const [monthFilter, setMonthFilter] = useState('September 2026');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showPayModal, setShowPayModal] = useState(false);
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalaryPayment | null>(null);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  // New Payment Form State
  const [payForm, setPayForm] = useState({
    employeeId: '',
    month: 'September 2026',
    baseSalary: 0,
    bonus: 0,
    deductions: 0,
    deductionReason: '',
    paymentMethod: 'bKash' as 'bKash' | 'Nagad' | 'Bank Transfer' | 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'paid' as 'paid' | 'pending',
    notes: ''
  });

  // New Employee Form State
  const [empForm, setEmpForm] = useState<{
    name: string;
    phone: string;
    email: string;
    designation: string;
    department: Employee['department'];
    joiningDate: string;
    monthlySalary: number;
    paymentMethod: Employee['paymentMethod'];
    accountNumber: string;
    status: Employee['status'];
  }>({
    name: '',
    phone: '',
    email: '',
    designation: 'Cone Maker',
    department: 'Production',
    joiningDate: new Date().toISOString().split('T')[0],
    monthlySalary: 18000,
    paymentMethod: 'bKash',
    accountNumber: '',
    status: 'active'
  });

  useEffect(() => {
    refreshData();
    const unsub = db.subscribe(refreshData);
    return unsub;
  }, []);

  const refreshData = () => {
    setEmployees(db.getEmployees());
    setSalaryPayments(db.getSalaryPayments());
  };

  // Calculations
  const totalBasePayroll = employees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.monthlySalary, 0);
  const totalPaidThisMonth = salaryPayments
    .filter(p => p.month === monthFilter && p.status === 'paid')
    .reduce((sum, p) => sum + p.netSalary, 0);
  const totalPendingThisMonth = salaryPayments
    .filter(p => p.month === monthFilter && p.status === 'pending')
    .reduce((sum, p) => sum + p.netSalary, 0);

  const months = ['All Months', 'September 2026', 'August 2026', 'July 2026', 'June 2026'];

  // Handle Employee selection in Pay Form
  const handleSelectEmployeeForPayment = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setPayForm(f => ({
        ...f,
        employeeId: empId,
        baseSalary: emp.monthlySalary,
        paymentMethod: emp.paymentMethod
      }));
    } else {
      setPayForm(f => ({ ...f, employeeId: '', baseSalary: 0 }));
    }
  };

  // Net salary calculation for form
  const computedNetSalary = Math.max(0, (payForm.baseSalary || 0) + (payForm.bonus || 0) - (payForm.deductions || 0));

  const handleSaveSalaryPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.employeeId) {
      showAlert({ type: 'warning', title: 'Employee Required', message: 'Please select an employee.' });
      return;
    }
    const emp = employees.find(e => e.id === payForm.employeeId);
    if (!emp) return;

    db.addSalaryPayment({
      employeeId: emp.id,
      employeeName: emp.name,
      designation: emp.designation,
      month: payForm.month,
      baseSalary: payForm.baseSalary,
      bonus: payForm.bonus,
      deductions: payForm.deductions,
      deductionReason: payForm.deductionReason || 'No deduction applied',
      netSalary: computedNetSalary,
      paymentMethod: payForm.paymentMethod,
      paymentDate: payForm.status === 'paid' ? payForm.paymentDate : '',
      status: payForm.status,
      notes: payForm.notes
    });

    setShowPayModal(false);
    refreshData();
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.phone) {
      showAlert({ type: 'warning', title: 'Required Fields', message: 'Name and Phone are required.' });
      return;
    }

    if (editingEmp) {
      db.updateEmployee(editingEmp.id, empForm);
    } else {
      db.addEmployee(empForm);
    }

    setShowEmpModal(false);
    setEditingEmp(null);
    refreshData();
  };

  const handleOpenEditEmp = (emp: Employee) => {
    setEditingEmp(emp);
    setEmpForm({
      name: emp.name,
      phone: emp.phone,
      email: emp.email || '',
      designation: emp.designation,
      department: emp.department,
      joiningDate: emp.joiningDate,
      monthlySalary: emp.monthlySalary,
      paymentMethod: emp.paymentMethod,
      accountNumber: emp.accountNumber || '',
      status: emp.status
    });
    setShowEmpModal(true);
  };

  // Filtered Payments
  const filteredPayments = salaryPayments.filter(p => {
    const matchMonth = monthFilter === 'All Months' || p.month === monthFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.employeeName.toLowerCase().includes(q) || p.voucherNo.toLowerCase().includes(q) || p.designation.toLowerCase().includes(q);
    return matchMonth && matchStatus && matchSearch;
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#24201D]">
              Employee & Salary Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#720000]/10 text-[#720000]">
              Payroll & Invoices
            </span>
          </div>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Complete records of all studio staff, monthly salaries, deductions, bonuses, and printable salary vouchers/invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingEmp(null);
              setEmpForm({
                name: '',
                phone: '',
                email: '',
                designation: 'Cone Maker',
                department: 'Production',
                joiningDate: new Date().toISOString().split('T')[0],
                monthlySalary: 18000,
                paymentMethod: 'bKash',
                accountNumber: '',
                status: 'active'
              });
              setShowEmpModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#720000] bg-red-50 hover:bg-red-100 transition border border-red-200"
          >
            <Users size={14} /> Add New Employee
          </button>

          <button
            onClick={() => {
              if (employees.length > 0) {
                handleSelectEmployeeForPayment(employees[0].id);
              }
              setShowPayModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] transition shadow-xs"
          >
            <DollarSign size={14} /> Disburse / Pay Salary
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Active Employees', value: employees.filter(e => e.status === 'active').length, sub: 'Studio Staff', color: '#720000' },
          { label: 'Monthly Base Payroll', value: `৳${totalBasePayroll.toLocaleString()}`, sub: 'Monthly Commitment', color: '#24201D' },
          { label: `Paid (${monthFilter})`, value: `৳${totalPaidThisMonth.toLocaleString()}`, sub: 'Disbursed Vouchers', color: '#166534' },
          { label: `Pending (${monthFilter})`, value: `৳${totalPendingThisMonth.toLocaleString()}`, sub: 'Awaiting Payment', color: totalPendingThisMonth > 0 ? '#DC2626' : '#166534' }
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 bg-white border border-[#E8E0D4] shadow-xs">
            <p className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-bold text-[#24201D] mt-1">{s.label}</p>
            <p className="text-[10px] text-[#7A6B5D]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#E8E0D4]">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'payroll'
              ? 'border-[#720000] text-[#720000]'
              : 'border-transparent text-[#7A6B5D] hover:text-[#24201D]'
          }`}
        >
          <FileText size={15} /> Monthly Salary Vouchers & Deductions ({salaryPayments.length})
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'employees'
              ? 'border-[#720000] text-[#720000]'
              : 'border-transparent text-[#7A6B5D] hover:text-[#24201D]'
          }`}
        >
          <Users size={15} /> All Employees & Salary Details ({employees.length})
        </button>
      </div>

      {/* TAB 1: MONTHLY SALARY PAYROLL & INVOICES */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6B5D] pointer-events-none" />
              <input
                type="text"
                placeholder="Search by employee name, voucher ID, or designation..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                className="w-full pl-10! pr-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:outline-none focus:border-[#720000] bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={monthFilter}
                onChange={e => setMonthFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] bg-white font-semibold text-[#24201D] focus:outline-none"
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] bg-white font-semibold text-[#24201D] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Salary Payments Table */}
          <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E0D4] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                  <tr>
                    <th className="py-3 px-4">Voucher No</th>
                    <th className="py-3 px-4">Employee & Designation</th>
                    <th className="py-3 px-4">Pay Period</th>
                    <th className="py-3 px-4">Base Salary</th>
                    <th className="py-3 px-4">Bonus</th>
                    <th className="py-3 px-4">Deductions & Reason</th>
                    <th className="py-3 px-4">Net Paid</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Invoice / Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D4]">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-[#7A6B5D]">
                        No salary payment records found for this period. Click <strong>"Disburse / Pay Salary"</strong> above.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map(p => (
                      <tr key={p.id} className="hover:bg-[#FFFDF5] transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#720000]">
                          {p.voucherNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-[#24201D]">{p.employeeName}</p>
                          <p className="text-[10px] text-[#7A6B5D]">{p.designation}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#24201D]">
                          {p.month}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums text-[#7A6B5D]">
                          ৳{p.baseSalary.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-medium text-emerald-700">
                          {p.bonus > 0 ? `+৳${p.bonus.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          {p.deductions > 0 ? (
                            <div>
                              <span className="font-bold text-red-600 tabular-nums">
                                -৳{p.deductions.toLocaleString()}
                              </span>
                              {p.deductionReason && (
                                <p className="text-[10px] text-[#7A6B5D] line-clamp-1 max-w-45" title={p.deductionReason}>
                                  {p.deductionReason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums font-bold text-base text-[#720000]">
                          ৳{p.netSalary.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-[#7A6B5D]">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 font-medium text-[11px]">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {p.status === 'paid' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ Paid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              ⏳ Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedInvoice(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#720000] bg-red-50 hover:bg-red-100 transition border border-red-200"
                          >
                            <FileText size={12} /> View Payslip
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL EMPLOYEES & SALARY DETAILS */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-white border border-[#E8E0D4] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold uppercase tracking-wider border-b border-[#E8E0D4]">
                  <tr>
                    <th className="py-3 px-4">Emp ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Monthly Salary</th>
                    <th className="py-3 px-4">Payment Method / Account</th>
                    <th className="py-3 px-4">Joining Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D4]">
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-[#7A6B5D]">
                        No employees registered yet. Click <strong>"Add Employee"</strong> above to register staff.
                      </td>
                    </tr>
                  ) : (
                    employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-[#FFFDF5] transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#720000]">
                        {emp.employeeId}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#24201D]">
                        {emp.name}
                        {emp.email && <p className="text-[10px] text-[#7A6B5D] font-normal">{emp.email}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF8F3] border border-[#E8E0D4] text-[#7A6B5D]">
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#24201D] font-medium">
                        {emp.designation}
                      </td>
                      <td className="py-3 px-4 text-[#7A6B5D]">
                        {emp.phone}
                      </td>
                      <td className="py-3 px-4 tabular-nums font-bold text-base text-[#166534]">
                        ৳{emp.monthlySalary.toLocaleString()}
                        <span className="text-[10px] font-normal text-[#7A6B5D] block">/ month</span>
                      </td>
                      <td className="py-3 px-4 text-[#7A6B5D]">
                        <span className="font-semibold text-[#24201D]">{emp.paymentMethod}</span>
                        {emp.accountNumber && (
                          <p className="text-[10px] font-mono">{emp.accountNumber}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#7A6B5D]">
                        {emp.joiningDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenEditEmp(emp)}
                          className="px-2.5 py-1 text-xs font-bold text-[#720000] hover:bg-red-50 rounded-lg transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PAY / ISSUE SALARY VOUCHER */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E8E0D4] overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#E8E0D4]">
              <h2 className="font-serif text-lg font-bold text-[#24201D]">
                Disburse / Pay Employee Salary
              </h2>
              <button onClick={() => setShowPayModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSalaryPayment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Select Employee *</label>
                  <select
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={payForm.employeeId}
                    onChange={e => handleSelectEmployeeForPayment(e.target.value)}
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.designation} · ৳{e.monthlySalary.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Salary Month *</label>
                  <select
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={payForm.month}
                    onChange={e => setPayForm(f => ({ ...f, month: e.target.value }))}
                  >
                    {months.filter(m => m !== 'All Months').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Base Salary (৳)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none font-bold"
                    value={payForm.baseSalary}
                    onChange={e => setPayForm(f => ({ ...f, baseSalary: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-800 block mb-1">+ Bonus / OT (৳)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none font-bold text-emerald-700"
                    value={payForm.bonus}
                    onChange={e => setPayForm(f => ({ ...f, bonus: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-red-800 block mb-1">- Deductions (৳)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none font-bold text-red-600"
                    value={payForm.deductions}
                    onChange={e => setPayForm(f => ({ ...f, deductions: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#24201D] block mb-1">
                  Deduction Reason / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advance taken on 5th Sep, 2 days absence, late penalty..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                  value={payForm.deductionReason}
                  onChange={e => setPayForm(f => ({ ...f, deductionReason: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Payment Method</label>
                  <select
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={payForm.paymentMethod}
                    onChange={e => setPayForm(f => ({ ...f, paymentMethod: e.target.value as any }))}
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Payment Status</label>
                  <select
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={payForm.status}
                    onChange={e => setPayForm(f => ({ ...f, status: e.target.value as any }))}
                  >
                    <option value="paid">Paid (Disbursed)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Net Total Preview */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A6B5D] block">Net Salary to be Disbursed:</span>
                  <span className="text-[10px] text-[#7A6B5D]">
                    Base ৳{payForm.baseSalary} + Bonus ৳{payForm.bonus} - Deduction ৳{payForm.deductions}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#720000] tabular-nums">
                  ৳{computedNetSalary.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E0D4]">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#7A6B5D] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] rounded-xl shadow-xs"
                >
                  Confirm & Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT EMPLOYEE */}
      {showEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E8E0D4] overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#E8E0D4]">
              <h2 className="font-serif text-lg font-bold text-[#24201D]">
                {editingEmp ? 'Edit Employee Details' : 'Add New Employee'}
              </h2>
              <button onClick={() => setShowEmpModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={empForm.name}
                    onChange={e => setEmpForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="01711-XXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={empForm.phone}
                    onChange={e => setEmpForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Department</label>
                  <select
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={empForm.department}
                    onChange={e => setEmpForm(f => ({ ...f, department: e.target.value as any }))}
                  >
                    <option value="Production">Production</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Sales & Store">Sales & Store</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Cone Maker"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={empForm.designation}
                    onChange={e => setEmpForm(f => ({ ...f, designation: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Monthly Salary (৳)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none font-bold text-[#166534]"
                    value={empForm.monthlySalary}
                    onChange={e => setEmpForm(f => ({ ...f, monthlySalary: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Joining Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={empForm.joiningDate}
                    onChange={e => setEmpForm(f => ({ ...f, joiningDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Payment Method</label>
                  <select
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none"
                    value={empForm.paymentMethod}
                    onChange={e => setEmpForm(f => ({ ...f, paymentMethod: e.target.value as any }))}
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#24201D] block mb-1">Account No / Mobile</label>
                  <input
                    type="text"
                    placeholder="bKash or Bank A/C No"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E0D4] focus:border-[#720000] focus:outline-none font-mono"
                    value={empForm.accountNumber}
                    onChange={e => setEmpForm(f => ({ ...f, accountNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D4]">
                <button
                  type="button"
                  onClick={() => setShowEmpModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#7A6B5D] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#720000] hover:bg-[#5a0000] rounded-xl shadow-xs"
                >
                  {editingEmp ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: OFFICIAL PRINTABLE SALARY PAYSLIP / INVOICE */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E0D4] overflow-hidden">
            {/* Modal Controls (Not printed) */}
            <div className="px-6 py-3 bg-[#FAF8F3] flex items-center justify-between border-b border-[#E8E0D4] print:hidden">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#720000]" />
                <span className="font-bold text-xs text-[#24201D]">Official Salary Voucher Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#720000] text-white rounded-lg text-xs font-bold shadow-xs hover:bg-[#5a0000]"
                >
                  <Printer size={13} /> Print Voucher
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="p-1 rounded-lg hover:bg-gray-200">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Payslip Document */}
            <div className="p-8 space-y-6 text-[#24201D] bg-white">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-[#720000] pb-5">
                <div>
                  <img src={hennaLogo} alt="Henna Royalin" className="h-12 object-contain mb-1" />
                  <p className="text-xs text-[#7A6B5D]">100% Organic Henna Cone Studio & Logistics</p>
                  <p className="text-xs text-[#7A6B5D]">Dhaka & Narayanganj, Bangladesh · 01711-000001</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-md bg-red-50 text-[#720000] text-xs font-bold tracking-wider uppercase border border-red-200 block mb-1">
                    Salary Voucher / Payslip
                  </span>
                  <p className="font-mono font-bold text-sm text-[#24201D]">{selectedInvoice.voucherNo}</p>
                  <p className="text-xs text-[#7A6B5D]">Date: {selectedInvoice.paymentDate || 'Pending'}</p>
                </div>
              </div>

              {/* Employee & Pay Period Details Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E0D4] text-xs">
                <div>
                  <span className="text-[#7A6B5D] block text-[10px] uppercase font-bold">Employee Name</span>
                  <span className="font-bold text-sm text-[#24201D]">{selectedInvoice.employeeName}</span>
                  <span className="block text-[#7A6B5D] mt-0.5">{selectedInvoice.designation}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#7A6B5D] block text-[10px] uppercase font-bold">Pay Period / Month</span>
                  <span className="font-bold text-sm text-[#720000]">{selectedInvoice.month}</span>
                  <span className="block text-[#7A6B5D] mt-0.5">Method: {selectedInvoice.paymentMethod}</span>
                </div>
              </div>

              {/* Salary Breakdown Table */}
              <div className="border border-[#E8E0D4] rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF8F3] text-[#7A6B5D] font-bold border-b border-[#E8E0D4]">
                    <tr>
                      <th className="py-2.5 px-4">Earnings / Description</th>
                      <th className="py-2.5 px-4 text-right">Amount (৳)</th>
                      <th className="py-2.5 px-4">Deductions / Remarks</th>
                      <th className="py-2.5 px-4 text-right">Amount (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0D4]">
                    <tr>
                      <td className="py-3 px-4 font-semibold">Basic Monthly Salary</td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold">
                        ৳{selectedInvoice.baseSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {selectedInvoice.deductions > 0 ? (
                          <div>
                            <span className="font-medium text-red-600">Salary Deduction</span>
                            <p className="text-[10px] text-[#7A6B5D]">{selectedInvoice.deductionReason}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-red-600">
                        {selectedInvoice.deductions > 0 ? `-৳${selectedInvoice.deductions.toLocaleString()}` : '৳0'}
                      </td>
                    </tr>
                    {selectedInvoice.bonus > 0 && (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-emerald-700">Performance / Festival Bonus</td>
                        <td className="py-2.5 px-4 text-right tabular-nums font-bold text-emerald-700">
                          +৳{selectedInvoice.bonus.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-gray-400">—</td>
                        <td className="py-2.5 px-4 text-right text-gray-400">—</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-[#FAF8F3] border-t-2 border-[#720000] font-bold">
                    <tr>
                      <td className="py-3.5 px-4 text-sm uppercase text-[#720000]">Net Disbursed Salary</td>
                      <td colSpan={3} className="py-3.5 px-4 text-right text-base text-[#720000] tabular-nums">
                        ৳{selectedInvoice.netSalary.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {selectedInvoice.notes && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <span className="font-bold text-[#7A6B5D]">Notes: </span>
                  <span className="text-gray-700">{selectedInvoice.notes}</span>
                </div>
              )}

              {/* Signature Blocks */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#E8E0D4] text-xs">
                <div className="text-center">
                  <div className="h-10 border-b border-gray-400 mx-auto w-40"></div>
                  <p className="font-bold text-[#24201D] mt-1.5">Authorized Signatory</p>
                  <p className="text-[10px] text-[#7A6B5D]">Henna Royalin Management</p>
                </div>
                <div className="text-center">
                  <div className="h-10 border-b border-gray-400 mx-auto w-40"></div>
                  <p className="font-bold text-[#24201D] mt-1.5">Employee Signature</p>
                  <p className="text-[10px] text-[#7A6B5D]">Received with thanks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
