<!-- <DialogPreview filePath="getStaticPath('/static/md/path-to-markdown-file.md')" /> -->
<template>
  <div class="dialog-container">
    <div class="messages">
      <div v-if="firstLine" class="message-content" v-html="firstLine"></div>
      
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
          <div class="message-content" v-html="parseMarkdown(message.content)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStaticPath } from '@/utils/assets';
import { ref, onMounted, watch } from 'vue';

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
  return text
    // 处理代码块 ```language\ncode\n```
    .replace(/```(?:\s*([a-zA-Z]*)\s*\n)?([\s\S]*?)```/g, (_, language, code) => {
      return `<pre class="code-block ${language}"><code>${code.trim()}</code></pre>`;
    })
    // 处理加粗 **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 处理斜体 *text* 或 _text_
    .replace(/[*_](.*?)[*_]/g, '<em>$1</em>')
    // 处理行内代码 `text`
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // 处理下划线 __text__
    .replace(/__(.*?)__/g, '<u>$1</u>')
    // 处理删除线 ~~text~~
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    // 处理引用 > text
    .replace(/^>\s*(.*?)$/gm, '<blockquote>$1</blockquote>')
    // 处理标题 # text
    .replace(/^(#{1,6})\s*(.*?)$/gm, (_, level, content) => {
      const h = level.length;
      return `<h${h}>${content}</h${h}>`;
    })
    // 处理列表 - text 或 * text
    .replace(/^[-*]\s+(.*?)$/gm, '<li>$1</li>')
    // 处理链接 [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // 处理换行符
    .replace(/\n/g, '<br>');
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

.message-details {
  background: var(--color-background);
  color: var(--color-text);
  padding: 12px;
  border-radius: 8px;
  max-width: 80%;
  min-width: 80%;
}

.message-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.message-content {
  margin-bottom: 4px;
}

.message-content :deep(strong) {
  font-weight: 600;
  color: var(--color-background-highlight);
}

.message-content :deep(em) {
  font-style: italic;
  display: inline-block;
  color: var(--color-text-light);
  font-size: 0.95rem;
}

.message-content :deep(u) {
  text-decoration: underline;
}

.message-content :deep(del) {
  text-decoration: line-through;
}

.message-content :deep(.code-block) {
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

.message-content :deep(.code-block br) {
    height: 0.5rem;
    line-height: 0;
    margin: 0;
    padding: 0;
    display: block;
    content: "";
}

.message-content :deep(code) {
  background-color: rgba(var(--color-background-soft-rgb), 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: inherit;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-content :deep(blockquote) {
  margin: 1.5em 0;
  padding: 0.8em 1.2em;
  border-left: 4px solid var(--color-border);
  background-color: var(--color-background-mute);
  border-radius: 0 4px 4px 0;
}

.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3),
.message-content :deep(h4) {
  font-weight: 600;
  line-height: 1.4;
  margin: 2rem 0 1.2rem;
  position: relative;
  color: var(--color-background-highlight);
}

.message-content :deep(h1) {
  font-size: 2.2em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.3em;
}

.message-content :deep(h2) {
  font-size: 1.8em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.3em;
}

.message-content :deep(h3) {
  font-size: 1.5em;
}

.message-content :deep(h4) {
  font-size: 1.25em;
}
.message-content :deep(h5) { font-size: 1em; margin: 0.5em 0; }
.message-content :deep(h6) { font-size: 0.9em; margin: 0.5em 0; }

.message-content :deep(li) {
  margin-left: 1.5em;
  list-style-type: disc;
}

.message-content :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-primary);
  transition: all 0.3s ease;
}

.message-content :deep(a:hover) {
  color: var(--color-primary-dark);
  border-bottom-style: solid;
}
.message-content :deep(a::after) {
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
.message-content :deep(a:hover::after) {
  opacity: 1;
}
.message-content :deep(.markdown-tag) {
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

.message-content :deep(.markdown-tag:hover) {
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

.message-details.collapsed .message-content {
  display: none;
}

.message-details {
  transition: all 0.3s ease;
}
</style>