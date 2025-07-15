# TD Designer Starter

一个基于 Vue3、TypeScript 和 Vite 的高质量中后台前端项目模板，适用于快速搭建企业级管理系统、数据大屏、AI 应用等多种场景。项目结构清晰，功能完善，支持权限管理、国际化、主题切换等特性，助力开发者高效开发和二次定制。

---

## 🚀 项目特性

- **现代前端技术栈**：Vue3 + TypeScript + Vite
- **模块化目录结构**，便于扩展和维护
- **完善的权限管理**，支持前后端权限控制
- **国际化支持**，内置中英文切换
- **主题切换**，支持多种配色方案
- **丰富的业务组件**，如表格、卡片、趋势图等
- **Mock 数据支持**，便于本地开发和联调
- **响应式布局**，适配多终端

---

## 📦 技术栈

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)（状态管理）
- [Vue Router](https://router.vuejs.org/)
- [Less](https://lesscss.org/)（CSS 预处理）
- [Axios](https://axios-http.com/)（请求库）

---

## 🏗️ 主要功能模块

- 用户登录/注册/登出
- 权限管理（菜单、路由、按钮级）
- 国际化（中英文切换）
- 通用业务组件（表格、卡片、趋势图、结果页等）
- 多布局支持（空白、内容、AI等）
- Mock 数据与接口模拟
- 响应式适配
- 错误页（403、404、500等）

---

## 📂 目录结构说明

```text
├── src
│   ├── api                # 接口请求与数据模型
│   ├── assets             # 静态资源
│   ├── components         # 通用业务组件
│   ├── config             # 配置文件
│   ├── constants          # 常量定义
│   ├── hooks              # 自定义 hooks
│   ├── layouts            # 布局相关
│   ├── locales            # 国际化资源
│   ├── pages              # 业务页面
│   ├── permission.ts      # 权限控制入口
│   ├── router             # 路由配置
│   ├── store              # 状态管理
│   ├── style              # 全局样式
│   ├── types              # 类型定义
│   ├── utils              # 工具函数
│   └── main.ts            # 入口文件
├── mock                   # 本地 mock 数据
├── public                 # 公共资源
├── scripts                # 脚本工具
├── index.html             # HTML 模板
├── vite.config.ts         # Vite 配置
└── ...
```

---

## 🛠️ 安装与启动

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd td-designer-starter
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

```bash
npm run dev
```

### 4. 打包构建

```bash
npm run build:mockSite
```

### 5. 预览构建产物

```bash
npm run preview
```

---

## ❓ 常见问题

### 1. 如何切换语言？

点击右上角语言切换按钮，或修改 `src/locales/` 下的配置。

### 2. 如何自定义主题？

可在 `src/config/style.ts` 或 `src/style/variables.less` 中调整主题变量。

