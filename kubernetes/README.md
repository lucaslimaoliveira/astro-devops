# Laboratório real de Rolling Update

Estes manifests reproduzem em um cluster Kubernetes o fluxo mostrado no laboratório interativo do site: aplicação da versão v1, atualização gradual para v2, falha de download da imagem e rollback.

## Pré-requisitos

- Docker Desktop ou outro runtime compatível em execução.
- kubectl instalado.
- Um cluster Kubernetes. Os exemplos abaixo usam kind, mas os manifests também funcionam com minikube e com o Kubernetes do Docker Desktop.

Confirme as ferramentas:

    docker version
    kind version
    kubectl version --client

## 1. Criar o cluster com kind

Execute a partir da raiz do projeto:

    kind create cluster --config kubernetes/kind-config.yaml
    kubectl cluster-info --context kind-rolling-lab

O arquivo cria um control-plane e dois workers. Aguarde todos os nós ficarem Ready:

    kubectl get nodes -o wide

## 2. Aplicar a versão v1

    kubectl apply -f kubernetes/deployment-v1.yaml
    kubectl apply -f kubernetes/service.yaml
    kubectl rollout status deployment/astro-demo --timeout=5m

Confira o Deployment, os ReplicaSets e os três Pods:

    kubectl get deployment astro-demo
    kubectl get rs -l app=astro-demo
    kubectl get pods -l app=astro-demo -o wide --show-labels

## 3. Acessar a aplicação

Abra um encaminhamento local para o Service:

    kubectl port-forward service/astro-demo 8080:80

Mantenha esse terminal aberto e acesse http://localhost:8080.

Em outro terminal, gere requisições contínuas.

PowerShell:

    while ($true) {
      try {
        Invoke-WebRequest http://localhost:8080 -UseBasicParsing | Out-Null
        Write-Host "$(Get-Date -Format HH:mm:ss) OK" -ForegroundColor Green
      } catch {
        Write-Host "$(Get-Date -Format HH:mm:ss) FALHA" -ForegroundColor Red
      }
      Start-Sleep -Seconds 1
    }

Bash, Git Bash ou WSL:

    while true; do
      curl -fsS http://localhost:8080 >/dev/null && echo "$(date +%T) OK" || echo "$(date +%T) FALHA"
      sleep 1
    done

Interrompa o loop com Ctrl+C.

## 4. Atualizar para a versão v2

    kubectl diff -f kubernetes/deployment-v2.yaml
    kubectl apply -f kubernetes/deployment-v2.yaml
    kubectl rollout status deployment/astro-demo --timeout=5m

Enquanto o rollout acontece, acompanhe Pods e ReplicaSets em outro terminal:

    kubectl get pods -l app=astro-demo -w

Depois, confirme a imagem e o histórico:

    kubectl get deployment astro-demo -o jsonpath="{.spec.template.spec.containers[0].image}"
    kubectl rollout history deployment/astro-demo

No PowerShell, o comando jsonpath acima pode ser usado exatamente como está, com aspas duplas.

## 5. Provocar ImagePullBackOff

O manifesto de falha referencia propositalmente uma tag inexistente:

    kubectl apply -f kubernetes/broken-deployment.yaml
    kubectl get pods -l app=astro-demo -w

Como maxUnavailable é zero, os três Pods estáveis continuam disponíveis e um quarto Pod falha ao baixar a imagem.

## 6. Investigar a falha

Liste os Pods e copie o nome do Pod em erro:

    kubectl get pods -l app=astro-demo

Depois substitua POD_COM_ERRO pelo nome real:

    kubectl describe pod POD_COM_ERRO
    kubectl logs POD_COM_ERRO
    kubectl get events --sort-by=.lastTimestamp
    kubectl describe deployment astro-demo

No PowerShell, use esta alternativa para selecionar automaticamente o Pod que não está pronto:

    $podComErro = kubectl get pods -l app=astro-demo --no-headers |
      Select-String "ImagePullBackOff|ErrImagePull" |
      ForEach-Object { ($_ -split "\s+")[0] } |
      Select-Object -First 1
    kubectl describe pod $podComErro

## 7. Executar rollback

Veja as revisões:

    kubectl rollout history deployment/astro-demo

Retorne ao Pod template anterior e acompanhe a recuperação:

    kubectl rollout undo deployment/astro-demo
    kubectl rollout status deployment/astro-demo --timeout=5m
    kubectl get pods -l app=astro-demo

Confirme que a imagem voltou para a última versão estável:

    kubectl get deployment astro-demo -o jsonpath="{.spec.template.spec.containers[0].image}"

## 8. Encerrar o laboratório

Apague apenas os recursos da aplicação:

    kubectl delete -f kubernetes/service.yaml
    kubectl delete deployment astro-demo

Ou remova todo o cluster criado para a apresentação:

    kind delete cluster --name rolling-lab

Excluir o cluster remove todos os recursos e dados contidos nele.
