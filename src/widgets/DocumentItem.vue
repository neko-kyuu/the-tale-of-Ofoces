<template>
  <div class="document-item" @click="$emit('click', item)">
    <div class="document-icon">{{ icon }}</div>
    <div class="document-info">
      <span class="document-name">{{ item.title || item.name }}</span>
      <div class="document-tags" v-if="item.tags">
        <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: any
  icon?: string
}>()

defineEmits<{
  (e: 'click', item: any): void
}>()
</script>

<style scoped>
.document-item {
    display: flex;
    align-items: center;
    border-radius: 6px;
    background: var(--color-background-light);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--color-background-mute);
    padding: 0.3rem 0.6rem;
    margin: 0 0.6rem;
}

.document-item:hover {
  background: var(--color-background-mute);
}

.document-icon {
  font-size: 1.25rem;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  border-radius: 4px;
}

.document-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 1rem;
  border-left: 1px solid var(--color-border-light);
}

.document-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.document-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--color-background-mute);
  color: var(--color-text-light);
}
</style> 