# AGENTS.md — frontend-skills

> Archivo de lectura obligatoria para todo agente antes de trabajar en este repositorio o en proyectos que usen estos skills.

---

## Propósito

Este repositorio contiene skills para automatizar la creación de frontends con arquitectura consistente. Los skills son conocimiento procedimental — no librerías, sino instrucciones que el agente lee dinámicamente.

---

## Reglas Globales del Repositorio

### Lectura Obligatoria

1. **Antes de cualquier tarea**: Lee `.specify/memory/constitution.md`
2. **Antes de crear código**: Identifica qué skill aplica y lee su `SKILL.md`
3. **Antes de modificar un skill**: Verifica las reglas en `constitution.md`

### Formato SKILL.md

Todo skill debe tener:

```markdown
# Skill: [nombre]

## When to Apply
> Cuándo activar este skill

## Quick Reference
> Lista condensada de reglas

## Rules
> Tabla con Prioridad, Categoría, Impacto, Prefijo, Regla

## Detalle por Categoría
> Subsecciones detalladas
```

### Convenciones de Naming

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Skills | kebab-case | `api-fetching` |
| Reglas | kebab-case | `repository-pattern.md` |
| Templates | `[nombre].template.ts` | `useEntity.template.ts` |
| Hooks | PascalCase + prefix `use` | `useUsers.ts` |
| Componentes | PascalCase | `UserList.tsx` |
| Constantes | SCREAMING_SNAKE_CASE | `QUERY_KEYS` |

### Prefijos de Reglas

| Prefijo | Significado |
|---------|-------------|
| `[PATTERN]` | Patrón obligatorio |
| `[MUST]` | Requisito no negociable |
| `[NEVER]` | Prohibición absoluta |
| `[AVOID]` | Anti-pattern |
| `[PREFERRED]` | Mejor práctica |
| `[OPTIONAL]` | Sugerencia opcional |

---

## Índice de Skills

### 1. project-setup

**Cuándo aplicar**: Cuando necesitas inicializar la estructura de un proyecto nuevo o crear una nueva feature.

**Comando**: `npx skills add [owner]/frontend-skills/project-setup`

**Reglas clave**:
- Anatomía de feature folder
- Grafo de dependencias permitidas
- `index.ts` como contrato público

### 2. api-fetching

**Cuándo aplicar**: Cuando necesitas consumir una API REST o GraphQL desde React.

**Comando**: `npx skills add [owner]/frontend-skills/api-fetching`

**Reglas clave**:
- Patrón de tres capas: api → repository → hook
- Query keys como constantes tipadas
- Nunca usar `useQuery` directamente en componentes

### 3. components

**Cuándo aplicar**: Cuando necesitas crear componentes React reutilizables.

**Comando**: `npx skills add [owner]/frontend-skills/components`

**Reglas clave**:
- Composición sobre herencia
- Slots para children
- Variantes via props

### 4. forms

**Cuándo aplicar**: Cuando necesitas crear formularios con validación.

**Comando**: `npx skills add [owner]/frontend-skills/forms`

**Reglas clave**:
- React Hook Form + Zod
- Esquemas compartidos
- Form actions

### 5. state-management

**Cuándo apply**: Cuando necesitas estado de cliente global.

**Comando**: `npx skills add [owner]/frontend-skills/state-management`

**Reglas clave**:
- Zustand stores tipados
- Persistencia
- Selectors memoizados

### 6. testing

**Cuándo apply**: Cuando necesitas escribir tests.

**Comando**: `npx skills add [owner]/frontend-skills/testing`

**Reglas clave**:
- Estrategia por tipo (unit, integration, e2e)
- Mocks de TanStack Query

### 7. nextjs-integration

**Cuándo apply**: Cuando trabajas con Next.js App Router.

**Comando**: `npx skills add [owner]/frontend-skills/nextjs-integration`

**Reglas clave**:
- Server Components
- Server Actions
- Streaming

### 8. tailwind-styling

**Cuándo apply**: Cuando necesitas estilar componentes.

**Comando**: `npx skills add [owner]/frontend-skills/tailwind-styling`

**Reglas clave**:
- Tokens semánticos
- Componentes compuestos
- Responsive design

### 9. performance-optimization

**Cuándo apply**: Cuando necesitas optimizar performance.

**Comando**: `npx skills add [owner]/frontend-skills/performance-optimization`

**Reglas clave**:
- Code splitting
- Memoización
- Image optimization

---

## Proceso de Spec-Kit

Este repo sigue el flujo:

1. `.specify/memory/constitution.md` → Memoria permanente
2. `spec/project-spec.md` → Requirements
3. Tasks → Ejecución

---

## Referencias

- Constitución: `.specify/memory/constitution.md`
- Spec: `spec/project-spec.md`
- Workflows: `.github/workflows/validate-skills.yml`
