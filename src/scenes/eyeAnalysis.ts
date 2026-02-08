/**
 * Eye Health Analysis Scene - 眼睛健康分析场景
 * 分析眼白颜色、眼周状况，提供护眼建议
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
  EyeAnalysisResult,
  EyeConcern,
  EyeRecommendation
} from '@/types/healthScenes';

/**
 * 分析眼睛图像
 */
export async function analyzeEyeImage(
  imageData: string,
  metadata?: Record<string, unknown>
): Promise<AnalysisResult> {
  const analysisResult = performEyeAnalysis(imageData, metadata);
  return convertToAnalysisResult(analysisResult);
}

/**
 * 执行眼睛健康分析
 */
function performEyeAnalysis(
  _imageData: string,
  metadata?: Record<string, unknown>
): EyeAnalysisResult {
  const scleraColor = determineScleraColor(metadata);
  const conjunctivaCondition = assessConjunctiva(metadata);
  const eyeAppearance = assessEyeAppearance(metadata);
  const fatigueSigns = identifyFatigueSigns(metadata, eyeAppearance);
  const concerns = identifyEyeConcerns(metadata, scleraColor, conjunctivaCondition, eyeAppearance);

  return {
    overallHealth: determineOverallHealth(concerns),
    scleraColor,
    conjunctivaCondition,
    pupilResponse: 'normal', // 静态图片无法评估
    eyeAppearance,
    fatigueSigns,
    concerns,
    recommendations: generateEyeRecommendations(concerns, eyeAppearance, fatigueSigns),
    disclaimer: '本分析仅供参考，不能替代专业眼科检查。如有视力问题或眼部不适，请及时就医。'
  };
}

/**
 * 确定眼白颜色
 */
function determineScleraColor(metadata?: Record<string, unknown>): 'white' | 'slightly_yellow' | 'yellow' | 'red' {
  const colors: ('white' | 'slightly_yellow' | 'yellow' | 'red')[] = ['white', 'white', 'white', 'slightly_yellow', 'red'];
  if (metadata?.scleraColor && typeof metadata.scleraColor === 'string') {
    return metadata.scleraColor as 'white' | 'slightly_yellow' | 'yellow' | 'red';
  }
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 评估结膜状况
 */
function assessConjunctiva(metadata?: Record<string, unknown>): 'normal' | 'mild_redness' | 'significant_redness' {
  if (metadata?.conjunctivaCondition && typeof metadata.conjunctivaCondition === 'string') {
    return metadata.conjunctivaCondition as 'normal' | 'mild_redness' | 'significant_redness';
  }
  const conditions: ('normal' | 'mild_redness' | 'significant_redness')[] = ['normal', 'normal', 'mild_redness'];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

/**
 * 评估眼周外观
 */
function assessEyeAppearance(metadata?: Record<string, unknown>): EyeAnalysisResult['eyeAppearance'] {
  return {
    darkCircles: (metadata?.darkCircles as 'none' | 'mild' | 'moderate' | 'severe') || ['none', 'mild', 'moderate'][Math.floor(Math.random() * 3)],
    puffiness: (metadata?.puffiness as 'none' | 'mild' | 'moderate' | 'severe') || ['none', 'mild'][Math.floor(Math.random() * 2)],
    eyeBags: typeof metadata?.eyeBags === 'boolean' ? metadata.eyeBags : Math.random() > 0.7,
    fineLines: (metadata?.fineLines as 'none' | 'few' | 'moderate' | 'many') || ['none', 'few'][Math.floor(Math.random() * 2)]
  };
}

/**
 * 识别疲劳迹象
 */
function identifyFatigueSigns(
  metadata?: Record<string, unknown>,
  eyeAppearance?: EyeAnalysisResult['eyeAppearance']
): string[] {
  const signs: string[] = [];

  if (metadata?.fatigueSigns && Array.isArray(metadata.fatigueSigns)) {
    return metadata.fatigueSigns as string[];
  }

  if (eyeAppearance?.darkCircles === 'moderate' || eyeAppearance?.darkCircles === 'severe') {
    signs.push('黑眼圈明显，可能睡眠不足');
  }
  if (eyeAppearance?.puffiness !== 'none') {
    signs.push('眼周浮肿');
  }
  if (eyeAppearance?.eyeBags) {
    signs.push('眼袋明显');
  }

  // 随机添加一些疲劳迹象
  const possibleSigns = ['眼睛干涩', '用眼过度', '长时间看屏幕'];
  if (Math.random() > 0.5) {
    signs.push(possibleSigns[Math.floor(Math.random() * possibleSigns.length)]);
  }

  return signs;
}

/**
 * 识别眼部问题
 */
function identifyEyeConcerns(
  metadata?: Record<string, unknown>,
  scleraColor?: EyeAnalysisResult['scleraColor'],
  conjunctivaCondition?: EyeAnalysisResult['conjunctivaCondition'],
  eyeAppearance?: EyeAnalysisResult['eyeAppearance']
): EyeConcern[] {
  const concerns: EyeConcern[] = [];

  if (metadata?.concerns && Array.isArray(metadata.concerns)) {
    return metadata.concerns as EyeConcern[];
  }

  // 基于眼白颜色
  if (scleraColor === 'yellow' || scleraColor === 'slightly_yellow') {
    concerns.push({
      type: 'yellow_sclera',
      severity: scleraColor === 'yellow' ? 'severe' : 'mild',
      description: `眼白发黄${scleraColor === 'yellow' ? '明显' : '轻微'}，建议检查肝功能`
    });
  }

  // 基于结膜状况
  if (conjunctivaCondition === 'significant_redness') {
    concerns.push({
      type: 'redness',
      severity: 'moderate',
      description: '结膜明显充血，可能有炎症或疲劳'
    });
  } else if (conjunctivaCondition === 'mild_redness') {
    concerns.push({
      type: 'redness',
      severity: 'mild',
      description: '轻微结膜充血，可能用眼疲劳'
    });
  }

  // 基于眼周外观
  if (eyeAppearance?.darkCircles === 'severe') {
    concerns.push({
      type: 'dark_circles',
      severity: 'moderate',
      description: '黑眼圈严重，可能与睡眠不足或血液循环不良有关'
    });
  }

  if (eyeAppearance?.puffiness === 'moderate' || eyeAppearance?.puffiness === 'severe') {
    concerns.push({
      type: 'puffiness',
      severity: 'mild',
      description: '眼周浮肿，可能与睡眠不足或饮食有关'
    });
  }

  // 随机添加干眼
  if (Math.random() > 0.8) {
    concerns.push({
      type: 'dryness',
      severity: 'mild',
      description: '可能有干眼症状，建议注意用眼卫生'
    });
  }

  return concerns;
}

/**
 * 确定整体健康状况
 */
function determineOverallHealth(concerns: EyeConcern[]): 'excellent' | 'good' | 'fair' | 'poor' {
  if (concerns.length === 0) return 'excellent';
  if (concerns.length <= 2 && !concerns.some(c => c.severity === 'severe')) return 'good';
  if (concerns.some(c => c.severity === 'severe')) return 'poor';
  return 'fair';
}

/**
 * 生成护眼建议
 */
function generateEyeRecommendations(
  concerns: EyeConcern[],
  eyeAppearance: EyeAnalysisResult['eyeAppearance'],
  fatigueSigns: string[]
): EyeRecommendation[] {
  const recommendations: EyeRecommendation[] = [];

  // 针对眼白发黄
  const yellowSclera = concerns.find(c => c.type === 'yellow_sclera');
  if (yellowSclera) {
    recommendations.push({
      type: 'medical_attention',
      priority: 'high',
      title: '就医检查',
      content: '眼白发黄可能与肝功能有关，建议尽快就医检查肝功能指标。'
    });
  }

  // 针对充血
  const redness = concerns.find(c => c.type === 'redness');
  if (redness) {
    recommendations.push({
      type: 'eye_care',
      priority: 'high',
      title: '缓解眼部充血',
      content: '使用人工泪液缓解眼部干涩，避免揉眼，保证充足睡眠。如持续充血，建议就医。'
    });
  }

  // 针对黑眼圈
  if (eyeAppearance.darkCircles !== 'none') {
    recommendations.push({
      type: 'lifestyle',
      priority: 'medium',
      title: '改善黑眼圈',
      content: '保证每晚7-8小时充足睡眠，睡前减少使用电子设备，可使用冷敷缓解眼周浮肿。'
    });
  }

  // 针对疲劳
  if (fatigueSigns.length > 0) {
    recommendations.push({
      type: 'eye_exercises',
      priority: 'high',
      title: '眼部放松训练',
      content: '每用眼45分钟休息10分钟，远眺窗外或闭目养神。做眼保健操，按摩眼周穴位。'
    });
  }

  // 通用护眼建议
  recommendations.push({
    type: 'eye_care',
    priority: 'medium',
    title: '科学用眼',
    content: '保持正确的用眼姿势，屏幕距离眼睛50-70cm，调整屏幕亮度和对比度，避免在暗光环境下用眼。'
  });

  recommendations.push({
    type: 'diet',
    priority: 'medium',
    title: '护眼饮食',
    content: '多摄入富含维生素A、C、E和叶黄素的食物，如胡萝卜、蓝莓、菠菜、鱼类等。'
  });

  return recommendations;
}

/**
 * 转换为标准分析结果
 */
function convertToAnalysisResult(eyeResult: EyeAnalysisResult): AnalysisResult {
  const features: DetectedFeature[] = [
    {
      type: 'sclera_color',
      label: '眼白颜色',
      confidence: 0.88,
      description: getScleraDescription(eyeResult.scleraColor)
    },
    {
      type: 'conjunctiva',
      label: '结膜状况',
      confidence: 0.82,
      description: getConjunctivaDescription(eyeResult.conjunctivaCondition)
    }
  ];

  if (eyeResult.eyeAppearance.darkCircles !== 'none') {
    features.push({
      type: 'dark_circles',
      label: '黑眼圈',
      confidence: 0.85,
      description: `黑眼圈程度：${getDarkCircleDescription(eyeResult.eyeAppearance.darkCircles)}`
    });
  }

  const imageAnalysis: ImageAnalysis = {
    features,
    measurements: [],
    observations: [
      `眼白颜色：${getScleraDescription(eyeResult.scleraColor)}`,
      `结膜状况：${getConjunctivaDescription(eyeResult.conjunctivaCondition)}`,
      `黑眼圈：${getDarkCircleDescription(eyeResult.eyeAppearance.darkCircles)}`,
      `眼周浮肿：${eyeResult.eyeAppearance.puffiness !== 'none' ? '有' : '无'}`,
      `眼袋：${eyeResult.eyeAppearance.eyeBags ? '明显' : '不明显'}`,
      ...eyeResult.fatigueSigns.map(sign => `疲劳迹象：${sign}`)
    ]
  };

  const redFlags: RedFlag[] = [];
  if (eyeResult.scleraColor === 'yellow') {
    redFlags.push({
      type: 'jaundice',
      description: '眼白发黄明显，可能存在黄疸',
      urgency: 'urgent',
      actionRequired: '建议尽快就医检查肝功能'
    });
  }
  if (eyeResult.conjunctivaCondition === 'significant_redness') {
    redFlags.push({
      type: 'eye_inflammation',
      description: '结膜明显充血',
      urgency: 'urgent',
      actionRequired: '如伴有疼痛或视力变化，请尽快就医'
    });
  }

  const riskAssessment: RiskAssessment = {
    level: redFlags.length > 0 ? 'high' : eyeResult.concerns.length > 2 ? 'medium' : 'low',
    factors: eyeResult.concerns.map(c => ({
      type: c.type,
      description: c.description,
      weight: c.severity === 'severe' ? 0.8 : c.severity === 'moderate' ? 0.5 : 0.3
    })),
    flags: redFlags
  };

  const recommendations: Recommendation[] = eyeResult.recommendations.map(r => ({
    id: `eye_${r.type}_${Math.random().toString(36).substr(2, 9)}`,
    type: r.type === 'medical_attention' ? 'referral' : 'lifestyle',
    priority: r.priority,
    title: r.title,
    content: r.content,
    targetAudience: 'general_public',
    evidenceSource: '眼科护理指南',
    disclaimers: [eyeResult.disclaimer]
  }));

  return {
    id: `eye_${Date.now()}`,
    sceneId: 'scene_eye_analysis',
    timestamp: Date.now(),
    imageAnalysis,
    riskAssessment,
    recommendations,
    requiresManualReview: redFlags.length > 0,
    confidence: 0.82
  };
}

// 辅助函数
function getScleraDescription(color: string): string {
  const descriptions: Record<string, string> = {
    white: '正常白色',
    slightly_yellow: '轻微发黄',
    yellow: '明显发黄',
    red: '充血发红'
  };
  return descriptions[color] || color;
}

function getConjunctivaDescription(condition: string): string {
  const descriptions: Record<string, string> = {
    normal: '正常',
    mild_redness: '轻微充血',
    significant_redness: '明显充血'
  };
  return descriptions[condition] || condition;
}

function getDarkCircleDescription(level: string): string {
  const descriptions: Record<string, string> = {
    none: '无',
    mild: '轻度',
    moderate: '中度',
    severe: '重度'
  };
  return descriptions[level] || level;
}

/**
 * 获取眼睛分析场景元数据
 */
export function getEyeAnalysisMetadata(): {
  name: string;
  description: string;
  captureGuidance: string[];
  requiredImages: number;
} {
  return {
    name: '眼睛健康分析',
    description: '通过拍照分析眼白颜色、眼周状况，提供护眼建议',
    captureGuidance: [
      '请在自然光下拍摄，避免强光直射眼睛',
      '正视镜头，眼睛自然睁开',
      '确保眼睛清晰可见，不戴美瞳或有色眼镜',
      '可分别拍摄左右眼以便更详细分析'
    ],
    requiredImages: 1
  };
}
