import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { getAllMembers, createMember, updateMember, deleteMember } from '../services/memberService';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch members', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || ''
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateMember(editingMember.id, formData);
      } else {
        await createMember(formData);
      }
      fetchMembers();
      closeModal();
    } catch (error) {
      console.error('Failed to save member', error);
      alert('Failed to save member. Please check your input.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(id);
        fetchMembers();
      } catch (error) {
        console.error('Failed to delete member', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading members database...</p>
      </div>
    );
  }

  return (
    <div className="page-container animate-slide-up">
      <div className="page-header">
        <div>
          <h1>Member Directory</h1>
          <p>Manage library members and their contact details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add New Member
        </button>
      </div>

      <div className="members-grid">
        {members.length === 0 ? (
          <div className="glass-panel empty-state" style={{ gridColumn: '1 / -1' }}>
            <p>No members registered yet. Add your first member!</p>
          </div>
        ) : (
          members.map(member => (
            <div key={member.id} className="glass-panel member-card">
              <div className="member-header">
                <div className="member-avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="member-title">
                  <h3>{member.name}</h3>
                  <span className="member-id">ID: {member.id}</span>
                </div>
                <div className="member-actions">
                  <button className="btn-icon text-accent" onClick={() => openModal(member)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon text-danger" onClick={() => handleDelete(member.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="member-details">
                <div className="detail-row">
                  <Mail size={16} className="text-secondary" />
                  <span>{member.email}</span>
                </div>
                <div className="detail-row">
                  <Phone size={16} className="text-secondary" />
                  <span>{member.phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <MapPin size={16} className="text-secondary" />
                  <span>{member.address || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && closeModal()}>
          <div className="modal-content glass-panel animate-slide-up">
            <h2>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label>Home Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Library Way, City"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
