> [!NOTE]
>
> 別擔心，LifeForge 仍在活躍開發中。🚀
>
> ### 更新 · 2026年5月31日
>
> UI 庫的重寫以及隨後從 Tailwind CSS 的遷移已成功完成。
>
> 核心客戶端架構現在完全運行在新的內部 UI 系統之上。剩餘工作主要涉及遷移現有模組以及更新項目文檔。
>
> 這一里程碑標誌著 LifeForge 歷史上最大規模架構轉型之一的完成。
>
> 不過，也別太放鬆。這肯定不會是最後一次大規模轉型。如果 LifeForge 教會了我們什麼，那就是每一個「最終架構」最終都會變成明天的遷移項目。:)

> [!IMPORTANT]
>
> ## UI 架構遷移已完成
>
> 此前，開發因模組聯邦架構中的一個關鍵樣式問題而受阻。
>
> ### 發生了什麼？
>
> 宿主應用和聯邦模組各自獨立打包 Tailwind CSS，導致 CSS 層疊規則在模組邊界之間產生衝突，具體表現為：
>
> - 不可預測的樣式覆蓋
> - 響應式工具類失效
> - 跨模組樣式干擾
> - 宿主與遠端應用間渲染行為不一致
>
> 當多個 Tailwind CSS 包共存於同一運行時中時，層疊規則的順序變得難以可靠控制。
>
> 每個聯邦模組都會生成自己的 CSS 輸出，但所有樣式最終會匯入同一個文檔層疊中。隨著模組的動態載入與組合，樣式的優先級可能取決於注入順序而非應用意圖，從而產生難以除錯的細微樣式衝突。
>
> 雖然 Tailwind CSS 在傳統應用架構中表現出色，但它並非為大規模聯邦前端系統而設計。
>
> **問題從來都不隱蔽。**
>
> 一旦多個 Tailwind 包被引入模組聯邦架構，樣式衝突立即顯現，並可能影響 UI 的整個區域。由於衝突源於獨立生成的 CSS 輸出在共享層疊中的相互作用，在不改變底層樣式模型的前提下，不存在實用且可靠的修復方案。
>
> 因此，從 Tailwind 遷移並非偏好變更，而是架構上的必然選擇。
>
> ### 解決方案
>
> PR #93 引入了內部 UI 庫和樣式架構的完整重新設計。
>
> 新系統具有以下特點：
>
> - 基於設計令牌
> - 組件化
> - 完全獨立於 Tailwind CSS
> - 專門為模組聯邦設計
> - 建立在單一共享 UI 約定之上
>
> 所有應用不再各自生成並打包 CSS，而是直接通過 `@lifeforge/ui` 使用 UI 原語、令牌和樣式行為。
>
> 這使得 `@lifeforge/ui` 成為整個平台視覺呈現的唯一權威來源。
>
> 效果如下：
>
> - 聯邦模組不再打包自己的樣式系統
> - 無論模組載入順序如何，視覺行為保持一致
> - 樣式所有權集中且可預測
> - 跨模組層疊衝突從根本上被消除
>
> 此次遷移引入了破壞性變更，需要對整個程式碼庫進行大規模重構，但它永久性地解決了一類在之前模型中無法可靠解決的架構問題。

> [!TIP]
>
> ## 尋找舊版？
>
> 基於 Tailwind 的最終實現已被保留，可供參考。
>
> - 舊版發布：https://github.com/Lifeforge-app/lifeforge/releases/tag/legacy-final
> - 舊版分支：https://github.com/Lifeforge-app/lifeforge/tree/legacy-final
>
> 舊版不再積極開發，但仍可作為歷史參考、遷移指南或回顧先前實現的資料。

<div align="center">
<img src="https://raw.githubusercontent.com/LifeForge-app/lifeforge-docs-media/main/assets/lifeforge-logo.svg" alt="LifeForge Logo" width="240" height="80"/>
</div>

<p align="center">一個自托管的人生管理系統，助你高效規劃生活的每一面。</p>

![LifeForge Interface Mockup](https://raw.githubusercontent.com/LifeForge-app/lifeforge-docs-media/main/assets/mockup-new.webp)

<div align="center">

![skills](https://img.shields.io/badge/-TYPESCRIPT-FF0000?style=for-the-badge&logo=typescript&logoColor=white&color=3178C6)
![skills](https://img.shields.io/badge/-HTML-FF0000?style=for-the-badge&logo=html5&logoColor=white&color=orange)
![skills](https://img.shields.io/badge/-CSS-FF0000?style=for-the-badge&logo=css3&logoColor=white&color=blue)
![skills](https://img.shields.io/badge/-TAILWIND_CSS-FF0000?style=for-the-badge&logo=tailwindcss&logoColor=white&color=teal)
![skills](https://img.shields.io/badge/-REACT_JS-FF0000?style=for-the-badge&logo=react&logoColor=white&color=skyblue)
![skills](https://img.shields.io/badge/-NODE_JS-FF0000?style=for-the-badge&logo=node.js&logoColor=white&color=green)
![skills](https://img.shields.io/badge/-EXPRESS_JS-FF0000?style=for-the-badge&logo=express&logoColor=white&color=black)
![skills](https://img.shields.io/badge/-POCKETBASE-FF0000?style=for-the-badge&logo=pocketbase&logoColor=black&color=white)

</div>

<div align="center">
<a href="../README.md">🇬🇧 English</a>
<a href="README.zh-CN.md">🇨🇳 简体中文</a>
<a href="README.zh-TW.md">🇹🇼 繁體中文</a>
<a href="README.ms.md">🇲🇾 Bahasa Malaysia</a>
</div>

<h3 align="center">
  🚧 項目正處於早期開發階段，功能與模塊可能會出現大幅度調整。最新動態請查閱 <a href="https://docs.lifeforge.dev/progress/changelog">更新日誌</a>。
</h3>

## 📋 目錄

- [📋 目錄](#-目錄)
- [🔥 支持作者](#-支持作者)
- [🤔 面臨的問題](#-面臨的問題)
- [✅ 我們的方案](#-我們的方案)
- [🧱 功能模塊](#-功能模塊)
- [🖥 界面預覽](#-界面預覽)
- [⌨️ 開始使用](#️-開始使用)
- [🤝 參與貢獻](#-參與貢獻)
  - [為核心代碼做貢獻](#為核心代碼做貢獻)
  - [開發新模塊](#開發新模塊)
  - [提交需求與反饋](#提交需求與反饋)
  - [協助翻譯](#協助翻譯)
- [💡 靈感與致謝](#-靈感與致謝)
- [📄 開源許可](#-開源許可)

## 🔥 支持作者

如果您覺得 LifeForge 對你有幫助，歡迎請作者喝杯咖啡。

<a href="https://www.buymeacoffee.com/melvinchiah" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="60" width="217">
</a>

## 🤔 面臨的問題

如今，我們依賴各式各樣的應用來提升效率，但市面上的工具過多，反而令人分心，最終拖累生產力（相關討論可見：[為什麼效率應用讓人效率更低](https://theunfilteredreport.com/why-productivity-apps-are-making-people-less-productive/)）。

許多軟件即服務（SaaS）採用訂閱制，長期累積是一筆**不小的開支**。更重要的是，這些服務常會**收集你的數據**用於廣告推送、行為分析甚至AI訓練，帶來隱私泄露的風險。

## ✅ 我們的方案

LifeForge 是一個**一體化**的個人管理系統，旨在幫你高效打理生活的方方面面。無論是管理工作、規劃項目、追蹤個人目標，還是記錄財務流動，LifeForge 都能輕鬆勝任！

採用模塊化設計，你可以像搭積木一樣，只安裝自己需要的功能，打造一個純粹、無干擾的專屬空間。

我們極度重視隱私。你的所有數據都存儲在你自己的服務器或設備上（本項目也**不提供托管服務**），你對自己的數據擁有完全的控制權。**沒有數據追蹤，沒有信息挖掘，只尊重你的隱私。**

## 🧱 功能模塊

LifeForge 的模塊化架構提供了豐富的工具集，每個模塊專注於生活的一個特定領域，如效率、財務、健康與學習等。你可以自由組合，按需啟用，構建完全符合你習慣的個人管理系統。

核心模塊概覽：

- **效率工具**：待辦清單、項目管理、靈感收集箱、番茄鐘等，助你釐清任務、捕捉靈感並保持專注。
- **財務管理**：電子錢包、心願單與預算模塊，幫你輕鬆記錄花銷、規劃儲蓄和控制預算。
- **生活記錄**：通過日記與成就模塊回顧成長，利用健身記錄等功能保持健康生活節奏。
- **學習助手**：閃卡、筆記與CFOP算法（魔方）模塊，是學生和終身學習者的得力工具。
- **數字收藏**：圖書庫、相冊、吉他譜庫等模塊，幫你井井有條地管理各類數字資產。
- **信息處理**：收件箱、專題信息（如樟宜機場指南）等模塊，提升你的信息整理效率。
- **個性化**：主題、佈局等自定義模塊，讓你隨心調整界面外觀與交互方式。

這種模塊化方式確保了極致的靈活性與擴展性。無論你是專業人士、在校學生還是興趣愛好者，LifeForge 都能貼合你的需求。

完整模塊列表請訪問
[GitHub](https://github.com/lifeforge-app?q=lifeforge-module&type=all)

**（全新的模塊系統 Forgistry 正在開發中，敬請期待！）**

## 🖥 界面預覽

以下截圖展示了部分功能，實際體驗中還有更多精彩等你發現。

<div align="center">
    <img width="49%" src="https://github.com/user-attachments/assets/a23e7659-b9e0-40ec-bd8c-05a7181e82b7" alt="LifeForge 儀表盤">
    <img width="49%" src="https://github.com/user-attachments/assets/44985456-4df8-4c7a-8f93-1eac59de42df" alt="LifeForge 待辦事項模塊">
    <img width="49%" src="https://github.com/user-attachments/assets/ba32412b-edd1-4b68-8f56-111c8eb64e27" alt="LifeForge 日曆">
    <img width="49%" src="https://github.com/user-attachments/assets/3d03a481-7976-42c6-a0d4-f9329118121b" alt="代碼時間統計">
    <img width="49%" src="https://github.com/user-attachments/assets/9b93f817-9797-42d7-96ca-7bacdc8d7d3a" alt="LifeForge 錢包模塊">
    <img width="49%" src="https://github.com/user-attachments/assets/41b2c15b-307a-40d6-a57f-049d1afbeba6" alt="LifeForge 圖書庫">
    <img width="49%" src="https://github.com/user-attachments/assets/bb6523f6-5079-44d7-b021-34cd4c787e1d">
    <img width="49%" src="https://github.com/user-attachments/assets/f6b7ed5f-219f-4990-b37d-e6273701e2bb">
    <img width="49%" src="https://github.com/user-attachments/assets/de700a7a-f80d-4656-afad-caf852b64e36">
    <img width="49%" src="https://github.com/user-attachments/assets/441d5996-1695-4eaf-b47f-ddad866a45d0">
    <img width="49%" src="https://github.com/user-attachments/assets/b5fb64bb-23f7-4aba-8dcb-2f8d9f646615">
    <img width="49%" src="https://github.com/user-attachments/assets/16b23910-37bf-4f56-892d-c971d70b19ae">
</div>

## ⌨️ 開始使用

**🐳 LifeForge 現已支持 Docker 部署！只需幾條命令即可快速運行。當然，你也可以選擇按照文檔進行手動安裝。**

詳細的安裝與配置指南，請查閱官方文檔：

- [https://docs.lifeforge.dev](https://docs.lifeforge.dev)

## 🤝 參與貢獻

我們熱烈歡迎社區成員的貢獻！在開始之前，請先閱讀 [貢獻指南](https://docs.lifeforge.dev/developer-guide/contributing)。

### 為核心代碼做貢獻

項目尚處早期，建議在著手進行重大改動前，先到 [討論區](https://github.com/lifeforge-app/lifeforge/discussions) 發起話題，以確保你的工作方向與項目一致，並避免重複勞動。

### 開發新模塊

LifeForge 的模塊化架構鼓勵你創建自己的功能模塊。如果你有此想法，請參考 [模塊開發指南](https://docs.lifeforge.dev/developer-guide/modules)。

### 提交需求與反饋

如果你有新功能建議或發現了程序錯誤，請在 GitHub Issues 中提交：

- 主倉庫 Issues: https://github.com/lifeforge-app/lifeforge/issues

如果問題涉及特定模塊，請前往對應模塊的倉庫提交。

### 協助翻譯

我們正在招募志願者，幫助將 LifeForge 界面翻譯成更多語言。如果你感興趣，請參閱本項目的 [本地化指南](https://docs.lifeforge.dev/developer-guide/localization)。

針對單個模塊的翻譯工作，請查看該模塊自身的文檔說明。

## 💡 靈感與致謝

LifeForge 的誕生，源於對一體化個人管理工具的渴望，並深受 [Volmarg 的個人管理系統項目](https://github.com/Volmarg/personal-management-system) 的啟發。項目背景的完整故事可在文檔中找到。

衷心感謝所有為本項目提供支持的優秀開源庫與工具。

## ⭐️ Star 歷史

增長曲線驚人。衷心感謝大家對本項目的支持！

<div align="center">
<a href="https://www.star-history.com/#lifeforge-app/lifeforge&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=lifeforge-app/lifeforge&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=lifeforge-app/lifeforge&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=lifeforge-app/lifeforge&type=date&legend=top-left" />
 </picture>
</a>
</div>

## 📄 開源許可

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/LifeForge-app/lifeforge">LifeForge</a> 由 <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/melvinchia3636">Melvin Chia</a> 創建，採用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">知識共享 署名-非商業性使用-相同方式共享 4.0 國際 許可協議</a>。</p>
