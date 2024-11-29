<template>
    <Teleport to="body">
      <div 
        v-if="store.currentChar"
        class="slide-detail"
        :class="{ 
          'slide-detail--open': store.currentChar,
        }"
      >
        <!-- 原有的详情内容 -->
        <div class="detail-header">
            <div class="slide-info">
            <div class="slide-meta">
                <h2>{{ currentChar.name }}</h2>
                
            </div>
            </div>
            <div class="detail-controls">
            <button 
                class="control-button"
                @click="closeCharacterDetail"
                title="关闭"
            >
            <i class="fi fi-sr-angle-square-right"></i>
            </button>
            </div>
        </div>
        <div class="detail-toolbar">
            <div class="tool-buttons">
                <button 
                    v-for="tool in tools" 
                    :key="tool.id"
                    class="tool-button"
                    :class="{ 'active': currentTool === tool.id }"
                    :title="tool.label"
                    @click="switchTool(tool.id)"
                >
                    <i :class="tool.icon"></i>
                </button>
            </div>
            <button 
                v-if="useStandardFilter"
                class="filter-toggle"
                :class="{ 'active': showFilters }"
                @click="showFilters = !showFilters"
                :title="showFilters ? '收起筛选' : '展开筛选'"
            >
                <i class="fi" 
                  :class="{ 'fi-rr-filter': !showFilters, 
                  'fi-rr-filter-slash': showFilters }">
                </i>
            </button>
        </div>
        <div class="detail-content" :class="{ 'with-filter': showFilters }">
            <Transition name="fade">
                <div 
                    v-if="showFilters 
                    && useStandardFilter 
                    && Object.keys(filterGroups).length > 0"
                    class="filter-dropdown"
                >
                    <FilterPanel
                        v-model="showFilters"
                        :filter-groups="filterGroups"
                        :active-filters="currentFilters"
                        @filter="handleFilterChange"
                    />
                </div>
            </Transition>
            <RelatedResources
                :entity-id="currentChar.id"
                :entity-type="currentChar.type"
                :current-tool="currentTool"
                :filtered-entities="filteredEntities"
                @select-character="showCharacterDetail"
                @open-file="openFile"
            />
        </div>
      </div>
  
      <!-- 文件详情窗口 -->
      <div 
        v-if="store.currentFile"
        class="file-detail"
        :class="{ 
          'file-detail--open': true,
          'file-detail--mobile': isMobile
        }"
      >
        <div class="file-detail-header">
            <h2 class="file-title">{{ currentFile.name }}</h2>
            <div class="file-controls">
              <button 
                  class="control-button"
                  @click="backToCharacter"
                  title="返回"
              >
                  <i class="fi fi-rr-arrow-left"></i>
              </button>
              <button 
                  class="control-button"
                  @click="closeAllDetails"
                  title="关闭"
              >
                <i class="fi fi-rr-cross"></i>
              </button>
            </div>
        </div>
        
        <div class="file-content">
            <MarkdownPreview :file-path="currentFile.path" />
        </div>
      </div>
    </Teleport>
  </template>
  
<script setup lang="ts">
import { useCharacterDetailStore } from '@/stores/characterDetail'
import { ref, onMounted, onUnmounted, computed, h } from 'vue'
import { ModalManager } from '@/utils/ModalManager'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import RelatedResources from '@/components/RelatedResources.vue'
import { getStaticPath } from '@/utils/assets'
import { gallerys,documents } from '@/constants/entities'
import FilterPanel from '@/components/FilterPanel.vue'

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

// 计算属性：当前显示的角色
const currentChar = computed(() => store.currentChar)

const showCharacterDetail = (char) => {
  store.showCharacter(char)
}

const closeCharacterDetail = () => {
  store.hideCharacter()
}

// 返回角色详情
const backToCharacter = () => {
  store.closeFile()
}

// 关闭所有窗口
const closeAllDetails = () => {
  store.closeFile()
  store.hideCharacter()
}

// 打开文件
const openFile = (file) => {
  if (isMobile.value) {
    store.showFile(file)
  } else {
    ModalManager.getInstance().create(`file-${file.id}`, {
      title: file.title,
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
  }
}

// 定义工具栏选项
const tools = [
  { id: 'overview', label: '总览', icon: 'fi fi-rr-apps' },
  { id: 'gallerys', label: '图片', icon: 'fi fi-rr-picture' },
  { id: 'documents', label: '文档', icon: 'fi fi-rr-document' },
  { id: 'events', label: '事件', icon: 'fi fi-rr-calendar' },
  { id: 'footprints', label: '足迹', icon: 'fi fi-rr-map-marker' },
  { id: 'media', label: '音媒', icon: 'fi fi-rr-play' },
  { id: 'notes', label: '备忘录', icon: 'fi fi-rr-notebook' }
]

// 当前选中的工具
const currentTool = ref('overview')

// 获取当前工具对应的基础实体数据
const currentEntities = computed(() => {
  const entityMap = {
    gallerys,
    documents,
    // 未来可以在这里添加更多类型
    // events: events,
    // footprints: footprints,
    // media: media,
    // notes: notes
  }
  return entityMap[currentTool.value] || []
})

// 判断是否使用标准筛选逻辑
const useStandardFilter = computed(() => {
  // 只要不是 overview 就使用标准筛选逻辑
  return currentTool.value !== 'overview'
})

// 获取与当前角色相关的实体
const relatedEntities = computed(() => {
  // 如果没有当前角色，返回空数组
  if (!currentChar.value) return []

  // overview 模式使用独立逻辑
  if (currentTool.value === 'overview') {
    // 这里可以添加 overview 的特殊逻辑
    return []
  }

  // 其他工具类型使用统一的筛选逻辑
  if (!currentEntities.value.length) {
    return []
  }

  return currentEntities.value.filter(entity => {
    if (!entity.references) return false
    return Object.entries(entity.references).some(([type, refs]) => {
      const entityType = currentChar.value.type + 's'
      return type === entityType && refs.includes(currentChar.value.id)
    })
  })
})

// 存储当前激活的筛选条件（为每个工具类型分别存储）
const activeFilters = ref<Record<string, Record<string, any[]>>>({
  documents: {},
  gallerys: {},
  // 为其他工具预留位置
  // events: {},
  // footprints: {},
  // media: {},
  // notes: {}
})

// 获取当前工具的筛选条件
const currentFilters = computed(() => {
  // 确保当前工具的筛选条件对象存在
  if (!activeFilters.value[currentTool.value]) {
    activeFilters.value[currentTool.value] = {}
  }
  return activeFilters.value[currentTool.value]
})

// 切换工具
const switchTool = (toolId: string) => {
  currentTool.value = toolId
}

// 处理筛选变化
const handleFilterChange = (filters: Record<string, any[]>) => {
  // 更新当前工具的筛选条件
  activeFilters.value[currentTool.value] = filters
}

// 筛选后的实体
const filteredEntities = computed(() => {
  // overview 模式直接返回相关实体
  if (!useStandardFilter.value) {
    return relatedEntities.value
  }
  
  // 确保当前工具的筛选条件存在
  const currentToolFilters = currentFilters.value
  
  // 如果没有激活的筛选条件，返回所有相关实体
  if (!currentToolFilters || Object.keys(currentToolFilters).length === 0) {
    return relatedEntities.value
  }

  // 应用统一的筛选条件
  return relatedEntities.value.filter(entity => {
    return Object.entries(currentToolFilters).every(([key, selectedValues]) => {
      if (!entity?.hasOwnProperty(key) || !selectedValues || selectedValues.length === 0) {
        return true
      }

      const entityValue = entity[key]
      if (Array.isArray(entityValue)) {
        return selectedValues.some(selected => entityValue.includes(selected))
      }
      return selectedValues.includes(entityValue)
    })
  })
})

// 获取可筛选的属性组
const filterGroups = computed(() => {
  const groups: Record<string, any> = {}
  
  // overview 模式不需要筛选
  if (!useStandardFilter.value || !currentEntities.value?.length) {
    return groups
  }

  // 统一的属性收集逻辑
  const excludeKeys = ['id', 'path', 'references', 'version', 'type', 'title','finishedDate']
  const sampleEntity = currentEntities.value[0]
  
  if (!sampleEntity) return groups

  Object.keys(sampleEntity).forEach(key => {
    if (!excludeKeys.includes(key)) {
      const uniqueValues = [...new Set(currentEntities.value.flatMap(entity => {
        const value = entity[key]
        return Array.isArray(value) ? value : [value]
      }))].filter(value => value !== undefined && value !== null)
      
      if (uniqueValues.length > 0) {
        groups[key] = {
          label: key, 
          type: 'select',
          options: uniqueValues
        }
      }
    }
  })
  
  return groups
})

// 筛选面板显示状态
const showFilters = ref(true)

</script>

<style scoped>
.slide-detail {
  position: fixed;
  top: 1rem;
  bottom: 1rem;
  right: -100%;
  width: 350px;
  background: var(--color-background-soft);
  border-left: 1px solid var(--color-border);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 100;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  opacity: 0;
  transform: translateX(30px);
}

.slide-detail--open {
  right: 1rem;
  opacity: 0.9;
  transform: translateX(0);
}

/* 移动端样式 */
@media (max-width: 768px) {
  .slide-detail {
    top: 50%;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    border-left: none;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .slide-detail--open {
    transform: translateY(0);
    right: 0;
  }

  .slide-detail::before {
    content: '';
    position: absolute;
    top: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
  }
}

.detail-content {
  position: relative;
  height: 100%;
  padding-top: 0.5rem;
}

.slide-detail--open .detail-content {
  opacity: 1;
  transform: translateY(0);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 1rem;
}

.slide-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.slide-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
<style scoped>
.file-detail {
  position: fixed;
  top: 1rem;
  bottom: 1rem;
  right: -100%;
  width: 600px; /* 比角色详情窗口更宽 */
  background: var(--color-background-soft);
  border-left: 1px solid var(--color-border);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 200; /* 比角色详情窗口更高 */
  padding: 0; /* 移除默认内边距 */
  overflow: hidden; /* 修改为hidden以便内部滚动 */
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  opacity: 0;
  transform: translateX(30px);
}

.file-detail--open {
  right: 1rem;
  opacity: 1;
  transform: translateX(0);
}

.file-detail-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
}

.file-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.file-title {
  margin: 0;
  font-size: 1.2rem;
}

.file-content {
  padding: 1.5rem;
  height: calc(100% - 80px); /* 减去header高度 */
  overflow-y: auto;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .file-detail {
    top: var(--vt-rem-xlarge);
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 0;
    transform: translateY(100%);
  }

  .file-detail--open {
    transform: translateY(0);
    right: 0;
  }

  .file-detail-header {
    padding: 0.5rem; /* 适应移动端 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    .control-button {
      background: var(--color-danger-bg);
      color: var(--vt-c-white);
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: inset 0 -2px var(--color-background-mute);
    }

    .control-button:hover {
      background-color: var(--color-danger-bg);
    }

    .control-button i {
      font-size: 0.6rem;
    }
  }
}

</style>
<style scoped>
.detail-controls {
  display: flex;
  justify-content: flex-end;
}
/* 控制按钮样式 */
.control-button {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: var(--color-text);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.control-button:hover {
  background: var(--color-background-mute);
}

.control-button:hover {
  background: var(--color-background-soft);
}

.control-button i {
  font-size: 1rem;
  height: 1rem;
}
</style>

<style scoped>
.detail-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding: 0 1rem;
}

.tool-buttons {
  display: flex;
}

.tool-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--color-text-light);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.tool-button i,
.filter-toggle i {
  font-size: 1rem;
}

.tool-button:hover {
  background: var(--color-background-highlight);
  color: var(--color-text);
}

.tool-button.active {
  background: var(--color-background-highlight);
  color: var(--color-primary);
}

.filter-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  border: none;
  background: none;
  color: var(--color-text-light);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.filter-toggle:hover {
  background: var(--color-background-highlight);
}

.filter-toggle.active {
  color: var(--color-primary);
}

.detail-content {
  position: relative;
  height: calc(100% - var(--toolbar-height));
  transition: height 0.2s ease;
}

.detail-content.with-filter {
  height: calc(100% - var(--toolbar-height) - var(--filter-height));
}

.filter-dropdown {
  height: var(--filter-height);
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  overflow-y: auto;
}

/* 淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

:root {
  --toolbar-height: 3rem;
  --filter-height: 120px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .detail-toolbar {
    padding: 0.5rem;
    overflow-x: auto;
  }
  
  :root {
    --filter-height: 160px;
  }
}
</style>