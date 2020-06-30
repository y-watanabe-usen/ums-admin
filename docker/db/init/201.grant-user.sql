GRANT ALL PRIVILEGES ON comauth_db.* TO 'manager'@'%' IDENTIFIED BY 'usen440';
GRANT ALL PRIVILEGES ON admin_db.* TO 'manager'@'%' IDENTIFIED BY 'usen440';
GRANT SELECT,INSERT,UPDATE,DELETE ON comauth_db.* TO 'front'@'%' IDENTIFIED BY 'frontpass';
GRANT SELECT,INSERT,UPDATE,DELETE ON comauth_db.* TO 'api'@'%' IDENTIFIED BY 'apipass';
GRANT SELECT,INSERT,UPDATE,DELETE ON comauth_db.* TO 'batch'@'%' IDENTIFIED BY 'batchpass';
GRANT SELECT,INSERT,UPDATE,DELETE ON comauth_db.* TO 'admin'@'%' IDENTIFIED BY 'adminpass';
GRANT SELECT,INSERT,UPDATE,DELETE ON admin_db.* TO 'admin'@'%' IDENTIFIED BY 'adminpass';
GRANT SELECT,INSERT,UPDATE,DELETE ON admin_db.* TO 'batch'@'%' IDENTIFIED BY 'batchpass';
FLUSH PRIVILEGES;
