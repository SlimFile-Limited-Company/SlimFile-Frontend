#!/usr/bin/env bash
# Build the SlimFile web app and put it live on the Contabo server (www.slim-file.com).
#
#   ./deploy/deploy.sh
#
# Needs .env.production.local (git-ignored) with the VITE_ settings, and the
# ~/.ssh/contabo_deploy key. Each deploy goes into its own folder under
# /opt/slimfile-frontend/releases and the "current" link is switched at the end,
# so visitors never see a half-copied site. The last 5 releases are kept;
# to roll back, point "current" at an older one.
set -euo pipefail

cd "$(dirname "$0")/.."
SSH="ssh -i $HOME/.ssh/contabo_deploy root@service.slim-file.com"
BASE=/opt/slimfile-frontend
RELEASE=$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)

if [ ! -f .env.production.local ]; then
  echo "Missing .env.production.local (VITE_API_BASE_URL and the other VITE_ settings)." >&2
  exit 1
fi

npm run build
node deploy/build-previews.mjs

$SSH "mkdir -p $BASE/releases/$RELEASE"
rsync -az --delete -e "ssh -i $HOME/.ssh/contabo_deploy" dist/ "root@service.slim-file.com:$BASE/releases/$RELEASE/"
$SSH "set -e
  ln -sfn $BASE/releases/$RELEASE $BASE/current.new && mv -T $BASE/current.new $BASE/current
  cd $BASE/releases && ls -1t | tail -n +6 | xargs -r rm -rf
  echo live: \$(readlink $BASE/current)"
