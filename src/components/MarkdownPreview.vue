<template>
  <div class="markdown-preview">
    <div
      ref="previewContent"
      v-html="renderedContent"
      class="preview-content"
      :contenteditable="isElectron && isEditing"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { markdownToHtml, htmlToMarkdown } from '@/utils/markdownConverter'

const isElectron = !!window.electronAPI

const props = defineProps({
  filePath: {
    type: String,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const previewContent = ref(null)
const renderedContent = ref('')

watch(() => props.isEditing, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    saveContent()
  }
})

const fetchAndRenderContent = async () => {
  try {
    const response = await fetch(props.filePath)
    const markdown = await response.text()
    renderedContent.value = markdownToHtml(markdown)
  } catch (error) {
    console.error('markdownPreview 加载失败:', error)
    renderedContent.value = '加载失败'
  }
}

const saveContent = async () => {
  if (!isElectron) return

  const htmlContent = previewContent.value.innerHTML
  const markdownContent = htmlToMarkdown(htmlContent)
  
  try {
    await window.electronAPI.saveFile({
      filePath: props.filePath,
      content: markdownContent
    })
    await fetchAndRenderContent()
  } catch (error) {
    console.error('保存文件失败:', error)
  }
}

onMounted(() => {
  // 测试连接
  window.electronAPI?.test?.()
  
  fetchAndRenderContent()
})

watch(() => props.filePath, () => {
  fetchAndRenderContent()
})
</script>

<style scoped>
.markdown-editor {
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  font-family: monospace;
}

.edit-controls {
  margin-bottom: 1rem;
}
</style>
