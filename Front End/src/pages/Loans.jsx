import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Trash2, Clock } from 'lucide-react';
import { getAllLoans, createLoan, returnBook, deleteLoan } from '../services/loanService';
import { getAllBooks } from '../services/bookService';
import { getAllMembers } from '../services/memberService';
import './Loans.css';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    bookId: '',
    memberId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [loansRes, booksRes, membersRes] = await Promise.all([
        getAllLoans(),
        getAllBooks(),
        getAllMembers()
      ]);
      
      setLoans(loansRes.data);
      // Only keep available books for the dropdown (simple frontend logic)
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => {
    setFormData({ bookId: '', memberId: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bookId || !formData.memberId) return;

    try {
      await createLoan(formData.bookId, formData.memberId);
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Failed to create loan', error);
      alert('Failed to issue loan. The book might already be borrowed.');
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm('Mark this book as returned?')) {
      try {
        await returnBook(id);
        fetchData();
      } catch (error) {
        console.error('Failed to return book', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this loan record entirely?')) {
      try {
        await deleteLoan(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete loan', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading loan records...</p>
      </div>
    );
  }

  return (
    <div className="page-container animate-slide-up">
      <div className="page-header">
        <div>
          <h1>Loan Management</h1>
          <p>Track borrowed books and process returns.</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <Plus size={18} /> Issue New Loan
        </button>
      </div>

      <div className="glass-panel table-container">
        {loans.length === 0 ? (
          <div className="empty-state">
            <p>No active or past loans found. Issue a loan to get started!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Book Details</th>
                <th>Member Details</th>
                <th>Loan Date</th>
                <th>Status / Return Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => {
                const isReturned = !!loan.returnDate;
                
                return (
                  <tr key={loan.id} className={isReturned ? 'row-returned' : ''}>
                    <td>{loan.id}</td>
                    <td>
                      <div className="cell-details">
                        <span className="font-medium text-white">{loan.book?.title || 'Unknown Book'}</span>
                        <span className="text-sm text-secondary">ID: {loan.book?.id}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-details">
                        <span className="font-medium text-white">{loan.member?.name || 'Unknown Member'}</span>
                        <span className="text-sm text-secondary">{loan.member?.email}</span>
                      </div>
                    </td>
                    <td>
                      {new Date(loan.loanDate).toLocaleDateString()}
                    </td>
                    <td>
                      {isReturned ? (
                        <div className="status-badge success">
                          <CheckCircle size={14} />
                          <span>{new Date(loan.returnDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <div className="status-badge warning">
                          <Clock size={14} />
                          <span>Borrowed</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons-sm">
                        {!isReturned && (
                          <button 
                            className="btn-icon text-success tooltip" 
                            onClick={() => handleReturn(loan.id)}
                            title="Mark as Returned"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          className="btn-icon text-danger tooltip" 
                          onClick={() => handleDelete(loan.id)}
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && closeModal()}>
          <div className="modal-content glass-panel animate-slide-up">
            <h2>Issue Book Loan</h2>
            <form onSubmit={handleSubmit} className="form-container">
              
              <div className="form-group">
                <label>Select Member *</label>
                <select 
                  name="memberId" 
                  value={formData.memberId} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Choose a member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Book *</label>
                <select 
                  name="bookId" 
                  value={formData.bookId} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Choose a book --</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title} by {b.author}</option>
                  ))}
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={!formData.bookId || !formData.memberId}>
                  Confirm Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
