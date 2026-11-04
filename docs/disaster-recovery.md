# NexusFinance Disaster Recovery

## etcd Backup
Snapshot saved at:
`/var/backups/etcd/etcd-backup.db`

## Database Recovery
PostgreSQL uses a PersistentVolume and PersistentVolumeClaim.
Database persistence was verified after pod deletion and recreation.

## Node Recovery
Worker kubelet was stopped to simulate node failure.
The worker became NotReady.
Kubelet was restarted and the worker returned to Ready.

## Application Recovery
Kubernetes Deployments maintain desired replica counts.
ArgoCD synchronizes application resources from Git.

## Limitations
The current lab has one control plane and one worker.
It is not a highly available cluster.
