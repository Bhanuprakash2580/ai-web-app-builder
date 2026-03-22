import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { getProjects, createProject, deleteProject } from '../services/projectService.js';
import '../styles/dashboard.css';

const TEMPLATES = [
  {
    id: 'landing',
    icon: '🚀',
    title: 'Landing Page',
    description: 'Modern hero section, features grid, and contact footer.',
    prompt: 'Create a modern SaaS landing page with a bold hero section, a 3-column features grid with icons, and a simple footer. Use a dark theme with vibrant purple accents.'
  },
  {
    id: 'portfolio',
    icon: '👨‍💻',
    title: 'Personal Portfolio',
    description: 'Showcase your skills, projects, and experience.',
    prompt: 'Build a personal developer portfolio website. Include an About Me section, a Skills grid with progress bars, and a Projects section with image cards. Keep the design clean and minimalistic.'
  },
  {
    id: 'todo',
    icon: '✅',
    title: 'Task Manager',
    description: 'A functional to-do list with add, delete, and complete actions.',
    prompt: 'Create a functional to-do list app. It should have an input field to add tasks, and each task should have a checkbox to mark as complete and a delete button. Use a clean card-based layout.'
  },
  {
    id: 'calculator',
    icon: '🔢',
    title: 'Calculator App',
    description: 'A sleek interactive calculator with smooth animations.',
    prompt: 'Build a fully responsive standard calculator with a dark aesthetic. Include a clear display for inputs and results, neatly arranged buttons with hover effects, and ensure CSS grid is used for the layout.'
  }
];

function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        showToast('Failed to load projects.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleNewProject = async () => {
    try {
      const project = await createProject();
      navigate(`/builder/${project._id}`);
    } catch (err) {
      showToast('Failed to create project.', 'error');
    }
  };

  const handleTemplateClick = async (prompt) => {
    try {
      setLoading(true);
      const project = await createProject();
      navigate(`/builder/${project._id}?prompt=${encodeURIComponent(prompt)}`);
    } catch (err) {
      showToast('Failed to start template.', 'error');
      setLoading(false);
    }
  };

  const handleOpen = (id) => {
    navigate(`/builder/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
      showToast('Project deleted.', 'success');
    } catch (err) {
      showToast('Failed to delete project.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="dashboard-title-area">
            <h1 className="dashboard-title">Your Projects</h1>
            <p className="dashboard-subtitle">
              Manage and continue building your AI-powered applications.
              ({projects.length} project{projects.length !== 1 ? 's' : ''} total)
            </p>
          </div>
          <button className="create-project-btn" onClick={handleNewProject}>
            <span style={{ fontSize: '20px' }}>+</span> New Project
          </button>
        </header>

        <section className="templates-section" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '16px' }}>Start from a Template</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {TEMPLATES.map(t => (
              <TemplateCard 
                key={t.id} 
                template={t}
                onClick={handleTemplateClick} 
              />
            ))}
          </div>
        </section>

        <section className="projects-section">
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '16px' }}>Your Saved Projects</h2>


        {projects.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📁</span>
            <h2 className="empty-title">Ready to build something?</h2>
            <p className="empty-subtitle">
              Describe your idea and watch NxtBuild transform it into a 
              working web application instantly.
            </p>
            <button className="create-project-btn" onClick={handleNewProject}>
              + Create Your First Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onOpen={handleOpen}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;