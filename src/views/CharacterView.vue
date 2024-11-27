<template>
  <div class="character-view">
    <div 
      class="view-container"
      :class="{
        'detail-open': store.currentChar,
        'detail-open--mobile': store.currentChar && isMobile
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
                      <img :src="char.path" :alt="char.name">
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

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Network } from 'vis-network'
import { realms, races, characters, edges } from '@/constants/entities'
import { useCharacterDetailStore } from '@/stores/characterDetail'

const store = useCharacterDetailStore()

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

const showCharacterDetail = (char) => {
  store.showCharacter(char)
}

const route = useRoute()
const viewMode = computed(() => route.params.mode)
let network = null

// 准备节点和边的数据
const nodes = characters.map(char => ({
  id: char.id,
  label: char.name,
  image: char.path,
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
</style> 