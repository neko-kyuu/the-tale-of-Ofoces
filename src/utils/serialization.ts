import type { Character } from '@/types/dnd5e';
import { toRaw, isRef, isReactive } from 'vue';

// 创建序列化函数 electron IPC使用
export const serializeCharacter = (character: Partial<Character>): Partial<Character> => {
  return Object.fromEntries(
    Object.entries(character)
      .filter(([_, value]) => value !== undefined)
  ) as Partial<Character>;
};

// 递归处理响应式对象
export function deepToRaw<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => deepToRaw(item)) as any;
  }
  
  if (isRef(value) || isReactive(value)) {
    value = toRaw(value);
  }
  
  if (value && typeof value === 'object') {
    const rawObj: any = {};
    for (const key in value) {
      rawObj[key] = deepToRaw(value[key]);
    }
    return rawObj;
  }
  
  return value;
} 