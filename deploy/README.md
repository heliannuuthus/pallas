# Kubernetes deployment contract

`deploy/` owns Pallas' reusable Kubernetes resources. The existing
`nginx.conf` remains the container image configuration; Kubernetes resources
are separated by type below it.

- `base/` declares the frontend workload, Service, and ServiceAccount.
- `config/` documents build-time configuration. Pallas has no runtime Secret.
- `ingress/` owns `/` on the Aegis hostname; the Aegis service owns `/api`.

The private `heliantheons/applications` repository pins this contract and owns
the promoted image in its sibling `overlay/` directory.

