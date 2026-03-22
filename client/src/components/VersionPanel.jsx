import React from 'react';

const VersionPanel = ({ versions, onRestore, onClose }) => {
  return (
    <div className="versions-dropdown">
      <div className="versions-header">
        <span>Version History</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
      </div>
      <div className="versions-list">
        {versions?.map((v, i) => (
          <div key={i} className="version-item" onClick={() => onRestore(i)} title={v.prompt}>
            <div className="version-title">v{i + 1}: {v.prompt.length > 25 ? v.prompt.substring(0, 25) + '...' : v.prompt}</div>
            <div className="version-time">{new Date(v.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersionPanel;
