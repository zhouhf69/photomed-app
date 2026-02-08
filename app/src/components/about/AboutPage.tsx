/**
 * About Page Component - 关于页面
 * 展示平台信息、版本、开发者和法律信息
 * 
 * 开发：菊花教授 周宏锋
 */

import React, { useState } from 'react';
import { 
  Heart, 
  Stethoscope, 
  Camera, 
  Shield, 
  FileText, 
  Scale,
  Code,
  Users,
  Award,
  Github,
  Mail,
  ChevronRight,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DataManager } from '@/components/settings/DataManager';

interface AboutPageProps {
  onShowLegal?: () => void;
  onShowPrivacy?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ 
  onShowLegal, 
  onShowPrivacy 
}) => {
  const version = '1.0.0';
  const buildDate = '2024年2月';
  const developer = '菊花教授 周宏锋';
  const [dataChanged, setDataChanged] = useState(false);

  const features = [
    {
      icon: Camera,
      title: '拍照即分析',
      description: '手机拍照即可获取AI健康分析，无需专业设备'
    },
    {
      icon: Heart,
      title: '多场景覆盖',
      description: '覆盖皮肤、口腔、体检报告等10+健康场景'
    },
    {
      icon: Stethoscope,
      title: '专业参考',
      description: '基于权威医学指南，提供科学依据'
    },
    {
      icon: Shield,
      title: '隐私保护',
      description: '数据本地存储，不上传服务器'
    }
  ];

  const stats = [
    { label: '健康场景', value: '10+' },
    { label: '专业场景', value: '3' },
    { label: '参考指南', value: '20+' },
    { label: '评估量表', value: '10+' }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* 头部信息 */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white text-center">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Camera className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-2">PhotoMed</h1>
        <p className="text-xl text-white/90 mb-2">医疗智能底座</p>
        <p className="text-white/70">Photo-first Medical Intelligence Engine</p>
        
        <div className="flex items-center justify-center gap-2 mt-6">
          <Badge className="bg-white/20 text-white border-0">v{version}</Badge>
          <Badge className="bg-white/20 text-white border-0">{buildDate}</Badge>
        </div>
      </div>

      {/* 核心特性 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-amber-500" />
            核心特性
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 数据统计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-500" />
            平台数据
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-3">
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 开发者信息 */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center text-purple-800">
            <Code className="w-5 h-5 mr-2" />
            开发者信息
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">菊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{developer}</h3>
            <p className="text-gray-500 mt-1">医疗AI技术研究者</p>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button variant="outline" size="sm" className="rounded-full">
                <Mail className="w-4 h-4 mr-2" />
                联系开发者
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                <Github className="w-4 h-4 mr-2" />
                开源代码
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 法律信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scale className="w-5 h-5 mr-2 text-amber-500" />
            法律信息
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <button 
              onClick={onShowLegal}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">用户协议</p>
                  <p className="text-sm text-gray-500">使用本平台的法律条款</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button 
              onClick={onShowPrivacy}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">隐私政策</p>
                  <p className="text-sm text-gray-500">我们如何保护您的数据</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 数据管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-500" />
            数据管理
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataManager onDataChanged={() => setDataChanged(!dataChanged)} />
        </CardContent>
      </Card>

      {/* 技术栈 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="w-5 h-5 mr-2 text-gray-600" />
            技术栈
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'shadcn/ui'].map((tech) => (
              <Badge key={tech} variant="secondary" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 底部版权 */}
      <div className="text-center space-y-2 pt-4">
        <Separator />
        <p className="text-gray-500 text-sm">
          © 2024 PhotoMed 医疗智能底座. All Rights Reserved.
        </p>
        <p className="text-gray-700 font-medium">
          开发：{developer}
        </p>
        <p className="text-gray-400 text-xs">
          版本 {version} | {buildDate}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
