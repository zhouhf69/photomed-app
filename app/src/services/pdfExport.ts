/**
 * PDF Export Service - PDF导出服务
 * 将健康分析报告导出为PDF格式
 * 
 * 开发：菊花教授 周宏锋
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { AnalysisResult } from '@/types/core';

export interface PDFExportOptions {
  title?: string;
  subtitle?: string;
  includeImage?: boolean;
  includeRecommendations?: boolean;
  includeDisclaimer?: boolean;
  language?: 'zh' | 'en';
}

/**
 * 导出分析报告为PDF
 */
export async function exportAnalysisToPDF(
  result: AnalysisResult,
  sceneName: string,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    title = '健康分析报告',
    subtitle = sceneName,
    includeRecommendations = true,
    includeDisclaimer = true,
    language = 'zh'
  } = options;

  // 创建PDF文档
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16
  });

  // 设置中文字体支持
  doc.setFont('helvetica');

  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // 添加标题
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // blue-500
  doc.text(title, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text(subtitle, pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;

  // 添加分析时间
  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175); // gray-400
  const dateStr = new Date(result.timestamp).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US');
  doc.text(`${language === 'zh' ? '分析时间' : 'Analysis Time'}: ${dateStr}`, margin, yPos);

  yPos += 15;

  // 添加风险等级
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`${language === 'zh' ? '风险等级' : 'Risk Level'}:`, margin, yPos);
  
  yPos += 8;
  const riskLevel = result.riskAssessment.level;
  const riskColors = {
    low: [34, 197, 94],      // green
    medium: [234, 179, 8],   // yellow
    high: [249, 115, 22],    // orange
    critical: [239, 68, 68]  // red
  };
  const riskLabels = {
    low: language === 'zh' ? '低风险' : 'Low Risk',
    medium: language === 'zh' ? '中等风险' : 'Medium Risk',
    high: language === 'zh' ? '高风险' : 'High Risk',
    critical: language === 'zh' ? '严重' : 'Critical'
  };
  
  const color = riskColors[riskLevel] || riskColors.low;
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(margin, yPos - 5, 40, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(riskLabels[riskLevel] || riskLabels.low, margin + 20, yPos + 2, { align: 'center' });

  yPos += 20;

  // 添加主要发现
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`${language === 'zh' ? '主要发现' : 'Key Findings'}`, margin, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  result.imageAnalysis.observations.forEach((obs, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    const lines = doc.splitTextToSize(`${index + 1}. ${obs}`, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 5 + 3;
  });

  // 添加建议
  if (includeRecommendations && result.recommendations.length > 0) {
    yPos += 10;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text(`${language === 'zh' ? '健康建议' : 'Recommendations'}`, margin, yPos);
    
    yPos += 8;
    result.recommendations.slice(0, 5).forEach((rec) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      
      // 优先级标记
      const priorityColors = {
        high: [239, 68, 68],
        medium: [234, 179, 8],
        low: [34, 197, 94]
      };
      const priorityColor = priorityColors[rec.priority] || priorityColors.low;
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
      doc.circle(margin + 2, yPos - 1, 2, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      const titleLines = doc.splitTextToSize(rec.title, contentWidth - 10);
      doc.text(titleLines, margin + 8, yPos);
      yPos += titleLines.length * 5 + 2;
      
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      const contentLines = doc.splitTextToSize(rec.content, contentWidth - 10);
      doc.text(contentLines, margin + 8, yPos);
      yPos += contentLines.length * 5 + 5;
    });
  }

  // 添加免责声明
  if (includeDisclaimer) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos += 10;
    doc.setDrawColor(251, 191, 36); // amber-300
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    yPos += 8;
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9); // amber-700
    const disclaimer = language === 'zh' 
      ? '免责声明：本分析结果仅供参考，不能替代专业医生的诊断和治疗建议。如有健康问题，请及时就医。'
      : 'Disclaimer: This analysis result is for reference only and cannot replace professional medical diagnosis and treatment advice. Please seek medical attention promptly if you have health concerns.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
    doc.text(disclaimerLines, margin, yPos);
  }

  // 添加页脚
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `PhotoMed - ${language === 'zh' ? '开发：菊花教授 周宏锋' : 'Developed by: Juhua Professor Zhou Hongfeng'}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `${language === 'zh' ? '第' : 'Page'} ${i} ${language === 'zh' ? '页，共' : 'of'} ${pageCount} ${language === 'zh' ? '页' : ''}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }

  // 保存PDF
  const fileName = `PhotoMed_${sceneName}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * 导出HTML元素为PDF（截图方式）
 */
export async function exportElementToPDF(
  elementId: string,
  fileName: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // 使用html2canvas截图
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/png');
  
  // 创建PDF
  const doc = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // 如果内容超过一页，需要分页
  let heightLeft = imgHeight;
  let position = 10;

  doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    doc.addPage();
    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // 添加页脚
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      'PhotoMed - 开发：菊花教授 周宏锋',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  doc.save(`${fileName}.pdf`);
}

/**
 * 生成报告分享图片
 */
export async function generateReportImage(
  elementId: string
): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff'
  });

  return canvas.toDataURL('image/png');
}
