import { Router } from 'express';
import authenticate from '../middleware/auth.middleware.js';
import * as projectController from '../controllers/project.controller.js';

const router = Router();

// Public routes — must be before authenticate middleware
router.get('/public/share/:shareId', projectController.getPublicProjectByShareId);

// All routes below require a valid JWT
router.use(authenticate);

// Projects CRUD
router.get('/',     projectController.getUserProjects);
router.post('/',    projectController.createProject);
router.get('/:id',  projectController.getProjectById);
router.put('/:id',  projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Version history
router.get('/:id/versions',          projectController.getVersionHistory);
router.post('/:id/versions/restore', projectController.restoreVersion);

// Sharing
router.post('/:id/share',   projectController.enableSharing);
router.delete('/:id/share', projectController.disableSharing);

export default router;
