# Prompt para Codex: VTEX IO MCP Server

## Contexto

Quero criar um MCP (Model Context Protocol) server em TypeScript que seja o assistente definitivo para desenvolvimento VTEX IO. Não é só Store Framework — é TUDO: frontend (Store Framework + custom React), backend (Node.js services), GraphQL, Admin apps, Pixel apps, e toda a arquitetura VTEX IO.

O objetivo é que qualquer dev VTEX instale via `npx` e tenha, dentro do Codex Desktop, Codex, Cursor ou qualquer MCP client, um copiloto que sabe criar um site VTEX IO completo do zero.

Nome do pacote: `vtex-io-mcp`

## O que o VTEX IO abrange (escopo do MCP)

### Builders (cada um = uma área de conhecimento)

O MCP precisa conhecer todos os builders do VTEX IO:

- **store** (0.x) — Define blocks, interfaces, routes, e templates do storefront. Interpreta a pasta `/store` com blocks.jsonc, interfaces.json, routes.json
- **react** (3.x) — Componentes React custom. Interpreta a pasta `/react` com TSX, hooks, CSS Handles, queries GraphQL
- **node** (6.x) — Services backend Node.js. Interpreta a pasta `/node` com Service class, middlewares, clients, routes HTTP, event handlers
- **graphql** (1.x) — Schema GraphQL + resolvers. Interpreta a pasta `/graphql` com schema.graphql, types, directives
- **styles** (2.x) — CSS customization via JSON. Interpreta a pasta `/styles` com configs de tipografia, cores, spacing
- **messages** (1.x) — i18n/internacionalização. Interpreta a pasta `/messages` com JSONs por locale
- **admin** (0.x) — Apps para o painel Admin VTEX. Interpreta a pasta `/admin` com navigation.json e routes
- **pixel** (0.x) — Scripts de tracking/analytics. Interpreta a pasta `/pixel` com head.html e body.html
- **docs** (0.x) — Documentação da app. Interpreta a pasta `/docs` com Markdown
- **assets** (0.x) — Arquivos estáticos
- **configuration** (0.x) — Schemas de configuração
- **dotnet** (2.x) — Services backend .NET (cobrir pelo menos a existência)

### Conceitos fundamentais

O MCP precisa entender:

- **manifest.json** — Estrutura completa: vendor, name, version, builders, dependencies, peerDependencies, policies, settingsSchema
- **Workspaces** — Development vs production, vtex link, vtex publish
- **VTEX CLI** — Comandos principais (vtex init, vtex link, vtex publish, vtex deploy, vtex install)
- **Policies** — Permissões de acesso a APIs externas e internas
- **Dependencies vs peerDependencies** — Quando usar cada uma
- **@vtex/api** — O SDK Node.js: clients (Catalog, OMS, Checkout, MasterData), Context, Service class, IOClients
- **vtex.css-handles** — Sistema de CSS customization para componentes React
- **vtex.render-runtime** — Runtime hooks (useRuntime, withRuntimeContext, etc.)
- **vtex.styleguide** — Biblioteca de componentes UI para Admin apps
- **Master Data** — CRUD, schemas, triggers, scroll queries
- **Events** — Event handling entre services (colossus events)

## Stack técnica do MCP server

- TypeScript (ES2022, ESM modules)
- `@modelcontextprotocol/sdk` (SDK oficial do MCP)
- `zod` para validação de schemas
- Node.js 18+
- Comunicação via stdio (StdioServerTransport)
- Sem banco de dados — conhecimento embarcado no pacote
- Prettier: no semicolons, single quotes

## Estrutura do projeto

```
vtex-io-mcp/
├── src/
│   ├── index.ts                        # Entry point (#!/usr/bin/env node)
│   ├── server.ts                       # McpServer config + registro de tools/resources/prompts
│   ├── tools/
│   │   ├── index.ts
│   │   │
│   │   │ # ─── Store Framework ───
│   │   ├── scaffold-store-theme.ts     # Gera Store Theme completo (boilerplate)
│   │   ├── add-block.ts                # Gera jsonc de um block com props corretas
│   │   ├── lookup-block-props.ts       # Consulta props de qualquer block nativo
│   │   ├── validate-blocks.ts          # Valida blocks.jsonc (props, interfaces, deps)
│   │   ├── create-page-template.ts     # Gera template de página (home, PDP, PLP, landing, custom)
│   │   │
│   │   │ # ─── React / Frontend ───
│   │   ├── generate-react-component.ts # Scaffold componente React custom com interface + schema
│   │   ├── add-css-handles.ts          # Gera CSS Handles para um componente
│   │   ├── create-graphql-query.ts     # Gera .gql file para usar no React com useQuery
│   │   │
│   │   │ # ─── Node / Backend ───
│   │   ├── scaffold-node-service.ts    # Gera /node completo: Service, clients, middlewares
│   │   ├── add-route-handler.ts        # Adiciona rota HTTP ao service.json + middleware
│   │   ├── add-event-handler.ts        # Adiciona event handler ao service
│   │   ├── create-client.ts            # Gera um custom client (@vtex/api ExternalClient/AppClient)
│   │   │
│   │   │ # ─── GraphQL ───
│   │   ├── scaffold-graphql.ts         # Gera /graphql: schema, types, resolvers
│   │   ├── add-graphql-field.ts        # Adiciona query/mutation ao schema + resolver
│   │   │
│   │   │ # ─── App / Projeto ───
│   │   ├── scaffold-vtex-app.ts        # Gera app VTEX IO completa (manifest, builders, folders)
│   │   ├── add-builder.ts              # Adiciona builder ao manifest + cria folder structure
│   │   ├── add-dependency.ts           # Adiciona dependency ao manifest (valida se existe)
│   │   ├── add-policy.ts               # Adiciona policy ao manifest
│   │   ├── generate-manifest.ts        # Gera ou atualiza manifest.json completo
│   │   │
│   │   │ # ─── Admin ───
│   │   ├── scaffold-admin-app.ts       # Gera app Admin com navigation + React
│   │   │
│   │   │ # ─── Pixel / Tracking ───
│   │   ├── scaffold-pixel-app.ts       # Gera pixel app com head.html/body.html
│   │   │
│   │   │ # ─── Utilitários ───
│   │   ├── lookup-vtex-api.ts          # Consulta APIs VTEX disponíveis (Catalog, OMS, etc.)
│   │   └── explain-concept.ts          # Explica conceitos VTEX IO usando a base de conhecimento
│   │
│   ├── resources/
│   │   ├── index.ts
│   │   ├── courses.ts                  # Cursos vtex-courses como resources
│   │   ├── api-reference.ts            # Referência de APIs e clients
│   │   └── builder-docs.ts             # Documentação de cada builder
│   │
│   ├── prompts/
│   │   ├── index.ts
│   │   ├── store-templates.ts          # "Crie uma home page", "Crie um PDP", etc.
│   │   ├── service-templates.ts        # "Crie um serviço REST", "Crie um middleware", etc.
│   │   ├── fullstack-templates.ts      # "Crie uma app com React + Node + GraphQL"
│   │   └── admin-templates.ts          # "Crie uma app Admin"
│   │
│   └── knowledge/
│       ├── index.ts
│       ├── loader.ts                   # Carrega JSONs/MD de data/
│       └── search.ts                   # Busca por block, builder, API, conceito
│
├── data/                               # Base de conhecimento (vai no npm publish)
│   ├── blocks/                         # Catálogo de blocks nativos do Store Framework
│   │   ├── rich-text.json
│   │   ├── info-card.json
│   │   ├── shelf.json
│   │   ├── slider-layout.json
│   │   ├── flex-layout.json
│   │   ├── tab-layout.json
│   │   ├── responsive-layout.json
│   │   ├── stack-layout.json
│   │   ├── condition-layout.json
│   │   ├── modal-layout.json
│   │   ├── product-summary.json
│   │   ├── search-result.json
│   │   ├── image.json
│   │   ├── video.json
│   │   ├── newsletter.json
│   │   ├── minicart.json
│   │   ├── login.json
│   │   ├── header.json
│   │   ├── footer.json
│   │   ├── breadcrumb.json
│   │   ├── product-images.json
│   │   ├── product-price.json
│   │   ├── product-name.json
│   │   ├── product-quantity.json
│   │   ├── sku-selector.json
│   │   ├── buy-button.json
│   │   ├── add-to-cart-button.json
│   │   ├── store-link.json
│   │   ├── disclosure-layout.json
│   │   ├── product-specifications.json
│   │   ├── product-description.json
│   │   └── _index.json                # Mapa geral: blockName → arquivo
│   │
│   ├── builders/                       # Referência de cada builder
│   │   ├── store.json
│   │   ├── react.json
│   │   ├── node.json
│   │   ├── graphql.json
│   │   ├── styles.json
│   │   ├── messages.json
│   │   ├── admin.json
│   │   ├── pixel.json
│   │   └── docs.json
│   │
│   ├── apis/                           # Referência de APIs e clients do @vtex/api
│   │   ├── catalog-client.json
│   │   ├── oms-client.json
│   │   ├── checkout-client.json
│   │   ├── masterdata-client.json
│   │   ├── external-client.json        # Como criar ExternalClient custom
│   │   └── _index.json
│   │
│   ├── templates/                      # Templates de código prontos
│   │   ├── store-theme/                # Boilerplate Store Theme completo
│   │   │   ├── manifest.json
│   │   │   ├── store/
│   │   │   └── styles/
│   │   ├── service-app/                # Boilerplate service app (node + graphql)
│   │   │   ├── manifest.json
│   │   │   ├── node/
│   │   │   └── graphql/
│   │   ├── react-app/                  # Boilerplate React custom component
│   │   │   ├── manifest.json
│   │   │   ├── react/
│   │   │   └── store/
│   │   ├── admin-app/                  # Boilerplate Admin app
│   │   │   ├── manifest.json
│   │   │   ├── admin/
│   │   │   └── react/
│   │   └── pixel-app/                  # Boilerplate Pixel app
│   │       ├── manifest.json
│   │       └── pixel/
│   │
│   ├── dependencies/                   # Registry de apps + versões recomendadas
│   │   └── app-registry.json           # { "vtex.rich-text": "0.x", ... }
│   │
│   ├── policies/                       # Catálogo de policies
│   │   └── policies-catalog.json       # Policies comuns e o que cada uma permite
│   │
│   ├── concepts/                       # Explicações de conceitos fundamentais
│   │   ├── workspaces.md
│   │   ├── builders.md
│   │   ├── interfaces.md
│   │   ├── css-handles.md
│   │   ├── events.md
│   │   ├── clients.md
│   │   ├── master-data.md
│   │   ├── vtex-cli.md
│   │   └── service-json.md
│   │
│   └── courses/                        # Conteúdo processado do vtex/vtex-courses
│       ├── basic-blocks.md
│       ├── layout-blocks.md
│       ├── styles-course.md
│       ├── store-block.md
│       ├── service-course.md
│       ├── admin-course.md
│       └── content-workflow.md
│
├── scripts/
│   ├── ingest-vtex-courses.ts          # Processa repo vtex/vtex-courses
│   └── ingest-vtex-app-docs.ts         # Processa READMEs dos vtex-apps/*
│
├── package.json
├── tsconfig.json
├── .prettierrc
├── README.md
├── LICENSE
└── AGENTS.md
```

## Schema dos data files

### Block (data/blocks/*.json)

```json
{
  "blockName": "rich-text",
  "app": "vtex.rich-text",
  "version": "0.x",
  "description": "Renders text content using Markdown",
  "category": "basic",
  "props": [
    {
      "name": "text",
      "type": "string",
      "description": "Text written in Markdown",
      "required": false,
      "default": ""
    }
  ],
  "allowedChildren": [],
  "interface": {
    "component": "RichText",
    "composition": "blocks"
  },
  "examples": [
    {
      "description": "Centered heading",
      "code": {
        "rich-text#title": {
          "props": {
            "text": "# Our Store",
            "textPosition": "CENTER",
            "textAlignment": "CENTER"
          }
        }
      }
    }
  ],
  "documentation": "https://developers.vtex.com/docs/apps/vtex.rich-text"
}
```

### Builder (data/builders/*.json)

```json
{
  "name": "node",
  "version": "6.x",
  "description": "Build Node.js backend services that run on VTEX infrastructure",
  "folder": "/node",
  "requiredFiles": [
    { "path": "node/index.ts", "description": "Service entry point exporting Service class" },
    { "path": "node/package.json", "description": "Node dependencies" },
    { "path": "node/service.json", "description": "Service config: routes, events, memory, timeout" },
    { "path": "node/tsconfig.json", "description": "TypeScript config" }
  ],
  "optionalFiles": [
    { "path": "node/clients/", "description": "Custom API clients" },
    { "path": "node/middlewares/", "description": "Route and event handlers" },
    { "path": "node/utils/", "description": "Utility functions" }
  ],
  "keyPackages": [
    { "name": "@vtex/api", "description": "Core SDK: Service, IOClients, ExternalClient, Context" }
  ],
  "serviceJsonSchema": {
    "memory": "256MB default, up to 512MB",
    "timeout": "seconds, default varies",
    "minReplicas": "0-N",
    "maxReplicas": "1-N",
    "routes": "object mapping route names to { path, public, policies }",
    "events": "object mapping event names to { sender, keys }"
  },
  "examples": {
    "minimalService": "...",
    "serviceWithRoutes": "...",
    "serviceWithEvents": "..."
  },
  "relatedBuilders": ["graphql"],
  "documentation": "https://developers.vtex.com/docs/guides/vtex-io-documentation-service"
}
```

### API Client (data/apis/*.json)

```json
{
  "name": "Catalog",
  "import": "import { Catalog } from '@vtex/clients'",
  "description": "Client for VTEX Catalog API",
  "methods": [
    {
      "name": "getProductById",
      "params": [{ "name": "id", "type": "string" }],
      "returns": "Product",
      "description": "Gets product by ID"
    }
  ],
  "setupExample": "...",
  "requiredPolicies": ["outbound-access to catalog API"],
  "documentation": "..."
}
```

## Detalhes de implementação

### Entry point (src/index.ts)

```typescript
#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './server.js'

const server = createServer()
const transport = new StdioServerTransport()
await server.connect(transport)
```

### Server (src/server.ts)

Usar McpServer do SDK. Registrar tools, resources, prompts. Declarar capabilities.

### Cada tool

Cada tool recebe parâmetros via zod schema e retorna texto (código, JSON, explicação). O LLM usa essas tools quando o dev pede algo relacionado a VTEX IO.

Exemplo de como uma tool é registrada:

```typescript
server.tool(
  'scaffold-vtex-app',
  'Creates a complete VTEX IO app scaffold with the specified builders',
  {
    appName: z.string().describe('App name in kebab-case'),
    vendor: z.string().describe('VTEX account vendor name'),
    builders: z.array(z.enum(['store', 'react', 'node', 'graphql', 'styles', 'messages', 'admin', 'pixel', 'docs'])).describe('Builders to include'),
    description: z.string().optional().describe('App description'),
  },
  async ({ appName, vendor, builders, description }) => {
    // Gera manifest.json + folder structure para cada builder
    // Consulta data/builders/*.json para saber os requiredFiles de cada um
    // Retorna o código completo como texto
  }
)
```

### Resources

Cada resource é um URI que o LLM pode consultar:

```
vtex://courses/basic-blocks      → Conteúdo do curso Basic Blocks
vtex://courses/service-course    → Conteúdo do curso de Services
vtex://builders/node             → Docs do node builder
vtex://builders/graphql          → Docs do graphql builder
vtex://api/catalog               → Referência do Catalog client
vtex://concepts/css-handles      → Explicação de CSS Handles
```

### Prompts

Prompts pré-definidos para cenários comuns. Exemplo:

```typescript
server.prompt(
  'fullstack-app',
  'Create a fullstack VTEX IO app with React frontend, Node backend, and GraphQL',
  { feature: z.string().describe('What the app should do') },
  ({ feature }) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Create a fullstack VTEX IO app that: ${feature}. Include: manifest.json with react, node, graphql, store, and messages builders. React component with useQuery hook. GraphQL schema with query and mutation. Node service with resolver and client. Store interface to use the component as a block.`
      }
    }]
  })
)
```

## package.json

```json
{
  "name": "@commenteme/vtex-io-mcp",
  "version": "0.1.0",
  "description": "MCP server for VTEX IO development — Store Framework, React, Node services, GraphQL, Admin, and more",
  "type": "module",
  "bin": {
    "vtex-io-mcp": "./build/index.js"
  },
  "scripts": {
    "build": "tsc && chmod 755 build/index.js",
    "dev": "tsc --watch",
    "ingest:courses": "tsx scripts/ingest-vtex-courses.ts",
    "ingest:apps": "tsx scripts/ingest-vtex-app-docs.ts",
    "inspect": "npx @modelcontextprotocol/inspector build/index.js"
  },
  "files": ["build", "data"],
  "keywords": ["mcp", "vtex", "vtex-io", "store-framework", "ecommerce", "react", "node", "graphql"],
  "license": "MIT",
  "engines": { "node": ">=18" }
}
```

## Workflow de ingestão de conhecimento

A base de conhecimento vai ser populada de 3 formas:

### 1. Repos clonados (Codex lê direto)

```bash
# Clonar na pasta .sources/ (gitignored)
git clone https://github.com/vtex/vtex-courses.git .sources/vtex-courses
git clone https://github.com/vtex-apps/service-example.git .sources/service-example
git clone https://github.com/vtex-apps/graphql-example.git .sources/graphql-example
git clone https://github.com/vtex-apps/react-app-template.git .sources/react-app-template
git clone https://github.com/vtex-apps/minimum-boilerplate-theme.git .sources/minimum-boilerplate-theme
```

Depois no Codex:

```
Na pasta .sources/ tem repos VTEX clonados.
Processa cada um e gera/atualiza os JSONs em data/.
```

### 2. Raw URLs (curl direto)

```bash
# READMEs de apps nativas
curl -s https://raw.githubusercontent.com/vtex-apps/rich-text/master/docs/README.md > .sources/rich-text.md
curl -s https://raw.githubusercontent.com/vtex-apps/shelf/master/docs/README.md > .sources/shelf.md
# etc.
```

### 3. Copy-paste do browser

Quando a doc está só em página web (developers.vtex.com), copia do browser e cola no Codex:

```
Colei a doc da página developers.vtex.com sobre o Node builder.
Extrai e gera/atualiza data/builders/node.json seguindo o schema.

---
[conteúdo colado]
---
```

### Regra: separar cada doc com "==="

Quando colar múltiplas docs de uma vez:

```
Vou colar docs de vários blocks VTEX, separados por ===.
Para cada um gera o JSON em data/blocks/.

=== RICH TEXT ===
[conteúdo]
=== INFO CARD ===
[conteúdo]
=== SHELF ===
[conteúdo]
```

## Primeira iteração (MVP)

Começa com:

1. Setup do projeto (package.json, tsconfig, prettier, AGENTS.md, .gitignore)
2. Server MCP funcional com stdio transport
3. Tools:
   - `scaffold-vtex-app` — gera app com builders selecionados
   - `lookup-block-props` — consulta props de 5 blocks (rich-text, info-card, flex-layout, shelf, image)
   - `add-block` — gera jsonc para esses blocks
   - `scaffold-node-service` — gera /node básico
   - `scaffold-graphql` — gera /graphql básico
4. Pelo menos 5 blocks populados em data/blocks/
5. Pelo menos 2 builders populados em data/builders/ (store, node)
6. Testar com MCP Inspector

Depois iteramos: mais blocks, mais tools, resources, prompts, script de ingestão.

## Como testar

```bash
npm run build
npx @modelcontextprotocol/inspector build/index.js
```

## Referências

- MCP SDK: <https://github.com/modelcontextprotocol/typescript-sdk>
- MCP Docs: <https://modelcontextprotocol.io/docs/develop/build-server>
- VTEX Courses: <https://github.com/vtex/vtex-courses>
- VTEX Store Framework: <https://developers.vtex.com/docs/guides/vtex-io-documentation-what-is-vtex-store-framework>
- VTEX Builders: <https://developers.vtex.com/docs/guides/vtex-io-documentation-builders>
- VTEX Services: <https://developers.vtex.com/docs/guides/vtex-io-documentation-service>
- VTEX GraphQL: <https://developers.vtex.com/docs/guides/graphql-in-vtex-io>
- VTEX React Builder: <https://developers.vtex.com/docs/guides/vtex-io-documentation-react-builder>
- VTEX Manifest: <https://developers.vtex.com/docs/guides/vtex-io-documentation-manifest>
- VTEX Apps GitHub: <https://github.com/vtex-apps>
- Service Example: <https://github.com/vtex-apps/service-example>
- GraphQL Example: <https://github.com/vtex-apps/graphql-example>
- React Template: <https://github.com/vtex-apps/react-app-template>
- Minimum Boilerplate Theme: <https://github.com/vtex-apps/minimum-boilerplate-theme>
