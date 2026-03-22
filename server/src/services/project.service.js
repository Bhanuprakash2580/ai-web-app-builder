import Project from '../models/Project.model.js';

// In-memory store for mock mode — starts EMPTY, projects are added as users create them
let MOCK_PROJECTS = [];

export const getUserProjects = async (userId) => {
  if (process.env.MOCK_DB === 'true') {
    return MOCK_PROJECTS.filter(p => p.userId === userId || p.userId === 'mock_user_123');
  }
  const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
  return projects;
};

export const getProjectById = async (projectId, userId) => {
  if (process.env.MOCK_DB === 'true') {
    const p = MOCK_PROJECTS.find(proj => proj._id === projectId);
    if (!p) throw new Error('Project not found (Mock Mode)');
    return p;
  }
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

export const createProject = async (userId, title) => {
  if (process.env.MOCK_DB === 'true') {
    const newProject = {
      _id: 'mock_' + Date.now(),
      id: 'mock_' + Date.now(),
      userId: userId || 'mock_user_123',
      title: title || 'Untitled Project',
      messages: [],
      generatedCode: '',
      versions: [],
      isPublic: false,
      shareId: null,
      updatedAt: new Date(),
      save: async function() {
        const idx = MOCK_PROJECTS.findIndex(p => p._id === this._id);
        if (idx !== -1) MOCK_PROJECTS[idx] = this;
      },
    };
    MOCK_PROJECTS.push(newProject);
    return newProject;
  }
  const project = await Project.create({
    userId,
    title: title || 'Untitled Project',
    messages: [],
    generatedCode: '',
    versions: [],
  });
  return project;
};

export const updateProject = async (projectId, userId, updates) => {
  if (process.env.MOCK_DB === 'true') {
    const p = MOCK_PROJECTS.find(proj => proj._id === projectId);
    if (!p) throw new Error('Project not found (Mock Mode)');
    if (updates.title !== undefined) p.title = updates.title;
    if (updates.description !== undefined) p.description = updates.description;
    p.updatedAt = new Date();
    return p;
  }
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  if (updates.title !== undefined) project.title = updates.title;
  if (updates.description !== undefined) project.description = updates.description;
  project.updatedAt = new Date();
  await project.save();
  return project;
};

export const deleteProject = async (projectId, userId) => {
  if (process.env.MOCK_DB === 'true') {
    MOCK_PROJECTS = MOCK_PROJECTS.filter(p => p._id !== projectId);
    return { message: 'Project deleted successfully (Mock).' };
  }
  const project = await Project.findOneAndDelete({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  return { message: 'Project deleted successfully.' };
};

export const toggleProjectShare = async (projectId, userId) => {
  if (process.env.MOCK_DB === 'true') {
    const p = MOCK_PROJECTS.find(proj => proj._id === projectId);
    if (!p) throw new Error('Project not found (Mock Mode)');
    p.isPublic = !p.isPublic;
    if (p.isPublic && !p.shareId) p.shareId = 'share_' + Date.now();
    return p;
  }
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  project.isPublic = !project.isPublic;
  if (project.isPublic && !project.shareId) {
    project.shareId = require('crypto').randomBytes(8).toString('hex');
  }
  await project.save();
  return project;
};

export const deleteProjectShare = async (projectId, userId) => {
  if (process.env.MOCK_DB === 'true') {
    const p = MOCK_PROJECTS.find(proj => proj._id === projectId);
    if (!p) throw new Error('Project not found (Mock Mode)');
    p.isPublic = false;
    return p;
  }
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  project.isPublic = false;
  await project.save();
  return project;
};

export const getProjectVersions = async (projectId, userId) => {
  if (process.env.MOCK_DB === 'true') {
    const p = MOCK_PROJECTS.find(proj => proj._id === projectId);
    return p ? p.versions || [] : [];
  }
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new Error('Project not found.');
  return project.versions || [];
};

export const restoreProjectVersion = async (projectId, userId, versionIndex) => {
  if (process.env.MOCK_DB === 'true') {
    const p = MOCK_PROJECTS.find(proj => proj._id === projectId);
    if (!p || !p.versions[versionIndex]) throw new Error('Version not found (Mock Mode)');
    p.generatedCode = p.versions[versionIndex].code;
    p.updatedAt = new Date();
    return p;
  }
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new Error('Project not found.');
  if (!project.versions[versionIndex]) throw new Error('Version not found.');
  project.generatedCode = project.versions[versionIndex].code;
  project.updatedAt = new Date();
  await project.save();
  return project;
};

export const getPublicProjectByShareId = async (shareId) => {
  if (process.env.MOCK_DB === 'true') {
    return MOCK_PROJECTS.find(p => p.shareId === shareId && p.isPublic) || null;
  }
  const project = await Project.findOne({ shareId, isPublic: true });
  return project;
};