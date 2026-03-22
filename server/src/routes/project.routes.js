import { Router } from 'express';
import authenticate from '../middleware/auth.middleware.js';
import * as projectController from '../controllers/project.controller.js';

const router = Router();

// Public routes (must be before authentication)
router.get('/shared/:id', async (req, res, next) => {
  try {
    const data = await projectController.getSharedProject(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// NEW: Public route by shareId (matches README)
router.get('/public/share/:shareId', async (req, res, next) => {
  try {
    const data = await projectController.getPublicProjectByShareId(req.params.shareId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

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

// Toggle public share status
router.put('/:id/share', async (req, res, next) => {
  try {
    const data = await projectController.toggleProjectPublic(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// NEW: Spec-compliant versions and sharing routes
router.get('/:id/versions', async (req, res, next) => {
  try {
    const data = await projectController.getVersionHistory(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/versions/restore', async (req, res, next) => {
  try {
    const data = await projectController.restoreVersion(req.params.id, req.user.id, req.body.index);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/share', async (req, res, next) => {
  try {
    const data = await projectController.enableSharing(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/share', async (req, res, next) => {
  try {
    const data = await projectController.disableSharing(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
