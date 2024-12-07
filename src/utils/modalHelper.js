// openEntityPreviewModal(entity, {
//   props: {
//     initialWidth: 1000,
//     initialPosition: { x: 0.5, y: 0.5 }
//   }
// })

import { h, computed } from 'vue'
import { useCharacterDetailStore } from '@/stores/characterDetail'
import { ModalManager } from '@/utils/ModalManager'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import EmptyPreview from '@/components/EmptyPreview.vue'
import { getStaticPath } from '@/utils/assets'
import DialogPreview from '@/components/DialogPreview.vue'

const isMobile = computed(() => window.innerWidth <= 768)

/**
 * 获取预览组件
 * @param {Object} entity - 实体对象
 * @returns {VNode} Vue 组件虚拟节点
 */
const getPreviewComponent = (entity) => {
  const type = entity.displayType ?? entity.type
  switch (type) {
    case 'document':
      return h(MarkdownPreview, { filePath: getStaticPath(entity.path) })
    case 'chat':
      return h(DialogPreview, { filePath: getStaticPath(entity.path) })
    // 可以在这里添加更多类型的处理
    default:
      return h(EmptyPreview)
  }
}

/**
 * 打开文件预览模态框的通用方法
 * @param {Object} entity - 文件对象，需包含 id、type、title、path? 属性
 * @param {Object} options - 可选的模态框配置项
 */
export const openEntityPreviewModal = (entity, options = {}) => {
  const store = useCharacterDetailStore()
  
  if (isMobile.value) {
    store.showFile(entity)
    return
  }

  const modalId = `${entity.type}-${entity.id}`
  const defaultOptions = {
    title: entity.title,
    entityId: entity.id,
    entityType: entity.type,
    content: getPreviewComponent(entity),
    props: {
      minWidth: 200,
      initialWidth: 800,
      initialHeight: 600,
      initialPosition: {
        x: 0.6,
        y: 0.3
      }
    }
  }

  const mergedOptions = { ...defaultOptions, ...options }
  
  ModalManager.getInstance().create(modalId, mergedOptions)
  ModalManager.getInstance().activateModal(modalId)
} 