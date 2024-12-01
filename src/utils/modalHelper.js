// openFilePreviewModal(file, {
//   props: {
//     initialWidth: 1000,
//     initialPosition: { x: 0.5, y: 0.5 }
//   }
// })

import { h, computed } from 'vue'
import { useCharacterDetailStore } from '@/stores/characterDetail'
import { ModalManager } from '@/utils/ModalManager'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { getStaticPath } from '@/utils/assets'

const isMobile = computed(() => window.innerWidth <= 768)

/**
 * 打开文件预览模态框的通用方法
 * @param {Object} file - 文件对象，需包含 id、type、title、path 属性
 * @param {Object} options - 可选的模态框配置项
 */
export const openFilePreviewModal = (file, options = {}) => {
  const store = useCharacterDetailStore()
  
  if (isMobile.value) {
    store.showFile(file)
    return
  }

  const modalId = `${file.type}-${file.id}`
  const defaultOptions = {
    title: file.title,
    entityId: file.id,
    entityType: file.type,
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
  }

  const mergedOptions = { ...defaultOptions, ...options }
  
  ModalManager.getInstance().create(modalId, mergedOptions)
  ModalManager.getInstance().activateModal(modalId)
} 