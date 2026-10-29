# Arquitectura actual

## Visión general

```text
Angular
  │
  │ Supabase SDK
  ▼
Supabase
├── Auth
├── PostgreSQL
├── RLS
├── Storage (cuando haga falta)
└── Realtime (cuando haga falta)
```

El MVP no tiene API backend propia. La carpeta `api/` (NestJS) se deja sin usar.

## Entidades del MVP

- `profiles`
- `venues`
- `fields`
- `matches`
- `match_players`

`bookings` queda fuera del MVP, aunque el modelo conceptual las separa de los partidos (ADR-003).

## Deployment

- Frontend: Git → Vercel
- Backend: proyecto Supabase gestionado aparte

## Ramas

- `main`: producción
- `develop`: integración
- `frontend` / `backend`: ramas históricas de scaffolding

## Principios

- Simplicidad durante el MVP
- Priorizar el flujo Jugar
- No acoplar un partido a una reserva
