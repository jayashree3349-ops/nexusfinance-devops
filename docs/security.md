# NexusFinance Security

- Kubernetes RBAC configured with read-only ServiceAccount.
- NetworkPolicy restricts PostgreSQL ingress to backend pods.
- PostgreSQL password stored in Kubernetes Secret.
- Application components communicate through Kubernetes Services.
- Container resource requests and limits configured for backend.
- ArgoCD manages application manifests from GitHub.

## Security improvements pending
- TLS and HTTPS configuration.
- Secret encryption and rotation.
- Container image vulnerability scanning.
- Stronger default-deny network policies.
