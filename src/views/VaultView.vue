<template>
  <div class="note-container">
    <div class="header">
      <h2>切姆斯比恩斯的回响</h2>
      <div class="note-head-bar">
        <div class="tabs">
            <span class="tab" 
                v-for="tab in tabs" 
                :key="tab.value"
                :class="{ active: currentTab === tab.value }"
                @click="currentTab = tab.value">
                <i :class="tab.icon"></i>
            <div class="tab-line" v-show="currentTab === tab.value"></div>
            </span>
        </div>
        <div class="note-count">
            {{ displayNotes.length }}
        </div>
      </div>
    </div>

    <div class="note-list" :class="{ 
      'two-columns': currentTab === 'all',
      'gallery-grid': currentTab === 'gallery' 
    }">
      <template v-if="currentTab === 'all'">
        <div class="column">
          <div v-for="doc in documents" :key="doc.id">
            <DocumentItem 
              :item="doc"
              icon="📄"
              @click="handleFileOpen"
            />
          </div>
        </div>
        <div class="column">
          <div v-for="note in normalNotes" :key="note.id">
            <DocumentItem 
              :item="note"
              icon="📄"
              @click="handleFileOpen"
            />
          </div>
          <div class="gallery-grid-small">
            <div v-for="note in galleryNotes" :key="note.id" class="gallery-item">
              <img 
                :src="getStaticPath(note.path)" 
                alt="图片"
                @click="handleImageClick(note.path)"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="currentTab === 'gallery'">
        <div v-for="note in displayNotes" :key="note.id" class="gallery-item">
          <img 
            :src="getStaticPath(note.path)" 
            alt="图片"
            @click="handleImageClick(note.path)"
          />
        </div>
      </template>
      <template v-else>
        <div v-for="note in displayNotes" :key="note.id">
          <DocumentItem 
            :item="note"
            icon="📄"
            @click="handleFileOpen"
          />
        </div>
      </template>
    </div>

    <ImagePreview
      v-model="showPreview"
      :image-src="previewImage"
      alt="图片预览"
      :enable-navigation="true"
      :on-previous="canNavigatePrevious ? handlePrevious : undefined"
      :on-next="canNavigateNext ? handleNext : undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { documents, notes } from '@/constants/entities';
import { computed, ref } from 'vue';
import { openEntityPreviewModal } from '@/utils/modalHelper';
import DocumentItem from '@/widgets/DocumentItem.vue'
import ImagePreview from '@/widgets/ImagePreview.vue';
import { getStaticPath } from '@/utils/assets';


const tabs = [
  { icon:'fi fi-rr-border-all', value:'all' }, 
  { icon:'fi fi-rr-file-medical', value:'md' },
  { icon:'fi fi-rr-graphic-style', value:'gallery' },
  { icon:'fi fi-rr-features', value:'document' },
]
const currentTab = ref('all');

const displayNotes = computed(() => {
    if (currentTab.value === 'md') {
        return documents;
    }
    
    if (currentTab.value === 'gallery' || currentTab.value === 'document') {
        return notes.filter(note => note.displayType === currentTab.value);
    }
    
    return [...documents, ...notes];
})

const handleFileOpen = (file) => {
  openEntityPreviewModal(file)
}

const showPreview = ref(false);
const previewImage = ref('');
const currentImageIndex = ref(0);

const currentGalleryItems = computed(() => {
  return currentTab.value === 'all' ? galleryNotes.value : displayNotes.value;
});

const canNavigatePrevious = computed(() => currentImageIndex.value > 0);

const canNavigateNext = computed(() => {
  return currentImageIndex.value < currentGalleryItems.value.length - 1;
});

const navigateToImage = (index: number) => {
  currentImageIndex.value = index;
  previewImage.value = currentGalleryItems.value[index].path;
};

const handleImageClick = (imagePath: string) => {
  const index = currentGalleryItems.value.findIndex(note => note.path === imagePath);
  navigateToImage(index);
  showPreview.value = true;
};

const handlePrevious = () => {
  if (canNavigatePrevious.value) {
    navigateToImage(currentImageIndex.value - 1);
  }
};

const handleNext = () => {
  if (canNavigateNext.value) {
    navigateToImage(currentImageIndex.value + 1);
  }
};

const normalNotes = computed(() => {
  return notes.filter(note => note.displayType !== 'gallery');
});

const galleryNotes = computed(() => {
  return notes.filter(note => note.displayType === 'gallery');
});
</script>

<style scoped>
.note-container {
  position: relative;
  height: 100%;
  padding: 3rem 80px;
  color: var(--color-text);
}
.note-head-bar {
  display: flex;
  gap: 3rem;
  margin-top: 1rem;
  align-items: center;
}

.tabs {
  display: flex;
  position: relative;
}

.tab {
  cursor: pointer;
  padding: 5px 10px;
  position: relative;
  color: var(--color-text-light);
  transition: color 0.3s ease;
}

.tab.active {
  color: var(--color-text);
}

.tab-line {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-background-highlight);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.note-list {
  max-width: 360px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.note-list.two-columns {
  flex-direction: row;
  max-width: 800px;
  gap: 2rem;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.note-count {
  color: var(--color-text);
  font-size: 0.85rem;
  background: var(--color-background-highlight);
  min-width: 1rem;
  border-radius: 4px;
  text-align: center;
  line-height: 1rem;
  padding: 0 3px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  max-width: 600px;
  margin-top: 1rem;
}

.gallery-item {
  aspect-ratio: 1;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item img:hover {
  transform: scale(1.05);
}

.gallery-grid-small {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  max-width: 350px;
  margin-top: 1rem;
}
</style>