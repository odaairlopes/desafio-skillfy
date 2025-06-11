import { onCLS, onINP, onFCP, onLCP, onTTFB } from "web-vitals";

interface WebVitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

function sendToAnalytics(metric: WebVitalMetric) {
  // Log para desenvolvimento
  console.log(`📊 ${metric.name}: ${metric.value}ms (${metric.rating})`);

  // Em produção, enviar para analytics
  if (process.env.NODE_ENV === "production") {
    // Enviar para Google Analytics, etc.
  }
}

export function measureWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
