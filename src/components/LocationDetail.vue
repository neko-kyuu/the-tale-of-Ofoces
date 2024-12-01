<template>
  <div class="map-container">
    <button class="back-button" @click="$emit('back')">
      返回列表
    </button>
    
    <!-- 左侧地图区域 -->
    <div class="map-area">
      <div class="map-wrapper">
        <img 
          :src="currentMap?.path" 
          :alt="currentMap?.title"
          class="map-image"
        >
        <!-- 地图标记点 -->
        <div 
          v-for="point in locationPoints" 
          :key="point.name"
          class="map-marker"
          :class="{ active: selectedPoint?.name === point.name }"
          :style="{ 
            left: `${point.coordinates[0]}%`, 
            top: `${point.coordinates[1]}%` 
          }"
          @click.stop="openLocationModal(point)"
        >
          <div class="marker-dot"></div>
          <div class="marker-pulse"></div>
          <div class="marker-label">{{ point.name }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧信息面板 -->
    <div class="location-panel">
      <div v-if="selectedPoint" class="location-details">
        <h2>{{ selectedPoint.name }}</h2>
        <p>{{ selectedPoint.description }}</p>
      </div>
      <div v-else class="location-details">
        <h2>{{ currentMap?.title }}</h2>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { ModalManager } from '@/utils/ModalManager'
import { CONTENT_TYPES } from '@/constants/types'
import { ref, watch } from 'vue'
import { locations } from '@/constants/entities';
import { openEntityPreviewModal } from '@/utils/modalHelper';

// 定义 props
const props = defineProps<{
  locationId: number
}>()

// 定义 emits
defineEmits<{
  (e: 'back'): void
}>()

// 定义位置信息接口
interface LocationPoint {
  name: string
  description: string
  coordinates: [number, number]
}
// 定义地图信息接口
interface MapItem {
  id: number
  type: CONTENT_TYPES.LOCATION
  title: string
  description: string
  finishedDate: string
  path: string
  locations: LocationPoint[]
  references?: {
    characters?: number[] 
    documents?: number[]
    gallerys?: number[]
    ebooks?: number[]
    events?: number[]
    locations?: number[]
    medias?: number[]
    notes?: number[]
  }
}

const currentMap = ref<MapItem | null>(null)
const locationPoints = ref<LocationPoint[]>([])
const selectedPoint = ref<LocationPoint | null>(null)

watch(
  () => props.locationId,
  (newId) => {
    if (newId) {
      currentMap.value = locations.find(location=> location.id == newId ) || null
      locationPoints.value = currentMap.value?.locations || []
      selectedPoint.value = null
    }
  },
  { immediate: true }
)

const openLocationModal = (point: LocationPoint) => {
  selectedPoint.value = point
  
  let entity = {
    id: currentMap.value?.id,
    type: 'location-point',
    title: point.name,
    path: currentMap.value?.path
  }
  
  openEntityPreviewModal(entity, {
    props: {
      initialWidth: 200,
      initialHeight: 200,
      initialPosition: { x: point.coordinates[0]/100, y: point.coordinates[1]/100 }
    }
  })
}
</script>

<style scoped>
.map-container {
  display: flex;
  height: calc(100vh - 200px);
  width: 100%;
}

.map-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--color-background-soft);
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 标记点样式 */
.map-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background-color: var(--color-background-highlight);
  border: 2px solid var(--color-background-soft);
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(var(--color-background-highlight-rgb), 0.3);
  transition: all 0.3s ease;
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background-color: rgba(var(--color-background-highlight-rgb), 0.4);
  border-radius: 50%;
  opacity: 0;
  animation: pulse 2s infinite;
}

.marker-label {
  position: absolute;
  top: -100%;
  left: -300%;
  transform: translateX(-50%) translateY(5px);
  padding: 4px 8px;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 悬停和激活状态 */
.map-marker:hover .marker-label,
.map-marker.active .marker-label {
  opacity: 1;
}

.map-marker:hover .marker-dot,
.map-marker.active .marker-dot {
  background-color: var(--color-background-highlight);
  transform: scale(1.2);
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.location-panel {
  width: 300px;
  padding: 20px;
  background-color: var(--color-background-soft);
  overflow-y: auto;
}

.location-details {
  h2 {
    margin-bottom: 1rem;
    color: var(--color-text);
  }
  
  p {
    color: var(--color-text);
    line-height: 1.6;
  }
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  padding: 8px 16px;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-background-highlight);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: var(--color-background-mute);
  transform: translateY(-1px);
}

/* 可以添加一些模态框内容的样式 */
:deep(.location-point-content) {
  padding: 20px;
  
  p {
    line-height: 1.6;
    color: var(--color-text);
  }
}
</style>