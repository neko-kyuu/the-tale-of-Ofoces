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
              <div class="feature-name">
                <span 
                  v-for="(feature, index) in features.split(',')" 
                  :key="index" 
                  :class="['feature-tag', getFeatureClass(feature.trim())]"
                  v-bind="getTooltipContent(feature.trim()) ? 
                    { 'data-tooltip': getTooltipContent(feature.trim()) } 
                    : {}"
                >
                  {{ feature.trim() }}
                </span>
              </div>
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

        <div class="feature-category" v-if="getSpecialAbilitiesLevels().length > 0">
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
    if (feature) {
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

const getFeatureClass = (featureName: string): string => {
  switch (featureName) {
    case '属性值提升':
      return 'feature-asi';
    case '战技':
    case '魔能祈唤':
    case '超魔法':
      return 'feature-maneuver';
    case '专精':
      return 'feature-psionic';
    default:
      if (featureName.endsWith('特性')) {
        return 'feature-ability';
      } else if (featureName.endsWith('范型')) {
        return 'feature-archetype';
      }
      return '';
  }
};

const getTooltipContent = (featureName: string): string => {
  switch (featureName) {
    case '属性值提升':
      return `增加一项属性值2点，或者增加两项属性值各1点。\n或者选择一个专长。`;
    case '战技':
      return ``;
    case '魔能祈唤':
      return `你在神秘学识的研习过程中发掘出魔能祈唤的方式，这些禁忌的知识残章让你获得了持久的魔法能力。
    第2级时，你获得两种自选的魔能祈唤（祈唤的具体内容见后文）。在获得更高的邪术师等级后你还可以习得其它的魔能祈唤，具体数据见“邪术师职业表”中“已知祈唤”一栏。
    另外，你提升本职的等级时，可以用新的祈唤替换一个已学会的祈唤，但你的角色必须满足学习新祈唤的先决条件。`;
    case '超魔法':
      return `第3级起，你可以扭曲所施展的法术使其符合你的需求。从超魔法选项中选择其二。随后你将在第10 和第17级分别再获得其一。`;
    default:
      if (featureName.endsWith('特性')) {
        return `你获得所选范型的相应特性。`;
      } else if (featureName.endsWith('范型')) {
        return `你选择一种范型以体现你的战斗风格和技巧。`;
      }
      return '';
  }
};
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: background-color 0.2s;
  background-color: var(--color-background-soft);
}

.feature-tag.feature-asi {
  background-color: rgba(144, 176, 236, 0.15);
}

.feature-tag.feature-maneuver {
  background-color: rgba(229, 152, 155, 0.15);
}

.feature-tag.feature-psionic {
  background-color: rgba(183, 147, 235, 0.15);
}

.feature-tag.feature-metamagic {
  background-color: rgba(152, 229, 193, 0.15);
}

.feature-tag.feature-ability {
  background-color: rgba(255, 193, 7, 0.15);
}

.feature-tag:hover {
  filter: brightness(1.1);
}

.fi {
  font-size: 0.9em;
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

.feature-tag.feature-archetype {
  background-color: rgba(156, 39, 176, 0.15);
}
/* 添加通用的 tooltip 样式 */
[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  padding: 4px 8px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.4;
  white-space: pre-line;
  width: max-content;
  max-width: 300px;
  text-align: left;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  text-shadow: 
    -1px -1px 0 var(--color-background-soft),
    1px -1px 0 var(--color-background-soft),
    -1px 1px 0 var(--color-background-soft),
    1px 1px 0 var(--color-background-soft);
}

[data-tooltip] {
  position: relative;
  cursor: help;
}

[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
}
</style>
