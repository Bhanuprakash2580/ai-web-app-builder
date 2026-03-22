import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import LivePreview from '../components/LivePreview.jsx';
import { getProjectByShareId } from '../services/projectService.js';
import '../styles/builder.css';

function SharedPage() {
  const { shareId } = useParams();
  const { showToast } = useContext(ToastContext);

  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await getProjectByShareId(shareId);
        setProject(data);
      } catch (err) {
        showToast('Project is private or unavailable.', 'error');
      } finally {
        setPageLoading(false);
      }
    };
    loadProject();
  }, [shareId]);

  if (pageLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-deep)', color: 'white' }}>
        <h2>404 - Project Not Found or Private</h2>
      </div>
    );
  }

  return (
    <div className="builder-page">
      <div className="builder-workspace">
        <div className="workspace-actions-bar">
          <div className="workspace-tabs">
            <button
              className={`workspace-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <span className="tab-icon">👁</span> Preview
            </button>
            <button
              className={`workspace-tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              <span className="tab-icon" style={{ fontWeight: 'bold' }}>&lt;/&gt;</span> Code
            </button>
          </div>
          
          <div className="workspace-global-actions">
            <span style={{ fontSize: '13px', color: '#64748b', marginRight: '12px' }}>
              Made with NxtBuild
            </span>
          </div>
        </div>

        <div className="workspace-viewport">
          {activeTab === 'preview' ? (
            <LivePreview code={project.generatedCode || ''} />
          ) : (
            <div className="editor-viewport">
              <CodeEditor code={project.generatedCode || ''} onChange={() => {}} readOnly={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SharedProjectPage;
