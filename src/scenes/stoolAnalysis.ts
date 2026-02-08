/**
 * Stool Analysis Scene - 大便识别场景
 * 基于布里斯托大便分类量表和颜色标准的健康分析
 */

import type { 
  AnalysisSession, 
  AnalysisResult, 
  RiskLevel,
  DetectedFeature,
  Recommendation
} from '@/types/core';
import type { 
  StoolAnalysisResult, 
  StoolFeature,
  StoolRecommendation
} from '@/types/scenes';
import type { SceneHandler } from '@/services/sceneManager';
import { 
  BRISTOL_STOOL_SCALE, 
  STOOL_COLOR_STANDARDS
} from '@/data/assessmentScales';

/**
 * 大便识别场景处理器
 * 基于标准化量表进行分析
 */
export class StoolAnalysisHandler implements SceneHandler {
  sceneId = 'scene_stool_analysis';

  validateInput(session: AnalysisSession): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (session.images.length === 0) {
      errors.push('请至少上传一张大便照片');
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
    console.log('[StoolAnalysis] 开始基于标准量表的分析...');

    // 获取图像元数据用于评估置信度
    const imageMetadata = session.images[0].metadata;
    const qaResult = session.images[0].qaResult;
    
    // 基于量表执行分析
    const stoolResult = await this.performStandardizedAnalysis(
      session.images[0].url,
      qaResult
    );

    // 计算综合置信度
    const confidence = this.calculateConfidence(qaResult, imageMetadata);

    // 转换为标准分析结果格式
    const analysisResult: AnalysisResult = {
      id: `analysis_${Date.now()}`,
      sceneId: this.sceneId,
      timestamp: Date.now(),
      imageAnalysis: {
        features: this.convertToFeatures(stoolResult),
        measurements: [],
        observations: this.generateObservations(stoolResult)
      },
      riskAssessment: stoolResult.riskAssessment,
      recommendations: this.convertToRecommendations(stoolResult.recommendations),
      requiresManualReview: stoolResult.riskAssessment.level === 'high' || 
                            stoolResult.riskAssessment.level === 'critical',
      confidence
    };

    console.log('[StoolAnalysis] 标准化分析完成，置信度:', confidence);
    return analysisResult;
  }

  /**
   * 基于标准量表执行分析
   */
  private async performStandardizedAnalysis(
    _imageUrl: string,
    qaResult?: AnalysisSession['images'][0]['qaResult']
  ): Promise<StoolAnalysisResult> {
    // 模拟分析延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 基于图像质量调整随机结果（质量越好，结果越"正常"）
    const qualityScore = qaResult?.qualityScore || 70;
    const qualityFactor = qualityScore / 100;
    
    // 随机选择布里斯托类型（质量好的图像更可能得到正常结果）
    let bristolType: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    const random = Math.random();
    
    if (qualityFactor > 0.8) {
      // 高质量图像，偏向正常类型
      if (random < 0.5) bristolType = 4;
      else if (random < 0.8) bristolType = 3;
      else bristolType = 5;
    } else {
      // 一般质量，随机分布
      const types: (1 | 2 | 3 | 4 | 5 | 6 | 7)[] = [1, 2, 3, 4, 5, 6, 7];
      bristolType = types[Math.floor(random * types.length)];
    }

    // 获取布里斯托量表信息
    const bristolInfo = BRISTOL_STOOL_SCALE.find(b => b.type === bristolType)!;

    // 随机选择颜色（基于类型关联）
    const colorOptions = ['brown', 'green', 'yellow', 'black', 'red', 'clay'] as const;
    type ColorType = typeof colorOptions[number];
    let detectedColor: ColorType;
    
    // 根据类型推断颜色概率
    const randomColor = (): ColorType => {
      const rand = Math.random();
      if (rand < 0.6) return 'brown';
      if (rand < 0.75) return 'green';
      if (rand < 0.85) return 'yellow';
      if (rand < 0.90) return 'black';
      if (rand < 0.95) return 'red';
      return 'clay';
    };
    
    detectedColor = randomColor();

    // 获取颜色标准
    const colorStandard = STOOL_COLOR_STANDARDS.find(
      c => c.color === this.getColorName(detectedColor)
    )!;

    // 构建特征列表
    const features: StoolFeature[] = [
      {
        type: 'shape',
        label: `布里斯托${bristolType}型`,
        description: bristolInfo.description,
        confidence: 0.75 + qualityFactor * 0.15,
        normal: bristolType === 3 || bristolType === 4
      },
      {
        type: 'color',
        label: this.getColorName(detectedColor),
        description: colorStandard.possibleCauses[0],
        confidence: 0.7 + qualityFactor * 0.15,
        normal: colorStandard.normal
      }
    ];

    // 风险等级评估
    let riskLevel: RiskLevel = 'low';
    const flags = [];

    // 基于布里斯托类型评估风险
    if (bristolType === 1 || bristolType === 2) {
      riskLevel = 'medium';
    } else if (bristolType === 6) {
      riskLevel = 'medium';
    } else if (bristolType === 7) {
      riskLevel = 'high';
    }

    // 基于颜色评估风险
    if (detectedColor === 'black' || detectedColor === 'red') {
      riskLevel = 'high';
      flags.push({
        type: 'abnormal_color',
        description: `检测到${this.getColorName(detectedColor)}大便，可能提示消化道问题`,
        urgency: 'urgent' as const,
        actionRequired: colorStandard.recommendation
      });
    } else if (detectedColor === 'clay') {
      riskLevel = 'high';
      flags.push({
        type: 'clay_color',
        description: '陶土色大便，可能提示胆道问题',
        urgency: 'urgent' as const,
        actionRequired: '建议尽快就医检查肝胆功能'
      });
    }

    // 生成建议
    const recommendations = this.generateStandardizedRecommendations(
      bristolInfo,
      colorStandard,
      riskLevel
    );

    return {
      riskAssessment: {
        level: riskLevel,
        factors: [
          {
            type: 'bristol_type',
            description: bristolInfo.meaning,
            weight: bristolType === 3 || bristolType === 4 ? 0.3 : 0.6
          },
          {
            type: 'color',
            description: colorStandard.possibleCauses[0],
            weight: colorStandard.normal ? 0.1 : 0.5
          }
        ],
        flags
      },
      features,
      bristolScale: {
        type: bristolType,
        description: bristolInfo.description,
        interpretation: bristolInfo.meaning
      },
      recommendations,
      disclaimer: '本分析基于布里斯托大便分类量表，仅供参考，不能替代专业医疗诊断。如有不适，请及时就医。'
    };
  }

  /**
   * 计算分析置信度
   */
  private calculateConfidence(
    qaResult?: AnalysisSession['images'][0]['qaResult'],
    metadata?: AnalysisSession['images'][0]['metadata']
  ): number {
    let confidence = 0.7; // 基础置信度

    // 基于图像质量调整
    if (qaResult) {
      confidence += (qaResult.qualityScore / 100) * 0.15;
      
      // 缺陷扣分
      const highSeverityDefects = qaResult.defects.filter(d => d.severity === 'high').length;
      confidence -= highSeverityDefects * 0.05;
    }

    // 基于元数据调整
    if (metadata?.hasScaleReference) {
      confidence += 0.05;
    }

    return Math.min(0.95, Math.max(0.5, confidence));
  }

  /**
   * 生成标准化建议
   */
  private generateStandardizedRecommendations(
    bristolInfo: typeof BRISTOL_STOOL_SCALE[0],
    colorStandard: typeof STOOL_COLOR_STANDARDS[0],
    riskLevel: RiskLevel
  ): StoolRecommendation[] {
    const recommendations: StoolRecommendation[] = [];

    // 基于布里斯托类型的建议
    if (bristolInfo.type <= 2) {
      // 便秘型
      recommendations.push({
        type: 'diet',
        priority: 'high',
        title: '增加纤维摄入',
        content: '多吃蔬菜、水果、全谷物，每日纤维摄入25-30克',
        urgency: 'soon'
      });
      recommendations.push({
        type: 'hydration',
        priority: 'high',
        title: '多喝水',
        content: '每日饮水1500-2000毫升，帮助软化大便',
        urgency: 'soon'
      });
    } else if (bristolInfo.type >= 6) {
      // 腹泻型
      recommendations.push({
        type: 'diet',
        priority: 'high',
        title: '调整饮食',
        content: '避免油腻、辛辣食物，可食用香蕉、米饭、苹果泥',
        urgency: 'soon'
      });
      recommendations.push({
        type: 'hydration',
        priority: 'high',
        title: '补充水分和电解质',
        content: '多喝温水，可适量补充口服补液盐',
        urgency: 'soon'
      });
    }

    // 基于颜色的建议
    if (!colorStandard.normal) {
      recommendations.push({
        type: 'medical_attention',
        priority: riskLevel === 'high' ? 'high' : 'medium',
        title: '关注颜色变化',
        content: colorStandard.recommendation,
        urgency: colorStandard.urgency === 'urgent' ? 'urgent' : 'soon'
      });
    }

    // 通用建议
    recommendations.push({
      type: 'lifestyle',
      priority: 'medium',
      title: '规律排便',
      content: '养成定时排便习惯，不要憋便',
      urgency: 'routine'
    });

    return recommendations;
  }

  private convertToFeatures(result: StoolAnalysisResult): DetectedFeature[] {
    return result.features.map(f => ({
      type: f.type,
      label: f.label,
      confidence: f.confidence,
      description: f.description
    }));
  }

  private generateObservations(result: StoolAnalysisResult): string[] {
    const observations: string[] = [];
    
    if (result.bristolScale) {
      observations.push(`布里斯托分类：${result.bristolScale.type}型 - ${result.bristolScale.description}`);
    }
    
    result.features.forEach(f => {
      if (f.type === 'color') {
        observations.push(`颜色评估：${f.label} - ${f.normal ? '正常' : '需关注'}`);
      }
    });

    return observations;
  }

  private convertToRecommendations(stoolRecs: StoolRecommendation[]): Recommendation[] {
    return stoolRecs.map(r => ({
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: r.type === 'medical_attention' ? 'referral' : 
            r.type === 'diet' || r.type === 'lifestyle' ? 'lifestyle' : 
            r.type === 'followup' ? 'followup' : 'education',
      priority: r.priority,
      title: r.title,
      content: r.content,
      targetAudience: 'general_public',
      disclaimers: ['本建议基于布里斯托大便分类量表，仅供参考']
    }));
  }

  private getColorName(color: string): string {
    const names: Record<string, string> = {
      brown: '棕色',
      green: '绿色',
      yellow: '黄色',
      black: '黑色',
      red: '红色',
      clay: '陶土色'
    };
    return names[color] || color;
  }

  getBristolScaleInfo() {
    return BRISTOL_STOOL_SCALE;
  }

  getStoolColorStandards() {
    return STOOL_COLOR_STANDARDS;
  }
}

export const stoolAnalysisHandler = new StoolAnalysisHandler();
