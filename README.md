# 設置開發環境
## 啟用 pnpm
本專案使用 pnpm 作為包管理器，請先安裝可用的 Node 18+

```shell
corepack enable
corepack prepare pnpm@latest --activate
```

使用此命令驗證
```shell
pnpm --version
```

## 安裝依賴
```shell
pnpm install
```

# 啟動 Server

```shell
pnpm start
```

或者在檔案變更時重編譯
```shell
pnpm start:dev
```