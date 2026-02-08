# PhotoMed 医疗智能底座

**Photo-first Medical Intelligence Engine**

以手机照相为医疗数据主入口的通用医疗智能底座

---

## 开发信息

**开发：菊花教授 周宏锋**

**版本：v1.0.0**

**日期：2024年2月**

---

## 在线访问

🔗 **https://xewsqlf5jbqoa.ok.kimi.link**

---

## 功能特性

### 健康自测场景（10个）

| 场景 | 图标 | 说明 |
|------|------|------|
| 皮肤检测 | ✨ | AI分析肤质类型、皮肤问题 |
| 指甲健康 | 💅 | 通过指甲分析健康状况 |
| 口腔健康 | 🦷 | 分析牙齿、牙龈、舌头健康 |
| 舌苔分析 | 👅 | 基于中医舌诊辨识体质 |
| 头发/头皮 | 💇 | 分析头发类型、头皮状况 |
| 眼睛健康 | 👁️ | 分析眼白颜色、眼周状况 |
| 足部健康 | 🦶 | 分析足部皮肤、趾甲状况 |
| 体态姿势 | 🧍 | 分析站姿、坐姿体态 |
| 大便识别 | 💩 | 基于布里斯托分类法分析 |
| 伤口造口 | 🩹 | 专业伤口评估（PUSH量表） |

### 专业医疗场景（3个）

| 场景 | 图标 | 说明 |
|------|------|------|
| 伤口造口评估 | 🩹 | 专业伤口护理评估 |
| 体检报告分析 | 📋 | 完整报告解读、风险评估、干预方案 |
| 检测结果分析 | 🧪 | 血常规、生化等检测分析 |

### 核心功能

- ✅ **AI影像分析**：拍照即可获取健康分析
- ✅ **ImageQA质控**：多维度图像质量评估
- ✅ **风险评估**：基于权威指南的健康风险评估
- ✅ **干预方案**：个性化健康建议和随访计划
- ✅ **参考依据**：所有分析附权威医学指南来源
- ✅ **移动端优化**：针对手机触摸和布局优化
- ✅ **隐私保护**：数据本地存储，不上传服务器

---

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI组件**：shadcn/ui + Tailwind CSS
- **状态管理**：React Hooks
- **图标库**：Lucide React

---

## 项目结构

```
app/
├── src/
│   ├── components/       # UI组件
│   │   ├── analysis/     # 分析结果组件
│   │   ├── camera/       # 影像采集组件
│   │   ├── legal/        # 法律声明组件
│   │   ├── navigation/   # 导航组件
│   │   └── about/        # 关于页面
│   ├── scenes/           # 场景处理器
│   ├── sections/         # 页面区块
│   ├── services/         # 服务层
│   ├── data/             # 数据配置
│   ├── types/            # 类型定义
│   ├── App.tsx           # 主应用
│   └── index.css         # 全局样式
├── dist/                 # 构建输出
├── index.html            # 入口HTML
├── package.json          # 依赖配置
├── DEPLOY.md             # 部署指南
├── PATENT_ADVICE.md      # 专利保护建议
└── README.md             # 项目说明
```

---

## 🚀 一键部署

### 方式一：Docker（推荐自托管）

```bash
# 1. 克隆代码
git clone https://github.com/YOUR_USERNAME/photomed-app.git
cd photomed-app

# 2. 一键部署
./deploy.sh docker
```

访问 http://localhost:3000

### 方式二：Vercel（推荐快速上线）

```bash
# 1. 克隆代码
git clone https://github.com/YOUR_USERNAME/photomed-app.git
cd photomed-app

# 2. 一键部署
./deploy.sh vercel
```

### 方式三：GitHub Pages（免费）

```bash
# 推送到 main 分支自动部署
git push origin main
```

---

## 📋 详细部署指南

### Docker 部署

```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用一键脚本
./deploy.sh docker
```

### Vercel 部署

1. Fork 本仓库到你的 GitHub
2. 访问 https://vercel.com/new
3. 选择你的仓库，Framework 选 **Vite**
4. 点击 Deploy

### 环境变量

```bash
cp .env.example .env
# 编辑 .env 文件配置你的变量
```

---

## 📁 部署文件说明

| 文件 | 说明 |
|------|------|
| `Dockerfile` | Docker 镜像构建 |
| `docker-compose.yml` | Docker 编排配置 |
| `vercel.json` | Vercel 部署配置 |
| `.github/workflows/deploy.yml` | GitHub Actions 自动部署 |
| `deploy.sh` | 一键部署脚本 |
| `DEPLOY.md` | 详细部署文档 |

---

## 💻 本地开发

```bash
# 1. 进入项目目录
cd app

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

---

## 🔨 生产构建

```bash
npm run build
# 输出到 dist/ 目录
```

---

## 法律声明

⚠️ **重要提示**：本平台的AI分析结果仅供参考，不能替代专业医生的诊断和治疗建议。如有健康问题，请及时就医。

详细法律声明见：[法律声明文档](./src/components/legal/LegalNotice.tsx)

---

## 专利保护

本项目涉及以下可申请专利的技术点：

1. **多场景医疗影像AI分析方法**（发明专利）
2. **ImageQA质量评估算法**（发明专利）
3. **体检报告智能解读系统**（发明专利）
4. **Scene Pack模块化架构**（实用新型）

详细专利保护建议见：[PATENT_ADVICE.md](./PATENT_ADVICE.md)

---

## 许可证

MIT License

Copyright (c) 2024 菊花教授 周宏锋

---

## 联系方式

**开发：菊花教授 周宏锋**

---

## 致谢

感谢以下开源项目：

- React
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
