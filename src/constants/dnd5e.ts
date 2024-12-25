import { Character, classFeatureInfo} from "@/types/dnd5e";

type ClassHitDice = {
  [key: string]: { hitDice: string, diceValue: number };
};

export const CLASS_HIT_DICE: ClassHitDice = {
  法师: { hitDice: 'd6', diceValue: 4 },
  术士: { hitDice: 'd6', diceValue: 4 },
  吟游诗人: { hitDice: 'd8', diceValue: 5 },
  牧师: { hitDice: 'd8', diceValue: 5 },
  德鲁伊: { hitDice: 'd8', diceValue: 5 },
  武僧: { hitDice: 'd8', diceValue: 5 },
  游荡者: { hitDice: 'd8', diceValue: 5 },
  邪术师: { hitDice: 'd8', diceValue: 5 },
  奇械师: { hitDice: 'd8', diceValue: 5 },
  战士: { hitDice: 'd10', diceValue: 6 },
  圣武士: { hitDice: 'd10', diceValue: 6 },
  游侠: { hitDice: 'd10', diceValue: 6 },
  野蛮人: { hitDice: 'd12', diceValue: 7 }
};

export const ATTRIBUTES = [
  { id: 1, name: '力量' },
  { id: 2, name: '敏捷' },
  { id: 3, name: '体质' },
  { id: 4, name: '智力' },
  { id: 5, name: '感知' },
  { id: 6, name: '魅力' },
]
export const SKILLS = [
  { id: 1, name: '运动', attributeId: 1 },
  { id: 2, name: '特技', attributeId: 2 },
  { id: 3, name: '巧手', attributeId: 2 },
  { id: 4, name: '隐匿', attributeId: 2 },
  { id: 5, name: '调查', attributeId: 4 },
  { id: 6, name: '奥秘', attributeId: 4 },
  { id: 7, name: '历史', attributeId: 4 },
  { id: 8, name: '自然', attributeId: 4 },
  { id: 9, name: '宗教', attributeId: 4  },
  { id: 10, name: '察觉', attributeId: 5 },
  { id: 11, name: '洞悉', attributeId: 5 },
  { id: 12, name: '驯兽', attributeId: 5 },
  { id: 13, name: '医药', attributeId: 5 },
  { id: 14, name: '求生', attributeId: 5 },
  { id: 15, name: '游说', attributeId: 6 },
  { id: 16, name: '欺瞒', attributeId: 6 },
  { id: 17, name: '威吓', attributeId: 6 },
  { id: 18, name: '表演', attributeId: 6 },
]

type RaceAttributes = {
  [key: string]: Character
}

export const RACE_ATTRIBUTES: RaceAttributes = {
  天使:{
    basicInfo:{
      size: "中型",
      type: '类人生物',
      reference: 'MM pg.14',
      referenceUrl: 'https://books.cinas.cn:8000/read/7794/pdf',
    },
    combatStats: {
      speed: "30 ft",
      specialSpeed: "飞行 90 ft",
    },
    proficientSkills:[10],
    statusDetails: {
      VISION: ['黑暗视觉 120 ft'],
      LANGUAGES: ['通用语', '天界语', '心灵感应 120 ft'],
      DAMAGE_IMMUNITY: ['疾病'],
      DAMAGE_RESISTANCE: ['光耀', '死灵'],
      DAMAGE_BONUS: ['光耀'],
      STATUS_IMMUNITY: ['魅惑', '恐惧']
    },
  },
  精灵:{
    basicInfo:{
      size: "中型",
      type: '类人生物',
    },
    combatStats: {
      speed: "30 ft",
    },
    proficientSkills:[10],
    statusDetails: {
      VISION: '黑暗视觉 60 ft',
      LANGUAGES: ['通用语', '精灵语'],
    },
  }
}

type StatusDetails = {
  TOOLS: string[];
};

type BackgroundAttributes = {
  statusDetails: StatusDetails;
  proficientSkills: number[];
};

export const BACKGROUND_ATTRIBUTES: Record<string, BackgroundAttributes> = {
  侍僧: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [11, 9] 
  },
  骗子: { 
    statusDetails: { TOOLS: ['易容工具', '文书伪造工具'] }, 
    proficientSkills: [16, 3] 
  },
  罪犯: { 
    statusDetails: { TOOLS: ['一种赌具', '盗贼工具'] }, 
    proficientSkills: [16, 4] 
  },
  密探: { 
    statusDetails: { TOOLS: ['一种赌具', '盗贼工具'] }, 
    proficientSkills: [16, 4] 
  },
  艺人: { 
    statusDetails: { TOOLS: ['易容工具', '一种乐器'] }, 
    proficientSkills: [2, 18] 
  },
  角斗士: { 
    statusDetails: { TOOLS: ['易容工具', '一种乐器'] }, 
    proficientSkills: [2, 18] 
  },
  平民英雄: { 
    statusDetails: { TOOLS: ['一种工匠工具', '载具(陆运)'] }, 
    proficientSkills: [12, 14] 
  },
  公会工匠: { 
    statusDetails: { TOOLS: ['一种工匠工具'] }, 
    proficientSkills: [11, 15] 
  },
  公会商人: { 
    statusDetails: { TOOLS: ['一种工匠工具'] }, 
    proficientSkills: [11, 15] 
  },
  隐士: { 
    statusDetails: { TOOLS: ['草药工具'] }, 
    proficientSkills: [13, 9] 
  },
  贵族: { 
    statusDetails: { TOOLS: ['一种赌具'] }, 
    proficientSkills: [7, 15] 
  },
  骑士: { 
    statusDetails: { TOOLS: ['一种赌具'] }, 
    proficientSkills: [7, 15] 
  },
  化外之民: { 
    statusDetails: { TOOLS: ['一种乐器'] }, 
    proficientSkills: [1, 14] 
  },
  智者: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [6, 7] 
  },
  水手: { 
    statusDetails: { TOOLS: ['领航工具', '载具(水运)'] }, 
    proficientSkills: [1, 10] 
  },
  海盗: { 
    statusDetails: { TOOLS: ['领航工具', '载具(水运)'] }, 
    proficientSkills: [1, 10] 
  },
  士兵: { 
    statusDetails: { TOOLS: ['一种赌具', '载具(陆运)'] }, 
    proficientSkills: [1, 17] 
  },
  流浪儿: { 
    statusDetails: { TOOLS: ['易容工具', '盗贼工具'] }, 
    proficientSkills: [3, 4] 
  },
  城市守卫: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [1, 11] 
  },
  氏族工匠: { 
    statusDetails: { TOOLS: ['一种自选的匠人工具'] }, 
    proficientSkills: [7, 11] 
  },
  隐修学者: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [7, 6, 8, 9] 
  },
  朝臣: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [11, 15] 
  },
  派系特工: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [11] 
  },
  远行者: { 
    statusDetails: { TOOLS: ['任何一项音乐或是赌博工具'] }, 
    proficientSkills: [11, 10] 
  },
  继承者: { 
    statusDetails: { TOOLS: ['从游戏组或乐器中选择一个'] }, 
    proficientSkills: [14, 6, 7, 9] 
  },
  教团骑士: { 
    statusDetails: { TOOLS: ['一种游戏组或乐器'] }, 
    proficientSkills: [15, 6, 7, 9] 
  },
  老佣兵: { 
    statusDetails: { TOOLS: ['一种赌具', '载具(陆运)'] }, 
    proficientSkills: [1, 15] 
  },
  城市猎人: { 
    statusDetails: { TOOLS: ['从一种赌具', '一种乐器', '盗贼工具中选择两项'] }, 
    proficientSkills: [16, 11, 15, 4] 
  },
  乌斯伽部族成员: { 
    statusDetails: { TOOLS: ['一种乐器', '工匠工具'] }, 
    proficientSkills: [1, 14] 
  },
  深水人贵族: { 
    statusDetails: { TOOLS: ['一种赌具', '一种乐器'] }, 
    proficientSkills: [7, 15] 
  },
  俄佐立官员: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [11, 17] 
  },
  波洛斯军团兵: { 
    statusDetails: { TOOLS: ['一种赌具'] }, 
    proficientSkills: [1, 17] 
  },
  底密尔特务: { 
    statusDetails: { TOOLS: ['易容工具'] }, 
    proficientSkills: [16, 4] 
  },
  葛加理成员: { 
    statusDetails: { TOOLS: ['制毒工具'] }, 
    proficientSkills: [8, 14] 
  },
  古鲁反抗者: { 
    statusDetails: { TOOLS: ['草药工具'] }, 
    proficientSkills: [12, 1] 
  },
  伊捷工程师: { 
    statusDetails: { TOOLS: ['任选一种工匠工具'] }, 
    proficientSkills: [6, 5] 
  },
  欧佐夫议员: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [17, 9] 
  },
  拉铎斯邪教徒: { 
    statusDetails: { TOOLS: ['一种乐器'] }, 
    proficientSkills: [2, 18] 
  },
  瑟雷尼亚祀徒: { 
    statusDetails: { TOOLS: ['一种工匠工具', '乐器'] }, 
    proficientSkills: [8, 15] 
  },
  析米克科学家: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [6, 13] 
  },
  家族代理人: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [5, 15] 
  },
  名人冒险家的子孙: { 
    statusDetails: { TOOLS: ['易容工具'] }, 
    proficientSkills: [10, 18] 
  },
  失败商人: { 
    statusDetails: { TOOLS: ['一种工匠工具'] }, 
    proficientSkills: [5, 15] 
  },
  赌徒: { 
    statusDetails: { TOOLS: ['一种赌具'] }, 
    proficientSkills: [16, 11] 
  },
  起诉人: { 
    statusDetails: { TOOLS: ['一种工匠工具'] }, 
    proficientSkills: [13, 15] 
  },
  竞争对手实习生: { 
    statusDetails: { TOOLS: ['一种工匠工具'] }, 
    proficientSkills: [7, 5] 
  },
  自由斗士: { 
    statusDetails: { TOOLS: ['一种乐器', '盗贼工具'] }, 
    proficientSkills: [16, 18] 
  },
  沃什塔克特工: { 
    statusDetails: { TOOLS: ['制毒工具'] }, 
    proficientSkills: [16, 4] 
  },
  运动员: { 
    statusDetails: { TOOLS: ['载具(陆运)'] }, 
    proficientSkills: [2, 1] 
  },
  噩梦缠身: { 
    statusDetails: { TOOLS: [] }, 
    proficientSkills: [6, 5, 9, 14] 
  },
  调查员: { 
    statusDetails: { TOOLS: ['易容工具', '盗贼工具'] }, 
    proficientSkills: [11, 5, 10]
  },
  衡鉴学生: {
    statusDetails: { TOOLS: [] },
    proficientSkills: [7, 9]
  },
  粹丽学生: {
    statusDetails: { TOOLS: ['一种乐器', '一种工匠工具'] },
    proficientSkills: [2, 18]
  },
  量析学生: {
    statusDetails: { TOOLS: ['一种工匠工具'] },
    proficientSkills: [6, 8]
  },
  银毫学生: {
    statusDetails: { TOOLS: [] },
    proficientSkills: [17, 15]
  },
  靡华学生: {
    statusDetails: { TOOLS: ['草药工具'] },
    proficientSkills: [8, 14]
  },
  星界浪客: {
    statusDetails: { TOOLS: [] },
    proficientSkills: [11, 9]
  },
  荒宇人: {
    statusDetails: { TOOLS: ['领航者工具', '载具(太空)'] },
    proficientSkills: [1, 14]
  },
  巨人养子: {
    statusDetails: { TOOLS: [] },
    proficientSkills: [17, 14]
  },
  符文雕刻者: {
    statusDetails: { TOOLS: ['一种工匠工具'] },
    proficientSkills: [7, 10]
  },
  受宠者: {
    statusDetails: { TOOLS: ['一种你自选的赌具'] },
    proficientSkills: [11, 15]
  },
  受难者: {
    statusDetails: { TOOLS: ['一种你自选的赌具'] },
    proficientSkills: [4, 14]
  }
};

type ClassAttributes = {
  proficiencyAbilities: number[];
  statusDetails: { 
    WEAPON_PROFICIENCY: string[], 
    ARMOR_PROFICIENCY: string[] 
  };
  combatStats?: {
    keyAttribute: number;
  };
  classFeatureInfo?: Map<number, classFeatureInfo>;
  specialAbilities?: string[];
}

export const CLASS_ATTRIBUTES: Record<string, ClassAttributes> = {
  法师: {
    proficiencyAbilities: [4, 5],
    statusDetails: {
      WEAPON_PROFICIENCY: ['匕首', '飞镖', '投石索', '长棍', '轻弩'],
      ARMOR_PROFICIENCY: ['无']
    },
    combatStats:{
      keyAttribute: 4,
    },
    classFeatureInfo: new Map([
      [1, { proficiencyBonus: 2, classFeature: "施法，奥术回想", knownCantrips: 3, spellSlots: [2, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [2, { proficiencyBonus: 2, classFeature: "选择奥术传承", knownCantrips: 3, spellSlots: [3, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [3, { proficiencyBonus: 2, classFeature: "", knownCantrips: 3, spellSlots: [4, 2, 0, 0, 0, 0, 0, 0, 0] }],
      [4, { proficiencyBonus: 2, classFeature: "属性值提升", knownCantrips: 4, spellSlots: [4, 3, 0, 0, 0, 0, 0, 0, 0] }],
      [5, { proficiencyBonus: 3, classFeature: "", knownCantrips: 4, spellSlots: [4, 3, 2, 0, 0, 0, 0, 0, 0] }],
      [6, { proficiencyBonus: 3, classFeature: "奥术传承特性", knownCantrips: 4, spellSlots: [4, 3, 3, 0, 0, 0, 0, 0, 0] }],
      [7, { proficiencyBonus: 3, classFeature: "", knownCantrips: 4, spellSlots: [4, 3, 3, 1, 0, 0, 0, 0, 0] }],
      [8, { proficiencyBonus: 3, classFeature: "属性值提升", knownCantrips: 4, spellSlots: [4, 3, 3, 2, 0, 0, 0, 0, 0] }],
      [9, { proficiencyBonus: 4, classFeature: "", knownCantrips: 4, spellSlots: [4, 3, 3, 3, 0, 0, 0, 0, 0] }],
      [10, { proficiencyBonus: 4, classFeature: "奥术传承特性", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 2, 0, 0, 0, 0] }],
      [11, { proficiencyBonus: 4, classFeature: "", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0] }],
      [12, { proficiencyBonus: 4, classFeature: "属性值提升", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0] }],
      [13, { proficiencyBonus: 5, classFeature: "", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0] }],
      [14, { proficiencyBonus: 5, classFeature: "奥术传承特性", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0] }],
      [15, { proficiencyBonus: 5, classFeature: "", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0] }],
      [16, { proficiencyBonus: 5, classFeature: "属性值提升", knownCantrips: 5, spellSlots: [3, 3, 3, 3, 2, 1, 1, 0, 0] }],
      [17, { proficiencyBonus: 6, classFeature: "", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 3, 1, 1, 1, 0] }],
      [18, { proficiencyBonus: 6, classFeature: "法术精通", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 3, 1, 1, 1, 1] }],
      [19, { proficiencyBonus: 6, classFeature: "属性值提升", knownCantrips: 5, spellSlots: [4, 3, 3, 3, 3, 2, 1, 1, 1] }],
      [20, { proficiencyBonus: 6, classFeature: "招牌法术", knownCantrips: 5, spellSlots: [3, 3, 3, 3, 3, 2, 2, 1, 1] }]
    ])
  },
  术士: {
    proficiencyAbilities: [3, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['匕首', '飞镖', '投石索', '长棍', '轻弩'],
      ARMOR_PROFICIENCY: ['无']
    },
    combatStats:{
      keyAttribute: 6,
    },
    classFeatureInfo:new Map([
      [1, { proficiencyBonus: 2, spellPoints: 0, classFeature: "施法，术法起源", knownCantrips: 4, knownSpells: 2, spellSlots: [2, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [2, { proficiencyBonus: 2, spellPoints: 2, classFeature: "魔力泉涌", knownCantrips: 4, knownSpells: 3, spellSlots: [3, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [3, { proficiencyBonus: 2, spellPoints: 3, classFeature: "超魔法", knownCantrips: 4, knownSpells: 4, spellSlots: [4, 2, 0, 0, 0, 0, 0, 0, 0] }],
      [4, { proficiencyBonus: 2, spellPoints: 4, classFeature: "属性值提升", knownCantrips: 5, knownSpells: 5, spellSlots: [4, 3, 0, 0, 0, 0, 0, 0, 0] }],
      [5, { proficiencyBonus: 3, spellPoints: 5, classFeature: "", knownCantrips: 5, knownSpells: 6, spellSlots: [4, 3, 2, 0, 0, 0, 0, 0, 0] }],
      [6, { proficiencyBonus: 3, spellPoints: 6, classFeature: "术法起源特性", knownCantrips: 5, knownSpells: 7, spellSlots: [4, 3, 3, 0, 0, 0, 0, 0, 0] }],
      [7, { proficiencyBonus: 3, spellPoints: 7, classFeature: "", knownCantrips: 5, knownSpells: 8, spellSlots: [4, 3, 3, 1, 0, 0, 0, 0, 0] }],
      [8, { proficiencyBonus: 3, spellPoints: 8, classFeature: "属性值提升", knownCantrips: 5, knownSpells: 9, spellSlots: [4, 3, 3, 2, 0, 0, 0, 0, 0] }],
      [9, { proficiencyBonus: 4, spellPoints: 9, classFeature: "", knownCantrips: 5, knownSpells: 10, spellSlots: [4, 3, 3, 3, 1, 0, 0, 0, 0] }],
      [10, { proficiencyBonus: 4, spellPoints: 10, classFeature: "超魔法", knownCantrips: 6, knownSpells: 11, spellSlots: [4, 3, 3, 3, 2, 0, 0, 0, 0] }],
      [11, { proficiencyBonus: 4, spellPoints: 11, classFeature: "", knownCantrips: 6, knownSpells: 12, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0] }],
      [12, { proficiencyBonus: 4, spellPoints: 12, classFeature: "属性值提升", knownCantrips: 6, knownSpells: 12, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0] }],
      [13, { proficiencyBonus: 5, spellPoints: 13, classFeature: "", knownCantrips: 6, knownSpells: 13, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0] }],
      [14, { proficiencyBonus: 5, spellPoints: 14, classFeature: "术法起源特性", knownCantrips: 6, knownSpells: 13, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0] }],
      [15, { proficiencyBonus: 5, spellPoints: 15, classFeature: "", knownCantrips: 6, knownSpells: 14, spellSlots: [4, 3, 3, 3, 2, 1, 1, 1, 0] }],
      [16, { proficiencyBonus: 5, spellPoints: 16, classFeature: "属性值提升", knownCantrips: 6, knownSpells: 14, spellSlots: [4, 3, 3, 3, 2, 1, 1, 1, 1] }],
      [17, { proficiencyBonus: 6, spellPoints: 17, classFeature: "超魔法", knownCantrips: 6, knownSpells: 15, spellSlots: [4, 3, 3, 3, 2, 1, 1, 1, 1] }],
      [18, { proficiencyBonus: 6, spellPoints: 18, classFeature: "术法起源特性", knownCantrips: 6, knownSpells: 15, spellSlots: [4, 3, 3, 3, 3, 1, 1, 1, 1] }],
      [19, { proficiencyBonus: 6, spellPoints: 19, classFeature: "属性值提升", knownCantrips: 6, knownSpells: 15, spellSlots: [4, 3, 3, 3, 3, 2, 1, 1, 1] }],
      [20, { proficiencyBonus: 6, spellPoints: 20, classFeature: "术法复苏", knownCantrips: 6, knownSpells: 15, spellSlots: [4, 3, 3, 3, 3, 2, 2, 1, 1] }]
    ]),
    specialAbilities:['谨慎法术','远程法术','强效法术','延效法术','升阶法术','瞬发法术','精妙法术','孪生法术'] 
  },
  吟游诗人: {
    proficiencyAbilities: [2, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '手弩', '长剑', '刺剑', '短剑'],
      ARMOR_PROFICIENCY: ['轻甲']
    },
    combatStats:{
      keyAttribute: 6,
    },
    classFeatureInfo:new Map([
      [1, { proficiencyBonus: 2, classFeature: "施法, 诗人激励(d6)", knownCantrips: 2, knownSpells: 4, spellSlots: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [2, { proficiencyBonus: 2, classFeature: "万事通, 休憩曲(d6)", knownCantrips: 2, knownSpells: 5, spellSlots: [3, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [3, { proficiencyBonus: 2, classFeature: "选择诗人学院, 专精", knownCantrips: 2, knownSpells: 6, spellSlots: [4, 2, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [4, { proficiencyBonus: 2, classFeature: "属性值提升", knownCantrips: 3, knownSpells: 7, spellSlots: [4, 3, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [5, { proficiencyBonus: 3, classFeature: "诗人激励(d8), 激励之源", knownCantrips: 3, knownSpells: 8, spellSlots: [4, 3, 2, 0, 0, 0, 0, 0, 0, 0] }],
      [6, { proficiencyBonus: 3, classFeature: "反迷惑, 学院特性", knownCantrips: 3, knownSpells: 9, spellSlots: [4, 3, 3, 0, 0, 0, 0, 0, 0, 0] }],
      [7, { proficiencyBonus: 3, classFeature: "", knownCantrips: 3, knownSpells: 10, spellSlots: [4, 3, 3, 1, 0, 0, 0, 0, 0, 0] }],
      [8, { proficiencyBonus: 3, classFeature: "属性值提升", knownCantrips: 3, knownSpells: 11, spellSlots: [4, 3, 3, 2, 0, 0, 0, 0, 0, 0] }],
      [9, { proficiencyBonus: 4, classFeature: "休憩曲(d8)", knownCantrips: 3, knownSpells: 12, spellSlots: [4, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0] }],
      [10, { proficiencyBonus: 4, classFeature: "诗人激励(d10), 专精, 魔法奥秘", knownCantrips: 4, knownSpells: 14, spellSlots: [4, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0] }],
      [11, { proficiencyBonus: 5, classFeature: "", knownCantrips: 4, knownSpells: 15, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0, 0] }],
      [12, { proficiencyBonus: 5, classFeature: "属性值提升", knownCantrips: 4, knownSpells: 15, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0, 0] }],
      [13, { proficiencyBonus: 5, classFeature: "休憩曲(d10)", knownCantrips: 4, knownSpells: 16, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0, 0] }],
      [14, { proficiencyBonus: 5, classFeature: "魔法奥秘, 学院特性", knownCantrips: 4, knownSpells: 18, spellSlots: [4, 3, 3, 3, 2, 1, 1, 1, 0, 0] }],
      [15, { proficiencyBonus: 5, classFeature: "诗人激励(d12)", knownCantrips: 4, knownSpells: 19, spellSlots: [4, 3, 3, 3, 2, 1, 1, 1, 1, 0] }],
      [16, { proficiencyBonus: 5, classFeature: "属性值提升", knownCantrips: 4, knownSpells: 19, spellSlots: [4, 3, 3, 3, 2, 1, 1, 1, 1, 0] }],
      [17, { proficiencyBonus: 6, classFeature: "休憩曲(d12)", knownCantrips: 4, knownSpells: 20, spellSlots: [4, 3, 3, 3, 3, 1, 1, 1, 1, 1] }],
      [18, { proficiencyBonus: 6, classFeature: "魔法奥秘", knownCantrips: 4, knownSpells: 22, spellSlots: [4, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1] }],
      [19, { proficiencyBonus: 6, classFeature: "属性值提升", knownCantrips: 4, knownSpells: 22, spellSlots: [4, 3, 3, 3, 3, 2, 2, 1, 1, 1, 1] }],
      [20, { proficiencyBonus: 6, classFeature: "先发激励", knownCantrips: 4, knownSpells: 22, spellSlots: [4, 3, 3, 3, 3, 2, 2, 2, 1, 1, 1] }]
    ])
  },
  牧师: {
    proficiencyAbilities: [5, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌']
    },
    combatStats:{
      keyAttribute: 5,
    },
  },
  德鲁伊: {
    proficiencyAbilities: [4, 5],
    statusDetails: {
      WEAPON_PROFICIENCY: ['短棒', '匕首', '飞镖', 'ḷ枪', '硬头锤', '长棍', '弯刀', '镰刀', '投石索', '矛'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌(德鲁伊不能装备或使用金属质的护甲和盾)']
    },
    combatStats:{
      keyAttribute: 5,
    },
  },
  武僧: {
    proficiencyAbilities: [1, 2],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '短剑'],
      ARMOR_PROFICIENCY: ['无']
    },
    combatStats:{
      keyAttribute: 5,
    },
  },
  游荡者: {
    proficiencyAbilities: [2, 4],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '手弩', '长剑', '刺剑', '短剑'],
      ARMOR_PROFICIENCY: ['轻甲']
    },
    combatStats:{
      keyAttribute: 2,
    },
  },
  邪术师: {
    proficiencyAbilities: [5, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器'],
      ARMOR_PROFICIENCY: ['轻甲']
    },
    combatStats:{
      keyAttribute: 6,
    },
  },
  奇械师: {
    proficiencyAbilities: [3, 4],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌']
    },
    combatStats:{
      keyAttribute: 4,
    },
  },
  战士: {
    proficiencyAbilities: [1, 3],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '军用武器'],
      ARMOR_PROFICIENCY: ['所有护甲', '盾牌']
    },
    combatStats:{ 
      keyAttribute: 1,
    },
  },
  圣武士: {
    proficiencyAbilities: [5, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '军用武器'],
      ARMOR_PROFICIENCY: ['所有护甲', '盾牌']
    },
    combatStats:{ 
      keyAttribute: 6,
    },
    classFeatureInfo:new Map([
      [1, { proficiencyBonus: 2, classFeature: "神圣感知, 圣疗", spellSlots: [0, 0, 0, 0, 0] }],
      [2, { proficiencyBonus: 2, classFeature: "至圣斩, 战斗风格, 施法", spellSlots: [2, 0, 0, 0, 0] }],
      [3, { proficiencyBonus: 2, classFeature: "神佑, 选择神圣誓言", spellSlots: [3, 0, 0, 0, 0] }],
      [4, { proficiencyBonus: 2, classFeature: "属性值提升", spellSlots: [3, 0, 0, 0, 0] }],
      [5, { proficiencyBonus: 3, classFeature: "额外攻击", spellSlots: [4, 2, 0, 0, 0] }],
      [6, { proficiencyBonus: 3, classFeature: "守护灵光", spellSlots: [4, 2, 0, 0, 0] }],
      [7, { proficiencyBonus: 3, classFeature: "圣誓特性", spellSlots: [4, 3, 0, 0, 0] }],
      [8, { proficiencyBonus: 3, classFeature: "属性值提升", spellSlots: [4, 3, 0, 0, 0] }],
      [9, { proficiencyBonus: 4, classFeature: "", spellSlots: [4, 3, 2, 0, 0] }],
      [10, { proficiencyBonus: 4, classFeature: "勇气灵光", spellSlots: [4, 3, 2, 0, 0] }],
      [11, { proficiencyBonus: 4, classFeature: "精通至圣斩", spellSlots: [4, 3, 3, 0, 0] }],
      [12, { proficiencyBonus: 4, classFeature: "属性值提升", spellSlots: [4, 3, 3, 0, 0] }],
      [13, { proficiencyBonus: 5, classFeature: "", spellSlots: [4, 3, 3, 1, 0] }],
      [14, { proficiencyBonus: 5, classFeature: "净化之触", spellSlots: [4, 3, 3, 1, 0] }],
      [15, { proficiencyBonus: 5, classFeature: "圣誓特性", spellSlots: [4, 3, 3, 2, 0] }],
      [16, { proficiencyBonus: 5, classFeature: "属性值提升", spellSlots: [4, 3, 3, 2, 0] }],
      [17, { proficiencyBonus: 6, classFeature: "", spellSlots: [4, 3, 3, 3, 1] }],
      [18, { proficiencyBonus: 6, classFeature: "灵光增效", spellSlots: [4, 3, 3, 3, 1] }],
      [19, { proficiencyBonus: 6, classFeature: "属性值提升", spellSlots: [4, 3, 3, 3, 2] }],
      [20, { proficiencyBonus: 6, classFeature: "圣誓特性", spellSlots: [4, 3, 3, 3, 2] }]
    ])
  },
  游侠: {
    proficiencyAbilities: [1, 2],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '军用武器'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌']
    },
    combatStats:{
      keyAttribute: 5,
    },
    classFeatureInfo:new Map([
      [1, { proficiencyBonus: 2, classFeature: "宿敌, 自然探索者", knownSpells: 1, spellSlots: [1, 0, 0, 0, 0] }],
      [2, { proficiencyBonus: 2, classFeature: "战斗风格, 施法", knownSpells: 2, spellSlots: [2, 0, 0, 0, 0] }],
      [3, { proficiencyBonus: 2, classFeature: "选择游侠范型, 原初意识", knownSpells: 3, spellSlots: [3, 0, 0, 0, 0] }],
      [4, { proficiencyBonus: 2, classFeature: "属性值提升", knownSpells: 3, spellSlots: [3, 0, 0, 0, 0] }],
      [5, { proficiencyBonus: 3, classFeature: "额外攻击", knownSpells: 4, spellSlots: [4, 2, 0, 0, 0] }],
      [6, { proficiencyBonus: 3, classFeature: "增加宿敌及偏好环境", knownSpells: 4, spellSlots: [4, 2, 0, 0, 0] }],
      [7, { proficiencyBonus: 3, classFeature: "范型特性", knownSpells: 5, spellSlots: [4, 3, 0, 0, 0] }],
      [8, { proficiencyBonus: 3, classFeature: "属性值提升, 大地行者", knownSpells: 5, spellSlots: [4, 3, 0, 0, 0] }],
      [9, { proficiencyBonus: 4, classFeature: "", knownSpells: 6, spellSlots: [4, 3, 2, 0, 0] }],
      [10, { proficiencyBonus: 4, classFeature: "增加偏好环境, 遁术", knownSpells: 6, spellSlots: [4, 3, 2, 0, 0] }],
      [11, { proficiencyBonus: 4, classFeature: "范型特性", knownSpells: 7, spellSlots: [4, 3, 3, 0, 0] }],
      [12, { proficiencyBonus: 4, classFeature: "属性值提升", knownSpells: 7, spellSlots: [4, 3, 3, 0, 0] }],
      [13, { proficiencyBonus: 5, classFeature: "", knownSpells: 8, spellSlots: [4, 3, 3, 1, 0] }],
      [14, { proficiencyBonus: 5, classFeature: "增加宿敌, 无踪步", knownSpells: 8, spellSlots: [4, 3, 3, 1, 0] }],
      [15, { proficiencyBonus: 5, classFeature: "范型特性", knownSpells: 9, spellSlots: [4, 3, 3, 2, 0] }],
      [16, { proficiencyBonus: 5, classFeature: "属性值提升", knownSpells: 9, spellSlots: [4, 3, 3, 2, 0] }],
      [17, { proficiencyBonus: 6, classFeature: "", knownSpells: 10, spellSlots: [4, 3, 3, 3, 1] }],
      [18, { proficiencyBonus: 6, classFeature: "野性感官", knownSpells: 10, spellSlots: [4, 3, 3, 3, 1] }],
      [19, { proficiencyBonus: 6, classFeature: "属性值提升", knownSpells: 11, spellSlots: [4, 3, 3, 3, 2] }],
      [20, { proficiencyBonus: 6, classFeature: "屠灭众敌", knownSpells: 11, spellSlots: [4, 3, 3, 3, 2] }]
    ])
  },
  野蛮人: {
    proficiencyAbilities: [1, 3],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '军用武器'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌']
    },
    combatStats:{
      keyAttribute: 3,
    },
  },
  兼职施法者: {
    classFeatureInfo:new Map([
      [1, { proficiencyBonus: 2, spellSlots: [2, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [2, { proficiencyBonus: 2, spellSlots: [3, 0, 0, 0, 0, 0, 0, 0, 0] }],
      [3, { proficiencyBonus: 2, spellSlots: [4, 2, 0, 0, 0, 0, 0, 0, 0] }],
      [4, { proficiencyBonus: 2, spellSlots: [4, 3, 0, 0, 0, 0, 0, 0, 0] }],
      [5, { proficiencyBonus: 3, spellSlots: [4, 3, 2, 0, 0, 0, 0, 0, 0] }],
      [6, { proficiencyBonus: 3, spellSlots: [4, 3, 3, 0, 0, 0, 0, 0, 0] }],
      [7, { proficiencyBonus: 3, spellSlots: [4, 3, 3, 1, 0, 0, 0, 0, 0] }],
      [8, { proficiencyBonus: 3, spellSlots: [4, 3, 3, 2, 0, 0, 0, 0, 0] }],
      [9, { proficiencyBonus: 4, spellSlots: [4, 3, 3, 3, 0, 0, 0, 0, 0] }],
      [10, { proficiencyBonus: 4, spellSlots: [4, 3, 3, 3, 2, 0, 0, 0, 0] }],
      [11, { proficiencyBonus: 4, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0] }],
      [12, { proficiencyBonus: 4, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0] }],
      [13, { proficiencyBonus: 5, spellSlots: [4, 3, 3, 3, 2, 1, 0, 0, 0] }],
      [14, { proficiencyBonus: 5, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0] }],
      [15, { proficiencyBonus: 5, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0] }],
      [16, { proficiencyBonus: 5, spellSlots: [4, 3, 3, 3, 2, 1, 1, 0, 0] }],
      [17, { proficiencyBonus: 6, spellSlots: [4, 3, 3, 3, 3, 1, 1, 1, 0] }],
      [18, { proficiencyBonus: 6, spellSlots: [4, 3, 3, 3, 3, 1, 1, 1, 1] }],
      [19, { proficiencyBonus: 6, spellSlots: [4, 3, 3, 3, 3, 2, 1, 1, 1] }],
      [20, { proficiencyBonus: 6, spellSlots: [3, 3, 3, 3, 3, 2, 2, 1, 1] }]
    ])
  }
};

type WeaponInfo = {
  damage: string;
  damageType: string;
  weight: number;
  properties: string;
  cost: string;
};

export const WEAPONS: Map<string, WeaponInfo> = new Map([
  ["短棒", { damage: "1d4", damageType: "钝击", cost: "1 sp", properties: "轻型", weight: 2 }],
  ["匕首", { damage: "1d4", damageType: "穿刺", cost: "2 gp", properties: "灵巧 轻型 投掷(射程20/60)", weight: 1 }],
  ["巨棒", { damage: "1d8", damageType: "钝击", cost: "2 sp", properties: "双手", weight: 10 }],
  ["手斧", { damage: "1d6", damageType: "挥砍", cost: "5 gp", properties: "轻型 投掷(射程20/60)", weight: 2 }],
  ["标枪", { damage: "1d6", damageType: "穿刺", cost: "5 sp", properties: "投掷(射程30/120)", weight: 2 }],
  ["轻锤", { damage: "1d4", damageType: "钝击", cost: "2 gp", properties: "轻型 投掷(射程20/60)", weight: 2 }],
  ["硬头锤", { damage: "1d6", damageType: "钝击", cost: "5 gp", properties: "—", weight: 4 }],
  ["长棍", { damage: "1d6", damageType: "钝击", cost: "2 sp", properties: "两用(1d8)", weight: 4 }],
  ["镰刀", { damage: "1d4", damageType: "挥砍", cost: "1 gp", properties: "轻型", weight: 2 }],
  ["矛", { damage: "1d6", damageType: "穿刺", cost: "1 gp", properties: "投掷(射程20/60) 两用(1d8)", weight: 3 }],
  ["轻弩", { damage: "1d8", damageType: "穿刺", cost: "25 gp", properties: "弹药(射程80/320) 装填 双手", weight: 5 }],
  ["飞镖", { damage: "1d4", damageType: "穿刺", cost: "5 cp", properties: "灵巧 轻型 投掷(射程20/60)", weight: 0.25 }],
  ["短弓", { damage: "1d6", damageType: "穿刺", cost: "5 cp", properties: "弹药(射程80/320) 双手", weight: 2 }],
  ["投石索", { damage: "1d4", damageType: "钝击", cost: "1 sp", properties: "弹药(射程30/120)", weight: 0 }],
  ["战斧", { damage: "1d8", damageType: "挥砍", cost: "10 gp", properties: "两用(1d10)", weight: 4 }],
  ["链枷", { damage: "1d8", damageType: "钝击", cost: "10 gp", properties: "—", weight: 2 }],
  ["长柄刀", { damage: "1d10", damageType: "挥砍", cost: "20 gp", properties: "重型 触及 双手", weight: 6 }],
  ["巨斧", { damage: "1d12", damageType: "挥砍", cost: "30 gp", properties: "重型 双手", weight: 7 }],
  ["巨剑", { damage: "2d6", damageType: "挥砍", cost: "50 gp", properties: "重型", weight: 6 }],
  ["戟", { damage: "1d10", damageType: "挥砍", cost: "20 gp", properties: "重型 触及 双手", weight: 6 }],
  ["骑枪", { damage: "1d12", damageType: "穿刺", cost: "10 gp", properties: "触及 特殊", weight: 6 }],
  ["长剑", { damage: "1d8", damageType: "挥砍", cost: "15 gp", properties: "两用(1d10)", weight: 3 }],
  ["巨锤", { damage: "2d6", damageType: "钝击", cost: "10 gp", properties: "重型 双手", weight: 10 }],
  ["钉头锤", { damage: "1d8", damageType: "穿刺", cost: "15 gp", properties: "—", weight: 4 }],
  ["长矛", { damage: "1d10", damageType: "穿刺", cost: "5 gp", properties: "重型 触及 双手", weight: 18 }],
  ["刺剑", { damage: "1d8", damageType: "穿刺", cost: "25 gp", properties: "灵巧", weight: 2 }],
  ["弯刀", { damage: "1d6", damageType: "挥砍", cost: "25 gp", properties: "灵巧 轻型", weight: 3 }],
  ["短剑", { damage: "1d6", damageType: "穿刺", cost: "10 gp", properties: "灵巧 轻型", weight: 2 }],
  ["三叉戟", { damage: "1d6", damageType: "穿刺", cost: "5 gp", properties: "投掷(射程20/60) 两用(1d8)", weight: 4 }],
  ["战镐", { damage: "1d8", damageType: "穿刺", cost: "5 gp", properties: "—", weight: 2 }],
  ["战锤", { damage: "1d8", damageType: "钝击", cost: "15 gp", properties: "两用(1d10)", weight: 2 }],
  ["鞭", { damage: "1d4", damageType: "挥砍", cost: "2 gp", properties: "灵巧 触及", weight: 3 }],
  ["吹箭筒", { damage: "1", damageType: "穿刺", cost: "10 gp", properties: "弹药(射程25/100) 装填", weight: 1 }],
  ["手弩", { damage: "1d6", damageType: "穿刺", cost: "75 gp", properties: "弹药(射程30/120) 轻型 装填", weight: 3 }],
  ["重弩", { damage: "1d10", damageType: "穿刺", cost: "50 gp", properties: "弹药(射程100/400) 重型 装填 双手", weight: 18 }],
  ["长弓", { damage: "1d8", damageType: "穿刺", cost: "50 gp", properties: "弹药(射程150/600) 重型 双手", weight: 2 }],
  ["捕网", { damage: "0", damageType: "—", cost: "1 gp", properties: "特殊 投掷(射程5/15)", weight: 3 }],
  ["双刃弯刀", { damage: "2d4", damageType: "挥砍", cost: "100 gp", properties: "特殊 双手", weight: 6 }],
  ["手枪", { damage: "1d10", damageType: "穿刺", cost: "250 gp", properties: "弹药(射程30/90) 装填", weight: 3 }],
  ["滑膛枪", { damage: "1d12", damageType: "穿刺", cost: "500 gp", properties: "弹药(射程40/120) 装填 双手", weight: 10 }]
]);