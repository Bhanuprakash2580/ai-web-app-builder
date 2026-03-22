import * as projectService from '../services/project.service.js';

export const getUserProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getUserProjects(req.user._id);
    return res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user._id);
    return res.json({ success: true, data: project });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title } = req.body;
    const project = await projectService.createProject(req.user._id, title);
    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.user._id, req.body);
    return res.json({ success: true, data: project });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const result = await projectService.deleteProject(req.params.id, req.user._id);
    return res.json({ success: true, data: result });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const getVersionHistory = async (req, res, next) => {
  try {
    const versions = await projectService.getProjectVersions(req.params.id, req.user._id);
    return res.json({ success: true, data: versions });
  } catch (error) {
    next(error);
  }
};

export const restoreVersion = async (req, res, next) => {
  try {
    const { index } = req.body;
    const project = await projectService.restoreProjectVersion(req.params.id, req.user._id, index);
    return res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const enableSharing = async (req, res, next) => {
  try {
    const project = await projectService.toggleProjectShare(req.params.id, req.user._id);
    return res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const disableSharing = async (req, res, next) => {
  try {
    const project = await projectService.deleteProjectShare(req.params.id, req.user._id);
    return res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const getPublicProjectByShareId = async (req, res, next) => {
  try {
    const { shareId } = req.params;
    const project = await projectService.getPublicProjectByShareId(shareId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found or private' });
    return res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};