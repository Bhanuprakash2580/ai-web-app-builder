import React from 'react';

const ShareModal = ({ isOpen, isPublic, onToggle, onClose, shareId, projectId }) => {
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/share/${shareId}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="share-dropdown" style={{
      position: 'absolute', top: '100%', right: 0, marginTop: '8px',
      width: '280px', background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
      borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 110,
      padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
      animation: 'slideUp 0.2s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>Share Project</h4>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Public Access</span>
        <button 
          onClick={onToggle}
          style={{
            width: '36px', height: '20px', borderRadius: '10px',
            background: isPublic ? 'var(--primary)' : '#334155',
            border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s'
          }}
        >
          <div style={{
            width: '14px', height: '14px', background: 'white', borderRadius: '50%',
            position: 'absolute', top: '3px', left: isPublic ? '19px' : '3px',
            transition: 'all 0.2s'
          }} />
        </button>
      </div>

      {isPublic && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Anyone with the link can view</p>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input 
              readOnly 
              value={shareUrl} 
              style={{
                flex: 1, background: 'var(--bg-deep)', border: '1px solid var(--border-subtle)',
                borderRadius: '6px', padding: '6px 10px', fontSize: '11px', color: 'var(--text-muted)',
                outline: 'none'
              }}
            />
            <button 
              onClick={copyToClipboard}
              style={{
                background: 'var(--primary)', border: 'none', borderRadius: '6px',
                color: 'white', padding: '0 10px', cursor: 'pointer', fontSize: '12px'
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareModal;
