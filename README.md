# USEN MEMBERS 管理機能
![e2e](https://github.com/openusen/ums-admin/workflows/e2e/badge.svg)
## 各ディレクトリの説明
- **app** プロダクションコードを格納。このディレクトリをデプロイする
- **docker** ローカル環境構築用のDockerfile等を格納
- **test** 自動テストコードを格納

## ローカル環境構築方法
```bash
chmod 777 app/log
cd app/config
ln -s config_local.php config.php
cd ../../
docker-compose up -d --build
```

http://localhost  

## 開発環境
hostsに登録
```
10.222.33.111 dev-admin-members.usen.com
```
http://dev-admin-members.usen.com

## ステージング環境
http://10.222.41.243/

## 本番環境
http://10.222.41.242/

## ログイン情報

| ログインID | パスワード |
----|---- 
| admin | !QAZ2wsx |

