# Project Spec — frontend-skills

> Artefacto de Specify (spec-kit) que captura los requirements del repositorio.

---

## Overview

**Nombre del proyecto:** frontend-skills  
**Tipo:** Repositorio de Agent Skills  
**Propósito:** Colección de skills para automatizar la creación de frontends con arquitectura limpia, consistencia de estilos y patrones de fetching estandarizados.  
**Público objetivo:** Agentes de código (Claude Code, Cursor, GitHub Copilot) y desarrolladores humanos que supervisan sesiones de código.

---

## Design

### Estructura de Carpetas

```
frontend-skills/
├── .specify/
│   └── memory/
│       └── constitution.md      # Memoria permanente del proyecto
├── .github/
│   └── workflows/
│       └── validate-skills.yml  # Validación automática
├── skills/
│   ├── api-fetching/
│   │   ├── SKILL.md
│   │   ├── rules/
│   │   │   ├── repository-pattern.md
│   │   │   ├── query-keys.md
│   │   │   └── error-handling.md
│   │   └── templates/
│   │       ├── entity.repository.ts
│   │       └── useEntity.template.ts
│   ├── project-setup/
│   │   └── SKILL.md
│   ├── components/
│   ├── forms/
│   ├── state-management/
│   ├── testing/
│   ├── nextjs-integration/
│   ├── tailwind-styling/
│   └── performance-optimization/
├── spec/
│   └── project-spec.md
├── AGENTS.md
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── .gitignore
```

### Estándares de SKILL.md

Todo skill debe seguir el mismo formato:

```markdown
# Skill: [nombre]

## When to Apply
> 1-2 oraciones sobre cuándo activar

## Quick Reference
> Lista condensada de reglas

## Rules
| Prioridad | Categoría | Impacto | Prefijo | Regla |
|-----------|-----------|---------|---------|-------|

## Detalle por Categoría
> Explicación detallada
```

---

## Requirements (Given/When/Then)

### Req 1: Constitution

**Given** un nuevo agente que entra al repositorio  
**When** lee `.specify/memory/constitution.md`  
**Then** conoce el propósito del repo, los 9 skills disponibles, el stack técnico destino, y las reglas globales

### Req 2: AGENTS.md

**Given** un agente ejecutando una tarea  
**When** busca cómo invocar un skill  
**Then** encuentra en `AGENTS.md` el comando `npx skills add` y la descripción de cada skill

### Req 3: api-fetching

**Given** un proyecto que necesita consumir una API  
**When** se activa el skill `api-fetching`  
**Then** el agente implementa el patrón de tres capas (api → repository → hook), usa query keys tipadas, y nunca usa `useQuery` directamente en componentes

### Req 4: project-setup

**Given** un proyecto nuevo o una nueva feature  
**When** se activa el skill `project-setup`  
**Then** el agente crea la estructura de carpetas por feature, respeta el grafo de dependencias, y genera el `index.ts` como contrato público

### Req 5: Templates

**Given** un desarrollador que necesita un punto de partida  
**When** copia un template de `templates/`  
**Then** obtiene código TypeScript válido y completo (sin pseudocódigo), listo para usar

### Req 6: Validación

**Given** un contributor que envía un PR  
**When** se ejecuta `.github/workflows/validate-skills.yml`  
**Then** se verifica que todo skill tiene SKILL.md con secciones obligatorias y que los archivos referenciados existen

### Req 7: Compatibilidad

**Given** un agente de cualquier plataforma (Claude Code, Cursor, Copilot)  
**When** sigue las instrucciones de un SKILL.md  
**Then** produce código idéntico o equivalente (los skills son agnósticos al agente)

---

## Tasks

### Fase 1: Skills Fundacionales (Completados)

- [x] Task 1: Crear constitution en `.specify/memory/constitution.md`
- [x] Task 2: Crear estructura de carpetas `skills/` con 9 subcarpetas
- [x] Task 3: Escribir `AGENTS.md` con índice de skills
- [x] Task 4: Escribir `SKILL.md` de `api-fetching` (skill crítico)
- [x] Task 5: Crear reglas `repository-pattern.md`, `query-keys.md`, `error-handling.md`
- [x] Task 6: Crear templates `entity.repository.ts`, `useEntity.template.ts`
- [x] Task 7: Escribir `SKILL.md` de `project-setup`

### Fase 2: Skills de Componentes (Pendientes)

- [ ] Task 8: Escribir `SKILL.md` de `components`
- [ ] Task 9: Crear reglas para `components` (composition, slots, variants)
- [ ] Task 10: Crear templates de componentes (Button, Card, Modal)

- [ ] Task 11: Escribir `SKILL.md` de `forms`
- [ ] Task 12: Crear reglas para `forms` (react-hook-form, zod, validation)
- [ ] Task 13: Crear templates de formularios (useForm, FormField)

- [ ] Task 14: Escribir `SKILL.md` de `state-management`
- [ ] Task 15: Crear reglas para `state-management` (zustand, persistence)
- [ ] Task 16: Crear templates de stores

### Fase 3: Skills de Integración (Pendientes)

- [ ] Task 17: Escribir `SKILL.md` de `nextjs-integration`
- [ ] Task 18: Crear reglas para Server Components, Server Actions
- [ ] Task 19: Crear templates para Next.js App Router

- [ ] Task 20: Escribir `SKILL.md` de `tailwind-styling`
- [ ] Task 21: Crear reglas para tokens semánticos, theme config
- [ ] Task 22: Crear templates de configuración Tailwind

- [ ] Task 23: Escribir `SKILL.md` de `performance-optimization`
- [ ] Task 24: Crear reglas para code splitting, memoización
- [ ] Task 25: Crear templates de optimización

### Fase 4: Testing (Pendiente)

- [ ] Task 26: Escribir `SKILL.md` de `testing`
- [ ] Task 27: Crear reglas para estrategia de testing
- [ ] Task 28: Crear templates de tests

---

## Definition of Done

Un skill se considera **completo** cuando tiene:

1. ✅ `SKILL.md` con todas las secciones obligatorias
2. ✅ Al menos 3 reglas en `rules/` con ejemplos incorrecto/correcto
3. ✅ Templates opcionales pero recomendados
4. ✅ Valida contra el workflow `validate-skills.yml`

---

## Referencias

- Constitution: `.specify/memory/constitution.md`
- AGENTS.md: Índice global
- Workflows: `.github/workflows/validate-skills.yml`
