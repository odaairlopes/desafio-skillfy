import React from "react";

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    this.metrics.set(`${label}_start`, performance.now());
  }

  endTimer(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (!startTime) {
      console.warn(`Timer ${label} was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.set(label, duration);

    if (process.env.NODE_ENV === "development") {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  getMetric(label: string): number | undefined {
    return this.metrics.get(label);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics.entries());
  }

  measureComponentRender<T extends React.ComponentType<any>>(
    Component: T,
    displayName?: string
  ): T {
    const name = displayName || Component.displayName || Component.name;

    return React.memo(
      React.forwardRef((props: any, ref) => {
        this.startTimer(`render_${name}`);

        React.useEffect(() => {
          this.endTimer(`render_${name}`);
        });

        return React.createElement(Component, { ...props, ref });
      })
    ) as unknown as T;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
