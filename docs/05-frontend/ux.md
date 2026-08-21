# UX

## Principio principal

FutLovers prioriza la acción "Jugar" frente a "Reservar".

El usuario debe poder acceder a partidos disponibles con el menor
número posible de pasos.

## Pantalla inicial

Al entrar:

1. Se determina la ubicación.
2. Se muestra la ubicación seleccionada.
3. Se muestran los partidos del día.
4. El usuario puede unirse directamente.

## Ubicación

La aplicación utilizará la geolocalización del dispositivo cuando
el usuario lo permita.

Si el usuario no proporciona ubicación:

- se utilizará Dénia como ubicación inicial del MVP;
- el usuario podrá cambiarla manualmente.

## Partidos

Cada partido mostrará:

- hora;
- modalidad;
- campo;
- distancia;
- jugadores actuales;
- plazas disponibles;
- nivel;
- estado.

Ejemplo:

```text
20:00 · Fútbol 5

Campo Municipal
8/10 jugadores
Nivel 4-6

[ UNIRME ]
```

## Estados visuales

Los partidos podrán mostrarse como:

Disponible
Pocas plazas
Completo
Tu partido
Cancelado

El color no será el único indicador del estado.

## Empty states

Nunca se mostrará una pantalla vacía sin acción.

Si no existen partidos:
```text
No hay partidos cerca de ti hoy.


[ CREAR PARTIDO ]
```