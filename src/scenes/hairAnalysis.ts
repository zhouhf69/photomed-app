/**
 * Hair & Scalp Analysis Scene - 头发/头皮健康分析场景
 * 基于视觉特征分析头发类型、头皮状况，提供护发建议
 */

import type {
  AnalysisResult,
  DetectedFeature,
  ImageAnalysis,
  RiskAssessment,
  Recommendation,
  RedFlag
} from '@/types/core';
import type {
  HairAnalysisResult,
  HairType,
  ScalpCondition,
  HairConcern,
  HairRecommendation
} from '@/types/healthScenes';

/**
 * 分析头发/头皮图像
 */
export async function analyzeHairImage(
  imageData: string,
  metadata?: Record<string, unknown>
): Promise<AnalysisResult> {
  // 模拟AI分析过程
  const analysisResult = performHairAnalysis(imageData, metadata);

  // 转换为标准分析结果格式
  return convertToAnalysisResult(analysisResult);
}

/**
 * 执行头发/头皮分析
 */
function performHairAnalysis(
  _imageData: string,
  metadata?: Record<string, unknown>
): HairAnalysisResult {
  // 基于元数据或随机生成分析结果（实际应由AI模型处理）
  const hairType = determineHairType(metadata);
  const scalpCondition = assessScalpCondition(metadata);
  const concerns = identifyHairConcerns(metadata, scalpCondition);
  const hairDensity = determineHairDensity(metadata);
  const hairThickness = determineHairThickness(metadata);
  const dandruffLevel = assessDandruffLevel(metadata, scalpCondition);
  const oilinessLevel = assessOilinessLevel(metadata, scalpCondition);
  const hairLossSigns = detectHairLossSigns(metadata);

  return {
    hairType,
    scalpCondition,
    hairDensity,
    hairThickness,
    concerns,
    dandruffLevel,
    oilinessLevel,
    hairLossSigns,
    recommendations: generateHairRecommendations(
      hairType,
      scalpCondition,
      concerns,
      oilinessLevel,
      hairLossSigns
    ),
    disclaimer: '本分析仅供参考，不能替代专业医疗诊断。如有严重头皮或头发问题，请咨询皮肤科医生。'
  };
}

/**
 * 确定头发类型
 */
function determineHairType(metadata?: Record<string, unknown>): HairType {
  const types: HairType[] = ['straight', 'wavy', 'curly', 'coily'];
  if (metadata?.hairType && typeof metadata.hairType === 'string') {
    return metadata.hairType as HairType;
  }
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * 评估头皮状况
 */
function assessScalpCondition(metadata?: Record<string, unknown>): ScalpCondition {
  const conditions: ScalpCondition['type'][] = ['healthy', 'dry', 'oily', 'sensitive', 'dandruff', 'inflamed'];
  const type = metadata?.scalpCondition && typeof metadata.scalpCondition === 'string'
    ? metadata.scalpCondition as ScalpCondition['type']
    : conditions[Math.floor(Math.random() * conditions.length)];

  const descriptions: Record<ScalpCondition['type'], string> = {
    healthy: '头皮健康，无明显问题',
    dry: '头皮干燥，可能有紧绷感或轻微脱屑',
    oily: '头皮油脂分泌较多',
    sensitive: '头皮敏感，容易发痒或发红',
    dandruff: '有明显头屑问题',
    inflamed: '头皮有炎症表现'
  };

  const symptoms: Record<ScalpCondition['type'], string[]> = {
    healthy: ['无瘙痒', '无脱屑', '无红肿'],
    dry: ['紧绷感', '细小脱屑', '可能瘙痒'],
    oily: ['头发易油腻', '头皮发亮', '可能需要频繁清洗'],
    sensitive: ['容易发痒', '接触刺激物易红', '需要温和护理'],
    dandruff: ['可见头屑', '可能瘙痒', '脱屑较多'],
    inflamed: ['红肿', '疼痛', '可能有脓包']
  };

  return {
    type,
    description: descriptions[type],
    symptoms: symptoms[type]
  };
}

/**
 * 识别头发问题
 */
function identifyHairConcerns(
  metadata?: Record<string, unknown>,
  scalpCondition?: ScalpCondition
): HairConcern[] {
  const concerns: HairConcern[] = [];

  if (metadata?.concerns && Array.isArray(metadata.concerns)) {
    return metadata.concerns as HairConcern[];
  }

  // 基于头皮状况生成问题
  if (scalpCondition?.type === 'dandruff') {
    concerns.push({
      type: 'dandruff',
      severity: Math.random() > 0.5 ? 'moderate' : 'mild',
      area: '头皮整体',
      description: '可见明显头屑，可能伴有轻微瘙痒'
    });
  }

  if (scalpCondition?.type === 'dry') {
    concerns.push({
      type: 'dryness',
      severity: 'mild',
      area: '头皮及发丝',
      description: '头皮干燥紧绷，发丝可能干枯无光泽'
    });
  }

  if (scalpCondition?.type === 'oily') {
    concerns.push({
      type: 'oiliness',
      severity: 'moderate',
      area: '头皮及发根',
      description: '头皮油脂分泌旺盛，头发易油腻'
    });
  }

  // 随机添加其他问题
  if (Math.random() > 0.7) {
    concerns.push({
      type: 'hair_loss',
      severity: 'mild',
      area: '发际线或头顶',
      description: '有轻微掉发迹象，建议关注'
    });
  }

  return concerns;
}

/**
 * 确定头发密度
 */
function determineHairDensity(metadata?: Record<string, unknown>): 'sparse' | 'normal' | 'dense' {
  if (metadata?.hairDensity && typeof metadata.hairDensity === 'string') {
    return metadata.hairDensity as 'sparse' | 'normal' | 'dense';
  }
  const densities: ('sparse' | 'normal' | 'dense')[] = ['sparse', 'normal', 'dense'];
  return densities[Math.floor(Math.random() * densities.length)];
}

/**
 * 确定头发粗细
 */
function determineHairThickness(metadata?: Record<string, unknown>): 'fine' | 'medium' | 'coarse' {
  if (metadata?.hairThickness && typeof metadata.hairThickness === 'string') {
    return metadata.hairThickness as 'fine' | 'medium' | 'coarse';
  }
  const thicknesses: ('fine' | 'medium' | 'coarse')[] = ['fine', 'medium', 'coarse'];
  return thicknesses[Math.floor(Math.random() * thicknesses.length)];
}

/**
 * 评估头屑程度
 */
function assessDandruffLevel(
  metadata?: Record<string, unknown>,
  scalpCondition?: ScalpCondition
): 'none' | 'mild' | 'moderate' | 'severe' {
  if (metadata?.dandruffLevel && typeof metadata.dandruffLevel === 'string') {
    return metadata.dandruffLevel as 'none' | 'mild' | 'moderate' | 'severe';
  }
  if (scalpCondition?.type === 'dandruff') {
    return Math.random() > 0.5 ? 'moderate' : 'mild';
  }
  return 'none';
}

/**
 * 评估油脂程度
 */
function assessOilinessLevel(
  metadata?: Record<string, unknown>,
  scalpCondition?: ScalpCondition
): 'dry' | 'normal' | 'oily' | 'very_oily' {
  if (metadata?.oilinessLevel && typeof metadata.oilinessLevel === 'string') {
    return metadata.oilinessLevel as 'dry' | 'normal' | 'oily' | 'very_oily';
  }
  if (scalpCondition?.type === 'oily') {
    return Math.random() > 0.5 ? 'oily' : 'very_oily';
  }
  if (scalpCondition?.type === 'dry') {
    return 'dry';
  }
  return 'normal';
}

/**
 * 检测脱发迹象
 */
function detectHairLossSigns(metadata?: Record<string, unknown>): boolean {
  if (typeof metadata?.hairLossSigns === 'boolean') {
    return metadata.hairLossSigns;
  }
  return Math.random() > 0.8;
}

/**
 * 生成护发建议
 */
function generateHairRecommendations(
  hairType: HairType,
  scalpCondition: ScalpCondition,
  _concerns: HairConcern[],
  oilinessLevel: string,
  hairLossSigns: boolean
): HairRecommendation[] {
  const recommendations: HairRecommendation[] = [];

  // 基于头皮状况的洗发建议
  if (scalpCondition.type === 'oily' || oilinessLevel === 'oily' || oilinessLevel === 'very_oily') {
    recommendations.push({
      type: 'shampoo',
      priority: 'high',
      title: '控油清洁',
      content: '建议使用控油型洗发水，含有水杨酸或茶树精油成分，帮助调节头皮油脂分泌。每天或隔天清洗。',
      productType: '控油洗发水'
    });
  } else if (scalpCondition.type === 'dry') {
    recommendations.push({
      type: 'shampoo',
      priority: 'high',
      title: '温和滋润',
      content: '建议使用温和、滋润型洗发水，避免含硫酸盐的强效清洁产品。每2-3天清洗一次。',
      productType: '滋润型洗发水'
    });
  } else if (scalpCondition.type === 'dandruff') {
    recommendations.push({
      type: 'shampoo',
      priority: 'high',
      title: '去屑护理',
      content: '建议使用含吡啶硫酮锌、酮康唑或硫化硒的去屑洗发水，每周使用2-3次。',
      productType: '药用去屑洗发水'
    });
  }

  // 护发素建议
  if (hairType === 'curly' || hairType === 'coily') {
    recommendations.push({
      type: 'conditioner',
      priority: 'medium',
      title: '深层滋润',
      content: '卷发需要更多滋润，建议使用深层滋养护发素或发膜，重点涂抹发梢。',
      productType: '深层滋养护发素'
    });
  }

  // 针对脱发
  if (hairLossSigns) {
    recommendations.push({
      type: 'treatment',
      priority: 'high',
      title: '防脱护理',
      content: '建议使用含米诺地尔或生物素的防脱产品，避免过度拉扯头发，保持头皮健康。',
      productType: '防脱精华'
    });
  }

  // 生活方式建议
  recommendations.push({
    type: 'lifestyle',
    priority: 'medium',
    title: '健康生活习惯',
    content: '保持充足睡眠，减少压力，避免频繁使用高温造型工具，不要过度梳理湿发。'
  });

  // 饮食建议
  recommendations.push({
    type: 'diet',
    priority: 'medium',
    title: '营养补充',
    content: '多摄入富含蛋白质、维生素B族、铁、锌的食物，如鸡蛋、坚果、绿叶蔬菜、鱼类等。'
  });

  return recommendations;
}

/**
 * 转换为标准分析结果
 */
function convertToAnalysisResult(hairResult: HairAnalysisResult): AnalysisResult {
  const features: DetectedFeature[] = [
    {
      type: 'hair_type',
      label: '头发类型',
      confidence: 0.85,
      description: getHairTypeDescription(hairResult.hairType)
    },
    {
      type: 'scalp_condition',
      label: '头皮状况',
      confidence: 0.82,
      description: hairResult.scalpCondition.description
    }
  ];

  if (hairResult.hairLossSigns) {
    features.push({
      type: 'hair_loss',
      label: '脱发迹象',
      confidence: 0.75,
      description: '检测到轻微脱发迹象'
    });
  }

  const imageAnalysis: ImageAnalysis = {
    features,
    measurements: [],
    observations: [
      `头发类型：${getHairTypeDescription(hairResult.hairType)}`,
      `头发密度：${getDensityDescription(hairResult.hairDensity)}`,
      `头发粗细：${getThicknessDescription(hairResult.hairThickness)}`,
      `头皮状况：${hairResult.scalpCondition.description}`,
      `油脂分泌：${getOilinessDescription(hairResult.oilinessLevel)}`,
      hairResult.dandruffLevel !== 'none' ? `头屑程度：${getDandruffDescription(hairResult.dandruffLevel)}` : '头屑：无明显头屑'
    ]
  };

  const redFlags: RedFlag[] = [];
  if (hairResult.hairLossSigns) {
    redFlags.push({
      type: 'hair_loss',
      description: '检测到脱发迹象',
      urgency: 'routine',
      actionRequired: '建议关注脱发情况，如持续加重请咨询皮肤科医生'
    });
  }
  if (hairResult.scalpCondition.type === 'inflamed') {
    redFlags.push({
      type: 'scalp_inflammation',
      description: '头皮有炎症表现',
      urgency: 'urgent',
      actionRequired: '建议尽快就医检查'
    });
  }

  const riskAssessment: RiskAssessment = {
    level: redFlags.length > 0 ? 'medium' : 'low',
    factors: hairResult.concerns.map(c => ({
      type: c.type,
      description: c.description,
      weight: c.severity === 'severe' ? 0.8 : c.severity === 'moderate' ? 0.5 : 0.3
    })),
    flags: redFlags
  };

  const recommendations: Recommendation[] = hairResult.recommendations.map(r => ({
    id: `hair_${r.type}_${Math.random().toString(36).substr(2, 9)}`,
    type: r.type === 'professional_care' ? 'referral' : 'lifestyle',
    priority: r.priority,
    title: r.title,
    content: r.content,
    targetAudience: 'general_public',
    evidenceSource: '护发护理指南',
    disclaimers: [hairResult.disclaimer]
  }));

  return {
    id: `hair_${Date.now()}`,
    sceneId: 'scene_hair_analysis',
    timestamp: Date.now(),
    imageAnalysis,
    riskAssessment,
    recommendations,
    requiresManualReview: redFlags.some(f => f.urgency === 'urgent'),
    confidence: 0.78
  };
}

// 辅助函数
function getHairTypeDescription(type: HairType): string {
  const descriptions: Record<HairType, string> = {
    straight: '直发',
    wavy: '波浪发',
    curly: '卷发',
    coily: '紧密卷发'
  };
  return descriptions[type];
}

function getDensityDescription(density: string): string {
  const descriptions: Record<string, string> = {
    sparse: '稀疏',
    normal: '正常',
    dense: '浓密'
  };
  return descriptions[density] || density;
}

function getThicknessDescription(thickness: string): string {
  const descriptions: Record<string, string> = {
    fine: '细软',
    medium: '中等',
    coarse: '粗硬'
  };
  return descriptions[thickness] || thickness;
}

function getOilinessDescription(level: string): string {
  const descriptions: Record<string, string> = {
    dry: '偏干',
    normal: '正常',
    oily: '偏油',
    very_oily: '油腻'
  };
  return descriptions[level] || level;
}

function getDandruffDescription(level: string): string {
  const descriptions: Record<string, string> = {
    none: '无',
    mild: '轻度',
    moderate: '中度',
    severe: '重度'
  };
  return descriptions[level] || level;
}

/**
 * 获取头发分析场景元数据
 */
export function getHairAnalysisMetadata(): {
  name: string;
  description: string;
  captureGuidance: string[];
  requiredImages: number;
} {
  return {
    name: '头发/头皮健康分析',
    description: '通过拍照分析头发类型、头皮状况，提供个性化护发建议',
    captureGuidance: [
      '请在自然光下拍摄，避免强光直射',
      '拍摄头皮时，请分开头发露出头皮',
      '确保头发和头皮清晰可见',
      '可拍摄多张不同角度的照片'
    ],
    requiredImages: 1
  };
}
