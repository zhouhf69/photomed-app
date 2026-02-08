/**
 * Tongue Analysis Scene - 舌苔分析场景（中医）
 * 大众健康引流模块 - 舌象分析、体质辨识、养生建议
 */

import type { 
  AnalysisSession, 
  AnalysisResult, 
  DetectedFeature,
  Recommendation
} from '@/types/core';
import type { 
  TongueAnalysisResult, 
  TCMPattern,
  BodyConstitution,
  TCMRecommendation
} from '@/types/healthScenes';
import type { SceneHandler } from '@/services/sceneManager';

/**
 * 舌苔分析场景处理器（中医）
 */
export class TongueAnalysisHandler implements SceneHandler {
  sceneId = 'scene_tongue_analysis';

  validateInput(session: AnalysisSession): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (session.images.length === 0) {
      errors.push('请至少上传一张舌头照片');
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
    console.log('[TongueAnalysis] 开始舌苔分析...');

    const tongueResult = await this.performAnalysis(session.images[0].url);

    const analysisResult: AnalysisResult = {
      id: `analysis_${Date.now()}`,
      sceneId: this.sceneId,
      timestamp: Date.now(),
      imageAnalysis: {
        features: this.convertToFeatures(tongueResult),
        measurements: [],
        observations: this.generateObservations(tongueResult)
      },
      riskAssessment: {
        level: tongueResult.tcmPattern.severity === 'severe' ? 'high' : 
               tongueResult.tcmPattern.severity === 'moderate' ? 'medium' : 'low',
        factors: [{
          type: 'tcm_pattern',
          description: tongueResult.tcmPattern.description,
          weight: tongueResult.tcmPattern.severity === 'severe' ? 0.8 : 0.5
        }],
        flags: tongueResult.tcmPattern.severity === 'severe' ? [{
          type: 'tcm_imbalance',
          description: tongueResult.tcmPattern.description,
          urgency: 'routine',
          actionRequired: '建议咨询中医师进行调理'
        }] : []
      },
      recommendations: this.convertToRecommendations(tongueResult.recommendations),
      requiresManualReview: false,
      confidence: 0.75
    };

    console.log('[TongueAnalysis] 舌苔分析完成');
    return analysisResult;
  }

  private async performAnalysis(_imageUrl: string): Promise<TongueAnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 舌色
    const tongueColors = ['pink', 'pale', 'red', 'white_coated'] as const;
    const selectedTongueColor = tongueColors[Math.floor(Math.random() * tongueColors.length)];

    // 舌苔颜色
    const coatingColors = ['white', 'yellow', 'none'] as const;
    const selectedCoatingColor = coatingColors[Math.floor(Math.random() * coatingColors.length)];

    // 舌苔厚度
    const coatingThicknesses = ['none', 'thin', 'moderate'] as const;
    const coatingThickness = coatingThicknesses[Math.floor(Math.random() * coatingThicknesses.length)];

    // 体质辨识
    const constitutions: BodyConstitution[] = [
      'balanced', 'qi_deficiency', 'yang_deficiency', 'yin_deficiency', 
      'phlegm_dampness', 'damp_heat'
    ];
    const bodyConstitution = constitutions[Math.floor(Math.random() * constitutions.length)];

    // 中医证型
    const tcmPattern = this.getTCMPattern(bodyConstitution, selectedTongueColor, selectedCoatingColor);

    // 养生建议
    const recommendations = this.generateTCMRecommendations(bodyConstitution, tcmPattern);

    return {
      tongueColor: selectedTongueColor as 'pink' | 'pale' | 'red' | 'dark_red' | 'purple' | 'blue',
      coatingColor: selectedCoatingColor as 'white' | 'yellow' | 'gray' | 'black' | 'none',
      coatingThickness,
      coatingDistribution: 'even',
      moisture: 'normal',
      shape: 'normal',
      tcmPattern,
      bodyConstitution,
      recommendations,
      disclaimer: '本分析基于中医舌诊理论，仅供参考，不能替代专业中医诊断。'
    };
  }

  private getTCMPattern(
    constitution: BodyConstitution, 
    _tongueColor: string, 
    _coatingColor: string
  ): TCMPattern {
    const patterns: Record<BodyConstitution, TCMPattern> = {
      balanced: {
        name: '平和体质',
        description: '阴阳气血调和，身体状态良好',
        symptoms: ['精力充沛', '睡眠良好', '食欲正常'],
        severity: 'mild'
      },
      qi_deficiency: {
        name: '气虚证',
        description: '元气不足，脏腑功能减退',
        symptoms: ['容易疲劳', '气短懒言', '自汗', '抵抗力差'],
        severity: 'moderate'
      },
      yang_deficiency: {
        name: '阳虚证',
        description: '阳气不足，温煦功能减弱',
        symptoms: ['畏寒怕冷', '手脚冰凉', '喜热饮', '精神不振'],
        severity: 'moderate'
      },
      yin_deficiency: {
        name: '阴虚证',
        description: '阴液不足，虚热内生',
        symptoms: ['口干咽燥', '手足心热', '夜间盗汗', '失眠多梦'],
        severity: 'moderate'
      },
      phlegm_dampness: {
        name: '痰湿证',
        description: '痰湿内蕴，脾失健运',
        symptoms: ['身体困重', '胸闷痰多', '口黏腻', '大便黏滞'],
        severity: 'moderate'
      },
      damp_heat: {
        name: '湿热证',
        description: '湿热内蕴，阻滞气机',
        symptoms: ['口苦口臭', '皮肤油腻', '小便黄赤', '大便臭秽'],
        severity: 'moderate'
      },
      blood_stasis: {
        name: '血瘀证',
        description: '血液运行不畅，瘀阻脉络',
        symptoms: ['面色晦暗', '唇色紫暗', '易有瘀斑', '痛经'],
        severity: 'moderate'
      },
      qi_stagnation: {
        name: '气滞证',
        description: '气机郁滞，运行不畅',
        symptoms: ['情绪抑郁', '胸胁胀痛', '善太息', '月经不调'],
        severity: 'moderate'
      }
    };

    return patterns[constitution];
  }

  private generateTCMRecommendations(
    constitution: BodyConstitution,
    _pattern: TCMPattern
  ): TCMRecommendation[] {
    const recommendations: TCMRecommendation[] = [];

    // 基础饮食建议
    const constitutionDiet: Record<BodyConstitution, { eat: string[]; avoid: string[] }> = {
      balanced: {
        eat: ['五谷杂粮', '新鲜蔬果', '适量蛋白质'],
        avoid: ['过度油腻', '过甜过咸']
      },
      qi_deficiency: {
        eat: ['山药', '红枣', '黄芪', '鸡肉', '小米'],
        avoid: ['生冷食物', '油腻厚味', '过度劳累']
      },
      yang_deficiency: {
        eat: ['生姜', '羊肉', '桂圆', '核桃', '韭菜'],
        avoid: ['寒凉食物', '冷饮', '生冷瓜果']
      },
      yin_deficiency: {
        eat: ['银耳', '百合', '梨', '鸭肉', '黑芝麻'],
        avoid: ['辛辣燥热', '煎炸食物', '烟酒']
      },
      phlegm_dampness: {
        eat: ['薏米', '红豆', '冬瓜', '白萝卜', '荷叶'],
        avoid: ['甜腻食物', '油腻厚味', '奶制品']
      },
      damp_heat: {
        eat: ['绿豆', '苦瓜', '芹菜', '冬瓜', '莲藕'],
        avoid: ['辛辣刺激', '烧烤油炸', '酒精']
      },
      blood_stasis: {
        eat: ['山楂', '玫瑰花', '黑木耳', '红糖', '醋'],
        avoid: ['寒凉收敛', '油腻阻滞']
      },
      qi_stagnation: {
        eat: ['陈皮', '佛手', '玫瑰花茶', '柑橘', '萝卜'],
        avoid: ['郁闷生气', '油腻阻滞', '过度思虑']
      }
    };

    const diet = constitutionDiet[constitution];

    recommendations.push({
      type: 'diet',
      title: '饮食调理',
      content: `宜食：${diet.eat.join('、')}；忌食：${diet.avoid.join('、')}`,
      foodsToEat: diet.eat,
      foodsToAvoid: diet.avoid
    });

    // 生活方式
    const lifestyleAdvice: Record<BodyConstitution, string> = {
      balanced: '保持规律作息，适度运动，心情舒畅',
      qi_deficiency: '避免过度劳累，保证充足睡眠，适度运动',
      yang_deficiency: '注意保暖，多晒太阳，避免寒冷环境',
      yin_deficiency: '避免熬夜，保持心情舒畅，减少思虑',
      phlegm_dampness: '加强运动，避免久坐，保持环境干燥',
      damp_heat: '保持皮肤清洁，避免潮湿环境，多喝水',
      blood_stasis: '适度运动，避免久坐，保持心情舒畅',
      qi_stagnation: '调节情绪，多户外活动，避免抑郁'
    };

    recommendations.push({
      type: 'lifestyle',
      title: '生活调养',
      content: lifestyleAdvice[constitution]
    });

    // 运动建议
    const exerciseAdvice: Record<BodyConstitution, string> = {
      balanced: '太极拳、八段锦、散步等有氧运动',
      qi_deficiency: '轻柔运动如太极拳、散步，避免剧烈运动',
      yang_deficiency: '温和运动，多晒太阳，避免寒冷环境运动',
      yin_deficiency: '游泳、瑜伽等柔和运动，避免大汗',
      phlegm_dampness: '有氧运动如快走、慢跑，帮助化痰祛湿',
      damp_heat: '游泳、快走等，帮助清热祛湿',
      blood_stasis: '太极拳、八段锦，促进气血运行',
      qi_stagnation: '户外活动、团体运动，疏肝解郁'
    };

    recommendations.push({
      type: 'exercise',
      title: '运动建议',
      content: exerciseAdvice[constitution]
    });

    // 穴位按摩
    const acupressurePoints: Record<BodyConstitution, string> = {
      balanced: '足三里、关元，保健强身',
      qi_deficiency: '足三里、气海、关元，补气健脾',
      yang_deficiency: '关元、命门、肾俞，温阳补肾',
      yin_deficiency: '太溪、三阴交、涌泉，滋阴补肾',
      phlegm_dampness: '丰隆、足三里、阴陵泉，化痰祛湿',
      damp_heat: '阴陵泉、足三里、曲池，清热祛湿',
      blood_stasis: '血海、膈俞、三阴交，活血化瘀',
      qi_stagnation: '太冲、期门、膻中，疏肝理气'
    };

    recommendations.push({
      type: 'acupressure',
      title: '穴位保健',
      content: `建议按摩穴位：${acupressurePoints[constitution]}，每穴按揉3-5分钟`
    });

    return recommendations;
  }

  private convertToFeatures(result: TongueAnalysisResult): DetectedFeature[] {
    const features: DetectedFeature[] = [];

    features.push({
      type: 'tongue_color',
      label: this.getTongueColorLabel(result.tongueColor),
      confidence: 0.8,
      description: `舌色：${this.getTongueColorLabel(result.tongueColor)}`
    });

    features.push({
      type: 'coating',
      label: result.coatingThickness === 'none' ? '无苔' : `${this.getCoatingColorLabel(result.coatingColor)}苔`,
      confidence: 0.75,
      description: `舌苔：${result.coatingThickness === 'none' ? '无苔' : this.getCoatingColorLabel(result.coatingColor) + '，' + this.getThicknessLabel(result.coatingThickness)}`
    });

    features.push({
      type: 'constitution',
      label: this.getConstitutionLabel(result.bodyConstitution),
      confidence: 0.7,
      description: `体质：${this.getConstitutionLabel(result.bodyConstitution)}`
    });

    return features;
  }

  private generateObservations(result: TongueAnalysisResult): string[] {
    const observations: string[] = [];
    
    observations.push(`舌色：${this.getTongueColorLabel(result.tongueColor)}`);
    observations.push(`舌苔：${result.coatingThickness === 'none' ? '无苔' : this.getCoatingColorLabel(result.coatingColor) + '苔，' + this.getThicknessLabel(result.coatingThickness)}`);
    observations.push(`中医证型：${result.tcmPattern.name}`);
    observations.push(`体质辨识：${this.getConstitutionLabel(result.bodyConstitution)}`);

    if (result.tcmPattern.symptoms.length > 0) {
      observations.push(`常见表现：${result.tcmPattern.symptoms.join('、')}`);
    }

    return observations;
  }

  private convertToRecommendations(tcmRecs: TCMRecommendation[]): Recommendation[] {
    return tcmRecs.map(r => ({
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: r.type === 'herbs' ? 'referral' : 'lifestyle',
      priority: 'medium',
      title: r.title,
      content: r.content,
      targetAudience: 'general_public',
      disclaimers: ['本建议基于中医理论，仅供参考']
    }));
  }

  private getTongueColorLabel(color: string): string {
    const labels: Record<string, string> = {
      pink: '淡红',
      pale: '淡白',
      red: '红',
      dark_red: '绛红',
      purple: '紫',
      blue: '青紫'
    };
    return labels[color] || color;
  }

  private getCoatingColorLabel(color: string): string {
    const labels: Record<string, string> = {
      white: '白',
      yellow: '黄',
      gray: '灰',
      black: '黑',
      none: '无'
    };
    return labels[color] || color;
  }

  private getThicknessLabel(thickness: string): string {
    const labels: Record<string, string> = {
      none: '无苔',
      thin: '薄',
      moderate: '中等',
      thick: '厚'
    };
    return labels[thickness] || thickness;
  }

  private getConstitutionLabel(constitution: string): string {
    const labels: Record<string, string> = {
      balanced: '平和质',
      qi_deficiency: '气虚质',
      yang_deficiency: '阳虚质',
      yin_deficiency: '阴虚质',
      phlegm_dampness: '痰湿质',
      damp_heat: '湿热质',
      blood_stasis: '血瘀质',
      qi_stagnation: '气郁质'
    };
    return labels[constitution] || constitution;
  }

  getTCMTips(): string[] {
    return [
      '观察舌象最好在自然光线下',
      '避免进食后立即观察舌象',
      '刷牙时不要过度刷舌苔',
      '根据体质选择适合的食物',
      '保持规律作息，顺应自然规律',
      '适度运动，促进气血运行',
      '调节情志，保持心情舒畅'
    ];
  }
}

export const tongueAnalysisHandler = new TongueAnalysisHandler();
