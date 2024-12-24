<template>
  <div class="features-content">
    <div v-for="(group, className) in groupedFeatures" :key="className" class="feature-category">
      <div class="category-header">
        <h3>{{ className }}</h3>
      </div>
      <div class="feature-list">
        <div 
          v-for="(features, level) in group" 
          :key="level" 
          class="feature-row"
          :class="{ 'striped': Number(level) % 2 === 0 }"
        >
          <div class="feature-level">{{ level }}级</div>
          <div class="feature-name">{{ features || '-' }}</div>
        </div>
      </div>
    </div>

    <!-- 属性值提升/专长 -->
    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Character } from '@/types/dnd5e';

const props = defineProps<{
  character: Character;
  computedStats: Character;
}>();

// 将特性按职业和等级分组
const groupedFeatures = computed(() => {
  const groups = {};
  
  props.computedStats.classFeatures.forEach(({ className, level, feature }) => {
    if (!groups[className]) {
      groups[className] = {};
    }
    groups[className][level] = feature;
  });
  
  return groups;
});
</script>

<style scoped>
.features-content {
  margin-top: 1rem;
}

.feature-category {
  margin-bottom: 1rem;
}

.category-header {
  background-color: rgba(200, 200, 200, 0.1);
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.category-header h3 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-soft);
}

.feature-list {
  padding: 0;
}

.feature-row {
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.9rem;
  align-items: center;
  background-color: rgba(144, 238, 144, 0.1);
  border-bottom: 1px solid var(--color-border);
}

.feature-row:hover {
  background-color: rgba(144, 238, 144, 0.2);
}

.feature-row.striped {
  background-color: rgba(144, 238, 144, 0.15);
}

.feature-level {
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

.feature-name {
  color: var(--color-text);
  font-weight: 500;
}
</style>
