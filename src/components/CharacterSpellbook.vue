<template>
  <div class="spellbook-content">
    <div v-for="category in spellCategories" :key="category.id" class="spell-category">
      <div class="column-headers" 
        v-if="getSpellSlots(category.level - 1) > 0 || category.id === 'cantrips'">
        <div class="header-name">
          <button 
            v-if="isElectron"
            class="control-button" 
            :class="{ 'disabled': !isEditing }"
            @click="addSpell(category.id)"
            title="添加法术"
          >
            <i class="fi fi-rr-plus"></i>
          </button>
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
        <div class="header-time">施法时间</div>
        <div class="header-usage">持续时间</div>
        <div class="header-actions"></div>
      </div>
      <div class="spell-list">
        <div 
          v-for="spell in getSpellsByCategory(category.id)" 
          :key="spell.id" 
          class="spell-row"
          :class="{ 'striped': spell.id % 2 === 0 }"
        >
          <div class="spell-name"
            :contenteditable="isEditing" 
            @blur="updateSpell($event, spell, 'name')">
          {{ spell.name }}</div>
          <div class="spell-VnS"
            :contenteditable="isEditing" 
            @blur="updateSpell($event, spell, 'VnS')">
          {{ spell.VnS }}</div>
          <div class="spell-M"
            :contenteditable="isEditing" 
            @blur="updateSpell($event, spell, 'M')">
          {{ spell.M }}</div>
          <div class="spell-time"
            :contenteditable="isEditing" 
            @blur="updateSpell($event, spell, 'time')">
          {{ spell.time }}</div>
          <div class="spell-usage"
            :contenteditable="isEditing" 
            @blur="updateSpell($event, spell, 'usage')">
          {{ spell.usage }}</div>
          <div class="spell-actions">
            <button 
              v-if="isElectron && isEditing"
              class="control-button" 
              @click="deleteSpell(spell)"
              title="删除法术"
            >
              <i class="fi fi-rr-minus"></i>
            </button>
          </div>
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
        已知法术：{{ props.computedStats.mainClassFeatureInfo.knownSpells || '-' }}
        <span class="separator">|</span>
        可准备法术：{{ maxPrepared }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { OptionalCharacter, OptionalComputedStats } from '@/types/dnd5e';
import { ATTRIBUTES } from '@/constants/dnd5e';
import { SPELLS } from '@/constants/spells';
import { Spell } from '@/types/dnd5e';

const isElectron = !!window.electronAPI

const props = defineProps<{
  character: OptionalCharacter;
  computedStats: OptionalComputedStats;
  isEditing: boolean;
}>();
const emit = defineEmits(['update:spellbook']);

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

const alwaysPreparedSpells = props.computedStats.alwaysPreparedSpells;

// 虚拟数据
const spellbook = ref(props.character.spellbook || []);
watch(()=>spellbook.value,()=>{
  emit('update:spellbook', spellbook.value)
})

const spellsByCategory = computed(() => {
  const result = new Map();
  
  spellCategories.forEach(category => {
    result.set(
      category.id,
      spellbook.value.filter(spell => spell.categoryId === category.id)
    );
  });
  
  return result;
});

const getSpellsByCategory = computed(() => (categoryId: string) => {
  const spells = spellsByCategory.value.get(categoryId) || [];
  const categoryLevel = spellCategories.find(c => c.id === categoryId)?.level || 0;
  
  // 如果不是戏法，且该环阶没有法术位，直接返回空数组
  if (categoryId !== 'cantrips' && getSpellSlots(categoryLevel - 1) === 0) {
    return [];
  }
  
  if (alwaysPreparedSpells?.length) {
    const preparedSpellsInCategory = alwaysPreparedSpells
      .map(spellName => {
        const spellData = SPELLS.get(spellName);
        if (!spellData) return null;

        const isBaseLevel = spellData.level === categoryLevel;
        const canUpcast = categoryLevel > spellData.level;

        // 只有在有法术位的环阶才显示法术
        if ((isBaseLevel || (canUpcast && 
            (spellData.upcastable === undefined || categoryLevel <= spellData.upcastable)))) {
          return {
            id: `always-${spellName}-${categoryLevel}`,
            name: spellName,
            VnS: [
              spellData.verbal ? 'V' : '',
              spellData.somatic ? 'S' : ''
            ].filter(Boolean).join(','),
            M: spellData.material ? 'M' : '',
            time: spellData.castingTime,
            usage: spellData.duration,
            categoryId
          };
        }
        return null;
      })
      .filter(Boolean);

    return [...spells, ...preparedSpellsInCategory];
  }

  return spells;
});

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
let maxPrepared = keyMod;
const classList = props.computedStats.classList;
classList.forEach(item => {
  if (['圣武士', '游侠'].includes(item.class)) {
    maxPrepared += Math.floor(item.level / 2); 
  } else if (['吟游诗人', '牧师', '德鲁伊', '法师', '术士'].includes(item.class)) {
    maxPrepared += item.level; 
  } else if (['战士', '游荡者'].includes(item.class)) {
    maxPrepared += Math.floor(item.level / 3); 
  }
})

// 添加法术
const addSpell = async (categoryId: string) => {
  const newSpell = {
    name: '',
    VnS: '',
    M: '',
    time: '',
    usage: '',
    categoryId: categoryId
  };
  
  spellbook.value = [...spellbook.value, newSpell];
};

// 删除法术
const deleteSpell = (spell: Spell) => {
  const index = spellbook.value.findIndex(s => s.id === spell.id);
  if (index !== -1) {
    spellbook.value.splice(index, 1);
  }
};

const updateSpell = (event: FocusEvent, spell: Spell, key: string) => {
  const target = event.target as HTMLElement;
  const value = target.textContent || null;

  const targetSpell = spellbook.value.find(i => i.name === spell.name && i.categoryId === spell.categoryId);

  if (targetSpell) {
    targetSpell[key] = value;
    // 强制更新数组以触发响应式
    spellbook.value = [...spellbook.value];
  }
  // 更新显示格式
  target.textContent = value;
};
</script>

<style scoped>
.control-button {
  background: var(--color-danger-bg);
  color: var(--vt-c-white);
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: inset 0 -2px var(--color-background-mute);
}

.control-button:hover {
  background-color: var(--color-danger-bg);
}

.control-button i {
  font-size: 0.6rem;
}

.control-button.disabled {
  background-color: var(--color-background-mute);
  cursor: not-allowed;
}

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
  grid-template-columns: 1fr auto auto 100px 100px auto;
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
  grid-template-columns: 1fr auto auto 100px 100px auto;
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

.header-actions {
  text-align: center;
  min-width: 20px;
}

.spell-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>