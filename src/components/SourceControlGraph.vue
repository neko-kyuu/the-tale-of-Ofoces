<template>
  <div class="network-container" ref="container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { GraphData } from '@/types/graph';

const props = defineProps<{
  data: GraphData
}>()

const emit = defineEmits<{
  'node-click': [node: Node]
}>()

const container = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D
let animationFrameId: number

const xScale = ref(100) // 横向缩放比例
const yScale = ref(100) // 纵向缩放比例
const xOffset = ref(50) // 横向偏移量
const yOffset = ref(50) // 纵向偏移量

// 计算节点横坐标
const getX = (timestamp: number) => xOffset.value + timestamp * xScale.value

// 计算节点纵坐标
const getY = (level: number) => yOffset.value + level * yScale.value

const getComputedColor = (varName: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName).trim()
}

// 跟踪当前悬浮的节点
const hoveredNodeId = ref<string | null>(null)

// 添加拖拽相关的状态
const isDragging = ref(false)
const lastMouseX = ref(0)
const lastMouseY = ref(0)

// 查找鼠标位置下的节点
const findNodeAtPosition = (x: number, y: number) => {
  for (const branch of props.data.branches) {
    for (const node of branch.nodes) {
      const nodeX = getX(node.timestamp) * window.devicePixelRatio
      const nodeY = getY(branch.level) * window.devicePixelRatio
      const { width, height } = getNodeDimensions(node.title)
      
      if (isPointInNode(x, y, nodeX, nodeY, width * window.devicePixelRatio, height * window.devicePixelRatio)) {
        return node
      }
    }
  }
  return null
}

// 处理鼠标按下事件
const handleMouseDown = (event: MouseEvent) => {
  if (!canvas.value) return
  
  const node = findNodeAtPosition(
    (event.clientX - canvas.value.getBoundingClientRect().left) * window.devicePixelRatio,
    (event.clientY - canvas.value.getBoundingClientRect().top) * window.devicePixelRatio
  )
  
  // 如果点击在节点上，不启动拖拽
  if (node) return
  
  isDragging.value = true
  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
  canvas.value.style.cursor = 'grabbing'
}

// 处理鼠标移动事件
const handleMouseMove = (event: MouseEvent) => {
  if (!canvas.value || !ctx) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) * window.devicePixelRatio
  const y = (event.clientY - rect.top) * window.devicePixelRatio
  
  if (isDragging.value) {
    // 计算鼠标移动距离
    const dx = event.clientX - lastMouseX.value
    const dy = event.clientY - lastMouseY.value
    
    // 更新偏移量
    xOffset.value += dx
    yOffset.value += dy
    
    // 更新最后的鼠标位置
    lastMouseX.value = event.clientX
    lastMouseY.value = event.clientY
    
    return
  }
  
  // 原有的节点悬浮检测逻辑
  const node = findNodeAtPosition(x, y)
  if (node) {
    hoveredNodeId.value = node.id
    canvas.value.style.cursor = 'pointer'
  } else {
    hoveredNodeId.value = null
    canvas.value.style.cursor = isDragging.value ? 'grabbing' : 'grab'
  }
}

// 处理鼠标松开事件
const handleMouseUp = () => {
  if (!canvas.value) return
  
  isDragging.value = false
  canvas.value.style.cursor = 'grab'
}

// 处理鼠标离开事件
const handleMouseLeave = () => {
  if (!canvas.value) return
  
  isDragging.value = false
  hoveredNodeId.value = null
  canvas.value.style.cursor = 'grab'
}

// 修改节点尺寸相关的常量
const NODE_PADDING = 10      // 节点内边距
const NODE_MIN_WIDTH = 150   // 节点最小宽度
const NODE_MAX_WIDTH = 250   // 节点最大宽度
const NODE_HEIGHT = 40       // 节点高度

// 修改获取节点尺寸的函数
const getNodeDimensions = (title: string) => {
  if (!ctx) return { width: 0, height: 0 }
  
  ctx.font = '14px Arial'
  const textWidth = ctx.measureText(title).width
  const width = Math.min(NODE_MAX_WIDTH, Math.max(NODE_MIN_WIDTH, textWidth + NODE_PADDING * 2))
  
  return { width, height: NODE_HEIGHT }
}

// 修改绘制节点的函数
const drawNode = (node: any, x: number, y: number) => {
  if (!ctx) return
  
  const { width, height } = getNodeDimensions(node.title)
  
  // 如果是悬浮状态，绘制阴影
  if (hoveredNodeId.value === node.id) {
    ctx.shadowColor = getComputedColor('--color-background-highlight')
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }
  
  // 绘制节点背景
  ctx.fillStyle = getComputedColor('--color-background-soft')
  ctx.strokeStyle = getComputedColor('--color-border')
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(x - width/2, y - height/2, width, height, 6)
  ctx.fill()
  ctx.stroke()
  
  // 重置阴影
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  
  // 绘制文本（如果文本过长则截断并添加省略号）
  ctx.fillStyle = getComputedColor('--color-text')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const maxTextWidth = width - NODE_PADDING * 2
  let displayText = node.title
  
  // 如果文本宽度超过最大宽度，截断并添加省略号
  if (ctx.measureText(node.title).width > maxTextWidth) {
    let truncated = node.title
    while (ctx.measureText(truncated + '...').width > maxTextWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1)
    }
    displayText = truncated + '...'
  }
  
  ctx.fillText(displayText, x, y)
}

// 绘制连接线
const drawConnection = (from: {x: number, y: number}, to: {x: number, y: number}, type: string) => {
  if (!ctx) return
  
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  
  // 计算控制点
  const midX = (from.x + to.x) / 2
  ctx.bezierCurveTo(midX, from.y, midX, to.y, to.x, to.y)
  
  ctx.strokeStyle = type === 'merge' 
    ? getComputedColor('--color-background-highlight') 
    : '#848484'
  ctx.lineWidth = 1
  
  if (type === 'branch') {
    ctx.setLineDash([5, 5])
  } else {
    ctx.setLineDash([])
  }
  
  ctx.stroke()
  
  // 绘制箭头
  const angle = Math.atan2(to.y - from.y, to.x - from.x)
  const arrowLength = 10
  ctx.beginPath()
  ctx.moveTo(to.x, to.y)
  ctx.lineTo(
    to.x - arrowLength * Math.cos(angle - Math.PI/6),
    to.y - arrowLength * Math.sin(angle - Math.PI/6)
  )
  ctx.moveTo(to.x, to.y)
  ctx.lineTo(
    to.x - arrowLength * Math.cos(angle + Math.PI/6),
    to.y - arrowLength * Math.sin(angle + Math.PI/6)
  )
  ctx.stroke()
}

// 渲染整个图形
const render = () => {
  if (!ctx || !canvas.value) return
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // 绘制连接线
  props.data.connections.forEach(conn => {
    const fromNode = props.data.branches
      .flatMap(b => b.nodes)
      .find(n => n.id === conn.from)
    const toNode = props.data.branches
      .flatMap(b => b.nodes)
      .find(n => n.id === conn.to)
      
    if (fromNode && toNode) {
      const fromBranch = props.data.branches.find(b => 
        b.nodes.some(n => n.id === fromNode.id)
      )
      const toBranch = props.data.branches.find(b => 
        b.nodes.some(n => n.id === toNode.id)
      )
      
      if (fromBranch && toBranch) {
        drawConnection(
          {
            x: getX(fromNode.timestamp),
            y: getY(fromBranch.level)
          },
          {
            x: getX(toNode.timestamp),
            y: getY(toBranch.level)
          },
          conn.type
        )
      }
    }
  })
  
  // 绘制节点
  props.data.branches.forEach(branch => {
    branch.nodes.forEach(node => {
      drawNode(
        node,
        getX(node.timestamp),
        getY(branch.level)
      )
    })
  })
  
  animationFrameId = requestAnimationFrame(render)
}

// 调整Canvas大小
const resizeCanvas = () => {
  if (!canvas.value || !container.value) return
  
  const { width, height } = container.value.getBoundingClientRect()
  canvas.value.width = width * window.devicePixelRatio
  canvas.value.height = height * window.devicePixelRatio
  canvas.value.style.width = `${width}px`
  canvas.value.style.height = `${height}px`
  ctx?.scale(window.devicePixelRatio, window.devicePixelRatio)
}

// 检查点是否在节点内部
const isPointInNode = (x: number, y: number, nodeX: number, nodeY: number, width: number, height: number) => {
  return x >= nodeX - width/2 && 
         x <= nodeX + width/2 && 
         y >= nodeY - height/2 && 
         y <= nodeY + height/2
}

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (!canvas.value || !ctx) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) * window.devicePixelRatio
  const y = (event.clientY - rect.top) * window.devicePixelRatio
  
  const node = findNodeAtPosition(x, y)
  if (node) {
    emit('node-click', node)
  }
}

// 计算内容的边界范围
const calculateContentBounds = () => {
  if (!ctx || !container.value) return
  
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  
  // 计算所有节点的边界
  props.data.branches.forEach(branch => {
    branch.nodes.forEach(node => {
      const x = node.timestamp
      const y = branch.level
      
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    })
  })
  
  if (minX === Infinity || maxX === -Infinity || minY === Infinity || maxY === -Infinity) {
    return
  }
  
  // 获取容器尺寸
  const { width: containerWidth, height: containerHeight } = container.value.getBoundingClientRect()
  
  // 计算内容的宽度和高度
  const contentWidth = (maxX - minX) * xScale.value
  const contentHeight = (maxY - minY) * yScale.value
  
  // 计算居中所需的偏移量
  xOffset.value = (containerWidth - contentWidth) / 2 - minX * xScale.value
  yOffset.value = (containerHeight - contentHeight) / 2 - minY * yScale.value
}

onMounted(() => {
  if (!canvas.value) return
  
  ctx = canvas.value.getContext('2d')!
  resizeCanvas()
  calculateContentBounds()
  render()
  
  window.addEventListener('resize', resizeCanvas)
  canvas.value.addEventListener('click', handleClick)
  canvas.value.addEventListener('mousemove', handleMouseMove)
  canvas.value.addEventListener('mousedown', handleMouseDown)
  canvas.value.addEventListener('mouseup', handleMouseUp)
  canvas.value.addEventListener('mouseleave', handleMouseLeave)
  
  canvas.value.style.cursor = 'grab'
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  canvas.value?.removeEventListener('click', handleClick)
  canvas.value?.removeEventListener('mousemove', handleMouseMove)
  canvas.value?.removeEventListener('mousedown', handleMouseDown)
  canvas.value?.removeEventListener('mouseup', handleMouseUp)
  canvas.value?.removeEventListener('mouseleave', handleMouseLeave)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// 在数据变化时重新计算位置
watch(() => props.data, () => {
  calculateContentBounds()
  render()
})
</script>

<style scoped>
.network-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>