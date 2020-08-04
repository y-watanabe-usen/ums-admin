# e2eテストの動かし方

### USEN MEMBERS管理機能を起動する
```bash
cd ${REPOSITORY_HOME}
docker-compose up -d --build
```

### seleniumを起動する
```bash
cd ${REPOSITORY_HOME}/test/selenium
docker-compose up -d --build
```

### seleniumでテストが動く様子を確認できるようにする
- Chromeの拡張機能で「VNC® Viewer for Google Chrome™」をインストールする
- 「VNC® Viewer for Google Chrome™」を起動する
- Addressに``localhost:15900``を入力してConnect押下
- 何か英語のダイアログが出るのでConnectボタン押下
- Passwordは``secret``を入力してOK

### e2eテストを起動する
```
cd ${REPOSITORY_HOME}/test/e2e
docker-compose up --build
```
