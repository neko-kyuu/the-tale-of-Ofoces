export const characters = [
  {
    id: 1,
    name: "Mja",
    tags: ["天使", "调查员"],
    avatar: "/static/token/2024-06-03 215556.png",
    description:'aaa'
  },
  {
    id: 2,
    name: "角色B",
    tags: ["调查员"],
    avatar: "path/to/image"
  },
  {
    id: 3,
    name: "角色C",
    tags: ["天使"],
    avatar: "path/to/image"
  }
  // ... 更多角色
] 

export const edges = [
    { 
      from: 1, 
      to: 2, 
      arrows: 'to',
      label: '信任',
      color: { color: '#2B7CE9' }
    },
    { 
      from: 2, 
      to: 1, 
      arrows: 'to',
      label: '怀疑',
      color: { color: '#E91E63' }
    },
    // ... 更多关系
  ]
