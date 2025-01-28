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
import { marked } from 'marked'

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
    console.error('markdownPreview 加载失败:', error)
    renderedContent.value = '加载失败'
  }
}

// HTML转换回Markdown的方法
const convertToMarkdown = (html) => {
  let markdown = html

  // 移除所有的 <p> 标签
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n')
  
  // 转换标题标签
  markdown = markdown.replace(/<h([1-6])>(.*?)<\/h\1>/g, (_, level, content) => {
    return '#'.repeat(level) + ' ' + content + '\n'
  })
  
  // 转换加粗
  markdown = markdown.replace(
    /<span class="markdown-bold">(.*?)<\/span>/g,
    '**$1**'
  )
  
  // 转换斜体
  markdown = markdown.replace(
    /<span class="markdown-italic">(.*?)<\/span>/g,
    '*$1*'
  )
  
  // 转换标签
  markdown = markdown.replace(
    /<span class="markdown-tag">#(.*?)<\/span>/g,
    '#$1'
  )
  
  // 转换链接
  markdown = markdown.replace(
    /<a href="(.*?)"(?:.*?)>(.*?)<\/a>/g,
    '[$2]($1)'
  )
  
  // 清理多余的空行
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n')
  
  // 移除开头和结尾的空白
  markdown = markdown.trim()
  
  return markdown
}

// 修改现有的saveContent方法
const saveContent = async () => {
  if (!isElectron) return

  const htmlContent = previewContent.value.innerHTML
  const markdownContent = convertToMarkdown(htmlContent)
  
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
