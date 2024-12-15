<template>
  <div 
    class="filter-panel"
    :class="{ 'filter-panel-show': modelValue,
              'filter-panel-hide': !modelValue
    }"
  >
    <!-- 遍历所有筛选条件 -->
    <template v-for="(filter, key) in filterGroups" :key="key">
      <!-- 标签类型使用弹出式面板 -->
      <template v-if="filter.type === 'select'">
        <div class="filter-group">
          <div class="filter-header" @click="toggleExpand(key)">
            <span class="filter-title">
              <span>{{ filter.label }}: </span>
              <span class="selected-tags">
                <span v-for="tag in selectedFilters[key]" 
                      :key="tag" 
                      class="selected-tag">
                  {{ tag }}
                  <span class="remove-tag" @click.stop="removeTag(key, tag)">
                    <i class="fi fi-rr-cross-small"></i>
                  </span>
                </span>
              </span>
            </span>
            <span class="expand-icon" :class="{ 'expanded': expandedStates[key] }">
              <i class="fi fi-rs-angle-small-down"></i>
            </span>
          </div>

          <div 
            v-show="expandedStates[key]" 
            class="filter-content-popup"
          >
            <div class="filter-select">
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
                <span>{{ option }}</span>
              </label>
            </div>
          </div>
        </div>
      </template>

      <!-- 日期类型 -->
      <template v-else-if="filter.type === 'date'">
        <div class="date-filter">
          <div class="date-range">
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
      </template>
    </template>

    <div class="filter-actions">
      <button class="reset-button" @click="resetFilters">
        <i class="fi fi-br-refresh"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

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

// 每个select类型筛选条件的展开状态
const expandedStates = ref<Record<string, boolean>>({})

// 初始化筛选条件和展开状态
watch(() => props.filterGroups, () => {
  Object.entries(props.filterGroups).forEach(([key, filter]) => {
    // 初始化筛选值
    if (filter.type === 'select' && !selectedFilters.value[key]) {
      selectedFilters.value[key] = []
      // 初始化展开状态
      if (expandedStates.value[key] === undefined) {
        expandedStates.value[key] = false
      }
    } else if (filter.type === 'date' && !selectedFilters.value[key]) {
      selectedFilters.value[key] = { start: '', end: '' }
    }
  })
}, { immediate: true })

// 切换指定筛选条件的展开状态
const toggleExpand = (key: string) => {
  expandedStates.value[key] = !expandedStates.value[key]
}

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

// 移除标签
const removeTag = (key: string, tag: string) => {
  if (Array.isArray(selectedFilters.value[key])) {
    const index = (selectedFilters.value[key] as string[]).indexOf(tag)
    if (index > -1) {
      (selectedFilters.value[key] as string[]).splice(index, 1)
      handleFilterChange()
    }
  }
}

// 添加点击外部关闭弹出框的处理
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.filter-group')) {
    Object.keys(expandedStates.value).forEach(key => {
      expandedStates.value[key] = false
    })
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.filter-panel {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.filter-panel-hide{
  display: none;
}

.filter-group {
  position: relative;
  display: inline-block;
}

.filter-group-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.filter-select {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .filter-group {
    min-width: 150px;
  }
}

.reset-button {
  padding: 4px;
  border: 1px solid var(--color-background-highlight);
  border-radius: 4px;
  cursor: pointer;
  background: var(--color-background);
  color: var(--color-background-highlight);
  transition: all 0.2s;
}

.reset-button:hover {
  background: var(--color-background-mute);
}

.tag-checkbox {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  transition: all 0.2s ease;
  border: none;
  border-radius: 4px;
}

.tag-checkbox input {
  margin-right: 0.5rem;
}

.tag-checkbox:hover {
  background: var(--color-background-soft);
}

.tag-checkbox input:checked + span {
  color: var(--color-primary);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  min-width: 120px;
  white-space: nowrap;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 300px;
  overflow: hidden;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: var(--color-background-soft);
  border-radius: 4px;
  font-size: 0.875rem;
}

.remove-tag {
  margin-left: 4px;
  cursor: pointer;
  height: 19px;
}
.remove-tag i{
  font-size: 0.875rem;
  line-height: 0.875rem;
}

.expand-icon {
  font-size: 0.75rem;
  transition: transform 0.3s;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.filter-content {
  margin-top: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 12px;
}

.date-filter {
  margin-bottom: 8px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 4px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  flex: 1;
}

.filter-content-popup {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 1000;
  min-width: 200px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0;
}

.filter-select {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
}

/* 添加过渡动画 */
.filter-content-popup {
  transition: opacity 0.3s, transform 0.3s;
  transform-origin: top;
}

.filter-content-popup[v-show="false"] {
  opacity: 0;
  transform: scaleY(0);
}

.filter-content-popup[v-show="true"] {
  opacity: 1;
  transform: scaleY(1);
}
</style> 