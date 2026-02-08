/**
 * AnalysisResult Component - 分析结果展示组件
 * 展示 AI 分析结果、风险评估和建议
 */

import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Shield, 
  ArrowRight,
  Stethoscope,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import type { AnalysisResult as AnalysisResultType, RiskLevel } from '@/types/core';

interface AnalysisResultProps {
  result: AnalysisResultType;
  sceneType: 'professional' | 'consumer';
  onViewReport?: () => void;
  onStartFollowup?: () => void;
  onConfirm?: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  result,
  sceneType,
  onViewReport,
  onStartFollowup,
  onConfirm
}) => {
  // 获取风险等级颜色和图标
  const getRiskDisplay = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          label: '低风险'
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Info className="w-5 h-5 text-yellow-600" />,
          label: '中等风险'
        };
      case 'high':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          label: '高风险'
        };
      case 'critical':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          label: '危急'
        };
    }
  };

  const riskDisplay = getRiskDisplay(result.riskAssessment.level);

  return (
    <div className="space-y-6">
      {/* 风险等级卡片 */}
      <Card className={`border-2 ${riskDisplay.color}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {riskDisplay.icon}
            <div>
              <p className="text-sm text-gray-600">风险评估结果</p>
              <p className="text-2xl font-bold">{riskDisplay.label}</p>
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
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="w-5 h-5 mr-2" />
              识别特征
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.imageAnalysis.features.map((feature, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{feature.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0">
                    {Math.round(feature.confidence * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 观察记录 */}
      {result.imageAnalysis.observations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="w-5 h-5 mr-2" />
              观察记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.imageAnalysis.observations.map((obs, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
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
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              {sceneType === 'professional' ? '护理建议' : '健康建议'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-900">{rec.title}</h4>
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}
                    </Badge>
                  </div>
                  <p className="text-blue-800 text-sm">{rec.content}</p>
                  {rec.evidenceSource && (
                    <p className="text-blue-600 text-xs mt-2">
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

      {/* 操作按钮 */}
      <div className="flex flex-col space-y-3">
        {onViewReport && (
          <Button 
            onClick={onViewReport}
            className="w-full flex items-center justify-center"
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
      <p className="text-xs text-gray-500 text-center">
        {sceneType === 'consumer' 
          ? '本分析仅供参考，不能替代专业医疗诊断。如有不适，请及时就医。'
          : '本分析由 AI 辅助生成，最终诊疗决策需由医护人员根据临床判断确定。'
        }
      </p>
    </div>
  );
};

export default AnalysisResult;
