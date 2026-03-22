import Project from '../models/Project.model.js';

export const getUserProjects = async (userId) => {
  const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
  return projects;
};

export const getProjectById = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

export const createProject = async (userId, title) => {
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
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }

  if (updates.title !== undefined) project.title = updates.title;
  if (updates.description !== undefined) project.description = updates.description;
  if (updates.generatedCode !== undefined) project.generatedCode = updates.generatedCode;
  if (updates.messages !== undefined) project.messages = updates.messages;

  project.updatedAt = new Date();
  await project.save();
  return project;
};

export const deleteProject = async (projectId, userId) => {
  const project = await Project.findOneAndDelete({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  return { message: 'Project deleted successfully.' };
};

export const toggleProjectPublic = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  
  project.isPublic = !project.isPublic;
  await project.save();
  return { isPublic: project.isPublic };
};

export const getSharedProject = async (projectId) => {
  const project = await Project.findOne({ _id: projectId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  if (!project.isPublic) {
    const error = new Error('This project is private.');
    error.statusCode = 403;
    throw error;
  }
  
  return project;
};

// --- NEW SPEC-COMPLIANT CONTROLLERS ---

export const getVersionHistory = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new Error('Project not found');
  return project.versions;
};

export const restoreVersion = async (projectId, userId, versionIndex) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new Error('Project not found');
  
  const version = project.versions[versionIndex];
  if (!version) throw new Error('Version index out of bounds');

  project.generatedCode = version.code;
  project.messages.push({
    role: 'assistant',
    content: `⏪ Restored to version "${version.prompt}"`,
    timestamp: new Date()
  });
  
  await project.save();
  return project;
};

export const enableSharing = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new Error('Project not found');
  
  project.isPublic = true;
  await project.save();
  return { isPublic: true, shareId: project.shareId };
};

export const disableSharing = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new Error('Project not found');
  
  project.isPublic = false;
  await project.save();
  return { isPublic: false };
};

export const getPublicProjectByShareId = async (shareId) => {
  const project = await Project.findOne({ shareId, isPublic: true });
  if (!project) {
    const error = new Error('Project not found or private');
    error.statusCode = 404;
    throw error;
  }
  return project;
};