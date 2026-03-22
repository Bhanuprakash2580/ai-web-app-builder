function ProjectCard({ project, onOpen, onDelete }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="project-card">
      {/* Preview thumbnail */}
      {project.generatedCode ? (
        <div style={{ height: '180px', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
          <iframe
            srcDoc={project.generatedCode}
            height="180px"
            width="100%"
            style={{
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
              width: '200%',
              height: '360px',
              pointerEvents: 'none',
              border: 'none',
              display: 'block'
            }}
            sandbox=""
            title="Project Preview"
          />
        </div>
      ) : (
        <div style={{
          height: '180px',
          background: 'linear-gradient(135deg, #1a1a2e, #12121f)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px 8px 0 0'
        }}>
          <div className="project-card-preview-icon">&lt;/&gt;</div>
        </div>
      )}

      {/* Card body */}
      <div className="project-card-content">
        <h3 className="project-card-title">{project.title || 'Untitled Project'}</h3>
        <p className="project-card-desc">
          {project.prompt || 'No description for this project yet.'}
        </p>
      </div>

      {/* Card footer */}
      <div className="project-card-footer">
        <span className="project-date">Updated {formatDate(project.updatedAt)}</span>
        <div className="project-card-actions">
          <button
            className="delete-project-btn"
            onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
            title="Delete Project"
          >
            🗑
          </button>
          {project.generatedCode && (
            <button
              className="open-project-btn"
              onClick={(e) => {
                e.stopPropagation();
                const blob = new Blob([project.generatedCode], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${project.title || 'my-app'}.html`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              style={{ background: '#1e1e35', color: '#e2e8f0' }}
            >
              Download
            </button>
          )}
          <button className="open-project-btn" onClick={() => onOpen(project._id)}>
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;