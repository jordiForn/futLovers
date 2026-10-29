# Esquema de la BBDD

## profiles

Perfil público de un usuario de Auth.

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| id | uuid | Sí | `auth.users.id` |
| username | text | Sí | Nombre público |
| avatar_url | text | No | URL del avatar |
| level | numeric | Sí | Nivel inicial 5 |
| reliability_score | numeric | Sí | Fiabilidad inicial 100 |
| created_at | timestamptz | Sí | Fecha de creación |

## venues

Instalación o recinto.

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| id | uuid | Sí | Identificador |
| name | text | Sí | Nombre |
| city | text | Sí | Ciudad |
| address | text | No | Dirección |
| latitude | numeric | No | Latitud |
| longitude | numeric | No | Longitud |
| created_at | timestamptz | Sí | Fecha de creación |

## fields

Campo concreto dentro de un venue.

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| id | uuid | Sí | Identificador |
| venue_id | uuid | Sí | Venue |
| name | text | Sí | Nombre del campo |
| modality | text | Sí | Modalidad (`F5` en el MVP) |
| capacity | integer | Sí | Plazas (10 para F5) |
| created_at | timestamptz | Sí | Fecha de creación |

## matches

Partido organizado en FutLovers.

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| id | uuid | Sí | Identificador |
| created_by | uuid | Sí | Creador (`profiles.id`) |
| field_id | uuid | No | Campo |
| starts_at | timestamptz | Sí | Inicio |
| modality | text | Sí | Modalidad |
| capacity | integer | Sí | Plazas |
| min_level | numeric | No | Nivel mínimo orientativo |
| max_level | numeric | No | Nivel máximo orientativo |
| status | text | Sí | `open`, `cancelled` o `completed` |
| notes | text | No | Notas |
| created_at | timestamptz | Sí | Fecha de creación |

## match_players

Participación de un jugador en un partido.

| Campo | Tipo | Obligatorio | Descripción |
| --- | --- | --- | --- |
| id | uuid | Sí | Identificador |
| match_id | uuid | Sí | Partido |
| player_id | uuid | Sí | Jugador |
| joined_at | timestamptz | Sí | Fecha de unión |

Único por (`match_id`, `player_id`).
