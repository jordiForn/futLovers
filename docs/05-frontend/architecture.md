# Arquitectura Frontend

El frontend usa Angular organizado por funcionalidades.

```text
src/app/
├── core/
│   ├── auth/
│   ├── supabase/
│   ├── guards/
│   └── location/
├── shared/
│   └── layout/
└── features/
    ├── auth/
    ├── matches/
    └── profile/
```

## Core

Cliente Supabase, autenticación, guards y ubicación.

## Shared

Layout y piezas reutilizables mínimas.

## Features

Pantallas de auth, partidos y perfil. Las consultas a Supabase viven en servicios, no en componentes de presentación.
