<template>
    <div 
      ref="container"
      class="virtual-waterfall"
      @scroll="handleScroll"
    >
      <div 
        class="waterfall-content"
        :style="{ 
          height: `${totalHeight}px`,
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
          <slot name="item" :item="item" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useElementSize } from '@vueuse/core'
  
  interface GalleryItem {
    id: number
    path: string
    tags: string[]
    finishedDate: Date
    version: string
    references: Array<{
        id: string
        type: string
    }>
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
    column-fill: auto;
  }
  
  .waterfall-item {
    break-inside: avoid;
  }
  </style>