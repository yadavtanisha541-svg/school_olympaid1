import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../api/client';
import {
  CreditCard,
  Building,
  QrCode,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit2,
  Save,
  Copy,
  Check,
  Eye,
  FileText,
  Printer,
  ShieldCheck,
  AlertCircle,
  Download,
  Upload,
  Users,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const SuperAdminPaymentManager = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'settings' | 'preview'

  // Bank & UPI Settings State
  const [bankSettings, setBankSettings] = useState({
    bank_name: 'State Bank of India',
    account_holder_name: 'OlympiadHub Official Organization',
    payee_name: 'OlympiadHub Education',
    account_number: '398450123984',
    ifsc_code: 'SBIN0005432',
    branch_name: 'Central Hub Branch, New Delhi',
    account_type: 'Current Account',
    upi_id: 'olympiadhub.edu@okaxis',
    upi_phone: '+91 98765 43210',
    upi_qr_url: '',
    instructions: 'Please transfer the exact total payable amount via UPI / IMPS / NEFT. After completing payment, enter your 12-digit UTR / Transaction Reference Number below to confirm and activate your package immediately.',
    is_active: 1
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0, pending_orders: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Order for Invoice / Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  // Fetch data
  useEffect(() => {
    fetchBankSettings();
    fetchOrders();
  }, []);

  const fetchBankSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await apiClient.get('/payment/bank-settings');
      if (res?.data) {
        setBankSettings(res.data);
      }
    } catch (e) {
      console.warn('Bank settings load error:', e);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await apiClient.get('/payment/orders');
      if (res?.data) {
        setOrders(res.data.orders || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (e) {
      console.warn('Orders load error:', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveBankSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await apiClient.post('/payment/bank-settings', bankSettings);
      if (res?.success) {
        setFeedback({ type: 'success', message: 'Bank details, UPI ID & QR settings saved into MySQL successfully!' });
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Failed to save settings.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error saving settings.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/payment/orders/${orderId}/status`, { status: newStatus });
      setFeedback({ type: 'success', message: `Order #${orderId} status updated to "${newStatus}".` });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) {
      alert(e.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await apiClient.delete(`/payment/orders/${orderId}`);
      setFeedback({ type: 'success', message: `Order #${orderId} deleted successfully.` });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (e) {
      alert(e.message || 'Failed to delete order');
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchStatus = statusFilter === 'all' || ord.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery = !q ||
        (ord.order_id && ord.order_id.toLowerCase().includes(q)) ||
        (ord.transaction_id && ord.transaction_id.toLowerCase().includes(q)) ||
        (ord.billing_name && ord.billing_name.toLowerCase().includes(q)) ||
        (ord.student_name && ord.student_name.toLowerCase().includes(q)) ||
        (ord.student_email && ord.student_email.toLowerCase().includes(q)) ||
        (ord.student_phone && ord.student_phone.toLowerCase().includes(q)) ||
        (ord.mobile_number && ord.mobile_number.toLowerCase().includes(q)) ||
        (ord.package_title && ord.package_title.toLowerCase().includes(q));
      return matchStatus && matchQuery;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-16 font-sans max-w-7xl mx-auto">
      
      {/* 1. Seamless Background Header (No Outer Box) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 py-2">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#f4eaf4] text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-2xs">
            <CreditCard className="w-6.5 h-6.5 text-[#80497D]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#422240] tracking-tight">
              Payment Gateway, QR Code &amp; Student Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Customize official bank account details, UPI ID, and QR code, and review all student payments with UTR codes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <Button
            variant="secondary"
            size="md"
            icon={RefreshCw}
            onClick={() => {
              fetchBankSettings();
              fetchOrders();
            }}
            loading={ordersLoading}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Building}
            onClick={() => setActiveTab('settings')}
          >
            Configure Bank &amp; UPI
          </Button>
        </div>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-xs ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span className="font-bold">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4 text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* 2. Top Stats Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-4.5 rounded-2xl border border-[#ebd7eb] shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
            ₹{Number(stats.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Verified &amp; confirmed orders</p>
        </div>
        <div className="bg-white p-4.5 rounded-2xl border border-[#ebd7eb] shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
          <h3 className="text-2xl font-black text-[#80497D] mt-1 font-mono">{orders.length}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">All student checkouts</p>
        </div>
        <div className="bg-white p-4.5 rounded-2xl border border-[#ebd7eb] shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active UPI ID</p>
          <h3 className="text-sm font-black text-slate-800 mt-2 font-mono truncate px-2">
            {bankSettings.upi_id || 'Not set'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Live in checkout</p>
        </div>
        <div className="bg-white p-4.5 rounded-2xl border border-[#ebd7eb] shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Bank</p>
          <h3 className="text-sm font-black text-slate-800 mt-2 truncate px-2">
            {bankSettings.bank_name || 'Not set'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{bankSettings.account_number ? `A/C: ••••${bankSettings.account_number.slice(-4)}` : 'Bank Transfer'}</p>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#ebd7eb] pb-3 overflow-x-auto">
        {[
          { id: 'orders', label: '📑 Student Orders & Payment Log', icon: DollarSign, count: orders.length },
          { id: 'settings', label: '💳 Bank, UPI & QR Customizer', icon: Building },
          { id: 'preview', label: '👁️ Live Student Checkout Preview', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#80497D] text-white shadow-md shadow-[#80497D]/20 font-extrabold'
                  : 'bg-white text-slate-600 hover:bg-[#faf6fa] border border-[#ebd7eb]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STUDENT ORDERS & PAYMENT LOG                                       */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#ebd7eb] p-6 sm:p-7 shadow-xs space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Student Name, UTR Code, Email, Phone..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#80497D]"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending Verification</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <span className="text-xs font-bold text-slate-400">
                Showing {filteredOrders.length} records
              </span>
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
                <DollarSign className="w-8 h-8 opacity-40" />
              </div>
              <h4 className="text-sm font-black text-slate-700">No Student Orders Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery ? 'No transactions match your search filter.' : 'When students buy online classes, concept packages, or workbooks, their payment entries and UTR codes will appear here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
              <table className="w-full text-left text-xs border-collapse min-w-[1050px]">
                <thead className="bg-[#faf5fa] border-b border-slate-200 text-[#6d3a68] font-black uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-[160px]">Order ID &amp; Date</th>
                    <th className="py-3.5 px-4 w-[210px]">Student / Billing Info</th>
                    <th className="py-3.5 px-4 min-w-[200px]">Package Purchased</th>
                    <th className="py-3.5 px-4 w-[110px]">Amount Paid</th>
                    <th className="py-3.5 px-4 w-[140px]">Payment Method</th>
                    <th className="py-3.5 px-4 w-[180px]">Student's UTR / Txn Code</th>
                    <th className="py-3.5 px-4 w-[130px]">Status</th>
                    <th className="py-3.5 px-4 w-[110px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#fdfaff] transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-mono font-bold text-[#80497D] bg-[#f7f0f7] px-2 py-0.5 rounded-md border border-[#ebd7eb] inline-block text-[11px]">
                          {ord.order_id}
                        </span>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{ord.created_at || 'Just now'}</span>
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-[#4e2a4a] text-xs">
                          {ord.billing_name || ord.student_name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[190px]" title={ord.student_email}>
                          {ord.student_email}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-mono text-slate-400">{ord.student_phone || ord.mobile_number}</span>
                          {ord.student_class && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-50 text-[#80497D] text-[9px] font-bold border border-purple-200">
                              {ord.student_class}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Package Name */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-bold text-slate-900 leading-snug">
                          {ord.package_title}
                        </div>
                        {ord.subject_name && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-100">
                            {ord.subject_name}
                          </span>
                        )}
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="font-mono font-black text-emerald-700 text-sm">
                          ₹{Number(ord.total_amount || ord.price || 0).toFixed(2)}
                        </div>
                        {ord.gst_amount > 0 && (
                          <div className="text-[10px] text-slate-400 font-medium">
                            GST: ₹{Number(ord.gst_amount).toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200/80 whitespace-nowrap">
                          {ord.payment_method || 'UPI Transfer'}
                        </span>
                        {ord.payer_name && (
                          <div className="text-[10px] text-slate-500 mt-1">
                            Payer: <span className="font-semibold text-slate-700">{ord.payer_name}</span>
                          </div>
                        )}
                      </td>

                      {/* UTR / Transaction Code */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50/80 border border-amber-200/80 rounded-lg max-w-full">
                          <span className="font-mono font-bold text-amber-950 text-xs truncate">
                            {ord.transaction_id || 'N/A'}
                          </span>
                          {ord.transaction_id && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(ord.transaction_id, `utr_${ord.id}`)}
                              className="p-1 hover:bg-amber-200 text-amber-900 rounded text-[10px] transition-colors cursor-pointer shrink-0"
                              title="Copy UTR code"
                            >
                              {copiedKey === `utr_${ord.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          ord.status === 'completed' || ord.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            ord.status === 'completed' || ord.status === 'approved' ? 'bg-emerald-600' : ord.status === 'pending' ? 'bg-amber-600' : 'bg-rose-600'
                          }`} />
                          <span>{ord.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right align-top whitespace-nowrap space-x-1">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#80497D] hover:text-white text-slate-600 transition-colors cursor-pointer"
                          title="View Full Invoice & Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {ord.status !== 'completed' && ord.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(ord.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[10px] transition-colors cursor-pointer"
                            title="Approve Order"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BANK, UPI & QR CODE CUSTOMIZER                                     */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-[#ebd7eb] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#422240] tracking-tight">
                Configure Official Bank Account, UPI ID &amp; QR Code
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Whatever you configure here is saved in MySQL and immediately displayed on the Student Checkout Page.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('preview')}>
              👁️ View Student Preview
            </Button>
          </div>

          <form onSubmit={handleSaveBankSettings} className="space-y-6 text-xs max-w-4xl">
            {/* 1. UPI & QR Code Settings (Live Customizer) */}
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border-2 border-amber-300 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-black text-amber-950 text-sm flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-600" />
                  <span>UPI &amp; QR Code Scanner Settings</span>
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase">
                  Live in Student Checkout
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Official UPI ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankSettings.upi_id}
                      onChange={(e) => setBankSettings({ ...bankSettings, upi_id: e.target.value })}
                      placeholder="e.g. olympiadhub.edu@okaxis"
                      className="w-full px-3.5 py-2 bg-white border border-amber-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Students can copy this UPI ID to pay via GPay / PhonePe / Paytm.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Registered Mobile / Merchant
                      </label>
                      <input
                        type="text"
                        value={bankSettings.upi_phone}
                        onChange={(e) => setBankSettings({ ...bankSettings, upi_phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-medium text-slate-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Payee / Merchant Name
                      </label>
                      <input
                        type="text"
                        value={bankSettings.payee_name || ''}
                        onChange={(e) => setBankSettings({ ...bankSettings, payee_name: e.target.value })}
                        placeholder="e.g. OlympiadHub"
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-medium text-slate-900 text-xs"
                      />
                    </div>
                  </div>

                  {/* QR Code Upload / Link */}
                  <div className="p-3.5 bg-white rounded-xl border border-amber-300 space-y-2.5">
                    <label className="text-[11px] font-black text-slate-800 block">
                      Change / Upload Official QR Code Image
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <label className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload QR File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setBankSettings({ ...bankSettings, upi_qr_url: reader.result });
                                setFeedback({ type: 'success', message: 'QR Code image loaded! Click "Save Payment & Bank Settings in MySQL" to apply.' });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      <input
                        type="url"
                        value={bankSettings.upi_qr_url || ''}
                        onChange={(e) => setBankSettings({ ...bankSettings, upi_qr_url: e.target.value })}
                        placeholder="Or paste QR Code Image URL..."
                        className="w-full flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] outline-none"
                      />

                      {bankSettings.upi_qr_url && (
                        <button
                          type="button"
                          onClick={() => setBankSettings({ ...bankSettings, upi_qr_url: '' })}
                          className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold rounded-xl shrink-0 cursor-pointer"
                          title="Reset to Auto Dynamic QR"
                        >
                          Reset QR
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Upload your official PhonePe/GPay/Paytm QR code image, or leave blank to automatically generate a dynamic UPI QR code.
                    </p>
                  </div>
                </div>

                {/* Right Column: Live QR Code Card Preview (Exact Image Match) */}
                <div className="lg:col-span-5 bg-white p-4 rounded-2xl border-2 border-[#f5b82e] shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                  <span className="px-3 py-1 rounded-full bg-[#f5b82e] text-[#321630] font-black text-[10px] uppercase tracking-wider shadow-2xs">
                    OFFICIAL VERIFIED UPI PAYMENT
                  </span>

                  <div className="w-44 h-44 bg-slate-900 rounded-2xl p-2.5 flex items-center justify-center text-white relative shadow-inner overflow-hidden border-2 border-slate-800">
                    {bankSettings.upi_qr_url ? (
                      <img
                        src={bankSettings.upi_qr_url}
                        alt="Official UPI QR Code"
                        className="w-full h-full object-contain rounded-xl bg-white p-1"
                      />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${bankSettings.upi_id || 'olympiadhub.edu@okaxis'}&pn=${encodeURIComponent(bankSettings.payee_name || 'OlympiadHub')}&cu=INR`)}`}
                        alt="Dynamic UPI QR Code"
                        className="w-full h-full object-contain rounded-xl bg-white p-1"
                      />
                    )}
                    <span className="absolute bottom-2 text-[8px] font-black bg-[#f5b82e] text-slate-950 px-2.5 py-0.5 rounded shadow-xs">
                      SCAN TO PAY
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-700">
                    Scan with GPay / PhonePe / Paytm
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Bank Account Details */}
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl border-2 border-indigo-200 space-y-4">
              <h3 className="font-black text-indigo-950 text-sm flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <span>Bank Account Details (IMPS / NEFT / RTGS)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankSettings.bank_name}
                    onChange={(e) => setBankSettings({ ...bankSettings, bank_name: e.target.value })}
                    placeholder="e.g. State Bank of India / HDFC"
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={bankSettings.account_holder_name}
                    onChange={(e) => setBankSettings({ ...bankSettings, account_holder_name: e.target.value })}
                    placeholder="e.g. OlympiadHub Official Organization"
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankSettings.account_number}
                    onChange={(e) => setBankSettings({ ...bankSettings, account_number: e.target.value })}
                    placeholder="e.g. 398450123984"
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={bankSettings.ifsc_code}
                    onChange={(e) => setBankSettings({ ...bankSettings, ifsc_code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SBIN0005432"
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl font-mono font-black uppercase text-indigo-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={bankSettings.branch_name}
                    onChange={(e) => setBankSettings({ ...bankSettings, branch_name: e.target.value })}
                    placeholder="e.g. Central Hub Branch, New Delhi"
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Account Type</label>
                  <select
                    value={bankSettings.account_type}
                    onChange={(e) => setBankSettings({ ...bankSettings, account_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl font-medium"
                  >
                    <option value="Current Account">Current Account</option>
                    <option value="Savings Account">Savings Account</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Instructions Text */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Payment Verification Instructions (Shown to Students)
              </label>
              <textarea
                rows={3}
                value={bankSettings.instructions}
                onChange={(e) => setBankSettings({ ...bankSettings, instructions: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#80497D]"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                icon={Save}
                loading={saveLoading}
              >
                Save Payment &amp; Bank Settings in MySQL
              </Button>
              <Button
                variant="secondary"
                size="lg"
                type="button"
                onClick={fetchBankSettings}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LIVE STUDENT CHECKOUT PREVIEW                                      */}
      {/* ========================================================================= */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-3xl border border-[#ebd7eb] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#422240] tracking-tight">
                Live Student Payment Step Preview (Exact match with Student Portal)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                This is the exact view students see when completing their course/package purchase.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('settings')}>
              Edit Details
            </Button>
          </div>

          <div className="max-w-2xl mx-auto p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-[#4e2a4a]">Payment &amp; Bank Transfer Details</h3>
              <p className="text-xs text-slate-500">Transfer to the Official Organization Account below, then enter your UTR / Transaction Code to verify.</p>
            </div>

            {/* UPI Box Preview */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border-2 border-amber-300 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#f5b82e] text-[#321630] font-black text-[10px] uppercase">
                  OFFICIAL VERIFIED UPI PAYMENT
                </span>
                <span className="text-xs font-black text-slate-800">
                  Pay Exact: <span className="text-emerald-700 text-sm">₹2,948.82</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-32 h-32 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white relative shadow-inner">
                    <QrCode className="w-24 h-24 text-white" />
                    <span className="absolute bottom-1 text-[8px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                      SCAN TO PAY
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600">Scan with GPay / PhonePe / Paytm</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">OFFICIAL UPI ID</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-slate-900 text-xs">{bankSettings.upi_id || 'olympiadhub.edu@okaxis'}</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[9px] font-bold">Copy</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">REGISTERED MOBILE / MERCHANT</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-slate-900 text-xs">{bankSettings.upi_phone || '+91 98765 43210'}</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Instant Verification
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mandatory Lock Box Preview */}
            <div className="bg-white rounded-2xl border-2 border-[#f5b82e] p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <div className="w-5 h-5 rounded-full bg-[#f5b82e] text-slate-950 font-black text-xs flex items-center justify-center">!</div>
                <h4 className="text-xs font-black text-slate-900">Step 2: Enter Payment Confirmation Details (Mandatory)</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <input disabled placeholder="e.g. 423985019284 / UPI Ref No. *" className="w-full px-3 py-2 bg-amber-50/40 border border-[#f5b82e] rounded-xl font-mono text-[11px]" />
                <input disabled placeholder="Payer / Account Holder Name *" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW FULL INVOICE / RECEIPT                                        */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">Payment Invoice &amp; Verification</h3>
                  <p className="text-[10px] font-mono text-slate-400">Order ID: {selectedOrder.order_id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {/* Invoice Breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Student Name:</span>
                <span className="font-black text-slate-900">{selectedOrder.billing_name || selectedOrder.student_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Student Email:</span>
                <span className="font-bold text-slate-800">{selectedOrder.student_email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Mobile Phone:</span>
                <span className="font-mono font-bold text-slate-800">{selectedOrder.mobile_number || selectedOrder.student_phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Student Grade / Class:</span>
                <span className="font-bold text-[#80497D]">{selectedOrder.student_class || 'Class 6'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Address / City:</span>
                <span className="font-medium text-slate-700 text-right">{selectedOrder.billing_address ? `${selectedOrder.billing_address}, ${selectedOrder.city}` : 'N/A'}</span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                <span className="text-slate-500 font-bold">Course / Package:</span>
                <span className="font-black text-slate-900 text-right max-w-[200px] truncate">{selectedOrder.package_title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Payment Method:</span>
                <span className="font-bold text-slate-800">{selectedOrder.payment_method || 'UPI'}</span>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <span className="text-amber-900 font-bold">Student's Entered UTR / Txn Code:</span>
                <span className="font-mono font-black text-amber-950 text-xs">{selectedOrder.transaction_id || 'N/A'}</span>
              </div>

              {selectedOrder.payer_name && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Payer Account Name:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.payer_name}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm font-black">
                <span className="text-slate-800">Total Amount Paid:</span>
                <span className="text-emerald-700">₹{Number(selectedOrder.total_amount || selectedOrder.price).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {selectedOrder.status !== 'completed' && selectedOrder.status !== 'approved' ? (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    Approve &amp; Activate
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full">
                    ✓ Verified &amp; Active
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'rejected')}
                  className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Reject
                </button>
              </div>

              <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminPaymentManager;
