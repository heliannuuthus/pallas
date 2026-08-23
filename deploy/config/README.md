# Build-time configuration

Pallas is a static Vite application. `VITE_*` values are compiled into the
image and are not Kubernetes runtime Secrets. Production image builds use:

```text
VITE_API_BASE_URL=https://aegis.heliannuuthus.com
VITE_APP_NAME=Aegis
```

Changing these values requires a new immutable image version.

