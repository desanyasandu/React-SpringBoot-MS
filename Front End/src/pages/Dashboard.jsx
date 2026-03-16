import React, { useState, useEffect } from 'react';
import { Book, Users, ClipboardList, TrendingUp } from 'lucide-react';
import { getAllBooks } from '../services/bookService';
import { getAllMembers } from '../services/memberService';
import { getAllLoans } from '../services/loanService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeLoans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, membersRes, loansRes] = await Promise.all([
          getAllBooks(),
          getAllMembers(),
          getAllLoans()
        ]);

        setStats({
          totalBooks: booksRes.data.length,
          totalMembers: membersRes.data.length,
          activeLoans: loansRes.data.filter(loan => !loan.returnDate).length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading your library data...</p>
      </div>
    );
  }

  return (
    <div className="page-container animate-slide-up">
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening in your library today.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon book-icon">
            <Book size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Books</h3>
            <p className="stat-value">{stats.totalBooks}</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon member-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Registered Members</h3>
            <p className="stat-value">{stats.totalMembers}</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon loan-icon">
            <ClipboardList size={24} />
          </div>
          <div className="stat-info">
            <h3>Active Loans</h3>
            <p className="stat-value">{stats.activeLoans}</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon trend-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Library Status</h3>
            <p className="stat-value text-success">Healthy</p>
          </div>
        </div>
      </div>

      <div className="glass-panel recent-activity">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <a href="/books" className="btn btn-primary">Manage Books</a>
          <a href="/members" className="btn btn-secondary">Manage Members</a>
          <a href="/loans" className="btn btn-secondary">Process Loan</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
