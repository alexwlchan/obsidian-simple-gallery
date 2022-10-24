#!/usr/bin/env bash

set -o errexit
set -o nounset

for pluginFile in main.js manifest.json styles.css
do
  for vaultLocation in ~/repos/textfiles ~/Documents/wellcome/wellcome-textfiles
  do
    cp "$pluginFile" "$vaultLocation/.obsidian/plugins/simple-gallery/$pluginFile"
  done
done
