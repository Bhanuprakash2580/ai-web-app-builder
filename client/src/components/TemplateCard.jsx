import React from 'react';

const TemplateCard = ({ template, onClick }) => {
  return (
    <div 
      className="template-card"
      onClick={() => onClick(template.prompt)}
      style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px',
        padding: '20px', cursor: 'pointer', transition: 'all 0.2s ease',
        display: 'flex', flexDirection: 'column', gap: '8px'
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{template.icon}</div>
      <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>{template.title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{template.description}</p>
    </div>
  );
};

export default TemplateCard;
