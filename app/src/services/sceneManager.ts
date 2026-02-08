/**
 * Scene Manager - 场景管理器
 * 管理所有 Scene Pack 的注册、加载和执行
 */

import type { 
  ScenePack, 
  SceneType, 
  TargetAudience,
  AnalysisSession,
  AnalysisResult,
  UserSession 
} from '@/types/core';
import { imageQAService } from './imageQA';

// 场景处理器接口
export interface SceneHandler {
  sceneId: string;
  analyze: (session: AnalysisSession) => Promise<AnalysisResult>;
  validateInput: (session: AnalysisSession) => { valid: boolean; errors: string[] };
  getRequiredFields: () => string[];
}

// 场景管理器类
export class SceneManager {
  private scenes: Map<string, ScenePack> = new Map();
  private handlers: Map<string, SceneHandler> = new Map();
  private activeSession: AnalysisSession | null = null;

  /**
   * 注册场景包
   */
  registerScene(scenePack: ScenePack): void {
    this.scenes.set(scenePack.id, scenePack);
    console.log(`[SceneManager] 场景包已注册: ${scenePack.name} (${scenePack.id})`);
  }

  /**
   * 注册场景处理器
   */
  registerHandler(handler: SceneHandler): void {
    this.handlers.set(handler.sceneId, handler);
    console.log(`[SceneManager] 处理器已注册: ${handler.sceneId}`);
  }

  /**
   * 获取场景包
   */
  getScene(sceneId: string): ScenePack | undefined {
    return this.scenes.get(sceneId);
  }

  /**
   * 获取所有场景
   */
  getAllScenes(): ScenePack[] {
    return Array.from(this.scenes.values());
  }

  /**
   * 按类型获取场景
   */
  getScenesByType(type: SceneType): ScenePack[] {
    return this.getAllScenes().filter(scene => scene.type === type);
  }

  /**
   * 按目标受众获取场景
   */
  getScenesByAudience(audience: TargetAudience): ScenePack[] {
    return this.getAllScenes().filter(scene => 
      scene.targetAudience === audience || 
      scene.type === (audience === 'general_public' ? 'consumer' : 'professional')
    );
  }

  /**
   * 获取用户可访问的场景
   */
  getAccessibleScenes(userSession: UserSession): ScenePack[] {
    return this.getAllScenes().filter(scene => 
      userSession.scenePacks.includes(scene.id)
    );
  }

  /**
   * 创建分析会话
   */
  createSession(userSession: UserSession, sceneId: string): AnalysisSession | null {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      console.error(`[SceneManager] 场景不存在: ${sceneId}`);
      return null;
    }

    // 检查用户是否有权限访问该场景
    if (!userSession.scenePacks.includes(sceneId)) {
      console.error(`[SceneManager] 用户无权访问场景: ${sceneId}`);
      return null;
    }

    const session: AnalysisSession = {
      id: this.generateSessionId(),
      userSessionId: userSession.id,
      sceneId,
      status: 'capturing',
      images: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.activeSession = session;
    console.log(`[SceneManager] 分析会话已创建: ${session.id}`);
    return session;
  }

  /**
   * 获取当前活动会话
   */
  getActiveSession(): AnalysisSession | null {
    return this.activeSession;
  }

  /**
   * 添加图片到会话
   */
  async addImage(sessionId: string, imageFile: File): Promise<{
    success: boolean;
    qaResult?: Awaited<ReturnType<typeof imageQAService.assessImageQuality>>;
    error?: string;
  }> {
    if (!this.activeSession || this.activeSession.id !== sessionId) {
      return { success: false, error: '会话不存在或已过期' };
    }

    // 进行质量评估
    const qaResult = await imageQAService.assessImageQuality(imageFile);

    // 如果质量不合格且阻断，不添加到会话
    if (qaResult.blocking) {
      return { success: false, qaResult, error: '图像质量不合格，请重新拍摄' };
    }

    // 创建图片对象
    const imageUrl = URL.createObjectURL(imageFile);
    const capturedImage = {
      id: this.generateImageId(),
      url: imageUrl,
      timestamp: Date.now(),
      qaResult,
      metadata: {
        timestamp: Date.now(),
        hasScaleReference: !qaResult.defects.some(d => d.type === 'no_scale_reference')
      }
    };

    this.activeSession.images.push(capturedImage);
    this.activeSession.status = 'qa';
    this.activeSession.updatedAt = Date.now();

    return { success: true, qaResult };
  }

  /**
   * 执行分析
   */
  async analyze(sessionId: string): Promise<{
    success: boolean;
    result?: AnalysisResult;
    error?: string;
  }> {
    if (!this.activeSession || this.activeSession.id !== sessionId) {
      return { success: false, error: '会话不存在或已过期' };
    }

    const scene = this.scenes.get(this.activeSession.sceneId);
    if (!scene) {
      return { success: false, error: '场景配置不存在' };
    }

    const handler = this.handlers.get(this.activeSession.sceneId);
    if (!handler) {
      return { success: false, error: '场景处理器未注册' };
    }

    // 验证输入
    const validation = handler.validateInput(this.activeSession);
    if (!validation.valid) {
      return { success: false, error: `输入验证失败: ${validation.errors.join(', ')}` };
    }

    // 更新状态
    this.activeSession.status = 'analyzing';
    this.activeSession.updatedAt = Date.now();

    try {
      // 执行分析
      const result = await handler.analyze(this.activeSession);
      
      // 更新会话
      this.activeSession.results = result;
      this.activeSession.status = result.requiresManualReview ? 'reviewing' : 'completed';
      this.activeSession.updatedAt = Date.now();

      return { success: true, result };
    } catch (error) {
      console.error('[SceneManager] 分析失败:', error);
      return { success: false, error: '分析过程中发生错误' };
    }
  }

  /**
   * 完成会话
   */
  completeSession(sessionId: string): boolean {
    if (!this.activeSession || this.activeSession.id !== sessionId) {
      return false;
    }

    this.activeSession.status = 'completed';
    this.activeSession.updatedAt = Date.now();
    
    // 这里可以将会话数据保存到后端
    console.log(`[SceneManager] 会话已完成: ${sessionId}`);
    
    return true;
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成图片ID
   */
  private generateImageId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 导出单例
export const sceneManager = new SceneManager();
