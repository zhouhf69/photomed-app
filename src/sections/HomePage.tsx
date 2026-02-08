/**
 * HomePage Section - 主页
 * 场景选择、系统介绍、历史记录
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Shield, 
  Stethoscope, 
  ChevronRight, 
  CheckCircle,
  Database,
  Workflow,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
  History,
  TrendingUp,
  Heart,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Separator } from '@/components/ui/separator';
import { sceneManager } from '@/services/sceneManager';
import { stoolAnalysisHandler } from '@/scenes/stoolAnalysis';
import { woundOstomyHandler } from '@/scenes/woundOstomy';
import { skinAnalysisHandler } from '@/scenes/skinAnalysis';
import { nailAnalysisHandler } from '@/scenes/nailAnalysis';
import { oralAnalysisHandler } from '@/scenes/oralAnalysis';
import { tongueAnalysisHandler } from '@/scenes/tongueAnalysis';
import { analyzeHairImage } from '@/scenes/hairAnalysis';
import { analyzeEyeImage } from '@/scenes/eyeAnalysis';
import { analyzeFootImage } from '@/scenes/footAnalysis';
import { analyzePostureImage } from '@/scenes/postureAnalysis';
import { analyzePhysicalExamReport } from '@/scenes/physicalExamAnalysis';
import { analyzeTestResult } from '@/scenes/testResultAnalysis';
import { scenePacks, getScenePackIcon, getScenePackTheme } from '@/data/scenePacks';
import { healthScenePacks, getHealthSceneIcon, getHealthSceneTheme } from '@/data/healthScenePacks';
import { initializeKnowledgeBase } from '@/data/knowledgeBaseData';
import { knowledgeBaseService } from '@/services/knowledgeBase';
import type { ScenePack } from '@/types/core';

interface HomePageProps {
  onSelectScene: (sceneId: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// 模拟历史记录数据
const mockHistory = [
  {
    id: 'hist_1',
    sceneId: 'scene_skin_analysis',
    sceneName: '皮肤检测',
    timestamp: Date.now() - 86400000,
    summary: '油性肤质，毛孔轻度粗大',
    riskLevel: 'low' as const,
    icon: '✨'
  },
  {
    id: 'hist_2',
    sceneId: 'scene_stool_analysis',
    sceneName: '大便识别',
    timestamp: Date.now() - 172800000,
    summary: '布里斯托4型，正常',
    riskLevel: 'low' as const,
    icon: '💩'
  },
  {
    id: 'hist_3',
    sceneId: 'scene_tongue_analysis',
    sceneName: '舌苔分析',
    timestamp: Date.now() - 259200000,
    summary: '气虚质，建议调理',
    riskLevel: 'medium' as const,
    icon: '👅'
  }
];

export const HomePage: React.FC<HomePageProps> = ({ onSelectScene }) => {
  const [allScenes, setAllScenes] = useState<ScenePack[]>([]);
  const [activeTab, setActiveTab] = useState('scenes');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    initializeSystem();
  }, []);

  const initializeSystem = () => {
    // 注册所有场景包
    const allPacks = [...scenePacks, ...healthScenePacks];
    allPacks.forEach(pack => {
      sceneManager.registerScene(pack);
    });

    // 注册所有场景处理器
    sceneManager.registerHandler(stoolAnalysisHandler);
    sceneManager.registerHandler(woundOstomyHandler);
    sceneManager.registerHandler(skinAnalysisHandler);
    sceneManager.registerHandler(nailAnalysisHandler);
    sceneManager.registerHandler(oralAnalysisHandler);
    sceneManager.registerHandler(tongueAnalysisHandler);
    
    // 注册新场景处理器
    sceneManager.registerHandler({
      sceneId: 'scene_hair_analysis',
      analyze: async (session) => {
        const image = session.images[0];
        return analyzeHairImage(image?.url || '', (image?.metadata as unknown) as Record<string, unknown>);
      },
      validateInput: () => ({ valid: true, errors: [] }),
      getRequiredFields: () => []
    });
    sceneManager.registerHandler({
      sceneId: 'scene_eye_analysis',
      analyze: async (session) => {
        const image = session.images[0];
        return analyzeEyeImage(image?.url || '', (image?.metadata as unknown) as Record<string, unknown>);
      },
      validateInput: () => ({ valid: true, errors: [] }),
      getRequiredFields: () => []
    });
    sceneManager.registerHandler({
      sceneId: 'scene_foot_analysis',
      analyze: async (session) => {
        const image = session.images[0];
        return analyzeFootImage(image?.url || '', (image?.metadata as unknown) as Record<string, unknown>);
      },
      validateInput: () => ({ valid: true, errors: [] }),
      getRequiredFields: () => []
    });
    sceneManager.registerHandler({
      sceneId: 'scene_posture_analysis',
      analyze: async (session) => {
        const image = session.images[0];
        return analyzePostureImage(image?.url || '', (image?.metadata as unknown) as Record<string, unknown>);
      },
      validateInput: () => ({ valid: true, errors: [] }),
      getRequiredFields: () => []
    });
    
    // 注册体检报告分析处理器
    sceneManager.registerHandler({
      sceneId: 'scene_physical_exam',
      analyze: async (session) => {
        const image = session.images[0];
        return analyzePhysicalExamReport(image?.url || '', (image?.metadata as unknown) as Record<string, unknown>);
      },
      validateInput: () => ({ valid: true, errors: [] }),
      getRequiredFields: () => []
    });
    
    // 注册检测结果分析处理器
    sceneManager.registerHandler({
      sceneId: 'scene_test_result',
      analyze: async (session) => {
        const image = session.images[0];
        return analyzeTestResult(image?.url || '', (image?.metadata as unknown) as Record<string, unknown>);
      },
      validateInput: () => ({ valid: true, errors: [] }),
      getRequiredFields: () => []
    });

    // 初始化知识库
    const kbLayers = initializeKnowledgeBase();
    knowledgeBaseService.updateKnowledgeBase(kbLayers);

    setAllScenes(allPacks);
  };

  // 系统特性
  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Photo-first 采集',
      description: '以手机照相为主要医疗数据入口'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '智能质控',
      description: '实时影像质量评估，确保数据标准'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI 智能分析',
      description: '多维度健康评估与风险识别'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: '知识驱动',
      description: '基于权威指南，持续学习进化'
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: '场景插件化',
      description: 'Scene Pack 灵活扩展临床场景'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: '多版本报告',
      description: '自动生成个性化健康报告'
    }
  ];

  // 统计数据
  const stats = [
    { label: '健康场景', value: '8', icon: <Heart className="w-5 h-5" /> },
    { label: '专业场景', value: '3', icon: <Stethoscope className="w-5 h-5" /> },
    { label: '分析次数', value: '1,234', icon: <Activity className="w-5 h-5" /> },
    { label: '知识条目', value: '500+', icon: <Database className="w-5 h-5" /> }
  ];

  // 获取场景图标
  const getSceneIcon = (sceneId: string): string => {
    const icon = getScenePackIcon(sceneId);
    if (icon !== '📋') return icon;
    return getHealthSceneIcon(sceneId);
  };

  // 获取场景主题
  const getSceneTheme = (sceneId: string) => {
    const theme = getScenePackTheme(sceneId);
    if (theme.primary !== '#1976D2') return theme;
    return getHealthSceneTheme(sceneId);
  };

  // 格式化时间
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 86400000) {
      return '今天';
    } else if (diff < 172800000) {
      return '昨天';
    } else if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PhotoMed
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setActiveTab('scenes')}
                className={`text-sm font-medium transition-colors ${activeTab === 'scenes' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                健康场景
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`text-sm font-medium transition-colors ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                历史记录
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                关于
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-2">
              <button 
                onClick={() => { setActiveTab('scenes'); setShowMobileMenu(false); }}
                className="block w-full text-left py-2 text-gray-700"
              >
                健康场景
              </button>
              <button 
                onClick={() => { setActiveTab('history'); setShowMobileMenu(false); }}
                className="block w-full text-left py-2 text-gray-700"
              >
                历史记录
              </button>
              <button 
                onClick={() => { setActiveTab('about'); setShowMobileMenu(false); }}
                className="block w-full text-left py-2 text-gray-700"
              >
                关于
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {activeTab === 'scenes' && (
        <>
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI 驱动的健康分析平台
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                拍照即知健康
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                以手机照相为核心，AI 智能分析健康状况。
                皮肤、指甲、口腔、舌苔...多维度守护您的健康。
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm border">
                    <div className="flex justify-center mb-2 text-blue-600">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => document.getElementById('scenes-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  开始检测
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </section>

          {/* Scenes Section */}
          <section id="scenes-section" className="py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="health" className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">选择检测场景</h2>
                  <TabsList>
                    <TabsTrigger value="health">健康自测</TabsTrigger>
                    <TabsTrigger value="professional">专业医疗</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="health" className="mt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allScenes.filter(s => s.type === 'consumer').map(scene => (
                      <SceneCard 
                        key={scene.id} 
                        scene={scene} 
                        icon={getSceneIcon(scene.id)}
                        theme={getSceneTheme(scene.id)}
                        onClick={() => onSelectScene(scene.id)} 
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="professional" className="mt-0">
                  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {allScenes.filter(s => s.type === 'professional').map(scene => (
                      <SceneCard 
                        key={scene.id} 
                        scene={scene} 
                        icon={getSceneIcon(scene.id)}
                        theme={getSceneTheme(scene.id)}
                        onClick={() => onSelectScene(scene.id)} 
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">系统特性</h2>
                <p className="text-gray-600">专业、可靠、智能的健康分析平台</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* History Section */}
      {activeTab === 'history' && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">检测历史</h2>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                健康趋势
              </Button>
            </div>

            {mockHistory.length > 0 ? (
              <div className="space-y-4">
                {mockHistory.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.sceneName}</h3>
                            <p className="text-sm text-gray-600">{item.summary}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatTime(item.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={item.riskLevel === 'low' ? 'default' : 'secondary'}
                            className={item.riskLevel === 'low' ? 'bg-green-500' : 'bg-yellow-500'}
                          >
                            {item.riskLevel === 'low' ? '正常' : '需关注'}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无检测记录</h3>
                <p className="text-gray-600 mb-4">开始您的第一次健康检测吧</p>
                <Button onClick={() => setActiveTab('scenes')}>
                  去检测
                </Button>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      {activeTab === 'about' && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>关于 PhotoMed</CardTitle>
                <CardDescription>以手机照相为核心的医疗智能底座</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  PhotoMed 是一个创新的医疗健康平台，利用 AI 技术和手机拍照功能，
                  为用户提供便捷的健康自测和专业医疗辅助工具。
                </p>
                <p className="text-gray-600">
                  我们的使命是让健康管理变得更加简单、智能、可及。
                  无论是日常健康监测还是专业医疗场景，PhotoMed 都能为您提供可靠的支持。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>系统架构</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Scene Pack 场景层', desc: '皮肤、指甲、口腔、舌苔、头发、眼睛、足部、体态、大便、伤口造口、体检报告、检测结果', color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
                    { name: 'AI 分析引擎', desc: '影像分析、风险评估、建议生成', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
                    { name: 'ImageQA 质控层', desc: '清晰度、光照、ROI、颜色检测', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
                    { name: '数据采集层', desc: '手机拍照、相册选择、元数据提取', color: 'bg-gradient-to-r from-purple-500 to-violet-500' },
                    { name: '知识库 KB', desc: '指南、SOP、评估量表、临床路径', color: 'bg-gradient-to-r from-green-500 to-emerald-500' }
                  ].map((layer, index) => (
                    <div 
                      key={index} 
                      className={`${layer.color} rounded-lg p-4 text-white`}
                    >
                      <p className="font-semibold">{layer.name}</p>
                      <p className="text-sm opacity-80">{layer.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Camera className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">PhotoMed</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Photo-first Medical Intelligence Engine
          </p>
          <p className="text-xs text-gray-500">
            本系统仅供演示，实际应用需符合医疗法规要求
          </p>
          <Separator className="my-4" />
          <p className="text-xs text-gray-400">
            © 2024 PhotoMed. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// 场景卡片组件
interface SceneCardProps {
  scene: ScenePack;
  icon: string;
  theme: { primary: string; secondary: string; background: string };
  onClick: () => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, icon, theme, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-sm overflow-hidden group"
      onClick={onClick}
    >
      <div className="h-2" style={{ backgroundColor: theme.primary }} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
            style={{ backgroundColor: theme.background }}
          >
            {icon}
          </div>
          <Badge 
            variant={scene.type === 'professional' ? 'default' : 'secondary'}
            className={scene.type === 'professional' ? 'bg-green-600' : 'bg-blue-500'}
          >
            {scene.type === 'professional' ? '专业' : '自测'}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-3">{scene.name}</CardTitle>
        <CardDescription className="text-gray-600 line-clamp-2">
          {scene.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            {scene.modules.length} 项功能
          </span>
          {scene.workflow.requireManualConfirm && (
            <span className="flex items-center text-amber-600">
              <Users className="w-4 h-4 mr-1" />
              需确认
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomePage;
