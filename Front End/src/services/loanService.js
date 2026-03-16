import api from './api';

export const getAllLoans = () => api.get('/loans');
export const getLoanById = (id) => api.get(`/loans/${id}`);
export const createLoan = (bookId, memberId) => api.post(`/loans?bookId=${bookId}&memberId=${memberId}`);
export const returnBook = (id) => api.put(`/loans/${id}/return`);
export const deleteLoan = (id) => api.delete(`/loans/${id}`);
