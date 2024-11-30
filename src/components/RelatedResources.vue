<template>
  <div class="content-area">
    <!-- 关联角色展示 -->
    <CharacterAvatarList
      class="slide-detail-avatar"
      v-if="showCharacterList"
      :characters="characterList"
      @select="handleCharacterSelect"
    />

    <!-- 关联实体展示 -->
    <div class="artifacts-section">
      <div class="artifacts-list">
        <!-- 角色类型实体 -->
        <div v-if="characterEntities.length" class="character-entities">
          <CharacterAvatarList
            :characters="characterEntities"
            @select="handleCharacterSelect"
          />
        </div>

        <!-- 图片类型实体 -->
        <div v-if="galleryEntities.length" class="gallery-grid">
          <div 
            v-for="entity in galleryEntities" 
            :key="`${props.currentTool}_${entity.type}_${entity.id}`"
            class="gallery-item"
          >
            <img 
              :src="getStaticPath(entity.path)" 
              :alt="entity.title || entity.name"
              class="gallery-image"
            >
          </div>
        </div>

        <!-- 文档类型实体 -->
        <div 
          v-for="entity in documentEntities" 
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

        <!-- 事件类型实体 -->
        <div 
          v-for="entity in eventEntities" 
          :key="`${props.currentTool}_${entity.type}_${entity.id}`"
          class="event-item"
        >
          <!-- 事件展示todo -->
          <div class="event-placeholder"></div>
        </div>

        <!-- 地图类型实体 -->
        <div 
          v-for="entity in locationEntities" 
          :key="`${props.currentTool}_${entity.type}_${entity.id}`"
          class="event-item"
        >
          <!-- 展示todo -->
          <div class="event-placeholder"></div>
        </div>

        <!-- 媒体类型实体 -->
        <div 
          v-for="entity in mediaEntities" 
          :key="`${props.currentTool}_${entity.type}_${entity.id}`"
          class="event-item"
        >
          <!-- 展示todo -->
          <div class="event-placeholder"></div>
        </div>

        <!-- 备忘录类型实体 -->
        <div 
          v-for="entity in noteEntities" 
          :key="`${props.currentTool}_${entity.type}_${entity.id}`"
          
        >
          <!-- 文档类型note -->
          <template v-if="entity.noteType === 'document'">
            <div 
              class="artifact-item"
              @click="handleEntityClick(entity)"
            >
              <div class="artifact-icon">{{ getEntityIcon(entity.noteType) }}</div>
              <div class="artifact-info">
                <span class="artifact-name">{{ entity.title || entity.name }}</span>
                <div class="artifact-tags" v-if="entity.tags">
                  <span v-for="tag in entity.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
            <!-- {{ entity.noteType }} -->
          </template>
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
import { useEntityGraphStore } from '@/stores/entityGraph'
import { CONTENT_TYPES } from '@/constants/types'
import CharacterAvatarList from './CharacterAvatarList.vue'
import { getStaticPath } from '@/utils/assets'

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
    document: '📄',
    ebook: '📚'
  }
  return icons[type] || '📎'
}

// 处理实体点击
const handleEntityClick = (entity: any) => {
  if (entity.type === CONTENT_TYPES.CHARACTER) {
    emit('select-character', entity)
  } else if ( entity.type === CONTENT_TYPES.NOTE || entity.type === CONTENT_TYPES.DOCUMENT ) {
    emit('open-file', entity)
  }
}

// 判断是否显示角色列表
const showCharacterList = computed(() => {
  return props.entityType === 'character' && props.currentTool === 'overview'
})

// 获取要显示的角色列表
const characterList = computed(() => {
  if (!showCharacterList.value) return []
  
  const currentEntity = characters.find(char => char.id === props.entityId)
  if (!currentEntity?.references?.characters) return []
  
  return currentEntity.references.characters.map(ref => {
    const character = getCharacterById(typeof ref === 'object' ? ref.id : ref)
    return {
      ...character,
      label: typeof ref === 'object' ? ref.label : ''
    }
  })
})

// 处理角色选择
const handleCharacterSelect = (character: any) => {
  emit('select-character', character)
}

// 获取要显示的实体
const displayedEntities = computed(() => {
  // 如果不是 overview 模式且有筛选结果
  if (props.currentTool !== 'overview' && props.filteredEntities) {
    // 确保只显示当前工具类型的实体
    const toolTypeMap = {
      'documents': CONTENT_TYPES.DOCUMENT,
      'gallerys': CONTENT_TYPES.GALLERY,
      'ebooks': CONTENT_TYPES.EBOOK,
      'events': CONTENT_TYPES.EVENT,
      'locations': CONTENT_TYPES.LOCATION,
      'medias': CONTENT_TYPES.MEDIA,
      'notes': CONTENT_TYPES.NOTE
    }
    const currentToolType = toolTypeMap[props.currentTool]

    const filtered = props.filteredEntities.filter(entity => {
      return entity.type === currentToolType
    })
    
    return filtered
  }

  // overview 模式：使用关系图中的所有相关实体
  const relatedEntities = entityGraphStore.getRelated(props.entityType, props.entityId)
  return relatedEntities
})

// 用于角色头像显示
const getCharacterById = (id: number) => {
  return characters.find(char => char.id === id)
}

// 将显示实体分为角色和标准实体两类
const characterEntities = computed(() => {
  return displayedEntities.value.filter(entity => entity.type === CONTENT_TYPES.CHARACTER)
})

const standardEntities = computed(() => {
  return displayedEntities.value.filter(entity => entity.type !== CONTENT_TYPES.CHARACTER)
})

// 按类型分类实体
const galleryEntities = computed(() => {
  return displayedEntities.value.filter(entity => entity.type === CONTENT_TYPES.GALLERY)
})

const documentEntities = computed(() => {
  return displayedEntities.value.filter(entity => entity.type === CONTENT_TYPES.DOCUMENT)
})

const eventEntities = computed(() => {
  return displayedEntities.value.filter(entity => entity.type === CONTENT_TYPES.EVENT)
})

const locationEntities = computed(() => {
  return displayedEntities.value.filter(entity => entity.type === CONTENT_TYPES.LOCATION)
})

const mediaEntities = computed(() => {
  return displayedEntities.value.filter(entity => entity.type === CONTENT_TYPES.MEDIA)
})

const noteEntities = computed(() => {
  return displayedEntities.value.filter(entity => entity.type === CONTENT_TYPES.NOTE)
})
</script>

<style scoped>
.slide-detail-avatar{
  padding-top: 0.5rem;
  background: var(--color-background);
  
  box-shadow: 0 -2px rgba(var(--color-background-highlight-rgb), 0.8), /*上阴影*/
              0 2px rgba(var(--color-background-highlight-rgb), 0.8); /*下阴影*/

}

.artifacts-section {
  padding: 0.5rem;
}

/* 角色实体容器样式 */
.character-entities {
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.artifacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 标准实体项样式 */
.artifact-item {
  display: flex;
  align-items: center;
  border-radius: 6px;
  background: var(--color-background-light);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--color-background-mute);
  padding: 0.3rem 0.6rem;
  margin: 0 0.6rem;
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
  border-radius: 4px;
}

.artifact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 1rem;
  border-left: 1px solid var(--color-background-mute);
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
  background: var(--color-background-mute);
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
<style scoped>
/* 图片网格布局 */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 0.5rem;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-background-soft);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

/* 事件展示样式 */
.event-item {
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.event-placeholder {
  text-align: center;
  color: var(--color-text-light);
  font-style: italic;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 