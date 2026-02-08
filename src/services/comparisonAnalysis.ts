/**
 * Comparison Analysis Service - 多图对比分析服务
 * 支持多张图片的对比分析功能
 */

import type { AnalysisResult } from '@/types/core';

export interface ComparisonItem {
  id: string;
  imageUrl: string;
  timestamp: number;
  result: AnalysisResult;
  label?: string;
}

export interface ComparisonResult {
  items: ComparisonItem[];
  changes: DetectedChange[];
  trends: TrendAnalysis;
  summary: string;
}

export interface DetectedChange {
  feature: string;
  from: string;
  to: string;
  direction: 'improved' | 'worsened' | 'unchanged';
  significance: 'minor' | 'moderate' | 'significant';
}

export interface TrendAnalysis {
  overall: 'improving' | 'stable' | 'worsening';
  confidence: number;
  factors: string[];
}

/**
 * 执行多图对比分析
 */
export function compareAnalyses(items: ComparisonItem[]): ComparisonResult {
  if (items.length < 2) {
    return {
      items,
      changes: [],
      trends: {
        overall: 'stable',
        confidence: 0,
        factors: []
      },
      summary: '需要至少两张图片进行对比分析'
    };
  }

  // 按时间排序
  const sortedItems = [...items].sort((a, b) => a.timestamp - b.timestamp);

  // 检测变化
  const changes = detectChanges(sortedItems);

  // 分析趋势
  const trends = analyzeTrends(sortedItems, changes);

  // 生成摘要
  const summary = generateComparisonSummary(sortedItems, changes, trends);

  return {
    items: sortedItems,
    changes,
    trends,
    summary
  };
}

/**
 * 检测变化
 */
function detectChanges(items: ComparisonItem[]): DetectedChange[] {
  const changes: DetectedChange[] = [];
  const first = items[0];
  const last = items[items.length - 1];

  // 对比风险等级
  const riskLevels = ['low', 'medium', 'high', 'critical'];
  const firstRisk = riskLevels.indexOf(first.result.riskAssessment.level);
  const lastRisk = riskLevels.indexOf(last.result.riskAssessment.level);

  if (firstRisk !== lastRisk) {
    changes.push({
      feature: '风险等级',
      from: getRiskText(first.result.riskAssessment.level),
      to: getRiskText(last.result.riskAssessment.level),
      direction: lastRisk < firstRisk ? 'improved' : 'worsened',
      significance: Math.abs(lastRisk - firstRisk) >= 2 ? 'significant' : 'moderate'
    });
  }

  // 对比观察结果数量
  const firstObs = first.result.imageAnalysis.observations.length;
  const lastObs = last.result.imageAnalysis.observations.length;

  if (Math.abs(firstObs - lastObs) >= 2) {
    changes.push({
      feature: '问题数量',
      from: `${firstObs}项`,
      to: `${lastObs}项`,
      direction: lastObs < firstObs ? 'improved' : 'worsened',
      significance: Math.abs(lastObs - firstObs) >= 3 ? 'significant' : 'moderate'
    });
  }

  // 对比特征检测
  const firstFeatures = first.result.imageAnalysis.features;
  const lastFeatures = last.result.imageAnalysis.features;

  // 检查新增或消失的特征
  firstFeatures.forEach(firstFeat => {
    const matchingFeat = lastFeatures.find(f => f.type === firstFeat.type);
    if (matchingFeat) {
      // 特征存在，检查置信度变化
      const confidenceDiff = matchingFeat.confidence - firstFeat.confidence;
      if (Math.abs(confidenceDiff) > 0.15) {
        changes.push({
          feature: firstFeat.label,
          from: `${Math.round(firstFeat.confidence * 100)}%`,
          to: `${Math.round(matchingFeat.confidence * 100)}%`,
          direction: confidenceDiff > 0 ? 'improved' : 'worsened',
          significance: Math.abs(confidenceDiff) > 0.3 ? 'significant' : 'moderate'
        });
      }
    }
  });

  return changes;
}

/**
 * 分析趋势
 */
function analyzeTrends(items: ComparisonItem[], changes: DetectedChange[]): TrendAnalysis {
  if (items.length < 2) {
    return {
      overall: 'stable',
      confidence: 0,
      factors: []
    };
  }

  // 统计改善和恶化的变化
  const improved = changes.filter(c => c.direction === 'improved').length;
  const worsened = changes.filter(c => c.direction === 'worsened').length;

  let overall: 'improving' | 'stable' | 'worsening';
  if (improved > worsened * 1.5) {
    overall = 'improving';
  } else if (worsened > improved * 1.5) {
    overall = 'worsening';
  } else {
    overall = 'stable';
  }

  // 计算置信度
  const confidence = Math.min(0.95, items.length * 0.15 + 0.3);

  // 提取影响因素
  const factors = changes
    .filter(c => c.significance !== 'minor')
    .map(c => c.feature);

  return {
    overall,
    confidence,
    factors: [...new Set(factors)]
  };
}

/**
 * 生成对比摘要
 */
function generateComparisonSummary(
  items: ComparisonItem[],
  changes: DetectedChange[],
  trends: TrendAnalysis
): string {
  const lines: string[] = [];

  const firstDate = new Date(items[0].timestamp).toLocaleDateString('zh-CN');
  const lastDate = new Date(items[items.length - 1].timestamp).toLocaleDateString('zh-CN');

  lines.push(`对比分析了${items.length}次检测结果，时间跨度从${firstDate}到${lastDate}。`);
  lines.push('');

  if (changes.length === 0) {
    lines.push('期间各项指标保持相对稳定，没有明显变化。');
  } else {
    lines.push(`检测到${changes.length}项变化：`);
    lines.push('');

    const improved = changes.filter(c => c.direction === 'improved');
    const worsened = changes.filter(c => c.direction === 'worsened');

    if (improved.length > 0) {
      lines.push('✅ 改善项：');
      improved.forEach(c => {
        lines.push(`  • ${c.feature}：从${c.from}变为${c.to}`);
      });
      lines.push('');
    }

    if (worsened.length > 0) {
      lines.push('⚠️ 需关注项：');
      worsened.forEach(c => {
        lines.push(`  • ${c.feature}：从${c.from}变为${c.to}`);
      });
      lines.push('');
    }
  }

  // 趋势总结
  const trendEmoji = trends.overall === 'improving' ? '📈' :
    trends.overall === 'worsening' ? '📉' : '➡️';
  const trendText = trends.overall === 'improving' ? '整体呈改善趋势' :
    trends.overall === 'worsening' ? '整体需加强关注' : '整体保持平稳';

  lines.push(`${trendEmoji} ${trendText}（置信度：${Math.round(trends.confidence * 100)}%）`);

  if (trends.factors.length > 0) {
    lines.push(`主要影响因素：${trends.factors.join('、')}`);
  }

  return lines.join('\n');
}

/**
 * 获取风险等级文本
 */
function getRiskText(level: string): string {
  const texts: Record<string, string> = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险',
    critical: '严重'
  };
  return texts[level] || level;
}

/**
 * 生成时间线数据
 */
export function generateTimelineData(items: ComparisonItem[]): {
  date: string;
  riskLevel: number;
  observationCount: number;
  confidence: number;
}[] {
  return items.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString('zh-CN'),
    riskLevel: ['low', 'medium', 'high', 'critical'].indexOf(item.result.riskAssessment.level) + 1,
    observationCount: item.result.imageAnalysis.observations.length,
    confidence: item.result.confidence
  }));
}

/**
 * 计算变化百分比
 */
export function calculateChangePercentage(
  items: ComparisonItem[],
  metric: 'risk' | 'observations' | 'confidence'
): number {
  if (items.length < 2) return 0;

  const sorted = [...items].sort((a, b) => a.timestamp - b.timestamp);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  let firstValue: number;
  let lastValue: number;

  switch (metric) {
    case 'risk':
      firstValue = ['low', 'medium', 'high', 'critical'].indexOf(first.result.riskAssessment.level);
      lastValue = ['low', 'medium', 'high', 'critical'].indexOf(last.result.riskAssessment.level);
      break;
    case 'observations':
      firstValue = first.result.imageAnalysis.observations.length;
      lastValue = last.result.imageAnalysis.observations.length;
      break;
    case 'confidence':
      firstValue = first.result.confidence;
      lastValue = last.result.confidence;
      break;
    default:
      return 0;
  }

  if (firstValue === 0) return lastValue > 0 ? 100 : 0;
  return ((lastValue - firstValue) / firstValue) * 100;
}

/**
 * 生成对比报告
 */
export function generateComparisonReport(comparison: ComparisonResult): string {
  const lines: string[] = [];

  lines.push('========================================');
  lines.push('         健康对比分析报告');
  lines.push('========================================');
  lines.push('');

  lines.push(comparison.summary);
  lines.push('');

  if (comparison.changes.length > 0) {
    lines.push('----------------------------------------');
    lines.push('详细变化：');
    lines.push('----------------------------------------');
    lines.push('');

    comparison.changes.forEach(change => {
      const emoji = change.direction === 'improved' ? '✅' :
        change.direction === 'worsened' ? '⚠️' : '➡️';
      lines.push(`${emoji} ${change.feature}`);
      lines.push(`   变化：${change.from} → ${change.to}`);
      lines.push(`   程度：${change.significance === 'significant' ? '显著' : change.significance === 'moderate' ? '中等' : '轻微'}`);
      lines.push('');
    });
  }

  lines.push('----------------------------------------');
  lines.push('趋势分析：');
  lines.push('----------------------------------------');
  lines.push(`整体趋势：${comparison.trends.overall === 'improving' ? '改善' : comparison.trends.overall === 'worsening' ? '恶化' : '稳定'}`);
  lines.push(`分析置信度：${Math.round(comparison.trends.confidence * 100)}%`);
  lines.push('');

  lines.push('----------------------------------------');
  lines.push('分析记录：');
  lines.push('----------------------------------------');
  comparison.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${new Date(item.timestamp).toLocaleString('zh-CN')}`);
    lines.push(`   风险等级：${getRiskText(item.result.riskAssessment.level)}`);
    lines.push(`   发现问题：${item.result.imageAnalysis.observations.length}项`);
    lines.push('');
  });

  lines.push('========================================');
  lines.push('⚠️ 本报告仅供参考，不能替代专业医疗诊断');
  lines.push('========================================');

  return lines.join('\n');
}
