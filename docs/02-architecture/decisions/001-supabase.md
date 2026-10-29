# ADR-001: Supabase como backend inicial

## Estado

Aceptada

## Fecha

2026-08-21

## Contexto

FutLovers necesita una infraestructura backend para el MVP que permita
gestionar usuarios, autenticación, partidos, jugadores y campos.

El objetivo actual es lanzar el MVP rápidamente y validar el producto
antes de desarrollar una infraestructura backend propia.

## Decisión

Utilizar Supabase como backend inicial de FutLovers.

Se utilizarán inicialmente:

- Supabase Auth para autenticación.
- PostgreSQL para persistencia de datos.
- Row Level Security (RLS) para autorización a nivel de datos.
- Supabase Storage para archivos e imágenes.
- Supabase Realtime cuando sea necesario.
- Edge Functions para lógica de servidor que lo requiera.

## Arquitectura inicial

Frontend Angular
        ↓
Supabase
├── Auth
├── PostgreSQL
├── Storage
├── RLS
└── Realtime

## Motivos

- Permite desarrollar el MVP rápidamente.
- Reduce la cantidad de backend que debe desarrollarse y mantenerse.
- PostgreSQL proporciona una base de datos relacional adecuada para el
  dominio de FutLovers.
- Permite incorporar lógica backend adicional posteriormente.
- Reduce la infraestructura inicial necesaria.

## Consecuencias

### Positivas

- Desarrollo más rápido.
- Menor cantidad de código backend propio.
- Autenticación y base de datos disponibles desde el principio.
- Buena integración con aplicaciones web y móviles.

### Negativas

- Parte de la arquitectura depende de Supabase.
- Algunas decisiones de seguridad deben realizarse mediante RLS.
- Si el proyecto crece mucho, puede ser necesario introducir un backend
  propio.

## Evolución futura

Si la complejidad de la lógica de negocio lo requiere, se podrá introducir
un backend TypeScript independiente sin abandonar necesariamente Supabase
como proveedor de PostgreSQL y otros servicios.

## Alternativas consideradas

### Backend propio desde el principio

Descartado para el MVP debido al coste de desarrollo y mantenimiento.

### Railway + backend TypeScript

No se utilizará inicialmente. Podrá incorporarse posteriormente si existe
una necesidad real de ejecutar una capa backend propia.