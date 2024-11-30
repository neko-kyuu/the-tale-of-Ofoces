<template>
  <div class="gallery-container">
    <div class="gallery-header">
      <div class="left-controls">
        <div class="view-mode">
          <button 
            :class="{ active: viewMode === 'waterfall' }" 
            @click="viewMode = 'waterfall'"
          ></button>
          <button 
            :class="{ active: viewMode === 'ebook' }" 
            @click="viewMode = 'ebook'"
          ></button>
        </div>
        <button 
          v-if="viewMode === 'waterfall'"
          class="filter-button"
          :class="{ active: showFilters }"
          @click="toggleFilters"
        >
          <i class="fi fi-rr-filter-list"></i>
        </button>
      </div>
    </div>

    <FilterPanel
      v-model="showFilters"
      :filter-groups="filterGroups"
      :active-filters="currentFilters"
      @filter="handleFilter"
    />

    <div v-if="viewMode === 'waterfall'" class="waterfall-container">
      <VirtualWaterfall
        :items="filteredItems"
        :column-width="280"
        :gap="16"
        :min-column-count="2"
        @select-character="handleSelectEntity"
        @open-file="handleOpenFile"
      >
        <template #item="{ item }">
          <div class="gallery-item">
            <div class="item-preview">
              <img 
                :src="getStaticPath(item.path)" 
                loading="lazy"
              >
            </div>
            <div class="item-info">
              <div class="item-metadata">
                <span class="item-date">{{ item.finishedDate }}</span>
                <span class="item-version" v-if="item.version > 1" >version · {{ item.version }}</span>
              </div>
              <div class="item-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </VirtualWaterfall>
    </div>

    <div v-else-if="viewMode === 'ebook'" class="ebook-container">
      <EbookViewer
        :images="ebookImages"
        @open-file="handleOpenFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, onUnmounted } from 'vue'
import VirtualWaterfall from '@/components/VirtualWaterfall.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import { gallerys, ebooks, documents } from '@/constants/entities'
import { useCharacterDetailStore } from '@/stores/characterDetail'
import { ModalManager } from '@/utils/ModalManager'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import EbookViewer from '@/components/EbookViewer.vue'
import { getStaticPath, getAssetUrl } from '@/utils/assets'
import { collectFilterGroups } from '@/utils/filterUtils'

const store = useCharacterDetailStore()
const isMobile = ref(false)

const currentFile = computed(() => store.currentFile)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 视图模式
const viewMode = ref('waterfall')

// 从实体中获取可筛选的属性
const filterGroups = computed(() => {
  return collectFilterGroups(gallerys, {
    customLabels: {
      tags: '标签',
      finishedDate: '完成日期'
    }
  })
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
  return gallerys.filter(item => {
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

// 处理实体选择
const handleSelectEntity = (char: any) => {
  store.showCharacter(char)
}

// 处理文件打开
const handleOpenFile = (file: any) => {
  if (isMobile.value) {
    store.showFile(file)
  } else {
    ModalManager.getInstance().create(`${file.type}-${file.id}`, {
      title: file.title,
      entityId: file.id,
      entityType: file.type,
      content: h(MarkdownPreview, { filePath: getStaticPath(file.path) }),
      props: {
        minWidth: 200,
        initialWidth: 800,
        initialHeight: 600,
        initialPosition: { 
          x: 0.6, 
          y: 0.3
        }
      }
    })
    ModalManager.getInstance().activateModal(`${file.type}-${file.id}`)
  }
}

const ebookImages = computed(() => {
  try {
    const imageFiles = import.meta.glob('/public/static/archive/2024-Anniv/*.{png,jpg,jpeg,webp}', {
      eager: true,
      import: 'default'
    })
    
    const images = Object.entries(imageFiles)
      .map(([path, url]) => {
        // 获取文件名
        const fileName = path.split('/').pop() || ''
        
        return {
          id: path,
          path: getAssetUrl(url),
          title: fileName
        }
      })
      .sort((a, b) => {
        return a.title.localeCompare(b.title, undefined, { numeric: true })
      })
    
    return images
  } catch (error) {
    console.error('Error loading ebook images:', error)
    return []
  }
})

</script>

<style scoped>
.gallery-container {
  min-height: 100%;
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
  border: 1px solid var(--color-background-highlight);
}

.filter-button {
  height: 24px;
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