import { CONTENT_TYPES } from "@/constants/types"
// 导出常量，添加类型注解
export const realms = [
    { id: 1, name: '神祁' },
    { id: 2, name: '天界生物' },
    { id: 3, name: '主位面生物' }
]

export const races = [
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

export const backgrounds = [
    { id: 1, name: '调查员' },
    { id: 2, name: '贵族' },
    { id: 3, name: '剧团' },
    { id: 4, name: '公会' },
    { id: 5, name: '教堂圣职者' },
    { id: 6, name: '侍从' },
]
export const edges = [
    { 
      from: 1, 
      to: 2, 
      arrows: 'to',
      label: '结婚',
      color: { color: '#2B7CE9' }
    },
    { 
      from: 2, 
      to: 1, 
      arrows: 'to',
      label: '结婚',
      color: { color: '#E91E63' }
    },
    // ... 更多关系
  ]
export const characters = [
  {
      id: 1,
      type: CONTENT_TYPES.CHARACTER,
      name: "Mja",
      realm: 2, 
      race: 1,
      background: 1,
      path: "/static/token/mja.png",
      references: {
          // 引用其他内容的ID列表
          documents: ['doc_1', 'doc_2'],
          // ...其他引用
      },
      referencedBy: {
          // 被其他内容引用的ID列表
          // ...其他引用
      }
  },
  {
      id: 2,
      type: CONTENT_TYPES.CHARACTER,
      name: "Ilse",
      realm: 3, 
      race: 3,
      background: 2,
      path: "/static/token/mja.png",
  },
  {
      id: 3,
      type: CONTENT_TYPES.CHARACTER,
      name: "Lewenhart",
      realm: 3, 
      race: 3,
      background: 6,
      path: "/static/token/mja.png",
  },
  {
      id: 4,
      type: CONTENT_TYPES.CHARACTER,
      name: "Elvis",
      realm: 3, 
      race: 3,
      background: 6,
      path: "/static/token/mja.png",
  },
  {
      id: 5,
      type: CONTENT_TYPES.CHARACTER,
      name: "Wiro",
      realm: 3, 
      race: 3,
      background: 2,
      path: "/static/token/mja.png",
  },
  {
      id: 6,
      type: CONTENT_TYPES.CHARACTER,
      name: "Leslie",
      realm: 3, 
      race: 6,  
      background: 5,
      path: "/static/token/mja.png",
  },
  {
      id: 7,
      type: CONTENT_TYPES.CHARACTER,
      name: "Belladonna",
      realm: 3, 
      race: 5,
      background: 1,
      path: "/static/token/mja.png",
  },
  {
    id: 8,
    type: CONTENT_TYPES.CHARACTER,
    name: "Hyacinth",
    realm: 3, 
    race: 5,
    background: 3,
    path: "/static/token/mja.png",
  },
  {
    id: 9,
    type: CONTENT_TYPES.CHARACTER,
    name: "Rey",
    realm: 3, 
    race: 4,
    background: 3,
    path: "/static/token/mja.png",
  },
  {
    id: 10,
    type: CONTENT_TYPES.CHARACTER,
    name: "Vee",
    realm: 3, 
    race: 7,
    background: 4,
    path: "/static/token/mja.png",
  },
  {
    id: 11,
    type: CONTENT_TYPES.CHARACTER,
    name: "Karnacio",
    realm: 1, 
    race: 8,
    background: 1,
    path: "/static/token/mja.png",
  },
  {
    id: 12,
    type: CONTENT_TYPES.CHARACTER,
    name: "Herudis",
    realm: 2, 
    race: 9,
    background: 1,
    path: "/static/token/mja.png",
  },
  {
    id: 13,
    type: CONTENT_TYPES.CHARACTER,
    name: "Lumo",
    realm: 1, 
    race: 8,
    background: 1,
    path: "/static/token/mja.png",  
  },
  {
    id: 14,
    type: CONTENT_TYPES.CHARACTER,
    name: "Eyzin",
    realm: 2, 
    race: 10,
    background: 1,
    path: "/static/token/mja.png",
  },
  {
    id: 15,
    type: CONTENT_TYPES.CHARACTER,
    name: "Fjel",
    realm: 2, 
    race: 1,
    background: 1,
    path: "/static/token/mja.png",
  },
  {
    id: 16,
    type: CONTENT_TYPES.CHARACTER,
    name: "Mondo",
    realm: 2, 
    race: 11,
    background: 1,
    path: "/static/token/mja.png",
  },
  {
    id: 17,
    type: CONTENT_TYPES.CHARACTER,
    name: "Selakorvo",
    realm: 2, 
    race: 1,
    background: 1,
    path: "/static/token/mja.png",
  },
  {
    id: 18,
    type: CONTENT_TYPES.CHARACTER,
    name: "Mervargr",
    realm: 3, 
    race: 3,
    background: 1,
    path: "/static/token/mja.png",
  },
  {
    id: 19,
    type: CONTENT_TYPES.CHARACTER,
    name: "Syor",
    realm: 3, 
    race: 3,
    background: 6,
    path: "/static/token/mja.png",
  },
  {
    id: 20,
    type: CONTENT_TYPES.CHARACTER,
    name: "Fel'rekt",
    realm: 3, 
    race: 3,
    background: 6,
    path: "/static/token/mja.png",
  },
  {
    id: 21,
    type: CONTENT_TYPES.CHARACTER,
    name: "Calimar",
    realm: 3, 
    race: 3,
    background: 6,
    path: "/static/token/mja.png",
  }    
  // ...其他角色
]

export const mdFiles = [
  {
    id: 'doc_1',
    type: CONTENT_TYPES.DOCUMENT,
    title: '设定与世界观',
    path: '/static/md/设定与世界观.md',
    references: {
      characters: ['char_1'],
      // ...其他引用
    },
    referencedBy: {
      // ...被引用
    }
  }
  // ...其他文档
]
