# NIX Chatbot Deployment Guide

## Prerequisites

- Docker & Docker Compose (for containerized deployment)
- Kubernetes cluster (for K8s deployment)
- OpenAI API key
- Node.js 20+ (for local development)

## Local Development

### 1. Setup Environment

```bash
cd nix-chatbot
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 2. Install Dependencies

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Start Development Servers

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

Backend runs on `http://localhost:3000`
Frontend runs on `http://localhost:5173`

## Docker Deployment

### 1. Build Images

```bash
docker-compose build
```

### 2. Run Containers

```bash
docker-compose up -d
```

Frontend accessible at `http://localhost`
Backend accessible at `http://localhost:3000`

### 3. Stop Containers

```bash
docker-compose down
```

## Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl create namespace nix-chatbot
```

### 2. Create Secrets

```bash
kubectl create secret generic nix-secrets \
  --from-literal=openai-api-key=YOUR_API_KEY \
  -n nix-chatbot
```

### 3. Deploy to Cluster

```bash
kubectl apply -f k8s/deployment.yaml -n nix-chatbot
```

### 4. Check Deployment Status

```bash
kubectl get pods -n nix-chatbot
kubectl get svc -n nix-chatbot
```

### 5. Access Frontend

```bash
# Get LoadBalancer external IP
kubectl get svc nix-chatbot-frontend-service -n nix-chatbot

# Access via external IP
http://<EXTERNAL_IP>
```

## Production Deployment

### Environment Variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | OpenAI API key for LLM inference | Yes |
| `NODE_ENV` | Set to `production` | Yes |
| `PORT` | Backend port (default: 3000) | No |
| `REACT_APP_API_URL` | Backend API URL for frontend | Yes |

### Scaling

**Horizontal Scaling**: Increase replicas in `k8s/deployment.yaml`

```yaml
replicas: 5  # Scale to 5 instances
```

**Resource Limits**: Adjust CPU/memory requests and limits per your cluster capacity

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Monitoring

**Logs**:
```bash
kubectl logs -f deployment/nix-chatbot-backend -n nix-chatbot
kubectl logs -f deployment/nix-chatbot-frontend -n nix-chatbot
```

**Health Check**:
```bash
curl http://<backend-ip>:3000/health
```

## Troubleshooting

**Backend not connecting to OpenAI**:
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient quota

**Frontend can't reach backend**:
- Verify `REACT_APP_API_URL` points to correct backend address
- Check CORS is enabled in backend

**Kubernetes pods not starting**:
- Check pod logs: `kubectl logs <pod-name> -n nix-chatbot`
- Verify secrets are created: `kubectl get secrets -n nix-chatbot`

## Cleanup

**Docker**:
```bash
docker-compose down -v
```

**Kubernetes**:
```bash
kubectl delete namespace nix-chatbot
```
