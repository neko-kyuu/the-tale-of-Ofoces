import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { EntityGraph } from '@/types/entities'
import { buildEntityGraph, getRelatedEntities } from '@/utils/entityRelations'

export const useEntityGraphStore = defineStore('entityGraph', () => {
  const graph = ref<EntityGraph>({})

  // 初始化关系图
  const initGraph = () => {
    graph.value = buildEntityGraph()
    console.log(graph.value)
  }

  // 获取相关实体
  const getRelated = (entityType: string, entityId: number) => {
    return getRelatedEntities(graph.value, entityType, entityId)
  }

  return {
    graph,
    initGraph,
    getRelated
  }
}) 