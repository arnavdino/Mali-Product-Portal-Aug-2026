import React from "react";
import sad from "../../components/confused.png";

export class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return <div className="flex flex-col justify-center content-center h-screen">Something went wrong.</div>;
    }

    return this.props.children;
  }
}
