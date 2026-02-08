/**
 * Report Share Service - 报告分享服务
 * 处理健康报告的分享功能
 */

import type { AnalysisResult } from '@/types/core';

export interface ShareConfig {
  includeImage: boolean;
  includeRecommendations: boolean;
  includeRiskAssessment: boolean;
  includeDisclaimer: boolean;
  format: 'text' | 'image' | 'pdf';
}

export interface ShareData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  timestamp: number;
  sceneName: string;
}

const SHARE_STORAGE_KEY = 'medical_ai_shared_reports';

/**
 * 生成分享文本
 */
export function generateShareText(
  result: AnalysisResult,
  sceneName: string,
  config: Partial<ShareConfig> = {}
): string {
  const fullConfig: ShareConfig = {
    includeImage: true,
    includeRecommendations: true,
    includeRiskAssessment: true,
    includeDisclaimer: true,
    format: 'text',
    ...config
  };

  const lines: string[] = [];

  // 标题
  lines.push(`【${sceneName}健康分析报告】`);
  lines.push('');

  // 分析时间
  lines.push(`分析时间：${new Date(result.timestamp).toLocaleString('zh-CN')}`);
  lines.push('');

  // 风险等级
  if (fullConfig.includeRiskAssessment) {
    const riskText = result.riskAssessment.level === 'low' ? '低风险 ✅' :
      result.riskAssessment.level === 'medium' ? '中等风险 ⚠️' :
      result.riskAssessment.level === 'high' ? '高风险 ❗' : '严重风险 🚨';
    lines.push(`风险等级：${riskText}`);
    lines.push('');
  }

  // 主要发现
  lines.push('【主要发现】');
  result.imageAnalysis.observations.forEach(obs => {
    lines.push(`• ${obs}`);
  });
  lines.push('');

  // 建议
  if (fullConfig.includeRecommendations && result.recommendations.length > 0) {
    lines.push('【健康建议】');
    result.recommendations.slice(0, 5).forEach(rec => {
      const priorityEmoji = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      lines.push(`${priorityEmoji} ${rec.title}`);
      lines.push(`   ${rec.content}`);
      lines.push('');
    });
  }

  // 免责声明
  if (fullConfig.includeDisclaimer) {
    lines.push('---');
    lines.push('⚠️ 免责声明：本分析仅供参考，不能替代专业医疗诊断。如有健康问题，请咨询专业医生。');
  }

  return lines.join('\n');
}

/**
 * 生成分享图片数据
 */
export async function generateShareImage(
  _result: AnalysisResult,
  _sceneName: string
): Promise<string | null> {
  // 在实际应用中，这里会使用html2canvas或类似库生成图片
  // 现在返回一个模拟的数据URL
  return null;
}

/**
 * 保存分享记录
 */
export function saveShareRecord(shareData: ShareData): void {
  const shares = getShareRecords();
  shares.unshift(shareData);
  
  // 最多保存50条分享记录
  if (shares.length > 50) {
    shares.pop();
  }

  localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(shares));
}

/**
 * 获取分享记录
 */
export function getShareRecords(): ShareData[] {
  try {
    const data = localStorage.getItem(SHARE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 分享到社交媒体
 */
export async function shareToSocial(
  platform: 'wechat' | 'weibo' | 'qq' | 'copy',
  text: string,
  url?: string
): Promise<boolean> {
  const shareText = `${text}${url ? `\n\n查看详情：${url}` : ''}`;

  switch (platform) {
    case 'copy':
      try {
        await navigator.clipboard.writeText(shareText);
        return true;
      } catch {
        return false;
      }

    case 'wechat':
    case 'weibo':
    case 'qq':
      // 在实际应用中，这里会调用相应的SDK
      // 现在只是模拟
      console.log(`分享到${platform}:`, shareText);
      return true;

    default:
      return false;
  }
}

/**
 * 生成分享链接
 */
export function generateShareLink(analysisId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${analysisId}`;
}

/**
 * 生成报告卡片HTML
 */
export function generateReportCardHTML(
  result: AnalysisResult,
  sceneName: string
): string {
  const riskColor = result.riskAssessment.level === 'low' ? '#4CAF50' :
    result.riskAssessment.level === 'medium' ? '#FF9800' :
    result.riskAssessment.level === 'high' ? '#F44336' : '#9C27B0';

  const riskText = result.riskAssessment.level === 'low' ? '低风险' :
    result.riskAssessment.level === 'medium' ? '中等风险' :
    result.riskAssessment.level === 'high' ? '高风险' : '严重';

  return `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 400px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    ">
      <div style="
        background: linear-gradient(135deg, ${riskColor}, ${riskColor}dd);
        color: white;
        padding: 24px;
        text-align: center;
      ">
        <h2 style="margin: 0 0 8px 0; font-size: 20px;">${sceneName}</h2>
        <p style="margin: 0; opacity: 0.9;">健康分析报告</p>
        <div style="
          display: inline-block;
          margin-top: 16px;
          padding: 8px 24px;
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          font-size: 18px;
          font-weight: bold;
        ">
          ${riskText}
        </div>
      </div>
      
      <div style="padding: 24px;">
        <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #333;">主要发现</h3>
        <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
          ${result.imageAnalysis.observations.map(obs => `<li>${obs}</li>`).join('')}
        </ul>
        
        <h3 style="margin: 24px 0 16px 0; font-size: 16px; color: #333;">健康建议</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${result.recommendations.slice(0, 3).map(rec => `
            <div style="
              padding: 12px;
              background: #f5f5f5;
              border-radius: 8px;
              border-left: 4px solid ${rec.priority === 'high' ? '#F44336' : rec.priority === 'medium' ? '#FF9800' : '#4CAF50'};
            ">
              <strong style="color: #333;">${rec.title}</strong>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">${rec.content}</p>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="
        padding: 16px 24px;
        background: #f9f9f9;
        font-size: 12px;
        color: #999;
        text-align: center;
      ">
        分析时间：${new Date(result.timestamp).toLocaleString('zh-CN')}
        <br>
        ⚠️ 本分析仅供参考，不能替代专业医疗诊断
      </div>
    </div>
  `;
}

/**
 * 下载报告为文本文件
 */
export function downloadReportAsText(
  result: AnalysisResult,
  sceneName: string
): void {
  const text = generateShareText(result, sceneName);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `健康报告_${sceneName}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * 获取分享统计
 */
export function getShareStats(): {
  totalShares: number;
  platformBreakdown: Record<string, number>;
} {
  const shares = getShareRecords();
  // 这里可以扩展为记录分享平台
  return {
    totalShares: shares.length,
    platformBreakdown: {}
  };
}
