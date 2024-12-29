<template>
  <div class="inventory-content">
    <div class="inventory-section">
      <div 
        v-for="category in inventoryCategories" 
        :key="category.id" 
        class="inventory-category"
      >
        <div class="column-headers">
          <div class="header-name">
            {{ category.name }} ({{ getItemCount(category.id) }})
          </div>
          <div class="header-weight">重量</div>
          <div class="header-usage">用法</div>
          <div class="header-quantity">数量</div>
        </div>
        <div class="item-list">
          <div 
            v-for="item in getItemsByCategory(category.id)" 
            :key="item.id" 
            class="item-row"
            :class="{ 'striped': item.id % 2 === 0 }"
          >
            <div class="item-name">
              <i 
                class="fi fi-rr-picture item-icon"
                :class="{ 'no-image': !item.image }"
                @click="item.image && showItemImage(item)"
              ></i>
              {{ item.name }}
            </div>
            <div class="item-weight">{{ item.weight ? `${item.weight} lb` : '-' }}</div>
            <div class="item-usage">{{ item.usage }}</div>
            <div class="item-quantity">{{ item.quantity }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="inventory-status-bar">
      <div class="currency-info">
        <span>0/3 <i class="fi fi-sr-sun" :data-tooltip="`物品同调`"></i></span>
        <span class="separator">|</span>
        <span :data-tooltip="`铂金币`">0 PP</span>
        <span class="separator">|</span>
        <span :data-tooltip="`银金币`">0 GP</span>
        <span class="separator">|</span>
        <span :data-tooltip="`金币`">0 EP</span>
        <span class="separator">|</span>
        <span :data-tooltip="`银币`">0 SP</span>
        <span class="separator">|</span>
        <span :data-tooltip="`铜币`">0 CP</span>
      </div>
      <div class="weight-info">
        <div class="weight-progress">
          <div 
            class="weight-progress-bar" 
            :style="{
              width: `${weightStatus.percentage}%`,
              backgroundColor: weightStatus.color
            }"
          ></div>
        </div>
        <span>负重: {{ currentWeight }}/{{ maxWeight }}</span>
        <i class="fi fi-sr-backpack"></i>
      </div>
    </div>

    <ImagePreview
      v-model="showPreview"
      :image-src="previewImage"
      alt="物品图片"
    />
  </div>
</template>

<script setup lang="ts">
import { OptionalCharacter, OptionalComputedStats } from '@/types/dnd5e';
import { computed, ref } from 'vue';
import { WEAPONS } from '@/constants/dnd5e';
import type { InventoryItem } from '@/types/dnd5e';
import { getStaticPath } from '@/utils/assets';
import ImagePreview from '@/components/ImagePreview.vue';

const props = defineProps<{
  character: OptionalCharacter;
  computedStats: OptionalComputedStats;
}>();

const inventoryCategories = [
  { id: 'weapons', name: '武器' },
  { id: 'armor', name: '装备' },
  { id: 'consumables', name: '消耗品' },
  { id: 'tools', name: '工具' },
  { id: 'containers', name: '容器' },
  { id: 'valuables', name: '贵重品' }
];

const inventoryItem = props.character.inventoryItem || [];
console.log(inventoryItem);

const itemsByCategory = computed(() => {
  const result = new Map();
  
  // 先处理普通物品
  inventoryCategories.forEach(category => {
    if (category.id !== 'tools') {
      const items = inventoryItem.filter(item => item.categoryId === category.id)
        .map(item => {
          // 如果是武器类别，获取武器详情
          if (category.id === 'weapons' && item.weaponType) {
            const weaponInfo = WEAPONS.get(item.weaponType);
            return {
              ...item,
              // 修改组合武器名称的逻辑
              name: `${item.name} - ${item.subType || item.weaponType}${weaponInfo?.properties ? ` - ${weaponInfo.properties}` : ''}`,
              // 从武器信息中获取重量
              weight: weaponInfo?.weight || null
            };
          }
          return item;
        });
      result.set(category.id, items);
    }
  });
  
  // 特殊处理工具类别
  const computedTools = (props.computedStats?.statusDetails?.TOOLS || []);
  const inventoryTools = inventoryItem
    .filter(item => item.categoryId === 'tools')
    .map(item => item.name);
  
  const uniqueTools = [...new Set([...computedTools, ...inventoryTools])];
  result.set('tools', uniqueTools.map((tool, index) => ({
    id: index + 1,
    name: tool,
    weight: null,
    usage: '-',
    quantity: 1,
    categoryId: 'tools'
  })));
  
  return result;
});

const getItemCount = (categoryId: string): number => {
  return itemsByCategory.value.get(categoryId)?.length || 0;
};

const getItemsByCategory = (categoryId: string) => {
  return itemsByCategory.value.get(categoryId) || [];
};


const currentWeight = computed(() => {
  let total = 0;
  
  inventoryCategories.forEach(category => {
    const items = itemsByCategory.value.get(category.id) || [];
    items.forEach(item => {
      if (item.weight) {
        total += item.weight * item.quantity;
      }
    });
  });
  
  return Number(total.toFixed(1));
});

const attributes = props.computedStats.attributes;
const STR = attributes[1];

const lightLoad = STR * 5;    
const mediumLoad = STR * 10;
const maxWeight = STR * 15; 

const weightStatus = computed(() => {
  const percentage = (currentWeight.value / maxWeight) * 100;
  
  if (currentWeight.value <= lightLoad) {
    return {
      percentage,
      color: '#4caf50'  
    };
  } else if (currentWeight.value <= mediumLoad) {
    return {
      percentage,
      color: '#ff9800'  
    };
  } else {
    return {
      percentage,
      color: '#f44336'  
    };
  }
});

const showPreview = ref(false);
const previewImage = ref('');

const showItemImage = (item: InventoryItem) => {
  if (item.image) {
    previewImage.value = getStaticPath(item.image);
    showPreview.value = true;
  }
};
</script>

<style scoped>
.inventory-content {
  margin-top: 1rem;
  position: relative;
  padding-bottom: 3rem;
}

.inventory-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inventory-category {
  background: transparent;
  border: none;
  border-radius: 0;
}

.item-list {
  padding: 0;
}

.item-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.9rem;
  align-items: center;
  border-radius: 0;
  background-color: rgba(144, 238, 144, 0.1);
  border-bottom: 1px solid var(--color-border);
}

.item-row:hover {
  background-color: rgba(144, 238, 144, 0.2);
}

.item-row.striped {
  background-color: rgba(144, 238, 144, 0.15);
}

.item-weight {
  text-align: left;
}

.item-name {
  color: var(--color-text);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-usage {
  color: var(--color-text);
  text-align: left;
}

.item-quantity {
  text-align: left;
}

.column-headers {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(200, 200, 200, 0.1);
}

.header-weight,
.header-usage,
.header-quantity {
  text-align: left;
}

.header-weight,
.item-weight {
  min-width: 3rem;
}

.header-usage,
.item-usage {
  min-width: 4rem;
}

.header-quantity,
.item-quantity {
  min-width: 3rem;
}

.inventory-status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.currency-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.currency-info i {
  font-size: 0.9rem;
  vertical-align: middle;
}

.separator {
  color: var(--color-border);
}

.weight-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-soft);
}

.weight-info i {
  font-size: 1rem;
}

.weight-progress {
  width: 100px;
  height: 4px;
  background-color: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.weight-progress-bar {
  height: 100%;
  transition: all 0.3s ease;
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

.header-name {
  display: flex;
  align-items: center;
}

.item-icon {
  font-size: 0.9rem;
  position: relative;
}

.item-icon.no-image {
  opacity: 0.5;
  cursor: default;
}

.item-icon.no-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
  background-color: currentColor;
  transform: rotate(45deg);
}

.item-icon:hover {
  opacity: 0.8;
}
</style>