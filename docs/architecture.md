# NexusFinance Architecture

## Infrastructure
- AWS EC2 Ubuntu instances
- Kubernetes kubeadm cluster
- 1 control-plane node
- 1 worker node
- Calico CNI networking

## Application
- React frontend
- Node.js and Express backend
- PostgreSQL database
- Kubernetes Services and Deployments

## Storage
- PersistentVolume
- PersistentVolumeClaim
- PostgreSQL StatefulSet

## Operations
- ArgoCD GitOps
- Horizontal Pod Autoscaler
- Blue-Green deployment
- Kubernetes NetworkPolicy
- RBAC
