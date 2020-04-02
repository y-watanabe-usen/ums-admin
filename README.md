# UMS-ADMIN

## init settings
```bash
git clone https://gitlab.com/openusen/ums-admin.git
cd ums-admin
svn checkout http://redmine.service.devel/svn/service/usengarden/trunk/admin/ web/admin
chmod 777 web/admin/log
cd web/admin/config
ln -s config_local.php config.php
cd ../../..
docker-compose up -d --build
```

http://localhost
