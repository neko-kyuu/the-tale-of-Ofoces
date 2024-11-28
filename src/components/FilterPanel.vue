<template>
  <div 
    class="filter-panel"
    :class="{ 'filter-panel-show': modelValue }"
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
          v-model="selectedFilters[key].start"
          class="date-input"
          @change="handleFilterChange"
        >
        <span>至</span>
        <input 
          type="date" 
          v-model="selectedFilters[key].end"
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
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 16px;
  display: none;
  font-size: 0.8rem;
}

.filter-panel-show {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
}

.filter-label {
  font-weight: 500;
  margin-bottom: 8px;
}

.filter-select {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--color-background);
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.tag-checkbox:hover {
  background: var(--color-background-mute);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
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
</style> 