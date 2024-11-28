import { CONTENT_TYPES } from "@/constants/types"

export const edges = [
    { 
      from: 1, 
      to: 2,
      type: 1, 
      arrows: 'to;from',
      label: '结婚',
      color: { color: '#2B7CE9' }
    },
    { 
      from: 2, 
      to: 5,
      type: 3, 
      arrows: 'to;from',
      label: '养父子',
      color: { color: '#2B7CE9' }
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
          characters: [
            { id: 2, label: '结婚', edgeType: 1 },
            { id: 7, label: '同事', edgeType: 2 },
            { id: 18, label: '友人', edgeType: 2 },
            { id: 11, label: '父神', edgeType: 4 },
          ],
          // 引用其他内容的ID列表
          // ...其他引用
      },
      referencedBy: {
          characters: [
            { id: 2, label: '结婚', edgeType: 1 },
            { id: 7, label: '同事', edgeType: 2 },
            { id: 18, label: '友人', edgeType: 2 },
            { id: 11, label: '造物', edgeType: 4 },
          ],
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
      references: {
        characters: [
          { id: 1, label: '结婚', edgeType: 1 },
          { id: 5, label: '养父', edgeType: 3 },
          { id: 3, label: '初恋', edgeType: 1 },
        ],
      },
      referencedBy: {
        characters: [
          { id: 1, label: '结婚', edgeType: 1 },
          { id: 5, label: '养子', edgeType: 3 },
          { id: 3, label: '初恋', edgeType: 1 },
        ],
      }
  },
  {
      id: 3,
      type: CONTENT_TYPES.CHARACTER,
      name: "Lewenhart",
      realm: 3, 
      race: 3,
      background: 6,
      path: "/static/token/mja.png",
      references: {
        characters: [
          { id: 2, label: '初恋', edgeType: 1 },
          { id: 4, label: '胞弟', edgeType: 3 },
          { id: 5, label: '家主', edgeType: 4 },
        ],
      },
      referencedBy: {
        characters: [
          { id: 2, label: '初恋', edgeType: 1 },
          { id: 4, label: '胞兄', edgeType: 3 },
          { id: 5, label: '庇护', edgeType: 4 },
        ],
      }
  },
  {
      id: 4,
      type: CONTENT_TYPES.CHARACTER,
      name: "Elvis",
      realm: 3, 
      race: 3,
      background: 6,
      path: "/static/token/mja.png",
      references: {
        characters: [
          { id: 3, label: '胞兄', edgeType: 3 },
          { id: 5, label: '家主', edgeType: 4 },
        ],
      },
      referencedBy: {
        characters: [
          { id: 3, label: '胞弟', edgeType: 3 },
          { id: 5, label: '庇护', edgeType: 4 },
        ],
      }
  },
  {
      id: 5,
      type: CONTENT_TYPES.CHARACTER,
      name: "Wiro",
      realm: 3, 
      race: 3,
      background: 2,
      path: "/static/token/mja.png",
      references: {
        characters: [
          { id: 2, label: '养子', edgeType: 3 },
          { id: 3, label: '庇护', edgeType: 4 },
          { id: 4, label: '庇护', edgeType: 4 },
        ],
      },
      referencedBy: {
        characters: [
          { id: 2, label: '养父', edgeType: 3 },
          { id: 3, label: '家主', edgeType: 4 },
          { id: 4, label: '家主', edgeType: 4 },
        ],
      }
  },
  {
      id: 6,
      type: CONTENT_TYPES.CHARACTER,
      name: "Leslie",
      realm: 3, 
      race: 6,  
      background: 5,
      path: "/static/token/mja.png",
      references: {
        characters: [
          { id: 7, label: '未满', edgeType: 1 },
        ],
      },
      referencedBy: {
        characters: [
          { id: 7, label: '未满', edgeType: 1 },
        ],
      }
  },
  {
      id: 7,
      type: CONTENT_TYPES.CHARACTER,
      name: "Belladonna",
      realm: 3, 
      race: 5,
      background: 1,
      path: "/static/token/mja.png",
      references: {
        characters: [
          { id: 6, label: '未满', edgeType: 1 },
          { id: 1, label: '同事', edgeType: 2 },
          { id: 8, label: '姊姊', edgeType: 3 },
        ],
      },
      referencedBy: {
        characters: [
          { id: 6, label: '未满', edgeType: 1 },
          { id: 1, label: '同事', edgeType: 2 },
          { id: 8, label: '妹妹', edgeType: 3 },
        ],
      }
  },
  {
    id: 8,
    type: CONTENT_TYPES.CHARACTER,
    name: "Hyacinth",
    realm: 3, 
    race: 5,
    background: 3,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 7, label: '妹妹', edgeType: 3 },
          { id: 9, label: '同事', edgeType: 2 },
        ],
    },
    referencedBy: {
        characters: [
          { id: 7, label: '姊姊', edgeType: 3 },
          { id: 9, label: '同事', edgeType: 2 },
        ],
    }
  },
  {
    id: 9,
    type: CONTENT_TYPES.CHARACTER,
    name: "Rey",
    realm: 3, 
    race: 4,
    background: 3,
    path: "/static/token/mja.png",
    references:{
        characters: [
          { id: 8, label: '同事', edgeType: 2 },
          { id: 10, label: '未满', edgeType: 1 }
        ],
    },
    referencedBy: {
        characters: [
          { id: 8, label: '同事', edgeType: 2 },
          { id: 10, label: '未满', edgeType: 1 }
        ],
    }
  },
  {
    id: 10,
    type: CONTENT_TYPES.CHARACTER,
    name: "Vee",
    realm: 3, 
    race: 7,
    background: 4,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 9, label: '未满', edgeType: 1 },
        ],
    },
    referencedBy: {
        characters: [
          { id: 9, label: '未满', edgeType: 1 },
        ],
    }
  },
  {
    id: 11,
    type: CONTENT_TYPES.CHARACTER,
    name: "Karnacio",
    realm: 1, 
    race: 8,
    background: 1,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 12, label: '远古纯爱', edgeType: 1 },
          { id: 13, label: '从神', edgeType: 3 },
          { id: 14, label: '神侍', edgeType: 4 },
          { id: 1, label: '造物', edgeType: 4 },
          { id: 15, label: '造物', edgeType: 4 },
        ],
    },
    referencedBy: {
        characters: [
          { id: 12, label: '远古纯爱', edgeType: 1 },
          { id: 13, label: '从神', edgeType: 3 },
          { id: 14, label: '主神', edgeType: 4 },
          { id: 1, label: '父神', edgeType: 4 },
          { id: 15, label: '父神', edgeType: 4 },
         
        ],
    }
  },
  {
    id: 12,
    type: CONTENT_TYPES.CHARACTER,
    name: "Herudis",
    realm: 2, 
    race: 9,
    background: 1,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 11, label: '远古纯爱', edgeType: 1 },
        ],
    },
    referencedBy: {
        characters: [
          { id: 11, label: '远古纯爱', edgeType: 1 },
        ]
    }
  },
  {
    id: 13,
    type: CONTENT_TYPES.CHARACTER,
    name: "Lumo",
    realm: 1, 
    race: 8,
    background: 1,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 11, label: '主神', edgeType: 3 },
          { id: 16, label: '幺子', edgeType: 3 },
          { id: 17, label: '造物', edgeType: 4 },
        ]
    },
    referencedBy: {
        characters: [
          { id: 11, label: '从神', edgeType: 3 },
          { id: 16, label: '母神', edgeType: 3 },
          { id: 17, label: '母神', edgeType: 4 },
        ]
    }
  },
  {
    id: 14,
    type: CONTENT_TYPES.CHARACTER,
    name: "Eyzin",
    realm: 2, 
    race: 10,
    background: 1,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 11, label: '主神', edgeType: 4 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 11, label: '神侍', edgeType: 4 }
        ]
    }
  },
  {
    id: 15,
    type: CONTENT_TYPES.CHARACTER,
    name: "Fjel",
    realm: 2, 
    race: 1,
    background: 1,
    path: "/static/token/mja.png",
    references: {
        characters: [
            { id: 11, label: '父神', edgeType: 4 },
        ]
    },
    referencedBy: {
        characters: [
            { id: 11, label: '造物', edgeType: 4 },
        ]
    }
  },
  {
    id: 16,
    type: CONTENT_TYPES.CHARACTER,
    name: "Mondo",
    realm: 2, 
    race: 11,
    background: 1,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 13, label: '母神', edgeType: 3 },
          { id: 17, label: '??', edgeType: 1 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 13, label: '幺子', edgeType: 3 },
          { id: 17, label: '??', edgeType: 1 }
        ]
    }
  },
  {
    id: 17,
    type: CONTENT_TYPES.CHARACTER,
    name: "Selakorvo",
    realm: 2, 
    race: 1,
    background: 1,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 13, label: '母神', edgeType: 4 },
          { id: 16, label: '??', edgeType: 1 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 13, label: '造物', edgeType: 4 },
          { id: 16, label: '??', edgeType: 1 }
        ]
    }
  },
  {
    id: 18,
    type: CONTENT_TYPES.CHARACTER,
    name: "Mervargr",
    realm: 3, 
    race: 3,
    background: 1,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 1, label: '友人', edgeType: 2 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 1, label: '友人', edgeType: 2 }
        ]
    }
  },
  {
    id: 19,
    type: CONTENT_TYPES.CHARACTER,
    name: "Syor",
    realm: 3, 
    race: 3,
    background: 6,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 5, label: '家主', edgeType: 4 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 5, label: '侍从', edgeType: 4 }
        ]
    }
  },
  {
    id: 20,
    type: CONTENT_TYPES.CHARACTER,
    name: "Fel'rekt",
    realm: 3, 
    race: 3,
    background: 6,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 5, label: '家主', edgeType: 4 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 5, label: '侍从', edgeType: 4 }
        ]
    }
  },
  {
    id: 21,
    type: CONTENT_TYPES.CHARACTER,
    name: "Calimar",
    realm: 3, 
    race: 3,
    background: 6,
    path: "/static/token/mja.png",
    references: {
        characters: [
          { id: 5, label: '家主', edgeType: 4 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 5, label: '侍从', edgeType: 4 }
        ]
    }
  }    
  // ...其他角色
]

export const documents = [
  {
    id: 1,
    type: CONTENT_TYPES.DOCUMENT,
    title: '设定与世界观',
    tags: ['dndoc','设定'],
    path: '/static/md/设定与世界观.md',
    references: {
      characters: [ 1,2 ]
      // ...其他引用
    },
    referencedBy: {
      // ...被引用
    }
  },
  {
    id: 2,
    type: CONTENT_TYPES.DOCUMENT,
    title: '角色A',
    tags: ['dndoc'],
    path: '/static/md/character-a.md',
    references: {
      characters: [ 1 ]
    }
  }
  // ...其他文档
]

export const gallery = [
    {
        id: 1,
        path: "/static/gallery/2024-03-27 155647.jpg",
        tags: ['tag1'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 2,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 3,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 4,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 5,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 6,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 7,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 8,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 9,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 10,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 11,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 12,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 13,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 14,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 15,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 16,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 9,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 10,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 11,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 12,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 13,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 14,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 15,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    },
    {
        id: 16,
        path: "/static/token/mja.png",
        tags: ['tag1', 'tag2'],
        finishedDate: new Date(Date.now() - Math.random() * 10000000000),
        version: (Math.random() * 5).toFixed(1),
        references: [
            { id: `${0 % 10}`, type: 'character' },
            { id: `${0 % 5}`, type: 'location' },
        ]
    }
]
