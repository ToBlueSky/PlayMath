# 小小数学家 / Little Math Explorer

一个让数学动起来的小学互动学习空间。

## 快速启动

双击 `start.bat`（Windows）或运行：

```bash
npm install
npm run dev
```

浏览器自动打开 `http://localhost:5173/`。

## 生产构建

```bash
npm run build
npm run preview
```

`dist/` 目录即为可部署的静态文件。

## 部署

### Vercel（推荐）

```bash
npm i -g vercel
vercel
```

已配置 `vercel.json`，零配置部署。

### Netlify

将 `dist/` 拖拽到 https://app.netlify.com/drop

### GitHub Pages

```bash
npm run build
npx gh-pages -d dist
```

需在 `vite.config.ts` 中设置 `base: '/仓库名/'`。

## 项目结构

```
src/
├── App.tsx              # 应用入口：状态管理 + 页面路由
├── types.ts             # 共享类型
├── storage.ts           # localStorage 持久化
├── styles.css           # 全局样式
├── i18n/
│   ├── i18n.tsx         # 语言上下文
│   └── translations.ts  # 中英文翻译
├── components/
│   ├── CuboidScene.tsx  # 长方体 3D 场景（懒加载）
│   ├── CubeScene.tsx    # 正方体 3D 场景（懒加载）
│   ├── CuboidDiagram.tsx# 2D 拆解图
│   ├── CuboidNet.tsx    # 展开图
│   ├── DimensionControl.tsx
│   ├── TilingGrid.tsx   # 铺地砖游戏
│   ├── OnboardingOverlay.tsx
│   ├── Mascot.tsx
│   └── Icons.tsx
└── pages/
    ├── HomePage.tsx
    ├── LessonPage.tsx   # 长方体课程
    ├── CubeLessonPage.tsx # 正方体课程
    └── PlaygroundPage.tsx # 铺地砖游乐场
```

## 技术栈

React 19 · TypeScript · Vite 7 · Three.js · React Three Fiber · drei

## 课程列表

| 课程 | 内容 | 任务数 |
|------|------|--------|
| 长方体的秘密 | 3D 交互 + 2D 拆解 + 展开图 | 4 站 |
| 正方体的秘密 | 3D 交互 + 表面积/体积 | 3 站 |
| 铺地砖（游乐场） | 2D 网格铺砖游戏 | 自由探索 |
