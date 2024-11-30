<template>
  <div class="character-list">
    <div 
      v-for="character in characters" 
      :key="character.id"
      class="character-item"
      @click="$emit('select', character)"
    >
      <img 
        :src="getStaticPath(character.path)" 
        :alt="character.name"
        class="character-avatar"
      >
      <div class="character-tooltip">
        <div class="character-label">
          {{ character.name }}
          <template v-if="character.label">
            · {{ character.label }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStaticPath } from '@/utils/assets'

defineProps<{
  characters: Array<{
    id: number
    name: string
    path: string
    label?: string
  }>
}>()

defineEmits<{
  (e: 'select', character: any): void
}>()
</script>

<style scoped>
.character-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0 1rem;
}

.character-item {
  position: relative;
  cursor: pointer;
}

.character-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-background-soft);
  transition: all 0.2s ease;
}

.character-item:hover .character-avatar {
  transform: scale(1.1);
  border-color: var(--color-background-highlight);
}

.character-tooltip {
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
  color: var(--color-text)
}

.character-item:hover .character-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.character-label {
  color: var(--color-text-light);
  font-size: 0.7rem;
}

/* 添加小箭头 */
.character-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-border);
}

.character-tooltip::before {
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