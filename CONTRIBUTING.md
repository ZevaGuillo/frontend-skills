# Contributing to frontend-skills

## Proceso para Agregar un Nuevo Skill

### 1. Pre-requisitos

- Lee `.specify/memory/constitution.md` completamente
- Entiende el formato SKILL.md requerido
- Revisa skills existentes como referencia

### 2. Estructura del Skill

```
skills/[nombre-del-skill]/
├── SKILL.md           # Obligatorio
├── rules/             # Al menos 3 reglas
│   ├── rule-1.md
│   ├── rule-2.md
│   └── rule-3.md
└── templates/         # Opcional: ejemplos TypeScript
    └── template.ts
```

### 3. SKILL.md Formato

```markdown
# Skill: [nombre]

## When to Apply
> 1-2 oraciones sobre cuándo usar este skill

## Quick Reference
> Lista de reglas en formato condensado

## Rules
| Prioridad | Categoría | Impacto | Prefijo | Regla |
|-----------|-----------|---------|---------|-------|
| ... | ... | ... | ... | ... |

## Detalle por Categoría
> Explicación detallada de cada categoría
```

### 4. Formato de Reglas

Cada archivo en `rules/` debe incluir:

- **Por qué importa** esta regla
- **Ejemplo incorrecto** marcado con `// ❌`
- **Ejemplo correcto** marcado con `// ✅`
- **Casos edge** o excepciones válidas

### 5. Validación

Antes de enviar un PR:

1. Verifica que el SKILL.md tenga todas las secciones obligatorias
2. Asegura que todas las reglas referenciadas existan en `rules/`
3. Los templates deben ser TypeScript válido y completo

### 6. Pull Request

- Crear branch: `feature/[nombre-del-skill]`
- Incluir descripción del skill y casos de uso
- Verificar que passe el workflow `validate-skills.yml`

---

## Guidelines de Código

- Usa prefijos consistentes: `[PATTERN]`, `[MUST]`, `[NEVER]`, `[AVOID]`, `[PREFERRED]`, `[OPTIONAL]`
- Mantén los ejemplos simples pero realistas
- Evita explicaciones largas — sé conciso
- Prioriza tablas para reglas (más fácil de escanear)

---

## Comunidad

- Issues para bugs o sugerencias
- Discutir nuevos skills antes de implementar
- Respetar las convenciones de naming de la constitution
