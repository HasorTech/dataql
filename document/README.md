# DataQL 和 Dataway 文档

| 工程 | 门户路径 | 本地门户联调端口 |
| --- | --- | --- |
| [DataQL](./dataql/) | /cn/dataql/、/en/dataql/ | 5303 |
| [Dataway](./dataway/) | /cn/dataway/、/en/dataway/ | 5307 |

在对应工程目录执行：

```bash
npm ci
npm run start:portal
```

用以下命令预演门户发布，正式发布时去掉 `--dry-run`：

```bash
./deploy.sh --mode portal --dry-run
```

两个工程分别生成双语页面、sitemap、站内搜索索引、llms.txt 和静态资源。发布脚本只上传本工程的门户目录和语言跳转入口。两站发布后，主门户从各自的 sitemap 构建全局搜索。两个项目分别维护各自的版本记录。
