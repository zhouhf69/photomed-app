/**
 * Health Scene Packs Data - 大健康场景包配置
 * 引流模块：皮肤检测、指甲健康、口腔健康、舌苔分析、头发/头皮、眼睛、足部、体态
 */

import type { ScenePack } from '@/types/core';

/**
 * 大健康场景包列表
 */
export const healthScenePacks: ScenePack[] = [
  {
    id: 'scene_skin_analysis',
    name: '皮肤检测',
    description: 'AI智能分析肤质类型、皮肤问题，提供个性化护肤建议。适合日常皮肤护理参考。',
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
          guidanceText: '请在自然光下拍摄面部正面照片，确保面部清晰可见'
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
        id: 'skin_type_analysis',
        name: '肤质分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectSkinType: true,
          detectOiliness: true,
          detectHydration: true
        }
      },
      {
        id: 'concern_detection',
        name: '问题检测',
        type: 'analysis',
        enabled: true,
        config: {
          detectAcne: true,
          detectDarkCircles: true,
          detectPores: true,
          detectUnevenTone: true
        }
      },
      {
        id: 'recommendation',
        name: '护肤建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeCleansing: true,
          includeMoisturizing: true,
          includeSunProtection: true,
          includeLifestyle: true
        }
      },
      {
        id: 'report',
        name: '护肤报告',
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
      guidelines: ['skin_care_guidelines'],
      sops: [],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: ['skin_care_basics', 'sun_protection_guide']
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'recommendation', name: '护肤建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: false }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  },
  {
    id: 'scene_nail_analysis',
    name: '指甲健康',
    description: '通过指甲颜色、纹理、形状分析健康状况，发现潜在营养缺乏或健康问题。',
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
          guidanceText: '请拍摄清晰的指甲照片，确保光线充足，指甲完整可见'
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
        id: 'color_analysis',
        name: '颜色分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectColor: true,
          detectSpots: true
        }
      },
      {
        id: 'texture_analysis',
        name: '纹理分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectRidges: true,
          detectBrittleness: true
        }
      },
      {
        id: 'recommendation',
        name: '健康建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeCare: true,
          includeNutrition: true
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
      guidelines: ['nail_health_guidelines'],
      sops: [],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: ['nail_care_basics', 'nutrition_for_nails']
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
    id: 'scene_oral_analysis',
    name: '口腔健康',
    description: '分析牙齿、牙龈、舌头健康状况，提供口腔护理建议，预防口腔疾病。',
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
          requireMultipleAngles: true,
          guidanceText: '请拍摄口腔内部照片，包括牙齿、牙龈和舌头'
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
        id: 'teeth_analysis',
        name: '牙齿分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectColor: true,
          detectPlaque: true,
          detectCavities: true
        }
      },
      {
        id: 'gum_analysis',
        name: '牙龈分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectColor: true,
          detectInflammation: true
        }
      },
      {
        id: 'recommendation',
        name: '护理建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeBrushing: true,
          includeFlossing: true,
          includeDiet: true
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
      guidelines: ['oral_health_guidelines'],
      sops: [],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: ['oral_hygiene_guide', 'dental_care_basics']
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'recommendation', name: '护理建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: false }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  },
  {
    id: 'scene_tongue_analysis',
    name: '舌苔分析',
    description: '基于中医舌诊理论，分析舌象辨识体质，提供个性化养生调理建议。',
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
          guidanceText: '请伸出舌头，在自然光下拍摄清晰的舌象照片'
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
        id: 'tongue_color_analysis',
        name: '舌色分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectColor: true
        }
      },
      {
        id: 'coating_analysis',
        name: '舌苔分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectColor: true,
          detectThickness: true
        }
      },
      {
        id: 'constitution_analysis',
        name: '体质辨识',
        type: 'analysis',
        enabled: true,
        config: {
          detectPattern: true
        }
      },
      {
        id: 'recommendation',
        name: '养生建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeDiet: true,
          includeLifestyle: true,
          includeExercise: true
        }
      },
      {
        id: 'report',
        name: '养生报告',
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
      guidelines: ['tcm_tongue_diagnosis'],
      sops: [],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: ['tcm_constitution_guide', 'tcm_diet_therapy']
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'recommendation', name: '养生建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: false }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  },
  {
    id: 'scene_hair_analysis',
    name: '头发/头皮检测',
    description: '分析头发类型、头皮健康状况，提供个性化护发方案。帮助改善头皮问题和头发质量。',
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
          requireMultipleAngles: true,
          guidanceText: '请拍摄头皮和头发的清晰照片，可在不同光线下拍摄'
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
        id: 'hair_type_analysis',
        name: '发质分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectHairType: true,
          detectDensity: true,
          detectThickness: true
        }
      },
      {
        id: 'scalp_analysis',
        name: '头皮分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectOiliness: true,
          detectDandruff: true,
          detectSensitivity: true
        }
      },
      {
        id: 'recommendation',
        name: '护发建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeShampoo: true,
          includeTreatment: true,
          includeLifestyle: true
        }
      },
      {
        id: 'report',
        name: '护发报告',
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
      guidelines: ['hair_care_guidelines'],
      sops: [],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: ['hair_care_basics', 'scalp_health_guide']
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'recommendation', name: '护发建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: false }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  },
  {
    id: 'scene_eye_analysis',
    name: '眼睛健康检测',
    description: '分析眼白颜色、眼周状况，评估眼睛疲劳程度，提供护眼建议。',
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
          guidanceText: '请正视镜头，在自然光下拍摄眼睛特写'
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
        id: 'sclera_analysis',
        name: '眼白分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectColor: true,
          detectRedness: true
        }
      },
      {
        id: 'eye_area_analysis',
        name: '眼周分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectDarkCircles: true,
          detectPuffiness: true,
          detectFatigue: true
        }
      },
      {
        id: 'recommendation',
        name: '护眼建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeEyeCare: true,
          includeLifestyle: true,
          includeExercises: true
        }
      },
      {
        id: 'report',
        name: '护眼报告',
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
      guidelines: ['eye_health_guidelines'],
      sops: [],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: ['eye_care_basics', 'digital_eye_strain_guide']
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'recommendation', name: '护眼建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: false }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  },
  {
    id: 'scene_foot_analysis',
    name: '足部健康检测',
    description: '分析足部皮肤、趾甲状况，发现足部问题，提供专业护理建议。',
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
          requireMultipleAngles: true,
          guidanceText: '请拍摄足底、足背和趾甲的清晰照片'
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
        id: 'skin_analysis',
        name: '皮肤分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectDryness: true,
          detectCalluses: true,
          detectCracks: true
        }
      },
      {
        id: 'nail_analysis',
        name: '趾甲分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectColor: true,
          detectFungus: true,
          detectThickness: true
        }
      },
      {
        id: 'recommendation',
        name: '护理建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeFootCare: true,
          includeFootwear: true,
          includeHygiene: true
        }
      },
      {
        id: 'report',
        name: '足部报告',
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
      guidelines: ['foot_health_guidelines'],
      sops: [],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: ['foot_care_basics', 'footwear_guide']
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'recommendation', name: '护理建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: false }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  },
  {
    id: 'scene_posture_analysis',
    name: '体态姿势检测',
    description: '分析站姿、坐姿体态，识别姿势问题，提供矫正建议和锻炼方案。',
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
          requireMultipleAngles: true,
          guidanceText: '请拍摄侧面和背面全身照，穿着贴身衣物'
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
        id: 'spine_analysis',
        name: '脊柱分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectCervical: true,
          detectThoracic: true,
          detectLumbar: true
        }
      },
      {
        id: 'alignment_analysis',
        name: '对齐分析',
        type: 'analysis',
        enabled: true,
        config: {
          detectShoulderAlignment: true,
          detectHipAlignment: true
        }
      },
      {
        id: 'recommendation',
        name: '矫正建议',
        type: 'recommendation',
        enabled: true,
        config: {
          includeExercises: true,
          includeStretching: true,
          includeErgonomic: true
        }
      },
      {
        id: 'report',
        name: '体态报告',
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
      guidelines: ['posture_guidelines'],
      sops: [],
      assessmentScales: [],
      clinicalPathways: [],
      educationMaterials: ['posture_correction_guide', 'ergonomic_guide']
    },
    workflow: {
      steps: [
        { id: 'capture', name: '拍照', type: 'image_capture', required: true },
        { id: 'qa', name: '质量检查', type: 'image_qa', required: true },
        { id: 'analysis', name: '智能分析', type: 'analysis', required: true },
        { id: 'recommendation', name: '矫正建议', type: 'recommendation', required: true },
        { id: 'report', name: '生成报告', type: 'report', required: false }
      ],
      requireManualConfirm: false,
      autoGenerateReport: true,
      enableFollowup: false
    }
  }
];

/**
 * 获取大健康场景包
 */
export function getHealthScenePack(sceneId: string): ScenePack | undefined {
  return healthScenePacks.find(pack => pack.id === sceneId);
}

/**
 * 获取所有大健康场景包
 */
export function getAllHealthScenePacks(): ScenePack[] {
  return healthScenePacks;
}

/**
 * 获取场景包图标
 */
export function getHealthSceneIcon(sceneId: string): string {
  const icons: Record<string, string> = {
    scene_skin_analysis: '✨',
    scene_nail_analysis: '💅',
    scene_oral_analysis: '🦷',
    scene_tongue_analysis: '👅',
    scene_hair_analysis: '💇',
    scene_eye_analysis: '👁️',
    scene_foot_analysis: '🦶',
    scene_posture_analysis: '🧍'
  };
  return icons[sceneId] || '💚';
}

/**
 * 获取场景包颜色主题
 */
export function getHealthSceneTheme(sceneId: string): {
  primary: string;
  secondary: string;
  background: string;
} {
  const themes: Record<string, { primary: string; secondary: string; background: string }> = {
    scene_skin_analysis: {
      primary: '#E91E63',
      secondary: '#F48FB1',
      background: '#FCE4EC'
    },
    scene_nail_analysis: {
      primary: '#9C27B0',
      secondary: '#CE93D8',
      background: '#F3E5F5'
    },
    scene_oral_analysis: {
      primary: '#00BCD4',
      secondary: '#80DEEA',
      background: '#E0F7FA'
    },
    scene_tongue_analysis: {
      primary: '#FF5722',
      secondary: '#FFAB91',
      background: '#FBE9E7'
    },
    scene_hair_analysis: {
      primary: '#795548',
      secondary: '#BCAAA4',
      background: '#EFEBE9'
    },
    scene_eye_analysis: {
      primary: '#3F51B5',
      secondary: '#9FA8DA',
      background: '#E8EAF6'
    },
    scene_foot_analysis: {
      primary: '#607D8B',
      secondary: '#B0BEC5',
      background: '#ECEFF1'
    },
    scene_posture_analysis: {
      primary: '#009688',
      secondary: '#80CBC4',
      background: '#E0F2F1'
    }
  };
  
  return themes[sceneId] || {
    primary: '#4CAF50',
    secondary: '#81C784',
    background: '#E8F5E9'
  };
}
