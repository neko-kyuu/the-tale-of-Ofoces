<template>
  <div class="home-container">
    <!-- 轮播图部分 -->
    <div class="carousel-container">
      <Transition name="fade" mode="out-in">
        <div 
          :key="currentImageIndex" 
          class="carousel-slide"
          :style="{ backgroundImage: `url('${getStaticPath(images[currentImageIndex])}')` }"
          @error="handleImageError"
        >
          <div class="carousel-overlay">
            <!--  -->
          </div>
        </div>
      </Transition>
      
      <!-- 轮播图控制按钮 -->
      <div class="carousel-controls">
        <button @click="prevImage" class="carousel-btn">&lt;</button>
        <div class="carousel-indicators">
          <span 
            v-for="(_, index) in images" 
            :key="index"
            :class="['indicator', { active: index === currentImageIndex }]"
            @click="currentImageIndex = index"
          ></span>
        </div>
        <button @click="nextImage" class="carousel-btn">&gt;</button>
      </div>
    </div>

    <!-- 统计信息部分 -->
    <div class="stats-container">
      <div class="stat-item">
        <span class="stat-number">{{ characterCount }} · 
            <i class="fi fi-sr-following"></i></span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ imageCount }} ·
            <i class="fi fi-rr-graphic-style"></i></span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ documentCount }} ·
            <i class="fi fi-rr-features"></i></span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ eventCount }} ·
            <i class="fi fi-br-calendar-day"></i></span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ locationCount }} ·
            <i class="fi fi-rr-map-marker"></i></span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ mediaCount }} ·
            <i class="fi fi-rr-play"></i></span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ noteCount }} ·
            <i class="fi fi-rr-notebook"></i></span>
      </div> 
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { characters, gallerys, documents, events, ebooks, locations, medias, notes } from '@/constants/entities'
import { getStaticPath } from '@/utils/assets'

// 示例图片数组，你需要替换为实际的图片路径
const images = [
  '/static/gallery/2023-11-22 213826.png'
]

const currentImageIndex = ref(0)
const autoPlayInterval = ref<number | null>(null)

// 统计数量
const characterCount = characters.length
const imageCount = gallerys.length
const documentCount = documents.length
const eventCount = events.length
const ebookCount = ebooks.length
const locationCount = locations.length
const mediaCount = medias.length
const noteCount = notes.length

// 轮播控制函数
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length
}

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0 
    ? images.length - 1 
    : currentImageIndex.value - 1
}

// 自动播放
const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(nextImage, 5000) as unknown as number
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
}

// 添加错误处理函数
const handleImageError = (e: Event) => {
  console.error('Image loading error:', (e.target as HTMLImageElement).src)
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.carousel-container {
  position: relative;
  height: 92vh;
  overflow: hidden;
}

.carousel-slide {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-overlay h1 {
  color: white;
  font-size: 3rem;
}

.carousel-controls {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.carousel-btn {
  visibility: hidden;
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}
.carousel-container:hover .carousel-btn{
  visibility: visible;
  transition: all 0.2s ease;
}

.carousel-indicators {
  display: flex;
  gap: 10px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-background-mute);
  cursor: pointer;
  visibility: hidden;
  transition: all 0.2s ease;
}

.indicator.active {
  background: var(--color-background-highlight);
}
.carousel-container:hover .indicator{
  visibility: visible;
  transition: all 0.2s ease;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.25rem;
  /* font-weight: bold; */
  color: var(--color-text);
}

/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>