// dnd5e人物卡模板v1.81β
// abandoned
import type { OptionalCharacter } from "@/types/dnd5e";

export const CHARACTER_TEMPLATE: Map<number, OptionalCharacter> = new Map([
  [1, {
    characterId: 1,
    name: 'Mja',
    basicInfo: {
      alignment: '守序中立',
      race: '天使',
      subrace: '-',
      gender: '无',
      age: '?',
      background: '调查员',
      appearance: {
        height: '6尺/182cm',
        weight: '75kg',
        hairColor: '#FFD4AE',
        skinColor: '#E7D3D0',
        eyeColor: '#BDA3D8',
        nailColor: null
      }
    },
    class:[
      { class: '圣武士', subClass: '圣武士', level: 9 },
      { class: '吟游诗人', subClass: '剑舞诗人', level: 7 },
    ],
    attributes: {
        1: 19, // STRENGTH
        2: 18, // DEXTERITY
        3: 14, // CONSTITUTION
        4: 14,  // INTELLIGENCE
        5: 14, // WISDOM
        6: 20,  // CHARISMA
    },
    doubleProficientSkills:[1,11],
    combatStats: {
      armorBonus: 5,
      shieldBonus: 0,
      otherACBonus: 5,
    },
    inventoryItem: [
      {
        id: 1,
        name: '裁决 Judex',
        weaponType: '长剑',
        subType:'手半剑',
        usage: '1动作',
        quantity: 1,
        categoryId: 'weapons',
        image: "/static/inventory/judex.png",
      },
    ],
    overrides: {
      skillModifiers: {
        9: '+10',
        10: '+10',
        18: '+10'
      },
      statusDetails: {
        TOOLS:['里拉琴'],
      }
    }
  }],  [2, {
    characterId: 2,
    name: 'Ilse',
    basicInfo: {
      alignment: '混乱中立',
      race: '精灵',
      subrace: '月精灵',
      gender: '男',
      age: '?',
      background: '贵族',
      appearance: {
        height: '6尺/185cm',
        weight: '69kg',
        hairColor: '#252525',
        skinColor: '#ECD9D7',
        eyeColor: '#C13343',
        nailColor: '#252525'
      }
    },
    class:[
      { class: '术士', subClass: '狂野魔法', level: 15 },
    ],
    attributes: {
        1: 10, // STRENGTH
        2: 17, // DEXTERITY
        3: 8, // CONSTITUTION
        4: 19,  // INTELLIGENCE
        5: 12, // WISDOM
        6: 14,  // CHARISMA
    },
    doubleProficientSkills:[2,3,4,7],
    combatStats: {
      armorBonus: 1,
      shieldBonus: 0,
      otherACBonus: 0,
    },
    inventoryItem: [
      {
        id: 1,
        name: '毒刺 Sting',
        weaponType: '短剑',
        usage: '1动作',
        quantity: 1,
        categoryId: 'weapons',
        image: "/static/inventory/sting.png",
      },
    ],
    overrides: {
      skillModifiers: {
        13: '+10',
      },
      statusDetails: {
        TOOLS:['药剂包','毒/麻药'],
        REPUTATION:['贸易商业'],
      }
    }
  }],  [3, {
    characterId: 3,
    name: 'Lewenhart',
    basicInfo: {
      alignment: '守序邪恶',
      race: '精灵',
      subrace: '卓尔',
      gender: '男',
      age: '?',
      background: '水手',
      appearance: {
        height: '6尺/187cm',
        weight: '76kg',
        hairColor: '#EFEAEB',
        skinColor: '#665A58',
        eyeColor: '#252525',
        nailColor: '#252525'
      }
    },
    class:[
      { class: '游侠', subClass: '幽域追猎者', level: 5 },
      { class: '战士', subClass: '魔射手', level: 3 },
      { class: '游荡者', subClass: '决斗家', level: 10 },
    ],
    attributes: {
        1: 17, // STRENGTH
        2: 20, // DEXTERITY
        3: 13, // CONSTITUTION
        4: 17,  // INTELLIGENCE
        5: 15, // WISDOM
        6: 15,  // CHARISMA
    },
    doubleProficientSkills:[1,4,8,13],
    combatStats: {
      armorBonus: 4,
      shieldBonus: 0,
      otherACBonus: 3,
    },
    inventoryItem: [
      {
        id: 1,
        name: '孪生剑 Lady Virna',
        weaponType: '刺剑',
        usage: '1动作',
        quantity: 1,
        categoryId: 'weapons',
        image: "/static/inventory/lady virna.png",
      },
      {
        id: 2,
        name: '重弩',
        weaponType: '重弩',
        usage: '1动作',
        quantity: 1,
        categoryId: 'weapons',
        image: "/static/inventory/crossbow.png",
      }
    ],
    overrides: {
      basicInfo:{
        background:'领航员'
      },
      skillModifiers: {
        12: '+7',
        15: '+7',
        16: '+7',
        17: '+7',
        18: '+7'
      },
      statusDetails: {
        TOOLS:['毒/解药包'],
      }
    }
  }],  [4, {
    characterId: 4,
    name: 'Elvis',
    basicInfo: {
      alignment: '混乱中立',
      race: '精灵',
      subrace: '卓尔',
      gender: '男',
      age: '?',
      background: '密探',
      appearance: {
        height: '6尺/182cm',
        weight: '72kg',
        hairColor: '#EFEAEB',
        skinColor: '#665A58',
        eyeColor: '#5378A1',
        nailColor: '#252525'
      }
    },
    class:[
      { class: '法师', subClass: '预言学派', level: 14 },
      { class: '法师', subClass: '超魔咒使', level: 3 },
    ],
    attributes: {
        1: 13, // STRENGTH
        2: 15, // DEXTERITY
        3: 11, // CONSTITUTION
        4: 18,  // INTELLIGENCE
        5: 16, // WISDOM
        6: 14,  // CHARISMA
    },
    doubleProficientSkills:[],
    combatStats: {
      armorBonus: 1,
      shieldBonus: 0,
      otherACBonus: 3,
    },
    inventoryItem: [
      {
        id: 1,
        name: '孪生剑 Lady Volei',
        weaponType: '刺剑',
        usage: '1动作',
        quantity: 1,
        categoryId: 'weapons'
      }
    ],
    overrides: {
      skillModifiers: {
        6: '+12',
      },
      statusDetails: {
        TOOLS:['施法材料'],
      }
    }
  }]
]);

