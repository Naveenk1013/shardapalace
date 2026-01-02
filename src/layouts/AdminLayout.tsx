import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BedDouble, Users, CalendarDays, LogOut, Hotel } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>PMS</h2>
          <span>Sharda Palace</span>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/room-types" className={({isActive}) => isActive ? 'active' : ''}>
            <Hotel size={20} /> Room Types
          </NavLink>
          <NavLink to="/admin/rooms" className={({isActive}) => isActive ? 'active' : ''}>
            <BedDouble size={20} /> Rooms
          </NavLink>
          <NavLink to="/admin/guests" className={({isActive}) => isActive ? 'active' : ''}>
            <Users size={20} /> Guests
          </NavLink>
          <NavLink to="/admin/bookings" className={({isActive}) => isActive ? 'active' : ''}>
            <CalendarDays size={20} /> Bookings
          </NavLink>
        </nav>

        <div className="admin-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h3>Front Desk Panel</h3>
          <div className="admin-user">
            <span className="user-badge">{user?.username || 'Admin'}</span>
          </div>
        </header>
        <div className="admin-page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

