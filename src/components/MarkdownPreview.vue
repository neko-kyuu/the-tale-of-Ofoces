<template>
  <div class="markdown-preview" v-html="renderedContent"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked' 

const props = defineProps({
  filePath: {
    type: String,
    required: true
  }
})

const renderedContent = ref('')

const fetchAndRenderContent = async () => {
  try {
    const response = await fetch(props.filePath)
    const markdown = await response.text()
    renderedContent.value = marked.parse(markdown)
  } catch (error) {
    console.error('Error loading markdown file:', error)
    renderedContent.value = '加载失败'
  }
}

onMounted(() => {
  fetchAndRenderContent()
})

watch(() => props.filePath, () => {
  fetchAndRenderContent()
})
</script>

<style scoped>
.markdown-preview {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
}

.markdown-preview :deep(h1) {
  font-size: 2em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.markdown-preview :deep(h3) {
  font-size: 1.25em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.markdown-preview :deep(p) {
  margin: 1em 0;
}

.markdown-preview :deep(ul), 
.markdown-preview :deep(ol) {
  padding-left: 2em;
  margin: 1em 0;
}

.markdown-preview :deep(li) {
  margin: 0.5em 0;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid var(--color-border);
  margin: 1em 0;
  padding-left: 1em;
  color: var(--color-text-light);
}

.markdown-preview :deep(code) {
  background-color: var(--color-background-mute);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-preview :deep(pre) {
  background-color: var(--color-background-mute);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}

.markdown-preview :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  border: 1px solid var(--color-border);
  padding: 0.5em;
}

.markdown-preview :deep(th) {
  background-color: var(--color-background-mute);
}
</style> 