import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-6">
          <h1 className="text-2xl font-black mb-2">Something went sideways.</h1>
          <p className="text-sm text-slate-600 mb-6 max-w-md text-center">
            The app hit a snag while loading. Try reloading, and if it keeps happening we should check the console for the root cause.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-slate-800"
          >
            Reload the page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
