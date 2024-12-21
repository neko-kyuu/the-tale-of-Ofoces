// 定义日期类型的属性
export const DATE_TYPE_KEYS = ['finishedDate', 'createdAt', 'updatedAt']

// 定义需要排除的属性
export const EXCLUDE_KEYS = ['id', 'path', 'references', 'version', 'type', 'title', 'displayType', 'noteCategory']

/**
 * 从实体集合中收集可筛选的属性组
 * @param entities 实体集合
 * @param options 可选配置项
 * @returns 筛选属性组
 */
export function collectFilterGroups(
  entities: any[],
  options: {
    excludeKeys?: string[],
    dateKeys?: string[],
    customLabels?: Record<string, string> // 自定义标签映射
  } = {}
) {
  if (!entities?.length) return {}

  const groups: Record<string, any> = {}
  const sampleEntity = entities[0]
  
  const excludeKeys = options.excludeKeys || EXCLUDE_KEYS
  const dateKeys = options.dateKeys || DATE_TYPE_KEYS
  const customLabels = options.customLabels || {
    tags: '标签',
    finishedDate: '完成日期',
    createdAt: '创建时间',
    updatedAt: '更新时间'
  }

  Object.keys(sampleEntity).forEach(key => {
    if (!excludeKeys.includes(key)) {
      // 处理日期类型
      if (dateKeys.includes(key)) {
        groups[key] = {
          label: customLabels[key] || key,
          type: 'date'
        }
      } else {
        // 处理其他类型
        const uniqueValues = [...new Set(entities.flatMap(entity => {
          const value = entity[key]
          return Array.isArray(value) ? value : [value]
        }))].filter(value => value !== undefined && value !== null)
        
        if (uniqueValues.length > 0) {
          groups[key] = {
            label: customLabels[key] || key,
            type: 'select',
            options: uniqueValues
          }
        }
      }
    }
  })

  return groups
} 