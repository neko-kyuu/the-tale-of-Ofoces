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
          v-for="point in points" 
          :key="point.id"
          class="map-marker"
          :class="[
            `marker-${point.pointType}`,
            { active: selectedPoint?.id  === point.id  }
          ]"
          :style="{ 
            left: `${point.coordinates[0]}%`, 
            top: `${point.coordinates[1]}%` 
          }"
          @click.stop="openLocationModal(point)"
        >
          <div class="marker-wrapper"
            :style="{
              background: `url(${getStaticPath('/static/icon/marker-background.svg')}) center/contain no-repeat`
            }"
          >
            <img 
              :src="getStaticPath(`/static/icon/${point.pointType}-marker.png`)" 
              :alt="point.title"
              class="marker-icon"
            >
          </div>
          <div class="marker-label">{{ point.title }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧信息面板 -->
    <div class="location-panel">
      <!-- todo -->
       todo
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { locations, locationPoints } from '@/constants/entities';
import { openEntityPreviewModal } from '@/utils/modalHelper';
import type { Location, LocationPoint } from '@/types/entities';
import { getStaticPath } from '@/utils/assets'

// 定义 props
const props = defineProps<{
  locationId: number
}>()

// 定义 emits
defineEmits<{
  (e: 'back'): void
}>()

const currentMap = ref<Location | null>(null)
const points = ref<LocationPoint[]>([])
const selectedPoint = ref<LocationPoint | null>(null)

watch(
  () => props.locationId,
  (newId) => {
    if (newId) {
      currentMap.value = locations.find(location=> location.id == newId ) || null
      points.value = locationPoints.filter(point => point.parentId == newId) 
      selectedPoint.value = null
    }
  },
  { immediate: true }
)

const openLocationModal = (point: LocationPoint) => {
  selectedPoint.value = point
  
  openEntityPreviewModal(point, {
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

.marker-wrapper {
  position: relative;
  width: 2rem;
  height: 2rem;
}

.marker-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  transition: transform 0.3s ease;
}

/* 悬停和激活状态 */
.map-marker:hover .marker-wrapper,
.map-marker.active .marker-wrapper {
  transform: scale(1.2);
}

.marker-label {
  position: absolute;
  top: 0;
  left: -100%;
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