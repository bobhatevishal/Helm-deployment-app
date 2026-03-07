FROM postgres:15-alpine

COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

COPY postgresql.conf /etc/postgresql/custom.conf

CMD ["postgres", "-c", "config_file=/etc/postgresql/custom.conf"]

EXPOSE 5432
