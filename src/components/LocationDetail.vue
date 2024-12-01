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
        <p>点击地图上的标记查看详细信息</p>
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
      console.log(locationPoints.value)
      selectedPoint.value = null
    }
  },
  { immediate: true }
)

const openLocationModal = (point: LocationPoint) => {
  selectedPoint.value = point
  
  ModalManager.getInstance().create(`location-point-${point.name}`, {
    title: point.name,
    entityId: currentMap.value?.id,
    entityType: CONTENT_TYPES.LOCATION,
    content: h('div', { 
      class: 'location-point-content' 
    }, [
      h('p', point.description)
      // 这里可以添加更多内容
    ]),
    props: {
      minWidth: 200,
      initialWidth: 800,
      initialHeight: 600,
      initialPosition: { 
        x: 0.6, 
        y: 0.3
      }
    }
  })
  
  ModalManager.getInstance().activateModal(`location-point-${point.name}`)
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
  background: #f5f5f5;
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
  background-color: #e74c3c;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.3);
  transition: all 0.3s ease;
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background-color: rgba(231, 76, 60, 0.4);
  border-radius: 50%;
  opacity: 0;
  animation: pulse 2s infinite;
}

.map-marker:hover .marker-dot,
.map-marker.active .marker-dot {
  background-color: #c0392b;
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
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.location-details {
  h2 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  padding: 8px 16px;
  background-color: white;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #f5f5f5;
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