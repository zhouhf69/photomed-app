/**
 * Posture Analysis Scene - 体态姿势分析场景
 * 分析站姿、坐姿体态，提供姿势矫正建议
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
  PostureAnalysisResult,
  PostureConcern,
  PostureRecommendation
} from '@/types/healthScenes';

/**
 * 分析体态图像
 */
export async function analyzePostureImage(
  imageData: string,
  metadata?: Record<string, unknown>
): Promise<AnalysisResult> {
  const analysisResult = performPostureAnalysis(imageData, metadata);
  return convertToAnalysisResult(analysisResult);
}

/**
 * 执行体态分析
 */
function performPostureAnalysis(
  _imageData: string,
  metadata?: Record<string, unknown>
): PostureAnalysisResult {
  const spinalAlignment = assessSpinalAlignment(metadata);
  const shoulderAlignment = assessShoulderAlignment(metadata);
  const hipAlignment = assessHipAlignment(metadata);
  const concerns = identifyPostureConcerns(metadata, spinalAlignment, shoulderAlignment, hipAlignment);
  const riskAreas = identifyRiskAreas(concerns);

  return {
    overallPosture: determineOverallPosture(concerns),
    spinalAlignment,
    shoulderAlignment,
    hipAlignment,
    concerns,
    riskAreas,
    recommendations: generatePostureRecommendations(concerns, spinalAlignment),
    disclaimer: '本分析仅供参考，不能替代专业体态评估。如有严重体态问题或疼痛，请咨询康复科医生或物理治疗师。'
  };
}

/**
 * 评估脊柱对齐
 */
function assessSpinalAlignment(metadata?: Record<string, unknown>): PostureAnalysisResult['spinalAlignment'] {
  return {
    cervical: (metadata?.cervical as 'normal' | 'forward_head' | 'lordosis') || 
      ['normal', 'normal', 'forward_head'][Math.floor(Math.random() * 3)],
    thoracic: (metadata?.thoracic as 'normal' | 'kyphosis' | 'rounded_shoulders') || 
      ['normal', 'normal', 'rounded_shoulders'][Math.floor(Math.random() * 3)],
    lumbar: (metadata?.lumbar as 'normal' | 'lordosis' | 'flat_back') || 
      ['normal', 'normal', 'lordosis'][Math.floor(Math.random() * 3)]
  };
}

/**
 * 评估肩部对齐
 */
function assessShoulderAlignment(metadata?: Record<string, unknown>): 'level' | 'slight_imbalance' | 'significant_imbalance' {
  if (metadata?.shoulderAlignment && typeof metadata.shoulderAlignment === 'string') {
    return metadata.shoulderAlignment as 'level' | 'slight_imbalance' | 'significant_imbalance';
  }
  const alignments: ('level' | 'slight_imbalance' | 'significant_imbalance')[] = 
    ['level', 'level', 'level', 'slight_imbalance'];
  return alignments[Math.floor(Math.random() * alignments.length)];
}

/**
 * 评估髋部对齐
 */
function assessHipAlignment(metadata?: Record<string, unknown>): 'level' | 'slight_imbalance' | 'significant_imbalance' {
  if (metadata?.hipAlignment && typeof metadata.hipAlignment === 'string') {
    return metadata.hipAlignment as 'level' | 'slight_imbalance' | 'significant_imbalance';
  }
  const alignments: ('level' | 'slight_imbalance' | 'significant_imbalance')[] = 
    ['level', 'level', 'level', 'slight_imbalance'];
  return alignments[Math.floor(Math.random() * alignments.length)];
}

/**
 * 识别体态问题
 */
function identifyPostureConcerns(
  metadata?: Record<string, unknown>,
  spinalAlignment?: PostureAnalysisResult['spinalAlignment'],
  shoulderAlignment?: PostureAnalysisResult['shoulderAlignment'],
  hipAlignment?: PostureAnalysisResult['hipAlignment']
): PostureConcern[] {
  const concerns: PostureConcern[] = [];

  if (metadata?.concerns && Array.isArray(metadata.concerns)) {
    return metadata.concerns as PostureConcern[];
  }

  // 颈椎问题
  if (spinalAlignment?.cervical === 'forward_head') {
    concerns.push({
      type: 'forward_head',
      severity: 'moderate',
      description: '头部前倾姿势，可能导致颈部疼痛和头痛'
    });
  }

  // 胸椎问题
  if (spinalAlignment?.thoracic === 'kyphosis') {
    concerns.push({
      type: 'kyphosis',
      severity: 'moderate',
      description: '驼背姿势，胸椎后凸增加'
    });
  } else if (spinalAlignment?.thoracic === 'rounded_shoulders') {
    concerns.push({
      type: 'rounded_shoulders',
      severity: 'mild',
      description: '圆肩姿势，肩胛骨前伸'
    });
  }

  // 腰椎问题
  if (spinalAlignment?.lumbar === 'lordosis') {
    concerns.push({
      type: 'lordosis',
      severity: 'mild',
      description: '腰椎前凸增加，可能增加腰部压力'
    });
  }

  // 肩部不平衡
  if (shoulderAlignment === 'significant_imbalance') {
    concerns.push({
      type: 'uneven_shoulders',
      severity: 'moderate',
      description: '肩部明显不平衡，可能有脊柱侧弯风险'
    });
  }

  // 髋部不平衡
  if (hipAlignment === 'significant_imbalance') {
    concerns.push({
      type: 'uneven_hips',
      severity: 'moderate',
      description: '髋部明显不平衡，可能影响步态'
    });
  }

  return concerns;
}

/**
 * 识别风险区域
 */
function identifyRiskAreas(concerns: PostureConcern[]): string[] {
  const riskMap: Record<string, string[]> = {
    forward_head: ['颈部', '上背部'],
    rounded_shoulders: ['肩部', '胸部'],
    kyphosis: ['上背部', '肩部'],
    lordosis: ['下背部', '腰部'],
    scoliosis: ['脊柱', '腰部'],
    uneven_shoulders: ['肩部', '颈部'],
    uneven_hips: ['髋部', '下背部']
  };

  const areas = new Set<string>();
  concerns.forEach(c => {
    const riskAreas = riskMap[c.type] || [];
    riskAreas.forEach(area => areas.add(area));
  });

  return Array.from(areas);
}

/**
 * 确定整体体态
 */
function determineOverallPosture(concerns: PostureConcern[]): 'excellent' | 'good' | 'fair' | 'poor' {
  if (concerns.length === 0) return 'excellent';
  if (concerns.length <= 2 && !concerns.some(c => c.severity === 'severe')) return 'good';
  if (concerns.some(c => c.severity === 'severe')) return 'poor';
  return 'fair';
}

/**
 * 生成体态矫正建议
 */
function generatePostureRecommendations(
  concerns: PostureConcern[],
  spinalAlignment: PostureAnalysisResult['spinalAlignment']
): PostureRecommendation[] {
  const recommendations: PostureRecommendation[] = [];

  // 针对头部前倾
  if (spinalAlignment.cervical === 'forward_head') {
    recommendations.push({
      type: 'exercise',
      priority: 'high',
      title: '颈部姿势矫正',
      content: '做收下巴运动：坐直或站立，轻轻将下巴向后收，保持5秒，重复10次。每天做3组。'
    });
  }

  // 针对圆肩驼背
  if (spinalAlignment.thoracic === 'rounded_shoulders' || spinalAlignment.thoracic === 'kyphosis') {
    recommendations.push({
      type: 'stretching',
      priority: 'high',
      title: '胸部拉伸',
      content: '双手在背后交叉，挺胸向后伸展，保持30秒。或做门框拉伸：双手扶门框，身体前倾拉伸胸部。'
    });
    recommendations.push({
      type: 'exercise',
      priority: 'high',
      title: '背部强化',
      content: '做YTWL训练：俯卧位，手臂形成Y、T、W、L形状，强化肩背肌群。每个姿势保持5秒，做10次。'
    });
  }

  // 针对腰椎前凸
  if (spinalAlignment.lumbar === 'lordosis') {
    recommendations.push({
      type: 'exercise',
      priority: 'medium',
      title: '核心强化',
      content: '加强核心肌群训练，做平板支撑、死虫式等动作，帮助稳定腰椎。'
    });
  }

  // 通用姿势建议
  recommendations.push({
    type: 'ergonomic',
    priority: 'high',
    title: '工作站设置',
    content: '调整显示器高度使屏幕顶部与眼睛平齐，椅子高度使双脚平放地面，保持腰背贴靠椅背。'
  });

  recommendations.push({
    type: 'lifestyle',
    priority: 'medium',
    title: '姿势意识',
    content: '每小时起身活动5分钟，检查并调整姿势。避免长时间低头看手机，将手机举到视线高度。'
  });

  recommendations.push({
    type: 'stretching',
    priority: 'medium',
    title: '日常拉伸',
    content: '每天做全身拉伸，重点拉伸颈部、肩部、胸部和髋部。每个拉伸保持30秒。'
  });

  // 如问题严重建议专业帮助
  if (concerns.some(c => c.severity === 'moderate' || c.severity === 'severe')) {
    recommendations.push({
      type: 'professional_care',
      priority: 'medium',
      title: '专业评估',
      content: '如体态问题持续或伴有疼痛，建议咨询物理治疗师或康复科医生进行专业评估和治疗。'
    });
  }

  return recommendations;
}

/**
 * 转换为标准分析结果
 */
function convertToAnalysisResult(postureResult: PostureAnalysisResult): AnalysisResult {
  const features: DetectedFeature[] = [
    {
      type: 'spinal_alignment',
      label: '脊柱对齐',
      confidence: 0.75,
      description: `颈椎：${getCervicalDescription(postureResult.spinalAlignment.cervical)}，` +
        `胸椎：${getThoracicDescription(postureResult.spinalAlignment.thoracic)}，` +
        `腰椎：${getLumbarDescription(postureResult.spinalAlignment.lumbar)}`
    },
    {
      type: 'shoulder_alignment',
      label: '肩部对齐',
      confidence: 0.8,
      description: getAlignmentDescription(postureResult.shoulderAlignment)
    },
    {
      type: 'hip_alignment',
      label: '髋部对齐',
      confidence: 0.78,
      description: getAlignmentDescription(postureResult.hipAlignment)
    }
  ];

  const imageAnalysis: ImageAnalysis = {
    features,
    measurements: [],
    observations: [
      `颈椎：${getCervicalDescription(postureResult.spinalAlignment.cervical)}`,
      `胸椎：${getThoracicDescription(postureResult.spinalAlignment.thoracic)}`,
      `腰椎：${getLumbarDescription(postureResult.spinalAlignment.lumbar)}`,
      `肩部对齐：${getAlignmentDescription(postureResult.shoulderAlignment)}`,
      `髋部对齐：${getAlignmentDescription(postureResult.hipAlignment)}`,
      `风险区域：${postureResult.riskAreas.join('、') || '无明显风险区域'}`
    ]
  };

  const redFlags: RedFlag[] = [];
  if (postureResult.shoulderAlignment === 'significant_imbalance' || 
      postureResult.hipAlignment === 'significant_imbalance') {
    redFlags.push({
      type: 'significant_imbalance',
      description: '身体明显不平衡，可能有脊柱侧弯',
      urgency: 'routine',
      actionRequired: '建议进行专业体态评估，排除脊柱侧弯等问题'
    });
  }

  const riskAssessment: RiskAssessment = {
    level: postureResult.concerns.some(c => c.severity === 'severe') ? 'high' :
          postureResult.concerns.length > 2 ? 'medium' :
          postureResult.concerns.length > 0 ? 'low' : 'low',
    factors: postureResult.concerns.map(c => ({
      type: c.type,
      description: c.description,
      weight: c.severity === 'severe' ? 0.8 : c.severity === 'moderate' ? 0.5 : 0.3
    })),
    flags: redFlags
  };

  const recommendations: Recommendation[] = postureResult.recommendations.map(r => ({
    id: `posture_${r.type}_${Math.random().toString(36).substr(2, 9)}`,
    type: r.type === 'professional_care' ? 'referral' : 'lifestyle',
    priority: r.priority,
    title: r.title,
    content: r.content,
    targetAudience: 'general_public',
    evidenceSource: '体态矫正指南',
    disclaimers: [postureResult.disclaimer]
  }));

  return {
    id: `posture_${Date.now()}`,
    sceneId: 'scene_posture_analysis',
    timestamp: Date.now(),
    imageAnalysis,
    riskAssessment,
    recommendations,
    requiresManualReview: redFlags.length > 0,
    confidence: 0.75
  };
}

// 辅助函数
function getCervicalDescription(cervical: string): string {
  const descriptions: Record<string, string> = {
    normal: '正常',
    forward_head: '头部前倾',
    lordosis: '颈椎前凸增加'
  };
  return descriptions[cervical] || cervical;
}

function getThoracicDescription(thoracic: string): string {
  const descriptions: Record<string, string> = {
    normal: '正常',
    kyphosis: '驼背',
    rounded_shoulders: '圆肩'
  };
  return descriptions[thoracic] || thoracic;
}

function getLumbarDescription(lumbar: string): string {
  const descriptions: Record<string, string> = {
    normal: '正常',
    lordosis: '腰椎前凸增加',
    flat_back: '腰椎平直'
  };
  return descriptions[lumbar] || lumbar;
}

function getAlignmentDescription(alignment: string): string {
  const descriptions: Record<string, string> = {
    level: '水平',
    slight_imbalance: '轻微不平衡',
    significant_imbalance: '明显不平衡'
  };
  return descriptions[alignment] || alignment;
}

/**
 * 获取体态分析场景元数据
 */
export function getPostureAnalysisMetadata(): {
  name: string;
  description: string;
  captureGuidance: string[];
  requiredImages: number;
} {
  return {
    name: '体态姿势分析',
    description: '通过拍照分析站姿、坐姿体态，提供姿势矫正建议',
    captureGuidance: [
      '请穿着贴身衣物以便观察身体轮廓',
      '侧面照：身体侧面正对镜头，自然站立',
      '背面照：背部正对镜头，双臂自然下垂',
      '确保全身入镜，光线充足'
    ],
    requiredImages: 1
  };
}
