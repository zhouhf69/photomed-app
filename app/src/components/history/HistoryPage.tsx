/**
 * History Page Component - 历史记录页面
 * 展示用户的健康分析历史记录和趋势
 * 
 * 开发：菊花教授 周宏锋
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  Calendar,
  TrendingUp,
  ChevronRight,
  Trash2,
  Download,
  Search,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  getAnalysisHistory,
  deleteHistoryRecord,
  clearHistory,
  getHistoryStats,
  exportHistory
} from '@/services/historyManager';
import type { AnalysisHistory } from '@/types/healthScenes';

interface HistoryPageProps {
  onViewDetail?: (record: AnalysisHistory) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onViewDetail }) => {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScene, setSelectedScene] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // 加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getAnalysisHistory();
    setHistory(data);
  };

  // 获取统计数据
  const stats = useMemo(() => getHistoryStats(), [history]);

  // 筛选历史记录
  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      const matchesSearch = searchQuery === '' || 
        record.sceneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesScene = selectedScene === 'all' || record.sceneId === selectedScene;
      
      return matchesSearch && matchesScene;
    });
  }, [history, searchQuery, selectedScene]);

  // 获取场景列表
  const sceneList = useMemo(() => {
    const scenes = new Map<string, string>();
    history.forEach(record => {
      if (!scenes.has(record.sceneId)) {
        scenes.set(record.sceneId, record.sceneName);
      }
    });
    return Array.from(scenes.entries());
  }, [history]);

  // 删除单条记录
  const handleDelete = (id: string) => {
    setRecordToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      deleteHistoryRecord(recordToDelete);
      loadHistory();
      setShowDeleteDialog(false);
      setRecordToDelete(null);
    }
  };

  // 清空所有记录
  const handleClearAll = () => {
    setShowClearDialog(true);
  };

  const confirmClearAll = () => {
    clearHistory();
    loadHistory();
    setShowClearDialog(false);
  };

  // 导出数据
  const handleExport = () => {
    const data = exportHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `photomed_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 获取风险等级样式
  const getRiskStyle = (level: string) => {
    switch (level) {
      case 'low':
        return { bg: 'bg-green-100', text: 'text-green-700', label: '低风险' };
      case 'medium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '中风险' };
      case 'high':
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: '高风险' };
      case 'critical':
        return { bg: 'bg-red-100', text: 'text-red-700', label: '严重' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: '未知' };
    }
  };

  // 格式化日期
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString('zh-CN')
    };
  };

  // 渲染趋势图表（简化版）
  const renderTrendChart = () => {
    if (history.length < 2) {
      return (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>数据不足，无法生成趋势图</p>
          <p className="text-sm mt-2">至少需要2条历史记录</p>
        </div>
      );
    }

    // 按场景分组统计
    const sceneStats = new Map<string, { count: number; low: number; medium: number; high: number }>();
    
    history.forEach(record => {
      const current = sceneStats.get(record.sceneId) || { count: 0, low: 0, medium: 0, high: 0 };
      current.count++;
      if (record.riskLevel === 'low') current.low++;
      else if (record.riskLevel === 'medium') current.medium++;
      else if (record.riskLevel === 'high' || record.riskLevel === 'critical') current.high++;
      sceneStats.set(record.sceneId, current);
    });

    return (
      <div className="space-y-6">
        {/* 总体统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalAnalyses}</p>
            <p className="text-sm text-gray-600 mt-1">总分析次数</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{sceneList.length}</p>
            <p className="text-sm text-gray-600 mt-1">使用场景</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.recentActivity}</p>
            <p className="text-sm text-gray-600 mt-1">近7天分析</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">
              {Object.values(stats.riskDistribution).reduce((a, b) => a + b, 0) > 0 
                ? Math.round(((stats.riskDistribution.high || 0) + (stats.riskDistribution.critical || 0)) / stats.totalAnalyses * 100)
                : 0}%
            </p>
            <p className="text-sm text-gray-600 mt-1">高风险比例</p>
          </div>
        </div>

        {/* 场景分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-500" />
              场景使用分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sceneList.map(([sceneId, sceneName]) => {
                const stat = sceneStats.get(sceneId);
                if (!stat) return null;
                const percentage = Math.round(stat.count / stats.totalAnalyses * 100);
                
                return (
                  <div key={sceneId} className="flex items-center">
                    <span className="w-24 text-sm text-gray-600 truncate">{sceneName}</span>
                    <div className="flex-1 mx-3">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{stat.count}次</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 风险分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-500" />
              风险等级分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{stats.riskDistribution.low || 0}</p>
                <p className="text-xs text-gray-600 mt-1">低风险</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <p className="text-2xl font-bold text-yellow-600">{stats.riskDistribution.medium || 0}</p>
                <p className="text-xs text-gray-600 mt-1">中风险</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <p className="text-2xl font-bold text-orange-600">{stats.riskDistribution.high || 0}</p>
                <p className="text-xs text-gray-600 mt-1">高风险</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <p className="text-2xl font-bold text-red-600">{stats.riskDistribution.critical || 0}</p>
                <p className="text-xs text-gray-600 mt-1">严重</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <History className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-xl font-bold">历史记录</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={history.length === 0}
            className="hidden sm:flex"
          >
            <Download className="w-4 h-4 mr-1" />
            导出
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={history.length === 0}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            清空
          </Button>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">
            <History className="w-4 h-4 mr-1" />
            记录列表
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="w-4 h-4 mr-1" />
            趋势分析
          </TabsTrigger>
        </TabsList>

        {/* 记录列表 */}
        <TabsContent value="list" className="space-y-4">
          {/* 筛选栏 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索场景或摘要..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedScene}
              onChange={(e) => setSelectedScene(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm bg-white"
            >
              <option value="all">全部场景</option>
              {sceneList.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          {/* 记录列表 */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                {history.length === 0 ? '暂无历史记录' : '未找到匹配的记录'}
              </p>
              {history.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  完成一次健康分析后，记录将显示在这里
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((record) => {
                const dateInfo = formatDate(record.timestamp);
                const riskStyle = getRiskStyle(record.riskLevel);
                
                return (
                  <Card 
                    key={record.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onViewDetail?.(record)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{record.sceneName}</h3>
                            <Badge className={cn(riskStyle.bg, riskStyle.text)}>
                              {riskStyle.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{record.summary}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {dateInfo.full}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(record.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-300 ml-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* 趋势分析 */}
        <TabsContent value="trends">
          {renderTrendChart()}
        </TabsContent>
      </Tabs>

      {/* 删除确认弹窗 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除这条记录吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 清空确认弹窗 */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认清空</DialogTitle>
            <DialogDescription>
              确定要清空所有历史记录吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmClearAll}>
              清空全部
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 底部版权 */}
      <div className="text-center text-gray-400 text-xs pt-4">
        <p>开发：菊花教授 周宏锋</p>
      </div>
    </div>
  );
};

export default HistoryPage;
