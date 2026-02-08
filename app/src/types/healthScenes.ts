/**
 * Health Scenes Types - 大健康场景类型定义
 * 引流模块：皮肤检测、指甲健康、口腔健康、舌苔分析
 */

import type { RiskLevel } from './core';

// ============================================
// 皮肤检测场景 (Skin Analysis)
// ============================================

export interface SkinAnalysisResult {
  skinType: SkinType;
  concerns: SkinConcern[];
  hydrationLevel: 'low' | 'normal' | 'high';
  oilinessLevel: 'low' | 'normal' | 'high';
  sensitivityLevel: 'low' | 'medium' | 'high';
  uvDamage: boolean;
  ageEstimate: number;
  recommendations: SkinRecommendation[];
  disclaimer: string;
}

export type SkinType = 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';

export interface SkinConcern {
  type: 'acne' | 'wrinkles' | 'dark_spots' | 'redness' | 'pores' | 'dark_circles' | 'uneven_tone';
  severity: 'mild' | 'moderate' | 'severe';
  area: string;
  description: string;
}

export interface SkinRecommendation {
  type: 'cleansing' | 'moisturizing' | 'sun_protection' | 'treatment' | 'lifestyle';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
  productType?: string;
}

// ============================================
// 指甲健康场景 (Nail Health)
// ============================================

export interface NailAnalysisResult {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  colorAssessment: NailColorAssessment;
  textureAssessment: NailTextureAssessment;
  shapeAssessment: NailShapeAssessment;
  abnormalities: NailAbnormality[];
  nutritionalIndicators: NutritionalIndicator[];
  recommendations: NailRecommendation[];
  disclaimer: string;
}

export interface NailColorAssessment {
  color: 'pink' | 'pale' | 'yellow' | 'blue' | 'white_spots' | 'brown_streaks' | 'other';
  description: string;
  possibleCauses: string[];
}

export interface NailTextureAssessment {
  texture: 'smooth' | 'ridges' | 'brittle' | 'pitting' | 'thickening';
  description: string;
}

export interface NailShapeAssessment {
  shape: 'normal' | 'clubbing' | 'spoon' | 'pitted' | 'beau_lines';
  description: string;
}

export interface NailAbnormality {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestedAction: string;
}

export interface NutritionalIndicator {
  nutrient: string;
  indicator: string;
  status: 'deficient' | 'adequate' | 'excess';
}

export interface NailRecommendation {
  type: 'care' | 'nutrition' | 'medical_attention';
  title: string;
  content: string;
  urgency?: 'routine' | 'soon' | 'urgent';
}

// ============================================
// 口腔健康场景 (Oral Health)
// ============================================

export interface OralAnalysisResult {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  teethAssessment: TeethAssessment;
  gumAssessment: GumAssessment;
  tongueAssessment: TongueAssessment;
  hygieneLevel: 'excellent' | 'good' | 'fair' | 'poor';
  concerns: OralConcern[];
  recommendations: OralRecommendation[];
  disclaimer: string;
}

export interface TeethAssessment {
  color: 'white' | 'slightly_yellow' | 'yellow' | 'stained';
  alignment: 'straight' | 'slightly_crooked' | 'crooked';
  visibleCavities: boolean;
  plaqueLevel: 'minimal' | 'moderate' | 'heavy';
  tartarBuildup: boolean;
}

export interface GumAssessment {
  color: 'pink' | 'red' | 'pale' | 'swollen';
  bleeding: boolean;
  recession: boolean;
  condition: 'healthy' | 'gingivitis' | 'periodontitis_risk';
}

export interface TongueAssessment {
  color: 'pink' | 'white_coated' | 'yellow_coated' | 'red' | 'pale';
  texture: 'smooth' | 'normal' | 'fissured';
  coating: 'none' | 'thin' | 'thick';
}

export interface OralConcern {
  type: 'cavity' | 'gum_disease' | 'staining' | 'bad_breath' | 'sensitivity' | 'grinding';
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface OralRecommendation {
  type: 'brushing' | 'flossing' | 'mouthwash' | 'diet' | 'dental_visit' | 'habits';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
}

// ============================================
// 舌苔分析场景 (Tongue Coating Analysis - 中医)
// ============================================

export interface TongueAnalysisResult {
  tongueColor: TongueColor;
  coatingColor: CoatingColor;
  coatingThickness: 'none' | 'thin' | 'moderate' | 'thick';
  coatingDistribution: 'even' | 'uneven' | 'root_heavy' | 'center_heavy';
  moisture: 'dry' | 'normal' | 'excess';
  shape: 'normal' | 'swollen' | 'thin' | 'tooth_marks' | 'cracked';
  tcmPattern: TCMPattern;
  bodyConstitution: BodyConstitution;
  recommendations: TCMRecommendation[];
  disclaimer: string;
}

export type TongueColor = 'pale' | 'pink' | 'red' | 'dark_red' | 'purple' | 'blue';

export type CoatingColor = 'white' | 'yellow' | 'gray' | 'black' | 'none';

export interface TCMPattern {
  name: string;
  description: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

export type BodyConstitution = 
  | 'balanced'
  | 'qi_deficiency'
  | 'yang_deficiency'
  | 'yin_deficiency'
  | 'phlegm_dampness'
  | 'damp_heat'
  | 'blood_stasis'
  | 'qi_stagnation';

export interface TCMRecommendation {
  type: 'diet' | 'lifestyle' | 'herbs' | 'acupressure' | 'exercise';
  title: string;
  content: string;
  foodsToEat?: string[];
  foodsToAvoid?: string[];
}

// ============================================
// 头发/头皮健康场景 (Hair & Scalp Analysis)
// ============================================

export interface HairAnalysisResult {
  hairType: HairType;
  scalpCondition: ScalpCondition;
  hairDensity: 'sparse' | 'normal' | 'dense';
  hairThickness: 'fine' | 'medium' | 'coarse';
  concerns: HairConcern[];
  dandruffLevel: 'none' | 'mild' | 'moderate' | 'severe';
  oilinessLevel: 'dry' | 'normal' | 'oily' | 'very_oily';
  hairLossSigns: boolean;
  recommendations: HairRecommendation[];
  disclaimer: string;
}

export type HairType = 'straight' | 'wavy' | 'curly' | 'coily';

export interface ScalpCondition {
  type: 'healthy' | 'dry' | 'oily' | 'sensitive' | 'dandruff' | 'inflamed';
  description: string;
  symptoms: string[];
}

export interface HairConcern {
  type: 'hair_loss' | 'dandruff' | 'dryness' | 'oiliness' | 'damage' | 'thinning' | 'split_ends';
  severity: 'mild' | 'moderate' | 'severe';
  area: string;
  description: string;
}

export interface HairRecommendation {
  type: 'shampoo' | 'conditioner' | 'treatment' | 'lifestyle' | 'diet' | 'professional_care';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
  productType?: string;
}

// ============================================
// 眼睛健康场景 (Eye Health Analysis)
// ============================================

export interface EyeAnalysisResult {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  scleraColor: 'white' | 'slightly_yellow' | 'yellow' | 'red';
  conjunctivaCondition: 'normal' | 'mild_redness' | 'significant_redness';
  pupilResponse: 'normal' | 'sluggish' | 'unknown';
  eyeAppearance: {
    darkCircles: 'none' | 'mild' | 'moderate' | 'severe';
    puffiness: 'none' | 'mild' | 'moderate' | 'severe';
    eyeBags: boolean;
    fineLines: 'none' | 'few' | 'moderate' | 'many';
  };
  fatigueSigns: string[];
  concerns: EyeConcern[];
  recommendations: EyeRecommendation[];
  disclaimer: string;
}

export interface EyeConcern {
  type: 'redness' | 'dryness' | 'fatigue' | 'dark_circles' | 'puffiness' | 'yellow_sclera';
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface EyeRecommendation {
  type: 'eye_care' | 'lifestyle' | 'diet' | 'medical_attention' | 'eye_exercises';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
}

// ============================================
// 足部健康场景 (Foot Health Analysis)
// ============================================

export interface FootAnalysisResult {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  skinCondition: FootSkinCondition;
  nailCondition: FootNailCondition;
  archType: 'flat' | 'normal' | 'high';
  concerns: FootConcern[];
  pressurePoints: string[];
  recommendations: FootRecommendation[];
  disclaimer: string;
}

export interface FootSkinCondition {
  dryness: 'none' | 'mild' | 'moderate' | 'severe';
  calluses: 'none' | 'mild' | 'moderate' | 'severe';
  cracks: 'none' | 'mild' | 'deep';
  athleteFoot: boolean;
  corns: boolean;
  description: string;
}

export interface FootNailCondition {
  color: 'normal' | 'yellow' | 'white' | 'discolored';
  thickness: 'normal' | 'thickened';
  fungus: boolean;
  ingrown: boolean;
  description: string;
}

export interface FootConcern {
  type: 'dry_skin' | 'calluses' | 'cracks' | 'athletes_foot' | 'nail_fungus' | 'bunions' | 'plantar_fasciitis';
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface FootRecommendation {
  type: 'foot_care' | 'footwear' | 'hygiene' | 'medical_attention' | 'moisturizing';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
}

// ============================================
// 体态姿势场景 (Posture Analysis)
// ============================================

export interface PostureAnalysisResult {
  overallPosture: 'excellent' | 'good' | 'fair' | 'poor';
  spinalAlignment: {
    cervical: 'normal' | 'forward_head' | 'lordosis';
    thoracic: 'normal' | 'kyphosis' | 'rounded_shoulders';
    lumbar: 'normal' | 'lordosis' | 'flat_back';
  };
  shoulderAlignment: 'level' | 'slight_imbalance' | 'significant_imbalance';
  hipAlignment: 'level' | 'slight_imbalance' | 'significant_imbalance';
  concerns: PostureConcern[];
  riskAreas: string[];
  recommendations: PostureRecommendation[];
  disclaimer: string;
}

export interface PostureConcern {
  type: 'forward_head' | 'rounded_shoulders' | 'kyphosis' | 'lordosis' | 'scoliosis' | 'uneven_shoulders' | 'uneven_hips';
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface PostureRecommendation {
  type: 'exercise' | 'stretching' | 'ergonomic' | 'lifestyle' | 'professional_care';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
}

// ============================================
// 通用健康建议
// ============================================

export interface HealthTip {
  category: string;
  title: string;
  content: string;
  icon?: string;
}

// ============================================
// 历史记录
// ============================================

export interface AnalysisHistory {
  id: string;
  sceneId: string;
  sceneName: string;
  timestamp: number;
  thumbnailUrl?: string;
  summary: string;
  riskLevel: RiskLevel;
  hasFollowup: boolean;
}

// ============================================
// 用户健康档案
// ============================================

export interface HealthProfile {
  userId: string;
  basicInfo: {
    age: number;
    gender: 'male' | 'female';
    height?: number;
    weight?: number;
  };
  healthConditions: string[];
  allergies: string[];
  medications: string[];
  analysisHistory: AnalysisHistory[];
  trends: HealthTrend[];
}

export interface HealthTrend {
  metric: string;
  data: { date: string; value: number }[];
  trend: 'improving' | 'stable' | 'worsening';
}
