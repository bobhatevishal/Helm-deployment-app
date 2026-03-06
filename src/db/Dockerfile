FROM postgres:15-alpine

# Copy custom initialization SQL (runs on first start)
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

# Copy custom PostgreSQL configuration
COPY postgresql.conf /etc/postgresql/custom.conf

# Tell PostgreSQL to use our custom config in addition to defaults
CMD ["postgres", "-c", "config_file=/etc/postgresql/custom.conf"]

EXPOSE 5432
