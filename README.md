# Projeto Carros — frontend e backend

Um repositório e um projeto na Vercel. Next.js serve o site e encaminha `/api/*` ao NestJS compilado do workspace `backend/`, sem abrir outra porta em produção. Prisma continua usando PostgreSQL externo. O repositório original do backend não foi alterado.

## Desenvolvimento

Use Node.js 22 e npm. Na raiz:

```sh
npm ci
cp .env.example .env
# Preencha DATABASE_URL e JWT_SECRET no .env
npm run dev
```

Site em `http://localhost:3000`; API em `http://localhost:3000/api/vehicles`. Não é necessário iniciar o backend separadamente. `predev` e `prebuild` geram o Prisma e compilam o NestJS com os metadados dos decorators. Após alterar arquivos do backend, reinicie `npm run dev` para recompilá-los.

```sh
npm run build
npm start
npm run test:api
```

O teste da API usa mocks do banco e verifica inicialização concorrente, filtros, JSON em POST, login inválido, 404, autenticação do cron, configuração ausente, importação com erro e bloqueio de concorrência. Não comprova conectividade com o banco real.

## Deploy na Vercel

1. Envie este repositório para seu Git e importe-o na Vercel.
2. Escolha **Next.js**, Root Directory na raiz (`.`), Node.js **22.x**, Install Command `npm ci`, Build Command `npm run build`; mantenha Output Directory padrão.
3. Configure **DATABASE_URL** e **JWT_SECRET** nos ambientes desejados (Production/Preview/Development). JWT_SECRET deve ser uma chave aleatória forte; gere com `openssl rand -hex 32`. Sem ela, a API não inicializa.
4. Opcional: configure **TYPE_WEBHOOK_URL** para classificação de veículos.
5. Faça o deploy e verifique `/api/vehicles`, login e administração com o banco conectado.

Remova configurações antigas de `NEXT_PUBLIC_API_URL`: o frontend agora usa `/api` no próprio domínio. Não cadastre segredos com prefixo NEXT_PUBLIC_. Não use `next export`, `output: export` ou preset de site estático.

### Banco e migrações

Use PostgreSQL acessível pela Vercel, preferencialmente com a URL de pool fornecida pelo provedor e SSL. O build gera o Prisma Client sem acessar o banco. Uma instância do cliente é reutilizada por processo; os pools continuam multiplicando entre instâncias da Vercel, portanto dimensione o limite de conexões com seu provedor.

As migrações foram preservadas. Para aplicar migrações, após conferir backup, histórico e banco de destino, execute `npm run db:migrate` com DATABASE_URL apropriada no ambiente do comando. O deploy não executa migrações automaticamente: o histórico original contém operações destrutivas (DROP TABLE e DROP COLUMN). Não execute essas migrações em banco existente sem verificar o estado atual. Não use `migrate reset` em produção.

### Limites e validação de produção

A rota da API pede até 300 segundos; a disponibilidade depende dos limites do plano. A sincronização de estoque é sequencial e pode exceder esse tempo com catálogos grandes ou webhooks lentos. Nesses casos, será necessário dividir a importação em lotes ou executá-la em um worker externo antes de garantir a sincronização completa.

A integração preserva as permissões do backend original: as rotas de escrita e registro não possuem guards, e o redirecionamento do painel no navegador não protege essas rotas. Revise a autorização antes de disponibilizar a administração publicamente.

Referências: [API Routes do Next.js](https://nextjs.org/docs/pages/building-your-application/routing/api-routes), [conexões Prisma v6](https://www.prisma.io/docs/orm/v6/prisma-client/setup-and-configuration/databases-connections/connection-pool).


## Atualização automática a cada 30 minutos (Vercel Hobby)

O workflow `.github/workflows/sync-stock.yml` chama `GET /api/cron/sync-stock` nos minutos 07 e 37 de cada hora (UTC), sem depender de visitas ao site ou de um servidor local. Destino padrão: `https://www.bomjesusautomoveis.com`. A integração AutoCerto/Altimus e a URL do feed são lidas da configuração salva no painel.

### Ativação

1. Na Vercel, configure DATABASE_URL, JWT_SECRET e **CRON_SECRET** em Production. O CRON_SECRET já foi gerado no `.env` local, ignorado pelo Git. Use o mesmo valor na Vercel e no GitHub; não use JWT_SECRET como token do cron.
2. No GitHub, em **Settings → Secrets and variables → Actions → Secrets**, crie o secret **CRON_SECRET** com esse valor. Opcionalmente, em **Variables**, configure **APP_URL** para substituir o domínio padrão.
3. Envie o código completo e o workflow para a branch padrão do repositório, publique na Vercel e habilite GitHub Actions, caso esteja desabilitado. O workflow não tem trigger de push, evitando chamar uma versão ainda não publicada.
4. Em **Actions → Atualizar estoque → Run workflow**, execute uma vez para validar o deploy. Consulte essa página para verificar as próximas execuções e falhas. Garanta que a proteção do deployment não bloqueie o domínio de produção.

Sem publicar o código e cadastrar os secrets, o agendamento não está ativo. Não há cron em `vercel.json`, pois a frequência de 30 minutos não é aceita pelo cron nativo do plano Hobby.

O GitHub pode atrasar ou descartar execuções em períodos de alta demanda; em repositórios públicos, agendamentos são desabilitados após 60 dias sem atividade. O workflow depende dos limites de minutos disponíveis no plano do GitHub, principalmente em repositórios privados. Portanto, o intervalo é programado a cada 30 minutos, sem garantia de pontualidade.

### Proteção e consistência

A rota exige `Authorization: Bearer <CRON_SECRET>`, não recebe URL de feed por parâmetro e desabilita cache. Uma trava transacional no PostgreSQL impede que duas sincronizações (manual e automática) modifiquem o estoque ao mesmo tempo. A importação usa uma transação: erro na API externa, veículo inválido, ID duplicado ou falha no banco cancela as alterações. Não há migrações novas para essa trava.

Requisições simultâneas recebem HTTP 409; configuração ausente recebe 503; falha de importação recebe 502. O workflow sinaliza falhas e não repete a importação automaticamente no mesmo ciclo. Se o feed retornar estoque vazio, os veículos atuais são preservados e a execução sinaliza erro, como no comportamento original.

A importação tem orçamento de aproximadamente 240 segundos e a função até 300 segundos. Estoques que excedam esse tempo precisam de processamento em lotes ou worker externo.

Referências: [limites do cron da Vercel](https://vercel.com/docs/cron-jobs/usage-and-pricing), [agendamentos do GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
