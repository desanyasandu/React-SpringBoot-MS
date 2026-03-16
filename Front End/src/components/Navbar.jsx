import React from 'react';
import { NavLink } from 'react-router-dom';
import { Library, Book, Users, ClipboardList, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Library size={32} />
        </div>
        <h2>Library MS © Desan Yasandu</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/books" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Book size={20} />
          <span>Books</span>
        </NavLink>

        <NavLink to="/members" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Members</span>
        </NavLink>

        <NavLink to="/loans" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ClipboardList size={20} />
          <span>Loans</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p></p>
      </div>
    </div>
  );
};

export default Navbar;
