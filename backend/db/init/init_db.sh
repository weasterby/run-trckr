cd api/db/ || exit
psql --single-transaction -f create_tables.sql $DATABASE_URL