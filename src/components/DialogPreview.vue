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
.dialog-container .markdown-preview {
  padding: 0;
  background: none;
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

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  position: sticky;
  top: 0;
  background: var(--color-background);
  z-index: 1;
}

.message-name {
  font-weight: 700;
  margin-bottom: 4px;
}

.message-details {
  background: var(--color-background);
  color: var(--color-text);
  padding: 12px;
  border-radius: 8px;
  max-width: 80%;
  min-width: 80%;
  position: relative;
  transition: all 0.3s ease;
}

.message-details.collapsed .markdown-preview {
  display: none;
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
</style>