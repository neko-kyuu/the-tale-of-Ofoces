<template>
    <!-- 列表视图 --> 
    <div 
        class="character-list view-active"
    >
        <div class="character-groups">
          <!-- 按 realm 分组 -->
          <div 
            v-for="realm in REALMS" 
            :key="realm.id"
            class="realm-group"
          >
            <div class="race-groups-container">
              <!-- 按 race 分组 -->
              <div 
                v-for="race in getRacesByRealm(realm.id)" 
                :key="`${realm.id}-${race.id}`"
                class="race-group"
                :class="{ 'inline-group': shouldBeInline(getCharactersByRealmAndRace(realm.id, race.id)) }"
              >
                <div class="race-name">{{ race.name }}</div>
                <div class="group-content">
                  <div 
                    v-for="char in getCharactersByRealmAndRace(realm.id, race.id)" 
                    :key="`${realm.id}-${race.id}-${char.id}`"
                    class="character-card"
                    @click="showCharacterDetail(char)"
                  >
                    <div class="card-image">
                      <img :src="getStaticPath(char.path)" :alt="char.name">
                    </div>
                    <div class="card-content">
                      <p class="card-title">{{ char.name }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">
import { characters } from '@/constants/entities';
import { RACES, REALMS } from '@/constants/types'
import { useCharacterDetailStore } from '@/stores/characterDetail';
import { getStaticPath } from '@/utils/assets'

const store = useCharacterDetailStore()

// 获取某个 realm 下的所有 races
const getRacesByRealm = (realmId) => {
  const realmCharacters = characters.filter(char => char.realm === realmId)
  const raceIds = [...new Set(realmCharacters.map(char => char.race))]
  return RACES.filter(race => raceIds.includes(race.id))
}

// 获取特定 realm 和 race 的角色
const getCharactersByRealmAndRace = (realmId, raceId) => {
  return characters.filter(char => char.realm === realmId && char.race === raceId)
}

// 判断是否应该内联显示（不足一行的情况）
const shouldBeInline = (chars) => {
  const CARD_WIDTH = 280 // 假设每个卡片宽度为 280px
  const CONTAINER_WIDTH = 1200 // 假设容器宽度为 1200px
  const cardsPerRow = Math.floor(CONTAINER_WIDTH / CARD_WIDTH)
  return chars.length <= cardsPerRow
}

const showCharacterDetail = (char) => {
  store.showCharacter(char)
}
</script>

<style scoped>
.character-list {
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.view-active {
  opacity: 1;
  pointer-events: auto;
}

/* 调整列表视图的样式以适应新布局 */
.character-list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 2rem;
  overflow-y: auto;
  background: var(--color-background-soft);
}

.character-groups {
  max-width: 1200px;
  margin: 0 auto;
}

.group-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.group-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.realm-group {
  margin-bottom: 2rem;
}

.realm-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.race-groups-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
}

.race-group {
  flex: 0 0 auto;
  min-width: 0;
}

@media (max-width: 768px) {
  .race-groups-container{
    gap: 0;
  }

  .race-group {
    flex: 0 1 auto;
  }
}

.race-group.inline-group {
  flex: 0 1 auto;
}

.race-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.group-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  padding: 0.5rem;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
}

.character-card {
  flex: 0 0 100px;
  max-width: 100px;
  min-width: 100px;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  cursor: pointer;
  background: var(--color-background-soft);
}

.card-image {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card-content {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 1rem;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-background-soft);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
  overflow: hidden;
}

/* 悬停效果 */
.character-card:hover .card-image {
  width: 100px;
  height: 100px;
  transform: translate(0, -20px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.character-card:hover .card-content {
  opacity: 1;
}

/* 内容样式 */
.character-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.race-name {
  background: var(--color-background-highlight);
  padding: 0.25rem 0.5rem;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
  max-width: 60px;
}

.card-title {
  font-size: 0.875rem;
  margin-top: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  opacity: 0.8;
}
</style>