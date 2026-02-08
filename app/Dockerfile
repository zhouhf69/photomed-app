# PhotoMed - React SPA Dockerfile
# 开发：菊花教授 周宏锋
# 多阶段构建，生产环境优化

# ==================== 阶段 1：构建 ====================
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖（使用 ci 确保一致性）
RUN npm ci --only=production=false

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# ==================== 阶段 2：生产环境 ====================
FROM nginx:alpine AS production

# 安装安全更新
RUN apk upgrade --no-cache

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 创建非 root 用户运行 nginx（安全最佳实践）
RUN addgroup -g 1001 -S photomed && \
    adduser -S photomed -u 1001 -G photomed

# 设置文件权限
RUN chown -R photomed:photomed /usr/share/nginx/html && \
    chown -R photomed:photomed /var/cache/nginx && \
    chown -R photomed:photomed /var/log/nginx && \
    chown -R photomed:photomed /etc/nginx/conf.d

# 切换到非 root 用户
USER photomed

# 暴露端口（环境变量可覆盖）
EXPOSE ${PORT:-80}

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-80}/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
