#!/usr/bin/env bash
# On NixOS, Prisma resolves to linux-nixos engines (unpublished). Download the
# Debian OpenSSL 3 binaries for the same commit as @prisma/engines-version and
# print export statements for the shell to eval.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f node_modules/@prisma/engines-version/package.json ]]; then
  echo "error: run npm install first" >&2
  exit 1
fi

ENG="$(node -p "require('./node_modules/@prisma/engines-version/package.json').prisma.enginesVersion")"
TARGET="debian-openssl-3.0.x"
DIR="$ROOT/.prisma-debian-engines/$ENG"
mkdir -p "$DIR"
BASE="https://binaries.prisma.sh/all_commits/$ENG/$TARGET"

fetch_gz() {
  local name="$1"
  local out="$DIR/$2"
  if [[ -f "$out" ]]; then
    return 0
  fi
  echo "Prisma (NixOS helper): fetching $name -> $out" >&2
  curl -fsSL "$BASE/${name}.gz" | gunzip -c >"$out"
}

fetch_gz "schema-engine" "schema-engine"
chmod +x "$DIR/schema-engine"

fetch_gz "libquery_engine.so.node" "libquery_engine.so.node"

echo "export PRISMA_SCHEMA_ENGINE_BINARY=\"$DIR/schema-engine\""
echo "export PRISMA_QUERY_ENGINE_LIBRARY=\"$DIR/libquery_engine.so.node\""
echo "export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1"
