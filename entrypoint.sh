#!/bin/sh

# Generate the config.json file dynamically using environment variables
cat <<EOF > /var/www/netbanking/config/configuration.json
{
  "API_URL": "${REACT_APP_API_URL}",
  "theme": "${REACT_APP_THEME}"
}
EOF

# Check the SSL_ENABLE environment variable
if [ "$SSL_ENABLE" = "true" ]; then
    echo "SSL is enabled. Using nginx_linux.conf."
    cp /opt/nginx_linux.conf /etc/nginx/nginx.conf
else
    echo "SSL is not enabled. Using nginx_linux_no_ssl.conf."
    cp /opt/nginx_linux_no_ssl.conf /etc/nginx/nginx.conf
fi

echo "Configuration generated at /var/www/netbanking/config/configuration.json"
cat /var/www/netbanking/config/configuration.json

# Start Nginx in the foreground to keep the container alive
nginx -g 'daemon off;'