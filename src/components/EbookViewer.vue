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
      <button @click="prevPage" :disabled="currentIndex <= 0">
        <i class="ri-arrow-left-line"></i>
      </button>
      
      <div class="page-info">
        {{ currentIndex + 1 }} / {{ totalPages }}
      </div>
      
      <button @click="nextPage" :disabled="currentIndex >= totalPages - 1">
        <i class="ri-arrow-right-line"></i>
      </button>
    </div>
    
    <!-- 关联文档 -->
    <div class="related-docs" v-if="relatedDocs.length">
      <h3>关联文档</h3>
      <div class="doc-list">
        <div 
          v-for="doc in relatedDocs" 
          :key="doc.id"
          class="doc-item"
          @click="openDoc(doc)"
        >
          <i class="ri-file-text-line"></i>
          {{ doc.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getStaticPath, getAssetUrl } from '@/utils/assets'

const props = defineProps<{
  images: Array<{
    id: string
    path: string
    title: string
  }>
  relatedDocs: Array<{
    id: string
    path: string
    title: string
  }>
}>()

const emit = defineEmits<{
  (e: 'open-doc', doc: any): void
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

const openDoc = (doc: any) => {
  emit('open-doc', doc)
}
</script>

<style scoped>
.ebook-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-background-soft);
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
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
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
  padding: 1rem;
  background: var(--color-background);
  border-radius: 8px;
}

.doc-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
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
}

.doc-item:hover {
  background: var(--color-background-mute);
  transform: translateY(-1px);
}
</style> 