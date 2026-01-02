import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Hotel } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

interface RoomType {
  id: number;
  name: string;
  basePrice: number;
  maxOccupancy: number;
  _count?: { rooms: number };
}

const API_URL = 'http://localhost:3001/api';

const RoomTypes = () => {
  const { token } = useAuth();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<RoomType | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    maxOccupancy: '2',
  });

  const fetchRoomTypes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/room-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRoomTypes(data);
    } catch {
      setError('Failed to load room types');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const openModal = (roomType?: RoomType) => {
    if (roomType) {
      setEditingType(roomType);
      setFormData({
        name: roomType.name,
        basePrice: roomType.basePrice.toString(),
        maxOccupancy: roomType.maxOccupancy.toString(),
      });
    } else {
      setEditingType(null);
      setFormData({ name: '', basePrice: '', maxOccupancy: '2' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: '', basePrice: '', maxOccupancy: '2' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const method = editingType ? 'PUT' : 'POST';
    const url = editingType 
      ? `${API_URL}/room-types/${editingType.id}` 
      : `${API_URL}/room-types`;

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
      fetchRoomTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save room type');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room type?')) return;

    try {
      const res = await fetch(`${API_URL}/room-types/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      fetchRoomTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room type');
    }
  };

  if (loading) {
    return <div className="admin-page"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1><Hotel size={28} style={{ marginRight: 10, verticalAlign: 'middle' }} />Room Types</h1>
          <p className="subtitle">Manage room categories and base pricing</p>
        </div>
        <button className="add-btn" onClick={() => openModal()}>
          <Plus size={18} /> Add Room Type
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="data-table">
        {roomTypes.length === 0 ? (
          <div className="empty-state">No room types found. Add one to get started!</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Base Price (₹)</th>
                <th>Max Occupancy</th>
                <th>Rooms</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((type) => (
                <tr key={type.id}>
                  <td><strong>{type.name}</strong></td>
                  <td>₹{type.basePrice.toLocaleString()}</td>
                  <td>{type.maxOccupancy} guests</td>
                  <td>{type._count?.rooms ?? 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => openModal(type)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(type.id)} title="Delete">
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
            <h2>{editingType ? 'Edit Room Type' : 'Add Room Type'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Deluxe, Suite"
                  required
                />
              </div>
              <div className="form-group">
                <label>Base Price (₹)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="e.g. 2500"
                  required
                />
              </div>
              <div className="form-group">
                <label>Max Occupancy</label>
                <input
                  type="number"
                  value={formData.maxOccupancy}
                  onChange={(e) => setFormData({ ...formData, maxOccupancy: e.target.value })}
                  min="1"
                  max="10"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">{editingType ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypes;
