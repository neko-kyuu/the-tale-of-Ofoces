<template>
  <div class="character-sheet">
    <CharacterHeader 
      :character="character"
      :computed-stats="computedStats"
      :avatar-path="getCharacterAvatarPath"
    />

    <div class="tab-container">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-item"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>

    <CharacterAttributes 
      v-if="currentTab === 'attributes'"
      :character="character"
      :computed-stats="computedStats"
    />

    <CharacterInventory
      v-else-if="currentTab === 'inventory'"
      :character="character"
      :computed-stats="computedStats"
    />

    <CharacterSpellbook
      v-else-if="currentTab === 'spellbook'"
      :character="character"
      :computed-stats="computedStats"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { CHARACTER_TEMPLATE } from '@/constants/character';
import { characters } from '@/constants/entities';
import { 
  ATTRIBUTES, 
  SKILLS, 
  CLASS_HIT_DICE, 
  RACE_ATTRIBUTES,
  BACKGROUND_ATTRIBUTES,
  CLASS_ATTRIBUTES
} from '@/constants/dnd5e';
import { deepMerge } from '@/utils/mergeHelper';
import CharacterHeader from './CharacterHeader.vue';
import CharacterAttributes from './CharacterAttributes.vue';
import CharacterInventory from './CharacterInventory.vue';
import CharacterSpellbook from './CharacterSpellbook.vue';

const props = defineProps<{
  characterId: number
}>();

const character = CHARACTER_TEMPLATE.get(props.characterId);

// 获取角色头像路径
const getCharacterAvatarPath = computed(() => 
  characters.find(c => c.id === props.characterId)?.path || ''
);

// 计算角色属性
const computedStats = computed(() => {
  // 首先计算基础属性值
  const baseStats = {
    race: character.basicInfo.race,
    background: character.basicInfo.background,
    mainClass: character.class[0].class,
    basicInfo: character.basicInfo,
    combatStats: character.combatStats,

    // 等级计算
    level: (() => {
      const classList = character.class;
      return classList.reduce((total, item) => total + item.level, 0);
    })(),

    levelClass: (() => {
      const classList = character.class;
      return classList.reduce((total, item) => total.concat(`${item.subClass} ${item.level}`), []).join(' / ');
    })(),

    // 熟练属性计算
    proficiencyAbilities: [],
    
    // 基础属性值
    attributes: (() => {
      const attrs: { [key: number]: number } = {};
      for (const [id, score] of Object.entries(character.attributes)) {
        attrs[Number(id)] = score;
      }
      return attrs;
    })(),

    // 双倍熟练技能
    doubleProficientSkills: character.doubleProficientSkills,
    // 熟练技能
    proficientSkills: [],
    // 一半熟练
    halfProficentSkills: (() => {
      return character.class.some(item => item.class === '吟游诗人') ? 
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18] : [];
    })(),

    armorBonus: character.combatStats.armorBonus || 0,
    shieldBonus: character.combatStats.shieldBonus || 0,
    otherACBonus: character.combatStats.otherACBonus || 0,
    
    statusDetails: character.statusDetails,
  };
  // 合并特性
  const raceEnhancedStats = deepMerge(baseStats, RACE_ATTRIBUTES[baseStats.race]);
  const backgroundEnhancedStats = deepMerge(raceEnhancedStats, BACKGROUND_ATTRIBUTES[baseStats.background]);
  const enhancedStatus = deepMerge(backgroundEnhancedStats,CLASS_ATTRIBUTES[baseStats.mainClass])

  // 基于属性值的计算结果
  const computed = {
    ...enhancedStatus,
    
    // 熟练加值计算
    proficiencyBonus: Math.floor((enhancedStatus.level - 1) / 4) + 2,

    // 属性调整值计算
    modifiers: (() => {
      const mods: { [key: number]: string } = {};
      for (const [id, score] of Object.entries(enhancedStatus.attributes)) {
        const modifier = Math.floor((score - 10) / 2);
        mods[Number(id)] = modifier >= 0 ? `+${modifier}` : `${modifier}`;
      }
      return mods;
    })(),
  };

  // 依赖前面计算结果的计算
  const finalComputed = {
    ...computed,
    
    // 豁免加值计算
    savingThrows: (() => {
      const throws: { [key: number]: string } = {};
      for (const [id, score] of Object.entries(enhancedStatus.attributes)) {
        const modifier = Math.floor((score - 10) / 2);
        const proficiencyBonus = computed.proficiencyAbilities.includes(Number(id)) 
          ? computed.proficiencyBonus 
          : 0;
        const total = modifier + proficiencyBonus;
        throws[Number(id)] = total >= 0 ? `+${total}` : `${total}`;
      }
      return throws;
    })(),

    // 生命骰计算
    hitDice: (() => {
      const classList = character.class;
      const conScore = enhancedStatus.attributes[3];
      const conModifier = Math.floor((conScore - 10) / 2);
      const conBonus = enhancedStatus.level * conModifier;
      
      let diceStr = '';
      let baseHP = 0;
      
      classList.forEach((item, index) => {
        const dice = CLASS_HIT_DICE[item.class].hitDice;
        const itemLevel = item.level;
        diceStr += `${index === 0 ? '' : ' + '}${itemLevel}${dice}`;
        baseHP += itemLevel * CLASS_HIT_DICE[item.class].diceValue;
      });

      return {
        formula: `${diceStr} ${conBonus >= 0 ? '+' : ''}${conBonus}`,
        maxHP: baseHP + conBonus
      };
    })(),

    // 计算技能调整值
    skillModifiers:(()=>{
      const throws: { [key: number]: string } = {};
      for (const [index,skill] of Object.entries(SKILLS)) {
        const attributeModifier = Math.floor((enhancedStatus.attributes[skill.attributeId] - 10) / 2);
        let proficiencyBonus = 0;
        if (enhancedStatus.doubleProficientSkills?.includes(skill.id)) {
          proficiencyBonus = computed.proficiencyBonus* 2;
        } else if (enhancedStatus.proficientSkills?.includes(skill.id)) {
          proficiencyBonus = computed.proficiencyBonus;
        } else if (enhancedStatus.halfProficentSkills?.includes(skill.id)) {
          proficiencyBonus = Math.floor(computed.proficiencyBonus/ 2);
        }

        const total = attributeModifier + proficiencyBonus;
        throws[Number(skill.id)] = total >= 0 ? `+${total}` : `${total}`;
      }
      return throws;
    })(),

    // 计算AC
    ac: (() => {
      const baseAC = 10;
      const armorBonus = enhancedStatus.armorBonus;
      const shieldBonus = enhancedStatus.shieldBonus;
      const dexModifier = Number(computed.modifiers[2]);
      const otherBonus = enhancedStatus.otherACBonus;

      const maxBonus = Math.min((armorBonus + dexModifier), 8);

      return {
        normal: baseAC + maxBonus + shieldBonus + otherBonus,
        flatFooted: baseAC + armorBonus + otherBonus,
        touch: baseAC + dexModifier + otherBonus
      };
    })(),
    // ... 其他需要计算的属性
  };

  console.log(finalComputed)
  // 与角色中的显式设置合并
  return deepMerge(finalComputed, character.overrides);
});



const tabs = [
  { id: 'attributes', label: '属性' },
  { id: 'inventory', label: '持有物' },
  { id: 'spellbook', label: '法术书' }
];

const currentTab = ref('attributes');
</script>

<style scoped>
.character-sheet {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  color: var(--color-text);
}

.tab-container {
  display: flex;
  gap: 1px;
  border-bottom: 1px solid var(--color-background-mute);
}

.tab-item {
  padding: 0 1rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
  font-size: 0.9rem;
}

.tab-item:hover {
  color: var(--color-background-highlight);
}

.tab-item.active {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: var(--color-background-mute);
  font-weight: 500;
}
</style>
