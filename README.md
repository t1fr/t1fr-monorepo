# T1FR 專案 Monorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## 專案

* api: 後端 API 伺服器
* manage-bot: 聯隊 DC 伺服器的管理機器人
* wiki-bot: 戰爭雷霆 Wiki DC 機器人

## 開發

此專案使用 **NX Monorepo** 進行管理
如果使用 Webstorm 或 Visual Studio Code，可以安裝 [Nx Console](https://nx.dev/nx-console)
更方便的操作介面

* 執行單一專案的任務

```
npx nx <target> <project> <...options>
```

* 執行全部專案的多個任務

```
npx nx run-many -t <target1> <target2>
```

* 或者加上 `-p` 指定專案

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

## 專案圖

使用 `npx nx graph` 可以產生可互動的專案圖

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)