<script setup lang="ts">
import type { Order, Product } from '~/types'
import { useAppStore } from '~/composables/useAppStore'

const { t } = useI18n()

useHead({ title: () => `${t('orders.title')} — Inventory` })

const store = useAppStore()

const orders = computed<Order[]>(() => store.state.orders)
const productsByOrder = computed<Record<number, Product[]>>(() => store.getters.productsByOrder)
const openOrderId = computed(() => store.state.openOrderId)

const openOrder = computed<Order | null>(
  () => orders.value.find((order) => order.id === openOrderId.value) ?? null,
)
const openProducts = computed<Product[]>(() =>
  openOrderId.value === null ? [] : productsByOrder.value[openOrderId.value] ?? [],
)

const orderPendingDelete = ref<Order | null>(null)
const productPendingDelete = ref<Product | null>(null)

const dialogOpen = computed(() => orderPendingDelete.value !== null || productPendingDelete.value !== null)

const dialogQuestion = computed(() =>
  productPendingDelete.value
    ? t('dialog.deleteProduct')
    : t('dialog.deleteOrder'),
)

const dialogProducts = computed<Product[]>(() => {
  if (productPendingDelete.value) return [productPendingDelete.value]
  if (!orderPendingDelete.value) return []
  return productsByOrder.value[orderPendingDelete.value.id] ?? []
})

function products(orderId: number): Product[] {
  return productsByOrder.value[orderId] ?? []
}

function closeDialog() {
  orderPendingDelete.value = null
  productPendingDelete.value = null
}

function confirmDelete() {
  if (productPendingDelete.value) {
    store.commit('REMOVE_PRODUCT', productPendingDelete.value.id)
  } else if (orderPendingDelete.value) {
    store.commit('REMOVE_ORDER', orderPendingDelete.value.id)
  }
  closeDialog()
}
</script>

<template>
  <div class="orders">
    <header class="orders__header">
      <button type="button" class="orders__add" :aria-label="$t('orders.add')">+</button>
      <h1 class="orders__title">{{ $t('orders.title') }} / {{ orders.length }}</h1>
    </header>

    <div class="orders__body" :class="{ 'orders__body--split': openOrder }">
      <TransitionGroup name="list" tag="div" class="orders__list">
        <OrderRow
          v-for="order in orders"
          :key="order.id"
          :order="order"
          :products="products(order.id)"
          :compact="Boolean(openOrder)"
          :active="order.id === openOrderId"
          @select="store.dispatch('toggleOrder', order.id)"
          @remove="orderPendingDelete = order"
        />
      </TransitionGroup>

      <Transition name="panel">
        <OrderDetails
          v-if="openOrder"
          :order="openOrder"
          :products="openProducts"
          class="orders__panel"
          @close="store.commit('SET_OPEN_ORDER', null)"
          @remove-product="productPendingDelete = $event"
        />
      </Transition>
    </div>

    <ConfirmDeleteDialog
      :open="dialogOpen"
      :question="dialogQuestion"
      :products="dialogProducts"
      @cancel="closeDialog"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.orders__header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}

.orders__add {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: var(--c-accent);
  color: #fff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.orders__title {
  font-size: 28px;
  font-weight: 400;
  margin: 0;
}

.orders__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
  align-items: start;
}

.orders__body--split {
  grid-template-columns: 460px minmax(0, 1fr);
}

.orders__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
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

.list-leave-active {
  position: absolute;
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (max-width: 992px) {
  .orders__body--split {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
