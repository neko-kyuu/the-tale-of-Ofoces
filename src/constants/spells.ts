interface Spell {
  name: string;          // 法术名称
  level: number;         // 环阶 (0为戏法)
  school: string;        // 学派
  ritual: boolean;       // 是否是仪式
  castingTime: string;   // 施法时间
  range: string;         // 施法距离
  verbal: boolean;       // 声音成分
  somatic: boolean;      // 姿势成分
  material: boolean;     // 材料成分
  duration: string;      // 持续时间
  englishName: string;   // 英文名
  upcastable?: number;   // 可选：最高可用环阶，undefined 表示无限制
  description?: string; // 描述
}

export const SPELLS = new Map<string, Spell>([
  ['至圣斩', {
    name: '至圣斩',
    level: 1,
    school: '',
    ritual: false,
    castingTime: '1动作',
    range: '自身',
    verbal: false,
    somatic: false,
    material: false,
    duration: '',
    englishName: 'Divine Smite',
    upcastable: undefined,
    }],
  ['寻获坐骑', {
    name: '寻获坐骑',
    level: 2,
    school: '咒法',
    ritual: false,
    castingTime: '10分钟',
    range: '30尺',
    verbal: true,
    somatic: true,
    material: false,
    duration: '立即',
    englishName: 'Find Steed',
    upcastable: 2
    }],
  ['猎人印记', {
    name: '猎人印记',
    level: 1,
    school: '预言',
    ritual: false,
    castingTime: '1附赠动作',
    range: '90尺',
    verbal: true,
    somatic: false,
    material: false,
    duration: '专注,至多1小时',
    englishName: 'Hunter\'s Mark',
    upcastable: undefined,
  }],
  // ... 其他法术
]);


