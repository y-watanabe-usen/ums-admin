# e2eテストの動かし方

### USEN MEMBERS管理機能を起動する
```bash
cd ${REPOSITORY_HOME}
docker-compose up -d --build
```

### zaleniumを起動する
```bash
cd ${REPOSITORY_HOME}/test/zalenium
docker-compose up -d --build
```

### zaleniumが起動したことを確認する
http://localhost:4444/grid/admin/live

### e2eテストを起動する
```
cd ${REPOSITORY_HOME}/test/e2e
docker-compose up --build
```
