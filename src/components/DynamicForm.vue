<script setup>
import { computed } from 'vue'
import { characters } from '@/constants/characters'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  config: {
    type: Object,
    required: true,
    validator: (config) => {
      return config.layout && Array.isArray(config.groups)
    }
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// 计算表单项样式
const getFieldStyle = (field) => {
  const { gutter } = props.config.layout
  const width = (field.span / 24) * 100
  return {
    width: `calc(${width}% - ${gutter}px)`,
    marginBottom: `${gutter}px`
  }
}

// 处理嵌套表单的值更新
const updateNestedField = (groupIndex, fieldKey, value, listIndex = null) => {
  const newValue = { ...props.modelValue }
  
  if (listIndex !== null) {
    // 更新列表项中的值
    if (!Array.isArray(newValue[fieldKey])) {
      newValue[fieldKey] = []
    }
    newValue[fieldKey][listIndex] = {
      ...newValue[fieldKey][listIndex],
      ...value
    }
  } else {
    // 更新普通字段
    newValue[fieldKey] = value
  }
  
  emit('update:modelValue', newValue)
}

// 根据字段类型返回对应的组件
const getFieldComponent = (type) => {
  switch(type) {
    case 'textarea':
      return 'textarea'
    case 'select':
      return 'select'
    case 'tags':
      return 'div' // 或者使用自定义的标签组件
    case 'form':
      return DynamicForm // 递归使用表单组件
    default:
      return 'input'
  }
}

// 处理特殊的 options 配置
const getFieldOptions = (field) => {
  if (typeof field.options === 'string' && field.options === 'characters') {
    // 如果 options 是 'characters'，返回角色列表
    return characters.map(char => ({
      label: char.name,
      value: char.id
    }))
  }
  return field.options || []
}

// 添加列表项
const addListItem = (key) => {
  const newValue = { ...props.modelValue }
  if (!Array.isArray(newValue[key])) {
    newValue[key] = []
  }
  
  // 创建空的列表项
  const emptyItem = {}
  const group = props.config.groups.find(g => g.key === key)
  if (group && group.field.fields) {
    // 为每个字段设置默认值
    Object.keys(group.field.fields).forEach(fieldKey => {
      emptyItem[fieldKey] = ''
    })
  }
  
  newValue[key].push(emptyItem)
  emit('update:modelValue', newValue)
}

// 删除列表项
const removeListItem = (key, index) => {
  const newValue = { ...props.modelValue }
  if (Array.isArray(newValue[key])) {
    newValue[key].splice(index, 1)
    emit('update:modelValue', newValue)
  }
}

// 更新列表项
const updateListItem = (key, index, fieldKey, value) => {
  const newValue = { ...props.modelValue }
  if (!Array.isArray(newValue[key])) {
    newValue[key] = []
  }
  if (!newValue[key][index]) {
    newValue[key][index] = {}
  }
  newValue[key][index][fieldKey] = value
  emit('update:modelValue', newValue)
}

</script>

<template>
  <div class="dynamic-form">
    <div 
      v-for="(group, groupIndex) in config.groups" 
      :key="groupIndex"
      class="form-group"
    >
      <h3 class="group-title">{{ group.title }}</h3>
      
      <!-- 普通表单组 -->
      <template v-if="!group.type">
        <div class="fields-container">
          <div 
            v-for="(field, key) in group.fields" 
            :key="key"
            class="form-field"
            :style="getFieldStyle(field)"
          >
            <label>{{ field.label }}</label>
            
            <!-- 字段渲染逻辑 -->
            <component
              :is="getFieldComponent(field.type)"
              v-model="modelValue[key]"
              v-bind="field.type === 'select' ? { 
                ...field,
                options: getFieldOptions(field)
              } : field"
              :disabled="!isEditing || field.readonly"
            >
              <template v-if="field.type === 'select'">
                <option 
                  v-for="opt in getFieldOptions(field)"
                  :key="typeof opt === 'object' ? opt.value : opt"
                  :value="typeof opt === 'object' ? opt.value : opt"
                >
                  {{ typeof opt === 'object' ? opt.label : opt }}
                </option>
              </template>
            </component>
          </div>
        </div>
      </template>
      
      <!-- 列表表单组 -->
      <template v-else-if="group.type === 'list'">
        <div class="list-container">
          <div 
            v-for="(item, index) in modelValue[group.key] || []"
            :key="index"
            class="list-item"
          >
            <div class="fields-container">
              <div 
                v-for="(field, fieldKey) in group.field.fields"
                :key="fieldKey"
                class="form-field"
                :style="getFieldStyle(field)"
              >
                <label>{{ field.label }}</label>
                <component
                  :is="getFieldComponent(field.type)"
                  :value="item[fieldKey]"
                  @input="e => updateListItem(group.key, index, fieldKey, e.target.value)"
                  v-bind="field.type === 'select' ? {
                    ...field,
                    options: getFieldOptions(field)
                  } : field"
                  :disabled="!isEditing"
                >
                  <template v-if="field.type === 'select'">
                    <option 
                      v-for="opt in getFieldOptions(field)"
                      :key="typeof opt === 'object' ? opt.value : opt"
                      :value="typeof opt === 'object' ? opt.value : opt"
                    >
                      {{ typeof opt === 'object' ? opt.label : opt }}
                    </option>
                  </template>
                </component>
              </div>
            </div>
            
            <!-- 列表项操作按钮 -->
            <div v-if="isEditing" class="list-item-actions">
              <button 
                class="remove-item-button"
                @click="removeListItem(group.key, index)"
              >
                ×
              </button>
            </div>
          </div>
          
          <!-- 添加按钮 -->
          <button 
            v-if="isEditing"
            @click="addListItem(group.key)"
            class="add-item-button"
          >
            添加{{ group.title }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.dynamic-form {
  width: 100%;
}

.form-group {
  margin-bottom: 2rem;
}

.group-title {
  margin-bottom: 1rem;
  color: var(--color-text);
  font-size: 1.1rem;
  font-weight: 500;
}

.fields-container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 calc(-1 * v-bind('config.layout.gutter') / 2);
}

.form-field {
  padding: 0 calc(v-bind('config.layout.gutter') / 2);
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-item {
  position: relative;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 4px;
}

.list-item-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.add-item-button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-item-button {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-item-button:hover {
  background: var(--color-background-mute);
  color: var(--color-danger);
}
</style> 