// realm 1 神祁; 2 天界生物; 3 主位面生物 
// race 1 天使; 2 魔鬼; 3 精灵; 4 人类; 5 提夫林; 6 阿斯莫; 7 半精灵; 8 荒神; 9 羽蛇; 10 神侍; 11 至高天 
// background 1 调查员; 2 贵族; 3 剧团; 4 公会; 5 教堂圣职者; 6 侍从
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
export const characters = [
  {
    id: 1,
    name: "Mja",
    realm: 2, 
    race: 1,
    background: 1,
    avatar: "/static/token/mja.png",
    description:'aaa'
  },
  {
    id: 2,
    name: "Ilse",
    realm: 3, 
      race: 3,
    background: 2,
    avatar: "",
    description:'aaa'
  },
  {
    id: 3,
    name: "Lewenhart",
    realm: 3, 
    race: 3,
    background: 6,
    avatar: "",
    description:'aaa'
  },
  {
    id: 4,
    name: "Elvis",
    realm: 3, 
    race: 3,
    background: 6,
    avatar: "",
    description:'aaa'
  },
  {
    id: 5,
    name: "Wiro",
    realm: 3, 
    race: 3,
    background: 2,
    avatar: "",
    description:'aaa'
  },
  {
    id: 6,
    name: "Leslie",
    realm: 3, 
    race: 6,  
    background: 5,
    avatar: "",
    description:'aaa'
  },
  {
    id: 7,
    name: "Belladonna",
    realm: 3, 
    race: 5,
    background: 1,
    avatar: "",
    description:'aaa'
  },
  {
    id: 8,
    name: "Hyacinth",
    realm: 3, 
    race: 5,  
    background: 3,
    avatar: "",
    description:'aaa'
  },
  {
    id: 9,
    name: "Rey",
    realm: 3, 
    race: 4,    
    background: 3,
    avatar: "",
    description:'aaa'
  },
  {
    id: 10,
    name: "Vee",
    realm: 3, 
    race: 7,
    background: 4,
    avatar: "",
    description:'aaa'
  },
  {
    id: 11,
    name: "Karnacio",
    realm: 1, 
    race: 8,
    avatar: "",
    description:'aaa'
  },
  {
    id: 12,
    name: "Herudis",
    realm: 2, 
    race: 9,
    avatar: "",
    description:'aaa'
  },
  {
    id: 13,
    name: "Lumo",
    realm: 1, 
    race: 8,
    avatar: "",
    description:'aaa'
  },
  {
    id: 14,
    name: "Eyzin",
    realm: 2, 
    race: 10,
    avatar: "",
    description:'aaa'
  },
  {
    id: 15,
    name: "Fjel", 
    realm: 2, 
    race: 1,
    avatar: "",
    description:'aaa'
  },
  {
    id: 16,
    name: "Mondo",
    realm: 2, 
    race: 11,
    avatar: "",
    description:'aaa'
  },
  {
    id: 17,
    name: "Selakorvo",
    realm: 2, 
    race: 1,
    avatar: "",
    description:'aaa'
  },
  {
    id: 18,
    name: "Mervargr",
    realm: 3, 
    race: 3,
    avatar: "",
    description:'aaa'
  },
  {
    id: 19,
    name: "Syor",
    realm: 3,
    race: 3,
    background: 6,
    avatar: "",
    description:'aaa'
  },
  {
    id: 20,
    name: "Fel'rekt",
    realm: 3,
    race: 3,
    background: 6,
    avatar: "",
    description:'aaa'
  },
  {
    id: 21,
    name: "Calimar",
    realm: 3,
    race: 3,
    background: 6,
    avatar: "",
    description:'aaa'
  }
  // ... 更多角色
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
