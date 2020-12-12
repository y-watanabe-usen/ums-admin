#!/bin/bash

HOME_DIR=$(cd $(dirname $0);pwd)
E2E_DIR=${HOME_DIR}/test/e2e

cd $E2E_DIR
docker-compose up --build
