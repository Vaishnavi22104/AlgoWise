"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  onRetry: () => void;
}

/** Keeps one broken visualization from taking down the whole page. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Visualization failed", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="mx-auto my-16 max-w-md rounded-xl border border-line bg-surface p-8 text-center shadow-card">
        <h2 className="text-lg font-semibold">Visualization could not be loaded.</h2>
        <p className="mt-1 text-sm text-muted">Something went wrong while preparing the steps. Your other pages are fine.</p>
        <Button
          variant="primary"
          className="mt-5"
          onClick={() => {
            this.setState({ failed: false });
            this.props.onRetry();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }
}
