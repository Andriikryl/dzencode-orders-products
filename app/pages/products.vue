<script setup lang="ts">
import type { Product } from '~/types'
import { useAppStore } from '~/composables/useAppStore'
import { formatAmount, formatLongDate, formatShortDate } from '~/utils/format'

useHead({ title: 'Продукты — Inventory' })

const store = useAppStore()

const filtered = computed<Product[]>(() => store.getters.filteredProducts)
const types = computed<string[]>(() => store.state.productTypes)

const typeFilter = computed({
  get: () => store.state.typeFilter,
  set: (value: string) => store.commit('SET_TYPE_FILTER', value),
})

const orderTitles = computed<Record<number, string>>(() =>
  Object.fromEntries(store.state.orders.map((order) => [order.id, order.title])),
)

function priceIn(product: Product, symbol: 'USD' | 'UAH'): string {
  const entry = product.price.find((price) => price.symbol === symbol)
  return entry ? formatAmount(entry.value) : '—'
}

const productPendingDelete = ref<Product | null>(null)

function confirmDelete() {
  if (productPendingDelete.value) {
    store.commit('REMOVE_PRODUCT', productPendingDelete.value.id)
  }
  productPendingDelete.value = null
}
</script>

<template>
  <div class="products">
    <header class="products__header">
      <h1 class="products__title">Продукты / {{ filtered.length }}</h1>

      <label class="products__filter">
        <span class="products__filter-label">Тип:</span>
        <select v-model="typeFilter" class="form-select form-select-sm">
          <option value="">Все типы</option>
          <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>
    </header>

    <TransitionGroup name="list" tag="div" class="products__list">
      <article v-for="product in filtered" :key="product.id" class="product-row card-row">
        <span
          class="product-row__status"
          :class="{ 'product-row__status--busy': product.status !== 'free' }"
        />

        <ProductPhoto :type="product.type" class="product-row__photo" />

        <div class="product-row__name">
          <div class="product-row__title">{{ product.title }}</div>
          <div class="product-row__sn">SN-{{ product.serialNumber }}</div>
        </div>

        <div
          class="product-row__state"
          :class="{ 'product-row__state--busy': product.status !== 'free' }"
        >
          {{ product.status === 'free' ? 'Свободен' : 'В ремонте' }}
        </div>

        <div class="product-row__guarantee">
          <div><span class="text-muted-sm">с</span> {{ formatLongDate(product.guarantee.start) }}</div>
          <div><span class="text-muted-sm">по</span> {{ formatLongDate(product.guarantee.end) }}</div>
        </div>

        <div class="product-row__condition">{{ product.isNew ? 'Новый' : 'Б / У' }}</div>

        <div class="product-row__price">
          <div class="text-muted-sm">{{ priceIn(product, 'USD') }} $</div>
          <div>{{ priceIn(product, 'UAH') }} <span class="product-row__currency">UAH</span></div>
        </div>

        <div class="product-row__type">{{ product.type }}</div>

        <div class="product-row__order">{{ orderTitles[product.order] ?? '—' }}</div>

        <div class="product-row__date">
          <div class="text-muted-sm">{{ formatShortDate(product.date) }}</div>
          <div>{{ formatLongDate(product.date) }}</div>
        </div>

        <button
          type="button"
          class="product-row__delete"
          aria-label="Удалить продукт"
          @click="productPendingDelete = product"
        >
          <i class="bi bi-trash" />
        </button>
      </article>
    </TransitionGroup>

    <p v-if="!filtered.length" class="products__empty">
      По выбранному типу продуктов нет.
    </p>

    <ConfirmDeleteDialog
      :open="productPendingDelete !== null"
      question="Вы уверены, что хотите удалить этот продукт?"
      :products="productPendingDelete ? [productPendingDelete] : []"
      @cancel="productPendingDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.products__header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.products__title {
  font-size: 28px;
  font-weight: 400;
  margin: 0;
}

.products__filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.products__filter-label {
  color: var(--c-text-muted);
}

.products__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-row {
  display: grid;
  grid-template-columns: 12px 56px minmax(180px, 1.4fr) 110px 170px 80px 150px 110px minmax(140px, 1fr) 130px 32px;
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

.product-row__state {
  color: var(--c-accent);
}

.product-row__state--busy {
  color: var(--c-text);
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

.products__empty {
  color: var(--c-text-muted);
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-16px);
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
