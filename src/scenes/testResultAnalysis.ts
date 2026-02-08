/**
 * Test Result Analysis Scene - 检测结果分析场景
 * 对各类医学检测结果进行AI分析
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
  TestResultAnalysis,
  TestType,
  TestItemResult,
  ReferenceSource
} from '@/types/medicalReportScenes';

/**
 * 分析检测结果图像
 */
export async function analyzeTestResult(
  imageData: string,
  metadata?: Record<string, unknown>
): Promise<AnalysisResult> {
  const testType = (metadata?.testType as TestType) || 'blood_routine';
  
  // 模拟从图像中提取检测数据
  const testData = extractTestFromImage(imageData, testType, metadata);
  
  // 执行分析
  const analysisResult = performTestAnalysis(testData);
  
  // 转换为标准分析结果格式
  return convertToAnalysisResult(analysisResult);
}

/**
 * 从图像提取检测数据（模拟）
 */
function extractTestFromImage(
  _imageData: string,
  testType: TestType,
  metadata?: Record<string, unknown>
): TestResultAnalysis {
  // 根据检测类型生成相应的模拟数据
  const resultGenerators: Record<TestType, () => TestItemResult[]> = {
    blood_routine: generateBloodRoutineResults,
    biochemistry: generateBiochemistryResults,
    urine_routine: generateUrineRoutineResults,
    lipid_profile: generateLipidProfileResults,
    liver_function: generateLiverFunctionResults,
    kidney_function: generateKidneyFunctionResults,
    blood_sugar: generateBloodSugarResults,
    thyroid: generateThyroidResults,
    tumor_marker: generateTumorMarkerResults,
    coagulation: generateCoagulationResults,
    infection: generateInfectionResults,
    other: generateOtherResults
  };
  
  const results = resultGenerators[testType]();
  
  // 分析结果
  const abnormalResults = results.filter(r => r.status !== 'normal');
  
  return {
    testType,
    testDate: new Date().toISOString().split('T')[0],
    institution: metadata?.institution as string || '检测机构',
    results,
    summary: generateTestSummary(abnormalResults),
    interpretation: generateTestInterpretation(results, testType),
    recommendations: generateTestRecommendations(abnormalResults, testType),
    followupNeeded: abnormalResults.length > 0,
    references: getTestReferenceSources(testType)
  };
}

// 各类检测的模拟数据生成函数
function generateBloodRoutineResults(): TestItemResult[] {
  return [
    { name: '白细胞计数', abbreviation: 'WBC', value: 6.8, unit: '×10⁹/L', referenceRange: '4.0-10.0', status: 'normal', clinicalSignificance: '反映机体免疫状态' },
    { name: '红细胞计数', abbreviation: 'RBC', value: 4.6, unit: '×10¹²/L', referenceRange: '4.3-5.8', status: 'normal', clinicalSignificance: '反映造血功能' },
    { name: '血红蛋白', abbreviation: 'Hb', value: 142, unit: 'g/L', referenceRange: '130-175', status: 'normal', clinicalSignificance: '反映贫血情况' },
    { name: '血小板计数', abbreviation: 'PLT', value: 245, unit: '×10⁹/L', referenceRange: '125-350', status: 'normal', clinicalSignificance: '反映凝血功能' },
    { name: '中性粒细胞百分比', abbreviation: 'NE%', value: 62, unit: '%', referenceRange: '50-70', status: 'normal', clinicalSignificance: '反映细菌感染情况' },
    { name: '淋巴细胞百分比', abbreviation: 'LY%', value: 32, unit: '%', referenceRange: '20-40', status: 'normal', clinicalSignificance: '反映病毒感染情况' }
  ];
}

function generateBiochemistryResults(): TestItemResult[] {
  return [
    { name: '空腹血糖', abbreviation: 'GLU', value: 5.6, unit: 'mmol/L', referenceRange: '3.9-6.1', status: 'normal', clinicalSignificance: '反映糖代谢状态' },
    { name: '总胆固醇', abbreviation: 'TC', value: 5.8, unit: 'mmol/L', referenceRange: '<5.2', status: 'high', clinicalSignificance: '升高增加心血管疾病风险', possibleCauses: ['高脂饮食', '缺乏运动'], relatedDiseases: ['动脉粥样硬化', '冠心病'] },
    { name: '甘油三酯', abbreviation: 'TG', value: 2.3, unit: 'mmol/L', referenceRange: '<1.7', status: 'high', clinicalSignificance: '升高增加胰腺炎风险', possibleCauses: ['高脂饮食', '饮酒', '肥胖'], relatedDiseases: ['急性胰腺炎', '心血管疾病'] },
    { name: '高密度脂蛋白', abbreviation: 'HDL-C', value: 1.0, unit: 'mmol/L', referenceRange: '>1.0', status: 'normal', clinicalSignificance: '降低增加心血管疾病风险' },
    { name: '低密度脂蛋白', abbreviation: 'LDL-C', value: 3.6, unit: 'mmol/L', referenceRange: '<3.4', status: 'high', clinicalSignificance: '主要致动脉粥样硬化因子', possibleCauses: ['高脂饮食', '遗传因素'], relatedDiseases: ['冠心病', '脑卒中'] }
  ];
}

function generateUrineRoutineResults(): TestItemResult[] {
  return [
    { name: '尿蛋白', abbreviation: 'PRO', value: '阴性', unit: '', referenceRange: '阴性', status: 'normal', clinicalSignificance: '阳性提示肾脏疾病' },
    { name: '尿糖', abbreviation: 'GLU', value: '阴性', unit: '', referenceRange: '阴性', status: 'normal', clinicalSignificance: '阳性提示糖尿病可能' },
    { name: '尿潜血', abbreviation: 'BLD', value: '阴性', unit: '', referenceRange: '阴性', status: 'normal', clinicalSignificance: '阳性提示泌尿系统疾病' },
    { name: '尿比重', abbreviation: 'SG', value: 1.020, unit: '', referenceRange: '1.003-1.030', status: 'normal', clinicalSignificance: '反映肾脏浓缩功能' },
    { name: '尿pH', abbreviation: 'pH', value: 6.0, unit: '', referenceRange: '5.0-8.0', status: 'normal', clinicalSignificance: '反映体内酸碱平衡' }
  ];
}

function generateLipidProfileResults(): TestItemResult[] {
  return generateBiochemistryResults().filter(r => 
    ['总胆固醇', '甘油三酯', '高密度脂蛋白', '低密度脂蛋白'].includes(r.name)
  );
}

function generateLiverFunctionResults(): TestItemResult[] {
  return [
    { name: '谷丙转氨酶', abbreviation: 'ALT', value: 52, unit: 'U/L', referenceRange: '<40', status: 'high', clinicalSignificance: '肝细胞损伤指标', possibleCauses: ['脂肪肝', '饮酒', '药物'], relatedDiseases: ['肝炎', '脂肪肝'] },
    { name: '谷草转氨酶', abbreviation: 'AST', value: 38, unit: 'U/L', referenceRange: '<40', status: 'normal', clinicalSignificance: '肝细胞损伤指标' },
    { name: '总胆红素', abbreviation: 'TBIL', value: 18, unit: 'μmol/L', referenceRange: '<21', status: 'normal', clinicalSignificance: '反映肝脏代谢功能' },
    { name: '直接胆红素', abbreviation: 'DBIL', value: 6, unit: 'μmol/L', referenceRange: '<6.8', status: 'normal', clinicalSignificance: '反映胆汁排泄功能' },
    { name: '白蛋白', abbreviation: 'ALB', value: 42, unit: 'g/L', referenceRange: '35-55', status: 'normal', clinicalSignificance: '反映肝脏合成功能' }
  ];
}

function generateKidneyFunctionResults(): TestItemResult[] {
  return [
    { name: '肌酐', abbreviation: 'Cr', value: 85, unit: 'μmol/L', referenceRange: '57-97', status: 'normal', clinicalSignificance: '反映肾小球滤过功能' },
    { name: '尿素氮', abbreviation: 'BUN', value: 5.2, unit: 'mmol/L', referenceRange: '2.6-7.5', status: 'normal', clinicalSignificance: '反映肾脏排泄功能' },
    { name: '尿酸', abbreviation: 'UA', value: 380, unit: 'μmol/L', referenceRange: '208-428', status: 'normal', clinicalSignificance: '升高增加痛风风险' },
    { name: '估算肾小球滤过率', abbreviation: 'eGFR', value: 95, unit: 'mL/min/1.73m²', referenceRange: '>90', status: 'normal', clinicalSignificance: '评估肾功能分期' }
  ];
}

function generateBloodSugarResults(): TestItemResult[] {
  return [
    { name: '空腹血糖', abbreviation: 'FPG', value: 6.2, unit: 'mmol/L', referenceRange: '3.9-6.1', status: 'high', clinicalSignificance: '升高提示糖代谢异常', possibleCauses: ['胰岛素抵抗', '饮食不当'], relatedDiseases: ['糖尿病', '糖尿病前期'] },
    { name: '餐后2小时血糖', abbreviation: '2hPG', value: 8.5, unit: 'mmol/L', referenceRange: '<7.8', status: 'high', clinicalSignificance: '反映餐后血糖控制情况' },
    { name: '糖化血红蛋白', abbreviation: 'HbA1c', value: 5.8, unit: '%', referenceRange: '<6.0', status: 'normal', clinicalSignificance: '反映近3个月平均血糖水平' }
  ];
}

function generateThyroidResults(): TestItemResult[] {
  return [
    { name: '促甲状腺激素', abbreviation: 'TSH', value: 3.2, unit: 'mIU/L', referenceRange: '0.27-4.2', status: 'normal', clinicalSignificance: '反映甲状腺功能' },
    { name: '游离甲状腺素', abbreviation: 'FT4', value: 18, unit: 'pmol/L', referenceRange: '12-22', status: 'normal', clinicalSignificance: '反映甲状腺激素水平' },
    { name: '游离三碘甲状腺原氨酸', abbreviation: 'FT3', value: 4.8, unit: 'pmol/L', referenceRange: '3.1-6.8', status: 'normal', clinicalSignificance: '反映甲状腺激素水平' }
  ];
}

function generateTumorMarkerResults(): TestItemResult[] {
  return [
    { name: '甲胎蛋白', abbreviation: 'AFP', value: 8, unit: 'ng/mL', referenceRange: '<20', status: 'normal', clinicalSignificance: '肝癌筛查指标' },
    { name: '癌胚抗原', abbreviation: 'CEA', value: 2.5, unit: 'ng/mL', referenceRange: '<5', status: 'normal', clinicalSignificance: '消化道肿瘤标志物' },
    { name: '糖类抗原19-9', abbreviation: 'CA19-9', value: 15, unit: 'U/mL', referenceRange: '<37', status: 'normal', clinicalSignificance: '胰腺癌标志物' },
    { name: '前列腺特异性抗原', abbreviation: 'PSA', value: 1.2, unit: 'ng/mL', referenceRange: '<4', status: 'normal', clinicalSignificance: '前列腺癌标志物' }
  ];
}

function generateCoagulationResults(): TestItemResult[] {
  return [
    { name: '凝血酶原时间', abbreviation: 'PT', value: 12.5, unit: 's', referenceRange: '11-14', status: 'normal', clinicalSignificance: '反映外源性凝血功能' },
    { name: '国际标准化比值', abbreviation: 'INR', value: 1.0, unit: '', referenceRange: '0.85-1.15', status: 'normal', clinicalSignificance: '标准化凝血指标' },
    { name: '活化部分凝血活酶时间', abbreviation: 'APTT', value: 32, unit: 's', referenceRange: '28-40', status: 'normal', clinicalSignificance: '反映内源性凝血功能' },
    { name: '纤维蛋白原', abbreviation: 'FIB', value: 3.2, unit: 'g/L', referenceRange: '2-4', status: 'normal', clinicalSignificance: '反映凝血因子水平' }
  ];
}

function generateInfectionResults(): TestItemResult[] {
  return [
    { name: '乙型肝炎表面抗原', abbreviation: 'HBsAg', value: '阴性', unit: '', referenceRange: '阴性', status: 'normal', clinicalSignificance: '乙肝病毒感染标志' },
    { name: '乙型肝炎表面抗体', abbreviation: 'HBsAb', value: '阳性', unit: '', referenceRange: '阳性/阴性', status: 'normal', clinicalSignificance: '乙肝保护性抗体' },
    { name: '丙型肝炎抗体', abbreviation: 'HCV-Ab', value: '阴性', unit: '', referenceRange: '阴性', status: 'normal', clinicalSignificance: '丙肝病毒感染标志' },
    { name: '梅毒螺旋体抗体', abbreviation: 'TP-Ab', value: '阴性', unit: '', referenceRange: '阴性', status: 'normal', clinicalSignificance: '梅毒感染标志' },
    { name: '人类免疫缺陷病毒抗体', abbreviation: 'HIV-Ab', value: '阴性', unit: '', referenceRange: '阴性', status: 'normal', clinicalSignificance: 'HIV感染标志' }
  ];
}

function generateOtherResults(): TestItemResult[] {
  return [
    { name: '检测项目1', value: '正常', unit: '', referenceRange: '正常', status: 'normal', clinicalSignificance: '常规检测指标' }
  ];
}

/**
 * 生成检测摘要
 */
function generateTestSummary(abnormalResults: TestItemResult[]): string {
  if (abnormalResults.length === 0) {
    return '所有检测指标均在正常范围内。';
  }
  
  const highCount = abnormalResults.filter(r => r.status === 'high' || r.status === 'critical_high').length;
  const lowCount = abnormalResults.filter(r => r.status === 'low' || r.status === 'critical_low').length;
  
  return `发现${abnormalResults.length}项异常：${highCount}项偏高，${lowCount}项偏低。`;
}

/**
 * 生成检测解读
 */
function generateTestInterpretation(results: TestItemResult[], testType: TestType): string {
  const abnormalResults = results.filter(r => r.status !== 'normal');
  
  if (abnormalResults.length === 0) {
    return getNormalInterpretation(testType);
  }
  
  const interpretations: string[] = [];
  
  abnormalResults.forEach(result => {
    interpretations.push(`${result.name}${result.status === 'high' ? '升高' : '降低'}：${result.clinicalSignificance}`);
  });
  
  return interpretations.join('；');
}

/**
 * 获取正常结果解读
 */
function getNormalInterpretation(testType: TestType): string {
  const interpretations: Record<TestType, string> = {
    blood_routine: '血常规各项指标正常，提示造血功能和免疫状态良好。',
    biochemistry: '生化指标基本正常，肝肾功能、血糖、血脂均在正常范围。',
    urine_routine: '尿常规正常，提示泌尿系统功能良好，无明显感染或肾脏疾病。',
    lipid_profile: '血脂各项指标正常，心血管疾病风险较低。',
    liver_function: '肝功能指标正常，提示肝脏代谢和合成功能良好。',
    kidney_function: '肾功能指标正常，提示肾脏滤过和排泄功能良好。',
    blood_sugar: '血糖指标正常，提示糖代谢功能良好。',
    thyroid: '甲状腺功能指标正常，提示甲状腺激素水平平衡。',
    tumor_marker: '肿瘤标志物均在正常范围，建议定期复查。',
    coagulation: '凝血功能指标正常，提示凝血系统功能良好。',
    infection: '感染指标阴性，未检测到相关病原体感染。',
    other: '检测指标正常。'
  };
  
  return interpretations[testType];
}

/**
 * 生成检测建议
 */
function generateTestRecommendations(abnormalResults: TestItemResult[], testType: TestType): string[] {
  const recommendations: string[] = [];
  
  if (abnormalResults.length === 0) {
    recommendations.push('各项指标正常，建议保持健康的生活方式。');
    recommendations.push(`建议${getFollowupInterval(testType)}后复查。`);
    return recommendations;
  }
  
  // 根据异常项目生成建议
  abnormalResults.forEach(result => {
    if (result.relatedDiseases && result.relatedDiseases.length > 0) {
      recommendations.push(`${result.name}异常可能增加${result.relatedDiseases.join('、')}风险，建议进一步检查。`);
    }
  });
  
  // 根据检测类型给出通用建议
  const typeRecommendations: Record<TestType, string[]> = {
    blood_routine: ['如有感染症状，建议结合临床表现综合判断。'],
    biochemistry: ['建议调整饮食结构，必要时药物治疗。', '定期复查，监测指标变化。'],
    urine_routine: ['如有泌尿系统症状，建议进一步检查。'],
    lipid_profile: ['低脂饮食，增加运动，必要时服用降脂药物。'],
    liver_function: ['戒酒，避免肝损药物，建议肝脏超声检查。'],
    kidney_function: ['控制血压血糖，避免肾毒性药物。'],
    blood_sugar: ['控制饮食，增加运动，必要时药物治疗。'],
    thyroid: ['如有症状，建议内分泌科就诊。'],
    tumor_marker: ['单项轻度升高临床意义有限，建议动态观察。'],
    coagulation: ['如有出血或血栓症状，建议血液科就诊。'],
    infection: ['如有流行病学史或症状，建议进一步检查。'],
    other: ['建议咨询医生解读报告。']
  };
  
  recommendations.push(...typeRecommendations[testType]);
  
  return recommendations;
}

/**
 * 获取复查间隔
 */
function getFollowupInterval(testType: TestType): string {
  const intervals: Record<TestType, string> = {
    blood_routine: '1年',
    biochemistry: '6-12个月',
    urine_routine: '1年',
    lipid_profile: '3-6个月',
    liver_function: '3-6个月',
    kidney_function: '6-12个月',
    blood_sugar: '3-6个月',
    thyroid: '6-12个月',
    tumor_marker: '6-12个月',
    coagulation: '根据医嘱',
    infection: '根据情况',
    other: '根据医嘱'
  };
  
  return intervals[testType];
}

/**
 * 执行检测分析
 */
function performTestAnalysis(testData: TestResultAnalysis): TestResultAnalysis {
  // 这里可以添加更复杂的分析逻辑
  return testData;
}

/**
 * 获取参考来源
 */
function getTestReferenceSources(testType: TestType): ReferenceSource[] {
  const commonSources: ReferenceSource[] = [
    {
      type: 'guideline',
      title: '全国临床检验操作规程(第4版)',
      source: '国家卫生健康委员会',
      year: '2015',
      relevance: '检验项目参考范围'
    }
  ];
  
  const specificSources: Record<TestType, ReferenceSource[]> = {
    blood_routine: [{
      type: 'guideline',
      title: '血细胞分析参考区间(WS/T 405-2012)',
      source: '国家卫生健康委员会',
      year: '2012',
      relevance: '血常规参考范围'
    }],
    biochemistry: [{
      type: 'guideline',
      title: '中国成人血脂异常防治指南(2016年修订版)',
      source: '中华医学会心血管病学分会',
      year: '2016',
      relevance: '血脂异常诊断标准'
    }],
    urine_routine: [{
      type: 'guideline',
      title: '尿液物理学、化学及沉渣分析(WS/T 229-2002)',
      source: '国家卫生健康委员会',
      year: '2002',
      relevance: '尿常规检测标准'
    }],
    lipid_profile: [{
      type: 'guideline',
      title: '中国成人血脂异常防治指南(2016年修订版)',
      source: '中华医学会心血管病学分会',
      year: '2016',
      relevance: '血脂异常诊断标准'
    }],
    liver_function: [{
      type: 'guideline',
      title: '慢性乙型肝炎防治指南(2019年版)',
      source: '中华医学会肝病学分会',
      year: '2019',
      relevance: '肝功能评估'
    }],
    kidney_function: [{
      type: 'guideline',
      title: '慢性肾脏病筛查诊断及防治指南',
      source: '中华医学会肾脏病学分会',
      year: '2017',
      relevance: '肾功能评估'
    }],
    blood_sugar: [{
      type: 'guideline',
      title: '中国2型糖尿病防治指南(2020年版)',
      source: '中华医学会糖尿病学分会',
      year: '2020',
      relevance: '糖尿病诊断标准'
    }],
    thyroid: [{
      type: 'guideline',
      title: '甲状腺功能亢进症诊疗指南',
      source: '中华医学会内分泌学分会',
      year: '2007',
      relevance: '甲状腺功能评估'
    }],
    tumor_marker: [{
      type: 'consensus',
      title: '肿瘤标志物临床检测与结果报告共识',
      source: '中华医学会检验医学分会',
      year: '2018',
      relevance: '肿瘤标志物解读'
    }],
    coagulation: [{
      type: 'guideline',
      title: '出凝血功能障碍相关疾病诊疗指南',
      source: '中华医学会血液学分会',
      year: '2020',
      relevance: '凝血功能评估'
    }],
    infection: [{
      type: 'guideline',
      title: '病毒性肝炎防治方案',
      source: '国家卫生健康委员会',
      year: '2019',
      relevance: '感染指标解读'
    }],
    other: []
  };
  
  return [...commonSources, ...specificSources[testType]];
}

/**
 * 转换为标准分析结果格式
 */
function convertToAnalysisResult(testResult: TestResultAnalysis): AnalysisResult {
  const abnormalResults = testResult.results.filter(r => r.status !== 'normal');
  
  // 创建特征列表
  const features: DetectedFeature[] = testResult.results.map(result => ({
    type: 'test_item',
    label: result.abbreviation || result.name,
    confidence: result.status === 'normal' ? 0.95 : 0.85,
    description: `${result.name}: ${result.value}${result.unit} (${result.referenceRange})`
  }));
  
  const imageAnalysis: ImageAnalysis = {
    features,
    measurements: [],
    observations: [
      testResult.summary,
      testResult.interpretation,
      `检测类型：${getTestTypeName(testResult.testType)}`,
      `检测日期：${testResult.testDate}`,
      ...testResult.recommendations
    ]
  };
  
  // 创建红旗警示
  const redFlags: RedFlag[] = abnormalResults
    .filter(r => r.status === 'critical_high' || r.status === 'critical_low')
    .map(r => ({
      type: r.name,
      description: `${r.name}严重异常：${r.clinicalSignificance}`,
      urgency: 'urgent',
      actionRequired: '建议立即就医'
    }));
  
  // 计算风险等级
  const riskLevel = abnormalResults.length === 0 ? 'low' :
    abnormalResults.some(r => r.status === 'critical_high' || r.status === 'critical_low') ? 'high' :
    abnormalResults.length >= 3 ? 'medium' : 'low';
  
  const riskAssess: RiskAssessment = {
    level: riskLevel,
    factors: abnormalResults.map(r => ({
      type: r.name,
      description: r.clinicalSignificance,
      weight: r.status === 'critical_high' || r.status === 'critical_low' ? 0.8 : 0.5
    })),
    flags: redFlags
  };
  
  // 创建建议
  const recommendations: Recommendation[] = testResult.recommendations.map((rec, idx) => ({
    id: `test_rec_${idx}`,
    type: 'lifestyle',
    priority: idx === 0 ? 'high' : 'medium',
    title: '检测建议',
    content: rec,
    targetAudience: 'patient',
    evidenceSource: testResult.references[0]?.title,
    disclaimers: ['本分析仅供参考，不能替代专业医生的诊断和建议']
  }));
  
  // 如果需要随访，添加随访建议
  if (testResult.followupNeeded) {
    recommendations.push({
      id: 'test_followup',
      type: 'followup',
      priority: 'medium',
      title: '复查建议',
      content: `建议${getFollowupInterval(testResult.testType)}后复查${getTestTypeName(testResult.testType)}，监测指标变化。`,
      targetAudience: 'patient',
      disclaimers: ['具体复查时间请遵医嘱']
    });
  }
  
  return {
    id: `test_${Date.now()}`,
    sceneId: 'scene_test_result',
    timestamp: Date.now(),
    imageAnalysis,
    riskAssessment: riskAssess,
    recommendations,
    requiresManualReview: riskLevel === 'high',
    confidence: 0.85
  };
}

/**
 * 获取检测类型名称
 */
function getTestTypeName(testType: TestType): string {
  const names: Record<TestType, string> = {
    blood_routine: '血常规',
    biochemistry: '生化全套',
    urine_routine: '尿常规',
    lipid_profile: '血脂检查',
    liver_function: '肝功能',
    kidney_function: '肾功能',
    blood_sugar: '血糖检测',
    thyroid: '甲状腺功能',
    tumor_marker: '肿瘤标志物',
    coagulation: '凝血功能',
    infection: '感染指标',
    other: '其他检测'
  };
  
  return names[testType];
}

/**
 * 获取检测结果分析元数据
 */
export function getTestResultAnalysisMetadata(): {
  name: string;
  description: string;
  captureGuidance: string[];
  requiredImages: number;
  supportedTypes: { type: TestType; name: string }[];
} {
  return {
    name: '检测结果分析',
    description: '上传各类医学检测报告照片，AI智能分析检测结果，提供专业解读和健康建议',
    captureGuidance: [
      '确保光线充足，避免反光',
      '将报告平铺拍摄',
      '确保检测项目和数值清晰可见',
      '包含参考范围信息',
      '如有多个项目，请确保全部入镜'
    ],
    requiredImages: 1,
    supportedTypes: [
      { type: 'blood_routine', name: '血常规' },
      { type: 'biochemistry', name: '生化全套' },
      { type: 'urine_routine', name: '尿常规' },
      { type: 'lipid_profile', name: '血脂检查' },
      { type: 'liver_function', name: '肝功能' },
      { type: 'kidney_function', name: '肾功能' },
      { type: 'blood_sugar', name: '血糖检测' },
      { type: 'thyroid', name: '甲状腺功能' },
      { type: 'tumor_marker', name: '肿瘤标志物' },
      { type: 'coagulation', name: '凝血功能' },
      { type: 'infection', name: '感染指标' },
      { type: 'other', name: '其他检测' }
    ]
  };
}
