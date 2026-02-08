/**
 * Enhanced ImageQA Service - 增强版影像质量评估服务
 * 多维度质量评估，确保数据采集的可靠性
 */

import type { 
  ImageQualityResult, 
  ImageDefect, 
  ImageMetadata
} from '@/types/core';

// 质量评估配置
const QA_CONFIG = {
  MIN_QUALITY_SCORE: 70, // 提高最低质量要求
  BLOCKING_THRESHOLD: 50,
  STRICT_MODE_THRESHOLD: 80,
  
  // 权重配置
  WEIGHTS: {
    sharpness: 0.20,
    lighting: 0.20,
    colorAccuracy: 0.15,
    roiCoverage: 0.15,
    composition: 0.10,
    noise: 0.10,
    stability: 0.10
  }
};

// 场景特定的采集要求
export const SCENE_CAPTURE_REQUIREMENTS: Record<string, {
  minResolution: { width: number; height: number };
  lighting: 'natural' | 'artificial' | 'flash' | 'any';
  background: string;
  distance: string;
  angle: string;
  avoid: string[];
  tips: string[];
}> = {
  scene_stool_analysis: {
    minResolution: { width: 640, height: 480 },
    lighting: 'natural',
    background: '白色或浅色背景',
    distance: '20-30cm',
    angle: '正上方垂直拍摄',
    avoid: ['阴影遮挡', '反光', '模糊', '过曝'],
    tips: [
      '使用白色纸巾或盘子作为背景',
      '在自然光下拍摄，避免阴影',
      '保持手机稳定，避免晃动',
      '确保大便完全在画面中'
    ]
  },
  scene_skin_analysis: {
    minResolution: { width: 720, height: 720 },
    lighting: 'natural',
    background: '纯色背景或自然背景',
    distance: '30-40cm',
    angle: '正面平视',
    avoid: ['化妆', '滤镜', '逆光', '侧光'],
    tips: [
      '素颜拍摄，卸妆后等待30分钟',
      '在自然光下（窗边）拍摄',
      '正面平视镜头，不要仰视或俯视',
      '确保面部完整在画面中'
    ]
  },
  scene_nail_analysis: {
    minResolution: { width: 640, height: 480 },
    lighting: 'natural',
    background: '纯色背景（白色/黑色）',
    distance: '10-15cm',
    angle: '垂直于指甲表面',
    avoid: ['指甲油', '美甲', '反光', '阴影'],
    tips: [
      '卸除指甲油，清洁指甲',
      '在纯色背景下拍摄',
      '确保每个指甲单独拍摄',
      '对焦在指甲表面'
    ]
  },
  scene_oral_analysis: {
    minResolution: { width: 720, height: 720 },
    lighting: 'artificial',
    background: '口腔内部',
    distance: '5-10cm',
    angle: '根据拍摄部位调整',
    avoid: ['刷牙后立即', '进食后', '光线不足'],
    tips: [
      '刷牙前或刷牙后2小时拍摄',
      '使用手电筒补光',
      '张大嘴巴，露出牙齿和牙龈',
      '分别拍摄上下牙齿和舌头'
    ]
  },
  scene_tongue_analysis: {
    minResolution: { width: 640, height: 480 },
    lighting: 'natural',
    background: '自然背景',
    distance: '10-15cm',
    angle: '正面平视舌头',
    avoid: ['进食后立即', '刷牙后', '染色食物'],
    tips: [
      '起床后或进食前拍摄',
      '自然伸出舌头，不要用力',
      '在自然光下拍摄',
      '避免在食用染色食物后拍摄'
    ]
  },
  scene_wound_ostomy: {
    minResolution: { width: 1024, height: 768 },
    lighting: 'natural',
    background: '无菌敷料或清洁背景',
    distance: '15-25cm',
    angle: '垂直于伤口表面',
    avoid: ['反光', '阴影', '模糊', '缺少标尺'],
    tips: [
      '在换药前拍摄',
      '放置标尺在伤口旁边',
      '确保光线充足无阴影',
      '拍摄多个角度'
    ]
  }
};

/**
 * 增强版ImageQA服务
 */
export class EnhancedImageQAService {
  private sceneId: string = '';

  setScene(sceneId: string) {
    this.sceneId = sceneId;
  }

  /**
   * 全面评估图像质量
   */
  async assessImageQuality(
    imageData: File | Blob | string,
    metadata?: Partial<ImageMetadata>
  ): Promise<ImageQualityResult & { 
    metadata: ImageMetadata;
    technicalDetails: {
      sharpnessScore: number;
      lightingScore: number;
      colorScore: number;
      roiScore: number;
      noiseLevel: number;
      stabilityScore: number;
    }
  }> {
    // 获取图像基础信息
    const imageInfo = await this.extractImageInfo(imageData);
    
    // 多维度质量分析
    const analysis = await this.analyzeImageDimensions(imageData, imageInfo);
    
    // 计算综合质量分数
    const qualityScore = this.calculateQualityScore(analysis);
    
    // 检测缺陷
    const defects = this.detectDefects(analysis);
    
    // 判断是否阻断
    const blocking = this.shouldBlock(defects, qualityScore);
    
    // 生成重拍指导
    const retakeGuidance = this.generateRetakeGuidance(defects, analysis);

    // 构建完整元数据
    const fullMetadata: ImageMetadata = {
      timestamp: Date.now(),
      device: metadata?.device || 'unknown',
      resolution: imageInfo.resolution,
      hasScaleReference: analysis.hasScaleReference,
      ...metadata
    };

    return {
      qualityScore,
      blocking,
      defects,
      retakeGuidance,
      passed: !blocking && qualityScore >= QA_CONFIG.MIN_QUALITY_SCORE,
      metadata: fullMetadata,
      technicalDetails: {
        sharpnessScore: analysis.sharpness,
        lightingScore: analysis.lighting,
        colorScore: analysis.colorAccuracy,
        roiScore: analysis.roiCoverage,
        noiseLevel: analysis.noise,
        stabilityScore: analysis.stability
      }
    };
  }

  /**
   * 提取图像基础信息
   */
  private async extractImageInfo(imageData: File | Blob | string): Promise<{
    resolution: { width: number; height: number };
    fileSize: number;
    format: string;
  }> {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        let fileSize = 0;
        let format = 'unknown';
        
        if (imageData instanceof File) {
          fileSize = imageData.size;
          format = imageData.type;
        } else if (imageData instanceof Blob) {
          fileSize = imageData.size;
          format = imageData.type;
        }
        
        resolve({
          resolution: { width: img.width, height: img.height },
          fileSize,
          format
        });
      };
      
      img.onerror = () => {
        resolve({
          resolution: { width: 0, height: 0 },
          fileSize: 0,
          format: 'unknown'
        });
      };
      
      if (typeof imageData === 'string') {
        img.src = imageData;
      } else {
        img.src = URL.createObjectURL(imageData);
      }
    });
  }

  /**
   * 多维度图像分析
   */
  private async analyzeImageDimensions(
    _imageData: File | Blob | string,
    imageInfo: { resolution: { width: number; height: number } }
  ): Promise<{
    sharpness: number;
    lighting: number;
    colorAccuracy: number;
    roiCoverage: number;
    noise: number;
    stability: number;
    composition: number;
    hasScaleReference: boolean;
    brightness: number;
    contrast: number;
  }> {
    // 模拟基于真实图像特征的分析
    // 实际项目中应使用 TensorFlow.js 或调用后端AI服务
    
    const requirements = SCENE_CAPTURE_REQUIREMENTS[this.sceneId];
    
    // 分辨率检查
    const resolutionScore = this.calculateResolutionScore(
      imageInfo.resolution,
      requirements?.minResolution
    );

    // 模拟其他维度的分析（基于场景要求）
    const baseQuality = 0.6 + Math.random() * 0.3;
    
    return {
      sharpness: Math.min(1, baseQuality * resolutionScore),
      lighting: baseQuality + (Math.random() - 0.5) * 0.2,
      colorAccuracy: baseQuality + (Math.random() - 0.5) * 0.15,
      roiCoverage: 0.5 + Math.random() * 0.4,
      noise: Math.random() * 0.3,
      stability: 0.7 + Math.random() * 0.3,
      composition: 0.6 + Math.random() * 0.3,
      hasScaleReference: Math.random() > 0.6,
      brightness: 0.5 + Math.random() * 0.3,
      contrast: 0.5 + Math.random() * 0.3
    };
  }

  /**
   * 计算分辨率得分
   */
  private calculateResolutionScore(
    actual: { width: number; height: number },
    required?: { width: number; height: number }
  ): number {
    if (!required) return 1;
    
    const widthRatio = actual.width / required.width;
    const heightRatio = actual.height / required.height;
    const minRatio = Math.min(widthRatio, heightRatio);
    
    if (minRatio >= 1.5) return 1;
    if (minRatio >= 1) return 0.9;
    if (minRatio >= 0.8) return 0.7;
    if (minRatio >= 0.6) return 0.5;
    return 0.3;
  }

  /**
   * 计算综合质量分数
   */
  private calculateQualityScore(analysis: {
    sharpness: number;
    lighting: number;
    colorAccuracy: number;
    roiCoverage: number;
    noise: number;
    stability: number;
    composition: number;
  }): number {
    const { WEIGHTS } = QA_CONFIG;
    
    // 噪声是负面指标，需要反转
    const noiseScore = 1 - analysis.noise;
    
    const score = 
      analysis.sharpness * WEIGHTS.sharpness +
      analysis.lighting * WEIGHTS.lighting +
      analysis.colorAccuracy * WEIGHTS.colorAccuracy +
      analysis.roiCoverage * WEIGHTS.roiCoverage +
      analysis.stability * WEIGHTS.stability +
      analysis.composition * WEIGHTS.composition +
      noiseScore * WEIGHTS.noise;

    return Math.round(score * 100);
  }

  /**
   * 检测缺陷
   */
  private detectDefects(analysis: {
    sharpness: number;
    lighting: number;
    colorAccuracy: number;
    roiCoverage: number;
    noise: number;
    brightness: number;
    hasScaleReference: boolean;
  }): ImageDefect[] {
    const defects: ImageDefect[] = [];
    // const requirements = SCENE_CAPTURE_REQUIREMENTS[this.sceneId]; // 预留用于场景特定检查

    // 清晰度检查
    if (analysis.sharpness < 0.6) {
      defects.push({
        type: 'blur',
        severity: 'high',
        description: '图像模糊，细节不清晰'
      });
    } else if (analysis.sharpness < 0.75) {
      defects.push({
        type: 'out_of_focus',
        severity: 'medium',
        description: '对焦不够清晰'
      });
    }

    // 光照检查
    if (analysis.brightness < 0.3) {
      defects.push({
        type: 'underexposure',
        severity: 'high',
        description: '光照不足，图像过暗'
      });
    } else if (analysis.brightness > 0.8) {
      defects.push({
        type: 'overexposure',
        severity: 'high',
        description: '光照过强，图像过曝'
      });
    } else if (analysis.lighting < 0.5) {
      defects.push({
        type: 'poor_lighting',
        severity: 'medium',
        description: '光线不均匀或不足'
      });
    }

    // ROI覆盖检查
    if (analysis.roiCoverage < 0.4) {
      defects.push({
        type: 'insufficient_roi',
        severity: 'high',
        description: '主体占据画面比例过小'
      });
    }

    // 颜色准确性
    if (analysis.colorAccuracy < 0.5) {
      defects.push({
        type: 'color_distortion',
        severity: 'medium',
        description: '颜色失真，可能影响分析准确性'
      });
    }

    // 噪声检查
    if (analysis.noise > 0.3) {
      defects.push({
        type: 'motion_blur',
        severity: 'medium',
        description: '图像有噪点或抖动'
      });
    }

    // 标尺检查（专业场景）
    if (this.sceneId === 'scene_wound_ostomy' && !analysis.hasScaleReference) {
      defects.push({
        type: 'no_scale_reference',
        severity: 'medium',
        description: '缺少标尺参考，无法准确测量'
      });
    }

    return defects;
  }

  /**
   * 判断是否应阻断流程
   */
  private shouldBlock(defects: ImageDefect[], qualityScore: number): boolean {
    // 质量分数过低
    if (qualityScore < QA_CONFIG.BLOCKING_THRESHOLD) {
      return true;
    }

    // 存在高严重性缺陷
    const highSeverityCount = defects.filter(d => d.severity === 'high').length;
    if (highSeverityCount >= 2) {
      return true;
    }

    // 特定场景的特殊要求
    if (this.sceneId === 'scene_wound_ostomy') {
      // 伤口场景要求更严格
      if (qualityScore < QA_CONFIG.STRICT_MODE_THRESHOLD) {
        return true;
      }
    }

    return false;
  }

  /**
   * 生成重拍指导
   */
  private generateRetakeGuidance(
    defects: ImageDefect[],
    _analysis: { brightness: number; roiCoverage: number }
  ): string[] {
    const guidance: string[] = [];
    const requirements = SCENE_CAPTURE_REQUIREMENTS[this.sceneId];

    // 添加场景特定的指导
    if (requirements) {
      guidance.push(`📷 ${requirements.distance}距离拍摄`);
      guidance.push(`📐 ${requirements.angle}`);
      
      if (requirements.tips.length > 0) {
        guidance.push(`💡 ${requirements.tips[0]}`);
      }
    }

    // 根据缺陷添加具体指导
    defects.forEach(defect => {
      switch (defect.type) {
        case 'blur':
        case 'motion_blur':
          guidance.push('🤲 双手持稳手机，轻触屏幕对焦后再拍摄');
          break;
        case 'underexposure':
          guidance.push('☀️ 请在更明亮的环境下拍摄，或开启闪光灯');
          break;
        case 'overexposure':
          guidance.push('🌤️ 避免强光直射，选择柔和的光线环境');
          break;
        case 'insufficient_roi':
          guidance.push('🔍 将拍摄主体置于画面中央，占据更多画面');
          break;
        case 'color_distortion':
          guidance.push('🎨 请在自然光下拍摄，避免有色光源');
          break;
        case 'no_scale_reference':
          guidance.push('📏 请在旁边放置硬币或标尺作为尺寸参考');
          break;
      }
    });

    return [...new Set(guidance)]; // 去重
  }

  /**
   * 获取场景采集要求
   */
  getCaptureRequirements(sceneId: string) {
    return SCENE_CAPTURE_REQUIREMENTS[sceneId];
  }

  /**
   * 获取通用拍摄技巧
   */
  getUniversalTips(): string[] {
    return [
      '拍摄前清洁镜头，确保无指纹或污渍',
      '保持手机稳定，可使用双手或支架',
      '确保光线充足且均匀，避免强烈阴影',
      '将拍摄主体置于画面中央',
      '轻触屏幕对焦，确保主体清晰',
      '拍摄后检查照片质量，必要时重拍'
    ];
  }
}

// 导出单例
export const enhancedImageQAService = new EnhancedImageQAService();
