<!-- abandoned -->
<template>
  <div class="content-area">
    <div class="related-characters" v-if="props.currentTool === 'overview'">
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
          <div class="relation-label">{{ getCharacterById(relation.to).name }} · {{ relation.label }}</div>
        </div>
      </div>
    </div>
    <div class="artifacts-section" v-if="props.currentTool === 'documents' || props.currentTool === 'overview'">
      <div class="artifacts-list">
        <div 
          v-for="file in characterFiles" 
          :key="file.id"
          class="artifact-item"
          @click="$emit('open-file', file)"
        >
          <div class="artifact-icon">📄</div>
          <div class="artifact-info">
            <span class="artifact-name">{{ file.name }}</span>
            <div class="artifact-tags">
              <span v-for="tag in file.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        <div v-if="!characterFiles.length" class="empty-state">
          暂无相关文件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { edges, characters, documents } from '@/constants/entities'

const props = defineProps<{
  currentTool: string
  characterId: number
}>()

console.log(props.currentTool)

defineEmits<{
  (e: 'select-character', character: any): void
  (e: 'open-file', file: any): void
}>()

const relatedCharacters = computed(() => {
    return characters.find(char => char.id === props.characterId).references.characters
                    .map(e=>({
                        to: e.id,
                        label: e.label
                    }));
    
})

const characterFiles = computed(() => {
  return documents
    .filter(file => file.references?.characters?.includes(props.characterId))
    .map(file => ({
      id: file.id,
      name: file.title,
      path: file.path,
      tags: file.tags
    }))
})

const getCharacterById = (id) => {
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