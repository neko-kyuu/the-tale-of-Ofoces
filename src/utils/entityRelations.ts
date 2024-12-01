import { CONTENT_TYPES } from '@/constants/types'
import type { StandardEntityType, EntityGraph, Character } from '@/types/entities'
import { documents, gallerys, ebooks, characters, events, locations, medias, notes, locationPoints } from '@/constants/entities'

// 获取实体的类型标识符
const getEntityTypeKey = (type: CONTENT_TYPES): string => {
  switch (type) {
    case CONTENT_TYPES.CHARACTER:
      return 'characters'
    case CONTENT_TYPES.DOCUMENT:
      return 'documents'
    case CONTENT_TYPES.GALLERY:
      return 'gallerys'
    case CONTENT_TYPES.EBOOK:
      return 'ebooks'
    case CONTENT_TYPES.EVENT:
      return 'events'
    case CONTENT_TYPES.LOCATION:
      return 'locations'
    case CONTENT_TYPES.MEDIA:
      return 'medias'
    case CONTENT_TYPES.NOTE:
      return 'notes'
    case CONTENT_TYPES.LOCATION_POINT:
      return 'location-points'
    default:
      return ''
  }
}

// 构建实体关系图
export const buildEntityGraph = (): EntityGraph => {
  const graph: EntityGraph = {}
  
  // 收集所有标准实体
  const allStandardEntities: StandardEntityType[] = [
    ...documents,
    ...gallerys,
    ...ebooks,
    ...events,
    ...locations,
    ...medias,
    ...notes,
    ...locationPoints
  ]

  // 第一遍遍历：创建图节点（包括角色和标准实体）
  // 添加标准实体节点
  allStandardEntities.forEach(entity => {
    const entityKey = `${getEntityTypeKey(entity.type)}_${entity.id}`
    graph[entityKey] = {
      entity,
      references: {}
    }
  })

  // 添加角色节点
  characters.forEach(character => {
    const entityKey = `characters_${character.id}`
    graph[entityKey] = {
      entity: character,
      references: {}
    }
  })

  // 第二遍遍历：建立关系
  // 处理标准实体之间的关系和标准实体对角色的引用
  allStandardEntities.forEach(entity => {
    const entityKey = `${getEntityTypeKey(entity.type)}_${entity.id}`
    
    if (entity.references) {
      Object.entries(entity.references).forEach(([refType, refIds]) => {
        // 添加引用关系
        graph[entityKey].references[refType] = refIds
        
        // 为被引用的实体添加反向引用
        refIds.forEach(refId => {
          const refKey = `${refType}_${refId}`
          if (graph[refKey]) {
            const sourceType = getEntityTypeKey(entity.type)
            if (!graph[refKey].references[sourceType]) {
              graph[refKey].references[sourceType] = []
            }
            if (!graph[refKey].references[sourceType].includes(entity.id)) {
              graph[refKey].references[sourceType].push(entity.id)
            }
          }
        })
      })
    }
  })

  // 处理角色对标准实体的引用
//   characters.forEach(character => {
//     const characterKey = `characters_${character.id}`
    
//     if (character.references) {
//       Object.entries(character.references).forEach(([refType, refIds]) => {
//         // 跳过对其他角色的引用
//         if (refType === 'characters') return

//         // 添加对标准实体的引用
//         graph[characterKey].references[refType] = refIds
        
//         // 为被引用的标准实体添加反向引用
//         refIds.forEach(refId => {
//           const refKey = `${refType}_${refId}`
//           if (graph[refKey]) {
//             if (!graph[refKey].references.characters) {
//               graph[refKey].references.characters = []
//             }
//             if (!graph[refKey].references.characters.includes(character.id)) {
//               graph[refKey].references.characters.push(character.id)
//             }
//           }
//         })
//       })
//     }
//   })

  return graph
}

// 获取相关实体
export const getRelatedEntities = (
  graph: EntityGraph,
  entityType: CONTENT_TYPES,
  entityId: number
): (StandardEntityType | Character)[] => {
  const entityKey = `${getEntityTypeKey(entityType)}_${entityId}`
  const node = graph[entityKey]
  
  if (!node) return []

  // 收集所有相关实体
  const relatedEntities: (StandardEntityType | Character)[] = []
  Object.entries(node.references).forEach(([refType, refIds]) => {
    // 跳过角色之间的关联
    if (entityType === CONTENT_TYPES.CHARACTER && refType === 'characters') {
      return
    }

    refIds.forEach(refId => {
      const refKey = `${refType}_${refId}`
      const refNode = graph[refKey]
      if (refNode) {
        relatedEntities.push(refNode.entity)
      }
    })
  })

  return relatedEntities
} 