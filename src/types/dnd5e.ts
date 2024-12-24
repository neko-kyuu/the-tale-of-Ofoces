export interface CharacterClass {
    class: string;
    subClass: string;
    level: number;
  }
  
  export interface CharacterAttributes {
    [key: number]: number;  // 1: STR, 2: DEX, 3: CON, 4: INT, 5: WIS, 6: CHA
  }
  
  export interface StatusDetails {
    VISION?: string | string[];
    LANGUAGES?: string | string[];
    DAMAGE_IMMUNITY?: string | string[];
    DAMAGE_RESISTANCE?: string | string[];
    VULNERABILITY?: string | string[];
    DAMAGE_BONUS?: string | string[];
    STATUS_IMMUNITY?: string | string[];
    WEAPON_PROFICIENCY?: string | string[];
    ARMOR_PROFICIENCY?: string | string[];
    TOOLS?: string | string[];
    REPUTATION?: string | string[];
    BLESSING?: string | string[];
    AMULET?: string | string[];
    LEGENDARY_FAVOR?: string | string[];
  }
  
  export interface CombatStats {
    armorBonus?: number;
    shieldBonus?: number;
    otherACBonus?: number;
    speed?: string;
    specialSpeed?: string;
    keyAttribute?: number;
    spellDC?: number;
  }
  
  export interface BasicInfo {
    size?: string;
    alignment?: string;
    type?: string;
    reference?: string;
    referenceUrl?: string;
    race?: string;
    subrace?: string;
    gender?: string;
    age?: string;
    background?: string;
    appearance?: {
      height?: string;
      weight?: string;
      hairColor?: string;
      skinColor?: string;
      eyeColor?: string;
      nailColor?: string | null;
    };
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
    statusDetails?: StatusDetails;
    // ... 其他可能被覆盖的属性
  }
  
  export interface classFeatureInfo {
    proficiencyBonus?: number;
    spellPoints?: number;
    classFeature?: string;
    knownCantrips?: number;
    knownSpells?: number;
    spellSlots?: number[];
  }
  

  export interface Character {
    characterId?: number;
    name?: string;
    basicInfo?: BasicInfo;
    class?: CharacterClass[];
    attributes?: CharacterAttributes;
    doubleProficientSkills?: number[];
    proficientSkills?: number[];
    halfProficientSkills?: number[];
    combatStats?: CombatStats;
    classFeatureInfo?: classFeatureInfo;
    statusDetails?: StatusDetails;
    overrides?: CharacterOverrides;
  }