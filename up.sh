#!/bin/bash

HOME_DIR=$(cd $(dirname $0);pwd)
SELENIUM_DIR=${HOME_DIR}/test/selenium
E2E_DIR=${HOME_DIR}/test/e2e

cd $E2E_DIR
docker-compose down

cd $SELENIUM_DIR
docker-compose down

cd $HOME_DIR
docker-compose down -v

cd $HOME_DIR
docker-compose up -d --build

cd $SELENIUM_DIR
docker-compose up -d --build

cd $HOME_DIR