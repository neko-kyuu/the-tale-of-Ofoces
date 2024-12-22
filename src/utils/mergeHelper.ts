export function deepMerge<T>(computed: T, override: Partial<T> | undefined): T {
  if (!override) return computed;
  
  const result = { ...computed };
  
  for (const key in override) {
    if (override[key] === undefined || override[key] === null) continue;
    
    if (typeof override[key] === 'object' && !Array.isArray(override[key])) {
      // 如果是对象，递归合并
      result[key] = deepMerge(
        result[key] || {},
        override[key] as any
      );
    } else {
      // 如果不是对象，直接覆盖
      result[key] = override[key] as T[typeof key];
    }
  }
  
  return result;
} 