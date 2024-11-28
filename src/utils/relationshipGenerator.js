import { characters } from '@/constants/entities'

export function generateRelationships() {
  const relationships = []
  
  characters.forEach(character => {
    // 处理 references (to)
    if (character.references?.characters) {
      character.references.characters.forEach(ref => {
        relationships.push({
          from: character.id,
          to: ref.id,
          type: ref.edgeType,
          label: ref.label,
          arrows: 'to',
          // 可以根据 edgeType 设置不同的颜色
          color: getColorByType(ref.edgeType)
        })
      })
    }
    
    // 处理 referencedBy (from)
    if (character.referencedBy?.characters) {
      character.referencedBy.characters.forEach(ref => {
        // 检查是否已存在相反方向的关系
        const existingRelation = relationships.find(r => 
          r.from === ref.id && 
          r.to === character.id && 
          r.type === ref.edgeType
        )
        
        if (existingRelation) {
          // 如果存在相反方向的关系，更新为双向
          existingRelation.arrows = 'to;from'
        } else {
          relationships.push({
            from: ref.id,
            to: character.id,
            type: ref.edgeType,
            label: ref.label,
            arrows: 'to',
            color: getColorByType(ref.edgeType)
          })
        }
      })
    }
  })

  // 去重：移除重复的关系，并统一特定类型的标签
  return relationships.filter((rel, index, self) => {
    const firstIndex = self.findIndex(r => 
      (r.from === rel.from && r.to === rel.to && r.type === rel.type) ||
      (r.from === rel.to && r.to === rel.from && r.type === rel.type)
    )
    
    // 如果是第一次出现的关系
    if (index === firstIndex) {
      // 查找是否存在相反方向的关系
      const reverseRel = self.find(r => 
        r.from === rel.to && 
        r.to === rel.from && 
        r.type === rel.type &&
        index !== self.indexOf(r)
      )
      
      // 如果存在相反方向的关系，统一标签
      if (reverseRel) {
        if (rel.type === 4) {
          rel.label = '主从'
        } else if (rel.type === 3) {
          rel.label = '家属'
        }
      }
      
      return true
    }
    
    return false
  })
}

function getColorByType(edgeType) {
  const colors = {
    1: '#FF6B6B', // 恋爱关系
    2: '#4ECDC4', // 友人关系
    3: '#45B7D1', // 血缘关系
    4: '#96CEB4', // 主从关系
    // 可以添加更多类型的颜色
  }
  return { color: colors[edgeType] || '#666666' }
} 