import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

export default defineNuxtPlugin({
  name: 'web-vitals',
  setup() {
    const config = useRuntimeConfig()
    const endpoint = config.public.vitalsEndpoint

    function report(metric: Metric) {
      if (!endpoint) return

      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        path: window.location.pathname,
      })

      navigator.sendBeacon?.(endpoint, body)
    }

    onCLS(report)
    onFCP(report)
    onINP(report)
    onLCP(report)
    onTTFB(report)
  },
})
