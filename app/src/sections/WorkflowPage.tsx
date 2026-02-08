/**
 * WorkflowPage Section - 工作流页面
 * 处理具体场景的完整工作流程（增强版）
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  FileText,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Camera,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ImageCapture } from '@/components/camera/ImageCapture';
import { EnhancedAnalysisResult } from '@/components/analysis/EnhancedAnalysisResult';
import { MedicalReport } from '@/components/report/MedicalReport';
import { SceneInstructions } from '@/components/analysis/SceneInstructions';
import { sceneManager } from '@/services/sceneManager';
import { enhancedImageQAService, SCENE_CAPTURE_REQUIREMENTS } from '@/services/enhancedImageQA';
import { getScenePack, getScenePackIcon } from '@/data/scenePacks';
import { getHealthScenePack, getHealthSceneIcon } from '@/data/healthScenePacks';
import { cn } from '@/lib/utils';
import type { ScenePack, AnalysisSession, AnalysisResult as AnalysisResultType, ImageQualityResult } from '@/types/core';

interface WorkflowPageProps {
  sceneId: string;
  onBack: () => void;
}

type WorkflowStep = 'guide' | 'capture' | 'qa' | 'analyzing' | 'result' | 'report';

export const WorkflowPage: React.FC<WorkflowPageProps> = ({ sceneId, onBack }) => {
  const [scene, setScene] = useState<ScenePack | null>(null);
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('guide');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [_qaDetails, setQaDetails] = useState<ImageQualityResult & { technicalDetails?: any } | null>(null);
  const [showFullInstructions, setShowFullInstructions] = useState(false);

  useEffect(() => {
    // 加载场景配置
    const scenePack = getScenePack(sceneId) || getHealthScenePack(sceneId);
    if (scenePack) {
      setScene(scenePack);
      
      // 设置ImageQA场景
      enhancedImageQAService.setScene(sceneId);
      
      // 创建分析会话
      const userSession = {
        id: `user_${Date.now()}`,
        userId: 'demo_user',
        userType: (scenePack.type === 'professional' ? 'healthcare_provider' : 'patient') as 'healthcare_provider' | 'patient',
        role: scenePack.type === 'professional' ? 'wound_ostomy_specialist' : undefined,
        scenePacks: [sceneId],
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      };
      
      const newSession = sceneManager.createSession(userSession, sceneId);
      if (newSession) {
        setSession(newSession);
      }
    }
  }, [sceneId]);

  // 更新进度
  useEffect(() => {
    const stepProgress: Record<WorkflowStep, number> = {
      guide: 10,
      capture: 25,
      qa: 45,
      analyzing: 65,
      result: 85,
      report: 100
    };
    setProgress(stepProgress[currentStep]);
  }, [currentStep]);

  // 处理图片捕获
  const handleImageCaptured = useCallback(async (file: File, qaResult: ImageQualityResult & { technicalDetails?: any }) => {
    if (!session) return;

    setQaDetails(qaResult);
    setCurrentStep('qa');
    
    // 添加图片到会话
    const result = await sceneManager.addImage(session.id, file);
    
    if (result.success) {
      setCurrentStep('analyzing');
      
      // 执行分析
      const analysis = await sceneManager.analyze(session.id);
      
      if (analysis.success && analysis.result) {
        setAnalysisResult(analysis.result);
        setCurrentStep('result');
      } else {
        setError(analysis.error || '分析失败');
        setCurrentStep('capture');
      }
    } else {
      setError(result.error || '图片添加失败');
      setCurrentStep('capture');
    }
  }, [session]);

  // 查看报告
  const handleViewReport = useCallback(() => {
    setCurrentStep('report');
  }, []);

  // 重新开始
  const handleRestart = useCallback(() => {
    setCurrentStep('guide');
    setAnalysisResult(null);
    setQaDetails(null);
    setError(null);
    
    // 重新创建会话
    if (scene) {
      const userSession = {
        id: `user_${Date.now()}`,
        userId: 'demo_user',
        userType: (scene.type === 'professional' ? 'healthcare_provider' : 'patient') as 'healthcare_provider' | 'patient',
        scenePacks: [sceneId],
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      };
      
      const newSession = sceneManager.createSession(userSession, sceneId);
      if (newSession) {
        setSession(newSession);
      }
    }
  }, [scene, sceneId]);

  // 获取步骤标题
  const getStepTitle = (step: WorkflowStep): string => {
    const titles: Record<WorkflowStep, string> = {
      guide: '采集指导',
      capture: '拍照采集',
      qa: '质量检查',
      analyzing: '智能分析',
      result: '分析结果',
      report: '生成报告'
    };
    return titles[step];
  };

  // 获取场景图标
  const getSceneIcon = (id: string): string => {
    const icon = getScenePackIcon(id);
    if (icon !== '📋') return icon;
    return getHealthSceneIcon(id);
  };

  // 获取采集要求
  const captureRequirements = SCENE_CAPTURE_REQUIREMENTS[sceneId];

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const icon = getSceneIcon(sceneId);

  // 检测是否为移动设备
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header - 移动端优化 */}
      <header className="mobile-header">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="touch-target-lg -ml-2"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{icon}</span>
                <div>
                  <h1 className="text-base font-semibold text-gray-900 leading-tight">{scene.name}</h1>
                  <p className="text-xs text-gray-500">{getStepTitle(currentStep)}</p>
                </div>
              </div>
            </div>
            <Badge 
              variant={scene.type === 'professional' ? 'default' : 'secondary'}
              className={cn(
                "text-xs px-2 py-1",
                scene.type === 'professional' ? 'bg-green-600' : 'bg-blue-500'
              )}
            >
              {scene.type === 'professional' ? '专业' : '自测'}
            </Badge>
          </div>

          {/* 进度条 - 移动端简化 */}
          <div className="mt-3">
            <Progress value={progress} className="h-1.5 rounded-full" />
            {!isMobile && (
              <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                <span>指导</span>
                <span>拍照</span>
                <span>质检</span>
                <span>分析</span>
                <span>结果</span>
                <span>报告</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - 移动端优化 */}
      <main className={cn(
        "max-w-4xl mx-auto px-4 py-4",
        isMobile && "px-3 py-3"
      )}>
        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive" className="mb-4 rounded-xl">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {/* 步骤内容 */}
        <Card className={cn(
          "shadow-lg rounded-2xl overflow-hidden",
          isMobile && "shadow-md"
        )}>
          <CardContent className={cn(
            "p-6",
            isMobile && "p-4"
          )}>
            {/* 采集指导步骤 */}
            {currentStep === 'guide' && (
              <div className="space-y-6">
                {/* 详细说明弹窗 */}
                {showFullInstructions && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="max-h-[90vh] overflow-auto">
                      <SceneInstructions 
                        sceneId={sceneId} 
                        onClose={() => setShowFullInstructions(false)} 
                      />
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                    <Camera />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">采集指导</h2>
                  <p className="text-gray-600 mt-2">按照以下指导拍摄，确保分析准确性</p>
                </div>

                {/* 快速采集指导 */}
                <SceneInstructions sceneId={sceneId} compact />

                {/* 详细说明按钮 */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowFullInstructions(true)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  查看详细说明（含参考依据）
                </Button>

                {captureRequirements && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center">
                            <Info className="w-4 h-4 mr-2" />
                            拍摄参数
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <p><strong>距离：</strong>{captureRequirements.distance}</p>
                          <p><strong>角度：</strong>{captureRequirements.angle}</p>
                          <p><strong>光线：</strong>{captureRequirements.lighting === 'natural' ? '自然光' : captureRequirements.lighting === 'flash' ? '闪光灯' : '充足光线'}</p>
                          <p><strong>背景：</strong>{captureRequirements.background}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            拍摄技巧
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <ul className="space-y-1">
                            {captureRequirements.tips.slice(0, 4).map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        <strong>⚠️ 注意事项：</strong>
                        {captureRequirements.avoid.join('、')}
                      </p>
                    </div>
                  </>
                )}

                <Button 
                  onClick={() => setCurrentStep('capture')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  开始拍摄
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            )}

            {/* 拍照步骤 */}
            {currentStep === 'capture' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                    {icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{scene.name}</h2>
                  <p className="text-gray-600 mt-2">请按照采集指导拍摄照片</p>
                </div>
                
                <ImageCapture
                  onImageCaptured={handleImageCaptured}
                  onCancel={() => setCurrentStep('guide')}
                  guidanceText={scene.modules.find(m => m.id === 'image_capture')?.config?.guidanceText as string | undefined}
                  requireScaleReference={scene.modules.find(m => m.id === 'image_capture')?.config?.requireScaleReference as boolean | undefined}
                  showRealTimeFeedback={true}
                />
              </div>
            )}

            {/* 质量检查步骤 */}
            {currentStep === 'qa' && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">正在评估照片质量</h3>
                <p className="text-gray-600 mt-2">检查清晰度、光照、构图等多项指标...</p>
              </div>
            )}

            {/* 分析步骤 */}
            {currentStep === 'analyzing' && (
              <div className="text-center py-12">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-20 animate-pulse" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">AI 正在分析</h3>
                <p className="text-gray-600 mt-2">基于标准化评估量表进行分析...</p>
                
                <div className="mt-8 max-w-md mx-auto">
                  <div className="space-y-3">
                    {['影像特征提取', '标准化评估', '风险分析', '建议生成'].map((step) => (
                      <div key={step} className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 结果步骤 */}
            {currentStep === 'result' && analysisResult && (
              <div className="space-y-6">
                <EnhancedAnalysisResult
                  result={analysisResult}
                  sceneType={scene.type}
                  sceneId={sceneId}
                  onViewReport={handleViewReport}
                  onConfirm={() => sceneManager.completeSession(session?.id || '')}
                />
              </div>
            )}

            {/* 报告步骤 */}
            {currentStep === 'report' && analysisResult && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">健康报告</h2>
                    <p className="text-gray-600 mt-1">基于标准化评估量表生成</p>
                  </div>
                  <Button variant="outline" onClick={handleRestart}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重新检测
                  </Button>
                </div>
                
                <MedicalReport
                  analysisResult={analysisResult}
                  sceneType={scene.type}
                  sceneName={scene.name}
                  patientInfo={{
                    id: 'P' + Date.now().toString(36).toUpperCase(),
                    age: 30,
                    gender: '未知'
                  }}
                  onShare={() => console.log('分享报告')}
                  onDownload={() => console.log('下载报告')}
                  onPrint={() => window.print()}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 底部导航 */}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          
          {currentStep === 'result' && (
            <Button onClick={handleViewReport} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <FileText className="w-4 h-4 mr-2" />
              查看报告
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkflowPage;
