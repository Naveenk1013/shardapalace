import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, BedDouble, Users, CalendarCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminStyles.css';

interface Stats {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  dirtyRooms: number;
  maintenanceRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalGuests: number;
}

interface Room {
  id: number;
  number: string;
  floor: number;
  status: string;
  roomType: { name: string; basePrice: number };
}

const API_URL = 'http://localhost:3001/api';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalRooms: 0,
    occupiedRooms: 0,
    vacantRooms: 0,
    dirtyRooms: 0,
    maintenanceRooms: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    totalGuests: 0,
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [roomsRes, guestsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/guests`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [roomsData, guestsData, bookingsData] = await Promise.all([
        roomsRes.json(),
        guestsRes.json(),
        bookingsRes.json(),
      ]);

      setRooms(roomsData);

      const today = new Date().toISOString().split('T')[0];
      const todayCheckIns = bookingsData.filter(
        (b: { checkIn: string; status: string }) => 
          b.checkIn.split('T')[0] === today && b.status === 'CONFIRMED'
      ).length;
      const todayCheckOuts = bookingsData.filter(
        (b: { checkOut: string; status: string }) => 
          b.checkOut.split('T')[0] === today && b.status === 'CHECKED_IN'
      ).length;

      setStats({
        totalRooms: roomsData.length,
        occupiedRooms: roomsData.filter((r: Room) => r.status === 'OCCUPIED').length,
        vacantRooms: roomsData.filter((r: Room) => r.status === 'VACANT').length,
        dirtyRooms: roomsData.filter((r: Room) => r.status === 'DIRTY').length,
        maintenanceRooms: roomsData.filter((r: Room) => r.status === 'MAINTENANCE').length,
        todayCheckIns,
        todayCheckOuts,
        totalGuests: guestsData.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const occupancyRate = stats.totalRooms > 0 
    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OCCUPIED': return '#4caf50';
      case 'VACANT': return '#2196f3';
      case 'DIRTY': return '#ff9800';
      case 'MAINTENANCE': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  if (loading) {
    return <div className="admin-page"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: 30 }}>
        <div>
          <h1><LayoutDashboard size={28} style={{ marginRight: 10, verticalAlign: 'middle' }} />Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.username || 'Admin'}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: 25, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ opacity: 0.9, marginBottom: 8, fontSize: '0.9rem' }}>Occupancy Rate</p>
              <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{occupancyRate}%</h2>
            </div>
            <TrendingUp size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white', padding: 25, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ opacity: 0.9, marginBottom: 8, fontSize: '0.9rem' }}>Vacant Rooms</p>
              <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{stats.vacantRooms}</h2>
            </div>
            <BedDouble size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: 25, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ opacity: 0.9, marginBottom: 8, fontSize: '0.9rem' }}>Today's Check-ins</p>
              <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{stats.todayCheckIns}</h2>
            </div>
            <CalendarCheck size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: 25, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ opacity: 0.9, marginBottom: 8, fontSize: '0.9rem' }}>Total Guests</p>
              <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{stats.totalGuests}</h2>
            </div>
            <Users size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(stats.dirtyRooms > 0 || stats.maintenanceRooms > 0) && (
        <div style={{ background: '#fff3e0', border: '1px solid #ffb74d', borderRadius: 8, padding: 15, marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={20} color="#f57c00" />
          <span>
            {stats.dirtyRooms > 0 && `${stats.dirtyRooms} room(s) need cleaning. `}
            {stats.maintenanceRooms > 0 && `${stats.maintenanceRooms} room(s) under maintenance.`}
          </span>
        </div>
      )}

      {/* Room Grid */}
      <div style={{ background: 'white', borderRadius: 12, padding: 25, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: 20 }}>Room Status Grid</h3>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
          {['VACANT', 'OCCUPIED', 'DIRTY', 'MAINTENANCE'].map((status) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: getStatusColor(status) }}></div>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>{status}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12 }}>
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                background: getStatusColor(room.status),
                color: 'white',
                padding: '15px 10px',
                borderRadius: 8,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              title={`${room.roomType.name} - ${room.status}`}
            >
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{room.number}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>{room.roomType.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
