<template>
  <div class="character-sheet">
    <!-- 顶部信息栏 -->
    <div class="header-section">
      <div class="avatar-container">
        <img :src="getStaticPath(getCharacterAvatarPath)" alt="Character Avatar" class="avatar-image">
      </div>
      <div class="basic-info">
        <div class="name-row">
          <h2 class="character-name">{{ character.name }}</h2>
          <span class="challenge-rating">CR {{ character.challengeRating }}</span>
        </div>
        <div class="traits-row">
          <span class="trait">{{ character.size }}</span>
          <span class="trait">{{ character.alignment }}</span>
          <span class="trait">{{ character.type }}</span>
          <span class="reference">{{ character.reference }}</span>
        </div>
        <div class="stats-row">
          <div class="stat-item">
            <label>Hit Points</label>
            <div class="stat-value">{{ character.hitPoints.current }} / {{ character.hitPoints.maximum }}</div>
            <span class="stat-note">{{ character.hitPoints.hitDice }}</span>
          </div>
          <div class="stat-item">
            <label>Armor Class</label>
            <div class="stat-value">{{ character.armorClass }}</div>
            <span class="stat-note">Proficiency +{{ getProficiencyBonus(character.level) }}</span>
          </div>
          <div class="stat-item">
            <label>Speed</label>
            <div class="stat-value">{{ character.speed }}</div>
            <span class="stat-note">Special Movement</span>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="attributes-section">
        <div 
          v-for="attr in ATTRIBUTES" 
          :key="attr.id" 
          class="attribute-box"
        >
          <h3>{{ attr.name }}</h3>
          <div class="score-box">
            <span 
              class="modifier" 
              :data-tooltip="`属性调整值:\n
              将该项属性值减去10在将结果除以 2（向下取整）。
              `"
            >
              {{ calculateModifier(character.attributes[attr.id]) }}
            </span>
            <div class="main-score">
              {{ character.attributes[attr.id] }}
              <div class="proficiency-dot" :class="{ active: character.proficientAttributes.includes(attr.id) }"></div>
            </div>
            <span 
              class="modifier"
              :data-tooltip="`豁免检定是用于判断角色是否能够抵抗或免除某种效果或伤害的机制。\n
              豁免加值由角色的属性、熟练度、特殊效果等因素决定。
              `"
            >
              {{ calculateBonus(attr.id) }}
            </span>
          </div>
        </div>
      </div>

      <div class="skill-section">
        <div class="skill-list">
          <template v-for="attr in ATTRIBUTES" :key="attr.id">
            <template v-if="getSkillsByAttribute(attr.id).length > 0">
              <div class="skill-group-header">
                {{ attr.name }}系
              </div>
              <div 
                v-for="skill in getSkillsByAttribute(attr.id)" 
                :key="skill.id" 
                class="skill-item"
                :class="{ 'striped': skill.id % 2 === 0 }"
              >
                <div class="proficiency-dot" :class="{ active: character.proficientSkills?.includes(skill.id) }"></div>
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-modifier">{{ calculateSkillModifier(skill) }}</span>
                <!-- <span class="skill-attr">({{ getAttributeAbbr(skill.attributeId) }})</span> -->
              </div>
            </template>
          </template>
        </div>
      </div>

      <div class="other-section">
        <!-- 基本信息表格 -->
        <div class="info-grid">
          <!-- 左侧信息组 -->
          <div class="info-group">
            <div class="info-row">
              <div class="info-label">种族</div>
              <div class="info-value">{{ character.race }}</div>
              <div class="info-label">亚种</div>
              <div class="info-value">{{ character.subrace }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">性别</div>
              <div class="info-value">{{ character.gender }}</div>
              <div class="info-label">阵营</div>
              <div class="info-value">{{ character.alignment }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">背景</div>
              <div class="info-value">{{ character.background }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">身高</div>
              <div class="info-value">{{ character.height }}</div>
              <div class="info-label">体重</div>
              <div class="info-value">{{ character.weight }}</div>
            </div>
          </div>

          <!-- 右侧信息组 -->
          <div class="info-group color-group">
            <div class="info-row">
              <div class="info-label">发色</div>
              <div class="info-value">
                <div class="color-box" :style="{ backgroundColor: character.hairColor }"></div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">肤色</div>
              <div class="info-value">
                <div class="color-box" :style="{ backgroundColor: character.skinColor }"></div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">瞳色</div>
              <div class="info-value">
                <div class="color-box" :style="{ backgroundColor: character.eyeColor }"></div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">指甲色</div>
              <div class="info-value">
                <div class="color-box" :style="{ backgroundColor: character.nailColor }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 种族特性 -->
        <div class="feature-box">
          <h3>种族特性</h3>
          <div 
            v-for="(desc, name, index) in character.racialTraits" 
            :key="name"
            class="feature-item"
            :class="{ 'striped': index % 2 === 0 }"
          >
            <span class="feature-name">{{ name }}</span>
            <span class="feature-desc">{{ desc }}</span>
          </div>
        </div>

        <!-- 其他特性 -->
        <div class="feature-box">
          <h3>其他特性</h3>
          <div 
            v-for="(item, index) in otherFeatures" 
            :key="item.label"
            class="feature-item"
            :class="{ 'striped': index % 2 === 0 }"
          >
            <span class="feature-name">{{ item.label }}</span>
            <span class="feature-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ATTRIBUTES, SKILLS } from '@/constants/types';
import { CHARACTER_TEMPLATE } from '@/constants/character';
import { characters } from '@/constants/entities';
import { computed } from 'vue';
import { getStaticPath } from '@/utils/assets'

const props = defineProps<{
  characterId: number
}>();

// 获取角色头像路径
const getCharacterAvatarPath = computed(() => 
  characters.find(c => c.id === props.characterId)?.path || ''
);

const character = CHARACTER_TEMPLATE.get(props.characterId);

// 计算调整值
const calculateModifier = (score: number): string => {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

// 计算熟练加值
const getProficiencyBonus = (level: number): number => {
  return Math.floor((level - 1) / 4) + 2;
};

// 计算总加值
const calculateBonus = (attributeId: number): string => {
  const score = character.attributes[attributeId];
  const modifier = Math.floor((score - 10) / 2);
  const proficiencyBonus = character.proficientAttributes.includes(attributeId) 
    ? getProficiencyBonus(character.level) 
    : 0;
  const total = modifier + proficiencyBonus;
  return total >= 0 ? `+${total}` : `${total}`;
};

// 获取属性简称
const getAttributeAbbr = (attributeId: number): string => {
  const attributeAbbrs = {
    1: 'Str',
    2: 'Dex',
    3: 'Con',
    4: 'Int',
    5: 'Wis',
    6: 'Cha'
  };
  return attributeAbbrs[attributeId];
};

// 计算技能调整值
const calculateSkillModifier = (skill: any): string => {
  const attributeModifier = Math.floor((character.attributes[skill.attributeId] - 10) / 2);
  const proficiencyBonus = character.proficientSkills?.includes(skill.id) 
    ? getProficiencyBonus(character.level) 
    : 0;
  const total = attributeModifier + proficiencyBonus;
  return total >= 0 ? `+${total}` : `${total}`;
};

// 按属性分组获取技能
const getSkillsByAttribute = (attributeId: number) => {
  return SKILLS.filter(skill => skill.attributeId === attributeId);
};

// 其他特性数组（用于方便渲染和控制顺序）
const otherFeatures = [
  { label: '语言', value: character.languages },
  { label: '工具', value: character.tools },
  { label: '施法间隔', value: `${character.spellSlots?.current || 0} / ${character.spellSlots?.maximum || 3}` },
  { label: '激励', value: `${character.inspiration?.current || 0} / ${character.inspiration?.maximum || 1}` },
  { label: '伤害', value: character.damage },
  { label: '声望', value: character.reputation },
  { label: '威胁', value: character.threat },
  { label: '祝福', value: character.blessing },
  { label: '护符', value: character.amulet },
  { label: '传奇恩惠', value: character.legendaryFavor }
].map(item => ({
  ...item,
  value: item.value || '-'
}));
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

.header-section {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.basic-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.character-name {
  font-size: 1.5rem;
  margin: 0;
}

.challenge-rating {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
}

.traits-row {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.trait {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
}

.reference {
  color: var(--color-text);
  opacity: 0.7;
}

.stats-row {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item label {
  font-size: 0.8rem;
  opacity: 0.7;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.stat-note {
  font-size: 0.8rem;
  opacity: 0.7;
}

.attributes-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.attribute-box {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem;
  text-align: center;
}

.attribute-box h3 {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
}

.main-score {
  font-size: 1.5rem;
  font-weight: bold;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.proficiency-dot {
  width: 8px;
  height: 8px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
}

.proficiency-dot.active {
  background-color: var(--color-background-highlight);
  border-color: var(--color-background-highlight);
}

.modifier {
  font-size: 0.9rem;
  opacity: 0.8;
  width: 24px; /* 固定宽度确保对齐 */
  text-align: center;
  position: relative;
}

.modifier[data-tooltip] {
  cursor: help;
}

.modifier[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  /* transform: translateX(-50%); */
  padding: 4px 8px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: pre-line;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  width: max-content;    
  max-width: 200px;
  text-align: left;     
}

.modifier[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
}

.score-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem;
}

.skill-section {
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  padding: 0 0.5rem;
}

.skill-list {
  display: flex;
  flex-direction: column;
  padding: 0.25rem;
}

.skill-group-header {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--color-text);
  opacity: 0.8;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.25rem;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.15rem 0.25rem;
  border-radius: 2px;
}

.skill-item.striped {
  background-color: var(--color-background-mute);
}

.skill-modifier {
  width: 2.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.skill-name {
  flex: 1;
  font-size: 0.9rem;
}

.skill-attr {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.85rem;
  width: 3rem;
  text-align: right;
}

/* 第一个组标题不需要上边距 */
.skill-list > :first-child .skill-group-header {
  padding-top: 0;
}

.other-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.other-box {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1rem;
}

.other-box h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.other-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border-soft);
}

.other-item:last-child {
  border-bottom: none;
}

.item-label {
  color: var(--color-text);
  font-size: 0.9rem;
}

.item-value {
  font-size: 0.9rem;
  font-family: monospace;
}

.main-content {
  display: grid;
  grid-template-columns: 200px 260px auto; 
  gap: 1rem;
  margin-top: 1rem;
}

.feature-box {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.feature-box h3 {
  margin: 0;
  font-size: 1rem;
  text-align: center;
  padding: 0.5rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}

.feature-item.striped {
  background-color: var(--color-background-soft);
}

.feature-name {
  color: var(--color-text);
  font-size: 0.9rem;
}

.feature-desc, .feature-value {
  text-align: right;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
}

.feature-desc {
  flex: 1;
  margin-left: 0.5rem;
  font-size: 0.85rem;
}

.other-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 1.5rem;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.9rem;
  padding: 0.15rem 0;
}

/* 对需要四列布局的行使用特殊样式 */
.info-group:first-child .info-row:first-child,
.info-group:first-child .info-row:nth-child(2),
.info-group:first-child .info-row:last-child {
  grid-template-columns: auto 1fr auto 1fr;
}

.info-label {
  color: var(--color-text);
  opacity: 0.8;
  white-space: nowrap;
}

.info-value {
  color: var(--color-text);
  background-color: var(--color-background-soft);
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
  min-width: 2em;
}

/* 颜色组特殊样式 */
.color-group .info-row {
  grid-template-columns: auto 3rem;
}

.color-box {
  width: 1rem;
  height: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 2px;
}

.color-group .info-value {
  background-color: transparent;
  padding: 0;
  min-width: auto;
}
</style>
