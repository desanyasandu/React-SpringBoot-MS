import api from './api';

export const getAllMembers = () => api.get('/members');
export const getMemberById = (id) => api.get(`/members/${id}`);
export const createMember = (member) => api.post('/members', member);
export const updateMember = (id, member) => api.put(`/members/${id}`, member);
export const deleteMember = (id) => api.delete(`/members/${id}`);
