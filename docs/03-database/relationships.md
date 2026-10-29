# Relaciones

```text
auth.users 1 ── 1 profiles
profiles 1 ── * matches (created_by)
profiles 1 ── * match_players
venues 1 ── * fields
fields 1 ── * matches
matches 1 ── * match_players
```

- Un perfil pertenece a un usuario de Auth.
- Un venue tiene uno o más fields.
- Un partido puede apuntar a un field.
- Un partido tiene muchos participantes.
- Un usuario no puede aparecer dos veces en el mismo partido.
