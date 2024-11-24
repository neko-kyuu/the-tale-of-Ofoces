<template>
  <div class="home-view">
    <div 
      class="tiles-container"
      ref="tilesContainer"
    >
      <div 
        v-for="(tile, index) in tiles" 
        :key="index"
        class="tile"
        :style="getTileStyle(index)"
        @mouseenter="handleTileHover(index)"
      >
        <div class="tile-content">
          <div 
            class="tile-front"
            :style="{
              backgroundPosition: getTileBackgroundPosition(index),
              backgroundSize: `${COLS * tileSize.width}px ${ROWS * tileSize.height}px`
            }"
          ></div>
          <div 
            class="tile-back"
            :style="{
              backgroundPosition: getTileBackgroundPosition(index),
              backgroundSize: `${COLS * tileSize.width}px ${ROWS * tileSize.height}px`
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 瓷砖配置
const ROWS = 6
const COLS = 6

const tilesContainer = ref(null)
const hoveredTiles = ref(new Set())

// 计算瓷砖尺寸
const tileSize = computed(() => {
  if (!tilesContainer.value) return { width: 0, height: 0 }
  
  const containerWidth = tilesContainer.value.clientWidth
  const containerHeight = tilesContainer.value.clientHeight
  
  return {
    width: containerWidth / COLS,
    height: containerHeight / ROWS
  }
})

// 生成瓷砖数组
const tiles = computed(() => {
  return Array(ROWS * COLS).fill(null)
})

// 计算瓷砖位置和样式
const getTileStyle = (index) => {
  const row = Math.floor(index / COLS)
  const col = index % COLS
  
  return {
    width: `${tileSize.value.width}px`,
    height: `${tileSize.value.height}px`,
    transform: `translate(${col * tileSize.value.width}px, ${row * tileSize.value.height}px)${
      hoveredTiles.value.has(index) ? ' rotateY(180deg)' : ''
    }`,
    transitionDelay: `${Math.random() * 0.2}s`
  }
}

// 计算瓷砖的背景位置
const getTileBackgroundPosition = (index) => {
  const row = Math.floor(index / COLS)
  const col = index % COLS
  return `-${col * tileSize.value.width}px -${row * tileSize.value.height}px`
}

// 处理瓷砖悬浮
const handleTileHover = (index) => {
  hoveredTiles.value.add(index)
  
  setTimeout(() => {
    const row = Math.floor(index / COLS)
    const col = index % COLS
    
    const neighbors = [
      index - COLS,
      index + COLS,
      col > 0 ? index - 1 : -1,
      col < COLS - 1 ? index + 1 : -1
    ].filter(i => i >= 0 && i < ROWS * COLS)
    
    neighbors.forEach(i => hoveredTiles.value.add(i))
  }, 100)
}

// 重置瓷砖状态
const resetTiles = () => {
  hoveredTiles.value.clear()
}

onMounted(() => {
  tilesContainer.value?.addEventListener('mouseleave', resetTiles)
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', () => {
    // 强制重新计算瓷砖尺寸
    tileSize.value = {
      width: tilesContainer.value.clientWidth / COLS,
      height: tilesContainer.value.clientHeight / ROWS
    }
  })
})
</script>

<style scoped>
.home-view {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background);
  overflow: hidden;
}

.tiles-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 90vw;
  max-height: 90vh;
  aspect-ratio: 1; /* 保持容器为正方形 */
}

.tile {
  position: absolute;
  perspective: 1000px;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.tile-content {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.tile-front,
.tile-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.tile-front {
  background-image: url('@/assets/tile-front.jpg');
}

.tile-back {
  background-image: url('@/assets/tile-back.jpg');
  transform: rotateY(180deg);
}
</style>