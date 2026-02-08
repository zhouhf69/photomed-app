/**
 * Medical Report Scenes Types - 医疗报告场景类型定义
 * 体检报告分析、检测结果分析
 */

import type { RiskLevel } from './core';

// ============================================
// 体检报告分析场景 (Physical Examination Report)
// ============================================

export interface PhysicalExamReport {
  id: string;
  reportDate: string;
  institution?: string;
  basicInfo: {
    name?: string;
    gender: 'male' | 'female';
    age: number;
    height?: number;
    weight?: number;
    bmi?: number;
  };
  categories: ExamCategory[];
  abnormalItems: AbnormalItem[];
  summary: string;
  overallRisk: RiskLevel;
}

export interface ExamCategory {
  name: string;
  items: ExamItem[];
}

export interface ExamItem {
  name: string;
  value: string | number;
  unit?: string;
  referenceRange?: string;
  status: 'normal' | 'abnormal' | 'borderline' | 'critical';
  interpretation?: string;
}

export interface AbnormalItem {
  category: string;
  itemName: string;
  value: string | number;
  unit?: string;
  referenceRange: string;
  severity: 'mild' | 'moderate' | 'severe';
  clinicalSignificance: string;
  possibleCauses: string[];
  recommendations: string[];
}

export interface PhysicalExamAnalysisResult {
  report: PhysicalExamReport;
  interpretation: ReportInterpretation;
  riskAssessment: HealthRiskAssessment;
  interventionPlan: InterventionPlan;
  followupPlan: FollowupPlan;
  references: ReferenceSource[];
  disclaimer: string;
}

export interface ReportInterpretation {
  overallSummary: string;
  categoryInterpretations: CategoryInterpretation[];
  keyFindings: string[];
  positiveFindings: string[];
}

export interface CategoryInterpretation {
  category: string;
  status: 'normal' | 'attention' | 'abnormal';
  summary: string;
  details: string[];
}

export interface HealthRiskAssessment {
  overallRisk: RiskLevel;
  riskFactors: RiskFactor[];
  diseaseRisks: DiseaseRisk[];
  lifestyleRisks: LifestyleRisk[];
}

export interface RiskFactor {
  name: string;
  level: 'low' | 'moderate' | 'high';
  description: string;
  relatedItems: string[];
  evidenceSource?: string;
}

export interface DiseaseRisk {
  disease: string;
  riskLevel: RiskLevel;
  probability: number;
  contributingFactors: string[];
  preventionAdvice: string[];
}

export interface LifestyleRisk {
  aspect: string;
  currentStatus: string;
  riskLevel: RiskLevel;
  improvementSuggestions: string[];
}

export interface InterventionPlan {
  immediateActions: InterventionItem[];
  shortTermGoals: InterventionItem[];
  longTermGoals: InterventionItem[];
  lifestyleModifications: LifestyleModification[];
  medicalReferrals: MedicalReferral[];
}

export interface InterventionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  expectedOutcome: string;
  evidenceSource?: string;
}

export interface LifestyleModification {
  category: 'diet' | 'exercise' | 'sleep' | 'stress' | 'smoking' | 'alcohol';
  currentStatus: string;
  targetStatus: string;
  specificActions: string[];
  monitoringIndicators: string[];
}

export interface MedicalReferral {
  specialty: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  recommendedTests?: string[];
}

export interface FollowupPlan {
  schedule: FollowupItem[];
  monitoringItems: MonitoringItem[];
  reassessmentDate: string;
  alertConditions: AlertCondition[];
}

export interface FollowupItem {
  date: string;
  type: 'checkup' | 'test' | 'consultation' | 'self_monitoring';
  description: string;
  purpose: string;
}

export interface MonitoringItem {
  indicator: string;
  frequency: string;
  targetRange: string;
  currentValue?: string;
}

export interface AlertCondition {
  condition: string;
  symptoms: string[];
  action: string;
  urgency: 'routine' | 'urgent' | 'emergency';
}

export interface ReferenceSource {
  type: 'guideline' | 'consensus' | 'study' | 'textbook';
  title: string;
  source: string;
  year?: string;
  url?: string;
  relevance: string;
}

// ============================================
// 检测结果分析场景 (Test Result Analysis)
// ============================================

export interface TestResultAnalysis {
  testType: TestType;
  testDate: string;
  institution?: string;
  results: TestItemResult[];
  summary: string;
  interpretation: string;
  recommendations: string[];
  followupNeeded: boolean;
  references: ReferenceSource[];
}

export type TestType = 
  | 'blood_routine'
  | 'biochemistry'
  | 'urine_routine'
  | 'tumor_marker'
  | 'thyroid'
  | 'lipid_profile'
  | 'liver_function'
  | 'kidney_function'
  | 'blood_sugar'
  | 'coagulation'
  | 'infection'
  | 'other';

export interface TestItemResult {
  name: string;
  abbreviation?: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';
  clinicalSignificance: string;
  possibleCauses?: string[];
  relatedDiseases?: string[];
}

// ============================================
// 健康趋势分析
// ============================================

export interface HealthTrendAnalysis {
  indicator: string;
  unit: string;
  historicalData: TrendDataPoint[];
  trend: 'improving' | 'stable' | 'worsening' | 'fluctuating';
  analysis: string;
  prediction?: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  status: 'normal' | 'abnormal';
  notes?: string;
}

// ============================================
// 健康档案整合
// ============================================

export interface IntegratedHealthProfile {
  userId: string;
  basicInfo: {
    gender: 'male' | 'female';
    age: number;
    height?: number;
    weight?: number;
    bloodType?: string;
  };
  medicalHistory: {
    chronicDiseases: string[];
    surgeries: string[];
    allergies: string[];
    familyHistory: string[];
  };
  examReports: PhysicalExamReport[];
  testResults: TestResultAnalysis[];
  healthTrends: HealthTrendAnalysis[];
  currentRiskAssessment: HealthRiskAssessment;
  activeInterventionPlan?: InterventionPlan;
  upcomingFollowups: FollowupItem[];
}
