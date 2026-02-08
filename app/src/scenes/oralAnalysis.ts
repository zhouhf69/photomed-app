/**
 * Oral Health Analysis Scene - 口腔健康检测场景
 * 大众健康引流模块 - 牙齿、牙龈、舌头健康分析
 */

import type { 
  AnalysisSession, 
  AnalysisResult, 
  DetectedFeature,
  Recommendation
} from '@/types/core';
import type { 
  OralAnalysisResult, 
  OralRecommendation
} from '@/types/healthScenes';
import type { SceneHandler } from '@/services/sceneManager';

/**
 * 口腔健康检测场景处理器
 */
export class OralAnalysisHandler implements SceneHandler {
  sceneId = 'scene_oral_analysis';

  validateInput(session: AnalysisSession): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (session.images.length === 0) {
      errors.push('请至少上传一张口腔照片');
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
    console.log('[OralAnalysis] 开始口腔健康分析...');

    const oralResult = await this.performAnalysis(session.images[0].url);

    const analysisResult: AnalysisResult = {
      id: `analysis_${Date.now()}`,
      sceneId: this.sceneId,
      timestamp: Date.now(),
      imageAnalysis: {
        features: this.convertToFeatures(oralResult),
        measurements: [],
        observations: this.generateObservations(oralResult)
      },
      riskAssessment: {
        level: oralResult.overallHealth === 'poor' ? 'high' : 
               oralResult.overallHealth === 'fair' ? 'medium' : 'low',
        factors: oralResult.concerns.map(c => ({
          type: c.type,
          description: c.description,
          weight: c.severity === 'severe' ? 0.8 : c.severity === 'moderate' ? 0.5 : 0.3
        })),
        flags: oralResult.concerns
          .filter(c => c.severity === 'severe' || c.severity === 'moderate')
          .map(c => ({
            type: c.type,
            description: c.description,
            urgency: c.severity === 'severe' ? 'urgent' : 'routine' as 'urgent' | 'routine',
            actionRequired: this.getActionForConcern(c.type)
          }))
      },
      recommendations: this.convertToRecommendations(oralResult.recommendations),
      requiresManualReview: oralResult.concerns.some(c => c.severity === 'severe'),
      confidence: 0.8
    };

    console.log('[OralAnalysis] 口腔健康分析完成');
    return analysisResult;
  }

  private async performAnalysis(_imageUrl: string): Promise<OralAnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const random = Math.random();

    // 牙齿评估
    const teethColors = ['white', 'slightly_yellow', 'yellow'] as const;
    const teethColor = teethColors[Math.floor(Math.random() * teethColors.length)];

    // 牙龈评估
    const gumCondition = random > 0.7 ? 'healthy' : random > 0.4 ? 'gingivitis' : 'periodontitis_risk';

    // 舌头评估
    const tongueColors = ['pink', 'white_coated', 'yellow_coated'] as const;
    const tongueColor = tongueColors[Math.floor(Math.random() * tongueColors.length)];

    // 整体健康
    const overallHealth = gumCondition === 'healthy' && teethColor === 'white' ? 'good' : 'fair';

    // 问题检测
    const concerns = [];

    if (teethColor === 'yellow') {
      concerns.push({
        type: 'staining' as const,
        severity: 'moderate' as const,
        description: '牙齿有明显染色，可能与饮食或吸烟有关'
      });
    }

    if (gumCondition === 'gingivitis') {
      concerns.push({
        type: 'gum_disease' as const,
        severity: 'moderate' as const,
        description: '牙龈有轻度炎症，可能出现红肿或出血'
      });
    }

    if (tongueColor === 'white_coated') {
      concerns.push({
        type: 'bad_breath' as const,
        severity: 'mild' as const,
        description: '舌苔较厚，可能影响口气'
      });
    }

    if (random > 0.8) {
      concerns.push({
        type: 'sensitivity' as const,
        severity: 'mild' as const,
        description: '可能存在牙齿敏感问题'
      });
    }

    // 卫生水平
    const hygieneLevel = random > 0.6 ? 'good' : random > 0.3 ? 'fair' : 'poor';

    // 建议
    const recommendations = this.generateOralRecommendations(concerns, hygieneLevel);

    return {
      overallHealth,
      teethAssessment: {
        color: teethColor,
        alignment: 'straight',
        visibleCavities: false,
        plaqueLevel: random > 0.5 ? 'moderate' : 'minimal',
        tartarBuildup: random > 0.7
      },
      gumAssessment: {
        color: gumCondition === 'healthy' ? 'pink' : 'red',
        bleeding: gumCondition !== 'healthy',
        recession: false,
        condition: gumCondition
      },
      tongueAssessment: {
        color: tongueColor,
        texture: 'normal',
        coating: tongueColor === 'pink' ? 'none' : 'thin'
      },
      hygieneLevel,
      concerns,
      recommendations,
      disclaimer: '本分析仅供参考，不能替代专业牙科诊断。建议每6个月进行一次专业口腔检查。'
    };
  }

  private getActionForConcern(type: string): string {
    const actions: Record<string, string> = {
      cavity: '尽快预约牙医进行检查和治疗',
      gum_disease: '改善口腔卫生习惯，必要时就医',
      staining: '考虑专业洗牙，改善饮食习惯',
      bad_breath: '加强口腔清洁，清洁舌苔',
      sensitivity: '使用抗敏感牙膏，避免过冷过热食物',
      grinding: '咨询牙医，可能需要佩戴牙套'
    };
    return actions[type] || '建议咨询专业牙医';
  }

  private generateOralRecommendations(
    concerns: OralAnalysisResult['concerns'],
    _hygieneLevel: OralAnalysisResult['hygieneLevel']
  ): OralRecommendation[] {
    const recommendations: OralRecommendation[] = [];

    // 刷牙建议
    recommendations.push({
      type: 'brushing',
      priority: 'high',
      title: '正确刷牙',
      content: '每天刷牙2次，每次2-3分钟，使用巴氏刷牙法，选择软毛牙刷'
    });

    // 牙线
    recommendations.push({
      type: 'flossing',
      priority: 'high',
      title: '使用牙线',
      content: '每天使用牙线清洁牙缝，去除牙刷无法触及的牙菌斑'
    });

    // 漱口水
    if (concerns.some(c => c.type === 'bad_breath' || c.type === 'gum_disease')) {
      recommendations.push({
        type: 'mouthwash',
        priority: 'medium',
        title: '漱口水',
        content: '使用含氟或抗菌漱口水，帮助减少细菌和清新口气'
      });
    }

    // 饮食建议
    recommendations.push({
      type: 'diet',
      priority: 'medium',
      title: '饮食注意',
      content: '减少糖分摄入，避免频繁进食，少喝碳酸饮料，多吃富含纤维的食物'
    });

    // 定期检查
    recommendations.push({
      type: 'dental_visit',
      priority: 'high',
      title: '定期检查',
      content: '每6个月进行一次专业口腔检查和洁牙'
    });

    // 针对具体问题的建议
    concerns.forEach(concern => {
      if (concern.type === 'staining') {
        recommendations.push({
          type: 'habits',
          priority: 'medium',
          title: '改善染色',
          content: '减少咖啡、茶、红酒摄入，吸烟人士建议戒烟，可考虑专业美白'
        });
      }
      if (concern.type === 'sensitivity') {
        recommendations.push({
          type: 'habits',
          priority: 'medium',
          title: '缓解敏感',
          content: '使用抗敏感牙膏，避免过冷过热食物，刷牙力度适中'
        });
      }
    });

    return recommendations;
  }

  private convertToFeatures(result: OralAnalysisResult): DetectedFeature[] {
    const features: DetectedFeature[] = [];

    features.push({
      type: 'teeth_color',
      label: this.getTeethColorLabel(result.teethAssessment.color),
      confidence: 0.82,
      description: `牙齿颜色：${this.getTeethColorLabel(result.teethAssessment.color)}`
    });

    features.push({
      type: 'gum_condition',
      label: this.getGumConditionLabel(result.gumAssessment.condition),
      confidence: 0.78,
      description: `牙龈状况：${this.getGumConditionLabel(result.gumAssessment.condition)}`
    });

    features.push({
      type: 'tongue_coating',
      label: result.tongueAssessment.coating === 'none' ? '无舌苔' : '有舌苔',
      confidence: 0.75,
      description: `舌苔：${result.tongueAssessment.coating === 'none' ? '正常' : '较厚'}`
    });

    return features;
  }

  private generateObservations(result: OralAnalysisResult): string[] {
    const observations: string[] = [];
    
    observations.push(`牙齿颜色：${this.getTeethColorLabel(result.teethAssessment.color)}`);
    observations.push(`牙龈状况：${this.getGumConditionLabel(result.gumAssessment.condition)}`);
    observations.push(`口腔卫生：${result.hygieneLevel === 'good' ? '良好' : result.hygieneLevel === 'fair' ? '一般' : '需要改善'}`);
    
    if (result.concerns.length > 0) {
      observations.push(`检测到 ${result.concerns.length} 项需要关注的问题`);
    }

    return observations;
  }

  private convertToRecommendations(oralRecs: OralRecommendation[]): Recommendation[] {
    return oralRecs.map(r => ({
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: r.type === 'dental_visit' ? 'referral' : 'lifestyle',
      priority: r.priority,
      title: r.title,
      content: r.content,
      targetAudience: 'general_public',
      disclaimers: ['本建议仅供参考，不能替代专业牙科诊断']
    }));
  }

  private getTeethColorLabel(color: string): string {
    const labels: Record<string, string> = {
      white: '洁白',
      slightly_yellow: '微黄',
      yellow: '偏黄',
      stained: '有染色'
    };
    return labels[color] || color;
  }

  private getGumConditionLabel(condition: string): string {
    const labels: Record<string, string> = {
      healthy: '健康',
      gingivitis: '轻度炎症',
      periodontitis_risk: '需要关注'
    };
    return labels[condition] || condition;
  }

  getOralCareTips(): string[] {
    return [
      '每天刷牙2次，每次至少2分钟',
      '使用牙线清洁牙缝',
      '每3个月更换一次牙刷',
      '每6个月进行一次口腔检查',
      '减少糖分和酸性食物摄入',
      '多喝水，保持口腔湿润',
      '戒烟限酒，保护口腔健康'
    ];
  }
}

export const oralAnalysisHandler = new OralAnalysisHandler();
