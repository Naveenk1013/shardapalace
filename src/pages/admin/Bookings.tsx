import { useState, useEffect, useCallback } from 'react';
import { Plus, CalendarDays, LogIn, LogOut, X, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

interface Guest {
  id: number;
  name: string;
  mobile: string;
}

interface RoomType {
  id: number;
  name: string;
  basePrice: number;
}

interface Room {
  id: number;
  number: string;
  floor: number;
  status: string;
  roomType: RoomType;
}

interface Booking {
  id: number;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  guest: Guest;
  room: Room | null;
}

const API_URL = 'http://localhost:3001/api';

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'info',
  CHECKED_IN: 'success',
  CHECKED_OUT: 'warning',
  CANCELLED: 'danger',
};

const Bookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    guestId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    totalAmount: '',
    paidAmount: '0',
  });

  const fetchData = useCallback(async () => {
    try {
      const [bookingsRes, guestsRes, roomsRes] = await Promise.all([
        fetch(`${API_URL}/bookings${filterStatus ? `?status=${filterStatus}` : ''}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/guests`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!bookingsRes.ok) throw new Error('Failed to fetch');

      const [bookingsData, guestsData, roomsData] = await Promise.all([
        bookingsRes.json(),
        guestsRes.json(),
        roomsRes.json(),
      ]);
      setBookings(bookingsData);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [token, filterStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setFormData({
      guestId: '',
      roomId: '',
      checkIn: today,
      checkOut: tomorrow,
      totalAmount: '',
      paidAmount: '0',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      closeModal();
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    }
  };

  const handleCheckIn = async (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking?.room) {
      setError('Please assign a room before check-in');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/bookings/${id}/check-in`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to check in');
      }

      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check in');
    }
  };

  const handleCheckOut = async (id: number) => {
    if (!confirm('Confirm check-out for this booking?')) return;

    try {
      const res = await fetch(`${API_URL}/bookings/${id}/check-out`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to check out');
      }

      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check out');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this booking?')) return;

    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to cancel');
      }

      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const vacantRooms = rooms.filter(r => r.status === 'VACANT');

  if (loading) {
    return <div className="admin-page"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1><CalendarDays size={28} style={{ marginRight: 10, verticalAlign: 'middle' }} />Bookings</h1>
          <p className="subtitle">Manage reservations, check-ins and check-outs</p>
        </div>
        <button className="add-btn" onClick={openModal}>
          <Plus size={18} /> New Booking
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: 6, border: '1px solid #ddd' }}
        >
          <option value="">All Status</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="data-table">
        {bookings.length === 0 ? (
          <div className="empty-state">No bookings found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.guest.name}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{booking.guest.mobile}</small>
                  </td>
                  <td>
                    {booking.room ? (
                      <span>{booking.room.number} ({booking.room.roomType.name})</span>
                    ) : (
                      <span style={{ color: '#999' }}>Not Assigned</span>
                    )}
                  </td>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td>{formatDate(booking.checkOut)}</td>
                  <td>
                    ₹{booking.totalAmount.toLocaleString()}
                    {booking.paidAmount < booking.totalAmount && (
                      <small style={{ color: '#d32f2f', display: 'block' }}>
                        Due: ₹{(booking.totalAmount - booking.paidAmount).toLocaleString()}
                      </small>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_COLORS[booking.status]}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {booking.status === 'CONFIRMED' && (
                        <>
                          <button
                            className="action-btn edit"
                            onClick={() => handleCheckIn(booking.id)}
                            title="Check In"
                          >
                            <LogIn size={16} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleCancel(booking.id)}
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {booking.status === 'CHECKED_IN' && (
                        <button
                          className="action-btn edit"
                          onClick={() => handleCheckOut(booking.id)}
                          title="Check Out"
                          style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                        >
                          <LogOut size={16} />
                        </button>
                      )}
                      {(booking.status === 'CHECKED_OUT' || booking.status === 'CANCELLED') && (
                        <button className="action-btn" title="View" style={{ backgroundColor: '#f5f5f5' }}>
                          <Eye size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h2>New Booking</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Guest *</label>
                <select
                  value={formData.guestId}
                  onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                  required
                >
                  <option value="">Select Guest</option>
                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.name} ({guest.mobile})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Room</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => {
                    const room = rooms.find(r => r.id === parseInt(e.target.value));
                    setFormData({
                      ...formData,
                      roomId: e.target.value,
                      totalAmount: room ? room.roomType.basePrice.toString() : formData.totalAmount,
                    });
                  }}
                >
                  <option value="">Assign Later</option>
                  {vacantRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.number} - {room.roomType.name} (₹{room.roomType.basePrice})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div className="form-group">
                  <label>Check-in *</label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Check-out *</label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div className="form-group">
                  <label>Total Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Advance Paid (₹)</label>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">Create Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
