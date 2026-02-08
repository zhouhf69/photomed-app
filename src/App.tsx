/**
 * PhotoMed - Photo-first Medical Intelligence Engine
 * 以手机照相为医疗数据主入口的通用医疗智能底座
 * 
 * 开发：菊花教授 周宏锋
 * 版本：v1.0.0
 * 日期：2024年2月
 */

import { useState, useEffect } from 'react';
import { HomePage } from '@/sections/HomePage';
import { WorkflowPage } from '@/sections/WorkflowPage';
import { AboutPage } from '@/components/about/AboutPage';
import { LegalNotice } from '@/components/legal/LegalNotice';
import { HistoryPage } from '@/components/history/HistoryPage';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type AppView = 'home' | 'workflow' | 'about' | 'history';
type MobileTab = 'home' | 'detect' | 'ai' | 'history' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedSceneId, setSelectedSceneId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [isMobile, setIsMobile] = useState(false);
  const [showLegalDialog, setShowLegalDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 检查用户是否已同意条款
  useEffect(() => {
    const agreed = localStorage.getItem('photomed_terms_agreed');
    if (agreed === 'true') {
      setHasAgreedToTerms(true);
    }
  }, []);

  // 处理同意条款
  const handleAgreeTerms = () => {
    localStorage.setItem('photomed_terms_agreed', 'true');
    setHasAgreedToTerms(true);
  };

  // 处理场景选择
  const handleSelectScene = (sceneId: string) => {
    setSelectedSceneId(sceneId);
    setCurrentView('workflow');
  };

  // 返回首页
  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedSceneId('');
    setActiveTab('home');
  };

  // 处理底部导航切换
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as MobileTab);
    
    switch (tab) {
      case 'home':
        handleBackToHome();
        break;
      case 'detect':
        // 滚动到场景选择区域
        document.getElementById('scenes-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'ai':
        // 可以打开AI助手或推荐场景
        break;
      case 'history':
        // 切换到历史记录视图
        setCurrentView('history');
        break;
      case 'profile':
        // 打开关于页面
        setCurrentView('about');
        break;
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gray-50",
      isMobile && "pb-20" // 为底部导航预留空间
    )}>
      {/* 首次使用条款同意弹窗 */}
      {!hasAgreedToTerms && (
        <Dialog open={!hasAgreedToTerms}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center">欢迎使用 PhotoMed</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>重要提示：</strong>本平台的AI分析结果仅供参考，不能替代专业医生的诊断和治疗建议。
                  如有健康问题，请及时就医。
                </p>
              </div>
              <p className="text-sm text-gray-600">
                使用本平台即表示您同意我们的用户协议和隐私政策。
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLegalDialog(true)}
                  className="flex-1 text-sm text-blue-600 underline"
                >
                  查看用户协议
                </button>
                <button 
                  onClick={() => setShowPrivacyDialog(true)}
                  className="flex-1 text-sm text-blue-600 underline"
                >
                  查看隐私政策
                </button>
              </div>
              <button
                onClick={handleAgreeTerms}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                我已阅读并同意
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 法律声明弹窗 */}
      <Dialog open={showLegalDialog} onOpenChange={setShowLegalDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>用户协议</DialogTitle>
          </DialogHeader>
          <LegalNotice type="full" />
        </DialogContent>
      </Dialog>

      {/* 隐私政策弹窗 */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>隐私政策</DialogTitle>
          </DialogHeader>
          <LegalNotice type="full" />
        </DialogContent>
      </Dialog>

      {/* 主内容区域 */}
      <main className="safe-area-x">
        {currentView === 'home' && (
          <HomePage 
            onSelectScene={handleSelectScene} 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
        {currentView === 'workflow' && (
          <WorkflowPage 
            sceneId={selectedSceneId} 
            onBack={handleBackToHome} 
          />
        )}
        {currentView === 'about' && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <AboutPage 
              onShowLegal={() => setShowLegalDialog(true)}
              onShowPrivacy={() => setShowPrivacyDialog(true)}
            />
          </div>
        )}
        {currentView === 'history' && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <HistoryPage 
              onViewDetail={(record) => {
                // TODO: 显示记录详情
                console.log('View detail:', record);
              }}
            />
          </div>
        )}
      </main>

      {/* 移动端底部导航 */}
      {isMobile && (currentView === 'home' || currentView === 'history') && (
        <MobileBottomNav 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      )}

      {/* Toast 通知 - 移动端调整位置 */}
      <Toaster 
        position={isMobile ? "bottom-center" : "top-center"}
        toastOptions={{
          duration: 3000,
          className: isMobile ? 'mb-20' : '',
        }}
      />

      {/* 页脚版权信息 */}
      <footer className="text-center py-4 text-gray-400 text-xs">
        <p>© 2024 PhotoMed 医疗智能底座</p>
        <p className="mt-1">开发：菊花教授 周宏锋</p>
      </footer>
    </div>
  );
}

export default App;
