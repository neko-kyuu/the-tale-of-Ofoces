<template>

</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { Character } from '@/types/dnd5e';
import { ATTRIBUTES } from '@/constants/dnd5e';

const props = defineProps<{
  character: Character;
  computedStats: Character;
}>();

const getFeatures = (): string => {
  return props.computedStats?.classFeatureInfo?.classFeature;
};
console.log(getFeatures())
</script>
