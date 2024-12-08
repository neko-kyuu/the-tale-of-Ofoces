<template>
  <div class="graph-container">
    <svg :width="width" :height="height">
      <!-- 连接线 -->
      <path
        v-for="conn in connections"
        :key="`conn-${conn.from}-${conn.to}`"
        :d="getPathD(conn)"
        :class="['connection', conn.type]"
      />
      
      <!-- 节点 -->
      <GraphNode
        v-for="node in flattenedNodes"
        :key="node.id"
        :node="node"
        :x="getX(node.timestamp)"
        :y="getY(node.level)"
        :style="nodeStyle"
        :width="nodeWidth"
        :height="nodeHeight"
        :radius="nodeRadius"
        @click="handleNodeClick(node)"
        class="node-group"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Connection, GraphData, Node } from '@/types/graph'
import GraphNode from '@/components/GraphNode.vue'
import type { NodeStyle } from '@/components/GraphNode.vue'

const props = defineProps<{
  data: GraphData
  width?: number
  height?: number
  nodeStyle?: NodeStyle
  nodeWidth?: number
  nodeHeight?: number
  nodeRadius?: number
  xScale?: number
  yScale?: number
}>()

const emit = defineEmits<{
  'node-click': [node: Node]
}>()

// 提供默认值
const width = computed(() => props.width ?? 800)
const height = computed(() => props.height ?? 400)
const nodeRadius = computed(() => props.nodeRadius ?? 6)
const xScale = computed(() => props.xScale ?? 150)
const yScale = computed(() => {
  if (props.nodeStyle === 'rectangle') {
    return props.yScale ?? 100 // 矩形模式下增加垂直间距
  }
  return props.yScale ?? 60 // 圆形模式保持原间距
})

// 根据节点样式计算水平偏移
const xOffset = computed(() => {
  if (props.nodeStyle === 'rectangle') {
    return (props.nodeWidth ?? 120) / 2 + 20 // 矩形宽度的一半加上边距
  }
  return 80 // 圆形节点
})

const yOffset = computed(() => height.value / 2)

// 计算所有节点的扁平数组
const flattenedNodes = computed(() => {
  return props.data.branches.flatMap(branch => 
    branch.nodes.map(node => ({
      ...node,
      level: branch.level
    }))
  )
})

// 获取节点的连接线
const connections = computed(() => props.data.connections)

// 计算节点横坐标
const getX = (timestamp: number) => xOffset.value + timestamp * xScale.value

// 计算节点纵坐标
const getY = (level: number) => yOffset.value + level * yScale.value

// 生成连接线路径
const getPathD = (conn: Connection) => {
  const fromNode = flattenedNodes.value.find(n => n.id === conn.from)
  const toNode = flattenedNodes.value.find(n => n.id === conn.to)
  
  if (!fromNode || !toNode) return ''
  
  const x1 = getX(fromNode.timestamp)
  const y1 = getY(fromNode.level)
  const x2 = getX(toNode.timestamp)
  const y2 = getY(toNode.level)
  
  const controlX = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`
}

// 节点点击处理函数
const handleNodeClick = (node: Node) => {
  emit('node-click', node)
}
</script>

<style scoped>
.graph-container {
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background-soft);
}

.connection {
  fill: none;
  stroke: var(--color-border);
  stroke-width: 2;
}

.connection.commit {
  stroke: var(--color-border);
}

.connection.branch {
  stroke-dasharray: 4;
}

.connection.merge {
  stroke: var(--color-background-highlight);
}

.node-group {
  cursor: pointer;
}

.node-group:hover .node {
  stroke-width: 3;
}
</style>