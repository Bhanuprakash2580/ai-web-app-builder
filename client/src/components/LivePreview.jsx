function LivePreview({ code }) {
  if (!code) {
    return (
      <div style={{
        background: '#f8f8ff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '16px',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '48px' }}>✨</div>
        <h3 style={{ color: '#0f0f17', fontSize: '18px', fontWeight: '700' }}>Your app will appear here</h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Describe what you want to build in the chat</p>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={code}
      width="100%"
      height="100%"
      style={{ border: 'none', display: 'block' }}
      sandbox="allow-scripts"
      title="Live Preview"
      className="preview-iframe"
    />
  );
}

export default LivePreview;