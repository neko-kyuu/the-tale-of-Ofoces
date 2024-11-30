<template>
  <div class="character-view">
    <div 
      class="view-container"
      :class="{
        'detail-open': store.currentChar,
        'detail-open--mobile': store.currentChar && isMobile
      }"
    >
      <!-- 视图切换按钮 -->
      <div class="view-mode">
        <button 
          class="view-button"
          :class="{ active: currentView === 'network' }"
          @click="switchView('network')"
          title="关系图"
        >
        </button>
        <button 
          class="view-button"
          :class="{ active: currentView === 'list' }"
          @click="switchView('list')"
          title="列表视图"
        >
        </button>
      </div>
    
        <!-- 视图内容 -->
      <div class="view-content">
        <NetworkView v-if="currentView === 'network'" />
        <ListView v-else />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { Network } from 'vis-network'
import {  characters } from '@/constants/entities'
import { RACES, REALMS } from '@/constants/types'
import { useCharacterDetailStore } from '@/stores/characterDetail'
import { getStaticPath } from '@/utils/assets'
import NetworkView from '@/components/NetworkView.vue'
import ListView from '@/components/ListView.vue'

const currentView = ref('network')

const switchView = (view: 'network' | 'list') => {
  currentView.value = view
}

const store = useCharacterDetailStore()

const showCharacterDetail = (char) => {
  store.showCharacter(char)
}
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
.view-mode {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
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

.view-content {
  height: 100%;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .view-mode {
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>
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

/* 确保主内容区域在详情打开时不被遮挡 */
.character-view {
  position: relative;
  height: 100%;
}

</style> 