/**
 * Physical Exam Report Result Component - 体检报告分析结果组件
 * 展示完整的报告解读、风险评估、干预意见和随访计划
 */

import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Calendar,
  Activity,
  BookOpen,
  ChevronDown,
  ChevronUp,
  User,
  Heart,
  Utensils,
  Dumbbell,
  Phone,
  AlertOctagon,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { PhysicalExamAnalysisResult } from '@/types/medicalReportScenes';

interface PhysicalExamReportResultProps {
  result: PhysicalExamAnalysisResult;
}

export const PhysicalExamReportResult: React.FC<PhysicalExamReportResultProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('interpretation');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    abnormalItems: true,
    riskFactors: false,
    interventions: true
  });

  const { report, interpretation, riskAssessment, interventionPlan, followupPlan, references } = result;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 获取风险等级样式
  const getRiskStyle = (level: string) => {
    switch (level) {
      case 'low':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-500' };
      case 'medium':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-500' };
      case 'high':
        return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-500' };
      case 'critical':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', badge: 'bg-red-500' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', badge: 'bg-gray-500' };
    }
  };

  const riskStyle = getRiskStyle(report.overallRisk);

  return (
    <div className="space-y-6">
      {/* 报告概览卡片 */}
      <Card className={`${riskStyle.bg} ${riskStyle.border}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className={`w-8 h-8 ${riskStyle.text}`} />
              <div>
                <h2 className={`text-xl font-bold ${riskStyle.text}`}>体检报告分析</h2>
                <p className="text-sm text-gray-600">报告日期：{report.reportDate}</p>
              </div>
            </div>
            <Badge className={`${riskStyle.badge} text-white px-4 py-1`}>
              {report.overallRisk === 'low' ? '低风险' : 
               report.overallRisk === 'medium' ? '中等风险' : 
               report.overallRisk === 'high' ? '高风险' : '严重'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center text-gray-500 mb-1">
                <User className="w-4 h-4 mr-1" />
                <span className="text-xs">基本信息</span>
              </div>
              <p className="text-sm font-medium">{report.basicInfo.gender === 'male' ? '男' : '女'}，{report.basicInfo.age}岁</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center text-gray-500 mb-1">
                <Activity className="w-4 h-4 mr-1" />
                <span className="text-xs">BMI</span>
              </div>
              <p className="text-sm font-medium">{report.basicInfo.bmi} kg/m²</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center text-gray-500 mb-1">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-xs">异常项目</span>
              </div>
              <p className="text-sm font-medium">{report.abnormalItems.length} 项</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center text-gray-500 mb-1">
                <BookOpen className="w-4 h-4 mr-1" />
                <span className="text-xs">检查项目</span>
              </div>
              <p className="text-sm font-medium">{report.categories.length} 类</p>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>总体评估：</strong>{interpretation.overallSummary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="interpretation">
            <Stethoscope className="w-4 h-4 mr-1" />
            报告解读
          </TabsTrigger>
          <TabsTrigger value="risk">
            <AlertTriangle className="w-4 h-4 mr-1" />
            风险评估
          </TabsTrigger>
          <TabsTrigger value="intervention">
            <Heart className="w-4 h-4 mr-1" />
            干预方案
          </TabsTrigger>
          <TabsTrigger value="followup">
            <Calendar className="w-4 h-4 mr-1" />
            随访计划
          </TabsTrigger>
        </TabsList>

        {/* 报告解读 */}
        <TabsContent value="interpretation" className="space-y-4">
          {/* 关键发现 */}
          {interpretation.keyFindings.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                  关键发现
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interpretation.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 分类解读 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                分类解读
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interpretation.categoryInterpretations.map((cat, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{cat.category}</h4>
                    <Badge className={
                      cat.status === 'normal' ? 'bg-green-500' :
                      cat.status === 'attention' ? 'bg-yellow-500' : 'bg-red-500'
                    }>
                      {cat.status === 'normal' ? '正常' :
                       cat.status === 'attention' ? '需关注' : '异常'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cat.summary}</p>
                  {cat.details.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {cat.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start">
                          <span className="mr-2">•</span>{detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 异常项目详情 */}
          {report.abnormalItems.length > 0 && (
            <Collapsible open={expandedSections.abnormalItems} onOpenChange={() => toggleSection('abnormalItems')}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <AlertOctagon className="w-5 h-5 mr-2 text-red-500" />
                        异常项目详情
                      </CardTitle>
                      {expandedSections.abnormalItems ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {report.abnormalItems.map((item, idx) => (
                      <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-red-900">{item.itemName}</h4>
                          <Badge className={
                            item.severity === 'mild' ? 'bg-yellow-500' :
                            item.severity === 'moderate' ? 'bg-orange-500' : 'bg-red-500'
                          }>
                            {item.severity === 'mild' ? '轻度' :
                             item.severity === 'moderate' ? '中度' : '严重'}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-3 gap-2 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">检测值：</span>
                            <span className="font-medium">{item.value} {item.unit}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">参考范围：</span>
                            <span>{item.referenceRange}</span>
                          </div>
                        </div>
                        <p className="text-sm text-red-800 mb-2">
                          <strong>临床意义：</strong>{item.clinicalSignificance}
                        </p>
                        {item.possibleCauses.length > 0 && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>可能原因：</strong>{item.possibleCauses.join('、')}
                          </p>
                        )}
                        <div className="bg-white rounded p-2">
                          <p className="text-sm text-gray-700">
                            <strong>建议：</strong>{item.recommendations.join('；')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}
        </TabsContent>

        {/* 风险评估 */}
        <TabsContent value="risk" className="space-y-4">
          {/* 整体风险 */}
          <Card className={`${riskStyle.bg} ${riskStyle.border}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${riskStyle.text}`}>整体健康风险</p>
                  <p className={`text-2xl font-bold ${riskStyle.text}`}>
                    {report.overallRisk === 'low' ? '低风险' : 
                     report.overallRisk === 'medium' ? '中等风险' : 
                     report.overallRisk === 'high' ? '高风险' : '严重风险'}
                  </p>
                </div>
                <TrendingUp className={`w-12 h-12 ${riskStyle.text} opacity-50`} />
              </div>
            </CardContent>
          </Card>

          {/* 风险因素 */}
          {riskAssessment.riskFactors.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-orange-500" />
                  风险因素
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {riskAssessment.riskFactors.map((factor, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{factor.name}</h4>
                      <Badge className={
                        factor.level === 'low' ? 'bg-green-500' :
                        factor.level === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                      }>
                        {factor.level === 'low' ? '低风险' :
                         factor.level === 'moderate' ? '中等风险' : '高风险'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                    <p className="text-xs text-blue-600">
                      <BookOpen className="w-3 h-3 inline mr-1" />
                      参考：{factor.evidenceSource}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 疾病风险 */}
          {riskAssessment.diseaseRisks.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  疾病风险评估
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {riskAssessment.diseaseRisks.map((disease, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{disease.disease}</h4>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className={`h-full rounded-full ${
                              disease.riskLevel === 'low' ? 'bg-green-500' :
                              disease.riskLevel === 'medium' ? 'bg-yellow-500' :
                              disease.riskLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${disease.probability * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{Math.round(disease.probability * 100)}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>相关因素：</strong>{disease.contributingFactors.join('、')}
                    </p>
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-sm text-green-800">
                        <strong>预防建议：</strong>{disease.preventionAdvice.join('；')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 干预方案 */}
        <TabsContent value="intervention" className="space-y-4">
          {/* 立即行动 */}
          {interventionPlan.immediateActions.length > 0 && (
            <Card className="border-red-200">
              <CardHeader className="pb-2 bg-red-50">
                <CardTitle className="text-lg flex items-center text-red-800">
                  <Clock className="w-5 h-5 mr-2" />
                  立即行动
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {interventionPlan.immediateActions.map((action, idx) => (
                  <Alert key={idx} className="border-red-200 bg-red-50">
                    <AlertTitle className="text-red-800 flex items-center">
                      <Badge className="bg-red-500 mr-2">紧急</Badge>
                      {action.title}
                    </AlertTitle>
                    <AlertDescription className="text-red-700 mt-2">
                      {action.description}
                      <p className="text-xs mt-1">
                        <BookOpen className="w-3 h-3 inline mr-1" />
                        参考：{action.evidenceSource}
                      </p>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 短期目标 */}
          {interventionPlan.shortTermGoals.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  短期目标（3个月）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interventionPlan.shortTermGoals.map((goal, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{goal.title}</h4>
                      <Badge className={
                        goal.priority === 'high' ? 'bg-red-500' :
                        goal.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }>
                        {goal.priority === 'high' ? '高优先级' :
                         goal.priority === 'medium' ? '中优先级' : '低优先级'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      时间：{goal.timeframe}
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      预期效果：{goal.expectedOutcome}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 生活方式调整 */}
          {interventionPlan.lifestyleModifications.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-green-500" />
                  生活方式调整
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interventionPlan.lifestyleModifications.map((mod, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      {mod.category === 'diet' && <Utensils className="w-5 h-5 mr-2 text-orange-500" />}
                      {mod.category === 'exercise' && <Dumbbell className="w-5 h-5 mr-2 text-blue-500" />}
                      {mod.category === 'sleep' && <Clock className="w-5 h-5 mr-2 text-purple-500" />}
                      {mod.category === 'stress' && <Heart className="w-5 h-5 mr-2 text-red-500" />}
                      {mod.category === 'smoking' && <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />}
                      {mod.category === 'alcohol' && <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />}
                      <h4 className="font-medium">
                        {mod.category === 'diet' ? '饮食调整' :
                         mod.category === 'exercise' ? '运动计划' :
                         mod.category === 'sleep' ? '睡眠管理' :
                         mod.category === 'stress' ? '压力管理' :
                         mod.category === 'smoking' ? '戒烟' : '限酒'}
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-500">现状：</span>
                        <span>{mod.currentStatus}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">目标：</span>
                        <span className="text-green-700">{mod.targetStatus}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-sm text-gray-700">
                        <strong>具体措施：</strong>{mod.specificActions.join('；')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 医疗转诊 */}
          {interventionPlan.medicalReferrals.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader className="pb-2 bg-orange-50">
                <CardTitle className="text-lg flex items-center text-orange-800">
                  <Phone className="w-5 h-5 mr-2" />
                  建议就诊
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {interventionPlan.medicalReferrals.map((ref, idx) => (
                  <Alert key={idx} className="border-orange-200 bg-orange-50">
                    <AlertTitle className="text-orange-800 flex items-center">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      {ref.specialty}
                      <Badge className={`ml-2 ${
                        ref.urgency === 'emergency' ? 'bg-red-500' :
                        ref.urgency === 'urgent' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {ref.urgency === 'emergency' ? '紧急' :
                         ref.urgency === 'urgent' ? '尽快' : '常规'}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="text-orange-700 mt-2">
                      <p><strong>原因：</strong>{ref.reason}</p>
                      {ref.recommendedTests && (
                        <p className="mt-1"><strong>建议检查：</strong>{ref.recommendedTests.join('、')}</p>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 随访计划 */}
        <TabsContent value="followup" className="space-y-4">
          {/* 随访时间表 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                随访时间表
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {followupPlan.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-start border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-medium text-blue-700">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium">{item.description}</h4>
                        <Badge className="ml-2" variant="outline">
                          {item.type === 'checkup' ? '体检' :
                           item.type === 'test' ? '检测' :
                           item.type === 'consultation' ? '就诊' : '自我监测'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.purpose}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        建议日期：{item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 监测项目 */}
          {followupPlan.monitoringItems.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  日常监测项目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {followupPlan.monitoringItems.map((item, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">{item.indicator}</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-500">监测频率：</span>{item.frequency}</p>
                        <p><span className="text-gray-500">目标范围：</span><span className="text-green-700">{item.targetRange}</span></p>
                        {item.currentValue && (
                          <p><span className="text-gray-500">当前值：</span>{item.currentValue}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 预警条件 */}
          {followupPlan.alertConditions.length > 0 && (
            <Card className="border-red-200">
              <CardHeader className="pb-2 bg-red-50">
                <CardTitle className="text-lg flex items-center text-red-800">
                  <AlertOctagon className="w-5 h-5 mr-2" />
                  预警条件
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {followupPlan.alertConditions.map((alert, idx) => (
                  <Alert key={idx} className="border-red-200 bg-red-50">
                    <AlertTitle className="text-red-800 flex items-center">
                      <Badge className={`mr-2 ${
                        alert.urgency === 'emergency' ? 'bg-red-500' :
                        alert.urgency === 'urgent' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}>
                        {alert.urgency === 'emergency' ? '紧急' :
                         alert.urgency === 'urgent' ? '尽快' : '注意'}
                      </Badge>
                      {alert.condition}
                    </AlertTitle>
                    <AlertDescription className="text-red-700 mt-2">
                      <p><strong>症状：</strong>{alert.symptoms.join('、')}</p>
                      <p className="mt-1"><strong>处理：</strong>{alert.action}</p>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 下次评估日期 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-blue-800">
                <strong>下次全面评估日期：</strong>{followupPlan.reassessmentDate}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 参考来源 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
            参考依据
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {references.map((ref, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex items-start">
                  <Badge variant="outline" className="mr-2 flex-shrink-0">
                    {ref.type === 'guideline' ? '指南' :
                     ref.type === 'consensus' ? '共识' :
                     ref.type === 'study' ? '研究' : '教材'}
                  </Badge>
                  <div>
                    <p className="font-medium">{ref.title}</p>
                    <p className="text-gray-500">
                      {ref.source} {ref.year && `(${ref.year})`}
                    </p>
                    <p className="text-gray-600 text-xs">相关：{ref.relevance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 免责声明 */}
      <Separator />
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800">重要提示</AlertTitle>
        <AlertDescription className="text-amber-700">
          {result.disclaimer}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PhysicalExamReportResult;
