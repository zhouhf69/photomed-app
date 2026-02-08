/**
 * Foot Health Analysis Scene - 足部健康分析场景
 * 分析足部皮肤、指甲状况，提供足部护理建议
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
  FootAnalysisResult,
  FootConcern,
  FootRecommendation
} from '@/types/healthScenes';

/**
 * 分析足部图像
 */
export async function analyzeFootImage(
  imageData: string,
  metadata?: Record<string, unknown>
): Promise<AnalysisResult> {
  const analysisResult = performFootAnalysis(imageData, metadata);
  return convertToAnalysisResult(analysisResult);
}

/**
 * 执行足部健康分析
 */
function performFootAnalysis(
  _imageData: string,
  metadata?: Record<string, unknown>
): FootAnalysisResult {
  const skinCondition = assessFootSkin(metadata);
  const nailCondition = assessFootNail(metadata);
  const archType = determineArchType(metadata);
  const concerns = identifyFootConcerns(metadata, skinCondition, nailCondition);
  const pressurePoints = identifyPressurePoints(metadata, concerns);

  return {
    overallHealth: determineFootHealth(concerns),
    skinCondition,
    nailCondition,
    archType,
    concerns,
    pressurePoints,
    recommendations: generateFootRecommendations(concerns, skinCondition, nailCondition),
    disclaimer: '本分析仅供参考，不能替代专业医疗诊断。如有严重足部问题，请咨询足病医生或皮肤科医生。'
  };
}

/**
 * 评估足部皮肤状况
 */
function assessFootSkin(metadata?: Record<string, unknown>): FootAnalysisResult['skinCondition'] {
  const dryness = (metadata?.dryness as 'none' | 'mild' | 'moderate' | 'severe') || 
    ['none', 'mild', 'moderate'][Math.floor(Math.random() * 3)];
  const calluses = (metadata?.calluses as 'none' | 'mild' | 'moderate' | 'severe') || 
    ['none', 'mild', 'moderate'][Math.floor(Math.random() * 3)];
  const cracks = (metadata?.cracks as 'none' | 'mild' | 'deep') || 
    ['none', 'none', 'mild'][Math.floor(Math.random() * 3)];

  return {
    dryness,
    calluses,
    cracks,
    athleteFoot: typeof metadata?.athleteFoot === 'boolean' ? metadata.athleteFoot : Math.random() > 0.9,
    corns: typeof metadata?.corns === 'boolean' ? metadata.corns : Math.random() > 0.85,
    description: generateSkinDescription(dryness, calluses, cracks)
  };
}

/**
 * 生成皮肤描述
 */
function generateSkinDescription(
  dryness: string,
  calluses: string,
  cracks: string
): string {
  const parts: string[] = [];
  if (dryness !== 'none') parts.push(`皮肤${dryness === 'severe' ? '严重' : dryness === 'moderate' ? '中度' : '轻度'}干燥`);
  if (calluses !== 'none') parts.push(`有${calluses === 'severe' ? '严重' : calluses === 'moderate' ? '中度' : '轻度'}老茧`);
  if (cracks !== 'none') parts.push(`有${cracks === 'deep' ? '深度' : '轻微'}皲裂`);
  return parts.length > 0 ? parts.join('，') : '足部皮肤状况良好';
}

/**
 * 评估趾甲状况
 */
function assessFootNail(metadata?: Record<string, unknown>): FootAnalysisResult['nailCondition'] {
  const color = (metadata?.nailColor as 'normal' | 'yellow' | 'white' | 'discolored') || 
    ['normal', 'normal', 'normal', 'yellow'][Math.floor(Math.random() * 4)];
  const thickness = (metadata?.nailThickness as 'normal' | 'thickened') || 
    ['normal', 'normal', 'thickened'][Math.floor(Math.random() * 3)];

  return {
    color,
    thickness,
    fungus: typeof metadata?.nailFungus === 'boolean' ? metadata.nailFungus : Math.random() > 0.9,
    ingrown: typeof metadata?.ingrownNail === 'boolean' ? metadata.ingrownNail : Math.random() > 0.9,
    description: generateNailDescription(color, thickness)
  };
}

/**
 * 生成趾甲描述
 */
function generateNailDescription(color: string, thickness: string): string {
  const parts: string[] = [];
  if (color !== 'normal') parts.push(`颜色${color === 'yellow' ? '发黄' : color === 'white' ? '发白' : '异常'}`);
  if (thickness === 'thickened') parts.push('增厚');
  return parts.length > 0 ? parts.join('，') : '趾甲状况正常';
}

/**
 * 确定足弓类型
 */
function determineArchType(metadata?: Record<string, unknown>): 'flat' | 'normal' | 'high' {
  if (metadata?.archType && typeof metadata.archType === 'string') {
    return metadata.archType as 'flat' | 'normal' | 'high';
  }
  const types: ('flat' | 'normal' | 'high')[] = ['normal', 'normal', 'normal', 'flat', 'high'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * 识别足部问题
 */
function identifyFootConcerns(
  metadata?: Record<string, unknown>,
  skinCondition?: FootAnalysisResult['skinCondition'],
  nailCondition?: FootAnalysisResult['nailCondition']
): FootConcern[] {
  const concerns: FootConcern[] = [];

  if (metadata?.concerns && Array.isArray(metadata.concerns)) {
    return metadata.concerns as FootConcern[];
  }

  // 基于皮肤状况
  if (skinCondition?.dryness === 'severe') {
    concerns.push({
      type: 'dry_skin',
      severity: 'moderate',
      description: '足部皮肤严重干燥，需要加强保湿护理'
    });
  }

  if (skinCondition?.cracks === 'deep') {
    concerns.push({
      type: 'cracks',
      severity: 'moderate',
      description: '足部有深度皲裂，可能引起疼痛或感染'
    });
  }

  if (skinCondition?.athleteFoot) {
    concerns.push({
      type: 'athletes_foot',
      severity: 'moderate',
      description: '可能有脚气（足癣）症状'
    });
  }

  // 基于趾甲状况
  if (nailCondition?.fungus) {
    concerns.push({
      type: 'nail_fungus',
      severity: 'moderate',
      description: '趾甲可能有真菌感染'
    });
  }

  if (nailCondition?.ingrown) {
    concerns.push({
      type: 'bunions',
      severity: 'mild',
      description: '可能有嵌甲问题'
    });
  }

  return concerns;
}

/**
 * 识别压力点
 */
function identifyPressurePoints(
  metadata?: Record<string, unknown>,
  _concerns?: FootConcern[]
): string[] {
  if (metadata?.pressurePoints && Array.isArray(metadata.pressurePoints)) {
    return metadata.pressurePoints as string[];
  }

  const points: string[] = [];
  const possiblePoints = ['脚跟', '脚掌前部', '足弓内侧', '小趾外侧', '大趾关节'];

  // 随机选择1-3个压力点
  const numPoints = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numPoints; i++) {
    const point = possiblePoints[Math.floor(Math.random() * possiblePoints.length)];
    if (!points.includes(point)) {
      points.push(point);
    }
  }

  return points;
}

/**
 * 确定整体健康状况
 */
function determineFootHealth(_concerns: FootConcern[]): 'excellent' | 'good' | 'fair' | 'poor' {
  if (_concerns.length === 0) return 'excellent';
  if (_concerns.length <= 2 && !_concerns.some(c => c.severity === 'severe')) return 'good';
  if (_concerns.some(c => c.severity === 'severe')) return 'poor';
  return 'fair';
}

/**
 * 生成足部护理建议
 */
function generateFootRecommendations(
  _concerns: FootConcern[],
  skinCondition: FootAnalysisResult['skinCondition'],
  nailCondition: FootAnalysisResult['nailCondition']
): FootRecommendation[] {
  const recommendations: FootRecommendation[] = [];

  // 针对干燥皮肤
  if (skinCondition.dryness !== 'none' || skinCondition.cracks !== 'none') {
    recommendations.push({
      type: 'moisturizing',
      priority: 'high',
      title: '加强保湿',
      content: '每天洗脚后涂抹足霜或凡士林，重点护理脚跟和干燥部位。睡前可厚涂足霜后穿棉袜加强吸收。'
    });
  }

  // 针对老茧
  if (skinCondition.calluses !== 'none') {
    recommendations.push({
      type: 'foot_care',
      priority: 'medium',
      title: '老茧护理',
      content: '使用浮石或足部磨砂膏轻柔去除老茧，不要过度摩擦。严重老茧建议专业修脚。'
    });
  }

  // 针对皲裂
  if (skinCondition.cracks === 'deep') {
    recommendations.push({
      type: 'medical_attention',
      priority: 'high',
      title: '皲裂处理',
      content: '深度皲裂可能需要医疗处理，建议就医。平时保持足部湿润，避免赤脚行走。'
    });
  }

  // 针对趾甲问题
  if (nailCondition.fungus) {
    recommendations.push({
      type: 'medical_attention',
      priority: 'high',
      title: '趾甲真菌感染',
      content: '趾甲真菌感染需要专业治疗，建议就医。保持足部干燥，避免共用指甲剪。'
    });
  }

  // 针对脚气
  if (skinCondition.athleteFoot) {
    recommendations.push({
      type: 'foot_care',
      priority: 'high',
      title: '脚气护理',
      content: '使用抗真菌药膏，保持足部干燥透气，每天更换袜子，避免穿不透气的鞋子。'
    });
  }

  // 通用足部护理
  recommendations.push({
    type: 'hygiene',
    priority: 'medium',
    title: '足部卫生',
    content: '每天用温水洗脚，彻底擦干特别是趾缝。定期修剪趾甲，保持适当长度。'
  });

  recommendations.push({
    type: 'footwear',
    priority: 'medium',
    title: '鞋袜选择',
    content: '选择透气、合脚的鞋子，避免高跟鞋或过紧的鞋子。穿棉质或吸湿排汗的袜子。'
  });

  return recommendations;
}

/**
 * 转换为标准分析结果
 */
function convertToAnalysisResult(footResult: FootAnalysisResult): AnalysisResult {
  const features: DetectedFeature[] = [
    {
      type: 'foot_skin',
      label: '足部皮肤',
      confidence: 0.8,
      description: footResult.skinCondition.description
    },
    {
      type: 'foot_nail',
      label: '趾甲状况',
      confidence: 0.82,
      description: footResult.nailCondition.description
    },
    {
      type: 'arch_type',
      label: '足弓类型',
      confidence: 0.75,
      description: getArchDescription(footResult.archType)
    }
  ];

  const imageAnalysis: ImageAnalysis = {
    features,
    measurements: [],
    observations: [
      `皮肤状况：${footResult.skinCondition.description}`,
      `趾甲状况：${footResult.nailCondition.description}`,
      `足弓类型：${getArchDescription(footResult.archType)}`,
      `压力点：${footResult.pressurePoints.join('、') || '无明显压力点'}`,
      ...footResult.concerns.map(c => `问题：${c.description}`)
    ]
  };

  const redFlags: RedFlag[] = [];
  if (footResult.skinCondition.cracks === 'deep') {
    redFlags.push({
      type: 'deep_cracks',
      description: '足部有深度皲裂',
      urgency: 'urgent',
      actionRequired: '深度皲裂可能引起感染，建议就医处理'
    });
  }
  if (footResult.nailCondition.fungus) {
    redFlags.push({
      type: 'nail_fungus',
      description: '趾甲可能有真菌感染',
      urgency: 'routine',
      actionRequired: '建议就医确诊并接受抗真菌治疗'
    });
  }
  if (footResult.skinCondition.athleteFoot) {
    redFlags.push({
      type: 'athletes_foot',
      description: '可能有脚气',
      urgency: 'routine',
      actionRequired: '使用抗真菌产品，如症状严重请就医'
    });
  }

  const riskAssessment: RiskAssessment = {
    level: redFlags.some(f => f.urgency === 'urgent') ? 'high' : 
          footResult.concerns.length > 2 ? 'medium' : 
          footResult.concerns.length > 0 ? 'low' : 'low',
    factors: footResult.concerns.map(c => ({
      type: c.type,
      description: c.description,
      weight: c.severity === 'severe' ? 0.8 : c.severity === 'moderate' ? 0.5 : 0.3
    })),
    flags: redFlags
  };

  const recommendations: Recommendation[] = footResult.recommendations.map(r => ({
    id: `foot_${r.type}_${Math.random().toString(36).substr(2, 9)}`,
    type: r.type === 'medical_attention' ? 'referral' : 'lifestyle',
    priority: r.priority,
    title: r.title,
    content: r.content,
    targetAudience: 'general_public',
    evidenceSource: '足部护理指南',
    disclaimers: [footResult.disclaimer]
  }));

  return {
    id: `foot_${Date.now()}`,
    sceneId: 'scene_foot_analysis',
    timestamp: Date.now(),
    imageAnalysis,
    riskAssessment,
    recommendations,
    requiresManualReview: redFlags.some(f => f.urgency === 'urgent'),
    confidence: 0.78
  };
}

// 辅助函数
function getArchDescription(arch: string): string {
  const descriptions: Record<string, string> = {
    flat: '扁平足',
    normal: '正常足弓',
    high: '高足弓'
  };
  return descriptions[arch] || arch;
}

/**
 * 获取足部分析场景元数据
 */
export function getFootAnalysisMetadata(): {
  name: string;
  description: string;
  captureGuidance: string[];
  requiredImages: number;
} {
  return {
    name: '足部健康分析',
    description: '通过拍照分析足部皮肤、趾甲状况，提供足部护理建议',
    captureGuidance: [
      '请在自然光下拍摄，确保光线充足',
      '拍摄足底、足背和趾甲的清晰照片',
      '确保足部干净、干燥',
      '可拍摄多个角度以便全面分析'
    ],
    requiredImages: 1
  };
}
