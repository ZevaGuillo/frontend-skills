# frontend-skills

Colección de Agent Skills para automatización de desarrollo frontend con arquitectura limpia, consistencia de estilos y patrones de fetching estandarizados.

## Instalación

```bash
npx skills add [owner]/frontend-skills
```

## Skills Disponibles

| Skill | Descripción | Comando |
|-------|-------------|---------|
| `project-setup` | Screaming architecture por feature | `npx skills add [owner]/frontend-skills/project-setup` |
| `api-fetching` | Patrón de tres capas con TanStack Query | `npx skills add [owner]/frontend-skills/api-fetching` |
| `components` | Componentes React con shadcn/ui | `npx skills add [owner]/frontend-skills/components` |
| `forms` | React Hook Form + Zod | `npx skills add [owner]/frontend-skills/forms` |
| `state-management` | Zustand para estado de cliente | `npx skills add [owner]/frontend-skills/state-management` |
| `testing` | Vitest + Testing Library | `npx skills add [owner]/frontend-skills/testing` |
| `nextjs-integration` | Next.js App Router patterns | `npx skills add [owner]/frontend-skills/nextjs-integration` |
| `tailwind-styling` | Tailwind CSS con tokens semánticos | `npx skills add [owner]/frontend-skills/tailwind-styling` |
| `performance-optimization` | Optimizaciones de performance | `npx skills add [owner]/frontend-skills/performance-optimization` |

## Stack Destino

- React 18+ con TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query v5
- React Hook Form + Zod
- Zustand
- Next.js App Router / TanStack Start / Vite SPA

## Uso

1. Instala el skill que necesitas
2. El agente leerá automaticamente el `SKILL.md` del skill
3. Sigue las reglas y usa los templates proporcionados

Para más detalles, consulta [AGENTS.md](./AGENTS.md).

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md).

## Licencia

MIT License - ver [LICENSE](./LICENSE).
