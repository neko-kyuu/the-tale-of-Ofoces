<template>
  <div class="content-area">
    <!-- 关联角色展示（仅当当前实体是角色时显示） -->
    <div 
      class="related-characters" 
      v-if="props.entityType === 'character' && props.currentTool === 'overview'"
    >
      <div 
        v-for="relation in relatedCharacters" 
        :key="relation.to"
        class="relation-item"
        @click="$emit('select-character', getCharacterById(relation.to))"
      >
        <img 
          :src="getStaticPath(getCharacterById(relation.to).path)" 
          :alt="getCharacterById(relation.to).name"
          class="relation-avatar"
        >
        <div class="relation-tooltip">
          <div class="relation-label">
            {{ getCharacterById(relation.to).name }}
            <template v-if="relation.label">
              · {{ relation.label }}
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 关联实体展示 -->
    <div class="artifacts-section">
      <div class="artifacts-list">
        <div 
          v-for="entity in displayedEntities" 
          :key="`${props.currentTool}_${entity.type}_${entity.id}`"
          class="artifact-item"
          @click="handleEntityClick(entity)"
        >
          <div class="artifact-icon">{{ getEntityIcon(entity.type) }}</div>
          <div class="artifact-info">
            <span class="artifact-name">{{ entity.title || entity.name }}</span>
            <div class="artifact-tags" v-if="entity.tags">
              <span v-for="tag in entity.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        <div v-if="!displayedEntities.length" class="empty-state">
          暂无相关内容
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { characters } from '@/constants/entities'
import { getStaticPath } from '@/utils/assets'
import { useEntityGraphStore } from '@/stores/entityGraph'
import { CONTENT_TYPES } from '@/constants/types'

const props = defineProps<{
  currentTool: string
  entityId: number
  entityType: string
  filteredEntities?: any[]
}>()

const emit = defineEmits<{
  (e: 'select-character', entity: any): void
  (e: 'open-file', file: any): void
}>()

const entityGraphStore = useEntityGraphStore()

// 获取实体图标
const getEntityIcon = (type: string) => {
  const icons = {
    character: '👤',
    document: '📄',
    gallery: '🖼️',
    ebook: '📚'
  }
  return icons[type] || '📎'
}

// 处理实体点击
const handleEntityClick = (entity: any) => {
  if (entity.type === CONTENT_TYPES.CHARACTER) {
    emit('select-character', entity)
  } else {
    emit('open-file', entity)
  }
}

// 获取角色关系（仅用于角色实体）
const relatedCharacters = computed(() => {
  if (props.entityType !== 'character') return []
  
  const currentEntity = characters.find(char => char.id === props.entityId)
  if (!currentEntity?.references?.characters) return []
  
  return currentEntity.references.characters.map(ref => ({
    to: typeof ref === 'object' ? ref.id : ref,
    type: 'character',
    label: typeof ref === 'object' ? ref.label : ''
  }))
})

// 获取要显示的实体
const displayedEntities = computed(() => {
  console.log('currentTool:', props.currentTool)
  console.log('filteredEntities:', props.filteredEntities)
  
  // 如果不是 overview 模式且有筛选结果
  if (props.currentTool !== 'overview' && props.filteredEntities) {
    // 确保只显示当前工具类型的实体
    const toolTypeMap = {
      'documents': CONTENT_TYPES.DOCUMENT,
      'gallerys': CONTENT_TYPES.GALLERY,
      'ebooks': CONTENT_TYPES.EBOOK,
      "events": CONTENT_TYPES.EVENT
    }
    const currentToolType = toolTypeMap[props.currentTool]
    console.log('currentToolType:', currentToolType)

    const filtered = props.filteredEntities.filter(entity => {
      console.log('checking entity:', entity.type, '===', currentToolType, entity.type === currentToolType)
      return entity.type === currentToolType
    })
    
    console.log('filtered result:', filtered)
    return filtered
  }

  // overview 模式：使用关系图中的所有相关实体
  const relatedEntities = entityGraphStore.getRelated(props.entityType, props.entityId)
  console.log('related entities from graph:', relatedEntities)
  return relatedEntities
})

// 用于角色头像显示
const getCharacterById = (id: number) => {
  return characters.find(char => char.id === id)
}
</script>

<style scoped>
.related-characters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0 1rem;
}

.relation-item {
  position: relative;
  cursor: pointer;
}

.relation-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-background-soft);
  transition: all 0.2s ease;
}

.relation-item:hover .relation-avatar {
  transform: scale(1.1);
  border-color: var(--color-background-highlight);
}

.relation-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.relation-item:hover .relation-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.relation-label {
  color: var(--color-text-light);
  font-size: 0.7rem;
}

/* 添加小箭头 */
.relation-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-border);
}

.relation-tooltip::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-background);
  z-index: 1;
}
</style>
<style scoped>
.artifacts-section {
  padding: 0.5rem;
}

.artifacts-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.artifacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.artifact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: var(--color-background-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}

.artifact-item:hover {
  background: var(--color-background-mute);
}

.artifact-icon {
  font-size: 1.25rem;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  background: var(--color-background);
}

.artifact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.artifact-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.artifact-meta {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.artifact-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--color-background);
  color: var(--color-text-light);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
  font-size: 0.875rem;
  font-style: italic;
}
</style> 