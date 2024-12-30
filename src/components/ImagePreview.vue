<template>
  <div v-if="modelValue" class="image-modal" @click="closePreview">
    <div class="modal-content" @click.stop>
      <img 
        ref="preloadImage"
        :src="getStaticPath(imageSrc)" 
        @load="handlePreloadImageLoad"
        style="display: none;"
      >
      <img 
        v-if="isReady"
        :src="getStaticPath(imageSrc)" 
        :alt="alt" 
        :style="{ transform: `scale(${imageScale})` }"
        @wheel.prevent="handleWheel"
      >
      <button class="close-button" @click="closePreview">&times;</button>
      <template v-if="enableNavigation">
        <button 
          class="nav-button prev" 
          @click.stop="onPrevious"
          v-if="onPrevious"
        >
          <i class="fi fi-rr-angle-left"></i>
        </button>
        <button 
          class="nav-button next" 
          @click.stop="onNext"
          v-if="onNext"
        >
          <i class="fi fi-rr-angle-right"></i>
        </button>
      </template>
    </div>
    <div class="zoom-controls" @click.stop>
      <button @click="adjustScale(-0.1)">-</button>
      <span>{{ Math.round(imageScale * 100) }}%</span>
      <button @click="adjustScale(0.1)">+</button>
      <button @click="resetScale">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { getStaticPath } from '@/utils/assets';

const props = defineProps<{
  modelValue: boolean;
  imageSrc: string;
  alt?: string;
  defaultImage?: string;
  enableNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const imageScale = ref(1);
const preloadImage = ref<HTMLImageElement | null>(null);
const isReady = ref(false);

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    isReady.value = false;
    imageScale.value = 1;
  }
});

const calculateInitialScale = (img: HTMLImageElement) => {
  const viewportWidth = window.innerWidth * 0.9;
  const viewportHeight = window.innerHeight * 0.9;
  
  const scaleX = viewportWidth / img.naturalWidth;
  const scaleY = viewportHeight / img.naturalHeight;
  
  const scale = Math.min(scaleX, scaleY, 1);
  
  imageScale.value = scale;
};

const handlePreloadImageLoad = () => {
  if (preloadImage.value) {
    calculateInitialScale(preloadImage.value);
    isReady.value = true;
  }
};

const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  adjustScale(delta);
};

const adjustScale = (delta: number) => {
  const newScale = imageScale.value + delta;
  if (newScale >= 0.1 && newScale <= 3) {
    imageScale.value = newScale;
  }
};

const resetScale = () => {
  if (preloadImage.value) {
    calculateInitialScale(preloadImage.value);
  }
};

const closePreview = () => {
  emit('update:modelValue', false);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.enableNavigation) return;
  
  if (e.key === 'ArrowLeft' && props.onPrevious) {
    props.onPrevious();
  } else if (e.key === 'ArrowRight' && props.onNext) {
    props.onNext();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  backdrop-filter: blur(3px);
}

.modal-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: transparent;
  box-shadow: none;
}

.modal-content img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  transition: transform 0.2s ease;
}

.zoom-controls {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-background-soft);
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.zoom-controls button {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 24px;
  height: 24px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  padding: 0;
  transition: all 0.2s ease;
}

.zoom-controls button:last-child {
  width: auto;
  padding: 0 0.75rem;
}

.zoom-controls button:hover {
  background: var(--color-background-soft);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.zoom-controls button:active {
  transform: translateY(0);
}

.zoom-controls span {
  min-width: 3.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-soft);
}

.close-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  line-height: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--color-background-soft);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.close-button:active {
  transform: translateY(0);
}

.nav-button {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 1001;
}

.nav-button:hover {
  background: var(--color-background-soft);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-button.prev {
  left: 1rem;
}

.nav-button.next {
  right: 1rem;
}
</style> 