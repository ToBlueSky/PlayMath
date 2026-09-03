import { Component, type ReactNode } from 'react'

type ErrorBoundaryProps = { children: ReactNode; fallback?: ReactNode }
type ErrorBoundaryState = { hasError: boolean }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="error-fallback">
          <span className="error-icon">🔧</span>
          <p>出了点小问题，刷新页面试试。</p>
        </div>
      )
    }
    return this.props.children
  }
}
