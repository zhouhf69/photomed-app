/**
 * Data Manager Component - 数据管理组件
 * 数据备份、恢复、导入导出功能
 * 
 * 开发：菊花教授 周宏锋
 */

import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle,
  FileJson,
  Database,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  exportHistory,
  importHistory,
  getAnalysisHistory,
  clearHistory
} from '@/services/historyManager';

interface DataManagerProps {
  onDataChanged?: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ onDataChanged }) => {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const history = getAnalysisHistory();
  const recordCount = history.length;

  // 导出数据
  const handleExport = () => {
    const data = exportHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `photomed_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 选择文件导入
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  // 处理文件导入
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);
    setShowImportDialog(true);

    try {
      // 模拟进度
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const content = await file.text();
      clearInterval(progressInterval);
      setImportProgress(100);

      const success = importHistory(content);
      
      if (success) {
        setImportResult({
          success: true,
          message: '数据导入成功！已恢复您的历史记录。'
        });
        onDataChanged?.();
      } else {
        setImportResult({
          success: false,
          message: '数据导入失败，文件格式不正确或已损坏。'
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: '导入过程中发生错误，请检查文件格式。'
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 清空数据
  const handleClear = () => {
    clearHistory();
    setShowClearDialog(false);
    onDataChanged?.();
  };

  return (
    <div className="space-y-6">
      {/* 数据概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Database className="w-5 h-5 mr-2 text-blue-500" />
            数据概览
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{recordCount}</p>
              <p className="text-sm text-gray-600 mt-1">历史记录</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {recordCount > 0 ? '本地' : '-'}
              </p>
              <p className="text-sm text-gray-600 mt-1">存储位置</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据备份 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Download className="w-5 h-5 mr-2 text-green-500" />
            数据备份
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            将您的健康分析数据导出为JSON文件，可用于备份或迁移到其他设备。
          </p>
          
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              导出的文件包含您的个人健康数据，请妥善保管，不要分享给他人。
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleExport}
            disabled={recordCount === 0}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {recordCount === 0 ? '暂无数据可导出' : '导出数据备份'}
          </Button>
        </CardContent>
      </Card>

      {/* 数据恢复 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Upload className="w-5 h-5 mr-2 text-purple-500" />
            数据恢复
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            从之前导出的JSON备份文件中恢复您的健康分析数据。
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileImport}
            className="hidden"
          />

          <Button
            variant="outline"
            onClick={handleSelectFile}
            className="w-full"
          >
            <FileJson className="w-4 h-4 mr-2" />
            选择备份文件导入
          </Button>
        </CardContent>
      </Card>

      {/* 清空数据 */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center text-lg text-red-800">
            <Trash2 className="w-5 h-5 mr-2" />
            危险区域
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            清空所有历史记录，此操作不可恢复。建议先导出备份。
          </p>

          <Button
            variant="destructive"
            onClick={() => setShowClearDialog(true)}
            disabled={recordCount === 0}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            清空所有数据
          </Button>
        </CardContent>
      </Card>

      {/* 导入进度弹窗 */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>数据导入</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isImporting ? (
              <>
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                </div>
                <p className="text-center text-gray-600">正在导入数据...</p>
                <Progress value={importProgress} className="h-2" />
              </>
            ) : importResult ? (
              <>
                <div className="flex items-center justify-center">
                  {importResult.success ? (
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  )}
                </div>
                <p className={cn(
                  "text-center",
                  importResult.success ? "text-green-600" : "text-red-600"
                )}>
                  {importResult.message}
                </p>
              </>
            ) : null}
          </div>

          <DialogFooter>
            <Button 
              onClick={() => setShowImportDialog(false)}
              disabled={isImporting}
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 清空确认弹窗 */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              确认清空数据
            </DialogTitle>
            <DialogDescription>
              此操作将永久删除所有历史记录，无法恢复。建议先导出备份。
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              确认清空
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

export default DataManager;
