<template>
  <div class="filter-bar">
    <div class="filter-options">
      <!-- 根据当前工具显示不同的筛选选项 -->
      <template v-if="currentTool === 'overview'">
        <select v-model="filters.overview.sort" class="filter-select" @change="emitFilterChange">
          <option value="name">按名称</option>
          <option value="date">按日期</option>
          <option value="type">按类型</option>
        </select>
      </template>

      <template v-if="currentTool === 'gallerys'">
        <select v-model="filters.gallerys.type" class="filter-select" @change="emitFilterChange">
          <option value="all">全部图片</option>
          <option value="portrait">肖像</option>
          <option value="scene">场景</option>
          <option value="item">物品</option>
        </select>
        <select v-model="filters.gallerys.time" class="filter-select" @change="emitFilterChange">
          <option value="all">全部时间</option>
          <option value="recent">最近添加</option>
          <option value="oldest">最早添加</option>
        </select>
      </template>

      <!-- ... 其他工具的筛选选项保持不变 ... -->
    </div>

    <!-- 搜索框 -->
    <div class="filter-search">
      <input 
        type="text" 
        v-model="searchQuery"
        :placeholder="getSearchPlaceholder"
        class="search-input"
        @input="emitSearchChange"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 定义 props
const props = defineProps<{
  currentTool: string
}>()

// 定义 emits
const emit = defineEmits<{
  (e: 'filter-change', filters: any): void
  (e: 'search-change', query: string): void
}>()

// 筛选状态
const filters = reactive({
  overview: {
    sort: 'name'
  },
  gallerys: {
    type: 'all',
    time: 'all'
  },
  documents: {
    category: 'all'
  },
  events: {
    time: 'all',
    importance: 'all'
  },
  footprints: {
    region: 'all'
  },
  media: {
    type: 'all'
  },
  notes: {
    category: 'all'
  }
})

// 搜索查询
const searchQuery = ref('')

// 根据当前工具获取搜索框占位符
const getSearchPlaceholder = computed(() => {
  const placeholders = {
    overview: '搜索所有内容...',
    gallerys: '搜索图片...',
    documents: '搜索文档...',
    events: '搜索事件...',
    footprints: '搜索地点...',
    media: '搜索媒体...',
    notes: '搜索笔记...'
  }
  return placeholders[props.currentTool] || '搜索...'
})

// 发送筛选变化事件
const emitFilterChange = () => {
  emit('filter-change', filters[props.currentTool])
}

// 发送搜索变化事件
const emitSearchChange = () => {
  emit('search-change', searchQuery.value)
}
</script>

<style scoped>
.filter-bar {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  gap: 1rem;
  align-items: center;
  background: var(--color-background);
}

/* ... 其他样式保持不变 ... */
</style> 