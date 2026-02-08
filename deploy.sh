#!/bin/bash
# PhotoMed - 一键部署脚本
# 开发：菊花教授 周宏锋
# 支持：Docker / Vercel / GitHub Pages

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 打印 Logo
print_logo() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                                                            ║"
    echo "║   PhotoMed - 医疗智能底座                                  ║"
    echo "║   Photo-first Medical Intelligence Engine                  ║"
    echo "║                                                            ║"
    echo "║   开发：菊花教授 周宏锋                                    ║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    fi
    return 0
}

# 检查 Docker
check_docker() {
    if ! check_command docker; then
        print_error "Docker 未安装"
        echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
        exit 1
    fi
    
    if ! check_command docker-compose; then
        print_error "Docker Compose 未安装"
        echo "请访问 https://docs.docker.com/compose/install/ 安装"
        exit 1
    fi
    
    print_success "Docker 环境检查通过"
}

# 检查 Node.js
check_node() {
    if ! check_command node; then
        print_error "Node.js 未安装"
        echo "请访问 https://nodejs.org/ 安装 Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 版本过低，需要 18+"
        exit 1
    fi
    
    print_success "Node.js 环境检查通过"
}

# 检查 Git
check_git() {
    if ! check_command git; then
        print_error "Git 未安装"
        echo "请访问 https://git-scm.com/downloads 安装 Git"
        exit 1
    fi
    
    print_success "Git 环境检查通过"
}

# Docker 部署
deploy_docker() {
    print_info "开始 Docker 部署..."
    
    check_docker
    
    # 检查 .env 文件
    if [ ! -f .env ]; then
        print_warning ".env 文件不存在，使用默认配置"
        cp .env.example .env
    fi
    
    # 构建并启动
    print_info "构建 Docker 镜像..."
    docker-compose build --no-cache
    
    print_info "启动服务..."
    docker-compose up -d
    
    # 等待服务启动
    print_info "等待服务启动..."
    sleep 5
    
    # 检查健康状态
    if docker-compose ps | grep -q "Up"; then
        print_success "部署成功！"
        echo ""
        echo "访问地址："
        echo "  - 本地: http://localhost:3000"
        echo "  - 网络: http://$(hostname -I | awk '{print $1}'):3000"
        echo ""
        echo "查看日志: docker-compose logs -f"
        echo "停止服务: docker-compose down"
    else
        print_error "部署失败，请检查日志"
        docker-compose logs
        exit 1
    fi
}

# Vercel 部署
deploy_vercel() {
    print_info "开始 Vercel 部署..."
    
    check_node
    check_git
    
    # 检查是否已登录 Vercel
    if ! check_command vercel; then
        print_info "安装 Vercel CLI..."
        npm install -g vercel
    fi
    
    # 登录检查
    if ! vercel whoami &> /dev/null; then
        print_info "请先登录 Vercel"
        vercel login
    fi
    
    # 部署
    print_info "部署到 Vercel..."
    vercel --prod
    
    print_success "Vercel 部署完成！"
}

# GitHub Pages 部署
deploy_github_pages() {
    print_info "开始 GitHub Pages 部署..."
    
    check_node
    check_git
    
    # 检查是否在 Git 仓库中
    if [ ! -d .git ]; then
        print_error "当前目录不是 Git 仓库"
        echo "请先执行: git init"
        exit 1
    fi
    
    # 检查远程仓库
    if ! git remote -v &> /dev/null; then
        print_error "未配置远程仓库"
        echo "请先添加远程仓库: git remote add origin <URL>"
        exit 1
    fi
    
    # 构建
    print_info "构建应用..."
    npm ci
    npm run build
    
    # 推送到 GitHub
    print_info "推送到 GitHub..."
    git add .
    git commit -m "Deploy to GitHub Pages" || true
    git push origin main
    
    print_success "GitHub Pages 部署完成！"
    echo "请访问: https://<username>.github.io/<repo>/"
}

# 本地开发
run_dev() {
    print_info "启动本地开发服务器..."
    
    check_node
    
    # 安装依赖
    if [ ! -d node_modules ]; then
        print_info "安装依赖..."
        npm install
    fi
    
    # 启动开发服务器
    print_info "启动开发服务器..."
    npm run dev
}

# 生产构建
run_build() {
    print_info "构建生产版本..."
    
    check_node
    
    # 安装依赖
    if [ ! -d node_modules ]; then
        print_info "安装依赖..."
        npm install
    fi
    
    # 构建
    npm run build
    
    print_success "构建完成！输出目录: dist/"
}

# 显示帮助
show_help() {
    echo "PhotoMed - 一键部署脚本"
    echo ""
    echo "用法: ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  docker          使用 Docker 部署"
    echo "  vercel          部署到 Vercel"
    echo "  github-pages    部署到 GitHub Pages"
    echo "  dev             启动本地开发服务器"
    echo "  build           构建生产版本"
    echo "  help            显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh docker        # Docker 部署"
    echo "  ./deploy.sh vercel        # Vercel 部署"
    echo "  ./deploy.sh dev           # 本地开发"
    echo ""
    echo "开发：菊花教授 周宏锋"
}

# 主函数
main() {
    print_logo
    
    case "${1:-help}" in
        docker)
            deploy_docker
            ;;
        vercel)
            deploy_vercel
            ;;
        github-pages|gh-pages)
            deploy_github_pages
            ;;
        dev|develop)
            run_dev
            ;;
        build)
            run_build
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
