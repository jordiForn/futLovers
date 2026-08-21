# Securización de la BBDD

FutLovers utiliza Row Level Security (RLS) de Supabase.

## profiles

### SELECT
Los perfiles públicos pueden ser consultados por usuarios.

### INSERT
Un usuario solo puede crear su propio perfil.

### UPDATE
Un usuario solo puede modificar su propio perfil.

---

## matches

### SELECT
Los partidos abiertos son visibles para los usuarios.

### INSERT
Solo usuarios autenticados.

### UPDATE
Solo el creador del partido.

### DELETE
Solo el creador del partido.

---

## match_players

### SELECT
Los participantes de los partidos son visibles.

### INSERT
Un usuario autenticado puede unirse a un partido si cumple las
condiciones correspondientes.

### DELETE
Un usuario puede abandonar sus propias participaciones.