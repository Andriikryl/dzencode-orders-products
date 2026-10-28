<script setup lang="ts">
import { useAppStore } from '~/composables/useAppStore'
import { useLocaleFormat } from '~/composables/useLocaleFormat'
import { sumByCurrency } from '~/utils/format'

const { t } = useI18n()
useHead({ title: () => `${t('dashboard.title')} — Inventory` })

const store = useAppStore()
const { amount } = useLocaleFormat()

const totals = computed(() => {
  const prices = store.state.products.map((product) => product.price)
  return {
    orders: store.state.orders.length,
    products: store.state.products.length,
    usd: sumByCurrency(prices, 'USD'),
    uah: sumByCurrency(prices, 'UAH'),
  }
})
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard__title">{{ $t('dashboard.title') }}</h1>

    <div class="dashboard__tiles">
      <div class="dashboard__tile card-row">
        <span class="dashboard__tile-label">{{ $t('orders.title') }}</span>
        <span class="dashboard__tile-value">{{ totals.orders }}</span>
      </div>
      <div class="dashboard__tile card-row">
        <span class="dashboard__tile-label">{{ $t('products.title') }}</span>
        <span class="dashboard__tile-value">{{ totals.products }}</span>
      </div>
      <div class="dashboard__tile card-row">
        <span class="dashboard__tile-label">USD</span>
        <span class="dashboard__tile-value">{{ amount(totals.usd) }}</span>
      </div>
      <div class="dashboard__tile card-row">
        <span class="dashboard__tile-label">UAH</span>
        <span class="dashboard__tile-value">{{ amount(totals.uah) }}</span>
      </div>
    </div>

    <div class="dashboard__panels">
      <section class="dashboard__panel card-row">
        <h2 class="dashboard__panel-title">{{ $t('dashboard.productsByType') }}</h2>
        <ClientOnly>
          <LazyStatsChart />
          <template #fallback>
            <div class="dashboard__placeholder">{{ $t('dashboard.loading') }}</div>
          </template>
        </ClientOnly>
      </section>

      <section class="dashboard__panel card-row">
        <h2 class="dashboard__panel-title">{{ $t('dashboard.warehouses') }}</h2>
        <ClientOnly>
          <LazyWarehouseMap />
          <template #fallback>
            <div class="dashboard__placeholder">{{ $t('dashboard.loading') }}</div>
          </template>
        </ClientOnly>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard__title {
  font-size: 28px;
  font-weight: 400;
  margin: 0 0 28px;
}

.dashboard__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.dashboard__tile {
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.dashboard__panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
}

.dashboard__panel {
  padding: 22px;
}

.dashboard__panel-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
}

.dashboard__placeholder {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
}
</style>
