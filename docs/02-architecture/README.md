# Arquitectura actual

## Visión general


Angular
   │
   │ Supabase SDK
   ▼
Supabase
├── Auth
├── PostgreSQL
├── Storage
├── RLS
└── Realtime

Frontend

Angular
TypeScript

Backend

El MVP utiliza Supabase como Backend-as-a-Service.

No existe actualmente una API backend propia.

Base de datos

PostgreSQL mediante Supabase.

Entidades previstas:

profiles
venues
fields
matches
match_players
bookings
Deployment

Frontend:

Git → main → Vercel

Backend:

Supabase gestionado independientemente del despliegue del frontend.

Repositorios / ramas

main
└── Producción

develop
└── Integración

front
└── Desarrollo frontend

back
└── Desarrollo backend / Supabase

Principios
Priorizar simplicidad durante el MVP.
Evitar sobrearquitectura.
Mantener el modelo de datos preparado para expansión.
Separar partidos de reservas.
La funcionalidad principal es encontrar y jugar partidos.