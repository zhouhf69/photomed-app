/**
 * Photo-first Medical Intelligence Engine - Core Types
 * 核心类型定义
 */

// ============================================
// 影像质量评估 (ImageQA)
// ============================================

export interface ImageQualityResult {
  qualityScore: number; // 0-100
  blocking: boolean;
  defects: ImageDefect[];
  retakeGuidance: string[];
  passed: boolean;
}

export interface ImageDefect {
  type: DefectType;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export type DefectType =
  | 'blur'
  | 'poor_lighting'
  | 'overexposure'
  | 'underexposure'
  | 'occlusion'
  | 'insufficient_roi'
  | 'no_scale_reference'
  | 'color_distortion'
  | 'motion_blur'
  | 'out_of_focus';

// ============================================
// 场景包系统 (Scene Pack)
// ============================================

export interface ScenePack {
  id: string;
  name: string;
  description: string;
  version: string;
  type: SceneType;
  targetAudience: TargetAudience;
  modules: SceneModule[];
  kbConfig: KnowledgeBaseConfig;
  workflow: WorkflowConfig;
}

export type SceneType = 'professional' | 'consumer';

export type TargetAudience = 
  | 'wound_ostomy_specialist'
  | 'nurse'
  | 'patient'
  | 'general_public'
  | 'caregiver';

export interface SceneModule {
  id: string;
  name: string;
  type: 'assessment' | 'analysis' | 'recommendation' | 'report' | 'followup';
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface KnowledgeBaseConfig {
  guidelines: string[];
  sops: string[];
  assessmentScales: string[];
  clinicalPathways: string[];
  educationMaterials: string[];
}

export interface WorkflowConfig {
  steps: WorkflowStep[];
  requireManualConfirm: boolean;
  autoGenerateReport: boolean;
  enableFollowup: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'image_capture' | 'image_qa' | 'analysis' | 'assessment' | 'recommendation' | 'confirmation' | 'report';
  required: boolean;
  config?: Record<string, unknown>;
}

// ============================================
// 分析结果与建议
// ============================================

export interface AnalysisResult {
  id: string;
  sceneId: string;
  timestamp: number;
  imageAnalysis: ImageAnalysis;
  riskAssessment: RiskAssessment;
  recommendations: Recommendation[];
  requiresManualReview: boolean;
  confidence: number;
}

export interface ImageAnalysis {
  features: DetectedFeature[];
  measurements: Measurement[];
  observations: string[];
}

export interface DetectedFeature {
  type: string;
  label: string;
  confidence: number;
  bbox?: [number, number, number, number]; // x, y, width, height
  description: string;
}

export interface Measurement {
  type: string;
  value: number;
  unit: string;
  method: 'auto' | 'manual' | 'estimated';
}

export interface RiskAssessment {
  level: RiskLevel;
  score?: number;
  factors: RiskFactor[];
  flags: RedFlag[];
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskFactor {
  type: string;
  description: string;
  weight: number;
}

export interface RedFlag {
  type: string;
  description: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  actionRequired: string;
}

export interface Recommendation {
  id: string;
  type: 'immediate_action' | 'lifestyle' | 'followup' | 'referral' | 'education';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
  targetAudience: TargetAudience;
  evidenceSource?: string;
  disclaimers?: string[];
}

// ============================================
// 报告与随访
// ============================================

export interface MedicalReport {
  id: string;
  sceneId: string;
  analysisId: string;
  timestamp: number;
  versions: ReportVersion[];
  status: 'draft' | 'pending_review' | 'approved' | 'archived';
}

export interface ReportVersion {
  version: number;
  timestamp: number;
  content: ReportContent;
  author: string;
  approver?: string;
}

export interface ReportContent {
  summary: string;
  findings: string[];
  assessment: string;
  recommendations: string[];
  followupPlan?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  type: 'image' | 'chart' | 'document';
  url: string;
  description: string;
}

export interface FollowupPlan {
  id: string;
  analysisId: string;
  schedule: FollowupSchedule[];
  outcomeMeasures: OutcomeMeasure[];
  status: 'active' | 'completed' | 'cancelled';
}

export interface FollowupSchedule {
  id: string;
  scheduledAt: number;
  type: 'photo_recapture' | 'assessment' | 'survey' | 'visit';
  description: string;
  completed: boolean;
  completedAt?: number;
  outcome?: Record<string, unknown>;
}

export interface OutcomeMeasure {
  type: string;
  name: string;
  baseline?: number;
  target?: number;
  current?: number;
}

// ============================================
// 知识库 (Knowledge Base)
// ============================================

export interface KnowledgeBase {
  id: string;
  name: string;
  version: string;
  layers: KBLayers;
  lastUpdated: number;
}

export interface KBLayers {
  guidelines: Guideline[];
  sops: SOP[];
  assessmentScales: AssessmentScale[];
  clinicalPathways: ClinicalPathway[];
  educationMaterials: EducationMaterial[];
  qualityControl: QualityControlRule[];
  outcomes: OutcomeRecord[];
}

export interface Guideline {
  id: string;
  title: string;
  source: string;
  version: string;
  content: string;
  applicableScenes: string[];
}

export interface SOP {
  id: string;
  title: string;
  department: string;
  version: string;
  steps: SOPStep[];
  applicableScenes: string[];
}

export interface SOPStep {
  order: number;
  description: string;
  keyPoints: string[];
  cautions?: string[];
}

export interface AssessmentScale {
  id: string;
  name: string;
  description: string;
  items: ScaleItem[];
  scoring: ScaleScoring;
}

export interface ScaleItem {
  id: string;
  name: string;
  options: ScaleOption[];
}

export interface ScaleOption {
  value: number;
  label: string;
  description: string;
}

export interface ScaleScoring {
  method: 'sum' | 'average' | 'weighted';
  ranges: ScoreRange[];
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  interpretation: string;
}

export interface ClinicalPathway {
  id: string;
  name: string;
  condition: string;
  stages: PathwayStage[];
}

export interface PathwayStage {
  name: string;
  criteria: string[];
  actions: string[];
  nextStages: string[];
}

export interface EducationMaterial {
  id: string;
  title: string;
  type: 'article' | 'video' | 'infographic' | 'checklist';
  content: string;
  targetAudience: TargetAudience[];
}

export interface QualityControlRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  severity: 'info' | 'warning' | 'error';
}

export interface OutcomeRecord {
  id: string;
  sceneId: string;
  analysisId: string;
  outcome: Record<string, unknown>;
  timestamp: number;
  validated: boolean;
}

// ============================================
// 用户与会话
// ============================================

export interface UserSession {
  id: string;
  userId: string;
  userType: 'patient' | 'healthcare_provider' | 'admin';
  role?: string;
  department?: string;
  scenePacks: string[];
  currentScene?: string;
  createdAt: number;
  expiresAt: number;
}

export interface AnalysisSession {
  id: string;
  userSessionId: string;
  sceneId: string;
  status: 'capturing' | 'qa' | 'analyzing' | 'reviewing' | 'completed';
  images: CapturedImage[];
  results?: AnalysisResult;
  report?: MedicalReport;
  createdAt: number;
  updatedAt: number;
}

export interface CapturedImage {
  id: string;
  url: string;
  timestamp: number;
  qaResult?: ImageQualityResult;
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  device?: string;
  resolution?: { width: number; height: number };
  timestamp: number;
  geolocation?: { lat: number; lng: number };
  hasScaleReference?: boolean;
}
