<template>
  <div class="gallery-container">
    <div class="gallery-header">
      <div class="left-controls">
        <div class="view-mode">
          <button 
            :class="{ active: viewMode === 'waterfall' }" 
            @click="viewMode = 'waterfall'"
          >
            <i class="ri-layout-masonry-line"></i>
          </button>
          <button 
            :class="{ active: viewMode === 'folder' }" 
            @click="viewMode = 'folder'"
          >
            <i class="ri-folder-line"></i>
          </button>
        </div>
        <button 
          class="filter-button"
          :class="{ active: showFilters }"
          @click="toggleFilters"
        >
          <i class="ri-filter-3-line"></i>
          筛选
        </button>
      </div>
    </div>

    <FilterPanel
      v-model="showFilters"
      :filter-groups="filterGroups"
      @filter="handleFilter"
    />

    <div v-if="viewMode === 'waterfall'" class="waterfall-container">
      <VirtualWaterfall
        :items="filteredItems"
        :column-width="280"
        :gap="16"
        :min-column-count="2"
      >
        <template #item="{ item }">
          <div class="gallery-item">
            <div class="item-preview">
              <img 
                :src="item.path" 
                loading="lazy"
              >
            </div>
            <div class="item-info">
              <div class="item-metadata">
                <span class="item-date">{{ formatDate(item.finishedDate) }}</span>
                <span class="item-version">v{{ item.version }}</span>
              </div>
              <div class="item-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
              <div class="item-references" v-if="item.references.length">
                <span>关联：</span>
                <span v-for="ref in item.references" :key="ref.id" class="reference">
                  {{ ref.type }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </VirtualWaterfall>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VirtualWaterfall from '@/components/VirtualWaterfall.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import { gallery } from '@/constants/entities'

// 视图模式
const viewMode = ref('waterfall')

// 从实体中获取可筛选的属性
const filterGroups = computed(() => {
  const groups: Record<string, any> = {}
  
  // 获取所有标签
  const tags = new Set<string>()
  gallery.forEach(item => {
    item.tags.forEach(tag => tags.add(tag))
  })
  
  groups.tags = {
    label: '标签',
    type: 'select',
    options: Array.from(tags)
  }
  
  groups.finishedDate = {
    label: '完成日期',
    type: 'date'
  }
  
  return groups
})

// 筛选面板显示状态
const showFilters = ref(false)

// 当前筛选条件
const currentFilters = ref<Record<string, any>>({})

// 处理筛选
const handleFilter = (filters: Record<string, any>) => {
  currentFilters.value = filters
}

// 筛选后的项目
const filteredItems = computed(() => {
  return gallery.filter(item => {
    // 标签筛选
    const selectedTags = currentFilters.value.tags || []
    const matchesTags = selectedTags.length === 0 || 
      item.tags.some(tag => selectedTags.includes(tag))

    // 日期筛选
    const dateRange = currentFilters.value.finishedDate || { start: '', end: '' }
    const itemDate = new Date(item.finishedDate)
    const matchesStartDate = !dateRange.start || 
      itemDate >= new Date(dateRange.start)
    const matchesEndDate = !dateRange.end || 
      itemDate <= new Date(dateRange.end)

    return matchesTags && matchesStartDate && matchesEndDate
  })
})

// 切换筛选面板
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// 格式化日期
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}
</script>

<style scoped>
.gallery-container {
  height: 100%;
  padding: 16px;
  background: var(--color-background);
}

.gallery-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}

.left-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.view-mode {
  display: flex;
  gap: 8px;
  background: var(--color-background-soft);
  padding: 4px;
  border-radius: 8px;
}
.view-mode button {
  height: 1rem;
  width: 1rem;
  border-radius: 8px;
  background: var(--color-background);
  border: none;
}
.view-mode button.active {
  background: var(--color-background-mute);
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  background: var(--color-background-soft);
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text);
  transition: all 0.2s;
}

.filter-button.active {
  background: var(--color-background-mute);
  color: var(--color-primary);
}

.waterfall-container {
  height: calc(100% - 52px);
}

.gallery-item {
  break-inside: avoid;
  background: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.gallery-item:hover {
  transform: translateY(-2px);
}

.item-preview {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.item-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.item-info {
  padding: 12px;
}

.item-info h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--color-text);
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  background: var(--color-background);
  border-radius: 12px;
  color: var(--color-text-light);
}

.item-metadata {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-light);
  margin-bottom: 8px;
}

.item-references {
  font-size: 12px;
  color: var(--color-text-light);
  margin-top: 8px;
}

.reference {
  margin-right: 4px;
  padding: 2px 4px;
  background: var(--color-background-mute);
  border-radius: 4px;
}
</style>