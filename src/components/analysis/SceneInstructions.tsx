/**
 * Scene Instructions Component - 场景使用说明组件
 * 为每个健康分析场景提供详细的操作指导
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Camera, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getSceneInstruction } from '@/data/sceneInstructions';

interface SceneInstructionsProps {
  sceneId: string;
  onClose?: () => void;
  compact?: boolean;
}

export const SceneInstructions: React.FC<SceneInstructionsProps> = ({ 
  sceneId, 
  onClose,
  compact = false 
}) => {
  const instruction = getSceneInstruction(sceneId);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    guide: true,
    references: false,
    faq: false,
    interpretation: false
  });

  if (!instruction) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center text-amber-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>暂无该场景的使用说明</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 紧凑模式 - 仅显示采集指导
  if (compact) {
    return (
      <div className="space-y-4">
        {/* 采集步骤 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Camera className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-900">{instruction.captureGuide.title}</h3>
          </div>
          
          <div className="space-y-3">
            {instruction.captureGuide.steps.map((step) => (
              <div key={step.step} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  {step.step}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.tips && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {step.tips.map((tip, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {tip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-3" />

          {/* 要求和禁忌 */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                拍摄要求
              </p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {instruction.captureGuide.requirements.slice(0, 3).map((req, idx) => (
                  <li key={idx}>• {req}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-red-700 mb-1 flex items-center">
                <XCircle className="w-4 h-4 mr-1" />
                注意事项
              </p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {instruction.captureGuide.avoidList.slice(0, 3).map((avoid, idx) => (
                  <li key={idx}>• {avoid}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 完整模式
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
              {instruction.icon}
            </div>
            <div>
              <CardTitle className="text-xl">{instruction.name} - 使用指南</CardTitle>
              <p className="text-sm text-gray-500">请按照以下指导进行操作</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              关闭
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 采集指导 */}
        <div className="border rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('guide')}
          >
            <div className="flex items-center">
              <Camera className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">{instruction.captureGuide.title}</span>
            </div>
            {expandedSections.guide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.guide && (
            <div className="p-4 space-y-4">
              {/* 步骤 */}
              <div className="space-y-3">
                {instruction.captureGuide.steps.map((step) => (
                  <div key={step.step} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium mr-3">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{step.title}</p>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {step.tips && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {step.tips.map((tip, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              💡 {tip}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* 要求和禁忌 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-700 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    拍摄要求
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {instruction.captureGuide.requirements.map((req, idx) => (
                      <li key={idx}>✓ {req}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-700 mb-2 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    注意事项
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {instruction.captureGuide.avoidList.map((avoid, idx) => (
                      <li key={idx}>✗ {avoid}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 参考依据 */}
        <div className="border rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('references')}
          >
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium">参考依据</span>
            </div>
            {expandedSections.references ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.references && (
            <div className="p-4 space-y-4">
              {/* 指南 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">参考指南</p>
                <div className="flex flex-wrap gap-2">
                  {instruction.references.guidelines.map((guide, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {guide}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 标准 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">评估标准</p>
                <div className="flex flex-wrap gap-2">
                  {instruction.references.standards.map((std, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                      {std}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 来源 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">权威来源</p>
                <div className="space-y-2">
                  {instruction.references.sources.map((source, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <span className="font-medium text-gray-900 mr-2">{source.name}</span>
                      <span className="text-gray-500">- {source.description}</span>
                      {source.url && (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 结果解读 */}
        <div className="border rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('interpretation')}
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">{instruction.resultInterpretation.title}</span>
            </div>
            {expandedSections.interpretation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.interpretation && (
            <div className="p-4">
              <div className="space-y-3">
                {instruction.resultInterpretation.levels.map((level, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={
                        idx === 0 ? 'bg-green-500' :
                        idx === 1 ? 'bg-blue-500' :
                        idx === 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }>
                        {level.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{level.description}</p>
                    <p className="text-sm text-blue-600">💡 {level.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 常见问题 */}
        <div className="border rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('faq')}
          >
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 text-amber-600 mr-2" />
              <span className="font-medium">常见问题</span>
            </div>
            {expandedSections.faq ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.faq && (
            <div className="p-4 space-y-3">
              {instruction.faq.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-1">Q: {item.question}</p>
                  <p className="text-sm text-gray-600">A: {item.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 免责声明 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>重要提示：</strong>本分析结果仅供参考，不能替代专业医疗诊断。如有健康问题，请及时咨询专业医生。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SceneInstructions;
