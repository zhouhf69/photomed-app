/**
 * EnhancedAnalysisResult Component - 增强版分析结果展示组件
 * 展示AI分析结果、置信度、评估依据和来源
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Shield, 
  ArrowRight,
  Stethoscope,
  Calendar,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  AlertOctagon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { AnalysisResult as AnalysisResultType, RiskLevel } from '@/types/core';
import { getConfidenceLevel } from '@/data/assessmentScales';
import { getSceneInstruction } from '@/data/sceneInstructions';

interface EnhancedAnalysisResultProps {
  result: AnalysisResultType;
  sceneType: 'professional' | 'consumer';
  sceneId: string;
  onViewReport?: () => void;
  onStartFollowup?: () => void;
  onConfirm?: () => void;
}

export const EnhancedAnalysisResult: React.FC<EnhancedAnalysisResultProps> = ({
  result,
  sceneType,
  sceneId,
  onViewReport,
  onStartFollowup,
  onConfirm
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  // 获取风险等级显示
  const getRiskDisplay = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          label: '低风险',
          description: '当前状态良好，继续保持'
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Info className="w-5 h-5 text-yellow-600" />,
          label: '中等风险',
          description: '需要关注，建议采取相应措施'
        };
      case 'high':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          label: '高风险',
          description: '需要重点关注，建议咨询专业人士'
        };
      case 'critical':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertOctagon className="w-5 h-5 text-red-600" />,
          label: '危急',
          description: '需要立即采取行动'
        };
    }
  };

  // 获取置信度显示
  const confidenceLevel = getConfidenceLevel(result.confidence);
  const confidenceColor = result.confidence >= 0.8 ? 'text-green-600' : 
                         result.confidence >= 0.7 ? 'text-yellow-600' : 'text-orange-600';
  const confidenceBg = result.confidence >= 0.8 ? 'bg-green-100' : 
                      result.confidence >= 0.7 ? 'bg-yellow-100' : 'bg-orange-100';

  const riskDisplay = getRiskDisplay(result.riskAssessment.level);

  // 获取场景对应的评估标准
  const getAssessmentStandard = () => {
    const standards: Record<string, string> = {
      scene_stool_analysis: '布里斯托大便分类量表 (Bristol Stool Scale)',
      scene_skin_analysis: '皮肤类型评估标准 (Fitzpatrick/Baumann)',
      scene_nail_analysis: '指甲健康评估标准',
      scene_oral_analysis: '口腔健康评估标准 (WHO)',
      scene_tongue_analysis: '中医体质辨识标准 (中医体质分类与判定)',
      scene_hair_analysis: '头皮健康评估标准',
      scene_eye_analysis: '眼表健康评估标准',
      scene_foot_analysis: '足部健康评估标准 (APMA)',
      scene_posture_analysis: '体态评估标准 (APTA)',
      scene_wound_ostomy: 'PUSH压疮愈合量表'
    };
    return standards[sceneId] || '专业评估标准';
  };

  // 获取参考来源
  const instruction = getSceneInstruction(sceneId);
  const references = instruction?.references;

  return (
    <div className="space-y-6">
      {/* 置信度和风险综合卡片 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* 置信度卡片 */}
        <Card className={`border-2 ${confidenceBg}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Award className={`w-5 h-5 ${confidenceColor}`} />
                <span className="text-sm font-medium text-gray-600">分析可信度</span>
              </div>
              <Badge variant="outline" className={confidenceColor}>
                {confidenceLevel.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${confidenceColor}`}>
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
              <Progress 
                value={result.confidence * 100} 
                className="h-2"
              />
              <p className="text-xs text-gray-500">{confidenceLevel.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* 风险等级卡片 */}
        <Card className={`border-2 ${riskDisplay.color}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              {riskDisplay.icon}
              <div>
                <p className="text-sm text-gray-600">风险评估</p>
                <p className="text-xl font-bold">{riskDisplay.label}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{riskDisplay.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* 评估标准说明 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">评估依据</p>
              <p className="text-sm text-blue-800">
                本分析基于 <strong>{getAssessmentStandard()}</strong> 进行
              </p>
              
              {/* 参考来源 */}
              {references && (
                <div className="mt-3 space-y-2">
                  {references.guidelines.length > 0 && (
                    <div>
                      <p className="text-xs text-blue-700 font-medium">参考指南：</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {references.guidelines.map((guide, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {guide}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {references.sources.length > 0 && (
                    <div>
                      <p className="text-xs text-blue-700 font-medium">权威来源：</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        {references.sources.slice(0, 3).map((source, idx) => (
                          <span key={idx} className="text-xs text-blue-600">
                            {source.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-blue-600 mt-3">
                分析结果仅供参考，不能替代专业医疗诊断
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 红旗警示 */}
      {result.riskAssessment.flags.length > 0 && (
        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-red-800 font-semibold">需要关注</AlertTitle>
          <AlertDescription className="text-red-700 mt-2">
            <ul className="space-y-2">
              {result.riskAssessment.flags.map((flag, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{flag.description}</p>
                    <p className="text-sm mt-1">{flag.actionRequired}</p>
                  </div>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* 发现特征 */}
      {result.imageAnalysis.features.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="w-5 h-5 mr-2" />
              识别特征
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.imageAnalysis.features.map((feature, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-800">{feature.label}</p>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(feature.confidence * 100)}% 置信度
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 风险因素详情 */}
      {result.riskAssessment.factors.length > 0 && (
        <Collapsible open={showEvidence} onOpenChange={setShowEvidence}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    风险评估详情
                  </CardTitle>
                  {showEvidence ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-3">
                  {result.riskAssessment.factors.map((factor, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{factor.type}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">影响权重</span>
                          <Progress value={factor.weight * 100} className="w-16 h-2" />
                          <span className="text-xs font-medium">{Math.round(factor.weight * 100)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* 观察记录 */}
      {result.imageAnalysis.observations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Info className="w-5 h-5 mr-2" />
              观察记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.imageAnalysis.observations.map((obs, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="mr-2 text-blue-500">•</span>
                  {obs}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 建议 */}
      {result.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              {sceneType === 'professional' ? '护理建议' : '健康建议'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-900">{rec.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-blue-800 text-sm">{rec.content}</p>
                  {rec.evidenceSource && (
                    <p className="text-blue-600 text-xs mt-2 flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      来源：{rec.evidenceSource}
                    </p>
                  )}
                  {rec.disclaimers && rec.disclaimers.length > 0 && (
                    <p className="text-gray-500 text-xs mt-2 italic">
                      {rec.disclaimers[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 专业场景：需要人工确认提示 */}
      {sceneType === 'professional' && result.requiresManualReview && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">需要人工确认</AlertTitle>
          <AlertDescription className="text-amber-700">
            本分析结果需要经伤口造口师或专业医护人员确认后方可执行。
          </AlertDescription>
        </Alert>
      )}

      {/* 技术详情（可折叠） */}
      <Collapsible open={showTechnicalDetails} onOpenChange={setShowTechnicalDetails}>
        <Card className="bg-gray-50">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600">技术详情</CardTitle>
                {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="text-xs text-gray-500 space-y-1">
                <p>分析ID: {result.id}</p>
                <p>场景: {sceneId}</p>
                <p>置信度: {(result.confidence * 100).toFixed(1)}%</p>
                <p>风险等级: {result.riskAssessment.level}</p>
                <p>时间: {new Date(result.timestamp).toLocaleString('zh-CN')}</p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 操作按钮 */}
      <div className="flex flex-col space-y-3">
        {onViewReport && (
          <Button 
            onClick={onViewReport}
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <span>查看完整报告</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {sceneType === 'professional' && onConfirm && (
          <Button 
            onClick={onConfirm}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>确认分析结果</span>
          </Button>
        )}

        {onStartFollowup && (
          <Button 
            onClick={onStartFollowup}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span>设置随访计划</span>
          </Button>
        )}
      </div>

      {/* 免责声明 */}
      <Separator />
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-xs text-gray-500 text-center">
          <strong>免责声明：</strong>
          {sceneType === 'consumer' 
            ? '本分析基于标准化评估量表，仅供参考，不能替代专业医疗诊断。如有不适，请及时就医。'
            : '本分析由 AI 辅助生成，基于标准化临床评估工具，最终诊疗决策需由医护人员根据临床判断确定。'
          }
        </p>
      </div>
    </div>
  );
};

export default EnhancedAnalysisResult;
