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
            <button 
              v-if="isElectron"
              class="shadow-button" 
              :class="{ 'disabled': !isEditing }"
              @click="addItem(category.id)"
              title="添加物品"
            >
              <i class="fi fi-rr-plus"></i>
            </button>
            {{ category.name }} ({{ getItemCount(category.id) }})
          </div>
          <div class="header-weight">重量</div>
          <div class="header-usage">用法</div>
          <div class="header-quantity">数量</div>
          <div class="header-actions"></div>
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
                v-if="item.image"
                class="fi fi-rr-picture item-icon"
                @click="showItemImage(item)"
              ></i>
              <span v-else class="item-icon-placeholder"></span>
              <span 
                :contenteditable="isEditing" 
                @blur="updateItem($event, item, 'name')"
              >{{ item.name }}</span>
            </div>
            <div 
              class="item-weight" 
              :contenteditable="isEditing"
              @blur="updateItem($event, item, 'weight')"
            >{{ item.weight ? `${item.weight} lb` : '-' }}</div>
            <div 
              class="item-usage" 
              :contenteditable="isEditing" 
              @blur="updateItem($event, item, 'usage')">
            {{ item.usage }}</div>
            <div class="item-quantity" 
              :contenteditable="isEditing" 
              @blur="updateItem($event, item, 'quantity')">
            {{ item.quantity }}</div>
            <div class="item-actions">
              <button 
                v-if="isElectron && isEditing"
                class="shadow-button" 
                @click="deleteItem(item)"
                title="删除物品"
              >
                <i class="fi fi-rr-minus"></i>
              </button>
            </div>
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
import { computed, ref, watch } from 'vue';
import { WEAPONS } from '@/constants/dnd5e';
import type { InventoryItem } from '@/types/dnd5e';
import { getStaticPath } from '@/utils/assets';
import ImagePreview from '@/components/ImagePreview.vue';

const isElectron = !!window.electronAPI

const props = defineProps<{
  character: OptionalCharacter;
  computedStats: OptionalComputedStats;
  isEditing: boolean;
}>();
const emit = defineEmits(['update:inventoryItem']);

const inventoryCategories = [
  { id: 'weapons', name: '武器' },
  { id: 'armor', name: '装备' },
  { id: 'consumables', name: '消耗品' },
  { id: 'tools', name: '工具' },
  { id: 'containers', name: '容器' },
  { id: 'valuables', name: '贵重品' }
];

const inventoryItem = ref(props.character.inventoryItem || []);

watch(()=>inventoryItem.value,()=>{
  emit('update:inventoryItem', inventoryItem.value)
})

const itemsByCategory = computed(() => {
  const result = new Map();
  
  // 先处理普通物品
  inventoryCategories.forEach(category => {
    if (category.id !== 'tools') {
      const items = inventoryItem.value.filter(item => item.categoryId === category.id)
        .map((item, index) => {
          // 如果是武器类别，获取武器详情
          if (category.id === 'weapons') {
            const weaponInfo = WEAPONS.get(item.weaponType);
            return {
              ...item,
              id: index + 1,
              // 修改组合武器名称的逻辑
              name: `${item.name || ''} - ${item.subType || item.weaponType}${weaponInfo?.properties ? ` - ${weaponInfo?.properties}` : ' - '}`,
              // 从武器信息中获取重量
              weight: item.weight || weaponInfo?.weight || null
            };
          }
          return {
            ...item,
            id: index + 1
          };
        });
      
      result.set(category.id, items);
    }
  });
  
  // 特殊处理工具类别
  const computedTools = (props.computedStats?.statusDetails?.TOOLS || []);
  const inventoryTools = inventoryItem.value
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

const addItem = (categoryId: string) => {
  const newItem = categoryId === 'weapons' ? {
    weaponType: "",
    subType: "",
    usage: "",
    quantity: 1,
    categoryId: "weapons",
    image: "",
    weight: null
  } : {
    name: "",
    weight: null,
    usage: "-",
    quantity: 1,
    categoryId: categoryId
  };
  
  inventoryItem.value = [...inventoryItem.value, newItem];
}

const deleteItem = (item: InventoryItem) => {
  const name = item.categoryId === 'weapons' ? item.name.split(' - ')[0] : item.name;
  inventoryItem.value = inventoryItem.value.filter(i => 
    !(i.name === name && i.categoryId === item.categoryId)
  );
};

const getItemCount = (categoryId: string): number => {
  return itemsByCategory.value.get(categoryId)?.length || 0;
};

const getItemsByCategory = computed(() => (categoryId: string) => {
  return itemsByCategory.value.get(categoryId) || [];
});

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
    previewImage.value = item.image;
    showPreview.value = true;
  }
};

const updateItem = (event: FocusEvent, item: InventoryItem, key: string) => {
  const target = event.target as HTMLElement;
  const newValue = target.textContent || null;

  const formatValue = (value: string) => {
    if (key === 'weight') return parseFloat(value.replace(/[^\d.]/g, ''));
    if (key === 'usage') return value;
    if (key === 'quantity') return parseInt(value);
    return value;
  }
  const formatDisplay = (value: string | number) => {
    if (key === 'weight') return value ? `${value} lb` : '-';
    if (key === 'usage') return `${value}`;
    if (key === 'quantity') return `${value}`;
    return `${value}`;
  }

  const value = formatValue(newValue);
  const name = item.categoryId === 'weapons' ? item.name.split(' - ')[0] : item.name;
  const targetItem = inventoryItem.value.find(i => i.name === name && i.categoryId === item.categoryId);

  if (targetItem) {
    targetItem[key] = value;
    // 强制更新数组以触发响应式
    inventoryItem.value = [...inventoryItem.value];
  }
  // 更新显示格式
  target.textContent = formatDisplay(value);
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
  grid-template-columns: 1fr auto auto auto auto;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.item-name span {
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
  grid-template-columns: 1fr auto auto auto auto;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(200, 200, 200, 0.1);
}

.header-weight,
.header-usage,
.header-quantity,
.header-actions {
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

.header-actions {
  text-align: center;
  min-width: 20px;
}

.item-actions {
  display: flex;
  justify-content: center;
  align-items: center;
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

.header-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-icon {
  font-size: 0.9rem;
  position: relative;
}

.item-icon:hover {
  opacity: 0.8;
}

.item-icon-placeholder {
  display: inline-block;
  width: 0.9rem; 
}
</style>