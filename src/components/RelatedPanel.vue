<template>
  <div class="related-panel" :class="{ 'expanded': isExpanded }">
    <!-- 触发按钮 -->
    <button 
      class="panel-trigger"
      @mouseenter="isExpanded = true"
      title="相关内容"
    >
      <i class="fi fi-rr-link"></i>
    </button>
    
    <!-- 内容面板 -->
    <div 
      class="panel-content"
      @mouseleave="isExpanded = false"
    >
      <RelatedResources
        :entity-id="entityId"
        :entity-type="entityType"
        :current-tool="'overview'"
        :filtered-entities="relatedEntities"
        @select-character="$emit('select-character', $event)"
        @open-file="$emit('open-file', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import RelatedResources from './RelatedResources.vue'
import { useEntityGraphStore } from '@/stores/entityGraph'

const props = defineProps<{
  entityId: number
  entityType: string
}>()

const emit = defineEmits<{
  (e: 'select-character', character: any): void
  (e: 'open-file', file: any): void
}>()

const isExpanded = ref(false)
const entityGraphStore = useEntityGraphStore()

// 获取关联实体
const relatedEntities = computed(() => {
  return entityGraphStore.getRelated(props.entityType, props.entityId)
})
</script>

<style scoped>
.related-panel {
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
}

.panel-trigger {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--color-background);
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.panel-trigger:hover {
  background: var(--color-background-soft);
  color: var(--color-text);
  transform: scale(1.05);
}

.panel-content {
  position: absolute;
  right: 3rem;
  background: var(--color-background);
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateX(1rem);
  pointer-events: none;
  transition: all 0.3s ease;
  min-width: 300px;
  max-height: 80vh;
  overflow-y: auto;
}

.related-panel.expanded .panel-content {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: var(--color-background-soft);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: var(--color-background-mute);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-light);
}
</style> 