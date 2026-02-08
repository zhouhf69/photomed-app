/**
 * Knowledge Base Data - 知识库数据
 * 初始化知识库的分层数据
 */

import type { KBLayers, Guideline, SOP, AssessmentScale, EducationMaterial } from '@/types/core';

/**
 * 布里斯托大便分类量表
 */
export const bristolScale: AssessmentScale = {
  id: 'bristol_scale',
  name: '布里斯托大便分类量表',
  description: '用于评估大便形态和一致性的标准化工具',
  items: [
    {
      id: 'stool_type',
      name: '大便类型',
      options: [
        { value: 1, label: '类型1', description: '分离的硬块，像坚果（严重便秘）' },
        { value: 2, label: '类型2', description: '香肠状但表面有裂纹（轻度便秘）' },
        { value: 3, label: '类型3', description: '像香肠，表面有裂纹（正常）' },
        { value: 4, label: '类型4', description: '像香肠或蛇，表面光滑柔软（正常）' },
        { value: 5, label: '类型5', description: '边缘清晰的软块（缺乏纤维）' },
        { value: 6, label: '类型6', description: '边缘粗糙的蓬松小块（轻度腹泻）' },
        { value: 7, label: '类型7', description: '水样，无固体（腹泻）' }
      ]
    }
  ],
  scoring: {
    method: 'sum',
    ranges: [
      { min: 1, max: 2, label: '便秘', interpretation: '建议增加膳食纤维和水分摄入' },
      { min: 3, max: 4, label: '正常', interpretation: '继续保持健康的生活方式' },
      { min: 5, max: 7, label: '腹泻倾向', interpretation: '建议调整饮食，如持续请就医' }
    ]
  }
};

/**
 * PUSH 压疮愈合量表
 */
export const pushScale: AssessmentScale = {
  id: 'push_scale',
  name: 'PUSH 压疮愈合量表',
  description: 'Pressure Ulcer Scale for Healing，用于评估压疮愈合进展的标准化工具',
  items: [
    {
      id: 'surface_area',
      name: '伤口表面积',
      options: [
        { value: 0, label: '0分', description: '0 cm²' },
        { value: 1, label: '1分', description: '< 0.3 cm²' },
        { value: 2, label: '2分', description: '0.3-0.6 cm²' },
        { value: 3, label: '3分', description: '0.7-1.0 cm²' },
        { value: 4, label: '4分', description: '1.1-2.0 cm²' },
        { value: 5, label: '5分', description: '2.1-3.0 cm²' },
        { value: 6, label: '6分', description: '3.1-4.0 cm²' },
        { value: 7, label: '7分', description: '4.1-8.0 cm²' },
        { value: 8, label: '8分', description: '8.1-12.0 cm²' },
        { value: 9, label: '9分', description: '12.1-24.0 cm²' },
        { value: 10, label: '10分', description: '> 24.0 cm²' }
      ]
    },
    {
      id: 'exudate_amount',
      name: '渗出液量',
      options: [
        { value: 0, label: '0分', description: '无渗出液' },
        { value: 1, label: '1分', description: '少量渗出液' },
        { value: 2, label: '2分', description: '中等量渗出液' },
        { value: 3, label: '3分', description: '大量渗出液' }
      ]
    },
    {
      id: 'tissue_type',
      name: '组织类型',
      options: [
        { value: 0, label: '0分', description: '闭合/完全上皮化' },
        { value: 1, label: '1分', description: '上皮组织/肉芽组织' },
        { value: 2, label: '2分', description: '腐肉/疏松组织' },
        { value: 3, label: '3分', description: '坏死组织/焦痂' },
        { value: 4, label: '4分', description: '无法评估的组织类型' }
      ]
    }
  ],
  scoring: {
    method: 'sum',
    ranges: [
      { min: 0, max: 4, label: '愈合良好', interpretation: '继续当前治疗方案' },
      { min: 5, max: 8, label: '愈合一般', interpretation: '需评估治疗方案' },
      { min: 9, max: 12, label: '愈合缓慢', interpretation: '建议调整治疗方案' },
      { min: 13, max: 17, label: '愈合差', interpretation: '需要积极干预' }
    ]
  }
};

/**
 * 压疮预防护理 SOP
 */
export const pressureInjuryPreventionSOP: SOP = {
  id: 'pressure_injury_prevention_sop',
  title: '压疮预防护理标准操作规程',
  department: '护理部',
  version: '2.0',
  steps: [
    {
      order: 1,
      description: '风险评估',
      keyPoints: ['使用Braden量表评估', '入院时评估', '病情变化时复评'],
      cautions: ['确保评估准确性', '记录评估结果']
    },
    {
      order: 2,
      description: '皮肤检查',
      keyPoints: ['每日检查皮肤', '重点检查骨突部位', '记录皮肤状况'],
      cautions: ['注意早期红斑', '避免用力摩擦']
    },
    {
      order: 3,
      description: '体位变换',
      keyPoints: ['每2小时翻身一次', '使用30度侧卧位', '避免直接压迫骨突部位'],
      cautions: ['翻身时避免拖拽', '使用翻身辅助工具']
    },
    {
      order: 4,
      description: '减压设备使用',
      keyPoints: ['使用减压床垫', '坐垫选择', '足跟减压'],
      cautions: ['定期检查设备功能', '保持设备清洁']
    },
    {
      order: 5,
      description: '营养支持',
      keyPoints: ['评估营养状况', '高蛋白饮食', '补充维生素'],
      cautions: ['个体化营养方案', '监测营养指标']
    }
  ],
  applicableScenes: ['scene_wound_ostomy']
};

/**
 * 伤口评估护理 SOP
 */
export const woundAssessmentSOP: SOP = {
  id: 'wound_assessment_sop',
  title: '伤口评估标准操作规程',
  department: '伤口造口专科',
  version: '3.0',
  steps: [
    {
      order: 1,
      description: '准备',
      keyPoints: ['洗手', '准备评估工具', '解释评估目的'],
      cautions: ['保护患者隐私', '确保光线充足']
    },
    {
      order: 2,
      description: '观察伤口',
      keyPoints: ['观察伤口位置', '观察伤口大小', '观察伤口深度'],
      cautions: ['避免触碰伤口', '注意无菌操作']
    },
    {
      order: 3,
      description: '评估组织类型',
      keyPoints: ['评估肉芽组织', '评估腐肉', '评估焦痂'],
      cautions: ['区分组织类型', '记录百分比']
    },
    {
      order: 4,
      description: '评估渗出液',
      keyPoints: ['评估渗出液量', '评估渗出液颜色', '评估渗出液气味'],
      cautions: ['注意感染征象', '记录渗出液变化']
    },
    {
      order: 5,
      description: '评估周围皮肤',
      keyPoints: ['观察皮肤颜色', '观察皮肤完整性', '观察皮肤湿度'],
      cautions: ['注意浸渍', '注意过敏反应']
    },
    {
      order: 6,
      description: '记录',
      keyPoints: ['记录评估结果', '拍照存档', '更新护理计划'],
      cautions: ['确保记录准确', '保护患者隐私']
    }
  ],
  applicableScenes: ['scene_wound_ostomy']
};

/**
 * 压疮指南
 */
export const pressureInjuryGuideline: Guideline = {
  id: 'pressure_injury_guidelines_2023',
  title: '压疮/压力性损伤预防与治疗临床实践指南（2023版）',
  source: 'NPIAP/EPUAP/PPPIA',
  version: '2023',
  content: `
    # 压疮分期定义
    
    ## 1期压疮
    皮肤完整，局部出现不可消退的红斑，指压不变白。
    
    ## 2期压疮
    部分皮层缺损，表现为浅表开放性溃疡或完整/破裂的血清性水疱。
    
    ## 3期压疮
    全层皮肤缺损，可见皮下脂肪，但骨骼、肌腱或肌肉未外露。
    
    ## 4期压疮
    全层组织缺损，伴骨骼、肌腱或肌肉外露。
    
    ## 不可分期
    全层组织缺损，创面被腐肉或焦痂覆盖，无法确定实际深度。
    
    ## 深部组织损伤
    皮肤完整或不完整，局部出现紫色或栗色，或充血水疱。
    
    # 预防要点
    1. 风险评估：使用Braden量表
    2. 皮肤护理：保持清洁干燥
    3. 体位管理：每2小时翻身
    4. 营养支持：高蛋白饮食
    5. 健康教育：患者及家属教育
    
    # 治疗原则
    1. 减压：去除压力源
    2. 清创：去除坏死组织
    3. 感染控制：局部或全身抗感染
    4. 湿性愈合：创造湿润环境
    5. 营养支持：促进组织修复
  `,
  applicableScenes: ['scene_wound_ostomy']
};

/**
 * 大便健康宣教材料
 */
export const digestiveHealthEducation: EducationMaterial = {
  id: 'digestive_health_education',
  title: '肠道健康与大便观察',
  type: 'article',
  content: `
    # 肠道健康与大便观察
    
    ## 正常大便的特征
    - 颜色：棕色或黄褐色
    - 形状：香蕉状或香肠状
    - 频率：每天1-2次或每2-3天1次
    - 质地：柔软成形，易于排出
    
    ## 大便颜色变化的意义
    - 黑色：可能上消化道出血
    - 红色：可能下消化道出血
    - 绿色：可能与饮食或消化不良有关
    - 陶土色：可能胆道问题
    
    ## 保持肠道健康的方法
    1. 均衡饮食，多吃蔬菜水果
    2. 每天饮水1500-2000ml
    3. 规律运动，促进肠蠕动
    4. 养成定时排便习惯
    5. 避免长期使用泻药
    
    ## 何时需要就医
    - 大便带血或呈黑色
    - 持续腹泻超过3天
    - 严重便秘超过1周
    - 大便习惯突然改变
    - 伴有腹痛、发热、体重下降
  `,
  targetAudience: ['general_public', 'patient']
};

/**
 * 伤口愈合营养宣教
 */
export const woundNutritionEducation: EducationMaterial = {
  id: 'nutrition_for_wound_healing',
  title: '促进伤口愈合的营养指导',
  type: 'article',
  content: `
    # 促进伤口愈合的营养指导
    
    ## 关键营养素
    
    ### 蛋白质
    - 作用：组织修复的基础
    - 来源：瘦肉、鱼、蛋、奶、豆制品
    - 建议：每天1.2-1.5g/kg体重
    
    ### 维生素C
    - 作用：胶原蛋白合成
    - 来源：柑橘类、草莓、西红柿、绿叶蔬菜
    - 建议：每天100-200mg
    
    ### 锌
    - 作用：细胞增殖和免疫
    - 来源：牡蛎、瘦肉、坚果、全谷物
    - 建议：每天15-20mg
    
    ### 维生素A
    - 作用：上皮化
    - 来源：胡萝卜、南瓜、肝脏、蛋黄
    - 建议：适量补充
    
    ## 饮食建议
    1. 少量多餐，保证热量摄入
    2. 高蛋白、高维生素饮食
    3. 充足水分，每天1500-2000ml
    4. 限制高糖、高脂食物
    5. 戒烟限酒
    
    ## 特殊情况
    - 糖尿病患者：控制血糖
    - 肾病患者：限制蛋白质
    - 心血管疾病：低盐低脂
  `,
  targetAudience: ['patient', 'caregiver']
};

/**
 * 初始化知识库数据
 */
export function initializeKnowledgeBase(): KBLayers {
  return {
    guidelines: [pressureInjuryGuideline],
    sops: [pressureInjuryPreventionSOP, woundAssessmentSOP],
    assessmentScales: [bristolScale, pushScale],
    clinicalPathways: [],
    educationMaterials: [digestiveHealthEducation, woundNutritionEducation],
    qualityControl: [],
    outcomes: []
  };
}

/**
 * 获取评估量表
 */
export function getAssessmentScale(scaleId: string): AssessmentScale | undefined {
  const scales = [bristolScale, pushScale];
  return scales.find(s => s.id === scaleId);
}

/**
 * 获取所有宣教材料
 */
export function getAllEducationMaterials(): EducationMaterial[] {
  return [digestiveHealthEducation, woundNutritionEducation];
}
