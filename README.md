# Astro K8S — Roadmap de Rolling Update

Site estático em HTML, CSS e JavaScript, pronto para o GitHub Pages. Não precisa de servidor de aplicação, banco de dados, Docker nem Kubernetes para abrir o site.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub. Para usar o Pages no plano gratuito, use um repositório público.
2. Envie os arquivos do projeto para a branch `main`, incluindo a pasta oculta `.github`, `.gitignore` e `.nojekyll`.
3. No repositório, abra **Settings → Pages → Build and deployment → Source** e selecione **GitHub Actions**.
4. Abra **Actions → Publicar GitHub Pages → Run workflow**, selecionando `main`.
5. Quando a execução terminar, o endereço estará em **Settings → Pages** e no resultado da publicação. Normalmente será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Depois, cada envio para `main` atualiza o site. Se usar outro nome de branch, ajuste `branches: [main]` em `.github/workflows/pages.yml` e as regras do ambiente `github-pages`, se necessário.

Não é necessário criar um token pessoal nem cadastrar secrets para esse workflow. As permissões de publicação são fornecidas pelo próprio GitHub Actions.

Referência: [workflows personalizados para GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## O que enviar

```text
.github/workflows/pages.yml
.gitignore
.nojekyll
README.md
index.html
styles.css
app.js
assets/
kubernetes/
scripts/build-pages.cjs
```

**Não envie** `tmp/`, `tests/`, `_site/`, vídeos, arquivos ZIP nem configurações pessoais. O `.gitignore` já exclui esses arquivos ao usar Git ou GitHub Desktop. Se usar o upload manual pelo navegador, selecione apenas os arquivos da lista acima: o upload manual não aplica o `.gitignore`.

O vídeo `demonstracao-astro-k8s.webm` foi preservado localmente para compartilhar com o grupo, mas não faz parte do repositório nem do site publicado. Os testes locais também foram preservados e não são necessários à publicação.

O workflow gera `_site/` com uma lista explícita dos arquivos públicos. Assim, mesmo que um vídeo ou teste seja enviado por engano ao repositório, ele não entra na publicação. Não configure o Pages para publicar diretamente da branch; use **GitHub Actions** conforme acima.

## Conferir localmente

Abra `index.html` no navegador. Para gerar exatamente os arquivos que serão publicados, com Node.js instalado:

```sh
node --check app.js
node scripts/build-pages.cjs
```

A pasta `_site/` é gerada novamente a cada execução; não edite arquivos dentro dela. Edite os arquivos da raiz. Caminhos relativos permitem hospedar o site também dentro do endereço do repositório.

## Recursos e limitações

- Roadmap, foco por etapa, navegação por setas e conclusão individual ou em grupo.
- Progresso salvo no navegador. No endereço do Pages, o progresso começa separado do arquivo local; navegadores e aparelhos diferentes não compartilham essas marcações.
- Laboratório liberado após concluir todos os subtópicos. Esse bloqueio é educativo e local, não uma barreira de segurança ou autenticação.
- Simulação de criação, Rolling Update, falha e rollback: não executa comandos nem acessa um cluster real.
- Os exemplos para executar separadamente estão em [kubernetes/README.md](kubernetes/README.md). **Não coloque kubeconfig, tokens ou certificados no repositório.**
- As fontes são carregadas do Google Fonts; fontes alternativas são usadas quando esse serviço está indisponível.

O código local está preparado; a publicação só acontece depois de enviá-lo ao seu repositório e configurar o Pages.
