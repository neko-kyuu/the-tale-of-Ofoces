// dnd5e人物卡模板v1.81β
export const CHARACTER_TEMPLATE = new Map([
  [1, {
    characterId: 1,
    name: 'Mja',
    level: 9,
    class:[
      { class: '圣武士', subClass: '圣武士', level: 9 },
      { class: '吟游诗人', subClass: '吟游诗人', level: 7 },
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
    armorBonus: 5,
    shieldBonus: 0,
    otherACBonus: 5,
    speed: '35尺',
    specialSpeed: '飞行 60尺',
    size: '中型',
    alignment: '守序中立',
    type: '类人生物',
    reference: 'MM pg.14',
    referenceUrl:'https://books.cinas.cn:8000/read/7794/pdf',
    race: '天使',
    subrace: '-',
    gender: '无',
    age:'-',
    background: '调查员',
    height: '6尺/182cm',
    weight: '-',
    hairColor: '#FFD4AE',
    skinColor: '#BDA3D8',
    eyeColor: '#E7D3D0',
    nailColor: null,
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
    }       
  }]
]);

