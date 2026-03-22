// server/src/services/generation.service.js
import { askGemini } from './gemini.service.js';
import { getProjectById } from './project.service.js';
import { buildGenerationPrompt } from '../constants/prompts.js';
import { parseGenerationResponse } from '../utils/code.utils.js';

export const generateCode = async (projectId, userId, userPrompt) => {
  // Get real project from MongoDB
  const project = await getProjectById(projectId, userId);

  // Build prompt with conversation history
  const fullPrompt = buildGenerationPrompt(
    project.messages,
    project.generatedCode,
    userPrompt
  );

  // Call REAL Gemini API — NO mock fallback here
  const aiResponse = await askGemini(fullPrompt);

  // Parse the response
  const { code, description } = parseGenerationResponse(aiResponse);

  // Save user message
  project.messages.push({
    role: 'user',
    content: userPrompt,
    timestamp: new Date()
  });

  // Save assistant message
  project.messages.push({
    role: 'assistant',
    content: description || 'Here is your generated app.',
    timestamp: new Date()
  });

  // Save version history
  if (project.generatedCode) {
    project.versions.push({
      code: project.generatedCode,
      prompt: userPrompt,
      createdAt: new Date(),
      label: `Version ${project.versions.length + 1}`
    });
  }

  // Update generated code
  project.generatedCode = code;

  // Auto set title from first prompt
  if (!project.title || project.title === 'Untitled Project') {
    project.title = userPrompt.slice(0, 50);
  }

  project.updatedAt = new Date();
  await project.save();

  return {
    message: {
      role: 'assistant',
      content: description || 'Here is your generated app.',
      timestamp: new Date()
    },
    generatedCode: code,
    title: project.title,
    newVersion: project.versions[project.versions.length - 1]
  };
};