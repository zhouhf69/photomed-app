/**
 * Assessment Scales - 标准化评估量表
 * 各场景的专业评估标准和评分体系
 */

// ============================================
// 布里斯托大便分类量表 (Bristol Stool Scale)
// ============================================

export interface BristolStoolScale {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  description: string;
  meaning: string;
  transitTime: string;
  healthImplication: string;
}

export const BRISTOL_STOOL_SCALE: BristolStoolScale[] = [
  {
    type: 1,
    description: '分离的硬块，像坚果',
    meaning: '严重便秘',
    transitTime: '100小时以上',
    healthImplication: '肠道蠕动缓慢，建议增加纤维摄入和水分'
  },
  {
    type: 2,
    description: '香肠状但表面有裂纹',
    meaning: '轻度便秘',
    transitTime: '72-100小时',
    healthImplication: '排便不畅，建议调整饮食结构'
  },
  {
    type: 3,
    description: '像香肠，表面有裂纹',
    meaning: '正常',
    transitTime: '48-72小时',
    healthImplication: '排便正常，继续保持'
  },
  {
    type: 4,
    description: '像香肠或蛇，表面光滑柔软',
    meaning: '正常（理想状态）',
    transitTime: '24-48小时',
    healthImplication: '肠道健康，消化吸收良好'
  },
  {
    type: 5,
    description: '边缘清晰的软块',
    meaning: '缺乏纤维',
    transitTime: '24小时左右',
    healthImplication: '可能纤维摄入不足，建议多吃蔬果'
  },
  {
    type: 6,
    description: '边缘粗糙的蓬松小块',
    meaning: '轻度腹泻',
    transitTime: '12-24小时',
    healthImplication: '肠道蠕动过快，注意观察'
  },
  {
    type: 7,
    description: '水样，无固体',
    meaning: '腹泻',
    transitTime: '12小时以内',
    healthImplication: '肠道功能紊乱，如持续需就医'
  }
];

// ============================================
// 大便颜色健康标准
// ============================================

export interface StoolColorStandard {
  color: string;
  normal: boolean;
  possibleCauses: string[];
  recommendation: string;
  urgency: 'none' | 'monitor' | 'consult' | 'urgent';
}

export const STOOL_COLOR_STANDARDS: StoolColorStandard[] = [
  {
    color: '棕色',
    normal: true,
    possibleCauses: ['正常胆汁代谢'],
    recommendation: '继续保持健康生活方式',
    urgency: 'none'
  },
  {
    color: '绿色',
    normal: false,
    possibleCauses: ['食物色素', '消化过快', '蔬菜摄入多'],
    recommendation: '观察2-3天，如持续需关注',
    urgency: 'monitor'
  },
  {
    color: '黄色',
    normal: false,
    possibleCauses: ['脂肪吸收不良', '寄生虫感染'],
    recommendation: '建议就医检查',
    urgency: 'consult'
  },
  {
    color: '黑色',
    normal: false,
    possibleCauses: ['上消化道出血', '铁剂补充', '某些食物'],
    recommendation: '如非药物/食物引起，尽快就医',
    urgency: 'urgent'
  },
  {
    color: '红色',
    normal: false,
    possibleCauses: ['下消化道出血', '痔疮', '肛裂'],
    recommendation: '建议就医检查出血原因',
    urgency: 'urgent'
  },
  {
    color: '陶土色',
    normal: false,
    possibleCauses: ['胆道梗阻', '胆汁分泌减少'],
    recommendation: '尽快就医检查肝胆功能',
    urgency: 'urgent'
  }
];

// ============================================
// PUSH 压疮愈合量表
// ============================================

export interface PUSHScale {
  surfaceArea: {
    score: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    area: string;
  };
  exudateAmount: {
    score: 0 | 1 | 2 | 3;
    description: string;
  };
  tissueType: {
    score: 0 | 1 | 2 | 3 | 4;
    description: string;
  };
}

export const PUSH_SCALE_CRITERIA = {
  surfaceArea: [
    { score: 0, area: '0 cm²', description: '已愈合' },
    { score: 1, area: '< 0.3 cm²', description: '极小' },
    { score: 2, area: '0.3-0.6 cm²', description: '很小' },
    { score: 3, area: '0.7-1.0 cm²', description: '小' },
    { score: 4, area: '1.1-2.0 cm²', description: '较小' },
    { score: 5, area: '2.1-3.0 cm²', description: '中等' },
    { score: 6, area: '3.1-4.0 cm²', description: '较大' },
    { score: 7, area: '4.1-8.0 cm²', description: '大' },
    { score: 8, area: '8.1-12.0 cm²', description: '很大' },
    { score: 9, area: '12.1-24.0 cm²', description: '极大' },
    { score: 10, area: '> 24.0 cm²', description: '超大' }
  ],
  exudateAmount: [
    { score: 0, description: '无渗出液' },
    { score: 1, description: '少量渗出液' },
    { score: 2, description: '中等量渗出液' },
    { score: 3, description: '大量渗出液' }
  ],
  tissueType: [
    { score: 0, description: '闭合/完全上皮化' },
    { score: 1, description: '上皮组织/肉芽组织' },
    { score: 2, description: '腐肉/疏松组织' },
    { score: 3, description: '坏死组织/焦痂' },
    { score: 4, description: '无法评估的组织类型' }
  ]
};

export function calculatePUSHScore(
  surfaceAreaScore: number,
  exudateScore: number,
  tissueScore: number
): { total: number; interpretation: string } {
  const total = surfaceAreaScore + exudateScore + tissueScore;
  
  let interpretation = '';
  if (total === 0) {
    interpretation = '已愈合';
  } else if (total <= 4) {
    interpretation = '愈合良好，继续当前治疗方案';
  } else if (total <= 8) {
    interpretation = '愈合进展一般，需评估治疗方案';
  } else if (total <= 12) {
    interpretation = '愈合进展缓慢，建议调整治疗方案';
  } else {
    interpretation = '愈合差，需要积极干预';
  }
  
  return { total, interpretation };
}

// ============================================
// 皮肤类型评估标准
// ============================================

export interface SkinTypeCriteria {
  type: 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';
  characteristics: string[];
  poreSize: string;
  shineLevel: string;
  hydrationNeeds: string;
  careFocus: string[];
}

export const SKIN_TYPE_CRITERIA: SkinTypeCriteria[] = [
  {
    type: 'dry',
    characteristics: ['皮肤紧绷', '容易脱皮', '细纹明显', '毛孔细小'],
    poreSize: '细小',
    shineLevel: '无油光',
    hydrationNeeds: '高',
    careFocus: ['深层保湿', '温和清洁', '避免过度去角质']
  },
  {
    type: 'oily',
    characteristics: ['T区油光', '毛孔粗大', '易长痘痘', '妆容易脱'],
    poreSize: '粗大',
    shineLevel: '明显油光',
    hydrationNeeds: '中等',
    careFocus: ['控油清洁', '水油平衡', '定期去角质']
  },
  {
    type: 'combination',
    characteristics: ['T区油脸颊干', '毛孔T区明显', '季节性变化', '局部问题'],
    poreSize: 'T区粗大',
    shineLevel: 'T区有油光',
    hydrationNeeds: '分区护理',
    careFocus: ['分区护理', 'T区控油', '脸颊保湿']
  },
  {
    type: 'normal',
    characteristics: ['水油平衡', '毛孔细致', '肤色均匀', '问题少'],
    poreSize: '细致',
    shineLevel: '适中',
    hydrationNeeds: '基础保湿',
    careFocus: ['基础护理', '防晒', '维持现状']
  },
  {
    type: 'sensitive',
    characteristics: ['容易泛红', '易过敏', '刺痛感', '屏障薄弱'],
    poreSize: '细小',
    shineLevel: '不定',
    hydrationNeeds: '温和保湿',
    careFocus: ['温和产品', '修复屏障', '避免刺激']
  }
];

// ============================================
// 指甲健康评估标准
// ============================================

export interface NailHealthStandard {
  indicator: string;
  normalAppearance: string;
  abnormalSigns: string[];
  possibleCauses: string[];
  recommendation: string;
}

export const NAIL_HEALTH_STANDARDS: NailHealthStandard[] = [
  {
    indicator: '颜色',
    normalAppearance: '粉红色，透明感',
    abnormalSigns: ['苍白', '发黄', '发紫', '白点'],
    possibleCauses: ['贫血', '真菌感染', '循环问题', '外伤'],
    recommendation: '根据具体颜色变化进行相应检查'
  },
  {
    indicator: '质地',
    normalAppearance: '光滑平整',
    abnormalSigns: ['竖纹', '横纹', '凹陷', '增厚'],
    possibleCauses: ['年龄', '营养不良', '银屑病', '真菌感染'],
    recommendation: '补充营养，必要时就医'
  },
  {
    indicator: '形状',
    normalAppearance: '弧度自然，边缘平滑',
    abnormalSigns: ['勺状', '杵状', '波浪状'],
    possibleCauses: ['缺铁', '心肺疾病', '外伤'],
    recommendation: '建议就医检查潜在疾病'
  }
];

// ============================================
// 中医体质辨识标准
// ============================================

export interface TCMConstitution {
  type: string;
  tongueFeatures: {
    color: string;
    coating: string;
    shape: string;
  };
  commonSymptoms: string[];
  dietaryAdvice: {
    suitable: string[];
    avoid: string[];
  };
  lifestyleAdvice: string[];
}

export const TCM_CONSTITUTIONS: TCMConstitution[] = [
  {
    type: '平和质',
    tongueFeatures: { color: '淡红', coating: '薄白', shape: '正常' },
    commonSymptoms: ['精力充沛', '睡眠良好', '食欲正常'],
    dietaryAdvice: {
      suitable: ['五谷杂粮', '新鲜蔬果', '适量蛋白质'],
      avoid: ['暴饮暴食', '偏食']
    },
    lifestyleAdvice: ['规律作息', '适度运动', '保持心情舒畅']
  },
  {
    type: '气虚质',
    tongueFeatures: { color: '淡白', coating: '薄白', shape: '有齿痕' },
    commonSymptoms: ['容易疲劳', '气短懒言', '自汗', '易感冒'],
    dietaryAdvice: {
      suitable: ['山药', '红枣', '黄芪', '鸡肉', '小米'],
      avoid: ['生冷食物', '油腻厚味']
    },
    lifestyleAdvice: ['避免过劳', '适度运动', '保证睡眠']
  },
  {
    type: '阳虚质',
    tongueFeatures: { color: '淡白', coating: '白滑', shape: '胖大' },
    commonSymptoms: ['畏寒怕冷', '手脚冰凉', '喜热饮'],
    dietaryAdvice: {
      suitable: ['生姜', '羊肉', '桂圆', '核桃'],
      avoid: ['寒凉食物', '冷饮']
    },
    lifestyleAdvice: ['注意保暖', '多晒太阳', '避免寒冷环境']
  },
  {
    type: '阴虚质',
    tongueFeatures: { color: '红', coating: '少苔', shape: '瘦小' },
    commonSymptoms: ['口干咽燥', '手足心热', '夜间盗汗'],
    dietaryAdvice: {
      suitable: ['银耳', '百合', '梨', '鸭肉'],
      avoid: ['辛辣燥热', '煎炸食物']
    },
    lifestyleAdvice: ['避免熬夜', '减少思虑', '保持心情平静']
  },
  {
    type: '痰湿质',
    tongueFeatures: { color: '淡白', coating: '白腻', shape: '胖大' },
    commonSymptoms: ['身体困重', '胸闷痰多', '口黏腻'],
    dietaryAdvice: {
      suitable: ['薏米', '红豆', '冬瓜', '白萝卜'],
      avoid: ['甜腻食物', '油腻厚味', '奶制品']
    },
    lifestyleAdvice: ['加强运动', '避免久坐', '保持环境干燥']
  },
  {
    type: '湿热质',
    tongueFeatures: { color: '红', coating: '黄腻', shape: '正常' },
    commonSymptoms: ['口苦口臭', '皮肤油腻', '小便黄赤'],
    dietaryAdvice: {
      suitable: ['绿豆', '苦瓜', '芹菜', '冬瓜'],
      avoid: ['辛辣刺激', '烧烤油炸', '酒精']
    },
    lifestyleAdvice: ['保持皮肤清洁', '多喝水', '避免潮湿环境']
  }
];

// ============================================
// 口腔健康评估标准
// ============================================

export interface OralHealthStandard {
  indicator: string;
  healthy: string;
  warning: string[];
  unhealthy: string[];
  careRecommendation: string;
}

export const ORAL_HEALTH_STANDARDS: OralHealthStandard[] = [
  {
    indicator: '牙齿颜色',
    healthy: '乳白色或微黄',
    warning: ['轻度黄染'],
    unhealthy: ['明显黄染', '棕色斑点', '黑色龋洞'],
    careRecommendation: '定期洁牙，减少染色食物'
  },
  {
    indicator: '牙龈颜色',
    healthy: '粉红色',
    warning: ['轻度红肿'],
    unhealthy: ['明显红肿', '出血', '退缩'],
    careRecommendation: '正确刷牙，使用牙线，定期口腔检查'
  },
  {
    indicator: '舌苔',
    healthy: '薄白',
    warning: ['轻度增厚'],
    unhealthy: ['厚腻', '黄腻', '剥落'],
    careRecommendation: '清洁舌苔，调整饮食'
  }
];

// ============================================
// 置信度评估标准
// ============================================

export interface ConfidenceLevel {
  range: [number, number];
  label: string;
  description: string;
  recommendation: string;
}

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = [
  {
    range: [0.9, 1.0],
    label: '极高',
    description: '分析结果非常可靠',
    recommendation: '可放心参考'
  },
  {
    range: [0.8, 0.9],
    label: '高',
    description: '分析结果较为可靠',
    recommendation: '建议作为重要参考'
  },
  {
    range: [0.7, 0.8],
    label: '中等',
    description: '分析结果有一定参考价值',
    recommendation: '建议结合其他信息综合判断'
  },
  {
    range: [0.6, 0.7],
    label: '一般',
    description: '分析结果参考价值有限',
    recommendation: '建议重新拍摄或咨询专业人士'
  },
  {
    range: [0, 0.6],
    label: '低',
    description: '分析结果可靠性不足',
    recommendation: '不建议作为参考依据'
  }
];

export function getConfidenceLevel(score: number): ConfidenceLevel {
  return CONFIDENCE_LEVELS.find(
    level => score >= level.range[0] && score < level.range[1]
  ) || CONFIDENCE_LEVELS[CONFIDENCE_LEVELS.length - 1];
}
