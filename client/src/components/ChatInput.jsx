import { useState } from 'react';

function ChatInput({ onSend, loading, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || loading || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <textarea
        className="chat-textarea"
        placeholder="Describe what you want to build..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading || disabled}
        rows={1}
      />
      <button
        className="chat-submit-btn"
        onClick={handleSubmit}
        disabled={!input.trim() || loading || disabled}
        title="Send Prompt"
      >
        {loading ? (
          <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '-1px' }}>···</span>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default ChatInput;