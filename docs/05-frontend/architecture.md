# Arquitectura Frontend 

El frontend utiliza Angular y está organizado por funcionalidades
(feature-based architecture).

src/app/
├── core/
│   ├── auth/
│   ├── supabase/
│   ├── guards/
│   └── services/
│
├── shared/
│   ├── components/
│   ├── pipes/
│   └── directives/
│
└── features/
    ├── auth/
    ├── matches/
    ├── profile/
    ├── bookings/
    └── location/

## Core

Contiene funcionalidades globales de la aplicación.

Ejemplos:

autenticación;
cliente Supabase;
guards;
configuración;
servicios globales.

## Shared

Contiene componentes reutilizables que no pertenecen a una
funcionalidad específica.

Ejemplos:

Button;
Modal;
Loading;
Avatar;
Empty State;
Header.
Features

Cada funcionalidad importante tiene su propio módulo/directorio.