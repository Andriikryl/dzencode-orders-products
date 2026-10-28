<script setup lang="ts">
import type { Order, Product } from '~/types'

defineProps<{
  order: Order
  products: Product[]
}>()

const emit = defineEmits<{
  close: []
  removeProduct: [product: Product]
}>()
</script>

<template>
  <section class="order-details card-row">
    <button
      type="button"
      class="order-details__close"
      :aria-label="$t('dialog.close')"
      @click="emit('close')"
    >
      <i class="bi bi-x-lg" />
    </button>

    <h2 class="order-details__title">{{ order.title }}</h2>

    <button type="button" class="order-details__add">
      <i class="bi bi-plus-circle-fill" />
      {{ $t('orders.addProduct') }}
    </button>

    <ul class="order-details__list">
      <li v-for="product in products" :key="product.id" class="order-details__item">
        <span
          class="order-details__status"
          :class="{ 'order-details__status--busy': product.status !== 'free' }"
        />
        <ProductPhoto :type="product.type" class="order-details__photo" />

        <span class="order-details__text">
          <span class="order-details__name">{{ product.title }}</span>
          <span class="order-details__sn">SN-{{ product.serialNumber }}</span>
        </span>

        <span class="order-details__state" :class="{ 'order-details__state--busy': product.status !== 'free' }">
          {{ product.status === 'free' ? $t('products.free') : $t('products.inRepair') }}
        </span>

        <button
          type="button"
          class="order-details__delete"
          :aria-label="$t('products.delete')"
          @click="emit('removeProduct', product)"
        >
          <i class="bi bi-trash" />
        </button>
      </li>
    </ul>

    <p v-if="!products.length" class="order-details__empty">
      {{ $t('orders.empty') }}
    </p>
  </section>
</template>

<style scoped>
.order-details {
  position: relative;
  padding: 28px 32px;
}

.order-details__close {
  position: absolute;
  top: -16px;
  right: -16px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--c-surface);
  color: var(--c-text-muted);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}

.order-details__title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px;
}

.order-details__add {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: var(--c-accent);
  padding: 0;
  margin-bottom: 20px;
  cursor: pointer;
}

.order-details__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
}

.order-details__item {
  display: grid;
  grid-template-columns: 12px 56px minmax(0, 1fr) 120px 32px;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
}

.order-details__item + .order-details__item {
  border-top: 1px solid var(--c-border);
}

.order-details__status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-accent);
}

.order-details__status--busy {
  background: #d9534f;
}

.order-details__photo {
  width: 52px;
  height: 38px;
}

.order-details__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.order-details__name {
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-details__sn {
  color: var(--c-text-muted);
  font-size: 12px;
}

.order-details__state {
  color: var(--c-accent);
}

.order-details__state--busy {
  color: #d9534f;
}

.order-details__delete {
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
}

.order-details__delete:hover {
  color: #d9534f;
}

.order-details__empty {
  color: var(--c-text-muted);
  margin: 0;
}

@media (max-width: 992px) {
  .order-details__item {
    grid-template-columns: 12px 56px minmax(0, 1fr) 32px;
  }

  .order-details__state {
    display: none;
  }
}
</style>
