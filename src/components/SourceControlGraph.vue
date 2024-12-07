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
      <g
        v-for="node in flattenedNodes"
        :key="node.id"
        :transform="`translate(${getX(node.timestamp)}, ${getY(node.level)})`"
        @click="handleNodeClick(node)"
        class="node-group"
      >
        <circle
          :r="nodeRadius"
          :class="['node', node.nodeType]"
        />
        <text
          dy="-15"
          text-anchor="middle"
        >{{ node.title }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Connection, GraphData, Node } from '@/types/graph'

const props = defineProps<{
  data: GraphData
  width?: number
  height?: number
  nodeRadius?: number
  xScale?: number
  yScale?: number
}>()

// 定义要发射的事件
const emit = defineEmits<{
  'node-click': [node: Node]
}>()

// 提供默认值
const width = computed(() => props.width ?? 800)
const height = computed(() => props.height ?? 400)
const nodeRadius = computed(() => props.nodeRadius ?? 6)
const xScale = computed(() => props.xScale ?? 150)
const yScale = computed(() => props.yScale ?? 60)
const xOffset = 50
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
const getX = (timestamp: number) => xOffset + timestamp * xScale.value

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

.node {
  fill: var(--color-background-light);
  stroke: var(--color-border);
  stroke-width: 2;
}

.node.thought {
  fill: var(--color-background-dark);
}

.node.summary {
  fill: var(--color-background-mute);
  stroke: var(--color-background-highlight);
}

.connection {
  fill: none;
  stroke: var(--color-border);
  stroke-width: 2;
}

.connection.commit {
  stroke: var(--color-border);
  /* 普通提交用实线 */
}

.connection.branch {
  stroke-dasharray: 4;
  /* 分支用虚线 */
}

.connection.merge {
  stroke: var(--color-background-highlight);
  /* 合并用高亮色 */
}

text {
  font-size: 12px;
  fill: var(--color-text);
}

.node-group {
  cursor: pointer;
}

.node-group:hover .node {
  stroke-width: 3;
}
</style>