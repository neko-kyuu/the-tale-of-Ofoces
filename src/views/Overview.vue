<template>
  <div class="character-view">
    <div 
      class="view-container"
      :class="{
        'detail-open': store.currentChar,
        'detail-open--mobile': store.currentChar && isMobile
      }"
    >
      <div class="split-view">
        <div class="list-panel">
          <ListView />
        </div>
        <div class="right-panel">
          <div class="panel-toolbar">
            
          </div>
          <div class="upper-container">
          </div>
          <div class="panel-divider"></div>
          <div class="panel-toolbar">
            <button class="nav-link" title="关系图">
              <i class="fi fi-ss-chart-network"></i>
            </button>
          </div>
          <div class="lower-container">
            <NetworkView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCharacterDetailStore } from '@/stores/characterDetail'
import NetworkView from '@/components/NetworkView.vue'
import ListView from '@/components/ListView.vue'

const store = useCharacterDetailStore()
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
.split-view {
  display: flex;
  height: 100%;
  padding: 1rem;
}

.list-panel {
  width: calc(100% - 400px);
}

.right-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
}

.upper-container {
  height: 33.33%; 
  min-height: 100px; 
  padding: 1rem;
}
.panel-toolbar {
  height: 40px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0;
}

.lower-container {
  height: 66.67%; 
  flex-grow: 1; 
  position: relative; 
  padding: 1rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .split-view {
    flex-direction: column;
  }
  
  .list-panel{
    flex: none;
    width: 100%;
  }

  .right-panel {
    display: none;
  }
}

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

.nav-link {
  width: auto;
  padding: 0.25rem 0.35rem;
  background-color: var(--color-background-soft);
  font-weight: bold;
  box-shadow: inset 0 -2px var(--color-background-mute);
  transform: translateY(2px);
  border: 1px solid var(--color-background-highlight);
  color: var(--color-background-highlight);
  text-align: center;
  display: block;
  text-decoration: none;
  border-radius: var(--vt-rem-2);
  cursor: pointer;
  transition: opacity 0.2s;
}
</style> 