<template>
  <div class="content-area">
    <!-- 关联实体展示 -->
    <div class="related-entities" v-if="props.currentTool === 'overview'">
      <div 
        v-for="relation in relatedCharacters" 
        :key="relation.to"
        class="relation-item"
        @click="$emit('select-character', getCharacterById(relation.to))"
      >
        <img 
          :src="getCharacterById(relation.to).path" 
          :alt="getCharacterById(relation.to).name"
          class="relation-avatar"
        >
        <div class="relation-tooltip">
          <div class="relation-label">
            {{ getCharacterById(relation.to).name || getCharacterById(relation.to).title }}
            <template v-if="relation.label">
                · {{ relation.label }}
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 关联文档展示 -->
    <div class="artifacts-section" v-if="props.currentTool === 'documents' || props.currentTool === 'overview'">
      <div class="artifacts-list">
        <div 
          v-for="file in relatedDocuments" 
          :key="file.id"
          class="artifact-item"
          @click="$emit('open-file', file)"
        >
          <div class="artifact-icon">{{ getEntityIcon('document') }}</div>
          <div class="artifact-info">
            <span class="artifact-name">{{ file.title }}</span>
            <div class="artifact-tags">
              <span v-for="tag in file.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        <div v-if="!relatedDocuments.length" class="empty-state">
          暂无相关文件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { characters, documents, gallerys } from '@/constants/entities'

interface EntityReference {
  id: number | string
  type: string
  label?: string
}

interface Props {
  currentTool: string
  entityId: number
  entityType: 'character' | 'document' | 'gallery'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select-character', entity: any): void
  (e: 'open-file', file: any): void
}>()

// 获取实体图标
const getEntityIcon = (type: string) => {
  const icons = {
    character: '👤',
    document: '📄',
    gallery: '🖼️'
  }
  return icons[type] || '📎'
}

// 获取当前实体
const currentEntity = computed(() => {
  const entityMaps = {
    character: characters,
    document: documents,
    gallery: gallerys
  }
  return entityMaps[props.entityType]?.find(entity => entity.id === props.entityId)
})

// 获取关联实体
const relatedCharacters = computed(() => {
  if (!currentEntity.value?.references) return []
  
  const relations = []
  Object.entries(currentEntity.value.references).forEach(([type, refs]) => { 
    if (Array.isArray(refs) && type == 'characters') {
      refs.forEach(ref => {
        relations.push({
          to: typeof ref === 'object' ? ref.id : ref,
          type: type.slice(0, -1), // 移除复数 s
          label: typeof ref === 'object' ? ref.label : ''
        })
      })
    }
  })
  return relations
})

// 获取关联文档
const relatedDocuments = computed(() => {
  return documents.filter(doc => {
    if (!doc.references) return false
    return Object.entries(doc.references).some(([type, refs]) => {
      const entityType = props.entityType + 's' // 添加复数 s
      console.log(type,refs,entityType)
      return type === entityType && refs.includes(props.entityId)
    })
  })
})

const getCharacterById = (id: number) => {
  return characters.find(char => char.id === id)
}

// 根据ID和类型获取实体，除character、document以外的类型使用
const getEntityById = (id: number , type: string) => {
  const entityMaps = {
    character: characters,
    document: documents,
    gallery: gallerys
  }
  return entityMaps[type]?.find(entity => entity.id === id)
}
</script>

<style scoped>
.related-entities {
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
  padding: 1.5rem;
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