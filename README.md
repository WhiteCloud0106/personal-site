# 創作基地

可直接部署到 GitHub Pages 的個人創作網站，適合放小說、遊戲模組、開發日誌、網頁遊戲與工具。

## 本機預覽

直接開啟 `index.html`，或在此資料夾執行：

```powershell
npx serve .
```

## 修改內容

- 網站名稱與作品：編輯 `index.html`
- 顏色與排版：編輯 `styles.css` 最上方的 CSS 變數
- 篩選與動畫：編輯 `script.js`
- 每件作品可以在 `pages/` 建立獨立 HTML，再把卡片連結換掉

## GitHub Pages 部署

1. 在 GitHub 建立新的公開儲存庫。
2. 將本資料夾推送至儲存庫的 `main` 分支。
3. 進入 **Settings → Pages**。
4. 在 **Build and deployment** 選擇 **Deploy from a branch**，分支選 `main`，資料夾選 `/ (root)`。
5. 儲存後等待一至數分鐘，GitHub 會顯示網站網址。

## 上線前記得替換

- `index.html` 的「Your Name」
- 示例作品名稱、說明、日期與連結
- `<title>` 與 description
