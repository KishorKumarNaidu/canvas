#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if [ -d node_modules ]; then
  npm start
else
  npm install
  npm start
fi
