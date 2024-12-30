import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useImagePreviewStore = defineStore('imagePreview', () => {
  const showPreview = ref(false)
  const currentImage = ref('')
  const imageList = ref<string[]>([])
  const currentIndex = computed(() => {
    return imageList.value.findIndex(img => img === currentImage.value)
  })
  
  function openPreview(imageSrc: string, images?: string[]) {
    currentImage.value = imageSrc
    imageList.value = images || [imageSrc]
    showPreview.value = true
  }
  
  function closePreview() {
    showPreview.value = false
    currentImage.value = ''
    imageList.value = []
  }
  
  function previousImage() {
    if (currentIndex.value > 0) {
      currentImage.value = imageList.value[currentIndex.value - 1]
    }
  }
  
  function nextImage() {
    if (currentIndex.value < imageList.value.length - 1) {
      currentImage.value = imageList.value[currentIndex.value + 1]
    }
  }
  
  return {
    showPreview,
    currentImage,
    imageList,
    currentIndex,
    openPreview,
    closePreview,
    previousImage,
    nextImage
  }
}) 