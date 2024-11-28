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
        <div class="detail-content">
            <ContentFilter 
              :current-tool="currentTool"
              @filter-change="handleFilterChange"
              @search-change="handleSearchChange"
            />
            <ContentArea
              :current-tool="currentTool"
              :character-id="currentChar.id"
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

import ContentFilter from '@/components/ContentFilter.vue'
import ContentArea from '@/components/ContentArea.vue'

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
      title: file.name,
      content: h(MarkdownPreview, { filePath: file.path }),
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
  { id: 'images', label: '图片', icon: 'fi fi-rr-picture' },
  { id: 'documents', label: '文档', icon: 'fi fi-rr-document' },
  { id: 'events', label: '事件', icon: 'fi fi-rr-calendar' },
  { id: 'footprints', label: '足迹', icon: 'fi fi-rr-map-marker' },
  { id: 'media', label: '音媒', icon: 'fi fi-rr-play' },
  { id: 'notes', label: '备忘录', icon: 'fi fi-rr-notebook' }
]

// 当前选中的工具
const currentTool = ref('overview')

// 切换工具
const switchTool = (toolId: string) => {
  currentTool.value = toolId
}

// 处理筛选变化
const handleFilterChange = (filters: any) => {
  // 处理筛选逻辑
  console.log('Filters changed:', filters)
}

// 处理搜索变化
const handleSearchChange = (query: string) => {
  // 处理搜索逻辑
  console.log('Search query:', query)
}
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
  opacity: 1;
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
  max-width: 800px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  transition-delay: 0.1s;
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
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  width: 100%;
  padding: 0 1rem;
}

.tool-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  color: var(--color-text-light);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.tool-button:hover {
  background: var(--color-background-highlight);
  color: var(--color-text);
}

.tool-button.active {
  background: var(--color-background-highlight);
  color: var(--color-primary);
}

.tool-button i {
  font-size: 1rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .detail-toolbar {
    padding: 0.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>