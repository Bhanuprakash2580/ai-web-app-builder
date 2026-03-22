import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { getProjects, createProject, deleteProject } from '../services/projectService.js';
import '../styles/dashboard.css';

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
      </div>
    </div>
  );
}

export default DashboardPage;