<template>
    <div 
        class="network-view view-active"
    >
        <div id="network"></div>
    </div>
</template>
<script setup lang="ts">
import { characters } from '@/constants/entities';
import { useCharacterDetailStore } from '@/stores/characterDetail';
import { getStaticPath } from '@/utils/assets';
import { Network } from 'vis-network'
import { onMounted, onUnmounted } from 'vue';
let network = null

// 准备节点和边的数据
const nodes = characters.map(char => ({
  id: char.id,
  label: char.name,
  image: getStaticPath(char.path),
  shape: 'circularImage',
  size: 30,
  imageSize: 30,
  imagePadding: 0,
  color: {
    border: '#848484',
    background: '#ffffff',
    highlight: {
      border: '#2B7CE9',
      background: '#ffffff'
    },
    hover: {
      border: '#2B7CE9',
      background: '#ffffff'
    }
  }
}))
// 使用全局关系数据
const edges = window.$characterRelationships.map(edge => ({
  ...edge,
  color: {
    color: edge.color?.color || '#848484',
    highlight: edge.color?.color || '#848484',
    hover: edge.color?.color || '#848484',
    opacity: 0.8
  }
}))

// 网络图配置
const options = {
  nodes: {
    borderWidth: 2,
    borderWidthSelected: 3,
    size: 30, // 默认大小
    shape: 'circularImage',
    brokenImage: undefined,
    imagePadding: 0,
    chosen: {
      node: (values, id, selected, hovering) => {
        if (hovering) {
          values.size = 30; // 悬浮时放大节点
          values.borderWidth = 3;
          values.shadow = true;
          values.shadowColor = 'rgba(0,0,0,0.3)';
          values.shadowSize = 10;
          values.shadowX = 0;
          values.shadowY = 0;
          
          values.imageSize = 45;
          values.imagePadding = 0;
        } else {
          values.size = 30;
          values.imageSize = 30;
          values.imagePadding = 0;
        }
      },
      label: (values, id, selected, hovering) => {
        if (hovering) {
          // values.size = 16;
          values.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-text').trim();
        }
      }
    },
    font: { 
      color: '#343434',
      size: 14,
      face: 'Arial'
    },
    shadow: {
      enabled: false
    },
    shapeProperties: {
      useBorderWithImage: true,
      interpolation: true // 启用图片平滑缩放
    },
    scaling: {
      min: 30,
      max: 45,
      label: {
        enabled: true,
        min: 14,
        max: 16
      }
    },
    transition: {
      duration: 200, // 动画过渡时间
      easing: 'easeInOutQuad' // 过渡效果
    }
  },
  edges: {
    width: 1.5,
    color: {
      color: '#848484',
      highlight: '#848484',
      hover: '#848484',
      inherit: false,
      opacity: 0.8
    },
    smooth: {
      enabled: true,
      type: 'continuous',
      roundness: 0.5
    },
    font: {
      size: 12,
      align: 'middle',
      strokeWidth: 2,
      strokeColor: '#ffffff'
    },
    chosen: {
      edge: function(values, id, selected, hovering) {
        if (hovering) {
          values.width = 4;
          values.opacity = 1;
          values.shadow = true;
          values.shadowColor = 'rgba(0,0,0,0.2)';
        }
      }
    },
    hoverWidth: 2,
    selectionWidth: 2,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.3,
        type: 'arrow'
      },
      from: {
        enabled: true,
        scaleFactor: 0.3,
        type: 'arrow'
      }
    }
  },
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',  // 使用 forceAtlas2Based 布局
    forceAtlas2Based: {
      gravitationalConstant: -100,  // 引力常数
      centralGravity: 0.015,       // 中心引力
      springLength: 150,           // 弹簧长度
      springConstant: 0.1,         // 弹簧常数
      damping: 0.4,               // 阻尼
      avoidOverlap: 1             // 避免重叠
    },
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 50,
      fit: true
    },
    minVelocity: 0.75,
    maxVelocity: 30
  },
  layout: {
    improvedLayout: true,
    randomSeed: 2  // 可以通过调整这个值来改变初始布局
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: true,
    selectable: true,
    selectConnectedEdges: true,
    multiselect: true,
    navigationButtons: true,
    keyboard: {
      enabled: true,
      bindToWindow: false
    },
    zoomView: true
  }
}
const store = useCharacterDetailStore()

const showCharacterDetail = (char) => {
  store.showCharacter(char)
}
const initNetwork = () => {
  const container = document.getElementById('network')
  network = new Network(
    container,
    { nodes, edges },
    options
  )
  
  network.on('click', (params) => {
    if (params.nodes.length > 0) {
      const char = characters.find(c => c.id === params.nodes[0])
      if (char) showCharacterDetail(char)
    }
  })
}
onMounted(() => {
  initNetwork()
})
onUnmounted(() => {
  if (network) {
    network.destroy()
    network = null
  }
})
</script>

<style scoped>
.network-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.view-active {
  opacity: 1;
  pointer-events: auto;
}
/* 调整网络视图的样式 */
.network-view {
  height: calc(100vh - 2rem);
  border-radius: 8px;
  overflow: hidden;
}

#network {
  width: 100%;
  height: 100%;
}

/* 自定义节点悬浮效果 */
:deep(.vis-network .vis-node:hover) {
  transform: scale(1.1);
  transition: transform 0.2s;
}

/* 优化节点和边的过渡效果 */
:deep(.vis-network .vis-node) {
  transition: all 0.2s ease-in-out;
}

:deep(.vis-network .vis-edge) {
  transition: all 0.2s ease-in-out;
}

:deep(.vis-network .vis-node:hover) {
  transform: scale(1.1);
}

/* 添加连线悬浮效果 */
:deep(.vis-network .vis-edge:hover) {
  filter: brightness(1.2);
}
</style>