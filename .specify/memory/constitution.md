# Constitution — frontend-skills

> Memory bank permanente. Todo agente debe leer este archivo antes de cualquier tarea en este repositorio.

---

## Propósito del Repositorio

Este repositorio contiene una colección de Agent Skills diseñados para automatizar la creación de frontends con:

- **Arquitectura limpia** — separación de responsabilidades, dependencias unidireccionales
- **Consistencia de estilos** — tokens semánticos, patrones visuales unificados
- **Patrones de fetching estandarizados** — tres capas (api → repository → hook)
- **Calidad production-grade** — tipos seguros, errores manejados, tests incluidos

El repositorio es **compatible con cualquier agente que respete el estándar de Agent Skills**: Claude Code, Cursor, GitHub Copilot Coding Agent, Gemini CLI, Windsurf, y agentes futuros.

---

## Los Nueve Skills

| # | Skill | Descripción |
|---|-------|-------------|
| 1 | `project-setup` | Screaming architecture por feature: anatomía de feature folder, grafo de dependencias permitidas, index.ts como contrato público |
| 2 | `api-fetching` | Patrón de tres capas con TanStack Query: repository → hook → componente, query keys tipados, error handling global |
| 3 | `components` | Patrones de componentes React con shadcn/ui: composición, slots, variantes, atomic design |
| 4 | `forms` | React Hook Form + Zod: validación, schemas compartidos, form actions, error handling |
| 5 | `state-management` | Zustand para estado de cliente: stores tipados, persistencia, selectors memoizados |
| 6 | `testing` | Vitest + Testing Library: estrategia de testing por tipo (unit, integration, e2e), mocks de TanStack Query |
| 7 | `nextjs-integration` | Next.js App Router: Server Components, Server Actions, streaming, cache strategies |
| 8 | `tailwind-styling` | Tailwind CSS con tokens semánticos: theme config, componentes compuestos, responsive design |
| 9 | `performance-optimization` | Optimizaciones: code splitting, memoización, image optimization, bundle analysis |

---

## Stack Técnico Destino

Los proyectos que generarán estos skills utilizan:

- **React 18+** con TypeScript strict mode
- **Tailwind CSS** con tokens semánticos (no valores hardcoded)
- **shadcn/ui** como base de componentes
- **TanStack Query v5** para fetching y caching
- **React Hook Form** + **Zod** para formularios
- **Zustand** para estado de cliente
- **Next.js App Router** / **TanStack Start** / **Vite SPA** como frameworks

---

## Reglas No Negociables

### Formato Obligatorio del SKILL.md

Todo skill DEBE tener un `SKILL.md` con estas secciones:

```markdown
# Skill: [nombre-del-skill]

## When to Apply
> Una o dos oraciones que determinen cuándo activar este skill.

## Quick Reference
> Lista de todas las reglas en formato condensado.

## Rules
> Tabla de reglas con columnas: Prioridad, Categoría, Impacto, Prefijo, Regla

## Detalle por Categoría
> Cada categoría con subsecciones detalladas
```

### Estructura Interna de Cada Skill

```
skills/[nombre]/
├── SKILL.md           # Obligatorio - formato visto arriba
├── rules/             # Carpeta con archivos de reglas individuales
│   ├── rule-1.md
│   └── rule-2.md
└── templates/         # Plantillas TypeScript completas
    ├── template-1.ts
    └── template-2.ts
```

### Convenciones de Naming

- **Skills**: kebab-case (`api-fetching`, `project-setup`)
- **Archivos de reglas**: kebab-case descriptivo (`repository-pattern.md`, `query-keys.md`)
- **Templates**: `[nombre].template.ts` para archivos copiables
- **Variables**: camelCase para JS/TS, SCREAMING_SNAKE_CASE para constantes
- **Componentes**: PascalCase (`UserList.tsx`)
- **Hooks**: prefix `use` (`useUsers.ts`)

### Prefijos de Reglas

Cada regla en un skill DEBE usar un prefijo consistente:

| Prefijo | Significado |
|---------|-------------|
| `[PATTERN]` | Patrón arquitectónico obligatorio |
| `[MUST]` | Requisito no negociable |
| `[NEVER]` | Prohibición absoluta |
| `[AVOID]` | Anti-pattern a evitar |
| `[PREFERRED]` | Mejor práctica recomendada |
| `[OPTIONAL]` | Sugerencia opcional |

---

## Principios de Código

Todos los skills deben enforcear:

1. **SOLID** — Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
2. **KISS** — Keep it simple, stupid. Complejidad mínima necesaria
3. **YAGNI** — You aren't gonna need it. No sobre-ingenierizar
4. **DRY con criterio** — Don't repeat yourself pero prioriza claridad sobre reducción de líneas
5. **Screaming architecture** — La estructura de archivos debe gritar el negocio, no el framework
6. **Auto-documentación** — Cada feature folder incluye su propio `README.md` generado

---

## Referencias de Estructura

- `anthropics/skills` — referencia principal: `skills/`, `spec/`, `template/`, `.claude-plugin/`, `AGENTS.md`
- `vercel-labs/skills` — referencia CLI: `skills/find-skills/`, `AGENTS.md`, tooling en `src/`, `bin/`
- `google-labs-code/stitch-skills` — referencia workflows: `skills/`, `CONTRIBUTING.md`, `SECURITY.md`

---

## Proceso de Spec-Kit

Este repositorio sigue el flujo de spec-kit:

1. **Constitution** (este archivo) → Memoria permanente
2. **Specify** → Requirements detallados en `spec/project-spec.md`
3. **Plan** → Tasks numeradas
4. **Tasks** → Ejecución de los 9 skills

---

## Validación Automática

El workflow `.github/workflows/validate-skills.yml` valida:

- Todo skill tiene `SKILL.md`
- `SKILL.md` tiene secciones obligatorias
- Archivos referenciados en `SKILL.md` existen en `rules/`

---

*Esta constitution es la fuente de verdad. Cualquier discrepancia entre un SKILL.md y esta constitution se resuelve a favor de la constitution.*
