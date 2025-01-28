<template>
  <div class="character-sheet" v-if="character">
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
      :isEditing="isEditing"
    />

    <CharacterSpellbook
      v-else-if="currentTab === 'spellbook'"
      :character="character"
      :computed-stats="computedStats"
      :isEditing="isEditing"
    />

    <CharacterFeatures
      v-else-if="currentTab === 'features'"
      :character="character"
      :computed-stats="computedStats"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { characters } from '@/constants/entities';
import { 
  ATTRIBUTES, 
  SKILLS, 
  CLASS_HIT_DICE, 
  RACE_ATTRIBUTES,
  BACKGROUND_ATTRIBUTES,
  CLASS_ATTRIBUTES,
  SUB_RACE_ATTRIBUTES
} from '@/constants/dnd5e';
import { deepMerge } from '@/utils/mergeHelper';
import CharacterHeader from '@/components/CharacterHeader.vue';
import CharacterAttributes from '@/components/CharacterAttributes.vue';
import CharacterInventory from '@/components/CharacterInventory.vue';
import CharacterSpellbook from '@/components/CharacterSpellbook.vue';
import CharacterFeatures from '@/components/CharacterFeatures.vue';
import { getStaticPath } from '@/utils/assets'

const props = defineProps<{
  characterId: number,
  isEditing: boolean
}>();

const character = ref(null);

const loadCharacterTemplate = async () => {
  try {
    const response = await fetch(getStaticPath('/static/json/character_template.json'));
    const data = await response.json();
    character.value = data[props.characterId];
  } catch (error) {
    console.error('加载角色模板失败:', error);
  }
};

// 加载json数据
onMounted(() => {
  loadCharacterTemplate();
})

watch(() => props.isEditing, (newValue) => {
  console.log('CharacterPreview isEditing changed:', newValue)
})

// 获取角色头像路径
const getCharacterAvatarPath = computed(() => 
  characters.find(c => c.id === props.characterId)?.path || ''
);

interface ClassFeatureInfo {
  className: string;
  level: number;
  feature: string;
}

// 计算角色属性
const computedStats = computed(() => {
  if (!character.value) {
    return null;
  }

  // 首先计算基础属性值
  const baseStats = {
    race: character.value.basicInfo.race,
    subRace: character.value.basicInfo.subrace,
    background: character.value.basicInfo.background,
    basicInfo: character.value.basicInfo,

    armorBonus: character.value.combatStats.armorBonus || 0,
    shieldBonus: character.value.combatStats.shieldBonus || 0,
    otherACBonus: character.value.combatStats.otherACBonus || 0,
    
    statusDetails: character.value.statusDetails,
    classFeatureInfo: {},
    
    inventoryItem: character.value.inventoryItem,

    classList: character.value.class,
    classLevelMap: (() => {
      const levelArray = [];
      const processedClasses = new Set();
      
      character.value.class.forEach(classItem => {
        if (!processedClasses.has(classItem.class)) {
          const totalLevel = character.value.class
            .filter(c => c.class === classItem.class)
            .reduce((sum, c) => sum + c.level, 0);
          
          levelArray.push({
            class: classItem.class,
            level: totalLevel
          });
          
          processedClasses.add(classItem.class);
        }
      });
      
      return levelArray;
    })(),
  }

  const levelStats = {
    ...baseStats,

    mainClass: character.value.class[0].class,
    combatStats: character.value.combatStats,

    // 等级计算
    level: (() => {
      const classList = character.value.class;
      return classList.reduce((total, item) => total + item.level, 0);
    })(),

    levelClass: (() => {
      const classList = character.value.class;
      return classList.reduce((total, item) => total.concat(`${item.subClass} ${item.level}`), []).join(' / ');
    })(),

    mainLevel: baseStats.classLevelMap[0].level || 0,
    // 施法等级
    spellcastingLevel: (() => {
      const classList = baseStats.classLevelMap;
      let level = 0;
      classList.forEach(item => {
      if (['圣武士', '游侠'].includes(item.class)) {
        level += Math.floor(item.level / 2); 
      } else if (['吟游诗人', '牧师', '德鲁伊', '法师', '术士'].includes(item.class)) {
        level += item.level; 
      } else if (['战士', '游荡者'].includes(item.class)) {
        level += Math.floor(item.level / 3); 
      }
      })
      return level;
    })(),

    // 熟练属性计算
    proficiencyAbilities: [],
    
    // 基础属性值
    attributes: (() => {
      const attrs: { [key: number]: number } = {};
      for (const [id, score] of Object.entries(character.value.attributes)) {
        attrs[Number(id)] = score;
      }
      return attrs;
    })(),

    // 双倍熟练技能
    doubleProficientSkills: character.value.doubleProficientSkills,
    // 熟练技能
    proficientSkills: [],
    // 一半熟练
    halfProficentSkills: (() => {
      return character.value.class.some(item => item.class === '吟游诗人') ? 
        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18] : [];
    })(),
  };
  // 合并特性
  const raceEnhancedStats = deepMerge(levelStats, RACE_ATTRIBUTES[levelStats.race]);
  const subRaceEnhancedStats = deepMerge(raceEnhancedStats, SUB_RACE_ATTRIBUTES[levelStats.subRace]);
  const backgroundEnhancedStats = deepMerge(subRaceEnhancedStats, BACKGROUND_ATTRIBUTES[levelStats.background]);
  const enhancedStatus = deepMerge(backgroundEnhancedStats,CLASS_ATTRIBUTES[levelStats.mainClass])


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

    classFeatureInfo:(() =>{
      if(enhancedStatus.classList.length > 1){
        return CLASS_ATTRIBUTES['兼职施法者'].classFeatureInfo.get(enhancedStatus.spellcastingLevel)
      } else {
        return CLASS_ATTRIBUTES[levelStats.mainClass].classFeatureInfo.get(enhancedStatus.level)
      }
    })(),

    mainClassFeatureInfo: CLASS_ATTRIBUTES[levelStats.mainClass].classFeatureInfo.get(enhancedStatus.mainLevel)
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
      const classList = character.value.class;
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

    // 计算职业特性
    classFeatures: (() => {
      const features: ClassFeatureInfo[] = [];
      
      // 遍历每个职业
      levelStats.classLevelMap.forEach(classInfo => {
        const className = classInfo.class;
        const classLevel = classInfo.level;
        
        // 获取职业特性信息
        const classAttributes = CLASS_ATTRIBUTES[className];
        if (!classAttributes)  return;

        // 获取该职业的特性Map
        const featureInfo = classAttributes.classFeatureInfo;
        if (!featureInfo) return;

        // 从1级开始，遍历到当前等级
        for (let level = 1; level <= classLevel; level++) {
          const levelFeatures = featureInfo.get(level);
          if (levelFeatures) {
            // 如果是数组，添加所有特性
            if (Array.isArray(levelFeatures)) {
              levelFeatures.forEach(feature => {
                features.push({
                  className,
                  level,
                  feature
                });
              });
            } else {
              features.push({
                className,
                level,
                feature: levelFeatures.classFeature
              });
            }
          }
        }
      });

      return features;
    })(),

    // 计算法术
    alwaysPreparedSpells: (() => {
      const preparedSpells = new Set<string>();
      
      // 遍历每个职业
      levelStats.classLevelMap.forEach(classInfo => {
        const className = classInfo.class;
        const classLevel = classInfo.level;
        
        // 获取职业特性信息
        const classAttributes = CLASS_ATTRIBUTES[className];
        if (!classAttributes) return;

        // 获取该职业的特性Map
        const featureInfo = classAttributes.classFeatureInfo;
        if (!featureInfo) return;

        // 从1级开始，遍历到当前等级
        for (let level = 1; level <= classLevel; level++) {
          const levelFeatures = featureInfo.get(level);
          if (levelFeatures?.alwaysPreparedSpells) {
            // 将该等级的始终准备法术添加到集合中
            levelFeatures.alwaysPreparedSpells.forEach(spell => 
              preparedSpells.add(spell)
            );
          }
        }
      });

      return Array.from(preparedSpells);
    })(),
  };

  // 与角色中的显式设置合并
  return deepMerge(finalComputed, character.value.overrides);
});



const tabs = [
  { id: 'attributes', label: '属性' },
  { id: 'inventory', label: '持有物' },
  { id: 'spellbook', label: '法术书' },
  { id: 'features', label: '特性' }
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
