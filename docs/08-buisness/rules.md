# Reglas de partidos

## Capacidad

Un partido F5 tiene 10 jugadores. En el MVP esta regla se aplica en base de datos.

## Unirse

Un usuario no puede unirse dos veces al mismo partido.

El creador del partido ocupa una plaza automáticamente.

## Cancelación y no-show (fase 2)

Documentado para no perderlo; **no se implementa en el MVP**:

- Cancelación > 24h: sin penalización
- Cancelación < 2h: penalización leve
- No-show: penalización alta

## Lista de espera (fase 2)

Cuando una plaza queda libre se podría notificar al primer usuario compatible. Fuera del MVP.

## Nivel y fiabilidad

Se muestran en el perfil y en el detalle del partido.

Valores iniciales al registrarse:

- `level`: 5
- `reliability_score`: 100

No hay fórmula de recálculo en el MVP.
