# Time Dreambook

一个基于 `Node.js` 的单体应用：
- `server.js` 同时提供网页静态资源和 `/api/planner` 接口
- 前端页面由 `index.html`、`app.js`、`styles.css` 构成
- AI 对话支持文本、图片，以及小体积的 `PDF/DOCX/TXT/MD/JSON/CSV` 附件

## 本地运行

1. 安装 Node.js 20。
2. 复制环境变量模板：

```bash
copy .env.example .env.local
```

3. 在 `.env.local` 里填写：

```env
OPENAI_API_KEY=你的Key
OPENAI_MODEL=gpt-5.4
OPENAI_BASE_URL=你的兼容接口地址
```

4. 启动：

```bash
npm start
```

5. 打开 `http://127.0.0.1:3000/`

## 今天上线的最短路径

推荐：`GitHub + Render`

### 1. 建 GitHub 仓库

- 仓库名建议：`time-dreambook`
- 先设为 `Private`
- 创建空仓库时不要勾选 `README`、`.gitignore`、`License`

### 2. 推送本地项目

```bash
git init -b main
git add .
git commit -m "Prepare cloud deployment"
git remote add origin 你的仓库地址
git push -u origin main
```

### 3. 在 Render 部署

1. 登录 Render
2. `New` -> `Blueprint`
3. 选择这个 GitHub 仓库
4. Render 会读取仓库里的 `render.yaml`
5. 在环境变量页面填写：
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `OPENAI_BASE_URL`
6. 点击部署

部署完成后，Render 会给你一个公网网址，别人直接打开就能用。

## 需要特别注意

- `.env.local` 不能上传到 GitHub
- 你当前本地目录里已经存在真实 API Key，公开仓库前建议立刻更换这个 Key
- 当前附件功能更适合比赛演示和轻量使用，建议单个附件控制在 4 MB 内
- 如果你的兼容接口不支持 OpenAI Responses API，那么图片之外的附件能力可能受限

## 建议上传到仓库的核心文件

```text
server.js
package.json
index.html
app.js
styles.css
.env.example
.gitignore
render.yaml
README.md
assets/
页面实际引用到的图片目录
```
