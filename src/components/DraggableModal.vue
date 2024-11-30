<template>
  <Teleport to="body">
    <div 
      v-if="visible"
      ref="modalRef"
      class="modal-window"
      :class="{ 
        'mobile': isMobile, 
        'modal-closing': isClosing,
        'modal-collapsed': isCollapsed 
      }"
      :style="{
        ...modalStyle,
        zIndex: currentZIndex
      }"
      @mousedown="handleMouseDown"
    >
      <!-- 拖拽手柄 -->
      <div 
        class="modal-handle"
        @dblclick="toggleCollapse"
      >
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
      <div 
        class="modal-content"
        :style="{ display: isCollapsed ? 'none' : '' }"
      >
        <slot></slot>
      </div>

      <!-- 关联实体滑窗 -->
      <RelatedPanel
        :entity-id="entityId"
        :entity-type="entityType"
        @select-character="handleCharacterSelect"
        @open-file="handleFileOpen"
      />

      <!-- 调整大小的手柄 -->
      <div 
        v-if="!isMobile && !isCollapsed"
        class="resize-handle"
        @mousedown.stop="startResize"
      ></div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-window {
  position: fixed;
  background: rgba(var(--color-background-soft-rgb), 0.7);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(var(--color-background-highlight-rgb), 0.2);
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  z-index: 2000;
  transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.3s ease;
  transform-origin: center center;
}

.modal-handle {
  padding: 0.5rem;
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
  width: 20px;
  height: 20px;
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
  font-size: 0.6rem;
}

.modal-content {
  flex: 1;
  overflow: auto;
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
  border-right: 2px solid var(--color-text);
  border-bottom: 2px solid var(--color-text);
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

.modal-collapsed {
  min-height: 44px !important;
  resize: none !important;
}

.modal-collapsed .modal-handle {
  border-bottom: none;
}

/* 添加过渡动画 */
.modal-window {
  transition: height 0.3s ease;
}

.related-panel{
  right: -1rem;
  visibility: visible;
}
.modal-collapsed .related-panel{
  visibility: hidden;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, h } from 'vue'
import { useWindowSize } from '@vueuse/core'
import RelatedPanel from '@/components/RelatedPanel.vue';
import { useCharacterDetailStore } from '@/stores/characterDetail'
import { ModalManager } from '@/utils/ModalManager'
import MarkdownPreview from '@/components/MarkdownPreview.vue'

const store = useCharacterDetailStore()

const props = defineProps({
  title: String,
  entityId: Number,
  entityType: String,
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

const handleCharacterSelect = (char) => {
  store.showCharacter(char)
}

const handleFileOpen = (file) => {
  if (isMobile.value) {
    store.showFile(file)
  } else {
    ModalManager.getInstance().create(`file-${file.id}`, {
      title: file.title,
      entityId: file.id,
      entityType: 'document',
      content: h(MarkdownPreview, { filePath: getStaticPath(file.path) }),
      props: {
        minWidth: 200,
        initialWidth: 800,
        initialHeight: 600,
        initialPosition: { 
          x: 0.6, 
          y: 0.3
        }
      }
    })
  }
}

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

// 添加收起/展开状态
const isCollapsed = ref(false)
const originalHeight = ref(null)

// 切换收起/展开状态
const toggleCollapse = () => {
  if (!isCollapsed.value) {
    // 收起前保存原始高度
    originalHeight.value = size.value.height
    size.value.height = 44 // 只保留标题栏高度
  } else {
    // 恢复原始高度
    size.value.height = originalHeight.value
  }
  isCollapsed.value = !isCollapsed.value
}
</script> 