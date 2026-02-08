/**
 * Scene Pack Data - 场景包数据
 * 定义所有可用的场景包配置
 */

import type { ScenePack } from '@/types/core';

/**
 * 场景包列表
 */
export const scenePacks: ScenePack[] = [
  {
    id: 'scene_stool_analysis',
    name: '大便识别',
    description: '通过拍照识别大便特征，提供健康提醒和就医建议。适用于个人健康监测。',
    version: '1.0.0',
    type: 'consumer',
    targetAudience: 'general_public',
    modules: [
      {
        id: 'image_capture',
        name: '拍照采集',
        type: 'assessment',
        enabled: true,
        config: {
          allowGallery: true,
          requireMultipleAngles: false,
          guidanceText: '请将大便置于画面中央，确保光线充足'
        }
      },
      {
        id: 'image_qa',
        name: '质量评估',
        type: 'assessment',
        enabled: true,
        config: {
          autoCheck: true,
          showRealTimeFeedback: true
        }
      },
      {
        id: 'feature_analysis',
        name: '特征分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectColor: true,
          detectConsistency: true,
          detectBristolScale: true
        }
      },
      {
        id: 'risk_assessment',
        name: '风险评估',
        type: 'assessment',
        enabled: true,
        config: {
          enableRedFlagDetection: true,
          showBristolScale: true
        }
      },
      {
        id: 'recommendation',
        name: '健康建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeDietAdvice: true,
          includeLifestyleAdvice: true,
          includeMedicalReferral: true
        }
      },
      {
        id: 'report',
        name: '健康报告',
        type: 'report',
        enabled: true,
        config: {
          includeDisclaimer: true,
          allowShare: true,
          format: 'simple'
        }
      }
    ],
    kbConfig: {
      guidelines: [
        'bristol_stool_scale',
        'digestive_health_guidelines'
      ],
      sops: [],
      assessmentScales: [
        'bristol_scale'
      ],
      clinicalPathways: [],
      educationMaterials: [
        'digestive_health_education',
        'when_to_see_doctor'
      ]
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'recommendation', name: '健康建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: false }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  },
  {
    id: 'scene_wound_ostomy',
    name: '伤口造口评估',
    description: '专业伤口造口评估工具，支持压疮分期、组织评估、护理方案生成。适用于伤口造口门诊、延续护理。',
    version: '1.0.0',
    type: 'professional',
    targetAudience: 'wound_ostomy_specialist',
    modules: [
      {
        id: 'patient_info',
        name: '患者信息',
        type: 'assessment',
        enabled: true,
        config: {
          requiredFields: ['patientId', 'age', 'gender', 'underlyingConditions'],
          optionalFields: ['medications', 'allergies']
        }
      },
      {
        id: 'image_capture',
        name: '拍照采集',
        type: 'assessment',
        enabled: true,
        config: {
          allowGallery: true,
          requireMultipleAngles: true,
          requireScaleReference: true,
          guidanceText: '请放置标尺在伤口旁，确保伤口清晰可见'
        }
      },
      {
        id: 'image_qa',
        name: '质量评估',
        type: 'assessment',
        enabled: true,
        config: {
          autoCheck: true,
          strictMode: true
        }
      },
      {
        id: 'wound_assessment',
        name: '伤口评估',
        type: 'assessment',
        enabled: true,
        config: {
          assessType: true,
          assessStage: true,
          assessSize: true,
          assessTissue: true
        }
      },
      {
        id: 'infection_screening',
        name: '感染筛查',
        type: 'analysis',
        enabled: true,
        config: {
          checkLocalSigns: true,
          checkSystemicSigns: true
        }
      },
      {
        id: 'care_plan',
        name: '护理方案',
        type: 'recommendation',
        enabled: true,
        config: {
          generateCleansingPlan: true,
          generateDressingPlan: true,
          generateNutritionPlan: true,
          generatePositioningPlan: true
        }
      },
      {
        id: 'multi_version_report',
        name: '多版本报告',
        type: 'report',
        enabled: true,
        config: {
          generateMedicalVersion: true,
          generateNursingVersion: true,
          generatePatientVersion: true,
          includePUSHScore: true
        }
      },
      {
        id: 'followup_plan',
        name: '随访计划',
        type: 'followup',
        enabled: true,
        config: {
          scheduleReassessment: true,
          schedulePhotoRecapture: true,
          defineEscalationTriggers: true
        }
      }
    ],
    kbConfig: {
      guidelines: [
        'pressure_injury_guidelines_2023',
        'wound_care_clinical_practice_guidelines',
        'diabetic_foot_ulcer_guidelines',
        'venous_ulcer_guidelines'
      ],
      sops: [
        'wound_assessment_sop',
        'dressing_change_sop',
        'pressure_injury_prevention_sop',
        'ostomy_care_sop'
      ],
      assessmentScales: [
        'push_scale',
        'bates_jensen_wound_assessment',
        'braden_scale',
        'norton_scale'
      ],
      clinicalPathways: [
        'pressure_injury_pathway',
        'diabetic_foot_ulcer_pathway',
        'venous_ulcer_pathway'
      ],
      educationMaterials: [
        'wound_self_care_education',
        'pressure_injury_prevention_education',
        'nutrition_for_wound_healing'
      ]
    },
    workflow: {
      steps: [
        { id: 'patient_info', name: '患者信息', type: 'assessment', required: true },
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'assessment', name: '专业评估', type: 'assessment', required: true },
        { id: 'confirmation', name: '人工确认', type: 'confirmation', required: true },
        { id: 'care_plan', name: '护理方案', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: true },
        { id: 'followup', name: '随访计划', type: 'recommendation', required: false }
      ],
      requireManualConfirm: true,
      autoGenerateReport: true,
      enableFollowup: true
    }
  },
  {
    id: 'scene_physical_exam',
    name: '体检报告分析',
    description: '上传体检报告照片，AI智能分析报告内容，生成完整健康解读、风险评估、干预意见和随访计划。适用于个人健康管理和企业体检报告解读。',
    version: '1.0.0',
    type: 'professional',
    targetAudience: 'patient',
    modules: [
      {
        id: 'image_capture',
        name: '报告拍照',
        type: 'assessment',
        enabled: true,
        config: {
          allowGallery: true,
          requireMultipleAngles: false,
          guidanceText: '请将体检报告平铺，确保文字清晰可见'
        }
      },
      {
        id: 'image_qa',
        name: '质量评估',
        type: 'assessment',
        enabled: true,
        config: {
          autoCheck: true,
          strictMode: true
        }
      },
      {
        id: 'report_extraction',
        name: '报告提取',
        type: 'analysis',
        enabled: true,
        config: {
          extractBasicInfo: true,
          extractExamItems: true,
          extractAbnormalResults: true
        }
      },
      {
        id: 'report_interpretation',
        name: '报告解读',
        type: 'analysis',
        enabled: true,
        config: {
          generateSummary: true,
          interpretCategories: true,
          identifyKeyFindings: true
        }
      },
      {
        id: 'risk_assessment',
        name: '风险评估',
        type: 'assessment',
        enabled: true,
        config: {
          assessDiseaseRisks: true,
          assessLifestyleRisks: true,
          generateRiskFactors: true
        }
      },
      {
        id: 'intervention_plan',
        name: '干预方案',
        type: 'recommendation',
        enabled: true,
        config: {
          generateImmediateActions: true,
          generateShortTermGoals: true,
          generateLongTermGoals: true,
          generateLifestyleModifications: true,
          generateMedicalReferrals: true
        }
      },
      {
        id: 'followup_plan',
        name: '随访计划',
        type: 'followup',
        enabled: true,
        config: {
          generateSchedule: true,
          defineMonitoringItems: true,
          setAlertConditions: true
        }
      },
      {
        id: 'comprehensive_report',
        name: '综合分析报告',
        type: 'report',
        enabled: true,
        config: {
          includeInterpretation: true,
          includeRiskAssessment: true,
          includeInterventionPlan: true,
          includeFollowupPlan: true,
          includeReferences: true
        }
      }
    ],
    kbConfig: {
      guidelines: [
        'physical_exam_guidelines',
        'chronic_disease_management_guidelines',
        'health_risk_assessment_guidelines'
      ],
      sops: [
        'physical_exam_report_review_sop',
        'health_counseling_sop'
      ],
      assessmentScales: [
        'cardiovascular_risk_score',
        'diabetes_risk_score',
        'framingham_risk_score'
      ],
      clinicalPathways: [
        'abnormal_result_management_pathway',
        'chronic_disease_prevention_pathway'
      ],
      educationMaterials: [
        'healthy_lifestyle_education',
        'disease_prevention_education'
      ]
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照上传', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'extraction', name: '报告提取', type: 'analysis', required: true },
        { id: 'interpretation', name: '报告解读', type: 'analysis', required: true },
        { id: 'risk', name: '风险评估', type: 'assessment', required: true },
        { id: 'intervention', name: '干预方案', type: 'recommendation', required: true },
        { id: 'followup', name: '随访计划', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: true }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: true
    }
  },
  {
    id: 'scene_test_result',
    name: '检测结果分析',
    description: '上传各类医学检测报告（血常规、生化、尿常规、血脂、肝肾功能等），AI智能分析检测结果，提供专业解读和健康建议。',
    version: '1.0.0',
    type: 'professional',
    targetAudience: 'patient',
    modules: [
      {
        id: 'test_type_selection',
        name: '检测类型选择',
        type: 'assessment',
        enabled: true,
        config: {
          supportedTypes: [
            'blood_routine',
            'biochemistry',
            'urine_routine',
            'lipid_profile',
            'liver_function',
            'kidney_function',
            'blood_sugar',
            'thyroid',
            'tumor_marker',
            'coagulation',
            'infection'
          ]
        }
      },
      {
        id: 'image_capture',
        name: '报告拍照',
        type: 'assessment',
        enabled: true,
        config: {
          allowGallery: true,
          requireMultipleAngles: false,
          guidanceText: '请将检测报告平铺，确保项目和数值清晰可见'
        }
      },
      {
        id: 'image_qa',
        name: '质量评估',
        type: 'assessment',
        enabled: true,
        config: {
          autoCheck: true,
          strictMode: true
        }
      },
      {
        id: 'result_extraction',
        name: '结果提取',
        type: 'analysis',
        enabled: true,
        config: {
          extractTestItems: true,
          extractReferenceRanges: true,
          identifyAbnormalResults: true
        }
      },
      {
        id: 'result_interpretation',
        name: '结果解读',
        type: 'analysis',
        enabled: true,
        config: {
          interpretEachItem: true,
          identifyClinicalSignificance: true,
          suggestPossibleCauses: true
        }
      },
      {
        id: 'recommendation',
        name: '健康建议',
        type: 'recommendation',
        enabled: true,
        config: {
          generateLifestyleAdvice: true,
          suggestFollowupTests: true,
          provideReferralAdvice: true
        }
      },
      {
        id: 'report',
        name: '分析报告',
        type: 'report',
        enabled: true,
        config: {
          includeInterpretation: true,
          includeRecommendations: true,
          includeReferences: true
        }
      }
    ],
    kbConfig: {
      guidelines: [
        'clinical_laboratory_test_guidelines',
        'reference_interval_guidelines'
      ],
      sops: [
        'test_result_interpretation_sop'
      ],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: [
        'test_result_understanding_education'
      ]
    },
    workflow: {
      steps: [
        { id: 'type', name: '选择类型', type: 'assessment', required: true },
        { id: 'capture', name: '拍照上传', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'extraction', name: '结果提取', type: 'analysis', required: true },
        { id: 'interpretation', name: '结果解读', type: 'analysis', required: true },
        { id: 'recommendation', name: '健康建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: true }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  }
];

/**
 * 获取场景包配置
 */
export function getScenePack(sceneId: string): ScenePack | undefined {
  return scenePacks.find(pack => pack.id === sceneId);
}

/**
 * 获取所有场景包
 */
export function getAllScenePacks(): ScenePack[] {
  return scenePacks;
}

/**
 * 按类型获取场景包
 */
export function getScenePacksByType(type: 'professional' | 'consumer'): ScenePack[] {
  return scenePacks.filter(pack => pack.type === type);
}

/**
 * 获取场景包图标
 */
export function getScenePackIcon(sceneId: string): string {
  const icons: Record<string, string> = {
    scene_stool_analysis: '💩',
    scene_wound_ostomy: '🩹',
    scene_physical_exam: '📋',
    scene_test_result: '🧪'
  };
  return icons[sceneId] || '📋';
}

/**
 * 获取场景包颜色主题
 */
export function getScenePackTheme(sceneId: string): {
  primary: string;
  secondary: string;
  background: string;
} {
  const themes: Record<string, { primary: string; secondary: string; background: string }> = {
    scene_stool_analysis: {
      primary: '#8B5A2B',
      secondary: '#D4A574',
      background: '#FDF6E3'
    },
    scene_wound_ostomy: {
      primary: '#2E7D32',
      secondary: '#81C784',
      background: '#E8F5E9'
    },
    scene_physical_exam: {
      primary: '#1565C0',
      secondary: '#64B5F6',
      background: '#E3F2FD'
    },
    scene_test_result: {
      primary: '#6A1B9A',
      secondary: '#BA68C8',
      background: '#F3E5F5'
    }
  };
  
  return themes[sceneId] || {
    primary: '#1976D2',
    secondary: '#64B5F6',
    background: '#E3F2FD'
  };
}
