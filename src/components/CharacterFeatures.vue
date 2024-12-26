<template>
  <div class="features-content">
    <div class="features-grid">
      <!-- 职业特性 -->
      <div class="class-features">
        <div v-for="(group, className) in groupedFeatures" :key="className" class="feature-category">
          <div class="category-header">
            <h3>{{ className }}</h3>
          </div>
          <div class="feature-list">
            <div 
              v-for="(features, level) in group" 
              :key="level" 
              class="feature-row"
            >
              <div class="feature-level">{{ level }}级</div>
              <div class="feature-name">{{ features }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 专长/战技 -->
      <div class="asi-features">
        <div class="feature-category">
          <div class="category-header">
            <h3>属性值提升/专长</h3>
          </div>
          <div class="feature-list">
            <div 
              v-for="{ className, level } in getASILevels()" 
              :key="`${className}-${level}`" 
              class="feature-row"
            >
              <div class="feature-level">{{ level }}级</div>
              <div class="feature-class">{{ className }}</div>
              <div class="feature-choice">-</div>
            </div>
          </div>
        </div>

        <div class="feature-category">
          <div class="category-header">
            <h3>战技/魔能祈唤/超魔法</h3>
          </div>
          <div class="feature-list">
            <div 
              v-for="{ className, level } in getSpecialAbilitiesLevels()" 
              :key="`${className}-${level}`" 
              class="feature-row"
            >
              <div class="feature-level">{{ level }}级</div>
              <div class="feature-choice">-</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { OptionalCharacter, OptionalComputedStats } from '@/types/dnd5e';

const props = defineProps<{
  character: OptionalCharacter;
  computedStats: OptionalComputedStats;
}>();

// 将特性按职业和等级分组
const groupedFeatures = computed(() => {
  const groups = {};
  console.log(props.computedStats.classFeatures)
  props.computedStats.classFeatures.forEach(({ className, level, feature }) => {
    if (feature && feature !== '属性值提升') {
      if (!groups[className]) {
        groups[className] = {};
      }
      groups[className][level] = feature;
    }
  });
  
  return groups;
});

// 获取所有属性值提升的等级
const getASILevels = () => {
  return props.computedStats.classFeatures
    .filter(({ feature }) => feature === '属性值提升')
    .map(({ className, level }) => ({ className, level }))
    .sort((a, b) => a.level - b.level);
};

const getSpecialAbilitiesLevels = () => {
  return props.computedStats.classFeatures
    .filter(({ feature }) => feature === '战技' || feature === '魔能祈唤' || feature === '超魔法')
    .map(({ className, level }) => ({ className, level }))
    .sort((a, b) => a.level - b.level);
}
</script>

<style scoped>
.features-content {
  margin-top: 1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.class-features,
.asi-features {
  min-width: 0; 
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

.feature-list .feature-row:nth-child(even) {
  background-color: rgba(144, 238, 144, 0.15);
}

.feature-row:hover {
  background-color: rgba(144, 238, 144, 0.2);
}

.feature-level {
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

.feature-name {
  color: var(--color-text);
  font-weight: 500;
}

.asi-features .column-headers,
.asi-features .feature-row {
  display: grid;
  grid-template-columns: 4rem 6rem 1fr;
  gap: 0.5rem;
  padding: 0.5rem;
  align-items: center;
}
.feature-class {
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

.feature-choice {
  color: var(--color-text);
  font-weight: 500;
}

.asi-features .feature-list .feature-row:nth-child(even) {
  background-color: rgba(144, 238, 144, 0.15);
}
</style>
