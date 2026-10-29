# Database

PostgreSQL gestionado por Supabase.

Las migraciones versionadas viven en `supabase/migrations/`.

## Documentación

- [Schema](./schema.md)
- [Relationships](./relationships.md)
- [Security](./security.md)

## Entidades del MVP

- Profiles
- Venues
- Fields
- Matches
- Match Players

`bookings` y gestión avanzada de disponibilidad quedan fuera de este tramo.

## Estado remoto

Proyecto: `vahlmshfzumgshhntidy` (eu-north-1).

Durante la auditoría inicial el proyecto estaba hibernado y las consultas SQL/MCP fallaron por autenticación mientras despertaba. El esquema canónico está en `supabase/migrations/20260821100000_init_mvp.sql`.
