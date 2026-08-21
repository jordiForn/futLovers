# Navigation

## Navegación principal

La navegación del MVP se basa en cuatro áreas:

- Jugar
- Crear
- Reservar
- Perfil

## Ruta principal

| Ruta           | Pantalla        | Autenticación |
| -------------- | --------------- | ------------- |
| `/`            | Partidos        | No            |
| `/login`       | Login           | No            |
| `/register`    | Registro        | No            |
| `/matches/:id` | Detalle partido | No            |
| `/create`      | Crear partido   | Sí            |
| `/bookings`    | Reservar campo  | Sí            |
| `/profile`     | Perfil          | Sí            |

## Flujo principal

Inicio
  ↓
Ubicación
  ↓
Partidos de hoy
  ↓
Detalle
  ↓
Unirse

## Flujo de creación

Crear
  ↓
Fecha
  ↓
Hora
  ↓
Campo
  ↓
Configuración
  ↓
Crear partido

## Flujo de reserva

Reservar
  ↓
Campo
  ↓
Fecha
  ↓
Hora
  ↓
Confirmación