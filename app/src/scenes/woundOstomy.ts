/**
 * Wound & Ostomy Analysis Scene - 伤口造口专业场景
 * 面向伤口造口师、护士的专业医疗场景
 */

import type { 
  AnalysisSession, 
  AnalysisResult, 
  DetectedFeature,
  RiskAssessment,
  Recommendation,
  RiskLevel,
  RedFlag
} from '@/types/core';
import type { 
  WoundOstomyResult,
  WoundType,
  PressureInjuryStage,
  WoundMeasurement,
  TissueAssessment,
  InfectionSigns,
  HealingStatus,
  WoundRecommendation,
  WoundFollowupPlan,
  WoundOstomyMultiVersionOutput
} from '@/types/scenes';
import type { SceneHandler } from '@/services/sceneManager';
import { knowledgeBaseService } from '@/services/knowledgeBase';

/**
 * 伤口造口场景处理器
 */
export class WoundOstomyHandler implements SceneHandler {
  sceneId = 'scene_wound_ostomy';

  /**
   * 验证输入
   */
  validateInput(session: AnalysisSession): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (session.images.length === 0) {
      errors.push('请至少上传一张伤口/造口照片');
    }

    // 检查是否有通过质量评估的图片
    const hasValidImage = session.images.some(img => 
      img.qaResult && img.qaResult.passed
    );
    if (!hasValidImage) {
      errors.push('照片质量不合格，请重新拍摄');
    }

    // 专业场景需要患者信息
    // 实际项目中应从会话或表单获取
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 获取必填字段
   */
  getRequiredFields(): string[] {
    return [
      'image',
      'patientId',
      'age',
      'woundType',
      'woundLocation'
    ];
  }

  /**
   * 执行分析
   */
  async analyze(session: AnalysisSession): Promise<AnalysisResult> {
    console.log('[WoundOstomy] 开始专业分析...');

    // 模拟专业分析（实际项目中应调用医学图像分析 API）
    const woundResult = await this.performProfessionalAnalysis(session.images[0].url);

    // 转换为标准分析结果格式
    const analysisResult: AnalysisResult = {
      id: `analysis_${Date.now()}`,
      sceneId: this.sceneId,
      timestamp: Date.now(),
      imageAnalysis: {
        features: this.convertToFeatures(woundResult),
        measurements: woundResult.measurements,
        observations: this.generateObservations(woundResult)
      },
      riskAssessment: this.assessRisk(woundResult),
      recommendations: this.convertToRecommendations(woundResult.recommendations),
      requiresManualReview: true, // 专业场景默认需要人工确认
      confidence: woundResult.confidence
    };

    console.log('[WoundOstomy] 专业分析完成');
    return analysisResult;
  }

  /**
   * 执行专业分析（模拟医学 AI 识别）
   */
  private async performProfessionalAnalysis(_imageUrl: string): Promise<WoundOstomyResult & { confidence: number }> {
    // 模拟分析延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟识别结果（实际项目中应调用专业医学图像识别模型）
    const woundTypes: WoundType[] = ['pressure_injury', 'diabetic_ulcer', 'venous_ulcer', 'surgical_wound'];
    const randomType = woundTypes[Math.floor(Math.random() * woundTypes.length)];
    
    const stages: PressureInjuryStage[] = ['stage_1', 'stage_2', 'stage_3', 'stage_4'];
    const randomStage = stages[Math.floor(Math.random() * stages.length)];

    // 模拟测量数据
    const measurements: WoundMeasurement[] = [
      { type: 'length', value: 3.5, unit: 'cm', method: 'auto' },
      { type: 'width', value: 2.8, unit: 'cm', method: 'auto' },
      { type: 'depth', value: 0.5, unit: 'cm', method: 'estimated' },
      { type: 'area', value: 9.8, unit: 'cm2', method: 'auto' }
    ];

    // 模拟组织评估
    const tissueAssessment: TissueAssessment = {
      granulation: { percentage: 60, description: '肉芽组织占60%，颜色鲜红，颗粒均匀' },
      slough: { percentage: 30, description: '黄色腐肉占30%' },
      eschar: { percentage: 10, description: '黑色焦痂占10%' },
      epithelialization: { percentage: 0, description: '未见上皮化' }
    };

    // 模拟感染征象
    const infectionSigns: InfectionSigns = {
      present: Math.random() > 0.7,
      localSigns: ['erythema', 'warmth'],
      systemicSigns: [],
      spreadingInfection: false
    };

    // 模拟愈合状态
    const healingStatus: HealingStatus = {
      status: 'healing',
      trend: 'improving',
      estimatedHealingTime: '预计2-3周愈合',
      barriers: ['营养不良', '活动受限']
    };

    // 生成风险因素
    const riskFactors = [
      { type: 'malnutrition', description: '营养状况不佳', impact: 'high' as const, modifiable: true },
      { type: 'immobility', description: '活动受限', impact: 'medium' as const, modifiable: true },
      { type: 'diabetes', description: '糖尿病', impact: 'high' as const, modifiable: false }
    ];

    // 生成护理建议
    const recommendations: WoundRecommendation[] = [
      {
        id: `rec_${Date.now()}_1`,
        type: 'cleansing',
        priority: 'high',
        title: '伤口清洗',
        content: '使用生理盐水或温开水轻柔清洗伤口，避免损伤新生组织',
        frequency: '每次换药时',
        targetAudience: 'nurse',
        evidenceSource: 'Wound Care SOP v2.0',
        requiresConfirmation: false
      },
      {
        id: `rec_${Date.now()}_2`,
        type: 'dressing',
        priority: 'high',
        title: '敷料选择',
        content: '建议使用泡沫敷料或水胶体敷料，保持适度湿润环境',
        frequency: '每2-3天更换',
        targetAudience: 'nurse',
        evidenceSource: 'Pressure Injury Guidelines 2023',
        requiresConfirmation: true
      },
      {
        id: `rec_${Date.now()}_3`,
        type: 'nutrition',
        priority: 'medium',
        title: '营养支持',
        content: '增加蛋白质摄入，补充维生素C和锌，促进伤口愈合',
        targetAudience: 'patient',
        evidenceSource: 'Nutritional Guidelines for Wound Healing',
        requiresConfirmation: false
      },
      {
        id: `rec_${Date.now()}_4`,
        type: 'positioning',
        priority: 'high',
        title: '体位管理',
        content: '每2小时翻身一次，使用减压垫，避免伤口受压',
        frequency: '每2小时',
        targetAudience: 'nurse',
        evidenceSource: 'Pressure Injury Prevention Protocol',
        requiresConfirmation: false
      }
    ];

    // 生成随访计划
    const followupPlan: WoundFollowupPlan = {
      reassessmentInterval: '每3天评估一次',
      photoRecaptureSchedule: ['3天后', '1周后', '2周后'],
      expectedOutcomes: ['伤口面积减少50%', '肉芽组织覆盖>80%', '无感染征象'],
      escalationTriggers: [
        { condition: '伤口面积增加>20%', action: '上报伤口造口师会诊', urgency: 'urgent' },
        { condition: '出现感染征象', action: '采集分泌物培养，考虑抗生素治疗', urgency: 'urgent' },
        { condition: '3周无愈合进展', action: '重新评估治疗方案', urgency: 'routine' }
      ]
    };

    return {
      assessment: {
        woundType: randomType,
        stage: randomStage,
        description: this.getWoundDescription(randomType, randomStage)
      },
      measurements,
      tissueAssessment,
      infectionSigns,
      healingStatus,
      riskFactors,
      recommendations,
      followupPlan,
      requiresManualReview: true,
      confidence: 0.88
    };
  }

  /**
   * 获取伤口描述
   */
  private getWoundDescription(type: WoundType, stage?: PressureInjuryStage): string {
    const typeNames: Record<WoundType, string> = {
      pressure_injury: '压疮',
      diabetic_ulcer: '糖尿病足溃疡',
      venous_ulcer: '静脉性溃疡',
      arterial_ulcer: '动脉性溃疡',
      surgical_wound: '手术切口',
      traumatic_wound: '创伤性伤口',
      burn: '烧伤',
      ostomy: '造口',
      fistula: '瘘管',
      other: '其他伤口'
    };

    const stageNames: Record<PressureInjuryStage, string> = {
      stage_1: 'I期（皮肤完整，局部红斑）',
      stage_2: 'II期（部分皮层缺损）',
      stage_3: 'III期（全层皮肤缺损）',
      stage_4: 'IV期（全层组织缺损）',
      unstageable: '不可分期',
      suspected_deep_tissue: '深部组织损伤'
    };

    if (type === 'pressure_injury' && stage) {
      return `${typeNames[type]}，${stageNames[stage]}`;
    }
    return typeNames[type];
  }

  /**
   * 生成观察记录
   */
  private generateObservations(result: WoundOstomyResult): string[] {
    const observations: string[] = [];

    observations.push(`伤口类型：${result.assessment.description}`);
    observations.push(`伤口大小：${result.measurements.find(m => m.type === 'length')?.value}cm × ${result.measurements.find(m => m.type === 'width')?.value}cm`);
    observations.push(`组织构成：肉芽${result.tissueAssessment.granulation.percentage}%、腐肉${result.tissueAssessment.slough.percentage}%、焦痂${result.tissueAssessment.eschar.percentage}%`);
    observations.push(`愈合状态：${result.healingStatus.status}，${result.healingStatus.trend}`);
    
    if (result.infectionSigns.present) {
      observations.push('注意：存在局部感染征象');
    }

    return observations;
  }

  /**
   * 风险评估
   */
  private assessRisk(result: WoundOstomyResult): RiskAssessment {
    let level: RiskLevel = 'low';
    const flags: RedFlag[] = [];

    // 根据伤口分期判断风险
    if (result.assessment.stage === 'stage_3' || result.assessment.stage === 'stage_4') {
      level = 'high';
      flags.push({
        type: 'deep_tissue_damage',
        description: '深部组织损伤',
        urgency: 'urgent',
        actionRequired: '需要伤口造口师会诊，评估是否需要外科干预'
      });
    } else if (result.assessment.stage === 'stage_2') {
      level = 'medium';
    }

    // 感染风险
    if (result.infectionSigns.present) {
      level = 'high';
      flags.push({
        type: 'infection_risk',
        description: '存在感染征象',
        urgency: 'urgent',
        actionRequired: '密切监测感染指标，必要时采集培养'
      });
    }

    // 高风险因素
    const highRiskFactors = result.riskFactors.filter(r => r.impact === 'high');
    if (highRiskFactors.length >= 2) {
      level = 'high';
    }

    return {
      level,
      factors: result.riskFactors.map(r => ({
        type: r.type,
        description: r.description,
        weight: r.impact === 'high' ? 0.8 : r.impact === 'medium' ? 0.5 : 0.3
      })),
      flags
    };
  }

  /**
   * 转换特征为标准格式
   */
  private convertToFeatures(result: WoundOstomyResult): DetectedFeature[] {
    const features: DetectedFeature[] = [];

    // 伤口类型
    features.push({
      type: 'wound_type',
      label: result.assessment.woundType,
      confidence: 0.9,
      description: result.assessment.description
    });

    // 组织类型
    if (result.tissueAssessment.granulation.percentage > 0) {
      features.push({
        type: 'tissue',
        label: 'granulation',
        confidence: 0.85,
        description: result.tissueAssessment.granulation.description
      });
    }

    if (result.tissueAssessment.slough.percentage > 0) {
      features.push({
        type: 'tissue',
        label: 'slough',
        confidence: 0.8,
        description: result.tissueAssessment.slough.description
      });
    }

    if (result.tissueAssessment.eschar.percentage > 0) {
      features.push({
        type: 'tissue',
        label: 'eschar',
        confidence: 0.82,
        description: result.tissueAssessment.eschar.description
      });
    }

    // 感染征象
    if (result.infectionSigns.present) {
      features.push({
        type: 'infection',
        label: 'local_infection',
        confidence: 0.75,
        description: `局部感染征象：${result.infectionSigns.localSigns.join('、')}`
      });
    }

    return features;
  }

  /**
   * 转换建议为标准格式
   */
  private convertToRecommendations(woundRecs: WoundRecommendation[]): Recommendation[] {
    return woundRecs.map(r => ({
      id: r.id,
      type: r.type === 'referral' ? 'referral' :
            r.type === 'medication' ? 'immediate_action' :
            r.type === 'nutrition' ? 'lifestyle' :
            r.type === 'positioning' ? 'lifestyle' :
            r.type === 'education' ? 'education' : 'followup',
      priority: r.priority,
      title: r.title,
      content: r.content + (r.frequency ? `（${r.frequency}）` : ''),
      targetAudience: r.targetAudience,
      evidenceSource: r.evidenceSource,
      disclaimers: r.requiresConfirmation ? ['本建议需经伤口造口师确认后执行'] : undefined
    }));
  }

  /**
   * 生成多版本输出
   */
  generateMultiVersionOutput(result: WoundOstomyResult): WoundOstomyMultiVersionOutput {
    return {
      medicalVersion: {
        assessment: result.assessment.description,
        clinicalNotes: [
          `伤口测量：${result.measurements.map(m => `${m.type}: ${m.value}${m.unit}`).join('，')}`,
          `组织评估：${result.tissueAssessment.granulation.description}`,
          `感染评估：${result.infectionSigns.present ? '存在感染征象' : '无感染征象'}`,
          `愈合趋势：${result.healingStatus.trend}`
        ],
        upgradeTriggers: result.followupPlan.escalationTriggers.map(e => e.condition)
      },
      nursingVersion: {
        carePlan: result.recommendations.map(r => r.content),
        dressingChange: result.recommendations.find(r => r.type === 'dressing')?.content || '按常规换药',
        keyPoints: [
          '观察伤口渗出液颜色、量、气味',
          '评估周围皮肤状况',
          '记录伤口愈合进展',
          '评估患者疼痛程度'
        ]
      },
      patientVersion: {
        explanation: `您的${result.assessment.description}正在${result.healingStatus.trend === 'improving' ? '好转' : '恢复中'}。`,
        selfCareInstructions: [
          '保持伤口清洁干燥',
          '按医嘱定期换药',
          '注意营养，多吃蛋白质丰富的食物',
          '避免伤口受压'
        ],
        warningSigns: [
          '伤口红肿加重',
          '渗出液增多或有异味',
          '发热',
          '疼痛加剧'
        ]
      }
    };
  }

  /**
   * 计算 PUSH 评分
   */
  calculatePUSH(
    length: number,
    width: number,
    exudateAmount: 0 | 1 | 2 | 3,
    tissueType: 0 | 1 | 2 | 3 | 4
  ): { score: number; interpretation: string } {
    // 计算面积评分
    const area = length * width;
    let areaScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    if (area === 0) areaScore = 0;
    else if (area < 0.3) areaScore = 1;
    else if (area < 0.6) areaScore = 2;
    else if (area < 0.9) areaScore = 3;
    else if (area < 1.2) areaScore = 4;
    else if (area < 2.4) areaScore = 5;
    else if (area < 3.6) areaScore = 6;
    else if (area < 4.8) areaScore = 7;
    else if (area < 6.0) areaScore = 8;
    else if (area < 12.0) areaScore = 9;
    else areaScore = 10;

    return knowledgeBaseService.calculatePUSH(areaScore, exudateAmount, tissueType);
  }

  /**
   * 获取伤口护理检查清单
   */
  getCareChecklist(): { category: string; items: string[] }[] {
    return [
      {
        category: '评估',
        items: [
          '评估伤口位置、大小、深度',
          '评估组织类型（肉芽、腐肉、焦痂）',
          '评估渗出液颜色、量、气味',
          '评估周围皮肤状况',
          '评估疼痛程度'
        ]
      },
      {
        category: '清洗',
        items: [
          '使用生理盐水或温开水',
          '从伤口中心向外清洗',
          '避免损伤新生组织',
          '轻柔去除松动的坏死组织'
        ]
      },
      {
        category: '敷料',
        items: [
          '根据伤口情况选择合适敷料',
          '确保敷料覆盖伤口及周围2cm',
          '保持适度湿润环境',
          '固定稳妥，避免移位'
        ]
      },
      {
        category: '记录',
        items: [
          '记录伤口测量数据',
          '拍照存档',
          '记录使用的敷料和药品',
          '记录患者反应和主诉'
        ]
      }
    ];
  }
}

// 导出单例
export const woundOstomyHandler = new WoundOstomyHandler();
