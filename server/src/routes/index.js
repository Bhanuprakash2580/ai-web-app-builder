import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import generationRoutes from './generation.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/generate', generationRoutes);

router.get('/test-gemini', async (req, res) => {
  try {
    const { askGemini } = await import('../services/gemini.service.js');
    const result = await askGemini('Say hello in one word');
    res.json({ success: true, result });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

export default router;