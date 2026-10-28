<script setup lang="ts">
import type { Product } from '~/types'
import { priceBySymbol } from '~/utils/format'
import { useLocaleFormat } from '~/composables/useLocaleFormat'

const props = defineProps<{
  product: Product
  orderTitle?: string
}>()

const emit = defineEmits<{ remove: [] }>()

const { shortDate, longDate, amount } = useLocaleFormat()

function price(symbol: 'USD' | 'UAH'): string {
  const value = priceBySymbol(props.product.price, symbol)
  return value === null ? '—' : amount(value)
}
</script>

<template>
  <article class="product-row card surface">
    <span
      class="product-row__status"
      :class="{ 'product-row__status--busy': product.status !== 'free' }"
    />

    <ProductPhoto :type="product.type" class="product-row__photo" />

    <div class="product-row__name">
      <div class="product-row__title">{{ product.title }}</div>
      <div class="product-row__sn">SN-{{ product.serialNumber }}</div>
    </div>

    <ProductStatusBadge :status="product.status" class="product-row__state" />

    <div class="product-row__guarantee">
      <div>
        <span class="text-muted-sm">{{ $t('products.from') }}</span>
        {{ longDate(product.guarantee.start) }}
      </div>
      <div>
        <span class="text-muted-sm">{{ $t('products.to') }}</span>
        {{ longDate(product.guarantee.end) }}
      </div>
    </div>

    <div class="product-row__condition">
      {{ product.isNew ? $t('products.new') : $t('products.used') }}
    </div>

    <div class="product-row__price">
      <div class="text-muted-sm">{{ price('USD') }} $</div>
      <div>{{ price('UAH') }} <span class="product-row__currency">UAH</span></div>
    </div>

    <div class="product-row__type">{{ product.type }}</div>

    <div class="product-row__order">{{ orderTitle ?? '—' }}</div>

    <div class="product-row__date">
      <div class="text-muted-sm">{{ shortDate(product.date) }}</div>
      <div>{{ longDate(product.date) }}</div>
    </div>

    <button
      type="button"
      class="product-row__delete"
      :aria-label="$t('products.delete')"
      @click="emit('remove')"
    >
      <i class="bi bi-trash" />
    </button>
  </article>
</template>

<style scoped>
.product-row {
  display: grid;
  grid-template-columns:
    12px 56px minmax(180px, 1.4fr) 110px 170px 80px 150px 110px minmax(140px, 1fr)
    130px 32px;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
}

.product-row__status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-accent);
}

.product-row__status--busy {
  background: #4d4d4d;
}

.product-row__photo {
  width: 52px;
  height: 38px;
}

.product-row__name {
  min-width: 0;
}

.product-row__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-row__sn {
  color: var(--c-text-muted);
  font-size: 12px;
}

.product-row__order {
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-row__currency {
  font-size: 11px;
  color: var(--c-text-muted);
}

.product-row__delete {
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
}

.product-row__delete:hover {
  color: #d9534f;
}

@media (max-width: 1400px) {
  .product-row {
    grid-template-columns: 12px 56px minmax(0, 1fr) 110px 150px 110px 32px;
  }

  .product-row__condition,
  .product-row__type,
  .product-row__order,
  .product-row__date {
    display: none;
  }
}

@media (max-width: 768px) {
  .product-row {
    grid-template-columns: 12px 48px minmax(0, 1fr) 32px;
  }

  .product-row__state,
  .product-row__guarantee,
  .product-row__price {
    display: none;
  }
}
</style>
