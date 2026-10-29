![vtex-io-mcp · Servidor MCP para desarrollar en VTEX IO: Store Framework, React, Node, GraphQL y Admin.](https://raw.githubusercontent.com/commentemeapp/vtex-io-mcp/main/assets/banner.png)

# vtex-io-mcp

**Servidor MCP para desarrollar en VTEX IO: Store Framework, React, Node, GraphQL y Admin.**

[![npm](https://img.shields.io/npm/v/@commenteme/vtex-io-mcp?labelColor=005278&color=FFBD38)](https://www.npmjs.com/package/@commenteme/vtex-io-mcp)
[![node](https://img.shields.io/node/v/vtex-io-mcp?labelColor=005278&color=FFBD38)](https://nodejs.org)
[![licencia](https://img.shields.io/npm/l/vtex-io-mcp?labelColor=005278&color=FFBD38)](./LICENSE)

## Instalación

```bash
claude mcp add vtex-io -- npx -y @commenteme/vtex-io-mcp
```

El cliente MCP corre el servidor con `npx`, así que no hace falta instalar nada. Requiere Node `>= 18`. Para Claude Desktop, Cursor, VS Code y Windsurf, mira [Clientes MCP](#clientes-mcp).

## Uso rápido

Reinicia el cliente y pide lo que necesitas. El asistente elige la herramienta:

- "Crea una app VTEX IO llamada `product-reviews` con los builders react, node, graphql y store"
- "Que props acepta el `flex-layout.row`? Dame un ejemplo con dos columnas"
- "Genera un servicio Node con una ruta pública `GET /_v/order/:orderId` y un handler para `order.created`"
- "Arma el esquema GraphQL con una query `productReviews(productId: ID!)` y una mutation `addReview`"
- "Busca en la documentación como funcionan las CSS Handles"
- "Que endpoints tiene la API de Master Data?"

## Que incluye

- **Scaffolding de apps VTEX IO**: `manifest.json` y carpetas para cualquier combinación de builders.
- **Backend listo para empezar**: servicio Node con `service.json`, clients, rutas HTTP y handlers de eventos; esquema GraphQL con resolvers tipados.
- **Store Framework**: props, ejemplos y JSONC validado para los blocks del catálogo.
- **Documentación en el editor**: 391 documentos de VTEX y 10 cursos oficiales, con búsqueda por palabras clave.
- **Local y sin credenciales**: todo el conocimiento va en el paquete. No llama a APIs externas ni pide claves.

Funciona con Claude Code, Claude Desktop, Cursor, VS Code, Windsurf y cualquier cliente MCP por `stdio`.

## Documentación

### Clientes MCP

**Claude Code.** Para compartirlo con el equipo en un repositorio, agrega `--scope project` al comando de [Instalación](#instalación): la configuración queda en `.mcp.json`.

**Claude Desktop**, en `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/`, Windows: `%APPDATA%\Claude\`). **Cursor**, en `~/.cursor/mcp.json` (global) o `.cursor/mcp.json` (por proyecto). **Windsurf**, en `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "vtex-io": {
      "command": "npx",
      "args": ["-y", "@commenteme/vtex-io-mcp"]
    }
  }
}
```

**VS Code**, en `.vscode/mcp.json`:

```json
{
  "servers": {
    "vtex-io": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@commenteme/vtex-io-mcp"]
    }
  }
}
```

**Otros clientes.** Cualquiera con transporte `stdio` sirve: el comando es `npx` y los argumentos, `-y @commenteme/vtex-io-mcp`. Si prefieres instalación global, `npm install -g @commenteme/vtex-io-mcp` y usa `vtex-io-mcp` como comando.

El servidor está en el [Official MCP Registry](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.commentemeapp%2Fvtex-io-mcp/versions/latest) como `io.github.commentemeapp/vtex-io-mcp`.

### Herramientas

La entrada [src/index.ts](src/index.ts) conecta el servidor por `stdio`: el cliente inicia el proceso y habla por la entrada y salida estándar, sin abrir puerto HTTP. Las nueve herramientas se registran en [src/tools/index.ts](src/tools/index.ts).

**Apps y backend**

| herramienta | parámetros | que hace |
| --- | --- | --- |
| `scaffold-vtex-app` | `appName`, `vendor`, `builders`, `version?`, `description?` | Genera `manifest.json` y las carpetas de los builders elegidos: `store`, `react`, `node`, `graphql`, `styles`, `messages`, `admin`, `pixel`, `docs`. |
| `scaffold-node-service` | `appName`, `vendor`, `routes?`, `events?`, `memory?`, `timeout?` | Genera `node/index.ts`, `service.json`, clients y middlewares. Cada ruta lleva `name`, `path`, `method` y `public`; cada evento, `name`, `sender` y `keys`. |
| `scaffold-graphql` | `appName`, `vendor`, `queries?`, `mutations?` | Genera `schema.graphql` y los resolvers en TypeScript, con argumentos, tipo de retorno y descripción. |

**Store Framework**

| herramienta | parámetros | que hace |
| --- | --- | --- |
| `lookup-block-props` | `blockName` | Devuelve descripción, props y ejemplos de un block. |
| `add-block` | `blockName`, `blockId?`, `props?`, `children?` | Genera un fragmento JSONC para `blocks.jsonc` y valida las props contra el esquema del block. |

Blocks disponibles hoy: `rich-text`, `info-card`, `flex-layout.row`, `flex-layout.col`, `shelf`, `image`.

**Documentación**

| herramienta | parámetros | que hace |
| --- | --- | --- |
| `search-concepts` | `query`, `maxResults?` | Busca por palabras clave en los 391 documentos y devuelve resultados ordenados con extractos. |
| `explain-concept` | `concept` | Devuelve el documento completo de un concepto por su ID. |
| `search-courses` | `query`, `courseId?` | Busca en los cursos oficiales de VTEX IO y devuelve extractos con contexto. |
| `lookup-vtex-api` | `api` | Referencia REST de una API de VTEX: catalog, orders, checkout, master-data, logistics, pricing, intelligent-search, session, headless-cms, promotions, payments-gateway, license-manager. |

### Resources

| URI | contenido |
| --- | --- |
| `vtex://concepts` | Índice de los documentos, agrupados por prefijo. |
| `vtex://concepts/{conceptId}` | Documento completo de un concepto. |
| `vtex://courses` | Índice de los cursos, con título, descripción y número de pasos. |
| `vtex://courses/{id}` | Contenido completo de un curso: `onboarding`, `basic-blocks`, `layout-blocks`, `styles-course`, `store-block`, `service-course`, `calling-commerce-apis`, `admin`, `content-workflow`, `store-performance`. |

### Hoja de ruta

- [ ] Mas blocks de Store Framework: layouts (`slider-layout`, `tab-layout`, `responsive-layout`, `stack-layout`, `condition-layout`, `modal-layout`, `disclosure-layout`), producto (`product-summary`, `product-images`, `product-price`, `sku-selector`, `buy-button`), búsqueda, header, footer, minicart y login
- [ ] Referencia de todos los builders en `data/builders/` (hoy: `store` y `node`)
- [ ] Herramientas de Store Framework: `validate-blocks`, `create-page-template`
- [ ] Herramientas de React: `generate-react-component`, `add-css-handles`, `create-graphql-query`
- [ ] Herramientas de backend: `add-route-handler`, `add-event-handler`, `create-client`, `add-graphql-field`
- [ ] Herramientas de manifiesto: `add-builder`, `add-dependency`, `add-policy`, `generate-manifest`
- [ ] Scaffolding de apps Admin y Pixel
- [ ] Resources `vtex://builders/{name}` y `vtex://api/{client}` con los clients de `@vtex/api`
- [ ] Prompts MCP para escenarios comunes: home, PDP, servicio REST, app fullstack, app Admin
- [ ] Scripts de ingestión para actualizar `data/` desde los cursos y los README de `vtex-apps`

### Estructura

```text
src/
├── index.ts          # entry point del binario (stdio)
├── server.ts         # McpServer: registra tools y resources
├── tools/            # una herramienta por archivo, registradas en tools/index.ts
├── resources/        # vtex://concepts y vtex://courses
└── knowledge/        # carga y búsqueda sobre data/
data/
├── blocks/           # un JSON por block + _index.json
├── builders/         # referencia por builder
├── concepts/         # documentación en Markdown
└── courses/          # cursos en Markdown + _index.json
assets/               # header del README (no va en el paquete npm)
```

### Desarrollo

```bash
git clone https://github.com/commentemeapp/vtex-io-mcp.git
cd vtex-io-mcp
npm install
npm run build
npm run inspect
```

`npm run inspect` abre el [MCP Inspector](https://github.com/modelcontextprotocol/inspector) sobre `build/index.js` para llamar cada herramienta y leer los resources sin cliente. Para probar la versión local en un cliente, apunta el comando a la build en vez de `npx`:

```bash
claude mcp add vtex-io-local -- node /ruta/a/vtex-io-mcp/build/index.js
```

| comando | que hace |
| --- | --- |
| `npm run build` | Compila TypeScript en `build/` y marca el binario como ejecutable. |
| `npm run dev` | Compilación en modo _watch_. |
| `npm run lint` | Verificación de tipos (`tsc --noEmit`). |
| `npm run inspect` | Abre el MCP Inspector sobre el servidor compilado. |

### Agregar una herramienta

1. Crea `src/tools/<nombre>.ts` exportando el esquema zod (`<nombre>Schema`) y la función que devuelve el contenido.
2. Regístrala en `src/tools/index.ts` con `server.tool(nombre, descripción, esquema, función)`. La descripción es lo que el modelo lee para decidir cuando usarla: di que hace y con que ejemplos.
3. Si necesita conocimiento nuevo, agrega los archivos en `data/` y cárgalos desde `src/knowledge/`.
4. `npm run build` y pruébala en el Inspector.

### Convenciones

- TypeScript con módulos ESM; Prettier sin punto y coma y con comillas simples.
- [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/).
- El conocimiento es solo lectura en tiempo de ejecución: nada se escribe en disco ni se descarga.

### Ramas y publicación

El trabajo nace en una rama que sale de `dev` y el PR va contra `dev`. De ahí se promueve a `qa` y, después de probar, a `main`, siempre con merge de la rama completa. El CI corre `lint` y `build` en Node 18, 20 y 22.

Para publicar, sube la versión en `package.json` y `CHANGELOG.md` y empuja un tag `v*`: el workflow `publish.yml` compila, publica en npm con _provenance_, crea el GitHub Release y publica el `server.json` en el MCP Registry. Los cambios de cada versión están en [CHANGELOG.md](./CHANGELOG.md).

## Contribuir · Licencia

Abre un issue o un PR contra `dev`.
[MIT](./LICENSE).

---

Hecho por [commente.me](https://commente.me) · hola@commente.me
