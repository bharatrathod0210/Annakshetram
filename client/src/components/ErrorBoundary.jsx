import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('React Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#fff5f5', color: '#c0392b', border: '1px solid #e74c3c', borderRadius: '8px', margin: '1rem' }}>
          <h2>🔴 Application Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', marginTop: '1rem' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
