<script setup lang="ts">
import type { Product } from '~/types'

const props = withDefaults(
  defineProps<{
    open: boolean
    question: string
    products?: Product[]
  }>(),
  { products: () => [] },
)

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('cancel')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="open" class="dialog" role="dialog" aria-modal="true">
        <div class="dialog__backdrop" @click="emit('cancel')" />

        <div class="dialog__window">
          <button
            type="button"
            class="dialog__close"
            aria-label="Закрыть"
            @click="emit('cancel')"
          >
            <i class="bi bi-x-lg" />
          </button>

          <h2 class="dialog__title">{{ question }}</h2>

          <ul v-if="products.length" class="dialog__products">
            <li v-for="product in products" :key="product.id" class="dialog__product">
              <span
                class="dialog__status"
                :class="{ 'dialog__status--busy': product.status !== 'free' }"
              />
              <ProductPhoto :type="product.type" class="dialog__photo" />
              <span class="dialog__product-text">
                <span class="dialog__product-title">{{ product.title }}</span>
                <span class="dialog__product-sn">SN-{{ product.serialNumber }}</span>
              </span>
            </li>
          </ul>

          <footer class="dialog__footer">
            <button type="button" class="dialog__cancel" @click="emit('cancel')">
              Отменить
            </button>
            <button type="button" class="dialog__confirm" @click="emit('confirm')">
              <i class="bi bi-trash" />
              Удалить
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.dialog__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(77, 90, 99, 0.65);
}

.dialog__window {
  position: relative;
  width: min(640px, calc(100% - 32px));
  background: var(--c-surface);
  border-radius: var(--radius);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  overflow: visible;
}

.dialog__close {
  position: absolute;
  top: -18px;
  right: -18px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--c-surface);
  color: var(--c-text-muted);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.dialog__title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  padding: 28px 32px;
}

.dialog__products {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--c-border);
  max-height: 260px;
  overflow-y: auto;
}

.dialog__product {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 32px;
}

.dialog__product + .dialog__product {
  border-top: 1px solid var(--c-border);
}

.dialog__status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-accent);
  flex: none;
}

.dialog__status--busy {
  background: #d9534f;
}

.dialog__photo {
  width: 48px;
  height: 36px;
  flex: none;
}

.dialog__product-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dialog__product-title {
  text-decoration: underline;
  color: var(--c-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dialog__product-sn {
  color: var(--c-text-muted);
  font-size: 12px;
}

.dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 18px 24px;
  background: var(--c-accent);
  border-radius: 0 0 var(--radius) var(--radius);
}

.dialog__cancel {
  border: none;
  background: transparent;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
}

.dialog__confirm {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  background: #fff;
  color: #d9534f;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 10px 28px;
  cursor: pointer;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active .dialog__window,
.dialog-leave-active .dialog__window {
  transition: transform 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog__window,
.dialog-leave-to .dialog__window {
  transform: scale(0.96);
}
</style>
