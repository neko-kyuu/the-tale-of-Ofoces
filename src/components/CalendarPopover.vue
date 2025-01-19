<template>
  <div class="calendar-container" @click.stop>
    <div class="calendar-header">
      <button @click.stop="previousYear">
        <i class="fi fi-rr-angle-left"></i>
      </button>
      <span>{{ currentYear }}年</span>
      <button @click.stop="nextYear">
        <i class="fi fi-rr-angle-right"></i>
      </button>
    </div>
    <div class="months-grid">
      <div v-for="month in months" :key="month.index" class="month">
        <div class="month-header">{{ month.name }}</div>
        <div class="calendar-grid">
          <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
          <div
            v-for="date in getMonthDates(month.index)"
            :key="date.date"
            class="date"
            :class="{ 
              'other-month': date.isOtherMonth,
              'has-items': hasItemsOnDate(date.date)
            }"
          >
            {{ date.day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  dates: string[]
}>()

const currentYear = ref(new Date().getFullYear()-1)
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const months = [
  { index: 0, name: '1月' },
  { index: 1, name: '2月' },
  { index: 2, name: '3月' },
  { index: 3, name: '4月' },
  { index: 4, name: '5月' },
  { index: 5, name: '6月' },
  { index: 6, name: '7月' },
  { index: 7, name: '8月' },
  { index: 8, name: '9月' },
  { index: 9, name: '10月' },
  { index: 10, name: '11月' },
  { index: 11, name: '12月' }
]

const getMonthDates = (month: number) => {
  const year = currentYear.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const dates = []
  
  // 添加上个月的日期
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek; i > 0; i--) {
    const date = new Date(year, month, -i + 1)
    dates.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      isOtherMonth: true
    })
  }
  
  // 添加当前月的日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    dates.push({
      date: date.toISOString().split('T')[0],
      day: i,
      isOtherMonth: false
    })
  }
  
  // 添加下个月的日期
  const remainingDays = 7 - (dates.length % 7)
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      dates.push({
        date: date.toISOString().split('T')[0],
        day: i,
        isOtherMonth: true
      })
    }
  }
  
  return dates
}

const hasItemsOnDate = (date: string) => {
  return props.dates.includes(date)
}

const previousYear = () => {
  currentYear.value--
}

const nextYear = () => {
  currentYear.value++
}
</script>

<style scoped>
.calendar-container {
  background: var(--color-background);
  border-radius: 8px;
  padding: 0.66rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  width: 800px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.66rem;
}

.calendar-header button {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 4px;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.month {
  width: 100%;
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 6px;
  cursor: default;
}

.month-header {
  text-align: center;
  font-size: 0.66rem;
  margin-bottom: 4px;
  color: var(--color-text);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.weekday {
  text-align: center;
  font-size: 0.66rem;
  color: var(--color-text-light);
}

.date {
  position: relative;
  text-align: center;
  padding: 2px;
  font-size: 0.66rem;
  border-radius: 2px;
  cursor: default;
}

.date.other-month {
  color: var(--color-border);
}

.date.has-items:not(.other-month) {
  font-weight: 500;
  background: var(--color-background-highlight)
}
</style> 