// 定义所有可用的内容类型
export enum CONTENT_TYPES {
  CHARACTER = 'character',
  DOCUMENT = 'document',
  EVENT = 'event',
  LOCATION = 'location',
  MEDIA = 'media',
  NOTE = 'note',
  GALLERY = 'gallery',
  EBOOK = 'ebook',
  LOCATION_POINT = 'location-point'
}
// 定义所有属性
export const REALMS = [
  { id: 1, name: '神祁' },
  { id: 2, name: '天界生物' },
  { id: 3, name: '主位面生物' }
]
export const RACES = [
  { id: 1, name: '天使' },
  { id: 2, name: '魔鬼' },
  { id: 3, name: '精灵' } ,
  { id: 4, name: '人类' },
  { id: 5, name: '提夫林' },
  { id: 6, name: '阿斯莫' },
  { id: 7, name: '半精灵' },
  { id: 8, name: '荒神' },
  { id: 9, name: '羽蛇' },
  { id: 10, name: '神侍' },
  { id: 11, name: '至高天' },
]
export const BACKGROUNDS = [
  { id: 1, name: '调查员' },
  { id: 2, name: '贵族' },
  { id: 3, name: '剧团' },
  { id: 4, name: '公会' },
  { id: 5, name: '教堂圣职者' },
  { id: 6, name: '侍从' },
]
export const EDGE_TYPES = [
  { id: 1, name: '恋爱' },
  { id: 2, name: '友人' },
  { id: 3, name: '家人' },
  { id: 4, name: '主从' },
]
export const ATTRIBUTES = [
  { id: 1, name: '力量' },
  { id: 2, name: '敏捷' },
  { id: 3, name: '体质' },
  { id: 4, name: '智力' },
  { id: 5, name: '感知' },
  { id: 6, name: '魅力' },
]
export const SKILLS = [
  { id: 1, name: '运动', attributeId: 1 },
  { id: 2, name: '特技', attributeId: 2 },
  { id: 3, name: '巧手', attributeId: 2 },
  { id: 4, name: '隐匿', attributeId: 2 },
  { id: 5, name: '调查', attributeId: 4 },
  { id: 6, name: '奥秘', attributeId: 4 },
  { id: 7, name: '历史', attributeId: 4 },
  { id: 8, name: '自然', attributeId: 4 },
  { id: 9, name: '宗教', attributeId: 4  },
  { id: 10, name: '察觉', attributeId: 6 },
  { id: 11, name: '洞悉', attributeId: 5 },
  { id: 12, name: '驯兽', attributeId: 5 },
  { id: 13, name: '医药', attributeId: 5 },
  { id: 14, name: '求生', attributeId: 5 },
  { id: 15, name: '游说', attributeId: 6 },
  { id: 16, name: '欺瞒', attributeId: 6 },
  { id: 17, name: '威吓', attributeId: 6 },
  { id: 18, name: '表演', attributeId: 6 },
]
