export interface CharacterClass {
    class: string;
    subClass: string;
    level: number;
  }
  
  export interface CharacterAttributes {
    [key: number]: number;  // 1: STR, 2: DEX, 3: CON, 4: INT, 5: WIS, 6: CHA
  }
  
  export interface StatusDetails {
    VISION: string | string[];
    LANGUAGES: string | string[];
    DAMAGE_IMMUNITY: string | string[];
    DAMAGE_RESISTANCE: string | string[];
    VULNERABILITY: string | string[];
    DAMAGE_BONUS: string | string[];
    STATUS_IMMUNITY: string | string[];
    WEAPON_PROFICIENCY: string | string[];
    ARMOR_PROFICIENCY: string | string[];
    TOOLS: string | string[];
    REPUTATION: string | string[];
    BLESSING: string | string[];
    AMULET: string | string[];
    LEGENDARY_FAVOR: string | string[];
  }
  
  export interface CombatStats {
    armorBonus: number;
    shieldBonus: number;
    otherACBonus: number;
    speed: string;
    specialSpeed: string;
    keyAttribute: number;
    spellDC: number;
  }
  
  export interface BasicInfo {
    size: string;
    alignment: string;
    type: string;
    reference: string;
    referenceUrl: string;
    race: string;
    subrace: string;
    gender: string;
    age: string;
    background: string;
    appearance: {
      height: string;
      weight: string;
      hairColor: string;
      skinColor: string;
      eyeColor: string;
      nailColor: string | null;
    };
  }
  
  export interface CharacterOverrides {
    level: number;
    background: string;
    attributes: CharacterAttributes;
    proficiencyAbilities: number[];
    proficiencyBonus: number;
    doubleProficientSkills: number[];
    proficientSkills: number[];
    halfProficientSkills: number[];
    modifiers: { [key: number]: string };
    savingThrows: { [key: number]: string };
    hitDice: {
      formula: string;
      maxHP: number;
    };
    skillModifiers: { [key: number]: string };
    statusDetails: Partial<StatusDetails>;
    // ... 其他可能被覆盖的属性
  }
  
  export interface classFeatureInfo {
    proficiencyBonus: number;
    spellPoints: number;
    classFeature: string;
    knownCantrips: number;
    knownSpells: number;
    spellSlots: number[];
    martialArts: string; //武艺
    ki: number; //气
    unarmoredMovement: number; //无甲移动
    sneakAttack: string; //偷袭
    knownInvocations: number; //已知祈唤
    rageCount: number; //狂暴次数
    rageDamage: number; //狂暴伤害
    alwaysPreparedSpells: string[]; //始终准备法术
  }
  
  export interface classFeatures {
    className: string;
    level: number;
    feature: string;
  }

  export interface InventoryItem {
    id: number;
    name: string;
    weaponType: string;
    subType: string;
    usage: string;
    quantity: number;
    categoryId: string;
    image: string;
    weight: number | null;
  }

  export interface Character {
    characterId: number;
    name: string;
    basicInfo: Partial<BasicInfo>;
    class: Partial<CharacterClass>[];
    attributes: Partial<CharacterAttributes>;
    doubleProficientSkills: number[];
    proficientSkills: number[];
    halfProficientSkills: number[];
    combatStats: Partial<CombatStats>;
    classFeatureInfo: Partial<classFeatureInfo>;
    classFeatures: Partial<classFeatures>[];
    specialAbilities: string[];
    statusDetails: Partial<StatusDetails>;
    inventoryItem: Partial<InventoryItem>[];
    overrides: Partial<CharacterOverrides>;
  }

  export type OptionalCharacter = Partial<Character>;

  export interface ACStats {
    normal: number;
    flatFooted: number;
    touch: number;
  }

  export interface ComputedCharacterStats extends Character {
    race: string;
    subRace: string;
    background: string;
    mainClass: string;
    basicInfo: Partial<BasicInfo>;
    classList: Partial<CharacterClass>[];
    level: number;
    levelClass: string;
    mainLevel: number;
    spellcastingLevel: number;
    classLevelMap: {
      class: string;
      level: number;
    }[];
    proficiencyAbilities: number[];
    attributes: { [key: number]: number };
    doubleProficientSkills: number[];
    proficientSkills: number[];
    halfProficentSkills: number[];
    armorBonus: number;
    shieldBonus: number;
    otherACBonus: number;
    statusDetails: Partial<StatusDetails>;
    classFeatureInfo: Partial<classFeatureInfo>;
    mainClassFeatureInfo: Partial<classFeatureInfo>;
    inventoryItem: Partial<InventoryItem>[];
    
    // 计算属性
    proficiencyBonus: number;
    modifiers: { [key: number]: string };
    savingThrows: { [key: number]: string };
    hitDice: {
      formula: string;
      maxHP: number;
    };
    skillModifiers: { [key: number]: string };
    ac: ACStats;
    classFeatures: {
      className: string;
      level: number;
      feature: string;
    }[];
    alwaysPreparedSpells: string[];
  }

  export type OptionalComputedStats = Partial<ComputedCharacterStats>;