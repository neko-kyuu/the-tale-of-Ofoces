<template>
  <div class="ebook-container">
    <div class="ebook-viewer">
      <!-- 左页 -->
      <div 
        class="page left-page" 
        :class="{ 'turning': isTurning }"
        @click="prevPage"
      >
        <img 
          v-if="currentLeftPage" 
          :src="currentLeftPage.path" 
          :alt="currentLeftPage.title"
        >
      </div>
      
      <!-- 右页 -->
      <div 
        class="page right-page"
        :class="{ 'turning': isTurning }"
        @click="nextPage"
      >
        <img 
          v-if="currentRightPage" 
          :src="currentRightPage.path" 
          :alt="currentRightPage.title"
        >
      </div>
    </div>
    
    <!-- 控制栏 -->
    <div class="ebook-controls">
      <!-- 首页按钮 -->
      <button 
        @click="goToFirst" 
        :disabled="currentIndex <= 0"
        title="首页"
      >
        <i class="fi fi-rr-caret-left"></i>
      </button>
      
      <!-- 上一页按钮 -->
      <button 
        @click="prevPage" 
        :disabled="currentIndex <= 0"
        title="上一页"
      >
        <i class="fi fi-rr-angle-small-left"></i>
      </button>
      
      <div class="page-info">
        {{ currentIndex + 1 }} / {{ totalPages }}
      </div>
      
      <!-- 下一页按钮 -->
      <button 
        @click="nextPage" 
        :disabled="currentIndex >= totalPages - 1"
        title="下一页"
      >
        <i class="fi fi-rr-angle-small-right"></i>
      </button>
      
      <!-- 末页按钮 -->
      <button 
        @click="goToLast" 
        :disabled="currentIndex >= totalPages - 2"
        title="末页"
      >
        <i class="fi fi-rr-caret-right"></i>
      </button>
    </div>
    
     <!-- todo 后续再做currentBook -->
    <RelatedPanel
      :entity-id="1"
      :entity-type="'ebook'"
      @select-character="handleCharacterSelect"
      @open-file="handleFileOpen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import RelatedPanel from './RelatedPanel.vue'
import { getStaticPath, getAssetUrl } from '@/utils/assets'

const props = defineProps<{
  images: Array<{
    id: string
    path: string
    title: string
  }>
  
}>()

const emit = defineEmits<{
  (e: 'select-character', character: any): void
  (e: 'open-file', file: any): void
}>()

const currentIndex = ref(0)
const isTurning = ref(false)

const totalPages = computed(() => props.images.length)

const currentLeftPage = computed(() => {
  return props.images[currentIndex.value]
})

const currentRightPage = computed(() => {
  return props.images[currentIndex.value + 1]
})

const nextPage = () => {
  if (currentIndex.value < totalPages.value - 2) {
    isTurning.value = true
    setTimeout(() => {
      currentIndex.value += 2
      isTurning.value = false
    }, 300)
  }
}

const prevPage = () => {
  if (currentIndex.value > 0) {
    isTurning.value = true
    setTimeout(() => {
      currentIndex.value -= 2
      isTurning.value = false
    }, 300)
  }
}


// 添加跳转到首页方法
const goToFirst = () => {
  if (currentIndex.value > 0) {
    isTurning.value = true
    setTimeout(() => {
      currentIndex.value = 0
      isTurning.value = false
    }, 300)
  }
}

// 添加跳转到末页方法
const goToLast = () => {
  const lastPageIndex = totalPages.value - (totalPages.value % 2 === 0 ? 2 : 1)
  if (currentIndex.value < lastPageIndex) {
    isTurning.value = true
    setTimeout(() => {
      currentIndex.value = lastPageIndex
      isTurning.value = false
    }, 300)
  }
}

const handleCharacterSelect = (character: any) => {
  emit('select-character', character)
}

const handleFileOpen = (file: any) => {
  emit('open-file', file)
}
</script>

<style scoped>
.ebook-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ebook-viewer {
  flex: 1;
  display: flex;
  gap: 2px;
  background: var(--color-background-mute);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.page img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.page.turning {
  transform: scale(0.95);
}

.ebook-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.ebook-controls button {
  background: var(--color-background-mute);
  color: var(--color-text-light);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ebook-controls button:hover:not(:disabled) {
  background: var(--color-background-soft);
  color: var(--color-text);
}

.ebook-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.related-docs {
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
}

.docs-trigger {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--color-background);
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.docs-trigger:hover {
  background: var(--color-background-soft);
  color: var(--color-text);
  transform: scale(1.05);
}

.doc-list {
  position: absolute;
  right: 3rem;
  background: var(--color-background);
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateX(1rem);
  pointer-events: none;
  transition: all 0.3s ease;
  min-width: 200px;
}

.related-docs.expanded .doc-list {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.doc-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-background-soft);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  color: var(--color-text-light);
}

.doc-item:hover {
  background: var(--color-background-mute);
  color: var(--color-text);
  transform: translateX(-4px);
}

/* 添加动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(1rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(1rem);
  }
}
</style> 