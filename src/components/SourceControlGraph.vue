<template>
  <div class="network-container" ref="container">
    <div id="network"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Network, DataSet } from 'vis-network/standalone'
import type { Node, Edge, Options } from 'vis-network'
import { GraphData } from '@/types/graph';

const props = defineProps<{
  data: GraphData
}>()

const emit = defineEmits<{
  'node-click': [node: Node]
}>()

const container = ref<HTMLElement>()
let network: Network

const xScale = ref(100) // 横向缩放比例
const yScale = ref(100) // 纵向缩放比例
const xOffset = ref(50) // 横向偏移量
const yOffset = ref(50) // 纵向偏移量

// 计算节点横坐标
const getX = (timestamp: number) => xOffset.value + timestamp * xScale.value

// 计算节点纵坐标
const getY = (level: number) => yOffset.value + level * yScale.value

// 将节点数据转换为vis-network格式
const getVisNodes = () => {
  return new DataSet(
    props.data.branches.flatMap(branch =>
      branch.nodes.map(node => ({
        id: node.id,
        shape: 'box',
        label: node.title,
        level: branch.level,
        x: getX(node.timestamp),
        y: getY(branch.level),
        fixed: true,
        margin: 10,
        shadow: true,
        color: {
          background: getComputedColor('--color-background-soft'),
          border: getComputedColor('--color-border')
        }
      }))
    )
  )
}

// 将连接转换为vis-network边
const getVisEdges = () => {
  return new DataSet(
    props.data.connections.map(conn => ({
      from: conn.from,
      to: conn.to,
      arrows: 'to',
      // 使用对象形式设置颜色
      color: {
        color: conn.type === 'merge' ? getComputedColor('--color-background-highlight') : '#848484',
        inherit: false
      },
      dashes: conn.type === 'branch'
    }))
  )
}

// 网络配置选项
const options: Options = {
  nodes: {
    font: {
      size: 14
    },
    borderWidth: 1,
    borderWidthSelected: 2,
    chosen: {
      node: (values, id, selected, hovering) => {
        if (selected) {
          values.borderColor = getComputedColor('--color-background-highlight');
          values.borderWidth = 2
        }
      },
      label: false
    },
    fixed: true,
    scaling: {
      min: 1,
      max: 1.1,
      label: {
        enabled: false
      }
    },
    hover: {
      cursor: 'pointer'
    }
  },
  edges: {
    smooth: {
      type: 'cubicBezier'
    },
    width: 1
  },
  physics: {
    enabled: false
  },
  interaction: {
    dragNodes: false,
    hover: true // 启用hover交互
  },
  manipulation: {
    enabled: false
  }
}

const getComputedColor = (varName: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName).trim()
}

onMounted(() => {
  if (!container.value) return
  
  const nodes = getVisNodes()
  const edges = getVisEdges()
  
  network = new Network(
    container.value,
    { nodes, edges },
    options
  )
  
  // 处理节点点击
  network.on('click', (params) => {
    if (params.nodes.length) {
      const nodeId = params.nodes[0]
      const node = props.data.branches
        .flatMap(b => b.nodes)
        .find(n => n.id === nodeId)
      if (node) {
        emit('node-click', node)
      }
    }
  })
})
onUnmounted(() => {
  if (network) {
    network.destroy()
    network = null
  }
})

// 数据变化时更新视图
watch(() => props.data, () => {
  if (network) {
    network.setData({
      nodes: getVisNodes(),
      edges: getVisEdges()
    })
  }
})
</script>

<style scoped>
.network-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

#network {
  width: 100%;
  height: 100%;
}
/* 自定义节点样式 */
:deep(.custom-node) {
  padding: 12px;
  min-width: 150px;
  background: var(--color-background);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.node-title) {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--color-text);
}

:deep(.node-content) {
  font-size: 12px;
  color: var(--color-text-light);
  line-height: 1.4;
}

/* 确保节点内容可以换行 */
:deep(.vis-network .vis-node) {
  white-space: normal;
  word-wrap: break-word;
}
</style>