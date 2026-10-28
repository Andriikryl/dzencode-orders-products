<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const WAREHOUSES = [
  { name: 'Київ', lat: 50.4501, lng: 30.5234, orders: 11 },
  { name: 'Одеса', lat: 46.4825, lng: 30.7233, orders: 8 },
  { name: 'Львів', lat: 49.8397, lng: 24.0297, orders: 6 },
]

const container = ref<HTMLDivElement | null>(null)
let map: L.Map | undefined

onMounted(() => {
  if (!container.value) return

  map = L.map(container.value).setView([49.0, 31.0], 5)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 18,
  }).addTo(map)

  for (const warehouse of WAREHOUSES) {
    L.circleMarker([warehouse.lat, warehouse.lng], {
      radius: 8 + warehouse.orders / 2,
      color: '#8cc63e',
      fillColor: '#8cc63e',
      fillOpacity: 0.6,
      weight: 2,
    })
      .addTo(map)
      .bindPopup(`<strong>${warehouse.name}</strong><br>${warehouse.orders}`)
  }
})

onBeforeUnmount(() => {
  map?.remove()
  map = undefined
})
</script>

<template>
  <div ref="container" class="warehouse-map" />
</template>

<style scoped>
.warehouse-map {
  height: 320px;
  border-radius: var(--radius);
  overflow: hidden;
}
</style>
