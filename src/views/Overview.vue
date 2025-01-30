<template>
  <div class="over-view">
    <div 
      class="view-container"
      :class="{
        'detail-open': store.currentChar,
        'detail-open--mobile': store.currentChar && isMobile
      }"
    >
      <div class="split-view">
        <div class="list-panel">
          <div class="panel-header">
            <div class="nav-buttons">

            </div>
            <div class="title">OC Studio</div>
            <div class="action-buttons">
              <button class="nav-button">
                <i class="fi fi-sr-thumbtack"></i>
              </button>
              <button class="nav-button" 
                      @mouseenter="showTooltip = true"
                      @mouseleave="showTooltip = false"
                      ref="infoButton">
                <i class="fi fi-rr-menu-dots"></i>
                <div class="tooltip" v-show="showTooltip">
                  version: 2.1.1 <br>
                  last-edited: 2024-10-12
                </div>
              </button>
            </div>
          </div>
          <ListView />
        </div>
        <div class="right-panel">
          <div class="upper-container">
            <div class="reading-list">
              <div class="list-header">
                <h3>规则书</h3>
              </div>
              <div class="book-list">
                <div class="book-item" 
                     v-for="book in books" 
                     :key="book.id"
                     @click="handleBookClick(book)">
                  <span class="book-title">{{ book.title }}</span>
                  <button class="more-button" @click.stop>
                    <i class="fi fi-rs-arrow-up-right-from-square"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-divider"></div>
          <div class="panel-toolbar">
            <button class="adaptive-shadow-button" title="关系图">
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
import { openEntityPreviewModal } from '@/utils/modalHelper'
import { Note } from '@/types/entities'

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

type Book = Partial<Note> & { url?: string }

const books: Book[] = [
  { 
    id: 1, 
    title: "5e chm",
    url: "https://5echm.kagangtuya.top/"
  }
]

const handleBookClick = (book: Book) => {
  if (book.url) {
    window.open(book.url, '_blank')
  } else if (book.path) {
    openEntityPreviewModal(book)
  }
}

const showTooltip = ref(false)
const infoButton = ref<HTMLElement | null>(null)
</script>

<style scoped>
.split-view {
  display: flex;
  height: 100%;
  padding: 1rem;
}

.list-panel {
  display: flex;
  flex-direction: column;
  width: calc(100% - 400px);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  overflow: hidden;
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
.over-view {
  position: relative;
  height: 100%;
}

.reading-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
}

.list-header h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  background: var(--color-background-soft);
  cursor: pointer;
}

.book-item:hover {
  background: var(--color-background-mute);
}

.book-title {
  font-size: 0.85rem;
  color: var(--color-text);
}

.more-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--color-text-light);
  opacity: 0.7;
  display: flex;
  align-items: center;
}

.more-button:hover {
  opacity: 1;
}

.panel-header {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
}

.nav-buttons, .action-buttons {
  display: flex;
  gap: 0.25rem;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text);
  margin: 0 1rem;
  font-weight: 600;
}

.nav-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  position: relative;
}

.tooltip {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  color: var(--color-text);
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  text-align: left;
}

.tooltip::before {
  content: '';
  position: absolute;
  top: -5px;
  right: 10px;
  width: 8px;
  height: 8px;
  background-color: var(--color-background-mute);
  border-left: 1px solid var(--color-border);
  border-top: 1px solid var(--color-border);
  transform: rotate(45deg);
}
</style> 