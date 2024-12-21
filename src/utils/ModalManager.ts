// // 打开模态窗
// ModalManager.getInstance().create('unique-id', {
//     title: '窗口标题',
//     entityId: 实体id,
//     entityType: 'character' | 'document' | 'gallery' | 'event' | 'location' | 'media' | 'note',
//     content: 组件或内容,
//     props: { /* 其他属性 */ }
// })

// // 关闭指定窗口
// ModalManager.getInstance().close('unique-id')

// // 关闭所有窗口
// ModalManager.getInstance().closeAll()

import { createApp, h } from 'vue'
import DraggableModal from '@/components/DraggableModal.vue'

export class ModalManager {
  private static instance: ModalManager
  private modals: Map<string, any> = new Map()
  private currentZIndex: number = 2000

  private constructor() {}

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager()
    }
    return ModalManager.instance
  }

  create(id: string, options: {
    title: string,
    entityId: number,
    entityType: 'character' | 'document' | 'gallery' | 'event' | 'location' | 'media' | 'note' | 'location-point',
    content: any,
    props?: Record<string, any>
  }) {
    if (this.modals.has(id)) {
      return this.modals.get(id)
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const manager = this

    const defaultProps = {
      initialPosition: { x: 0.6, y: 0.3 },
      initialWidth: 800,
      initialHeight: 600,
      initialZIndex: this.currentZIndex++
    }

    const app = createApp({
      setup() {
        return () => h(DraggableModal, {
          ...defaultProps,
          ...options.props,
          title: options.title,
          entityId: options.entityId,
          entityType: options.entityType,
          visible: true,
          onClose: () => manager.close(id),
          onActivate: (isDrag = false) => manager.activateModal(id, isDrag),
          onReady: (exposed) => {
            // 保存组件暴露的方法
            const modal = manager.modals.get(id)
            if (modal) {
              modal.exposed = exposed
            }
          }
        }, () => options.content)
      }
    })

    const instance = app.mount(container)
    this.modals.set(id, { 
      app, 
      container, 
      instance,
      exposed: null, // 初始化为 null
      zIndex: defaultProps.initialZIndex
    })
    return instance
  }

  close(id: string) {
    const modal = this.modals.get(id)
    if (modal) {
      // 先触发关闭动画
      if (modal.instance?.exposed?.triggerClose) {
        modal.instance.exposed.triggerClose()
      }
      // 等待动画完成后再清理
      setTimeout(() => {
        modal.app.unmount()
        modal.container.remove()
        this.modals.delete(id)
      }, 200)
    }
  }

  closeAll() {
    this.modals.forEach((_, id) => this.close(id))
  }

  // 激活窗口（置顶）
  activateModal(id: string, isDrag: boolean = false) {
    const modal = this.modals.get(id)
    if (modal && modal.exposed) {
      this.currentZIndex++
      const newZIndex = this.currentZIndex
      modal.zIndex = newZIndex
      modal.exposed.updateZIndex(newZIndex)
      if (!isDrag) {
        modal.exposed.expand()
      }
    }
  }
} 