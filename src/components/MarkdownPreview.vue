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

<style scoped>
.markdown-preview {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text);
  width: 100%;
  background-color: var(--color-background-soft);
  padding: 2rem;
  min-height: 100%;
}

/* 标题样式 */
.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3),
.markdown-preview :deep(h4) {
  font-weight: 600;
  line-height: 1.4;
  margin: 2rem 0 1.2rem;
  position: relative;
  color: var(--color-background-highlight);
}

.markdown-preview :deep(h1) {
  font-size: 2.2em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.3em;
}

.markdown-preview :deep(h2) {
  font-size: 1.8em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.3em;
}

.markdown-preview :deep(h3) {
  font-size: 1.5em;
}

.markdown-preview :deep(h4) {
  font-size: 1.25em;
}

/* 段落和列表样式 */
.markdown-preview :deep(p),
.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin: 1.2em 0;
  line-height: 1.8;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  padding-left: 1.5em;
}

.markdown-preview :deep(li) {
  margin: 0.5em 0;
  line-height: 1.7;
}

/* 引用样式 */
.markdown-preview :deep(blockquote) {
  margin: 1.5em 0;
  padding: 0.8em 1.2em;
  border-left: 4px solid var(--color-border);
  background-color: var(--color-background-mute);
  border-radius: 0 4px 4px 0;
}

.markdown-preview :deep(blockquote p) {
  margin: 0.5em 0;
  color: var(--color-text-light);
}

/* 代码样式 */
.markdown-preview :deep(code) {
  font-family: 'Fira Code', monospace;
  background-color: var(--color-background-mute);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-preview :deep(pre) {
  background-color: var(--color-background-mute);
  padding: 1.2em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.markdown-preview :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 0.9em;
  line-height: 1.6;
}

/* 链接样式 */
.markdown-preview :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-primary);
  transition: all 0.3s ease;
}

.markdown-preview :deep(a:hover) {
  color: var(--color-primary-dark);
  border-bottom-style: solid;
}
.markdown-preview :deep(a::after) {
  content: '';
  display: inline-block;
  margin-left: 0.5rem;
  width: 1em;
  height: 1em;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230366d6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'%3E%3C/path%3E%3Cpolyline points='15 3 21 3 21 9'%3E%3C/polyline%3E%3Cline x1='10' y1='14' x2='21' y2='3'%3E%3C/line%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.7;
}
.markdown-preview :deep(a:hover::after) {
  opacity: 1;
}

/* 图片样式 */
.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5em 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 表格样式 */
.markdown-preview :deep(table) {
  width: 100%;
  margin: 1.5em 0;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  padding: 0.8em 1em;
  border: 1px solid var(--color-border);
}

.markdown-preview :deep(th) {
  background-color: var(--color-background-mute);
  font-weight: 600;
}

.markdown-preview :deep(tr:nth-child(even)) {
  background-color: var(--color-background-mute);
}

/* 标签样式 */
.markdown-preview :deep(.markdown-tag) {
  display: inline-block;
  padding: 0.2em 0.8em;
  margin: 0 0.2em;
  background-color: transparent;
  color: var(--color-background-soft-mute);
  border: 1px solid rgba(125, 125, 125, 0.3);
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.markdown-preview :deep(.markdown-tag:hover) {
  border-color: var(--color-background-soft-mute);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 分割线样式 */
.markdown-preview :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2em 0;
}

/* 斜体样式 */
.markdown-preview :deep(.markdown-italic) {
  font-style: italic;
  display: inline-block;
  color: var(--color-text-light);
  font-size: 0.95rem;
}

/* 如果斜体在段落开头，给予额外的缩进 */
.markdown-preview :deep(p > .markdown-italic:first-child) {
  margin-left: 2em;
  margin-right: 2em;
}

/* 粗体样式 */
.markdown-preview :deep(.markdown-bold) {
  font-weight: 600;
  color: var(--color-background-highlight);
}
</style> 