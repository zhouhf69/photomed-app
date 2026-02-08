# PhotoMed - GitHub + Vercel 部署指南

> 开发：菊花教授 周宏锋

这是长期维护 PhotoMed 项目的最佳方案，支持自动部署、版本管理、团队协作。

---

## 方案优势

| 特性 | 说明 |
|------|------|
| 🔄 自动部署 | 代码推送到 GitHub 后，Vercel 自动构建部署 |
| 📊 版本管理 | Git 历史记录，随时回滚到任意版本 |
| 🌍 全球 CDN | Vercel 全球节点，访问速度快 |
| 🔒 免费 HTTPS | 自动 SSL 证书 |
| 👥 团队协作 | 多人开发，代码审查 |
| 📱 预览环境 | 每次提交自动生成预览链接 |

---

## 第一步：创建 GitHub 仓库

### 1.1 注册/登录 GitHub
- 访问 https://github.com
- 没有账号就注册一个（免费）

### 1.2 创建新仓库
1. 点击右上角 **+** → **New repository**
2. 填写信息：
   - **Repository name**: `photomed-app`
   - **Description**: PhotoMed - 以手机照相为医疗数据主入口的通用医疗智能底座
   - 选择 **Public**（公开）或 **Private**（私有）
   - ✅ 勾选 **Add a README file**
3. 点击 **Create repository**

### 1.3 获取仓库地址
创建后，复制仓库地址（格式如）：
```
https://github.com/你的用户名/photomed-app.git
```

---

## 第二步：上传代码到 GitHub

### 方法一：命令行方式（推荐）

在你的电脑上打开终端，执行：

```bash
# 1. 进入项目目录
cd /path/to/photomed-app

# 2. 初始化 Git 仓库
git init

# 3. 添加所有文件
git add .

# 4. 提交代码
git commit -m "Initial commit: PhotoMed v1.0.0"

# 5. 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/photomed-app.git

# 6. 推送到 GitHub
git push -u origin main
```

### 方法二：GitHub Desktop（图形界面）

1. 下载安装 GitHub Desktop：https://desktop.github.com
2. 打开软件，登录 GitHub 账号
3. 选择 **File** → **Add local repository**
4. 选择你的项目文件夹
5. 填写提交信息，点击 **Commit to main**
6. 点击 **Publish repository**

### 方法三：直接网页上传

1. 在 GitHub 仓库页面点击 **Add file** → **Upload files**
2. 拖拽或选择项目文件
3. 点击 **Commit changes**

---

## 第三步：部署到 Vercel

### 3.1 注册/登录 Vercel

1. 访问 https://vercel.com
2. 点击 **Sign Up**，选择 **Continue with GitHub**
3. 授权 Vercel 访问你的 GitHub 账号

### 3.2 导入项目

1. 登录后点击 **Add New...** → **Project**
2. 在 **Import Git Repository** 列表中找到 `photomed-app`
3. 点击 **Import**

### 3.3 配置构建设置

填写以下信息：

| 配置项 | 值 |
|--------|-----|
| **Framework Preset** | Vite |
| **Root Directory** | ./ |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

点击 **Deploy**

### 3.4 等待部署完成

- Vercel 会自动安装依赖、构建项目
- 约 1-2 分钟后，部署完成
- 获得你的专属域名：`https://photomed-app-xxx.vercel.app`

---

## 第四步：自定义域名（可选）

### 4.1 使用 Vercel 子域名

默认域名格式：`https://你的项目名-你的用户名.vercel.app`

### 4.2 绑定自己的域名

1. 在 Vercel 项目页面点击 **Settings** → **Domains**
2. 输入你的域名，如 `photomed.yourdomain.com`
3. 按照提示在域名服务商处添加 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

---

## 第五步：日常维护流程

### 更新代码并重新部署

```bash
# 1. 修改代码后，提交更改
git add .
git commit -m "修复bug：xxx"

# 2. 推送到 GitHub
git push origin main
```

✅ **完成！** Vercel 会自动检测推送并重新部署。

### 查看部署状态

1. 打开 Vercel 控制台：https://vercel.com/dashboard
2. 点击你的项目
3. 在 **Deployments** 标签查看所有部署记录

---

## 常见问题

### Q1: 部署失败怎么办？

1. 检查 Build Command 是否正确：`npm run build`
2. 检查 Output Directory 是否为：`dist`
3. 查看 Vercel 的 Build Logs 获取错误信息

### Q2: 如何回滚到旧版本？

1. 在 Vercel 项目页面点击 **Deployments**
2. 找到想要回滚的版本
3. 点击右侧的三个点 → **Promote to Production**

### Q3: 环境变量如何设置？

1. Vercel 项目页面 → **Settings** → **Environment Variables**
2. 添加变量名和值
3. 重新部署生效

### Q4: 如何设置密码保护？

1. Vercel 项目页面 → **Settings** → **Deployment Protection**
2. 开启 **Vercel Authentication**

---

## 项目信息

- **项目名称**: PhotoMed
- **版本**: v1.0.0
- **开发**: 菊花教授 周宏锋
- **技术栈**: React + TypeScript + Vite + Tailwind CSS
- **许可证**: MIT

---

## 相关链接

- GitHub: https://github.com/你的用户名/photomed-app
- Vercel: https://vercel.com/你的用户名/photomed-app
- 在线演示: https://photomed-app-xxx.vercel.app

---

**开发：菊花教授 周宏锋**
