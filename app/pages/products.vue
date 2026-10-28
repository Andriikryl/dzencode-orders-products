<script setup lang="ts">
import type { Product } from '~/types'
import { useAppStore } from '~/composables/useAppStore'

const { t } = useI18n()

useHead({ title: () => `${t('products.title')} — Inventory` })

const store = useAppStore()

const filtered = computed<Product[]>(() => store.getters.filteredProducts)
const types = computed<string[]>(() => store.state.productTypes)

const typeFilter = computed({
  get: () => store.state.typeFilter,
  set: (value: string) => store.dispatch('setTypeFilter', value),
})

const orderTitles = computed<Record<number, string>>(() =>
  Object.fromEntries(store.state.orders.map((order) => [order.id, order.title])),
)

const pending = ref<Product | null>(null)

function confirmDelete() {
  if (pending.value) store.dispatch('deleteProduct', pending.value)
  pending.value = null
}
</script>

<template>
  <div class="products">
    <header class="products__header">
      <h1 class="products__title">{{ $t('products.title') }} / {{ filtered.length }}</h1>

      <label class="products__filter">
        <span class="products__filter-label">{{ $t('products.type') }}</span>
        <select v-model="typeFilter" class="form-select form-select-sm">
          <option value="">{{ $t('products.allTypes') }}</option>
          <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>
    </header>

    <TransitionGroup name="list" tag="div" class="products__list">
      <ProductRow
        v-for="product in filtered"
        :key="product.id"
        :product="product"
        :order-title="orderTitles[product.order]"
        @remove="pending = product"
      />
    </TransitionGroup>

    <p v-if="!filtered.length" class="products__empty">
      {{ $t('products.empty') }}
    </p>

    <ConfirmDeleteDialog
      :open="pending !== null"
      :question="$t('dialog.deleteProduct')"
      :products="pending ? [pending] : []"
      @cancel="pending = null"
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
</style>
