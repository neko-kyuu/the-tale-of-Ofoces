<template>
    <SourceControlGraph 
      :data="graphData"
      @node-click="handleNodeClick"
      :width="1000"
      :height="500"
      :node-radius="8"
      :x-scale="180"
      :y-scale="70"
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
        { id: '3', title: '分支想法A', timestamp: 1, parentId: '1', nodeType: 'thought' },
        { id: '4', title: '相关联想A', timestamp: 3, nodeType: 'thought' },
      ]
    },
    {
      level: 0,
      nodes: [
        { id: '1', title: '初始想法', timestamp: 0, nodeType: 'thought', displayType: 'chat', path: '/static/md/和gpt关于维爹的讨论.md' },
        { id: '2', title: '深入思考', timestamp: 2, nodeType: 'thought' },
        { id: '5', title: '总结归纳', timestamp: 4, nodeType: 'summary' },
      ]
    },
    {
      level: 1,
      nodes: [
        { id: '6', title: '分支想法B', timestamp: 1, parentId: '1', nodeType: 'thought' },
        { id: '7', title: '相关联想B', timestamp: 3, nodeType: 'thought' },
      ]
    }
  ],
  connections: [
    { from: '1', to: '3', type: 'branch' },
    { from: '1', to: '6', type: 'branch' },
    { from: '1', to: '2', type: 'commit' },
    { from: '3', to: '4', type: 'commit' },
    { from: '6', to: '7', type: 'commit' },
    { from: '4', to: '5', type: 'merge' },
    { from: '7', to: '5', type: 'merge' }
  ]
}
</script>