import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import ChatInput from '../components/ChatInput.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import VersionPanel from '../components/VersionPanel.jsx';
import ShareModal from '../components/ShareModal.jsx';
import LivePreview from '../components/LivePreview.jsx';
import { 
  getProject, 
  updateProject, 
  toggleProjectShare, 
  deleteProjectShare,
  restoreProjectVersion 
} from '../services/projectService.js';
import { generateCode } from '../services/generationService.js';
import '../styles/builder.css';

const EXAMPLE_PROMPTS = [
  'Build a personal portfolio site',
  'SaaS pricing landing page',
  'Task manager with dark theme',
  'Responsive calculator app',
];

function BuilderPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useContext(ToastContext);
  const messagesEndRef = useRef(null);

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await getProject(projectId);
        setProject(data);
        setMessages(data.messages || []);
        setCode(data.generatedCode || '');
        setEditTitle(data.title || 'Untitled Project');
      } catch (err) {
        showToast('Project not found.', 'error');
        navigate('/dashboard');
      } finally {
        setPageLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-trigger prompt from Dashboard Templates
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam && !pageLoading && project && messages.length === 0 && !loading) {
      handleSend(promptParam);
      setSearchParams({});
    }
  }, [searchParams, pageLoading, project, messages.length, loading]);

  const handleSend = async (prompt) => {
    if (loading) return;

    const userMessage = { role: 'user', content: prompt, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await generateCode(projectId, prompt);
      setMessages((prev) => [...prev, result.message]);

      if (result.generatedCode) {
        setCode(result.generatedCode);
        setActiveTab('preview');
      }

      if (result.newVersion) {
        setProject(prev => ({
          ...prev,
          versions: [...(prev.versions || []), result.newVersion]
        }));
      }

      if (project.title === 'Untitled Project') {
        const newTitle = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;
        setProject((prev) => ({ ...prev, title: newTitle }));
        setEditTitle(newTitle);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Generation failed. Please try again.';
      showToast(message, 'error');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (prompt) => {
    handleSend(prompt);
    setSidebarOpen(false);
  };

  const handleTitleSave = async () => {
    setIsEditingTitle(false);
    if (editTitle.trim() && editTitle !== project.title) {
      try {
        await updateProject(projectId, { title: editTitle.trim() });
        setProject((prev) => ({ ...prev, title: editTitle.trim() }));
      } catch {
        showToast('Failed to rename project.', 'error');
      }
    }
  };

  const handleRestoreVersion = async (versionIndex) => {
    try {
      setLoading(true);
      const data = await restoreProjectVersion(projectId, versionIndex);
      setProject(data);
      setMessages(data.messages);
      setCode(data.generatedCode);
      setShowVersions(false);
      showToast('Version restored and saved!', 'success');
    } catch (err) {
      showToast('Failed to save restored version.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      let data;
      if (project.isPublic) {
        data = await deleteProjectShare(projectId);
      } else {
        data = await toggleProjectShare(projectId);
      }
      setProject(prev => ({ ...prev, isPublic: data.isPublic, shareId: data.shareId || prev.shareId }));
      
      if (data.isPublic) {
        showToast('Project is now public!', 'success');
      } else {
        showToast('Project is now private.', 'success');
      }
    } catch (err) {
      showToast('Failed to update share settings.', 'error');
    }
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project?.title ?? 'my-app'}.html`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Code downloaded!', 'success');
  };

  if (pageLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Initializing your workspace...</p>
      </div>
    );
  }

  return (
    <div className="builder-page">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── LEFT PANEL ── */}
      <div className={`builder-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="builder-sidebar-header">
          {isEditingTitle ? (
            <input
              className="builder-title-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); }}
              autoFocus
            />
          ) : (
            <h2
              className="builder-project-title"
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename"
            >
              {project?.title || 'Untitled Project'}
            </h2>
          )}
          <span className="builder-draft-badge">DRAFT</span>
        </div>

        <div className="builder-messages-area">
          {messages.length === 0 ? (
            <div className="empty-chat-state">
              <div className="empty-chat-icon">✦</div>
              <h3 className="empty-chat-title">Start Generating</h3>
              <p className="empty-chat-text">
                Describe your app below or pick an example to get started instantly.
              </p>
              <div className="prompt-chips">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button key={p} className="prompt-chip" onClick={() => handleChipClick(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
              {loading && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                  <span>AI is building your app...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="builder-chat-input-box">
          <ChatInput onSend={handleSend} loading={loading} disabled={false} />
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="builder-workspace">
        <div className="workspace-actions-bar">
          {/* Mobile toggle */}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Chat"
          >
            ☰
          </button>

          <div className="workspace-tabs">
            <button
              className={`workspace-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <span className="tab-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </span>
              Preview
            </button>
            <button
              className={`workspace-tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              <span className="tab-icon" style={{ fontWeight: 'bold' }}>&lt;/&gt;</span>
              Code
            </button>
          </div>

          <div className="workspace-global-actions">
            <div style={{ position: 'relative' }}>
              <button 
                className={`secondary-action-btn ${showVersions ? 'active' : ''}`}
                onClick={() => { setShowVersions(!showVersions); setShowShare(false); }}
                disabled={!project?.versions?.length}
                style={{ opacity: !project?.versions?.length ? 0.4 : 1 }}
              >
                <span className="tab-icon">🕒</span> Versions
              </button>
              
              {showVersions && (
                <VersionPanel 
                  versions={project.versions} 
                  onRestore={handleRestoreVersion} 
                  onClose={() => setShowVersions(false)} 
                />
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button 
                className={`secondary-action-btn ${project?.isPublic ? 'active' : ''}`} 
                onClick={() => { setShowShare(!showShare); setShowVersions(false); }}
              >
                <span className="tab-icon">{project?.isPublic ? '🔗' : '🌍'}</span> 
                {project?.isPublic ? 'Shared' : 'Share'}
              </button>

              <ShareModal 
                isOpen={showShare}
                isPublic={project?.isPublic}
                onToggle={handleShare}
                onClose={() => setShowShare(false)}
                shareId={project?.shareId}
                projectId={projectId}
              />
            </div>

            <button 
              className="secondary-action-btn" 
              onClick={handleDownload}
              disabled={!code}
              style={{ opacity: !code ? 0.4 : 1 }}
            >
              <span className="tab-icon">⬇</span> Download
            </button>
            <button 
              className="secondary-action-btn" 
              onClick={() => {
                if (code) {
                  const blob = new Blob([code], { type: 'text/html' });
                  window.open(URL.createObjectURL(blob), '_blank');
                }
              }}
              disabled={!code}
              style={{ opacity: !code ? 0.4 : 1 }}
            >
              <span className="tab-icon">↗</span> Popout
            </button>
          </div>
        </div>

        <div className="workspace-viewport">
          {activeTab === 'preview' ? (
            <LivePreview code={code} />
          ) : (
            <div className="editor-viewport">
              <CodeEditor code={code} onChange={setCode} readOnly={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuilderPage;