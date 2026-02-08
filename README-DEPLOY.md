# PhotoMed 部署指南汇总

> 开发：菊花教授 周宏锋

---

## 🚀 推荐方案：Vercel + GitHub（专业级）

这是目前最主流的前端部署方案，适合长期维护。

### 方案优势

- ✅ 自动部署（代码推送即自动更新）
- ✅ 全球 CDN（访问速度快）
- ✅ 免费 HTTPS
- ✅ 版本管理（Git 历史记录）
- ✅ 预览环境（每次提交自动生成预览）

---

## 📚 部署文档

| 文档 | 适用人群 | 说明 |
|------|---------|------|
| [GITHUB_VERCEL_DEPLOY.md](./GITHUB_VERCEL_DEPLOY.md) | 有基础的用户 | 完整的命令行部署指南 |
| [VERCEL_DEPLOY_STEP_BY_STEP.md](./VERCEL_DEPLOY_STEP_BY_STEP.md) | 零基础用户 | 图文步骤教程 |
| [quick-deploy.sh](./quick-deploy.sh) | 技术用户 | 一键部署脚本 |

---

## ⚡ 快速开始（3步走）

### 第 1 步：创建 GitHub 仓库

访问 https://github.com/new

填写：
- Repository name: `photomed-app`
- 勾选 Add a README file
- 点击 Create repository

### 第 2 步：上传代码

```bash
# 进入项目目录
cd app

# 初始化并推送
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/photomed-app.git
git push -u origin main
```

### 第 3 步：部署到 Vercel

1. 访问 https://vercel.com/new
2. 选择你的 GitHub 仓库
3. Framework Preset 选 **Vite**
4. 点击 **Deploy**

✅ 完成！约 2 分钟后网站上线！

---

## 📖 详细教程

### 零基础用户

请阅读 **[VERCEL_DEPLOY_STEP_BY_STEP.md](./VERCEL_DEPLOY_STEP_BY_STEP.md)**

包含：
- 图文步骤说明
- 常见问题解答
- Windows/Mac 分别说明

### 有技术基础的用户

请阅读 **[GITHUB_VERCEL_DEPLOY.md](./GITHUB_VERCEL_DEPLOY.md)**

包含：
- 完整的命令行操作
- 高级配置说明
- 团队协作流程

---

## 🔧 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **PDF 导出**: jsPDF + html2canvas
- **图表**: Recharts

---

## 📁 项目结构

```
app/
├── src/
│   ├── components/      # UI 组件
│   ├── sections/        # 页面区块
│   ├── services/        # 业务逻辑服务
│   ├── data/            # 数据配置
│   ├── types/           # TypeScript 类型
│   └── App.tsx          # 主应用
├── dist/                # 构建输出
├── index.html           # 入口 HTML
├── package.json         # 依赖配置
└── vite.config.ts       # Vite 配置
```

---

## 🔄 日常维护

### 更新代码

```bash
# 修改代码后执行
git add .
git commit -m "描述修改内容"
git push origin main
```

✅ Vercel 会自动重新部署！

### 查看部署状态

访问 https://vercel.com/dashboard

---

## 🆘 遇到问题？

1. 查看详细文档：[VERCEL_DEPLOY_STEP_BY_STEP.md](./VERCEL_DEPLOY_STEP_BY_STEP.md)
2. 常见问题在文档末尾有解答
3. 检查 GitHub 仓库是否正确创建
4. 确认 Vercel 配置是否正确

---

## 📞 联系开发者

**开发：菊花教授 周宏锋**

---

## 📄 相关文件

- [README.md](./README.md) - 项目介绍
- [DEPLOY.md](./DEPLOY.md) - 部署说明
- [PATENT_ADVICE.md](./PATENT_ADVICE.md) - 专利保护建议
- [LEGAL_NOTICE.md](./LEGAL_NOTICE.md) - 法律声明

---

**开发：菊花教授 周宏锋**
