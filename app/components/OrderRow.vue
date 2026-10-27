<script setup lang="ts">
import type { Order, Product } from '~/types'
import { formatAmount, formatLongDate, formatShortDate, sumByCurrency } from '~/utils/format'

const props = defineProps<{
  order: Order
  products: Product[]
  compact?: boolean
  active?: boolean
}>()

const emit = defineEmits<{
  select: []
  remove: []
}>()

const prices = computed(() => props.products.map((product) => product.price))
const totalUsd = computed(() => sumByCurrency(prices.value, 'USD'))
const totalUah = computed(() => sumByCurrency(prices.value, 'UAH'))
</script>

<template>
  <article
    class="order-row card-row card-row--clickable"
    :class="{ 'order-row--compact': compact, 'card-row--active': active }"
    @click="emit('select')"
  >
    <h3 v-if="!compact" class="order-row__title">{{ order.title }}</h3>

    <div class="order-row__count">
      <span class="order-row__count-icon"><i class="bi bi-list-ul" /></span>
      <span>
        <span class="order-row__count-value">{{ products.length }}</span>
        <span class="text-muted-sm d-block">Продукта</span>
      </span>
    </div>

    <div class="order-row__date">
      <div class="text-muted-sm">{{ formatShortDate(order.date) }}</div>
      <div>{{ formatLongDate(order.date) }}</div>
    </div>

    <div v-if="!compact" class="order-row__sum">
      <div class="text-muted-sm">{{ formatAmount(totalUsd) }} $</div>
      <div>{{ formatAmount(totalUah) }} <span class="order-row__currency">UAH</span></div>
    </div>

    <button
      v-if="!compact"
      type="button"
      class="order-row__delete"
      aria-label="Удалить приход"
      @click.stop="emit('remove')"
    >
      <i class="bi bi-trash" />
    </button>

    <span v-if="compact && active" class="order-row__arrow"><i class="bi bi-chevron-right" /></span>
  </article>
</template>

<style scoped>
.order-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140px 140px 160px 40px;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  position: relative;
}

.order-row--compact {
  grid-template-columns: 140px minmax(0, 1fr);
}

.order-row__title {
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  color: var(--c-text);
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-row__count {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-row__count-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--c-border);
  border-radius: 50%;
  color: var(--c-text-muted);
}

.order-row__count-value {
  font-size: 20px;
}

.order-row__currency {
  font-size: 11px;
  color: var(--c-text-muted);
}

.order-row__delete {
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
}

.order-row__delete:hover {
  color: #d9534f;
}

.order-row__arrow {
  position: absolute;
  right: -40px;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-border);
  color: var(--c-text-muted);
}

@media (max-width: 992px) {
  .order-row,
  .order-row--compact {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .order-row__arrow {
    display: none;
  }
}
</style>
