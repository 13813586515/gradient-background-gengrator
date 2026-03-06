# Gradient Background Generator

一个强大的 Next.js 应用程序，用于创建令人惊叹的 SVG 渐变背景，具有实时预览和可自定义的调色板功能。

## 功能特性

- **实时预览**: 修改颜色时立即查看渐变背景的更新
- **色轮色彩选择**: 在直观的色轮上同时选择两种颜色，支持拖拽操作
- **两种选择模式**:
  - **自由选择模式**: 完全自由地在色轮上选择任意两种颜色
  - **推荐选择模式**: 选择一个基础颜色后，系统自动推荐最佳色彩组合
- **智能色彩推荐算法**: 基于色彩理论提供互补色、类似色、三元色、四元色等多种和谐配色方案
- **预设模板**: 从专业设计的色彩组合中选择
- **API 集成**: 通过 REST API 编程生成渐变
- **SVG 导出**: 以高质量 SVG 文件下载您的创作
- **响应式设计**: 在桌面和移动设备上无缝工作

## 色彩推荐算法说明

本项目采用基于经典色彩理论的智能色彩推荐算法，包括：

1. **互补色 (Complementary)**: 在色轮上相差 180° 的颜色，提供高对比度和视觉冲击力
2. **类似色 (Analogous)**: 在色轮上相邻 30°-60° 的颜色，提供和谐自然的过渡
3. **三元色 (Triadic)**: 在色轮上均匀分布的三种颜色（120° 间隔），创造平衡而丰富的组合
4. **分裂互补色 (Split Complementary)**: 一种颜色和它互补色两边的颜色，兼顾对比与和谐
5. **四元色 (Tetradic)**: 在色轮上均匀分布的四种颜色（90° 间隔），色彩丰富且协调
6. **同色系 (Monochromatic)**: 同一色相下不同明度和饱和度的颜色，简洁而优雅

## 快速开始

阅读 https://opennext.js.org/cloudflare 上的文档。

## 开发

运行 Next.js 开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

您可以通过修改 `app/page.tsx` 来开始编辑页面。当您编辑文件时，页面会自动更新。

## 预览

在 Cloudflare 运行时上本地预览应用：

```bash
npm run preview
```

## 构建

构建生产版本：

```bash
npm run build
```

## 部署

部署应用到 Cloudflare：

```bash
npm run deploy
```

## 自定义域名

部署的应用可以通过以下地址访问：

**gbg.nuclearrockstone.xyz**

相应地配置您的 DNS 和 Cloudflare 设置（添加适当的 CNAME/A 记录并将域名路由到您的 Cloudflare 部署）。

## API 使用

使用 REST API 编程生成渐变：

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### 参数：
- `colors`: 带有 `hex_` 前缀的十六进制颜色（例如，红色使用 `hex_FF0000`）
- `width`: 图像宽度，以像素为单位（100-2000）
- `height`: 图像高度，以像素为单位（100-2000）

## 了解更多

要了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的功能和 API
- [学习 Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程

您可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js) - 欢迎您的反馈和贡献！
