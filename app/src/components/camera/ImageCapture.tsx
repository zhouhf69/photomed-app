/**
 * ImageCapture Component - 影像采集组件（移动端优化版）
 * 针对手机触摸优化的拍照、相册选择、实时质量反馈
 */

import React, { useState, useRef, useCallback } from 'react';
import { Camera, Image as ImageIcon, X, Check, AlertCircle, RefreshCw, Zap, Sun, Focus, Maximize, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { enhancedImageQAService } from '@/services/enhancedImageQA';
import type { ImageQualityResult } from '@/types/core';

interface ImageCaptureProps {
  onImageCaptured: (file: File, qaResult: ImageQualityResult & { technicalDetails?: any }) => void;
  onCancel?: () => void;
  guidanceText?: string;
  requireScaleReference?: boolean;
  showRealTimeFeedback?: boolean;
}

export const ImageCapture: React.FC<ImageCaptureProps> = ({
  onImageCaptured,
  onCancel,
  guidanceText = '请将拍摄对象置于画面中央，确保光线充足',
  requireScaleReference = false,
  showRealTimeFeedback = true
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [qaResult, setQaResult] = useState<(ImageQualityResult & { technicalDetails?: any }) | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理文件选择
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 预览图片
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);
    setIsAnalyzing(true);

    try {
      // 使用增强版质量评估
      const result = await enhancedImageQAService.assessImageQuality(file, {
        device: navigator.userAgent
      });
      setQaResult(result);

      // 如果通过质量检查，自动提交
      if (result.passed) {
        setTimeout(() => {
          onImageCaptured(file, result);
        }, 800);
      }
    } catch (error) {
      console.error('质量评估失败:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [onImageCaptured]);

  // 重新拍摄
  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setQaResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // 确认使用
  const handleConfirm = useCallback(() => {
    if (capturedImage && qaResult?.passed) {
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
          onImageCaptured(file, qaResult);
        });
    }
  }, [capturedImage, qaResult, onImageCaptured]);

  // 获取质量分数颜色
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 获取质量状态
  const getScoreStatus = (score: number): { label: string; color: string } => {
    if (score >= 80) return { label: '质量优秀', color: 'bg-green-100 text-green-800' };
    if (score >= 70) return { label: '质量良好', color: 'bg-blue-100 text-blue-800' };
    if (score >= 60) return { label: '质量一般', color: 'bg-yellow-100 text-yellow-800' };
    return { label: '质量较差', color: 'bg-red-100 text-red-800' };
  };

  // 渲染技术指标
  const renderTechnicalDetails = (details: any) => {
    if (!details) return null;

    const metrics = [
      { label: '清晰度', value: details.sharpnessScore, icon: Focus },
      { label: '光照', value: details.lightingScore, icon: Sun },
      { label: '颜色', value: details.colorScore, icon: Zap },
      { label: '构图', value: details.roiScore, icon: Maximize }
    ];

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-600 mb-3">技术指标</p>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between text-sm py-2 px-3 bg-white rounded-lg">
              <span className="flex items-center text-gray-500">
                <metric.icon className="w-4 h-4 mr-2" />
                {metric.label}
              </span>
              <span className={cn(
                "font-medium",
                metric.value >= 0.7 ? 'text-green-600' : metric.value >= 0.5 ? 'text-yellow-600' : 'text-red-600'
              )}>
                {Math.round(metric.value * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col">
      {/* 移动端优化的拍摄提示 */}
      {showTips && !capturedImage && (
        <div className="mb-4">
          <Alert className="bg-blue-50 border-blue-200 rounded-xl">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <AlertDescription className="text-blue-800 text-sm leading-relaxed ml-2">
              {guidanceText}
              {requireScaleReference && '，请在旁边放置标尺或硬币作为尺寸参考'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* 拍摄区域 */}
      {!capturedImage ? (
        <Card className="flex-1 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-2xl">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="flex flex-col items-center space-y-6">
              {/* 大图标按钮 - 移动端友好 */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-12 h-12 text-blue-500" />
              </div>
              
              <p className="text-gray-600 text-center text-lg font-medium">
                拍照或从相册选择
              </p>

              {/* 移动端优化的大按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <Button
                  variant="default"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-3 py-4 text-base rounded-xl touch-target-lg"
                >
                  <Camera className="w-5 h-5" />
                  <span>拍照</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-3 py-4 text-base rounded-xl touch-target-lg"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>相册</span>
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* 可折叠的拍摄技巧 */}
            <div className="mt-8 w-full">
              <button 
                onClick={() => setShowTips(!showTips)}
                className="flex items-center justify-center w-full text-sm text-gray-500 py-2"
              >
                <span>拍摄技巧</span>
                <ChevronUp className={cn("w-4 h-4 ml-1 transition-transform", !showTips && "rotate-180")} />
              </button>
              
              {showTips && (
                <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                  <ul className="text-sm text-gray-600 space-y-2">
                    {enhancedImageQAService.getUniversalTips().slice(0, 4).map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">
                          {index + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 预览区域 - 移动端优化 */
        <div className="flex flex-col h-full">
          {/* 图片预览 - 全屏模式 */}
          <div className="relative flex-1 min-h-0 bg-black rounded-2xl overflow-hidden">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain"
            />
            
            {/* 关闭按钮 - 更大的触摸区域 */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:bg-black/80 transition-colors touch-target-lg"
              aria-label="关闭"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 质量评估结果 - 底部面板 */}
          <div className="mt-4 space-y-4">
            {isAnalyzing ? (
              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-center space-x-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-gray-600 text-base">正在评估照片质量...</span>
                </div>
              </Card>
            ) : qaResult && showRealTimeFeedback ? (
              <Card className={cn(
                "border-2 rounded-2xl overflow-hidden",
                qaResult.passed ? 'border-green-200' : 'border-red-200'
              )}>
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* 质量分数 - 大字体 */}
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-700">质量评分</span>
                      <Badge className={cn("px-3 py-1 text-sm", getScoreStatus(qaResult.qualityScore).color)}>
                        {getScoreStatus(qaResult.qualityScore).label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-baseline justify-between">
                      <span className={cn("text-4xl font-bold", getScoreColor(qaResult.qualityScore))}>
                        {qaResult.qualityScore}
                      </span>
                      <span className="text-gray-400 text-lg">/100</span>
                    </div>
                    
                    <Progress 
                      value={qaResult.qualityScore} 
                      className="h-3 rounded-full"
                    />

                    {/* 技术指标 */}
                    {qaResult.technicalDetails && renderTechnicalDetails(qaResult.technicalDetails)}

                    {/* 缺陷提示 */}
                    {qaResult.defects.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">检测到的问题：</p>
                        <div className="space-y-2">
                          {qaResult.defects.map((defect, index) => (
                            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                              <AlertCircle className={cn(
                                "w-5 h-5 mr-2 flex-shrink-0 mt-0.5",
                                defect.severity === 'high' ? 'text-red-500' : 
                                defect.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                              )} />
                              <span className="text-sm text-gray-700">{defect.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 重拍指导 */}
                    {!qaResult.passed && qaResult.retakeGuidance.length > 0 && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <p className="text-sm font-medium text-amber-800 mb-2">改进建议：</p>
                        <ul className="text-sm text-amber-700 space-y-1">
                          {qaResult.retakeGuidance.map((guidance, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">💡</span>
                              {guidance}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 操作按钮 - 移动端全宽 */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      {!qaResult.passed && (
                        <Button
                          variant="outline"
                          onClick={handleRetake}
                          className="flex-1 flex items-center justify-center gap-2 py-4 text-base rounded-xl touch-target-lg"
                        >
                          <RefreshCw className="w-5 h-5" />
                          <span>重新拍摄</span>
                        </Button>
                      )}
                      
                      {qaResult.passed && (
                        <Button
                          onClick={handleConfirm}
                          className="flex-1 flex items-center justify-center gap-2 py-4 text-base rounded-xl touch-target-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          <Check className="w-5 h-5" />
                          <span>确认使用</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCapture;
