<template>
  <div class="spellbook-content">
    <div v-for="category in spellCategories" :key="category.id" class="spell-category">
      <div class="column-headers" 
        v-if="getSpellSlots(category.level - 1) > 0 || category.id === 'cantrips'">
        <div class="header-name">
            {{ category.name }}
          <span v-if="category.level" class="spell-slots">
            <span 
              v-for="n in getSpellSlots(category.level - 1)" 
              :key="n" 
              class="spell-slot-dot"
            ></span>
          </span>
        </div>
        <div class="header-VnS"><i class="fi fi-br-play-circle"></i></div>
        <div class="header-M"><i class="fi fi-sr-plate-wheat"></i></div>
        <div class="header-time">时间</div>
        <div class="header-usage">用法</div>
      </div>
      <div class="spell-list">
        <div 
          v-for="spell in getSpellsByCategory(category.id)" 
          :key="spell.id" 
          class="spell-row"
          :class="{ 'striped': spell.id % 2 === 0 }"
        >
          <div class="spell-name">{{ spell.name }}</div>
          <div class="spell-VnS">{{ spell.VnS }}</div>
          <div class="spell-M">{{ spell.M }}</div>
          <div class="spell-time">{{ spell.time }}</div>
          <div class="spell-usage">{{ spell.usage }}</div>
        </div>
      </div>
    </div>

    <div class="spell-cast-bar">
      <div class="cast-info">
        <span>DC: {{ spellDC }}</span>
        <span class="separator">|</span>
        <span>关键属性: {{ ATTRIBUTES.find(attr => attr.id === props.computedStats.combatStats.keyAttribute)?.name }}</span>
        <span class="separator">|</span>
        <span>攻击调整值: {{ spellAttackMod }}</span>
      </div>
      <div class="prepared-spells">
        已知法术：{{ props.computedStats.classFeatureInfo.knownSpells || '-' }}
        <span class="separator">|</span>
        可准备法术：{{ maxPrepared }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Character } from '@/types/dnd5e';
import { ATTRIBUTES } from '@/constants/dnd5e';

const props = defineProps<{
  character: Character;
  computedStats: Character;
}>();

interface Spell {
  id: number;
  name: string;
  VnS: string;
  M: string;
  time: string;
  usage: string;
  categoryId: string;
}

const spellCategories = [
  { id: 'cantrips', name: '戏法', level: 0 },
  { id: '1st', name: '1环', level: 1 },
  { id: '2nd', name: '2环', level: 2 },
  { id: '3rd', name: '3环', level: 3 },
  { id: '4th', name: '4环', level: 4 },
  { id: '5th', name: '5环', level: 5 },
  { id: '6th', name: '6环', level: 6 },
  { id: '7th', name: '7环', level: 7 },
  { id: '8th', name: '8环', level: 8 },
  { id: '9th', name: '9环', level: 9 },
];

// 虚拟数据
const mockSpells: Spell[] = [
  {
    id: 1,
    name: '魔法伎俩 Prestidigitation',
    VnS: 'V、S',
    M: 'M',
    time: '1动作',
    usage: '自发',
    categoryId: 'cantrips'
  },
  {
    id: 2,
    name: '舞光术 Dancing Lights',
    VnS: 'V、S',
    M: 'M',
    time: '1动作',
    usage: '专注',
    categoryId: 'cantrips'
  },
  {
    id: 3,
    name: '法师护甲 Mage Armor',
    VnS: 'V、S',
    M: 'M',
    time: '1动作',
    usage: '8小时',
    categoryId: '1st'
  }
];

const spellsByCategory = computed(() => {
  const result = new Map();
  
  spellCategories.forEach(category => {
    result.set(
      category.id,
      mockSpells.filter(spell => spell.categoryId === category.id)
    );
  });
  
  return result;
});

const getSpellsByCategory = (categoryId: string) => {
  return spellsByCategory.value.get(categoryId) || [];
};

// 获取指定环级的法术位数量
const getSpellSlots = (level: number): number => {
  return props.computedStats?.classFeatureInfo?.spellSlots[level] || 0;
};

// 添加法术施展相关的计算属性
const keyAttribute = props.computedStats.combatStats.keyAttribute;
const keyMod = Number(props.computedStats.modifiers[keyAttribute]);
const spellDC = 8  
  + Number(props.computedStats.proficiencyBonus) 
  + Number(keyMod);
const spellAttackMod = `+${Number(props.computedStats.proficiencyBonus) 
  + Number(keyMod)}`;
const mainClass = props.computedStats.mainClass;
// 可准备法术 关键属性调整值＋施法职业等级/圣武游侠的一半/战士游荡者的三分之一
let maxPrepared = 0;
if (['圣武士', '游侠'].includes(mainClass)) {
  maxPrepared = keyMod + Math.floor(props.computedStats.mainLevel / 2); 
} else if (['吟游诗人', '牧师', '德鲁伊', '法师', '术士'].includes(mainClass)) {
  maxPrepared = keyMod + props.computedStats.mainLevel; 
} else if (['战士', '游荡者'].includes(mainClass)) {
  maxPrepared = keyMod + Math.floor(props.computedStats.mainLevel / 3); 
}


</script>

<style scoped>
.spellbook-content {
  margin-top: 1rem;
  position: relative;
  padding-bottom: 3rem;
}

.spell-category {
  margin-bottom: 1rem;
}

.column-headers {
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(200, 200, 200, 0.1);
}

.spell-list {
  padding: 0;
}

.spell-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.9rem;
  align-items: center;
  background-color: rgba(144, 238, 144, 0.1);
  border-bottom: 1px solid var(--color-border);
}

.spell-row:hover {
  background-color: rgba(144, 238, 144, 0.2);
}

.spell-row.striped {
  background-color: rgba(144, 238, 144, 0.15);
}

.header-VnS,
.spell-VnS,
.header-M,
.spell-M {
  min-width: 2rem;
  text-align: left;
}
.header-time,
.spell-time,
.header-usage,
.spell-usage {
  min-width: 4rem;
  text-align: left;
}

.spell-name {
  color: var(--color-text);
  font-weight: 500;
}

.header-name {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spell-slots {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.spell-slot-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-text-soft);
  display: inline-block;
}

.spell-slot-dot:hover {
  background-color: var(--color-text);
}

.spell-cast-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.cast-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-soft);
}

.separator {
  color: var(--color-border);
}

.prepared-spells {
  color: var(--color-text-soft);
}
</style>