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

// 创建新的渲染器实例
const renderer = {
  // 添加标题处理
  heading(textObj) {
    const { text, depth } = textObj
    
    // 处理粗体（使用双星号的情况）
    const processedText = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<span class="markdown-bold">$1</span>'
    )
    
    return `<h${depth}>${processedText}</h${depth}>`
  },
  
  paragraph(para) {
    // 如果 para 是对象且包含 raw 属性，使用 raw
    if (typeof para === 'object' && para.raw) {
      let text = para.raw
      
      // 处理链接格式
      text = text.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      
      // 其他格式处理...
      text = text.replace(
        /\*\*([^*]+)\*\*/g,
        '<span class="markdown-bold">$1</span>'
      )
      
      text = text.replace(
        /_([^_]+)_/g,
        '<span class="markdown-italic">$1</span>'
      )
      
      text = text.replace(
        /\*([^*]+)\*/g,
        '<span class="markdown-italic">$1</span>'
      )
      
      text = text.replace(
        /#([\u4e00-\u9fa5\w]+)/g,
        '<span class="markdown-tag">#$1</span>'
      )
      
      return `<p>${text}</p>`
    }
    
    return `<p>${para}</p>`
  },
  
  // 处理粗体
  strong(text) {
    if (typeof text === 'object') {
      return text.text || ''
    }
    return `<span class="markdown-bold">${text}</span>`
  },
  
  // 添加链接处理
  link(href, title, text) {
    // 处理可能存在的粗体和斜体
    text = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<span class="markdown-bold">$1</span>'
    ).replace(
      /_([^_]+)_/g,
      '<span class="markdown-italic">$1</span>'
    ).replace(
      /\*([^*]+)\*/g,
      '<span class="markdown-italic">$1</span>'
    )
    
    const titleAttr = title ? ` title="${title}"` : ''
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`
  }
}

const fetchAndRenderContent = async () => {
  try {
    const response = await fetch(props.filePath)
    const markdown = await response.text()
    
    marked.use({ 
      renderer,
      gfm: true,
      breaks: true,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      mangle: false,
      headerIds: false
    })
    
    const parsed = marked.parse(markdown)
    renderedContent.value = parsed
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
