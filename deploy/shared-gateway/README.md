# Shared gateway integration

These files add only the `adv-medicare.com` virtual hosts to the existing
shared Nginx gateway. The gateway's base Compose and `.cn` configuration remain
owned by `/var/www/nginx` and must not be replaced by this repository.

Production copies `docker-compose.override.yml`, `proxy_params`, and one active
`adv-medical.com.conf` into `/var/www/nginx`. Use the bootstrap configuration
only while the existing read-only Caddy certificates are mounted. After the
webroot ACME request creates `/var/www/nginx/certbot/conf/live/adv-medical-com`,
replace the active file with `adv-medical.com.conf`, run `nginx -t`, and send a
graceful Nginx reload.

Issue the replacement certificate from the shared gateway project only after
all four DNS records resolve to the ECS and the bootstrap HTTPS configuration
is healthy:

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  --cert-name adv-medical-com \
  --email yunfanxiang@adv-medicare.com \
  --agree-tos --no-eff-email \
  -d adv-medicare.com \
  -d www.adv-medicare.com \
  -d system.adv-medicare.com \
  -d api.adv-medicare.com
```

The long-running Certbot service checks renewal twice per day. The gateway
reload loop reopens renewed certificate files every six hours without
restarting the container.

The external `nginx-gateway-network` must contain these aliases before enabling
the virtual hosts:

- `adv-medical-api`
- `adv-medical-system-frontend`
- `adv-medical-official-website`

Never use `docker compose down`, restart the Docker daemon, or recreate another
team's containers. Roll back by restoring the timestamped files in
`/var/www/nginx` and recreating only `shared-gateway` if its Compose definition
must change.
