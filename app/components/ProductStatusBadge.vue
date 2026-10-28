<script setup lang="ts">
import type { ProductStatus } from '~/types'

const props = defineProps<{ status: ProductStatus }>()

const isFree = computed(() => props.status === 'free')
</script>

<template>
  <span
    class="badge rounded-pill product-status"
    :class="isFree ? 'text-bg-light product-status--free' : 'text-bg-secondary'"
  >
    {{ isFree ? $t('products.free') : $t('products.inRepair') }}
  </span>
</template>

<style scoped>
.product-status--free {
  color: var(--c-accent);
}
</style>
