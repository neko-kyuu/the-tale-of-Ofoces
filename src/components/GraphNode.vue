<script setup lang="ts">
import type { Node } from '@/types/graph'
import { computed } from 'vue';

export type NodeStyle = 'circle' | 'rectangle'

const props = defineProps<{
  node: Node
  x: number
  y: number
  style?: NodeStyle
  width?: number
  height?: number
  radius?: number
}>()

// 提供默认值
const nodeStyle = computed(() => props.style ?? 'circle')
const nodeWidth = computed(() => props.width ?? 120)
const headerHeight = computed(() => 24)
const nodeRadius = computed(() => props.radius ?? 6)

// 计算内容文本的行数和高度
const contentLines = computed(() => {
  if (!props.node.content) return []
  
  const charsPerLine = Math.floor((nodeWidth.value - 20) / 12) 
  const content = props.node.content
  const lines = []
  let start = 0
  
  // 考虑最大行数限制
  const maxLines = 3
  
  while (start < content.length && lines.length < maxLines) {
    let line = content.slice(start, start + charsPerLine)
    // 如果是最后一行且还有更多内容，添加省略号
    if (lines.length === maxLines - 1 && start + charsPerLine < content.length) {
      line = line.slice(0, -3) + '...'
    }
    lines.push(line)
    start += charsPerLine
  }
  
  return lines
})

// 计算节点总高度
const nodeHeight = computed(() => {
  if (nodeStyle.value === 'circle') {
    return props.height ?? 60
  }
  // 标题栏高度 + 每行文本高度(16px) + padding(20px)
  return headerHeight.value + contentLines.value.length * 16 + 20
})

// 根据节点类型获取形状
const getShape = () => {
  if (nodeStyle.value === 'circle') {
    return 'circle'
  }
  return 'rect'
}

// 获取文本Y轴偏移
const getTextDY = () => {
  return nodeStyle.value === 'circle' ? -15 : 0
}

// 获取形状属性
const getShapeProps = () => {
  if (nodeStyle.value === 'circle') {
    return {
      r: nodeRadius.value
    }
  }
  return {
    width: nodeWidth.value,
    height: nodeHeight.value,
    x: -nodeWidth.value / 2,
    y: -nodeHeight.value / 2,
    rx: 4,
    ry: 4
  }
}

// 处理标题文本
const titleText = computed(() => {
  if (!props.node.title) return ''
  return props.node.title.length > 10 
    ? props.node.title.slice(0, 7) + '...'
    : props.node.title
})
</script>

<template>
  <g
    :transform="`translate(${x}, ${y})`"
    class="node-group"
  >
    <!-- 圆形节点 -->
    <template v-if="nodeStyle === 'circle'">
      <circle
        v-bind="getShapeProps()"
        :class="['node', node.nodeType]"
      />
      <text
        :dy="getTextDY()"
        text-anchor="middle"
      >{{ titleText }}</text>
    </template>

    <!-- 矩形节点 -->
    <template v-else>
      <!-- 主体背景 -->
      <rect
        v-bind="getShapeProps()"
        :class="['node', node.nodeType]"
      />
      <!-- 标题栏背景 -->
      <rect
        :width="nodeWidth"
        :height="headerHeight"
        :x="-nodeWidth / 2"
        :y="-nodeHeight / 2"
        :rx="4"
        :ry="4"
        class="node-header"
      />
      <!-- 标题文本 -->
      <text
        :y="-nodeHeight / 2 + headerHeight / 2"
        text-anchor="middle"
        class="title"
      >{{ titleText }}</text>
      <!-- 内容文本 - 多行显示 -->
      <text
        v-for="(line, index) in contentLines"
        :key="index"
        :y="-nodeHeight / 2 + headerHeight + 16 + index * 16"
        text-anchor="middle"
        class="content"
      >{{ line }}</text>
    </template>
  </g>
</template>

<style scoped>
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

.node.timestamp {
  fill: var(--color-background-soft);
}

.node-header {
  fill: var(--color-background-mute);
  stroke: none;
}

.node.thought + .node-header {
  fill: var(--color-background-soft);
}

.node.summary + .node-header {
  fill: var(--color-background-highlight);
}

text {
  font-size: 12px;
  fill: var(--color-text);
  user-select: none;
}

.title {
  font-weight: 500;
  font-size: 12px;
}

.content {
  font-size: 11px;
  fill: var(--color-text);
  opacity: 0.8;
  dominant-baseline: middle;
}
</style>
