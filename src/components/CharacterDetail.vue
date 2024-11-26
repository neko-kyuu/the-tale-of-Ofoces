<template>
    <Teleport to="body">
      <div 
        v-if="store.currentChar"
        class="character-detail"
        :class="{ 
          'character-detail--open': store.currentChar,
        }"
      >
        <!-- 原有的详情内容 -->
        <div class="detail-header">
            <div class="character-info">
            <div class="character-meta">
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
            <div class="content-area">
                <div class="related-characters">
                    <div 
                        v-for="relation in getRelatedCharacters(currentChar.id)" 
                        :key="relation.to"
                        class="relation-item"
                        @click="showCharacterDetail(getCharacterById(relation.to))"
                    >
                        <img 
                        :src="getCharacterById(relation.to).avatar" 
                        :alt="getCharacterById(relation.to).name"
                        class="relation-avatar"
                        >
                        <div class="relation-tooltip">
                        <div class="relation-label">{{ getCharacterById(relation.to).name }} · {{ relation.label }}</div>
                        </div>
                    </div>
                </div>
                <div class="artifacts-section">
                <div class="artifacts-list">
                    <div 
                    v-for="file in getCharacterFiles(currentChar.id)" 
                    :key="file.id"
                    class="artifact-item"
                    @click="openFile(file)"
                    >
                    <div class="artifact-icon">📄</div>
                    <div class="artifact-info">
                        <span class="artifact-name">{{ file.name }}</span>
                    </div>
                    </div>
                    <div v-if="!getCharacterFiles(currentChar.id).length" class="empty-state">
                    暂无相关文件
                    </div>
                </div>
                </div>
            </div>
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
            <h2 class="file-title">{{ currentFile.name }}</h2>
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
import { mdFiles } from '@/constants/mdFiles'
import { edges, characters } from '@/constants/characters'
import ContentFilter from '@/components/ContentFilter.vue'

const store = useCharacterDetailStore()
const isMobile = ref(false)

const currentFile = ref(null)

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
  
  // 获取关联角色
const getRelatedCharacters = (characterId) => {
  return edges.filter(edge => edge.from === characterId)
}

// 根据ID获取角色信息
const getCharacterById = (id) => {
  return characters.find(char => char.id === id)
}

const showCharacterDetail = (char) => {
  store.showCharacter(char)
}

const closeCharacterDetail = () => {
  store.hideCharacter()
}

// 返回角色详情
const backToCharacter = () => {
  currentFile.value = null
}

// 关闭所有窗口
const closeAllDetails = () => {
  currentFile.value = null
  store.hideCharacter()
}

// 获取角色相关文件
const getCharacterFiles = (characterId) => {
  return mdFiles
    .filter(file => file.property.includes(characterId))
    .map(file => ({
      id: file.id,
      name: file.path.split('/').pop().replace('.md', ''), // 从路径中提取文件名
      path: file.path,
    }))
}

// 打开文件
const openFile = (file) => {
  if (isMobile.value) {
    currentFile.value = file
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
.character-detail {
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

.character-detail--open {
  right: 1rem;
  opacity: 1;
  transform: translateX(0);
}

/* 移动端样式 */
@media (max-width: 768px) {
  .character-detail {
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

  .character-detail--open {
    transform: translateY(0);
    right: 0;
  }

  .character-detail::before {
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

.character-detail--open .detail-content {
  opacity: 1;
  transform: translateY(0);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 1rem;
}

.character-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.character-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.artifacts-section {
  padding: 1.5rem;
}

.artifacts-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.artifacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.artifact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: var(--color-background-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}

.artifact-item:hover {
  background: var(--color-background-mute);
}

.artifact-icon {
  font-size: 1.25rem;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  background: var(--color-background);
}

.artifact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.artifact-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.artifact-meta {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
  font-size: 0.875rem;
  font-style: italic;
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
    top: 0;
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
    padding-top: 1rem; /* 适应移动端 */
  }

  .file-controls {
    margin-bottom: 0.75rem;
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
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.control-button:hover {
  background: var(--color-background-mute);
}
.control-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
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
.related-characters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.relation-item {
  position: relative;
  cursor: pointer;
}

.relation-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-background-soft);
  transition: all 0.2s ease;
}

.relation-item:hover .relation-avatar {
  transform: scale(1.1);
  border-color: var(--color-background-highlight);
}

.relation-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.relation-item:hover .relation-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.relation-label {
  color: var(--color-text-light);
  font-size: 0.7rem;
}

/* 添加小箭头 */
.relation-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-border);
}

.relation-tooltip::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-background);
  z-index: 1;
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