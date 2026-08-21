# Esquema de la BBDD

## profiles

Representa el perfil público de un usuario.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| id | uuid | Sí | ID del usuario de Supabase Auth |
| username | text | Sí | Nombre público |
| avatar_url | text | No | URL del avatar |
| level | numeric | Sí | Nivel actual |
| reliability_score | numeric | Sí | Fiabilidad del jugador |
| created_at | timestamptz | Sí | Fecha de creación |

### Relaciones

- `id` → `auth.users.id`
- Tiene muchos `matches` creados.
- Tiene muchas participaciones en `match_players`.