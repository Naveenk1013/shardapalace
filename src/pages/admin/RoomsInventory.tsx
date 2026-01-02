import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, DoorOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

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
  typeId: number;
  roomType: RoomType;
}

const API_URL = 'http://localhost:3001/api';

const STATUS_OPTIONS = ['VACANT', 'OCCUPIED', 'DIRTY', 'MAINTENANCE'];
const STATUS_COLORS: Record<string, string> = {
  VACANT: 'success',
  OCCUPIED: 'info',
  DIRTY: 'warning',
  MAINTENANCE: 'danger',
};

const RoomsInventory = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    number: '',
    floor: '1',
    typeId: '',
    status: 'VACANT',
  });

  const fetchData = useCallback(async () => {
    try {
      const [roomsRes, typesRes] = await Promise.all([
        fetch(`${API_URL}/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/room-types`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!roomsRes.ok || !typesRes.ok) throw new Error('Failed to fetch');

      const [roomsData, typesData] = await Promise.all([roomsRes.json(), typesRes.json()]);
      setRooms(roomsData);
      setRoomTypes(typesData);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        number: room.number,
        floor: room.floor.toString(),
        typeId: room.typeId.toString(),
        status: room.status,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        number: '',
        floor: '1',
        typeId: roomTypes[0]?.id.toString() || '',
        status: 'VACANT',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const method = editingRoom ? 'PUT' : 'POST';
    const url = editingRoom ? `${API_URL}/rooms/${editingRoom.id}` : `${API_URL}/rooms`;

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
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save room');
    }
  };

  const handleStatusChange = async (roomId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/rooms/${roomId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      fetchData();
    } catch {
      setError('Failed to update room status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const res = await fetch(`${API_URL}/rooms/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (filterType && room.typeId !== parseInt(filterType)) return false;
    if (filterStatus && room.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return <div className="admin-page"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1><DoorOpen size={28} style={{ marginRight: 10, verticalAlign: 'middle' }} />Rooms Inventory</h1>
          <p className="subtitle">Manage individual rooms and their status</p>
        </div>
        <button className="add-btn" onClick={() => openModal()}>
          <Plus size={18} /> Add Room
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: 6, border: '1px solid #ddd' }}
        >
          <option value="">All Types</option>
          {roomTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: 6, border: '1px solid #ddd' }}
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="data-table">
        {filteredRooms.length === 0 ? (
          <div className="empty-state">No rooms found. Add one to get started!</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Room No.</th>
                <th>Floor</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td><strong>{room.number}</strong></td>
                  <td>Floor {room.floor}</td>
                  <td>{room.roomType.name}</td>
                  <td>₹{room.roomType.basePrice.toLocaleString()}</td>
                  <td>
                    <select
                      value={room.status}
                      onChange={(e) => handleStatusChange(room.id, e.target.value)}
                      className={`badge ${STATUS_COLORS[room.status]}`}
                      style={{ cursor: 'pointer', border: 'none', padding: '6px 10px' }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => openModal(room)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(room.id)} title="Delete">
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
            <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="e.g. 101, 202"
                  required
                />
              </div>
              <div className="form-group">
                <label>Floor</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select
                  value={formData.typeId}
                  onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name} (₹{type.basePrice})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">{editingRoom ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsInventory;
