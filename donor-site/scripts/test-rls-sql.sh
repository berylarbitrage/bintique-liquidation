#!/usr/bin/env bash
# Run the migration + RLS assertions against a plain Postgres (no Docker needed).
# Usage: PGURL=postgres://postgres@localhost:5432/postgres scripts/test-rls-sql.sh
set -euo pipefail
cd "$(dirname "$0")/.."
PGURL=${PGURL:-postgres://postgres@localhost:5432/postgres}
DB=rls_test_$$
psql "$PGURL" -q -c "create database $DB"
trap 'psql "$PGURL" -q -c "drop database if exists $DB"' EXIT
URL="${PGURL%/*}/$DB"
psql "$URL" -q -v ON_ERROR_STOP=1 -f supabase/tests/00_supabase_stubs.sql
psql "$URL" -q -v ON_ERROR_STOP=1 -f supabase/migrations/20261106000000_init.sql
psql "$URL" -q -v ON_ERROR_STOP=1 -f supabase/tests/01_default_grants.sql
psql "$URL" -qAt -v ON_ERROR_STOP=1 -f supabase/tests/02_rls_test.sql >/dev/null
echo "RLS SQL tests passed"
