/**
 * Physical Examination Report Analysis Scene - 体检报告分析场景
 * 对体检报告进行AI分析，生成解读、风险评估、干预意见和随访计划
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
  PhysicalExamAnalysisResult,
  PhysicalExamReport,
  ExamCategory,
  ExamItem,
  AbnormalItem,
  ReportInterpretation,
  HealthRiskAssessment,
  InterventionPlan,
  FollowupPlan,
  ReferenceSource
} from '@/types/medicalReportScenes';

/**
 * 分析体检报告图像
 */
export async function analyzePhysicalExamReport(
  imageData: string,
  metadata?: Record<string, unknown>
): Promise<AnalysisResult> {
  // 模拟从图像中提取体检报告数据
  const reportData = extractReportFromImage(imageData, metadata);
  
  // 执行完整分析
  const analysisResult = performPhysicalExamAnalysis(reportData);
  
  // 转换为标准分析结果格式
  return convertToAnalysisResult(analysisResult);
}

/**
 * 从图像提取报告数据（模拟）
 */
function extractReportFromImage(
  _imageData: string,
  metadata?: Record<string, unknown>
): PhysicalExamReport {
  // 在实际应用中，这里会使用OCR技术提取报告数据
  // 现在使用模拟数据或元数据
  
  const gender = (metadata?.gender as 'male' | 'female') || 'male';
  const age = (metadata?.age as number) || 35;
  
  // 模拟体检报告数据
  const categories: ExamCategory[] = [
    {
      name: '一般检查',
      items: [
        { name: '身高', value: 175, unit: 'cm', status: 'normal' },
        { name: '体重', value: 78, unit: 'kg', status: 'normal' },
        { name: 'BMI', value: 25.4, unit: 'kg/m²', referenceRange: '18.5-23.9', status: 'borderline' },
        { name: '血压', value: '128/82', unit: 'mmHg', referenceRange: '90-139/60-89', status: 'normal' },
        { name: '脉搏', value: 72, unit: '次/分', referenceRange: '60-100', status: 'normal' }
      ]
    },
    {
      name: '血常规',
      items: [
        { name: '白细胞计数', value: 6.5, unit: '×10⁹/L', referenceRange: '4.0-10.0', status: 'normal' },
        { name: '红细胞计数', value: 4.8, unit: '×10¹²/L', referenceRange: '4.3-5.8', status: 'normal' },
        { name: '血红蛋白', value: 145, unit: 'g/L', referenceRange: '130-175', status: 'normal' },
        { name: '血小板计数', value: 220, unit: '×10⁹/L', referenceRange: '125-350', status: 'normal' }
      ]
    },
    {
      name: '生化检查',
      items: [
        { name: '空腹血糖', value: 5.8, unit: 'mmol/L', referenceRange: '3.9-6.1', status: 'normal' },
        { name: '总胆固醇', value: 5.6, unit: 'mmol/L', referenceRange: '<5.2', status: 'borderline' },
        { name: '甘油三酯', value: 2.1, unit: 'mmol/L', referenceRange: '<1.7', status: 'abnormal' },
        { name: '低密度脂蛋白', value: 3.4, unit: 'mmol/L', referenceRange: '<3.4', status: 'borderline' },
        { name: '高密度脂蛋白', value: 1.1, unit: 'mmol/L', referenceRange: '>1.0', status: 'normal' },
        { name: '谷丙转氨酶', value: 45, unit: 'U/L', referenceRange: '<40', status: 'borderline' },
        { name: '肌酐', value: 88, unit: 'μmol/L', referenceRange: '57-97', status: 'normal' },
        { name: '尿酸', value: 420, unit: 'μmol/L', referenceRange: '208-428', status: 'normal' }
      ]
    },
    {
      name: '尿常规',
      items: [
        { name: '尿蛋白', value: '阴性', status: 'normal' },
        { name: '尿糖', value: '阴性', status: 'normal' },
        { name: '尿潜血', value: '阴性', status: 'normal' },
        { name: '尿比重', value: 1.020, referenceRange: '1.003-1.030', status: 'normal' }
      ]
    }
  ];
  
  // 识别异常项目
  const abnormalItems = identifyAbnormalItems(categories);
  
  return {
    id: `exam_${Date.now()}`,
    reportDate: new Date().toISOString().split('T')[0],
    institution: metadata?.institution as string || '体检中心',
    basicInfo: {
      gender,
      age,
      height: 175,
      weight: 78,
      bmi: 25.4
    },
    categories,
    abnormalItems,
    summary: generateReportSummary(abnormalItems),
    overallRisk: calculateOverallRisk(abnormalItems)
  };
}

/**
 * 识别异常项目
 */
function identifyAbnormalItems(categories: ExamCategory[]): AbnormalItem[] {
  const abnormalItems: AbnormalItem[] = [];
  
  categories.forEach(category => {
    category.items.forEach(item => {
      if (item.status === 'abnormal' || item.status === 'borderline') {
        const abnormalItem = createAbnormalItem(category.name, item);
        if (abnormalItem) {
          abnormalItems.push(abnormalItem);
        }
      }
    });
  });
  
  return abnormalItems;
}

/**
 * 创建异常项目详情
 */
function createAbnormalItem(category: string, item: ExamItem): AbnormalItem | null {
  const abnormalItemMap: Record<string, Partial<AbnormalItem>> = {
    'BMI': {
      severity: 'mild',
      clinicalSignificance: 'BMI略高，提示超重，增加心血管疾病风险',
      possibleCauses: ['热量摄入过多', '运动不足', '代谢减慢'],
      recommendations: ['控制总热量摄入', '增加有氧运动', '定期监测体重']
    },
    '总胆固醇': {
      severity: 'mild',
      clinicalSignificance: '胆固醇轻度升高，增加动脉粥样硬化风险',
      possibleCauses: ['高脂饮食', '缺乏运动', '遗传因素'],
      recommendations: ['减少饱和脂肪摄入', '增加膳食纤维', '规律运动']
    },
    '甘油三酯': {
      severity: 'moderate',
      clinicalSignificance: '甘油三酯升高，增加胰腺炎和心血管疾病风险',
      possibleCauses: ['高糖高脂饮食', '饮酒', '肥胖', '缺乏运动'],
      recommendations: ['严格控制油脂摄入', '戒酒', '减重', '增加运动']
    },
    '低密度脂蛋白': {
      severity: 'mild',
      clinicalSignificance: 'LDL-C处于临界值，是动脉粥样硬化的主要危险因素',
      possibleCauses: ['高脂饮食', '缺乏运动', '遗传因素'],
      recommendations: ['低胆固醇饮食', '增加运动', '必要时药物治疗']
    },
    '谷丙转氨酶': {
      severity: 'mild',
      clinicalSignificance: '转氨酶轻度升高，提示肝细胞可能有轻微损伤',
      possibleCauses: ['脂肪肝', '饮酒', '药物', '病毒感染'],
      recommendations: ['戒酒', '避免肝损药物', '复查肝功能', '肝脏超声检查']
    }
  };
  
  const template = abnormalItemMap[item.name];
  if (!template) return null;
  
  return {
    category,
    itemName: item.name,
    value: item.value,
    unit: item.unit,
    referenceRange: item.referenceRange || '',
    severity: template.severity || 'mild',
    clinicalSignificance: template.clinicalSignificance || '',
    possibleCauses: template.possibleCauses || [],
    recommendations: template.recommendations || []
  };
}

/**
 * 生成报告摘要
 */
function generateReportSummary(abnormalItems: AbnormalItem[]): string {
  if (abnormalItems.length === 0) {
    return '体检结果基本正常，建议继续保持健康的生活方式。';
  }
  
  const severeCount = abnormalItems.filter(i => i.severity === 'severe').length;
  const moderateCount = abnormalItems.filter(i => i.severity === 'moderate').length;
  const mildCount = abnormalItems.filter(i => i.severity === 'mild').length;
  
  let summary = `发现${abnormalItems.length}项异常：`;
  if (severeCount > 0) summary += `${severeCount}项严重，`;
  if (moderateCount > 0) summary += `${moderateCount}项中度，`;
  if (mildCount > 0) summary += `${mildCount}项轻度异常。`;
  
  return summary;
}

/**
 * 计算整体风险
 */
function calculateOverallRisk(abnormalItems: AbnormalItem[]): 'low' | 'medium' | 'high' | 'critical' {
  if (abnormalItems.some(i => i.severity === 'severe')) return 'high';
  if (abnormalItems.some(i => i.severity === 'moderate')) return 'medium';
  if (abnormalItems.filter(i => i.severity === 'mild').length >= 3) return 'medium';
  if (abnormalItems.length > 0) return 'low';
  return 'low';
}

/**
 * 执行体检报告完整分析
 */
function performPhysicalExamAnalysis(report: PhysicalExamReport): PhysicalExamAnalysisResult {
  return {
    report,
    interpretation: generateInterpretation(report),
    riskAssessment: generateRiskAssessment(report),
    interventionPlan: generateInterventionPlan(report),
    followupPlan: generateFollowupPlan(report),
    references: getReferenceSources(),
    disclaimer: '本分析仅供参考，不能替代专业医生的诊断和建议。如有疑问，请咨询专业医生。'
  };
}

/**
 * 生成报告解读
 */
function generateInterpretation(report: PhysicalExamReport): ReportInterpretation {
  const categoryInterpretations: ReportInterpretation['categoryInterpretations'] = [];
  const keyFindings: string[] = [];
  const positiveFindings: string[] = [];
  
  // 一般检查解读
  const generalExam = report.categories.find(c => c.name === '一般检查');
  if (generalExam) {
    const bmiItem = generalExam.items.find(i => i.name === 'BMI');
    const bpItem = generalExam.items.find(i => i.name === '血压');
    
    const details: string[] = [];
    if (bmiItem?.status === 'borderline') {
      details.push('BMI略高，建议控制体重');
      keyFindings.push(`BMI ${bmiItem.value}，处于超重边缘`);
    }
    if (bpItem) {
      const bpValue = bpItem.value as string;
      const systolic = parseInt(bpValue.split('/')[0]);
      if (systolic >= 120) {
        details.push('血压处于正常高值，需关注');
        keyFindings.push(`血压 ${bpValue}，处于正常高值`);
      }
    }
    
    categoryInterpretations.push({
      category: '一般检查',
      status: details.length > 0 ? 'attention' : 'normal',
      summary: details.length > 0 ? '部分指标需关注' : '各项指标正常',
      details
    });
  }
  
  // 血脂解读
  const lipidItems = report.categories
    .find(c => c.name === '生化检查')?.items
    .filter(i => ['总胆固醇', '甘油三酯', '低密度脂蛋白', '高密度脂蛋白'].includes(i.name));
  
  if (lipidItems && lipidItems.some(i => i.status !== 'normal')) {
    const details: string[] = [];
    const abnormalLipids = lipidItems.filter(i => i.status !== 'normal');
    
    abnormalLipids.forEach(item => {
      details.push(`${item.name} ${item.status === 'borderline' ? '处于临界值' : '升高'}`);
      keyFindings.push(`${item.name} ${item.value}${item.unit || ''}`);
    });
    
    details.push('血脂异常增加心血管疾病风险，建议改善生活方式');
    
    categoryInterpretations.push({
      category: '血脂检查',
      status: 'abnormal',
      summary: '血脂多项指标异常',
      details
    });
  }
  
  // 肝功能解读
  const liverItem = report.categories
    .find(c => c.name === '生化检查')?.items
    .find(i => i.name === '谷丙转氨酶');
  
  if (liverItem && liverItem.status !== 'normal') {
    categoryInterpretations.push({
      category: '肝功能',
      status: 'attention',
      summary: '转氨酶轻度升高',
      details: [
        '谷丙转氨酶轻度升高，提示肝细胞可能有轻微损伤',
        '建议进一步检查明确原因',
        '常见原因包括脂肪肝、饮酒、药物等'
      ]
    });
    keyFindings.push(`谷丙转氨酶 ${liverItem.value}${liverItem.unit || ''}`);
  }
  
  // 收集阳性发现
  report.categories.forEach(category => {
    category.items.forEach(item => {
      if (item.status === 'normal') {
        positiveFindings.push(`${category.name} - ${item.name}正常`);
      }
    });
  });
  
  return {
    overallSummary: report.summary,
    categoryInterpretations,
    keyFindings,
    positiveFindings: positiveFindings.slice(0, 5)
  };
}

/**
 * 生成风险评估
 */
function generateRiskAssessment(report: PhysicalExamReport): HealthRiskAssessment {
  const riskFactors: HealthRiskAssessment['riskFactors'] = [];
  const diseaseRisks: HealthRiskAssessment['diseaseRisks'] = [];
  const lifestyleRisks: HealthRiskAssessment['lifestyleRisks'] = [];
  
  // 评估血脂风险
  const hasDyslipidemia = report.abnormalItems.some(i => 
    ['总胆固醇', '甘油三酯', '低密度脂蛋白'].includes(i.itemName)
  );
  
  if (hasDyslipidemia) {
    riskFactors.push({
      name: '血脂异常',
      level: 'moderate',
      description: '血脂多项指标异常，增加动脉粥样硬化风险',
      relatedItems: ['总胆固醇', '甘油三酯', '低密度脂蛋白'],
      evidenceSource: '《中国成人血脂异常防治指南(2016年修订版)》'
    });
    
    diseaseRisks.push({
      disease: '心血管疾病',
      riskLevel: 'medium',
      probability: 0.25,
      contributingFactors: ['血脂异常', '年龄', '性别'],
      preventionAdvice: ['低脂饮食', '规律运动', '控制体重', '定期监测血脂']
    });
    
    diseaseRisks.push({
      disease: '急性胰腺炎',
      riskLevel: 'low',
      probability: 0.05,
      contributingFactors: ['甘油三酯升高'],
      preventionAdvice: ['严格戒酒', '低脂饮食', '控制甘油三酯']
    });
  }
  
  // 评估BMI风险
  const bmiItem = report.categories
    .find(c => c.name === '一般检查')?.items
    .find(i => i.name === 'BMI');
  
  if (bmiItem?.status === 'borderline' || bmiItem?.status === 'abnormal') {
    riskFactors.push({
      name: '超重',
      level: 'moderate',
      description: 'BMI超过正常范围，增加多种慢性病风险',
      relatedItems: ['BMI'],
      evidenceSource: '《中国成人超重和肥胖症预防控制指南》'
    });
    
    lifestyleRisks.push({
      aspect: '体重管理',
      currentStatus: '超重',
      riskLevel: 'medium',
      improvementSuggestions: ['控制总热量摄入', '增加有氧运动', '每周至少150分钟中等强度运动']
    });
  }
  
  // 评估肝功能风险
  const liverItem = report.categories
    .find(c => c.name === '生化检查')?.items
    .find(i => i.name === '谷丙转氨酶');
  
  if (liverItem && liverItem.status !== 'normal') {
    riskFactors.push({
      name: '肝功能异常',
      level: 'low',
      description: '转氨酶轻度升高，提示肝脏可能有轻微损伤',
      relatedItems: ['谷丙转氨酶'],
      evidenceSource: '《慢性乙型肝炎防治指南》'
    });
    
    diseaseRisks.push({
      disease: '非酒精性脂肪肝',
      riskLevel: 'medium',
      probability: 0.3,
      contributingFactors: ['超重', '血脂异常', '转氨酶升高'],
      preventionAdvice: ['减重', '低脂饮食', '戒酒', '定期复查肝功能']
    });
  }
  
  return {
    overallRisk: report.overallRisk,
    riskFactors,
    diseaseRisks,
    lifestyleRisks
  };
}

/**
 * 生成干预计划
 */
function generateInterventionPlan(report: PhysicalExamReport): InterventionPlan {
  const immediateActions: InterventionPlan['immediateActions'] = [];
  const shortTermGoals: InterventionPlan['shortTermGoals'] = [];
  const longTermGoals: InterventionPlan['longTermGoals'] = [];
  const lifestyleModifications: InterventionPlan['lifestyleModifications'] = [];
  const medicalReferrals: InterventionPlan['medicalReferrals'] = [];
  
  // 血脂异常干预
  if (report.abnormalItems.some(i => i.itemName === '甘油三酯')) {
    immediateActions.push({
      title: '严格控制饮食',
      description: '减少油脂和精制糖摄入，避免油炸食品',
      priority: 'high',
      timeframe: '立即开始',
      expectedOutcome: '2-4周后甘油三酯下降',
      evidenceSource: '《中国成人血脂异常防治指南》'
    });
    
    shortTermGoals.push({
      title: '甘油三酯降至正常',
      description: '通过饮食控制和运动，使甘油三酯降至1.7mmol/L以下',
      priority: 'high',
      timeframe: '3个月',
      expectedOutcome: '降低胰腺炎和心血管风险',
      evidenceSource: '《中国成人血脂异常防治指南》'
    });
    
    lifestyleModifications.push({
      category: 'diet',
      currentStatus: '高脂饮食',
      targetStatus: '低脂饮食，每日脂肪<50g',
      specificActions: ['减少食用油', '不吃油炸食品', '选择瘦肉', '增加蔬菜'],
      monitoringIndicators: ['甘油三酯', '总胆固醇']
    });
  }
  
  // 超重干预
  if (report.abnormalItems.some(i => i.itemName === 'BMI')) {
    shortTermGoals.push({
      title: '体重减轻5%',
      description: '通过饮食控制和运动，3个月内减重3-4kg',
      priority: 'medium',
      timeframe: '3个月',
      expectedOutcome: '改善血脂、血压，降低糖尿病风险',
      evidenceSource: '《中国成人超重和肥胖症预防控制指南》'
    });
    
    longTermGoals.push({
      title: 'BMI降至正常范围',
      description: '将BMI控制在18.5-23.9之间',
      priority: 'medium',
      timeframe: '6-12个月',
      expectedOutcome: '显著降低慢性病风险',
      evidenceSource: 'WHO肥胖管理指南'
    });
    
    lifestyleModifications.push({
      category: 'exercise',
      currentStatus: '运动不足',
      targetStatus: '每周至少150分钟中等强度运动',
      specificActions: ['快走30分钟/天', '每周5次', '可选择游泳、骑车'],
      monitoringIndicators: ['体重', 'BMI', '腰围']
    });
  }
  
  // 肝功能异常干预
  if (report.abnormalItems.some(i => i.itemName === '谷丙转氨酶')) {
    immediateActions.push({
      title: '戒酒并避免肝损药物',
      description: '完全戒酒，避免使用对肝脏有损害的药物',
      priority: 'high',
      timeframe: '立即开始',
      expectedOutcome: '保护肝脏，促进转氨酶恢复',
      evidenceSource: '《慢性乙型肝炎防治指南》'
    });
    
    medicalReferrals.push({
      specialty: '消化内科/肝病科',
      reason: '转氨酶升高，需进一步明确原因',
      urgency: 'routine',
      recommendedTests: ['肝脏超声', '肝炎病毒标志物', '肝脏弹性测定']
    });
  }
  
  // 血脂异常转诊
  if (report.abnormalItems.some(i => ['总胆固醇', '低密度脂蛋白'].includes(i.itemName))) {
    medicalReferrals.push({
      specialty: '心内科/内分泌科',
      reason: '血脂异常，评估心血管风险',
      urgency: 'routine',
      recommendedTests: ['颈动脉超声', '心电图', '心血管风险评估']
    });
  }
  
  return {
    immediateActions,
    shortTermGoals,
    longTermGoals,
    lifestyleModifications,
    medicalReferrals
  };
}

/**
 * 生成随访计划
 */
function generateFollowupPlan(report: PhysicalExamReport): FollowupPlan {
  const schedule: FollowupPlan['schedule'] = [];
  const monitoringItems: FollowupPlan['monitoringItems'] = [];
  const alertConditions: FollowupPlan['alertConditions'] = [];
  
  // 1个月随访
  if (report.abnormalItems.some(i => i.itemName === '甘油三酯')) {
    schedule.push({
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'test',
      description: '复查血脂四项',
      purpose: '评估饮食控制效果'
    });
    
    monitoringItems.push({
      indicator: '甘油三酯',
      frequency: '每月1次',
      targetRange: '<1.7 mmol/L',
      currentValue: report.abnormalItems.find(i => i.itemName === '甘油三酯')?.value?.toString()
    });
  }
  
  // 3个月随访
  schedule.push({
    date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'checkup',
    description: '全面复查',
    purpose: '评估干预效果，调整方案'
  });
  
  // 6个月随访
  schedule.push({
    date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'checkup',
    description: '半年体检',
    purpose: '全面评估健康状况变化'
  });
  
  // 监测项目
  if (report.abnormalItems.some(i => i.itemName === 'BMI')) {
    monitoringItems.push({
      indicator: '体重',
      frequency: '每周1次',
      targetRange: '68-72 kg',
      currentValue: '78 kg'
    });
  }
  
  if (report.abnormalItems.some(i => i.itemName === '谷丙转氨酶')) {
    monitoringItems.push({
      indicator: '谷丙转氨酶',
      frequency: '每月1次',
      targetRange: '<40 U/L',
      currentValue: report.abnormalItems.find(i => i.itemName === '谷丙转氨酶')?.value?.toString()
    });
  }
  
  // 预警条件
  alertConditions.push({
    condition: '甘油三酯急剧升高',
    symptoms: ['腹痛', '恶心呕吐'],
    action: '立即就医，排除急性胰腺炎',
    urgency: 'emergency'
  });
  
  alertConditions.push({
    condition: '转氨酶持续升高',
    symptoms: ['乏力', '食欲减退', '黄疸'],
    action: '尽快就医，进一步检查',
    urgency: 'urgent'
  });
  
  return {
    schedule,
    monitoringItems,
    reassessmentDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    alertConditions
  };
}

/**
 * 获取参考来源
 */
function getReferenceSources(): ReferenceSource[] {
  return [
    {
      type: 'guideline',
      title: '中国成人血脂异常防治指南(2016年修订版)',
      source: '中华医学会心血管病学分会',
      year: '2016',
      relevance: '血脂异常评估和干预'
    },
    {
      type: 'guideline',
      title: '中国成人超重和肥胖症预防控制指南',
      source: '中华人民共和国卫生部',
      year: '2006',
      relevance: '体重管理'
    },
    {
      type: 'guideline',
      title: '慢性乙型肝炎防治指南(2019年版)',
      source: '中华医学会肝病学分会',
      year: '2019',
      relevance: '肝功能异常评估'
    },
    {
      type: 'consensus',
      title: '中国健康体检人群颈动脉粥样硬化筛查与管理专家共识',
      source: '中华医学会健康管理学分会',
      year: '2020',
      relevance: '心血管风险评估'
    },
    {
      type: 'guideline',
      title: '中国2型糖尿病防治指南(2020年版)',
      source: '中华医学会糖尿病学分会',
      year: '2020',
      relevance: '糖尿病风险筛查'
    }
  ];
}

/**
 * 转换为标准分析结果格式
 */
function convertToAnalysisResult(analysisResult: PhysicalExamAnalysisResult): AnalysisResult {
  const { report, interpretation, riskAssessment, interventionPlan } = analysisResult;
  
  // 创建特征列表
  const features: DetectedFeature[] = report.abnormalItems.map(item => ({
    type: 'abnormal_item',
    label: item.itemName,
    confidence: item.severity === 'severe' ? 0.95 : item.severity === 'moderate' ? 0.85 : 0.75,
    description: item.clinicalSignificance
  }));
  
  // 添加分类解读作为特征
  interpretation.categoryInterpretations.forEach(cat => {
    features.push({
      type: 'category_interpretation',
      label: cat.category,
      confidence: 0.8,
      description: cat.summary
    });
  });
  
  const imageAnalysis: ImageAnalysis = {
    features,
    measurements: [],
    observations: [
      ...interpretation.keyFindings,
      `整体风险：${report.overallRisk === 'low' ? '低风险' : report.overallRisk === 'medium' ? '中等风险' : '高风险'}`,
      `异常项目：${report.abnormalItems.length}项`,
      ...interpretation.positiveFindings
    ]
  };
  
  // 创建红旗警示
  const redFlags: RedFlag[] = report.abnormalItems
    .filter(item => item.severity === 'severe' || item.severity === 'moderate')
    .map(item => ({
      type: item.itemName,
      description: item.clinicalSignificance,
      urgency: item.severity === 'severe' ? 'urgent' : 'routine',
      actionRequired: item.recommendations[0] || '建议就医咨询'
    }));
  
  const riskAssess: RiskAssessment = {
    level: report.overallRisk,
    factors: riskAssessment.riskFactors.map(rf => ({
      type: rf.name,
      description: rf.description,
      weight: rf.level === 'high' ? 0.8 : rf.level === 'moderate' ? 0.5 : 0.3
    })),
    flags: redFlags
  };
  
  // 创建建议
  const recommendations: Recommendation[] = [
    // 立即行动
    ...interventionPlan.immediateActions.map(action => ({
      id: `immediate_${action.title}`,
      type: 'immediate_action' as const,
      priority: action.priority as 'low' | 'medium' | 'high',
      title: action.title,
      content: action.description,
      targetAudience: 'patient' as const,
      evidenceSource: action.evidenceSource,
      disclaimers: [analysisResult.disclaimer]
    })),
    // 短期目标
    ...interventionPlan.shortTermGoals.map(goal => ({
      id: `short_${goal.title}`,
      type: 'lifestyle' as const,
      priority: goal.priority as 'low' | 'medium' | 'high',
      title: goal.title,
      content: `${goal.description}。预期效果：${goal.expectedOutcome}`,
      targetAudience: 'patient' as const,
      evidenceSource: goal.evidenceSource,
      disclaimers: [analysisResult.disclaimer]
    })),
    // 转诊建议
    ...interventionPlan.medicalReferrals.map(ref => ({
      id: `referral_${ref.specialty}`,
      type: 'referral' as const,
      priority: (ref.urgency === 'emergency' ? 'high' : ref.urgency === 'urgent' ? 'high' : 'medium') as 'low' | 'medium' | 'high',
      title: `建议就诊：${ref.specialty}`,
      content: `${ref.reason}。建议检查：${ref.recommendedTests?.join('、') || '根据医生判断'}`,
      targetAudience: 'patient' as const,
      disclaimers: [analysisResult.disclaimer]
    }))
  ];
  
  return {
    id: `physicalexam_${Date.now()}`,
    sceneId: 'scene_physical_exam',
    timestamp: Date.now(),
    imageAnalysis,
    riskAssessment: riskAssess,
    recommendations,
    requiresManualReview: report.overallRisk === 'high' || report.overallRisk === 'critical',
    confidence: 0.82
  };
}

/**
 * 获取体检报告分析元数据
 */
export function getPhysicalExamAnalysisMetadata(): {
  name: string;
  description: string;
  captureGuidance: string[];
  requiredImages: number;
} {
  return {
    name: '体检报告分析',
    description: '上传体检报告照片，AI智能分析报告内容，生成健康解读、风险评估、干预意见和随访计划',
    captureGuidance: [
      '确保光线充足，避免阴影',
      '将报告平铺拍摄，避免弯曲',
      '确保文字清晰可见',
      '如有多个页面，请逐一拍摄',
      '建议拍摄关键检查项目页面'
    ],
    requiredImages: 1
  };
}
