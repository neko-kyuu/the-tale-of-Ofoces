<template>
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
            :data-tooltip="`属性调整值:
            将该项属性值减去10在将结果除以 2（向下取整）。
            `"
        >
            {{ calculateModifier(attr.id) }}
        </span>
        <div class="main-score">
            {{ character.attributes[attr.id] }}
            <div class="proficiency-dot" :class="{ active: getProficiencyAbility().includes(attr.id) }"
              :data-tooltip="`豁免熟练项的作用与技能熟练项一样，具有某属性豁免熟练项的角色进行相应属性豁免时，可以将其熟练加值加入豁免检定结果中。`"
            ></div>
        </div>
        <span 
            class="modifier"
            :data-tooltip="`豁免检定是用于判断角色是否能够抵抗或免除某种效果或伤害的机制。
            豁免加值由角色的属性、熟练度、特殊效果等因素决定。
            `"
        >
            {{ getSavingThrow(attr.id) }}
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
            <div 
                class="proficiency-dot" 
                :class="{
                'double': getDoubleProficientSkills()?.includes(skill.id),
                'active': !getDoubleProficientSkills()?.includes(skill.id) && 
                            getProficienctSkills()?.includes(skill.id),
                'half': !getDoubleProficientSkills()?.includes(skill.id) && 
                        !getProficienctSkills()?.includes(skill.id) && 
                        getHalfProficientSkills()?.includes(skill.id)
                }"
            ></div>
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-modifier">{{ calculateSkillModifier(skill.id) }}</span>
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
            <div class="info-value">{{ character.basicInfo.race }}</div>
            <div class="info-label">亚种</div>
            <div class="info-value">{{ character.basicInfo.subrace }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">性别</div>
            <div class="info-value">{{ character.basicInfo.gender }}</div>
            <div class="info-label">年龄</div>
            <div class="info-value">{{ character.basicInfo.age }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">背景</div>
            <div class="info-value">{{ character.basicInfo.background }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">身高</div>
            <div class="info-value">{{ character.basicInfo.appearance.height }}</div>
            <div class="info-label">体重</div>
            <div class="info-value">{{ character.basicInfo.appearance.weight }}</div>
        </div>
        </div>

        <!-- 右侧信息组 -->
        <div class="info-group color-group">
        <div class="info-row">
            <div class="info-label">发色</div>
            <div class="info-value">
            <div class="color-box" :style="{ backgroundColor: character.basicInfo.appearance.hairColor }"></div>
            </div>
        </div>
        <div class="info-row">
            <div class="info-label">肤色</div>
            <div class="info-value">
            <div class="color-box" :style="{ backgroundColor: character.basicInfo.appearance.skinColor }"></div>
            </div>
        </div>
        <div class="info-row">
            <div class="info-label">瞳色</div>
            <div class="info-value">
            <div class="color-box" :style="{ backgroundColor: character.basicInfo.appearance.eyeColor }"></div>
            </div>
        </div>
        <div class="info-row">
            <div class="info-label">指甲色</div>
            <div class="info-value">
            <div 
                class="color-box" 
                :class="{ 'disabled': !character.basicInfo.appearance.nailColor }"
                :style="{ backgroundColor: character.basicInfo.appearance.nailColor || '#ffffff' }"
            ></div>
            </div>
        </div>
        </div>
    </div>

    <!-- 状态列表 -->
    <div class="status-list">
        <div 
        v-for="status in statusItems" 
        :key="status.id"
        class="status-item"
        >
        <i :class="status.icon"></i>
        <span class="status-label">{{ status.label }}</span>
        <div class="status-detail" v-if="status.detailKey">
            {{ formatStatusDetail(props.computedStats.statusDetails[status.detailKey]) }}
        </div>
        </div>
    </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { OptionalCharacter, OptionalComputedStats } from '@/types/dnd5e';
import { 
  ATTRIBUTES, 
  SKILLS, 
} from '@/constants/dnd5e';

const props = defineProps<{
    character: OptionalCharacter,
    computedStats: OptionalComputedStats,
}>();

// 格式化状态详情
const formatStatusDetail = (detail: string | string[] | undefined): string => {
  if (!detail) return '';
  if (Array.isArray(detail)) {
    return detail.join(', ');
  }
  return detail;
};

// 使用计算属性进行渲染或进一步计算
const getProficiencyAbility = () => props.computedStats.proficiencyAbilities;
const calculateModifier = (attrId: number): string => props.computedStats.modifiers[attrId];
const getSavingThrow = (attrId: number): string => props.computedStats.savingThrows[attrId];
const getDoubleProficientSkills = () => props.computedStats.doubleProficientSkills;
const getProficienctSkills = () => props.computedStats.proficientSkills;
const getHalfProficientSkills = () => props.computedStats.halfProficentSkills;
const calculateSkillModifier = (skillId: number): string => props.computedStats.skillModifiers[skillId];

// 按属性分组获取技能
const getSkillsByAttribute = (attributeId: number) => {
  return SKILLS.filter(skill => skill.attributeId === attributeId);
};

// 状态列表数据
const statusItems = [
  { id: 1, icon: 'fi fi-sr-eye', label: '感官', detailKey: 'VISION'},
  { id: 2, icon: 'fi fi-sr-comments', label: '语言',detailKey: 'LANGUAGES'},
  { id: 3, icon: 'fi fi-sr-shield',  label: '伤害免疫', detailKey: 'DAMAGE_IMMUNITY'},
  { id: 4, icon: 'fi fi-sr-shield-plus', label: '伤害抗性', detailKey: 'DAMAGE_RESISTANCE' },
  { id: 5, icon: 'fi fi-sr-skull', label: '易伤', detailKey: 'VULNERABILITY' },
  { id: 6, icon: 'fi fi-sr-sparkles', label: '伤害加成', detailKey: 'DAMAGE_BONUS' },
  { id: 7, icon: 'fi fi-sr-circle-heart', label: '状态免疫', detailKey: 'STATUS_IMMUNITY' },
  { id: 8, icon: 'fi fi-sr-sword', label: '武器熟练', detailKey: 'WEAPON_PROFICIENCY' },
  { id: 9, icon: 'fi fi-sr-shield-check', label: '护甲熟练', detailKey: 'ARMOR_PROFICIENCY' },
  { id: 10, icon: 'fi fi-bs-tools', label: '工具', detailKey: 'TOOLS' },
  { id: 11, icon: 'fi fi-sr-chess-queen', label: '声望', detailKey: 'REPUTATION' },
  { id: 12, icon: 'fi fi-sr-cross-religion', label: '祝福', detailKey: 'BLESSING' },
  { id: 13, icon: 'fi fi-ss-brand', label: '护符', detailKey: 'AMULET' },
  { id: 14, icon: 'fi fi-sr-diamond', label: '传奇恩惠', detailKey: 'LEGENDARY_FAVOR' }
];

</script>
<style scoped>
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
  color: var(--color-text-soft);
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
  position: relative;
  background-color: var(--color-background-soft);
}

.proficiency-dot.active {
  background-color: var(--color-background-highlight);
  border-color: var(--color-background-highlight);
}

.proficiency-dot.double {
  background-color: var(--color-background-highlight);
  border-color: var(--color-background-highlight);
}

.proficiency-dot.double::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid var(--color-background-highlight);
  border-radius: 50%;
  top: -3px;
  left: -3px;
}

.proficiency-dot.half {
  background-color: transparent;
  border: 1px solid var(--color-border);
  position: relative;
}

.proficiency-dot.half::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: var(--color-background-highlight);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.modifier {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  width: 24px; /* 固定宽度确保对齐 */
  text-align: center;
  position: relative;
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
  color: var(--color-text-soft);
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
  color: var(--color-text-soft);
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
  color: var(--color-text-soft);
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
  color: var(--color-text-soft);
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
  position: relative;
}

.color-box.disabled::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 140%;    
  height: 1px;    
  background-color: var(--color-border);
  transform: rotate(-45deg);
  transform-origin: top right;
}

.color-group .info-value {
  background-color: transparent;
  padding: 0;
  min-width: auto;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem;
}

.status-item {
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  background-color: var(--color-background-soft);
  border-radius: 2px;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.5rem;
}

.status-item i {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  width: 1.2rem;
  text-align: center;
}

.status-label {
  color: var(--color-text);
  white-space: nowrap;
  width: 80px;
}

.status-detail {
  color: var(--color-text-soft);
  flex: 1;
}

/* 添加通用的 tooltip 样式 */
[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  padding: 4px 8px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.4;
  white-space: pre-line;
  width: max-content;
  max-width: 300px;
  text-align: left;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  text-shadow: 
    -1px -1px 0 var(--color-background-soft),
    1px -1px 0 var(--color-background-soft),
    -1px 1px 0 var(--color-background-soft),
    1px 1px 0 var(--color-background-soft);
}

[data-tooltip] {
  position: relative;
  cursor: help;
}

[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
}
</style>