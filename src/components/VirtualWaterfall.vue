<template>
    <div 
      ref="container"
      class="virtual-waterfall"
      @scroll="handleScroll"
    >
      <div 
        class="waterfall-content"
        :style="{ 
          columnCount: columnCount,
          columnGap: `${gap}px`
        }"
      >
        <div 
          class="waterfall-item"
          v-for="item in visibleItems"
          :key="item.id"
          :style="{ marginBottom: `${gap}px` }"
        >
          <div class="gallery-item-wrapper">
            <slot name="item" :item="item" />
            <div class="item-overlay">
              <div class="overlay-content">
                <RelatedResources
                  current-tool="overview"
                  :entity-id="item.id"
                  entity-type="gallery"
                  @select-character="handleSelectEntity"
                  @open-file="handleOpenFile"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useElementSize } from '@vueuse/core'
  import RelatedResources from '@/components/RelatedResources.vue'
  
  interface GalleryItem {
    id: number
    path: string
    tags: string[]
    finishedDate: string
    version: number
    references: {
      characters?:number[],
      documents?:number[]
    }
    
  }

    const props = defineProps<{
    items: GalleryItem[]
    columnWidth: number
    gap: number
    minColumnCount: number
    }>()
  
  const container = ref<HTMLElement>()
  const { width } = useElementSize(container)
  
  // 计算列数
  const columnCount = computed(() => {
    if (!width.value) return props.minColumnCount
    return Math.max(
      Math.floor(width.value / (props.columnWidth + props.gap)),
      props.minColumnCount
    )
  })
  
  // 估算每个项目的平均高度（实际应用中可能需要更复杂的计算）
  const ESTIMATED_ITEM_HEIGHT = 300
  
  // 计算总高度
  const totalHeight = computed(() => {
    const itemsPerColumn = Math.ceil(props.items.length / columnCount.value)
    return itemsPerColumn * (ESTIMATED_ITEM_HEIGHT + props.gap)
  })
  
  // 可见区域的项目
  const visibleItems = computed(() => {
    // 这里简单返回所有项目，实际应用中需要根据滚动位置计算可见项目
    return props.items
  })
  
  // 处理滚动
  const handleScroll = () => {
    // 实际应用中在这里更新可见项目
  }
  
  // 监听窗口大小变化
  onMounted(() => {
    window.addEventListener('resize', handleScroll)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleScroll)
  })
  
  // 监听数据变化
  watch(() => props.items, handleScroll, { deep: true })
  
  const emit = defineEmits<{
    (e: 'select-character', entity: any): void
    (e: 'open-file', file: any): void
  }>()
  
  // 处理实体选择
  const handleSelectEntity = (char: any) => {
    emit('select-character', char)
  }
  
  // 处理文件打开
  const handleOpenFile = (file: any) => {
    emit('open-file', file)
  }
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN')
  }
  </script>
  
  <style scoped>
  .virtual-waterfall {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .waterfall-content {
    position: relative;
    margin: 0 auto;
    /* column-fill: auto; */
  }
  
  .waterfall-item {
    break-inside: avoid;
  }
  
  .gallery-item-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .item-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    color: white;
    border-radius: 8px;
  }
  
  .gallery-item-wrapper:hover .item-overlay {
    opacity: 1;
  }
  
  .overlay-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
  }
  
  /* 自定义滚动条样式 */
  .overlay-content::-webkit-scrollbar {
    width: 4px;
  }
  
  .overlay-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .overlay-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
  </style>