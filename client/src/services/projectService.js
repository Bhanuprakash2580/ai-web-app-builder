import api from './api.js';

export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data.data;
};

export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data.data;
};

export const createProject = async (data = {}) => {
  const response = await api.post('/projects', data);
  return response.data.data;
};

export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data.data;
};

export const toggleProjectShare = async (id) => {
  const response = await api.post(`/projects/${id}/share`);
  return response.data.data;
};

export const deleteProjectShare = async (id) => {
  const response = await api.delete(`/projects/${id}/share`);
  return response.data.data;
};

export const getProjectVersions = async (id) => {
  const response = await api.get(`/projects/${id}/versions`);
  return response.data.data;
};

export const restoreProjectVersion = async (id, index) => {
  const response = await api.post(`/projects/${id}/versions/restore`, { index });
  return response.data.data;
};

export const getProjectByShareId = async (shareId) => {
  const response = await api.get(`/projects/public/share/${shareId}`);
  return response.data.data;
};

export const getSharedProject = async (id) => {
  const response = await api.get(`/projects/shared/${id}`);
  return response.data.data;
};
