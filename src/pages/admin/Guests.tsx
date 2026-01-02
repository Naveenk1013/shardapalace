import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Users, Search, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

interface Guest {
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  address: string | null;
  idType: string | null;
  idNumber: string | null;
  _count?: { bookings: number };
}

const API_URL = 'http://localhost:3001/api';

const Guests = () => {
  const { token } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    idType: '',
    idNumber: '',
  });

  const fetchGuests = useCallback(async () => {
    try {
      const url = search 
        ? `${API_URL}/guests?search=${encodeURIComponent(search)}`
        : `${API_URL}/guests`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setGuests(data);
    } catch {
      setError('Failed to load guests');
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const openModal = (guest?: Guest) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        name: guest.name,
        mobile: guest.mobile,
        email: guest.email || '',
        address: guest.address || '',
        idType: guest.idType || '',
        idNumber: guest.idNumber || '',
      });
    } else {
      setEditingGuest(null);
      setFormData({ name: '', mobile: '', email: '', address: '', idType: '', idNumber: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGuest(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const method = editingGuest ? 'PUT' : 'POST';
    const url = editingGuest ? `${API_URL}/guests/${editingGuest.id}` : `${API_URL}/guests`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      closeModal();
      fetchGuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save guest');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      const res = await fetch(`${API_URL}/guests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      fetchGuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guest');
    }
  };

  if (loading) {
    return <div className="admin-page"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1><Users size={28} style={{ marginRight: 10, verticalAlign: 'middle' }} />Guests</h1>
          <p className="subtitle">Manage guest profiles and contact information</p>
        </div>
        <button className="add-btn" onClick={() => openModal()}>
          <Plus size={18} /> Add Guest
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            type="text"
            placeholder="Search by name, mobile, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 6, border: '1px solid #ddd', fontSize: '0.95rem' }}
          />
        </div>
      </div>

      <div className="data-table">
        {guests.length === 0 ? (
          <div className="empty-state">No guests found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>ID Proof</th>
                <th>Bookings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id}>
                  <td><strong>{guest.name}</strong></td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span><Phone size={14} style={{ marginRight: 5 }} />{guest.mobile}</span>
                      {guest.email && <span><Mail size={14} style={{ marginRight: 5 }} />{guest.email}</span>}
                    </div>
                  </td>
                  <td>{guest.idType ? `${guest.idType}: ${guest.idNumber}` : '-'}</td>
                  <td>{guest._count?.bookings ?? 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => openModal(guest)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(guest.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingGuest ? 'Edit Guest' : 'Add Guest'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div className="form-group">
                  <label>ID Type</label>
                  <select
                    value={formData.idType}
                    onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="AADHAAR">Aadhaar</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="VOTER_ID">Voter ID</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Number</label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">{editingGuest ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guests;
