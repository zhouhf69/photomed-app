# Git 问题修复指南

> 开发：菊花教授 周宏锋

---

## 问题 1：未配置 Git 邮箱

**错误信息**：
```
fatal: unable to auto-detect email address (got 'zhouh@zhouhf69.(none)')
```

**解决方法**：

在 PowerShell 中执行：

```powershell
git config --global user.name "zhouhf69"
git config --global user.email "你的邮箱@example.com"
```

**示例**：
```powershell
git config --global user.name "zhouhf69"
git config --global user.email "zhouhf69@qq.com"
```

---

## 问题 2：main 分支不存在

**错误信息**：
```
error: src refspec main does not match any
```

**原因**：还没有提交任何文件

**解决方法**：

```powershell
# 1. 确保在项目目录中
cd C:\Users\zhouh\photomed-app

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit"

# 4. 再推送
git push -u origin main
```

---

## 问题 3：远程仓库已存在

**错误信息**：
```
error: remote origin already exists.
```

**解决方法**：

先删除再添加：

```powershell
# 删除旧的远程仓库
git remote remove origin

# 添加正确的远程仓库（用你的用户名）
git remote add origin https://github.com/zhouhf69/photomed-app.git
```

---

## ✅ 完整修复步骤（按顺序执行）

在 PowerShell 中依次执行：

```powershell
# 1. 进入项目目录
cd C:\Users\zhouh\photomed-app

# 2. 配置 Git 用户信息
git config --global user.name "zhouhf69"
git config --global user.email "你的邮箱@qq.com"

# 3. 检查当前状态
git status

# 4. 添加所有文件
git add .

# 5. 提交文件
git commit -m "Initial commit: PhotoMed v1.0.0"

# 6. 删除旧的远程仓库（如果存在）
git remote remove origin

# 7. 添加正确的远程仓库
git remote add origin https://github.com/zhouhf69/photomed-app.git

# 8. 推送到 GitHub
git push -u origin main
```

---

## 🔍 验证每一步

### 检查 Git 配置

```powershell
git config --list
```

应该看到：
```
user.name=zhouhf69
user.email=你的邮箱@qq.com
```

### 检查远程仓库

```powershell
git remote -v
```

应该看到：
```
origin  https://github.com/zhouhf69/photomed-app.git (fetch)
origin  https://github.com/zhouhf69/photomed-app.git (push)
```

### 检查提交状态

```powershell
git log
```

应该看到你的提交记录。

---

## 🆘 如果还是失败

### 方法一：重新开始

```powershell
# 1. 备份项目文件夹
# 2. 删除原来的文件夹
# 3. 重新解压项目
# 4. 重新执行所有步骤
```

### 方法二：使用 GitHub Desktop（图形界面）

1. 下载：https://desktop.github.com
2. 安装并登录
3. 选择 File → Add local repository
4. 选择项目文件夹
5. 填写提交信息，点击 Commit
6. 点击 Publish repository

### 方法三：直接在 GitHub 网页上传

1. 打开 https://github.com/zhouhf69/photomed-app
2. 点击 Add file → Upload files
3. 拖拽项目文件上传
4. 点击 Commit changes

---

## 📞 需要帮助？

**开发：菊花教授 周宏锋**

---

## 常见问题

### Q: 提示 "Could not resolve host: github.com"

**解决**：检查网络连接，可能需要使用代理。

### Q: 提示 "Permission denied"

**解决**：需要登录 GitHub，或配置 SSH 密钥。

### Q: 提示 "Repository not found"

**解决**：检查仓库地址是否正确，仓库是否存在。

---

**开发：菊花教授 周宏锋**
