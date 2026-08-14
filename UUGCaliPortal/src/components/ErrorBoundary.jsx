import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white border border-red-200 rounded-xl my-8">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">
            warning
          </span>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-black mb-2">
            Something went wrong
          </h2>
          <p className="text-xs font-['JetBrains_Mono'] text-[#45464d] max-w-md mb-6">
            {this.state.error?.message || "An unexpected error occurred while loading this view."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white text-xs font-['JetBrains_Mono'] uppercase tracking-widest px-4 py-2 rounded hover:bg-[#45464d] transition-colors cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}