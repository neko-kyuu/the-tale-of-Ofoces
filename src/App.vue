<template>
  <div class="layout" :class="{ 'dark-theme': isDarkMode }">
    <!-- 主体内容 -->
    <div class="content-wrapper">
      <nav class="sidebar">
        <!-- 导航栏 -->
        <div class="nav-section">
            <!-- 主页 -->
          <RouterLink to="/" class="nav-link">
            <i class="fi fi-rr-home"></i>
          </RouterLink>

          <!-- 总览页面 -->
          <RouterLink 
            to="/overview" 
            class="nav-link" 
            title="总览"
          >
          <i class="fi fi-rr-dot-circle"></i>
          </RouterLink>

          <!-- 画廊 -->
          <RouterLink 
            to="/gallery" 
            class="nav-link" 
            title="画廊"
          >
            <i class="fi fi-sr-layout-fluid"></i>
          </RouterLink>

          <!-- doc & notes备忘录/杂物箱 -->
          <RouterLink 
            to="/vault" 
            class="nav-link" 
            title="储物箱"
          >
            <i class="fi fi-rs-box-alt"></i>
          </RouterLink>

          <!-- 事件 -->
          <!-- <RouterLink 
            to="/event" 
            class="nav-link" 
            title="事件"
          >
            <i class="fi fi-rr-calendar-days"></i>
          </RouterLink> -->
          
          <!-- 地图 -->
          <RouterLink 
            to="/location" 
            class="nav-link" 
            title="地图"
          >
            <i class="fi fi-rr-earth-americas"></i>
          </RouterLink>
        </div>
        
        <!-- 工具栏 -->
        <div class="tool-section">
          <!-- 主题切换按钮 -->
          <button 
            class="nav-link theme-toggle" 
            @click="toggleTheme"
            :title="isDarkMode ? '切换到亮色模式' : '切换到暗色模式'"
          >
            <i class="fi" :class="{'fi-rr-moon':isDarkMode, 'fi-rr-brightness':!isDarkMode}"></i>
          </button>
          <!-- 骰子菜单 -->
          <div class="dice-menu" v-if="!isMobile">
            <button class="nav-link dice-trigger" title="骰子">
              <i class="fi fi-rr-dice-d20"></i>
            </button>
            <div class="dice-options">
              <button class="nav-link" @click="rollDice(4)">
                <i class="fi fi-rr-dice-d4"></i>
              </button>
              <button class="nav-link" @click="rollDice(6)">
                <i class="fi fi-rr-dice-d6"></i>
              </button>
              <button class="nav-link" @click="rollDice(8)">
                <i class="fi fi-rr-dice-d8"></i>
              </button>
              <button class="nav-link" @click="rollDice(10)">
                <i class="fi fi-rr-dice-d10"></i>
              </button>
              <button class="nav-link" @click="rollDice(12)">
                <i class="fi fi-rr-dice-d12"></i>
              </button>
              <button class="nav-link" @click="rollDice(20)">
                <i class="fi fi-rr-dice-d20"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="main-content">
        <RouterView />
        <SlideDetails />
      </main>

      <!-- 骰子结果显示窗口 -->
      <div v-if="diceResult" class="dice-result">
            <div class="dice-formula">
              1d{{ currentDice }}{{ modifier ? ` + ${modifier}` : '' }}
            </div>
            <div class="dice-total">
              = {{ diceResult + modifier }}
            </div>
            <button class="close-button" @click="clearResult">×</button>
        </div>
    </div>
    
    <!-- 添加 ImagePreview 组件 -->
    <ImagePreview
      v-model="imagePreviewStore.showPreview"
      :image-src="imagePreviewStore.currentImage"
      :enable-navigation="imagePreviewStore.imageList.length > 1"
      :on-previous="canNavigatePrevious ? imagePreviewStore.previousImage : undefined"
      :on-next="canNavigateNext ? imagePreviewStore.nextImage : undefined"
      alt="图片预览"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import SlideDetails from '@/components/SlideDetail.vue'
import { useEntityGraphStore } from '@/stores/entityGraph'
import ImagePreview from '@/components/ImagePreview.vue'
import { useImagePreviewStore } from '@/stores/imagePreviewStore'

const diceResult = ref(null)
const modifier = ref(0)
const currentDice = ref(null)
const isDarkMode = ref(false)

const rollDice = (faces) => {
  currentDice.value = faces
  const result = Math.floor(Math.random() * faces) + 1
  diceResult.value = result
}

const clearResult = () => {
  diceResult.value = null
}

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  updateThemeColors()
}

// 更新主题颜色
const updateThemeColors = () => {
  const root = document.documentElement
  if (isDarkMode.value) {
    // 深色主题 - 主要使用深灰色调配合紫红色点缀
    root.style.setProperty('--color-background', '#1a1a1a')
    root.style.setProperty('--color-background-light', '#242424')
    root.style.setProperty('--color-background-lighter', '#2a2a2a')
    root.style.setProperty('--color-background-soft', '#242424')
    root.style.setProperty('--color-background-soft-rgb', '36, 36, 36')
    root.style.setProperty('--color-background-mute', '#2f2f2f')
    root.style.setProperty('--color-background-dark', '#2f2f2f')
    
    // 强调色
    root.style.setProperty('--color-background-highlight', '#de6193')
    root.style.setProperty('--color-background-highlight-soft', '#cc5483')
    root.style.setProperty('--color-background-highlight-rgb', '222, 97, 147')
    root.style.setProperty('--color-accent-1', '#bd93f6')
    root.style.setProperty('--color-accent-2', '#ff79c6')
    root.style.setProperty('--color-accent-3', '#8be9fd')
    
    // 边框和分割线
    root.style.setProperty('--color-border', '#3f3f3f')
    root.style.setProperty('--color-border-light', '#4a4a4a')
    root.style.setProperty('--color-border-dark', '#333333')
    
    // 文字
    root.style.setProperty('--color-text', '#ffffff')
    root.style.setProperty('--color-text-soft', '#ffffffb3')
    root.style.setProperty('--color-text-muted', '#999999')
    root.style.setProperty('--color-text-light', '#cccccc')
  } else {
    // 浅色主题 - 温暖的米色调配合柔和的紫色
    root.style.setProperty('--color-background', '#fffdf6')
    root.style.setProperty('--color-background-light', '#f8f8f8')
    root.style.setProperty('--color-background-lighter', '#ffffff')
    root.style.setProperty('--color-background-soft', '#F8F5F1')
    root.style.setProperty('--color-background-soft-rgb', '248, 245, 241')
    root.style.setProperty('--color-background-mute', '#C2C1C0')
    root.style.setProperty('--color-background-dark', '#EEE7DD')
    
    // 强调色
    root.style.setProperty('--color-background-highlight', '#bd93f6')
    root.style.setProperty('--color-background-highlight-soft', '#d3b4f7')
    root.style.setProperty('--color-background-highlight-rgb', '189, 147, 246')
    root.style.setProperty('--color-accent-1', '#9d7cd8')
    root.style.setProperty('--color-accent-2', '#ff85a1')
    root.style.setProperty('--color-accent-3', '#7dcfff')
    
    // 边框和分割线
    root.style.setProperty('--color-border', '#CEC8BF')
    root.style.setProperty('--color-border-light', '#E5E0D8')
    root.style.setProperty('--color-border-dark', '#B8B2A9')
    
    // 文字
    root.style.setProperty('--color-text', '#213547')
    root.style.setProperty('--color-text-soft', '#213547bf')
    root.style.setProperty('--color-text-muted', '#666666')
    root.style.setProperty('--color-text-light', '#444444')
  }
}

// 检测是否为移动设备
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 初始化主题
onMounted(() => {
  updateThemeColors()
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkMode.value = e.matches
      updateThemeColors()
    }
  })

  checkMobile()
  window.addEventListener('resize', checkMobile)

  // 构建实体关系图
  entityGraphStore.initGraph()
})

const entityGraphStore = useEntityGraphStore()
const imagePreviewStore = useImagePreviewStore()

const canNavigatePrevious = computed(() => imagePreviewStore.currentIndex > 0);

const canNavigateNext = computed(() => {
  return imagePreviewStore.currentIndex < imagePreviewStore.imageList.length - 1;
});

</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.content-wrapper {
  flex: 1;
  display: flex;
  position: relative;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--vt-rem-xlarge);
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-dark);
  z-index: 1000;
}

.tool-section {
  flex: 1;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  margin-bottom: 1rem;
}

.nav-link {
  text-align: center;
  display: block;
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--vt-rem-2);
  transition: background-color 0.2s;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.5;
  transition: opacity 0.2s;
  font-size: 1.2rem;
}
.nav-link i{
  font-size: 1rem;
}

.nav-link:hover {
  background-color: var(--color-background--mute);
}

.nav-link.router-link-active {
  background-color: var(--color-background-soft);
  font-weight: bold;
  opacity: 1;
  box-shadow: inset 0 -2px var(--color-background-mute); 
  transform: translateY(2px); 
  border: 1px solid var(--color-background-highlight);
  color: var(--color-background-highlight);
}

.main-content {
  background-color: var(--color-background-dark);
  margin-left: var(--vt-rem-xlarge);
  transition: all 0.3s ease;
  width: calc(100% - var(--vt-rem-xlarge));
  overflow-x: hidden;
}

.dice-section {
  margin-bottom: 2rem;
}

.dice-result {
  position: fixed;
  bottom: 1rem;
  left: calc(var(--vt-rem-xlarge) + 1rem);
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  color: var(--vt-c-white);
  font-size: 0.9rem;
  animation: fadeIn 0.2s ease-in-out;
}

.dice-formula {
  color: var(--vt-c-white);
}

.dice-total {
  font-weight: bold;
}

.close-button {
  width: var(--vt-font-size-lg);
  height: var(--vt-font-size-lg);
  border-radius: 50%;
  background-color: var(--vt-btn);
  border: none;
  color: var(--vt-c-white);
  cursor: pointer;
  display: none;
  padding: 0;
  line-height: 1;
  font-size: var(--vt-font-size-sm);
}

.dice-result:hover .close-button {
  display: block;
}

.close-button:hover {
  background-color: var(--vt-btn-hover);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(0.625rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.theme-toggle {
  padding: 0.5rem;
  transition: transform 0.3s ease;
}

.dark-theme {
  /* 暗色主题特定样式 */
  --vt-btn: #4a4a4a;
  --vt-btn-hover: #5a5a5a;
}

/* 骰子结果窗口在暗色主题下的样式 */
.dark-theme .dice-result {
  background-color: rgba(255, 255, 255, 0.1);
}

.dice-menu {
  position: relative;
  margin-top: auto;
}

.dice-trigger {
  width: 100%;
  padding: 0.5rem;
  transition: background-color 0.2s;
}

.dice-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-top: none;
  border-right: none;
  border-radius: 0 0 8px 8px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 100;
}

.dice-menu:hover .dice-options {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dice-options .nav-link {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端隐藏骰子菜单 */
@media (max-width: 768px) {
  .dice-menu {
    display: none;
  }
}

/* 移动端样式 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: var(--vt-rem-xlarge);
    width: 100%;
    bottom: auto;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 1rem;
  }

  .nav-section {
    display: flex;
    align-items: center;
  }

  .tool-section {
    display: flex;
    gap: 1rem;
    align-items: center;
    background: none;
    border: none;
    margin-bottom: 0;
    border-left:1px solid var(--color-border);
    border-bottom-left-radius: 8px;
  }

  .nav-link {
    width: auto;
    padding: 0.5rem;
  }

  .main-content {
    margin-left: 0;
    margin-top: var(--vt-rem-xlarge);
    width: 100%;
  }

  .dice-result {
    left: 1rem;
    bottom: 1rem;
  }

  .nav-link.router-link-active {
    box-shadow: inset 0 -2px var(--color-background-highlight); 
    transform: none;
    border: none;
  }

  .theme-toggle {
    padding: 0.5rem;
    margin: 0;
  }
}

/* 添加图片预览相关样式 */
:deep(.image-preview) {
  position: fixed;
  z-index: 9999;
}

</style>
