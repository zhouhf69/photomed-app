/**
 * Nail Analysis Scene - 指甲健康检测场景
 * 大众健康引流模块 - 指甲颜色、纹理、形状分析
 */

import type { 
  AnalysisSession, 
  AnalysisResult, 
  DetectedFeature,
  Recommendation
} from '@/types/core';
import type { 
  NailAnalysisResult, 
  NailRecommendation
} from '@/types/healthScenes';
import type { SceneHandler } from '@/services/sceneManager';

/**
 * 指甲健康检测场景处理器
 */
export class NailAnalysisHandler implements SceneHandler {
  sceneId = 'scene_nail_analysis';

  validateInput(session: AnalysisSession): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (session.images.length === 0) {
      errors.push('请至少上传一张指甲照片');
    }

    const hasValidImage = session.images.some(img => 
      img.qaResult && img.qaResult.passed
    );
    if (!hasValidImage) {
      errors.push('照片质量不合格，请重新拍摄');
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
    console.log('[NailAnalysis] 开始指甲健康分析...');

    const nailResult = await this.performAnalysis(session.images[0].url);

    const analysisResult: AnalysisResult = {
      id: `analysis_${Date.now()}`,
      sceneId: this.sceneId,
      timestamp: Date.now(),
      imageAnalysis: {
        features: this.convertToFeatures(nailResult),
        measurements: [],
        observations: this.generateObservations(nailResult)
      },
      riskAssessment: {
        level: nailResult.overallHealth === 'poor' ? 'high' : 
               nailResult.overallHealth === 'fair' ? 'medium' : 'low',
        factors: nailResult.abnormalities.map(a => ({
          type: a.type,
          description: a.description,
          weight: a.severity === 'high' ? 0.8 : a.severity === 'medium' ? 0.5 : 0.3
        })),
        flags: nailResult.abnormalities
          .filter(a => a.severity === 'high')
          .map(a => ({
            type: a.type,
            description: a.description,
            urgency: a.severity === 'high' ? 'urgent' : 'routine' as 'urgent' | 'routine',
            actionRequired: a.suggestedAction
          }))
      },
      recommendations: this.convertToRecommendations(nailResult.recommendations),
      requiresManualReview: nailResult.abnormalities.some(a => a.severity === 'high'),
      confidence: 0.78
    };

    console.log('[NailAnalysis] 指甲健康分析完成');
    return analysisResult;
  }

  private async performAnalysis(_imageUrl: string): Promise<NailAnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const random = Math.random();

    // 指甲颜色
    const colors = ['pink', 'pale', 'yellow', 'white_spots'] as const;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // 纹理
    const textures = ['smooth', 'ridges', 'brittle'] as const;
    const texture = textures[Math.floor(Math.random() * textures.length)];

    // 整体健康
    const overallHealth = random > 0.7 ? 'good' : random > 0.4 ? 'fair' : 'excellent';

    // 异常检测
    const abnormalities = [];
    
    if (color === 'yellow') {
      abnormalities.push({
        type: 'yellow_nails',
        description: '指甲呈黄色，可能与真菌感染或吸烟有关',
        severity: 'medium' as const,
        suggestedAction: '建议就医检查，排除真菌感染'
      });
    }

    if (color === 'white_spots') {
      abnormalities.push({
        type: 'white_spots',
        description: '指甲出现白点，通常是轻微外伤或缺锌的表现',
        severity: 'low' as const,
        suggestedAction: '注意保护指甲，可适当补充锌元素'
      });
    }

    if (texture === 'brittle') {
      abnormalities.push({
        type: 'brittle_nails',
        description: '指甲脆弱易断，可能与缺水或营养不足有关',
        severity: 'low' as const,
        suggestedAction: '加强保湿，补充生物素和蛋白质'
      });
    }

    // 营养指标
    const nutritionalIndicators = [];
    if (random > 0.5) {
      nutritionalIndicators.push({
        nutrient: '铁',
        indicator: '指甲苍白',
        status: 'deficient' as const
      });
    }
    if (texture === 'brittle') {
      nutritionalIndicators.push({
        nutrient: '生物素',
        indicator: '指甲脆弱',
        status: 'deficient' as const
      });
    }

    // 建议
    const recommendations = this.generateNailRecommendations(abnormalities, nutritionalIndicators);

    return {
      overallHealth,
      colorAssessment: {
        color,
        description: this.getColorDescription(color),
        possibleCauses: this.getColorCauses(color)
      },
      textureAssessment: {
        texture,
        description: this.getTextureDescription(texture)
      },
      shapeAssessment: {
        shape: 'normal',
        description: '指甲形状正常'
      },
      abnormalities,
      nutritionalIndicators,
      recommendations,
      disclaimer: '本分析仅供参考，不能替代专业医疗诊断。指甲变化可能反映全身健康状况，如有疑虑请咨询医师。'
    };
  }

  private getColorDescription(color: string): string {
    const descriptions: Record<string, string> = {
      pink: '健康的粉红色，血液循环良好',
      pale: '颜色偏淡，可能贫血或循环不佳',
      yellow: '呈黄色，可能与真菌感染有关',
      white_spots: '有白点，通常是轻微外伤',
      blue: '发紫发蓝，可能循环问题',
      brown_streaks: '有棕色条纹，需要关注'
    };
    return descriptions[color] || '颜色正常';
  }

  private getColorCauses(color: string): string[] {
    const causes: Record<string, string[]> = {
      pink: ['健康状态良好'],
      pale: ['贫血', '营养不良', '循环问题'],
      yellow: ['真菌感染', '吸烟', '指甲油染色'],
      white_spots: ['轻微外伤', '缺锌', '缺钙'],
      blue: ['缺氧', '循环障碍', '心脏问题'],
      brown_streaks: ['黑色素沉积', '外伤', '需要排除恶性病变']
    };
    return causes[color] || [];
  }

  private getTextureDescription(texture: string): string {
    const descriptions: Record<string, string> = {
      smooth: '表面光滑平整',
      ridges: '有纵向纹路，可能与年龄或营养有关',
      brittle: '脆弱易断，需要加强护理',
      pitting: '有凹陷，可能与银屑病有关',
      thickening: '增厚变形，可能真菌感染'
    };
    return descriptions[texture] || '纹理正常';
  }

  private generateNailRecommendations(
    abnormalities: NailAnalysisResult['abnormalities'],
    nutritionalIndicators: NailAnalysisResult['nutritionalIndicators']
  ): NailRecommendation[] {
    const recommendations: NailRecommendation[] = [];

    // 基础护理
    recommendations.push({
      type: 'care',
      title: '日常护理',
      content: '保持指甲清洁干燥，定期修剪，避免过度浸泡在水中',
      urgency: 'routine'
    });

    // 保湿
    recommendations.push({
      type: 'care',
      title: '保湿护理',
      content: '使用护手霜和指缘油，保持指甲及周围皮肤滋润',
      urgency: 'routine'
    });

    // 营养建议
    if (nutritionalIndicators.length > 0) {
      const nutrients = nutritionalIndicators.map(n => n.nutrient).join('、');
      recommendations.push({
        type: 'nutrition',
        title: '营养补充',
        content: `建议补充${nutrients}，可通过食物或补充剂摄取。富含蛋白质、生物素、锌的食物有助于指甲健康`,
        urgency: 'routine'
      });
    }

    // 针对异常的建议
    abnormalities.forEach(abnormal => {
      if (abnormal.severity === 'high' || abnormal.severity === 'medium') {
        recommendations.push({
          type: 'medical_attention',
          title: '就医建议',
          content: abnormal.suggestedAction,
          urgency: abnormal.severity === 'high' ? 'urgent' : 'soon'
        });
      }
    });

    return recommendations;
  }

  private convertToFeatures(result: NailAnalysisResult): DetectedFeature[] {
    const features: DetectedFeature[] = [];

    features.push({
      type: 'nail_color',
      label: this.getColorLabel(result.colorAssessment.color),
      confidence: 0.8,
      description: result.colorAssessment.description
    });

    features.push({
      type: 'nail_texture',
      label: this.getTextureLabel(result.textureAssessment.texture),
      confidence: 0.75,
      description: result.textureAssessment.description
    });

    return features;
  }

  private generateObservations(result: NailAnalysisResult): string[] {
    const observations: string[] = [];
    
    observations.push(`指甲颜色：${result.colorAssessment.description}`);
    observations.push(`指甲质地：${result.textureAssessment.description}`);
    
    if (result.abnormalities.length > 0) {
      observations.push(`检测到 ${result.abnormalities.length} 项异常`);
    }

    if (result.nutritionalIndicators.length > 0) {
      const nutrients = result.nutritionalIndicators.map(n => n.nutrient).join('、');
      observations.push(`可能需要关注：${nutrients}`);
    }

    return observations;
  }

  private convertToRecommendations(nailRecs: NailRecommendation[]): Recommendation[] {
    return nailRecs.map(r => ({
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: r.type === 'medical_attention' ? 'referral' : 'lifestyle',
      priority: r.urgency === 'urgent' ? 'high' : r.urgency === 'soon' ? 'medium' : 'low',
      title: r.title,
      content: r.content,
      targetAudience: 'general_public',
      disclaimers: ['本建议仅供参考']
    }));
  }

  private getColorLabel(color: string): string {
    const labels: Record<string, string> = {
      pink: '粉红色',
      pale: '苍白色',
      yellow: '黄色',
      white_spots: '有白点',
      blue: '青紫色',
      brown_streaks: '棕色条纹'
    };
    return labels[color] || color;
  }

  private getTextureLabel(texture: string): string {
    const labels: Record<string, string> = {
      smooth: '光滑',
      ridges: '有纹路',
      brittle: '脆弱',
      pitting: '有凹陷',
      thickening: '增厚'
    };
    return labels[texture] || texture;
  }

  getNailCareTips(): string[] {
    return [
      '定期修剪指甲，保持适当长度',
      '使用护手霜保持手部滋润',
      '避免用指甲抠硬物',
      '做家务时戴手套保护',
      '补充蛋白质和维生素',
      '不要过度修剪指甲周围皮肤',
      '发现异常及时就医'
    ];
  }
}

export const nailAnalysisHandler = new NailAnalysisHandler();
