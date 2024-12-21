<!-- <DialogPreview filePath="getStaticPath('/static/md/path-to-markdown-file.md')" /> -->
<template>
  <div class="dialog-container">
    <div class="messages">
      <div v-if="firstLine" class="markdown-preview" v-html="firstLine"></div>
      
      <div v-for="message in parsedMessages" 
           :key="message.id" 
           class="message">
        <img :src="message.avatar" alt="头像" class="avatar">
        <div class="message-details" :class="{ 'collapsed': message.collapsed }">
          <div class="message-header">
            <div class="message-name">{{ message.name }}</div>
            <div class="collapse-button" @click="toggleMessage(message)">
              <i :class="message.collapsed ? 'fi fi-rr-angle-down' : 'fi fi-rr-angle-up'"></i>
            </div>
          </div>
          <div class="markdown-preview" v-html="parseMarkdown(message.content)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStaticPath } from '@/utils/assets';
import { ref, onMounted, watch } from 'vue';
import { marked } from 'marked'

interface Message {
  id: number;
  content: string;
  name: string;
  avatar: string;
  collapsed?: boolean;
}

const props = defineProps<{
  filePath: string
}>();

const firstLine = ref('');
const parsedMessages = ref<Message[]>([]);

// 创建自定义 renderer
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
  },

  // 处理代码块
  code(code) {
    return `<pre class="code-block"><code>${code.text}</code></pre>`;
  },

  // 处理列表项
  listitem(text: string) {
    // 如果 text 是对象且包含 raw 属性，使用 raw
    if (typeof text === 'object' && text.text) {
      let content = text.text;
      
      // 处理粗体
      content = content.replace(
        /\*\*([^*]+)\*\*/g,
        '<span class="markdown-bold">$1</span>'
      );
      
      // 处理斜体
      content = content.replace(
        /[*_]([^*_]+)[*_]/g,
        '<span class="markdown-italic">$1</span>'
      );
      
      // 处理链接
      content = content.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      
      return `<li>${content}</li>`;
    }
    
    return `<li>${text}</li>`;
  }
};

// 解析markdown文件内容
const parseMessages = async (filePath: string) => {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    
    const lines = text.split('\n');
    // 处理第一行标签
    if (lines.length > 0) {
      firstLine.value = lines[0].replace(
        /#([\u4e00-\u9fa5\w]+)/g,
        '<span class="markdown-tag">#$1</span>'
      );
      // 移除第一行，这样后面的处理就只针对对话内容
      lines.shift();
    }
    
    const messages: Message[] = [];
    let id = 1;
    let currentName = '';
    let currentContent = '';
    
    lines.forEach(line => {
      // 使用最宽松的正则表达式，只匹配 # 开头和第一个 :
      const nameContentMatch = line.match(/^#(.+?):(.*)/);
      
      if (nameContentMatch) {
        // 如果已经有累积的消息，先保存它
        if (currentName && currentContent.trim()) {
          messages.push({
            id: id++,
            name: currentName.trim(),
            content: currentContent.trim(),
            avatar: getStaticPath(`/static/icon/${currentName.trim().toLowerCase()}.png`),
            collapsed: false
          });
        }
        
        // 开始新的消息
        currentName = nameContentMatch[1];
        currentContent = nameContentMatch[2] || '';
        
      } else if (currentName) {
        // 如果有当前说话者，则添加到当前内容
        currentContent += (currentContent ? '\n' : '') + line;
      }
    });
    
    // 保存最后一条消息
    if (currentName && currentContent.trim()) {
      messages.push({
        id: id++,
        name: currentName.trim(),
        content: currentContent.trim(),
        avatar: getStaticPath(`/static/icon/${currentName.trim().toLowerCase()}.png`),
        collapsed: false
      });
    }
    
    parsedMessages.value = messages;
    
  } catch (error) {
    console.error('解析文件时出错:', error);
  }
};

// 监听文件路径变化
watch(() => props.filePath, (newPath) => {
  parseMessages(newPath);
});

onMounted(() => {
  parseMessages(props.filePath);
});

// 解析 markdown 格式的文本
const parseMarkdown = (text: string) => {
  // 配置 marked
  marked.use({ 
    renderer,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    mangle: false,
    headerIds: false
  });

  const parsed = marked.parse(text)
  return parsed
};

const toggleMessage = (message: Message) => {
  message.collapsed = !message.collapsed;
};
</script>

<style scoped>
.dialog-container {
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  background: var(--color-background-soft);
  border-radius: 8px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-background);
  padding: 6px;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}



.message-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.markdown-preview {
  margin-bottom: 4px;
}

.markdown-preview :deep(.markdown-bold) {
  font-weight: 600;
  color: var(--color-background-highlight);
}
.markdown-preview :deep(p),
.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  padding: 0;
  margin: 1.2em 0;
}

.markdown-preview :deep(li) {
  margin-top: 1.2em;
  margin-bottom: 1.2em;
  margin-left: 1.5em;
}

.markdown-preview :deep(em) {
  font-style: italic;
  display: inline-block;
  color: var(--color-text-light);
  font-size: 0.95rem;
}

.markdown-preview :deep(u) {
  text-decoration: underline;
}

.markdown-preview :deep(del) {
  text-decoration: line-through;
}

.markdown-preview :deep(.code-block) {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  padding: 1em;
  border-radius: 4px;
  margin: 0.5em 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  max-width: 100%;
  font-family: 'Noto Sans SC', 'Consolas', 'Monaco', monospace;
  line-height: 1.2;
}

.markdown-preview :deep(.code-block br) {
    height: 0.5rem;
    line-height: 0;
    margin: 0;
    padding: 0;
    display: block;
    content: "";
}

.markdown-preview :deep(code) {
  background-color: rgba(var(--color-background-soft-rgb), 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: inherit;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.markdown-preview :deep(blockquote) {
  margin: 1.5em 0;
  padding: 0.8em 1.2em;
  border-left: 4px solid var(--color-border);
  background-color: var(--color-background-mute);
  border-radius: 0 4px 4px 0;
}

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
.markdown-preview :deep(h5) { font-size: 1em; margin: 0.5em 0; }
.markdown-preview :deep(h6) { font-size: 0.9em; margin: 0.5em 0; }



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

.tags-line {
  padding: 8px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  position: sticky;  /* 添加 sticky 定位 */
  top: 0;           /* 固定在顶部 */
  background: var(--color-background);
  z-index: 1;       
}

.message-details {
  background: var(--color-background);
  color: var(--color-text);
  padding: 12px;
  border-radius: 8px;
  max-width: 80%;
  min-width: 80%;
  position: relative;  /* 为 sticky header 创建定位上下文 */
}

.collapse-button {
  cursor: pointer;
  font-size: 0.9em;
  color: var(--color-text-light);
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.collapse-button:hover {
  background: var(--color-background-mute);
}

.message-details.collapsed .markdown-preview {
  display: none;
}

.message-details {
  transition: all 0.3s ease;
}
</style>