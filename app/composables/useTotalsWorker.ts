import type { Product } from '~/types'
import type { TotalsResponse } from '~/workers/totals.worker'

export function useTotalsWorker(products: Ref<Product[]>) {
  const result = ref<TotalsResponse | null>(null)
  const pending = ref(false)
  let worker: Worker | undefined

  async function compute() {
    if (!import.meta.client || !products.value.length) return

    if (!worker) {
      const TotalsWorker = (await import('~/workers/totals.worker?worker')).default
      worker = new TotalsWorker()
      worker.onmessage = (event: MessageEvent<TotalsResponse>) => {
        result.value = event.data
        pending.value = false
      }
    }

    pending.value = true
    worker.postMessage({ products: toRaw(products.value) })
  }

  onMounted(compute)
  watch(products, compute, { deep: false })

  onBeforeUnmount(() => {
    worker?.terminate()
    worker = undefined
  })

  return { result, pending }
}
