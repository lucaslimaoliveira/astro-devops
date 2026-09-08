const BADGE_LABEL = {
  purple: "Essencial",
  gray: "Aprofundamento"
};

const DATA = [
  {
    id: "fundamentos",
    title: "Entenda o problema",
    track: "Fundamentos",
    desc: "Objetivo: reconhecer por que uma troca abrupta de versão gera indisponibilidade. Checkpoint: explicar como o Rolling Update reduz downtime sem prometer zero downtime sozinho.",
    links: [
      { label: "Kubernetes — atualização sem downtime", url: "https://kubernetes.io/docs/tasks/run-application/update-deployment-rolling/" }
    ],
    items: [
      { id: "downtime", name: "Downtime planejado e não planejado", badge: "purple", desc: "Downtime é o período em que a aplicação não consegue atender corretamente. Pode acontecer em uma manutenção planejada ou por falhas de software, rede, recursos, dependências e segurança.", links: [] },
      { id: "troca-abrupta", name: "Risco da troca abrupta", badge: "purple", desc: "Se todas as instâncias antigas forem encerradas antes de as novas ficarem prontas, o Service fica temporariamente sem backends capazes de responder.", links: [] },
      { id: "conceito-rolling", name: "O que o Rolling Update resolve", badge: "purple", desc: "O Rolling Update substitui Pods gradualmente para manter capacidade durante a mudança. Ele reduz o risco de indisponibilidade, mas depende de réplicas, probes, recursos e compatibilidade.", links: [{ label: "Kubernetes — Deployments", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" }] },
      { id: "limites-rolling", name: "O que ele não garante sozinho", badge: "gray", desc: "Readiness mal configurada, falta de capacidade, encerramento incorreto ou incompatibilidade entre versões ainda podem causar falhas mesmo com RollingUpdate.", links: [] }
    ]
  },
  {
    id: "arquitetura",
    title: "Mapeie a arquitetura",
    track: "Kubernetes",
    desc: "Objetivo: visualizar quem declara, cria, executa e publica a aplicação. Checkpoint: desenhar o caminho Deployment → ReplicaSets → Pods Ready → Service.",
    links: [
      { label: "Kubernetes — Deployments", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" },
      { label: "Kubernetes — Services", url: "https://kubernetes.io/docs/concepts/services-networking/service/" }
    ],
    items: [
      { id: "deployment", name: "Deployment: estado desejado", badge: "purple", desc: "Declara imagem, quantidade de réplicas, Pod template e estratégia de atualização. Uma mudança em spec.template cria uma nova revisão.", links: [{ label: "Deployment na documentação", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" }] },
      { id: "replicaset", name: "ReplicaSet: versões coexistindo", badge: "purple", desc: "O ReplicaSet mantém os Pods de um template. Durante o rollout, o ReplicaSet antigo e o novo coexistem enquanto um diminui e o outro cresce.", links: [] },
      { id: "pods-ready", name: "Pods e condição Ready", badge: "purple", desc: "O Pod executa o contêiner. Processo iniciado não significa aplicação pronta: a condição Ready informa se ele pode participar do tráfego regular.", links: [{ label: "Kubernetes — ciclo de vida do Pod", url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/" }] },
    ]
  },
  {
    id: "artefato",
    title: "Produza o artefato",
    track: "Docker",
    desc: "Objetivo: levar uma mudança do código até uma imagem rastreável no registry. Checkpoint: relacionar commit, build, tag, digest e ambiente sem reconstruir o artefato.",
    links: [
      { label: "Docker — boas práticas de build", url: "https://docs.docker.com/build/building-best-practices/" },
      { label: "Kubernetes — imagens", url: "https://kubernetes.io/docs/concepts/containers/images/" }
    ],
    items: [
      { id: "tag-digest", name: "Tag única e digest", badge: "purple", desc: "Evite latest. Use uma tag única por build e registre o digest quando precisar garantir exatamente o mesmo conteúdo em todos os ambientes.", links: [{ label: "Docker — tags imutáveis", url: "https://docs.docker.com/docker-hub/repos/manage/hub-images/immutable-tags/" }] },
      { id: "pod-template", name: "Atualize o Pod template", badge: "purple", desc: "Mude a referência da imagem em spec.template. Apenas publicar bytes diferentes com a mesma tag não altera o template e prejudica a rastreabilidade.", links: [] }
    ]
  },
  {
    id: "estrategia",
    title: "Configure o rollout",
    track: "RollingUpdate",
    desc: "Objetivo: controlar disponibilidade e capacidade durante a troca. Checkpoint: calcular o mínimo disponível e o máximo total para um cenário de réplicas.",
    links: [
      { label: "Kubernetes — estratégia RollingUpdate", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment" }
    ],
    items: [
      { id: "replicas", name: "Defina réplicas e capacidade", badge: "purple", desc: "Use pelo menos duas réplicas quando precisar tolerar a substituição de uma instância. Confirme CPU, memória, volumes e quotas para acomodar Pods extras.", links: [{ label: "Kubernetes — recursos de contêiner", url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" }] },
      { id: "max-unavailable", name: "maxUnavailable", badge: "purple", desc: "Define quantos Pods desejados podem ficar indisponíveis durante a atualização. Percentuais são arredondados para baixo.", links: [] },
      { id: "max-surge", name: "maxSurge", badge: "purple", desc: "Define quantos Pods extras podem existir acima do número desejado. Percentuais são arredondados para cima e exigem capacidade no cluster.", links: [] },
      { id: "tempo-rollout", name: "minReadySeconds e deadline", badge: "gray", desc: "minReadySeconds exige estabilidade antes de considerar o Pod disponível. progressDeadlineSeconds sinaliza falta de progresso dentro do prazo.", links: [] }
    ]
  },
  {
    id: "saude",
    title: "Proteja o tráfego",
    track: "Health checks",
    desc: "Objetivo: impedir tráfego prematuro e reinícios incorretos. Checkpoint: explicar a pergunta respondida por cada probe e o efeito de sua falha.",
    links: [
      { label: "Kubernetes — configure probes", url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/" }
    ],
    items: [
      { id: "startup-probe", name: "startupProbe: terminou de iniciar?", badge: "purple", desc: "Protege aplicações lentas. Enquanto não passa, readiness e liveness não começam. Se exceder o limite de falhas, o contêiner é reiniciado.", links: [] },
      { id: "readiness-probe", name: "readinessProbe: pode receber tráfego?", badge: "purple", desc: "Quando falha, o Pod fica NotReady e sai dos backends regulares do Service. A falha de readiness não reinicia o contêiner.", links: [] },
      { id: "liveness-probe", name: "livenessProbe: precisa reiniciar?", badge: "purple", desc: "Detecta estado irrecuperável. Uma configuração agressiva pode causar reinícios em cascata durante carga alta ou lentidão de dependências.", links: [] },
      { id: "shutdown", name: "SIGTERM e encerramento gracioso", badge: "gray", desc: "Ao terminar, pare de aceitar trabalho novo e conclua requisições em andamento dentro de terminationGracePeriodSeconds. Use preStop apenas quando necessário.", links: [{ label: "Kubernetes — término de Pods", url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-flow" }] }
    ]
  },
  {
    id: "execucao",
    title: "Execute e observe",
    track: "Operação",
    desc: "Objetivo: iniciar um rollout e acompanhar sua evolução. Checkpoint: usar status como gate e localizar a revisão executada.",
    links: [
      { label: "kubectl set image", url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_set/kubectl_set_image/" },
      { label: "kubectl rollout", url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/" }
    ],
    items: [
      { id: "rollout-status", name: "rollout status com timeout", badge: "purple", desc: "Acompanhe a conclusão com timeout explícito. Em CI/CD, o comando deve funcionar como gate de sucesso ou falha.", links: [] },
      { id: "history", name: "Histórico, pause e resume", badge: "gray", desc: "Consulte revisões com rollout history. Pause permite agrupar mudanças no Pod template; retome antes de tentar rollout undo.", links: [{ label: "kubectl rollout", url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/" }] },
      { id: "observe-metrics", name: "Métricas, logs e smoke tests", badge: "purple", desc: "Readiness não detecta todo bug funcional. Observe erros, latência, saturação, disponibilidade, SLOs, logs e testes pós-deploy.", links: [] }
    ]
  },
  {
    id: "falhas",
    title: "Diagnostique falhas",
    track: "Troubleshooting",
    desc: "Objetivo: identificar por que o rollout parou antes de agir. Checkpoint: ligar cada sintoma ao comando e à hipótese de investigação.",
    links: [
      { label: "Kubernetes — depure aplicações", url: "https://kubernetes.io/docs/tasks/debug/debug-application/" }
    ],
    items: [
      { id: "image-pull", name: "ImagePullBackOff", badge: "purple", desc: "Verifique nome, tag, acesso ao registry, imagePullSecrets e Events com kubectl describe pod.", links: [] },
      { id: "crash-loop", name: "CrashLoopBackOff", badge: "purple", desc: "Investigue falhas de processo e configuração com logs, kubectl logs --previous, describe e Events.", links: [] },
      { id: "never-ready", name: "Readiness nunca passa", badge: "purple", desc: "Confira endpoint, porta, timeout, dependências, logs e EndpointSlices. O Pod pode estar Running sem entrar no Service.", links: [] },
      { id: "pod-pending", name: "Pod permanece Pending", badge: "purple", desc: "Procure falta de CPU, memória, volume, quotas ou restrições de agendamento. Requests incorretos podem impedir o Pod de surge.", links: [{ label: "Kubernetes — recursos", url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" }] },
      { id: "bug-funcional", name: "Bug depois da readiness", badge: "gray", desc: "Uma probe simples pode passar mesmo com erro de negócio, latência ou incompatibilidade. Cruze smoke tests com métricas e logs.", links: [] }
    ]
  },
  {
    id: "rollback",
    title: "Reverta com segurança",
    track: "Recuperação",
    desc: "Objetivo: restaurar uma revisão anterior sem confundir rollback com retorno instantâneo. Checkpoint: executar o runbook e validar a estabilização.",
    links: [
      { label: "Kubernetes — rollback de Deployment", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-back-a-deployment" }
    ],
    items: [
      { id: "stop-promotion", name: "Pare a promoção e confirme impacto", badge: "purple", desc: "Interrompa a próxima etapa do pipeline e confirme o impacto em status, Pods, Events, logs e métricas antes de reverter.", links: [] },
      { id: "validate-recovery", name: "Valide depois da reversão", badge: "purple", desc: "Confirme erros, latência, tráfego e capacidade. Depois corrija a causa e publique outra imagem com nova tag ou digest.", links: [] },
      { id: "data-migrations", name: "Banco e efeitos externos", badge: "gray", desc: "Rollback de imagem não desfaz migrações, mensagens publicadas ou alterações externas. Schemas precisam ser compatíveis entre versões ou ter estratégia própria.", links: [] }
    ]
  },
  {
    id: "pipeline",
    title: "Automatize a entrega",
    track: "CI/CD",
    desc: "Objetivo: transformar o rollout em uma etapa observável da entrega. Checkpoint: desenhar um pipeline que interrompe a promoção diante de falha técnica ou regressão.",
    links: [
      { label: "Docker — boas práticas de build", url: "https://docs.docker.com/build/building-best-practices/" }
    ],
    items: [
      { id: "quality-gates", name: "Testes e validações de qualidade", badge: "purple", desc: "Comece com revisão de código, testes unitários, integração e validações antes de produzir o artefato.", links: [] },
      { id: "supply-chain", name: "Scan, SBOM e assinatura", badge: "gray", desc: "Analise vulnerabilidades e registre SBOM e assinatura quando essas práticas forem adotadas pela equipe.", links: [] },
      { id: "pipeline-gates", name: "Timeouts e gates de rollout", badge: "purple", desc: "Interrompa a promoção quando o rollout não conclui, as métricas pioram ou testes pós-deploy falham.", links: [] },
      { id: "auto-rollback", name: "Rollback exige automação externa", badge: "gray", desc: "O Deployment nativo sinaliza falta de progresso, mas não faz rollback automático. Essa lógica pertence ao pipeline ou a um controlador especializado.", links: [{ label: "Argo Rollouts — visão geral", url: "https://argoproj.github.io/rollouts/" }] }
    ]
  },
  {
    id: "estrategias",
    title: "Escolha a estratégia",
    track: "Decisão",
    desc: "Objetivo: escolher a abordagem de atualização pelo risco, capacidade e necessidade de controle de tráfego. Checkpoint: justificar quando RollingUpdate deixa de ser a melhor escolha.",
    links: [
      { label: "Argo Rollouts — conceitos", url: "https://argoproj.github.io/argo-rollouts/concepts/" }
    ],
    items: [
      { id: "recreate", name: "Recreate", badge: "gray", desc: "Encerra Pods antigos antes de criar os novos. Evita coexistência de versões, mas normalmente causa downtime.", links: [] },
      { id: "rolling-update", name: "RollingUpdate", badge: "purple", desc: "Troca Pods gradualmente com baixa complexidade operacional. Funciona melhor quando v1 e v2 podem coexistir e a readiness é confiável.", links: [] },
      { id: "blue-green", name: "Blue-Green", badge: "gray", desc: "Mantém dois ambientes completos e troca o tráfego após validar o novo. Permite retorno rápido, mas exige capacidade próxima do dobro.", links: [] },
      { id: "canary", name: "Canary", badge: "gray", desc: "Expõe uma parcela do tráfego à nova versão. Controle preciso normalmente exige Ingress, Service Mesh ou um controlador como Argo Rollouts.", links: [{ label: "Argo Rollouts — Canary", url: "https://argoproj.github.io/argo-rollouts/features/canary/" }] }
    ]
  },
  {
    id: "prova-final",
    title: "Prove baixo downtime",
    track: "Missão prática",
    desc: "Objetivo: demonstrar atualização, falha e recuperação em um cluster de teste. Checkpoint final: manter tráfego, observar a troca, provocar ImagePullBackOff e concluir um rollback.",
    links: [
      { label: "kind — cluster local", url: "https://kind.sigs.k8s.io/" },
      { label: "minikube — documentação", url: "https://minikube.sigs.k8s.io/docs/" }
    ],
    items: [
      { id: "low-downtime-checklist", name: "Checklist de produção", badge: "purple", desc: "Valide réplicas, readiness, selector, surge, requests, shutdown, compatibilidade, estado externo, distribuição, observabilidade e runbook de rollback.", links: [{ label: "Kubernetes — disruptions", url: "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/" }] }
    ]
  }
];

const PANEL_DETAILS = {
  fundamentos: {
    points: [
      "Uma atualização segura mantém instâncias antigas disponíveis enquanto as novas ficam prontas.",
      "Rolling Update reduz o risco de indisponibilidade, mas depende de réplicas, probes e capacidade.",
      "O objetivo não é prometer zero downtime: é controlar a troca e medir o resultado."
    ],
    note: "Comece comparando uma troca abrupta com uma troca gradual. Essa imagem mental prepara o restante da apresentação."
  },
  downtime: {
    points: [
      "Downtime planejado acontece em uma janela conhecida; o não planejado surge de falhas ou mudanças inesperadas.",
      "Para o usuário, ambos significam a mesma coisa: a aplicação não responde corretamente.",
      "Disponibilidade deve ser observada por requisições bem-sucedidas, não apenas por processos em execução."
    ],
    note: "Use um exemplo simples: se existem 3 Pods e todos reiniciam juntos, o Service fica sem destino para o tráfego."
  },
  "troca-abrupta": {
    points: [
      "Encerrar a versão antiga antes de validar a nova cria um intervalo sem backends saudáveis.",
      "Uma imagem inválida, uma porta errada ou uma inicialização lenta aumenta esse intervalo.",
      "A coexistência temporária de versões reduz o risco, desde que elas sejam compatíveis."
    ],
    note: "Destaque a ordem dos eventos: remover primeiro e criar depois é o ponto de maior risco."
  },
  "conceito-rolling": {
    points: [
      "O controlador cria Pods novos e remove os antigos gradualmente.",
      "A velocidade da troca é limitada por maxSurge e maxUnavailable.",
      "Somente Pods considerados disponíveis contam para o avanço do rollout."
    ],
    note: "Rolling Update é um mecanismo de substituição. A qualidade da aplicação e das probes continua sendo responsabilidade da equipe.",
    code: {
      language: "YAML",
      title: "Estratégia mínima",
      content: ["strategy:", "  type: RollingUpdate", "  rollingUpdate:", "    maxSurge: 1", "    maxUnavailable: 0"].join("\n")
    }
  },
  "limites-rolling": {
    points: [
      "Readiness superficial pode liberar uma versão que ainda não consegue atender.",
      "Falta de CPU ou memória impede a criação dos Pods extras.",
      "Mudanças incompatíveis em banco, filas ou APIs podem quebrar a coexistência entre versões."
    ],
    note: "A estratégia coordena Pods; ela não corrige bugs funcionais nem desfaz efeitos externos."
  },
  arquitetura: {
    points: [
      "Deployment declara o estado desejado e cria revisões por meio de ReplicaSets.",
      "ReplicaSets mantêm as versões antiga e nova durante a transição.",
      "O Service envia tráfego apenas aos endpoints que correspondem ao selector e estão Ready."
    ],
    note: "Apresente o fluxo como uma cadeia: Deployment → ReplicaSet → Pod Ready → Service."
  },
  deployment: {
    points: [
      "O Pod template contém imagem, portas, recursos, probes e labels.",
      "Qualquer alteração em spec.template cria uma nova revisão do Deployment.",
      "O controlador reconcilia continuamente o estado real com o estado desejado."
    ],
    code: {
      language: "YAML",
      title: "Recorte de um Deployment",
      content: ["apiVersion: apps/v1", "kind: Deployment", "metadata:", "  name: api", "spec:", "  replicas: 3", "  selector:", "    matchLabels:", "      app: api", "  template:", "    metadata:", "      labels:", "        app: api", "    spec:", "      containers:", "        - name: api", "          image: registry/api:1.4.0"].join("\n")
    }
  },
  replicaset: {
    points: [
      "Cada versão do Pod template possui um ReplicaSet associado.",
      "Durante o rollout, o novo ReplicaSet cresce enquanto o anterior diminui.",
      "Revisões antigas podem permanecer sem réplicas para permitir rollback."
    ],
    code: {
      language: "Shell",
      title: "Veja as versões coexistindo",
      content: ["kubectl get deploy api", "kubectl get rs -l app=api", "kubectl get pods -l app=api -o wide"].join("\n")
    }
  },
  "pods-ready": {
    points: [
      "Running informa que o contêiner iniciou; Ready informa que ele pode receber tráfego.",
      "Um Pod pode estar Running e continuar fora dos endpoints do Service.",
      "A condição Ready deve representar a capacidade real de atender requisições."
    ],
    code: {
      language: "Shell",
      title: "Compare estado e prontidão",
      content: ["kubectl get pods -l app=api", "kubectl get endpointslices -l kubernetes.io/service-name=api"].join("\n")
    }
  },
  artefato: {
    points: [
      "A imagem deve ser produzida uma vez e promovida entre ambientes.",
      "Tag única conecta o artefato ao build; digest identifica exatamente seu conteúdo.",
      "Reconstruir a mesma versão em cada ambiente reduz a rastreabilidade."
    ],
    note: "Mostre a sequência commit → build → tag → digest → alteração do Pod template."
  },
  "tag-digest": {
    points: [
      "Tags são nomes legíveis e podem ser alteradas; digest é o identificador imutável do conteúdo.",
      "latest não mostra qual build está em execução e dificulta auditoria e rollback.",
      "Uma boa tag pode incluir versão, número do build ou SHA curto do commit."
    ],
    code: {
      language: "Shell",
      title: "Build e publicação rastreáveis",
      content: ["docker build -t registry/api:1.4.0 .", "docker push registry/api:1.4.0", "docker inspect --format='{{index .RepoDigests 0}}' registry/api:1.4.0"].join("\n")
    }
  },
  "pod-template": {
    points: [
      "O rollout começa quando spec.template muda.",
      "Trocar apenas o conteúdo de uma tag reutilizada não registra uma nova revisão de forma confiável.",
      "A imagem declarada no Deployment deve apontar para o artefato aprovado."
    ],
    code: {
      language: "Shell",
      title: "Atualize a imagem declarada",
      content: ["kubectl set image deployment/api \\", "  api=registry/api:1.4.0", "kubectl rollout status deployment/api --timeout=5m"].join("\n")
    }
  },
  estrategia: {
    points: [
      "Réplicas determinam a capacidade normal; surge reserva capacidade temporária.",
      "maxUnavailable protege o mínimo disponível durante a troca.",
      "Percentuais são calculados sobre o número desejado e usam regras diferentes de arredondamento."
    ],
    code: {
      language: "YAML",
      title: "Disponibilidade conservadora",
      content: ["spec:", "  replicas: 4", "  strategy:", "    type: RollingUpdate", "    rollingUpdate:", "      maxSurge: 1", "      maxUnavailable: 0"].join("\n")
    }
  },
  replicas: {
    points: [
      "Uma única réplica não tolera bem substituição, falha de nó ou manutenção.",
      "Pods extras exigem recursos livres, quotas e possibilidade de agendamento.",
      "Distribuir réplicas entre nós ou zonas reduz falhas correlacionadas."
    ],
    code: {
      language: "Shell",
      title: "Ajuste e confirme a capacidade",
      content: ["kubectl scale deployment/api --replicas=3", "kubectl get pods -l app=api -o wide", "kubectl top pods -l app=api"].join("\n")
    }
  },
  "max-unavailable": {
    points: [
      "Valor 0 tenta manter toda a capacidade desejada disponível durante a atualização.",
      "Um valor maior acelera a troca, mas reduz a margem para picos ou falhas.",
      "Percentuais de maxUnavailable são arredondados para baixo."
    ],
    note: "Com 4 réplicas e 25%, no máximo 1 pode ficar indisponível durante o rollout.",
    code: {
      language: "YAML",
      title: "Preserve todas as réplicas",
      content: ["rollingUpdate:", "  maxUnavailable: 0", "  maxSurge: 1"].join("\n")
    }
  },
  "max-surge": {
    points: [
      "Surge permite criar capacidade nova antes de remover a antiga.",
      "Quanto maior o valor, mais rápida pode ser a atualização e maior o consumo temporário.",
      "Percentuais de maxSurge são arredondados para cima."
    ],
    note: "Com 4 réplicas e maxSurge 1, podem existir até 5 Pods durante a troca."
  },
  "tempo-rollout": {
    points: [
      "minReadySeconds exige que o Pod permaneça saudável antes de ser considerado disponível.",
      "progressDeadlineSeconds detecta quando o rollout deixou de progredir.",
      "O deadline sinaliza falha; ele não realiza rollback automaticamente."
    ],
    code: {
      language: "YAML",
      title: "Tempo para estabilização",
      content: ["spec:", "  minReadySeconds: 15", "  progressDeadlineSeconds: 600"].join("\n")
    }
  },
  saude: {
    points: [
      "Startup pergunta se a aplicação terminou de iniciar.",
      "Readiness decide se o Pod participa do tráfego.",
      "Liveness decide se o contêiner precisa ser reiniciado."
    ],
    note: "As três probes não são versões da mesma verificação: cada uma provoca uma consequência diferente."
  },
  "startup-probe": {
    points: [
      "Enquanto startupProbe não passa, liveness e readiness ficam suspensas.",
      "Ela evita que aplicações lentas sejam reiniciadas antes de terminar a inicialização.",
      "O limite total é failureThreshold multiplicado por periodSeconds."
    ],
    code: {
      language: "YAML",
      title: "Até 150 segundos para iniciar",
      content: ["startupProbe:", "  httpGet:", "    path: /health/startup", "    port: 8080", "  periodSeconds: 5", "  failureThreshold: 30"].join("\n")
    }
  },
  "readiness-probe": {
    points: [
      "Falha de readiness remove o Pod do tráfego sem reiniciar o processo.",
      "A verificação deve incluir apenas dependências necessárias para atender naquele momento.",
      "Uma probe permissiva libera tráfego cedo; uma agressiva pode retirar Pods saudáveis."
    ],
    code: {
      language: "YAML",
      title: "Libere o tráfego quando estiver pronto",
      content: ["readinessProbe:", "  httpGet:", "    path: /health/ready", "    port: 8080", "  periodSeconds: 5", "  timeoutSeconds: 2", "  failureThreshold: 3"].join("\n")
    }
  },
  "liveness-probe": {
    points: [
      "Liveness deve detectar um estado que realmente exige reinício.",
      "Dependência externa lenta geralmente não é motivo suficiente para matar o contêiner.",
      "Thresholds curtos podem causar reinícios em cascata sob carga."
    ],
    code: {
      language: "YAML",
      title: "Detecte travamento do processo",
      content: ["livenessProbe:", "  httpGet:", "    path: /health/live", "    port: 8080", "  periodSeconds: 10", "  timeoutSeconds: 2", "  failureThreshold: 3"].join("\n")
    }
  },
  shutdown: {
    points: [
      "Ao receber SIGTERM, a aplicação deve parar de aceitar trabalho novo.",
      "Requisições em andamento precisam terminar dentro do período de graça.",
      "preStop pode ajudar na drenagem, mas não substitui o tratamento correto de sinais."
    ],
    code: {
      language: "YAML",
      title: "Janela para encerramento",
      content: ["spec:", "  terminationGracePeriodSeconds: 30", "  containers:", "    - name: api", "      lifecycle:", "        preStop:", "          exec:", "            command: [\"sh\", \"-c\", \"sleep 5\"]"].join("\n")
    }
  },
  execucao: {
    points: [
      "Inicie a mudança com um artefato identificável.",
      "Acompanhe o status até conclusão ou timeout.",
      "Confirme comportamento com métricas, logs e um teste real de requisição."
    ],
    code: {
      language: "Shell",
      title: "Fluxo mínimo de execução",
      content: ["kubectl set image deploy/api api=registry/api:1.4.0", "kubectl rollout status deploy/api --timeout=5m", "kubectl get pods -l app=api -w"].join("\n")
    }
  },
  "rollout-status": {
    points: [
      "O comando acompanha se a revisão mais recente concluiu.",
      "Timeout evita que pipelines aguardem indefinidamente.",
      "Código de saída diferente de zero deve interromper a promoção."
    ],
    code: {
      language: "Shell",
      title: "Use o status como gate",
      content: ["kubectl rollout status deployment/api --timeout=5m", "kubectl get deployment api", "kubectl describe deployment api"].join("\n")
    }
  },
  history: {
    points: [
      "Histórico relaciona revisões às mudanças do Pod template.",
      "Pause permite acumular mudanças antes de continuar a substituição.",
      "Um Deployment pausado precisa ser retomado antes de concluir ou desfazer o rollout."
    ],
    code: {
      language: "Shell",
      title: "Inspecione e controle a revisão",
      content: ["kubectl rollout history deployment/api", "kubectl rollout pause deployment/api", "kubectl rollout resume deployment/api"].join("\n")
    }
  },
  "observe-metrics": {
    points: [
      "Erros e latência mostram impacto percebido pelo usuário.",
      "CPU, memória e saturação ajudam a explicar lentidão ou falhas de readiness.",
      "Smoke tests validam caminhos de negócio que uma probe simples não cobre."
    ],
    code: {
      language: "Shell",
      title: "Observação rápida no cluster",
      content: ["kubectl get pods -l app=api -w", "kubectl logs -l app=api --tail=100 --prefix", "kubectl get events --sort-by=.lastTimestamp"].join("\n")
    }
  },
  falhas: {
    points: [
      "Primeiro identifique o estado: Pending, ImagePullBackOff, CrashLoop ou NotReady.",
      "Depois conecte o sintoma a Events, logs, recursos e configuração.",
      "Corrigir sem formular uma hipótese pode esconder a causa e prolongar o incidente."
    ],
    code: {
      language: "Shell",
      title: "Triagem inicial",
      content: ["kubectl get pods -l app=api", "kubectl describe pod <pod>", "kubectl logs <pod> --previous", "kubectl get events --sort-by=.lastTimestamp"].join("\n")
    }
  },
  "image-pull": {
    points: [
      "Confirme nome, tag e existência da imagem no registry.",
      "Verifique credenciais, imagePullSecrets e permissão do nó.",
      "Events normalmente mostram a mensagem original devolvida pelo registry."
    ],
    code: {
      language: "Shell",
      title: "Localize o erro de download",
      content: ["kubectl describe pod <pod>", "kubectl get secret", "kubectl get pod <pod> -o jsonpath='{.status.containerStatuses[*].state.waiting.message}'"].join("\n")
    }
  },
  "crash-loop": {
    points: [
      "CrashLoopBackOff significa que o processo inicia, falha e entra em espera progressiva.",
      "Logs da instância anterior preservam a saída antes do último reinício.",
      "Configuração, secrets, argumentos e liveness são causas frequentes."
    ],
    code: {
      language: "Shell",
      title: "Veja a falha anterior",
      content: ["kubectl logs <pod> --previous", "kubectl describe pod <pod>", "kubectl get pod <pod> -o yaml"].join("\n")
    }
  },
  "never-ready": {
    points: [
      "Confira path, porta, protocolo, timeout e resposta da readiness.",
      "Teste o endpoint de dentro do Pod quando possível.",
      "Compare Pods Ready com os endpoints realmente publicados pelo Service."
    ],
    code: {
      language: "Shell",
      title: "Investigue a prontidão",
      content: ["kubectl describe pod <pod>", "kubectl exec <pod> -- wget -qO- localhost:8080/health/ready", "kubectl get endpointslices -l kubernetes.io/service-name=api"].join("\n")
    }
  },
  "pod-pending": {
    points: [
      "Pending geralmente indica que o scheduler ainda não encontrou onde executar o Pod.",
      "Requests, quotas, volumes, taints e afinidade podem bloquear o agendamento.",
      "Durante surge, o cluster precisa acomodar temporariamente mais Pods."
    ],
    code: {
      language: "Shell",
      title: "Leia a decisão do scheduler",
      content: ["kubectl describe pod <pod>", "kubectl get nodes", "kubectl top nodes", "kubectl get resourcequota -A"].join("\n")
    }
  },
  "bug-funcional": {
    points: [
      "Uma rota de health pode passar enquanto uma jornada de negócio falha.",
      "Compare versão, taxa de erro, latência e logs por revisão.",
      "Smoke tests pós-deploy devem cobrir os caminhos mais críticos."
    ],
    note: "Use o exemplo de uma API saudável em /health, mas incapaz de concluir um pagamento por incompatibilidade de contrato."
  },
  rollback: {
    points: [
      "Pare a promoção antes de introduzir a mesma revisão em outros ambientes.",
      "Reverta para uma revisão conhecida e acompanhe o novo rollout.",
      "Valide a recuperação e registre a causa; rollback não encerra a investigação."
    ],
    code: {
      language: "Shell",
      title: "Reversão controlada",
      content: ["kubectl rollout history deployment/api", "kubectl rollout undo deployment/api --to-revision=3", "kubectl rollout status deployment/api --timeout=5m"].join("\n")
    }
  },
  "stop-promotion": {
    points: [
      "Interrompa as próximas etapas do pipeline para limitar o impacto.",
      "Confirme se o problema começou com a nova revisão.",
      "Preserve logs, Events e métricas antes que evidências desapareçam."
    ],
    code: {
      language: "Shell",
      title: "Confirme revisão e impacto",
      content: ["kubectl rollout history deployment/api", "kubectl get rs -l app=api", "kubectl get pods -l app=api --show-labels"].join("\n")
    }
  },
  "validate-recovery": {
    points: [
      "Espere o rollback concluir e confirme Pods disponíveis.",
      "Valide taxa de erro, latência e jornadas críticas.",
      "Publique a correção com uma nova tag; não reutilize o artefato defeituoso."
    ],
    code: {
      language: "Shell",
      title: "Valide a estabilização",
      content: ["kubectl rollout status deployment/api --timeout=5m", "kubectl get deploy api", "curl -fsS https://api.exemplo.com/health"].join("\n")
    }
  },
  "data-migrations": {
    points: [
      "Reverter a imagem não desfaz alterações já aplicadas ao banco.",
      "Expanda o schema antes de usá-lo e só remova estruturas depois da migração.",
      "Mensagens e efeitos externos precisam de compensação ou idempotência."
    ],
    note: "Explique o padrão expand/contract: primeiro tornar o schema compatível, depois migrar o uso e somente então remover o formato antigo."
  },
  pipeline: {
    points: [
      "O mesmo artefato aprovado deve avançar entre os ambientes.",
      "Testes, scan, rollout status e métricas funcionam como gates.",
      "A promoção deve parar automaticamente quando um gate falha."
    ],
    code: {
      language: "Pipeline",
      title: "Sequência de entrega",
      content: ["test → build → scan → publish", "             ↓", "deploy → rollout status → smoke test", "                         ↓", "                 promote ou rollback"].join("\n")
    }
  },
  "quality-gates": {
    points: [
      "Testes unitários detectam regressões locais; integração valida contratos entre componentes.",
      "Lint e validação de manifesto antecipam erros antes do cluster.",
      "Gates devem falhar de forma clara e impedir a promoção."
    ],
    code: {
      language: "Shell",
      title: "Validações antes do deploy",
      content: ["npm test", "docker build -t registry/api:1.4.0 .", "kubectl apply --dry-run=server -f k8s/"].join("\n")
    }
  },
  "supply-chain": {
    points: [
      "Scan procura vulnerabilidades conhecidas no artefato.",
      "SBOM registra componentes e versões presentes na imagem.",
      "Assinatura ajuda a comprovar origem e integridade antes da execução."
    ],
    code: {
      language: "Shell",
      title: "Exemplo com ferramentas comuns",
      content: ["trivy image registry/api:1.4.0", "syft registry/api:1.4.0 -o spdx-json > sbom.json", "cosign sign registry/api:1.4.0"].join("\n")
    }
  },
  "pipeline-gates": {
    points: [
      "Defina timeout para toda etapa que depende do cluster.",
      "Combine sinais técnicos com um teste de negócio pós-deploy.",
      "Falha deve impedir promoção e gerar evidência para diagnóstico."
    ],
    code: {
      language: "Shell",
      title: "Gate após o deploy",
      content: ["kubectl rollout status deploy/api --timeout=5m", "curl -fsS https://api.exemplo.com/health", "npm run smoke:production"].join("\n")
    }
  },
  "auto-rollback": {
    points: [
      "Deployment relata progresso ou falha, mas não decide reverter sozinho.",
      "O pipeline pode executar undo quando critérios objetivos falham.",
      "Controladores progressivos oferecem análise e rollback mais sofisticados."
    ],
    note: "Não confunda progressDeadlineSeconds com rollback automático: o Kubernetes apenas marca a condição ProgressDeadlineExceeded."
  },
  estrategias: {
    points: [
      "Escolha pela tolerância a risco, capacidade disponível e compatibilidade entre versões.",
      "RollingUpdate é simples; Blue-Green favorece troca rápida; Canary reduz exposição inicial.",
      "A estratégia deve combinar com o modo como tráfego e dados são controlados."
    ],
    note: "Compare as opções em três perguntas: versões podem coexistir? Há capacidade extra? Precisamos controlar a porcentagem de tráfego?"
  },
  recreate: {
    points: [
      "Todos os Pods antigos são removidos antes da criação dos novos.",
      "Evita coexistência de versões, mas normalmente causa indisponibilidade.",
      "Pode servir para workloads que não permitem duas versões simultâneas."
    ],
    code: {
      language: "YAML",
      title: "Estratégia Recreate",
      content: ["spec:", "  strategy:", "    type: Recreate"].join("\n")
    }
  },
  "rolling-update": {
    points: [
      "Equilibra simplicidade operacional e continuidade do serviço.",
      "Funciona melhor com várias réplicas, readiness confiável e versões compatíveis.",
      "Não oferece divisão percentual precisa de tráfego por usuário."
    ],
    code: {
      language: "YAML",
      title: "Estratégia gradual",
      content: ["spec:", "  strategy:", "    type: RollingUpdate", "    rollingUpdate:", "      maxSurge: 25%", "      maxUnavailable: 25%"].join("\n")
    }
  },
  "blue-green": {
    points: [
      "Dois ambientes completos permanecem disponíveis: atual e candidato.",
      "A troca ocorre ao redirecionar o tráfego depois da validação.",
      "O retorno pode ser rápido, mas estado e banco ainda exigem compatibilidade."
    ],
    note: "O custo principal é manter capacidade próxima do dobro durante a transição."
  },
  canary: {
    points: [
      "Uma pequena parte do tráfego recebe a nova versão primeiro.",
      "A promoção pode avançar em etapas com análise de métricas.",
      "Controle preciso costuma exigir Ingress, Service Mesh ou controlador progressivo."
    ],
    note: "Canary reduz o raio de impacto, não a probabilidade de existir um bug."
  },
  "prova-final": {
    points: [
      "Gere tráfego contínuo antes de iniciar a atualização.",
      "Observe Pods antigos e novos coexistindo sem interromper as requisições.",
      "Provoque uma imagem inválida, diagnostique e execute a recuperação."
    ],
    code: {
      language: "Shell",
      title: "Roteiro resumido do laboratório",
      content: ["while true; do curl -fsS http://localhost:8080; sleep 1; done", "kubectl set image deploy/api api=registry/api:2.0.0", "kubectl rollout status deploy/api --timeout=5m", "kubectl set image deploy/api api=registry/api:nao-existe", "kubectl rollout undo deploy/api"].join("\n")
    }
  },
  "low-downtime-checklist": {
    points: [
      "Confirme réplicas, readiness, capacidade de surge e encerramento gracioso.",
      "Observe disponibilidade durante toda a troca, não apenas o status final.",
      "Registre evidências do erro provocado e da recuperação."
    ],
    note: "A demonstração está completa quando o grupo consegue explicar o que aconteceu, provar o baixo downtime e repetir a recuperação."
  }
};

const PHASES = [
  {
    id: "base",
    label: "Fase 01",
    title: "Construa a base",
    desc: "Entenda o risco, enxergue os componentes e prepare uma imagem rastreável.",
    sections: ["fundamentos", "arquitetura", "artefato"]
  },
  {
    id: "planejamento",
    label: "Fase 02",
    title: "Planeje a disponibilidade",
    desc: "Defina capacidade, ritmo de substituição e os sinais que protegem o tráfego.",
    sections: ["estrategia", "saude"]
  },
  {
    id: "operacao",
    label: "Fase 03",
    title: "Opere e recupere",
    desc: "Execute o rollout, observe o comportamento e saiba voltar com segurança.",
    sections: ["execucao", "falhas", "rollback"]
  },
  {
    id: "evolucao",
    label: "Fase 04",
    title: "Evolua a entrega",
    desc: "Automatize os gates, compare estratégias e encerre com uma prova prática.",
    sections: ["pipeline", "estrategias", "prova-final"]
  }
];

function buildDeploymentYaml({ image, version, changeCause, deadline = 180 }){
  if (version === "v1") return [
    "apiVersion: apps/v1",
    "kind: Deployment",
    "metadata:",
    "  name: astro-demo # Mesmo Deployment nas versoes v1 e v2",
    "spec:",
    "  replicas: 3",
    "  strategy:",
    "    type: RollingUpdate",
    "    rollingUpdate:",
    "      maxSurge: 1 # Permite 1 replica extra durante a troca",
    "      maxUnavailable: 0 # A troca deve preservar 3 replicas disponiveis",
    "  selector: # Obrigatorio: deve corresponder aos labels dos Pods",
    "    matchLabels:",
    "      app: astro-demo",
    "  template: # Alterar este template inicia uma nova revisao",
    "    metadata:",
    "      labels:",
    "        app: astro-demo",
    "        version: v1",
    "    spec:",
    "      containers:",
    "        - name: web # Identifica o container; mantenha o nome na v2",
    "          image: nginx:1.25-alpine # Na v2, muda para nginx:1.27-alpine",
    "          ports:",
    "            - name: http",
    "              containerPort: 80",
    "          readinessProbe: # Verifica se o novo Pod pode receber trafego",
    "            httpGet:",
    "              path: /",
    "              port: http",
    "            initialDelaySeconds: 2",
    "            periodSeconds: 3",
  ].join("\n");
  return [
    "apiVersion: apps/v1",
    "kind: Deployment",
    "metadata:",
    "  name: astro-demo",
    "  labels:",
    "    app: astro-demo",
    "  annotations:",
    "    kubernetes.io/change-cause: \"" + changeCause + "\"",
    "spec:",
    "  replicas: 3",
    "  revisionHistoryLimit: 5",
    "  minReadySeconds: 5",
    "  progressDeadlineSeconds: " + deadline,
    "  strategy:",
    "    type: RollingUpdate",
    "    rollingUpdate:",
    "      maxSurge: 1",
    "      maxUnavailable: 0",
    "  selector:",
    "    matchLabels:",
    "      app: astro-demo",
    "  template:",
    "    metadata:",
    "      labels:",
    "        app: astro-demo",
    "        version: " + version,
    "    spec:",
    "      terminationGracePeriodSeconds: 30",
    "      containers:",
    "        - name: web",
    "          image: " + image,
    "          imagePullPolicy: " + (version === "broken" ? "Always" : "IfNotPresent"),
    "          ports:",
    "            - name: http",
    "              containerPort: 80",
    "          readinessProbe:",
    "            httpGet:",
    "              path: /",
    "              port: http",
    "            initialDelaySeconds: 2",
    "            periodSeconds: 3",
    "            timeoutSeconds: 2",
    "            failureThreshold: 3",
    "          livenessProbe:",
    "            httpGet:",
    "              path: /",
    "              port: http",
    "            initialDelaySeconds: 10",
    "            periodSeconds: 10",
    "            timeoutSeconds: 2",
    "            failureThreshold: 3",
    "          resources:",
    "            requests:",
    "              cpu: 20m",
    "              memory: 24Mi",
    "            limits:",
    "              cpu: 100m",
    "              memory: 64Mi"
  ].join("\n");
}

const LAB_FILES = {
  "deployment-v1": {
    name: "deployment-v1.yaml",
    content: buildDeploymentYaml({
      image: "nginx:1.25-alpine",
      version: "v1",
      changeCause: "Release v1 — nginx 1.25"
    })
  },
  "deployment-v2": {
    name: "deployment-v2.yaml",
    content: buildDeploymentYaml({
      image: "nginx:1.27-alpine",
      version: "v2",
      changeCause: "Release v2 — nginx 1.27"
    })
  },
  service: {
    name: "service.yaml",
    content: [
      "apiVersion: v1",
      "kind: Service",
      "metadata:",
      "  name: astro-demo",
      "  labels:",
      "    app: astro-demo",
      "spec:",
      "  type: ClusterIP",
      "  selector:",
      "    app: astro-demo",
      "  ports:",
      "    - name: http",
      "      port: 80",
      "      targetPort: http",
      "      protocol: TCP"
    ].join("\n")
  },
  "broken-deployment": {
    name: "broken-deployment.yaml",
    content: buildDeploymentYaml({
      image: "nginx:versao-inexistente",
      version: "broken",
      changeCause: "Falha proposital — imagem inexistente",
      deadline: 60
    })
  }
};

const LAB_STATES = {
  idle: {
    label: "Aguardando validação",
    tone: "idle",
    actions: ["validate"],
    title: "Valide antes de aplicar",
    text: "Comece verificando a estrutura do manifesto antes de enviá-lo ao cluster.",
    points: ["Nenhum recurso foi criado.", "O navegador executa uma simulação controlada."]
  },
  validating: {
    label: "Validando manifesto",
    tone: "working",
    actions: [],
    title: "Verificando a declaração",
    text: "O dry-run confere campos essenciais sem criar recursos no cluster.",
    points: ["A estrutura está sendo analisada.", "Nenhum Pod é criado nesta etapa."]
  },
  validated: {
    label: "YAML validado",
    tone: "success",
    actions: ["apply"],
    title: "Manifesto pronto",
    text: "A configuração possui Deployment, réplicas, imagem e estratégia de atualização.",
    points: ["A validação não executou o workload.", "Agora a versão v1 pode ser aplicada."]
  },
  "deploying-v1": {
    label: "Criando versão v1",
    tone: "working",
    actions: [],
    title: "O controlador entrou em ação",
    text: "O Deployment cria um ReplicaSet responsável por manter três Pods disponíveis.",
    points: ["Cada Pod passa por inicialização e readiness.", "O Service publica apenas endpoints Ready."]
  },
  "v1-ready": {
    label: "Versão v1 disponível",
    tone: "success",
    actions: ["update"],
    title: "Estado desejado alcançado",
    text: "As três réplicas da versão v1 estão prontas e recebendo tráfego.",
    points: ["Deployment disponível: 3/3.", "A atualização para v2 já pode começar."]
  },
  "rolling-update": {
    label: "Rolling Update em curso",
    tone: "working",
    actions: [],
    title: "Troca gradual sem perda de capacidade",
    text: "O Kubernetes cria um novo Pod e espera sua readiness antes de encerrar uma instância antiga.",
    points: ["maxSurge permite um quarto Pod temporário.", "maxUnavailable zero preserva três réplicas Ready."]
  },
  "v2-ready": {
    label: "Versão v2 disponível",
    tone: "success",
    actions: ["fail"],
    title: "Atualização concluída",
    text: "Todos os Pods antigos foram substituídos e a versão v2 atende o Service.",
    points: ["O novo ReplicaSet possui três réplicas.", "A revisão anterior continua no histórico."]
  },
  "introducing-failure": {
    label: "Aplicando imagem inválida",
    tone: "warning",
    actions: [],
    title: "Uma revisão com erro foi criada",
    text: "O controlador tenta iniciar a imagem inexistente sem retirar a versão estável.",
    points: ["Um quarto Pod usa a capacidade de surge.", "Os três Pods v2 continuam Ready."]
  },
  "rollout-failed": {
    label: "Rollout bloqueado",
    tone: "error",
    actions: ["rollback"],
    title: "ImagePullBackOff interrompeu o avanço",
    text: "A imagem não foi encontrada. O novo Pod falha, mas os Pods estáveis continuam atendendo.",
    points: ["O rollout não pode concluir.", "Events e describe revelam a causa."]
  },
  "rolling-back": {
    label: "Rollback em curso",
    tone: "working",
    actions: [],
    title: "Retornando à revisão estável",
    text: "O Deployment volta ao Pod template anterior e remove a revisão que não ficou pronta.",
    points: ["A capacidade estável permanece disponível.", "O Pod com erro é encerrado."]
  },
  "rollback-complete": {
    label: "Rollback concluído",
    tone: "success",
    actions: [],
    title: "Serviço estabilizado",
    text: "A revisão com falha foi removida e os três Pods v2 continuam Ready.",
    points: ["A disponibilidade foi preservada.", "Reinicie para repetir a demonstração."]
  }
};

// Completed actions, not Pod counts: these drive the guided demonstration steps.
const LAB_STEP_PROGRESS = {
  idle: 0, validating: 0, validated: 1, "deploying-v1": 1,
  "v1-ready": 2, "rolling-update": 2, "v2-ready": 3,
  "introducing-failure": 3, "rollout-failed": 4, "rolling-back": 4,
  "rollback-complete": 5
};
const LAB_STEP_LABELS = ["Validar YAML", "Aplicar versão v1", "Atualizar para v2", "Simular falha", "Executar rollback"];
const LAB_FILE_DESCRIPTIONS = {
  "deployment-v1": "Ponto de partida: 3 réplicas da v1 com atualização gradual.",
  "deployment-v2": "Nova imagem, mesmo Deployment. O Pod template inicia a troca para v2.",
  service: "Um endereço estável que encaminha o tráfego aos Pods Ready.",
  "broken-deployment": "Uma tag inexistente provoca ImagePullBackOff no novo Pod."
};

const treeEl = document.getElementById("tree");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const progressPercent = document.getElementById("progressPercent");
const overlay = document.getElementById("overlay");
const stageSpotlight = document.getElementById("stageSpotlight");
const spotlightStage = document.getElementById("spotlightStage");
const panel = document.getElementById("panel");
const panelTitle = document.getElementById("panelTitle");
const panelBadge = document.getElementById("panelBadge");
const panelDesc = document.getElementById("panelDesc");
const panelLearning = document.getElementById("panelLearning");
const panelPoints = document.getElementById("panelPoints");
const presenterNote = document.getElementById("presenterNote");
const presenterNoteText = document.getElementById("presenterNoteText");
const panelCodeSection = document.getElementById("panelCodeSection");
const panelCodeLanguage = document.getElementById("panelCodeLanguage");
const panelCodeTitle = document.getElementById("panelCodeTitle");
const panelCode = document.getElementById("panelCode");
const copyCodeBtn = document.getElementById("copyCodeBtn");
const panelLinks = document.getElementById("panelLinks");
const markDoneRow = document.getElementById("markDoneRow");
const markDoneCheck = document.getElementById("markDoneCheck");
const completeTopic = document.getElementById("completeTopic");
const completeTopicBtn = document.getElementById("completeTopicBtn");
const completeTopicStatus = document.getElementById("completeTopicStatus");
const wrapEl = document.getElementById("wrap");
const mapShellEl = document.getElementById("roadmap");
const startPresentationBtn = document.getElementById("startPresentationBtn");
const presentationToolbar = document.getElementById("presentationToolbar");
const presentationExitBtn = document.getElementById("presentationExitBtn");
const presentationPrevBtn = document.getElementById("presentationPrevBtn");
const presentationNextBtn = document.getElementById("presentationNextBtn");
const presentationStep = document.getElementById("presentationStep");
const presentationTitle = document.getElementById("presentationTitle");
const labEl = document.getElementById("kubernetes-lab");
const labLock = document.getElementById("labLock");
const labLockStatus = document.getElementById("labLockStatus");
const labAccessLink = document.getElementById("labAccessLink");
const labLockLink = document.getElementById("labLockLink");
const labBackdrop = document.getElementById("labBackdrop");
const labPresentBtn = document.getElementById("labPresentBtn");
const labPresentationExit = document.getElementById("labPresentationExit");
const labResetBtn = document.getElementById("labResetBtn");
const labStateDot = document.getElementById("labStateDot");
const labStateLabel = document.getElementById("labStateLabel");
const labSpeed = document.getElementById("labSpeed");
const labFileName = document.getElementById("labFileName");
const labFileDescription = document.getElementById("labFileDescription");
const labStepLabel = document.getElementById("labStepLabel");
const labStepHint = document.getElementById("labStepHint");
const labReadyCount = document.getElementById("labReadyCount");
const labPodCount = document.getElementById("labPodCount");
const labRolloutLabel = document.getElementById("labRolloutLabel");
const labRolloutProgress = document.getElementById("labRolloutProgress");
const labRolloutCount = document.getElementById("labRolloutCount");
const labClusterHint = document.getElementById("labClusterHint");
const labEditorStatus = document.getElementById("labEditorStatus");
const labYamlEditor = document.getElementById("labYamlEditor");
const labLineNumbers = document.getElementById("labLineNumbers");
const labCopyYaml = document.getElementById("labCopyYaml");
const labDownloadYaml = document.getElementById("labDownloadYaml");
const labAvailability = document.getElementById("labAvailability");
const labDeploymentRevision = document.getElementById("labDeploymentRevision");
const labRsOld = document.getElementById("labRsOld");
const labRsNew = document.getElementById("labRsNew");
const labRsOldName = document.getElementById("labRsOldName");
const labRsNewName = document.getElementById("labRsNewName");
const labRsOldCount = document.getElementById("labRsOldCount");
const labRsNewCount = document.getElementById("labRsNewCount");
const labPodsEl = document.getElementById("labPods");
const labServiceStatus = document.getElementById("labServiceStatus");
const labContextTitle = document.getElementById("labContextTitle");
const labContextText = document.getElementById("labContextText");
const labContextPoints = document.getElementById("labContextPoints");
const labTerminal = document.getElementById("labTerminal");
const labClearTerminal = document.getElementById("labClearTerminal");
const labActionButtons = Array.from(document.querySelectorAll("[data-lab-action]"));
const labFileTabs = Array.from(document.querySelectorAll("[data-lab-file]"));
const STORAGE_KEY = "astro-rolling-update-roadmap-v1";

let doneSet = new Set();
let totalItems = 0;
let currentLeafEl = null;
let currentId = null;
let currentSection = null;
let lastFocusedElement = null;
let focusedSectionEl = null;
let presentationIndex = -1;
let spotlightSourceButton = null;
let labState = "idle";
let labWasUnlocked = false;
let labPods = [];
let labFileKey = "deployment-v1";
let labRunToken = 0;
let labPresentationReturnFocus = null;

function badgeEl(color){
  const badge = document.createElement("span");
  badge.className = "badge " + color;
  badge.textContent = "✓";
  badge.setAttribute("aria-hidden", "true");
  return badge;
}

function makeLeaf(item){
  const el = document.createElement("button");
  el.className = "leaf";
  el.type = "button";
  el.dataset.id = item.id;
  el.classList.toggle("done", doneSet.has(item.id));
  el.setAttribute("aria-label", `Abrir ${item.name}`);

  const label = document.createElement("span");
  label.className = "leaf-label";
  label.textContent = item.name;

  const description = document.createElement("span");
  description.className = "leaf-desc focus-detail";
  description.textContent = item.desc;
  description.hidden = true;

  el.append(label, description);

  if (item.badge) el.appendChild(badgeEl(item.badge));
  el.addEventListener("click", (event) => {
    event.stopPropagation();
    openPanel(item, el);
  });
  return el;
}

function renderRoadmap(){
  let stepIndex = 0;

  PHASES.forEach((phase) => {
    const phaseEl = document.createElement("section");
    phaseEl.className = "roadmap-phase";
    phaseEl.dataset.phase = phase.id;

    const phaseIntro = document.createElement("header");
    phaseIntro.className = "phase-intro";

    const phaseLabel = document.createElement("span");
    phaseLabel.className = "phase-label";
    phaseLabel.textContent = phase.label;

    const phaseTitle = document.createElement("h3");
    phaseTitle.textContent = phase.title;

    const phaseDesc = document.createElement("p");
    phaseDesc.textContent = phase.desc;

    phaseIntro.append(phaseLabel, phaseTitle, phaseDesc);

    const phaseSteps = document.createElement("div");
    phaseSteps.className = "phase-steps";
    phaseSteps.style.setProperty("--step-count", phase.sections.length);

    phase.sections.forEach((sectionId) => {
      const section = DATA.find((entry) => entry.id === sectionId);
      if (!section) return;

      stepIndex++;
      const step = String(stepIndex).padStart(2, "0");
      const sectionEl = document.createElement("section");
      sectionEl.className = "section";
      sectionEl.dataset.step = step;
      sectionEl.dataset.title = section.title;
      sectionEl.setAttribute("aria-label", `Etapa ${stepIndex}: ${section.title}`);

      const topicBox = document.createElement("button");
      topicBox.className = "topic-box";
      topicBox.type = "button";
      topicBox.dataset.step = step;
      topicBox.dataset.sectionId = section.id;
      topicBox.setAttribute("aria-label", `Focar etapa ${stepIndex}: ${section.title}`);
      topicBox.setAttribute("aria-expanded", "false");
      topicBox.title = "Clique para destacar esta etapa e ver mais detalhes";

      const orbit = document.createElement("span");
      orbit.className = "topic-orbit";
      orbit.textContent = step;

      const topicCopy = document.createElement("span");
      topicCopy.className = "topic-copy";

      const track = document.createElement("span");
      track.className = "topic-track";
      track.textContent = section.track;

      const title = document.createElement("span");
      title.className = "topic-title";
      title.textContent = section.title;

      topicCopy.append(track, title);
      topicBox.append(orbit, topicCopy);
      sectionEl.appendChild(topicBox);

      const leafRow = document.createElement("div");
      leafRow.className = "leaf-row";
      leafRow.id = `checkpoint-${section.id}`;
      leafRow.setAttribute("role", "group");
      leafRow.setAttribute("aria-label", `Tópicos de ${section.title}`);
      topicBox.setAttribute("aria-controls", leafRow.id);

      const checkpointHead = document.createElement("div");
      checkpointHead.className = "checkpoint-head";

      const checkpointTitle = document.createElement("span");
      checkpointTitle.textContent = "Checkpoint";

      const checkpointCount = document.createElement("span");
      checkpointCount.textContent = `${section.items.length} tópicos`;

      checkpointHead.append(checkpointTitle, checkpointCount);
      leafRow.appendChild(checkpointHead);

      const checkpointSummary = document.createElement("p");
      checkpointSummary.className = "checkpoint-summary focus-detail";
      checkpointSummary.textContent = section.desc;
      checkpointSummary.hidden = true;
      leafRow.appendChild(checkpointSummary);

      section.items.forEach((item) => {
        totalItems++;
        leafRow.appendChild(makeLeaf(item));
      });

      sectionEl.appendChild(leafRow);
      topicBox.addEventListener("click", () => {
        if (document.body.classList.contains("presentation-mode")) {
          toggleSectionFocus(sectionEl, topicBox);
          return;
        }
        openStageSpotlight(section, topicBox, step);
      });
      phaseSteps.appendChild(sectionEl);
    });

    phaseEl.append(phaseIntro, phaseSteps);
    treeEl.appendChild(phaseEl);
  });
}

function buildSpotlight(section, step){
  spotlightStage.replaceChildren();

  const closeButton = document.createElement("button");
  closeButton.className = "spotlight-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Fechar etapa em foco");
  closeButton.textContent = "✕";
  closeButton.addEventListener("click", () => closeStageSpotlight(true));

  const topicCard = document.createElement("button");
  topicCard.type = "button";
  topicCard.setAttribute("aria-label", `Abrir detalhes de ${section.title}`);
  topicCard.addEventListener("click", () => openPanel(section, null));
  topicCard.className = "spotlight-topic-card";

  const orbit = document.createElement("span");
  orbit.className = "topic-orbit";
  orbit.textContent = step;

  const copy = document.createElement("span");
  copy.className = "topic-copy";

  const track = document.createElement("span");
  track.className = "topic-track";
  track.textContent = section.track;

  const title = document.createElement("span");
  title.className = "topic-title";
  title.textContent = section.title;

  copy.append(track, title);
  topicCard.append(orbit, copy);

  const connector = document.createElement("span");
  connector.className = "spotlight-connector";
  connector.setAttribute("aria-hidden", "true");

  const checkpoint = document.createElement("div");
  checkpoint.className = "leaf-row spotlight-checkpoint";
  checkpoint.setAttribute("role", "group");
  checkpoint.setAttribute("aria-label", `Tópicos de ${section.title}`);

  const checkpointHead = document.createElement("div");
  checkpointHead.className = "checkpoint-head";

  const checkpointTitle = document.createElement("span");
  checkpointTitle.textContent = "Checkpoint";

  const checkpointCount = document.createElement("span");
  checkpointCount.textContent = `${section.items.length} tópicos`;

  checkpointHead.append(checkpointTitle, checkpointCount);
  checkpoint.appendChild(checkpointHead);
  section.items.forEach((item) => checkpoint.appendChild(makeLeaf(item)));

  const hint = document.createElement("p");
  hint.className = "spotlight-hint";
  hint.textContent = "← Anterior · → Próximo · Esc para sair. Selecione um subtópico para ver os detalhes.";

  spotlightStage.append(closeButton, topicCard, connector, checkpoint, hint);
}

function openStageSpotlight(section, sourceButton, step){
  const showDetails = window.matchMedia("(min-width: 721px)").matches
    || (!stageSpotlight.hidden && panel.classList.contains("open"));
  spotlightSourceButton = sourceButton;
  buildSpotlight(section, step);
  stageSpotlight.hidden = false;
  stageSpotlight.setAttribute("aria-hidden", "false");
  document.body.classList.add("spotlight-open");
  overlay.classList.add("open");
  wrapEl.classList.add("dimmed");
  document.body.style.overflow = "hidden";
  stageSpotlight.scrollTop = 0;

  if (showDetails) {
    openPanel(section, null);
  } else {
    spotlightStage.querySelector(".spotlight-close")?.focus();
  }
}

function navigateFocusedTopic(direction){
  if (stageSpotlight.hidden) return;
  const buttons = Array.from(treeEl.querySelectorAll(".topic-box"));
  const index = buttons.indexOf(spotlightSourceButton);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= buttons.length) return;
  const source = buttons[next];
  const section = DATA.find((entry) => entry.id === source.dataset.sectionId);
  if (section) openStageSpotlight(section, source, source.dataset.step);
}

function closeStageSpotlight(restoreFocus = false){
  if (stageSpotlight.hidden) return;

  const returnFocus = spotlightSourceButton;
  if (panel.classList.contains("open")) hidePanel();
  stageSpotlight.hidden = true;
  stageSpotlight.setAttribute("aria-hidden", "true");
  spotlightStage.replaceChildren();
  document.body.classList.remove("spotlight-open");
  overlay.classList.remove("open");
  wrapEl.classList.remove("dimmed");
  document.body.style.overflow = "";
  spotlightSourceButton = null;
  currentLeafEl = null;
  currentId = null;
  currentSection = null;

  if (restoreFocus) returnFocus?.focus();
}

function clearSectionFocus(restoreFocus = false){
  if (!focusedSectionEl) return;

  const previousButton = focusedSectionEl.querySelector(".topic-box");
  focusedSectionEl.classList.remove("is-focused");
  focusedSectionEl.querySelectorAll(".focus-detail").forEach((detail) => {
    detail.hidden = true;
  });
  previousButton?.setAttribute("aria-expanded", "false");
  if (previousButton) previousButton.title = "Clique para destacar esta etapa e ver mais detalhes";
  treeEl.classList.remove("has-focused-section");
  focusedSectionEl = null;
  requestAnimationFrame(drawConnections);

  if (restoreFocus) previousButton?.focus();
}

function toggleSectionFocus(sectionEl, topicBox){
  if (focusedSectionEl === sectionEl) {
    if (document.body.classList.contains("presentation-mode")) return;
    clearSectionFocus(true);
    return;
  }

  clearSectionFocus();
  focusedSectionEl = sectionEl;
  treeEl.classList.add("has-focused-section");
  sectionEl.classList.add("is-focused");
  sectionEl.querySelectorAll(".focus-detail").forEach((detail) => {
    detail.hidden = false;
  });
  topicBox.setAttribute("aria-expanded", "true");
  topicBox.title = "Clique novamente para sair do foco";

  requestAnimationFrame(() => {
    drawConnections();
    const sectionRect = sectionEl.getBoundingClientRect();
    const needsScroll = !document.body.classList.contains("presentation-mode")
      && (sectionRect.top < 80 || sectionRect.bottom > window.innerHeight - 48);
    if (needsScroll) {
      sectionEl.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
        inline: "center"
      });
    }
  });
}

function getPresentationSections(){
  return Array.from(treeEl.querySelectorAll(".section"));
}

function showPresentationStep(nextIndex){
  const sections = getPresentationSections();
  if (!sections.length) return;

  presentationIndex = Math.max(0, Math.min(nextIndex, sections.length - 1));
  const currentSection = sections[presentationIndex];
  const currentPhase = currentSection.closest(".roadmap-phase");

  if (panel.classList.contains("open")) closePanel();

  treeEl.querySelectorAll(".roadmap-phase").forEach((phase) => {
    phase.classList.toggle("presentation-active", phase === currentPhase);
  });
  sections.forEach((section) => {
    section.classList.toggle("presentation-current", section === currentSection);
  });

  if (focusedSectionEl !== currentSection) {
    toggleSectionFocus(currentSection, currentSection.querySelector(".topic-box"));
  }

  presentationStep.textContent = `Etapa ${String(presentationIndex + 1).padStart(2, "0")} de ${sections.length}`;
  presentationTitle.textContent = currentSection.dataset.title;
  presentationPrevBtn.disabled = presentationIndex === 0;
  presentationNextBtn.disabled = presentationIndex === sections.length - 1;
  mapShellEl.scrollTo({ top: 0, behavior: "auto" });
}

function startPresentation(){
  const sections = getPresentationSections();
  const focusedIndex = focusedSectionEl ? sections.indexOf(focusedSectionEl) : -1;
  document.body.classList.add("presentation-mode");
  presentationToolbar.hidden = false;
  showPresentationStep(focusedIndex >= 0 ? focusedIndex : 0);
}

function exitPresentation(){
  if (!document.body.classList.contains("presentation-mode")) return;

  const currentSection = getPresentationSections()[presentationIndex];
  document.body.classList.remove("presentation-mode");
  presentationToolbar.hidden = true;
  treeEl.querySelectorAll(".roadmap-phase").forEach((phase) => phase.classList.remove("presentation-active"));
  treeEl.querySelectorAll(".section").forEach((section) => section.classList.remove("presentation-current"));
  presentationIndex = -1;
  clearSectionFocus();

  requestAnimationFrame(() => {
    drawConnections();
    currentSection?.scrollIntoView({ block: "center", behavior: "auto" });
    currentSection?.querySelector(".topic-box")?.focus();
  });
}

function drawConnections(){
  treeEl.querySelector(".route-svg")?.remove();
  if (window.innerWidth <= 980) return;

  const topicBoxes = Array.from(treeEl.querySelectorAll(".topic-box"));
  if (topicBoxes.length < 2) return;

  const treeRect = treeEl.getBoundingClientRect();
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.classList.add("route-svg");
  svg.setAttribute("viewBox", `0 0 ${treeRect.width} ${treeRect.height}`);
  svg.setAttribute("aria-hidden", "true");

  const center = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left - treeRect.left + rect.width / 2,
      y: rect.top - treeRect.top + rect.height / 2
    };
  };

  topicBoxes.forEach((box, index) => {
    if (index === topicBoxes.length - 1) return;

    const current = center(box);
    const next = center(topicBoxes[index + 1]);
    const sameRow = Math.abs(current.y - next.y) < 24;
    const path = document.createElementNS(svgNS, "path");

    if (sameRow) {
      path.setAttribute("d", `M ${current.x} ${current.y} H ${next.x}`);
    } else {
      const outerX = current.x > treeRect.width / 2 ? treeRect.width - 8 : 8;
      path.setAttribute("d", `M ${current.x} ${current.y} H ${outerX} V ${next.y} H ${next.x}`);
    }

    path.setAttribute("class", "route-connection");
    svg.appendChild(path);
  });

  treeEl.prepend(svg);
}

function updateProgress(){
  const completed = treeEl.querySelectorAll(".leaf.done").length;
  const percentage = totalItems ? Math.round((completed / totalItems) * 100) : 0;
  progressBar.style.width = percentage + "%";
  progressPercent.textContent = percentage + "%";
  progressLabel.textContent = `${completed} de ${totalItems} tópicos concluídos`;
  updateSectionCompletion();
  updateLabAccess();
}

function isLabUnlocked(){
  const items = DATA.flatMap((section) => section.items);
  return items.length > 0 && items.every((item) => doneSet.has(item.id));
}

function updateLabAccess(){
  const items = DATA.flatMap((section) => section.items);
  const completed = items.filter((item) => doneSet.has(item.id)).length;
  const remaining = items.length - completed;
  const unlocked = isLabUnlocked();
  const focusWasInLab = labEl.contains(document.activeElement);
  const wasPresenting = document.body.classList.contains("lab-presentation-mode");
  if (!unlocked && labWasUnlocked) {
    if (wasPresenting) exitLabPresentation();
    resetLab(); // Also cancels pending animation steps before hiding the simulator.
  }
  labEl.hidden = !unlocked;
  labEl.inert = !unlocked;
  labLock.hidden = unlocked;
  labAccessLink.href = unlocked ? "#kubernetes-lab" : "#labLock";
  labAccessLink.textContent = unlocked ? "Abrir laboratório" : "Laboratório bloqueado";
  labLockStatus.textContent = `${completed} de ${items.length} subtópicos concluídos. `
    + (remaining === 1 ? "Falta 1 subtópico para liberar." : `Faltam ${remaining} subtópicos para liberar.`);
  if (!unlocked && (focusWasInLab || wasPresenting)) labLockLink.focus({ preventScroll: true });
  labWasUnlocked = unlocked;
}

function updateSectionCompletion(){
  completeTopic.hidden = !currentSection;
  if (!currentSection) return;
  const total = currentSection.items.length;
  const completed = currentSection.items.filter((item) => doneSet.has(item.id)).length;
  const allDone = completed === total;
  completeTopicBtn.textContent = allDone ? "Tópico concluído ✓" : "Concluir tópico";
  completeTopicBtn.setAttribute("aria-disabled", String(allDone));
  completeTopicStatus.textContent = allDone
    ? `Todos os ${total} subtópicos estão concluídos.`
    : `${completed} de ${total} subtópicos concluídos. Este botão conclui todos os subtópicos desta etapa.`;
}

function completeCurrentSection(){
  if (!currentSection || completeTopicBtn.getAttribute("aria-disabled") === "true") return;
  const ids = new Set(currentSection.items.map((item) => item.id));
  ids.forEach((id) => doneSet.add(id));
  // Update both the original roadmap and the spotlight copies.
  document.querySelectorAll(".leaf").forEach((leaf) => {
    if (ids.has(leaf.dataset.id)) leaf.classList.add("done");
  });
  updateProgress();
  saveProgress();
}

function saveProgress(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(doneSet)));
  } catch (_error) {
    // O roadmap continua funcional quando o armazenamento não está disponível.
  }
}

function loadProgress(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const validIds = new Set(Array.from(treeEl.querySelectorAll(".leaf")).map((el) => el.dataset.id));
    doneSet = new Set((Array.isArray(saved) ? saved : []).filter((id) => validIds.has(id)));
  } catch (_error) {
    doneSet = new Set();
  }
  document.querySelectorAll(".leaf").forEach((el) => {
    el.classList.toggle("done", doneSet.has(el.dataset.id));
  });
  if (currentId) markDoneCheck.checked = doneSet.has(currentId);
  updateProgress();
}

function toggleDone(id, el){
  if (doneSet.has(id)) doneSet.delete(id);
  else doneSet.add(id);
  document.querySelectorAll(".leaf").forEach((leaf) => {
    if (leaf.dataset.id === id) leaf.classList.toggle("done", doneSet.has(id));
  });
  updateProgress();
  saveProgress();
}

function renderLinks(links){
  panelLinks.replaceChildren();
  if (!links.length) {
    const empty = document.createElement("li");
    empty.className = "resource-empty";
    empty.textContent = "Este tópico usa a explicação consolidada na pesquisa do grupo.";
    panelLinks.appendChild(empty);
    return;
  }

  links.forEach((link) => {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    const icon = document.createElement("span");
    const label = document.createElement("span");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    icon.className = "resource-icon";
    icon.textContent = "↗";
    icon.setAttribute("aria-hidden", "true");
    label.textContent = link.label;
    anchor.append(icon, label);
    item.appendChild(anchor);
    panelLinks.appendChild(item);
  });
}

function renderPanelDetails(item){
  const details = PANEL_DETAILS[item.id] || {};
  const points = details.points || [];

  panelPoints.replaceChildren();
  points.forEach((point) => {
    const listItem = document.createElement("li");
    listItem.textContent = point;
    panelPoints.appendChild(listItem);
  });
  panelLearning.hidden = points.length === 0;

  presenterNote.hidden = !details.note;
  presenterNoteText.textContent = details.note || "";

  panelCodeSection.hidden = !details.code;
  panelCodeLanguage.textContent = details.code?.language || "Exemplo";
  panelCodeTitle.textContent = details.code?.title || "Código de apoio";
  panelCode.textContent = details.code?.content || "";
  copyCodeBtn.textContent = "Copiar";
}

async function copyPanelCode(){
  const content = panelCode.textContent;
  if (!content) return;

  try {
    await navigator.clipboard.writeText(content);
  } catch (_error) {
    const textArea = document.createElement("textarea");
    textArea.value = content;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  copyCodeBtn.textContent = "Copiado";
  window.setTimeout(() => {
    copyCodeBtn.textContent = "Copiar";
  }, 1600);
}

function updateLabLineNumbers(){
  const lineCount = Math.max(1, labYamlEditor.value.split("\n").length);
  labLineNumbers.textContent = Array.from({ length: lineCount }, (_value, index) => index + 1).join("\n");
}

function setLabFile(fileKey, { focus = false } = {}){
  if (!LAB_FILES[fileKey]) return;
  labFileKey = fileKey;
  labFileName.textContent = LAB_FILES[fileKey].name;
  labFileDescription.textContent = LAB_FILE_DESCRIPTIONS[fileKey];
  labYamlEditor.value = LAB_FILES[fileKey].content;
  labEditorStatus.textContent = "Pronto para editar";
  labEditorStatus.dataset.tone = "idle";
  labFileTabs.forEach((tab) => {
    const selected = tab.dataset.labFile === fileKey;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  updateLabLineNumbers();
  labYamlEditor.scrollTop = 0;
  labLineNumbers.scrollTop = 0;
  if (focus) labYamlEditor.focus();
}

function setLabState(nextState){
  const stateInfo = LAB_STATES[nextState];
  if (!stateInfo) return;

  labState = nextState;
  labEl.dataset.labState = nextState;
  labStateDot.dataset.tone = stateInfo.tone;
  labStateLabel.textContent = stateInfo.label;
  labContextTitle.textContent = stateInfo.title;
  labContextText.textContent = stateInfo.text;
  labContextPoints.replaceChildren();
  stateInfo.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    labContextPoints.appendChild(item);
  });

  const completed = LAB_STEP_PROGRESS[nextState];
  const busy = !stateInfo.actions.length && completed < 5;
  labStepLabel.textContent = completed === 5 ? "5 etapas concluídas" : "Etapa " + (completed + 1) + " de 5";
  labStepHint.textContent = busy ? "Acompanhe os Pods. A próxima ação será liberada ao terminar."
    : completed === 5 ? "Ciclo completo: criar, atualizar, observar a falha e recuperar."
    : "Próxima ação: " + LAB_STEP_LABELS[completed] + ".";
  labActionButtons.forEach((button, index) => {
    button.disabled = !stateInfo.actions.includes(button.dataset.labAction);
    button.classList.toggle("is-current", index === completed);
    button.classList.toggle("is-complete", index < completed);
    button.classList.toggle("is-running", index === completed && busy);
    button.querySelector("span").textContent = index < completed ? "✓" : String(index + 1).padStart(2, "0");
    if (index === completed) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
    button.setAttribute("aria-label", LAB_STEP_LABELS[index]
      + (index < completed ? " — concluída" : index === completed && busy ? " — em andamento" : index > completed ? " — aguarde as etapas anteriores" : ""));
  });
  renderLabCluster();
}

function labDelay(milliseconds, token){
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const speedFactor = Number(labSpeed.value) || 1;
  const duration = prefersReducedMotion ? Math.min(80, milliseconds * speedFactor) : milliseconds * speedFactor;

  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (token !== labRunToken) {
        reject(new Error("LAB_CANCELLED"));
        return;
      }
      resolve();
    }, duration);
  });
}

function appendLabTerminal(message, tone = "output"){
  const line = document.createElement("div");
  line.className = "terminal-line terminal-" + tone;

  const timestamp = document.createElement("time");
  timestamp.textContent = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date());

  const content = document.createElement("code");
  content.textContent = tone === "command" ? "$ " + message : message;

  line.append(timestamp, content);
  labTerminal.appendChild(line);
  labTerminal.scrollTop = labTerminal.scrollHeight;
}

function podStatusClass(status){
  return status.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
}

function renderLabPods(){
  labPodsEl.querySelectorAll(".pod-placeholder").forEach((node) => node.remove());
  labPodsEl.querySelectorAll(".pod-unit").forEach((node) => {
    if (!labPods.some((pod) => pod.id === node.dataset.podId)) node.remove();
  });

  labPods.forEach((pod) => {
    const existing = Array.from(labPodsEl.children).find((node) => node.dataset.podId === pod.id);
    if (existing) {
      existing.className = "pod-unit status-" + podStatusClass(pod.status);
      existing.querySelector(".pod-readiness").textContent = pod.ready ? "Ready 1/1" : "Ready 0/1";
      existing.querySelector(".pod-status").textContent = pod.status;
      return;
    }
    const podEl = document.createElement("article");
    podEl.className = "pod-unit status-" + podStatusClass(pod.status);
    podEl.dataset.podId = pod.id;
    podEl.dataset.version = pod.version;

    const top = document.createElement("div");
    top.className = "pod-topline";

    const version = document.createElement("span");
    version.textContent = pod.version === "broken" ? "imagem inválida" : pod.version;

    const readiness = document.createElement("span");
    readiness.className = "pod-readiness";
    readiness.textContent = pod.ready ? "Ready 1/1" : "Ready 0/1";
    top.append(version, readiness);

    const identity = document.createElement("div");
    identity.className = "pod-identity";
    const glyph = document.createElement("span");
    glyph.className = "pod-glyph";
    glyph.setAttribute("aria-hidden", "true");
    glyph.textContent = "⬡";
    const name = document.createElement("strong");
    name.textContent = pod.name;
    identity.append(glyph, name);

    const status = document.createElement("small");
    status.className = "pod-status";
    status.textContent = pod.status;

    podEl.append(top, identity, status);
    labPodsEl.appendChild(podEl);
  });
  for (let slot = labPods.length; slot < 4; slot++) {
    const placeholder = document.createElement("div");
    placeholder.className = "pod-placeholder" + (slot === 3 ? " is-surge" : "");
    const icon = document.createElement("span");
    icon.textContent = slot === 3 ? "+" : "⬡";
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("strong");
    label.textContent = slot === 3 ? "Espaço para surge" : "Aguardando criação";
    const detail = document.createElement("small");
    detail.textContent = slot === 3 ? "maxSurge: 1" : "Réplica " + (slot + 1) + " de 3";
    placeholder.append(icon, label, detail);
    labPodsEl.appendChild(placeholder);
  }
}

function setReplicaSetNode(node, nameEl, countEl, name, count){
  nameEl.textContent = name;
  countEl.textContent = count + (count === 1 ? " réplica" : " réplicas");
  node.classList.toggle("is-active", name !== "—");
}

function renderLabCluster(){
  renderLabPods();
  const readyCount = labPods.filter((pod) => pod.ready && pod.status !== "Terminating").length;
  const v1Count = labPods.filter((pod) => pod.version === "v1").length;
  const v2Count = labPods.filter((pod) => pod.version === "v2").length;
  const brokenCount = labPods.filter((pod) => pod.version === "broken").length;
  const desiredReady = Math.min(readyCount, 3);
  labReadyCount.textContent = readyCount;
  labPodCount.textContent = labPods.length;
  const trackingV2 = ["rolling-update", "v2-ready", "introducing-failure", "rollout-failed", "rolling-back", "rollback-complete"].includes(labState);
  const progressCount = trackingV2 ? labPods.filter((pod) => pod.version === "v2" && pod.ready).length : desiredReady;
  labRolloutLabel.textContent = trackingV2 ? "Réplicas v2 prontas" : "Réplicas v1 prontas";
  labRolloutProgress.value = progressCount;
  labRolloutProgress.textContent = progressCount + " de 3";
  labRolloutCount.textContent = progressCount + " de 3";
  labClusterHint.textContent = !labPods.length ? "Valide o YAML e aplique a v1 para criar os primeiros Pods."
    : brokenCount ? "O Pod com erro não recebe tráfego. As 3 réplicas v2 seguem Ready."
    : labPods.some((pod) => pod.status === "Terminating") ? "Substituto Ready: agora o Pod antigo pode ser encerrado."
    : labPods.length > 3 ? "Pod extra em uso. O antigo só sai depois que o novo fica pronto."
    : readyCount < 3 ? "Inicializando réplicas. O Service só encaminha tráfego após readiness."
    : "3 réplicas prontas. O espaço extra fica livre para a próxima troca.";

  labAvailability.textContent = desiredReady + "/3 disponíveis" + (readyCount > 3 ? " · +1 surge" : "");
  labAvailability.dataset.tone = readyCount >= 3 ? "success" : readyCount > 0 ? "warning" : "idle";
  labServiceStatus.textContent = readyCount
    ? readyCount + (readyCount === 1 ? " endpoint Ready" : " endpoints Ready")
    : "Nenhum endpoint Ready";

  if (["idle", "validating", "validated"].includes(labState)) {
    labDeploymentRevision.textContent = "sem revisão";
    setReplicaSetNode(labRsOld, labRsOldName, labRsOldCount, "—", 0);
    setReplicaSetNode(labRsNew, labRsNewName, labRsNewCount, "—", 0);
  } else if (labState === "deploying-v1") {
    labDeploymentRevision.textContent = "revisão 1 · criando";
    setReplicaSetNode(labRsOld, labRsOldName, labRsOldCount, "—", 0);
    setReplicaSetNode(labRsNew, labRsNewName, labRsNewCount, "astro-demo-v1", v1Count);
  } else if (labState === "v1-ready") {
    labDeploymentRevision.textContent = "revisão 1 · estável";
    setReplicaSetNode(labRsOld, labRsOldName, labRsOldCount, "astro-demo-v1", v1Count);
    setReplicaSetNode(labRsNew, labRsNewName, labRsNewCount, "—", 0);
  } else if (labState === "rolling-update") {
    labDeploymentRevision.textContent = "revisão 2 · progredindo";
    setReplicaSetNode(labRsOld, labRsOldName, labRsOldCount, "astro-demo-v1", v1Count);
    setReplicaSetNode(labRsNew, labRsNewName, labRsNewCount, "astro-demo-v2", v2Count);
  } else if (labState === "v2-ready") {
    labDeploymentRevision.textContent = "revisão 2 · estável";
    setReplicaSetNode(labRsOld, labRsOldName, labRsOldCount, "astro-demo-v2", v2Count);
    setReplicaSetNode(labRsNew, labRsNewName, labRsNewCount, "—", 0);
  } else if (["introducing-failure", "rollout-failed", "rolling-back"].includes(labState)) {
    labDeploymentRevision.textContent = labState === "rolling-back" ? "retornando à revisão 2" : "revisão 3 · bloqueada";
    setReplicaSetNode(labRsOld, labRsOldName, labRsOldCount, "astro-demo-v2", v2Count);
    setReplicaSetNode(labRsNew, labRsNewName, labRsNewCount, "astro-demo-broken", brokenCount);
  } else {
    labDeploymentRevision.textContent = "revisão 4 · estável";
    setReplicaSetNode(labRsOld, labRsOldName, labRsOldCount, "astro-demo-v2", v2Count);
    setReplicaSetNode(labRsNew, labRsNewName, labRsNewCount, "—", 0);
  }
}

function createLabPod(version, index){
  const suffix = version === "broken" ? "x91z" : version === "v2" ? "b2" + index : "a1" + index;
  return {
    id: version + "-" + index,
    name: "astro-demo-" + suffix,
    version,
    status: "Pending",
    ready: false
  };
}

function updateLabPod(podId, status, ready = false){
  const pod = labPods.find((entry) => entry.id === podId);
  if (!pod) return;
  pod.status = status;
  pod.ready = ready;
  renderLabCluster();
}

async function movePodToReady(pod, token){
  await labDelay(320, token);
  updateLabPod(pod.id, "ContainerCreating");
  await labDelay(430, token);
  updateLabPod(pod.id, "Running");
  await labDelay(330, token);
  updateLabPod(pod.id, "Ready", true);
}

function validateDeploymentContent(content){
  const requiredFragments = [
    "apiVersion: apps/v1",
    "kind: Deployment",
    "name: astro-demo",
    "replicas: 3",
    "maxSurge:",
    "maxUnavailable:",
    "containers:",
    "image:"
  ];
  const missing = requiredFragments.filter((fragment) => !content.includes(fragment));
  const hasTabs = content.split("\n").some((line) => line.startsWith("\t"));
  return { valid: missing.length === 0 && !hasTabs, missing, hasTabs };
}

async function validateLab(){
  if (!isLabUnlocked() || labState !== "idle") return;
  const token = ++labRunToken;
  setLabFile("deployment-v1");
  setLabState("validating");
  appendLabTerminal("kubectl apply --dry-run=client -f deployment-v1.yaml", "command");
  await labDelay(620, token);

  const result = validateDeploymentContent(LAB_FILES["deployment-v1"].content);
  if (!result.valid) {
    appendLabTerminal("erro: o manifesto não contém todos os campos necessários", "error");
    if (result.missing.length) appendLabTerminal("campos ausentes: " + result.missing.join(", "), "error");
    if (result.hasTabs) appendLabTerminal("use espaços em vez de tabulações no YAML", "error");
    labEditorStatus.textContent = "Revise o manifesto";
    labEditorStatus.dataset.tone = "error";
    setLabState("idle");
    return;
  }

  appendLabTerminal("deployment.apps/astro-demo created (dry run)", "success");
  appendLabTerminal("manifesto válido — nenhum recurso foi criado", "output");
  labEditorStatus.textContent = "Estrutura validada";
  labEditorStatus.dataset.tone = "success";
  setLabState("validated");
}

async function applyLabV1(){
  if (!isLabUnlocked() || labState !== "validated") return;
  const token = ++labRunToken;
  setLabFile("deployment-v1");
  setLabState("deploying-v1");
  appendLabTerminal("kubectl apply -f kubernetes/deployment-v1.yaml", "command");
  await labDelay(420, token);
  appendLabTerminal("deployment.apps/astro-demo created", "success");
  appendLabTerminal("kubectl apply -f kubernetes/service.yaml", "command");
  await labDelay(300, token);
  appendLabTerminal("service/astro-demo created", "success");

  for (let index = 1; index <= 3; index++) {
    const pod = createLabPod("v1", index);
    labPods.push(pod);
    renderLabCluster();
    appendLabTerminal("pod/" + pod.name + " scheduled", "output");
    await movePodToReady(pod, token);
    appendLabTerminal(index + " of 3 replicas are available", "success");
  }

  appendLabTerminal("deployment \"astro-demo\" successfully rolled out", "success");
  setLabState("v1-ready");
}

async function updateLabToV2(){
  if (!isLabUnlocked() || labState !== "v1-ready") return;
  const token = ++labRunToken;
  setLabFile("deployment-v2");
  setLabState("rolling-update");
  appendLabTerminal("kubectl apply -f kubernetes/deployment-v2.yaml", "command");
  await labDelay(380, token);
  appendLabTerminal("deployment.apps/astro-demo configured", "success");
  appendLabTerminal("kubectl rollout status deployment/astro-demo --timeout=5m", "command");

  for (let index = 1; index <= 3; index++) {
    const newPod = createLabPod("v2", index);
    labPods.push(newPod);
    renderLabCluster();
    appendLabTerminal("Waiting for Pod " + newPod.name + " to become Ready...", "warning");
    await movePodToReady(newPod, token);
    appendLabTerminal(index + " of 3 updated replicas are available", "success");

    const oldPod = labPods.find((pod) => pod.version === "v1");
    if (oldPod) {
      updateLabPod(oldPod.id, "Terminating", false);
      await labDelay(360, token);
      labPods = labPods.filter((pod) => pod.id !== oldPod.id);
      renderLabCluster();
      appendLabTerminal("pod/" + oldPod.name + " terminated after replacement became Ready", "output");
    }
  }

  appendLabTerminal("deployment \"astro-demo\" successfully rolled out", "success");
  setLabState("v2-ready");
}

async function introduceLabFailure(){
  if (!isLabUnlocked() || labState !== "v2-ready") return;
  const token = ++labRunToken;
  setLabFile("broken-deployment");
  setLabState("introducing-failure");
  appendLabTerminal("kubectl apply -f kubernetes/broken-deployment.yaml", "command");
  await labDelay(380, token);
  appendLabTerminal("deployment.apps/astro-demo configured", "success");

  const brokenPod = createLabPod("broken", 1);
  labPods.push(brokenPod);
  renderLabCluster();
  await labDelay(360, token);
  updateLabPod(brokenPod.id, "ContainerCreating");
  await labDelay(460, token);
  updateLabPod(brokenPod.id, "ErrImagePull");
  appendLabTerminal("Failed to pull image \"nginx:versao-inexistente\"", "error");
  await labDelay(520, token);
  updateLabPod(brokenPod.id, "ImagePullBackOff");
  appendLabTerminal("kubectl get pods -l app=astro-demo", "command");
  appendLabTerminal(brokenPod.name + "   0/1   ImagePullBackOff", "error");
  appendLabTerminal("kubectl describe deployment astro-demo", "command");
  appendLabTerminal("Progressing=False · ProgressDeadlineExceeded", "warning");
  setLabState("rollout-failed");
}

async function rollbackLab(){
  if (!isLabUnlocked() || labState !== "rollout-failed") return;
  const token = ++labRunToken;
  setLabState("rolling-back");
  appendLabTerminal("kubectl rollout undo deployment/astro-demo", "command");
  await labDelay(420, token);
  appendLabTerminal("deployment.apps/astro-demo rolled back", "success");
  appendLabTerminal("kubectl rollout status deployment/astro-demo --timeout=5m", "command");

  const brokenPod = labPods.find((pod) => pod.version === "broken");
  if (brokenPod) {
    updateLabPod(brokenPod.id, "Terminating", false);
    await labDelay(540, token);
    labPods = labPods.filter((pod) => pod.id !== brokenPod.id);
    renderLabCluster();
  }

  appendLabTerminal("3 of 3 replicas are available", "success");
  appendLabTerminal("deployment \"astro-demo\" successfully rolled out", "success");
  setLabFile("deployment-v2");
  setLabState("rollback-complete");
}

function handleLabRunError(error){
  if (error?.message === "LAB_CANCELLED") return;
  appendLabTerminal("A simulação foi interrompida por um erro inesperado.", "error");
  setLabState("idle");
}

function resetLab(){
  labRunToken++;
  labPods = [];
  labTerminal.replaceChildren();
  setLabFile("deployment-v1");
  setLabState("idle");
  appendLabTerminal("Laboratório pronto. Valide o manifesto para começar.", "system");
}

async function copyTextForLab(text, button, idleLabel){
  try {
    await navigator.clipboard.writeText(text);
  } catch (_error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }
  button.textContent = "Copiado";
  window.setTimeout(() => {
    button.textContent = idleLabel;
  }, 1500);
}

function downloadCurrentLabFile(){
  const file = LAB_FILES[labFileKey];
  const blob = new Blob([file.content], { type: "application/yaml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  labEditorStatus.textContent = "Arquivo preparado para download";
  labEditorStatus.dataset.tone = "success";
}

function enterLabPresentation(){
  if (!isLabUnlocked()) return;
  if (document.body.classList.contains("lab-presentation-mode")) return;
  if (document.body.classList.contains("presentation-mode")) exitPresentation();
  if (panel.classList.contains("open")) closePanel();
  if (!stageSpotlight.hidden) closeStageSpotlight();

  labPresentationReturnFocus = document.activeElement;
  document.body.classList.add("lab-presentation-mode");
  labBackdrop.hidden = false;
  labPresentationExit.hidden = false;
  labEl.setAttribute("role", "dialog");
  labEl.setAttribute("aria-modal", "true");
  document.body.style.overflow = "hidden";
  labEl.scrollTop = 0;
  labPresentationExit.focus({ preventScroll: true });
}

function exitLabPresentation(){
  if (!document.body.classList.contains("lab-presentation-mode")) return;
  document.body.classList.remove("lab-presentation-mode");
  labBackdrop.hidden = true;
  labPresentationExit.hidden = true;
  labEl.removeAttribute("role");
  labEl.removeAttribute("aria-modal");
  document.body.style.overflow = "";
  labPresentationReturnFocus?.focus();
  labPresentationReturnFocus = null;
}

function trapLabPresentationFocus(event){
  if (event.key !== "Tab" || !document.body.classList.contains("lab-presentation-mode")) return;
  const focusable = Array.from(labEl.querySelectorAll("button:not([disabled]), select:not([disabled]), textarea, a[href]"))
    .filter((element) => element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openPanel(item, leafEl){
  lastFocusedElement = document.activeElement;
  currentLeafEl = leafEl;
  currentId = leafEl ? item.id : null;
  currentSection = !leafEl && Array.isArray(item.items) ? item : null;
  updateSectionCompletion();

  panelTitle.textContent = item.name || item.title;
  panelDesc.textContent = item.desc;
  renderPanelDetails(item);
  renderLinks(item.links || []);

  if (item.badge) {
    panelBadge.style.display = "inline-block";
    panelBadge.textContent = BADGE_LABEL[item.badge];
    panelBadge.style.background = "#ad45d2";
  } else {
    panelBadge.style.display = "none";
  }

  markDoneRow.style.display = leafEl ? "flex" : "none";
  markDoneCheck.checked = leafEl ? doneSet.has(item.id) : false;
  panel.querySelector(".panel-body").scrollTop = 0;
  overlay.classList.add("open");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  wrapEl.classList.add("dimmed");
  document.body.style.overflow = "hidden";
  document.getElementById("panelClose").focus();
}

function hidePanel(){
  currentSection = null;
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
}

function closePanel(){
  if (!panel.classList.contains("open")) return;

  if (!stageSpotlight.hidden) {
    closeStageSpotlight(true);
    return;
  }

  hidePanel();
  overlay.classList.remove("open");
  wrapEl.classList.remove("dimmed");
  document.body.style.overflow = "";
  currentLeafEl = null;
  currentId = null;
  lastFocusedElement?.focus();
}

renderRoadmap();
loadProgress();
resetLab();
requestAnimationFrame(drawConnections);

window.addEventListener("resize", drawConnections);
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY || event.key === null) loadProgress();
});
if ("ResizeObserver" in window) {
  new ResizeObserver(drawConnections).observe(treeEl);
}
if (document.fonts?.ready) {
  document.fonts.ready.then(drawConnections);
}

document.getElementById("resetBtn").addEventListener("click", () => {
  doneSet.clear();
  document.querySelectorAll(".leaf.done").forEach((el) => el.classList.remove("done"));
  saveProgress();
  updateProgress();
});

startPresentationBtn.addEventListener("click", startPresentation);
presentationExitBtn.addEventListener("click", exitPresentation);
presentationPrevBtn.addEventListener("click", () => showPresentationStep(presentationIndex - 1));
presentationNextBtn.addEventListener("click", () => showPresentationStep(presentationIndex + 1));
copyCodeBtn.addEventListener("click", copyPanelCode);

labActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.labAction;
    const actionMap = {
      validate: validateLab,
      apply: applyLabV1,
      update: updateLabToV2,
      fail: introduceLabFailure,
      rollback: rollbackLab
    };
    const handler = actionMap[action];
    if (handler) handler().catch(handleLabRunError);
  });
});

labFileTabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", () => setLabFile(tab.dataset.labFile));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (tabIndex + direction + labFileTabs.length) % labFileTabs.length;
    labFileTabs[nextIndex].click();
    labFileTabs[nextIndex].focus();
  });
});

labYamlEditor.addEventListener("input", () => {
  LAB_FILES[labFileKey].content = labYamlEditor.value;
  labEditorStatus.textContent = "Alterações locais não validadas";
  labEditorStatus.dataset.tone = "warning";
  updateLabLineNumbers();
});
labYamlEditor.addEventListener("scroll", () => {
  labLineNumbers.scrollTop = labYamlEditor.scrollTop;
});
labYamlEditor.addEventListener("keydown", (event) => {
  // Tab remains available for keyboard navigation; Alt+Enter inserts YAML indentation.
  if (event.key !== "Enter" || !event.altKey) return;
  event.preventDefault();
  const start = labYamlEditor.selectionStart;
  const end = labYamlEditor.selectionEnd;
  labYamlEditor.setRangeText("  ", start, end, "end");
  labYamlEditor.dispatchEvent(new Event("input"));
});

labCopyYaml.addEventListener("click", () => {
  copyTextForLab(LAB_FILES[labFileKey].content, labCopyYaml, "Copiar YAML");
});
labDownloadYaml.addEventListener("click", downloadCurrentLabFile);
labClearTerminal.addEventListener("click", () => labTerminal.replaceChildren());
labResetBtn.addEventListener("click", resetLab);
labPresentBtn.addEventListener("click", enterLabPresentation);
labPresentationExit.addEventListener("click", exitLabPresentation);
labBackdrop.addEventListener("click", exitLabPresentation);
labSpeed.addEventListener("change", () => {
  const selectedLabel = labSpeed.options[labSpeed.selectedIndex].textContent;
  appendLabTerminal("Velocidade da simulação ajustada para " + selectedLabel + ".", "system");
});

markDoneCheck.addEventListener("change", () => {
  if (currentId) toggleDone(currentId, currentLeafEl);
});
completeTopicBtn.addEventListener("click", completeCurrentSection);

document.getElementById("panelClose").addEventListener("click", closePanel);
overlay.addEventListener("click", () => {
  if (!stageSpotlight.hidden) closeStageSpotlight(true);
  else closePanel();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (document.body.classList.contains("lab-presentation-mode")) exitLabPresentation();
    else if (panel.classList.contains("open")) closePanel();
    else if (!stageSpotlight.hidden) closeStageSpotlight(true);
    else if (document.body.classList.contains("presentation-mode")) exitPresentation();
    else clearSectionFocus(true);
  }

  trapLabPresentationFocus(event);

  // Keep vertical arrows for reading/scrolling, and do not override form controls.
  if (!stageSpotlight.hidden && ["ArrowLeft", "ArrowRight"].includes(event.key)
    && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
    && !event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox']")) {
    event.preventDefault();
    navigateFocusedTopic(event.key === "ArrowRight" ? 1 : -1);
    return;
  }

  if (document.body.classList.contains("presentation-mode") && !panel.classList.contains("open")) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      showPresentationStep(presentationIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      showPresentationStep(presentationIndex - 1);
    }
  }

  if (event.key !== "Tab" || !panel.classList.contains("open")) return;

  const focusable = Array.from(panel.querySelectorAll("button, a[href], input:not([disabled])"))
    .filter((el) => el.offsetParent !== null);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
