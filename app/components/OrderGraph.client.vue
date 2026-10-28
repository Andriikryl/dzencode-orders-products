<script setup lang="ts">
import { forceCenter, forceLink, forceManyBody, forceSimulation, type Simulation } from 'd3-force'
import { useAppStore } from '~/composables/useAppStore'

interface Node {
  id: string
  label: string
  kind: 'order' | 'type'
  weight: number
  x?: number
  y?: number
}

interface Link {
  source: string | Node
  target: string | Node
  value: number
}

const WIDTH = 520
const HEIGHT = 320
const MAX_ORDERS = 10

const store = useAppStore()

const nodes = ref<Node[]>([])
const links = ref<Link[]>([])
let simulation: Simulation<Node, undefined> | undefined

function build() {
  const orders = store.state.orders.slice(0, MAX_ORDERS)
  const orderIds = new Set(orders.map((order) => order.id))
  const products = store.state.products.filter((product) => orderIds.has(product.order))

  const types = [...new Set(products.map((product) => product.type))]

  const nextNodes: Node[] = [
    ...orders.map((order) => ({
      id: `o${order.id}`,
      label: String(order.id),
      kind: 'order' as const,
      weight: products.filter((product) => product.order === order.id).length,
    })),
    ...types.map((type) => ({
      id: `t${type}`,
      label: type,
      kind: 'type' as const,
      weight: products.filter((product) => product.type === type).length,
    })),
  ]

  const counts = new Map<string, number>()
  for (const product of products) {
    const key = `o${product.order}|t${product.type}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const nextLinks: Link[] = [...counts.entries()].map(([key, value]) => {
    const [source, target] = key.split('|') as [string, string]
    return { source, target, value }
  })

  nodes.value = nextNodes
  links.value = nextLinks

  simulation?.stop()
  simulation = forceSimulation(nodes.value)
    .force('charge', forceManyBody().strength(-180))
    .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
    .force(
      'link',
      forceLink<Node, Link>(links.value)
        .id((node) => node.id)
        .distance(90),
    )
    .on('tick', () => {
      nodes.value = [...nodes.value]
      links.value = [...links.value]
    })
}

function coord(end: string | Node, axis: 'x' | 'y'): number {
  if (typeof end === 'string') return 0
  return end[axis] ?? 0
}

onMounted(build)
watch(() => store.state.orders.length, build)

onBeforeUnmount(() => {
  simulation?.stop()
  simulation = undefined
})
</script>

<template>
  <svg class="order-graph" :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" role="img">
    <line
      v-for="(link, index) in links"
      :key="`l${index}`"
      :x1="coord(link.source, 'x')"
      :y1="coord(link.source, 'y')"
      :x2="coord(link.target, 'x')"
      :y2="coord(link.target, 'y')"
      class="order-graph__link"
      :stroke-width="Math.min(link.value, 4)"
    />

    <g
      v-for="node in nodes"
      :key="node.id"
      :transform="`translate(${node.x ?? 0}, ${node.y ?? 0})`"
    >
      <circle
        class="order-graph__node"
        :class="`order-graph__node--${node.kind}`"
        :r="node.kind === 'type' ? 16 : 8 + node.weight"
      />
      <text class="order-graph__label" :y="node.kind === 'type' ? 30 : 24">{{ node.label }}</text>
    </g>
  </svg>
</template>

<style scoped>
.order-graph {
  width: 100%;
  height: 320px;
}

.order-graph__link {
  stroke: var(--c-border);
}

.order-graph__node--order {
  fill: #8cc63e;
}

.order-graph__node--type {
  fill: #4d4d4d;
}

.order-graph__label {
  fill: var(--c-text-muted);
  font-size: 10px;
  text-anchor: middle;
}
</style>
