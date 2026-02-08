# PhotoMed - Vercel 部署图文教程

> 开发：菊花教授 周宏锋
> 适合：零基础用户

---

## 📱 为什么选 Vercel？

- ✅ **免费**：个人项目完全免费
- ✅ **简单**：一键部署，自动更新
- ✅ **快速**：全球 CDN，访问速度快
- ✅ **专业**：支持自定义域名、HTTPS

---

## 准备工作

你需要：
1. 一个 **GitHub 账号**（免费注册）
2. 项目代码（已为你准备好）

---

## 第一部分：创建 GitHub 仓库

### 步骤 1：打开 GitHub

访问 https://github.com

- 有账号直接登录
- 没账号点击 **Sign up** 注册（免费）

### 步骤 2：创建新仓库

1. 登录后，点击右上角 **+** 按钮
2. 选择 **New repository**

```
+  →  New repository
```

### 步骤 3：填写仓库信息

| 项目 | 填写内容 |
|------|---------|
| Repository name | `photomed-app` |
| Description | PhotoMed医疗智能底座 |
| 公开/私有 | 选 Public（免费） |
| Add a README | ✅ 勾选 |

点击绿色按钮 **Create repository**

### 步骤 4：复制仓库地址

创建成功后，看到类似这样的地址：
```
https://github.com/你的用户名/photomed-app.git
```

**复制这个地址，后面要用！**

---

## 第二部分：上传代码

### 方法 A：使用命令行（推荐）

#### Windows 用户：

1. 按 `Win + R`，输入 `cmd`，回车
2. 依次执行以下命令：

```cmd
cd 桌面
```

把项目文件夹拖到命令行窗口，会自动显示路径

```cmd
cd app
```

```cmd
git init
```

```cmd
git add .
```

```cmd
git commit -m "Initial commit"
```

```cmd
git remote add origin https://github.com/你的用户名/photomed-app.git
```

```cmd
git push -u origin main
```

#### Mac 用户：

1. 打开「终端」应用
2. 执行：

```bash
cd ~/Desktop/app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/photomed-app.git
git push -u origin main
```

### 方法 B：使用 GitHub Desktop（图形界面）

1. 下载：https://desktop.github.com
2. 安装并登录
3. 选择 **File** → **Add local repository**
4. 选择 `app` 文件夹
5. 填写 Summary: `Initial commit`
6. 点击 **Commit to main**
7. 点击 **Publish repository**

---

## 第三部分：部署到 Vercel

### 步骤 1：注册 Vercel

1. 访问 https://vercel.com
2. 点击 **Sign Up**
3. 选择 **Continue with GitHub**
4. 授权 Vercel 访问你的 GitHub

### 步骤 2：导入项目

1. 登录后，点击 **Add New...**
2. 选择 **Project**
3. 在列表中找到 `photomed-app`
4. 点击 **Import**

### 步骤 3：配置构建设置

看到配置页面，确认以下设置：

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**不用改，直接用默认的！**

点击 **Deploy** 按钮

### 步骤 4：等待部署

- 看到 Building 进度条
- 等待 1-2 分钟
- 出现 🎉 **Congratulations!** 就是成功了！

### 步骤 5：访问你的网站

部署成功后，Vercel 会给你分配一个域名：
```
https://photomed-app-xxx.vercel.app
```

点击域名即可访问！

---

## 第四部分：后续更新

### 修改代码后如何更新？

每次修改代码后，执行：

```bash
git add .
git commit -m "描述你的修改"
git push origin main
```

✅ Vercel 会自动检测并重新部署！

---

## 常见问题

### Q: 提示 "git 不是内部或外部命令"

**解决**：安装 Git
- Windows: https://git-scm.com/download/win
- Mac: https://git-scm.com/download/mac

### Q: 提示 "Permission denied"

**解决**：需要登录 GitHub
```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

### Q: 部署失败，显示 Build Error

**解决**：检查配置
1. 进入 Vercel 项目
2. 点击 **Settings** → **General**
3. 确认：
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist

### Q: 如何绑定自己的域名？

1. Vercel 项目 → **Settings** → **Domains**
2. 输入你的域名
3. 按提示添加 DNS 记录

---

## 联系开发者

**开发：菊花教授 周宏锋**

如有问题，欢迎反馈！

---

## 总结

| 步骤 | 操作 | 时间 |
|------|------|------|
| 1 | 创建 GitHub 账号 | 2分钟 |
| 2 | 创建仓库 | 1分钟 |
| 3 | 上传代码 | 3分钟 |
| 4 | 注册 Vercel | 1分钟 |
| 5 | 部署项目 | 2分钟 |
| **总计** | | **约10分钟** |

🎉 **恭喜你！你的网站已经上线了！**
