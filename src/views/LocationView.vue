<template>
  <div class="locations-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>Interactive Maps</h1>
      <p class="subtitle">
        由学者、测绘师公会、制图师公会和贤者们精心研究绘制的地图集
      </p>
    </div>

    <!-- 地图列表 -->
    <Transition name="fade" mode="out-in">
      <div v-if="!selectedMapId" class="location-list-container">
        <div class="location-grid">
          <div 
            v-for="location in locations" 
            :key="location.id" 
            class="location-card" 
            @click="navigateToMap(location.id)"
          >
            <div class="location-image">
              <img :src="location.path" :alt="location.title">
              <div class="location-overlay">
                <span class="view-text">查看详情</span>
              </div>
            </div>
            <div class="location-info">
              <p>{{ location.title }} <span v-if="location.description">· {{ location.description }}</span></p>
              <div class="location-meta">
                <span class="last-updated">最后更新: {{ location.finishedDate }}</span>
              </div>
            </div>

            <!-- 关联实体滑窗 -->
            <RelatedPanel
                :entity-id="location.id"
                :entity-type="CONTENT_TYPES.LOCATION"
                @click.stop
                @select-character="handleCharacterSelect"
                @open-file="handleFileOpen"
                :style="panelStyle"
            />
          </div>
        </div>
      </div>

      <LocationDetail 
        v-else 
        :locationId="selectedMapId" 
        @back="selectedMapId = null"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import LocationDetail from '@/components/LocationDetail.vue'
import RelatedPanel from '@/components/RelatedPanel.vue'
import { CONTENT_TYPES } from '@/constants/types';
import { locations } from '@/constants/entities';
import { useCharacterDetailStore } from '@/stores/characterDetail'
import { ModalManager } from '@/utils/ModalManager'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { getStaticPath } from '@/utils/assets'

const panelStyle = computed(() => ({
  right: '-1rem', 
  zIndex: 1000
}))

const store = useCharacterDetailStore()

interface MapItem {
  id: number
  type: CONTENT_TYPES.LOCATION
  title: string
  description: string
  finishedDate: string
  path: string
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

const selectedMapId = ref<number | null>(null)

const navigateToMap = (locationId: number) => {
  selectedMapId.value = locationId
}
const isMobile = computed(() => window.innerWidth <= 768)

const handleCharacterSelect = (char) => {
  store.showCharacter(char)
}

const handleFileOpen = (file) => {
  if (isMobile.value) {
    store.showFile(file)
  } else {
    ModalManager.getInstance().create(`${file.type}-${file.id}`, {
      title: file.title,
      entityId: file.id,
      entityType: file.type,
      content: h(MarkdownPreview, { filePath: getStaticPath(file.path) }),
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
    ModalManager.getInstance().activateModal(`${file.type}-${file.id}`)
  }
}
</script>

<style scoped>
.locations-view {
  position: relative;
  min-height: 100vh;
}

.page-header {
  height: 200px;
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('/path-to-your-header-image.jpg') center/cover;
  color: white;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.location-list-container {
  margin: 2rem auto 0;
  padding: 2rem;
  max-width: 1400px;
}

.location-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

.location-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(var(--color-background-soft-rgb), 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
}

.location-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(var(--color-background-soft-rgb), 0.2);
}

.location-image {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.location-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.location-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--color-background-soft-rgb), 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.location-card:hover .location-overlay {
  opacity: 1;
}

.location-card:hover .location-image img {
  transform: scale(1.05);
}

.view-text {
  color: var(--color-background-mute);
  font-size: 1rem;
  padding: 8px 16px;
  border: 2px solid var(--color-background-mute);
  border-radius: 4px;
}

.location-info{
  background: var(--color-background-soft);
  padding:0 1rem;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.location-info p {
  color: var(--color-text);
  font-size: 0.8rem;
  padding: 0.5rem 0;
}

.location-meta {
  font-size: 0.8rem;
  color: var(--color-text);
  border-top: 1px solid var(--color-background-mute);
  padding: 0.5rem 0;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 