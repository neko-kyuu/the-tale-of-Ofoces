export function deepMerge<T>(computed: T, override: Partial<T> | undefined): T {
  if (!override) return computed;
  
  const result = { ...computed };
  
  for (const key in override) {
    if (override[key] === undefined || override[key] === null) continue;
    
    if (Array.isArray(override[key])) {
      // 如果是数组，合并并去重
      result[key] = Array.isArray(result[key])
        ? [...new Set([...result[key], ...override[key]])]
        : override[key];
    } else if (typeof override[key] === 'object') {
      // 如果是对象，递归合并
      result[key] = deepMerge(
        result[key] || {},
        override[key] as any
      );
    } else {
      // 如果是基本类型（string, number 等），直接覆盖
      result[key] = override[key] as T[typeof key];
    }
  }
  
  return result;
} 