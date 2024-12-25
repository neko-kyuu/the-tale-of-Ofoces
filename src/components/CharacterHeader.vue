<template>
<!-- 顶部信息栏 -->
<div class="header-section">
      <div class="avatar-container">
        <img :src="getStaticPath(avatarPath)" alt="Character Avatar" class="avatar-image">
      </div>
      <div class="basic-info">
        <div class="name-row">
          <h2 class="character-name">{{ character.name }}</h2>
          <span class="challenge-rating">CR {{ getLevel() }}</span>
        </div>
        <div class="traits-row">
          <span class="trait">{{ props.computedStats.basicInfo.size }}</span>
          <span class="trait">{{ props.computedStats.basicInfo.alignment }}</span>
          <span class="trait">{{ props.computedStats.basicInfo.type }}</span>
          <a 
            class="reference" 
            :href="props.computedStats.basicInfo.referenceUrl" 
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ props.computedStats.basicInfo.reference }}
          </a>
        </div>
        <div class="stats-row">
          <div class="stat-item">
            <label>HP</label>
            <div class="stat-value">{{ getHitDice().maxHP }} 
              <span class="stat-note">( {{ getHitDice().formula }} )</span> 
            </div>
            <span class="stat-note">{{ props.computedStats.levelClass }}</span>

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
              {{ calculateAC().normal }} / {{ calculateAC().flatFooted }} / {{ calculateAC().touch }}
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
              熟练加值+{{ getProficiencyBonus()}}
            </span>
          </div>
          <div class="stat-item">
            <label
              :data-tooltip="`dnd中的尺为英尺，一格为5尺。1尺等于30.48厘米。`"
            >速度</label>
            <div class="stat-value">{{ props.computedStats.combatStats.speed }}</div>
            <span class="stat-note">{{ props.computedStats.combatStats.specialSpeed }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { OptionalCharacter, OptionalComputedStats } from '@/types/dnd5e';
import { getStaticPath } from '@/utils/assets';

const props = defineProps<{
    character: OptionalCharacter,
    computedStats: OptionalComputedStats,
    avatarPath: string
}>();

const getLevel = () => props.computedStats.level;
const getHitDice = () => props.computedStats.hitDice;
const getProficiencyBonus = () => props.computedStats.proficiencyBonus;
const calculateAC = () => props.computedStats.ac;

</script>
<style scoped>
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
  color: var(--color-text-soft);
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.stat-note {
  font-size: 0.8rem;
  color: var(--color-text-soft);
  position: relative;
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