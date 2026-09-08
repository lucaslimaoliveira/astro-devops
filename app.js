const BADGE_LABEL = {
  purple: "Essencial",
  gray: "Aprofundamento"
};

const DATA = [
  {
    id: "fundamentos",
    title: "Entenda o problema",
    track: "Fundamentos",
    desc: "Imagine o astro-demo atendendo usuários com 3 réplicas da v1. Precisamos publicar a v2 sem interromper esse atendimento. Vamos partir do problema da indisponibilidade, entender a troca gradual e descobrir quais componentes do Kubernetes tornam isso possível.",
    links: [
      { label: "Kubernetes — atualização sem downtime", url: "https://kubernetes.io/docs/tasks/run-application/update-deployment-rolling/" }
    ],
    items: [
      { id: "downtime", name: "Downtime planejado e não planejado", badge: "purple", desc: "Antes de atualizar a aplicação, precisamos definir o que queremos evitar: downtime é o intervalo em que o usuário não consegue usar o serviço corretamente. Uma manutenção pode ser planejada; uma falha pode ser inesperada. Em ambos os casos, o que importa é o impacto nas requisições, não apenas se há contêineres em execução.", links: [] },
      { id: "troca-abrupta", name: "Risco da troca abrupta", badge: "purple", desc: "No cenário anterior, imagine desligar as 3 réplicas da v1 de uma vez. Enquanto a v2 baixa a imagem, inicia e fica pronta, não há instâncias disponíveis para atender. Esse intervalo explica por que a ordem da substituição importa: preparar a nova capacidade antes de retirar a antiga reduz o risco.", links: [] },
      { id: "conceito-rolling", name: "O que o Rolling Update resolve", badge: "purple", desc: "Para evitar a troca abrupta, o Rolling Update substitui os Pods em etapas. No nosso exemplo, uma nova réplica é preparada enquanto as antigas continuam atendendo. A substituição avança conforme a disponibilidade e os limites configurados; mais adiante veremos como maxSurge, maxUnavailable e readiness trabalham juntos.", links: [{ label: "Kubernetes — Deployments", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" }] },
      { id: "limites-rolling", name: "O que ele não garante sozinho", badge: "gray", desc: "A troca gradual resolve a coordenação da substituição, não todos os problemas da aplicação. Uma v2 com bug pode ficar Ready e ainda falhar para o usuário. Por isso, além da estratégia, precisamos entender quem cria os Pods, como o tráfego chega até eles e quais verificações tornam a atualização confiável.", links: [] }
    ]
  },
  {
    id: "arquitetura",
    title: "Mapeie a arquitetura",
    track: "Kubernetes",
    desc: "Agora que sabemos por que preservar o atendimento, vamos acompanhar quem faz cada parte da troca: o Deployment declara a versão desejada, os ReplicaSets mantêm os Pods e o Service oferece um endereço estável para alcançá-los. Essa estrutura será a mesma do laboratório.",
    links: [
      { label: "Kubernetes — Deployments", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" },
      { label: "Kubernetes — Services", url: "https://kubernetes.io/docs/concepts/services-networking/service/" }
    ],
    items: [
      { id: "deployment", name: "Deployment: estado desejado", badge: "purple", desc: "O ponto de partida é o Deployment astro-demo: nele declaramos 3 réplicas e o modelo dos Pods em spec.template. O controlador procura fazer o cluster chegar a esse estado. Alterar a imagem no template inicia um rollout; mudar apenas replicas ajusta a escala, sem criar uma revisão do template.", links: [{ label: "Deployment na documentação", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" }] },
      { id: "replicaset", name: "ReplicaSet: versões coexistindo", badge: "purple", desc: "O Deployment não substitui todos os Pods diretamente: ele coordena ReplicaSets, cada um associado a um template. Na passagem de v1 para v2, o novo ReplicaSet cresce e o antigo diminui. Essa coexistência materializa a troca gradual apresentada antes.", links: [] },
      { id: "pods-ready", name: "Pods e condição Ready", badge: "purple", desc: "Os Pods mantidos pelos ReplicaSets executam o contêiner web. Mas existir não basta: eles precisam estar prontos para atender. O Service astro-demo seleciona os Pods pelo label app: astro-demo, comum às duas versões, e normalmente encaminha tráfego aos endpoints Ready. Agora falta definir qual imagem esses Pods executarão.", links: [{ label: "Kubernetes — ciclo de vida do Pod", url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/" }] },
    ]
  },
  {
    id: "artefato",
    title: "Produza o artefato",
    track: "Docker",
    desc: "Conhecida a arquitetura, precisamos identificar exatamente o que será entregue. Em uma aplicação própria, o código vira uma imagem construída, testada e publicada em um registry. Neste projeto usamos imagens prontas do NGINX: nginx:1.25-alpine representa a v1 e nginx:1.27-alpine representa a v2.",
    links: [
      { label: "Docker — boas práticas de build", url: "https://docs.docker.com/build/building-best-practices/" },
      { label: "Kubernetes — imagens", url: "https://kubernetes.io/docs/concepts/containers/images/" }
    ],
    items: [
      { id: "tag-digest", name: "Tag única e digest", badge: "purple", desc: "Para relacionar uma mudança de código ao que o Pod executa, a imagem precisa ser rastreável. Uma tag é um nome legível; um digest identifica o conteúdo. No laboratório, as tags do NGINX facilitam a comparação visual, mas não substituem o uso de digest quando é necessário fixar o artefato exato.", links: [{ label: "Docker — tags imutáveis", url: "https://docs.docker.com/docker-hub/repos/manage/hub-images/immutable-tags/" }] },
      { id: "pod-template", name: "Atualize o Pod template", badge: "purple", desc: "Com a imagem escolhida, o próximo passo é mudar sua referência em spec.template.spec.containers. Nos manifestos do projeto, mantemos o Deployment astro-demo e o contêiner web, trocando a imagem da v1 para a v2. Isso conecta o artefato ao novo ReplicaSet; antes de aplicar, vamos definir os limites da substituição.", links: [] }
    ]
  },
  {
    id: "estrategia",
    title: "Configure o rollout",
    track: "RollingUpdate",
    desc: "Já sabemos o que muda no template. Agora precisamos definir como essa mudança avança sem retirar capacidade cedo demais. Vamos manter um único cenário: 3 réplicas desejadas, maxUnavailable: 0 e maxSurge: 1. Esses números serão usados novamente na execução e no laboratório.",
    links: [
      { label: "Kubernetes — estratégia RollingUpdate", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment" }
    ],
    items: [
      { id: "replicas", name: "Defina réplicas e capacidade", badge: "purple", desc: "As 3 réplicas representam a capacidade normal do astro-demo. Para criar uma nova antes de remover uma antiga, o cluster precisa de espaço adicional. Confira os requests e as restrições de agendamento: declarar um Pod extra não cria CPU, memória ou nós automaticamente.", links: [{ label: "Kubernetes — recursos de contêiner", url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" }] },
      { id: "max-unavailable", name: "maxUnavailable", badge: "purple", desc: "Partindo das 3 réplicas, maxUnavailable define quanto da capacidade desejada pode ficar indisponível durante o rollout. Com 0, o controlador não deve reduzir voluntariamente a disponibilidade abaixo de 3 para fazer a troca. Isso não impede falhas externas; exige que a nova capacidade fique disponível antes da redução da antiga.", links: [] },
      { id: "max-surge", name: "maxSurge", badge: "purple", desc: "Se não podemos retirar capacidade primeiro, precisamos criar espaço para a nova versão. maxSurge: 1 permite uma réplica extra acima das 3 desejadas. Assim, o novo ReplicaSet pode crescer antes de o antigo diminuir. Pods ainda em encerramento podem elevar temporariamente o total observado além de 4.", links: [] },
      { id: "tempo-rollout", name: "minReadySeconds e deadline", badge: "gray", desc: "Os limites numéricos dependem de saber quando um Pod está realmente disponível. minReadySeconds exige um período contínuo de prontidão antes de contá-lo como disponível; progressDeadlineSeconds detecta falta de progresso. A v2 do projeto usa 5 e 180 segundos, respectivamente. A próxima etapa explica de onde vem essa prontidão.", links: [] }
    ]
  },
  {
    id: "saude",
    title: "Proteja o tráfego",
    track: "Health checks",
    desc: "Até aqui, dissemos que a nova réplica precisa ficar pronta antes da retirada da antiga. As probes transformam essa condição em verificações concretas. Vamos separar inicialização, prontidão para tráfego e necessidade de reinício, e depois cuidar da saída dos Pods antigos.",
    links: [
      { label: "Kubernetes — configure probes", url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/" }
    ],
    items: [
      { id: "startup-probe", name: "startupProbe: terminou de iniciar?", badge: "purple", desc: "Começamos pelo nascimento do novo Pod: aplicações lentas podem precisar de tempo para carregar dados ou inicializar. Uma startupProbe, quando configurada, adia readiness e liveness até a inicialização ser aprovada. Ela é uma opção de configuração; os manifestos NGINX deste projeto não a incluem.", links: [] },
      { id: "readiness-probe", name: "readinessProbe: pode receber tráfego?", badge: "purple", desc: "Depois de iniciar, o novo Pod precisa demonstrar que pode receber requisições. A readinessProbe controla essa participação no tráfego regular do Service, sem reiniciar o contêiner quando falha. É essa prontidão, junto de minReadySeconds quando configurado, que permite avançar a substituição com segurança.", links: [] },
      { id: "liveness-probe", name: "livenessProbe: precisa reiniciar?", badge: "purple", desc: "Um Pod que já ficou pronto também pode travar depois. A livenessProbe trata esse caso: após falhas suficientes, o kubelet reinicia o contêiner. Diferentemente da readiness, sua finalidade não é apenas retirar tráfego. No NGINX do laboratório, consultar / é uma verificação simples, não uma prova completa da saúde de uma aplicação de negócio.", links: [] },
      { id: "shutdown", name: "SIGTERM e encerramento gracioso", badge: "gray", desc: "Quando a nova réplica fica disponível, chega a hora de encerrar uma antiga. Essa saída também precisa ser segura: o tráfego deve deixar de chegar e as requisições em andamento precisam terminar dentro do período de graça. Assim fechamos o ciclo de entrada e saída dos Pods antes de executar o rollout.", links: [{ label: "Kubernetes — término de Pods", url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-flow" }] }
    ]
  },
  {
    id: "execucao",
    title: "Execute e observe",
    track: "Operação",
    desc: "Com imagem, capacidade e verificações definidas, podemos aplicar a mudança e observar o resultado. Os comandos abaixo usam os arquivos reais da pasta kubernetes, em um cluster de teste configurado. Primeiro estabelecemos a v1; depois aplicamos a v2 e acompanhamos a troca, sem confundir status técnico com sucesso para o usuário.",
    links: [
      { label: "kubectl set image", url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_set/kubectl_set_image/" },
      { label: "kubectl rollout", url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/" }
    ],
    items: [
      { id: "rollout-status", name: "rollout status com timeout", badge: "purple", desc: "Depois de aplicar a v2, kubectl rollout status acompanha se a atualização concluiu. Um timeout limita quanto tempo o cliente espera; ele não desfaz a mudança nem para o controlador. Se houver erro ou timeout, o próximo passo é inspecionar o estado e o histórico, não assumir que ocorreu uma reversão.", links: [] },
      { id: "history", name: "Histórico, pause e resume", badge: "gray", desc: "Para entender o resultado do status, precisamos saber qual revisão está sendo executada. O histórico registra mudanças do template e ajuda a escolher uma revisão para recuperação. Pause e resume controlam a continuidade de um rollout, mas pausar não é o mesmo que voltar à versão anterior.", links: [{ label: "kubectl rollout", url: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/" }] },
      { id: "observe-metrics", name: "Métricas, logs e smoke tests", badge: "purple", desc: "Mesmo quando o rollout termina, ainda precisamos responder à pergunta inicial: os usuários continuam sendo atendidos? Compare erros, latência e capacidade antes, durante e depois da troca. Logs e testes de requisição complementam o status; se algum sinal piorar, use os diagnósticos da próxima etapa.", links: [] }
    ]
  },
  {
    id: "falhas",
    title: "Diagnostique falhas",
    track: "Troubleshooting",
    desc: "Quando o status não conclui ou as requisições pioram, investigue em que ponto a nova versão falhou: obtenção da imagem, execução, readiness ou agendamento. Os cards a seguir são caminhos alternativos de diagnóstico, não uma sequência de erros que todos os rollouts precisam apresentar.",
    links: [
      { label: "Kubernetes — depure aplicações", url: "https://kubernetes.io/docs/tasks/debug/debug-application/" }
    ],
    items: [
      { id: "image-pull", name: "ImagePullBackOff", badge: "purple", desc: "Comece verificando se o nó conseguiu obter a imagem. ImagePullBackOff indica falha de download com espera crescente entre tentativas. No laboratório, uma tag inexistente provoca esse caso: o Pod candidato não fica pronto e, com a política configurada, as 3 réplicas estáveis não são retiradas para dar lugar a ele.", links: [] },
      { id: "crash-loop", name: "CrashLoopBackOff", badge: "purple", desc: "Se a imagem foi obtida, mas o contêiner reinicia repetidamente, investigue CrashLoopBackOff. Diferentemente do erro de download, aqui o processo chegou a ser executado. Logs da execução anterior e o motivo do término ajudam a separar erro da aplicação, configuração, falta de memória e reinícios por liveness.", links: [] },
      { id: "never-ready", name: "Readiness nunca passa", badge: "purple", desc: "Outra possibilidade é o contêiner continuar em execução, mas nunca ficar Ready. Nesse caso, a troca pode não avançar porque falta nova capacidade disponível. Retome a configuração de readiness: confira a rota, a porta, os limites de tempo e se o Service seleciona os Pods esperados.", links: [] },
      { id: "pod-pending", name: "Pod permanece Pending", badge: "purple", desc: "Se a nova réplica ainda não conseguiu iniciar, olhe também para o agendamento e a preparação do Pod. Pending pode envolver falta de recursos, volumes ou outras condições de inicialização; os Events indicam o motivo. Isso retoma o planejamento de surge: sem espaço para a réplica extra, a atualização pode ficar bloqueada.", links: [{ label: "Kubernetes — recursos", url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/" }] },
      { id: "bug-funcional", name: "Bug depois da readiness", badge: "gray", desc: "Por fim, um rollout pode concluir sem esses erros e ainda entregar uma versão defeituosa. Uma resposta bem-sucedida na rota / não garante que uma compra ou outra jornada funcione. Esse é o motivo para combinar probes com testes e métricas; havendo impacto, precisamos decidir como recuperar o serviço.", links: [] }
    ]
  },
  {
    id: "rollback",
    title: "Reverta com segurança",
    track: "Recuperação",
    desc: "Depois de identificar a falha e avaliar o impacto, podemos restaurar um template conhecido. No roteiro do laboratório, a v2 funciona e a revisão seguinte tem uma imagem inválida: o rollback deve recuperar a v2, não necessariamente a v1. A reversão também precisa ser acompanhada e validada.",
    links: [
      { label: "Kubernetes — rollback de Deployment", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-back-a-deployment" }
    ],
    items: [
      { id: "stop-promotion", name: "Pare a promoção e confirme impacto", badge: "purple", desc: "Antes de reverter, impeça que a revisão defeituosa avance para outros ambientes e preserve evidências. Confira o histórico e qual imagem estava estável. Interromper a promoção no pipeline não equivale a pausar o Deployment; se ele estiver pausado, será necessário retomá-lo antes de executar undo.", links: [] },
      { id: "validate-recovery", name: "Valide depois da reversão", badge: "purple", desc: "Após o undo, volte aos mesmos sinais usados na execução: rollout concluído, réplicas disponíveis e requisições funcionando. Remover o Pod com erro não basta para declarar recuperação. Registre a causa e entregue a correção como um novo artefato rastreável, fechando o ciclo iniciado na preparação da imagem.", links: [] },
      { id: "data-migrations", name: "Banco e efeitos externos", badge: "gray", desc: "Há um limite importante para essa recuperação: o undo restaura o template, mas não desfaz alterações no banco, mensagens ou chamadas externas. Isso retoma a compatibilidade entre v1 e v2 citada no início. Em aplicações com estado, planeje migrações compatíveis e recuperação dos dados antes da publicação.", links: [] }
    ]
  },
  {
    id: "pipeline",
    title: "Automatize a entrega",
    track: "CI/CD",
    desc: "Agora que entendemos manualmente a entrega, a observação e a recuperação, podemos automatizar esse mesmo fluxo. Um pipeline conecta validação, artefato rastreável, deploy e verificação do resultado. A automação deve repetir as decisões seguras que acabamos de estudar, não apenas executar comandos mais rápido.",
    links: [
      { label: "Docker — boas práticas de build", url: "https://docs.docker.com/build/building-best-practices/" }
    ],
    items: [
      { id: "quality-gates", name: "Testes e validações de qualidade", badge: "purple", desc: "O primeiro controle acontece antes do cluster: revisar e testar a mudança reduz a chance de publicar um defeito. Neste repositório estático, podemos verificar o JavaScript e validar os manifestos; em uma aplicação de negócio, acrescentamos testes unitários e de integração. Cada falha deve interromper o avanço.", links: [] },
      { id: "supply-chain", name: "Scan, SBOM e assinatura", badge: "gray", desc: "Depois de validar o código, precisamos avaliar o artefato que realmente será executado. Scan, SBOM e assinatura complementam tag e digest: ajudam a investigar vulnerabilidades, conhecer os componentes e verificar a origem. Essas ferramentas são opcionais neste projeto e dependem da política e da infraestrutura da equipe.", links: [] },
      { id: "pipeline-gates", name: "Timeouts e gates de rollout", badge: "purple", desc: "Uma imagem aprovada ainda precisa provar que funciona no ambiente. Após o deploy, use o status com timeout e testes de requisição como barreiras para a promoção. A mesma observação feita manualmente passa a decidir se o pipeline pode continuar; status concluído sozinho não aprova uma versão.", links: [] },
      { id: "auto-rollback", name: "Rollback exige automação externa", badge: "gray", desc: "Quando uma dessas barreiras falha, alguém precisa decidir a recuperação. O Deployment não executa rollback automático por atingir progressDeadlineSeconds: isso exige lógica no pipeline ou um controlador especializado. Os critérios devem considerar o impacto e os efeitos externos para não automatizar uma reversão insegura.", links: [{ label: "Argo Rollouts — visão geral", url: "https://argoproj.github.io/rollouts/" }] }
    ]
  },
  {
    id: "estrategias",
    title: "Escolha a estratégia",
    track: "Decisão",
    desc: "Automatizar o processo também permite perguntar se RollingUpdate é a estratégia adequada. Sem mudar o problema original, vamos comparar as alternativas pela coexistência de versões, capacidade adicional e controle de tráfego. A escolha vem agora porque já conhecemos os custos e limites da troca gradual.",
    links: [
      { label: "Argo Rollouts — conceitos", url: "https://argoproj.github.io/argo-rollouts/concepts/" }
    ],
    items: [
      { id: "recreate", name: "Recreate", badge: "gray", desc: "Retomando o risco da troca abrupta, Recreate encerra os Pods antigos antes de criar os novos durante uma atualização. Pode ser uma escolha deliberada quando a coexistência é indesejada e uma janela de indisponibilidade é aceita. Esse comportamento contrasta com a continuidade buscada no nosso laboratório.", links: [] },
      { id: "rolling-update", name: "RollingUpdate", badge: "purple", desc: "É a estratégia que construímos ao longo do roteiro: adicionar capacidade nova e retirar a antiga gradualmente. Para o astro-demo, mantemos 3 réplicas, surge 1 e indisponibilidade permitida 0. Ela favorece continuidade, mas não oferece, por si só, uma distribuição exata da porcentagem de tráfego entre versões.", links: [] },
      { id: "blue-green", name: "Blue-Green", badge: "gray", desc: "Se a necessidade for validar uma versão completa antes de mudar o tráfego, Blue-Green mantém ambientes atual e candidato separados. Em vez de substituir gradualmente os Pods do mesmo Deployment, a troca acontece no direcionamento do tráfego. O retorno pode ser rápido, desde que a versão anterior e os dados continuem compatíveis.", links: [] },
      { id: "canary", name: "Canary", badge: "gray", desc: "Se o principal risco for expor todos os usuários a um bug funcional, Canary começa com uma parcela menor de tráfego na nova versão. As métricas usadas nos gates orientam a ampliação dessa parcela. Diferentemente do RollingUpdate nativo, controle preciso de tráfego exige recursos adicionais.", links: [{ label: "Argo Rollouts — Canary", url: "https://argoproj.github.io/argo-rollouts/features/canary/" }] }
    ]
  },
  {
    id: "prova-final",
    title: "Prove baixo downtime",
    track: "Missão prática",
    desc: "Para fechar o fluxo, vamos relacionar teoria e evidência: partir da v1, atualizar para v2, provocar uma falha de imagem e recuperar a versão estável. Concluir os subtópicos libera o laboratório do site, que é uma simulação local. Os comandos abaixo são uma alternativa real para um cluster de teste; a animação não comprova disponibilidade em produção.",
    links: [
      { label: "kind — cluster local", url: "https://kind.sigs.k8s.io/" },
      { label: "minikube — documentação", url: "https://minikube.sigs.k8s.io/docs/" }
    ],
    items: [
      { id: "low-downtime-checklist", name: "Checklist de produção", badge: "purple", desc: "Este checklist reúne as decisões anteriores, da capacidade à recuperação. Antes da demonstração, confirme o ambiente e os manifestos; durante a troca, observe prontidão e requisições; após a falha, explique por que a versão estável permaneceu e como foi recuperada. O resultado deve ser sustentado por evidências, não apenas pela conclusão dos cards.", links: [{ label: "Kubernetes — disruptions", url: "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/" }] }
    ]
  }
];

const PANEL_DETAILS = {
  fundamentos: {
    points: [
      "O objetivo da apresentação é acompanhar uma única mudança: astro-demo da v1 para a v2, mantendo o atendimento.",
      "Primeiro entendemos o risco; depois configuramos a troca, observamos o resultado e praticamos a recuperação.",
      "Ao final, o laboratório reúne esses conceitos em uma sequência de atualização, falha e rollback."
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
      content: ["strategy:","  type: RollingUpdate","  rollingUpdate:","    maxSurge: 1","    maxUnavailable: 0"].join("\n")
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
      "O Deployment coordena ReplicaSets; cada ReplicaSet mantém os Pods de um template.",
      "O Service não fica entre o Deployment e os Pods na cadeia de criação: ele seleciona endpoints para encaminhar tráfego.",
      "Manter app: astro-demo nas duas versões permite que o mesmo Service atenda durante a coexistência."
    ],
    note: "Apresente o fluxo como uma cadeia: Deployment → ReplicaSet → Pod Ready → Service."
  },
  deployment: {
    points: [
      "O exemplo é um recorte didático; o manifesto completo com estratégia e readiness está em kubernetes/deployment-v1.yaml.",
      "O selector do Deployment precisa corresponder aos labels do template; o Service também usa app: astro-demo.",
      "Uma mudança no template dispara o rollout; o ReplicaSet apresentado a seguir mantém os Pods dessa versão."
    ],
    code: {
      language: "YAML",
      title: "Recorte de um Deployment",
      content: ["# Recorte; use deployment-v1.yaml para o manifesto completo","apiVersion: apps/v1","kind: Deployment","metadata:","  name: astro-demo","spec:","  replicas: 3","  selector:","    matchLabels:","      app: astro-demo","  template:","    metadata:","      labels:","        app: astro-demo","    spec:","      containers:","        - name: web","          image: nginx:1.25-alpine"].join("\n")
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
      content: ["kubectl get deploy astro-demo","kubectl get rs -l app=astro-demo","kubectl get pods -l app=astro-demo -o wide"].join("\n")
    }
  },
  "pods-ready": {
    points: [
      "Running é uma fase do Pod; não garante que todos os seus contêineres estejam prontos para atender.",
      "Na saída padrão de kubectl get pods, a coluna READY mostra contêineres prontos; a condição Ready pertence ao Pod.",
      "Os EndpointSlices permitem conferir quais Pods selecionados pelo Service estão prontos; as probes serão detalhadas na etapa de saúde."
    ],
    code: {
      language: "Shell",
      title: "Compare estado e prontidão",
      content: ["kubectl get pods -l app=astro-demo","kubectl get endpointslices -l kubernetes.io/service-name=astro-demo"].join("\n")
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
      "Uma tag pode ser movida para outro conteúdo; use tags únicas e políticas de imutabilidade para rastrear builds.",
      "O digest fixa o conteúdo e permite promover o mesmo artefato entre ambientes, sem reconstruí-lo.",
      "O comando abaixo apenas inspeciona a imagem pronta usada na v2; construir e publicar uma imagem própria exige Dockerfile e acesso a um registry."
    ],
    code: {
      language: "Shell",
      title: "Inspecione o digest da imagem da v2",
      content: ["# Requer Docker; inspeciona a imagem usada na v2","docker pull nginx:1.27-alpine","docker image inspect nginx:1.27-alpine --format '{{json .RepoDigests}}'"].join("\n")
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
      title: "Compare a configuração da v2",
      content: ["# Compare os arquivos antes de aplicar na etapa de execução","kubectl diff -f kubernetes/deployment-v2.yaml","# diff: 0 = sem diferenças; 1 = diferenças; >1 = erro","# A v2 também acrescenta probes, recursos e tempos ao template."].join("\n")
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
      content: ["spec:","  replicas: 3","  strategy:","    type: RollingUpdate","    rollingUpdate:","      maxSurge: 1","      maxUnavailable: 0"].join("\n")
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
      content: ["kubectl scale deployment/astro-demo --replicas=3","kubectl get pods -l app=astro-demo -o wide","kubectl top pods -l app=astro-demo"].join("\n")
    }
  },
  "max-unavailable": {
    points: [
      "Com 3 réplicas e valor 0, o objetivo do controlador é preservar 3 disponíveis durante a substituição.",
      "Com 25% de 3, o arredondamento para baixo resulta em 0; valores inteiros deixam o exemplo mais explícito.",
      "Esse limite controla a atualização, mas não garante atendimento diante de falhas de nós, rede ou da própria aplicação."
    ],
    note: "Com 3 réplicas, maxUnavailable de 25% arredonda para 0.",
    code: {
      language: "YAML",
      title: "Preserve todas as réplicas",
      content: ["rollingUpdate:","  maxUnavailable: 0","  maxSurge: 1"].join("\n")
    }
  },
  "max-surge": {
    points: [
      "Com 3 réplicas e surge 1, há espaço para uma réplica candidata antes da retirada de uma antiga.",
      "Com 25% de 3, o arredondamento para cima também resulta em 1; surge e unavailable não podem ser ambos zero.",
      "Reserve recursos para essa sobreposição e para Pods em encerramento, que podem continuar consumindo capacidade."
    ],
    note: "Com 3 réplicas e surge 1, há uma réplica extra; Pods em encerramento podem elevar o total observado."
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
      content: ["# Recorte de kubernetes/deployment-v2.yaml","spec:","  minReadySeconds: 5","  progressDeadlineSeconds: 180"].join("\n")
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
      "Quando configurada, a startupProbe precisa passar antes de readiness e liveness começarem.",
      "O exemplo usa / na porta 80 para combinar com o NGINX; numa aplicação própria, a rota deve refletir a inicialização real.",
      "30 tentativas com intervalo de 5 segundos dão uma janela nominal de cerca de 150 segundos; atraso inicial e duração das verificações também importam."
    ],
    code: {
      language: "YAML",
      title: "Janela de inicialização ilustrativa",
      content: ["# Opcional: inserir no contêiner, não na raiz do manifesto","startupProbe:","  httpGet:","    path: /","    port: 80","  periodSeconds: 5","  failureThreshold: 30"].join("\n")
    }
  },
  "readiness-probe": {
    points: [
      "No manifesto do projeto, a verificação HTTP consulta / pela porta nomeada http, ligada à porta 80.",
      "Após falhas suficientes, o Pod deixa de ser Ready; essa verificação não reinicia o contêiner.",
      "Escolha uma verificação representativa: responder na página inicial não comprova todas as funcionalidades da aplicação."
    ],
    code: {
      language: "YAML",
      title: "Libere o tráfego quando estiver pronto",
      content: ["# Recorte do contêiner web na v2","readinessProbe:","  httpGet:","    path: /","    port: http","  initialDelaySeconds: 2","  periodSeconds: 3","  timeoutSeconds: 2","  failureThreshold: 3"].join("\n")
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
      content: ["# Recorte do contêiner web na v2","livenessProbe:","  httpGet:","    path: /","    port: http","  initialDelaySeconds: 10","  periodSeconds: 10","  timeoutSeconds: 2","  failureThreshold: 3"].join("\n")
    }
  },
  shutdown: {
    points: [
      "O período de graça inclui a execução de preStop, quando há esse hook, e o encerramento do processo.",
      "A aplicação deve tratar o sinal de término e concluir o trabalho em andamento antes do fim desse prazo.",
      "Uma espera fixa em preStop não garante drenagem; valide sinais, conexões e comportamento do servidor utilizado."
    ],
    code: {
      language: "YAML",
      title: "Janela para encerramento",
      content: ["# Em spec.template.spec, como no manifesto v2","terminationGracePeriodSeconds: 30","# O tratamento do sinal depende do servidor da imagem.","# Configure preStop apenas se houver necessidade validada."].join("\n")
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
      content: ["# Cluster de teste configurado; execute na raiz do projeto","kubectl apply -f kubernetes/service.yaml","kubectl apply -f kubernetes/deployment-v1.yaml","kubectl rollout status deployment/astro-demo --timeout=5m","# Com a v1 disponível, publique a v2","kubectl apply -f kubernetes/deployment-v2.yaml","kubectl rollout status deployment/astro-demo --timeout=5m"].join("\n")
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
      content: ["kubectl rollout status deployment/astro-demo --timeout=5m","kubectl get deployment astro-demo","kubectl describe deployment astro-demo"].join("\n")
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
      content: ["kubectl rollout history deployment/astro-demo","kubectl rollout pause deployment/astro-demo","kubectl rollout resume deployment/astro-demo"].join("\n")
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
      content: ["kubectl logs -l app=astro-demo --tail=100 --prefix","kubectl get events --sort-by=.lastTimestamp","# Em outro terminal: Ctrl+C encerra apenas a observação","kubectl get pods -l app=astro-demo -w"].join("\n")
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
      content: ["kubectl get pods -l app=astro-demo","kubectl describe deployment astro-demo","kubectl get events --sort-by=.lastTimestamp","# Substitua POD_NAME pelo nome real do Pod investigado","kubectl describe pod POD_NAME","# Use logs --previous apenas se houve execução anterior"].join("\n")
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
      content: ["# Substitua POD_NAME pelo Pod com ErrImagePull/ImagePullBackOff","kubectl describe pod POD_NAME","kubectl get pod POD_NAME -o jsonpath='{.status.containerStatuses[*].state.waiting.message}'","# Se a imagem nunca iniciou, ainda não haverá logs do processo."].join("\n")
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
      content: ["# Substitua POD_NAME pelo nome real; --previous exige execução anterior","kubectl logs POD_NAME --previous","kubectl describe pod POD_NAME","kubectl get pod POD_NAME -o yaml"].join("\n")
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
      content: ["# Substitua POD_NAME pelo Pod que não fica Ready","kubectl describe pod POD_NAME","kubectl exec POD_NAME -- wget -qO- http://localhost:80/","kubectl get endpointslices -l kubernetes.io/service-name=astro-demo -o yaml","# O wget depende de estar disponível na imagem."].join("\n")
    }
  },
  "pod-pending": {
    points: [
      "Leia os Events para distinguir falta de agendamento de problemas na preparação dos contêineres.",
      "Requests, volumes, taints e afinidade podem impedir a nova réplica; quotas também podem bloquear sua criação, aparecendo no ReplicaSet.",
      "kubectl top requer Metrics Server e mostra uso observado; o scheduler considera requests, não apenas esse uso."
    ],
    code: {
      language: "Shell",
      title: "Leia a decisão do scheduler",
      content: ["# Substitua POD_NAME pelo nome real; top requer Metrics Server","kubectl describe pod POD_NAME","kubectl get nodes","kubectl top nodes","kubectl get resourcequota -A"].join("\n")
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
      content: ["kubectl rollout history deployment/astro-demo","# Após a imagem inválida, a revisão anterior deve ser a v2.","# Confirme o histórico antes de reverter.","kubectl rollout undo deployment/astro-demo","kubectl rollout status deployment/astro-demo --timeout=5m"].join("\n")
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
      content: ["kubectl rollout history deployment/astro-demo","kubectl get rs -l app=astro-demo","kubectl get pods -l app=astro-demo --show-labels"].join("\n")
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
      content: ["kubectl rollout status deployment/astro-demo --timeout=5m","kubectl get deployment astro-demo","kubectl get deployment astro-demo -o jsonpath='{.spec.template.spec.containers[0].image}'","# No roteiro, espere nginx:1.27-alpine após reverter a falha.","# Confira também as requisições e os logs do teste."].join("\n")
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
      content: ["test → build → scan → publish","             ↓","deploy → rollout status → smoke test","                         ↓","                 promote ou rollback"].join("\n")
    }
  },
  "quality-gates": {
    points: [
      "node --check verifica a sintaxe, mas não substitui testes de interação no navegador.",
      "O dry-run no servidor valida o manifesto contra o cluster e exige contexto e permissões configurados.",
      "Valide cada versão separadamente; aplicar a pasta inteira mistura v1, v2 e a falha proposital do laboratório."
    ],
    code: {
      language: "Shell",
      title: "Validações antes do deploy",
      content: ["# Verificação disponível neste projeto estático","node --check app.js","# Requer cluster de teste acessível","kubectl apply --dry-run=server -f kubernetes/deployment-v1.yaml","kubectl apply --dry-run=server -f kubernetes/deployment-v2.yaml","kubectl apply --dry-run=server -f kubernetes/service.yaml"].join("\n")
    }
  },
  "supply-chain": {
    points: [
      "Scan encontra vulnerabilidades conhecidas, mas não garante ausência de falhas.",
      "SBOM registra os componentes; uma assinatura precisa ser verificada contra uma identidade ou chave confiável.",
      "O exemplo é opcional, requer Trivy e Syft instalados e inspeciona a mesma imagem NGINX usada no roteiro."
    ],
    code: {
      language: "Shell",
      title: "Exemplo com ferramentas comuns",
      content: ["# Exemplos opcionais; requerem as ferramentas instaladas","trivy image nginx:1.27-alpine","syft nginx:1.27-alpine -o spdx-json","# Assine imagens próprias ao publicar e verifique sua origem","# antes do deploy, conforme a política adotada pela equipe."].join("\n")
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
      content: ["# Exemplo de gate para um executor Bash com kubectl","set -e","kubectl apply -f kubernetes/deployment-v2.yaml","kubectl rollout status deployment/astro-demo --timeout=5m","# Conecte aqui os testes e a avaliação das métricas.","# Só promova a versão se todas essas verificações passarem."].join("\n")
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
      content: ["spec:","  strategy:","    type: Recreate"].join("\n")
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
      content: ["spec:","  replicas: 3","  strategy:","    type: RollingUpdate","    rollingUpdate:","      maxSurge: 1","      maxUnavailable: 0"].join("\n")
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
      "No site, conclua os subtópicos e use a sequência guiada: validar YAML → v1 → v2 → falha → rollback.",
      "No cluster real, use apenas um ambiente de teste e execute os comandos da raiz do projeto; o gerador de tráfego registra OK ou FALHA.",
      "Observe o tráfego pelo Service dentro do cluster. Port-forward é útil para acesso local, mas fica associado a um Pod e pode terminar quando ele é removido.",
      "A imagem inválida deve bloquear a nova revisão; depois do undo, confira que nginx:1.27-alpine voltou e que o atendimento se manteve. A simulação não mede esse resultado real."
    ],
    code: {
      language: "Shell",
      title: "Roteiro resumido do laboratório",
      content: ["# Cluster de teste configurado; comandos na raiz do projeto","kubectl apply -f kubernetes/service.yaml","kubectl apply -f kubernetes/deployment-v1.yaml","kubectl rollout status deployment/astro-demo --timeout=5m","# Crie o observador uma vez; requer acesso à imagem BusyBox","kubectl run astro-traffic --image=busybox:1.36 --restart=Never --command -- sh -c 'while true; do date; wget -q -T 2 -O /dev/null http://astro-demo && echo OK || echo FALHA; sleep 1; done'","# Em outro terminal: kubectl logs -f astro-traffic","kubectl apply -f kubernetes/deployment-v2.yaml","kubectl rollout status deployment/astro-demo --timeout=5m","kubectl apply -f kubernetes/broken-deployment.yaml","# Observe ImagePullBackOff e investigue antes de reverter","kubectl get pods -l app=astro-demo","kubectl rollout history deployment/astro-demo","kubectl rollout undo deployment/astro-demo","kubectl rollout status deployment/astro-demo --timeout=5m","# Ao terminar o teste, remova apenas o observador","kubectl delete pod astro-traffic"].join("\n")
    }
  },
  "low-downtime-checklist": {
    points: [
      "Base e planejamento: confira identidade da imagem, labels, réplicas, surge, readiness e encerramento.",
      "Operação e recuperação: guarde status, Events e requisições antes, durante e depois da falha; relacione cada evidência ao que foi aprendido.",
      "Entrega e decisão: avalie compatibilidade, automação e estratégia; a demonstração NGINX não cobre banco de dados nem todos os requisitos de produção."
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
