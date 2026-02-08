#!/bin/bash
# PhotoMed 快速部署脚本
# 开发：菊花教授 周宏锋

echo "=========================================="
echo "  PhotoMed - GitHub + Vercel 快速部署"
echo "  开发：菊花教授 周宏锋"
echo "=========================================="
echo ""

# 检查是否安装了 git
if ! command -v git &> /dev/null; then
    echo "❌ 错误：未安装 Git"
    echo "请先安装 Git: https://git-scm.com/downloads"
    exit 1
fi

# 检查是否安装了 node
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未安装 Node.js"
    echo "请先安装 Node.js: https://nodejs.org"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 提示用户输入 GitHub 仓库地址
echo "请先在 GitHub 创建仓库: https://github.com/new"
echo ""
read -p "请输入你的 GitHub 仓库地址 (如: https://github.com/username/photomed-app.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 错误：仓库地址不能为空"
    exit 1
fi

echo ""
echo "🚀 开始部署流程..."
echo ""

# 进入项目目录
cd app

# 初始化 Git
echo "📦 初始化 Git 仓库..."
git init
git branch -m main

# 添加所有文件
echo "📁 添加文件到 Git..."
git add .

# 提交
echo "💾 提交代码..."
git commit -m "Initial commit: PhotoMed v1.0.0 - 开发：菊花教授 周宏锋"

# 关联远程仓库
echo "🔗 关联远程仓库..."
git remote add origin $REPO_URL

# 推送到 GitHub
echo "☁️ 推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ 代码已推送到 GitHub!"
    echo "=========================================="
    echo ""
    echo "下一步：部署到 Vercel"
    echo ""
    echo "1. 访问 https://vercel.com/new"
    echo "2. 选择你的 GitHub 仓库"
    echo "3. Framework Preset 选择: Vite"
    echo "4. Build Command: npm run build"
    echo "5. Output Directory: dist"
    echo "6. 点击 Deploy"
    echo ""
    echo "🎉 部署完成后，你将获得一个专属域名！"
    echo ""
    echo "开发：菊花教授 周宏锋"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "1. GitHub 仓库是否已创建"
    echo "2. 仓库地址是否正确"
    echo "3. 是否已配置 Git 凭据"
    echo ""
    echo "手动配置 Git 凭据："
    echo "git config --global user.name '你的名字'"
    echo "git config --global user.email '你的邮箱'"
fi
