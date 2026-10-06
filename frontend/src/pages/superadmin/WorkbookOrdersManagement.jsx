import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  ShoppingBag,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  DollarSign,
  Package,
  Truck,
  Check,
  X
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const WorkbookOrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/workbooks/orders');
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (e) {
      console.error('Error fetching workbook orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await apiClient.post(`/workbooks/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (e) {
      console.error('Failed to update order status:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/workbooks/orders/${id}`);
      setOrders((prev) => prev.filter((item) => item.id !== id));
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    } catch (e) {
      console.error('Failed to delete order:', e);
    }
  };

  const filteredOrders = (orders || []).filter((item) => {
    if (!item) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    const matchesSearch = !q ||
      (item.order_id && (item.order_id || '').toLowerCase().includes(q)) ||
      (item.name && (item.name || '').toLowerCase().includes(q)) ||
      (item.email && (item.email || '').toLowerCase().includes(q)) ||
      (item.whatsapp && (item.whatsapp || '').toLowerCase().includes(q)) ||
      (item.class_level && (item.class_level || '').toLowerCase().includes(q));

    const matchesFormat = filterFormat === 'All' || item.format === filterFormat;
    const matchesStatus = filterStatus === 'All' || (item.status || 'confirmed') === filterStatus;

    return matchesSearch && matchesFormat && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, ord) => sum + parseFloat(ord.grand_total || 0), 0);
  const physicalCount = orders.filter((o) => o.format === 'physical').length;
  const digitalCount = orders.filter((o) => o.format === 'digital').length;

  const exportCsv = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Customer Name', 'Email', 'WhatsApp', 'Class', 'Format', 'Subtotal', 'Delivery', 'Grand Total', 'Status', 'Date'];
    const rows = filteredOrders.map((item) => [
      `"${item.order_id || item.id}"`,
      `"${item.name || ''}"`,
      `"${item.email || ''}"`,
      `"${item.whatsapp || ''}"`,
      `"${item.class_level || ''}"`,
      `"${item.format || ''}"`,
      `"${item.subtotal || 0}"`,
      `"${item.delivery_charge || 0}"`,
      `"${item.grand_total || 0}"`,
      `"${item.status || 'confirmed'}"`,
      `"${item.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SkillRise_Workbook_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-xs">
            <BookOpen className="w-7 h-7 text-[#80497D]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#422240] tracking-tight">
              Workbook Orders &amp; Dispatches
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Track student &amp; school workbook purchases, digital study kits, physical courier deliveries, and payment summaries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={fetchOrders}
            className="px-4 py-2.5 bg-white border border-[#edd6ed] text-[#6d3a68] hover:bg-[#faf5fa] rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={exportCsv}
            disabled={orders.length === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-blue-950/20 disabled:opacity-50 border border-[#7854d6]/30"
          >
            <Download className="w-4 h-4 text-[#e7b84b]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f4eaf4] text-[#80497D] flex items-center justify-center border border-[#ebd7eb] shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl sm:text-3xl font-black text-[#80497D] mt-0.5 font-mono">{orders.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Total placed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Volume</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5 font-mono">₹{totalRevenue.toLocaleString()}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Total revenue</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Physical Couriers</p>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-600 mt-0.5 font-mono">{physicalCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Printed books</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instant E-Books</p>
            <h3 className="text-2xl sm:text-3xl font-black text-purple-600 mt-0.5 font-mono">{digitalCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">PDF editions</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#edd6ed] shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, email, WhatsApp, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-sm font-medium text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68]"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[#edd6ed] rounded-xl text-sm font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] cursor-pointer"
          >
            <option value="All">All Formats</option>
            <option value="physical">Physical Book (+ Delivery)</option>
            <option value="digital">Digital PDF Edition</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[#edd6ed] rounded-xl text-sm font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#edd6ed] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2a1b29]">
            <thead className="bg-[#faf5fa] text-[#4e2a4a] font-bold uppercase tracking-wider text-xs border-b border-[#edd6ed]">
              <tr>
                <th className="py-3 px-4">Order ID &amp; Date</th>
                <th className="py-3 px-4">Customer &amp; Contact</th>
                <th className="py-3 px-4">Class &amp; Format</th>
                <th className="py-3 px-4">Books &amp; Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fdf2f8]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#6d3a68] mb-2" />
                    <span>Loading workbook orders from database...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-[#4e2a4a]">No workbook orders found.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {searchQuery ? 'Try adjusting your search query.' : 'New orders placed from the Workbook store will appear here automatically.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const status = ord.status || 'confirmed';
                  const books = Array.isArray(ord.books) ? ord.books : [];
                  return (
                    <tr key={ord.id} className="hover:bg-[#faf5fa] transition-colors">
                      <td className="py-3 px-4 align-top">
                        <p className="font-bold text-[#4e2a4a] font-mono text-xs">{ord.order_id || `ORD-#${ord.id}`}</p>
                        <span className="text-[10px] text-slate-400">
                          {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top space-y-0.5">
                        <p className="font-bold text-slate-800 text-sm leading-tight">{ord.name}</p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#d9775b]" />
                          <span className="select-all">{ord.email}</span>
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#d9775b]" />
                          <span className="select-all">{ord.whatsapp}</span>
                        </p>
                      </td>

                      <td className="py-3 px-4 align-top space-y-1">
                        <span className="inline-block font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {ord.class_level || 'General'}
                        </span>
                        <div>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            ord.format === 'physical'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {ord.format === 'physical' ? <Truck className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                            {ord.format === 'physical' ? 'Physical Dispatch' : 'Digital PDF'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top">
                        {books.length > 0 ? (
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-800 text-[11px]">
                              {books.length} {books.length === 1 ? 'Book' : 'Books'}
                            </p>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {books.map((b, idx) => (
                                <span key={idx} className="text-[9px] bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] px-1.5 py-0.5 rounded truncate max-w-[180px]">
                                  {b.title || b.subject || 'Workbook'}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Full Standard Pack</span>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <p className="font-black text-emerald-700 text-sm">₹{parseFloat(ord.grand_total || 0).toLocaleString()}</p>
                        {parseFloat(ord.delivery_charge || 0) > 0 && (
                          <span className="text-[9px] text-slate-400 block">
                            (incl. ₹{ord.delivery_charge} delivery)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : status === 'shipped'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : status === 'processing'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : status === 'confirmed'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="py-3 px-4 align-top text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 text-[#6d3a68] hover:bg-[#f4ebf4] rounded-sm transition-colors cursor-pointer"
                          title="View Order Details & Shipping Address"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(ord.id, status === 'shipped' ? 'delivered' : 'shipped')}
                          disabled={actionLoading === ord.id}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors cursor-pointer"
                          title="Advance Dispatch Status"
                        >
                          <Truck className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(ord.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Workbook Order Summary"
        maxWidth="max-w-xl"
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs text-[#2a1b29]">
            <div className="p-4 bg-[#faf5fa] rounded-sm border border-[#edd6ed] flex items-center justify-between">
              <div>
                <p className="text-base font-black text-[#4e2a4a] font-mono">{selectedOrder.order_id || `ORD-#${selectedOrder.id}`}</p>
                <p className="text-xs text-slate-500">Ordered by {selectedOrder.name} &bull; {selectedOrder.class_level}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold capitalize">
                {selectedOrder.status || 'confirmed'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-bold block">Email:</span>
                <p className="font-semibold select-all text-slate-800">{selectedOrder.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">WhatsApp Phone:</span>
                <p className="font-semibold select-all text-slate-800">{selectedOrder.whatsapp}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Order Format:</span>
                <p className="font-semibold text-slate-800 uppercase">{selectedOrder.format}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Order Date:</span>
                <p className="font-semibold text-slate-800">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>

            {/* Books Ordered */}
            <div className="p-3 bg-white rounded-sm border border-[#edd6ed]">
              <span className="text-slate-500 font-bold block mb-2">Books in this Order:</span>
              <div className="space-y-1.5">
                {Array.isArray(selectedOrder.books) && selectedOrder.books.length > 0 ? (
                  selectedOrder.books.map((b, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                      <span className="font-medium text-slate-700">{b.title || b.subject || 'Workbook'}</span>
                      <span className="font-bold text-[#6d3a68]">₹{b.price || (selectedOrder.format === 'physical' ? 249 : 149)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs">Standard Olympiad Kit</p>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#4e2a4a]">
                <span>Grand Total:</span>
                <span className="text-emerald-700">₹{parseFloat(selectedOrder.grand_total || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Shipping Address for Physical Delivery */}
            {selectedOrder.format === 'physical' && selectedOrder.address && (
              <div className="p-3 bg-amber-50 rounded-sm border border-amber-200">
                <span className="text-amber-800 font-bold block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address for Courier:
                </span>
                <p className="text-slate-700 font-medium whitespace-pre-wrap">
                  {typeof selectedOrder.address === 'string'
                    ? selectedOrder.address
                    : `${selectedOrder.address.street || ''}, ${selectedOrder.address.city || ''}, ${selectedOrder.address.state || ''} - ${selectedOrder.address.pincode || ''}`}
                </p>
              </div>
            )}

            {/* Quick Status Changers */}
            <div className="pt-2 flex items-center justify-between border-t border-[#edd6ed]">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Update Status:</span>
                {['processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold capitalize cursor-pointer"
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 bg-[#6d3a68] text-white hover:bg-[#5c3158] rounded-sm text-xs font-bold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
