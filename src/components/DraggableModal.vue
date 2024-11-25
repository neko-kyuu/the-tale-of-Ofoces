<template>
  <Teleport to="body">
    <div 
      v-if="visible"
      ref="modalRef"
      class="modal-window"
      :class="{ 'mobile': isMobile, 'modal-closing': isClosing }"
      :style="{
        ...modalStyle,
        zIndex: currentZIndex
      }"
      @mousedown="handleMouseDown"
    >
      <!-- 拖拽手柄 -->
      <div class="modal-handle">
        <div class="modal-title">{{ title }}</div>
        <div class="modal-controls">
          <button 
            class="control-button" 
            @click="closeModal"
            title="关闭"
          >
            <i class="fi fi-rr-cross"></i>
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="modal-content">
        <slot></slot>
      </div>

      <!-- 调整大小的手柄 -->
      <div 
        v-if="!isMobile"
        class="resize-handle"
        @mousedown.stop="startResize"
      ></div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-window {
  position: fixed;
  background: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  z-index: 2000;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: center center;
}

.modal-handle {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  border-bottom: 1px solid var(--color-border);
  user-select: none;
}

.modal-title {
  font-weight: 500;
}

.modal-controls {
  display: flex;
  gap: 0.5rem;
}

.control-button {
  background: var(--color-danger-bg);
  color: var(--vt-c-white);
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: inset 0 -2px var(--color-background-mute);
}

.control-button:hover {
  background-color: var(--color-danger-bg);
}

.control-button i {
  font-size: 16px;
}

.modal-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  cursor: se-resize;
}

.resize-handle::after {
  content: '';
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--color-border);
  border-bottom: 2px solid var(--color-border);
}

/* 移动端样式 */
@media (max-width: 768px) {
  .modal-window.mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100% !important;
    height: 100% !important;
    transform: none !important;
    border-radius: 0;
    background: var(--color-background-soft);
  }

  .modal-window.mobile.modal-closing {
    opacity: 0;
    transform: translateY(100%);
  }
}

/* 关闭动画 */
.modal-closing {
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.2s ease-in-out;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'

const props = defineProps({
  title: String,
  visible: Boolean,
  initialWidth: {
    type: Number,
    default: 800
  },
  initialHeight: {
    type: Number,
    default: 600
  },
  minWidth: {
    type: Number,
    default: 400
  },
  minHeight: {
    type: Number,
    default: 300
  },
  initialPosition: {
    type: Object,
    default: () => ({
      x: 0, // 默认左上角
      y: 0  // 默认左上角
    }),
    validator: (value) => {
      // 确保 x 和 y 都是 0-1 之间的数值
      return typeof value.x === 'number' && 
             typeof value.y === 'number' && 
             value.x >= 0 && 
             value.x <= 1 && 
             value.y >= 0 && 
             value.y <= 1
    }
  },
  initialZIndex: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['close', 'update:visible', 'activate'])

const { width: windowWidth } = useWindowSize()
const isMobile = computed(() => windowWidth.value <= 768)

const modalRef = ref(null)
const position = ref({ x: 0, y: 0 })
const size = ref({
  width: props.initialWidth,
  height: props.initialHeight
})

// 计算模态窗样式
const modalStyle = computed(() => ({
  transform: `translate(${position.value.x}px, ${position.value.y}px)`,
  width: `${size.value.width}px`,
  height: `${size.value.height}px`
}))

// 拖拽相关
let isDragging = false
let dragOffset = { x: 0, y: 0 }

const startDrag = (e) => {
  if (e.target.closest('.modal-handle')) {
    isDragging = true
    const rect = modalRef.value.getBoundingClientRect()
    dragOffset = {
      x: e.clientX - position.value.x,
      y: e.clientY - position.value.y
    }
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
  }
}

const handleDrag = (e) => {
  if (isDragging) {
    // 计算新位置
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    // 计算边界
    const maxX = window.innerWidth - 20 // 右边界留出20px边距
    const maxY = window.innerHeight - 20 // 下边界留出20px边距
    const minX = -size.value.width + 20 // 左边界至少保留20px可见
    const minY = -size.value.height + 20 // 上边界至少保留20px可见
    
    position.value = {
      x: Math.min(Math.max(minX, newX), maxX),
      y: Math.min(Math.max(minY, newY), maxY)
    }
  }
}

const stopDrag = () => {
  isDragging = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 调整大小相关
let isResizing = false

const startResize = (e) => {
  isResizing = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (e) => {
  if (isResizing) {
    const rect = modalRef.value.getBoundingClientRect()
    const newWidth = Math.max(props.minWidth, e.clientX - rect.left)
    const newHeight = Math.max(props.minHeight, e.clientY - rect.top)
    size.value = { width: newWidth, height: newHeight }
  }
}

const stopResize = () => {
  isResizing = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})

// 初始化位置
onMounted(() => {
  if (modalRef.value) {
    // 使用百分比计算实际位置
    position.value = {
      x: (window.innerWidth - size.value.width) * props.initialPosition.x,
      y: (window.innerHeight - size.value.height) * props.initialPosition.y
    }
  }
  document.addEventListener('keydown', handleKeyDown)

  // 通知父组件组件已准备就绪
  nextTick(() => {
    emit('ready', exposed)
  })
})

const currentZIndex = ref(props.initialZIndex)
const isClosing = ref(false)

// 处理鼠标按下事件
const handleMouseDown = (e) => {
  emit('activate')
  if (e.target.closest('.modal-handle')) {
    startDrag(e)
  }
}

// 关闭窗口的方法
const closeModal = () => {
  isClosing.value = true
  emit('close')
}

// 更新 z-index
const updateZIndex = (newZIndex) => {
  currentZIndex.value = newZIndex
}

// 确保在组件挂载后暴露方法
const exposed = {
  triggerClose: () => isClosing.value = true,
  updateZIndex
}

defineExpose(exposed)

// 添加键盘事件监听
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.visible) {
    closeModal()
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script> 