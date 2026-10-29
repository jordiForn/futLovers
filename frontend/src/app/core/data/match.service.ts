import { Injectable } from '@angular/core';
import { Field, Match, MatchStatus, Profile, Venue } from '../supabase/database.types';
import { supabase } from '../supabase/supabase.client';

export interface MatchCard {
  match: Match;
  field: Field | null;
  venue: Venue | null;
  playerCount: number;
}

export interface MatchPlayerView {
  playerId: string;
  username: string;
  level: number;
  reliabilityScore: number;
}

export interface MatchDetail extends MatchCard {
  players: MatchPlayerView[];
}

@Injectable({ providedIn: 'root' })
export class MatchService {
  async listForDay(city: string, day: Date): Promise<MatchCard[]> {
    const { start, end } = dayRange(day);
    const { data, error } = await supabase
      .from('matches')
      .select('*, fields(*, venues(*)), match_players(id)')
      .gte('starts_at', start.toISOString())
      .lt('starts_at', end.toISOString())
      .order('starts_at');

    if (error) {
      throw error;
    }

    const cityName = city.trim().toLocaleLowerCase('es');
    return (data ?? [])
      .map((row) => toMatchCard(row))
      .filter((card) => (card.venue?.city ?? '').trim().toLocaleLowerCase('es') === cityName);
  }

  async getById(id: string): Promise<MatchDetail | null> {
    const { data, error } = await supabase
      .from('matches')
      .select('*, fields(*, venues(*)), match_players(player_id, profiles(*))')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }

    const card = toMatchCard(data);
    const players = (data.match_players ?? [])
      .map((row) => {
        const profile = unwrapProfile(
          (row as { profiles: Profile | Profile[] | null }).profiles,
        );
        if (profile === null) {
          return null;
        }
        return {
          playerId: profile.id,
          username: profile.username,
          level: Number(profile.level),
          reliabilityScore: Number(profile.reliability_score),
        };
      })
      .filter((item): item is MatchPlayerView => item !== null);

    return { ...card, players };
  }

  async create(input: {
    createdBy: string;
    fieldId: string;
    startsAt: string;
    minLevel: number | null;
    maxLevel: number | null;
    notes: string | null;
  }): Promise<{ id: string | null; error: string | null }> {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        created_by: input.createdBy,
        field_id: input.fieldId,
        starts_at: input.startsAt,
        modality: 'F5',
        capacity: 10,
        min_level: input.minLevel,
        max_level: input.maxLevel,
        notes: input.notes,
        status: 'open',
      })
      .select('id')
      .single();

    return { id: data?.id ?? null, error: error?.message ?? null };
  }

  async join(matchId: string, playerId: string): Promise<string | null> {
    const { error } = await supabase.from('match_players').insert({
      match_id: matchId,
      player_id: playerId,
    });
    return mapJoinError(error?.message ?? null);
  }

  async leave(matchId: string, playerId: string): Promise<string | null> {
    const { error } = await supabase
      .from('match_players')
      .delete()
      .eq('match_id', matchId)
      .eq('player_id', playerId);
    return error?.message ?? null;
  }

  async cancel(matchId: string): Promise<string | null> {
    const { error } = await supabase
      .from('matches')
      .update({ status: 'cancelled' })
      .eq('id', matchId);
    return error?.message ?? null;
  }
}

function dayRange(day: Date): { start: Date; end: Date } {
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function toMatchCard(row: {
  id: string;
  created_by: string;
  field_id: string | null;
  starts_at: string;
  modality: string;
  capacity: number;
  min_level: number | null;
  max_level: number | null;
  status: MatchStatus;
  notes: string | null;
  created_at: string;
  fields: unknown;
  match_players: { id?: string; player_id?: string }[] | null;
}): MatchCard {
  const fieldRow = unwrapField(row.fields);
  return {
    match: {
      id: row.id,
      created_by: row.created_by,
      field_id: row.field_id,
      starts_at: row.starts_at,
      modality: row.modality,
      capacity: Number(row.capacity),
      min_level: row.min_level === null ? null : Number(row.min_level),
      max_level: row.max_level === null ? null : Number(row.max_level),
      status: row.status,
      notes: row.notes,
      created_at: row.created_at,
    },
    field: fieldRow
      ? {
          id: fieldRow.id,
          venue_id: fieldRow.venue_id,
          name: fieldRow.name,
          modality: fieldRow.modality,
          capacity: Number(fieldRow.capacity),
          created_at: fieldRow.created_at,
        }
      : null,
    venue: fieldRow ? unwrapVenue(fieldRow.venues) : null,
    playerCount: row.match_players?.length ?? 0,
  };
}

function unwrapField(
  value: unknown,
): (Field & { venues: Venue | Venue[] | null }) | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return (value[0] as (Field & { venues: Venue | Venue[] | null }) | undefined) ?? null;
  }
  return value as Field & { venues: Venue | Venue[] | null };
}

function unwrapVenue(value: Venue | Venue[] | null | undefined): Venue | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value;
}

function unwrapProfile(value: Profile | Profile[] | null | undefined): Profile | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value;
}

function mapJoinError(message: string | null): string | null {
  if (message === null) {
    return null;
  }
  if (message.includes('match_full')) {
    return 'Este partido está completo.';
  }
  if (message.includes('match_not_open')) {
    return 'Este partido no admite más jugadores.';
  }
  if (message.includes('match_players_unique') || message.includes('duplicate')) {
    return 'Ya estás apuntado a este partido.';
  }
  return message;
}
