<template>
  <div class="character-view">
    <div 
      class="view-container"
      :class="{
        'detail-open': currentChar,
        'detail-open--mobile': currentChar && isMobile
      }"
    >
      <div 
        class="character-list"
        :class="{ 'view-active': viewMode === 'list' }"
      >
      <div class="character-groups">
          <!-- 按 realm 分组 -->
          <div 
            v-for="realm in realms" 
            :key="realm.id"
            class="realm-group"
          >
            <h2 class="realm-title">{{ realm.name }}</h2>
            <div class="race-groups-container">
              <!-- 按 race 分组 -->
              <div 
                v-for="race in getRacesByRealm(realm.id)" 
                :key="`${realm.id}-${race.id}`"
                class="race-group"
                :class="{ 'inline-group': shouldBeInline(getCharactersByRealmAndRace(realm.id, race.id)) }"
              >
                <div class="race-name">{{ race.name }}</div>
                <div class="group-content">
                  <div 
                    v-for="char in getCharactersByRealmAndRace(realm.id, race.id)" 
                    :key="`${realm.id}-${race.id}-${char.id}`"
                    class="character-card"
                    @click="showCharacterDetail(char)"
                  >
                    <div class="card-image">
                      <img :src="char.avatar" :alt="char.name">
                    </div>
                    <div class="card-content">
                      <p class="card-title">{{ char.name }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        class="network-view"
        :class="{ 'view-active': viewMode === 'network' }"
      >
        <div id="network"></div>
      </div>
    </div>

    <!-- 角色详情窗口 -->
    <div 
      v-if="currentChar"
      class="character-detail"
      :class="{ 
        'character-detail--open': true,
      }"
    >
      <div class="detail-header">
        <div class="character-info">
          <div class="character-meta">
            <h2>{{ currentChar.name }}</h2>
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
          </div>
        </div>
        <div class="detail-controls">
          <button 
            class="control-button"
            @click="closeCharacterDetail"
            title="关闭"
          >
          <i class="fi fi-rr-circle-xmark"></i>
        </button>
        </div>
      </div>

      <div class="detail-content">
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

    <!-- 文件详情窗口 -->
    <div 
      v-if="currentFile"
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Network } from 'vis-network'
import { realms, races, characters, edges } from '@/constants/characters'
import { mdFiles } from '@/constants/mdFiles'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { ModalManager } from '@/utils/ModalManager'
import { h } from 'vue'

// 获取某个 realm 下的所有 races
const getRacesByRealm = (realmId) => {
  const realmCharacters = characters.filter(char => char.realm === realmId)
  const raceIds = [...new Set(realmCharacters.map(char => char.race))]
  return races.filter(race => raceIds.includes(race.id))
}

// 获取特定 realm 和 race 的角色
const getCharactersByRealmAndRace = (realmId, raceId) => {
  return characters.filter(char => char.realm === realmId && char.race === raceId)
}

// 判断是否应该内联显示（不足一行的情况）
const shouldBeInline = (chars) => {
  const CARD_WIDTH = 280 // 假设每个卡片宽度为 280px
  const CONTAINER_WIDTH = 1200 // 假设容器宽度为 1200px
  const cardsPerRow = Math.floor(CONTAINER_WIDTH / CARD_WIDTH)
  return chars.length <= cardsPerRow
}

const route = useRoute()
const viewMode = computed(() => route.params.mode)
let network = null
const selectedChar = ref(null)
const currentFile = ref(null)

// 准备节点和边的数据
const nodes = characters.map(char => ({
  id: char.id,
  label: char.name,
  image: char.avatar,
  shape: 'circularImage',
  size: 30,
}))

// 网络图配置
const options = {
  nodes: {
    borderWidth: 2,
    borderWidthSelected: 3,
    brokenImage: undefined,
    chosen: {
      node: (values, id, selected, hovering) => {
        if (hovering) {
          values.shadow = true;
          values.shadowColor = 'rgba(0,0,0,0.3)';
          values.shadowSize = 10;
          values.size = 35; // 悬浮时放大
        }
      }
    },
    font: { color: '#343434', size: 14 },
    shadow: { 
      enabled: false,
      size: 10,
      x: 0,
      y: 0
    },
    shapeProperties: {
      useBorderWithImage: true
    },
    transition: {
      duration: 200 // 动画过渡时间
    }
  },
  edges: {
    font: {
      size: 12,
      align: 'middle'
    },
    width: 2,
    shadow: { enabled: false },
    chosen: {
      edge: (values, id, selected, hovering) => {
        if (hovering) {
          values.shadow = true;
          values.shadowColor = 'rgba(0,0,0,0.2)';
          values.width = 4;
        }
      }
    },
    smooth: {
      type: 'continuous',
      roundness: 0.5
    },
    transition: {
      duration: 200
    }
  },
  physics: {
    enabled: false
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: true
  }
}

// 监听路由参数变化
watch(() => route.params.mode, (newMode) => {
  if (newMode === 'network') {
    nextTick(() => {
      initNetwork()
    })
  }
})

onMounted(() => {
  if (route.params.mode === 'network') {
    initNetwork()
  }
})

const initNetwork = () => {
  const container = document.getElementById('network')
  network = new Network(
    container,
    { nodes, edges },
    options
  )
  
  network.on('click', (params) => {
    if (params.nodes.length > 0) {
      const char = characters.find(c => c.id === params.nodes[0])
      if (char) showCharacterDetail(char)
    }
  })
}

onUnmounted(() => {
  if (network) {
    network.destroy()
    network = null
  }
})

const showCharacterDetail = (char) => {
  selectedChar.value = char
}

const closeCharacterDetail = () => {
  selectedChar.value = null
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

// 返回角色详情
const backToCharacter = () => {
  currentFile.value = null
}

// 关闭所有窗口
const closeAllDetails = () => {
  currentFile.value = null
  selectedChar.value = null
}

// 计算属性：当前显示的角色
const currentChar = computed({
  get: () => selectedChar.value,
  set: (newValue) => {
    selectedChar.value = newValue
  }
})

// 检测是否为移动设备
const isMobile = ref(false)

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

// 获取关联角色
const getRelatedCharacters = (characterId) => {
  return edges.filter(edge => edge.from === characterId)
}

// 根据ID获取角色信息
const getCharacterById = (id) => {
  return characters.find(char => char.id === id)
}
</script>

<style scoped>
.view-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 电脑端 - 详情打开时主内容区域缩小 */
.view-container.detail-open {
  width: calc(100% - 350px);
  margin-right: 350px;
}

/* 手机端 - 详情打开时主内容区域缩小 */
@media (max-width: 768px) {
  .view-container.detail-open--mobile {
    height: 50vh; /* 内容区域高度减半 */
    overflow: hidden; /* 防止内容溢出 */
  }

  .view-container.detail-open {
    width: 100%; /* 移动端不需要缩小宽度 */
    margin-right: 0;
  }
}

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
  padding: 2rem;
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
    padding: 1.5rem;
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

.character-list,
.network-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.view-active {
  opacity: 1;
  pointer-events: auto;
}

/* 调整列表视图的样式以适应新布局 */
.character-list {
  display: block;
  max-width: none;
  margin: 0;
  padding: 2rem;
  overflow-y: auto;
}

.character-groups {
  max-width: 1200px;
  margin: 0 auto;
}

.group-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.group-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.realm-group {
  margin-bottom: 2rem;
}

.realm-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.race-groups-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
}

.race-group {
  flex: 0 0 auto;
  min-width: 0;
}

.race-group.inline-group {
  flex: 0 1 auto;
}

.race-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.group-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  background: var(--color-background-highlight);
  padding: 0.5rem;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
}

.character-card {
  flex: 0 0 100px;
  max-width: 100px;
  min-width: 100px;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  cursor: pointer;
  background: var(--color-background-soft);
}

.card-image {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card-content {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 1rem;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-background-soft);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
  overflow: hidden;
}

/* 悬停效果 */
.character-card:hover .card-image {
  width: 100px;
  height: 100px;
  transform: translate(0, -20px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.character-card:hover .card-content {
  opacity: 1;
}

/* 内容样式 */
.character-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.race-name {
  background: var(--color-background-highlight);
  padding: 0.25rem 0.5rem;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
  max-width: 60px;
}

.card-title {
  font-size: 0.875rem;
  margin-top: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  opacity: 0.8;
}

/* 调整网络视图的样式 */
.network-view {
  height: calc(100vh - 2rem);
  border-radius: 8px;
  overflow: hidden;
}

#network {
  width: 100%;
  height: 100%;
}

/* 自定义节点悬浮效果 */
:deep(.vis-network .vis-node:hover) {
  transform: scale(1.1);
  transition: transform 0.2s;
}

/* 优化节点和边的过渡效果 */
:deep(.vis-network .vis-node) {
  transition: all 0.2s ease-in-out;
}

:deep(.vis-network .vis-edge) {
  transition: all 0.2s ease-in-out;
}

:deep(.vis-network .vis-node:hover) {
  transform: scale(1.1);
}

/* 添加连线悬浮效果 */
:deep(.vis-network .vis-edge:hover) {
  filter: brightness(1.2);
}

.detail-controls {
  display: flex;
  justify-content: flex-end;
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

.detail-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* 确保主内容区域在详情打开时不被遮挡 */
.character-view {
  position: relative;
  height: 100%;
}

.edit-input,
.edit-textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
}

.edit-textarea {
  min-height: 150px;
  resize: vertical;
}

.edit-controls {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.edit-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-soft);
  cursor: pointer;
}

.edit-button:hover {
  background: var(--color-background-mute);
}

.detail-description {
  margin-top: 1rem;
  line-height: 1.6;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
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