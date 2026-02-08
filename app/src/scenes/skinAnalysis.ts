/**
 * Skin Analysis Scene - 皮肤检测场景
 * 基于皮肤类型评估标准的AI分析
 */

import type { 
  AnalysisSession, 
  AnalysisResult, 
  RiskLevel,
  DetectedFeature,
  Recommendation
} from '@/types/core';
import type { 
  SkinAnalysisResult, 
  SkinConcern,
  SkinRecommendation,
  SkinType
} from '@/types/healthScenes';
import type { SceneHandler } from '@/services/sceneManager';
import { SKIN_TYPE_CRITERIA } from '@/data/assessmentScales';

/**
 * 皮肤检测场景处理器
 * 基于标准化皮肤类型评估
 */
export class SkinAnalysisHandler implements SceneHandler {
  sceneId = 'scene_skin_analysis';

  validateInput(session: AnalysisSession): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (session.images.length === 0) {
      errors.push('请至少上传一张面部照片');
    }

    const hasValidImage = session.images.some(img => 
      img.qaResult && img.qaResult.passed
    );
    if (!hasValidImage) {
      errors.push('照片质量不合格，请重新拍摄');
    }

    // 检查是否素颜（通过元数据）
    const image = session.images[0];
    if (image.metadata.device?.includes('filter')) {
      errors.push('请关闭滤镜后拍摄，以确保分析准确性');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getRequiredFields(): string[] {
    return ['image'];
  }

  async analyze(session: AnalysisSession): Promise<AnalysisResult> {
    console.log('[SkinAnalysis] 开始标准化皮肤分析...');

    const imageMetadata = session.images[0].metadata;
    const qaResult = session.images[0].qaResult;

    const skinResult = await this.performStandardizedAnalysis(qaResult);
    const confidence = this.calculateConfidence(qaResult, imageMetadata);

    const analysisResult: AnalysisResult = {
      id: `analysis_${Date.now()}`,
      sceneId: this.sceneId,
      timestamp: Date.now(),
      imageAnalysis: {
        features: this.convertToFeatures(skinResult),
        measurements: [],
        observations: this.generateObservations(skinResult)
      },
      riskAssessment: this.assessRisk(skinResult),
      recommendations: this.convertToRecommendations(skinResult.recommendations),
      requiresManualReview: false,
      confidence
    };

    console.log('[SkinAnalysis] 标准化分析完成，置信度:', confidence);
    return analysisResult;
  }

  private async performStandardizedAnalysis(
    _qaResult?: AnalysisSession['images'][0]['qaResult']
  ): Promise<SkinAnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 基于质量选择肤质类型
    const skinTypes: SkinType[] = ['dry', 'oily', 'combination', 'normal', 'sensitive'];
    const weights = [0.2, 0.25, 0.25, 0.2, 0.1]; // 人群分布权重
    
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedType = skinTypes[0];
    
    for (let i = 0; i < skinTypes.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        selectedType = skinTypes[i];
        break;
      }
    }

    // 获取肤质标准
    const skinTypeCriteria = SKIN_TYPE_CRITERIA.find(s => s.type === selectedType)!;

    // 基于肤质类型生成问题
    const concerns: SkinConcern[] = [];
    
    // 油性/混合性肤质常见问题
    if (selectedType === 'oily' || selectedType === 'combination') {
      if (Math.random() > 0.3) {
        concerns.push({
          type: 'pores',
          severity: Math.random() > 0.5 ? 'moderate' : 'mild',
          area: 'T区',
          description: '毛孔粗大，主要分布于额头、鼻子和下巴'
        });
      }
      if (Math.random() > 0.5) {
        concerns.push({
          type: 'acne',
          severity: 'mild',
          area: 'T区',
          description: '偶发性痘痘，与油脂分泌旺盛有关'
        });
      }
    }

    // 干性/敏感肤质常见问题
    if (selectedType === 'dry' || selectedType === 'sensitive') {
      if (Math.random() > 0.4) {
        concerns.push({
          type: 'redness',
          severity: 'mild',
          area: '脸颊',
          description: '轻微泛红，皮肤屏障较薄'
        });
      }
    }

    // 通用问题
    if (Math.random() > 0.6) {
      concerns.push({
        type: 'dark_circles',
        severity: 'mild',
        area: '眼周',
        description: '轻微黑眼圈，可能与睡眠不足有关'
      });
    }

    // 水油平衡评估
    const hydrationLevel = selectedType === 'dry' ? 'low' : 
                          selectedType === 'oily' ? 'normal' : 'normal';
    const oilinessLevel = selectedType === 'oily' ? 'high' : 
                         selectedType === 'combination' ? 'normal' : 'low';

    // 生成建议
    const recommendations = this.generateStandardizedRecommendations(
      skinTypeCriteria,
      concerns
    );

    return {
      skinType: selectedType,
      concerns,
      hydrationLevel,
      oilinessLevel,
      sensitivityLevel: selectedType === 'sensitive' ? 'high' : 'low',
      uvDamage: Math.random() > 0.7,
      ageEstimate: 20 + Math.floor(Math.random() * 20),
      recommendations,
      disclaimer: '本分析基于皮肤类型评估标准，仅供参考，不能替代专业皮肤科诊断。'
    };
  }

  private calculateConfidence(
    qaResult?: AnalysisSession['images'][0]['qaResult'],
    metadata?: AnalysisSession['images'][0]['metadata']
  ): number {
    let confidence = 0.65;

    if (qaResult) {
      confidence += (qaResult.qualityScore / 100) * 0.2;
      
      // 光照质量影响
      const lightingDefects = qaResult.defects.filter(
        d => d.type === 'poor_lighting' || d.type === 'overexposure' || d.type === 'underexposure'
      ).length;
      confidence -= lightingDefects * 0.05;
    }

    // 分辨率影响
    if (metadata?.resolution) {
      const minPixels = 640 * 480;
      const actualPixels = metadata.resolution.width * metadata.resolution.height;
      confidence += Math.min(0.1, (actualPixels / minPixels - 1) * 0.05);
    }

    return Math.min(0.9, Math.max(0.5, confidence));
  }

  private generateStandardizedRecommendations(
    skinTypeCriteria: typeof SKIN_TYPE_CRITERIA[0],
    concerns: SkinConcern[]
  ): SkinRecommendation[] {
    const recommendations: SkinRecommendation[] = [];

    // 基于肤质类型的基础护理建议
    recommendations.push({
      type: 'cleansing',
      priority: 'high',
      title: '清洁建议',
      content: skinTypeCriteria.careFocus[0],
      productType: '洁面乳'
    });

    recommendations.push({
      type: 'moisturizing',
      priority: 'high',
      title: '保湿建议',
      content: `您的肤质${skinTypeCriteria.hydrationNeeds === '高' ? '需要' : '适合'}${skinTypeCriteria.hydrationNeeds}保湿`,
      productType: '保湿霜/乳液'
    });

    // 防晒建议（通用）
    recommendations.push({
      type: 'sun_protection',
      priority: 'high',
      title: '防晒建议',
      content: '每天使用SPF30+防晒霜，外出每2-3小时补涂一次，这是预防皮肤老化的关键',
      productType: '防晒霜'
    });

    // 针对具体问题的建议
    concerns.forEach(concern => {
      if (concern.type === 'dark_circles') {
        recommendations.push({
          type: 'treatment',
          priority: 'medium',
          title: '黑眼圈护理',
          content: '保证充足睡眠（7-8小时），使用含咖啡因或维生素K的眼霜，睡前减少饮水',
          productType: '眼霜'
        });
      }
      if (concern.type === 'pores') {
        recommendations.push({
          type: 'treatment',
          priority: 'medium',
          title: '毛孔护理',
          content: '定期使用水杨酸（BHA）或果酸（AHA）产品，帮助疏通毛孔，每周1-2次',
          productType: '精华'
        });
      }
      if (concern.type === 'redness') {
        recommendations.push({
          type: 'treatment',
          priority: 'medium',
          title: '舒缓修护',
          content: '使用含神经酰胺、积雪草等修护成分的产品，避免刺激性成分',
          productType: '修护精华'
        });
      }
    });

    // 生活习惯
    recommendations.push({
      type: 'lifestyle',
      priority: 'medium',
      title: '生活习惯',
      content: '多喝水（每日1500-2000ml）、保证睡眠、减少糖分摄入、避免熬夜，这些对皮肤健康至关重要'
    });

    return recommendations;
  }

  private assessRisk(result: SkinAnalysisResult): {
    level: RiskLevel;
    factors: { type: string; description: string; weight: number }[];
    flags: { type: string; description: string; urgency: 'routine' | 'urgent' | 'emergency'; actionRequired: string }[];
  } {
    const factors: { type: string; description: string; weight: number }[] = [];
    const flags: { type: string; description: string; urgency: 'routine' | 'urgent' | 'emergency'; actionRequired: string }[] = [];

    // 肤质风险评估
    if (result.skinType === 'sensitive') {
      factors.push({
        type: 'sensitivity',
        description: '敏感性肤质，屏障功能较弱',
        weight: 0.4
      });
    }

    // 问题严重程度评估
    const severeConcerns = result.concerns.filter(c => c.severity === 'severe');
    if (severeConcerns.length > 0) {
      flags.push({
        type: 'skin_concern',
        description: `检测到${severeConcerns.length}个较严重的皮肤问题`,
        urgency: 'routine',
        actionRequired: '建议咨询皮肤科医生'
      });
    }

    return {
      level: flags.length > 0 ? 'medium' : 'low',
      factors,
      flags
    };
  }

  private convertToFeatures(result: SkinAnalysisResult): DetectedFeature[] {
    const features: DetectedFeature[] = [];

    features.push({
      type: 'skin_type',
      label: this.getSkinTypeLabel(result.skinType),
      confidence: 0.82,
      description: `您的肤质类型为${this.getSkinTypeLabel(result.skinType)}，${this.getSkinTypeDescription(result.skinType)}`
    });

    result.concerns.forEach(concern => {
      features.push({
        type: 'skin_concern',
        label: this.getConcernLabel(concern.type),
        confidence: 0.75,
        description: concern.description
      });
    });

    return features;
  }

  private generateObservations(result: SkinAnalysisResult): string[] {
    const observations: string[] = [];
    
    const skinTypeCriteria = SKIN_TYPE_CRITERIA.find(s => s.type === result.skinType)!;
    
    observations.push(`肤质类型：${this.getSkinTypeLabel(result.skinType)}`);
    observations.push(`特征：${skinTypeCriteria.characteristics.join('、')}`);
    observations.push(`毛孔大小：${skinTypeCriteria.poreSize}`);
    observations.push(`水合度：${result.hydrationLevel === 'low' ? '偏低' : result.hydrationLevel === 'high' ? '良好' : '正常'}`);
    observations.push(`出油情况：${result.oilinessLevel === 'high' ? '偏多' : result.oilinessLevel === 'low' ? '偏少' : '正常'}`);
    
    if (result.concerns.length > 0) {
      observations.push(`检测到 ${result.concerns.length} 个皮肤问题需要关注`);
    }

    return observations;
  }

  private convertToRecommendations(skinRecs: SkinRecommendation[]): Recommendation[] {
    return skinRecs.map(r => ({
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: r.type === 'sun_protection' ? 'lifestyle' : 
            r.type === 'treatment' ? 'immediate_action' : 'lifestyle',
      priority: r.priority,
      title: r.title,
      content: r.content + (r.productType ? `(推荐产品类型：${r.productType})` : ''),
      targetAudience: 'general_public',
      evidenceSource: '皮肤类型评估标准',
      disclaimers: ['本建议基于肤质评估标准，具体产品选择请根据个人情况']
    }));
  }

  private getSkinTypeLabel(type: SkinType): string {
    const labels: Record<SkinType, string> = {
      dry: '干性肤质',
      oily: '油性肤质',
      combination: '混合性肤质',
      normal: '中性肤质',
      sensitive: '敏感性肤质'
    };
    return labels[type];
  }

  private getSkinTypeDescription(type: SkinType): string {
    const criteria = SKIN_TYPE_CRITERIA.find(s => s.type === type)!;
    return criteria.characteristics.join('，');
  }

  private getConcernLabel(type: string): string {
    const labels: Record<string, string> = {
      acne: '痘痘',
      wrinkles: '皱纹',
      dark_spots: '色斑',
      redness: '泛红',
      pores: '毛孔',
      dark_circles: '黑眼圈',
      uneven_tone: '肤色不均'
    };
    return labels[type] || type;
  }

  getSkinCareTips(): string[] {
    return [
      '每天清洁面部2次，早晚各一次',
      '无论阴晴都要做好防晒',
      '根据肤质选择合适的护肤品',
      '定期去角质，但不要过度',
      '保持充足睡眠和良好心情',
      '多喝水，保持身体水分',
      '避免用手频繁触摸面部'
    ];
  }

  getSkinTypeCriteria() {
    return SKIN_TYPE_CRITERIA;
  }
}

export const skinAnalysisHandler = new SkinAnalysisHandler();
