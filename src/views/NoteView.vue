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

    <div class="note-list">
      <div v-for="note in displayNotes" :key="note.id">
        <template v-if="note.displayType === 'document'">
          <div class="note-item"
            @click="handleFileOpen(note)">
            <div class="note-icon">📄</div>
            <div class="note-info">
              <span class="note-name">{{ note.title }}</span>
              <div class="note-tags" v-if="note.tags">
                <span v-for="tag in note.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { notes } from '@/constants/entities';
import { ModalManager } from '@/utils/ModalManager';
import { computed, ref, h } from 'vue';
import { useCharacterDetailStore } from '@/stores/characterDetail'
import MarkdownPreview from '@/components/MarkdownPreview.vue'
import { getStaticPath } from '@/utils/assets'
import { openEntityPreviewModal } from '@/utils/modalHelper';

const store = useCharacterDetailStore()

// const tabs = ['all', 'character', 'settings'];
const tabs = [
  { icon:'fi fi-rr-border-all', value:'all' }, 
  { icon:'fi fi-rr-graphic-style', value:'gallery' },
  { icon:'fi fi-rr-features', value:'document' },
]
const currentTab = ref('all');

const displayNotes = computed(() => {
    return currentTab.value === 'all' ? notes 
      : notes.filter(note => note.displayType == currentTab.value)
})

const isMobile = computed(() => window.innerWidth <= 768)
const handleFileOpen = (file) => {
  openEntityPreviewModal(file)
}
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
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.note-item {
  max-width: 360px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: var(--color-background-light);
  border-radius: 4px;
  cursor: pointer;
}

.note-item:hover {
  background: var(--color-background-mute);
}

.note-icon {
  font-size: 1.25rem;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  border-radius: 4px;
}

.note-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 1rem;
  border-left: 1px solid var(--color-background-mute);
}

.note-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.note-meta {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--color-background-mute);
  color: var(--color-text-light);
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
</style>