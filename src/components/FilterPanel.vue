<template>
  <div 
    class="filter-panel"
    :class="{ 'filter-panel-show': modelValue,
              'filter-panel-hide': !modelValue
    }"
  >
    <div 
      v-for="(filter, key) in filterGroups" 
      :key="key"
      class="filter-group"
    >
      <!-- <div class="filter-label">{{ filter.label }}</div> -->
      
      <!-- 标签类型的筛选 -->
      <div v-if="filter.type === 'select'" class="filter-select">
        <label 
          v-for="option in filter.options" 
          :key="option" 
          class="tag-checkbox"
        >
          <input 
            type="checkbox"
            v-model="selectedFilters[key]"
            :value="option"
            @change="handleFilterChange"
          >
          {{ option }}
        </label>
      </div>

      <!-- 日期类型的筛选 -->
      <div v-if="filter.type === 'date'" class="date-range">
        <input 
          type="date" 
          v-model="(selectedFilters[key] as DateRange).start"
          class="date-input"
          @change="handleFilterChange"
        >
        <span>-</span>
        <input 
          type="date" 
          v-model="(selectedFilters[key] as DateRange).end"
          class="date-input"
          @change="handleFilterChange"
        >
      </div>
    </div>

    <div class="filter-actions">
      <button class="reset-button" @click="resetFilters">
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface DateRange {
  start: string
  end: string
}

interface FilterGroup {
  label: string
  type: 'select' | 'date'
  options?: string[]
}

interface Props {
  modelValue: boolean
  filterGroups: Record<string, FilterGroup>
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'filter', filters: Record<string, string[] | DateRange>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 选中的筛选条件
const selectedFilters = ref<Record<string, string[] | DateRange>>({})

// 初始化筛选条件
watch(() => props.filterGroups, () => {
  Object.entries(props.filterGroups).forEach(([key, filter]) => {
    if (filter.type === 'select' && !selectedFilters.value[key]) {
      selectedFilters.value[key] = []
    } else if (filter.type === 'date' && !selectedFilters.value[key]) {
      selectedFilters.value[key] = { start: '', end: '' }
    }
  })
}, { immediate: true })

// 处理筛选条件变化
const handleFilterChange = () => {
  emit('filter', selectedFilters.value)
}

// 重置筛选条件
const resetFilters = () => {
  Object.entries(props.filterGroups).forEach(([key, filter]) => {
    if (filter.type === 'select') {
      selectedFilters.value[key] = []
    } else if (filter.type === 'date') {
      selectedFilters.value[key] = { start: '', end: '' }
    }
  })
  // 触发筛选更新
  handleFilterChange()
}
</script>

<style scoped>
.filter-panel {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.filter-panel-hide{
  display: none;
}

.filter-group {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.filter-group-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.filter-select {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .filter-group {
    min-width: 150px;
  }
}

.reset-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.2s;
}

.reset-button:hover {
  background: var(--color-background-mute);
}

.tag-checkbox{
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  padding: 0 8px;
}
.tag-checkbox input{
  margin-right: 0.25rem;
}
.tag-checkbox:hover{
  background: var(--color-background-mute);
}
.date-range{
  display: flex;
  align-items: center;
  gap:8px;
}
.date-input{
  padding: 4px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
}
</style> 