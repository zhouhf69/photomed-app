/**
 * MedicalReport Component - 医疗报告组件
 * 生成和展示多版本医疗报告
 */

import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  Stethoscope, 
  ClipboardList, 
  Calendar,
  Share2,
  Download,
  Printer,
  CheckCircle,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { exportAnalysisToPDF } from '@/services/pdfExport';
import type { AnalysisResult } from '@/types/core';

interface MedicalReportProps {
  analysisResult: AnalysisResult;
  sceneType: 'professional' | 'consumer';
  sceneName?: string;
  patientInfo?: {
    name?: string;
    age?: number;
    gender?: string;
    id?: string;
  };
  onShare?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

export const MedicalReport: React.FC<MedicalReportProps> = ({
  analysisResult,
  sceneType,
  sceneName = '健康分析',
  patientInfo,
  onShare,
  onDownload,
  onPrint
}) => {
  const [activeTab, setActiveTab] = useState(sceneType === 'professional' ? 'medical' : 'simple');
  const [isExporting, setIsExporting] = useState(false);

  // 处理PDF导出
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportAnalysisToPDF(analysisResult, sceneName, {
        title: sceneType === 'professional' ? '医疗分析报告' : '健康评估报告',
        subtitle: sceneName,
        includeDisclaimer: true,
        language: 'zh'
      });
      toast.success('PDF报告已生成并下载');
    } catch (error) {
      toast.error('PDF导出失败，请重试');
      console.error('PDF export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 生成报告编号
  const reportNumber = `RPT-${Date.now().toString(36).toUpperCase()}`;
  
  // 生成报告日期
  const reportDate = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 简单版报告（大众场景）
  const SimpleReport = () => (
    <div className="space-y-6">
      {/* 报告头部 */}
      <div className="text-center pb-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">健康评估报告</h2>
        <p className="text-gray-500 mt-2">报告编号：{reportNumber}</p>
        <p className="text-gray-500">生成时间：{reportDate}</p>
      </div>

      {/* 评估摘要 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">评估摘要</h3>
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            analysisResult.riskAssessment.level === 'low' ? 'bg-green-100' :
            analysisResult.riskAssessment.level === 'medium' ? 'bg-yellow-100' :
            'bg-red-100'
          }`}>
            {analysisResult.riskAssessment.level === 'low' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              风险评估：{analysisResult.riskAssessment.level === 'low' ? '低风险' :
                        analysisResult.riskAssessment.level === 'medium' ? '中等风险' :
                        analysisResult.riskAssessment.level === 'high' ? '高风险' : '危急'}
            </p>
            <p className="text-sm text-gray-600">
              分析置信度：{Math.round(analysisResult.confidence * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* 发现的问题 */}
      {analysisResult.imageAnalysis.features.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">观察到的特征</h3>
          <div className="space-y-2">
            {analysisResult.imageAnalysis.features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <span className="text-gray-700">{feature.label}</span>
                <Badge variant="outline">{Math.round(feature.confidence * 100)}% 置信度</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 健康建议 */}
      {analysisResult.recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">健康建议</h3>
          <div className="space-y-3">
            {analysisResult.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">{rec.title}</p>
                <p className="text-sm text-blue-800 mt-1">{rec.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 免责声明 */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>重要提示：</strong>本报告仅供参考，不能替代专业医疗诊断。
          如有任何不适或疑问，请及时咨询专业医护人员。
        </p>
      </div>
    </div>
  );

  // 医务版报告（专业场景）
  const MedicalVersion = () => (
    <div className="space-y-6">
      {/* 报告头部 */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">伤口造口评估报告</h2>
            <p className="text-sm text-gray-500 mt-1">报告编号：{reportNumber}</p>
          </div>
          <Badge variant="outline">医务版</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">生成时间：</span>
            <span className="text-gray-800">{reportDate}</span>
          </div>
          <div>
            <span className="text-gray-500">分析ID：</span>
            <span className="text-gray-800">{analysisResult.id}</span>
          </div>
        </div>
      </div>

      {/* 患者信息 */}
      {patientInfo && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            患者信息
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {patientInfo.name && (
              <div><span className="text-gray-500">姓名：</span>{patientInfo.name}</div>
            )}
            {patientInfo.age && (
              <div><span className="text-gray-500">年龄：</span>{patientInfo.age}岁</div>
            )}
            {patientInfo.gender && (
              <div><span className="text-gray-500">性别：</span>{patientInfo.gender}</div>
            )}
            {patientInfo.id && (
              <div><span className="text-gray-500">ID：</span>{patientInfo.id}</div>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* 临床评估 */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Stethoscope className="w-4 h-4 mr-2" />
          临床评估
        </h3>
        
        <div className="space-y-4">
          {/* 风险评估 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">风险评估</p>
            <p className="font-medium text-gray-800">
              {analysisResult.riskAssessment.level === 'low' ? '低风险' :
               analysisResult.riskAssessment.level === 'medium' ? '中等风险' :
               analysisResult.riskAssessment.level === 'high' ? '高风险' : '危急'}
            </p>
          </div>

          {/* 观察记录 */}
          <div>
            <p className="text-sm text-gray-600 mb-2">观察记录</p>
            <ul className="space-y-1 text-sm">
              {analysisResult.imageAnalysis.observations.map((obs, index) => (
                <li key={index} className="text-gray-700">• {obs}</li>
              ))}
            </ul>
          </div>

          {/* 红旗警示 */}
          {analysisResult.riskAssessment.flags.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">红旗警示</p>
              <ul className="mt-2 space-y-1">
                {analysisResult.riskAssessment.flags.map((flag, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {flag.description} - {flag.actionRequired}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* 护理计划 */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <ClipboardList className="w-4 h-4 mr-2" />
          护理计划
        </h3>
        <div className="space-y-3">
          {analysisResult.recommendations.map((rec, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">{rec.title}</p>
                <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                  {rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{rec.content}</p>
              {rec.evidenceSource && (
                <p className="text-xs text-gray-500 mt-2">来源：{rec.evidenceSource}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 需要人工确认 */}
      {analysisResult.requiresManualReview && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-800">需要人工确认</p>
          <p className="text-sm text-amber-700 mt-1">
            本报告由 AI 辅助生成，需要经伤口造口师或专业医护人员审核确认。
          </p>
        </div>
      )}

      {/* 签名区域 */}
      <div className="border-t pt-6 mt-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-500 mb-2">AI 分析系统</p>
            <div className="h-12 border-b border-gray-300"></div>
            <p className="text-xs text-gray-400 mt-1">自动生成</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">审核医师/护士</p>
            <div className="h-12 border-b border-gray-300"></div>
            <p className="text-xs text-gray-400 mt-1">待签名</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 护理版报告
  const NursingVersion = () => (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-800">护理执行单</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700">护理版</Badge>
        </div>
      </div>

      {/* 护理要点 */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">护理要点</h3>
        <div className="space-y-3">
          {analysisResult.recommendations
            .filter(rec => rec.targetAudience === 'nurse' || rec.targetAudience === 'wound_ostomy_specialist')
            .map((rec, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <p className="font-medium text-green-900">{rec.title}</p>
                </div>
                <p className="text-sm text-green-800 mt-1 ml-6">{rec.content}</p>
              </div>
            ))}
        </div>
      </div>

      {/* 患者教育要点 */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">患者教育要点</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            向患者解释当前伤口状况
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            指导患者自我观察要点
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            强调需要立即就医的警示信号
          </li>
        </ul>
      </div>

      {/* 执行记录 */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-3">执行记录</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-gray-500">执行时间</div>
            <div className="text-gray-500">执行人</div>
            <div className="text-gray-500">签名</div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <div className="h-8 border-b border-gray-200"></div>
              <div className="h-8 border-b border-gray-200"></div>
              <div className="h-8 border-b border-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 患者版报告
  const PatientVersion = () => (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-800">我的健康报告</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">患者版</Badge>
        </div>
      </div>

      {/* 简单说明 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          您好，根据今天的评估，您的伤口/造口状况{analysisResult.riskAssessment.level === 'low' ? '良好' : '需要关注'}。
        </p>
      </div>

      {/* 自我护理指导 */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">自我护理要点</h3>
        <div className="space-y-3">
          {analysisResult.recommendations
            .filter(rec => rec.targetAudience === 'patient' || rec.targetAudience === 'general_public')
            .map((rec, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">{rec.title}</p>
                <p className="text-sm text-gray-600 mt-1">{rec.content}</p>
              </div>
            ))}
        </div>
      </div>

      {/* 警示信号 */}
      {analysisResult.riskAssessment.flags.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">需要立即就医的情况</h3>
          <ul className="space-y-1">
            {analysisResult.riskAssessment.flags.map((flag, index) => (
              <li key={index} className="text-sm text-red-700 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {flag.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 随访提醒 */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          随访提醒
        </h3>
        <p className="text-sm text-green-700">
          请按照医护人员的建议定期复查，如有任何疑问请及时联系您的伤口造口师。
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              医疗报告
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <FileDown className="w-4 h-4 mr-1" />
                {isExporting ? '导出中...' : 'PDF'}
              </Button>
              {onShare && (
                <Button variant="outline" size="sm" onClick={onShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              )}
              {onPrint && (
                <Button variant="outline" size="sm" onClick={onPrint}>
                  <Printer className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {sceneType === 'professional' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="medical">医务版</TabsTrigger>
                <TabsTrigger value="nursing">护理版</TabsTrigger>
                <TabsTrigger value="patient">患者版</TabsTrigger>
              </TabsList>
              
              <TabsContent value="medical" className="mt-6">
                <MedicalVersion />
              </TabsContent>
              
              <TabsContent value="nursing" className="mt-6">
                <NursingVersion />
              </TabsContent>
              
              <TabsContent value="patient" className="mt-6">
                <PatientVersion />
              </TabsContent>
            </Tabs>
          ) : (
            <SimpleReport />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalReport;
