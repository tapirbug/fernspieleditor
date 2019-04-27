#!/bin/sh

URL="https://krachzack.github.io/fernspieleditor"
mkdir -p docs && rm -rf docs && mkdir -p docs && \
parcel build index.html \
  --out-dir docs \
  --no-source-maps \
  --public-url $URL

