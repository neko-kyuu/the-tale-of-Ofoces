export interface Relationship {
  from: string | number
  to: string | number
  type: number
  label: string
  arrows: string
  color: {
    color: string
  }
}

// 扩展 Window 接口
declare global {
  interface Window {
    $characterRelationships: Relationship[]
  }
} 