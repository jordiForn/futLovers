# ADR-002: Priorizar jugar sobre reservar

## Estado

Aceptada

## Fecha

2026-08-21

## Contexto

FutLovers tiene dos funcionalidades principales:

1. Encontrar y participar en partidos.
2. Reservar campos.

El objetivo inicial de FutLovers es crear una comunidad de jugadores,
no convertirse inicialmente en una simple plataforma de reserva de campos.

El principal problema que se pretende solucionar es:

> "Quiero jugar al fútbol pero no tengo suficientes jugadores / equipo
> con el que jugar."

## Decisión

La pantalla principal de FutLovers será "Jugar".

Al acceder a la aplicación, el usuario verá directamente los partidos
disponibles para la fecha actual y su ubicación.

La reserva de campos será una funcionalidad secundaria accesible desde
la navegación principal.

## Flujo principal

Usuario
  ↓
Ubicación
  ↓
Partidos de hoy
  ↓
Seleccionar partido
  ↓
Unirse
  ↓
Jugar

## Flujo secundario

Usuario
  ↓
Reservar
  ↓
Seleccionar campo
  ↓
Seleccionar horario
  ↓
Reservar

## Motivo

Priorizar "Jugar" permite que FutLovers construya comunidad rápidamente
a la vez que los usuarios entienden que se prioriza solventar el problema
de faltar gente.

## Consecuencias

### Positivas

- Favorece la creación de comunidad.
- Facilita el crecimiento basado en partidos.

### Negativa

- Será necesario resolver problemas de cancelaciones y no-show.
