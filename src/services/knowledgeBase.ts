/**
 * Knowledge Base Service - 知识库服务
 * 管理医疗知识库的分层结构和查询
 */

import type { 
  KnowledgeBase, 
  KBLayers, 
  Guideline, 
  SOP, 
  AssessmentScale,
  ClinicalPathway,
  EducationMaterial,
  QualityControlRule,
  OutcomeRecord
} from '@/types/core';

// 知识库数据（实际项目中应从后端 API 或数据库加载）
const DEFAULT_KB: KnowledgeBase = {
  id: 'default_kb',
  name: 'PhotoMed 默认知识库',
  version: '1.0.0',
  layers: {
    guidelines: [],
    sops: [],
    assessmentScales: [],
    clinicalPathways: [],
    educationMaterials: [],
    qualityControl: [],
    outcomes: []
  },
  lastUpdated: Date.now()
};

/**
 * 知识库服务类
 */
export class KnowledgeBaseService {
  private kb: KnowledgeBase = DEFAULT_KB;
  private listeners: Set<(kb: KnowledgeBase) => void> = new Set();

  /**
   * 加载知识库
   */
  async loadKnowledgeBase(_kbId?: string): Promise<KnowledgeBase> {
    // 实际项目中应从后端 API 加载
    // const response = await fetch(`/api/kb/${kbId || 'default'}`);
    // this.kb = await response.json();
    
    console.log(`[KB] 知识库已加载: ${this.kb.name} v${this.kb.version}`);
    this.notifyListeners();
    return this.kb;
  }

  /**
   * 获取完整知识库
   */
  getKnowledgeBase(): KnowledgeBase {
    return this.kb;
  }

  /**
   * 获取知识库分层
   */
  getLayers(): KBLayers {
    return this.kb.layers;
  }

  // ============================================
  // 指南查询
  // ============================================

  /**
   * 获取所有指南
   */
  getGuidelines(): Guideline[] {
    return this.kb.layers.guidelines;
  }

  /**
   * 按场景获取指南
   */
  getGuidelinesByScene(sceneId: string): Guideline[] {
    return this.kb.layers.guidelines.filter(g => 
      g.applicableScenes.includes(sceneId)
    );
  }

  /**
   * 按ID获取指南
   */
  getGuidelineById(id: string): Guideline | undefined {
    return this.kb.layers.guidelines.find(g => g.id === id);
  }

  // ============================================
  // SOP 查询
  // ============================================

  /**
   * 获取所有 SOP
   */
  getSOPs(): SOP[] {
    return this.kb.layers.sops;
  }

  /**
   * 按场景获取 SOP
   */
  getSOPsByScene(sceneId: string): SOP[] {
    return this.kb.layers.sops.filter(s => 
      s.applicableScenes.includes(sceneId)
    );
  }

  /**
   * 按科室获取 SOP
   */
  getSOPsByDepartment(department: string): SOP[] {
    return this.kb.layers.sops.filter(s => 
      s.department === department
    );
  }

  // ============================================
  // 评估量表查询
  // ============================================

  /**
   * 获取所有评估量表
   */
  getAssessmentScales(): AssessmentScale[] {
    return this.kb.layers.assessmentScales;
  }

  /**
   * 按ID获取评估量表
   */
  getAssessmentScaleById(id: string): AssessmentScale | undefined {
    return this.kb.layers.assessmentScales.find(s => s.id === id);
  }

  /**
   * 计算 PUSH 量表分数
   */
  calculatePUSH(
    surfaceArea: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    exudateAmount: 0 | 1 | 2 | 3,
    tissueType: 0 | 1 | 2 | 3 | 4
  ): { score: number; interpretation: string } {
    const score = surfaceArea + exudateAmount + tissueType;
    
    let interpretation = '';
    if (score <= 4) {
      interpretation = '愈合良好，继续当前治疗方案';
    } else if (score <= 8) {
      interpretation = '愈合进展一般，需评估治疗方案';
    } else if (score <= 12) {
      interpretation = '愈合进展缓慢，建议调整治疗方案';
    } else {
      interpretation = '愈合差，需要积极干预';
    }

    return { score, interpretation };
  }

  // ============================================
  // 临床路径查询
  // ============================================

  /**
   * 获取所有临床路径
   */
  getClinicalPathways(): ClinicalPathway[] {
    return this.kb.layers.clinicalPathways;
  }

  /**
   * 按病症获取临床路径
   */
  getPathwayByCondition(condition: string): ClinicalPathway | undefined {
    return this.kb.layers.clinicalPathways.find(p => 
      p.condition.toLowerCase() === condition.toLowerCase()
    );
  }

  // ============================================
  // 宣教材料查询
  // ============================================

  /**
   * 获取所有宣教材料
   */
  getEducationMaterials(): EducationMaterial[] {
    return this.kb.layers.educationMaterials;
  }

  /**
   * 按目标受众获取宣教材料
   */
  getEducationMaterialsByAudience(audience: string): EducationMaterial[] {
    return this.kb.layers.educationMaterials.filter(m => 
      m.targetAudience.includes(audience as any)
    );
  }

  // ============================================
  // 质控规则查询
  // ============================================

  /**
   * 获取所有质控规则
   */
  getQualityControlRules(): QualityControlRule[] {
    return this.kb.layers.qualityControl;
  }

  /**
   * 按严重性获取质控规则
   */
  getRulesBySeverity(severity: 'info' | 'warning' | 'error'): QualityControlRule[] {
    return this.kb.layers.qualityControl.filter(r => r.severity === severity);
  }

  // ============================================
  // 结局数据管理
  // ============================================

  /**
   * 获取所有结局记录
   */
  getOutcomeRecords(): OutcomeRecord[] {
    return this.kb.layers.outcomes;
  }

  /**
   * 按场景获取结局记录
   */
  getOutcomesByScene(sceneId: string): OutcomeRecord[] {
    return this.kb.layers.outcomes.filter(o => o.sceneId === sceneId);
  }

  /**
   * 添加结局记录（可生长 KB）
   */
  async addOutcomeRecord(record: Omit<OutcomeRecord, 'id' | 'timestamp'>): Promise<OutcomeRecord> {
    const newRecord: OutcomeRecord = {
      ...record,
      id: `outcome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    this.kb.layers.outcomes.push(newRecord);
    this.kb.lastUpdated = Date.now();
    
    // 实际项目中应同步到后端
    // await fetch('/api/kb/outcomes', { method: 'POST', body: JSON.stringify(newRecord) });
    
    this.notifyListeners();
    console.log(`[KB] 结局记录已添加: ${newRecord.id}`);
    
    return newRecord;
  }

  // ============================================
  // 知识库更新
  // ============================================

  /**
   * 更新知识库（可生长）
   */
  async updateKnowledgeBase(updates: Partial<KBLayers>): Promise<void> {
    this.kb.layers = {
      ...this.kb.layers,
      ...updates
    };
    this.kb.lastUpdated = Date.now();
    
    this.notifyListeners();
    console.log('[KB] 知识库已更新');
  }

  /**
   * 添加知识库监听器
   */
  addListener(listener: (kb: KnowledgeBase) => void): void {
    this.listeners.add(listener);
  }

  /**
   * 移除知识库监听器
   */
  removeListener(listener: (kb: KnowledgeBase) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.kb));
  }

  /**
   * 搜索知识库
   */
  search(query: string): {
    guidelines: Guideline[];
    sops: SOP[];
    educationMaterials: EducationMaterial[];
  } {
    const lowerQuery = query.toLowerCase();
    
    return {
      guidelines: this.kb.layers.guidelines.filter(g => 
        g.title.toLowerCase().includes(lowerQuery) ||
        g.content.toLowerCase().includes(lowerQuery)
      ),
      sops: this.kb.layers.sops.filter(s => 
        s.title.toLowerCase().includes(lowerQuery)
      ),
      educationMaterials: this.kb.layers.educationMaterials.filter(m => 
        m.title.toLowerCase().includes(lowerQuery) ||
        m.content.toLowerCase().includes(lowerQuery)
      )
    };
  }
}

// 导出单例
export const knowledgeBaseService = new KnowledgeBaseService();
