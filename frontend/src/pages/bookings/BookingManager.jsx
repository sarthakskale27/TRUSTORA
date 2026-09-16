import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  MoreVertical,
  Building2
} from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const BookingManager = () => {
  const { success, error } = useToast();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Booking Form
  const [newBooking, setNewBooking] = useState({
    property_id: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in: '',
    check_out: '',
    guests_count: 2,
    total_amount: 18000,
    status: 'confirmed',
    channel: 'direct'
  });

  const fetchBookingsAndProperties = async () => {
    setLoading(true);
    try {
      const [bRes, pRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/properties')
      ]);
      setBookings(bRes.data.bookings || []);
      const props = pRes.data.properties || [];
      setProperties(props);
      if (props.length > 0) {
        setNewBooking((prev) => ({ ...prev, property_id: props[0].id }));
      }
    } catch (e) {
      error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsAndProperties();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      success(`Booking status updated to ${newStatus}`);
      fetchBookingsAndProperties();
    } catch (e) {
      error('Failed to update booking status.');
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', newBooking);
      success('New reservation created successfully!');
      setShowCreateModal(false);
      fetchBookingsAndProperties();
    } catch (e) {
      error('Failed to create booking.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      (b.guest?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.property?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.booking_reference || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Bookings & Guest Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track reservations, guest communications, check-ins, and direct reservation billing.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Direct Booking Entry
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest name or ref..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Guest Info</th>
                <th className="py-4 px-6">Property</th>
                <th className="py-4 px-6">Stay Dates</th>
                <th className="py-4 px-6">Channel & Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No reservations matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Guest */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
                          {b.guest?.name ? b.guest.name[0] : 'G'}
                        </div>
                        <div>
                          <p className="font-bold text-white">{b.guest?.name || 'Guest'}</p>
                          <p className="text-[11px] text-slate-400">{b.guest?.phone || b.guest?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-200">{b.property?.title || 'Villa'}</p>
                      <p className="text-[10px] text-slate-500">{b.property?.city}</p>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-200">
                        {b.check_in} → {b.check_out}
                      </p>
                      <p className="text-[10px] text-slate-500">{b.nights_count || 2} nights • {b.guests_count || 2} guests</p>
                    </td>

                    {/* Channel & Total */}
                    <td className="py-4 px-6">
                      <p className="font-black text-emerald-400 text-sm">
                        ₹{b.total_amount?.toLocaleString()}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {b.channel || 'Direct'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          b.status === 'confirmed'
                            ? 'success'
                            : b.status === 'checked_in'
                            ? 'primary'
                            : b.status === 'checked_out'
                            ? 'default'
                            : 'danger'
                        }
                      >
                        {b.status?.replace('_', ' ')}
                      </Badge>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'checked_in')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold border border-emerald-500/30 transition-colors"
                          >
                            Check In
                          </button>
                        )}
                        {b.status === 'checked_in' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'checked_out')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-[11px] font-bold border border-indigo-500/30 transition-colors"
                          >
                            Check Out
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Record New Direct Reservation"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Property</label>
            <select
              value={newBooking.property_id}
              onChange={(e) => setNewBooking({ ...newBooking, property_id: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Guest Name</label>
              <input
                type="text"
                required
                value={newBooking.guest_name}
                onChange={(e) => setNewBooking({ ...newBooking, guest_name: e.target.value })}
                placeholder="Rohit Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Guest Phone</label>
              <input
                type="tel"
                value={newBooking.guest_phone}
                onChange={(e) => setNewBooking({ ...newBooking, guest_phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Check In Date</label>
              <input
                type="date"
                required
                value={newBooking.check_in}
                onChange={(e) => setNewBooking({ ...newBooking, check_in: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Check Out Date</label>
              <input
                type="date"
                required
                value={newBooking.check_out}
                onChange={(e) => setNewBooking({ ...newBooking, check_out: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Tariff (₹ INR)</label>
              <input
                type="number"
                required
                value={newBooking.total_amount}
                onChange={(e) => setNewBooking({ ...newBooking, total_amount: parseFloat(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Channel</label>
              <select
                value={newBooking.channel}
                onChange={(e) => setNewBooking({ ...newBooking, channel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="direct">Direct Walk-in / Phone</option>
                <option value="airbnb">Airbnb</option>
                <option value="booking">Booking.com</option>
                <option value="whatsapp">WhatsApp Inquiry</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
            >
              Save Reservation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
