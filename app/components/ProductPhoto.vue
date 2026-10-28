<script setup lang="ts">
const props = defineProps<{ type: string }>()

const ICONS: Record<string, string> = {
  Monitors: 'bi-display',
  Laptops: 'bi-laptop',
  Phones: 'bi-phone',
  Printers: 'bi-printer',
  Tablets: 'bi-tablet',
}

const icon = computed(() => ICONS[props.type] ?? 'bi-box-seam')
</script>

<template>
  <span class="product-photo" :title="type">
    <i class="bi" :class="icon" />
  </span>
</template>

<style scoped>
.product-photo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 2px;
  color: var(--c-text-muted);
  font-size: 18px;
}
</style>
