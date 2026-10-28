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
      <div v-if="open" class="modal d-block dialog" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-backdrop show dialog__backdrop" @click="emit('cancel')" />

        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content dialog__content">
            <button
              type="button"
              class="btn btn-light rounded-circle dialog__close"
              :aria-label="$t('dialog.close')"
              @click="emit('cancel')"
            >
              <i class="bi bi-x-lg" />
            </button>

            <div class="modal-header border-0">
              <h2 class="modal-title h5 mb-0">{{ question }}</h2>
            </div>

            <div v-if="products.length" class="modal-body p-0 border-top">
              <ul class="list-group list-group-flush dialog__products">
                <li
                  v-for="product in products"
                  :key="product.id"
                  class="list-group-item d-flex align-items-center gap-3 px-4"
                >
                  <span
                    class="dialog__status"
                    :class="{ 'dialog__status--busy': product.status !== 'free' }"
                  />
                  <ProductPhoto :type="product.type" class="dialog__photo" />
                  <span class="d-flex flex-column min-w-0">
                    <span class="dialog__product-title">{{ product.title }}</span>
                    <small class="text-body-secondary">SN-{{ product.serialNumber }}</small>
                  </span>
                </li>
              </ul>
            </div>

            <div class="modal-footer border-0 justify-content-end gap-3 dialog__footer">
              <button type="button" class="btn btn-link dialog__cancel" @click="emit('cancel')">
                {{ $t('dialog.cancel') }}
              </button>
              <button
                type="button"
                class="btn btn-light rounded-pill px-4 dialog__confirm"
                @click="emit('confirm')"
              >
                <i class="bi bi-trash me-2" />
                {{ $t('dialog.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog {
  z-index: 1055;
}

.dialog__backdrop {
  z-index: -1;
}

.dialog__content {
  border: none;
  border-radius: var(--radius);
  overflow: visible;
}

.dialog__close {
  position: absolute;
  top: -18px;
  right: -18px;
  width: 36px;
  height: 36px;
  padding: 0;
  color: var(--c-text-muted);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dialog__products {
  max-height: 260px;
  overflow-y: auto;
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

.dialog__product-title {
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dialog__footer {
  background: var(--c-accent);
  border-radius: 0 0 var(--radius) var(--radius);
}

.dialog__cancel {
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  text-decoration: none;
}

.dialog__confirm {
  color: #d9534f;
  text-transform: uppercase;
  font-weight: 600;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active .modal-dialog,
.dialog-leave-active .modal-dialog {
  transition: transform 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .modal-dialog,
.dialog-leave-to .modal-dialog {
  transform: scale(0.96);
}
</style>
