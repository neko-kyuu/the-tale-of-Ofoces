import { CONTENT_TYPES } from "@/constants/types"
import type { 
  Characters, 
  Documents, 
  Gallerys, 
  Ebooks,
  Events,
  Locations,
  Medias,
  Notes,
  LocationPoints
} from '@/types/entities'


export const characters: Characters = [
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
      path: "/static/token/ilse.png",
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
      path: "/static/token/lewenhart.png",
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
      path: "/static/token/elvis.png",
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
      path: "/static/token/wiro.png",
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
      path: "/static/token/leslie.png",
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
      path: "/static/token/belladonna.png",
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
    path: "/static/token/hyacinth.png",
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
    path: "/static/token/rey.png",
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
    path: "/static/token/vee.png",
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
    path: "/static/token/karnacio.png",
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
    path: "/static/token/herudis.png",
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
    path: "/static/token/lumo.png",
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
    path: "/static/token/eyzin.png",
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
    path: "/static/token/fjel.png",
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
    path: "/static/token/mondo.png",
    references: {
        characters: [
          { id: 13, label: '母神', edgeType: 3 },
          { id: 17, label: '恋人?', edgeType: 1 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 13, label: '幺子', edgeType: 3 },
          { id: 17, label: '恋人?', edgeType: 1 }
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
    path: "/static/token/selakorvo.png",
    references: {
        characters: [
          { id: 13, label: '母神', edgeType: 4 },
          { id: 16, label: '恋人?', edgeType: 1 }
        ]
    },
    referencedBy: {
        characters: [
          { id: 13, label: '造物', edgeType: 4 },
          { id: 16, label: '恋人?', edgeType: 1 }
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
    path: "/static/token/mervargr.png",
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
    path: "/static/token/syor.png",
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
    path: "/static/token/felrekt.png",
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
    path: "/static/token/calimar.png",
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

export const documents: Documents = [
  {
    id: 1,
    type: CONTENT_TYPES.DOCUMENT,
    title: '设定与世界观',
    tags: ['dndoc','设定'],
    path: '/static/md/设定与世界观.md',
    references: {
      characters: [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21 ],
      documents: [ 4 ]
      // ...其他引用
    }
  },
  {
    id: 2,
    type: CONTENT_TYPES.DOCUMENT,
    title: '天使是否有味觉，是否有胃？',
    tags: ['dndoc','设定','秘典之页独家报道'],
    path: '/static/md/天使是否有味觉，是否有胃？.md',
    references: {
      characters: [ 1,15,17 ]
    }
  },
  {
    id: 3,
    type: CONTENT_TYPES.DOCUMENT,
    title: '祷告与魔法',
    tags: ['dndoc','设定','环设定'],
    path: '/static/md/祷告与魔法.md',
    references: {
      characters: [ 1,2,5,4 ]
    }
  },
  {
    id: 4,
    type: CONTENT_TYPES.DOCUMENT,
    title: '当我起名时我在想什么',
    tags: ['dndoc','设定'],
    path: '/static/md/当我起名时我在想什么.md',
    references: {
      characters:  [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21 ]
    }
  },
  // ...其他文档
]

export const gallerys: Gallerys = [
    {
        id: 1,
        type: CONTENT_TYPES.GALLERY,
        path: "/static/gallery/2024-03-27 155647.jpg",
        tags: [],
        finishedDate: '2024-03-27',
        version: 1,
        references: {
           characters: [1]
        }
    },
    {
        id: 2,
        type: CONTENT_TYPES.GALLERY,
        path: "/static/gallery/2024-05-23 112745.jpg",
        tags: [],
        finishedDate: '2024-05-23',
        version: 1,
        references: {
           characters: [2]
        }
    },
    {
        id: 3,
        type: CONTENT_TYPES.GALLERY,
        path: "/static/gallery/2024-01-01 150432.png",
        tags: [],
        finishedDate: '2024-01-01',
        version: 1,
        references: {
          characters: [1,2]
        }
    },
    {
      id: 4,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-04-21 202906.png",
      tags: [],
      finishedDate: '2024-04-21',
      version: 1,
      references: {
        characters: [5]
      }
    },
    {
      id: 5,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-02-14 143044.jpg",
      tags: [],
      finishedDate: '2024-02-14',
      version: 1,
      references: {
        characters: [3]
      }
    },
    {
      id: 6,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-01-20 171732.png",
      tags: [],
      finishedDate: '2024-01-20',
      version: 1,
      references: {
        characters: [2,3]
      }
    },
    {
      id: 7,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-02-03 021848.png",
      tags: [],
      finishedDate: '2024-02-03',
      version: 1,
      references: {
        characters: [1]
      }
    },
    {
      id: 8,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-02-10 222638.png",
      tags: [],
      finishedDate: '2024-02-10',
      version: 1,
      references: {
        characters: [4]
      }
    },
    {
      id: 9,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-08-18 223617.png",
      tags: [],
      finishedDate: '2024-08-18',
      version: 1,
      references: {
        characters: [3,4]
      }
    },
    {
      id: 10,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-06-24 232111.png",
      tags: [],
      finishedDate: '2024-06-24',
      version: 1,
      references: {
        characters: [1,2]
      }
    },
    {
      id: 11,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-03-25 012428.jpg",
      tags: [],
      finishedDate: '2024-03-25',
      version: 1,
      references: {
        characters: [1]
      }
    },
    {
      id: 12,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-02-16 171658.jpg",
      tags: [],
      finishedDate: '2024-02-16',
      version: 1,
      references: {
        characters: [2]
      }
    },
    {
      id: 13,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-02-27 022625.png",
      tags: [],
      finishedDate: '2024-02-27',
      version: 1,
      references: {
        characters: [3,4]
      }
    },
    {
      id: 14,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-06-07 204215.png",
      tags: [],
      finishedDate: '2024-06-07',
      version: 1,
      references: {
        characters: [2,3]
      }
    },
    {
      id: 15,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-05-18 230555.jpg",
      tags: [],
      finishedDate: '2024-05-18',
      version: 1,
      references: {
        characters: [20,21]
      }
    },
    {
      id: 16,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-05-13 231517.png",
      tags: [],
      finishedDate: '2024-05-13',
      version: 1,
      references: {
        characters: [8]
      }
    },
    {
      id: 17,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-10-21 223248.jpg",
      tags: [],
      finishedDate: '2024-10-21',
      version: 1,
      references: {
        characters: [1,7]
      }
    },
    {
      id: 18,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-11-04 213036.png",
      tags: [],
      finishedDate: '2024-11-04',
      version: 1,
      references: {
        characters: [2,3]
      }
    },
    {
      id: 19,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-11-10 202553.png",
      tags: [],
      finishedDate: '2024-11-10',
      version: 1,
      references: {
        characters: [1,2]
      }
    },
    {
      id: 20,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-11-21 214938.png",
      tags: [],
      finishedDate: '2024-11-21',
      version: 1,
      references: {
        characters: [5,6]
      }
    },
    {
      id: 21,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-07-16 132808.png",
      tags: [],
      finishedDate: '2024-07-16',
      version: 1,
      references: {
        characters: [4]
      }
    },
    {
      id: 22,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-07-29 000132.png",
      tags: [],
      finishedDate: '2024-07-29',
      version: 1,
      references: {
        characters: [1,11,15,17]
      }
    },
    {
      id: 23,
      type: CONTENT_TYPES.GALLERY,
      path: "/static/gallery/2024-01-07 154930.png",
      tags: [],
      finishedDate: '2024-01-07',
      version: 1,
      references: {
        characters: [7]
      }
    },  
]
export const ebooks: Ebooks = [
  {
    id: 1,
    type: CONTENT_TYPES.EBOOK,
    path: "static/archive/2024-Anniv",
    tags: [],
    finishedDate: '2024-03-27',
    version: 1,
    references: {
       documents: [1]
    }
  },
]

export const events: Events = [
  // ...其他事件（时间轴）
]

export const locations: Locations = [
  // ...其他地图
  {
    id: 1,
    type: CONTENT_TYPES.LOCATION,
    title: 'todo',
    description: 'desp',
    path: '/path/to/map',
    finishedDate: '2024-01-01',
    // locations:[
    //   {
    //     name: 'loc1',
    //     description: 'aaa',
    //     coordinates: [50, 30]
    //   }
    // ],
    references: {
      documents: [1]
    }
  }
]

export const medias: Medias = [
  // ...其他音媒
]

export const notes: Notes = [
  {
    id: 1,
    type: CONTENT_TYPES.NOTE,
    title: '术士与魔法的表现',
    tags: ['引用'],
    displayType: 'document',
    noteCategory: 'settings',
    path: '/static/md/术士与魔法的表现.md',
    references: {
      documents: [3]
    }
  }
  // ...其他备忘录
]

export const locationPoints: LocationPoints = [
  {
    id: 1,
    type: CONTENT_TYPES.LOCATION_POINT,
    pointType: 'city',
    path: '',
    title: 'loc1',
    description: 'aaa',
    coordinates: [50, 30],
    parentId: 1,
  }
  // ...其他位置点
]
