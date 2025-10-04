docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  -v "$(pwd):/usr/src" \
  -w /usr/src \
  sonarsource/sonar-scanner-cli \
  sonar-scanner
  