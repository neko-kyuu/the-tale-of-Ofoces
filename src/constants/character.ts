// dnd5e人物卡模板v1.81β
import type { Character } from "@/types/dnd5e";

export const CHARACTER_TEMPLATE: Map<number, Character> = new Map([
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
        weight: '-',
        hairColor: '#FFD4AE',
        skinColor: '#BDA3D8',
        eyeColor: '#E7D3D0',
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
    overrides: {
      skillModifiers: {
        10: '+10',
        18: '+10'
      },
      statusDetails: {
        LANGUAGES: ['通用语'],
        TOOLS:['里拉琴'],
      }
    }
  }]
]);

