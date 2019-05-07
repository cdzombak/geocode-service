#!/usr/bin/env bash

set -eu

while IFS= read -r FILE; do
    if [[ ! -e "$FILE" ]]; then
        echo "[!] Missing: $FILE"
        exit 1
    fi
done < "deploy.lst"

rsync -v --recursive --executability --delete --files-from=deploy.lst . radarskill:~/geocode/
ssh -t radarskill "pm2 restart geocode"
