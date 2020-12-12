#!/bin/bash

HOME_DIR=$(cd $(dirname $0);pwd)
SELENIUM_DIR=${HOME_DIR}/test/selenium
E2E_DIR=${HOME_DIR}/test/e2e
RETVAL=0

start() {
  echo "Starting ums-admin"
  cd $HOME_DIR && docker-compose up -d --build
  cd $SELENIUM_DIR && docker-compose up -d --build
  RETVAL=$?
  echo "Started ums-admin"
}
stop() {
  echo "Stopping ums-admin"
  cd $E2E_DIR && docker-compose down
  cd $SELENIUM_DIR && docker-compose down
  cd $HOME_DIR && docker-compose down -v
  RETVAL=$?
  echo "Stopped ums-admin"
}
e2e() {
  echo "Starting End to End test"
  cd $E2E_DIR && docker-compose up --build
  RETVAL=$?
  echo
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    stop
    start
    ;;
  e2e)
    e2e
    ;;
  *)
    echo $"Usage: ums-admin.sh {start|stop|restart|e2e}"
    RETVAL=2
esac

exit $RETVAL
