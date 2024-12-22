<template>
  <div class="inventory-content">
    <div class="inventory-section">
    <div 
        v-for="category in inventoryCategories" 
        :key="category.id" 
        class="inventory-category"
    >
        <div class="category-header">
        <h3>{{ category.name }} ({{ getItemCount(category.id) }})</h3>
        <button class="add-button">添加</button>
        </div>
        <div class="item-list">
        <div 
            v-for="item in getItemsByCategory(category.id)" 
            :key="item.id" 
            class="item-row"
            :class="{ 'striped': item.id % 2 === 0 }"
        >
            <div class="item-weight">{{ item.weight || '-' }}</div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-usage">{{ item.usage }}</div>
            <div class="item-quantity">{{ item.quantity }}</div>
            <div class="item-actions">
            <i class="fi fi-sr-search"></i>
            <i class="fi fi-sr-pencil"></i>
            <i class="fi fi-sr-trash"></i>
            </div>
        </div>
        </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Character } from '@/types/dnd5e';

const props = defineProps<{
    character: Character;
    computedStats: Character;
}>();

const inventoryCategories = [
    { id: 'weapons', name: '武器' },
    { id: 'armor', name: '装备' },
    { id: 'consumables', name: '消耗品' },
    { id: 'tools', name: '工具' },
    { id: 'containers', name: '容器' },
    { id: 'valuables', name: '贵重品' }
];

const getItemCount = (categoryId: string): number => {
// 临时返回0,实际应该从character数据中获取
return 0;
};

const getItemsByCategory = (categoryId: string) => {
// 临时返回空数组,实际应该从character数据中获取
return [];
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

/* ... 其他样式保持不变 ... */
</style>