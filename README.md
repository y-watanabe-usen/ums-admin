# USEN MEMBERS 管理機能

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

| ログインID | パスワード |
----|---- 
| admin | !QAZ2wsx |
