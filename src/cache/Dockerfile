FROM redis:7-alpine

# Copy custom Redis configuration
COPY redis.conf /usr/local/etc/redis/redis.conf

# Run with custom config
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]

EXPOSE 6379
