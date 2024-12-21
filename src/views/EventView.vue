<template>
    <SourceControlGraph 
      :data="graphData"
      @node-click="handleNodeClick"
    />
  </template>
<script setup lang="ts">
import SourceControlGraph from '@/components/SourceControlGraph.vue';
import { openEntityPreviewModal } from '@/utils/modalHelper'
import type { Node } from '@/types/graph'

const handleNodeClick = (node: Node) => {
  openEntityPreviewModal(node)
}

const graphData = {
  branches: [
    {
      level: -1,
      nodes: [
        { id: '3', title: '维洛的教育问题', timestamp: 1, parentId: '1', nodeType: 'thought', displayType: 'chat', path: '/static/md/维洛的教育问题.md' },
        { id: '4', title: '外界对伊斯的影响', timestamp: 3, nodeType: 'thought' },
      ]
    },
    {
      level: 0,
      nodes: [
        { id: '1', title: '维洛长期缺席时在外做什么？', content: '维洛长期缺席时在外做什么？', timestamp: 0, nodeType: 'thought', displayType: 'chat', path: '/static/md/维洛长期缺席时在外做什么？.md' },
        { id: '5', title: '总结归纳', timestamp: 4, nodeType: 'summary' },
      ]
    },
    {
      level: 1,
      nodes: [
        { id: '6', title: '维洛的贵族职责？', timestamp: 1, parentId: '1', nodeType: 'thought', displayType: 'chat', path: '/static/md/维洛的贵族职责？.md' },
        { id: '7', title: '家族与家主的互相作用力', timestamp: 3, nodeType: 'thought', displayType: 'chat', path: '/static/md/家族与家主的互相作用力.md' },
      ]
    },
    {
      level: 2,
      nodes: [
        { id: '8', title: '米克斯塔的贵族关系', timestamp: 1, parentId: '6', nodeType: 'thought' },
      ]
    }
  ],
  connections: [
    { from: '1', to: '3', type: 'branch' },
    { from: '1', to: '6', type: 'branch' },
    { from: '6', to: '8', type: 'branch' },
    { from: '3', to: '4', type: 'commit' },
    { from: '6', to: '7', type: 'commit' },
    { from: '4', to: '5', type: 'merge' },
    { from: '7', to: '5', type: 'merge' }
  ]
}
</script>