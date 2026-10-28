<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { useAppStore } from '~/composables/useAppStore'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useAppStore()
const { t } = useI18n()

const byType = computed(() => {
  const counts = new Map<string, number>()
  for (const product of store.state.products) {
    counts.set(product.type, (counts.get(product.type) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
})

const chartData = computed(() => ({
  labels: byType.value.map(([type]) => type),
  datasets: [
    {
      label: t('dashboard.productsByType'),
      data: byType.value.map(([, count]) => count),
      backgroundColor: '#8cc63e',
      borderRadius: 4,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
}
</script>

<template>
  <div class="stats-chart">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.stats-chart {
  height: 320px;
}
</style>
