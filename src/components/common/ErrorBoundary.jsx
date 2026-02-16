import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle size={32} />
              <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>

            <p className="text-gray-600 mb-4">
              The application encountered an unexpected error. This has been logged
              for investigation.
            </p>

            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-red-800 mb-2">Error Details:</p>
                <p className="text-sm text-red-700 font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="bg-gray-50 border rounded-lg p-4 mb-4">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Component Stack Trace
                </summary>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 bg-[#3355FF] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
