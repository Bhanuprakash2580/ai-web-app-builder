import React from 'react';

const VersionPanel = ({ versions, onRestore, onClose }) => {
  return (
    <div className="versions-dropdown">
      <div className="versions-header">
        <span>Version History</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
      </div>
      <div className="versions-list">
        {versions?.map((v, i) => {
          const promptText = v.prompt || v.label || `Version ${i + 1}`;
          const timeText = v.createdAt || v.timestamp || new Date();
          return (
            <div key={i} className="version-item" onClick={() => onRestore(i)} title={promptText}>
              <div className="version-title">v{i + 1}: {promptText.length > 25 ? promptText.substring(0, 25) + '...' : promptText}</div>
              <div className="version-time">{new Date(timeText).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionPanel;
