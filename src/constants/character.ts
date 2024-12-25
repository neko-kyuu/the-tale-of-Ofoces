// dnd5e人物卡模板v1.81β
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
        categoryId: 'weapons'
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
        hairColor: '#141414',
        skinColor: '#ECD9D7',
        eyeColor: '#C13343',
        nailColor: '#141414'
      }
    },
    class:[
      { class: '术士', subClass: '狂野魔法', level: 12 },
      { class: '游荡者', subClass: '刺客', level: 3 },
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
        categoryId: 'weapons'
      },
    ],
    overrides: {
      skillModifiers: {
        13: '+10',
      },
      statusDetails: {
        TOOLS:['药剂包'],
        REPUTATION:['贸易商业'],
      }
    }
  }]
]);

