# PhotoMed - 一键部署指南

> 开发：菊花教授 周宏锋

---

## 🚀 快速选择部署方式

| 方式 | 难度 | 成本 | 适用场景 |
|------|------|------|----------|
| [Vercel（推荐）](#方式一vercel-推荐) | ⭐ 最简单 | 免费 | 个人/小团队 |
| [Docker](#方式二docker) | ⭐⭐ 中等 | 服务器费用 | 企业/自托管 |
| [GitHub Pages](#方式三github-pages) | ⭐ 简单 | 免费 | 静态展示 |

---

## 方式一：Vercel（推荐）

**最适合**：快速上线、自动部署、全球 CDN

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写：
   - Repository name: `photomed-app`
   - ✅ 勾选 Add a README file
3. 点击 **Create repository**

### 步骤 2：上传代码

```bash
# 进入项目目录
cd photomed-app

# 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 关联远程仓库（替换为你的用户名）
git remote add origin https://github.com/YOUR_USERNAME/photomed-app.git
git push -u origin main
```

### 步骤 3：部署到 Vercel

1. 访问 https://vercel.com/new
2. 点击 **Continue with GitHub** 登录
3. 选择 `photomed-app` 仓库
4. Framework Preset 选择 **Vite**
5. 点击 **Deploy**

✅ **完成！** 约 2 分钟后，你的网站上线！

域名格式：`https://photomed-app-xxx.vercel.app`

---

## 方式二：Docker

**最适合**：自托管、企业内网、需要完全控制

### 前置要求

- 安装 Docker：https://docs.docker.com/get-docker/
- 安装 Docker Compose：https://docs.docker.com/compose/install/

### 一键启动

```bash
# 1. 克隆代码
git clone https://github.com/YOUR_USERNAME/photomed-app.git
cd photomed-app

# 2. 复制环境变量模板
cp .env.example .env

# 3. 启动服务
docker-compose up -d
```

✅ **完成！** 访问 http://localhost:3000

### 常用命令

```bash
# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 更新到最新版本
docker-compose pull
docker-compose up -d
```

### 生产环境部署

```bash
# 构建镜像
docker build -t photomed-app:latest .

# 运行容器
docker run -d \
  --name photomed-app \
  -p 80:80 \
  --restart unless-stopped \
  photomed-app:latest
```

---

## 方式三：GitHub Pages

**最适合**：免费托管、简单静态展示

### 步骤 1：配置 GitHub Actions

已配置 `.github/workflows/deploy.yml`，push 到 main 自动部署。

### 步骤 2：启用 GitHub Pages

1. 打开仓库 → Settings → Pages
2. Source 选择 **GitHub Actions**
3. 保存

### 步骤 3：推送代码

```bash
git push origin main
```

✅ **完成！** 访问 `https://YOUR_USERNAME.github.io/photomed-app/`

---

## 🔧 环境变量配置

### 创建 .env 文件

```bash
cp .env.example .env
```

### 常用变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | 3000 |
| `APP_NAME` | 应用名称 | PhotoMed |
| `APP_VERSION` | 应用版本 | 1.0.0 |
| `APP_DEVELOPER` | 开发者 | 菊花教授 周宏锋 |

---

## 🔐 配置 Vercel 自动部署（GitHub Actions）

### 步骤 1：获取 Vercel Token

1. 访问 https://vercel.com/account/tokens
2. 点击 **Create Token**
3. 复制 Token

### 步骤 2：配置 GitHub Secrets

1. 打开 GitHub 仓库 → Settings → Secrets and variables → Actions
2. 点击 **New repository secret**
3. 添加以下 Secrets：

| Secret 名称 | 值 |
|-------------|-----|
| `VERCEL_TOKEN` | 你的 Vercel Token |
| `VERCEL_ORG_ID` | Vercel 组织 ID（个人用户就是你的用户 ID） |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID |

### 获取 ORG_ID 和 PROJECT_ID

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 查看配置
cat .vercel/project.json
```

---

## 📁 部署文件说明

| 文件 | 说明 |
|------|------|
| `Dockerfile` | Docker 镜像构建配置 |
| `docker-compose.yml` | Docker Compose 编排配置 |
| `nginx.conf` | Nginx 服务器配置 |
| `vercel.json` | Vercel 部署配置 |
| `.env.example` | 环境变量模板 |
| `.github/workflows/deploy.yml` | GitHub Actions 自动部署 |

---

## 🆘 常见问题

### Q: Vercel 部署后页面空白？

**解决**：检查 `vite.config.ts` 中的 `base` 配置：
- Vercel: `base: '/'`
- GitHub Pages: `base: '/photomed-app/'`

### Q: Docker 构建失败？

**解决**：
```bash
# 清理缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

### Q: GitHub Actions 部署失败？

**解决**：
1. 检查 Secrets 是否配置正确
2. 查看 Actions 日志排查错误
3. 确认 Vercel Token 有效

### Q: 如何绑定自定义域名？

**Vercel**：
1. 项目 → Settings → Domains
2. 添加域名并按提示配置 DNS

**Docker**：
1. 配置反向代理（Nginx/Caddy）
2. 申请 SSL 证书

---

## 🔄 更新部署

### Vercel

```bash
git add .
git commit -m "更新内容"
git push origin main
```

✅ Vercel 自动重新部署

### Docker

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build
```

---

## 📞 技术支持

**开发：菊花教授 周宏锋**

---

## 📄 许可证

MIT License

Copyright (c) 2024 菊花教授 周宏锋
