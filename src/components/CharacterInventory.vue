<template>
  <div class="inventory-content">
    <div class="inventory-section">
      <div 
        v-for="category in inventoryCategories" 
        :key="category.id" 
        class="inventory-category"
      >
        <div class="column-headers">
          <div class="header-name">{{ category.name }} ({{ getItemCount(category.id) }})</div>
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
            <div class="item-name">{{ item.name }}</div>
            <div class="item-weight">{{ item.weight ? `${item.weight} lb` : '-' }}</div>
            <div class="item-usage">{{ item.usage }}</div>
            <div class="item-quantity">{{ item.quantity }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Character } from '@/types/dnd5e';
import { computed } from 'vue';

const props = defineProps<{
  character: Character;
  computedStats: Character;
}>();

interface InventoryItem {
  id: number;
  name: string;
  weight: number | null;
  usage: string;
  quantity: number;
  categoryId: string;
}

const inventoryCategories = [
  { id: 'weapons', name: '武器' },
  { id: 'armor', name: '装备' },
  { id: 'consumables', name: '消耗品' },
  { id: 'tools', name: '工具' },
  { id: 'containers', name: '容器' },
  { id: 'valuables', name: '贵重品' }
];

// 虚拟数据
const mockItems: InventoryItem[] = [
  {
    id: 1,
    name: '裁决 Judex',
    weight: 3,
    usage: '1动作',
    quantity: 1,
    categoryId: 'weapons'
  },
];

const itemsByCategory = computed(() => {
  const result = new Map();
  
  // 先处理普通物品
  inventoryCategories.forEach(category => {
    if (category.id !== 'tools') {
      result.set(
        category.id, 
        mockItems.filter(item => item.categoryId === category.id)
      );
    }
  });
  
  // 特殊处理工具类别
  const computedTools = (props.computedStats?.statusDetails?.TOOLS || []);
  const mockTools = mockItems
    .filter(item => item.categoryId === 'tools')
    .map(item => item.name);
  
  const uniqueTools = [...new Set([...computedTools, ...mockTools])];
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
</script>

<style scoped>
.inventory-content {
  margin-top: 1rem;
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
</style>