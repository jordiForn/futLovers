# ADR-003: Separar partidos y reservas

## Estado

Aceptada

## Fecha

2026-08-21

## Contexto

FutLovers permitirá tanto organizar partidos como reservar campos.

Una reserva de campo no implica necesariamente que exista un partido
público en FutLovers.

Por ejemplo:

- Un grupo de amigos puede reservar un campo y jugar entre ellos.
- Un usuario puede crear un partido abierto y utilizar una reserva
  asociada.
- Una reserva puede existir antes de que se cree el partido.

## Decisión

Separar conceptualmente las entidades:

- Match
- Booking

Un `Match` representa el partido y sus participantes.

Un `Booking` representa la utilización de un campo durante un periodo
determinado.

Cuando un partido utiliza una reserva de FutLovers, ambas entidades
estarán relacionadas.

## Ejemplo

### Reserva privada

Booking
  ↓
Campo 2
20:00 - 21:00

No existe Match.

### Partido público

Match
  ↓
Booking
  ↓
Campo 2
20:00 - 21:00

Match
  ├── Jugador A
  ├── Jugador B
  ├── Jugador C
  └── ...

## Motivos

Separar ambas entidades permite desarrollar independientemente:

- organización de partidos;
- reservas;
- disponibilidad de campos;
- jugadores;
- monetización de reservas.

## Consecuencias

El modelo de datos será ligeramente más complejo, pero permite una
mayor flexibilidad y evita acoplar la existencia de un partido a una
reserva.

## Evolución futura

Esta separación permitirá integrar posteriormente:

- campos propios;
- instalaciones de terceros;
- reservas online;