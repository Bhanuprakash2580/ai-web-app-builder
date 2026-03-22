import { Router } from 'express';
import authenticate from '../middleware/auth.middleware.js';
import * as projectController from '../controllers/project.controller.js';

const router = Router();

// All project routes require authentication
router.use(authenticate);

// Get all projects for current user
router.get('/', async (req, res, next) => {
  try {
    const projects = await projectController.getUserProjects(req.user._id);
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
});

// Get a single project
router.get('/:id', async (req, res, next) => {
  try {
    const project = await projectController.getProjectById(req.params.id, req.user._id);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// Create a new project
router.post('/', async (req, res, next) => {
  try {
    const { title } = req.body;
    const project = await projectController.createProject(req.user._id, title);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// Update a project
router.put('/:id', async (req, res, next) => {
  try {
    const project = await projectController.updateProject(req.params.id, req.user._id, req.body);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// Delete a project
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await projectController.deleteProject(req.params.id, req.user._id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
});

export default router;
