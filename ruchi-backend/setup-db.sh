#!/bin/bash
# Sets up the Ruchi PostgreSQL database: creates the DB/user (if missing)
# and runs all migrations in order. Reads connection details from .env.
set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_NAME=${DB_NAME:-ruchi_db}
DB_USER=${DB_USER:-ruchi_user}
DB_PASSWORD=${DB_PASSWORD:-change_me}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}

echo "==> Creating role and database (safe to re-run)"

run_as_postgres() {
  if command -v sudo >/dev/null 2>&1; then
    sudo -u postgres psql -v ON_ERROR_STOP=0
  else
    su postgres -c "psql -v ON_ERROR_STOP=0"
  fi
}

run_as_postgres <<SQL
CREATE DATABASE ${DB_NAME};
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};
SQL

echo "==> Running migrations"
export PGPASSWORD=${DB_PASSWORD}
for f in src/migrations/*.sql; do
  echo "  -> $f"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$f"
done

echo "==> Done. Database '$DB_NAME' is ready."
