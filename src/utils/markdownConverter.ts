import { marked } from 'marked'

// 创建渲染器实例
const renderer = {
  heading(textObj) {
    const { text, depth } = textObj
    const processedText = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<span class="markdown-bold">$1</span>'
    )
    return `<h${depth}>${processedText}</h${depth}>`
  },
  
  paragraph(para) {
    if (typeof para === 'object' && para.raw) {
      let text = para.raw
      
      text = text.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      
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
  
  strong(text) {
    if (typeof text === 'object') {
      return text.text || ''
    }
    return `<span class="markdown-bold">${text}</span>`
  },
  
  link(href, title, text) {
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

// Markdown 转 HTML
export const markdownToHtml = (markdown) => {
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
  
  return marked.parse(markdown)
}

// HTML 转 Markdown
export const htmlToMarkdown = (html) => {
  let markdown = html

  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n')
  markdown = markdown.replace(/<h([1-6])>(.*?)<\/h\1>/g, (_, level, content) => {
    return '#'.repeat(level) + ' ' + content + '\n'
  })
  markdown = markdown.replace(
    /<span class="markdown-bold">(.*?)<\/span>/g,
    '**$1**'
  )
  markdown = markdown.replace(
    /<span class="markdown-italic">(.*?)<\/span>/g,
    '*$1*'
  )
  markdown = markdown.replace(
    /<span class="markdown-tag">#(.*?)<\/span>/g,
    '#$1'
  )
  markdown = markdown.replace(
    /<a href="(.*?)"(?:.*?)>(.*?)<\/a>/g,
    '[$2]($1)'
  )
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n')
  markdown = markdown.trim()
  
  return markdown
} 