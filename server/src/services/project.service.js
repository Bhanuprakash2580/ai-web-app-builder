import Project from '../models/Project.model.js';

const MOCK_PROJECTS = [
  {
    _id: 'mock_project_1',
    id: 'mock_project_1',
    userId: 'mock_user_123',
    title: 'Modern Coffee Shop Website',
    messages: [
      { role: 'user', content: 'Create a coffee shop landing page', timestamp: new Date() },
      { role: 'assistant', content: 'Sure! Here is a modern coffee shop landing page.', timestamp: new Date() }
    ],
    generatedCode: '<html><body><h1>Coffee Shop</h1></body></html>',
    versions: [],
    updatedAt: new Date(),
    save: async () => {}, // No-op for mock
  }
];

export const getUserProjects = async (userId) => {
  if (process.env.MOCK_DB === 'true') return MOCK_PROJECTS;
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
  // ... rest of the original code ...
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

export const createProject = async (userId, title) => {
  if (process.env.MOCK_DB === 'true') {
    const newProject = { ...MOCK_PROJECTS[0], _id: 'new_mock_' + Date.now(), title: title || 'New Mock Project' };
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
  if (process.env.MOCK_DB === 'true') return { message: 'Project deleted successfully (Mock).' };
  const project = await Project.findOneAndDelete({ _id: projectId, userId });
  if (!project) {
    const error = new Error('Project not found.');
    error.statusCode = 404;
    throw error;
  }
  return { message: 'Project deleted successfully.' };
};