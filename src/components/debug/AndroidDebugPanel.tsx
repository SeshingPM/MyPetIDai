import React, { useState, useEffect } from 'react';

/**
 * Simple debug panel that always appears regardless of platform
 * Shows navigation and button clicks to help debug Android upload issues
 */
const AndroidDebugPanel: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    // Store original functions to restore them later
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    // Override history.pushState
    window.history.pushState = function(...args) {
      const url = args[2] as string;
      setLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] pushState: ${url}`, ...prev].slice(0, 20));
      
      // Block navigation to android-document-upload
      if (url && url.includes('/android-document-upload')) {
        setLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] BLOCKED navigation to: ${url}`, ...prev]);
        console.error('BLOCKED navigation to Android upload page');
        return null as any;
      }
      
      return originalPushState.apply(this, args);
    };
    
    // Override history.replaceState
    window.history.replaceState = function(...args) {
      const url = args[2] as string;
      setLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] replaceState: ${url}`, ...prev].slice(0, 20));
      
      // Block navigation to android-document-upload
      if (url && url.includes('/android-document-upload')) {
        setLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] BLOCKED navigation to: ${url}`, ...prev]);
        console.error('BLOCKED navigation to Android upload page');
        return null as any;
      }
      
      return originalReplaceState.apply(this, args);
    };
    
    // Track button clicks
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (button) {
        try {
          const buttonText = button.textContent?.trim() || 'Unknown';
          const classes = button.className.split(' ').join('.');
          setLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Button clicked: ${buttonText} [${classes}]`, ...prev].slice(0, 20));
        } catch (err) {
          // Ignore errors
        }
      }
    };
    
    // Track form submissions
    const submitHandler = (e: Event) => {
      const form = e.target as HTMLFormElement;
      setLogs(prev => [`[${new Date().toISOString().slice(11, 19)}] Form submitted: ${form.action || 'unknown'}`, ...prev].slice(0, 20));
    };
    
    // Add event listeners
    document.addEventListener('click', clickHandler, true);
    document.addEventListener('submit', submitHandler, true);
    
    // Cleanup function to restore original behavior
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      document.removeEventListener('click', clickHandler, true);
      document.removeEventListener('submit', submitHandler, true);
    };
  }, []);
  
  // Simple UI for the debug panel
  if (!expanded) {
    return (
      <div 
        onClick={() => setExpanded(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          backgroundColor: '#ff0000', // Bright red for visibility
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
          zIndex: 9999,
          cursor: 'pointer',
          border: '2px solid white'
        }}
      >
        {logs.length > 0 ? `${logs.length}` : 'DEBUG'}
      </div>
    );
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '0',
        right: '0',
        width: '100%',
        height: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#4caf50',
        zIndex: 9999,
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'monospace',
        overflowY: 'auto',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        position: 'sticky', 
        top: 0, 
        padding: '5px 0', 
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        marginBottom: '5px'
      }}>
        <div style={{ fontWeight: 'bold' }}>Android Debug Panel</div>
        <div>
          <button 
            onClick={() => setLogs([])}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              marginRight: '10px',
              padding: '2px 5px',
              fontSize: '12px'
            }}
          >
            Clear
          </button>
          <button 
            onClick={() => setExpanded(false)}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '2px 5px',
              fontSize: '12px'
            }}
          >
            Close
          </button>
        </div>
      </div>
      
      <div>
        {logs.length === 0 ? (
          <p>No logs yet. Interact with the app to see debug info.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{
              borderBottom: '1px solid #333',
              padding: '5px 0',
              wordBreak: 'break-word',
              color: log.includes('BLOCKED') ? '#ff5252' : 
                    log.includes('Button clicked') ? '#ffeb3b' : '#4caf50'
            }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AndroidDebugPanel;
