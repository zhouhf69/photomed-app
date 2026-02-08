/**
 * History Manager Service - 历史记录管理服务
 * 管理用户的健康分析历史记录
 */

import type { AnalysisHistory, HealthProfile, HealthTrend } from '@/types/healthScenes';
import type { AnalysisResult } from '@/types/core';

const STORAGE_KEY = 'medical_ai_history';
const PROFILE_KEY = 'medical_ai_profile';

/**
 * 保存分析记录
 */
export function saveAnalysisRecord(
  sceneId: string,
  sceneName: string,
  result: AnalysisResult,
  thumbnailUrl?: string
): AnalysisHistory {
  const record: AnalysisHistory = {
    id: `hist_${Date.now()}`,
    sceneId,
    sceneName,
    timestamp: Date.now(),
    thumbnailUrl,
    summary: generateSummary(result),
    riskLevel: result.riskAssessment.level,
    hasFollowup: false
  };

  const history = getAnalysisHistory();
  history.unshift(record);
  
  // 最多保存100条记录
  if (history.length > 100) {
    history.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return record;
}

/**
 * 获取分析历史
 */
export function getAnalysisHistory(): AnalysisHistory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 按场景获取历史记录
 */
export function getHistoryByScene(sceneId: string): AnalysisHistory[] {
  return getAnalysisHistory().filter(record => record.sceneId === sceneId);
}

/**
 * 获取最近的历史记录
 */
export function getRecentHistory(limit: number = 10): AnalysisHistory[] {
  return getAnalysisHistory().slice(0, limit);
}

/**
 * 删除历史记录
 */
export function deleteHistoryRecord(recordId: string): boolean {
  const history = getAnalysisHistory();
  const filtered = history.filter(record => record.id !== recordId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return history.length !== filtered.length;
}

/**
 * 清空历史记录
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 获取健康档案
 */
export function getHealthProfile(): HealthProfile | null {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * 更新健康档案
 */
export function updateHealthProfile(updates: Partial<HealthProfile>): HealthProfile {
  const existing = getHealthProfile();
  const profile: HealthProfile = {
    userId: existing?.userId || `user_${Date.now()}`,
    basicInfo: existing?.basicInfo || { age: 30, gender: 'male' },
    healthConditions: existing?.healthConditions || [],
    allergies: existing?.allergies || [],
    medications: existing?.medications || [],
    analysisHistory: existing?.analysisHistory || [],
    trends: existing?.trends || [],
    ...updates
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * 添加健康状况
 */
export function addHealthCondition(condition: string): void {
  const profile = getHealthProfile();
  const conditions = profile?.healthConditions || [];
  if (!conditions.includes(condition)) {
    updateHealthProfile({
      healthConditions: [...conditions, condition]
    });
  }
}

/**
 * 移除健康状况
 */
export function removeHealthCondition(condition: string): void {
  const profile = getHealthProfile();
  const conditions = profile?.healthConditions || [];
  updateHealthProfile({
    healthConditions: conditions.filter(c => c !== condition)
  });
}

/**
 * 添加过敏信息
 */
export function addAllergy(allergy: string): void {
  const profile = getHealthProfile();
  const allergies = profile?.allergies || [];
  if (!allergies.includes(allergy)) {
    updateHealthProfile({
      allergies: [...allergies, allergy]
    });
  }
}

/**
 * 移除过敏信息
 */
export function removeAllergy(allergy: string): void {
  const profile = getHealthProfile();
  const allergies = profile?.allergies || [];
  updateHealthProfile({
    allergies: allergies.filter(a => a !== allergy)
  });
}

/**
 * 生成健康趋势
 */
export function generateHealthTrends(sceneId: string): HealthTrend[] {
  const history = getHistoryByScene(sceneId);
  if (history.length < 2) return [];

  // 按时间排序
  const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);

  // 生成风险评分趋势
  const riskData = sorted.map(record => ({
    date: new Date(record.timestamp).toISOString().split('T')[0],
    value: record.riskLevel === 'low' ? 1 : record.riskLevel === 'medium' ? 2 : record.riskLevel === 'high' ? 3 : 4
  }));

  const trend: HealthTrend = {
    metric: '风险等级',
    data: riskData,
    trend: calculateTrendDirection(riskData)
  };

  return [trend];
}

/**
 * 计算趋势方向
 */
function calculateTrendDirection(
  data: { date: string; value: number }[]
): 'improving' | 'stable' | 'worsening' {
  if (data.length < 2) return 'stable';

  const recent = data.slice(-3);
  const avgRecent = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
  const avgPrevious = data.slice(0, -3).reduce((sum, d) => sum + d.value, 0) / Math.max(1, data.length - 3);

  const diff = avgRecent - avgPrevious;
  if (diff < -0.3) return 'improving';
  if (diff > 0.3) return 'worsening';
  return 'stable';
}

/**
 * 生成分析摘要
 */
function generateSummary(result: AnalysisResult): string {
  const concerns = result.imageAnalysis.observations.slice(0, 2).join('；');
  const riskLevel = result.riskAssessment.level === 'low' ? '低风险' :
    result.riskAssessment.level === 'medium' ? '中等风险' :
    result.riskAssessment.level === 'high' ? '高风险' : '严重';

  return `${concerns}；${riskLevel}`;
}

/**
 * 获取统计数据
 */
export function getHistoryStats(): {
  totalAnalyses: number;
  sceneBreakdown: Record<string, number>;
  riskDistribution: Record<string, number>;
  recentActivity: number;
} {
  const history = getAnalysisHistory();
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const sceneBreakdown: Record<string, number> = {};
  const riskDistribution: Record<string, number> = {};

  history.forEach(record => {
    // 场景统计
    sceneBreakdown[record.sceneId] = (sceneBreakdown[record.sceneId] || 0) + 1;
    // 风险分布
    riskDistribution[record.riskLevel] = (riskDistribution[record.riskLevel] || 0) + 1;
  });

  return {
    totalAnalyses: history.length,
    sceneBreakdown,
    riskDistribution,
    recentActivity: history.filter(r => r.timestamp > sevenDaysAgo).length
  };
}

/**
 * 导出历史记录
 */
export function exportHistory(): string {
  const history = getAnalysisHistory();
  const profile = getHealthProfile();

  const exportData = {
    exportDate: new Date().toISOString(),
    profile,
    history
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * 导入历史记录
 */
export function importHistory(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.history));
      if (data.profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
