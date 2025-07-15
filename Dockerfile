# 基础镜像
FROM nginx:alpine

# 拷贝自定义 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 拷贝构建好的静态文件
COPY dist/ /usr/share/nginx/html/

# 暴露端口（可选）
EXPOSE 8686

CMD ["nginx", "-g", "daemon off;"]
