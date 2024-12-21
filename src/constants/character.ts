// dnd5e人物卡模板v1.81β
export const CHARACTER_TEMPLATE = new Map([
  [1, {
    characterId: 1,
    name: 'Mja',
    level: 9,
    attributes: {
        1: 19, // STRENGTH
        2: 18, // DEXTERITY
        3: 14, // CONSTITUTION
        4: 14,  // INTELLIGENCE
        5: 14, // WISDOM
        6: 20,  // CHARISMA
    },
    proficientAttributes: [5, 6], // 熟练的属性ID
    proficientSkills: [1, 4, 7], // 熟练的技能ID
    hitPoints: {
        current: 19,
        maximum: 19,
        hitDice: '2d10 + 2'
    },
    armorClass: 10,
    speed: '60 ft.',
    size: 'Large',
    alignment: '守序中立',
    type: 'Beast',
    reference: 'MM pg. 336',
    challengeRating: '1/4',
    languages: '-',
    tools: '里拉琴',
    spellSlots: {
        current: 0,
        maximum: 3
    },
    inspiration: {
        current: 0,
        maximum: 1
    },
    damage: '-',
    reputation: '-',
    threat: '-',
    blessing: '-',
    amulet: '-',
    legendaryFavor: '-',
    racialTraits: {
        '属性值加成': '智力+2',
    },
    race: '天使',
    subrace: '-',
    gender: '无',
    background: '调查员',
    height: '6尺/182cm',
    weight: '-',
    hairColor: '#FFD700',
    skinColor: '#F5F5DC',
    eyeColor: '#8B728E',
    nailColor: '#FFC0CB',
  }]
]);

