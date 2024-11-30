import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { documents, gallerys, events, locations, medias, notes } from '@/constants/entities'
import { collectFilterGroups } from '@/utils/filterUtils'
import type { StandardEntityType } from '@/types/entities'

export const useRelatedResourcesStore = defineStore('relatedResources', () => {
  // 当前工具
  const currentTool = ref('overview')
  
  // 筛选面板显示状态
  const showFilters = ref(true)
  
  // 存储当前激活的筛选条件
  const activeFilters = ref<Record<string, Record<string, any[]>>>({
    documents: {},
    gallerys: {},
    events: {},
    locations: {},
    medias: {},
    notes: {}
  })

  // 获取当前工具对应的基础实体数据
  const currentEntities = computed(() => {
    const entityMap = {
      gallerys,
      documents,
      events,
      locations,
      medias,
      notes
    }
    return entityMap[currentTool.value] || []
  })

  // 判断是否使用标准筛选逻辑
  const useStandardFilter = computed(() => {
    return currentTool.value !== 'overview'
  })

  // 获取可筛选的属性组
  const filterGroups = computed(() => {
    if (!useStandardFilter.value || !currentEntities.value?.length) {
      return {}
    }
    return collectFilterGroups(currentEntities.value)
  })

  // 获取当前工具的筛选条件
  const currentFilters = computed(() => {
    if (!activeFilters.value[currentTool.value]) {
      activeFilters.value[currentTool.value] = {}
    }
    return activeFilters.value[currentTool.value]
  })

  // 切换工具
  const switchTool = (toolId: string) => {
    currentTool.value = toolId
  }

  // 更新筛选条件
  const updateFilters = (filters: Record<string, any[]>) => {
    activeFilters.value[currentTool.value] = filters
  }

  return {
    currentTool,
    showFilters,
    currentEntities,
    useStandardFilter,
    filterGroups,
    currentFilters,
    switchTool,
    updateFilters
  }
}) 