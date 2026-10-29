# FutLovers

Plataforma para encontrar, organizar y jugar partidos de fútbol amateur.

## Objetivo

Crear comunidad de fútbol amateur empezando en Dénia / Costa Blanca.

La pregunta principal de la aplicación es: **¿dónde puedo jugar al fútbol hoy?**

## MVP

- Registro e inicio de sesión
- Perfil básico (nivel y fiabilidad mostrados, sin fórmulas avanzadas)
- Ubicación (geolocalización con fallback a Dénia)
- Ver partidos de hoy
- Ver detalle y participantes
- Crear un partido
- Unirse y abandonar un partido
- Campos (`venues` / `fields`) como dato del partido

Fuera del MVP: reservas, pagos, waitlist, notificaciones y penalizaciones.

## Stack

- Frontend: Angular + TypeScript
- Backend: Supabase (Auth, PostgreSQL, RLS)
- Despliegue previsto: Vercel (frontend)

No hay API propia en el MVP. La carpeta `api/` (NestJS) existe pero **no se usa**.

## Estructura

```text
futLovers/
├── frontend/     Angular
├── api/          NestJS (sin uso en el MVP)
├── supabase/     Migraciones y configuración
├── docs/
├── README.md
└── CHANGELOG.md
```
