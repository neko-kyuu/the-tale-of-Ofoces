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
          <span class="challenge-rating">CR {{ getLevel() }}</span>
        </div>
        <div class="traits-row">
          <span class="trait">{{ character.size }}</span>
          <span class="trait">{{ character.alignment }}</span>
          <span class="trait">{{ character.type }}</span>
          <a 
            class="reference" 
            :href="character.referenceUrl" 
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ character.reference }}
          </a>
        </div>
        <div class="stats-row">
          <div class="stat-item">
            <label>HP</label>
            <div class="stat-value">{{ getHitDice().maxHP }}</div>
            <span class="stat-note">{{ getHitDice().hitDice }}</span>
          </div>
          <div class="stat-item">
            <label
              :data-tooltip="`AC:
                标准AC = 10 + 盔甲加值 + 盾牌加值 + 敏捷调整值 + 其他调整值;
                措手不及 = 10 + 盔甲加值 + 其他调整值;
                接触 = 10 + 敏捷调整值 + 其他调整值
              `"
            >AC</label>
            <div class="stat-value">
              {{ calculateAC().normal }}/{{ calculateAC().flatFooted }}/{{ calculateAC().touch }}
            </div>
            <span 
              class="stat-note"
              :data-tooltip="`熟练加值:
                熟练加值适用于许多你将记录在角色卡上的事项。
                • 使用拥有熟练项的武器发动攻击检定时
                • 施展的法术发动攻击检定时
                • 使用拥有熟练项的技能进行属性检定时
                • 使用拥有熟练项的工具进行属性检定时
                • 使用拥有熟练项的豁免属性进行豁免检定时
                • 施展的法术的豁免 DC
                `"
            >
              熟练加值+{{ getProficiencyBonus(getLevel()) }}
            </span>
          </div>
          <div class="stat-item">
            <label>速度</label>
            <div class="stat-value">{{ character.speed }}</div>
            <span class="stat-note">{{ character.specialSpeed }}</span>
          </div>
        </div>
      </div>
    </div>

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

    <div class="main-content" v-if="currentTab === 'attributes'">
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
              {{ calculateModifier(character.attributes[attr.id]) }}
            </span>
            <div class="main-score">
              {{ character.attributes[attr.id] }}
              <div class="proficiency-dot" :class="{ active: getProficiencyAbility().includes(attr.id) }"></div>
            </div>
            <span 
              class="modifier"
              :data-tooltip="`豁免检定是用于判断角色是否能够抵抗或免除某种效果或伤害的机制。
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
                <div 
                  class="proficiency-dot" 
                  :class="{
                    'double': getDoubleProficientSkills()?.includes(skill.id),
                    'active': !getDoubleProficientSkills()?.includes(skill.id) && 
                              getProficiencySkills()?.includes(skill.id),
                    'half': !getDoubleProficientSkills()?.includes(skill.id) && 
                            !getProficiencySkills()?.includes(skill.id) && 
                            getHalfProficientSkills()?.includes(skill.id)
                  }"
                ></div>
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-modifier">{{ calculateSkillModifier(skill) }}</span>
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
              <div class="info-label">年龄</div>
              <div class="info-value">{{ character.age }}</div>
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
                <div 
                  class="color-box" 
                  :class="{ 'disabled': !character.nailColor }"
                  :style="{ backgroundColor: character.nailColor || '#ffffff' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 添加状态列表 -->
        <div class="status-list">
          <div 
            v-for="status in statusItems" 
            :key="status.id"
            class="status-item"
          >
            <i :class="status.icon"></i>
            <span class="status-label">{{ status.label }}</span>
            <div class="status-detail" v-if="status.detailKey">
              {{ character.statusDetails[status.detailKey] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CHARACTER_TEMPLATE } from '@/constants/character';
import { characters } from '@/constants/entities';
import { computed, ref } from 'vue';
import { getStaticPath } from '@/utils/assets'
import { ATTRIBUTES, SKILLS, CLASS_HIT_DICE, CLASS_ABILITIES, BACKGROUND_SKILLS } from '@/constants/dnd5e';

const props = defineProps<{
  characterId: number
}>();

const character = CHARACTER_TEMPLATE.get(props.characterId);

// 获取角色头像路径
const getCharacterAvatarPath = computed(() => 
  characters.find(c => c.id === props.characterId)?.path || ''
);

// 获取等级
const getLevel = () => {
  const classList = character.class;
  let level = 0;
  classList.forEach(item => {
    level += item.level;
  });
  return level;
};

// 获取生命骰与最大生命值
const getHitDice = () => {

  const classList = character.class;

  const conScore = character.attributes[3];
  const conModifier = Math.floor((conScore - 10) / 2);
  const conBonus = getLevel() * conModifier;
  const modifierStr = conBonus >= 0 ? `+${conBonus}` : `${conBonus}`;

  let diceStr = '';
  let baseHP = 0;
  classList.forEach((item, index) => {
    const dice = CLASS_HIT_DICE[item.class].hitDice;
    const level = item.level;
    diceStr += `${index === 0 ? '' : ' + '}${level}${dice}`;
    baseHP += level * CLASS_HIT_DICE[item.class].diceValue;
  });
  
  // 计算最大生命值
  const maxHP = baseHP + conBonus;

  return {
    hitDice: `${diceStr} ${modifierStr}`,
    maxHP: maxHP
  };
};

// 获取熟练属性
const getProficiencyAbility = () => {
  const className = character.class[0].class;
  return CLASS_ABILITIES[className].savingThrows;
};

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
  const proficiencyBonus = getProficiencyAbility().includes(attributeId) 
    ? getProficiencyBonus(getLevel()) 
    : 0;
  const total = modifier + proficiencyBonus;
  return total >= 0 ? `+${total}` : `${total}`;
};

const getDoubleProficientSkills = () => {
  return character.doubleProficientSkills;
};

const getProficiencySkills = () => {
  const background = character.background;
  return BACKGROUND_SKILLS[background];
};

const getHalfProficientSkills = () => {
  return character.class.some(item => item.class === '吟游诗人') ? 
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18] : [];
};

// 计算技能调整值
const calculateSkillModifier = (skill: any): string => {
  const attributeModifier = Math.floor((character.attributes[skill.attributeId] - 10) / 2);
  let proficiencyBonus = 0;
  
  if (getDoubleProficientSkills()?.includes(skill.id)) {
    proficiencyBonus = getProficiencyBonus(getLevel()) * 2;
  } else if (getProficiencySkills()?.includes(skill.id)) {
    proficiencyBonus = getProficiencyBonus(getLevel());
  } else if (getHalfProficientSkills()?.includes(skill.id)) {
    proficiencyBonus = Math.floor(getProficiencyBonus(getLevel()) / 2);
  }
  
  const total = attributeModifier + proficiencyBonus;
  return total >= 0 ? `+${total}` : `${total}`;
};

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

const calculateAC = () => {
  const baseAC = 10;
  const armorBonus = character.armorBonus || 0;
  const shieldBonus = character.shieldBonus || 0;
  const dexModifier = Number(calculateModifier(character.attributes[2]));
  const otherBonus = character.otherACBonus || 0;

  const maxBonus = Math.min((armorBonus + dexModifier), 8);

  return {
    // 标准AC
    normal: baseAC + maxBonus + shieldBonus + otherBonus,
    // 措手不及AC
    flatFooted: baseAC + armorBonus + otherBonus,
    // 接触AC
    touch: baseAC + dexModifier + otherBonus
  };
};

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
  text-decoration: none;
}

.reference:hover {
  opacity: 1;
  text-decoration: underline;
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
  position: relative;
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
  opacity: 0.8;
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
  position: relative;
}

.color-box.disabled::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 140%;    /* 稍微加长以确保覆盖整个方块 */
  height: 1px;    /* 线的粗细 */
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
  opacity: 0.8;
  width: 1.2rem;
  text-align: center;
}

.status-label {
  color: var(--color-text);
  white-space: nowrap;
  width: 80px;
}

.status-detail {
  color: var(--color-text);
  opacity: 0.8;
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
