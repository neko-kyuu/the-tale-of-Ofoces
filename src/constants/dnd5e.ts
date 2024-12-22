import { Character } from "@/types/dnd5e";

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
    statusDetails: { TOOLS: ['一种工匠工具', '载具（陆运）'] }, 
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
    statusDetails: { TOOLS: ['领航工具', '载具（水运）'] }, 
    proficientSkills: [1, 10] 
  },
  海盗: { 
    statusDetails: { TOOLS: ['领航工具', '载具（水运）'] }, 
    proficientSkills: [1, 10] 
  },
  士兵: { 
    statusDetails: { TOOLS: ['一种赌具', '载具（陆运）'] }, 
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
    statusDetails: { TOOLS: ['一种赌具', '载具（陆运）'] }, 
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
    statusDetails: { TOOLS: ['载具（陆运）'] }, 
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
    statusDetails: { TOOLS: ['领航者工具', '载具（太空）'] },
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
}

export const CLASS_ATTRIBUTES: Record<string, ClassAttributes> = {
  法师: {
    proficiencyAbilities: [4, 5],
    statusDetails: {
      WEAPON_PROFICIENCY: ['匕首', '飞镖', '投石索', '长棍', '轻弩'],
      ARMOR_PROFICIENCY: ['无']
    }
  },
  术士: {
    proficiencyAbilities: [3, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['匕首', '飞镖', '投石索', '长棍', '轻弩'],
      ARMOR_PROFICIENCY: ['无']
    }
  },
  吟游诗人: {
    proficiencyAbilities: [2, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '手弩', '长剑', '刺剑', '短剑'],
      ARMOR_PROFICIENCY: ['轻甲']
    }
  },
  牧师: {
    proficiencyAbilities: [5, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌']
    }
  },
  德鲁伊: {
    proficiencyAbilities: [4, 5],
    statusDetails: {
      WEAPON_PROFICIENCY: ['短棒', '匕首', '飞镖', 'ḷ枪', '硬头锤', '长棍', '弯刀', '镰刀', '投石索', '矛'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌（德鲁伊不能装备或使用金属质的护甲和盾）']
    }
  },
  武僧: {
    proficiencyAbilities: [1, 2],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '短剑'],
      ARMOR_PROFICIENCY: ['无']
    }
  },
  游荡者: {
    proficiencyAbilities: [2, 4],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '手弩', '长剑', '刺剑', '短剑'],
      ARMOR_PROFICIENCY: ['轻甲']
    }
  },
  邪术师: {
    proficiencyAbilities: [5, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器'],
      ARMOR_PROFICIENCY: ['轻甲']
    }
  },
  奇械师: {
    proficiencyAbilities: [3, 4],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌']
    }
  },
  战士: {
    proficiencyAbilities: [1, 3],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '军用武器'],
      ARMOR_PROFICIENCY: ['所有护甲', '盾牌']
    }
  },
  圣武士: {
    proficiencyAbilities: [5, 6],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '军用武器'],
      ARMOR_PROFICIENCY: ['所有护甲', '盾牌']
    }
  },
  游侠: {
    proficiencyAbilities: [1, 2],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '军用武器'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌']
    }
  },
  野蛮人: {
    proficiencyAbilities: [1, 3],
    statusDetails: {
      WEAPON_PROFICIENCY: ['简易武器', '军用武器'],
      ARMOR_PROFICIENCY: ['轻甲', '中甲', '盾牌']
    }
  }
};