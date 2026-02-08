/**
 * Theme Toggle Component - 主题切换组件
 * 支持浅色/深色模式切换
 * 
 * 开发：菊花教授 周宏锋
 */

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // 避免 hydration 不匹配
  useEffect(() => {
    setMounted(true);
    // 从 localStorage 读取主题设置
    const savedTheme = localStorage.getItem('photomed-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // 应用主题
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // 切换主题
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('photomed-theme', newTheme);
    applyTheme(newTheme);
  };

  // 监听系统主题变化
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleThemeChange('light')}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-md transition-all",
          theme === 'light' 
            ? "bg-white dark:bg-gray-700 shadow-sm text-amber-500" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
        )}
      >
        <Sun className="w-4 h-4" />
        <span className="text-sm">浅色</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleThemeChange('dark')}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-md transition-all",
          theme === 'dark' 
            ? "bg-gray-700 shadow-sm text-blue-400" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
        )}
      >
        <Moon className="w-4 h-4" />
        <span className="text-sm">深色</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleThemeChange('system')}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-md transition-all",
          theme === 'system' 
            ? "bg-white dark:bg-gray-700 shadow-sm text-green-500" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
        )}
      >
        <Monitor className="w-4 h-4" />
        <span className="text-sm">自动</span>
      </Button>
    </div>
  );
};

export default ThemeToggle;
