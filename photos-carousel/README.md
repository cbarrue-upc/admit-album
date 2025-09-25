# Photos Carousel

Carrusel fotográfico para tablet Android usando Google Photos Picker y control por Model Context Protocol.

## Estructura del monorepo

```
/photos-carousel
  /apps
    /web      → PWA React 18 + Vite + Tailwind + Zustand
    /server   → Express + MCP server
  /packages
    /types    → Tipos y schemas Zod compartidos
    /ui       → Componentes reutilizables
```

## Requisitos

- Node.js 20
- pnpm 8.15+
- Google Cloud project con Photos Picker API habilitada

## Variables de entorno

Crea un archivo `.env` en `apps/server` con:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
GOOGLE_ALLOWED_ORIGIN=http://localhost:5173
SESSION_SECRET=cambia-esto
```

## Desarrollo

```bash
cd photos-carousel
pnpm install
pnpm dev:server
pnpm dev:web
```

- Web: http://localhost:5173
- API: http://localhost:3000 (por defecto)

## Tests y calidad

```bash
pnpm lint
pnpm test
pnpm --filter @photos-carousel/web test:ui
```

## Despliegue

1. **Frontend**: Ejecuta `pnpm --filter @photos-carousel/web build` y despliega `apps/web/dist` en Vercel/Netlify.
2. **Backend**: Construye la imagen Docker (`docker build -t photos-carousel apps/server`) y despliega en Fly.io, Render o Cloud Run. Expone `/api` con HTTPS.
3. Configura CORS para permitir únicamente el origin de la PWA.
4. Sube variables OAuth en el proveedor (client id/secret, redirect URI).

## Google Cloud setup

1. Crea proyecto.
2. Habilita **Google Photos Library API** y **Google Photos Picker API**.
3. Configura pantalla de consentimiento OAuth con los scopes mínimos:
   - `https://www.googleapis.com/auth/photospicker.mediaitems.readonly`
4. Crea credenciales OAuth 2.0 (tipo aplicación web). Define redirect URI del servidor.
5. Descarga el JSON y coloca client_id/client_secret en `.env`.

## MCP

El servidor expone herramientas MCP in-process. Para conectarlo con un LLM:

```bash
node apps/server/dist/index.js --mcp-stdio
```

Define las herramientas registradas: `open_picker`, `poll_session`, `list_media_items`, `get_image_blob`, `slideshow_control`.

## Bubblewrap / Trusted Web Activity

1. Instala Bubblewrap (`npm i -g @bubblewrap/cli`).
2. Ejecuta `pnpm --filter @photos-carousel/web run build`.
3. `pnpm run twa:init` (script pendiente) inicializa proyecto TWA con nombre, iconos e intent filter para HTTPS.
4. Sube el asset link a tu dominio para asociar la app.

## API Endpoints

- `POST /auth/login`
- `GET /auth/callback`
- `POST /picker/session`
- `GET /picker/session/:id`
- `GET /media?sessionId`
- `GET /media/:id/content`
- `POST /slideshow/control`
- `POST /filters/apply` (en frontend)
- `POST /llm/command`

Consulta `packages/types` para los schemas exactos.

## Notas de seguridad

- Cookies httpOnly + SameSite=Lax.
- Rate limit en `/picker/*` y `/media/*`.
- Base URLs de Google expiran en ~60 min (ver constantes en `@photos-carousel/types`).
- IndexedDB guarda blobs máximo 200 MB y se renueva cada 55 min.

## Roadmap

- Integrar OAuth Authorization Code + PKCE real.
- Implementar fetch autenticado a Google Photos Picker API.
- Añadir soporte wake lock y métricas Web Vitals.
