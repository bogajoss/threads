import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "@/components/ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4 text-center dark:bg-black">
          <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-md text-zinc-500 dark:text-zinc-400">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="rounded-full bg-violet-600 px-6 py-2 font-bold text-white hover:bg-violet-700"
          >
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
