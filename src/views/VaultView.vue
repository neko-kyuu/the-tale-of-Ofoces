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

    <div class="note-list" :class="{ 'two-columns': currentTab === 'all' }">
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
          <div v-for="note in notes" :key="note.id">
            <DocumentItem 
              :item="note"
              icon="📄"
              @click="handleFileOpen"
            />
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { documents, notes } from '@/constants/entities';
import { computed, ref } from 'vue';
import { openEntityPreviewModal } from '@/utils/modalHelper';
import DocumentItem from '@/components/DocumentItem.vue'


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
</style>