# Securización de la BBDD

RLS está activo en todas las tablas del esquema `public`.

Las funciones `security definer` viven en el esquema `private`.

## profiles

- SELECT: perfiles públicos (`anon` y `authenticated`)
- INSERT / UPDATE: solo el propio usuario (`auth.uid() = id`)
- DELETE: no permitido al cliente

Al registrarse, un trigger crea la fila de perfil.

## venues / fields

- SELECT: público (`anon` y `authenticated`)
- INSERT / UPDATE / DELETE: no permitido al cliente (solo seed/migración)

## matches

- SELECT: público
- INSERT: usuario autenticado y `created_by = auth.uid()`
- UPDATE / DELETE: solo el creador

Al crear un partido, un trigger apunta al creador como participante.

## match_players

- SELECT: público
- INSERT: solo la propia participación, si el partido está `open` y hay plaza
- DELETE: solo la propia fila
- UPDATE: no permitido al cliente

La capacidad F5 = 10 y la unicidad de participación se aplican en Postgres.
