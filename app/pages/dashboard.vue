<script setup lang="ts">
import { useAppStore } from '~/composables/useAppStore'
import { useLocaleFormat } from '~/composables/useLocaleFormat'
import { sumByCurrency } from '~/utils/format'
import { useTotalsWorker } from '~/composables/useTotalsWorker'

const { t } = useI18n()
useHead({ title: () => `${t('dashboard.title')} — Inventory` })

const store = useAppStore()
const { amount } = useLocaleFormat()

const products = computed(() => store.state.products)
const { result: workerTotals, pending: workerPending } = useTotalsWorker(products)

const tiles = computed(() => {
  const prices = store.state.products.map((product) => product.price)
  return [
    { key: 'orders', label: t('orders.title'), value: String(store.state.orders.length) },
    { key: 'products', label: t('products.title'), value: String(store.state.products.length) },
    { key: 'usd', label: 'USD', value: amount(sumByCurrency(prices, 'USD')) },
    { key: 'uah', label: 'UAH', value: amount(sumByCurrency(prices, 'UAH')) },
  ]
})
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard__title">{{ $t('dashboard.title') }}</h1>

    <div class="row g-3 mb-4">
      <div v-for="tile in tiles" :key="tile.key" class="col-6 col-lg-3">
        <div class="card card-body surface dashboard__tile">
          <span class="dashboard__tile-label">{{ tile.label }}</span>
          <span class="dashboard__tile-value">{{ tile.value }}</span>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12 col-xl-6">
        <section class="card card-body surface h-100">
          <h2 class="h6 mb-3">{{ $t('dashboard.productsByType') }}</h2>
          <ClientOnly>
            <LazyStatsChart />
            <template #fallback>
              <div class="dashboard__placeholder">{{ $t('dashboard.loading') }}</div>
            </template>
          </ClientOnly>
        </section>
      </div>

      <div class="col-12 col-xl-6">
        <section class="card card-body surface h-100">
          <h2 class="h6 mb-3">{{ $t('dashboard.graph') }}</h2>
          <ClientOnly>
            <LazyOrderGraph />
            <template #fallback>
              <div class="dashboard__placeholder">{{ $t('dashboard.loading') }}</div>
            </template>
          </ClientOnly>
        </section>
      </div>

      <div class="col-12 col-xl-6">
        <section class="card card-body surface h-100">
          <h2 class="h6 mb-3">{{ $t('dashboard.workerTotals') }}</h2>
          <ClientOnly>
            <div v-if="workerPending" class="dashboard__placeholder">
              {{ $t('dashboard.loading') }}
            </div>
            <ul v-else-if="workerTotals" class="list-group list-group-flush">
              <li
                v-for="row in workerTotals.totals.slice(0, 5)"
                :key="row.orderId"
                class="list-group-item d-flex justify-content-between align-items-center px-0"
              >
                <span class="text-body-secondary">#{{ row.orderId }}</span>
                <span class="badge rounded-pill text-bg-light">{{ row.count }}</span>
                <span>{{ amount(row.uah) }} UAH</span>
              </li>
            </ul>
            <template #fallback>
              <div class="dashboard__placeholder">{{ $t('dashboard.loading') }}</div>
            </template>
          </ClientOnly>
        </section>
      </div>

      <div class="col-12 col-xl-6">
        <section class="card card-body surface h-100">
          <h2 class="h6 mb-3">{{ $t('dashboard.warehouses') }}</h2>
          <ClientOnly>
            <LazyWarehouseMap />
            <template #fallback>
              <div class="dashboard__placeholder">{{ $t('dashboard.loading') }}</div>
            </template>
          </ClientOnly>
        </section>
      </div>

      <div class="col-12">
        <ActivityFeed />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard__title {
  font-size: 28px;
  font-weight: 400;
  margin: 0 0 28px;
}

.dashboard__tile-label {
  color: var(--c-text-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dashboard__tile-value {
  font-size: 24px;
}

.dashboard__placeholder {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
}
</style>
