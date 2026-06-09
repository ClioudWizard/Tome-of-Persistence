#!/usr/bin/env bash
set -e

if ! command -v npm >/dev/null 2>&1; then
  echo 'npm is not installed. Install Node.js and npm in your Crostini VM first.'
  exit 1
fi

if [[ -f /etc/lsb-release ]]; then
  echo 'Detected Linux environment. Assuming Crostini VM or Linux container.'
fi

echo 'Installing Node dependencies...'
npm install

echo 'Running build and test harness...'
npm test
