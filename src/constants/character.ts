// dnd5e人物卡模板v1.81β
export interface CharacterClass {
  class: string;
  subClass: string;
  level: number;
}

export interface CharacterAttributes {
  [key: number]: number;  // 1: STR, 2: DEX, 3: CON, 4: INT, 5: WIS, 6: CHA
}

export interface StatusDetails {
  VISION?: string;
  LANGUAGES?: string;
  DAMAGE_IMMUNITY?: string;
  DAMAGE_RESISTANCE?: string;
  VULNERABILITY?: string;
  DAMAGE_BONUS?: string;
  STATUS_IMMUNITY?: string;
  WEAPON_PROFICIENCY?: string;
  ARMOR_PROFICIENCY?: string;
  TOOLS?: string;
  REPUTATION?: string;
  BLESSING?: string;
  AMULET?: string;
  LEGENDARY_FAVOR?: string;
}

export interface CombatStats {
  armorBonus: number;
  shieldBonus: number;
  otherACBonus: number;
  speed: string;
  specialSpeed?: string;
}

export interface CharacterOverrides {
  level?: number;
  attributes?: CharacterAttributes;
  proficiencyAbilities?: number[];
  proficiencyBonus?: number;
  doubleProficientSkills?: number[];
  proficientSkills?: number[];
  halfProficientSkills?: number[];
  modifiers?: { [key: number]: string };
  savingThrows?: { [key: number]: string };
  hitDice?: {
    formula?: string;
    maxHP?: number;
  };
  skillModifiers?: { [key: number]: string };
  // ... 其他可能被覆盖的属性
}

export interface BasicInfo {
  size: string;
  alignment: string;
  type: string;
  reference: string;
  referenceUrl?: string;
  race: string;
  subrace?: string;
  gender?: string;
  age?: string;
  background: string;
  appearance?: {
    height?: string;
    weight?: string;
    hairColor?: string;
    skinColor?: string;
    eyeColor?: string;
    nailColor?: string | null;
  };
}

export interface Character {
  characterId: number;
  name: string;
  basicInfo: BasicInfo;
  class: CharacterClass[];
  attributes: CharacterAttributes;
  doubleProficientSkills: number[];
  proficientSkills?: number[];
  halfProficientSkills?: number[];
  combatStats: CombatStats;
  statusDetails: StatusDetails;
  overrides?: CharacterOverrides;
}

export const CHARACTER_TEMPLATE: Map<number, Character> = new Map([
  [1, {
    characterId: 1,
    name: 'Mja',
    basicInfo: {
      size: '中型',
      alignment: '守序中立',
      type: '类人生物',
      reference: 'MM pg.14',
      referenceUrl: 'https://books.cinas.cn:8000/read/7794/pdf',
      race: '天使',
      subrace: '-',
      gender: '无',
      age: '-',
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
      { class: '吟游诗人', subClass: '剑舞学院', level: 7 },
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
      speed: '35尺',
      specialSpeed: '飞行 60尺',
    },
    statusDetails: {
        VISION: '黑暗视觉 60 ft',
        LANGUAGES: '通用语, 天界语',
        DAMAGE_IMMUNITY: '疾病',
        DAMAGE_RESISTANCE: '光耀',
        VULNERABILITY: '',
        DAMAGE_BONUS: '',
        STATUS_IMMUNITY: '',
        WEAPON_PROFICIENCY: '简易武器, 军用武器, 长剑, 长弓',
        ARMOR_PROFICIENCY: '轻甲, 中甲, 重甲, 盾牌',
        TOOLS: '里拉琴',
        REPUTATION: '',
        BLESSING: '',
        AMULET: '',
        LEGENDARY_FAVOR: '',
    },
    overrides: {
      skillModifiers: {
        10: '+10',
        18: '+10'
      }
    }
  }]
]);

