import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getAllBooks, createBook, updateBook, deleteBook } from '../services/bookService';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishedYear: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      setBooks(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch books', error);
      setError('Connection failed. Please ensure the backend server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        publishedYear: book.publishedYear || ''
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '', publishedYear: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook.id, formData);
      } else {
        await createBook(formData);
      }
      fetchBooks();
      closeModal();
    } catch (error) {
      console.error('Failed to save book', error);
      alert('Failed to save book. Please check your input.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        fetchBooks();
      } catch (error) {
        console.error('Failed to delete book', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading books database...</p>
      </div>
    );
  }

  return (
    <div className="page-container animate-slide-up">
      <div className="page-header">
        <div>
          <h1>Book Management</h1>
          <p>Add, edit, or remove books from the library collection.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add New Book
        </button>
      </div>

      <div className="glass-panel table-container">
        {error ? (
          <div className="empty-state">
            <p className="text-danger">{error}</p>
            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={fetchBooks}>
              Retry Connection
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <p>No books found in the database. Add your first book!</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td className="font-medium text-white">{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>{book.publishedYear}</td>
                  <td>
                    <div className="action-buttons-sm">
                      <button className="btn-icon text-accent" onClick={() => openModal(book)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(book.id)}>
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

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && closeModal()}>
          <div className="modal-content glass-panel animate-slide-up">
            <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="The Great Gatsby"
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  placeholder="F. Scott Fitzgerald"
                />
              </div>
              <div className="form-group">
                <label>ISBN *</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  required
                  placeholder="978-0743273565"
                />
              </div>
              <div className="form-group">
                <label>Published Year</label>
                <input
                  type="number"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleInputChange}
                  placeholder="1925"
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'Save Changes' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
