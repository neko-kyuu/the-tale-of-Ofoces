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
        <div class="network-panel">
          <div class="network-upper">
          </div>
          <div class="network-divider"></div>
          <div class="network-toolbar">
            <!-- 这里放工具栏内容 -->
          </div>
          <div class="network-container">
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

.network-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
}

.network-upper {
  height: 33.33%; 
  min-height: 100px; 
  padding: 1rem;
}
.network-toolbar {
  height: 40px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.network-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0;
}

.network-container {
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

  .network-panel {
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

</style> 