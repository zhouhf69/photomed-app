/**
 * Photo-first Medical Intelligence Engine - Scene-Specific Types
 * 场景特定类型定义
 */

import type { 
  RiskAssessment, 
  TargetAudience 
} from './core';

// ============================================
// 大便识别场景 (Stool Analysis - Consumer)
// ============================================

export interface StoolAnalysisInput {
  imageUrl: string;
  userContext?: {
    age?: number;
    gender?: 'male' | 'female';
    symptoms?: string[];
    duration?: string;
    medications?: string[];
  };
}

export interface StoolAnalysisResult {
  riskAssessment: RiskAssessment;
  features: StoolFeature[];
  bristolScale?: BristolScaleResult;
  recommendations: StoolRecommendation[];
  disclaimer: string;
}

export interface StoolFeature {
  type: 'color' | 'consistency' | 'shape' | 'mucus' | 'blood' | 'undigested' | 'other';
  label: string;
  description: string;
  confidence: number;
  normal: boolean;
}

export interface BristolScaleResult {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  description: string;
  interpretation: string;
}

export interface StoolRecommendation {
  type: 'diet' | 'hydration' | 'lifestyle' | 'medical_attention' | 'followup';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
  urgency?: 'routine' | 'soon' | 'urgent' | 'emergency';
}

// 大便颜色类型
export type StoolColor = 
  | 'brown' // 正常棕色
  | 'green' // 绿色
  | 'yellow' // 黄色
  | 'black' // 黑色（可能上消化道出血）
  | 'red' // 红色（可能下消化道出血）
  | 'clay' // 陶土色（可能胆道问题）
  | 'pale'; // 浅色

// 大便异常警示信号
export const STOOL_RED_FLAGS = [
  {
    type: 'black_stool',
    description: '黑色柏油样大便',
    possibleCause: '上消化道出血',
    urgency: 'urgent' as const,
    action: '建议尽快就医，排除消化道出血'
  },
  {
    type: 'bloody_stool',
    description: '鲜红色血便',
    possibleCause: '下消化道出血、痔疮、肛裂',
    urgency: 'urgent' as const,
    action: '建议尽快就医检查'
  },
  {
    type: 'clay_stool',
    description: '陶土色大便',
    possibleCause: '胆道梗阻',
    urgency: 'urgent' as const,
    action: '建议尽快就医检查肝功能'
  },
  {
    type: 'persistent_diarrhea',
    description: '持续腹泻超过3天',
    possibleCause: '感染、炎症性肠病',
    urgency: 'soon' as const,
    action: '建议就医检查'
  },
  {
    type: 'severe_constipation',
    description: '严重便秘伴腹痛',
    possibleCause: '肠梗阻',
    urgency: 'urgent' as const,
    action: '建议尽快就医'
  },
  {
    type: 'mucus_blood',
    description: '黏液脓血便',
    possibleCause: '细菌性痢疾、溃疡性结肠炎',
    urgency: 'urgent' as const,
    action: '建议尽快就医'
  }
];

// ============================================
// 伤口造口场景 (Wound & Ostomy - Professional)
// ============================================

export interface WoundOstomyInput {
  imageUrl: string;
  patientContext: {
    patientId: string;
    age: number;
    gender: 'male' | 'female';
    underlyingConditions: string[];
    medications: string[];
    allergies: string[];
  };
  woundContext: {
    woundType: WoundType;
    onsetDate?: string;
    location: string;
    size?: { length: number; width: number; depth?: number };
    previousTreatments?: string[];
  };
}

export type WoundType = 
  | 'pressure_injury' // 压疮
  | 'diabetic_ulcer' // 糖尿病足溃疡
  | 'venous_ulcer' // 静脉性溃疡
  | 'arterial_ulcer' // 动脉性溃疡
  | 'surgical_wound' // 手术切口
  | 'traumatic_wound' // 创伤性伤口
  | 'burn' // 烧伤
  | 'ostomy' // 造口
  | 'fistula' // 瘘管
  | 'other'; // 其他

export interface WoundOstomyResult {
  assessment: WoundAssessment;
  measurements: WoundMeasurement[];
  tissueAssessment: TissueAssessment;
  infectionSigns: InfectionSigns;
  healingStatus: HealingStatus;
  riskFactors: WoundRiskFactor[];
  recommendations: WoundRecommendation[];
  followupPlan: WoundFollowupPlan;
  requiresManualReview: boolean;
  confidence: number;
}

export interface WoundAssessment {
  woundType: WoundType;
  stage?: PressureInjuryStage;
  classification?: string;
  description: string;
}

export type PressureInjuryStage = 
  | 'stage_1' // 皮肤完整，局部红斑
  | 'stage_2' // 部分皮层缺损
  | 'stage_3' // 全层皮肤缺损
  | 'stage_4' // 全层组织缺损
  | 'unstageable' // 不可分期
  | 'suspected_deep_tissue'; // 深部组织损伤

export interface WoundMeasurement {
  type: 'length' | 'width' | 'depth' | 'area' | 'undermining' | 'tunneling';
  value: number;
  unit: 'cm' | 'mm' | 'cm2';
  method: 'auto' | 'manual' | 'estimated';
}

export interface TissueAssessment {
  granulation: TissuePercentage;
  slough: TissuePercentage;
  eschar: TissuePercentage;
  epithelialization: TissuePercentage;
}

export interface TissuePercentage {
  percentage: number;
  description: string;
}

export interface InfectionSigns {
  present: boolean;
  localSigns: LocalInfectionSign[];
  systemicSigns: SystemicInfectionSign[];
  spreadingInfection: boolean;
}

export type LocalInfectionSign =
  | 'erythema'
  | 'warmth'
  | 'swelling'
  | 'purulent_drainage'
  | 'increased_drainage'
  | 'delayed_healing'
  | 'friable_granulation'
  | 'wound_breakdown'
  | 'malodor';

export type SystemicInfectionSign =
  | 'fever'
  | 'increased_wbc'
  | 'confusion'
  | 'malaise'
  | 'loss_of_appetite';

export interface HealingStatus {
  status: 'healing' | 'stable' | 'deteriorating' | 'infected';
  trend?: 'improving' | 'stable' | 'worsening';
  estimatedHealingTime?: string;
  barriers?: string[];
}

export interface WoundRiskFactor {
  type: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  modifiable: boolean;
}

export interface WoundRecommendation {
  id: string;
  type: 'cleansing' | 'debridement' | 'dressing' | 'medication' | 'positioning' | 'nutrition' | 'referral' | 'education';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
  frequency?: string;
  duration?: string;
  targetAudience: TargetAudience;
  evidenceSource?: string;
  requiresConfirmation: boolean;
}

export interface WoundFollowupPlan {
  reassessmentInterval: string;
  photoRecaptureSchedule: string[];
  expectedOutcomes: string[];
  escalationTriggers: EscalationTrigger[];
}

export interface EscalationTrigger {
  condition: string;
  action: string;
  urgency: 'routine' | 'urgent' | 'emergency';
}

// 伤口评估量表
export interface PUSHScale {
  surfaceArea: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  exudateAmount: 0 | 1 | 2 | 3;
  tissueType: 0 | 1 | 2 | 3 | 4;
  totalScore: number;
  interpretation: string;
}

export interface BatesJensenWoundAssessment {
  size: number;
  depth: number;
  edges: number;
  undermining: number;
  necroticTissue: number;
  exudateType: number;
  exudateAmount: number;
  skinColor: number;
  edema: number;
  induration: number;
  granulation: number;
  epithelialization: number;
  totalScore: number;
}

// 造口特定类型
export interface OstomyAssessment {
  ostomyType: 'colostomy' | 'ileostomy' | 'urostomy';
  constructionType: 'end' | 'loop' | 'double_barrel';
  stomaAppearance: {
    color: 'pink_red' | 'pale' | 'dark' | 'black' | 'purple';
    shape: 'round' | 'oval' | 'irregular';
    size: { length: number; width: number };
    height: 'retracted' | 'flush' | 'protruded' | ' prolapsed';
    edema: boolean;
  };
  peristomalSkin: {
    condition: 'intact' | 'irritated' | 'erythema' | 'macerated' | 'ulcerated';
    complications?: string[];
  };
  stomaFunction: {
    outputConsistency: string;
    outputAmount: 'minimal' | 'moderate' | 'heavy';
    lastOutput?: string;
  };
}

// 多版本输出
export interface WoundOstomyMultiVersionOutput {
  medicalVersion: {
    assessment: string;
    clinicalNotes: string[];
    upgradeTriggers: string[];
  };
  nursingVersion: {
    carePlan: string[];
    dressingChange: string;
    keyPoints: string[];
  };
  patientVersion: {
    explanation: string;
    selfCareInstructions: string[];
    warningSigns: string[];
  };
}

// ============================================
// 通用工具类型
// ============================================

export interface ComparisonResult {
  improved: boolean;
  changes: {
    metric: string;
    previous: unknown;
    current: unknown;
    significance: 'positive' | 'negative' | 'neutral';
  }[];
  recommendations: string[];
}

export interface TrendAnalysis {
  metric: string;
  dataPoints: { timestamp: number; value: number }[];
  trend: 'improving' | 'stable' | 'worsening';
  prediction?: string;
}
