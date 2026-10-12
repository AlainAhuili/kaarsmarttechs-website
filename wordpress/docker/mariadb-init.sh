# Sourced by the MariaDB entrypoint on the first start, after it has created the "wordpress"
# database and user. Adds a separate database and user for the API, so neither service can read
# the other's tables.
docker_process_sql --database=mysql <<-EOSQL
	CREATE DATABASE IF NOT EXISTS api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
	CREATE USER IF NOT EXISTS 'api'@'%' IDENTIFIED BY '$(docker_sql_escape_string_literal "${API_DB_PASSWORD:?}")';
	GRANT ALL PRIVILEGES ON api.* TO 'api'@'%';
EOSQL
