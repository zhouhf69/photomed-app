/**
 * ImageQA Service - 影像质量评估服务
 * 对手机拍摄的医学相关照片进行质量评估
 */

import type { 
  ImageQualityResult, 
  ImageDefect, 
  DefectType 
} from '@/types/core';

// 质量评估配置
const QA_CONFIG = {
  // 最低质量分数阈值
  MIN_QUALITY_SCORE: 60,
  // 阻断规则阈值
  BLOCKING_THRESHOLD: 40,
  // 清晰度权重
  SHARPNESS_WEIGHT: 0.25,
  // 光照权重
  LIGHTING_WEIGHT: 0.25,
  // ROI覆盖权重
  ROI_WEIGHT: 0.20,
  // 颜色准确性权重
  COLOR_WEIGHT: 0.15,
  // 构图权重
  COMPOSITION_WEIGHT: 0.15,
};

// 缺陷类型配置
const DEFECT_CONFIG: Record<DefectType, {
  name: string;
  severity: 'low' | 'medium' | 'high';
  retakeGuidance: string;
}> = {
  blur: {
    name: '图像模糊',
    severity: 'high',
    retakeGuidance: '请保持手机稳定，对准伤口后轻触屏幕对焦，确保图像清晰后再拍摄。'
  },
  poor_lighting: {
    name: '光照不足',
    severity: 'medium',
    retakeGuidance: '请在光线充足的环境下拍摄，避免阴影遮挡，可使用自然光或开启闪光灯。'
  },
  overexposure: {
    name: '曝光过度',
    severity: 'medium',
    retakeGuidance: '请避免强光直射，调整角度或关闭闪光灯后重新拍摄。'
  },
  underexposure: {
    name: '曝光不足',
    severity: 'medium',
    retakeGuidance: '请在更明亮的环境下拍摄，或开启闪光灯补光。'
  },
  occlusion: {
    name: '图像被遮挡',
    severity: 'high',
    retakeGuidance: '请确保伤口/造口完全暴露在画面中，移开遮挡物后重新拍摄。'
  },
  insufficient_roi: {
    name: 'ROI覆盖不足',
    severity: 'high',
    retakeGuidance: '请将伤口/造口置于画面中央，确保占据画面主要部分（建议50%以上）。'
  },
  no_scale_reference: {
    name: '缺少标尺参考',
    severity: 'low',
    retakeGuidance: '建议在伤口旁放置标尺或硬币作为尺寸参考，便于后续测量对比。'
  },
  color_distortion: {
    name: '颜色失真',
    severity: 'medium',
    retakeGuidance: '请在自然光下拍摄，避免有色光源干扰，确保颜色真实还原。'
  },
  motion_blur: {
    name: '运动模糊',
    severity: 'high',
    retakeGuidance: '请保持手机和被摄部位都稳定不动，轻触对焦后再拍摄。'
  },
  out_of_focus: {
    name: '失焦',
    severity: 'high',
    retakeGuidance: '请点击屏幕上的伤口区域进行对焦，确保主体清晰后再拍摄。'
  }
};

/**
 * ImageQA 服务类
 */
export class ImageQAService {
  /**
   * 评估图像质量
   * @param imageData - 图像数据（可以是 File、Blob 或 base64）
   * @returns 质量评估结果
   */
  async assessImageQuality(imageData: File | Blob | string): Promise<ImageQualityResult> {
    // 模拟图像分析（实际项目中应调用 AI 模型或图像处理库）
    const analysis = await this.analyzeImage(imageData);
    
    // 计算质量分数
    const qualityScore = this.calculateQualityScore(analysis);
    
    // 检测缺陷
    const defects = this.detectDefects(analysis);
    
    // 判断是否阻断
    const blocking = this.shouldBlock(defects, qualityScore);
    
    // 生成重拍指导
    const retakeGuidance = this.generateRetakeGuidance(defects);
    
    return {
      qualityScore,
      blocking,
      defects,
      retakeGuidance,
      passed: !blocking && qualityScore >= QA_CONFIG.MIN_QUALITY_SCORE
    };
  }

  /**
   * 快速质量检查（用于实时预览）
   * @param imageData - 图像数据
   * @returns 快速评估结果
   */
  async quickCheck(imageData: File | Blob | string): Promise<{
    passed: boolean;
    score: number;
    issues: string[];
  }> {
    const result = await this.assessImageQuality(imageData);
    
    return {
      passed: result.passed,
      score: result.qualityScore,
      issues: result.defects.map(d => DEFECT_CONFIG[d.type].name)
    };
  }

  /**
   * 批量评估多张图片
   * @param images - 图像数据数组
   * @returns 批量评估结果
   */
  async assessBatch(images: (File | Blob | string)[]): Promise<{
    results: ImageQualityResult[];
    overallPassed: boolean;
    bestImageIndex: number;
  }> {
    const results = await Promise.all(
      images.map(img => this.assessImageQuality(img))
    );

    // 找出质量最高的图片
    let bestIndex = 0;
    let bestScore = 0;
    results.forEach((result, index) => {
      if (result.qualityScore > bestScore) {
        bestScore = result.qualityScore;
        bestIndex = index;
      }
    });

    return {
      results,
      overallPassed: results.some(r => r.passed),
      bestImageIndex: bestIndex
    };
  }

  /**
   * 分析图像（模拟实现）
   * 实际项目中应调用图像处理 API 或本地模型
   */
  private async analyzeImage(_imageData: File | Blob | string): Promise<{
    sharpness: number;
    brightness: number;
    contrast: number;
    roiCoverage: number;
    colorAccuracy: number;
    hasScaleReference: boolean;
    noise: number;
  }> {
    // 模拟图像分析结果
    // 实际项目中应使用 TensorFlow.js、OpenCV.js 或后端 API
    return {
      sharpness: 0.75 + Math.random() * 0.25,
      brightness: 0.6 + Math.random() * 0.4,
      contrast: 0.5 + Math.random() * 0.5,
      roiCoverage: 0.5 + Math.random() * 0.5,
      colorAccuracy: 0.7 + Math.random() * 0.3,
      hasScaleReference: Math.random() > 0.5,
      noise: Math.random() * 0.3
    };
  }

  /**
   * 计算质量分数
   */
  private calculateQualityScore(analysis: {
    sharpness: number;
    brightness: number;
    contrast: number;
    roiCoverage: number;
    colorAccuracy: number;
    hasScaleReference: boolean;
    noise: number;
  }): number {
    // 亮度评分（过亮或过暗都扣分）
    const brightnessScore = 1 - Math.abs(analysis.brightness - 0.5) * 2;
    
    // 清晰度评分（减去噪声影响）
    const sharpnessScore = Math.max(0, analysis.sharpness - analysis.noise);
    
    // 综合计算
    const score = 
      sharpnessScore * QA_CONFIG.SHARPNESS_WEIGHT +
      brightnessScore * QA_CONFIG.LIGHTING_WEIGHT +
      analysis.roiCoverage * QA_CONFIG.ROI_WEIGHT +
      analysis.colorAccuracy * QA_CONFIG.COLOR_WEIGHT +
      (analysis.hasScaleReference ? 1 : 0.5) * QA_CONFIG.COMPOSITION_WEIGHT;

    return Math.round(score * 100);
  }

  /**
   * 检测缺陷
   */
  private detectDefects(analysis: {
    sharpness: number;
    brightness: number;
    contrast: number;
    roiCoverage: number;
    colorAccuracy: number;
    hasScaleReference: boolean;
    noise: number;
  }): ImageDefect[] {
    const defects: ImageDefect[] = [];

    // 清晰度检查
    if (analysis.sharpness < 0.5) {
      defects.push({
        type: 'blur',
        severity: 'high',
        description: DEFECT_CONFIG.blur.name
      });
    } else if (analysis.sharpness < 0.7) {
      defects.push({
        type: 'out_of_focus',
        severity: 'medium',
        description: DEFECT_CONFIG.out_of_focus.name
      });
    }

    // 光照检查
    if (analysis.brightness < 0.3) {
      defects.push({
        type: 'underexposure',
        severity: 'medium',
        description: DEFECT_CONFIG.underexposure.name
      });
    } else if (analysis.brightness > 0.8) {
      defects.push({
        type: 'overexposure',
        severity: 'medium',
        description: DEFECT_CONFIG.overexposure.name
      });
    } else if (analysis.brightness < 0.4 || analysis.brightness > 0.7) {
      defects.push({
        type: 'poor_lighting',
        severity: 'low',
        description: DEFECT_CONFIG.poor_lighting.name
      });
    }

    // ROI 覆盖检查
    if (analysis.roiCoverage < 0.3) {
      defects.push({
        type: 'insufficient_roi',
        severity: 'high',
        description: DEFECT_CONFIG.insufficient_roi.name
      });
    }

    // 颜色准确性检查
    if (analysis.colorAccuracy < 0.6) {
      defects.push({
        type: 'color_distortion',
        severity: 'medium',
        description: DEFECT_CONFIG.color_distortion.name
      });
    }

    // 标尺参考检查（非阻断性）
    if (!analysis.hasScaleReference) {
      defects.push({
        type: 'no_scale_reference',
        severity: 'low',
        description: DEFECT_CONFIG.no_scale_reference.name
      });
    }

    return defects;
  }

  /**
   * 判断是否应阻断流程
   */
  private shouldBlock(defects: ImageDefect[], qualityScore: number): boolean {
    // 质量分数低于阻断阈值
    if (qualityScore < QA_CONFIG.BLOCKING_THRESHOLD) {
      return true;
    }

    // 存在高严重性缺陷
    const hasHighSeverityDefect = defects.some(d => d.severity === 'high');
    if (hasHighSeverityDefect) {
      return true;
    }

    // 存在多个中等严重性缺陷
    const mediumDefectCount = defects.filter(d => d.severity === 'medium').length;
    if (mediumDefectCount >= 2) {
      return true;
    }

    return false;
  }

  /**
   * 生成重拍指导
   */
  private generateRetakeGuidance(defects: ImageDefect[]): string[] {
    if (defects.length === 0) {
      return ['图像质量良好，可以继续下一步。'];
    }

    // 按严重性排序
    const sortedDefects = [...defects].sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    // 生成指导
    const guidance: string[] = [];
    const addedTypes = new Set<DefectType>();

    for (const defect of sortedDefects) {
      if (!addedTypes.has(defect.type)) {
        guidance.push(DEFECT_CONFIG[defect.type].retakeGuidance);
        addedTypes.add(defect.type);
      }
    }

    return guidance;
  }

  /**
   * 获取质量评估建议
   */
  getQualityTips(): string[] {
    return [
      '拍摄前清洁镜头，确保无指纹或污渍',
      '在光线充足的环境下拍摄，避免阴影',
      '将拍摄对象置于画面中央，占据50%以上画面',
      '保持手机稳定，轻触屏幕对焦',
      '如有条件，在伤口旁放置标尺作为尺寸参考',
      '避免使用有色光源，确保颜色真实还原',
      '拍摄多角度照片，便于全面评估'
    ];
  }
}

// 导出单例
export const imageQAService = new ImageQAService();
